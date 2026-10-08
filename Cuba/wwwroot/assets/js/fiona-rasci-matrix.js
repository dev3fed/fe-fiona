/*
 * Fiona RASCI matrix web component & Generative UI components.
 *
 * Supports 3 operational modes:
 * - full_matrix: complete matrix with 200-row threshold rule
 * - by_position: filtered by positions, ancestor context L1 styling, auto-expanded
 * - by_business_process: filtered by business processes, ancestor context L1, auto-expanded
 *
 * Web Components registered:
 * - <fiona-rasci-matrix data='{"columns":[],"rows":[]}'></fiona-rasci-matrix>
 * - <rasci-table-viewer data='{"columns":[],"rows":[]}'></rasci-table-viewer>
 * - <ui-comparison-toolbar></ui-comparison-toolbar>
 * - <ui-action-chips></ui-action-chips>
 */
(function (global) {
  "use strict";

  const TAG_NAME = "fiona-rasci-matrix";
  const ALIAS_TAG_NAME = "rasci-table-viewer";
  const NOTATION_ORDER = ["R", "A", "S", "C", "I"];
  const IDENTITY_WIDTH = [44, 72, 300];
  const DEFAULT_JOB_WIDTH = 140;
  const DEFAULT_ROW_HEIGHT = 32;
  const DEFAULT_REMOTE_PAGE_SIZE = 100;
  const MAX_REMOTE_PAGE_SIZE = 500;
  const OVERSCAN_ROWS = 10;
  const OVERSCAN_COLUMNS = 3;

  const CSS = `
    :host {
      --rasci-level-width: 44px;
      --rasci-index-width: 72px;
      --rasci-process-width: 300px;
      --rasci-job-width: 140px;
      --rasci-row-height: 32px;
      --rasci-header-height: 36px;
      --rasci-border: #b8d4ea;
      --rasci-text: #102e59;
      --rasci-muted: #5b738e;
      --rasci-surface: #ffffff;
      --rasci-header-surface: #f0f6fb;
      --rasci-hover: #eaf3fb;
      --rasci-focus: #006ca9;
      --rasci-accent: #006ca9;
      --rasci-badge: #f3f5f7;
      --job-level-0-color: #980000;
      --job-level-1-color: #ffbf00;
      --job-level-2-color: #002060;
      --job-level-3-color: #06b0f0;
      --job-level-4-color: #ffe699;
      --job-level-default-color: #d9e1f2;
      display: block;
      min-width: 0;
      color: var(--rasci-text);
      font: 11.5px/1.3 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Public Sans", sans-serif;
    }
    *, *::before, *::after { box-sizing: border-box; }
    .frame { min-width: 0; border: 1px solid var(--rasci-border); border-radius: 4px; background: var(--rasci-surface); overflow: hidden; }
    .toolbar { display:flex; align-items:center; gap:10px; min-height:34px; padding:4px 8px; border-bottom:1px solid var(--rasci-border); background: #fbfdff; flex-wrap:wrap; }
    .toolbar-title { margin-right:auto; font-weight:700; font-size:11.5px; color:#0f3866; white-space:nowrap; }
    .toolbar-status { color:var(--rasci-muted); font-size:10.5px; white-space:nowrap; }
    
    /* Comparison Bar */
    .comparison-bar { display:flex; align-items:center; gap:6px; flex-wrap:wrap; padding:4px 8px; border-bottom:1px solid var(--rasci-border); background:#f8fafc; font-size:11px; }
    .comparison-mode-tag { font-weight:700; color:var(--rasci-accent); padding:2px 6px; border-radius:4px; background:#e0f2fe; font-size:10px; text-transform:uppercase; letter-spacing:0.03em; }
    .comparison-chips { display:flex; align-items:center; gap:4px; flex-wrap:wrap; }
    .comparison-chip { display:inline-flex; align-items:center; gap:4px; padding:2px 8px; background:#eef4fb; border:1px solid #bfdbfe; border-radius:999px; color:#1e40af; font-size:11px; font-weight:500; }
    .comparison-chip-remove { display:inline-flex; align-items:center; justify-content:center; width:14px; height:14px; padding:0; border:0; border-radius:50%; background:#dbeafe; color:#1e3a8a; cursor:pointer; font-size:10px; line-height:1; }
    .comparison-chip-remove:hover { background:#fee2e2; color:#991b1b; }
    .comparison-btn-add { display:inline-flex; align-items:center; gap:3px; padding:2px 8px; border:1px dashed var(--rasci-accent); border-radius:999px; background:#fff; color:var(--rasci-accent); cursor:pointer; font-size:10.5px; font-weight:600; }
    .comparison-btn-add:hover { background:#f0f9ff; border-style:solid; }

    [tabindex]:focus-visible, button:focus-visible { outline:2px solid var(--rasci-focus); outline-offset:-1px; }
    .viewport { position:relative; max-height: min(60vh, 520px); min-height:0; overflow:auto; overscroll-behavior-x:contain; overscroll-behavior-y:auto; isolation:isolate; font-size:11.5px; }
    .header { position:sticky; top:0; z-index:20; min-width:100%; height:var(--rasci-header-height); background:var(--rasci-header-surface); }
    .body { position:relative; min-width:100%; }
    .grid-row { display:grid; position:relative; min-width:100%; }
    .header .grid-row { height:var(--rasci-header-height); border-bottom:2px solid var(--rasci-border); background:var(--rasci-header-surface); }
    .body-row { position:absolute; left:0; height:var(--rasci-row-height); min-height:var(--rasci-row-height); border-bottom:1px solid var(--rasci-border); background:var(--rasci-surface); }
    .body-row:hover { background:var(--rasci-hover); }

    /* Ancestor Context L1 Styling (Gray / Dimmed Header Container) */
    .body-row.is-ancestor-context {
      background: #f1f5f9;
      color: #334155;
      font-weight: 600;
      border-bottom: 1px dashed #cbd5e1;
    }
    .body-row.is-ancestor-context:hover {
      background: #e2e8f0;
    }
    .body-row.is-ancestor-context .cell {
      color: #475569;
    }
    .body-row.is-ancestor-context .notation {
      opacity: 0.55;
    }

    .cell { min-width:0; min-height:0; padding:3px 6px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; border-right:1px solid var(--rasci-border); display:flex; align-items:center; }
    .header-cell { font-weight:600; font-size:11px; color:#103866; white-space:normal; line-height:1.2; border-right:1px solid var(--rasci-border); border-top:4px solid transparent; }
    .sticky { position:sticky; z-index:5; background:inherit; border-right:1px solid var(--rasci-border); }
    .header .sticky { z-index:25; background:var(--rasci-header-surface); }
    .level-cell { left:0; justify-content:center; text-align:center; font-weight:500; }
    .index-cell { left:var(--rasci-level-width); justify-content:flex-start; text-align:left; font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; font-weight:500; }
    .process-cell { left:calc(var(--rasci-level-width) + var(--rasci-index-width)); justify-content:flex-start; }
    .process-label { display:flex; align-items:center; min-width:0; gap:4px; width:100%; }
    .process-label > span { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-size:11.5px; }
    .tree-toggle { flex:0 0 16px; width:16px; height:16px; padding:0; border:0; color:var(--rasci-accent); background:transparent; cursor:pointer; font-size:13px; line-height:1; display:flex; align-items:center; justify-content:center; }
    .tree-toggle[aria-expanded="true"] { transform:rotate(90deg); }
    .tree-toggle:disabled { visibility:hidden; cursor:default; }
    .job-cell { justify-content:center; gap:2px; padding:2px 4px; text-align:center; border-right:1px solid var(--rasci-border); }
    .job-head { justify-content:flex-start; text-align:left; overflow:hidden; border-top:4px solid var(--job-level-default-color); }
    .job-head.jabatan-level-0, .job-head.job-level-0 { border-top-color: var(--job-level-0-color); }
    .job-head.jabatan-level-1, .job-head.job-level-1 { border-top-color: var(--job-level-1-color); }
    .job-head.jabatan-level-2, .job-head.job-level-2 { border-top-color: var(--job-level-2-color); }
    .job-head.jabatan-level-3, .job-head.job-level-3 { border-top-color: var(--job-level-3-color); }
    .job-head.jabatan-level-4, .job-head.job-level-4 { border-top-color: var(--job-level-4-color); }
    .job-label { display:block; overflow:hidden; text-overflow:ellipsis; white-space:normal; }
    .notation { display:inline-flex; align-items:center; justify-content:center; min-width:18px; height:18px; padding:0 3px; border:1px solid #aeb9c4; border-radius:50%; color:#27323f; background:var(--rasci-badge); font-size:10px; font-weight:700; line-height:1; }
    .assignment-comment { width:15px; height:15px; margin-left:2px; cursor:help; opacity:.8; }
    .spacer { pointer-events:none; border-right:1px solid var(--rasci-border); }
    .empty, .loading, .error { display:flex; align-items:center; justify-content:center; min-height:120px; padding:15px; color:var(--rasci-muted); font-size:11.5px; }
    .error { color:#a12937; }
    .sr-only { position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0; }
    @media (max-width:700px) {
      :host { --rasci-process-width:240px; --rasci-job-width:130px; }
    }
  `;

  class FionaRasciMatrix extends HTMLElement {
    static get observedAttributes() { return ["data"]; }

    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this._data = null;
      this._columns = [];
      this._rows = [];
      this._rowById = new Map();
      this._children = new Map();
      this._roots = [];
      this._expanded = new Set();
      this._visibleRows = [];
      this._range = { rowStart: 0, rowEnd: 0, columnStart: 0, columnEnd: 0 };
      this._columnStart = 0;
      this._frameReady = false;
      this._raf = 0;
      this._remoteAbort = null;
      this._renderError = null;
      this._onScroll = this._scheduleRender.bind(this);
      this._onKeyDown = this._onGridKeyDown.bind(this);
    }

    connectedCallback() {
      this._ensureFrame();
      if (this.hasAttribute("data") && !this._data) this._setDataFromAttribute();
      this._scheduleRender();
      if (this._isRemote() && this._rows.length === 0) this._loadRemoteChildren(null);
    }

    disconnectedCallback() {
      if (this._remoteAbort) this._remoteAbort.abort();
      if (this._raf) cancelAnimationFrame(this._raf);
      this._raf = 0;
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (name === "data" && oldValue !== newValue && this.isConnected) this._setDataFromAttribute();
    }

    get data() { return this._data; }
    set data(value) { this._setData(value); }

    refresh() {
      this._renderError = null;
      if (this._isRemote()) {
        this._rows = [];
        this._rowById.clear();
        this._children.clear();
        this._roots = [];
        this._loadRemoteChildren(null);
      } else this._scheduleRender();
    }

    expandAll() {
      this._rowById.forEach((row) => { if (this._children.get(row.id)?.length) this._expanded.add(row.id); });
      this._scheduleRender();
    }

    collapseAll() { this._expanded.clear(); this._scheduleRender(); }

    _setDataFromAttribute() {
      const raw = this.getAttribute("data");
      if (!raw) return this._setData({ columns: [], rows: [] });
      try { this._setData(JSON.parse(raw)); }
      catch (error) { this._setData({ columns: [], rows: [] }, error); }
    }

    _setData(value, parseError) {
      this._data = value && typeof value === "object" ? value : { columns: [], rows: [] };
      this._renderError = parseError || null;
      this._columns = Array.isArray(this._data.columns) ? this._data.columns.map(this._normalizeColumn) : [];
      this._rows = [];
      this._rowById.clear();
      this._children.clear();
      this._roots = [];

      // Remote descriptors use `mode: remote` for transport, while the actual
      // table mode is carried in `remote.mode`.  Use that logical mode for UI
      // behaviour such as automatic hierarchy expansion.
      const mode = this._tableMode();
      const isFilteredMode = mode === 'by_position' || mode === 'by_business_process';
      const hasExplicitExpanded = Array.isArray(this._data.expandedRowIds);
      this._expanded = new Set(hasExplicitExpanded ? this._data.expandedRowIds.map(String) : []);

      this._mergeRows(Array.isArray(this._data.rows) ? this._data.rows : [], null);

      // Auto-expand rule:
      // Modes by_position & by_business_process: default autoExpandAll = true
      // Full matrix: if rows <= 200, expand all; if > 200, L1 only (not expanded)
      const shouldAutoExpand = isFilteredMode || this._data.autoExpandAll === true || (!hasExplicitExpanded && !this._isRemote() && this._rows.length <= 200);

      this._applyAutomaticExpansion(hasExplicitExpanded, shouldAutoExpand);

      this._ensureFrame();
      if (this._title) this._title.textContent = String(this._data.title || "RASCI Matrix");
      this._renderComparisonToolbar();
      this._scheduleRender();
      if (this.isConnected && this._isRemote() && this._rows.length === 0) this._loadRemoteChildren(null);
      this.dispatchEvent(new CustomEvent("fiona-rasci-ready", { bubbles: true, composed: true, detail: { rows: this._rows.length, columns: this._columns.length, mode } }));
    }

    _normalizeColumn(column, index) {
      const item = column && typeof column === "object" ? column : {};
      const rawLevel = item.level ?? item.layer ?? item.jobLevel;
      const level = rawLevel != null && !Number.isNaN(Number(rawLevel)) ? Number(rawLevel) : null;
      return {
        key: String(item.key ?? `job-${index + 1}`),
        label: String(item.label ?? item.name ?? "Jabatan"),
        positionCode: item.positionCode ?? null,
        unitCodeOrg: item.unitCodeOrg ?? null,
        prlOrg: item.prlOrg ?? null,
        level: level
      };
    }

    _tableMode() {
      const remoteMode = this._isRemote() ? this._data?.remote?.mode : null;
      return String(remoteMode || this._data?.mode || this._data?.renderMode || '').toLowerCase();
    }

    _applyAutomaticExpansion(hasExplicitExpanded, shouldAutoExpand) {
      if (hasExplicitExpanded || !shouldAutoExpand) return;
      this._rowById.forEach((row) => {
        if (this._children.get(row.id)?.length) this._expanded.add(row.id);
      });
    }

    _normalizeRow(row, index, parentHint) {
      const item = row && typeof row === "object" ? row : {};
      const id = String(item.id ?? item.businessProcessId ?? item.BusinessProcessId ?? `${item.index ?? item.Index ?? "row"}-${index}`);
      const rawDepth = item.depth ?? item.Depth;
      return {
        ...item,
        id,
        businessProcessId: item.businessProcessId ?? item.BusinessProcessId ?? item.id ?? null,
        level: item.level == null ? (item.Level == null ? "" : String(item.Level)) : String(item.level),
        index: item.index == null ? (item.Index == null ? "" : String(item.Index)) : String(item.index),
        businessProcess: String(item.businessProcess ?? item.BusinessProcess ?? item.process ?? "Proses bisnis"),
        parentId: item.parentId ?? item.parentBusinessProcessId ?? item.ParentBusinessProcessId ?? parentHint ?? null,
        depth: Number.isFinite(Number(rawDepth)) ? Number(rawDepth) : null,
        hasChildren: Boolean(item.hasChildren ?? item.HasChildren),
        assignments: item.assignments && typeof item.assignments === "object" ? item.assignments : (item.Assignments && typeof item.Assignments === "object" ? item.Assignments : {}),
        isAncestor: Boolean(item.isAncestor ?? item.IsAncestor),
        isAncestorContext: Boolean(item.isAncestorContext ?? item.IsAncestorContext),
        originalLevel: item.originalLevel ?? item.OriginalLevel ?? null,
        childrenLoaded: Boolean(item.childrenLoaded || Array.isArray(item.children)),
        loading: false
      };
    }

    _mergeRows(rows, parent, rebuild = true) {
      const parentId = parent ? String(parent.id ?? parent) : null;
      for (let index = 0; index < rows.length; index += 1) {
        const row = this._normalizeRow(rows[index], this._rows.length + index, parentId);
        // Keep the response order as a stable final tie-breaker.  The matrix is
        // often fed hierarchy indexes such as "1.2" and "1.10", which are not
        // safe to treat as decimal numbers.
        row._sourceOrder = this._rows.length;
        if (this._rowById.has(row.id)) {
          const existing = this._rowById.get(row.id);
          Object.assign(existing, row, { loading: existing.loading, _sourceOrder: existing._sourceOrder });
          continue;
        }
        this._rows.push(row);
        this._rowById.set(row.id, row);
        if (Array.isArray(rows[index]?.children)) {
          row.hasChildren = true;
          this._mergeRows(rows[index].children, row, false);
        }
      }
      if (rebuild) this._rebuildHierarchy();
    }

    _rebuildHierarchy() {
      this._children.clear();
      this._roots = [];
      const byIndex = new Map(this._rows.filter((row) => row.index).map((row) => [row.index, row]));
      const parentById = new Map();
      for (const row of this._rows) {
        let parentId = row.parentId == null ? null : String(row.parentId);
        if (!parentId && row.depth > 0 && row.index) {
          const parts = row.index.split(/[./\\-]/).filter(Boolean);
          if (parts.length > 1) {
            const parent = byIndex.get(parts.slice(0, -1).join("."));
            if (parent && parent.id !== row.id) parentId = parent.id;
          }
        }
        // A same-depth (notably L1-to-L1) relationship is never a valid tree
        // edge.  Ignore stale/malformed parent IDs rather than nesting one L1
        // branch beneath another after an expand/collapse render.
        const parent = parentId ? this._rowById.get(parentId) : null;
        if (parent && row.depth != null && parent.depth != null && parent.depth >= row.depth) parentId = null;
        parentById.set(row.id, parentId && this._rowById.has(parentId) && parentId !== row.id ? parentId : null);
      }
      for (const row of this._rows) {
        let current = row.id;
        const seen = new Set();
        while (current && !seen.has(current)) {
          seen.add(current);
          current = parentById.get(current) || null;
        }
        if (current && seen.has(current)) parentById.set(row.id, null);
      }
      for (const row of this._rows) {
        const parentId = parentById.get(row.id) || null;
        row.parentId = parentId;
        if (parentId) {
          if (!this._children.has(parentId)) this._children.set(parentId, []);
          this._children.get(parentId).push(row);
        } else {
          this._roots.push(row);
        }
      }
      for (const list of this._children.values()) list.sort((a, b) => this._compareRows(a, b));
      this._roots.sort((a, b) => this._compareRows(a, b));
      for (const row of this._rows) row.hasChildren = row.hasChildren || Boolean(this._children.get(row.id)?.length);
    }

    _rowOrder(row) {
      return row._sourceOrder ?? this._rows.indexOf(row);
    }

    _compareRows(a, b) {
      const compareIndex = (left, right) => {
        const leftParts = String(left || "").split(/[./\\-]/).filter(Boolean);
        const rightParts = String(right || "").split(/[./\\-]/).filter(Boolean);
        const count = Math.max(leftParts.length, rightParts.length);
        for (let index = 0; index < count; index += 1) {
          if (leftParts[index] == null) return -1;
          if (rightParts[index] == null) return 1;
          const leftNumber = Number(leftParts[index]);
          const rightNumber = Number(rightParts[index]);
          const bothNumeric = Number.isFinite(leftNumber) && Number.isFinite(rightNumber);
          const comparison = bothNumeric
            ? leftNumber - rightNumber
            : leftParts[index].localeCompare(rightParts[index], undefined, { numeric: true, sensitivity: "base" });
          if (comparison !== 0) return comparison;
        }
        return 0;
      };
      return compareIndex(a.index, b.index) || this._rowOrder(a) - this._rowOrder(b);
    }

    _flattenRows() {
      const visible = [];
      const visit = (row, depth, ancestors) => {
        row._renderDepth = row.depth != null ? row.depth : depth;
        row._ancestors = ancestors;
        visible.push(row);
        const children = this._children.get(row.id) || [];
        if (this._expanded.has(row.id)) for (const child of children) visit(child, depth + 1, ancestors.concat(row.id));
      };
      for (const row of this._roots) visit(row, 0, []);
      return visible;
    }

    _ensureFrame() {
      if (this._frameReady) return;
      this.shadowRoot.innerHTML = `<style>${CSS}</style>
        <div class="frame">
          <div class="toolbar" role="toolbar">
            <span class="toolbar-title">RASCI Matrix</span>
            <span class="toolbar-status" aria-live="polite"></span>
          </div>
          <div class="comparison-bar" hidden></div>
          <div class="viewport" role="grid" aria-label="RASCI matrix">
            <div class="header"></div><div class="body"></div>
          </div>
        </div>`;
      this._viewport = this.shadowRoot.querySelector(".viewport");
      this._header = this.shadowRoot.querySelector(".header");
      this._body = this.shadowRoot.querySelector(".body");
      this._status = this.shadowRoot.querySelector(".toolbar-status");
      this._title = this.shadowRoot.querySelector(".toolbar-title");
      this._comparisonBar = this.shadowRoot.querySelector(".comparison-bar");
      this._viewport.addEventListener("scroll", this._onScroll, { passive: true });
      this._viewport.addEventListener("keydown", this._onKeyDown);
      this._frameReady = true;
    }

    _renderComparisonToolbar() {
      if (!this._comparisonBar) return;
      const mode = String(this._data?.mode || '').toLowerCase();
      const isPositionMode = mode === 'by_position';
      const isProcessMode = mode === 'by_business_process';

      if (!isPositionMode && !isProcessMode) {
        this._comparisonBar.hidden = true;
        this._comparisonBar.replaceChildren();
        return;
      }

      this._comparisonBar.hidden = false;
      this._comparisonBar.replaceChildren();

      const tag = document.createElement("span");
      tag.className = "comparison-mode-tag";
      tag.textContent = isPositionMode ? "Perbandingan Jabatan" : "Perbandingan Proses";
      this._comparisonBar.appendChild(tag);

      const chipsWrap = document.createElement("div");
      chipsWrap.className = "comparison-chips";

      if (isPositionMode) {
        for (const col of this._columns) {
          const chip = document.createElement("span");
          chip.className = "comparison-chip";
          chip.textContent = col.label;
          const removeBtn = document.createElement("button");
          removeBtn.type = "button";
          removeBtn.className = "comparison-chip-remove";
          removeBtn.textContent = "×";
          removeBtn.title = `Hapus ${col.label} dari perbandingan`;
          removeBtn.addEventListener("click", () => {
            this.dispatchEvent(new CustomEvent("fiona-comparison-remove", {
              bubbles: true,
              composed: true,
              detail: { mode: "by_position", type: "position", key: col.key, label: col.label, column: col }
            }));
          });
          chip.appendChild(removeBtn);
          chipsWrap.appendChild(chip);
        }
      } else if (isProcessMode) {
        const nonAncestorRows = this._rows.filter(r => !r.isAncestorContext);
        for (const row of nonAncestorRows) {
          const chip = document.createElement("span");
          chip.className = "comparison-chip";
          chip.textContent = `${row.index ? row.index + ' ' : ''}${row.businessProcess}`;
          const removeBtn = document.createElement("button");
          removeBtn.type = "button";
          removeBtn.className = "comparison-chip-remove";
          removeBtn.textContent = "×";
          removeBtn.title = `Hapus ${row.businessProcess} dari perbandingan`;
          removeBtn.addEventListener("click", () => {
            this.dispatchEvent(new CustomEvent("fiona-comparison-remove", {
              bubbles: true,
              composed: true,
              detail: { mode: "by_business_process", type: "process", id: row.businessProcessId || row.id, label: row.businessProcess, row }
            }));
          });
          chip.appendChild(removeBtn);
          chipsWrap.appendChild(chip);
        }
      }

      const addBtn = document.createElement("button");
      addBtn.type = "button";
      addBtn.className = "comparison-btn-add";
      addBtn.textContent = isPositionMode ? "＋ Tambah Jabatan" : "＋ Tambah Prosbis";
      addBtn.addEventListener("click", () => {
        this.dispatchEvent(new CustomEvent("fiona-comparison-add", {
          bubbles: true,
          composed: true,
          detail: { mode, type: isPositionMode ? "position" : "process" }
        }));
      });

      this._comparisonBar.append(chipsWrap, addBtn);
    }

    _scheduleRender() {
      if (!this._frameReady || this._raf) return;
      this._raf = requestAnimationFrame(() => { this._raf = 0; this._render(); });
    }

    _render() {
      this._ensureFrame();
      const columns = this._columns;
      const identityWidth = this._identityWidth();
      const jobWidth = this._jobWidth();
      const contentWidth = identityWidth + columns.length * jobWidth;
      this._visibleRows = this._flattenRows();
      const rowHeight = this._rowHeight();
      const viewportHeight = this._viewport.clientHeight || 300;
      const scrollTop = this._viewport.scrollTop;
      const rowStart = Math.max(0, Math.floor(scrollTop / rowHeight) - OVERSCAN_ROWS);
      const rowEnd = Math.min(this._visibleRows.length, Math.ceil((scrollTop + viewportHeight) / rowHeight) + OVERSCAN_ROWS);
      const scrollLeft = this._viewport.scrollLeft;
      const jobScroll = Math.max(0, scrollLeft - identityWidth);
      const columnStart = Math.max(0, Math.floor(jobScroll / jobWidth) - OVERSCAN_COLUMNS);
      const columnEnd = Math.min(columns.length, Math.ceil((jobScroll + this._viewport.clientWidth) / jobWidth) + OVERSCAN_COLUMNS);
      this._range = { rowStart, rowEnd, columnStart, columnEnd };
      this._columnStart = columnStart;
      const headerRow = this._renderHeader(contentWidth, identityWidth, jobWidth, columnStart, columnEnd);
      this._header.replaceChildren(headerRow);
      this._body.style.height = `${Math.max(0, this._visibleRows.length * rowHeight)}px`;
      this._body.style.width = `${Math.max(contentWidth, this._viewport.clientWidth)}px`;
      if (this._renderError) {
        this._body.innerHTML = `<div class="error" style="height:${Math.max(160, rowHeight)}px">Invalid matrix data: ${this._escape(this._renderError.message)}</div>`;
      } else if (!this._visibleRows.length && this._isRemoteLoading()) {
        this._body.innerHTML = `<div class="loading" style="height:${Math.max(160, rowHeight)}px">Loading RASCI rows…</div>`;
      } else if (!this._visibleRows.length) {
        this._body.innerHTML = `<div class="empty" style="height:${Math.max(160, rowHeight)}px">No RASCI rows to display.</div>`;
      } else {
        const fragment = document.createDocumentFragment();
        for (let index = rowStart; index < rowEnd; index += 1) fragment.appendChild(this._renderRow(this._visibleRows[index], index, contentWidth, identityWidth, jobWidth, columnStart, columnEnd));
        this._body.replaceChildren(fragment);
      }
      this._status.textContent = `${this._visibleRows.length} processes · ${columns.length} jobs`;
      this._viewport.setAttribute("aria-rowcount", String(this._visibleRows.length + 1));
      this._viewport.setAttribute("aria-colcount", String(columns.length + 3));
    }

    _renderHeader(contentWidth, identityWidth, jobWidth, columnStart, columnEnd) {
      const row = document.createElement("div");
      row.className = "grid-row";
      row.setAttribute("role", "row");
      row.style.width = `${contentWidth}px`;
      row.style.gridTemplateColumns = this._gridTemplate(identityWidth, jobWidth, columnStart, columnEnd);
      row.append(this._headerCell("Level", "level-cell", 1), this._headerCell("Index", "index-cell", 2), this._headerCell("Proses Bisnis", "process-cell", 3));
      if (columnStart > 0) row.appendChild(this._spacer(columnStart * jobWidth));
      for (let index = columnStart; index < columnEnd; index += 1) {
        const column = this._columns[index];
        const levelClass = column.level != null ? ` jabatan-level-${column.level} job-level-${column.level}` : "";
        const cell = this._headerCell(column.label, `job-cell job-head${levelClass}`, index + 4);
        if (column.level != null) cell.setAttribute("data-level", String(column.level));
        cell.title = [column.label, column.positionCode, column.level != null ? `Layer/Level: ${column.level}` : null].filter(Boolean).join(" · ");
        row.appendChild(cell);
      }
      if (columnEnd < this._columns.length) row.appendChild(this._spacer((this._columns.length - columnEnd) * jobWidth));
      return row;
    }

    _headerCell(label, classes, columnIndex) {
      const cell = document.createElement("div");
      const sticky = !classes.includes("job-cell");
      cell.className = `cell header-cell${sticky ? " sticky" : ""} ${classes}`;
      cell.setAttribute("role", "columnheader");
      cell.setAttribute("aria-colindex", String(columnIndex));
      cell.textContent = label;
      return cell;
    }

    _renderRow(rowData, rowIndex, contentWidth, identityWidth, jobWidth, columnStart, columnEnd) {
      const row = document.createElement("div");
      const isAncestor = rowData.isAncestorContext === true;
      row.className = `grid-row body-row${isAncestor ? " is-ancestor-context" : ""}`;
      row.setAttribute("role", "row");
      row.setAttribute("aria-rowindex", String(rowIndex + 2));
      const visualDepth = rowData.depth != null ? rowData.depth : (rowData._renderDepth ?? 0);
      row.setAttribute("aria-level", String(visualDepth + 1));
      if (isAncestor) row.setAttribute("data-ancestor-context", "true");

      row.style.top = `${rowIndex * this._rowHeight()}px`;
      row.style.width = `${contentWidth}px`;
      row.style.gridTemplateColumns = this._gridTemplate(identityWidth, jobWidth, columnStart, columnEnd);
      row.append(this._cell(rowData.level, "level-cell", 1), this._cell(rowData.index, "index-cell", 2));
      const process = this._cell("", "process-cell", 3);
      process.title = rowData.businessProcess;
      process.style.paddingLeft = `${6 + Math.min(12, Number(visualDepth)) * 14}px`;
      const label = document.createElement("div");
      label.className = "process-label";
      const toggle = document.createElement("button");
      toggle.className = "tree-toggle";
      toggle.type = "button";
      toggle.textContent = "›";
      toggle.setAttribute("aria-expanded", this._expanded.has(rowData.id) ? "true" : "false");
      toggle.setAttribute("aria-label", `${this._expanded.has(rowData.id) ? "Collapse" : "Expand"} ${rowData.businessProcess}`);
      toggle.disabled = !rowData.hasChildren;
      toggle.addEventListener("click", () => this._toggleRow(rowData));
      const text = document.createElement("span");
      text.textContent = rowData.businessProcess;
      label.append(toggle, text);
      process.appendChild(label);
      row.appendChild(process);
      if (columnStart > 0) row.appendChild(this._spacer(columnStart * jobWidth));
      for (let index = columnStart; index < columnEnd; index += 1) {
        const cell = this._cell("", "job-cell", index + 4);
        this._renderAssignments(cell, rowData.assignments?.[this._columns[index].key], rowData.assignmentComments?.[this._columns[index].key] ?? rowData.AssignmentComments?.[this._columns[index].key]);
        row.appendChild(cell);
      }
      if (columnEnd < this._columns.length) row.appendChild(this._spacer((this._columns.length - columnEnd) * jobWidth));
      return row;
    }

    _cell(text, classes, columnIndex) {
      const cell = document.createElement("div");
      const sticky = !classes.includes("job-cell");
      cell.className = `cell ${classes}${sticky ? " sticky" : ""}`;
      cell.setAttribute("role", "gridcell");
      cell.setAttribute("aria-colindex", String(columnIndex));
      if (text) cell.textContent = text;
      return cell;
    }

    _renderAssignments(cell, values, comments) {
      const list = Array.isArray(values) ? values : values == null ? [] : [values];
      const ordered = list.map((value) => String(value).trim().toUpperCase()).filter((value) => NOTATION_ORDER.includes(value)).sort((a, b) => NOTATION_ORDER.indexOf(a) - NOTATION_ORDER.indexOf(b));
      for (const value of ordered) {
        const badge = document.createElement("span");
        badge.className = "notation";
        badge.textContent = value;
        badge.setAttribute("aria-label", value);
        cell.appendChild(badge);
      }
      const commentLines = (Array.isArray(comments) ? comments : [])
        .map((comment) => {
          const notation = String(comment?.notation ?? comment?.Notation ?? "").trim().toUpperCase();
          const text = String(comment?.comment ?? comment?.Comment ?? "").trim();
          return text ? `${notation ? `${notation}: ` : ""}${text}` : "";
        })
        .filter(Boolean);
      if (commentLines.length) {
        const commentIcon = document.createElement("img");
        commentIcon.className = "assignment-comment";
        commentIcon.src = "/assets/images/rasci/comment.svg";
        commentIcon.alt = "Assignment comments";
        commentIcon.title = commentLines.join("\n");
        cell.appendChild(commentIcon);
      }
      cell.setAttribute("aria-label", ordered.length ? `${ordered.join(", ")}${commentLines.length ? `. Comments: ${commentLines.join("; ")}` : ""}` : "No assignment");
    }

    _spacer(width) { const spacer = document.createElement("div"); spacer.className = "spacer"; spacer.style.width = `${width}px`; return spacer; }

    _gridTemplate(identityWidth, jobWidth, columnStart, columnEnd) {
      const left = columnStart * jobWidth;
      const right = Math.max(0, this._columns.length - columnEnd) * jobWidth;
      const jobs = Math.max(0, columnEnd - columnStart);
      const widths = this._identityWidths();
      const tracks = [
        this._cssLength(widths[0]),
        this._cssLength(widths[1]),
        this._cssLength(widths[2])
      ];
      if (left > 0) tracks.push(`${left}px`);
      if (jobs > 0) tracks.push(`repeat(${jobs}, ${this._cssLength(jobWidth)})`);
      if (right > 0) tracks.push(`${right}px`);
      return tracks.join(" ");
    }

    _toggleRow(row) {
      if (!row.hasChildren) return;
      if (this._expanded.has(row.id)) this._expanded.delete(row.id);
      else this._expanded.add(row.id);
      if (this._isRemote() && !row.childrenLoaded && this._expanded.has(row.id)) this._loadRemoteChildren(row);
      this._scheduleRender();
      this.dispatchEvent(new CustomEvent("fiona-rasci-toggle", { bubbles: true, composed: true, detail: { rowId: row.id, expanded: this._expanded.has(row.id) } }));
    }

    _onGridKeyDown(event) {
      if (event.key === "Enter" && event.target.classList.contains("tree-toggle")) event.target.click();
    }

    _isRemote() { return this._data?.mode === "remote" || this._data?.renderMode === "remote" || this._data?.renderMode === "virtual" || Boolean(this._data?.remote); }
    _isRemoteLoading() { return this._remoteLoading === true; }

    async _loadRemoteChildren(parent) {
      const remote = this._data?.remote;
      if (!remote?.endpoint || this._remoteLoading) return;
      if (parent) { if (parent.childrenLoaded || parent.loading) return; parent.loading = true; }
      this._remoteLoading = true;
      this._renderError = null;
      if (this._remoteAbort) this._remoteAbort.abort();
      this._remoteAbort = new AbortController();
      try {
        const url = new URL(remote.endpoint, window.location.href);
        if (remote.viewId) url.searchParams.set("viewId", String(remote.viewId));
        for (const key of (Array.isArray(remote.positionKeys) ? remote.positionKeys : [])) {
          if (key != null && String(key).trim()) url.searchParams.append("positionKey", String(key));
        }
        for (const id of (Array.isArray(remote.processIds) ? remote.processIds : [])) {
          if (id != null && String(id).trim()) url.searchParams.append("processId", String(id));
        }
        for (const id of (Array.isArray(remote.jobIds) ? remote.jobIds : [])) {
          if (id != null && String(id).trim()) url.searchParams.append("jobId", String(id));
        }
        if (remote.mode && remote.mode !== "remote") url.searchParams.set("mode", String(remote.mode));
        url.searchParams.set("limit", String(this._remotePageSize()));
        if (parent) url.searchParams.set("parentId", String(parent.id));
        else url.searchParams.set("rootOnly", "true");
        const headers = { Accept: "application/json" };
        const bearer = window.localStorage?.getItem("token");
        if (bearer) headers.Authorization = `Bearer ${bearer}`;
        const response = await fetch(url, { credentials: "same-origin", signal: this._remoteAbort.signal, headers });
        if (!response.ok) throw new Error(`Unable to load RASCI rows (${response.status})`);
        const payload = await response.json();
        const rows = Array.isArray(payload) ? payload : payload.rows || payload.items || [];
        if (Array.isArray(payload?.columns) && this._columns.length === 0) this._columns = payload.columns.map(this._normalizeColumn);
        this._mergeRows(rows, parent);
        const hasExplicitExpanded = Array.isArray(this._data?.expandedRowIds);
        const mode = this._tableMode();
        const isFilteredMode = mode === 'by_position' || mode === 'by_business_process';
        const shouldAutoExpand = isFilteredMode || this._data?.autoExpandAll === true;
        this._applyAutomaticExpansion(hasExplicitExpanded, shouldAutoExpand);
        if (parent) { parent.childrenLoaded = true; parent.hasChildren = true; parent.loading = false; }
      } catch (error) {
        if (error.name !== "AbortError") {
          if (parent) parent.loading = false;
          this._renderError = error;
          this.dispatchEvent(new CustomEvent("fiona-rasci-error", { bubbles: true, composed: true, detail: { error, parentId: parent?.id ?? null } }));
        }
      } finally {
        this._remoteLoading = false;
        this._scheduleRender();
      }
    }

    _identityWidths() { return ["--rasci-level-width", "--rasci-index-width", "--rasci-process-width"].map((property, index) => this._cssNumber(property, IDENTITY_WIDTH[index])); }
    _identityWidth() { return this._identityWidths().reduce((sum, width) => sum + width, 0); }
    _jobWidth() { return this._cssNumber("--rasci-job-width", DEFAULT_JOB_WIDTH); }
    _rowHeight() { return this._cssNumber("--rasci-row-height", DEFAULT_ROW_HEIGHT); }
    _remotePageSize() {
      const requested = Number(this._data?.remote?.pageSize ?? this._data?.pageSize ?? DEFAULT_REMOTE_PAGE_SIZE);
      if (!Number.isFinite(requested)) return DEFAULT_REMOTE_PAGE_SIZE;
      return Math.max(1, Math.min(MAX_REMOTE_PAGE_SIZE, Math.floor(requested)));
    }
    _cssNumber(property, fallback) { const value = Number.parseFloat(getComputedStyle(this).getPropertyValue(property)); return Number.isFinite(value) && value > 0 ? value : fallback; }
    _cssLength(value) { return `${value}px`; }
    _escape(value) { return String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character])); }
  }

  /*
   * Standalone Comparison Toolbar Web Component: <ui-comparison-toolbar>
   */
  class UiComparisonToolbar extends HTMLElement {
    static get observedAttributes() { return ["mode", "title"]; }

    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this._items = [];
    }

    connectedCallback() {
      this._render();
    }

    get items() { return this._items; }
    set items(val) { this._items = Array.isArray(val) ? val : []; this._render(); }

    _render() {
      const mode = this.getAttribute("mode") || "by_position";
      const title = this.getAttribute("title") || (mode === "by_position" ? "Perbandingan Jabatan" : "Perbandingan Proses Bisnis");
      this.shadowRoot.innerHTML = `
        <style>
          :host { display: block; margin: 4px 0 8px; font-family: system-ui, sans-serif; font-size: 11.5px; }
          .bar { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; padding: 6px 10px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; }
          .tag { font-weight: 700; color: #0284c7; background: #e0f2fe; padding: 2px 7px; border-radius: 4px; font-size: 10.5px; }
          .chips { display: flex; align-items: center; gap: 4px; flex-wrap: wrap; }
          .chip { display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; background: #eef4fb; border: 1px solid #bfdbfe; border-radius: 999px; color: #1e40af; font-size: 11px; }
          .remove { display: inline-flex; align-items: center; justify-content: center; width: 14px; height: 14px; padding: 0; border: 0; border-radius: 50%; background: #dbeafe; color: #1e3a8a; cursor: pointer; font-size: 10px; }
          .remove:hover { background: #fee2e2; color: #991b1b; }
          .add-btn { display: inline-flex; align-items: center; gap: 3px; padding: 2px 8px; border: 1px dashed #0284c7; border-radius: 999px; background: #fff; color: #0284c7; cursor: pointer; font-size: 10.5px; font-weight: 600; }
          .add-btn:hover { background: #f0f9ff; border-style: solid; }
        </style>
        <div class="bar">
          <span class="tag">${title}</span>
          <div class="chips">
            ${this._items.map((item, i) => `
              <span class="chip">${typeof item === "object" ? (item.label || item.name || item.key) : item}
                <button type="button" class="remove" data-index="${i}" title="Hapus">×</button>
              </span>
            `).join("")}
          </div>
          <button type="button" class="add-btn">＋ Tambah</button>
        </div>
      `;

      this.shadowRoot.querySelectorAll(".remove").forEach(btn => {
        btn.addEventListener("click", () => {
          const idx = Number(btn.dataset.index);
          const item = this._items[idx];
          this.dispatchEvent(new CustomEvent("fiona-comparison-remove", { bubbles: true, composed: true, detail: { item, index: idx, mode } }));
        });
      });

      this.shadowRoot.querySelector(".add-btn")?.addEventListener("click", () => {
        this.dispatchEvent(new CustomEvent("fiona-comparison-add", { bubbles: true, composed: true, detail: { mode } }));
      });
    }
  }

  /*
   * Generative UI Action Chips Web Component: <ui-action-chips>
   */
  class UiActionChips extends HTMLElement {
    constructor() {
      super();
      this._observer = null;
    }

    connectedCallback() {
      this._bindChips();
      if (typeof MutationObserver !== "undefined") {
        this._observer = new MutationObserver(() => this._bindChips());
        this._observer.observe(this, { childList: true, subtree: true });
      }
    }

    disconnectedCallback() {
      if (this._observer) {
        this._observer.disconnect();
        this._observer = null;
      }
    }

    _bindChips() {
      this.querySelectorAll("button, .action-chip, [data-prompt]").forEach(btn => {
        if (btn._bound) return;
        btn._bound = true;
        btn.addEventListener("click", (e) => {
          const prompt = btn.getAttribute("data-prompt") || btn.textContent.trim();
          this.dispatchEvent(new CustomEvent("fiona-action-click", { bubbles: true, composed: true, detail: { prompt, button: btn } }));
        });
      });
    }
  }

  /*
   * Generative UI Single-Select Web Component: <ui-single-select>
   */
  class UiSingleSelect extends HTMLElement {
    static get observedAttributes() { return ["title", "prompt-prefix"]; }

    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this._options = [];
    }

    connectedCallback() {
      this._render();
    }

    get options() { return this._options; }
    set options(val) { this._options = Array.isArray(val) ? val : []; this._render(); }

    _render() {
      const title = this.getAttribute("title") || "Pilih satu opsi:";
      const prefix = this.getAttribute("prompt-prefix") || "";
      this.shadowRoot.innerHTML = `
        <style>
          :host { display: block; margin: 8px 0; font-family: system-ui, sans-serif; font-size: 12px; }
          .card { border: 1px solid #cbd5e1; border-radius: 8px; background: #f8fafc; padding: 10px 12px; }
          .title { font-weight: 700; color: #1e293b; margin-bottom: 8px; font-size: 12px; }
          .options { display: flex; flex-direction: column; gap: 6px; }
          .opt-btn { display: flex; align-items: center; justify-content: space-between; padding: 6px 10px; border: 1px solid #bfdbfe; border-radius: 6px; background: #fff; color: #1e40af; cursor: pointer; text-align: left; font-size: 11.5px; transition: all .15s ease; }
          .opt-btn:hover { background: #e0f2fe; border-color: #0284c7; }
        </style>
        <div class="card">
          <div class="title">${title}</div>
          <div class="options">
            ${this._options.map((opt, i) => {
              const label = typeof opt === "object" ? (opt.label || opt.name || opt.text) : opt;
              const prompt = typeof opt === "object" ? (opt.prompt || opt.value || `${prefix} ${label}`.trim()) : `${prefix} ${opt}`.trim();
              return `<button type="button" class="opt-btn" data-index="${i}" data-prompt="${prompt}">${label} <span>→</span></button>`;
            }).join("")}
          </div>
        </div>
      `;

      this.shadowRoot.querySelectorAll(".opt-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const idx = Number(btn.dataset.index);
          const opt = this._options[idx];
          const prompt = btn.getAttribute("data-prompt");
          this.dispatchEvent(new CustomEvent("fiona-action-click", { bubbles: true, composed: true, detail: { prompt, option: opt, index: idx } }));
        });
      });
    }
  }

  /*
   * Generative UI Multi-Select Web Component: <ui-multi-select>
   */
  class UiMultiSelect extends HTMLElement {
    static get observedAttributes() { return ["title", "action-type"]; }

    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this._options = [];
      this._selected = new Set();
    }

    connectedCallback() {
      this._render();
    }

    get options() { return this._options; }
    set options(val) { this._options = Array.isArray(val) ? val : []; this._selected.clear(); this._render(); }

    _render() {
      const title = this.getAttribute("title") || "Pilih beberapa opsi:";
      this.shadowRoot.innerHTML = `
        <style>
          :host { display: block; margin: 8px 0; font-family: system-ui, sans-serif; font-size: 12px; }
          .card { border: 1px solid #cbd5e1; border-radius: 8px; background: #f8fafc; padding: 10px 12px; }
          .title { font-weight: 700; color: #1e293b; margin-bottom: 8px; font-size: 12px; }
          .options { display: flex; flex-direction: column; gap: 6px; margin-bottom: 10px; }
          .opt-label { display: flex; align-items: center; gap: 8px; padding: 4px 6px; border-radius: 4px; cursor: pointer; font-size: 11.5px; }
          .opt-label:hover { background: #e2e8f0; }
          .actions { display: flex; align-items: center; justify-content: space-between; gap: 8px; pt-2; border-top: 1px solid #e2e8f0; padding-top: 8px; }
          .apply-btn { padding: 4px 12px; border: 0; border-radius: 6px; background: #0284c7; color: #fff; font-weight: 600; cursor: pointer; font-size: 11.5px; }
          .apply-btn:hover { background: #0369a1; }
          .apply-btn:disabled { opacity: .5; cursor: not-allowed; }
          .mode-select { font-size: 11px; padding: 3px 6px; border: 1px solid #cbd5e1; border-radius: 4px; background: #fff; }
        </style>
        <div class="card">
          <div class="title">${title}</div>
          <div class="options">
            ${this._options.map((opt, i) => {
              const label = typeof opt === "object" ? (opt.label || opt.name || opt.text) : opt;
              const isChecked = this._selected.has(i);
              return `<label class="opt-label"><input type="checkbox" class="opt-check" data-index="${i}" ${isChecked ? "checked" : ""}> ${label}</label>`;
            }).join("")}
          </div>
          <div class="actions">
            <select class="mode-select">
              <option value="append">Tambah ke Tabel</option>
              <option value="replace">Ganti Pilihan Baru</option>
            </select>
            <button type="button" class="apply-btn" ${this._selected.size === 0 ? "disabled" : ""}>Terapkan (${this._selected.size})</button>
          </div>
        </div>
      `;

      const applyBtn = this.shadowRoot.querySelector(".apply-btn");
      const modeSelect = this.shadowRoot.querySelector(".mode-select");

      this.shadowRoot.querySelectorAll(".opt-check").forEach(chk => {
        chk.addEventListener("change", () => {
          const idx = Number(chk.dataset.index);
          if (chk.checked) this._selected.add(idx);
          else this._selected.delete(idx);
          if (applyBtn) {
            applyBtn.disabled = this._selected.size === 0;
            applyBtn.textContent = `Terapkan (${this._selected.size})`;
          }
        });
      });

      applyBtn?.addEventListener("click", () => {
        const selectedItems = Array.from(this._selected).map(i => this._options[i]);
        const mode = modeSelect?.value || "append";
        const labels = selectedItems.map(item => (typeof item === "object" ? (item.label || item.name || item.text) : item)).join(", ");
        const prompt = mode === "append"
          ? `Tambahkan ke tabel perbandingan: ${labels}`
          : `Ganti perbandingan tabel dengan: ${labels}`;
        this.dispatchEvent(new CustomEvent("fiona-action-click", { bubbles: true, composed: true, detail: { prompt, selectedItems, mode } }));
      });
    }
  }

  // Register Custom Elements
  if (typeof customElements !== "undefined") {
    if (!customElements.get(TAG_NAME)) customElements.define(TAG_NAME, FionaRasciMatrix);
    if (!customElements.get(ALIAS_TAG_NAME)) customElements.define(ALIAS_TAG_NAME, FionaRasciMatrix);
    if (!customElements.get("ui-comparison-toolbar")) customElements.define("ui-comparison-toolbar", UiComparisonToolbar);
    if (!customElements.get("ui-action-chips")) customElements.define("ui-action-chips", UiActionChips);
    if (!customElements.get("ui-single-select")) customElements.define("ui-single-select", UiSingleSelect);
    if (!customElements.get("ui-multi-select")) customElements.define("ui-multi-select", UiMultiSelect);
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = { FionaRasciMatrix, UiComparisonToolbar, UiActionChips, UiSingleSelect, UiMultiSelect };
  }
})(typeof window !== "undefined" ? window : globalThis);
