const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const jsDir = path.join(__dirname, '..', 'wwwroot', 'assets', 'js');
const assistant = [
  fs.readFileSync(path.join(jsDir, 'assistant', 'fiona-assistant-models.js'), 'utf8'),
  fs.readFileSync(path.join(jsDir, 'assistant', 'fiona-assistant-activity.js'), 'utf8'),
  fs.readFileSync(path.join(jsDir, 'assistant', 'fiona-assistant-history.js'), 'utf8'),
  fs.readFileSync(path.join(jsDir, 'assistant', 'fiona-assistant-memory.js'), 'utf8'),
  fs.readFileSync(path.join(jsDir, 'assistant', 'fiona-assistant-context.js'), 'utf8'),
  fs.readFileSync(path.join(jsDir, 'fiona-ai-assistant.js'), 'utf8')
].join('\n');
const partial = fs.readFileSync(path.join(__dirname, '..', 'Views', 'Shared', '_AiAssistant.cshtml'), 'utf8');
const css = fs.readFileSync(path.join(__dirname, '..', 'wwwroot', 'assets', 'css', 'fiona-ai-assistant.css'), 'utf8');

test('assistant markup contains chat history sidebar and main pane elements', () => {
  const expectedIds = [
    'fionaAiSidebar',
    'fionaAiMain',
    'fionaAiToggleSidebar',
    'fionaAiHistoryNew',
    'fionaAiHistorySearch',
    'fionaAiHistoryList',
    'fionaAiHistoryLoading',
    'fionaAiHistoryEmpty'
  ];

  for (const id of expectedIds) {
    assert.match(partial, new RegExp(`id="${id}"`), `Expected element id="${id}" in _AiAssistant.cshtml`);
  }
});

test('css contains sidebar, two-pane layout, and responsive styles', () => {
  assert.match(css, /\.fiona-ai-sidebar\s*\{/);
  assert.match(css, /\.fiona-ai-sidebar\.is-collapsed/);
  assert.match(css, /\.fiona-ai-main\s*\{/);
  assert.match(css, /\.fiona-ai-history-item\.is-active/);
  assert.match(css, /\.fiona-ai-toggle-sidebar/);
  assert.match(css, /@media\s*\(max-width:\s*768px\)/);
});

test('assistant script targets conversation history API endpoints', () => {
  assert.match(assistant, /\/api\/agent\/conversations/);
  assert.match(assistant, /\/api\/agent\/conversations\/\$\{encodeURIComponent\(id\)\}\/messages/);
  assert.match(assistant, /method:\s*['"]PATCH['"]/);
  assert.match(assistant, /method:\s*['"]DELETE['"]/);
  assert.match(assistant, /method:\s*['"]GET['"]/);
});

test('assistant script contains history lifecycle and interaction functions', () => {
  assert.match(assistant, /function\s+renderHistoryList\s*\(/);
  assert.match(assistant, /function\s+loadHistory\s*\(/);
  assert.match(assistant, /function\s+selectConversation\s*\(/);
  assert.match(assistant, /function\s+renameConversation\s*\(/);
  assert.match(assistant, /function\s+deleteConversation\s*\(/);
  assert.match(assistant, /function\s+getGroupKey\s*\(/);
  assert.match(assistant, /function\s+startNewChat\s*\(/);
});

test('RASCI cache preparation supports master and draft sources with non-blocking status', () => {
  assert.match(partial, /id="fionaAiCacheStatus"/);
  assert.match(partial, /aria-live="polite"/);
  assert.match(assistant, /function\s+rasciCacheSource\s*\(/);
  assert.match(assistant, /sourceId\.toLowerCase\(\)\s*===\s*['"]master['"]/);
  assert.match(assistant, /rasci \? ['"]master['"] : ['"]/);
  assert.match(assistant, /rasci-cache\/\$\{encodeURIComponent\(source\.id\)\}\/prepare/);
  assert.match(assistant, /setRasciCacheStatus\(['"]preparing['"]/);
  assert.match(assistant, /setRasciCacheStatus\(['"]error['"]/);
  assert.match(assistant, /cachePreparationVersion/);
  assert.match(assistant, /if\s*\(rasci\)\s*window\.setTimeout\(\(\)\s*=>\s*prepareRasciCache\(context\(\)\),\s*0\)/);
  assert.match(css, /\.fiona-ai-cache-status\s*\{/);
  assert.match(css, /\.fiona-ai-cache-spinner\s*\{/);
});

test('RASCI assistant context makes master authoritative and clears stale draft IDs', () => {
  assert.match(assistant, /draftRasciId:\s*isMaster\s*\?\s*null/);
  assert.match(assistant, /dataSource:\s*isMaster\s*\?\s*['"]master['"]/);
  assert.match(assistant, /dataDomain:\s*rasci\s*\?\s*['"]rasci['"]\s*:\s*null/);
  assert.match(assistant, /sourceLabel:\s*dataSourceName/);
  assert.match(assistant, /setState\(['"]draftRasciId['"],\s*null\)/);
});

test('assistant script prevents race conditions with version tokens and guards keyboard events', () => {
  assert.match(assistant, /historyLoadVersion/);
  assert.match(assistant, /conversationLoadVersion/);
  assert.match(assistant, /if\s*\(e\.target\s*!==\s*card\)\s*return;/);
  assert.match(assistant, /err\.status\s*===\s*404/);
});

test('model selector exposes an authenticated, server-owned catalog contract', () => {
  for (const id of ['fionaAiModelPicker', 'fionaAiModelSelect', 'fionaAiModelHelp', 'fionaAiModelRetry']) {
    assert.match(partial, new RegExp(`id="${id}"`));
  }
  assert.match(assistant, /\/api\/agent\/models/);
  assert.match(assistant, /modelPreferenceKey\s*=\s*['"]fiona\.ai\.selectedModel\.v1['"]/);
  assert.match(assistant, /function\s+normalizeModelOptions\s*\(/);
  assert.match(assistant, /seen\.has\(model\.key\.trim\(\)\)/);
  assert.match(assistant, /enabledModel\(preferred\)/);
});

test('model selection is snapped into requests and locked to the server stream', () => {
  assert.match(assistant, /body\.modelKey\s*=\s*requestModelKey/);
  assert.match(assistant, /requestModelKey/);
  assert.match(assistant, /event\.metadata\?\.modelKey/);
  assert.match(assistant, /model_protocol_mismatch/);
  assert.match(assistant, /conversation_model_mismatch/);
  assert.match(assistant, /sendMessage\(lastRequest\.message, Boolean\(lastRequest\.continue\), lastRequest\)/);
  assert.match(assistant, /Start a new chat to change the model/);
});

test('date grouping logic correctly categorizes relative dates', () => {
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

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0, 0);
  const yesterday = new Date(today.getTime() - 86400000 + 3600000);
  const fiveDaysAgo = new Date(today.getTime() - 4 * 86400000);
  const tenDaysAgo = new Date(today.getTime() - 10 * 86400000);

  assert.equal(getGroupKey(today.toISOString()), 'Today');
  assert.equal(getGroupKey(yesterday.toISOString()), 'Yesterday');
  assert.equal(getGroupKey(fiveDaysAgo.toISOString()), 'Previous 7 Days');
  assert.equal(getGroupKey(tenDaysAgo.toISOString()), 'Older');
  assert.equal(getGroupKey(null), 'Older');
  assert.equal(getGroupKey('invalid-date'), 'Older');
});
