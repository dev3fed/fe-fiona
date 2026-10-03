(function () {
  const panel = document.getElementById('fionaAiPanel');
  if (!panel) return;

  const launcher = document.getElementById('fionaAiLauncher');
  const close = document.getElementById('fionaAiClose');
  const backdrop = document.getElementById('fionaAiBackdrop');
  const form = document.getElementById('fionaAiForm');
  const input = document.getElementById('fionaAiInput');
  const send = document.getElementById('fionaAiSend');
  const messages = document.getElementById('fionaAiMessages');
  const status = document.getElementById('fionaAiStatus');
  const cacheStatus = document.getElementById('fionaAiCacheStatus');
  const unavailable = document.getElementById('fionaAiUnavailable');
  const newChat = document.getElementById('fionaAiNew');
  const memoriesButton = document.getElementById('fionaAiMemories');
  const memoryPanel = document.getElementById('fionaAiMemoryPanel');
  const memoryBack = document.getElementById('fionaAiMemoryBack');
  const memoryRefresh = document.getElementById('fionaAiMemoryRefresh');
  const memorySearch = document.getElementById('fionaAiMemorySearch');
  const memoryScope = document.getElementById('fionaAiMemoryScope');
  const memoryDomain = document.getElementById('fionaAiMemoryDomain');
  const memoryStatus = document.getElementById('fionaAiMemoryStatus');
  const memoryList = document.getElementById('fionaAiMemoryList');
  const memoryEmpty = document.getElementById('fionaAiMemoryEmpty');
  const memoryAdd = document.getElementById('fionaAiMemoryAdd');
  const memoryEditor = document.getElementById('fionaAiMemoryEditor');
  const memoryForm = document.getElementById('fionaAiMemoryForm');
  const memoryEditorTitle = document.getElementById('fionaAiMemoryEditorTitle');
  const memoryFormError = document.getElementById('fionaAiMemoryFormError');
  const memoryFact = document.getElementById('fionaAiMemoryFact');
  const memorySourceFields = document.getElementById('fionaAiMemorySourceFields');
  const memoryFormDomain = document.getElementById('fionaAiMemoryFormDomain');
  const memoryScopeKey = document.getElementById('fionaAiMemoryScopeKey');
  const memoryConfidenceField = document.getElementById('fionaAiMemoryConfidenceField');
  const memoryConfidence = document.getElementById('fionaAiMemoryConfidence');
  const memoryReviewStateField = document.getElementById('fionaAiMemoryReviewStateField');
  const memoryReviewState = document.getElementById('fionaAiMemoryReviewState');
  const memorySave = document.getElementById('fionaAiMemorySave');
  const memoryCancel = document.getElementById('fionaAiMemoryCancel');
  const memoryCancelSecondary = document.getElementById('fionaAiMemoryCancelSecondary');
  const emptyState = document.getElementById('fionaAiEmptyState');
  const dataSourcePill = document.getElementById('fionaAiDataSource');
  const composerArea = document.getElementById('fionaAiComposerArea');
  const sidebar = document.getElementById('fionaAiSidebar');
  const toggleSidebar = document.getElementById('fionaAiToggleSidebar');
  const historyList = document.getElementById('fionaAiHistoryList');
  const historySearch = document.getElementById('fionaAiHistorySearch');
  const historyNew = document.getElementById('fionaAiHistoryNew');
  const historyLoading = document.getElementById('fionaAiHistoryLoading');
  const historyEmpty = document.getElementById('fionaAiHistoryEmpty');
  const modelPicker = document.getElementById('fionaAiModelPicker');
  const modelSelect = document.getElementById('fionaAiModelSelect');
  const modelHelp = document.getElementById('fionaAiModelHelp');
  const modelRetry = document.getElementById('fionaAiModelRetry');
  const api = (panel.dataset.apiUrl || '').replace(/\/$/, '');
  const rasci = /\/rasci(\/|$)/i.test(location.pathname);
  const queryConversationId = new URLSearchParams(location.search).get('conversationId');
  let conversationId = queryConversationId || sessionStorage.getItem('fiona.ai.conversation');
  let busy = false;
  let activeController = null;
  let lastRequest = null;
  let currentView = 'chat';
  let conversationItems = [];
  let historyLoadingState = false;
  let historyLoadVersion = 0;
  let conversationLoadVersion = 0;
  let memoryItems = [];
  let memoryLoading = false;
  let memorySaving = false;
  let memoryDeleting = false;
  let editingMemory = null;
  let memoryEditorLastFocus = null;
  let memoryLoadVersion = 0;
  let memoryAccountKey = localStorage.getItem('userId') || localStorage.getItem('token') || '';
  const modelPreferenceKey = 'fiona.ai.selectedModel.v1';
  let modelOptions = [];
  let defaultModelKey = null;
  let selectedModelKey = null;
  let conversationModelKey = null;
  let modelsLoadState = 'idle';
  let modelsLoadPromise = null;
  let cachePreparationKey = null;
  let cachePreparationVersion = 0;
  let cacheStatusKind = 'idle';
  let cacheStatusLabel = '';

  if (queryConversationId) sessionStorage.setItem('fiona.ai.conversation', queryConversationId);

  function isModelKey(value) {
    return typeof value === 'string' && /^[a-z0-9][a-z0-9._-]{0,159}$/i.test(value.trim());
  }

  function enabledModel(key) {
    return modelOptions.find(model => model.key === key && model.enabled) || null;
  }

  function normalizeModelOptions(data) {
    if (!data || !Array.isArray(data.models) || !isModelKey(data.defaultModelKey)) {
      throw new Error('The model catalog response was invalid.');
    }
    const seen = new Set();
    const models = data.models.map(model => {
      if (!model || !isModelKey(model.key) || seen.has(model.key.trim())) return null;
      if (typeof model.enabled !== 'boolean' || typeof model.displayName !== 'string') return null;
      const key = model.key.trim();
      seen.add(key);
      return {
        key,
        displayName: model.displayName.trim() || key,
        description: typeof model.description === 'string' ? model.description : '',
        enabled: model.enabled,
        unavailableReason: typeof model.unavailableReason === 'string' ? model.unavailableReason : '',
        capabilities: model.capabilities && typeof model.capabilities === 'object' ? model.capabilities : {}
      };
    }).filter(Boolean);
    const defaultKey = data.defaultModelKey.trim();
    if (!models.some(model => model.key === defaultKey)) throw new Error('The model catalog default is invalid.');
    return { defaultModelKey: defaultKey, models };
  }

  function setModelHelp(message, kind = '') {
    if (!modelHelp) return;
    modelHelp.textContent = message || '';
    modelHelp.classList.toggle('is-error', kind === 'error');
    modelHelp.classList.toggle('is-locked', kind === 'locked');
    if (modelRetry) modelRetry.hidden = kind !== 'error' || modelsLoadState !== 'failed';
  }

  function syncModelControl() {
    if (!modelSelect) return;
    const locked = busy || Boolean(conversationId || conversationModelKey);
    modelSelect.disabled = modelsLoadState !== 'ready' || locked;
    if (locked && conversationId) {
      setModelHelp('Start a new chat to change the model.', 'locked');
    }
    if (modelsLoadState === 'loading') setModelHelp('Loading models…');
    if (modelsLoadState === 'failed') setModelHelp('Models could not be loaded. Retry.', 'error');
  }

  function persistModelPreference(key) {
    if (!enabledModel(key)) return;
    try { localStorage.setItem(modelPreferenceKey, key); } catch (_) { /* storage can be unavailable */ }
  }

  function restoreModelPreference() {
    let preferred = null;
    try { preferred = localStorage.getItem(modelPreferenceKey); } catch (_) {}
    selectedModelKey = enabledModel(preferred)?.key || enabledModel(defaultModelKey)?.key || null;
    if (modelSelect) modelSelect.value = selectedModelKey || '';
  }

  function renderModelOptions() {
    if (!modelSelect) return;
    modelSelect.replaceChildren();
    for (const model of modelOptions) {
      const option = document.createElement('option');
      option.value = model.key;
      option.textContent = model.displayName;
      option.disabled = !model.enabled;
      if (!model.enabled && model.unavailableReason) option.title = model.unavailableReason;
      modelSelect.appendChild(option);
    }
    restoreModelPreference();
    if (!modelOptions.some(model => model.enabled)) {
      setModelHelp('No models are currently available.', 'error');
    } else if (!conversationId) {
      setModelHelp('Choose a model for this new chat.');
    }
    syncModelControl();
  }

  async function loadModelOptions(force = false) {
    if (modelsLoadPromise && !force) return modelsLoadPromise;
    modelsLoadState = 'loading';
    syncModelControl();
    modelsLoadPromise = requestJson('/api/agent/models', { method: 'GET' })
      .then(({ data }) => {
        const catalog = normalizeModelOptions(data);
        modelOptions = catalog.models;
        defaultModelKey = catalog.defaultModelKey;
        modelsLoadState = 'ready';
        renderModelOptions();
        return catalog;
      })
      .catch(error => {
        modelsLoadState = 'failed';
        modelOptions = [];
        defaultModelKey = null;
        selectedModelKey = null;
        if (modelSelect) {
          modelSelect.replaceChildren(new Option('Models unavailable', ''));
          modelSelect.value = '';
        }
        setModelHelp('Models could not be loaded. Retry.', 'error');
        syncModelControl();
        throw error;
      });
    return modelsLoadPromise;
  }

  function retryModelOptions() {
    modelsLoadPromise = null;
    loadModelOptions(true).catch(() => {});
  }

  function setConversationModel(key) {
    if (!isModelKey(key)) return false;
    const normalized = key.trim();
    conversationModelKey = normalized;
    selectedModelKey = normalized;
    if (modelSelect) modelSelect.value = normalized;
    syncModelControl();
    return true;
  }

  function conversationModelFrom(data) {
    const candidate = data?.modelKey || data?.conversationModelKey || data?.metadata?.modelKey || data?.model?.key;
    return isModelKey(candidate) ? candidate.trim() : null;
  }

  unavailable.hidden = rasci;
  composerArea.hidden = !rasci;
  emptyState.hidden = !rasci;
  document.getElementById('fionaAiContext').textContent = rasci ? 'RASCI matrix assistant' : 'Page support coming soon';

  const chatContent = [unavailable, messages, emptyState, status, composerArea, document.querySelector('.fiona-ai-disclaimer')];

  function renderRasciCacheStatus() {
    if (!cacheStatus) return;
    const visible = currentView === 'chat' && cacheStatusKind !== 'idle';
    cacheStatus.hidden = !visible;
    cacheStatus.classList.toggle('is-preparing', visible && cacheStatusKind === 'preparing');
    cacheStatus.classList.toggle('is-error', visible && cacheStatusKind === 'error');
    cacheStatus.setAttribute('aria-busy', visible && cacheStatusKind === 'preparing' ? 'true' : 'false');
    cacheStatus.replaceChildren();
    if (!visible) return;

    if (cacheStatusKind === 'preparing') {
      const spinner = document.createElement('span');
      spinner.className = 'fiona-ai-cache-spinner';
      spinner.setAttribute('aria-hidden', 'true');
      cacheStatus.appendChild(spinner);
    }
    const message = document.createElement('span');
    message.textContent = cacheStatusKind === 'preparing'
      ? `Preparing ${cacheStatusLabel}…`
      : `We couldn't prepare ${cacheStatusLabel} cache. Chat remains available.`;
    cacheStatus.appendChild(message);
  }

  function setRasciCacheStatus(kind, label) {
    cacheStatusKind = kind;
    cacheStatusLabel = label || 'the selected RASCI source';
    renderRasciCacheStatus();
  }

  function showChatView() {
    currentView = 'chat';
    memoryPanel.hidden = true;
    chatContent.forEach(element => { if (element) element.hidden = false; });
    unavailable.hidden = rasci;
    composerArea.hidden = !rasci;
    emptyState.hidden = !rasci;
    status.hidden = !status.textContent.trim();
    renderRasciCacheStatus();
    if (panel.classList.contains('is-open') && rasci && !busy) input.focus();
  }

  function showMemoryView() {
    currentView = 'memory';
    chatContent.forEach(element => { if (element) element.hidden = true; });
    memoryPanel.hidden = false;
    renderRasciCacheStatus();
    loadMemories();
    window.setTimeout(() => memorySearch?.focus(), 0);
  }

  function syncEmpty() {
    panel.classList.toggle('is-empty', rasci && messages.childElementCount === 0);
  }

  function open() {
    if (currentView === 'memory') showMemoryView();
    const sourceContext = context();
    setDataSource(sourceContext.dataSourceName);
    prepareRasciCache(sourceContext);
    loadModelOptions().catch(() => {});
    panel.classList.add('is-open');
    panel.setAttribute('aria-hidden', 'false');
    backdrop.hidden = false;
    loadHistory();
    if (conversationId && messages.childElementCount === 0) {
      selectConversation(conversationId);
    } else if (rasci && !busy) {
      input.focus();
    }
  }

  function shut() {
    showChatView();
    closeMemoryEditor();
    if (sidebar) sidebar.classList.remove('is-open');
    panel.classList.remove('is-open');
    panel.setAttribute('aria-hidden', 'true');
    backdrop.hidden = true;
  }

  function startNewChat() {
    if (busy && activeController) activeController.abort();
    conversationLoadVersion++;
    conversationId = null;
    conversationModelKey = null;
    lastRequest = null;
    restoreModelPreference();
    sessionStorage.removeItem('fiona.ai.conversation');
    messages.innerHTML = '';
    syncEmpty();
    renderHistoryList();
    if (currentView === 'memory') showChatView();
    if (sidebar) sidebar.classList.remove('is-open');
    syncModelControl();
    if (rasci && !busy) input.focus();
  }

  launcher.addEventListener('click', open);
  close.addEventListener('click', shut);
  backdrop.addEventListener('click', shut);
  toggleSidebar?.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
      sidebar?.classList.toggle('is-open');
    } else {
      sidebar?.classList.toggle('is-collapsed');
    }
  });
  document.getElementById('fionaAiMain')?.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && sidebar?.classList.contains('is-open')) {
      if (e.target.closest('#fionaAiToggleSidebar')) return;
      sidebar.classList.remove('is-open');
    }
  });
  memoriesButton?.addEventListener('click', showMemoryView);
  memoryBack?.addEventListener('click', () => {
    showChatView();
    if (!rasci) memoriesButton?.focus();
  });
  newChat.addEventListener('click', startNewChat);
  historyNew?.addEventListener('click', startNewChat);
  modelSelect?.addEventListener('change', () => {
    if (busy || conversationId || modelsLoadState !== 'ready') return;
    const key = modelSelect.value;
    if (!enabledModel(key)) {
      restoreModelPreference();
      return;
    }
    selectedModelKey = key;
    persistModelPreference(key);
    setModelHelp('Choose a model for this new chat.');
  });
  modelRetry?.addEventListener('click', retryModelOptions);
  document.querySelectorAll('.fiona-ai-suggestions [data-prompt]').forEach(button => button.addEventListener('click', () => {
    input.value = button.dataset.prompt;
    input.focus();
  }));
  syncEmpty();
  loadModelOptions().catch(() => {});

  function token() { return localStorage.getItem('token') || ''; }

  class FionaApiError extends Error {
    constructor(status, message) {
      super(message);
      this.name = 'FionaApiError';
      this.status = status;
    }
  }

  function clearMemoryState() {
    memoryItems = [];
    memoryList?.replaceChildren();
    renderMemoryList();
    conversationItems = [];
    historyList?.replaceChildren();
    renderHistoryList();
    conversationId = null;
    conversationModelKey = null;
    restoreModelPreference();
    sessionStorage.removeItem('fiona.ai.conversation');
    messages.innerHTML = '';
    syncEmpty();
    syncModelControl();
  }

  function syncMemoryAccount() {
    const current = localStorage.getItem('userId') || localStorage.getItem('token') || '';
    if (memoryAccountKey && current !== memoryAccountKey) clearMemoryState();
    memoryAccountKey = current;
  }

  window.addEventListener('storage', event => {
    if (event.key === 'token' || event.key === 'userId') {
      memoryAccountKey = event.newValue || '';
      clearMemoryState();
    }
  });

  function redirectToLogin() {
    clearMemoryState();
    sessionStorage.removeItem('fiona.ai.conversation');
    if (typeof window.handleLogout === 'function') window.handleLogout();
    else window.location.href = '/';
  }

  function apiErrorMessage(status, data, fallback) {
    if (status >= 500) return 'Fiona is temporarily unavailable. Please try again.';
    if (status === 404) return 'This memory is no longer available.';
    if (status === 400) return data?.message || 'Please check the memory details and try again.';
    return data?.message || fallback || `Request failed (${status}).`;
  }

  async function requestJson(path, options = {}) {
    let response;
    try {
      response = await fetch(api + path, {
        ...options,
        headers: {
          ...(options.body ? { 'Content-Type': 'application/json' } : {}),
          ...(options.headers || {}),
          'Authorization': 'Bearer ' + token()
        }
      });
    } catch (_) {
      throw new FionaApiError(0, 'Fiona could not connect. Check your connection and try again.');
    }
    const data = await response.json().catch(() => null);
    if (response.status === 401) {
      redirectToLogin();
      throw new FionaApiError(401, 'Your session has expired. Please sign in again.');
    }
    if (!response.ok) throw new FionaApiError(response.status, apiErrorMessage(response.status, data, 'Request failed.'));
    return { response, data };
  }

  function setMemoryStatus(message, options = {}) {
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

  const memoryDomains = {
    organization: 'Organization',
    rasci: 'RASCI',
    jobdesc: 'Job description',
    competency: 'Competency'
  };
  const memoryContract = window.FionaMemoryContract;

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

  function renderMemoryList() {
    const search = String(memorySearch.value || '').trim().toLowerCase();
    const scope = memoryScope.value;
    const filtered = memoryItems.filter(memory => {
      const matchesSearch = !search || String(memory.fact || '').toLowerCase().includes(search);
      const matchesScope = !scope || String(memory.scopeKind || '').toLowerCase() === scope;
      return matchesSearch && matchesScope;
    });
    memoryList.replaceChildren(...filtered.map(makeMemoryCard));
    memoryList.setAttribute('aria-busy', memoryLoading ? 'true' : 'false');
    memoryEmpty.hidden = memoryLoading || filtered.length > 0;
    if (!memoryLoading && memoryItems.length && !filtered.length) {
      memoryEmpty.querySelector('strong').textContent = 'No matching memories';
      memoryEmpty.querySelector('p').textContent = 'Try a different search or scope filter.';
    } else {
      memoryEmpty.querySelector('strong').textContent = 'No memories saved yet';
      memoryEmpty.querySelector('p').textContent = 'Fiona has not saved any memories for you. Add a global preference or a memory for a specific domain.';
    }
  }

  async function loadMemories() {
    if (memoryLoading) return;
    syncMemoryAccount();
    memoryLoading = true;
    const version = ++memoryLoadVersion;
    memoryRefresh.disabled = true;
    memoryList.setAttribute('aria-busy', 'true');
    if (!memoryItems.length) setMemoryStatus('Loading your memories…');
    else setMemoryStatus('Refreshing memories…');
    renderMemoryList();
    const query = new URLSearchParams({ domain: memoryDomain.value || '', scopeKey: '' });
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
      memoryRefresh.disabled = false;
      renderMemoryList();
    }
  }

  function selectedMemoryScope() {
    return memoryForm.querySelector('input[name="scopeKind"]:checked')?.value || 'user';
  }

  function updateMemoryFormScope() {
    memorySourceFields.hidden = selectedMemoryScope() !== 'source';
  }

  function showMemoryFormError(message, retry) {
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
    editingMemory = memory || null;
    memoryEditorLastFocus = document.activeElement;
    memoryEditorTitle.textContent = memory ? 'Edit memory' : 'Add memory';
    memoryFact.value = memory?.fact || '';
    memoryFormDomain.value = memory?.domain || '';
    memoryScopeKey.value = memory && memory.scopeKind === 'source' ? memory.scopeKey || '' : '';
    memoryConfidence.value = memory ? Math.round(Number(memory.confidence || 0) * 100) : '';
    memoryReviewState.value = memory?.reviewState === 'needs_review' ? 'needs_review' : 'active';
    memoryForm.querySelectorAll('input[name="scopeKind"]').forEach(radio => { radio.checked = (memory?.scopeKind || 'user') === radio.value; });
    memoryConfidenceField.hidden = !memory;
    memoryReviewStateField.hidden = !memory;
    showMemoryFormError('');
    updateMemoryFormScope();
    memoryEditor.hidden = false;
    if (typeof memoryEditor.showModal === 'function') memoryEditor.showModal();
    else memoryEditor.hidden = false;
    window.setTimeout(() => memoryFact.focus(), 0);
  }

  function closeMemoryEditor() {
    if (!memoryEditor) return;
    if (typeof memoryEditor.close === 'function' && memoryEditor.open) memoryEditor.close();
    memoryEditor.hidden = true;
    editingMemory = null;
    memoryForm.reset();
    memoryConfidenceField.hidden = true;
    memoryReviewStateField.hidden = true;
    showMemoryFormError('');
    updateMemoryFormScope();
    if (memoryEditorLastFocus && typeof memoryEditorLastFocus.focus === 'function') memoryEditorLastFocus.focus();
    memoryEditorLastFocus = null;
  }

  function validateMemoryForm() {
    const scopeKind = selectedMemoryScope();
    return memoryContract.validateMemoryDraft({
      fact: memoryFact.value,
      scopeKind,
      domain: memoryFormDomain.value,
      scopeKey: memoryScopeKey.value,
      confidence: memoryConfidence.value,
      reviewState: memoryReviewState.value
    }, editingMemory);
  }

  function setMemoryFormBusy(value) {
    memorySaving = value;
    memorySave.disabled = value;
    memoryCancel.disabled = value;
    memoryCancelSecondary.disabled = value;
    memoryForm.querySelectorAll('input, textarea, select').forEach(field => { field.disabled = value; });
    memorySave.textContent = value ? 'Saving…' : 'Save memory';
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
    let body;
    let path = '/api/agent/memories';
    let method = 'POST';
    if (!isEdit) {
      body = memoryContract.buildCreateMemoryPayload(formValue);
    } else {
      body = memoryContract.buildMemoryPatch(formValue, editingMemory);
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
      await requestJson(path, { method, body: JSON.stringify(body) });
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
    button.disabled = true;
    setMemoryStatus('Deleting memory…');
    try {
      await requestJson('/api/agent/memories/' + encodeURIComponent(String(memory.id)), { method: 'DELETE' });
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
      button.disabled = false;
    }
  }

  memoryList.addEventListener('click', event => {
    const action = event.target.closest?.('[data-action]');
    if (!action) return;
    const card = action.closest('.fiona-ai-memory-card');
    const memory = memoryItems.find(item => String(item.id) === card?.dataset.memoryId);
    if (!memory) return;
    if (action.dataset.action === 'edit') openMemoryEditor(memory);
    if (action.dataset.action === 'delete') deleteMemory(memory, action);
  });
  memorySearch.addEventListener('input', renderMemoryList);
  memoryScope.addEventListener('change', renderMemoryList);
  memoryDomain.addEventListener('change', loadMemories);
  memoryRefresh.addEventListener('click', loadMemories);
  memoryAdd.addEventListener('click', () => openMemoryEditor(null));
  memoryForm.querySelectorAll('input[name="scopeKind"]').forEach(radio => radio.addEventListener('change', updateMemoryFormScope));
  memoryForm.addEventListener('submit', saveMemory);
  memoryCancel.addEventListener('click', closeMemoryEditor);
  memoryCancelSecondary.addEventListener('click', closeMemoryEditor);
  memoryEditor.addEventListener('cancel', event => { event.preventDefault(); closeMemoryEditor(); });
  updateMemoryFormScope();
  function esc(value) {
    const node = document.createElement('div');
    node.textContent = value == null ? '' : String(value);
    return node.innerHTML;
  }
  if (window.marked && typeof marked.setOptions === 'function') {
    marked.setOptions({
      gfm: true,
      breaks: true
    });
  }

  function markdown(text) {
    if (window.marked && window.DOMPurify) {
      return DOMPurify.sanitize(marked.parse(text || ''));
    }
    return '<p>' + esc(text || '').replace(/\n/g, '<br>') + '</p>';
  }
  function scrollToLatest() { messages.scrollTop = messages.scrollHeight; }
  function add(role, text) {
    const wrap = document.createElement('div');
    wrap.className = 'fiona-ai-message ' + role;
    const bubble = document.createElement('div');
    bubble.className = 'fiona-ai-bubble';
    bubble.innerHTML = role === 'assistant' ? markdown(text) : esc(text);
    wrap.appendChild(bubble);
    messages.appendChild(wrap);
    syncEmpty();
    scrollToLatest();
    return bubble;
  }
  function context() {
    let draftId = null, dataSource = null, dataSourceName = null;
    try {
      if (typeof window.getState === 'function') draftId = window.getState('draftRasciId');
      const select = document.getElementById('dataSource-rasci');
      dataSource = String(select?.value || draftId || '').trim() || null;
      dataSourceName = select?.selectedOptions?.[0]?.textContent?.trim() || null;
    } catch (_) { }
    const isMaster = String(dataSource || '').toLowerCase() === 'master';
    return {
      page: rasci ? 'rasci' : null,
      route: location.pathname,
      draftRasciId: isMaster ? null : (draftId || dataSource),
      dataSource: isMaster ? 'master' : dataSource,
      dataDomain: rasci ? 'rasci' : null,
      sourceLabel: dataSourceName,
      dataSourceName
    };
  }

  function rasciCacheSource(sourceContext) {
    const selected = String(sourceContext?.dataSource || '').trim();
    const draftId = String(sourceContext?.draftRasciId || '').trim();
    const sourceId = selected || draftId || (rasci ? 'master' : '');
    const isMaster = sourceId.toLowerCase() === 'master';
    return {
      id: isMaster ? 'master' : sourceId,
      label: String(sourceContext?.dataSourceName || (isMaster ? 'Master data RASCI' : 'the selected RASCI draft')).trim()
    };
  }

  async function prepareRasciCache(sourceContext = context()) {
    if (!rasci) return;
    const source = rasciCacheSource(sourceContext);
    if (!source.id || source.id === cachePreparationKey) return;
    const version = ++cachePreparationVersion;
    cachePreparationKey = source.id;
    setRasciCacheStatus('preparing', source.label);
    try {
      await requestJson(`/api/agent/rasci-cache/${encodeURIComponent(source.id)}/prepare`, { method: 'POST' });
      if (version !== cachePreparationVersion) return;
      setRasciCacheStatus('idle');
    } catch (_) {
      if (version !== cachePreparationVersion) return;
      // Cache preparation is also enforced server-side on the first query. Keep
      // selection and chat usable while backend logs expose the write failure.
      cachePreparationKey = null;
      setRasciCacheStatus('error', source.label);
    }
  }
  document.getElementById('dataSource-rasci')?.addEventListener('change', () => {
    const selected = String(document.getElementById('dataSource-rasci')?.value || '').trim();
    if (selected.toLowerCase() === 'master' && typeof window.setState === 'function') window.setState('draftRasciId', null);
    const sourceContext = context();
    setDataSource(sourceContext.dataSourceName);
    prepareRasciCache(sourceContext);
  });
  function setDataSource(dataSource) {
    const value = String(dataSource || '').trim();
    dataSourcePill.hidden = !value;
    dataSourcePill.textContent = value ? 'Sumber data: ' + value : '';
  }

  function renderRasciTable(parent, table) {
    const box = document.createElement('div');
    box.className = 'fiona-ai-table-wrap fiona-ai-rasci-wrap';
    const matrix = document.createElement('fiona-rasci-matrix');
    const isRemote = table.renderMode === 'virtual' || table.renderMode === 'remote' || table.mode === 'remote' || Boolean(table.remote);
    const payload = { ...table };
    if (isRemote) {
      // Virtual responses are intentionally reduced to roots in the browser;
      // descendants are loaded by the component as each process is expanded.
      payload.mode = 'remote';
      payload.renderMode = 'remote';
      payload.rows = (table.rows || []).filter(row => row.parentId == null && row.parentBusinessProcessId == null);
      payload.remote = {
        ...(table.remote || {}),
        endpoint: table.remote?.endpoint || `${api}/api/agent/rasci-tables/${encodeURIComponent(table.draftRasciId || '')}`,
        pageSize: table.remote?.pageSize || 100
      };
    }
    matrix.data = payload;
    matrix.addEventListener('fiona-rasci-error', event => {
      box.dataset.error = event.detail?.error?.message || 'Unable to load RASCI matrix';
    });
    box.appendChild(matrix);
    parent.appendChild(box);
  }
  async function renderResult(data, options) {
    conversationId = data.conversationId;
    if (conversationId) sessionStorage.setItem('fiona.ai.conversation', conversationId);
    let bubble = options?.targetBubble;
    if (!bubble) {
      bubble = add('assistant', data.markdown);
    } else {
      bubble.innerHTML = markdown(data.markdown);
    }
    (data.rasciTables || []).forEach(table => renderRasciTable(bubble, table));
    if (data.citations?.length) {
      const citations = document.createElement('div');
      citations.className = 'fiona-ai-citations';
      citations.innerHTML = '<strong>Sumber Referensi</strong><br>' + data.citations.map((item, index) => `${index + 1}. ${esc(item.title)} <small>(${esc(item.sourceType)}:${esc(item.sourceId)})</small>`).join('<br>');
      bubble.appendChild(citations);
    }
    if (!options?.skipTrace && data.trace?.length) {
      const trace = document.createElement('div');
      trace.className = 'fiona-ai-trace';
      trace.textContent = data.trace.map(item => `${sanitizeFriendlyLabel(item.tool, item.tool, 'complete', 'id')}: ${sanitizeFriendlySummary(item.summary, item.tool, 'complete', 'id')}`).join(' · ');
      bubble.appendChild(trace);
    }
    for (const spec of data.charts || []) {
      const chart = document.createElement('div');
      chart.className = 'fiona-ai-chart';
      bubble.appendChild(chart);
      if (window.vegaEmbed) await vegaEmbed(chart, spec, { actions: false });
    }
    if (data.pendingAction) {
      const row = document.createElement('div');
      row.className = 'fiona-ai-confirm';
      row.innerHTML = '<button type="button" class="approve">Konfirmasi</button><button type="button" class="reject">Batal</button>';
      bubble.appendChild(row);
      row.querySelector('.approve').onclick = () => confirmAction(data.pendingAction.confirmationToken, true, row);
      row.querySelector('.reject').onclick = () => confirmAction(data.pendingAction.confirmationToken, false, row);
    }
    if (data.continuation?.available) {
      const row = document.createElement('div');
      row.className = 'fiona-ai-continuation';
      const question = document.createElement('p');
      question.textContent = data.continuation.question || 'Apakah Anda ingin Fiona melanjutkan?';
      const continueButton = document.createElement('button');
      continueButton.type = 'button';
      continueButton.className = 'continue';
      continueButton.textContent = data.continuation.continueMessage || 'Lanjutkan';
      continueButton.addEventListener('click', () => {
        if (busy) return;
        continueButton.disabled = true;
        sendMessage(data.continuation.continueMessage || 'Lanjutkan', true);
      });
      row.append(question, continueButton);
      bubble.appendChild(row);
    }
    scrollToLatest();
  }

  function getGroupKey(dateString) {
    if (!dateString) return 'Older';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return 'Older';
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(startOfToday.getTime() - 86400000);
    const startOf7Days = new Date(startOfToday.getTime() - 6 * 86400000);

    if (date >= startOfToday) return 'Today';
    if (date >= startOfYesterday) return 'Yesterday';
    if (date >= startOf7Days) return 'Previous 7 Days';
    return 'Older';
  }

  function renderHistoryList() {
    if (!historyList) return;
    historyList.replaceChildren();
    const filter = String(historySearch?.value || '').trim().toLowerCase();
    const filtered = conversationItems.filter(c => !filter || String(c.title || '').toLowerCase().includes(filter));

    if (historyEmpty) {
      historyEmpty.hidden = historyLoadingState || filtered.length > 0;
      if (!historyLoadingState && conversationItems.length && !filtered.length) {
        const strong = historyEmpty.querySelector('strong');
        const p = historyEmpty.querySelector('p');
        if (strong) strong.textContent = 'No matching conversations';
        if (p) p.textContent = 'Try a different search term.';
      } else if (!historyLoadingState) {
        const strong = historyEmpty.querySelector('strong');
        const p = historyEmpty.querySelector('p');
        if (strong) strong.textContent = 'No conversations yet';
        if (p) p.textContent = 'Your previous chats will appear here.';
      }
    }

    if (filtered.length === 0) return;

    const groups = {
      'Today': [],
      'Yesterday': [],
      'Previous 7 Days': [],
      'Older': []
    };

    for (const item of filtered) {
      const groupKey = getGroupKey(item.updatedAt || item.createdAt);
      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(item);
    }

    for (const [groupName, items] of Object.entries(groups)) {
      if (items.length === 0) continue;
      const groupDiv = document.createElement('div');
      groupDiv.className = 'fiona-ai-history-group';

      const label = document.createElement('div');
      label.className = 'fiona-ai-history-group-label';
      label.textContent = groupName;
      groupDiv.appendChild(label);

      for (const item of items) {
        const card = document.createElement('div');
        card.className = 'fiona-ai-history-item' + (item.id === conversationId ? ' is-active' : '');
        card.dataset.id = item.id;
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');

        const titleSpan = document.createElement('span');
        titleSpan.className = 'fiona-ai-history-item-title';
        titleSpan.textContent = item.title || 'New chat';
        titleSpan.title = item.title || 'New chat';
        card.appendChild(titleSpan);

        const actions = document.createElement('div');
        actions.className = 'fiona-ai-history-item-actions';

        const renameBtn = document.createElement('button');
        renameBtn.type = 'button';
        renameBtn.className = 'fiona-ai-history-action-btn rename';
        renameBtn.setAttribute('aria-label', 'Rename conversation');
        renameBtn.title = 'Rename';
        renameBtn.textContent = '✎';
        renameBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          renameConversation(item.id, item.title);
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.className = 'fiona-ai-history-action-btn delete';
        deleteBtn.setAttribute('aria-label', 'Delete conversation');
        deleteBtn.title = 'Delete';
        deleteBtn.textContent = '🗑';
        deleteBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          deleteConversation(item.id);
        });

        actions.append(renameBtn, deleteBtn);
        card.appendChild(actions);

        card.addEventListener('click', () => {
          selectConversation(item.id);
        });
        card.addEventListener('keydown', (e) => {
          if (e.target !== card) return;
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            selectConversation(item.id);
          }
        });

        groupDiv.appendChild(card);
      }
      historyList.appendChild(groupDiv);
    }
  }

  async function loadHistory(query = '') {
    const version = ++historyLoadVersion;
    historyLoadingState = true;
    if (historyLoading) historyLoading.hidden = false;
    if (historyList) historyList.setAttribute('aria-busy', 'true');
    const params = new URLSearchParams({ limit: '50' });
    if (query) params.set('query', query);
    try {
      const { data } = await requestJson('/api/agent/conversations?' + params.toString(), { method: 'GET' });
      if (version !== historyLoadVersion) return;
      conversationItems = (data && Array.isArray(data.items)) ? data.items : [];
    } catch (err) {
      if (version !== historyLoadVersion) return;
      if (err.status !== 401) {
        // Keep current items if request failed
      }
    } finally {
      if (version === historyLoadVersion) {
        historyLoadingState = false;
        if (historyLoading) historyLoading.hidden = true;
        if (historyList) historyList.setAttribute('aria-busy', 'false');
        renderHistoryList();
      }
    }
  }

  async function selectConversation(id) {
    if (!id) return;
    if (conversationId === id && messages.childElementCount > 0) {
      if (currentView === 'memory') showChatView();
      if (sidebar) sidebar.classList.remove('is-open');
      return;
    }
    if (busy && activeController) {
      activeController.abort();
    }
    const version = ++conversationLoadVersion;
    conversationId = id;
    conversationModelKey = null;
    syncModelControl();
    sessionStorage.setItem('fiona.ai.conversation', id);
    renderHistoryList();
    if (currentView === 'memory') showChatView();
    if (sidebar) sidebar.classList.remove('is-open');

    messages.innerHTML = '';
    syncEmpty();
    setChatBusy(true, false);
    status.hidden = false;
    status.textContent = 'Memuat percakapan…';

    try {
      const { data } = await requestJson(`/api/agent/conversations/${encodeURIComponent(id)}/messages?limit=50`, { method: 'GET' });
      if (version !== conversationLoadVersion) return;
      setConversationModel(conversationModelFrom(data));
      messages.innerHTML = '';
      if (data && Array.isArray(data.items)) {
        for (const msg of data.items) {
          if (msg.role === 'user') {
            add('user', msg.markdown);
          } else {
            let artifactData = null;
            if (msg.artifact) {
              try {
                artifactData = typeof msg.artifact === 'string' ? JSON.parse(msg.artifact) : msg.artifact;
              } catch (_) {}
            }
            const bubble = add('assistant', msg.markdown);
            if (artifactData?.rasciTables?.length) {
              artifactData.rasciTables.forEach(t => renderRasciTable(bubble, t));
            }
            if (artifactData?.citations?.length) {
              const citations = document.createElement('div');
              citations.className = 'fiona-ai-citations';
              citations.innerHTML = '<strong>Sumber Referensi</strong><br>' + artifactData.citations.map((item, index) => `${index + 1}. ${esc(item.title)} <small>(${esc(item.sourceType)}:${esc(item.sourceId)})</small>`).join('<br>');
              bubble.appendChild(citations);
            }
            const charts = msg.charts || artifactData?.charts || [];
            for (const spec of charts) {
              const chart = document.createElement('div');
              chart.className = 'fiona-ai-chart';
              bubble.appendChild(chart);
              if (window.vegaEmbed) await vegaEmbed(chart, spec, { actions: false });
            }
          }
        }
      }
    } catch (err) {
      if (version !== conversationLoadVersion) return;
      if (err.status === 404) {
        conversationId = null;
        sessionStorage.removeItem('fiona.ai.conversation');
        conversationItems = conversationItems.filter(c => c.id !== id);
        renderHistoryList();
        add('assistant', 'Percakapan ini sudah tidak tersedia.');
      } else if (err.status !== 401) {
        add('assistant', 'Tidak dapat memuat pesan untuk percakapan ini.');
      }
    } finally {
      if (version === conversationLoadVersion) {
        status.hidden = true;
        setChatBusy(false, false);
        syncEmpty();
        scrollToLatest();
        if (rasci) input.focus();
      }
    }
  }

  async function renameConversation(id, currentTitle) {
    const newTitle = window.prompt('Enter new title for this conversation:', currentTitle || '');
    if (newTitle === null) return;
    const trimmed = newTitle.trim();
    if (!trimmed) {
      alert('Conversation title cannot be empty.');
      return;
    }
    try {
      await requestJson(`/api/agent/conversations/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        body: JSON.stringify({ title: trimmed })
      });
      const found = conversationItems.find(c => c.id === id);
      if (found) found.title = trimmed;
      renderHistoryList();
    } catch (err) {
      alert(err.message || 'Failed to rename conversation.');
    }
  }

  async function deleteConversation(id) {
    if (!window.confirm('Delete this conversation? This cannot be undone.')) return;
    try {
      await requestJson(`/api/agent/conversations/${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
      conversationItems = conversationItems.filter(c => c.id !== id);
      renderHistoryList();
      if (conversationId === id) {
        startNewChat();
      }
    } catch (err) {
      alert(err.message || 'Failed to delete conversation.');
    }
  }

  let historySearchDebounce = null;
  historySearch?.addEventListener('input', () => {
    renderHistoryList();
    clearTimeout(historySearchDebounce);
    historySearchDebounce = setTimeout(() => {
      const q = String(historySearch.value || '').trim();
      loadHistory(q);
    }, 300);
  });

  const toolNameTranslations = {
    'get_rasci_business_process': {
      label: { id: 'Memeriksa proses bisnis', en: 'Checking business processes' },
      runningSummary: { id: 'Mencari data proses bisnis yang sesuai…', en: 'Searching business process records…' },
      completeSummary: { id: 'Data proses bisnis berhasil diperoleh', en: 'Business process records retrieved' }
    },
    'get_rasci_positions': {
      label: { id: 'Memeriksa posisi & jabatan', en: 'Checking positions & roles' },
      runningSummary: { id: 'Mencari posisi dan unit kerja terkait…', en: 'Searching positions and organization units…' },
      completeSummary: { id: 'Data posisi berhasil diperoleh', en: 'Positions retrieved' }
    },
    'get_rasci_mappings': {
      label: { id: 'Memeriksa matriks tanggung jawab RASCI', en: 'Checking RASCI responsibilities' },
      runningSummary: { id: 'Mencari penetapan peran (R/A/S/C/I)…', en: 'Looking up responsibility assignments…' },
      completeSummary: { id: 'Matriks tanggung jawab berhasil diperiksa', en: 'Responsibility mappings retrieved' }
    },
    'display_rasci_table': {
      label: { id: 'Menyiapkan tampilan tabel RASCI', en: 'Preparing RASCI table view' },
      runningSummary: { id: 'Menyusun tabel interaktif…', en: 'Building interactive table…' },
      completeSummary: { id: 'Tabel RASCI siap ditampilkan', en: 'RASCI table ready' }
    },
    'get_rasci_table': {
      label: { id: 'Mengambil data tabel RASCI', en: 'Fetching RASCI table data' },
      runningSummary: { id: 'Memuat data tabel…', en: 'Loading table slice…' },
      completeSummary: { id: 'Data tabel siap', en: 'Table data ready' }
    },
    'get_duckdb_schema': {
      label: { id: 'Menyiapkan struktur data', en: 'Preparing data structure' },
      runningSummary: { id: 'Membaca katalog struktur data…', en: 'Reading data schemas…' },
      completeSummary: { id: 'Struktur data siap', en: 'Data structure ready' }
    },
    'get_sql_server_schema': {
      label: { id: 'Menyiapkan struktur data', en: 'Preparing data structure' },
      runningSummary: { id: 'Membaca skema basis data…', en: 'Reading database schema…' },
      completeSummary: { id: 'Struktur data siap', en: 'Data structure ready' }
    },
    'duckdb_query': {
      label: { id: 'Menganalisis & menghitung data', en: 'Analyzing & computing data' },
      runningSummary: { id: 'Memproses data dan perhitungan…', en: 'Processing data query…' },
      completeSummary: { id: 'Analisis data selesai', en: 'Data analysis completed' }
    },
    'sql_server_query': {
      label: { id: 'Menganalisis & mencari data', en: 'Analyzing & retrieving data' },
      runningSummary: { id: 'Memproses penarikan data…', en: 'Processing data query…' },
      completeSummary: { id: 'Penarikan data selesai', en: 'Data retrieval completed' }
    },
    'scratchpad_query': {
      label: { id: 'Mengolah data analisis', en: 'Processing analysis data' },
      runningSummary: { id: 'Menjalankan analisis data…', en: 'Running query analysis…' },
      completeSummary: { id: 'Pengolahan data selesai', en: 'Data processing completed' }
    },
    'duckdb_query_to_scratchpad': {
      label: { id: 'Mengorganisasi data kerja', en: 'Organizing workspace data' },
      runningSummary: { id: 'Menata data ke ruang kerja sementara…', en: 'Preparing workspace tables…' },
      completeSummary: { id: 'Data kerja berhasil diorganisasi', en: 'Workspace data organized' }
    },
    'sql_server_query_to_scratchpad': {
      label: { id: 'Mengorganisasi data kerja', en: 'Organizing workspace data' },
      runningSummary: { id: 'Menata data ke ruang kerja sementara…', en: 'Preparing workspace tables…' },
      completeSummary: { id: 'Data kerja berhasil diorganisasi', en: 'Workspace data organized' }
    },
    'scratchpad_exec': {
      label: { id: 'Menata ruang kerja analisis', en: 'Managing analysis workspace' },
      runningSummary: { id: 'Menyiapkan tabel kerja…', en: 'Updating workspace tables…' },
      completeSummary: { id: 'Ruang kerja siap', en: 'Workspace updated' }
    },
    'scratchpad_tables': {
      label: { id: 'Memeriksa ruang kerja analisis', en: 'Checking analysis workspace' },
      runningSummary: { id: 'Melihat status tabel kerja…', en: 'Checking workspace tables…' },
      completeSummary: { id: 'Ruang kerja siap', en: 'Workspace ready' }
    },
    'create_rasci_draft': {
      label: { id: 'Membuat draft RASCI baru', en: 'Creating new RASCI draft' },
      runningSummary: { id: 'Menyiapkan draft baru di sistem…', en: 'Initializing new draft…' },
      completeSummary: { id: 'Draft RASCI baru berhasil dibuat', en: 'New RASCI draft created' }
    },
    'rename_rasci_draft': {
      label: { id: 'Mengubah nama draft RASCI', en: 'Renaming RASCI draft' },
      runningSummary: { id: 'Memperbarui nama draft…', en: 'Updating draft title…' },
      completeSummary: { id: 'Nama draft berhasil diubah', en: 'Draft renamed successfully' }
    },
    'save_rasci_mapping': {
      label: { id: 'Menyimpan pemetaan RASCI', en: 'Saving RASCI mapping' },
      runningSummary: { id: 'Menyimpan perubahan ke draft…', en: 'Saving changes to draft…' },
      completeSummary: { id: 'Pemetaan RASCI berhasil disimpan', en: 'RASCI mapping saved successfully' }
    },
    'maf-native': {
      label: { id: 'Fiona sedang menganalisis', en: 'Fiona is analyzing' },
      runningSummary: { id: 'Menganalisis pertanyaan dan mengumpulkan data…', en: 'Analyzing question and gathering data…' },
      completeSummary: { id: 'Analisis & pengumpulan data selesai', en: 'Analysis completed' }
    },
    'maf-native-limit': {
      label: { id: 'Batas langkah tercapai', en: 'Action limit reached' },
      runningSummary: { id: 'Lanjutkan percakapan untuk memproses lebih lanjut', en: 'Continue the conversation to proceed further' },
      completeSummary: { id: 'Batas langkah tercapai', en: 'Action limit reached' }
    }
  };

  function sanitizeFriendlyLabel(rawLabel, category, status, lang = 'id') {
    const l = lang === 'en' ? 'en' : 'id';
    const cleanCategory = String(category || '').trim();
    if (toolNameTranslations[cleanCategory]) {
      return toolNameTranslations[cleanCategory].label[l];
    }
    let text = String(rawLabel || '').trim();
    if (!text || text.toLowerCase().startsWith('executing ') || text.toLowerCase().startsWith('executed ')) {
      const toolMatch = text.replace(/^(executing|executed)\s+/i, '').trim();
      if (toolNameTranslations[toolMatch]) {
        return toolNameTranslations[toolMatch].label[l];
      }
    }
    text = text.replace(/^executing\s+/i, l === 'en' ? 'Processing ' : 'Memproses ')
               .replace(/^executed\s+/i, l === 'en' ? 'Processed ' : 'Selesai memproses ')
               .replace(/native tool loop/i, l === 'en' ? 'analysis' : 'analisis')
               .replace(/fiona native maf/i, l === 'en' ? 'Fiona is analyzing' : 'Fiona sedang menganalisis')
               .replace(/mathematical runtime/i, l === 'en' ? 'data calculation' : 'perhitungan data')
               .replace(/native tool invocation started/i, l === 'en' ? 'Step in progress…' : 'Langkah sedang berjalan…')
               .replace(/native tool invocation completed/i, l === 'en' ? 'Step completed' : 'Langkah selesai')
               .replace(/get_rasci_business_process/i, l === 'en' ? 'business processes' : 'proses bisnis')
               .replace(/get_rasci_positions/i, l === 'en' ? 'positions' : 'posisi & jabatan')
               .replace(/get_rasci_mappings/i, l === 'en' ? 'RASCI mappings' : 'pemetaan RASCI')
               .replace(/display_rasci_table/i, l === 'en' ? 'RASCI table' : 'tabel RASCI')
               .replace(/duckdb_query/i, l === 'en' ? 'data calculation' : 'analisis data')
               .replace(/sql_server_query/i, l === 'en' ? 'database query' : 'pencarian data')
               .replace(/scratchpad_\w+/i, l === 'en' ? 'workspace' : 'ruang kerja analisis');
    return text || (l === 'en' ? 'Processing step' : 'Memproses langkah');
  }

  function sanitizeFriendlySummary(rawSummary, category, status, lang = 'id') {
    const l = lang === 'en' ? 'en' : 'id';
    const cleanCategory = String(category || '').trim();
    if (toolNameTranslations[cleanCategory]) {
      return status === 'running'
        ? toolNameTranslations[cleanCategory].runningSummary[l]
        : toolNameTranslations[cleanCategory].completeSummary[l];
    }
    let text = String(rawSummary || '').trim();
    text = text.replace(/native tool invocation started/i, l === 'en' ? 'Working…' : 'Sedang memproses…')
               .replace(/native tool invocation completed/i, l === 'en' ? 'Finished' : 'Selesai')
               .replace(/executing the native tool loop/i, l === 'en' ? 'Analyzing and gathering information…' : 'Menganalisis pertanyaan dan mengumpulkan informasi…')
               .replace(/native tool loop completed/i, l === 'en' ? 'All information gathered' : 'Semua informasi berhasil diproses');
    return text;
  }

  function createActivityCard() {
    const wrap = document.createElement('div');
    wrap.className = 'fiona-ai-message assistant fiona-ai-activity-message';
    const details = document.createElement('details');
    details.className = 'fiona-ai-activity is-running';
    details.open = true;
    details.innerHTML = '<summary class="fiona-ai-activity-summary"><span class="fiona-ai-activity-spinner" aria-hidden="true"></span><span class="fiona-ai-activity-title">Fiona sedang menganalisis…</span><span class="fiona-ai-activity-time">0s</span></summary><div class="fiona-ai-activity-agent" hidden></div><ol class="fiona-ai-activity-steps"></ol><p class="fiona-ai-activity-notice" hidden></p><button type="button" class="fiona-ai-activity-retry" hidden>Coba lagi</button>';
    wrap.appendChild(details);
    messages.appendChild(wrap);
    syncEmpty();
    scrollToLatest();
    const title = details.querySelector('.fiona-ai-activity-title');
    const time = details.querySelector('.fiona-ai-activity-time');
    const stepsList = details.querySelector('.fiona-ai-activity-steps');
    const agent = details.querySelector('.fiona-ai-activity-agent');
    const notice = details.querySelector('.fiona-ai-activity-notice');
    const retry = details.querySelector('.fiona-ai-activity-retry');
    const started = performance.now();
    let language = 'id';
    let finished = false;
    let currentStepNum = 0;
    const stepMap = new Map();
    const activityMap = new Map();
    let thoughtCursor = null;

    const timer = setInterval(() => {
      if (!finished) {
        time.textContent = formatDuration(performance.now() - started);
      }
    }, 250);
    const stalled = setTimeout(() => {
      if (finished) return;
      notice.hidden = false;
      notice.textContent = language === 'en' ? 'Still working—some data requests take longer.' : 'Masih bekerja—beberapa permintaan data memerlukan waktu lebih lama.';
    }, 15000);

    function ensureThoughtCursor() {
      if (!thoughtCursor) {
        thoughtCursor = document.createElement('span');
        thoughtCursor.className = 'fiona-ai-thought-cursor';
        thoughtCursor.setAttribute('aria-hidden', 'true');
      }
      return thoughtCursor;
    }

    function getOrCreateStep(stepNum, phaseTitle) {
      const num = stepNum || 1;
      let stepItem = stepMap.get(num);
      if (!stepItem) {
        // Mark previous step as finished if moving to a new step
        if (currentStepNum && currentStepNum !== num) {
          const prevStep = stepMap.get(currentStepNum);
          if (prevStep) {
            prevStep.element.classList.remove('is-running');
            prevStep.element.classList.add('is-success');
            if (prevStep.reasoningDetails) {
              prevStep.reasoningDetails.open = false;
              if (prevStep.reasoningBadge) prevStep.reasoningBadge.hidden = true;
            }
          }
        }
        currentStepNum = num;

        const li = document.createElement('li');
        li.className = 'fiona-ai-step-item is-running';
        li.dataset.step = String(num);

        const defaultLabel = phaseTitle || (language === 'en' ? `Step ${num}: Analyzing` : `Langkah ${num}: Menganalisis`);
        li.innerHTML = `
          <div class="fiona-ai-step-header">
            <div class="fiona-ai-step-header-left">
              <span class="fiona-ai-step-icon" aria-hidden="true"></span>
              <strong class="fiona-ai-step-label">${esc(defaultLabel)}</strong>
            </div>
            <span class="fiona-ai-step-time"></span>
          </div>
          <small class="fiona-ai-step-detail" hidden></small>
          <details class="fiona-ai-step-reasoning" hidden>
            <summary>
              <span class="fiona-ai-step-reasoning-summary-left">
                <span class="fiona-ai-step-reasoning-chevron" aria-hidden="true">›</span>
                <span class="fiona-ai-step-reasoning-title">${language === 'en' ? 'Reasoning' : 'Alasan'}</span>
                <span class="fiona-ai-step-reasoning-badge" hidden>${language === 'en' ? 'Thinking…' : 'Sedang berpikir…'}</span>
              </span>
            </summary>
            <div class="fiona-ai-step-reasoning-content"></div>
          </details>
        `;
        stepsList.appendChild(li);

        stepItem = {
          stepNum: num,
          element: li,
          label: li.querySelector('.fiona-ai-step-label'),
          detail: li.querySelector('.fiona-ai-step-detail'),
          time: li.querySelector('.fiona-ai-step-time'),
          reasoningDetails: li.querySelector('.fiona-ai-step-reasoning'),
          reasoningTitle: li.querySelector('.fiona-ai-step-reasoning-title'),
          reasoningBadge: li.querySelector('.fiona-ai-step-reasoning-badge'),
          reasoningContent: li.querySelector('.fiona-ai-step-reasoning-content'),
          startedAt: performance.now(),
          hasThought: false
        };
        stepMap.set(num, stepItem);
      }
      return stepItem;
    }

    function appendThought(chunk, step, phase) {
      if (!chunk) return;
      const stepNum = step || 1;
      const stepItem = getOrCreateStep(stepNum, phase);
      stepItem.hasThought = true;
      stepItem.reasoningDetails.hidden = false;

      const cursor = ensureThoughtCursor();
      if (cursor.parentNode) cursor.parentNode.removeChild(cursor);
      stepItem.reasoningContent.textContent += chunk;
      stepItem.reasoningContent.appendChild(cursor);

      stepItem.reasoningContent.scrollTop = stepItem.reasoningContent.scrollHeight;
      scrollToLatest();
    }

    function upsert(activity) {
      if (!activity?.id) return;
      const friendlyLabel = sanitizeFriendlyLabel(activity.label, activity.category, activity.status, language);
      const friendlySummary = sanitizeFriendlySummary(activity.summary, activity.category, activity.status, language);

      if (activity.category === 'maf-native' || activity.id === 'maf-native') {
        if (activity.status === 'running') {
          title.textContent = friendlyLabel || (language === 'en' ? 'Fiona is analyzing…' : 'Fiona sedang menganalisis…');
        }
        return;
      }

      // Associate activity with a step item
      let stepItem = activityMap.get(activity.id);
      if (!stepItem) {
        stepItem = getOrCreateStep(currentStepNum || stepMap.size || 1, friendlyLabel);
        activityMap.set(activity.id, stepItem);
      }

      stepItem.label.textContent = friendlyLabel;
      const durationStr = activity.durationMs != null ? formatDuration(activity.durationMs) : null;
      const detailStr = [friendlySummary, durationStr].filter(Boolean).join(' · ');
      if (detailStr) {
        stepItem.detail.textContent = detailStr;
        stepItem.detail.hidden = false;
      }
      if (activity.status === 'success' || activity.status === 'complete') {
        stepItem.element.classList.remove('is-running');
        stepItem.element.classList.add('is-success');
        if (stepItem.reasoningBadge) stepItem.reasoningBadge.hidden = true;
        if (stepItem.reasoningDetails) stepItem.reasoningDetails.open = false;
      } else if (activity.status === 'error') {
        stepItem.element.classList.remove('is-running');
        stepItem.element.classList.add('is-error');
        if (stepItem.reasoningBadge) stepItem.reasoningBadge.hidden = true;
      }

      title.textContent = friendlyLabel || (language === 'en' ? 'Fiona is working' : 'Fiona sedang bekerja');
      scrollToLatest();
    }

    function finish(kind, message) {
      if (finished) return;
      finished = true;
      clearInterval(timer);
      clearTimeout(stalled);
      if (thoughtCursor && thoughtCursor.parentNode) {
        thoughtCursor.parentNode.removeChild(thoughtCursor);
      }
      details.classList.remove('is-running');
      details.classList.add('is-' + kind);
      const elapsed = performance.now() - started;
      time.textContent = formatDuration(elapsed);

      // Close all reasoning details and clean up steps
      for (const [, stepItem] of stepMap) {
        stepItem.element.classList.remove('is-running');
        if (kind === 'complete') {
          stepItem.element.classList.add('is-success');
        }
        if (stepItem.reasoningDetails) {
          stepItem.reasoningDetails.open = false;
          if (stepItem.reasoningBadge) stepItem.reasoningBadge.hidden = true;
          // If a step had no thoughts, hide reasoning box
          if (!stepItem.hasThought || !stepItem.reasoningContent.textContent.trim()) {
            stepItem.reasoningDetails.hidden = true;
          }
        }
      }

      const count = stepMap.size || 1;
      if (kind === 'complete') {
        title.textContent = language === 'en' ? `Completed · ${count} ${count === 1 ? 'step' : 'steps'}` : `Selesai · ${count} langkah`;
      } else {
        title.textContent = message || (language === 'en' ? 'Finished' : 'Selesai');
      }
      notice.hidden = true;
      details.open = kind !== 'complete';
    }

    retry.addEventListener('click', () => {
      if (!lastRequest || busy) return;
      sendMessage(lastRequest.message, Boolean(lastRequest.continue), lastRequest);
    });
    details.classList.add('is-running');
    return {
      setLanguage(value) {
        language = value === 'en' ? 'en' : 'id';
        for (const [, stepItem] of stepMap) {
          if (stepItem.reasoningTitle) {
            stepItem.reasoningTitle.textContent = language === 'en' ? 'Reasoning' : 'Alasan';
          }
          if (stepItem.reasoningBadge && !stepItem.reasoningBadge.hidden) {
            stepItem.reasoningBadge.textContent = language === 'en' ? 'Thinking…' : 'Sedang berpikir…';
          }
        }
      },
      upsert,
      appendThought,
      complete() { finish('complete', ''); },
      stop() { finish('stopped', language === 'en' ? 'Stopped by you' : 'Dihentikan oleh Anda'); },
      fail(message) { finish('error', message || (language === 'en' ? 'Connection interrupted' : 'Koneksi terputus')); retry.hidden = false; },
      setConversation(value) { if (value) { conversationId = value; sessionStorage.setItem('fiona.ai.conversation', value); } }
    };
  }

  function formatDuration(milliseconds) {
    if (milliseconds < 1000) return Math.max(0, Math.round(milliseconds)) + 'ms';
    return (milliseconds / 1000).toFixed(milliseconds < 10000 ? 1 : 0) + 's';
  }
  function setChatBusy(value, cancellable) {
    busy = value;
    input.disabled = value;
    newChat.disabled = value;
    send.disabled = value && !cancellable;
    send.classList.toggle('is-stop', value && cancellable);
    send.textContent = value && cancellable ? '■' : '➤';
    send.setAttribute('aria-label', value && cancellable ? 'Stop Fiona' : 'Send message');
    syncModelControl();
    if (!value) input.focus();
  }
  async function call(path, body) {
    const response = await fetch(api + path, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token() }, body: JSON.stringify(body) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || `Request failed (${response.status})`);
    return data;
  }
  async function confirmAction(confirmationToken, approved, row) {
    row.querySelectorAll('button').forEach(button => button.disabled = true);
    setChatBusy(true, false);
    status.hidden = false;
    status.textContent = approved ? 'Menjalankan tindakan terkonfirmasi…' : 'Membatalkan…';
    try { await renderResult(await call('/api/agent/confirm', { confirmationToken, approved })); }
    catch (error) { add('assistant', 'Gagal memproses konfirmasi: ' + error.message); }
    finally { status.hidden = true; setChatBusy(false, false); }
  }

  async function streamChat(body, card, signal, onPartial) {
    const response = await fetch(api + '/api/agent/chat/stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'text/event-stream', 'Authorization': 'Bearer ' + token() },
      body: JSON.stringify(body),
      signal
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      const error = new FionaApiError(response.status, data.message || `Request failed (${response.status})`);
      error.code = data.code || data.errorCode || null;
      throw error;
    }
    if (!response.body) throw new Error('Streaming is not supported by this browser.');
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '', runId = null, sequence = 0, result = null;

    function handleEvent(eventType, dataText) {
      if (!dataText.trim()) return;
      const event = JSON.parse(dataText);
      if (runId && event.runId !== runId) return;
      if (!runId) runId = event.runId;
      if (event.sequence != null && event.sequence <= sequence) return;
      if (event.sequence != null) sequence = event.sequence;

      const type = (eventType || event.type || '').toUpperCase();
      if (type === 'RUN_STARTED') {
        const startedModelKey = event.metadata?.modelKey || event.modelKey;
        if (!isModelKey(startedModelKey) || (body.modelKey && startedModelKey.trim() !== body.modelKey)) {
          const error = new FionaApiError(409, 'The selected model could not be confirmed for this conversation. Start a new chat.');
          error.code = 'model_protocol_mismatch';
          throw error;
        }
        setConversationModel(startedModelKey);
        persistModelPreference(startedModelKey);
        card.setLanguage(event.language);
        card.setConversation(event.conversationId);
      } else if (type === 'TOOL_CALL_START') {
        card.upsert({
          id: event.toolCallId || ('tool-' + (event.sequence || Date.now())),
          category: event.toolName,
          status: 'running',
          label: event.label
        });
      } else if (type === 'TOOL_CALL_RESULT') {
        card.upsert({
          id: event.toolCallId || ('tool-' + (event.sequence || Date.now())),
          category: event.toolName,
          status: event.status || 'complete',
          label: event.label,
          durationMs: event.durationMs,
          summary: event.summary
        });
      } else if (type === 'THOUGHT_CONTENT') {
        card.appendThought(event.delta || '', event.step, event.phase);
      } else if (type === 'TEXT_MESSAGE_CONTENT') {
        if (typeof onPartial === 'function') onPartial(event.delta || '');
      } else if (type === 'RUN_FINISHED') {
        result = event.result;
      } else if (type === 'RUN_ERROR') {
        throw new Error(event.message || 'Fiona could not complete this request.');
      }
    }

    function parseSseMessage(raw) {
      const lines = raw.split(/\r?\n/);
      let eventType = '';
      const dataLines = [];
      for (const line of lines) {
        if (line.startsWith('event:')) {
          eventType = line.slice(6).trim();
        } else if (line.startsWith('data:')) {
          dataLines.push(line.slice(5).trimStart());
        }
      }
      if (dataLines.length > 0) {
        handleEvent(eventType, dataLines.join('\n'));
      }
    }

    while (true) {
      const chunk = await reader.read();
      buffer += decoder.decode(chunk.value || new Uint8Array(), { stream: !chunk.done });
      let boundary;
      while ((boundary = buffer.indexOf('\n\n')) !== -1) {
        const rawMessage = buffer.slice(0, boundary);
        buffer = buffer.slice(boundary + 2);
        parseSseMessage(rawMessage);
      }
      if (chunk.done) break;
    }
    if (buffer.trim()) parseSseMessage(buffer);
    if (!result) throw new Error('The response stream ended before Fiona returned an answer.');
    return result;
  }

  async function sendMessage(text, continuePrevious = false, requestSnapshot = null) {
    if (busy) {
      if (activeController) activeController.abort();
      return;
    }
    text = String(text || '').trim();
    if (!text) return;
    const requestContext = context();
    const requestModelKey = requestSnapshot?.modelKey || conversationModelKey || selectedModelKey;
    if (!requestModelKey || !enabledModel(requestModelKey)) {
      status.hidden = false;
      status.textContent = modelsLoadState === 'failed' ? 'Models could not be loaded. Retry.' : 'Choose an available model before sending.';
      return;
    }
    const body = requestSnapshot ? { ...requestSnapshot } : { message: text, conversationId, context: requestContext, modelKey: requestModelKey };
    body.message = text;
    body.modelKey = requestModelKey;
    body.conversationId = requestSnapshot ? requestSnapshot.conversationId : conversationId;
    if (!requestSnapshot) body.context = requestContext;
    if (continuePrevious) body.continue = true;
    lastRequest = body;
    setDataSource(requestContext.dataSourceName);
    add('user', text);
    input.value = '';
    const card = createActivityCard();
    activeController = new AbortController();
    setChatBusy(true, true);

    let liveBubble = null;
    let accumulatedText = '';
    const onPartial = (textChunk) => {
      if (!liveBubble) {
        liveBubble = add('assistant', '');
      }
      accumulatedText += textChunk;
      liveBubble.innerHTML = markdown(accumulatedText) + '<span class="fiona-ai-streaming-cursor" aria-hidden="true"></span>';
      scrollToLatest();
    };

    try {
      const result = await streamChat(body, card, activeController.signal, onPartial);
      card.complete();
      await renderResult(result, { skipTrace: true, targetBubble: liveBubble });
      loadHistory();
    } catch (error) {
      if (liveBubble) {
        liveBubble.innerHTML = markdown(accumulatedText) + (error.name === 'AbortError' ? '<p class="fiona-ai-stream-stopped"><em>(Dihentikan oleh Anda)</em></p>' : '');
      }
      if (error.name === 'AbortError') card.stop();
      else {
        if (error.code === 'conversation_model_mismatch') {
          conversationModelKey = null;
          setModelHelp('This conversation uses a different model. Start a new chat.', 'locked');
        } else if (error.code === 'model_protocol_mismatch') {
          setModelHelp('The server returned a different model. Start a new chat.', 'error');
        } else if (error.code === 'model_unavailable' || error.code === 'invalid_model') {
          setModelHelp(error.message, 'error');
        }
        card.fail(error.message);
      }
    } finally {
      activeController = null;
      setChatBusy(false, false);
    }
  }
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (busy) {
      if (activeController) activeController.abort();
      return;
    }
    await sendMessage(input.value, false);
  });
  input.addEventListener('keydown', event => {
    if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); form.requestSubmit(); }
  });
})();
