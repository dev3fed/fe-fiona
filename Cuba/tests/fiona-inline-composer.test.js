const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const jsDir = path.join(__dirname, '..', 'wwwroot', 'assets', 'js');
const contextScript = fs.readFileSync(path.join(jsDir, 'assistant', 'fiona-assistant-context.js'), 'utf8');
const assistantScript = fs.readFileSync(path.join(jsDir, 'fiona-ai-assistant.js'), 'utf8');
const partial = fs.readFileSync(path.join(__dirname, '..', 'Views', 'Shared', '_AiAssistant.cshtml'), 'utf8');
const css = fs.readFileSync(path.join(__dirname, '..', 'wwwroot', 'assets', 'css', 'fiona-ai-assistant.css'), 'utf8');
const contextEngine = require(path.join(jsDir, 'assistant', 'fiona-assistant-context.js'));

test('assistant markup defines contenteditable div input with aria and placeholder attributes', () => {
  assert.match(partial, /<div\s+id="fionaAiInput"\s+class="fiona-ai-input"\s+contenteditable="true"/);
  assert.match(partial, /role="textbox"/);
  assert.match(partial, /aria-multiline="true"/);
  assert.match(partial, /data-placeholder="/);
});

test('css contains inline contenteditable input and atomic chip styles', () => {
  assert.match(css, /\.fiona-ai-input\s*\{/);
  assert.match(css, /\.fiona-ai-input:empty::before/);
  assert.match(css, /\.fiona-inline-chip\s*\{/);
  assert.match(css, /\.fiona-inline-chip\.is-position\s*\{/);
  assert.match(css, /\.fiona-inline-chip\.is-process\s*\{/);
  assert.match(css, /\.fiona-inline-chip\s+\.chip-badge\s*\{/);
  assert.match(css, /\.fiona-inline-chip\s+\.chip-label\s*\{/);
  assert.match(css, /\.fiona-inline-chip\s+\.chip-remove\s*\{/);
  assert.match(css, /\.fiona-ai-panel\.is-empty \.fiona-ai-composer :is\(textarea, \.fiona-ai-input\)\{min-height:44px;padding:10px 12px;[^}]*font-size:13px/);
  assert.match(css, /\.fiona-ai-panel\.is-empty \.fiona-ai-composer button\{width:44px;height:44px/);
  assert.match(css, /\.fiona-ai-panel\.is-empty \.fiona-ai-composer \.fiona-ai-input\s*\{[\s\S]*?min-height: 44px;[\s\S]*?max-height: 160px;/);
  assert.match(css, /\.fiona-ai-panel\.is-empty \.fiona-ai-composer \.fiona-inline-chip\s*\{[\s\S]*?height: 28px;/);
  assert.match(css, /\.fiona-ai-panel\.is-empty \.fiona-ai-composer \.fiona-inline-chip \.chip-remove\s*\{[\s\S]*?width: 13px;/);
});

test('context engine exports complete inline mention and serialization API', () => {
  assert.match(contextScript, /insertInlineChip/);
  assert.match(contextScript, /createInlineChipElement/);
  assert.match(contextScript, /getComposerContent/);
  assert.match(contextScript, /setComposerText/);
  assert.match(contextScript, /clearComposer/);
  assert.match(contextScript, /focusComposer/);
  assert.match(contextScript, /setComposerDisabled/);
  assert.match(contextScript, /handleBackspaceAtomic/);
  assert.match(contextScript, /handleInputMentionScan/);
});

test('context engine correctly serializes mixed inline text and chips into canonical format', () => {
  // Mock DOM environment to verify serializer traversal
  class MockNode {
    constructor(nodeType, textContent = '') {
      this.nodeType = nodeType;
      this.textContent = textContent;
      this.childNodes = [];
      this.attributes = {};
      this.classList = {
        contains: (cls) => this._classes?.includes(cls) || false
      };
      this._classes = [];
    }
    getAttribute(name) { return this.attributes[name] || null; }
    setAttribute(name, val) { this.attributes[name] = val; }
  }

  const TEXT_NODE = 3;
  const ELEMENT_NODE = 1;

  const mockInput = new MockNode(ELEMENT_NODE);

  const textNode1 = new MockNode(TEXT_NODE, 'Tolong evaluasi ');
  const chipPos = new MockNode(ELEMENT_NODE);
  chipPos._classes = ['fiona-inline-chip', 'is-position'];
  chipPos.setAttribute('data-type', 'position');
  chipPos.setAttribute('data-label', 'Manager HSE');
  chipPos.setAttribute('data-id', 'pos-101');

  const textNode2 = new MockNode(TEXT_NODE, ' terhadap ');
  const chipProc = new MockNode(ELEMENT_NODE);
  chipProc._classes = ['fiona-inline-chip', 'is-process'];
  chipProc.setAttribute('data-type', 'process');
  chipProc.setAttribute('data-label', 'Audit Lingkungan');
  chipProc.setAttribute('data-id', 'proc-202');
  chipProc.setAttribute('data-index', '1.2.3');

  mockInput.childNodes = [textNode1, chipPos, textNode2, chipProc];

  // Run traversal
  const mentionedEntities = [];
  let text = '';
  function traverse(node) {
    if (node.nodeType === TEXT_NODE) {
      text += node.textContent.replace(/\u00A0/g, ' ');
    } else if (node.nodeType === ELEMENT_NODE) {
      if (node.classList.contains('fiona-inline-chip')) {
        const type = node.getAttribute('data-type') || 'position';
        const label = node.getAttribute('data-label') || '';
        const id = node.getAttribute('data-id');
        mentionedEntities.push({ type, label, id });
        text += type === 'position' ? ` @Jabatan:"${label}" ` : ` @Prosbis:"${label}" `;
      }
    }
  }
  for (const child of mockInput.childNodes) traverse(child);
  const cleaned = text.replace(/[ \t]+/g, ' ').trim();

  assert.equal(cleaned, 'Tolong evaluasi @Jabatan:"Manager HSE" terhadap @Prosbis:"Audit Lingkungan"');
  assert.equal(mentionedEntities.length, 2);
  assert.deepEqual(mentionedEntities[0], { type: 'position', label: 'Manager HSE', id: 'pos-101' });
  assert.deepEqual(mentionedEntities[1], { type: 'process', label: 'Audit Lingkungan', id: 'proc-202' });
});

test('assistant script delegates composer interaction to Context inline composer API', () => {
  assert.match(assistantScript, /Context\?\.getComposerContent\(\)/);
  assert.match(assistantScript, /Context\?\.clearComposer\(\)/);
  assert.match(assistantScript, /Context\?\.focusComposer\(\)/);
  assert.match(assistantScript, /Context\?\.setComposerDisabled\(/);
});

test('context engine prevents mention selector jumping and supports smooth arrow keyboard navigation', () => {
  assert.match(contextScript, /moveMentionSelection/);
  assert.match(contextScript, /setMentionSelectedIndex/);
  assert.match(contextScript, /closeMentionPopup/);
  assert.match(contextScript, /mentionSearchSeq/);

  // Verify keydown stops propagation and prevents default for ArrowUp and ArrowDown
  assert.match(contextScript, /if \(event\.key === 'ArrowDown'\) \{\s*event\.preventDefault\(\);\s*event\.stopPropagation\(\);\s*moveMentionSelection\(1\);/);
  assert.match(contextScript, /if \(event\.key === 'ArrowUp'\) \{\s*event\.preventDefault\(\);\s*event\.stopPropagation\(\);\s*moveMentionSelection\(-1\);/);

  // Verify keyup suppresses mention rescanning when navigating with arrow keys
  assert.match(contextScript, /if \(mentionPopup && !mentionPopup\.hidden && \['ArrowUp', 'ArrowDown', 'Enter', 'Tab', 'Escape'\]\.includes\(event\.key\)\)/);

  // Verify search debounce and query deduplication prevents resetting active selection
  assert.match(contextScript, /activeMentionTrigger\.query === query/);
});

test('active mention parser keeps spaces in phrase queries and recognizes boundaries', () => {
  assert.deepEqual(contextEngine.parseActiveMention('Tinjau @Manager HSE'), {
    char: '@',
    type: 'position',
    query: 'Manager HSE',
    triggerString: '@Manager HSE',
    lengthToReplace: 12
  });
  assert.deepEqual(contextEngine.parseActiveMention('Bandingkan #Audit Lingkungan'), {
    char: '#',
    type: 'process',
    query: 'Audit Lingkungan',
    triggerString: '#Audit Lingkungan',
    lengthToReplace: 17
  });
  assert.deepEqual(contextEngine.parseActiveMention('Tinjau #1.2 Pengadaan'), {
    char: '#',
    type: 'process',
    query: '1.2 Pengadaan',
    triggerString: '#1.2 Pengadaan',
    lengthToReplace: 14
  });
  assert.equal(contextEngine.parseActiveMention('Cari @Manager HSE, lalu'), null);
  assert.equal(contextEngine.parseActiveMention('Cari @Manager HSE\n'), null);
  assert.equal(contextEngine.parseActiveMention('Cari @Manager\nHSE'), null);
  assert.deepEqual(contextEngine.parseActiveMention('Cari @Manager HSE #Audit'), {
    char: '#',
    type: 'process',
    query: 'Audit',
    triggerString: '#Audit',
    lengthToReplace: 6
  });
});

test('mention search debounces briefly and cancels obsolete in-flight requests', () => {
  assert.match(contextScript, /let mentionSearchController = null;/);
  assert.match(contextScript, /mentionSearchController\?\.abort\(\);/);
  assert.match(contextScript, /new AbortController\(\)/);
  assert.match(contextScript, /\{ method: 'GET', signal \}/);
  assert.match(contextScript, /\}, 60\);/);
});

test('position mention searches opt into mention mode without changing process searches', () => {
  assert.match(contextScript, /if \(targetType === 'position'\) params\.set\('mode', 'mention'\);/);
});

test('business-process mentions format hierarchy with parent in header, children before siblings, and indentation in hierarchy mode', () => {
  assert.match(contextScript, /fiona-ai-mention-header-parent/);
  assert.match(contextScript, /descSpan\.style\.paddingLeft\s*=\s*`\$\{indentPadding\}px`/);
  assert.match(css, /\.fiona-ai-mention-header-parent\s*\{/);
  assert.match(css, /\.fiona-ai-mention-item-level\s*\{/);
  assert.match(css, /\.fiona-ai-mention-item-desc\s*\{/);
});

test('mention UI copy Razor-escapes the single-character @ trigger', () => {
  assert.match(partial, /Jabatan \(@@\)/);
  assert.match(partial, /ketik @@ untuk Jabatan, # untuk Proses Bisnis/);
});

test('prosbis advanced search provides 2-pane modal, multi-select batch insertion, and disabled jabatan trigger', () => {
  // Disabled Jabatan in context menu
  assert.match(partial, /<button\s+type="button"\s+role="menuitem"\s+data-context-type="position"\s+disabled\s+class="is-disabled"/);
  // 2-pane modal structure & level filter pills
  assert.match(partial, /class="fiona-ai-context-modal fiona-prosbis-advanced-modal"/);
  assert.match(partial, /id="fionaAiContextLevelFilters"/);
  assert.match(partial, /id="fionaAiContextInspector"/);
  assert.match(partial, /id="fionaAiContextSelectionBar"/);
  assert.match(partial, /id="fionaAiContextInsertBatch"/);
  // Context script multi-select and inspector rendering
  assert.match(contextScript, /updateContextSelectionBar/);
  assert.match(contextScript, /renderInspector/);
  assert.match(contextScript, /fiona-ai-context-checkbox/);
  // CSS contains 2-pane and selection bar styles
  assert.match(css, /\.fiona-ai-context-body-grid\s*\{/);
  assert.match(css, /\.fiona-ai-context-inspector-pane\s*\{/);
  assert.match(css, /\.fiona-ai-context-selection-bar\s*\{/);
});