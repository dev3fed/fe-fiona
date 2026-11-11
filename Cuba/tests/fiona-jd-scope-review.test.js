const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');
const jsPath = path.join(__dirname, '..', 'wwwroot', 'assets', 'js', 'fiona-ai-assistant.js');
const source = fs.readFileSync(jsPath, 'utf8');
const start = source.indexOf('  const jdArtifacts = new Map();');
const end = source.indexOf('  function renderJobDescriptionGroupingReview(', start);
assert.ok(start >= 0 && end > start);
function all(node, tag) { return [...(node.tag === tag ? [node] : []), ...node.children.flatMap(x => all(x, tag))]; }
function el(tag) {
  return { tag, nodeType: 1, children: [], attributes: {}, dataset: {}, style: {}, value: '', _text: '', parentElement: null, offsetHeight: 90,
    append(...xs) { xs.forEach(x => this.appendChild(x)); },
    appendChild(x) { x.parentElement = this; this.children.push(x); return x; },
    set textContent(x) { this._text = String(x); this.children = []; },
    get textContent() { return this._text + this.children.map(x => x.textContent).join(''); },
    setAttribute(k, v) { this.attributes[k] = String(v); },
    querySelectorAll(selector) { return all(this, 'div').filter(x => selector === '.comment' && x.className === 'comment'); },
    querySelector(selector) { return all(this, selector)[0] || null; },
    closest(selector) { let x = this; while (x) { if (selector === '[data-comment-field]' && x.dataset?.commentField) return x; x = x.parentElement; } return null; },
    contains(x) { for (let p = x; p; p = p.parentElement) if (p === this) return true; return false; },
    remove() { if (this.parentElement) this.parentElement.children = this.parentElement.children.filter(x => x !== this); },
    getBoundingClientRect() { return { top: 100, right: 200 }; }, focus() {}, scrollIntoView() {} };
}
const sample = { contextToken: 'ctx', revision: 8, jobName: 'Manager Pengadaan', unitName: 'Pengadaan', items: [
  { id: 'c', processCode: '1.10', notation: 'A', summary: 'Evaluasi | Assignment note: hanya aplikasi pengadaan', reason: 'Batas sistem', decision: 'unresolved' },
  { id: 'a', processCode: '1', notation: 'R', summary: 'Pengelolaan', decision: 'main' },
  { id: 'b', processCode: '1.2.1', notation: 'R', summary: 'Pengadaan', decision: 'generic' }
] };
function setup(artifact = sample) {
  const storage = new Map(), sent = [], docs = [];
  const sandbox = { document: { createElement: el }, conversationId: 'conversation', busy: false, showChatView() {}, requestJson: async () => ({data: artifact}),
    sendMessage: async message => sent.push(message), openScopeArtifactTab() {
      const handlers = {}; let selected = null;
      const doc = { head: el('head'), body: el('body'), createElement: el,
        createTextNode(text) { const n = el('#text'); n.nodeType = 3; n.textContent = text; return n; },
        addEventListener(type, fn) { handlers[type] = fn; },
        getElementById(id) { return [...all(this.body, 'span'), ...all(this.body, 'div')].find(x => x.id === id); },
        createRange() { return { selectNodeContents(node) { this.node = node; }, setEnd(node, offset) { this.offset = offset; }, toString() { return this.node.textContent.slice(0, this.offset); } }; },
        select(field, first, last, endField = field) { selected = { field, endField, first, last }; handlers.mouseup(); } };
      const view = { document: doc, focus() {}, addEventListener() {}, localStorage: { get length() { return storage.size; }, key: index => [...storage.keys()][index], getItem: key => storage.get(key), setItem: (key, value) => storage.set(key, value) },
        getSelection() { return { rangeCount: selected ? 1 : 0, isCollapsed: !selected,
          getRangeAt() { const nodes = []; (function walk(node) { nodes.push(node); node.children.forEach(walk); })(doc.body);
            const firstIndex = nodes.indexOf(selected.field), lastIndex = nodes.indexOf(selected.endField);
            return { startContainer: selected.field, endContainer: selected.endField, startOffset: selected.first, endOffset: selected.last,
              intersectsNode(node) { const i = nodes.indexOf(node); return i >= firstIndex && i <= lastIndex; },
              toString: () => selected.field === selected.endField ? selected.field.textContent.slice(selected.first, selected.last) : selected.field.textContent.slice(selected.first) + selected.endField.textContent.slice(0, selected.last),
              getBoundingClientRect: () => ({ top: 100, right: 200 }) }; },
          removeAllRanges() { selected = null; } }; } };
      docs.push(doc); return { view, created: true, tab:{}, restore() {} };
    } };
  vm.createContext(sandbox); vm.runInContext(source.slice(start, end), sandbox);
  const parent = el('div'), card = sandbox.renderJobDescriptionScopeReview(parent, artifact);
  return { sandbox, storage, sent, docs, card, async open() { await all(card, 'a')[0].onclick({ preventDefault() {} }); return docs.at(-1); } };
}
function field(doc, id, name) { return all(doc.body, 'span').find(x => x.dataset.itemId === id && x.dataset.commentField === name); }
function comment(doc, id, name, from, to, text) {
  doc.select(field(doc, id, name), from, to);
  const plus = all(doc.body, 'button').find(x => x.className === 'add-comment'); assert.equal(plus.hidden, false); plus.onclick();
  const inputs = all(doc.body, 'textarea'); const input = inputs.at(-1); input.value = text; input.oninput();
}
function send(doc) { return all(doc.body, 'button').find(x => x.textContent === 'Kirim catatan ke Fiona'); }

test('scope review displays three separate tables with all assignments visible', async () => {
  const artifact = { ...sample, items: [
    { id: 'a', processCode: '1', notation: 'R', summary: 'Utama', decision: 'main' },
    { id: 'b', processCode: '2', notation: 'A', summary: 'Umum', decision: 'generic' },
    { id: 'c', processCode: '3', notation: 'R', summary: 'Perlu ditinjau', decision: 'unresolved', suggestion: 'clarify' },
    { id: 'd', processCode: '4', notation: 'R', summary: 'Tidak sesuai', decision: 'incorrect', humanDecision: true }
  ] };
  const doc = await setup(artifact).open();
  const tables = all(doc.body, 'table');
  assert.equal(tables.length, 3);
  assert.deepEqual(tables.map(table => all(table, 'th').map(cell => cell.textContent)), [
    ['Indeks', 'Notasi', 'Proses dan komentar'],
    ['Indeks', 'Notasi', 'Proses dan komentar'],
    ['Indeks', 'Notasi', 'Proses dan komentar', 'Keputusan saat ini', 'Saran dan alasan Fiona']
  ]);
  assert.ok(all(doc.body, 'span').every(span => !String(span.className || '').includes('decision-attention')));
  assert.deepEqual(tables.map(table => all(table, 'tbody')[0].children.map(row => row.children[0].textContent)), [['1'], ['2'], ['3', '4']]);
  assert.ok(tables.every(table => { for (let node = table.parentElement; node; node = node.parentElement) if (node.tag === 'details') return false; return true; }));
});
test('hierarchy is sorted and indented without adding a per-row comment column', async () => {
  const state = setup(), doc = await state.open(), rows = all(doc.body, 'tbody').flatMap(body => body.children);
  assert.deepEqual(rows.map(x => x.children[0].textContent), ['1', '1.2.1', '1.10']);
  assert.equal(rows[1].children[2].style.paddingLeft, '23px');
  assert.match(rows[1].children[2].textContent, /↳/);
  assert.equal(rows[1].children[2].style.position, 'relative');
  assert.equal(rows[1].children[2].children[0].style.position, 'absolute');
  assert.equal(rows[1].children[2].children[0].style.left, '7px');
  assert.equal(rows[2].children.length, 5); assert.equal(all(doc.body, 'textarea').length, 0);
  assert.match(field(doc, 'c', 'process').textContent, /hanya aplikasi pengadaan/);
});
test('orphan processes have no arrow or indentation; only visible ancestors create levels', async () => {
  const artifact = { ...sample, items: [
    { id: 'a', processCode: '2.3', notation: 'R', summary: 'Tanpa induk' },
    { id: 'b', processCode: '2.3.4', notation: 'R', summary: 'Anak' },
    { id: 'c', processCode: '2.3.4.5', notation: 'A', summary: 'Cucu' }
  ] };
  const rows = all((await setup(artifact).open()).body, 'tbody').flatMap(body => body.children);
  assert.equal(rows[0].children[2].style.paddingLeft, '7px');
  assert.doesNotMatch(rows[0].children[2].textContent, /↳/);
  assert.equal(rows[1].children[2].style.paddingLeft, '23px');
  assert.match(rows[1].children[2].textContent, /↳/);
  assert.equal(rows[2].children[2].style.paddingLeft, '39px');
});
test('zebra colors alternate between visible hierarchy roots', async () => {
  const artifact = { ...sample, items: [
    { id: 'a', processCode: '1.2', notation: 'R', summary: 'Satu' },
    { id: 'b', processCode: '1.3', notation: 'A', summary: 'Dua' },
    { id: 'c', processCode: '2', notation: 'R', summary: 'Tiga' },
    { id: 'd', processCode: '2.1', notation: 'R', summary: 'Empat' },
    { id: 'e', processCode: '10', notation: 'A', summary: 'Lima' }
  ] };
  const rows = all((await setup(artifact).open()).body, 'tbody').flatMap(body => body.children);
  assert.deepEqual(rows.map(row => row.className), ['hierarchy-even', 'hierarchy-odd', 'hierarchy-even', 'hierarchy-even', 'hierarchy-odd']);
  assert.doesNotMatch(rows[0].children[2].textContent, /↳/);
});
test('selection creates an anchored comment and sends the quotation with its assignment', async () => {
  const state = setup(), doc = await state.open(); comment(doc, 'c', 'process', 0, 8, 'Jadikan tugas utama');
  assert.equal(all(doc.body, 'mark')[0].textContent, 'Evaluasi');
  assert.equal(all(doc.body, 'blockquote')[0].textContent, 'Evaluasi');
  await send(doc).onclick();
  assert.match(state.sent[0], /konteks ctx, revisi 8/);
  assert.match(state.sent[0], /Proses 1\.10, notasi A, ID c; kutipan: “Evaluasi”; komentar: Jadikan tugas utama/);
  assert.match(state.sent[0], /Lanjutkan otomatis/);
});
test('a selection can span cells and rows, and another can overlap it', async () => {
  const state = setup(), doc = await state.open();
  const first = field(doc, 'a', 'process'), last = field(doc, 'b', 'process');
  doc.select(first, 0, 4, last);
  const plus = all(doc.body, 'button').find(x => x.className === 'add-comment'); assert.equal(plus.hidden, false); plus.onclick();
  let input = all(doc.body, 'textarea')[0]; input.value = 'Gabungkan'; input.oninput();
  assert.ok(all(doc.body, 'mark').length >= 2);
  comment(doc, 'a', 'process', 1, 4, 'Perjelas');
  assert.equal(all(doc.body, 'textarea').length, 2);
  await send(doc).onclick();
  assert.match(state.sent[0], /Proses 1, notasi R, ID a; Proses 1\.2\.1, notasi R, ID b/);
  assert.match(state.sent[0], /komentar: Gabungkan/);
  assert.match(state.sent[0], /komentar: Perjelas/);
});
test('the document introduction can also receive comments', async () => {
  const state = setup(), doc = await state.open(); const title = all(doc.body, 'h1')[0];
  doc.select(title, 0, 9); const plus = all(doc.body, 'button').find(x => x.className === 'add-comment');
  assert.equal(plus.hidden, false); plus.onclick(); assert.equal(all(doc.body, 'blockquote')[0].textContent, 'Tinjauan ');
});
test('comments persist on reopening but clear for a new revision', async () => {
  const state = setup(), doc = await state.open(); comment(doc, 'a', 'process', 0, 5, 'Perjelas');
  let reopened = await state.open(); assert.equal(all(reopened.body, 'textarea')[0].value, 'Perjelas');
  sample.revision = 9; reopened = await state.open(); assert.equal(all(reopened.body, 'textarea').length, 0); sample.revision = 8;
});
test('comment cards follow document position even when added in reverse order', async () => {
  const state = setup(), doc = await state.open();
  comment(doc, 'c', 'process', 0, 5, 'Bawah');
  comment(doc, 'a', 'process', 0, 5, 'Atas');
  const cards = all(doc.body, 'div').filter(x => x.className === 'comment');
  doc.getElementById(cards[0].dataset.anchor).getBoundingClientRect = () => ({top: 600});
  doc.getElementById(cards[1].dataset.anchor).getBoundingClientRect = () => ({top: 200});
  all(doc.body, 'textarea')[1].oninput();
  assert.ok(parseFloat(cards[1].style.top) < parseFloat(cards[0].style.top));
});
test('old row notes migrate without loss', async () => {
  const state = setup(); state.storage.set('fiona-scope-notes:conversation:ctx:8', JSON.stringify({ a: 'Catatan lama' }));
  const doc = await state.open(); assert.equal(all(doc.body, 'textarea')[0].value, 'Catatan lama'); assert.equal(all(doc.body, 'mark')[0].textContent, 'Pengelolaan');
});
test('empty comments, another conversation, and a busy agent do not send', async () => {
  const state = setup(), doc = await state.open(); await send(doc).onclick(); assert.equal(state.sent.length, 0);
  comment(doc, 'a', 'process', 0, 5, 'Perjelas'); state.sandbox.conversationId = 'other'; await send(doc).onclick(); assert.equal(state.sent.length, 0);
  state.sandbox.conversationId = 'conversation'; state.sandbox.busy = true; await send(doc).onclick(); assert.equal(state.sent.length, 0);
});
test('deleting a comment removes the highlight and saved note', async () => {
  const state = setup(), doc = await state.open(); comment(doc, 'a', 'process', 0, 5, 'Perjelas');
  all(doc.body, 'button').find(x => x.textContent === 'Hapus').onclick();
  assert.equal(all(doc.body, 'mark').length, 0); assert.equal(all(doc.body, 'textarea').length, 0);
  assert.deepEqual(JSON.parse(state.storage.get('fiona-scope-notes:conversation:ctx')), []);
});
test('continuation metadata survives retry', () => {
  const begin = source.indexOf('  function buildChatRequestBody('), finish = source.indexOf('  async function sendMessage(', begin);
  const sandbox = {}; vm.createContext(sandbox); vm.runInContext(source.slice(begin, finish), sandbox);
  const metadata = { contextToken: 'ctx', revision: 12 };
  const request = sandbox.buildChatRequestBody('Lanjut', 'conv', {}, 'model', false, null, metadata);
  const retried = sandbox.buildChatRequestBody(request.message, 'conv', {}, 'model', false, request, null);
  assert.deepEqual(JSON.parse(JSON.stringify(retried.scopeContinuation)), metadata);
});
test('history keeps the scope artifact renderer', () => {
  const history = fs.readFileSync(path.join(path.dirname(jsPath), 'assistant', 'fiona-assistant-history.js'), 'utf8');
  assert.match(history, /renderJdArtifact\(bubble, artifactData\?\.artifact\)/);
});
test('artifact opens in a blocking dialog and closes back to chat', () => {
  const start = source.indexOf('  function closeArtifactDialog()');
  const end = source.indexOf('  function clearMemoryState()', start);
  function dom(tag) {
    const node = el(tag);
    if (tag === 'iframe') node.contentWindow = { document: {} };
    node.addEventListener = () => {};
    return node;
  }
  const dialog = dom('dialog'); dialog.open = false;
  dialog.showModal = () => { dialog.open = true; };
  dialog.close = () => { dialog.open = false; };
  const sandbox = { document: { createElement: dom }, artifactDialog: dialog, artifactTitle: dom('h2'), artifactClose: dom('button'),
    artifactViews: dom('div'), artifactTabs: new Map(),
    jdArtifactKey: (artifact, origin) => JSON.stringify([origin, artifact.contextToken]) };
  vm.createContext(sandbox); vm.runInContext(source.slice(start, end), sandbox);
  const first = sandbox.openScopeArtifactTab(sample, 'conv');
  assert.equal(first.created, true); assert.equal(dialog.open, true);
  assert.equal(sandbox.artifactTabs.size, 1);
  assert.equal(sandbox.openScopeArtifactTab(sample, 'conv').created, false);
  sandbox.closeArtifactDialog();
  assert.equal(dialog.open, false); assert.equal(sandbox.artifactTabs.size, 0);
  assert.equal(sandbox.openScopeArtifactTab(sample, 'conv', true), null);
});


test('scope groups follow actual dotted ancestors and surface unresolved mixed decisions', () => {
  const state = setup();
  const groups = state.sandbox.groupScopeItems([
    {id:'a', processCode:'1.1', decision:'main'},
    {id:'b', processCode:'1.1.2', decision:'generic', humanDecision:true},
    {id:'c', processCode:'1.10', decision:'unresolved', suggestion:'generic'},
    {id:'d', processCode:'1.2', decision:'unresolved', suggestion:'main'}
  ]);
  assert.equal(groups.length, 3);
  assert.equal(groups[0].category, 'clarify');
  assert.deepEqual(Array.from(groups[0].members, x => x.id), ['a','b']);
  assert.equal(groups[1].category, 'generic');
  assert.equal(groups[2].category, 'main');
  const acknowledged = state.sandbox.groupScopeItems(groups[0].members.map(x => ({...x, mixedAcknowledgement:groups[0].signature})));
  assert.equal(acknowledged[0].category, 'resolved');
});


test('artifact registry keeps newest revision and isolates sessions', () => {
  const state = setup(), registry = state.sandbox;
  const first = {type:'jobDescriptionScopeReview', contextToken:'a', revision:3};
  const newer = {...first, revision:5};
  registry.rememberJdArtifact(first, 'one'); registry.rememberJdArtifact(newer, 'one');
  registry.rememberJdArtifact({...first, revision:4}, 'one');
  assert.equal(registry.latestJdArtifact(first, 'one').revision, 5);
  registry.rememberJdArtifact({...first, revision:1}, 'two');
  assert.equal(registry.latestJdArtifact(first, 'two').revision, 1);
});

test('migration preserves old notes once and does not resurrect deleted notes', () => {
  const state = setup(), map = state.storage;
  const storage = {get length() { return map.size; }, key:i => [...map.keys()][i], getItem:k => map.get(k), setItem:(k,v) => map.set(k,v)};
  map.set('fiona-scope-notes:conversation:ctx:1', JSON.stringify([{id:'old',quote:'old',text:'keep'}]));
  let loaded = state.sandbox.loadJdNotes(storage, 'fiona-scope-notes', 'conversation', sample);
  assert.equal(loaded.notes.length, 1);
  storage.setItem(loaded.key, '[]');
  loaded = state.sandbox.loadJdNotes(storage, 'fiona-scope-notes', 'conversation', sample);
  assert.equal(loaded.notes.length, 0);
  assert.ok(map.has('fiona-scope-notes:conversation:ctx:1'));
});


test('preview schema version does not interfere with revision ordering', () => {
  const registry = setup().sandbox;
  const first = {type:'jobDescriptionPreview', contextToken:'ctx', version:'jd-preview-v1', revision:100};
  registry.rememberJdArtifact(first, 'conversation');
  registry.rememberJdArtifact({...first, revision:102}, 'conversation');
  registry.rememberJdArtifact({...first, revision:101}, 'conversation');
  assert.equal(registry.latestJdArtifact(first, 'conversation').revision, 102);
});


test('fully excluded scope groups do not generate a clarification question', () => {
  const state = setup();
  const groups = state.sandbox.groupScopeItems([
    {id:'a', processCode:'1.1', decision:'incorrect', humanDecision:true},
    {id:'b', processCode:'1.1.2', decision:'incorrect', humanDecision:true}
  ]);
  assert.equal(groups.length, 1);
  assert.equal(groups[0].category, 'excluded');
});
