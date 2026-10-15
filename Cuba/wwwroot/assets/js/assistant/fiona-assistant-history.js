(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.FionaAssistantHistory = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  let conversationItems = [];
  let historyLoadingState = false;
  let historyLoadVersion = 0;
  let conversationLoadVersion = 0;
  let historySearchDebounce = null;
  let deps = {};

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
    const { historyList, historySearch, historyEmpty, getConversationId } = deps;
    if (!historyList) return;
    historyList.replaceChildren();
    const filter = String(historySearch?.value || '').trim().toLowerCase();
    const filtered = conversationItems.filter(c => !filter || String(c.title || '').toLowerCase().includes(filter));
    const conversationId = typeof getConversationId === 'function' ? getConversationId() : null;

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
    const { historyLoading, historyList, requestJson } = deps;
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
    const {
      getConversationId, setConversationId, getBusy, getActiveController,
      messages, status, setChatBusy, showChatView, sidebar, syncEmpty,
      syncModelControl, setConversationModel, conversationModelFrom,
    add, renderRasciTable, renderJobDescriptionPreview, esc, vegaEmbed, scrollToLatest, rasci, input,
      requestJson
    } = deps;

    if (!id) return;
    const currentId = typeof getConversationId === 'function' ? getConversationId() : null;
    if (currentId === id && messages && messages.childElementCount > 0) {
      if (typeof showChatView === 'function') showChatView();
      if (sidebar) sidebar.classList.remove('is-open');
      return;
    }
    const busy = typeof getBusy === 'function' ? getBusy() : false;
    const activeController = typeof getActiveController === 'function' ? getActiveController() : null;
    if (busy && activeController) {
      activeController.abort();
    }
    const version = ++conversationLoadVersion;
    if (typeof setConversationId === 'function') setConversationId(id);
    if (typeof syncModelControl === 'function') syncModelControl();
    sessionStorage.setItem('fiona.ai.conversation', id);
    renderHistoryList();
    if (typeof showChatView === 'function') showChatView();
    if (sidebar) sidebar.classList.remove('is-open');

    if (messages) messages.innerHTML = '';
    if (typeof syncEmpty === 'function') syncEmpty();
    if (typeof setChatBusy === 'function') setChatBusy(true, false);
    if (status) {
      status.hidden = false;
      status.textContent = 'Memuat percakapan…';
    }

    try {
      const { data } = await requestJson(`/api/agent/conversations/${encodeURIComponent(id)}/messages?limit=50`, { method: 'GET' });
      if (version !== conversationLoadVersion) return;
      if (typeof setConversationModel === 'function' && typeof conversationModelFrom === 'function') {
        setConversationModel(conversationModelFrom(data));
      }
      if (messages) messages.innerHTML = '';
      if (data && Array.isArray(data.items)) {
        for (const msg of data.items) {
          if (msg.role === 'user') {
            if (typeof add === 'function') add('user', msg.markdown);
          } else {
            let artifactData = null;
            if (msg.artifact) {
              try {
                artifactData = typeof msg.artifact === 'string' ? JSON.parse(msg.artifact) : msg.artifact;
              } catch (_) {}
            }
            const bubble = typeof add === 'function' ? add('assistant', msg.markdown) : null;
            if (bubble && artifactData?.rasciTables?.length && typeof renderRasciTable === 'function') {
              artifactData.rasciTables.forEach(t => {
                if ((t.renderTarget === 'prosbis-hierarchy-viewer' || t.mode === 'prosbis_hierarchy') && typeof deps.renderProsbisHierarchy === 'function')
                  deps.renderProsbisHierarchy(bubble, t);
                else renderRasciTable(bubble, t);
              });
            }
            if (bubble && artifactData?.artifact?.type === 'jobDescriptionPreview' && typeof renderJobDescriptionPreview === 'function') {
              renderJobDescriptionPreview(bubble, artifactData.artifact);
            }
            if (bubble && artifactData?.citations?.length) {
              const citations = document.createElement('div');
              citations.className = 'fiona-ai-citations';
              const safeEsc = typeof esc === 'function' ? esc : (v => v == null ? '' : String(v));
              citations.innerHTML = '<strong>Sumber Referensi</strong><br>' + artifactData.citations.map((item, index) => `${index + 1}. ${safeEsc(item.title)} <small>(${safeEsc(item.sourceType)}:${safeEsc(item.sourceId)})</small>`).join('<br>');
              bubble.appendChild(citations);
            }
            const charts = msg.charts || artifactData?.charts || [];
            for (const spec of charts) {
              if (bubble) {
                const chart = document.createElement('div');
                chart.className = 'fiona-ai-chart';
                bubble.appendChild(chart);
                if (typeof vegaEmbed === 'function') await vegaEmbed(chart, spec, { actions: false });
                else if (window.vegaEmbed) await window.vegaEmbed(chart, spec, { actions: false });
              }
            }
          }
        }
      }
    } catch (err) {
      if (version !== conversationLoadVersion) return;
      if (err.status === 404) {
        if (typeof setConversationId === 'function') setConversationId(null);
        sessionStorage.removeItem('fiona.ai.conversation');
        conversationItems = conversationItems.filter(c => c.id !== id);
        renderHistoryList();
        if (typeof add === 'function') add('assistant', 'Percakapan ini sudah tidak tersedia.');
      } else if (err.status !== 401) {
        if (typeof add === 'function') add('assistant', 'Tidak dapat memuat pesan untuk percakapan ini.');
      }
    } finally {
      if (version === conversationLoadVersion) {
        if (status) status.hidden = true;
        if (typeof setChatBusy === 'function') setChatBusy(false, false);
        if (typeof syncEmpty === 'function') syncEmpty();
        if (typeof scrollToLatest === 'function') scrollToLatest();
        if (rasci && input) input.focus();
      }
    }
  }

  async function renameConversation(id, currentTitle) {
    const { requestJson } = deps;
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
    const { requestJson, getConversationId, startNewChat } = deps;
    if (!window.confirm('Delete this conversation? This cannot be undone.')) return;
    try {
      await requestJson(`/api/agent/conversations/${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
      conversationItems = conversationItems.filter(c => c.id !== id);
      renderHistoryList();
      const currentId = typeof getConversationId === 'function' ? getConversationId() : null;
      if (currentId === id && typeof startNewChat === 'function') {
        startNewChat();
      }
    } catch (err) {
      alert(err.message || 'Failed to delete conversation.');
    }
  }

  function init(options) {
    deps = options || {};
    const { historySearch, historyNew } = deps;

    historySearch?.addEventListener('input', () => {
      renderHistoryList();
      clearTimeout(historySearchDebounce);
      historySearchDebounce = setTimeout(() => {
        const q = String(historySearch.value || '').trim();
        loadHistory(q);
      }, 300);
    });

    historyNew?.addEventListener('click', () => {
      if (typeof deps.startNewChat === 'function') deps.startNewChat();
    });
  }

  function clearHistory() {
    conversationItems = [];
    if (deps.historyList) deps.historyList.replaceChildren();
    renderHistoryList();
  }

  return {
    init,
    getGroupKey,
    renderHistoryList,
    loadHistory,
    selectConversation,
    renameConversation,
    deleteConversation,
    clearHistory,
    getConversationItems: () => [...conversationItems],
    setConversationItems: (items) => { conversationItems = Array.isArray(items) ? [...items] : []; },
    getHistoryLoadVersion: () => historyLoadVersion,
    getConversationLoadVersion: () => conversationLoadVersion,
    bumpConversationLoadVersion: () => ++conversationLoadVersion
  };
});
