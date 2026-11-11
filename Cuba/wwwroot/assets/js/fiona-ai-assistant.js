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
  const artifactDialog = document.getElementById('fionaAiArtifactDialog');
  const artifactTitle = document.getElementById('fionaAiArtifactTitle');
  const artifactClose = document.getElementById('fionaAiArtifactClose');
  const artifactViews = document.getElementById('fionaAiArtifactViews');
  const artifactTabs = new Map();
  const mentionPopup = document.getElementById('fionaAiMentionPopup');
  const mentionList = document.getElementById('fionaAiMentionList');
  const mentionTags = document.getElementById('fionaAiMentionTags');
  const contextAddBtn = document.getElementById('fionaAiContextAdd');
  const contextMenu = document.getElementById('fionaAiContextMenu');
  const contextModal = document.getElementById('fionaAiContextModal');
  const contextModalClose = document.getElementById('fionaAiContextModalClose');
  const contextCancel = document.getElementById('fionaAiContextCancel');
  const tabPosition = document.getElementById('fionaAiTabPosition');
  const tabProcess = document.getElementById('fionaAiTabProcess');
  const contextSearch = document.getElementById('fionaAiContextSearch');
  const contextSearchButton = document.getElementById('fionaAiContextSearchButton');
  const contextSuggestions = document.getElementById('fionaAiContextSuggestions');
  const contextDidYouMean = document.getElementById('fionaAiContextDidYouMean');
  const contextOverview = document.getElementById('fionaAiContextOverview');
  const contextLoading = document.getElementById('fionaAiContextLoading');
  const contextList = document.getElementById('fionaAiContextList');
  const contextEmpty = document.getElementById('fionaAiContextEmpty');

  const api = (panel.dataset.apiUrl || '').replace(/\/$/, '');
  const rasci = /\/rasci(\/|$)/i.test(location.pathname);
  const queryConversationId = new URLSearchParams(location.search).get('conversationId');
  let conversationId = queryConversationId || sessionStorage.getItem('fiona.ai.conversation');
  let busy = false;
  let activeController = null;
  let lastRequest = null;
  let currentView = 'chat';
  let cachePreparationKey = null;
  let cachePreparationVersion = 0;
  let cacheStatusKind = 'idle';
  let cacheStatusLabel = '';
  let jdGroupingReviewSequence = 0;

  if (queryConversationId) sessionStorage.setItem('fiona.ai.conversation', queryConversationId);

  class FionaApiError extends Error {
    constructor(status, message) {
      super(message);
      this.name = 'FionaApiError';
      this.status = status;
    }
  }

  function token() { return localStorage.getItem('token') || ''; }

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

  // Modules reference (either via window namespace or global object)
  const Models = window.FionaAssistantModels;
  const Activity = window.FionaAssistantActivity;
  const History = window.FionaAssistantHistory;
  const Memory = window.FionaAssistantMemory;
  const Context = window.FionaAssistantContext;

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
    if (panel.classList.contains('is-open') && rasci && !busy) Context?.focusComposer();
  }

  function showMemoryView() {
    currentView = 'memory';
    chatContent.forEach(element => { if (element) element.hidden = true; });
    memoryPanel.hidden = false;
    renderRasciCacheStatus();
    Memory?.loadMemories();
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
    Models?.loadModelOptions().catch(() => {});
    panel.classList.add('is-open');
    panel.setAttribute('aria-hidden', 'false');
    backdrop.hidden = false;
    History?.loadHistory();
    if (conversationId && messages.childElementCount === 0) {
      History?.selectConversation(conversationId);
    } else if (rasci && !busy) {
      Context?.focusComposer();
    }
  }

  function shut() {
    closeArtifactDialog();
    showChatView();
    Memory?.closeMemoryEditor();
    if (sidebar) sidebar.classList.remove('is-open');
    panel.classList.remove('is-open');
    panel.setAttribute('aria-hidden', 'true');
    backdrop.hidden = true;
  }

  function startNewChat() {
    if (busy && activeController) activeController.abort();
    History?.bumpConversationLoadVersion();
    conversationId = null;
    Models?.clearConversationModel();
    lastRequest = null;
    sessionStorage.removeItem('fiona.ai.conversation');
    messages.innerHTML = '';
    syncEmpty();
    History?.renderHistoryList();
    if (currentView !== 'chat') showChatView();
    if (sidebar) sidebar.classList.remove('is-open');
    Models?.syncModelControl();
    if (rasci && !busy) Context?.focusComposer();
  }

  function closeArtifactDialog() {
    if (artifactDialog?.open) artifactDialog.close();
    artifactTabs.forEach(tab => tab.frame.remove());
    artifactTabs.clear();
  }

  artifactClose?.addEventListener('click', closeArtifactDialog);
  artifactDialog?.addEventListener('close', () => { if (!artifactDialog.open) closeArtifactDialog(); });

  function openScopeArtifactTab(artifact, originConversation, refresh = false) {
    if (!artifactDialog || !artifactViews) return null;
    const key = jdArtifactKey(artifact, originConversation);
    let tab = artifactTabs.get(key);
    let created = false;
    if (!tab) {
      if (refresh) return null;
      closeArtifactDialog();
      const frame = document.createElement('iframe');
      frame.className = 'fiona-ai-artifact-frame';
      artifactViews.appendChild(frame);
      tab = { frame }; artifactTabs.set(key, tab); created = true;
    }
    const name = artifact.type === 'jobDescriptionScopeReview' ? 'Cakupan RASCI' : artifact.type === 'jobDescriptionGroupingReview' ? 'Pengelompokan JD' : 'Pratinjau JD';
    const title = `${name}${artifact.jobName || artifact.target?.jobName ? ` · ${artifact.jobName || artifact.target.jobName}` : ''}${artifact.revision ? ` · r${artifact.revision}` : ''}`;
    artifactTitle.textContent = title;
    tab.frame.title = title;
    let restore = () => {};
    if (refresh && !created) {
      const view = tab.frame.contentWindow, doc = view.document;
      const focused = doc.activeElement;
      if (focused && /^(TEXTAREA|INPUT)$/.test(focused.tagName)) {
        if (!tab.pendingRefresh) focused.addEventListener('blur', () => { const latest = tab.pendingRefresh; tab.pendingRefresh = null; if (latest) tab.refresh?.(latest); }, {once:true});
        if (!tab.pendingRefresh || jdArtifactOrder(artifact) >= jdArtifactOrder(tab.pendingRefresh)) tab.pendingRefresh = artifact;
        return {view, created:false};
      }
      const scrollY = view.scrollY, openDetails = new Map([...doc.querySelectorAll('details')].map(x => [x.dataset.detailKey || x.querySelector('summary')?.textContent, x.open]));
      doc.head.replaceChildren(); doc.body.replaceChildren(); created = true;
      restore = () => { [...doc.querySelectorAll('details')].forEach(x => { const key = x.dataset.detailKey || x.querySelector('summary')?.textContent; if (openDetails.has(key)) x.open = openDetails.get(key); }); view.scrollTo(0, scrollY); };
    }
    if (!refresh && !artifactDialog.open) artifactDialog.showModal();
    return { view: tab.frame.contentWindow, created, tab, restore };
  }

  function clearMemoryState() {
    closeArtifactDialog();
    jdArtifacts.clear(); jdCards.clear();
    Memory?.clearMemoryState();
    History?.clearHistory();
    conversationId = null;
    Models?.clearConversationModel();
    sessionStorage.removeItem('fiona.ai.conversation');
    messages.innerHTML = '';
    syncEmpty();
    Models?.syncModelControl();
  }

  window.addEventListener('storage', event => {
    if (event.key === 'token' || event.key === 'userId') {
      clearMemoryState();
    }
  });

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
      return DOMPurify.sanitize(marked.parse(text || ''), {
        ADD_TAGS: ['rasci-table-viewer', 'fiona-rasci-matrix', 'ui-comparison-toolbar', 'ui-action-chips', 'ui-single-select', 'ui-multi-select', 'button'],
        ADD_ATTR: ['data-prompt', 'data-action-chip', 'data', 'mode', 'title', 'data-index', 'data-key', 'data-type', 'target', 'disabled']
      });
    }
    return '<p>' + esc(text || '').replace(/\n/g, '<br>') + '</p>';
  }

  function scrollToLatest() { messages.scrollTop = messages.scrollHeight; }

  function add(role, text) {
    const wrap = document.createElement('div');
    wrap.className = 'fiona-ai-message ' + role;
    const bubble = document.createElement('div');
    bubble.className = 'fiona-ai-bubble';
    let scopeSummary = null;
    if (role === 'user' && typeof text === 'string') {
      const marker = '\n\n[FIONA_SCOPE_REVIEW_SUMMARY]';
      const index = text.lastIndexOf(marker);
      if (index >= 0) {
        try { const parsed = JSON.parse(text.slice(index + marker.length)); if (Array.isArray(parsed.notes)) scopeSummary = parsed; } catch (_) {}
      }
    }
    if (scopeSummary) {
      bubble.classList.add('fiona-ai-scope-summary');
      const notes = scopeSummary.notes.map((note, index) => {
        const quote = String(note.quote || '');
        const shortQuote = quote.length > 180 ? quote.slice(0, 177).trimEnd() + '…' : quote;
        const quotation = quote.length > 180
          ? `<details><summary>${esc(shortQuote)} <span>Lihat selengkapnya</span></summary><p>${esc(quote)}</p></details>`
          : `<blockquote>${esc(quote)}</blockquote>`;
        return `<div class="fiona-ai-scope-summary-note"><strong>${index + 1}. ${esc(note.process || 'Bagian dokumen')}</strong>${quotation}<p><b>Catatan:</b> ${esc(note.text || '')}</p></div>`;
      }).join('');
      bubble.innerHTML = `<strong>Catatan tinjauan cakupan RASCI</strong><div class="fiona-ai-scope-summary-meta">${esc(scopeSummary.job || '')} · Revisi ${esc(String(scopeSummary.revision))} · ${scopeSummary.notes.length} catatan</div>${notes}`;
    } else bubble.innerHTML = role === 'assistant' ? markdown(text) : esc(text);
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

  const rasciRootPreloads = new Map();

  function remoteTablePayload(table, sourceId) {
    const isDescriptor = Boolean(table.renderTarget || table.sourceId || table.positionKeys || table.processIds);
    const isRemote = isDescriptor || table.renderMode === 'virtual' || table.renderMode === 'remote' || table.mode === 'remote' || Boolean(table.remote);
    const payload = { ...table, draftRasciId: sourceId, sourceId };
    if (!isRemote) return { payload, remote: null, isDescriptor: false };

    const remote = {
      ...(table.remote || {}),
      endpoint: table.remote?.endpoint || `${api}/api/agent/rasci-tables/${encodeURIComponent(sourceId)}`,
      positionKeys: table.positionKeys || [],
      processIds: table.processIds || [],
      jobIds: table.jobIds || [],
      mode: table.mode || null,
      pageSize: table.remote?.pageSize || 100
    };
    payload.mode = 'remote';
    payload.renderMode = 'remote';
    payload.remote = { ...remote, rootPreloaded: false };
    payload.rows = isDescriptor
      ? []
      : (table.rows || []).filter(row => row.parentId == null && row.parentBusinessProcessId == null);
    payload.columns = isDescriptor ? [] : (table.columns || []);
    return { payload, remote, isDescriptor };
  }

  function rasciRootUrl(remote) {
    const url = new URL(remote.endpoint, window.location.href);
    for (const key of (Array.isArray(remote.positionKeys) ? remote.positionKeys : [])) {
      if (key != null && String(key).trim()) url.searchParams.append('positionKey', String(key));
    }
    for (const id of (Array.isArray(remote.processIds) ? remote.processIds : [])) {
      if (id != null && String(id).trim()) url.searchParams.append('processId', String(id));
    }
    for (const id of (Array.isArray(remote.jobIds) ? remote.jobIds : [])) {
      if (id != null && String(id).trim()) url.searchParams.append('jobId', String(id));
    }
    if (remote.mode && remote.mode !== 'remote') url.searchParams.set('mode', String(remote.mode));
    url.searchParams.set('limit', String(remote.pageSize || 100));
    url.searchParams.set('rootOnly', 'true');
    return url;
  }

  function preloadRasciRoot(payload, remote) {
    if (!remote) return Promise.resolve({ rows: payload.rows || [], columns: payload.columns || [] });
    const url = rasciRootUrl(remote);
    const cacheKey = url.toString();
    if (rasciRootPreloads.has(cacheKey)) return rasciRootPreloads.get(cacheKey);
    const headers = { Accept: 'application/json' };
    const bearer = token();
    if (bearer) headers.Authorization = `Bearer ${bearer}`;
    const request = fetch(url, {
      credentials: 'same-origin',
      headers
    }).then(async response => {
      if (!response.ok) throw new Error(`Unable to load RASCI rows (${response.status})`);
      const result = await response.json();
      if (Array.isArray(result)) return { rows: result, columns: [] };
      return {
        ...result,
        rows: Array.isArray(result?.rows) ? result.rows : (Array.isArray(result?.items) ? result.items : []),
        columns: Array.isArray(result?.columns) ? result.columns : []
      };
    }).catch(error => {
      rasciRootPreloads.delete(cacheKey);
      throw error;
    });
    rasciRootPreloads.set(cacheKey, request);
    return request;
  }

  function rasciCardAction(label, className, handler, title) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `fiona-ai-rasci-action ${className}`;
    button.textContent = label;
    button.title = title || label;
    button.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      handler?.(event);
    });
    return button;
  }

  function rasciSummaryCounts(table) {
    const processCount = Number(table?.totalRows ?? table?.totalrows ?? table?.rows?.length ?? 0);
    const jobCount = Number(table?.totalColumns ?? table?.totalcolumns ?? table?.columns?.length ?? 0);
    return `${Number.isFinite(processCount) ? processCount : 0} processes · ${Number.isFinite(jobCount) ? jobCount : 0} jobs`;
  }

  function renderRasciTable(parent, table) {
    const sourceId = table.sourceId || table.draftRasciId || '';
    const descriptor = remoteTablePayload(table, sourceId);
    const card = document.createElement('details');
    card.className = 'fiona-ai-rasci-card';
    const summary = document.createElement('summary');
    summary.className = 'fiona-ai-rasci-summary';
    const title = document.createElement('span');
    title.className = 'fiona-ai-rasci-title';
    title.textContent = table.title || 'RASCI matrix';
    const counts = document.createElement('span');
    counts.className = 'fiona-ai-rasci-counts';
    counts.hidden = true;
    const summaryLoading = document.createElement('span');
    summaryLoading.className = 'fiona-ai-rasci-summary-loading';
    summaryLoading.setAttribute('role', 'status');
    summaryLoading.setAttribute('aria-live', 'polite');
    const summarySpinner = document.createElement('span');
    summarySpinner.className = 'fiona-ai-rasci-spinner';
    summarySpinner.setAttribute('aria-hidden', 'true');
    summaryLoading.append(summarySpinner, document.createTextNode('Memuat…'));
    const actions = document.createElement('span');
    actions.className = 'fiona-ai-rasci-actions';
    actions.append(
      rasciCardAction('Buka', 'fiona-ai-rasci-open', () => { card.open = true; }, 'Buka tabel RASCI'),
      // This action is intentionally enabled but has no navigation yet.
      rasciCardAction('Buka di tabel RASCI Utama', 'fiona-ai-rasci-main-action', () => {}, 'Buka di tabel RASCI utama')
    );
    summary.append(title, counts, summaryLoading, actions);
    const body = document.createElement('div');
    body.className = 'fiona-ai-table-wrap fiona-ai-rasci-wrap';
    card.append(summary, body);
    parent.appendChild(card);

    const loading = document.createElement('div');
    loading.className = 'fiona-ai-rasci-loading';
    loading.setAttribute('role', 'status');
    loading.setAttribute('aria-live', 'polite');
    loading.setAttribute('aria-busy', 'true');
    const spinner = document.createElement('span');
    spinner.className = 'fiona-ai-rasci-spinner';
    spinner.setAttribute('aria-hidden', 'true');
    loading.append(spinner, document.createTextNode('Memuat matriks RASCI…'));
    body.appendChild(loading);

    const mount = root => {
      const matrix = document.createElement('fiona-rasci-matrix');
      const matrixPayload = {
        ...descriptor.payload,
        // The surrounding collapsed card already presents the table title.
        hideToolbarTitle: true,
        hideToolbar: true,
        rows: root.rows || descriptor.payload.rows || [],
        columns: root.columns?.length ? root.columns : (descriptor.payload.columns || [])
      };
      counts.textContent = rasciSummaryCounts(root);
      counts.hidden = false;
      if (matrixPayload.remote) matrixPayload.remote = { ...matrixPayload.remote, rootPreloaded: Boolean(descriptor.remote) };
      matrix.data = matrixPayload;
      matrix.addEventListener('fiona-rasci-error', event => {
        body.dataset.error = event.detail?.error?.message || 'Unable to load RASCI matrix';
      });
      body.replaceChildren(matrix);
      summaryLoading.hidden = true;
    };

    const hasRootPayload = !descriptor.remote || (!descriptor.isDescriptor && descriptor.payload.rows.length > 0);
    if (hasRootPayload) {
      mount({ rows: descriptor.payload.rows || [], columns: descriptor.payload.columns || [] });
      return card;
    }
    preloadRasciRoot(descriptor.payload, descriptor.remote).then(mount).catch(error => {
      summaryLoading.replaceChildren();
      summaryLoading.classList.add('is-error');
      summaryLoading.textContent = 'Gagal memuat';
      loading.replaceChildren();
      loading.classList.add('is-error');
      loading.setAttribute('aria-busy', 'false');
      loading.textContent = error?.message || 'Unable to load RASCI matrix';
      body.dataset.error = loading.textContent;
    });
    return card;
  }

  function renderProsbisHierarchy(parent, descriptor) {
    const processId = Number(descriptor?.processIds?.[0]);
    const sourceId = String(descriptor?.sourceId || descriptor?.draftRasciId || '').trim();
    if (!sourceId || !Number.isInteger(processId) || processId <= 0) return null;
    const card = document.createElement('details');
    card.className = 'fiona-ai-rasci-card fiona-ai-prosbis-hierarchy-card';
    const summary = document.createElement('summary');
    summary.className = 'fiona-ai-rasci-summary';
    const title = document.createElement('span');
    title.className = 'fiona-ai-rasci-title';
    title.textContent = descriptor.title || 'Hierarki Prosbis';
    const actions = document.createElement('span');
    actions.className = 'fiona-ai-rasci-actions';
    actions.append(rasciCardAction('Buka', 'fiona-ai-rasci-open', () => { card.open = true; }, 'Buka hierarki Prosbis'));
    summary.append(title, actions);
    const body = document.createElement('div');
    body.className = 'fiona-ai-table-wrap fiona-ai-prosbis-hierarchy-wrap';
    const hierarchy = document.createElement('fiona-prosbis-hierarchy');
    hierarchy.data = { sourceId, processId, endpoint: `${api}/api/agent/prosbis-hierarchy/${encodeURIComponent(sourceId)}/${processId}`, token: token(), defer: true };
    hierarchy.addEventListener('fiona-prosbis-hierarchy-error', event => {
      body.dataset.error = event.detail?.error?.message || 'Unable to load business-process hierarchy';
    });
    body.appendChild(hierarchy);
    card.append(summary, body);
    parent.appendChild(card);
    card.addEventListener('toggle', () => { if (card.open) hierarchy.load(); });
    return card;
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
    (data.rasciTables || []).forEach(table => {
      if (table.renderTarget === 'prosbis-hierarchy-viewer' || table.mode === 'prosbis_hierarchy') renderProsbisHierarchy(bubble, table);
      else renderRasciTable(bubble, table);
    });
    renderJdArtifact(bubble, data.artifact);
    if (data.citations?.length) {
      const citations = document.createElement('div');
      citations.className = 'fiona-ai-citations';
      citations.innerHTML = '<strong>Sumber Referensi</strong><br>' + data.citations.map((item, index) => `${index + 1}. ${esc(item.title)} <small>(${esc(item.sourceType)}:${esc(item.sourceId)})</small>`).join('<br>');
      bubble.appendChild(citations);
    }
    if (!options?.skipTrace && data.trace?.length) {
      const trace = document.createElement('div');
      trace.className = 'fiona-ai-trace';
      trace.textContent = data.trace.map(item => `${Activity?.sanitizeFriendlyLabel(item.tool, item.tool, 'complete', 'id')}: ${Activity?.sanitizeFriendlySummary(item.summary, item.tool, 'complete', 'id')}`).join(' · ');
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
        sendMessage(data.continuation.continueMessage || 'Lanjutkan', true, lastRequest);
      });
      row.append(question, continueButton);
      bubble.appendChild(row);
    }
    scrollToLatest();
  }

  function renderJobDescriptionPreviewContent(parent, preview) {
    if (!parent || !preview) return null;
    const card = document.createElement('section');
    card.className = 'fiona-ai-jd-preview';
    card.setAttribute('aria-label', 'Pratinjau Job Description');
    const title = document.createElement('h3');
    title.textContent = preview.status === 'applied' ? 'Job Description tersimpan' : 'Pratinjau Job Description';
    card.appendChild(title);
    if (preview.reviewStatus === 'needs_confirmation' || preview.reviewStatus === 'needs_revision') {
      const reviewStatus = document.createElement('p');
      reviewStatus.className = 'fiona-ai-jd-preview-review-status';
      reviewStatus.setAttribute('role', 'status');
      reviewStatus.textContent = preview.reviewStatus === 'needs_confirmation'
        ? 'Perlu konfirmasi: periksa catatan cakupan dan temuan sebelum menggunakan JD ini.'
        : 'Perlu revisi: periksa temuan pada catatan sebelum menggunakan JD ini.';
      card.appendChild(reviewStatus);
    }
    if (preview.status === 'applied' && typeof preview.openUrl === 'string' &&
        preview.openUrl.startsWith('/job-description/detail?')) {
      const link = document.createElement('a');
      link.className = 'btn btn-primary fiona-ai-open-jd';
      link.href = preview.openUrl;
      link.textContent = 'Open JD';
      card.appendChild(link);
    }
    if (preview.target) {
      const target = document.createElement('p');
      target.className = 'fiona-ai-jd-preview-target';
      target.textContent = `${preview.target.jobName || 'N/A'} · ${preview.target.organization || 'N/A'}`;
      card.appendChild(target);
    }
    if (Array.isArray(preview.scopeReviewItems) && preview.scopeReviewItems.length) {
      const details = document.createElement('details');
      details.className = 'fiona-ai-jd-preview-scope';
      const summary = document.createElement('summary'); summary.textContent = 'Lihat dasar cakupan RASCI'; details.appendChild(summary);
      const labels = { main: 'Tugas utama', generic: 'Tanggung jawab umum', incorrect: 'Tidak sesuai untuk JD ini', unresolved: 'Belum diputuskan' };
      preview.scopeReviewItems.forEach(item => {
        const entry = document.createElement('p');
        const text = String(item.summary || ''); const marker = ' | Assignment note: '; const at = text.indexOf(marker);
        const onlyNote = /^Assignment note: /i.test(text);
        const source = onlyNote ? text.slice('Assignment note: '.length) : at < 0 ? 'Tidak tersedia' : text.slice(at + marker.length);
        const process = onlyNote ? 'Nama proses tidak tersedia' : at < 0 ? text : text.slice(0, at);
        entry.textContent = `${item.processCode || ''} · ${item.notation || ''} · ${labels[item.decision] || 'Perlu ditinjau'} — ${process}. Komentar sumber: ${source}${item.clarification ? `. Klarifikasi pengguna: ${item.clarification}` : ''}`;
        details.appendChild(entry);
      });
      card.appendChild(details);
    }
    (Array.isArray(preview.sections) ? preview.sections : []).forEach(section => {
      const block = document.createElement('section');
      block.className = 'fiona-ai-jd-section';
      block.dataset.sectionId = String(section.key || section.number || section.title || 'section');
      const heading = document.createElement('h4');
      heading.textContent = `${section.number || ''}. ${section.title || ''}`.trim();
      block.appendChild(heading);
      if (section.mutedText) {
        const muted = document.createElement('p');
        muted.className = 'fiona-ai-jd-muted';
        muted.textContent = String(section.mutedText);
        block.appendChild(muted);
      }
      if (section.kind === 'table' || section.kind === 'rowHeaderTable') appendJdTable(block, section);
      else if (section.kind === 'text') appendJdText(block, section.text);
      else if (section.kind === 'organizationChart') appendJdOrganizationChart(block, section.chart, section.emptyMessage || 'Data struktur organisasi belum tersedia.');
      else if (section.kind === 'segregatedList') {
        (Array.isArray(section.groups) ? section.groups : []).forEach(group => {
          const groupTitle = document.createElement('h5');
          groupTitle.textContent = group.title || '';
          block.appendChild(groupTitle);
          if (group.kind === 'table') appendJdTable(block, group);
          else appendJdList(block, group.items);
        });
      } else appendJdList(block, section.items);
      card.appendChild(block);
    });
    appendJdNumberedNotes(card, 'Catatan', preview.footnotes);
    appendJdNumberedNotes(card, 'Referensi', preview.references || preview.citations, true);
    parent.appendChild(card);
    return card;
  }

  let jdOrgChartRendererPromise = null;
  function ensureJdOrganizationChartRenderer() {
    if (typeof renderJdOrganizationChart === 'function') return Promise.resolve(true);
    if (jdOrgChartRendererPromise) return jdOrgChartRendererPromise;
    const assistantScript = Array.from(document.scripts).find(script => /fiona-ai-assistant\.js/.test(script.src));
    if (!assistantScript) return Promise.resolve(false);
    const asset = path => new URL(path, assistantScript.src).toString();
    const scripts = [
      asset('organization-structure/js-d3-chart/d3.v7.min.js'),
      asset('organization-structure/js-d3-chart/d3-org-chart.js'),
      asset('organization-structure/js-d3-chart/d3-flextree.js'),
      asset('job-description/d3-chart.js')
    ];
    jdOrgChartRendererPromise = scripts.reduce((chain, src) => chain.then(() => new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = () => reject(new Error('Unable to load organization chart renderer'));
      document.head.appendChild(script);
    })), Promise.resolve()).then(() => typeof renderJdOrganizationChart === 'function');
    return jdOrgChartRendererPromise;
  }

  function appendJdOrganizationChart(parent, chartData, emptyMessage) {
    const container = document.createElement('div');
    container.className = 'fiona-ai-jd-org-chart';
    container.setAttribute('role', 'img');
    container.setAttribute('aria-label', 'Struktur organisasi');
    parent.appendChild(container);

    container.setAttribute('aria-busy', 'true');
    container.setAttribute('role', 'group');
    const loading = document.createElement('div');
    loading.className = 'fiona-ai-rasci-loading';
    loading.setAttribute('role', 'status');
    loading.setAttribute('aria-live', 'polite');
    const spinner = document.createElement('span');
    spinner.className = 'fiona-ai-rasci-spinner';
    spinner.setAttribute('aria-hidden', 'true');
    loading.append(spinner, 'Memuat struktur organisasi…');
    container.appendChild(loading);

    const finishLoading = () => {
      container.replaceChildren();
      container.setAttribute('aria-busy', 'false');
      container.setAttribute('role', 'img');
    };
    const showUnavailable = () => {
      finishLoading();
      container.textContent = emptyMessage;
      container.classList.add('fiona-ai-jd-org-chart-empty');
    };
    const nodes = Array.isArray(chartData?.nodes) ? chartData.nodes : [];
    if (nodes.length) {
      Promise.resolve().then(async () => {
        try {
          if (!await ensureJdOrganizationChartRenderer()) { showUnavailable(); return; }
          finishLoading();
          renderJdOrganizationNodes(container, nodes, chartData.selected || {});
        } catch (_) { showUnavailable(); }
      });
      return;
    }

    // Chart data is fetched from the exact source captured in the approved
    // proposal. A missing position in a linked draft stays missing; it never
    // silently switches to master or another draft.
    if (!chartData?.source || !chartData?.selected?.jobId || !chartData?.selected?.prlOrg) {
      showUnavailable();
      return;
    }
    Promise.resolve(requestJson('/api/organization-structure/chart/job-description', {
      method: 'POST', body: JSON.stringify({
      sourceKind: chartData.source.kind,
      sourceDraftId: chartData.source.draftId,
      jobId: chartData.selected.jobId,
      prlOrg: chartData.selected.prlOrg
      })
    })).then(async envelope => {
        const result = envelope?.data;
        const rows = Array.isArray(result?.nodes) ? result.nodes : [];
        if (result?.available !== true || !rows.length) { showUnavailable(); return; }
        if (!await ensureJdOrganizationChartRenderer()) { showUnavailable(); return; }
        finishLoading();
        renderJdOrganizationNodes(container, rows, result.selected || chartData.selected);
      })
      .catch(showUnavailable);
  }

  function renderJdOrganizationNodes(container, nodes, selected) {
    const list = Array.isArray(nodes) ? nodes : [];
    const matched = list.find(node => {
      if (String(node?.id_position || '') === String(selected.jobId || '') &&
          String(node?.prl || '') === String(selected.prlOrg || '')) return true;
      for (let index = 1; index <= 20; index++) {
        if (String(node?.[`bc_${index}_id_position`] || '') === String(selected.jobId || '') &&
            String(node?.[`bc_${index}_prl`] || '') === String(selected.prlOrg || '')) return true;
      }
      return false;
    });
    if (!matched || typeof renderJdOrganizationChart !== 'function') {
      container.textContent = 'Data struktur organisasi belum tersedia.';
      container.classList.add('fiona-ai-jd-org-chart-empty');
      return;
    }
    if (!renderJdOrganizationChart(container, list, selected)) {
      container.textContent = 'Data struktur organisasi belum tersedia.';
      container.classList.add('fiona-ai-jd-org-chart-empty');
      return;
    }
  }

  const jdArtifacts = new Map();
  const jdCards = new Map();
  function jdArtifactKey(artifact, origin) {
    const stage = {jobDescriptionScopeReview:'scope', jobDescriptionGroupingReview:'grouping', jobDescriptionPreview:'preview'}[artifact.type];
    const session = artifact.reviewSessionId || artifact.contextToken;
    return JSON.stringify([origin, artifact.artifactId || (session && stage ? `jd:${session}:${stage}` : `${artifact.type}:${artifact.proposalId || ''}`)]);
  }
  function jdArtifactOrder(artifact) { return typeof artifact.version === 'number' && Number.isFinite(artifact.version) ? artifact.version : Number(artifact.revision) || 0; }
  function rememberJdArtifact(artifact, origin) {
    const key = jdArtifactKey(artifact, origin), previous = jdArtifacts.get(key);
    if (!previous || jdArtifactOrder(artifact) >= jdArtifactOrder(previous)) {
      if (previous && artifact.type === 'jobDescriptionPreview' && artifact.proposalId === previous.proposalId && !artifact.sections?.length) artifact = {...previous, ...artifact, sections:previous.sections};
      jdArtifacts.set(key, artifact);
    }
    return jdArtifacts.get(key);
  }
  function latestJdArtifact(artifact, origin) { return jdArtifacts.get(jdArtifactKey(artifact, origin)) || artifact; }
  function loadJdNotes(storage, prefix, origin, artifact) {
    const base = `${prefix}:${origin}:${artifact.contextToken}:`;
    const stage = {jobDescriptionScopeReview:'scope', jobDescriptionGroupingReview:'grouping', jobDescriptionPreview:'preview'}[artifact.type];
    const session = artifact.reviewSessionId || artifact.contextToken;
    const key = `${prefix}:${origin}:${artifact.artifactId || (stage ? `jd:${session}:${stage}` : session)}`;
    const alias = `${prefix}:${origin}:${artifact.contextToken}`;
    const notes = [], seen = new Set();
    const revision = jdArtifactOrder(artifact);
    const revisionKey = key + ':revision';
    let previousRevision = null;
    try {
      const stored = storage.getItem(revisionKey);
      if (stored != null) previousRevision = Number(stored);
      if (previousRevision != null && revision > previousRevision) {
        storage.setItem(key, '[]');
        // Mark legacy entries as consumed so a new revision cannot restore them.
        const oldKeys = [];
        for (let i = 0; i < storage.length; i++) {
          const oldKey = storage.key(i);
          if (oldKey === alias || oldKey.startsWith(base)) oldKeys.push(oldKey);
        }
        storage.setItem(key + ':migrated', JSON.stringify(oldKeys));
      }
      if (previousRevision == null || revision > previousRevision) storage.setItem(revisionKey, String(revision));
    } catch (_) {}
    let migrated = []; try { migrated = JSON.parse(storage.getItem(key + ':migrated') || '[]'); } catch (_) {}
    if (!Array.isArray(migrated)) migrated = [];
    const add = note => {
      if (!note || typeof note !== 'object') return;
      const fingerprint = JSON.stringify([note.id, note.quote, note.text, note.segments]);
      if (!seen.has(fingerprint)) { seen.add(fingerprint); notes.push(note); }
    };
    try {
      for (let i = 0; i < storage.length; i++) {
        const oldKey = storage.key(i);
        if (oldKey !== key && ((oldKey !== alias && !oldKey.startsWith(base)) || migrated.includes(oldKey))) continue;
        const value = JSON.parse(storage.getItem(oldKey) || '[]');
        if (Array.isArray(value)) value.forEach(add);
        else if (value && typeof value === 'object') Object.entries(value).forEach(([id, text]) => {
          if (typeof text === 'string' && text.trim()) add({id: `legacy-${id}`, itemId:id, field:'process', quote:'', text, legacyRow:true});
        });
        if (oldKey !== key) migrated.push(oldKey);
      }
      storage.setItem(key, JSON.stringify(notes));
      storage.setItem(key + ':migrated', JSON.stringify(migrated));
    } catch (_) {}
    return { key, notes };
  }
  async function resolveJdArtifact(artifact, origin) {
    if (!artifact.contextToken) return latestJdArtifact(artifact, origin);
    const token = encodeURIComponent(artifact.contextToken);
    let path = artifact.type === 'jobDescriptionScopeReview' ? `/api/agent/jd-scope-reviews/${token}` :
      artifact.type === 'jobDescriptionGroupingReview' ? `/api/agent/jd-groupings/${token}` :
      `/api/agent/conversations/${encodeURIComponent(origin)}/jd-previews/${encodeURIComponent(artifact.reviewSessionId || artifact.contextToken)}/latest`;
    try {
      const { data } = await requestJson(path, { method: 'GET' });
      const state = artifact.type === 'jobDescriptionPreview' ? data?.artifact : data;
      if (!state) throw new Error('missing artifact');
      return rememberJdArtifact({ ...artifact, readOnly: false, ...state, type: artifact.type }, origin);
    } catch (_) {
      return { ...latestJdArtifact(artifact, origin), readOnly: true };
    }
  }
  function jdCardStatus(artifact) {
    if (artifact.readOnly) return 'Hanya baca';
    if (artifact.stale) return 'Perlu ditinjau ulang';
    if (artifact.status === 'applied') return 'Tersimpan';
    if (artifact.reviewStatus === 'needs_revision') return 'Perlu revisi';
    if (artifact.reviewStatus === 'needs_confirmation') return 'Perlu konfirmasi';
    return artifact.confirmed ? 'Disetujui' : 'Menunggu persetujuan';
  }
  function jdCardMetadata(artifact) {
    const revision = artifact.type !== 'jobDescriptionPreview' && artifact.revision != null ? `Revisi ${artifact.revision}` : '';
    return [artifact.jobName || artifact.target?.jobName, revision, jdCardStatus(artifact)].filter(Boolean).join(' · ');
  }
  async function sendJdReviewNotes(entries, origin, send, status, makeMessage) {
    if (!entries.length) { status.textContent = 'Tambahkan komentar sebelum mengirim.'; return; }
    if (conversationId !== origin) { status.textContent = 'Buka kembali percakapan asal sebelum mengirim catatan.'; return; }
    if (busy) { status.textContent = 'Tunggu Fiona menyelesaikan respons saat ini.'; return; }
    send.disabled = true;
    try { showChatView(); await sendMessage(makeMessage(entries), false, null, null, closeArtifactDialog); }
    catch (_) { status.textContent = 'Catatan belum terkirim. Coba lagi.'; }
    finally { send.disabled = false; }
  }
  function createJdDocumentCard(parent, title, job, status, actionLabel, open) {
    const card = document.createElement('section');
    card.className = 'fiona-ai-jd-document-card';
    const heading = document.createElement('h3'); heading.textContent = title;
    const meta = document.createElement('p'); meta.className = 'fiona-ai-jd-document-meta';
    meta.textContent = [job, status].filter(Boolean).join(' · ');
    const link = document.createElement('a'); link.href = '#'; link.className = 'fiona-ai-jd-document-action'; link.textContent = actionLabel;
    link.onclick = event => { event.preventDefault(); return open(); };
    card.append(heading, meta, link); parent.appendChild(card); return card;
  }

  function renderJobDescriptionPreview(parent, preview) {
    if (!parent || !preview) return null;
    const origin = conversationId;
    const title = preview.status === 'applied' ? 'Job Description tersimpan' : 'Pratinjau Job Description';
    const status = jdCardStatus(preview);
    return createJdDocumentCard(parent, title, preview.target?.jobName, status, 'Buka dokumen', async () => { await openPreview(false); });
    async function openPreview(refresh, incoming) {
      preview = incoming || await resolveJdArtifact(preview, origin);
      const opened = openScopeArtifactTab(preview, origin, refresh);
      if (!opened?.view || !opened.created) return;
      const doc = opened.view.document;
      const { add, content, send, status, sidebar, plus } = createFionaReviewDocument(doc, title);
      if (preview.readOnly) { doc.body.classList.add('read-only'); send.disabled = true; status.textContent = 'Konteks tidak tersedia; versi tersimpan hanya dapat dibaca.'; }
      renderJobDescriptionPreviewContent(content, preview);
      const { key, notes } = loadJdNotes(opened.view.localStorage, 'fiona-preview-notes', origin, preview);
      const fields = new Map();
      content.querySelectorAll('.fiona-ai-jd-section').forEach(section => {
        section.querySelectorAll('h4, h5, p, li, th, td').forEach((element, index) => {
          [...element.childNodes].filter(node => node.nodeType === 3 && node.textContent.trim()).forEach((node, part) => {
            const span = doc.createElement('span'); span.textContent = node.textContent; node.replaceWith(span);
            const fieldKey = `preview:${section.dataset.sectionId}:${index}:${part}`;
            fields.set(fieldKey, {element: span, text: span.textContent, key: fieldKey});
          });
        });
      });
      notes.forEach(note => { if (!note.segments?.every(segment => fields.has(segment.key))) note.unanchored = true; });
      const persist = () => { try { opened.view.localStorage.setItem(key, JSON.stringify(notes)); } catch (_) {} };
      attachFionaReviewComments({doc, view:opened.view, content, sidebar, plus, add, fields, notes, itemsById:new Map(), persist});
      opened.tab.refresh = incoming => openPreview(true, incoming); opened.restore();
      send.onclick = async () => {
        const entries = notes.filter(note => note.text?.trim());
        const message = `Catatan untuk pratinjau JD (konteks ${preview.contextToken || ''}):\n\n` + entries.map(note => `- Kutipan: ${note.quote}\n  Komentar: ${note.text.trim()}`).join('\n') + '\n\nTerapkan hanya perubahan yang dinyatakan pada bagian terkait.';
        await sendJdReviewNotes(entries, origin, send, status, () => message);
      };
    }
  }

  function renderJdArtifact(parent, artifact) {
    if (!artifact) return null;
    const key = jdArtifactKey(artifact, conversationId), previous = jdArtifacts.get(key);
    artifact = rememberJdArtifact(artifact, conversationId);
    if (previous && artifact !== previous) {
      artifactTabs.get(key)?.refresh?.(artifact);
      for (const card of jdCards.get(key) || []) {
        const meta = card.querySelector('.fiona-ai-jd-document-meta');
        if (meta) meta.textContent = jdCardMetadata(artifact);
      }
    }
    const renderers = { jobDescriptionPreview: renderJobDescriptionPreview, jobDescriptionScopeReview: renderJobDescriptionScopeReview, jobDescriptionGroupingReview: renderJobDescriptionGroupingReview };
    const card = renderers[artifact.type]?.(parent, artifact) || null;
    if (card) { if (!jdCards.has(key)) jdCards.set(key, new Set()); jdCards.get(key).add(card); }
    return card;
  }

  function createFionaReviewDocument(doc, title) {
    doc.title = title;
    const style = doc.createElement('style');
    style.textContent = `
      *{box-sizing:border-box}body{margin:0;background:#e9edf3;color:#172033;font:15px/1.5 system-ui,sans-serif}
      .review-layout{display:grid;grid-template-columns:minmax(0,1fr) 300px;gap:24px;align-items:start;max-width:1700px;margin:0 auto;padding:16px 32px 32px}
      .review-page{min-width:0;min-height:calc(100vh - 64px);padding:40px;background:#fff;box-shadow:0 2px 14px #24334d20}
      h1{font-size:22px;margin:0 0 8px}p{margin:6px 0 12px}table{border-collapse:collapse;width:100%;min-width:700px;font-size:14px;line-height:1.45}
      th,td{border:1px solid #d7dce5;padding:7px;text-align:left;vertical-align:top}th{background:#e7edf6}tbody tr.hierarchy-odd{background:#f2f6fc}tbody tr.hierarchy-even{background:#fff}
      tbody tr.grouping-shaded > td{background:#f2f6fc}tbody tr.grouping-unshaded > td{background:#fff}
      button{background:#2457c5;color:white;border:0;border-radius:6px;padding:8px 12px;font:inherit;cursor:pointer}.scroll{overflow-x:auto}.comments{position:relative;min-height:150px}.comments h2{font-size:15px;margin:0;color:#34445f}
      .comment{position:absolute;width:100%;padding:14px;background:#fff;border:1px solid #d5deed;border-radius:8px;box-shadow:0 2px 8px #24334d12;overflow-wrap:anywhere}
      .comment:focus-within{border-color:#7297df;box-shadow:0 0 0 2px #cbdafa}.comment-heading{font-size:12px;font-weight:700;color:#344d7a;margin-bottom:6px}
      .comment blockquote{margin:0 0 10px;padding-left:9px;border-left:3px solid #cbd7ec;color:#596b85;font-size:12px;line-height:1.45}
      .comment textarea{display:block;width:100%;min-height:64px;padding:8px;border:1px solid #cbd5e3;border-radius:5px;resize:vertical;font:inherit;color:#172033}
      .comment .quick-decisions{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 8px}.comment .quick-decisions button{padding:5px 8px;border:1px solid #b8c9e4;border-radius:5px;background:#f5f8ff;color:#284b82;font-size:12px}.comment .quick-decisions button[aria-pressed=true]{background:#dce9ff;border-color:#7297df}
      .comment button{background:transparent;color:#61718a;padding:6px 0 0;font-size:12px}.review-actions{position:sticky;top:0;z-index:9;display:flex;align-items:center;gap:12px;padding:5px 32px;background:#fff;border-bottom:1px solid #d5deed;box-shadow:0 2px 8px #24334d12;color:#52627a}.review-actions button{padding:5px 10px;font-size:13px}.review-actions p{font-size:12px;margin:0}.review-actions [role=status]:empty{display:none}
      .read-only .add-comment{display:none}.read-only .comments{pointer-events:none}.read-only .comments textarea{background:#f4f6f9}
      .add-comment{position:fixed;z-index:10;border-radius:50%;width:32px;height:32px;padding:0;font-size:21px;box-shadow:0 2px 8px #888}.add-comment[hidden]{display:none}
      mark{background:#ffec9f;border-bottom:2px solid #e6ad24;cursor:pointer}.hierarchy{display:inline-block;color:#5471a9;margin-right:5px}.process-name{display:inline-block;max-width:100%}
      .fiona-ai-jd-preview h3,.fiona-ai-jd-section h4{margin:18px 0 8px}.fiona-ai-jd-section{margin:22px 0}.fiona-ai-jd-preview table{width:100%;min-width:0}.fiona-ai-jd-preview ul{padding-left:22px}.fiona-ai-jd-muted{color:#596b85}
      .grouping-descendant{white-space:nowrap;color:#36598d}.grouping-reason-button{display:block;margin-top:8px;font-size:12px}.grouping-reason{font-size:12px;color:#34445f}.comment.unanchored{border-style:dashed}
      @media(max-width:850px){.review-layout{display:block;padding:16px}.review-page{padding:20px;min-height:0}.comments{margin-top:24px}.comment{position:relative;top:auto!important;margin-top:12px}.review-actions{padding:5px 16px;flex-wrap:wrap}.review-actions p{flex:1 1 200px}}
    `;
    doc.head.appendChild(style);
    const add = (parentNode, tag, value) => { const node = doc.createElement(tag); if (value != null) node.textContent = value; parentNode.appendChild(node); return node; };
    const actions = add(doc.body, 'div'); actions.className = 'review-actions';
    const send = add(actions, 'button', 'Kirim catatan ke Fiona'); send.type = 'button';
    const status = add(actions, 'p'); status.setAttribute('role', 'status');
    const layout = add(doc.body, 'div'); layout.className = 'review-layout';
    const content = add(layout, 'article'); content.className = 'review-page';
    const sidebar = add(layout, 'aside'); sidebar.className = 'comments'; add(sidebar, 'h2', 'Komentar');
    const plus = add(doc.body, 'button', '+'); plus.type = 'button'; plus.className = 'add-comment'; plus.hidden = true; plus.setAttribute('aria-label', 'Tambahkan komentar pada teks terpilih');
    return { add, send, status, content, sidebar, plus };
  }

  function attachFionaReviewComments({ doc, view, content, sidebar, plus, add, fields, notes, itemsById, persist, quickDecisions = false }) {
    view.__fionaReviewDispose?.();
    let selection = null;
    notes.forEach(note => {
      const segments = note.segments || [];
      if (!segments.length) { note.unanchored = true; return; }
      const valid = segments.every(segment => { const field = fields.get(segment.key); return field && segment.end <= field.text.length && (!segment.text || field.text.slice(segment.start, segment.end) === segment.text); });
      const excerpt = segments.map(segment => { const field = fields.get(segment.key); return field ? field.text.slice(segment.start, segment.end) : ''; }).join(segments.length > 1 ? ' · ' : '');
      note.unanchored = !valid || (segments.length === 1 && note.quote && !segments[0].text && excerpt !== note.quote);
    });
    function layoutComments() {
      let bottom = 38;
      const cards = [...sidebar.querySelectorAll('.comment')].map(card => ({card, anchor: doc.getElementById(card.dataset.anchor)}));
      cards.sort((a, b) => (a.anchor?.getBoundingClientRect().top ?? Infinity) - (b.anchor?.getBoundingClientRect().top ?? Infinity));
      cards.forEach(({card, anchor: mark}) => {
        const top = mark ? Math.max(bottom, mark.getBoundingClientRect().top - sidebar.getBoundingClientRect().top) : bottom;
        card.style.top = `${Math.max(38, top)}px`;
        bottom = Math.max(38, top) + card.offsetHeight + 12;
      });
      sidebar.style.minHeight = `${bottom}px`;
    }
    function renderComments() {
      sidebar.querySelectorAll('.comment').forEach(x => x.remove());
      for (const field of fields.values()) {
        field.element.textContent = '';
        const anchors = notes.filter(note => !note.unanchored).flatMap(note => (note.segments || []).map((segment, index) => ({ note, segment, index }))).filter(({ segment }) => segment.key === field.key && Number.isInteger(segment.start) && Number.isInteger(segment.end) && segment.start >= 0 && segment.end <= field.text.length && segment.end > segment.start);
        const boundaries = [...new Set([0, field.text.length, ...anchors.flatMap(x => [x.segment.start, x.segment.end])])].sort((a, b) => a - b);
        for (let i = 0; i < boundaries.length - 1; i++) {
        const start = boundaries[i], end = boundaries[i + 1];
        anchors.filter(x => x.segment.start === start && x.index === 0).forEach(({ note }) => { const anchor = add(field.element, 'span'); anchor.id = `scope-comment-${note.id}`; });
        const active = anchors.find(x => x.segment.start <= start && x.segment.end >= end);
        if (active) {
          const mark = add(field.element, 'mark', field.text.slice(start, end)); mark.title = 'Lihat komentar';
          mark.onclick = () => doc.getElementById(`scope-card-${active.note.id}`)?.scrollIntoView({ block: 'nearest' });
        } else field.element.appendChild(doc.createTextNode(field.text.slice(start, end)));
        }
      }
      notes.forEach(note => {
        if (!note.unanchored && !note.segments?.some(segment => fields.has(segment.key))) return;
        const card = add(sidebar, 'div'); card.className = note.unanchored ? 'comment unanchored' : 'comment'; card.id = `scope-card-${note.id}`; card.dataset.anchor = `scope-comment-${note.id}`;
        const relatedItems = (note.itemIds || []).map(id => itemsById.get(id)).filter(Boolean);
        add(card, 'div', relatedItems.length ? relatedItems.map(item => item.processCode || 'Proses').join(', ') : 'Bagian dokumen').className = 'comment-heading';
        const excerpt = note.unanchored ? String(note.quote || '') : (note.segments || []).map(segment => {
        const field = fields.get(segment.key);
        return field ? field.text.slice(segment.start, segment.end) : '';
        }).filter(Boolean).map(part => note.segments.length > 1 ? part.trim() : part).join(' · ') || String(note.quote || '').replace(/\s+/g, ' ').trim();
        add(card, 'blockquote', excerpt.length > 180 ? `${excerpt.slice(0, 177).trimEnd()}…` : excerpt);
        const input = add(card, 'textarea'); input.value = note.text || ''; input.maxLength = 4000; input.setAttribute('aria-label', `Komentar untuk ${note.quote}`); input.placeholder = 'Tulis komentar.';
        if (quickDecisions) {
        const quick = add(card, 'div'); quick.className = 'quick-decisions'; quick.setAttribute('aria-label', 'Keputusan cepat');
        const quickButtons = [];
        for (const decision of ['Tugas utama', 'Tanggung jawab umum']) {
        const button = add(quick, 'button', decision); button.type = 'button';
        button.setAttribute('aria-pressed', String(note.quickDecision === decision));
        quickButtons.push(button);
        button.onclick = () => {
          let remainder = input.value;
          if (note.quickDecision && (remainder === note.quickDecision || remainder.startsWith(note.quickDecision + '\n'))) remainder = remainder.slice(note.quickDecision.length).replace(/^\n/, '');
          note.quickDecision = decision;
          note.text = decision + (remainder.trim() ? `\n${remainder}` : '');
          input.value = note.text;
          quickButtons.forEach(b => b.setAttribute('aria-pressed', String(b === button)));
          persist(); layoutComments();
        };
        }
        }
        input.oninput = () => { note.text = input.value; if (note.quickDecision && input.value !== note.quickDecision && !input.value.startsWith(note.quickDecision + '\n')) { note.quickDecision = null; card.querySelectorAll('.quick-decisions button').forEach(b => b.setAttribute('aria-pressed', 'false')); } persist(); layoutComments(); };
        const remove = add(card, 'button', 'Hapus'); remove.type = 'button'; remove.onclick = () => { notes.splice(notes.indexOf(note), 1); persist(); renderComments(); };
      });
      layoutComments();
    }
    const onMouseUp = () => {
      const selected = view.getSelection();
      if (!selected || selected.rangeCount === 0 || selected.isCollapsed) { plus.hidden = true; return; }
      const range = selected.getRangeAt(0);
      if (!content.contains(range.startContainer) || !content.contains(range.endContainer)) { plus.hidden = true; return; }
      const quote = range.toString();
      const segments = [];
      for (const field of fields.values()) {
        if (!range.intersectsNode(field.element)) continue;
        let start = 0, end = field.text.length;
        if (field.element.contains(range.startContainer)) { const before = doc.createRange(); before.selectNodeContents(field.element); before.setEnd(range.startContainer, range.startOffset); start = before.toString().length; }
        if (field.element.contains(range.endContainer)) { const before = doc.createRange(); before.selectNodeContents(field.element); before.setEnd(range.endContainer, range.endOffset); end = before.toString().length; }
        if (end > start) segments.push({ key: field.key, start, end, text: field.text.slice(start, end) });
      }
      if (!quote.trim() || !segments.length) { plus.hidden = true; return; }
      const itemIds = [...new Set(segments.flatMap(segment => fields.get(segment.key)?.items?.map(item => item.id) || [fields.get(segment.key)?.item?.id]).filter(Boolean))];
      selection = { segments, itemIds, quote };
      const rect = range.getBoundingClientRect(); plus.style.left = `${Math.max(8, rect.right + 5)}px`; plus.style.top = `${Math.max(8, rect.top)}px`; plus.hidden = false;
    };
    doc.addEventListener('mouseup', onMouseUp);
    plus.onmousedown = event => event.preventDefault();
    plus.onclick = () => {
      if (!selection) return;
      const note = { ...selection, id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, text: '' };
      notes.push(note); selection = null; plus.hidden = true; view.getSelection()?.removeAllRanges(); persist(); renderComments();
      doc.getElementById(`scope-card-${note.id}`)?.querySelector('textarea')?.focus();
    };
    const onScroll = () => { plus.hidden = true; };
    view.addEventListener('resize', layoutComments); view.addEventListener('scroll', onScroll, { passive: true });
    doc.addEventListener('toggle', layoutComments, true);
    const observer = view.ResizeObserver ? new view.ResizeObserver(layoutComments) : null;
    observer?.observe(content);
    view.__fionaReviewDispose = () => { doc.removeEventListener('mouseup', onMouseUp); doc.removeEventListener('toggle', layoutComments, true); view.removeEventListener('resize', layoutComments); view.removeEventListener('scroll', onScroll); observer?.disconnect(); };
    renderComments();
  }

  function groupScopeItems(items) {
    const codes = new Set(items.map(x => String(x.processCode || '').trim()).filter(Boolean));
    const roots = new Map();
    for (const item of items) {
      const code = String(item.processCode || '').trim(), parts = code.split('.').filter(Boolean);
      let root = code || `unknown:${item.id}`;
      for (let n = 1; n < parts.length; n++) {
        const ancestor = parts.slice(0, n).join('.');
        if (codes.has(ancestor)) { root = ancestor; break; }
      }
      if (!roots.has(root)) roots.set(root, []);
      roots.get(root).push(item);
    }
    return [...roots].map(([root, members]) => {
      const categories = new Set(members.map(item => item.humanDecision ? item.decision :
        item.decision !== 'unresolved' ? item.decision : item.suggestion === 'generic' ? 'generic' : item.suggestion === 'main' ? 'main' : 'clarify'));
      const signature = JSON.stringify(members.map(item => [item.id, item.decision]).sort((a,b) => String(a[0]).localeCompare(String(b[0]))));
      const mixed = categories.size > 1;
      const acknowledged = mixed && !categories.has('clarify') && members.every(item => item.mixedAcknowledgement === signature);
      let category = mixed ? (acknowledged ? 'resolved' : 'clarify') : [...categories][0];
      if (category === 'incorrect') category = 'excluded';
      if (!['main', 'generic', 'resolved', 'excluded'].includes(category)) category = 'clarify';
      const lead = members.find(item => item.processCode === root) || members[0];
      return {root, members, lead, mixed, signature, category};
    });
  }

  function renderJobDescriptionScopeReview(parent, artifact) {
    if (!parent || !artifact || !Array.isArray(artifact.items) || !artifact.contextToken) return null;
    const originConversation = conversationId;
    const card = createJdDocumentCard(parent, 'Tinjauan cakupan RASCI', artifact.jobName, `Revisi ${artifact.revision} · ${jdCardStatus(artifact)}`, 'Buka dokumen', () => openScope());
    async function openScope(refresh = false, incoming = null) {
      artifact = incoming || await resolveJdArtifact(artifact, originConversation);
      const opened = openScopeArtifactTab(artifact, originConversation, refresh);
      if (!opened?.view) return;
      const view = opened.view;
      if (!opened.created) return;
      const doc = view.document;
      doc.title = 'Tinjauan cakupan RASCI';
      const { add, send, status, content, sidebar, plus } = createFionaReviewDocument(doc, 'Tinjauan cakupan RASCI');
      if (artifact.readOnly) { doc.body.classList.add('read-only'); send.disabled = true; status.textContent = 'Konteks tidak tersedia; versi tersimpan hanya dapat dibaca.'; }
      const titleText = add(content, 'h1', 'Tinjauan cakupan RASCI');
      const targetText = add(content, 'p', `Jabatan: ${artifact.jobName || 'Tidak tersedia'} · Unit: ${artifact.unitName || 'Tidak tersedia'} · Revisi: ${artifact.revision}`);
      const instructions = add(content, 'p', 'Pilih teks dan klik + untuk menambahkan catatan, lalu kirim ke Fiona.');
      const guideDetails = add(content, 'details'); add(guideDetails, 'summary', 'Panduan kategori');
      const guide = add(guideDetails, 'p', 'Tugas utama digunakan sebagai bahan JD. Tanggung jawab umum tidak dipilih sebagai tugas utama. Tidak sesuai berarti penugasan tidak cocok; perlu klarifikasi berarti belum diputuskan. Saran Fiona bukan keputusan akhir.');
      const fields = new Map();
      function registerField(element, key, item = null, name = key, items = null) {
        fields.set(key, { element, text: element.textContent, item, items, name, key });
      }
      const groups = groupScopeItems(artifact.items);
      const categories = [['main', 'Tugas utama'], ['generic', 'Tanggung jawab umum'], ['clarify', 'Perlu klarifikasi / tidak sesuai']];
      const categoryForItem = new Map();
      for (const group of groups) {
        for (const item of group.members) {
          const category = group.category === 'resolved'
            ? (item.decision === 'main' || item.decision === 'generic' ? item.decision : 'clarify')
            : (group.category === 'main' || group.category === 'generic' ? group.category : 'clarify');
          categoryForItem.set(item.id, category);
        }
      }
      const bodies = new Map();
      const headings = [];
      for (const [category, label] of categories) {
        const section = add(content, 'section');
        add(section, 'h2', label);
        const scroll = add(section, 'div'); scroll.className = 'scroll';
        const table = add(scroll, 'table'); const head = add(table, 'thead'); const heading = add(head, 'tr');
        const columns = ['Indeks', 'Notasi', 'Proses dan komentar'];
        if (category === 'clarify') columns.push('Keputusan saat ini', 'Saran dan alasan Fiona');
        columns.forEach(x => add(heading, 'th', x));
        headings.push(heading);
        bodies.set(category, add(table, 'tbody'));
      }
      const labels = { main: 'Tugas utama', generic: 'Tanggung jawab umum', incorrect: 'Tidak sesuai untuk JD ini', unresolved: 'Perlu klarifikasi' };
      const suggestions = { main: 'Siap digunakan', generic: 'Diduga tanggung jawab umum', clarify: 'Cakupan perlu diperjelas' };
      const { key, notes } = loadJdNotes(view.localStorage, 'fiona-scope-notes', originConversation, artifact);
      const saved = notes;
      [titleText, targetText, instructions, guide].forEach((element, index) => registerField(element, `document:${index}`));
      headings.forEach((heading, tableIndex) => [...heading.children].forEach((element, index) => registerField(element, `heading:${tableIndex}:${index}`)));
      const itemsById = new Map(artifact.items.map(item => [item.id, item]));
      const processCodes = new Set(artifact.items.map(item => String(item.processCode || '').trim()).filter(Boolean));
      const groupColors = new Map();
      const categoryCodes = new Map(categories.map(([category]) => [category, new Set(artifact.items.filter(item => categoryForItem.get(item.id) === category).map(item => String(item.processCode || '').trim()))]));
      const persist = () => { try { view.localStorage.setItem(key, JSON.stringify(notes)); } catch (_) {} };
      [...artifact.items].sort((a, b) => String(a.processCode || '').localeCompare(String(b.processCode || ''), undefined, { numeric: true })).forEach(item => {
        const category = categoryForItem.get(item.id);
        const row = add(bodies.get(category), 'tr');
        const codeCell = add(row, 'td'); const notationCell = add(row, 'td');
        const process = add(row, 'td');
        const parts = String(item.processCode || '').trim().split('.').filter(Boolean);
        const codes = categoryCodes.get(category);
        let root = parts.join('.') || `unknown:${item.id}`;
        for (let i = 1; i < parts.length; i++) {
          const ancestor = parts.slice(0, i).join('.');
          if (codes.has(ancestor)) { root = ancestor; break; }
        }
        if (!groupColors.has(category)) groupColors.set(category, new Map());
        const colors = groupColors.get(category);
        if (!colors.has(root)) colors.set(root, colors.size % 2);
        row.className = colors.get(root) ? 'hierarchy-odd' : 'hierarchy-even';
        let visibleAncestors = 0;
        for (let i = 1; i < parts.length; i++) if (processCodes.has(parts.slice(0, i).join('.'))) visibleAncestors++;
        const indentation = Math.min(visibleAncestors, 7) * 16;
        process.style.paddingLeft = `${7 + indentation}px`;
        process.style.position = 'relative';
        if (visibleAncestors) { const arrow = add(process, 'span', '↳'); arrow.className = 'hierarchy'; arrow.style.position = 'absolute'; arrow.style.left = `${indentation - 9}px`; arrow.setAttribute('aria-hidden', 'true'); }
        function field(cell, name, value) {
          const span = add(cell, 'span', value); span.className = 'process-name';
          span.dataset.commentField = name; span.dataset.itemId = item.id;
          registerField(span, `${item.id}:${name}`, item, name);
          return span;
        }
        field(codeCell, 'code', item.processCode || '—');
        field(notationCell, 'notation', item.notation || '—');
        field(process, 'process', item.summary || 'Nama proses tidak tersedia');
        if (category === 'clarify') {
          field(add(row, 'td'), 'decision', labels[item.decision] || labels.unresolved);
          field(add(row, 'td'), 'reason', `${suggestions[item.suggestion] || 'Perlu ditinjau'}${item.reason ? ` - ${item.reason}` : ''}${item.clarification ? ` · Klarifikasi: ${item.clarification}` : ''}`);
        }
        const group = groups.find(candidate => candidate.members[0] === item);
        if (group?.category === 'clarify' && group.mixed && group.members.every(member => member.decision !== 'unresolved' || (member.suggestion !== 'clarify' && !member.humanDecision)) && !artifact.readOnly) {
          const acknowledge = add(row.children[4], 'button', 'Ya, kategori campuran sesuai'); acknowledge.type = 'button';
          acknowledge.onclick = async () => {
            acknowledge.disabled = true;
            try {
              const { data } = await requestJson(`/api/agent/jd-scope-reviews/${encodeURIComponent(artifact.contextToken)}`, { method: 'PUT', body: JSON.stringify({revision: artifact.revision, decisions: group.members.map(member => ({id: member.id, decision: member.decision, mixedAcknowledgement: group.signature}))}) });
              Object.assign(artifact, data); rememberJdArtifact(artifact, originConversation);
              await openScope(true, artifact);
              showChatView();
              await sendMessage(`Kategori campuran telah saya akui. Panggil continue_ready_job_description_scope dengan konteks ${artifact.contextToken} dan revisi ${artifact.revision}; lanjutkan hanya jika cakupan siap.`, false);
            } catch (_) { status.textContent = 'Tidak dapat menyimpan; muat ulang tinjauan dan coba lagi.'; acknowledge.disabled = false; }
          };
        }
      });
      // Preserve notes written in the previous row-based review interface.
      if (!Array.isArray(saved) && saved && typeof saved === 'object') {
        Object.entries(saved).forEach(([id, text]) => { const field = fields.get(`${id}:process`); if (field && typeof text === 'string' && text.trim()) notes.push({ id: `legacy-${id}`, itemId: id, field: 'process', start: 0, end: field.text.length, quote: field.text, text }); });
        if (notes.length) persist();
      }
      // Older comments used offsets relative to one table cell.
      notes.forEach(note => {
        if (note.legacyRow) { const field = fields.get(`${note.itemId}:process`); if (field) { note.start = 0; note.end = field.text.length; note.quote = field.text; } else note.unanchored = true; delete note.legacyRow; }
        if (!Array.isArray(note.segments) && note.itemId && note.field) {
          note.segments = [{ key: `${note.itemId}:${note.field}`, start: note.start, end: note.end }];
          note.itemIds = [note.itemId];
        }
      });
      attachFionaReviewComments({ doc, view, content, sidebar, plus, add, fields, notes, itemsById, persist, quickDecisions: true });
      send.onclick = async () => {
        const entries = notes.filter(x => x.text?.trim());
        const message = `Catatan saya untuk tinjauan cakupan RASCI ${artifact.jobName || ''} (konteks ${artifact.contextToken}, revisi ${artifact.revision}):\n\n` + entries.map(note => { const related = (note.itemIds || []).map(id => itemsById.get(id)).filter(Boolean).map(item => `Proses ${item.processCode}, notasi ${item.notation}, ID ${item.id}`).join('; '); return `- ${related ? `${related}; ` : ''}kutipan: “${note.quote}”; komentar: ${note.text.trim()}`; }).join('\n') + '\n\nPada komentar cakupan, “utama” berarti tugas utama (main), dan “umum” berarti tanggung jawab umum (generic) untuk seluruh assignment yang dipilih. Jika komentar menjawab keraguan relevansi dengan membatasi proses pada fungsi jabatan, gunakan sebagai tugas utama dengan batas tersebut sebagai klarifikasi, kecuali saya menyatakan kategori lain. Jangan perluas ke assignment yang tidak dipilih. Tanyakan hanya bila maksudnya benar-benar bertentangan atau tidak jelas. Lanjutkan otomatis jika seluruh cakupan sudah jelas, kecuali komentar saya secara eksplisit meminta berhenti.';
        const summary = { job: artifact.jobName || '', revision: artifact.revision, notes: entries.map(note => ({
          process: (note.itemIds || []).map(id => itemsById.get(id)).filter(Boolean).map(item => `Proses ${item.processCode}`).join(', '),
          quote: note.unanchored ? note.quote : (note.segments || []).map(segment => { const field = fields.get(segment.key); return field ? field.text.slice(segment.start, segment.end).trim() : ''; }).filter(Boolean).join(' · ') || note.quote,
          text: note.text.trim()
        })) };
        const messageWithSummary = message + '\n\n[FIONA_SCOPE_REVIEW_SUMMARY]' + JSON.stringify(summary);
        await sendJdReviewNotes(entries, originConversation, send, status, () => messageWithSummary);
      };
      opened.tab.refresh = incoming => openScope(true, incoming); opened.restore();
      if (!refresh) view.focus();
    };
    return card;
  }

  function groupingMarkdown(artifact) {
    const cell = value => String(value ?? '').replace(/\\/g, '\\\\').replace(/\|/g, '\\|').replace(/[\r\n]+/g, ' ');
    if (!Array.isArray(artifact.groups) || !artifact.groups.length || !Array.isArray(artifact.items)) return null;
    const rows = ['# Review Pengelompokan Job Description', '', '| Kelompok | Indeks proses | Nama proses bisnis | RASCI | Catatan | Usulan tugas dan tanggung jawab |', '| --- | --- | --- | --- | --- | --- |'];
    const codes = new Set();
    for (const group of artifact.groups || []) for (const code of group.sourceCodes || []) {
      if (codes.has(String(code).toLowerCase())) return null;
      codes.add(String(code).toLowerCase());
      const item = (artifact.items || []).find(x => String(x.groupId).toLowerCase() === String(group.groupId).toLowerCase() && String(x.processCode).toLowerCase() === String(code).toLowerCase());
      if (!item) return null;
      const notes = item.notationEvidence?.length ? item.notationEvidence.flatMap(x => [x.note ? `${x.notation}: ${x.note}` : '', x.userScopeClarification ? `Klarifikasi pengguna ${x.notation}: ${x.userScopeClarification}` : '']).filter(Boolean) : item.notes || [];
      rows.push(`| ${cell(group.groupId)} | ${cell(code)} | ${cell(item.processName)} | ${cell((item.notations || []).join(', '))} | ${cell(notes.join('; '))} | ${cell(group.label)} |`);
    }
    return codes.size === artifact.items.length ? rows.join('\n') : null;
  }

  function decorateGroupingMarkdownTable(doc, page, artifact) {
    const rows = [...page.querySelectorAll('tbody tr')];
    const groups = Array.isArray(artifact.groups) ? artifact.groups : [];
    const items = Array.isArray(artifact.items) ? artifact.items : [];
    const expected = groups.flatMap(group => (group.sourceCodes || []).map(code => ({ group, id: String(group.groupId), code: String(code), label: String(group.label), item: items.find(x => String(x.groupId).toLowerCase() === String(group.groupId).toLowerCase() && String(x.processCode).toLowerCase() === String(code).toLowerCase()) })));
    if (!rows.length || rows.length !== expected.length || !rows.every((row, i) => expected[i].item && row.cells.length === 6 && row.cells[0].textContent.trim() === expected[i].id && row.cells[1].textContent.trim() === expected[i].code && row.cells[5].textContent.trim() === expected[i].label)) return false;
    const header = page.querySelector('thead th');
    if (header) header.textContent = 'No.';
    let groupNumber = 0;
    for (let i = 0; i < rows.length;) {
      let end = i + 1; while (end < rows.length && expected[end].id === expected[i].id) end++;
      rows[i].cells[0].textContent = String(++groupNumber);
      for (let j = i; j < end; j++) {
        rows[j].className = groupNumber % 2 === 0 ? 'grouping-shaded' : 'grouping-unshaded';
        const child = expected[j];
        if (!(child.item.notations || []).includes('A')) continue;
        const parents = expected.slice(i, end).filter(x => x !== child && (x.item.notations || []).includes('R') && child.code.toLowerCase().startsWith(x.code.toLowerCase() + '.')).sort((a, b) => b.code.length - a.code.length);
        if (!parents.length) continue;
        const index = rows[j].cells[1]; index.textContent = `↳ ${child.code}`; index.className = 'grouping-descendant'; index.setAttribute('aria-label', `${child.code}, turunan dari ${parents[0].code}`);
      }
      const duty = rows[i].cells[5];
      const button = doc.createElement('button'); button.type = 'button'; button.textContent = 'Lihat alasan'; button.className = 'grouping-reason-button';
      const details = doc.createElement('div'); details.className = 'grouping-reason'; details.hidden = true;
      const groupReason = doc.createElement('p'); groupReason.textContent = `Logika pengelompokan: ${expected[i].group.rationale || 'Penjelasan belum tersedia.'}`;
      const wordingReason = doc.createElement('p'); wordingReason.textContent = `Logika penulisan tugas: ${expected[i].group.wordingRationale || 'Penjelasan belum tersedia.'}`;
      details.append(groupReason, wordingReason); button.setAttribute('aria-expanded', 'false');
      button.onclick = () => { details.hidden = !details.hidden; button.setAttribute('aria-expanded', String(!details.hidden)); };
      duty.append(button, details);
      rows[i].cells[0].rowSpan = end - i; duty.rowSpan = end - i;
      for (let j = i + 1; j < end; j++) { rows[j].deleteCell(5); rows[j].deleteCell(0); }
      i = end;
    }
    return true;
  }

  function openGroupingMarkdownArtifact(artifact, originConversation, refresh = false) {
    const opened = openScopeArtifactTab(artifact, originConversation, refresh);
    if (!opened?.view || !opened.created) return;
    const view = opened.view, doc = view.document;
    doc.title = 'Review Pengelompokan Job Description';
    const { add, send, status, content: page, sidebar, plus } = createFionaReviewDocument(doc, 'Review Pengelompokan Job Description');
    if (artifact.readOnly) { doc.body.classList.add('read-only'); send.disabled = true; status.textContent = 'Konteks tidak tersedia; versi tersimpan hanya dapat dibaca.'; }
    const instructions = add(page, 'p', 'Pilih teks pada dokumen, klik tanda +, lalu tulis komentar di sisi kanan. Kirim catatan ke Fiona setelah selesai.');
    const scroll = add(page, 'div'); scroll.className = 'scroll';
    const rendered = add(scroll, 'div'); rendered.innerHTML = markdown(artifact.markdown || groupingMarkdown(artifact));
    if (!decorateGroupingMarkdownTable(doc, rendered, artifact)) status.textContent = 'Tabel tidak sesuai dengan data pengelompokan. Muat ulang artefak.';
    const { key, notes } = loadJdNotes(view.localStorage, 'fiona-grouping-notes', originConversation, artifact);
    const fields = new Map();
    // Wrap only text nodes, so comment highlights cannot erase buttons or reason panels.
    const targets = [instructions, ...rendered.querySelectorAll('h1, thead th, tbody td')];
    targets.forEach((element, index) => {
      [...element.childNodes].filter(node => node.nodeType === 3 && node.textContent.trim()).forEach((node, part) => {
        const span = doc.createElement('span'); span.textContent = node.textContent; node.replaceWith(span);
        const row = element.closest?.('tr');
        const rows = [...rendered.querySelectorAll('tbody tr')];
        const rowIndex = row ? rows.indexOf(row) : -1;
        const codes = (artifact.groups || []).flatMap(group => group.sourceCodes || []);
        const column = row ? [...row.children].indexOf(element) : index;
        const fieldKey = rowIndex >= 0 ? `grouping:process:${encodeURIComponent(codes[rowIndex] || '')}:cell:${column}:${part}` : `grouping:document:${element.tagName || 'text'}:${index}:${part}`;
        fields.set(fieldKey, { element: span, text: span.textContent, key: fieldKey });
      });
    });
    // Earlier grouping comments stored only a quotation. Reattach when possible;
    // preserve unanchored notes as standalone sidebar comments.
    notes.forEach((note, index) => {
      if (note.segments?.length && note.segments.every(segment => !/^grouping:\d+:/.test(segment.key))) return;
      note.segments = [];
      note.id ||= `legacy-${index}`;
      const field = [...fields.values()].find(x => note.quote && x.text.includes(note.quote));
      if (field) { const offset = field.text.indexOf(note.quote); note.segments = [{ key: field.key, start: offset, end: offset + note.quote.length }]; }
      else note.unanchored = true;
    });
    const persist = () => { try { view.localStorage.setItem(key, JSON.stringify(notes)); } catch (_) {} };
    attachFionaReviewComments({ doc, view, content: page, sidebar, plus, add, fields, notes, itemsById: new Map(), persist });
    send.onclick = async () => {
      const entries = notes.filter(note => note.text?.trim());
      const message = `Catatan untuk pengelompokan JD (konteks ${artifact.contextToken}, revisi ${artifact.revision}):\n\n` + entries.map(note => `- Kutipan: ${note.quote}\n  Komentar: ${note.text.trim()}`).join('\n') + '\n\nTerapkan perubahan yang saya nyatakan dan tampilkan pengelompokan terbaru. Jangan konfirmasi tanpa persetujuan saya.';
      await sendJdReviewNotes(entries, originConversation, send, status, () => message);
    };
    opened.tab.refresh = incoming => openGroupingMarkdownArtifact(incoming, originConversation, true); opened.restore();
    if (!refresh) view.focus();
  }

  function renderJobDescriptionGroupingReview(parent, artifact) {
    if (!parent || !artifact) return null;
    const originConversation = conversationId;
    const revision = Number.isFinite(Number(artifact.revision)) ? Number(artifact.revision) : 0;
    const card = createJdDocumentCard(parent, 'Review Pengelompokan Job Description', artifact.jobName, `Revisi ${revision} · ${jdCardStatus(artifact)}`, 'Buka dokumen', async () => openGroupingMarkdownArtifact(await resolveJdArtifact(artifact, originConversation), originConversation));
    if (artifact.error?.message) {
      const error = document.createElement('p');
      error.className = 'fiona-ai-jd-grouping-error';
      error.setAttribute('role', 'alert');
      error.textContent = `${artifact.error.message} Versi tersimpan tetap ditampilkan bila tersedia.`;
      card.appendChild(error);
    }

    return card;
  }

  function appendJdList(parent, values) {
    const list = document.createElement('ul');
    (Array.isArray(values) ? values : []).forEach(value => {
      const item = document.createElement('li');
      item.textContent = String(value ?? '');
      list.appendChild(item);
    });
    if (!list.children.length) {
      const item = document.createElement('li');
      item.textContent = 'N/A';
      list.appendChild(item);
    }
    parent.appendChild(list);
  }

  function appendJdText(parent, value) {
    const text = document.createElement('p');
    text.className = 'fiona-ai-jd-text';
    text.textContent = String(value || 'N/A');
    parent.appendChild(text);
  }

  function appendJdTable(parent, section) {
    const table = document.createElement('table');
    table.className = 'fiona-ai-jd-table';
    if (section.kind === 'rowHeaderTable') table.classList.add('fiona-ai-jd-row-header-table');
    const columns = Array.isArray(section.columns) ? section.columns : [];
    const hasNumberAndIndexColumns = columns.some(column => String(column).trim().toLowerCase() === 'no')
      && columns.some(column => String(column).trim().toLowerCase() === 'index');
    if (hasNumberAndIndexColumns) table.classList.add('fiona-ai-jd-numbered-table');
    if (section.kind !== 'rowHeaderTable' && section.hideHeader !== true) {
      const head = document.createElement('thead');
      const headRow = document.createElement('tr');
      columns.forEach(column => {
        const cell = document.createElement('th');
        cell.textContent = String(column ?? '');
        headRow.appendChild(cell);
      });
      head.appendChild(headRow);
      table.appendChild(head);
    }
    const body = document.createElement('tbody');
    (Array.isArray(section.rows) ? section.rows : []).forEach(row => {
      const tr = document.createElement('tr');
      const values = row && typeof row === 'object'
        ? (Array.isArray(row.cells) ? row.cells : (row.label != null ? [row.label, row.value] : (hasNumberAndIndexColumns ? [row.no, row.index, row.first, row.second, row.third] : [row.no, row.first, row.second, row.third])))
        : [row];
      (columns.length ? columns : values).forEach((_, index) => {
        const cell = document.createElement(section.kind === 'rowHeaderTable' && index === 0 ? 'th' : 'td');
        if (section.kind === 'rowHeaderTable' && index === 0) cell.setAttribute('scope', 'row');
        appendJdCell(cell, values[index]);
        tr.appendChild(cell);
      });
      body.appendChild(tr);
    });
    table.appendChild(body);
    parent.appendChild(table);
  }

  function appendJdCell(cell, value) {
    if (Array.isArray(value)) {
      const list = document.createElement('ul');
      value.forEach(item => {
        const li = document.createElement('li');
        li.textContent = String(item ?? '');
        list.appendChild(li);
      });
      if (!list.children.length) list.appendChild(document.createElement('li'));
      cell.appendChild(list);
      return;
    }
    if (value && typeof value === 'object' && ('subheader' in value || 'description' in value)) {
      const subheader = document.createElement('strong');
      subheader.textContent = String(value.subheader ?? '');
      const description = document.createElement('span');
      description.style.whiteSpace = 'pre-line';
      description.textContent = value.description ? ` ${String(value.description)}` : '';
      cell.append(subheader, document.createElement('br'), description);
      return;
    }
    cell.textContent = String(value ?? 'N/A');
  }

  function appendJdNumberedNotes(parent, titleText, values, references) {
    if (!Array.isArray(values) || !values.length) return;
    const heading = document.createElement('h4');
    heading.textContent = titleText;
    parent.appendChild(heading);
    const list = document.createElement('ol');
    values.forEach(value => {
      const item = document.createElement('li');
      if (references && value && typeof value === 'object') {
        item.textContent = `${value.title || 'Referensi'} (${value.sourceType || 'Data'}: ${value.sourceId || 'N/A'})`;
      } else item.textContent = String(value?.text ?? value ?? '');
      list.appendChild(item);
    });
    parent.appendChild(list);
  }

  function setChatBusy(value, cancellable) {
    busy = value;
    Context?.setComposerDisabled(value);
    newChat.disabled = value;
    send.disabled = value && !cancellable;
    send.classList.toggle('is-stop', value && cancellable);
    send.textContent = value && cancellable ? '■' : '➤';
    send.setAttribute('aria-label', value && cancellable ? 'Stop Fiona' : 'Send message');
    Models?.syncModelControl();
    if (!value) Context?.focusComposer();
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

  function buildChatRequestBody(message, conversationId, requestContext, requestModelKey, continuePrevious, requestSnapshot, scopeContinuation) {
    const body = requestSnapshot ? { ...requestSnapshot } : { message, conversationId, context: requestContext, modelKey: requestModelKey };
    body.message = message;
    body.modelKey = requestModelKey;
    body.conversationId = requestSnapshot ? requestSnapshot.conversationId : conversationId;
    if (!requestSnapshot) body.context = requestContext;
    if (scopeContinuation) body.scopeContinuation = { ...scopeContinuation };
    if (continuePrevious) body.continue = true;
    return body;
  }

  async function sendMessage(text, continuePrevious = false, requestSnapshot = null, scopeContinuation = null, onSend = null) {
    if (busy) {
      if (activeController) activeController.abort();
      return;
    }

    const composerData = Context?.getComposerContent() || { text: '', mentionedEntities: [] };
    const hasExplicitText = text != null && String(text).trim() !== '';
    let messageToSend = hasExplicitText ? String(text).trim() : composerData.text;
    const attachedContextEntities = hasExplicitText
      ? (Context?.getAttachedContextEntities() || [])
      : composerData.mentionedEntities;

    if (!messageToSend && !attachedContextEntities.length) return;

    if (attachedContextEntities.length > 0 && !messageToSend.includes('@Jabatan:') && !messageToSend.includes('@Prosbis:')) {
      const canonicalTags = attachedContextEntities.map(e => (e.type === 'position' ? `@Jabatan:"${e.label}"` : `@Prosbis:"${e.label}"`)).join(' ');
      if (!messageToSend.includes(canonicalTags)) {
        messageToSend = `${canonicalTags} ${messageToSend}`.trim();
      }
    }

    const requestContext = {
      ...context(),
      mentionedEntities: attachedContextEntities.length ? [...attachedContextEntities] : undefined
    };
    const requestModelKey = requestSnapshot?.modelKey || Models?.getConversationModelKey() || Models?.getSelectedModelKey();
    if (!requestModelKey || !Models?.enabledModel(requestModelKey)) {
      status.hidden = false;
      status.textContent = Models?.getModelsLoadState() === 'failed' ? 'Models could not be loaded. Retry.' : 'Choose an available model before sending.';
      return;
    }
    const body = buildChatRequestBody(messageToSend, conversationId, requestContext, requestModelKey, continuePrevious, requestSnapshot, scopeContinuation);
    lastRequest = body;
    setDataSource(requestContext.dataSourceName);
    add('user', messageToSend);
    Context?.clearComposer();

    const card = Activity.createActivityCard({
      messagesContainer: messages,
      syncEmpty,
      scrollToLatest,
      esc,
      onRetry: () => {
        if (!lastRequest || busy) return;
        sendMessage(lastRequest.message, Boolean(lastRequest.continue), lastRequest);
      },
      onSetConversation: (val) => {
        conversationId = val;
        sessionStorage.setItem('fiona.ai.conversation', val);
      }
    });

    activeController = new AbortController();
    setChatBusy(true, true);
    onSend?.();

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
      const result = await Activity.streamChat({
        api,
        token,
        body,
        card,
        signal: activeController.signal,
        onPartial,
        FionaApiError,
        isModelKey: Models?.isModelKey,
        setConversationModel: Models?.setConversationModel,
        persistModelPreference: Models?.persistModelPreference
      });
      card.complete();
      await renderResult(result, { skipTrace: true, targetBubble: liveBubble });
      History?.loadHistory();
    } catch (error) {
      if (liveBubble) {
        liveBubble.innerHTML = markdown(accumulatedText) + (error.name === 'AbortError' ? '<p class="fiona-ai-stream-stopped"><em>(Dihentikan oleh Anda)</em></p>' : '');
      }
      if (error.name === 'AbortError') card.stop();
      else {
        if (error.code === 'conversation_model_mismatch') {
          Models?.clearConversationModel();
          Models?.setModelHelp('This conversation uses a different model. Start a new chat.', 'locked');
        } else if (error.code === 'model_protocol_mismatch') {
          Models?.setModelHelp('The server returned a different model. Start a new chat.', 'error');
        } else if (error.code === 'model_unavailable' || error.code === 'invalid_model') {
          Models?.setModelHelp(error.message, 'error');
        }
        card.fail(error.message);
      }
    } finally {
      activeController = null;
      setChatBusy(false, false);
    }
  }

  // Initialize all child modules with shared dependencies
  Models?.init({
    modelPicker,
    modelSelect,
    modelHelp,
    modelRetry,
    requestJson,
    getBusy: () => busy,
    getConversationId: () => conversationId
  });

  History?.init({
    historyList,
    historySearch,
    historyNew,
    historyLoading,
    historyEmpty,
    messages,
    status,
    sidebar,
    input,
    rasci,
    requestJson,
    getConversationId: () => conversationId,
    setConversationId: (id) => { conversationId = id; },
    getBusy: () => busy,
    getActiveController: () => activeController,
    setChatBusy,
    showChatView,
    syncEmpty,
    syncModelControl: Models?.syncModelControl,
    setConversationModel: Models?.setConversationModel,
    conversationModelFrom: Models?.conversationModelFrom,
    add,
    renderRasciTable,
    renderProsbisHierarchy,
    renderJdArtifact,
    esc,
    scrollToLatest,
    startNewChat
  });

  Memory?.init({
    memoryList,
    memorySearch,
    memoryScope,
    memoryDomain,
    memoryStatus,
    memoryEmpty,
    memoryAdd,
    memoryEditor,
    memoryForm,
    memoryEditorTitle,
    memoryFormError,
    memoryFact,
    memorySourceFields,
    memoryFormDomain,
    memoryScopeKey,
    memoryConfidenceField,
    memoryConfidence,
    memoryReviewStateField,
    memoryReviewState,
    memorySave,
    memoryCancel,
    memoryCancelSecondary,
    memoryRefresh,
    requestJson,
    onAccountChanged: () => {
      History?.clearHistory();
      conversationId = null;
      Models?.clearConversationModel();
      sessionStorage.removeItem('fiona.ai.conversation');
      messages.innerHTML = '';
      syncEmpty();
      Models?.syncModelControl();
    }
  });

  Context?.init({
    mentionPopup,
    mentionList,
    mentionTags,
    contextAddBtn,
    contextModal,
    contextMenu,
    contextModalClose,
    contextCancel,
    tabPosition,
    tabProcess,
    contextSearch,
    contextSearchButton,
    contextSuggestions,
    contextDidYouMean,
    contextOverview,
    contextLoading,
    contextList,
    contextEmpty,
    messages,
    input,
    form,
    requestJson,
    getContext: context,
    rasciCacheSource,
    getBusy: () => busy,
    sendMessage
  });

  // UI Event Bindings
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

  document.querySelectorAll('.fiona-ai-suggestions [data-prompt]').forEach(button => button.addEventListener('click', () => {
    Context?.setComposerText(button.dataset.prompt);
  }));

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (busy) {
      if (activeController) activeController.abort();
      return;
    }
    await sendMessage(null, false);
  });

  syncEmpty();
  // Start preparing the selected RASCI cache as soon as the page is ready.
  // The assistant panel remains closed, so this removes cache-build latency
  // from the user's first open/message without blocking page initialization.
  if (rasci) window.setTimeout(() => prepareRasciCache(context()), 0);
})();

