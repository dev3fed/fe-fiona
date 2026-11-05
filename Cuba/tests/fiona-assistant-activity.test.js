const assert = require('node:assert/strict');
const test = require('node:test');
const { streamChat } = require('../wwwroot/assets/js/assistant/fiona-assistant-activity');

test('running JD progress delivers the streamed detail to the activity card', async () => {
  const updates = [];
  const messages = [
    ['RUN_STARTED', { runId: 'run', sequence: 1, modelKey: 'model', language: 'id' }],
    ['TOOL_CALL_START', { runId: 'run', sequence: 2, toolCallId: 'jd-grouping-progress', toolName: 'jd_grouping_progress', label: 'Menyiapkan kelompok tanggung jawab', summary: 'Menganalisis 87 proses' }],
    ['RUN_FINISHED', { runId: 'run', sequence: 3, result: { markdown: 'Selesai' } }]
  ].map(([type, event]) => `event: ${type}\ndata: ${JSON.stringify(event)}\n\n`).join('');
  const originalFetch = global.fetch;
  global.fetch = async () => new Response(messages, { status: 200 });
  try {
    await streamChat({ api: '', token: 'test', body: { modelKey: 'model' },
      card: { setLanguage() {}, setConversation() {}, upsert: update => updates.push(update) } });
    assert.equal(updates[0].summary, 'Menganalisis 87 proses');
    assert.equal(updates[0].status, 'running');
  } finally {
    global.fetch = originalFetch;
  }
});
