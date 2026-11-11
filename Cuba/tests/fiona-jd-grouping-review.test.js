const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');
const live = fs.readFileSync(path.join(__dirname, '../wwwroot/assets/js/fiona-ai-assistant.js'), 'utf8');
const history = fs.readFileSync(path.join(__dirname, '../wwwroot/assets/js/assistant/fiona-assistant-history.js'), 'utf8');
function element(tag) { return { tag, children: [], attributes: {}, className: '', rowSpan: 1, hidden: false, _text: '', append(...x) { this.children.push(...x); }, appendChild(x) { this.children.push(x); return x; }, setAttribute(k,v) { this.attributes[k] = String(v); }, getAttribute(k) { return this.attributes[k]; }, set textContent(v) { this._text = String(v); this.children = []; }, get textContent() { return this._text + this.children.map(x => x.textContent || '').join(''); } }; }
const doc = {createElement: element};
const sandbox = {document: doc, conversationId: 's1', openGroupingMarkdownArtifact() {}};
vm.createContext(sandbox);
vm.runInContext(live.slice(live.indexOf('  function jdCardStatus('), live.indexOf('  function renderJobDescriptionPreview(')), sandbox);
const start = live.indexOf('  function groupingMarkdown('), end = live.indexOf('  function appendJdList(', start);
vm.runInContext(live.slice(start, end), sandbox);
const artifact = { type:'jobDescriptionGroupingReview', contextToken:'ctx', revision:2, groups:[{groupId:'g1',label:'Tugas A',sourceCodes:['1.1','1.1.2','1.10'],rationale:'Bukti terkait',wordingRationale:'Batas tugas'}],items:[{groupId:'g1',processCode:'1.1',notations:['R'],processName:'Induk'},{groupId:'g1',processCode:'1.1.2',notations:['A'],processName:'Anak'},{groupId:'g1',processCode:'1.10',notations:['A'],processName:'Lain'}] };
function makeRow(id, code, label) { const cells = [id,code,'Nama','R','','Tugas A'].map(v => {const x = element('td'); x.textContent = v; return x;}); cells[5].textContent = label; return {cells, deleteCell(i) { this.cells.splice(i,1); }}; }
test('chat shows a link to the document without rendering a review table', () => { const parent=element('div'), card=sandbox.renderJobDescriptionGroupingReview(parent,artifact); assert.equal(card.children.filter(x=>x.tag==='a').length,1); assert.equal(card.children.some(x=>x.tag==='table'),false); assert.match(card.textContent,/Buka dokumen/); assert.match(history,/renderJdArtifact\(bubble, artifactData\?\.artifact\)/); });
test('markdown is complete and escapes table separators', () => { const copy=structuredClone(artifact); copy.items[1].processName='Anak | penjelasan'; const md=sandbox.groupingMarkdown(copy); assert.match(md,/Anak \\\| penjelasan/); assert.equal((md.match(/\| g1 \|/g)||[]).length,3); assert.doesNotMatch(md,/rowspan/i); });
test('document numbers groups, merges rows, marks actual descendants and shows both reasons', () => { const rows=artifact.groups[0].sourceCodes.map(code=>makeRow('g1',code,'Tugas A')); const header=element('th'); const page={querySelectorAll:()=>rows,querySelector:()=>header}; assert.equal(sandbox.decorateGroupingMarkdownTable(doc,page,artifact),true); assert.equal(header.textContent,'No.'); assert.equal(rows[0].cells[0].textContent,'1'); assert.equal(rows[0].cells[0].rowSpan,3); assert.equal(rows[0].cells[5].rowSpan,3); assert.equal(rows[1].cells[0].textContent,'↳ 1.1.2'); assert.equal(rows[2].cells[0].textContent,'1.10'); const button=rows[0].cells[5].children[0], details=rows[0].cells[5].children[1]; assert.equal(button.textContent,'Lihat alasan'); assert.equal(details.hidden,true); button.onclick(); assert.equal(details.hidden,false); assert.match(details.textContent,/Bukti terkait/); assert.match(details.textContent,/Batas tugas/); });
test('inconsistent document is not merged or altered', () => { const rows=artifact.groups[0].sourceCodes.map(code=>makeRow('g1',code,'Tugas A')); rows[1].cells[1].textContent='wrong'; assert.equal(sandbox.decorateGroupingMarkdownTable(doc,{querySelectorAll:()=>rows,querySelector:()=>null},artifact),false); assert.equal(rows[0].cells[0].rowSpan,1); assert.equal(rows[1].cells.length,6); });
test('legacy markdown generation rejects missing or repeated memberships', () => { const copy=structuredClone(artifact); copy.groups[0].sourceCodes=['1.1','1.1']; assert.equal(sandbox.groupingMarkdown(copy),null); });
test('documents share the same shell and comment controller, with grouping notes retained', () => {
  const scope=live.slice(live.indexOf('  function renderJobDescriptionScopeReview('),live.indexOf('  function groupingMarkdown('));
  const grouping=live.slice(live.indexOf('  function openGroupingMarkdownArtifact('),live.indexOf('  function renderJobDescriptionGroupingReview('));
  for (const source of [scope,grouping]) { assert.match(source,/createFionaReviewDocument\(/); assert.match(source,/attachFionaReviewComments\(/); }
  assert.match(grouping,/note\.unanchored = true/);
  assert.match(live,/\.grouping-descendant\{white-space:nowrap/);
});
test('group numbers follow document order rather than internal IDs', () => {
  const data=structuredClone(artifact); data.groups.push({groupId:'g17',label:'Tugas B',sourceCodes:['2.1']}); data.items.push({groupId:'g17',processCode:'2.1',notations:['R']});
  const rows=[...artifact.groups[0].sourceCodes.map(code=>makeRow('g1',code,'Tugas A')),makeRow('g17','2.1','Tugas B')];
  assert.equal(sandbox.decorateGroupingMarkdownTable(doc,{querySelectorAll:()=>rows,querySelector:()=>element('th')},data),true);
  assert.equal(rows[0].cells[0].textContent,'1'); assert.equal(rows[3].cells[0].textContent,'2');
  assert.deepEqual(rows.map(row => row.className), ['grouping-unshaded', 'grouping-unshaded', 'grouping-unshaded', 'grouping-shaded']);
  assert.match(live, /tr\.grouping-shaded > td\{background:#f2f6fc\}/);
});
