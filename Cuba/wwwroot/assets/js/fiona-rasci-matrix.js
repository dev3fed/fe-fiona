/*
 * Fiona RASCI matrix web component.
 *
 * The element consumes the AgentRasciTableDto shape directly:
 *
 * <fiona-rasci-matrix data='{"columns":[],"rows":[]}'></fiona-rasci-matrix>
 *
 * Prefer assigning a JavaScript object for large payloads:
 *   element.data = response.rasciTables[0];
 *
 * For a remote/virtual view, pass:
 * {
 *   mode: "remote",
 *   columns: [...], rows: [...],
 *   remote: { endpoint: "/api/agent/rasci-tables/view", viewId: "...", pageSize: 100 }
 * }
 * The endpoint is same-origin and receives `viewId`, bounded `limit`, and
 * either `rootOnly=true` or `parentId` for lazy child loading.
 */
(function () {
  "use strict";

  const TAG_NAME = "fiona-rasci-matrix";
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
    .toolbar { display:flex; align-items:center; gap:10px; min-height:34px; padding:4px 8px; border-bottom:1px solid var(--rasci-border); background: #fbfdff; }
    .toolbar-title { margin-right:auto; font-weight:700; font-size:11.5px; color:#0f3866; white-space:nowrap; }
    .toolbar-status { color:var(--rasci-muted); font-size:10.5px; white-space:nowrap; }
    [tabindex]:focus-visible, button:focus-visible { outline:2px solid var(--rasci-focus); outline-offset:-1px; }
    .viewport { position:relative; max-height: min(60vh, 520px); min-height:0; overflow:auto; overscroll-behavior-x:contain; overscroll-behavior-y:auto; isolation:isolate; font-size:11.5px; }
    .header { position:sticky; top:0; z-index:20; min-width:100%; height:var(--rasci-header-height); background:var(--rasci-header-surface); }
    .body { position:relative; min-width:100%; }
    .grid-row { display:grid; position:relative; min-width:100%; }
    .header .grid-row { height:var(--rasci-header-height); border-bottom:2px solid var(--rasci-border); background:var(--rasci-header-surface); }
    .body-row { position:absolute; left:0; height:var(--rasci-row-height); min-height:var(--rasci-row-height); border-bottom:1px solid var(--rasci-border); background:var(--rasci-surface); }
    .body-row:hover { background:var(--rasci-hover); }
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
    .notation-r { border-color:#8ec5ea; color:#005da6; background:#e1f0fa; }
    .notation-a { border-color:#f2a4ae; color:#c9182b; background:#fae9eb; }
    .notation-s { border-color:#a3d9b1; color:#146c43; background:#e8f5e9; }
    .notation-c { border-color:#cbb2fe; color:#59359a; background:#f3e8ff; }
    .notation-i { border-color:#ced4da; color:#495057; background:#f1f3f5; }
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
      const hasExplicitExpanded = Array.isArray(this._data.expandedRowIds);
      this._expanded = new Set(hasExplicitExpanded ? this._data.expandedRowIds.map(String) : []);
      this._mergeRows(Array.isArray(this._data.rows) ? this._data.rows : [], null);
      if (!hasExplicitExpanded && !this._isRemote() && this._rows.length <= 200) {
        this._rowById.forEach((row) => {
          if (this._children.get(row.id)?.length) this._expanded.add(row.id);
        });
      }
      this._ensureFrame();
      this._scheduleRender();
      if (this.isConnected && this._isRemote() && this._rows.length === 0) this._loadRemoteChildren(null);
      this.dispatchEvent(new CustomEvent("fiona-rasci-ready", { bubbles: true, detail: { rows: this._rows.length, columns: this._columns.length } }));
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

    _normalizeRow(row, index, parentHint) {
      const item = row && typeof row === "object" ? row : {};
      const id = String(item.id ?? item.businessProcessId ?? `${item.index ?? "row"}-${index}`);
      return {
        ...item,
        id,
        businessProcessId: item.businessProcessId ?? item.id ?? null,
        level: item.level == null ? "" : String(item.level),
        index: item.index == null ? "" : String(item.index),
        businessProcess: String(item.businessProcess ?? item.process ?? "Proses bisnis"),
        parentId: item.parentId ?? item.parentBusinessProcessId ?? parentHint ?? null,
        depth: Number.isFinite(Number(item.depth)) ? Number(item.depth) : null,
        hasChildren: Boolean(item.hasChildren),
        assignments: item.assignments && typeof item.assignments === "object" ? item.assignments : {},
        childrenLoaded: Boolean(item.childrenLoaded || Array.isArray(item.children)),
        loading: false
      };
    }

    _mergeRows(rows, parent, rebuild = true) {
      const parentId = parent ? String(parent.id ?? parent) : null;
      for (let index = 0; index < rows.length; index += 1) {
        const row = this._normalizeRow(rows[index], this._rows.length + index, parentId);
        if (this._rowById.has(row.id)) {
          const existing = this._rowById.get(row.id);
          Object.assign(existing, row, { loading: existing.loading });
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
        parentById.set(row.id, parentId && this._rowById.has(parentId) && parentId !== row.id ? parentId : null);
      }
      // Never let malformed data create a hierarchy with no root. Break a
      // cycle at the row where traversal first repeats, promoting that row.
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
      for (const list of this._children.values()) list.sort((a, b) => this._rowOrder(a) - this._rowOrder(b));
      this._roots.sort((a, b) => this._rowOrder(a) - this._rowOrder(b));
      for (const row of this._rows) row.hasChildren = row.hasChildren || Boolean(this._children.get(row.id)?.length);
    }

    _rowOrder(row) {
      const index = Number.parseFloat(String(row.index).replace(/[^0-9.]/g, ""));
      return Number.isFinite(index) ? index : this._rows.indexOf(row);
    }

    _flattenRows() {
      const visible = [];
      const visit = (row, depth, ancestors) => {
        row._renderDepth = row.depth == null ? depth : row.depth;
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
            <span class="toolbar-title">RASCI matrix</span>
            <span class="toolbar-status" aria-live="polite"></span>
          </div>
          <div class="viewport" role="grid" aria-label="RASCI matrix">
            <div class="header"></div><div class="body"></div>
          </div>
        </div>`;
      this._viewport = this.shadowRoot.querySelector(".viewport");
      this._header = this.shadowRoot.querySelector(".header");
      this._body = this.shadowRoot.querySelector(".body");
      this._status = this.shadowRoot.querySelector(".toolbar-status");
      this._viewport.addEventListener("scroll", this._onScroll, { passive: true });
      this._viewport.addEventListener("keydown", this._onKeyDown);
      this._frameReady = true;
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
      row.className = "grid-row body-row";
      row.setAttribute("role", "row");
      row.setAttribute("aria-rowindex", String(rowIndex + 2));
      row.setAttribute("aria-level", String((rowData._renderDepth ?? 0) + 1));
      row.style.top = `${rowIndex * this._rowHeight()}px`;
      row.style.width = `${contentWidth}px`;
      row.style.gridTemplateColumns = this._gridTemplate(identityWidth, jobWidth, columnStart, columnEnd);
      row.append(this._cell(rowData.level, "level-cell", 1), this._cell(rowData.index, "index-cell", 2));
      const process = this._cell("", "process-cell", 3);
      process.title = rowData.businessProcess;
      process.style.paddingLeft = `${6 + Math.min(12, Number(rowData._renderDepth ?? 0)) * 12}px`;
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
        this._renderAssignments(cell, rowData.assignments?.[this._columns[index].key]);
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

    _renderAssignments(cell, values) {
      const list = Array.isArray(values) ? values : values == null ? [] : [values];
      const ordered = list.map((value) => String(value).trim().toUpperCase()).filter((value) => NOTATION_ORDER.includes(value)).sort((a, b) => NOTATION_ORDER.indexOf(a) - NOTATION_ORDER.indexOf(b));
      for (const value of ordered) {
        const badge = document.createElement("span");
        badge.className = `notation notation-${value.toLowerCase()}`;
        badge.textContent = value;
        badge.setAttribute("aria-label", value);
        cell.appendChild(badge);
      }
      cell.setAttribute("aria-label", ordered.length ? ordered.join(", ") : "No assignment");
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
      this.dispatchEvent(new CustomEvent("fiona-rasci-toggle", { bubbles: true, detail: { rowId: row.id, expanded: this._expanded.has(row.id) } }));
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
        if (parent) { parent.childrenLoaded = true; parent.hasChildren = true; parent.loading = false; }
      } catch (error) {
        if (error.name !== "AbortError") {
          if (parent) parent.loading = false;
          this._renderError = error;
          this.dispatchEvent(new CustomEvent("fiona-rasci-error", { bubbles: true, detail: { error, parentId: parent?.id ?? null } }));
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

  if (!customElements.get(TAG_NAME)) customElements.define(TAG_NAME, FionaRasciMatrix);
})();

