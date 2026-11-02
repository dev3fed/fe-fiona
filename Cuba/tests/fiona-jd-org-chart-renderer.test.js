const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');

const source = fs.readFileSync(path.join(__dirname, '..', 'wwwroot/assets/js/job-description/d3-chart.js'), 'utf8');
const start = source.indexOf('function renderJdOrganizationChart(');
assert.ok(start >= 0);
const calls = [];
const sandbox = {
  processChartData(rows) { return {processedData: rows}; },
  initializeChart(data, focusId, compact, container, options) {
    calls.push({data, focusId, compact, container, options});
    return {container};
  }
};
vm.createContext(sandbox);
vm.runInContext(source.slice(start), sandbox);

test('JD renderer scopes two chart instances and highlights exact JobId + PRL without mutating source', () => {
  const leftContainer = {id: 'preview-left'};
  const rightContainer = {id: 'preview-right'};
  const sourceNodes = [
    {id: 'parent', id_org_unit: 'parent', pid: null, position: 'Parent', id_position: 'P', prl: '2'},
    {id: 'target', id_org_unit: 'target', pid: 'parent', position: 'Target', id_position: 'T1', prl: '14'}
  ];
  const first = sandbox.renderJdOrganizationChart(leftContainer, sourceNodes, {jobId: 'T1', prlOrg: '14'});
  const second = sandbox.renderJdOrganizationChart(rightContainer, sourceNodes, {jobId: 'T1', prlOrg: '14'});

  assert.equal(first.container, leftContainer);
  assert.equal(second.container, rightContainer);
  assert.equal(calls.length, 2);
  assert.equal(calls[0].container, leftContainer);
  assert.equal(calls[1].container, rightContainer);
  assert.equal(calls[0].focusId, 'target');
  assert.ok(calls[0].data.processedData[1].tags.includes('pointed'));
  assert.deepEqual(sourceNodes[1].tags, undefined);
});

test('basket target matching requires the exact basket PRL and position', () => {
  const container = {id:'basket'};
  const node = {id:'unit', id_org_unit:'unit', pid:null, id_position:'OTHER', prl:'1', bc_1_id_position:'T1', bc_1_prl:'14'};
  const exact = sandbox.renderJdOrganizationChart(container, [node], {jobId:'T1', prlOrg:'14'});
  assert.equal(exact.container, container);
  assert.equal(sandbox.renderJdOrganizationChart(container, [node], {jobId:'T1', prlOrg:'15'}), null);
});

test('shared D3 initializer scopes parent, siblings and children to a valid independent hierarchy', () => {
  const instances = [];
  function OrgChart() {
    const state = {};
    const instance = new Proxy(state, {get(target, property) {
      return value => {
        if (property === 'data') target.rows = value;
        if (property === 'container') target.selector = value;
        if (property === 'render') {
          const ids = new Set(target.rows.map(row => row.id));
          assert.equal(ids.size, target.rows.length, 'chart IDs must be unique');
          assert.equal(target.rows.filter(row => row.parentId == null).length, 1, 'chart needs one root');
          for (const row of target.rows) {
            if (row.parentId != null) assert.ok(ids.has(row.parentId), 'parent must be inside chart scope');
          }
        }
        return instance;
      };
    }});
    instances.push(state);
    return instance;
  }
  const runtime = {
    d3: {OrgChart}, console: {log() {}},
    localStorage: {setItem() {throw new Error('shared storage must not be used');}},
    document: {querySelector() {throw new Error('global container must not be used');}},
    setTimeout() {throw new Error('preview must not schedule global expansion');}
  };
  vm.createContext(runtime);
  vm.runInContext(source, runtime);
  const nodes = [
    {id:'grandparent', id_org_unit:'grandparent', pid:null, id_position:'G', prl:'1'},
    {id:'parent', id_org_unit:'parent', pid:'grandparent', id_position:'P', prl:'2'},
    {id:'target', id_org_unit:'target', pid:'parent', id_position:'T', prl:'3'},
    {id:'sibling', id_org_unit:'sibling', pid:'parent', id_position:'S', prl:'3'},
    {id:'child', id_org_unit:'child', pid:'target', id_position:'C', prl:'4'}
  ];
  const before = JSON.stringify(nodes);
  runtime.renderJdOrganizationChart({id:'first'}, nodes, {jobId:'T',prlOrg:'3'});
  runtime.renderJdOrganizationChart({id:'second'}, nodes, {jobId:'T',prlOrg:'3'});
  assert.equal(instances[0].selector, '#first');
  assert.equal(instances[1].selector, '#second');
  assert.equal(instances[0].rows.some(row => row.id === 'grandparent'), false);
  assert.ok(instances[0].rows.find(row => row.id === 'target').tags.includes('pointed'));
  assert.equal(vm.runInContext('chart', runtime), null, 'preview must not replace saved chart instance');
  assert.equal(JSON.stringify(nodes), before);
});

test('saved JD chart export reads its per-instance chart data without storage globals', () => {
  const start = source.indexOf('function getChartExportData()');
  const end = source.indexOf('function prepareAndExportSVG()', start);
  const rows = [
    {id:'parent', parentId:null, tags:[]},
    {id:'target', parentId:'parent', tags:['pointed']},
    {id:'child', parentId:'target', tags:[]}
  ];
  const runtime = {
    chart: {jdOrganizationChartData:{processedData:rows}, jdFocusNodeId:'target'},
    localStorage: {getItem() { throw new Error('saved chart export must use instance data'); }},
    initializeChart() { return {}; }
  };
  vm.createContext(runtime);
  vm.runInContext(source.slice(start, end), runtime);
  const data = runtime.getChartExportData();
  assert.equal(data.focusNodeId, 'target');
  assert.equal(data.isAutoExpand, true);
  assert.equal(data.orgChartData.processedData, rows);
  assert.deepEqual(Array.from(data.cloneOrgChartData.processedData, row => row.id), ['target', 'parent', 'child']);
  runtime.initializeExportChart(data);
  assert.notEqual(runtime.chart.jdOrganizationChartData, undefined);
  const repeatedExport = runtime.getChartExportData();
  assert.equal(repeatedExport.orgChartData, data.orgChartData);
  assert.equal(repeatedExport.focusNodeId, 'target');
});
