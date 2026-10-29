const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');
const script = fs.readFileSync(path.join(__dirname, '..', 'wwwroot/assets/js/fiona-ai-assistant.js'), 'utf8');
function element(tag) {
  return {tag, children: [], style: {}, classList: {add() {}}, append(...items) {this.children.push(...items);}, appendChild(item) {this.children.push(item);}, replaceChildren(...items) {this.children = items;}, get childElementCount() {return this.children.length;}, setAttribute() {}};
}
const start = script.indexOf('  function appendJdTable(');
assert.ok(start >= 0);
const end = script.indexOf('  function appendJdNumberedNotes(', start);
const sandbox = {document: {createElement: element}};
vm.createContext(sandbox);
vm.runInContext(script.slice(start, end), sandbox);
test('generic responsibility has three correctly aligned cells and all outcome bullets', () => {
 const parent = element('div');
 sandbox.appendJdTable(parent, {kind:'table', columns:['No','Tugas & Tanggung Jawab Umum','Hasil Akhir Yang Diharapkan'], rows:[{no:1,index:null,first:{subheader:'Implementasi HSSE',description:'Melakukan implementasi HSSE.'},second:['Hasil pertama','Hasil kedua']}]});
 const table = parent.children[0];
 const cells = table.children[1].children[0].children;
 assert.equal(cells.length,3);
 assert.equal(cells[0].textContent,'1');
 assert.equal(cells[1].children[0].textContent,'Implementasi HSSE');
 assert.equal(cells[1].children[1].tag,'br');
 assert.equal(cells[2].children[0].children.length,2);
 assert.equal(cells[2].children[0].children[1].textContent,'Hasil kedua');
});
test('indexed duties preserve their five columns and authority uses its second column', () => {
 const parent = element('div');
 sandbox.appendJdTable(parent,{kind:'table',columns:['No','Index','Tugas','Hasil','Leading Indicator'],rows:[{no:1,index:'1.1',first:'Duty',second:['Outcome'],third:['Indicator']}]});
 const cells=parent.children[0].children[1].children[0].children;
 assert.equal(cells.length,5);
 assert.equal(cells[1].textContent,'1.1');
 assert.equal(cells[2].textContent,'Duty');
 const authority=element('div');
 sandbox.appendJdTable(authority,{kind:'table',columns:['No','Kewenangan'],rows:[{no:'-',first:'N/A'}]});
 assert.equal(authority.children[0].children[1].children[0].children[1].textContent,'N/A');
});

const previewStart = script.indexOf('  function renderJobDescriptionPreview(');
const previewEnd = script.indexOf('  function renderJobDescriptionGroupingReview(', previewStart);
const previewSandbox = {document: {createElement: element}, appendJdNumberedNotes() {}};
vm.createContext(previewSandbox);
vm.runInContext(script.slice(previewStart, previewEnd), previewSandbox);
test('saved JD receipt renders an Open JD link, including after history JSON round-trip', () => {
  const artifact = JSON.parse(JSON.stringify({type:'jobDescriptionPreview', status:'applied', openUrl:'/job-description/detail?draftId=saved&jobId=T1', sections:[]}));
  const parent = element('div');
  previewSandbox.renderJobDescriptionPreview(parent, artifact);
  const card = parent.children[0];
  assert.equal(card.children[0].textContent, 'Job Description tersimpan');
  assert.equal(card.children[1].textContent, 'Open JD');
  assert.equal(card.children[1].href, artifact.openUrl);
});
test('unsaved previews and unsafe URLs never render a saved JD link', () => {
  for (const artifact of [{status:'pending', openUrl:'/job-description/detail?draftId=d'}, {status:'applied', openUrl:'javascript:alert(1)'}, {status:'applied'}]) {
    const parent = element('div');
    previewSandbox.renderJobDescriptionPreview(parent, {...artifact, sections:[]});
    assert.equal(parent.children[0].children.some(x => x.tag === 'a'), false);
  }
});
test('organization chart keeps section heading and clear fallback when no exact source is available', async () => {
  const parent = element('div');
  previewSandbox.renderJobDescriptionPreview(parent, {sections:[{
    number:10, title:'POSISI DALAM STRUKTUR ORGANISASI', kind:'organizationChart',
    chart:{nodes:[], selected:{jobId:'T1', prlOrg:'1'}, source:{kind:'master', draftId:null}},
    emptyMessage:'Data struktur organisasi belum tersedia.'
  }]});
  await new Promise(resolve => setTimeout(resolve, 0));
  const section = parent.children[0].children[1];
  assert.equal(section.children[0].textContent, '10. POSISI DALAM STRUKTUR ORGANISASI');
  assert.equal(section.children[1].textContent, 'Data struktur organisasi belum tersedia.');
});
test('organization chart fetch uses its captured draft and requires exact job and PRL match', async () => {
  const calls = [];
  previewSandbox.resolveJdOrganizationChart = async request => {
    calls.push(request);
    return {nodes:[
      {id:'unit-parent', id_org_unit:'unit-parent', pid:null, position:'Parent', id_position:'PARENT', prl:'2'},
      {id:'unit-target', id_org_unit:'unit-target', pid:'unit-parent', position:'Target', org_unit_name:'Unit', id_position:'T1', prl:'1'}
    ], selected:{jobId:'T1',prlOrg:'1'}, source:{kind:'draft',draftId:'linked-so'}, available:true};
  };
  const host = element('div');
  const contract = {nodes:[], selected:{jobId:'T1', prlOrg:'1', unitCode:'U1'}, source:{kind:'draft', draftId:'linked-so'}};
  previewSandbox.appendJdOrganizationChart(host, contract, 'Data struktur organisasi belum tersedia.');
  await new Promise(resolve => setTimeout(resolve, 0));
  assert.equal(JSON.stringify(calls), JSON.stringify([{sourceKind:'draft', sourceDraftId:'linked-so', jobId:'T1', prlOrg:'1'}]));
  assert.equal(contract.nodes.length, 2);
  assert.equal(host.children[0].textContent, 'Data struktur organisasi belum tersedia.');

  previewSandbox.resolveJdOrganizationChart = async () => ({nodes:[{id_org_unit:'unit-target', position:'Wrong PRL', id_position:'T1', prl:'99'}], available:false});
  const missing = element('div');
  const missingContract = {...contract, nodes:[], source:{kind:'draft', draftId:'linked-so'}};
  previewSandbox.appendJdOrganizationChart(missing, missingContract, 'Data struktur organisasi belum tersedia.');
  await new Promise(resolve => setTimeout(resolve, 0));
  assert.equal(missing.children[0].textContent, 'Data struktur organisasi belum tersedia.');
});
