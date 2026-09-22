(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.FionaMemoryContract = factory();
})(typeof window !== 'undefined' ? window : globalThis, function () {
  const sensitivePattern = /\b(password|passwd|secret|api[-_ ]?key|token|credential|credit[- ]?card|bank[- ]?account|medical|health|diagnos|salary|personnel|private)\b/i;

  function validateMemoryDraft(input, current) {
    const fact = String(input.fact || '').trim();
    const scopeKind = input.scopeKind === 'source' ? 'source' : 'user';
    const domain = scopeKind === 'source' ? String(input.domain || '').trim() : '';
    const scopeKey = scopeKind === 'source' ? String(input.scopeKey || '').trim() : 'global';
    if (!fact) return { error: 'Fact is required.' };
    if (fact.length > 2000) return { error: 'Fact must be at most 2,000 characters.' };
    if (sensitivePattern.test(fact)) return { error: 'This type of sensitive information cannot be stored as memory.' };
    if (scopeKind === 'user' && (String(input.domain || '').trim() || (String(input.scopeKey || '').trim() && String(input.scopeKey || '').trim().toLowerCase() !== 'global')))
      return { error: 'Global preferences cannot include a domain or non-global source key.' };
    if (scopeKind === 'source' && (!domain || !scopeKey || scopeKey.toLowerCase() === 'global'))
      return { error: 'Source-specific memories require both a domain and source key.' };
    let confidence = 1;
    if (current) {
      const percentage = Number(input.confidence);
      if (!Number.isFinite(percentage) || percentage < 0 || percentage > 100) return { error: 'Confidence must be between 0 and 100.' };
      confidence = percentage / 100;
    }
    return { fact, scopeKind, domain, scopeKey, confidence, reviewState: input.reviewState || 'active' };
  }

  function buildCreateMemoryPayload(value) {
    return {
      fact: value.fact,
      scopeKind: value.scopeKind,
      domain: value.domain,
      scopeKey: value.scopeKey,
      confidence: 1,
      sourceMessageId: null
    };
  }

  function buildMemoryPatch(value, current) {
    const patch = {};
    if (value.fact !== String(current.fact || '').trim()) patch.fact = value.fact;
    if (value.scopeKind !== current.scopeKind) patch.scopeKind = value.scopeKind;
    if (value.domain !== String(current.domain || '')) patch.domain = value.domain;
    if (value.scopeKey !== String(current.scopeKey || '')) patch.scopeKey = value.scopeKey;
    if (Math.abs(value.confidence - Number(current.confidence || 0)) > 0.0001) patch.confidence = value.confidence;
    if (value.reviewState !== current.reviewState) patch.reviewState = value.reviewState;
    return patch;
  }

  return { sensitivePattern, validateMemoryDraft, buildCreateMemoryPayload, buildMemoryPatch };
});
