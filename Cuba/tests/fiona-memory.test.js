const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const contract = require('../wwwroot/assets/js/fiona-memory-contract.js');
const assistant = fs.readFileSync(path.join(__dirname, '..', 'wwwroot', 'assets', 'js', 'fiona-ai-assistant.js'), 'utf8');
const partial = fs.readFileSync(path.join(__dirname, '..', 'Views', 'Shared', '_AiAssistant.cshtml'), 'utf8');

test('global memory scope rejects domain and non-global source keys', () => {
  assert.equal(contract.validateMemoryDraft({ fact: 'I prefer concise summaries.', scopeKind: 'user', domain: 'rasci', scopeKey: 'draft-1' }).error,
    'Global preferences cannot include a domain or non-global source key.');
});

test('source-specific memory scope requires both domain and source key', () => {
  assert.equal(contract.validateMemoryDraft({ fact: 'Use this workflow for the draft.', scopeKind: 'source', domain: '', scopeKey: '' }).error,
    'Source-specific memories require both a domain and source key.');
  assert.equal(contract.validateMemoryDraft({ fact: 'Use this workflow for the draft.', scopeKind: 'source', domain: 'rasci', scopeKey: 'global' }).error,
    'Source-specific memories require both a domain and source key.');
});

test('create payload matches the authenticated memory API contract', () => {
  const value = contract.validateMemoryDraft({ fact: 'I prefer concise summaries.', scopeKind: 'user', domain: '', scopeKey: '' });
  assert.deepEqual(contract.buildCreateMemoryPayload(value), {
    fact: 'I prefer concise summaries.',
    scopeKind: 'user',
    domain: '',
    scopeKey: 'global',
    confidence: 1,
    sourceMessageId: null
  });
});

test('edit payload contains only changed fields', () => {
  const current = { id: 'm1', fact: 'I prefer concise summaries.', scopeKind: 'user', domain: '', scopeKey: 'global', confidence: 1, reviewState: 'active' };
  const value = contract.validateMemoryDraft({ fact: 'I prefer concise answers.', scopeKind: 'user', domain: '', scopeKey: '', confidence: '95', reviewState: 'needs_review' }, current);
  assert.deepEqual(contract.buildMemoryPatch(value, current), {
    fact: 'I prefer concise answers.',
    confidence: 0.95,
    reviewState: 'needs_review'
  });
});

test('assistant markup and script cover memory states and safe rendering', () => {
  for (const id of ['fionaAiMemories', 'fionaAiMemoryList', 'fionaAiMemoryEmpty', 'fionaAiMemoryEditor', 'fionaAiMemoryForm']) {
    assert.match(partial, new RegExp(`id="${id}"`));
  }
  assert.match(assistant, /fact\.textContent = String\(memory\.fact \|\| ''\)/);
  assert.match(assistant, /status === 404/);
  assert.match(assistant, /status >= 500/);
  assert.match(assistant, /data\.continuation\?\.available/);
  assert.match(assistant, /body\.continue = true/);
});
