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
  const mentionCache = new Map();
  let mentionIsLoading = false;
  let contextModalActiveTab = 'process';
  let contextModalSearchTimer = 0;
  let contextModalSearchController = null;
  let selectedContextEntities = new Map();
  let contextModalActiveLevel = 'all';
  let contextCurrentResults = [];
  let contextFocusedItem = null;
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
    if (entity.type === 'process' && entity.index) {
      const index = document.createElement('code');
      index.className = 'fiona-index-number';
      index.textContent = entity.index;
      labelSpan.append(index, document.createTextNode(` ${entity.label}`));
    } else labelSpan.textContent = entity.label;

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
      // Position results requested from the @ picker use the dedicated
      // prefix-first strategy. Process mentions and context-modal searches
      // retain the endpoint's existing behavior.
      if (targetType === 'position') params.set('mode', 'mention');
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

  async function loadSuggestions(query, type, signal) {
    const sourceContext = typeof deps.getContext === 'function' ? deps.getContext() : {};
    const source = typeof deps.rasciCacheSource === 'function' ? deps.rasciCacheSource(sourceContext) : { id: 'master' };
    if (!query || query.trim().length < 2) return [];
    const params = new URLSearchParams({ query: query.trim(), type: type || 'process', draftRasciId: source.id || 'master', limit: '8' });
    try {
      const res = await deps.requestJson(`/api/agent/entities/suggestions?${params.toString()}`, { method: 'GET', signal });
      return Array.isArray(res?.data?.items) ? res.data.items : [];
    } catch (_) { return []; }
  }

  async function advancedSearch(query, type, levels) {
    const sourceContext = typeof deps.getContext === 'function' ? deps.getContext() : {};
    const source = typeof deps.rasciCacheSource === 'function' ? deps.rasciCacheSource(sourceContext) : { id: 'master' };
    const payload = {
      query: String(query || '').trim(),
      type: type || 'process',
      draftRasciId: source.id || 'master'
    };
    if (Array.isArray(levels) && levels.length > 0) {
      payload.levels = levels;
    }
    const res = await deps.requestJson('/api/agent/entities/advanced-search', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    return res?.data || { items: [] };
  }

  function updateMentionHeader(trigger, isLoading = false, parentItem = null) {
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

    const loader = document.createElement('span');
    loader.className = 'fiona-ai-mention-loader';
    if (!isLoading) loader.hidden = true;

    header.append(badge, titleSpan);

    if (parentItem) {
      const parentContainer = document.createElement('span');
      parentContainer.className = 'fiona-ai-mention-header-parent';
      parentContainer.title = `Induk: ${parentItem.index ? parentItem.index + ' ' : ''}${parentItem.label}`;
      const parentPrefix = document.createTextNode('Induk: ');
      parentContainer.appendChild(parentPrefix);
      if (parentItem.index) {
        const pCode = document.createElement('code');
        pCode.textContent = parentItem.index;
        parentContainer.appendChild(pCode);
        parentContainer.appendChild(document.createTextNode(' '));
      }
      const pLabel = document.createElement('span');
      pLabel.textContent = parentItem.label;
      parentContainer.appendChild(pLabel);
      header.appendChild(parentContainer);
    }

    header.appendChild(loader);
  }

  function setMentionLoading(isLoading) {
    mentionIsLoading = Boolean(isLoading);
    const { mentionPopup } = deps;
    if (!mentionPopup) return;
    const loader = mentionPopup.querySelector('.fiona-ai-mention-loader');
    if (loader) {
      loader.hidden = !mentionIsLoading;
    }
  }

  function highlightMatches(text, query) {
    if (!query || !query.trim()) return [document.createTextNode(text)];
    const q = query.trim().toLowerCase();
    const str = String(text || '');
    const lower = str.toLowerCase();
    const idx = lower.indexOf(q);
    if (idx === -1) return [document.createTextNode(str)];

    const nodes = [];
    if (idx > 0) {
      nodes.push(document.createTextNode(str.slice(0, idx)));
    }
    const mark = document.createElement('mark');
    mark.className = 'fiona-ai-mention-match';
    mark.textContent = str.slice(idx, idx + q.length);
    nodes.push(mark);
    if (idx + q.length < str.length) {
      nodes.push(document.createTextNode(str.slice(idx + q.length)));
    }
    return nodes;
  }

  function renderMentionPopup(items, trigger) {
    const { mentionList, mentionPopup } = deps;
    if (!mentionList || !mentionPopup) return;
    activeMentionTrigger = trigger || activeMentionTrigger;

    const rawItems = items || [];
    let parentItem = null;
    let displayItems = rawItems;
    let isHierarchyMode = false;

    const q = (activeMentionTrigger?.query || '').trim();
    const indexMatch = activeMentionTrigger?.type === 'process' ? q.match(/^(\d+(?:\.\d+)*)/) : null;
    const typedIndex = indexMatch ? indexMatch[1] : null;

    if (typedIndex) {
      isHierarchyMode = true;
      const parts = typedIndex.split('.');
      const parentIndex = parts.length > 1 ? parts.slice(0, -1).join('.') : '';

      if (parentIndex) {
        parentItem = rawItems.find(it => it.type === 'process' && String(it.index || '').trim() === parentIndex) || null;
      }

      const filtered = parentItem ? rawItems.filter(it => it !== parentItem) : [...rawItems];

      // Sort order:
      // 1. Exact match with typed index
      // 2. Direct/descendant children of typed index (e.g. 1.2.x)
      // 3. Siblings sharing parent of typed index (e.g. 1.1, 1.3)
      // 4. Other items
      const isChild = (idx) => idx && (idx === typedIndex || idx.startsWith(typedIndex + '.'));
      const isSibling = (idx) => {
        if (!idx || isChild(idx)) return false;
        if (!parentIndex) {
          // If typed index has no dots (e.g. '1'), siblings are single-part numbers (e.g. '2')
          return !idx.includes('.');
        }
        const p = idx.split('.').slice(0, -1).join('.');
        return p === parentIndex;
      };

      const children = [];
      const siblings = [];
      const others = [];

      filtered.forEach(item => {
        const idx = String(item.index || '').trim();
        if (isChild(idx)) {
          children.push(item);
        } else if (isSibling(idx)) {
          siblings.push(item);
        } else {
          others.push(item);
        }
      });

      displayItems = [...children, ...siblings, ...others];
    }

    updateMentionHeader(activeMentionTrigger, mentionIsLoading, parentItem);
    mentionCurrentItems = displayItems;
    mentionList.replaceChildren();
    if (!mentionCurrentItems.length) {
      mentionSelectedIndex = -1;
      const emptyDiv = document.createElement('div');
      emptyDiv.className = 'fiona-ai-mention-empty';
      emptyDiv.style.padding = '10px 12px';
      emptyDiv.style.textAlign = 'center';
      emptyDiv.style.color = '#94a3b8';
      emptyDiv.style.fontSize = '12px';
      emptyDiv.textContent = q ? `Tidak ada hasil untuk "${q}"` : 'Tidak ada data ditemukan';
      mentionList.appendChild(emptyDiv);
      mentionPopup.hidden = false;
      return;
    }

    mentionCurrentItems.forEach((item, index) => {
      const div = document.createElement('div');
      const isProcess = item.type === 'process';
      div.className = `fiona-ai-mention-item${isProcess ? ' is-process' : ''}${item.disabled ? ' is-disabled' : ''}${index === 0 ? ' is-selected' : ''}`;
      if (isProcess) {
        const level = Number(item.level);
        const displayLevel = Number.isFinite(level) ? level : String(item.index || '').split('.').filter(Boolean).length;
        const levelBadge = document.createElement('span');
        levelBadge.className = 'fiona-ai-mention-item-level';
        levelBadge.classList.add(`level-${Math.min(6, Math.max(1, displayLevel || 1))}`);
        levelBadge.textContent = `L${displayLevel || '-'}`;
        div.appendChild(levelBadge);
      }
      div.setAttribute('role', 'option');
      div.setAttribute('tabindex', '-1');
      const label = document.createElement('span');
      label.className = 'fiona-ai-mention-item-label';

      if (item.type === 'position') {
        highlightMatches(item.label, q).forEach(node => label.appendChild(node));
      } else {
        if (item.index) {
          const code = document.createElement('code');
          code.className = 'fiona-index-number';
          code.textContent = item.index;
          label.appendChild(code);
          label.appendChild(document.createTextNode(' '));
        }

        const descSpan = document.createElement('span');
        descSpan.className = 'fiona-ai-mention-item-desc';
        // Indent business process description by level only in hierarchy mode
        if (isHierarchyMode) {
          const level = Number(item.level);
          const displayLevel = Number.isFinite(level) ? level : String(item.index || '').split('.').filter(Boolean).length;
          const indentPadding = Math.max(0, (displayLevel - 1) * 12);
          if (indentPadding > 0) {
            descSpan.style.paddingLeft = `${indentPadding}px`;
          }
        }
        highlightMatches(item.label, q).forEach(node => descSpan.appendChild(node));
        label.appendChild(descSpan);
      }
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
        if (!item.disabled) selectMentionItem(item);
      });
      mentionList.appendChild(div);
    });
    setMentionSelectedIndex(0);
    mentionPopup.hidden = false;
  }

  function selectMentionItem(item) {
    if (!item || item.disabled) return;
    insertInlineChip(item, savedMentionRange);
  }

  function updateContextSelectionBar() {
    const { contextModal } = deps;
    if (!contextModal) return;
    const bar = contextModal.querySelector('#fionaAiContextSelectionBar');
    const badge = contextModal.querySelector('#fionaAiSelectedCountBadge');
    if (!bar || !badge) return;
    const count = selectedContextEntities.size;
    badge.textContent = String(count);
    bar.hidden = count === 0;
  }

  function renderInspector(item) {
    const { contextModal } = deps;
    if (!contextModal) return;
    const emptyBox = contextModal.querySelector('#fionaAiInspectorEmpty');
    const contentBox = contextModal.querySelector('#fionaAiInspectorContent');
    if (!emptyBox || !contentBox) return;
    if (!item) {
      emptyBox.hidden = false;
      contentBox.hidden = true;
      contentBox.replaceChildren();
      return;
    }
    emptyBox.hidden = true;
    contentBox.hidden = false;
    contentBox.replaceChildren();

    const hero = document.createElement('div');
    hero.className = 'inspector-hero';

    const badges = document.createElement('div');
    badges.className = 'inspector-hero-badges';
    if (item.index) {
      const idxCode = document.createElement('code');
      idxCode.className = 'fiona-index-number';
      idxCode.textContent = item.index;
      badges.appendChild(idxCode);
    }
    if (item.level) {
      const lvlSpan = document.createElement('span');
      lvlSpan.className = 'fiona-ai-mention-item-level level-' + Math.min(6, Math.max(1, Number(item.level)));
      lvlSpan.textContent = 'Level ' + item.level;
      badges.appendChild(lvlSpan);
    }
    if (item.code) {
      const codeSpan = document.createElement('span');
      codeSpan.className = 'inspector-code-pill';
      codeSpan.textContent = item.code;
      badges.appendChild(codeSpan);
    }
    hero.appendChild(badges);

    const titleH = document.createElement('h3');
    titleH.className = 'inspector-title';
    titleH.textContent = item.label;
    hero.appendChild(titleH);
    contentBox.appendChild(hero);

    // Input Section
    const inSection = document.createElement('div');
    const inLabel = document.createElement('div');
    inLabel.className = 'inspector-section-label';
    inLabel.textContent = 'Input / Masukan:';
    const inBox = document.createElement('div');
    inBox.className = 'inspector-io-box';
    if (item.input && item.input.trim()) {
      const inTag = document.createElement('span');
      inTag.className = 'fiona-io-tag is-input';
      inTag.textContent = item.input.trim();
      inBox.appendChild(inTag);
    } else {
      const noIn = document.createElement('span');
      noIn.style.color = '#94a3b8';
      noIn.style.fontSize = '12px';
      noIn.textContent = 'Tidak ada artefak masukan spesifik.';
      inBox.appendChild(noIn);
    }
    inSection.append(inLabel, inBox);
    contentBox.appendChild(inSection);

    // Output Section
    const outSection = document.createElement('div');
    const outLabel = document.createElement('div');
    outLabel.className = 'inspector-section-label';
    outLabel.textContent = 'Output / Keluaran:';
    const outBox = document.createElement('div');
    outBox.className = 'inspector-io-box';
    if (item.output && item.output.trim()) {
      const outTag = document.createElement('span');
      outTag.className = 'fiona-io-tag is-output';
      outTag.textContent = item.output.trim();
      outBox.appendChild(outTag);
    } else {
      const noOut = document.createElement('span');
      noOut.style.color = '#94a3b8';
      noOut.style.fontSize = '12px';
      noOut.textContent = 'Tidak ada artefak keluaran spesifik.';
      outBox.appendChild(noOut);
    }
    outSection.append(outLabel, outBox);
    contentBox.appendChild(outSection);

    // Hierarchy Section
    const hierSection = document.createElement('div');
    const hierLabel = document.createElement('div');
    hierLabel.className = 'inspector-section-label';
    hierLabel.textContent = 'Hierarki Relasi:';
    const hierBox = document.createElement('div');
    hierBox.className = 'inspector-hierarchy-box';
    hierBox.textContent = item.parentIndexNumber ? 'Induk Proses: ' + item.parentIndexNumber : 'Proses Utama / Root';
    hierSection.append(hierLabel, hierBox);
    contentBox.appendChild(hierSection);

    // Action button
    const actionBtn = document.createElement('button');
    actionBtn.type = 'button';
    actionBtn.className = 'inspector-action-btn';
    actionBtn.textContent = '＋ Masukkan ke Pesan Fiona';
    actionBtn.addEventListener('click', () => {
      addContextEntity(item);
      closeContextModal();
    });
    contentBox.appendChild(actionBtn);
  }

  function openContextModal(tab = 'process') {
    const { contextModal, tabPosition, tabProcess, contextSearch, contextMenu, contextAddBtn } = deps;
    if (!contextModal) return;
    contextModalActiveTab = 'process';
    if (contextMenu) contextMenu.hidden = true;
    contextAddBtn?.setAttribute('aria-expanded', 'false');
    if (tabPosition && tabProcess) {
      tabPosition.classList.remove('is-active');
      tabPosition.setAttribute('aria-selected', 'false');
      tabProcess.classList.add('is-active');
      tabProcess.setAttribute('aria-selected', 'true');
    }
    if (contextSearch) contextSearch.value = '';
    const searchClear = contextModal.querySelector('#fionaAiContextSearchClear');
    if (searchClear) searchClear.hidden = true;
    selectedContextEntities.clear();
    updateContextSelectionBar();
    renderInspector(null);
    deps.contextList?.replaceChildren();
    if (deps.contextSuggestions) { deps.contextSuggestions.replaceChildren(); deps.contextSuggestions.hidden = true; }
    if (deps.contextDidYouMean) deps.contextDidYouMean.hidden = true;
    if (deps.contextOverview) deps.contextOverview.hidden = true;
    if (contextModal.showModal) contextModal.showModal();
    else contextModal.hidden = false;
    if (contextSearch) contextSearch.focus();
    loadContextModalResults('');
  }

  function closeContextModal() {
    const { contextModal, input } = deps;
    if (!contextModal) return;
    if (contextModal.close) contextModal.close();
    else contextModal.hidden = true;
    input?.focus();
  }

  async function loadContextModalResults(query) {
    const { contextList, contextLoading, contextEmpty, contextOverview, contextDidYouMean, contextModal } = deps;
    if (!contextList) return;
    renderContextSuggestions([]);
    if (contextLoading) contextLoading.hidden = false;
    if (contextEmpty) contextEmpty.hidden = true;
    contextList.replaceChildren();

    const countLabel = contextModal?.querySelector('#fionaAiContextResultCount');
    if (countLabel) countLabel.textContent = 'Memuat proses bisnis...';

    const levels = contextModalActiveLevel === 'all' ? null : [Number(contextModalActiveLevel)];
    let result;
    try { result = await advancedSearch(query, 'process', levels); }
    catch (_) { result = { items: [] }; }
    const items = Array.isArray(result.items) ? result.items : [];
    contextCurrentResults = items;

    if (contextLoading) contextLoading.hidden = true;
    if (!items.length) {
      if (contextEmpty) contextEmpty.hidden = false;
      if (countLabel) countLabel.textContent = '0 proses bisnis ditemukan';
      renderInspector(null);
      return;
    }

    if (countLabel) {
      countLabel.textContent = 'Menampilkan ' + items.length + ' proses bisnis';
    }

    if (contextDidYouMean) {
      contextDidYouMean.hidden = !result.didYouMean;
      if (result.didYouMean) {
        contextDidYouMean.replaceChildren();
        const iconSpan = document.createElement('span');
        iconSpan.className = 'did-you-mean-icon';
        iconSpan.textContent = '🔍';
        const textSpan = document.createElement('span');
        textSpan.textContent = 'Apa yang kamu maksud: ';
        const queryBtn = document.createElement('button');
        queryBtn.type = 'button';
        queryBtn.className = 'did-you-mean-query';
        queryBtn.textContent = result.didYouMean;
        queryBtn.addEventListener('click', () => {
          if (deps.contextSearch) deps.contextSearch.value = result.didYouMean;
          loadContextModalResults(result.didYouMean);
        });
        contextDidYouMean.append(iconSpan, textSpan, queryBtn);
      }
    }
    if (contextOverview) {
      contextOverview.hidden = !result.overview;
      if (result.overview) {
        contextOverview.replaceChildren();
        const badge = document.createElement('div');
        badge.className = 'overview-badge';
        badge.innerHTML = '<span class="overview-sparkle">✨</span> Ringkasan Rekomendasi Fiona';
        const body = document.createElement('div');
        body.className = 'overview-body';
        body.textContent = result.overview;
        contextOverview.append(badge, body);
      }
    }

    contextFocusedItem = items[0];
    renderInspector(items[0]);

    items.forEach((item, index) => {
      const card = document.createElement('div');
      const itemKey = item.id || item.key || item.label;
      const isChecked = selectedContextEntities.has(itemKey);
      card.className = 'fiona-ai-context-card' + (item.disabled ? ' is-disabled' : '') + (index === 0 ? ' is-focused' : '') + (isChecked ? ' is-checked' : '');
      card.setAttribute('role', 'option');
      card.setAttribute('tabindex', '0');

      // Checkbox container for multi-select
      const checkWrap = document.createElement('div');
      checkWrap.className = 'fiona-ai-context-checkbox-wrap';
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'fiona-ai-context-checkbox';
      checkbox.checked = isChecked;
      checkbox.setAttribute('aria-label', 'Pilih proses ' + item.label);
      checkbox.addEventListener('click', (e) => {
        e.stopPropagation();
      });
      checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
          selectedContextEntities.set(itemKey, item);
          card.classList.add('is-checked');
        } else {
          selectedContextEntities.delete(itemKey);
          card.classList.remove('is-checked');
        }
        updateContextSelectionBar();
      });
      checkWrap.appendChild(checkbox);

      const info = document.createElement('div');
      info.className = 'fiona-ai-context-card-info';

      // Breadcrumb path
      if (item.parentIndexNumber) {
        const bc = document.createElement('div');
        bc.className = 'fiona-ai-context-card-breadcrumb';
        bc.textContent = '📁 Induk: ' + item.parentIndexNumber;
        info.appendChild(bc);
      }

      // Title row with index code & level
      const title = document.createElement('div');
      title.className = 'fiona-ai-context-card-title';
      if (item.index) {
        const idx = document.createElement('code');
        idx.className = 'fiona-index-number';
        idx.textContent = item.index;
        title.appendChild(idx);
      }
      const labelText = document.createElement('span');
      labelText.textContent = item.label;
      title.appendChild(labelText);
      if (item.level) {
        const lvl = document.createElement('span');
        lvl.className = 'fiona-ai-mention-item-level level-' + Math.min(6, Math.max(1, Number(item.level)));
        lvl.textContent = 'L' + item.level;
        title.appendChild(lvl);
      }
      info.appendChild(title);

      // Meta row
      const meta = document.createElement('div');
      meta.className = 'fiona-ai-context-card-meta';
      if (item.code) {
        const codeSpan = document.createElement('span');
        codeSpan.textContent = 'Kode: ' + item.code;
        meta.appendChild(codeSpan);
      }
      if (item.input) {
        const inSpan = document.createElement('span');
        const shortIn = item.input.length > 25 ? item.input.slice(0, 25) + '…' : item.input;
        inSpan.textContent = '· In: ' + shortIn;
        meta.appendChild(inSpan);
      }
      if (item.output) {
        const outSpan = document.createElement('span');
        const shortOut = item.output.length > 25 ? item.output.slice(0, 25) + '…' : item.output;
        outSpan.textContent = '· Out: ' + shortOut;
        meta.appendChild(outSpan);
      }
      info.appendChild(meta);

      // Quick action button
      const selectBtn = document.createElement('button');
      selectBtn.type = 'button';
      selectBtn.className = 'fiona-ai-context-card-btn';
      selectBtn.textContent = '＋ Pilih';
      selectBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        addContextEntity(item);
        closeContextModal();
      });

      card.append(checkWrap, info, selectBtn);

      // Click card to inspect
      card.addEventListener('click', () => {
        contextList.querySelectorAll('.fiona-ai-context-card').forEach(c => c.classList.remove('is-focused'));
        card.classList.add('is-focused');
        contextFocusedItem = item;
        renderInspector(item);
      });

      contextList.appendChild(card);
    });
  }

  function renderContextSuggestions(items) {
    const host = deps.contextSuggestions;
    if (!host) return;
    host.replaceChildren();
    const list = Array.isArray(items) ? items : [];
    host.hidden = !list.length;
    if (!list.length) return;

    const labelSpan = document.createElement('span');
    labelSpan.className = 'context-suggestions-label';
    labelSpan.textContent = '💡 Rekomendasi:';
    host.appendChild(labelSpan);

    const pillsWrap = document.createElement('div');
    pillsWrap.className = 'context-suggestions-pills';

    list.forEach(item => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'fiona-ai-context-suggestion';
      button.textContent = item.label || item.query;
      button.title = item.query || item.label || '';
      button.addEventListener('click', () => {
        if (deps.contextSearch) deps.contextSearch.value = item.query || item.label || '';
        host.hidden = true;
        loadContextModalResults(deps.contextSearch?.value || '');
      });
      pillsWrap.appendChild(button);
    });
    host.appendChild(pillsWrap);
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

      // DO NOT forcefully hide mentionPopup if it's already shown!
      // This prevents the flickering appear/disappear cycle on every keystroke.
      // Instead, keep it open and update the header with loading indicator.
      const sourceContext = typeof deps.getContext === 'function' ? deps.getContext() : {};
      const source = typeof deps.rasciCacheSource === 'function' ? deps.rasciCacheSource(sourceContext) : { id: 'master' };
      const sourceId = source?.id || 'master';
      const cacheKey = `${type}:${sourceId}:${query.toLowerCase()}`;

      if (mentionCache.has(cacheKey)) {
        clearTimeout(mentionSearchTimer);
        mentionSearchController?.abort();
        mentionSearchController = null;
        setMentionLoading(false);
        renderMentionPopup(mentionCache.get(cacheKey), trigger);
        return;
      }

      setMentionLoading(true);

      const seq = ++mentionSearchSeq;
      clearTimeout(mentionSearchTimer);
      mentionSearchController?.abort();
      mentionSearchController = null;
      mentionSearchTimer = setTimeout(async () => {
        const controller = new AbortController();
        mentionSearchController = controller;
        try {
          const items = await searchEntities(query, trigger.type, controller.signal);
          if (
            seq === mentionSearchSeq &&
            mentionSearchController === controller &&
            !controller.signal.aborted &&
            activeMentionTrigger &&
            activeMentionTrigger.char === char &&
            activeMentionTrigger.query === query
          ) {
            mentionCache.set(cacheKey, items);
            setMentionLoading(false);
            renderMentionPopup(items, trigger);
          }
        } catch (_) {
          // fetch aborted or failed
        } finally {
          if (mentionSearchController === controller) {
            mentionSearchController = null;
            if (seq === mentionSearchSeq) setMentionLoading(false);
          }
        }
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
      contextAddBtn, contextMenu, contextModalClose, contextCancel, tabPosition, tabProcess,
      contextSearch, contextSearchButton, contextSuggestions, contextDidYouMean, contextOverview,
      messages, input, form, mentionPopup, mentionList
    } = deps;

    checkEditorEmpty();

    // Bind Context Modal Events
    contextAddBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!contextMenu) return openContextModal('process');
      const show = contextMenu.hidden;
      contextMenu.hidden = !show;
      contextAddBtn.setAttribute('aria-expanded', show ? 'true' : 'false');
    });
    document.addEventListener('click', (e) => {
      if (contextMenu && !contextMenu.hidden && !contextAddBtn?.contains(e.target) && !contextMenu.contains(e.target)) {
        contextMenu.hidden = true;
        contextAddBtn?.setAttribute('aria-expanded', 'false');
      }
    });
    contextMenu?.querySelectorAll('[data-context-type]').forEach(button => {
      button.addEventListener('click', () => {
        if (button.disabled || button.classList.contains('is-disabled')) return;
        openContextModal(button.dataset.contextType || 'process');
      });
    });
    contextModalClose?.addEventListener('click', closeContextModal);
    contextCancel?.addEventListener('click', closeContextModal);
    tabPosition?.addEventListener('click', () => {
      // Jabatan tab disabled
    });
    tabProcess?.addEventListener('click', () => {
      if (contextModalActiveTab === 'process') return;
      contextModalActiveTab = 'process';
      loadContextModalResults(contextSearch?.value || '');
    });

    // Level filter pills
    const levelFilters = deps.contextModal?.querySelector('#fionaAiContextLevelFilters');
    levelFilters?.querySelectorAll('.fiona-filter-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        levelFilters.querySelectorAll('.fiona-filter-pill').forEach(p => p.classList.remove('is-active'));
        pill.classList.add('is-active');
        contextModalActiveLevel = pill.dataset.level || 'all';
        loadContextModalResults(contextSearch?.value || '');
      });
    });

    // Clear search button
    const searchClear = deps.contextModal?.querySelector('#fionaAiContextSearchClear');
    searchClear?.addEventListener('click', () => {
      if (contextSearch) contextSearch.value = '';
      searchClear.hidden = true;
      loadContextModalResults('');
      contextSearch?.focus();
    });

    contextSearch?.addEventListener('input', () => {
      if (searchClear) searchClear.hidden = !contextSearch.value;
      clearTimeout(contextModalSearchTimer);
      contextModalSearchController?.abort();
      const controller = new AbortController();
      contextModalSearchController = controller;
      contextModalSearchTimer = setTimeout(() => {
        loadSuggestions(contextSearch.value, contextModalActiveTab, controller.signal).then(items => {
          if (!controller.signal.aborted) renderContextSuggestions(items);
        });
      }, 200);
    });
    contextSearchButton?.addEventListener('click', () => {
      loadContextModalResults(contextSearch?.value || '');
    });
    contextSearch?.addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        event.preventDefault();
        contextSearchButton?.click();
      }
    });

    // Select all visible items button
    const selectAllBtn = deps.contextModal?.querySelector('#fionaAiContextSelectAllVisible');
    selectAllBtn?.addEventListener('click', () => {
      if (!contextCurrentResults.length) return;
      const allChecked = contextCurrentResults.every(it => selectedContextEntities.has(it.id || it.key || it.label));
      contextCurrentResults.forEach(it => {
        const key = it.id || it.key || it.label;
        if (allChecked) selectedContextEntities.delete(key);
        else selectedContextEntities.set(key, it);
      });
      deps.contextList?.querySelectorAll('.fiona-ai-context-card').forEach(c => {
        const cb = c.querySelector('.fiona-ai-context-checkbox');
        if (cb) {
          cb.checked = !allChecked;
          c.classList.toggle('is-checked', !allChecked);
        }
      });
      updateContextSelectionBar();
    });

    // Clear selection button
    const clearSelectionBtn = deps.contextModal?.querySelector('#fionaAiContextClearSelection');
    clearSelectionBtn?.addEventListener('click', () => {
      selectedContextEntities.clear();
      deps.contextList?.querySelectorAll('.fiona-ai-context-card').forEach(c => {
        const cb = c.querySelector('.fiona-ai-context-checkbox');
        if (cb) cb.checked = false;
        c.classList.remove('is-checked');
      });
      updateContextSelectionBar();
    });

    // Batch insert button
    const insertBatchBtn = deps.contextModal?.querySelector('#fionaAiContextInsertBatch');
    insertBatchBtn?.addEventListener('click', () => {
      if (selectedContextEntities.size === 0) return;
      selectedContextEntities.forEach(entity => {
        insertInlineChip(entity, null);
      });
      selectedContextEntities.clear();
      updateContextSelectionBar();
      closeContextModal();
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
      // Only navigation keys that don't trigger the 'input' event need scanning here
      if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
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
