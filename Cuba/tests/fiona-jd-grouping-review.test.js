const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');

const jsDir = path.join(__dirname, '..', 'wwwroot', 'assets', 'js');
const live = fs.readFileSync(path.join(jsDir, 'fiona-ai-assistant.js'), 'utf8');
const history = fs.readFileSync(path.join(jsDir, 'assistant', 'fiona-assistant-history.js'), 'utf8');
const css = fs.readFileSync(path.join(__dirname, '..', 'wwwroot', 'assets', 'css', 'fiona-ai-assistant.css'), 'utf8');
const start = live.indexOf('  function renderJobDescriptionGroupingReview(');
const end = live.indexOf('  function appendJdList(', start);
assert.ok(start >= 0 && end > start);

function element(tag) {
  return {
    tag, children: [], attributes: {}, className: '', rowSpan: 1, _text: '',
    append(...nodes) { this.children.push(...nodes); },
    appendChild(node) { this.children.push(node); return node; },
    insertBefore(node, before) { const i = this.children.indexOf(before); this.children.splice(i < 0 ? 0 : i, 0, node); },
    setAttribute(name, value) { this.attributes[name] = String(value); },
    getAttribute(name) { return this.attributes[name] ?? null; },
    set textContent(value) { this._text = String(value); this.children = []; },
    get textContent() { return this._text + this.children.map(x => x.textContent || '').join(''); }
  };
}
const sandbox = { document: { createElement: element }, jdGroupingReviewSequence: 0 };
vm.createContext(sandbox);
vm.runInContext(live.slice(start, end), sandbox);
const render = sandbox.renderJobDescriptionGroupingReview;

const artifact = {
  type: 'jobDescriptionGroupingReview', revision: 4, confirmed: false,
  groups: [
    { groupId: 'a', label: 'Sama <img src=x onerror=alert(1)>', sourceCodes: ['2.2', '1.1'] },
    { groupId: 'b', label: 'Sama <img src=x onerror=alert(1)>', sourceCodes: ['3.1'] }
  ],
  items: [
    { groupId: 'a', processCode: '2.2', processName: 'Nama panjang proses kedua' },
    { groupId: 'a', processCode: '1.1', processName: null },
    { groupId: 'b', processCode: '3.1', processName: 'Proses ketiga' }
  ]
};

function walk(node, predicate, found = []) {
  if (predicate(node)) found.push(node);
  for (const child of node.children || []) walk(child, predicate, found);
  return found;
}
const hasClass = name => node => String(node.className || '').split(/\s+/).includes(name);

test('DOM preserves group and process order, duplicate labels, rowspans, counts and source names', () => {
  const parent = element('div');
  const card = render(parent, artifact);
  const groups = walk(card, hasClass('fiona-ai-jd-grouping-tbody'));
  assert.equal(groups.length, 2, 'one desktop tbody per group');
  const desktopDutyCells = walk(card, hasClass('fiona-ai-jd-grouping-duty'));
  assert.equal(desktopDutyCells.length, 2);
  assert.deepEqual(desktopDutyCells.map(x => x.rowSpan), [2, 1]);
  assert.ok(desktopDutyCells.every(x => x.tag === 'th' && x.scope === 'rowgroup' && x.id));
  for (const groupBody of groups) {
    const groupHeaderId = walk(groupBody, hasClass('fiona-ai-jd-grouping-duty'))[0].id;
    const processCells = walk(groupBody, node => node.tag === 'td');
    assert.equal(processCells.length, groupBody.children.length * 2);
    assert.ok(processCells.every(cell => cell.getAttribute('headers').split(/\s+/).includes(groupHeaderId)));
  }
  assert.match(card.textContent, /Kelompok 1 · 2 proses/);
  assert.match(card.textContent, /Kelompok 2 · 1 proses/);
  assert.match(card.textContent, /Nama panjang proses kedua/);
  assert.match(card.textContent, /Nama proses tidak tersedia \(1\.1\)/);
  assert.equal(walk(card, node => node.tag === 'td' && node.textContent === '2.2').length, 2, 'same order appears in both views');
  assert.equal(walk(card, node => node.tag === 'td' && node.textContent === '1.1').length, 2);
  assert.equal(walk(card, node => node.tag === 'td' && node.textContent === '3.1').length, 2);
  assert.match(card.textContent, /Sama <img src=x onerror=alert\(1\)>/);
  assert.equal(walk(card, node => node.tag === 'img').length, 0, 'all user supplied strings stay text');
  assert.match(card.textContent, /Menunggu persetujuan/);
});

test('malformed membership produces an explicit retry error with no partial table', () => {
  const parent = element('div');
  const card = render(parent, { ...artifact, groups: [{ groupId: 'a', label: 'Tugas', sourceCodes: ['missing'] }] });
  assert.equal(walk(card, hasClass('fiona-ai-jd-grouping-table')).length, 0);
  assert.match(card.textContent, /Data pengelompokan tidak lengkap/);
  assert.equal(walk(card, node => node.getAttribute?.('role') === 'alert').length, 1);
});

test('duplicate process codes across groups are rejected case insensitively', () => {
  const parent = element('div');
  const duplicate = {
    ...artifact,
    groups: [
      { groupId: 'a', label: 'Tugas A', sourceCodes: ['1.1'] },
      { groupId: 'b', label: 'Tugas B', sourceCodes: ['1.1'] }
    ],
    items: [
      { groupId: 'a', processCode: '1.1', processName: 'Proses' },
      { groupId: 'b', processCode: '1.1', processName: 'Proses' }
    ]
  };
  const card = render(parent, duplicate);
  assert.equal(walk(card, hasClass('fiona-ai-jd-grouping-table')).length, 0);
  assert.match(card.textContent, /Data pengelompokan tidak lengkap/);
});

test('live and history render the saved artifact through the same renderer and container width selects one view', () => {
  assert.match(live, /else if \(data\.artifact\?\.type === 'jobDescriptionGroupingReview'\) renderJobDescriptionGroupingReview\(bubble, data\.artifact\)/);
  assert.match(history, /deps\.renderJobDescriptionGroupingReview\(bubble, artifactData\.artifact\)/);
  assert.match(live, /renderJobDescriptionGroupingReview,\s*esc,/);
  assert.match(css, /@container fiona-jd-review \(min-width: 640px\)/);
  assert.match(css, /\.fiona-ai-jd-grouping-desktop \{ display: none/);
  assert.match(css, /\.fiona-ai-jd-grouping-mobile \{ display: block/);
  assert.match(css, /:is\(td, th\.fiona-ai-jd-grouping-duty\)/);
  assert.match(css, /th\.fiona-ai-jd-grouping-duty[\s\S]*text-transform: none !important/);
  assert.match(css, /\.fiona-ai-jd-grouping-review \.fiona-ai-jd-grouping-table th\.fiona-ai-jd-grouping-duty\s*\{\s*border-bottom:\s*2px solid #333;/);
});
