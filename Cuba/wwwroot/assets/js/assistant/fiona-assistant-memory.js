(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.FionaAssistantMemory = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const memoryDomains = {
    organization: 'Organization',
    rasci: 'RASCI',
    jobdesc: 'Job description',
    competency: 'Competency'
  };

  let memoryItems = [];
  let memoryLoading = false;
  let memorySaving = false;
  let memoryDeleting = false;
  let editingMemory = null;
  let memoryEditorLastFocus = null;
  let memoryLoadVersion = 0;
  let memoryAccountKey = '';
  let deps = {};

  function memoryContract() {
    return deps.memoryContract || window.FionaMemoryContract;
  }

  function memoryDomainLabel(domain) {
    const value = String(domain || '').trim();
    return memoryDomains[value.toLowerCase()] || value || 'Domain/source';
  }

  function memoryScopeLabel(memory) {
    if (String(memory.scopeKind || '').toLowerCase() === 'user') return 'Global';
    return `${memoryDomainLabel(memory.domain)} · ${String(memory.scopeKey || 'Source')}`;
  }

  function memoryUpdatedLabel(value) {
    if (!value) return 'Last updated: Unknown';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Last updated: Unknown';
    try {
      return 'Last updated: ' + new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(date);
    } catch (_) {
      return 'Last updated: ' + date.toLocaleString();
    }
  }

  function makeMemoryBadge(text, className) {
    const badge = document.createElement('span');
    badge.className = 'fiona-ai-memory-badge ' + className;
    badge.textContent = text;
    return badge;
  }

  function makeMemoryCard(memory) {
    const card = document.createElement('article');
    card.className = 'fiona-ai-memory-card';
    card.dataset.memoryId = String(memory.id || '');

    const fact = document.createElement('p');
    fact.className = 'fiona-ai-memory-fact';
    fact.textContent = String(memory.fact || '');
    card.appendChild(fact);

    const badges = document.createElement('div');
    badges.className = 'fiona-ai-memory-badges';
    badges.appendChild(makeMemoryBadge(memoryScopeLabel(memory), 'scope'));
    const needsReview = String(memory.reviewState || '').toLowerCase() === 'needs_review';
    badges.appendChild(makeMemoryBadge(needsReview ? 'Needs review' : 'Active', needsReview ? 'review' : 'active'));
    const confidence = Math.max(0, Math.min(100, Math.round(Number(memory.confidence || 0) * 100)));
    badges.appendChild(makeMemoryBadge(`${confidence}% confidence`, 'confidence'));
    badges.appendChild(makeMemoryBadge(memory.isExplicit ? 'Created by you' : 'Learned from conversation', 'origin'));
    card.appendChild(badges);

    const footer = document.createElement('div');
    footer.className = 'fiona-ai-memory-card-footer';
    const updated = document.createElement('small');
    updated.textContent = memoryUpdatedLabel(memory.updatedAt);
    footer.appendChild(updated);

    if (memory.sourceConversationId) {
      const source = document.createElement('a');
      source.className = 'fiona-ai-memory-source';
      source.textContent = 'Open source conversation';
      source.href = '/Rasci/Index?conversationId=' + encodeURIComponent(String(memory.sourceConversationId));
      source.setAttribute('aria-label', 'Open source conversation');
      footer.appendChild(source);
    }
    card.appendChild(footer);

    const actions = document.createElement('div');
    actions.className = 'fiona-ai-memory-actions';
    const edit = document.createElement('button');
    edit.type = 'button';
    edit.className = 'fiona-ai-memory-action';
    edit.dataset.action = 'edit';
    edit.textContent = 'Edit';
    edit.setAttribute('aria-label', 'Edit memory');
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'fiona-ai-memory-action danger';
    remove.dataset.action = 'delete';
    remove.textContent = 'Delete';
    remove.setAttribute('aria-label', 'Delete memory');
    actions.append(edit, remove);
    card.appendChild(actions);
    return card;
  }

  function setMemoryStatus(message, options = {}) {
    const { memoryStatus } = deps;
    if (!memoryStatus) return;
    memoryStatus.replaceChildren();
    memoryStatus.classList.toggle('is-error', Boolean(options.error));
    memoryStatus.hidden = !message;
    if (!message) return;
    const text = document.createElement('span');
    text.textContent = message;
    memoryStatus.appendChild(text);
    if (typeof options.retry === 'function') {
      const retry = document.createElement('button');
      retry.type = 'button';
      retry.className = 'fiona-ai-memory-retry';
      retry.textContent = 'Try again';
      retry.addEventListener('click', options.retry);
      memoryStatus.appendChild(retry);
    }
  }

  function renderMemoryList() {
    const { memorySearch, memoryScope, memoryList, memoryEmpty } = deps;
    if (!memoryList) return;
    const search = String(memorySearch?.value || '').trim().toLowerCase();
    const scope = memoryScope?.value || '';
    const filtered = memoryItems.filter(memory => {
      const matchesSearch = !search || String(memory.fact || '').toLowerCase().includes(search);
      const matchesScope = !scope || String(memory.scopeKind || '').toLowerCase() === scope;
      return matchesSearch && matchesScope;
    });
    memoryList.replaceChildren(...filtered.map(makeMemoryCard));
    memoryList.setAttribute('aria-busy', memoryLoading ? 'true' : 'false');
    if (memoryEmpty) {
      memoryEmpty.hidden = memoryLoading || filtered.length > 0;
      if (!memoryLoading && memoryItems.length && !filtered.length) {
        const strong = memoryEmpty.querySelector('strong');
        const p = memoryEmpty.querySelector('p');
        if (strong) strong.textContent = 'No matching memories';
        if (p) p.textContent = 'Try a different search or scope filter.';
      } else {
        const strong = memoryEmpty.querySelector('strong');
        const p = memoryEmpty.querySelector('p');
        if (strong) strong.textContent = 'No memories saved yet';
        if (p) p.textContent = 'Fiona has not saved any memories for you. Add a global preference or a memory for a specific domain.';
      }
    }
  }

  function clearMemoryState() {
    memoryItems = [];
    deps.memoryList?.replaceChildren();
    renderMemoryList();
  }

  function syncMemoryAccount() {
    const current = localStorage.getItem('userId') || localStorage.getItem('token') || '';
    if (memoryAccountKey && current !== memoryAccountKey) {
      clearMemoryState();
      if (typeof deps.onAccountChanged === 'function') deps.onAccountChanged();
    }
    memoryAccountKey = current;
  }

  async function loadMemories() {
    const { memoryRefresh, memoryList, memoryDomain, requestJson } = deps;
    if (memoryLoading) return;
    syncMemoryAccount();
    memoryLoading = true;
    const version = ++memoryLoadVersion;
    if (memoryRefresh) memoryRefresh.disabled = true;
    if (memoryList) memoryList.setAttribute('aria-busy', 'true');
    if (!memoryItems.length) setMemoryStatus('Loading your memories…');
    else setMemoryStatus('Refreshing memories…');
    renderMemoryList();
    const query = new URLSearchParams({ domain: memoryDomain?.value || '', scopeKey: '' });
    try {
      const { data } = await requestJson('/api/agent/memories' + (query.toString() ? '?' + query : ''), { method: 'GET' });
      if (version !== memoryLoadVersion) return;
      memoryItems = Array.isArray(data) ? data : [];
      renderMemoryList();
      setMemoryStatus('');
    } catch (error) {
      if (error.status === 404) {
        memoryItems = [];
        renderMemoryList();
        setMemoryStatus('No memories are available for this account.');
      } else if (error.status !== 401) {
        renderMemoryList();
        setMemoryStatus(memoryItems.length ? 'We could not refresh your memories.' : error.message, { error: true, retry: loadMemories });
      }
    } finally {
      memoryLoading = false;
      if (memoryRefresh) memoryRefresh.disabled = false;
      renderMemoryList();
    }
  }

  function selectedMemoryScope() {
    const { memoryForm } = deps;
    return memoryForm?.querySelector('input[name="scopeKind"]:checked')?.value || 'user';
  }

  function updateMemoryFormScope() {
    const { memorySourceFields } = deps;
    if (memorySourceFields) {
      memorySourceFields.hidden = selectedMemoryScope() !== 'source';
    }
  }

  function showMemoryFormError(message, retry) {
    const { memoryFormError } = deps;
    if (!memoryFormError) return;
    memoryFormError.replaceChildren();
    memoryFormError.hidden = !message;
    if (!message) return;
    const text = document.createElement('span');
    text.textContent = message;
    memoryFormError.appendChild(text);
    if (typeof retry === 'function') {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'fiona-ai-memory-retry';
      button.textContent = 'Try again';
      button.addEventListener('click', retry);
      memoryFormError.appendChild(button);
    }
  }

  function openMemoryEditor(memory) {
    const {
      memoryEditorTitle, memoryFact, memoryFormDomain, memoryScopeKey,
      memoryConfidence, memoryReviewState, memoryForm, memoryConfidenceField,
      memoryReviewStateField, memoryEditor
    } = deps;

    editingMemory = memory || null;
    memoryEditorLastFocus = document.activeElement;
    if (memoryEditorTitle) memoryEditorTitle.textContent = memory ? 'Edit memory' : 'Add memory';
    if (memoryFact) memoryFact.value = memory?.fact || '';
    if (memoryFormDomain) memoryFormDomain.value = memory?.domain || '';
    if (memoryScopeKey) memoryScopeKey.value = memory && memory.scopeKind === 'source' ? memory.scopeKey || '' : '';
    if (memoryConfidence) memoryConfidence.value = memory ? Math.round(Number(memory.confidence || 0) * 100) : '';
    if (memoryReviewState) memoryReviewState.value = memory?.reviewState === 'needs_review' ? 'needs_review' : 'active';
    if (memoryForm) {
      memoryForm.querySelectorAll('input[name="scopeKind"]').forEach(radio => {
        radio.checked = (memory?.scopeKind || 'user') === radio.value;
      });
    }
    if (memoryConfidenceField) memoryConfidenceField.hidden = !memory;
    if (memoryReviewStateField) memoryReviewStateField.hidden = !memory;
    showMemoryFormError('');
    updateMemoryFormScope();
    if (memoryEditor) {
      memoryEditor.hidden = false;
      if (typeof memoryEditor.showModal === 'function') memoryEditor.showModal();
      else memoryEditor.hidden = false;
    }
    window.setTimeout(() => memoryFact?.focus(), 0);
  }

  function closeMemoryEditor() {
    const { memoryEditor, memoryForm, memoryConfidenceField, memoryReviewStateField } = deps;
    if (!memoryEditor) return;
    if (typeof memoryEditor.close === 'function' && memoryEditor.open) memoryEditor.close();
    memoryEditor.hidden = true;
    editingMemory = null;
    if (memoryForm) memoryForm.reset();
    if (memoryConfidenceField) memoryConfidenceField.hidden = true;
    if (memoryReviewStateField) memoryReviewStateField.hidden = true;
    showMemoryFormError('');
    updateMemoryFormScope();
    if (memoryEditorLastFocus && typeof memoryEditorLastFocus.focus === 'function') memoryEditorLastFocus.focus();
    memoryEditorLastFocus = null;
  }

  function validateMemoryForm() {
    const { memoryFact, memoryFormDomain, memoryScopeKey, memoryConfidence, memoryReviewState } = deps;
    const scopeKind = selectedMemoryScope();
    const contract = memoryContract();
    if (!contract || typeof contract.validateMemoryDraft !== 'function') {
      return { error: 'Memory contract is not available.' };
    }
    return contract.validateMemoryDraft({
      fact: memoryFact?.value || '',
      scopeKind,
      domain: memoryFormDomain?.value || '',
      scopeKey: memoryScopeKey?.value || '',
      confidence: memoryConfidence?.value || '',
      reviewState: memoryReviewState?.value || ''
    }, editingMemory);
  }

  function setMemoryFormBusy(value) {
    const { memorySave, memoryCancel, memoryCancelSecondary, memoryForm } = deps;
    memorySaving = value;
    if (memorySave) {
      memorySave.disabled = value;
      memorySave.textContent = value ? 'Saving…' : 'Save memory';
    }
    if (memoryCancel) memoryCancel.disabled = value;
    if (memoryCancelSecondary) memoryCancelSecondary.disabled = value;
    if (memoryForm) {
      memoryForm.querySelectorAll('input, textarea, select').forEach(field => { field.disabled = value; });
    }
  }

  async function saveMemory(event) {
    event?.preventDefault();
    if (memorySaving) return;
    const formValue = validateMemoryForm();
    if (formValue.error) {
      showMemoryFormError(formValue.error);
      return;
    }
    const isEdit = Boolean(editingMemory);
    const contract = memoryContract();
    let body;
    let path = '/api/agent/memories';
    let method = 'POST';
    if (!isEdit) {
      body = contract.buildCreateMemoryPayload(formValue);
    } else {
      body = contract.buildMemoryPatch(formValue, editingMemory);
      if (!Object.keys(body).length) {
        showMemoryFormError('No changes to save.');
        return;
      }
      path += '/' + encodeURIComponent(String(editingMemory.id));
      method = 'PATCH';
    }
    setMemoryFormBusy(true);
    showMemoryFormError('');
    try {
      await deps.requestJson(path, { method, body: JSON.stringify(body) });
      closeMemoryEditor();
      await loadMemories();
      setMemoryStatus(isEdit ? 'Memory updated.' : 'Memory saved.');
    } catch (error) {
      if (error.status === 404) {
        if (isEdit) memoryItems = memoryItems.filter(memory => memory.id !== editingMemory.id);
        renderMemoryList();
        closeMemoryEditor();
        setMemoryStatus('This memory is no longer available.', { error: false });
      } else if (error.status !== 401) {
        showMemoryFormError(error.message, saveMemory);
        setMemoryStatus('We could not save this memory.', { error: true });
      }
    } finally {
      setMemoryFormBusy(false);
    }
  }

  async function deleteMemory(memory, button) {
    if (memoryDeleting) return;
    if (!window.confirm('Delete this memory? This cannot be undone.')) return;
    memoryDeleting = true;
    if (button) button.disabled = true;
    setMemoryStatus('Deleting memory…');
    try {
      await deps.requestJson('/api/agent/memories/' + encodeURIComponent(String(memory.id)), { method: 'DELETE' });
      await loadMemories();
      setMemoryStatus('Memory deleted.');
    } catch (error) {
      if (error.status === 404) {
        memoryItems = memoryItems.filter(item => item.id !== memory.id);
        renderMemoryList();
        setMemoryStatus('This memory was already deleted or is no longer available.');
      } else if (error.status !== 401) {
        setMemoryStatus(error.status >= 500 || error.status === 0 ? 'We could not delete this memory.' : error.message, { error: true, retry: () => deleteMemory(memory, button) });
      }
    } finally {
      memoryDeleting = false;
      if (button) button.disabled = false;
    }
  }

  function init(options) {
    deps = options || {};
    memoryAccountKey = localStorage.getItem('userId') || localStorage.getItem('token') || '';
    const {
      memoryList, memorySearch, memoryScope, memoryDomain, memoryRefresh,
      memoryAdd, memoryForm, memoryCancel, memoryCancelSecondary, memoryEditor
    } = deps;

    memoryList?.addEventListener('click', event => {
      const action = event.target.closest?.('[data-action]');
      if (!action) return;
      const card = action.closest('.fiona-ai-memory-card');
      const memory = memoryItems.find(item => String(item.id) === card?.dataset.memoryId);
      if (!memory) return;
      if (action.dataset.action === 'edit') openMemoryEditor(memory);
      if (action.dataset.action === 'delete') deleteMemory(memory, action);
    });

    memorySearch?.addEventListener('input', renderMemoryList);
    memoryScope?.addEventListener('change', renderMemoryList);
    memoryDomain?.addEventListener('change', loadMemories);
    memoryRefresh?.addEventListener('click', loadMemories);
    memoryAdd?.addEventListener('click', () => openMemoryEditor(null));
    memoryForm?.querySelectorAll('input[name="scopeKind"]').forEach(radio => radio.addEventListener('change', updateMemoryFormScope));
    memoryForm?.addEventListener('submit', saveMemory);
    memoryCancel?.addEventListener('click', closeMemoryEditor);
    memoryCancelSecondary?.addEventListener('click', closeMemoryEditor);
    memoryEditor?.addEventListener('cancel', event => { event.preventDefault(); closeMemoryEditor(); });
    updateMemoryFormScope();
  }

  return {
    init,
    memoryDomains,
    memoryDomainLabel,
    memoryScopeLabel,
    memoryUpdatedLabel,
    makeMemoryBadge,
    makeMemoryCard,
    renderMemoryList,
    loadMemories,
    selectedMemoryScope,
    updateMemoryFormScope,
    showMemoryFormError,
    openMemoryEditor,
    closeMemoryEditor,
    validateMemoryForm,
    setMemoryFormBusy,
    saveMemory,
    deleteMemory,
    clearMemoryState,
    syncMemoryAccount,
    getMemoryItems: () => [...memoryItems],
    setMemoryItems: (items) => { memoryItems = Array.isArray(items) ? [...items] : []; }
  };
});
