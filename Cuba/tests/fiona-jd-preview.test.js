const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');
const script = fs.readFileSync(path.join(__dirname, '..', 'wwwroot/assets/js/fiona-ai-assistant.js'), 'utf8');
function element(tag) {
  return {tag, children: [], style: {}, classList: {add() {}}, append(...items) {this.children.push(...items);}, appendChild(item) {this.children.push(item);}, setAttribute() {}};
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
