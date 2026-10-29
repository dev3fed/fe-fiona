const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');
const script = fs.readFileSync(path.join(__dirname, '..', 'wwwroot/assets/js/job-description/detail.js'), 'utf8');
const init = script.slice(0, script.indexOf('// Debounce function'));
function setup(storageValue, response, search = '?draft=true&draftId=saved&jobId=T%20%261&prlOrg=1') {
  const stored = new Map([['draftExistingJobDesc', storageValue]]);
  const calls = [];
  const sandbox = {
    URLSearchParams, window: {location: {search}},
    localStorage: {getItem: key => stored.get(key) || null, setItem: (key, value) => stored.set(key, value)},
    draftDetailById: async (...args) => {calls.push(args); return response;},
    refreshDataLocalStorage() {calls.push('clear-sections');},
    loader() {}, $: () => ({prop() {calls.push('disabled');}}), swal() {calls.push('error');}
  };
  vm.createContext(sandbox);
  vm.runInContext(init, sandbox);
  return {sandbox, stored, calls};
}
test('explicit JD links load exact draft with empty, stale, or malformed browser storage and on refresh', async () => {
  for (const storage of [null, '{broken', JSON.stringify({draftId:'wrong-draft'})]) {
    const {sandbox, stored, calls} = setup(storage, {data: {draftId:'saved', draftName:'Saved JD', rasciDraftId:'reviewed', isActive:true}});
    assert.equal(await sandbox.loadExplicitJdDraftContext(), true);
    assert.equal(JSON.parse(stored.get('draftExistingJobDesc')).draftId, 'saved');
    assert.equal(JSON.parse(stored.get('draftExistingJobDesc')).draftRasciId, 'reviewed');
    assert.equal(calls[0][0], 'saved');
    assert.equal(calls[0][1].jobId, 'T &1');
    assert.equal(calls[0][1].prlOrg, '1');
    assert.equal(await sandbox.loadExplicitJdDraftContext(), true);
  }
});
test('invalid or removed JD links stop loading instead of falling back to stale context', async () => {
  for (const response of [null, {data:null}, {data:{draftId:'other'}}, {data:{draftId:'saved', isActive:false}}]) {
    const {sandbox, calls} = setup(JSON.stringify({draftId:'stale'}), response);
    assert.equal(await sandbox.loadExplicitJdDraftContext(), false);
    assert.equal(vm.runInContext('getDraftExisting', sandbox), null);
    assert.ok(calls.includes('error'));
    assert.ok(calls.includes('disabled'));
  }
});
test('legacy navigation retains its existing stored draft without an extra lookup', async () => {
  const {sandbox, calls} = setup(JSON.stringify({draftId:'legacy'}), null, '?jobId=T1&prlOrg=1');
  assert.equal(await sandbox.loadExplicitJdDraftContext(), true);
  assert.equal(vm.runInContext('getDraftExisting.draftId', sandbox), 'legacy');
  assert.equal(calls.length, 0);
});

const chartStart = script.indexOf('async function getDetailJob(');
const chartEnd = script.indexOf('$(document).ready(', chartStart);
test('a JD loads without optional organization chart information', async () => {
  const {sandbox} = setup(null, null);
  vm.runInContext(script.slice(chartStart, chartEnd), sandbox);
  vm.runInContext('getDraftExisting = {}', sandbox);
  let calls = 0;
  sandbox.chartJobDetail = async () => { calls++; throw new Error('chart unavailable'); };
  const withoutOrg = await sandbox.getDetailJob('T1');
  assert.equal(Object.keys(withoutOrg.data).length, 0);
  assert.equal(calls, 0);
  vm.runInContext('getDraftExisting = {organizationDraftId: "reviewed-org"}', sandbox);
  const withoutChart = await sandbox.getDetailJob('T1');
  assert.equal(Object.keys(withoutChart.data).length, 0);
  assert.equal(calls, 1);
});
