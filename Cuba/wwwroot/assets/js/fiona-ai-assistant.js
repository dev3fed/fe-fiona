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
  const contextModal = document.getElementById('fionaAiContextModal');
  const contextModalClose = document.getElementById('fionaAiContextModalClose');
  const contextCancel = document.getElementById('fionaAiContextCancel');
  const tabPosition = document.getElementById('fionaAiTabPosition');
  const tabProcess = document.getElementById('fionaAiTabProcess');
  const contextSearch = document.getElementById('fionaAiContextSearch');
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

  function renderRasciTable(parent, table) {
    const box = document.createElement('div');
    box.className = 'fiona-ai-table-wrap fiona-ai-rasci-wrap';
    const matrix = document.createElement('fiona-rasci-matrix');
    const sourceId = table.sourceId || table.draftRasciId || '';
    const isDescriptor = Boolean(table.renderTarget || table.sourceId || table.positionKeys || table.processIds);
    const isRemote = isDescriptor || table.renderMode === 'virtual' || table.renderMode === 'remote' || table.mode === 'remote' || Boolean(table.remote);
    const payload = { ...table, draftRasciId: sourceId, sourceId };
    if (isRemote) {
      payload.mode = 'remote';
      payload.renderMode = 'remote';
      payload.rows = isDescriptor ? [] : (table.rows || []).filter(row => row.parentId == null && row.parentBusinessProcessId == null);
      payload.columns = isDescriptor ? [] : (table.columns || []);
      payload.remote = {
        ...(table.remote || {}),
        endpoint: table.remote?.endpoint || `${api}/api/agent/rasci-tables/${encodeURIComponent(sourceId)}`,
        positionKeys: table.positionKeys || [],
        processIds: table.processIds || [],
        jobIds: table.jobIds || [],
        mode: table.mode || null,
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
    contextModalClose,
    contextCancel,
    tabPosition,
    tabProcess,
    contextSearch,
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
