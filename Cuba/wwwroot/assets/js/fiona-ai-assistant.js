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
    if (currentView === 'memory') showChatView();
    if (sidebar) sidebar.classList.remove('is-open');
    Models?.syncModelControl();
    if (rasci && !busy) Context?.focusComposer();
  }

  function clearMemoryState() {
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
    if (data.artifact?.type === 'jobDescriptionPreview') renderJobDescriptionPreview(bubble, data.artifact);
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
        sendMessage(data.continuation.continueMessage || 'Lanjutkan', true);
      });
      row.append(question, continueButton);
      bubble.appendChild(row);
    }
    scrollToLatest();
  }

  function renderJobDescriptionPreview(parent, preview) {
    if (!parent || !preview) return null;
    const card = document.createElement('section');
    card.className = 'fiona-ai-jd-preview';
    card.setAttribute('aria-label', 'Pratinjau Job Description');
    const title = document.createElement('h3');
    title.textContent = 'Pratinjau Job Description';
    card.appendChild(title);
    if (preview.target) {
      const target = document.createElement('p');
      target.className = 'fiona-ai-jd-preview-target';
      target.textContent = `${preview.target.jobName || 'N/A'} · ${preview.target.organization || 'N/A'}`;
      card.appendChild(target);
    }
    (Array.isArray(preview.sections) ? preview.sections : []).forEach(section => {
      const block = document.createElement('section');
      block.className = 'fiona-ai-jd-section';
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
        ? (Array.isArray(row.cells) ? row.cells : (row.label != null ? [row.label, row.value] : [row.no, row.index, row.first, row.second, row.third]))
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
      description.textContent = value.description ? ` ${String(value.description)}` : '';
      cell.append(subheader, description);
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

  async function sendMessage(text, continuePrevious = false, requestSnapshot = null) {
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
    const body = requestSnapshot ? { ...requestSnapshot } : { message: messageToSend, conversationId, context: requestContext, modelKey: requestModelKey };
    body.message = messageToSend;
    body.modelKey = requestModelKey;
    body.conversationId = requestSnapshot ? requestSnapshot.conversationId : conversationId;
    if (!requestSnapshot) body.context = requestContext;
    if (continuePrevious) body.continue = true;
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
    renderJobDescriptionPreview,
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
