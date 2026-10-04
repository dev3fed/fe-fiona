const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const rasciScript = fs.readFileSync(path.join(__dirname, '..', 'wwwroot', 'assets', 'js', 'fiona-rasci-matrix.js'), 'utf8');
const assistantScript = fs.readFileSync(path.join(__dirname, '..', 'wwwroot', 'assets', 'js', 'fiona-ai-assistant.js'), 'utf8');
const partial = fs.readFileSync(path.join(__dirname, '..', 'Views', 'Shared', '_AiAssistant.cshtml'), 'utf8');
const css = fs.readFileSync(path.join(__dirname, '..', 'wwwroot', 'assets', 'css', 'fiona-ai-assistant.css'), 'utf8');

test('rasci matrix script registers fiona-rasci-matrix, rasci-table-viewer and all Generative UI web components', () => {
  assert.match(rasciScript, /customElements\.define\(TAG_NAME,\s*FionaRasciMatrix\)/);
  assert.match(rasciScript, /customElements\.define\(ALIAS_TAG_NAME,\s*FionaRasciMatrix\)/);
  assert.match(rasciScript, /const\s+ALIAS_TAG_NAME\s*=\s*['"]rasci-table-viewer['"]/);
  assert.match(rasciScript, /customElements\.define\(['"]ui-comparison-toolbar['"]/);
  assert.match(rasciScript, /customElements\.define\(['"]ui-action-chips['"]/);
  assert.match(rasciScript, /customElements\.define\(['"]ui-single-select['"]/);
  assert.match(rasciScript, /customElements\.define\(['"]ui-multi-select['"]/);
});

test('rasci matrix script normalizes and handles isAncestorContext flag and depth padding', () => {
  assert.match(rasciScript, /isAncestorContext:\s*Boolean\(item\.isAncestorContext\s*\?\?\s*item\.IsAncestorContext\)/);
  assert.match(rasciScript, /depth:\s*Number\.isFinite\(Number\(rawDepth\)\)\s*\?\s*Number\(rawDepth\)\s*:\s*null/);
  assert.match(rasciScript, /row\.className\s*=\s*`grid-row body-row\$\{isAncestor\s*\?\s*['"]\s*is-ancestor-context['"]\s*:\s*['"]['"]\}`/);
  assert.match(rasciScript, /data-ancestor-context/);
  assert.match(rasciScript, /process\.style\.paddingLeft\s*=\s*`\$\{6\s*\+\s*Math\.min\(12,\s*Number\(visualDepth\)\)\s*\*\s*14\}px`/);
});

test('rasci matrix script supports 3 operational modes with auto-expand rules', () => {
  assert.match(rasciScript, /mode\s*===\s*['"]by_position['"]\s*\|\|\s*mode\s*===\s*['"]by_business_process['"]/);
  assert.match(rasciScript, /const\s+shouldAutoExpand\s*=\s*isFilteredMode\s*\|\|\s*this\._data\.autoExpandAll\s*===\s*true/);
  assert.match(rasciScript, /this\._rows\.length\s*<=\s*200/);
});

test('rasci matrix comparison toolbar renders chips and dispatches comparison events', () => {
  assert.match(rasciScript, /_renderComparisonToolbar/);
  assert.match(rasciScript, /fiona-comparison-remove/);
  assert.match(rasciScript, /fiona-comparison-add/);
  assert.match(rasciScript, /Perbandingan Jabatan/);
  assert.match(rasciScript, /Perbandingan Proses/);
  assert.match(rasciScript, /comparison-chip-remove/);
  assert.match(rasciScript, /comparison-btn-add/);
});

test('assistant markup contains contextual input system, mention popup, tags, and context search modal', () => {
  const expectedIds = [
    'fionaAiMentionPopup',
    'fionaAiMentionList',
    'fionaAiMentionTags',
    'fionaAiContextAdd',
    'fionaAiContextModal',
    'fionaAiContextModalClose',
    'fionaAiTabPosition',
    'fionaAiTabProcess',
    'fionaAiContextSearch',
    'fionaAiContextLoading',
    'fionaAiContextList',
    'fionaAiContextEmpty',
    'fionaAiContextCancel'
  ];

  for (const id of expectedIds) {
    assert.match(partial, new RegExp(`id="${id}"`), `Expected element id="${id}" in _AiAssistant.cshtml`);
  }
});

test('css contains styling for ancestor context, mention popup, context tags, and Generative UI components', () => {
  assert.match(css, /\.fiona-ai-mention-popup\s*\{/);
  assert.match(css, /\.fiona-ai-mention-tags\s*\{/);
  assert.match(css, /\.fiona-ai-mention-tag\.is-position\s*\{/);
  assert.match(css, /\.fiona-ai-mention-tag\.is-process\s*\{/);
  assert.match(css, /\.fiona-ai-context-modal\s*\{/);
  assert.match(css, /\.fiona-ai-context-tab\.is-active/);
  assert.match(css, /\.fiona-ai-action-chips/);
  assert.match(css, /\.action-chip/);
  assert.match(css, /ui-single-select,\s*ui-multi-select/);
  assert.match(rasciScript, /\.body-row\.is-ancestor-context\s*\{/);
  assert.match(rasciScript, /\.ancestor-context-badge\s*\{/);
});

test('assistant script contains DOMPurify configuration allowing custom Generative UI tags and attributes', () => {
  assert.match(assistantScript, /ADD_TAGS:\s*\[['"]rasci-table-viewer['"],\s*['"]fiona-rasci-matrix['"],\s*['"]ui-comparison-toolbar['"],\s*['"]ui-action-chips['"],\s*['"]ui-single-select['"],\s*['"]ui-multi-select['"],\s*['"]button['"]\]/);
  assert.match(assistantScript, /ADD_ATTR:\s*\[['"]data-prompt['"],\s*['"]data-action-chip['"],\s*['"]data['"],\s*['"]mode['"],\s*['"]title['"]/);
});

test('assistant script contains parallel entity search, mention matching, context modal search, and event listeners', () => {
  assert.match(assistantScript, /function\s+renderMentionTags\s*\(/);
  assert.match(assistantScript, /function\s+addContextEntity\s*\(/);
  assert.match(assistantScript, /function\s+removeContextEntity\s*\(/);
  assert.match(assistantScript, /function\s+searchEntities\s*\(/);
  assert.match(assistantScript, /Promise\.all\(promises\)/);
  assert.match(assistantScript, /function\s+renderMentionPopup\s*\(/);
  assert.match(assistantScript, /function\s+openContextModal\s*\(/);
  assert.match(assistantScript, /function\s+closeContextModal\s*\(/);
  assert.match(assistantScript, /fiona-action-click/);
  assert.match(assistantScript, /fiona-comparison-remove/);
  assert.match(assistantScript, /fiona-comparison-add/);
  assert.match(assistantScript, /mentionedEntities:\s*attachedContextEntities/);
  assert.match(assistantScript, /pointerdown/);
});
