(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.FionaAssistantModels = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const modelPreferenceKey = 'fiona.ai.selectedModel.v1';
  let modelOptions = [];
  let defaultModelKey = null;
  let selectedModelKey = null;
  let conversationModelKey = null;
  let modelsLoadState = 'idle';
  let modelsLoadPromise = null;
  let deps = {};

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
    const { modelHelp, modelRetry } = deps;
    if (!modelHelp) return;
    modelHelp.textContent = message || '';
    modelHelp.classList.toggle('is-error', kind === 'error');
    modelHelp.classList.toggle('is-locked', kind === 'locked');
    if (modelRetry) modelRetry.hidden = kind !== 'error' || modelsLoadState !== 'failed';
  }

  function syncModelControl() {
    const { modelSelect, getBusy, getConversationId } = deps;
    if (!modelSelect) return;
    const busy = typeof getBusy === 'function' ? getBusy() : false;
    const conversationId = typeof getConversationId === 'function' ? getConversationId() : null;
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
    if (deps.modelSelect) deps.modelSelect.value = selectedModelKey || '';
  }

  function renderModelOptions() {
    const { modelSelect, getConversationId } = deps;
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
    const conversationId = typeof getConversationId === 'function' ? getConversationId() : null;
    if (!modelOptions.some(model => model.enabled)) {
      setModelHelp('No models are currently available.', 'error');
    } else if (!conversationId) {
      setModelHelp('Choose a model for this new chat.');
    }
    syncModelControl();
  }

  async function loadModelOptions(force = false) {
    const { requestJson, modelSelect } = deps;
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
    if (deps.modelSelect) deps.modelSelect.value = normalized;
    syncModelControl();
    return true;
  }

  function clearConversationModel() {
    conversationModelKey = null;
    restoreModelPreference();
    syncModelControl();
  }

  function conversationModelFrom(data) {
    const candidate = data?.modelKey || data?.conversationModelKey || data?.metadata?.modelKey || data?.model?.key;
    return isModelKey(candidate) ? candidate.trim() : null;
  }

  function init(options) {
    deps = options || {};
    const { modelSelect, modelRetry } = deps;

    modelSelect?.addEventListener('change', () => {
      const busy = typeof deps.getBusy === 'function' ? deps.getBusy() : false;
      const conversationId = typeof deps.getConversationId === 'function' ? deps.getConversationId() : null;
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
    loadModelOptions().catch(() => {});
  }

  return {
    init,
    isModelKey,
    enabledModel,
    normalizeModelOptions,
    setModelHelp,
    syncModelControl,
    persistModelPreference,
    restoreModelPreference,
    renderModelOptions,
    loadModelOptions,
    retryModelOptions,
    setConversationModel,
    clearConversationModel,
    conversationModelFrom,
    getSelectedModelKey: () => selectedModelKey,
    getConversationModelKey: () => conversationModelKey,
    getDefaultModelKey: () => defaultModelKey,
    getModelsLoadState: () => modelsLoadState,
    getModelOptions: () => [...modelOptions],
    modelPreferenceKey
  };
});
