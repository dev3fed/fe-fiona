(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.FionaAssistantContext = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  let mentionSearchTimer = 0;
  let mentionSearchSeq = 0;
  let mentionSearchController = null;
  let mentionSelectedIndex = -1;
  let mentionCurrentItems = [];
  let activeMentionTrigger = null;
  let savedMentionRange = null;
  let contextModalActiveTab = 'position';
  let contextModalSearchTimer = 0;
  let deps = {};

  // Spaces are valid inside an entity name (for example, "Manager HSE").
  // A period is valid in a business-process index (for example, "1.2").
  // Other sentence punctuation, a newline, or another trigger ends the active query.
  function parseActiveMention(text) {
    const normalizedText = String(text || '').replace(/\u00A0/g, ' ').replace(/\u200B/g, '');
    if (/[\r\n]$/.test(normalizedText)) return null;
    const match = normalizedText.match(/(?:^|\s)([@#])([^@#\n]*)$/);
    if (!match || /[,;:!?]/.test(match[2] || '')) return null;

    const char = match[1];
    const rawQuery = match[2] || '';
    const triggerString = match[0].trimStart();
    return {
      char,
      type: char === '@' ? 'position' : 'process',
      query: rawQuery.trim(),
      triggerString,
      lengthToReplace: triggerString.length
    };
  }

  function closeMentionPopup() {
    clearTimeout(mentionSearchTimer);
    mentionSearchController?.abort();
    mentionSearchController = null;
    mentionSearchSeq++;
    activeMentionTrigger = null;
    savedMentionRange = null;
    mentionCurrentItems = [];
    mentionSelectedIndex = -1;
    if (deps.mentionPopup) {
      deps.mentionPopup.hidden = true;
    }
  }

  function setMentionSelectedIndex(index) {
    const { mentionList } = deps;
    if (!mentionList || mentionCurrentItems.length === 0) {
      mentionSelectedIndex = -1;
      return;
    }
    mentionSelectedIndex = Math.max(0, Math.min(index, mentionCurrentItems.length - 1));
    const children = Array.from(mentionList.children);
    children.forEach((child, i) => {
      const isSelected = i === mentionSelectedIndex;
      child.classList.toggle('is-selected', isSelected);
      if (isSelected) {
        child.scrollIntoView({ block: 'nearest' });
      }
    });
  }

  function moveMentionSelection(delta) {
    if (mentionCurrentItems.length === 0) return;
    let next = mentionSelectedIndex + delta;
    if (next >= mentionCurrentItems.length) next = 0;
    if (next < 0) next = mentionCurrentItems.length - 1;
    setMentionSelectedIndex(next);
  }

  function checkEditorEmpty() {
    const { input } = deps;
    if (!input) return true;
    const chips = input.querySelectorAll('.fiona-inline-chip');
    const rawText = (input.innerText || '').replace(/[\u00A0\u200B\s]/g, '');
    const isEmpty = chips.length === 0 && rawText.length === 0;
    if (isEmpty && input.innerHTML !== '') {
      input.innerHTML = '';
    }
    input.setAttribute('data-empty', isEmpty ? 'true' : 'false');
    return isEmpty;
  }

  function createInlineChipElement(entity) {
    const span = document.createElement('span');
    span.className = `fiona-inline-chip is-${entity.type || 'position'}`;
    span.setAttribute('contenteditable', 'false');
    span.setAttribute('data-type', entity.type || 'position');
    span.setAttribute('data-id', entity.id || '');
    span.setAttribute('data-key', entity.key || '');
    span.setAttribute('data-label', entity.label || '');
    if (entity.index) span.setAttribute('data-index', entity.index);
    if (entity.positionCode) span.setAttribute('data-position-code', entity.positionCode);
    if (entity.unitCodeOrg) span.setAttribute('data-unit-code', entity.unitCodeOrg);
    if (entity.level != null) span.setAttribute('data-level', String(entity.level));

    const badge = document.createElement('span');
    badge.className = 'chip-badge';
    badge.textContent = entity.type === 'process' ? '#' : '@';

    const labelSpan = document.createElement('span');
    labelSpan.className = 'chip-label';
    labelSpan.textContent = entity.type === 'process' && entity.index ? `${entity.index} ${entity.label}` : entity.label;

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'chip-remove';
    removeBtn.textContent = '×';
    removeBtn.setAttribute('title', 'Hapus entitas');
    removeBtn.setAttribute('aria-label', `Hapus entitas ${entity.label}`);
    removeBtn.setAttribute('tabindex', '-1');
    removeBtn.addEventListener('mousedown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      span.remove();
      checkEditorEmpty();
      focusComposer();
    });

    span.append(badge, labelSpan, removeBtn);
    return span;
  }

  function getSelectionRangeInInput() {
    const { input } = deps;
    if (!input) return null;
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return null;
    const range = sel.getRangeAt(0);
    if (!input.contains(range.commonAncestorContainer)) return null;
    return range;
  }

  function insertInlineChip(entity, triggerRange) {
    const { input } = deps;
    if (!input || !entity) return;
    input.focus();

    let range = triggerRange || savedMentionRange;
    if (!range || !range.startContainer || !input.contains(range.startContainer)) {
      range = getSelectionRangeInInput();
    }

    const sel = window.getSelection();

    if (!range) {
      range = document.createRange();
      range.selectNodeContents(input);
      range.collapse(false);
    }

    const chip = createInlineChipElement(entity);
    try {
      range.deleteContents();
      range.insertNode(chip);
    } catch (_) {
      input.appendChild(chip);
    }

    // Insert a trailing non-breaking space after chip so caret can be positioned safely
    const spacer = document.createTextNode('\u00A0');
    if (chip.nextSibling) {
      chip.parentNode.insertBefore(spacer, chip.nextSibling);
    } else {
      chip.parentNode.appendChild(spacer);
    }

    // Move caret directly after the inserted spacer
    try {
      const newRange = document.createRange();
      newRange.setStart(spacer, 1);
      newRange.collapse(true);
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(newRange);
      }
    } catch (_) { }

    checkEditorEmpty();
    closeMentionPopup();
  }

  function renderMentionTags() {
    // Legacy support: inline chips are rendered directly in the contenteditable composer
    const { mentionTags } = deps;
    if (!mentionTags) return;
    mentionTags.replaceChildren();
    mentionTags.hidden = true;
  }

  function removeContextEntity(index) {
    const { input } = deps;
    if (!input) return;
    const chips = input.querySelectorAll('.fiona-inline-chip');
    if (index >= 0 && index < chips.length) {
      chips[index].remove();
      checkEditorEmpty();
    }
  }

  function addContextEntity(entity) {
    insertInlineChip(entity, null);
  }

  function getComposerContent() {
    const { input } = deps;
    if (!input) {
      return { text: '', mentionedEntities: [], isEmpty: true };
    }

    const mentionedEntities = [];
    let text = '';

    function traverse(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        text += node.textContent.replace(/\u00A0/g, ' ').replace(/\u200B/g, '');
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.classList.contains('fiona-inline-chip')) {
          const type = node.getAttribute('data-type') || 'position';
          const label = node.getAttribute('data-label') || '';
          const id = node.getAttribute('data-id') || undefined;
          const key = node.getAttribute('data-key') || undefined;
          const index = node.getAttribute('data-index') || undefined;
          const positionCode = node.getAttribute('data-position-code') || undefined;
          const unitCodeOrg = node.getAttribute('data-unit-code') || undefined;
          const rawLevel = node.getAttribute('data-level');
          const level = rawLevel != null && rawLevel !== '' ? Number(rawLevel) : undefined;

          const entity = {
            type,
            label,
            ...(id ? { id } : {}),
            ...(key ? { key } : {}),
            ...(index ? { index } : {}),
            ...(positionCode ? { positionCode } : {}),
            ...(unitCodeOrg ? { unitCodeOrg } : {}),
            ...(level != null && !Number.isNaN(level) ? { level } : {})
          };

          const exists = mentionedEntities.some(e => e.type === type && ((id && e.id === id) || (key && e.key === key) || e.label === label));
          if (!exists) {
            mentionedEntities.push(entity);
          }

          if (type === 'position') {
            text += ` @Jabatan:"${label}" `;
          } else {
            text += ` @Prosbis:"${label}" `;
          }
        } else if (node.tagName === 'BR') {
          text += '\n';
        } else if (node.tagName === 'DIV' || node.tagName === 'P') {
          if (text.length > 0 && !text.endsWith('\n')) text += '\n';
          for (const child of node.childNodes) traverse(child);
        } else {
          for (const child of node.childNodes) traverse(child);
        }
      }
    }

    for (const child of input.childNodes) {
      traverse(child);
    }

    const cleanedText = text.replace(/[ \t]+/g, ' ').trim();
    const isEmpty = cleanedText.length === 0 && mentionedEntities.length === 0;

    return {
      text: cleanedText,
      mentionedEntities,
      isEmpty
    };
  }

  function setComposerText(newText) {
    const { input } = deps;
    if (!input) return;
    input.innerText = newText || '';
    checkEditorEmpty();
    focusComposer();
  }

  function clearComposer() {
    const { input } = deps;
    if (!input) return;
    input.innerHTML = '';
    checkEditorEmpty();
    closeMentionPopup();
  }

  function focusComposer() {
    const { input } = deps;
    if (!input) return;
    input.focus();
    const sel = window.getSelection();
    if (sel) {
      const range = document.createRange();
      range.selectNodeContents(input);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }

  function setComposerDisabled(disabled) {
    const { input } = deps;
    if (!input) return;
    input.setAttribute('contenteditable', disabled ? 'false' : 'true');
    input.classList.toggle('is-disabled', Boolean(disabled));
  }

  async function searchEntities(query, type, signal) {
    query = String(query || '').trim();
    const sourceContext = typeof deps.getContext === 'function' ? deps.getContext() : {};
    const source = typeof deps.rasciCacheSource === 'function' ? deps.rasciCacheSource(sourceContext) : { id: 'master' };
    const sourceId = source.id || 'master';
    const targetType = type || 'all';
    try {
      const params = new URLSearchParams({
        query: query,
        type: targetType,
        draftRasciId: sourceId,
        limit: '50'
      });
      const promises = [deps.requestJson(`/api/agent/entities/search?${params.toString()}`, { method: 'GET', signal })];
      const [res] = await Promise.all(promises);
      const data = res?.data;
      if (Array.isArray(data?.items)) {
        return data.items;
      }
      if (Array.isArray(data)) {
        return data;
      }
    } catch (_) { }
    return [];
  }

  function updateMentionHeader(trigger) {
    const { mentionPopup } = deps;
    if (!mentionPopup) return;
    const header = mentionPopup.querySelector('.fiona-ai-mention-header');
    if (!header) return;
    header.replaceChildren();

    const isPos = trigger?.type === 'position';
    const badge = document.createElement('span');
    badge.className = `fiona-ai-mention-header-badge is-${isPos ? 'position' : 'process'}`;
    badge.textContent = isPos ? 'Jabatan (@)' : 'Proses Bisnis (#)';

    const titleSpan = document.createElement('span');
    titleSpan.className = 'fiona-ai-mention-header-title';
    const q = (trigger?.query || '').trim();
    if (q) {
      titleSpan.textContent = `Mencari: "${q}"`;
    } else {
      titleSpan.textContent = isPos ? 'Pilih Jabatan' : 'Pilih Proses Bisnis';
    }

    header.append(badge, titleSpan);
  }

  function renderMentionPopup(items, trigger) {
    const { mentionList, mentionPopup } = deps;
    if (!mentionList || !mentionPopup) return;
    activeMentionTrigger = trigger || activeMentionTrigger;
    updateMentionHeader(activeMentionTrigger);
    mentionCurrentItems = items || [];
    mentionList.replaceChildren();
    if (!mentionCurrentItems.length) {
      mentionSelectedIndex = -1;
      const emptyDiv = document.createElement('div');
      emptyDiv.className = 'fiona-ai-mention-empty';
      emptyDiv.style.padding = '10px 12px';
      emptyDiv.style.textAlign = 'center';
      emptyDiv.style.color = '#94a3b8';
      emptyDiv.style.fontSize = '12px';
      const q = (activeMentionTrigger?.query || '').trim();
      emptyDiv.textContent = q ? `Tidak ada hasil untuk "${q}"` : 'Tidak ada data ditemukan';
      mentionList.appendChild(emptyDiv);
      mentionPopup.hidden = false;
      return;
    }
    mentionCurrentItems.forEach((item, index) => {
      const div = document.createElement('div');
      const isProcess = item.type === 'process';
      div.className = `fiona-ai-mention-item${isProcess ? ' is-process' : ''}${index === 0 ? ' is-selected' : ''}`;
      if (isProcess) {
        const level = Number(item.level);
        const displayLevel = Number.isFinite(level) ? level : String(item.index || '').split('.').filter(Boolean).length;
        const levelBadge = document.createElement('span');
        levelBadge.className = 'fiona-ai-mention-item-level';
        levelBadge.textContent = `Level ${displayLevel || '-'}`;
        div.appendChild(levelBadge);
      }
      div.setAttribute('role', 'option');
      div.setAttribute('tabindex', '-1');
      const label = document.createElement('span');
      label.className = 'fiona-ai-mention-item-label';
      label.textContent = item.type === 'position' ? item.label : `${item.index ? item.index + ' ' : ''}${item.label}`;
      const badge = document.createElement('span');
      badge.className = `fiona-ai-mention-item-badge ${item.type === 'position' ? 'pos' : 'proc'}`;
      badge.textContent = item.type === 'position' ? 'Jabatan' : 'Prosbis';
      div.append(label, badge);
      div.addEventListener('mouseenter', () => {
        setMentionSelectedIndex(index);
      });
      div.addEventListener('mousedown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        selectMentionItem(item);
      });
      mentionList.appendChild(div);
    });
    setMentionSelectedIndex(0);
    mentionPopup.hidden = false;
  }

  function selectMentionItem(item) {
    if (!item) return;
    insertInlineChip(item, savedMentionRange);
  }

  function openContextModal(tab = 'position') {
    const { contextModal, tabPosition, tabProcess, contextSearch } = deps;
    if (!contextModal) return;
    contextModalActiveTab = tab;
    if (tabPosition && tabProcess) {
      tabPosition.classList.toggle('is-active', tab === 'position');
      tabPosition.setAttribute('aria-selected', tab === 'position' ? 'true' : 'false');
      tabProcess.classList.toggle('is-active', tab === 'process');
      tabProcess.setAttribute('aria-selected', tab === 'process' ? 'true' : 'false');
    }
    if (contextSearch) contextSearch.value = '';
    if (contextModal.showModal) contextModal.showModal();
    else contextModal.hidden = false;
    loadContextModalResults('');
    if (contextSearch) contextSearch.focus();
  }

  function closeContextModal() {
    const { contextModal, input } = deps;
    if (!contextModal) return;
    if (contextModal.close) contextModal.close();
    else contextModal.hidden = true;
    input?.focus();
  }

  async function loadContextModalResults(query) {
    const { contextList, contextLoading, contextEmpty } = deps;
    if (!contextList) return;
    if (contextLoading) contextLoading.hidden = false;
    if (contextEmpty) contextEmpty.hidden = true;
    contextList.replaceChildren();
    const items = await searchEntities(query, contextModalActiveTab);
    if (contextLoading) contextLoading.hidden = true;
    if (!items.length) {
      if (contextEmpty) contextEmpty.hidden = false;
      return;
    }
    items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'fiona-ai-context-card';
      const info = document.createElement('div');
      info.className = 'fiona-ai-context-card-info';
      const title = document.createElement('div');
      title.className = 'fiona-ai-context-card-title';
      title.textContent = item.label;
      const meta = document.createElement('div');
      meta.className = 'fiona-ai-context-card-meta';
      if (item.type === 'position') {
        meta.textContent = [item.positionCode ? `Kode: ${item.positionCode}` : null, item.unitCodeOrg ? `Unit: ${item.unitCodeOrg}` : null, item.level != null ? `Layer: ${item.level}` : null].filter(Boolean).join(' · ');
      } else {
        meta.textContent = [item.index ? `Index: ${item.index}` : null, item.level ? `Level: ${item.level}` : null].filter(Boolean).join(' · ');
      }
      info.append(title, meta);
      const selectBtn = document.createElement('button');
      selectBtn.type = 'button';
      selectBtn.className = 'fiona-ai-context-card-btn';
      selectBtn.textContent = '＋ Pilih';
      selectBtn.addEventListener('click', () => {
        addContextEntity(item);
        closeContextModal();
      });
      card.append(info, selectBtn);
      contextList.appendChild(card);
    });
  }

  function getTextBeforeCaret() {
    const { input } = deps;
    if (!input) return { text: '', range: null };
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return { text: '', range: null };
    const selRange = sel.getRangeAt(0);
    if (!input.contains(selRange.commonAncestorContainer)) return { text: '', range: null };

    try {
      const preCaretRange = selRange.cloneRange();
      preCaretRange.selectNodeContents(input);
      preCaretRange.setEnd(selRange.endContainer, selRange.endOffset);
      const text = preCaretRange.toString().replace(/\u00A0/g, ' ').replace(/\u200B/g, '');
      return { text, range: selRange, preCaretRange };
    } catch (_) {
      return { text: '', range: selRange };
    }
  }

  function createTriggerRangeFromCaret(lengthToReplace) {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || lengthToReplace <= 0) return null;
    const selRange = sel.getRangeAt(0);
    const endNode = selRange.endContainer;
    const endOffset = selRange.endOffset;

    if (endNode.nodeType === Node.TEXT_NODE && endOffset >= lengthToReplace) {
      const range = document.createRange();
      range.setStart(endNode, endOffset - lengthToReplace);
      range.setEnd(endNode, endOffset);
      return range;
    }

    // Node traversal backwards
    let charsLeft = lengthToReplace;
    const range = document.createRange();
    range.setEnd(endNode, endOffset);

    let currNode = endNode;
    while (currNode && charsLeft > 0) {
      if (currNode.nodeType === Node.TEXT_NODE) {
        const len = currNode === endNode ? endOffset : currNode.textContent.length;
        if (len >= charsLeft) {
          range.setStart(currNode, len - charsLeft);
          return range;
        } else {
          charsLeft -= len;
        }
      }
      if (currNode.previousSibling) {
        currNode = currNode.previousSibling;
        while (currNode.lastChild) currNode = currNode.lastChild;
      } else {
        currNode = currNode.parentNode;
        if (currNode === deps.input) break;
      }
    }
    return range;
  }

  function handleInputMentionScan() {
    const { input, mentionPopup } = deps;
    if (!input) return;

    checkEditorEmpty();

    const { text, range } = getTextBeforeCaret();
    if (!range) {
      closeMentionPopup();
      return;
    }

    const mention = parseActiveMention(text);

    if (mention) {
      const { char, type, query, lengthToReplace } = mention;

      savedMentionRange = createTriggerRangeFromCaret(lengthToReplace);

      // If popup is already showing results for the exact same query and trigger type,
      // do not trigger another search or re-render which would reset selection index
      if (
        mentionPopup &&
        !mentionPopup.hidden &&
        activeMentionTrigger &&
        activeMentionTrigger.char === char &&
        activeMentionTrigger.type === type &&
        activeMentionTrigger.query === query
      ) {
        return;
      }

      const trigger = {
        char,
        type,
        query
      };
      activeMentionTrigger = trigger;
      // Do not leave results for the previous query visible during the short debounce.
      if (mentionPopup) mentionPopup.hidden = true;

      const seq = ++mentionSearchSeq;
      clearTimeout(mentionSearchTimer);
      mentionSearchController?.abort();
      mentionSearchController = null;
      mentionSearchTimer = setTimeout(async () => {
        const controller = new AbortController();
        mentionSearchController = controller;
        const items = await searchEntities(query, trigger.type, controller.signal);
        if (
          seq === mentionSearchSeq &&
          mentionSearchController === controller &&
          !controller.signal.aborted &&
          activeMentionTrigger &&
          activeMentionTrigger.char === char &&
          activeMentionTrigger.query === query
        ) {
          renderMentionPopup(items, trigger);
        }
        if (mentionSearchController === controller) mentionSearchController = null;
      }, 60);
    } else {
      closeMentionPopup();
    }
  }

  function handleBackspaceAtomic(event) {
    const { input } = deps;
    if (!input) return;

    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || !sel.isCollapsed) return;

    const range = sel.getRangeAt(0);
    if (!input.contains(range.commonAncestorContainer)) return;

    const node = range.anchorNode;
    const offset = range.anchorOffset;

    let chipToDelete = null;

    if (node === input) {
      if (offset > 0) {
        const prevChild = input.childNodes[offset - 1];
        if (prevChild && prevChild.classList && prevChild.classList.contains('fiona-inline-chip')) {
          chipToDelete = prevChild;
        }
      }
    } else if (node.nodeType === Node.TEXT_NODE) {
      if (offset === 0 || (offset === 1 && (node.textContent === '\u00A0' || node.textContent === '\u200B' || node.textContent === ' '))) {
        let prev = node.previousSibling;
        if (prev && prev.classList && prev.classList.contains('fiona-inline-chip')) {
          chipToDelete = prev;
        }
      }
    }

    if (chipToDelete) {
      event.preventDefault();
      chipToDelete.remove();
      checkEditorEmpty();
    }
  }

  function init(options) {
    deps = options || {};
    const {
      contextAddBtn, contextModalClose, contextCancel, tabPosition, tabProcess,
      contextSearch, messages, input, form, mentionPopup, mentionList
    } = deps;

    checkEditorEmpty();

    // Bind Context Modal Events
    contextAddBtn?.addEventListener('click', () => openContextModal('position'));
    contextModalClose?.addEventListener('click', closeContextModal);
    contextCancel?.addEventListener('click', closeContextModal);
    tabPosition?.addEventListener('click', () => {
      if (contextModalActiveTab === 'position') return;
      contextModalActiveTab = 'position';
      tabPosition.classList.add('is-active');
      tabPosition.setAttribute('aria-selected', 'true');
      tabProcess?.classList.remove('is-active');
      tabProcess?.setAttribute('aria-selected', 'false');
      loadContextModalResults(contextSearch?.value || '');
    });
    tabProcess?.addEventListener('click', () => {
      if (contextModalActiveTab === 'process') return;
      contextModalActiveTab = 'process';
      tabProcess.classList.add('is-active');
      tabProcess.setAttribute('aria-selected', 'true');
      tabPosition?.classList.remove('is-active');
      tabPosition?.setAttribute('aria-selected', 'false');
      loadContextModalResults(contextSearch?.value || '');
    });
    contextSearch?.addEventListener('input', () => {
      clearTimeout(contextModalSearchTimer);
      contextModalSearchTimer = setTimeout(() => {
        loadContextModalResults(contextSearch.value);
      }, 200);
    });

    // Bind Generative UI and Comparison Events
    document.addEventListener('fiona-action-click', (e) => {
      const prompt = e.detail?.prompt;
      const busy = typeof deps.getBusy === 'function' ? deps.getBusy() : false;
      if (prompt && !busy && typeof deps.sendMessage === 'function') deps.sendMessage(prompt);
    });
    document.addEventListener('fiona-comparison-remove', (e) => {
      const detail = e.detail || {};
      const label = detail.label || detail.item?.label || 'item';
      const prompt = detail.type === 'position' || detail.mode === 'by_position'
        ? `Hapus jabatan "${label}" dari perbandingan tabel RASCI`
        : `Hapus proses bisnis "${label}" dari perbandingan tabel RASCI`;
      const busy = typeof deps.getBusy === 'function' ? deps.getBusy() : false;
      if (!busy && typeof deps.sendMessage === 'function') deps.sendMessage(prompt);
    });
    document.addEventListener('fiona-comparison-add', (e) => {
      const tab = e.detail?.type === 'process' || e.detail?.mode === 'by_business_process' ? 'process' : 'position';
      openContextModal(tab);
    });
    messages?.addEventListener('click', (e) => {
      const chip = e.target.closest('.action-chip, [data-action-chip], [data-prompt]');
      const busy = typeof deps.getBusy === 'function' ? deps.getBusy() : false;
      if (chip && !busy && typeof deps.sendMessage === 'function') {
        const prompt = chip.getAttribute('data-prompt') || chip.textContent.trim();
        if (prompt) deps.sendMessage(prompt);
      }
    });

    // Contenteditable Input Event Listeners
    input?.addEventListener('keydown', event => {
      if (mentionPopup && !mentionPopup.hidden) {
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          event.stopPropagation();
          moveMentionSelection(1);
          return;
        }
        if (event.key === 'ArrowUp') {
          event.preventDefault();
          event.stopPropagation();
          moveMentionSelection(-1);
          return;
        }
        if (event.key === 'Enter' || event.key === 'Tab') {
          if (mentionCurrentItems.length > 0) {
            event.preventDefault();
            event.stopPropagation();
            const selectedIndex = mentionSelectedIndex >= 0 ? mentionSelectedIndex : 0;
            selectMentionItem(mentionCurrentItems[selectedIndex]);
            return;
          } else {
            event.preventDefault();
            event.stopPropagation();
            closeMentionPopup();
            return;
          }
        }
        if (event.key === 'Escape') {
          event.preventDefault();
          event.stopPropagation();
          closeMentionPopup();
          return;
        }
      }

      if (event.key === 'Backspace') {
        handleBackspaceAtomic(event);
      }

      if (event.key === 'Enter') {
        if (event.isComposing) return;
        if (!event.shiftKey) {
          event.preventDefault();
          form?.requestSubmit();
        } else {
          // Insert consistent BR newline in contenteditable
          event.preventDefault();
          const sel = window.getSelection();
          if (sel && sel.rangeCount > 0) {
            const range = sel.getRangeAt(0);
            const br = document.createElement('br');
            range.deleteContents();
            range.insertNode(br);
            const textNode = document.createTextNode('\u00A0');
            if (br.nextSibling) {
              br.parentNode.insertBefore(textNode, br.nextSibling);
            } else {
              br.parentNode.appendChild(textNode);
            }
            range.setStart(textNode, 1);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
          }
        }
      }
    });

    input?.addEventListener('input', () => {
      handleInputMentionScan();
    });

    input?.addEventListener('keyup', (event) => {
      if (mentionPopup && !mentionPopup.hidden && ['ArrowUp', 'ArrowDown', 'Enter', 'Tab', 'Escape'].includes(event.key)) {
        return;
      }
      if (['ArrowLeft', 'ArrowRight', 'Home', 'End', 'Backspace', 'Delete'].includes(event.key)) {
        handleInputMentionScan();
      }
    });

    input?.addEventListener('pointerup', () => {
      handleInputMentionScan();
    });

    input?.addEventListener('paste', (e) => {
      e.preventDefault();
      const plainText = (e.clipboardData || window.clipboardData).getData('text/plain');
      if (plainText) {
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0) {
          const range = sel.getRangeAt(0);
          range.deleteContents();
          const textNode = document.createTextNode(plainText);
          range.insertNode(textNode);
          range.setStart(textNode, plainText.length);
          range.collapse(true);
          sel.removeAllRanges();
          sel.addRange(range);
        }
        checkEditorEmpty();
      }
    });

    document.addEventListener('pointerdown', (event) => {
      if (mentionPopup && !mentionPopup.hidden) {
        const composerArea = document.getElementById('fionaAiComposerArea');
        if (composerArea && !composerArea.contains(event.target) && !mentionPopup.contains(event.target)) {
          closeMentionPopup();
        }
      }
    });
  }

  return {
    init,
    insertInlineChip,
    renderMentionTags,
    removeContextEntity,
    addContextEntity,
    getComposerContent,
    setComposerText,
    clearComposer,
    focusComposer,
    setComposerDisabled,
    checkEditorEmpty,
    parseActiveMention,
    searchEntities,
    renderMentionPopup,
    openContextModal,
    closeContextModal,
    getAttachedContextEntities: () => getComposerContent().mentionedEntities,
    clearAttachedContextEntities: () => clearComposer()
  };
});
