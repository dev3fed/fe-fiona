(function () {
  'use strict';

  const TAG_NAME = 'fiona-prosbis-hierarchy';

  class FionaProsbisHierarchy extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._data = null;
      this._loading = false;
      this._loaded = false;
    }

    set data(value) {
      this._data = value || null;
      this._loaded = false;
      if (this.isConnected && this._data?.defer !== true) this._load();
    }

    get data() { return this._data; }

    connectedCallback() { if (this._data?.defer !== true) this._load(); }

    load() { return this._load(); }

    async _load() {
      if (this._loading || this._loaded) return;
      const sourceId = String(this._data?.sourceId || this._data?.draftRasciId || '').trim();
      const processId = Number(this._data?.processId);
      if (!sourceId || !Number.isInteger(processId) || processId <= 0) {
        this._renderError('Parameter hierarki Prosbis tidak valid.');
        return;
      }
      this._loading = true;
      this._renderLoading();
      try {
        const endpoint = String(this._data?.endpoint || `/api/agent/prosbis-hierarchy/${encodeURIComponent(sourceId)}/${processId}`);
        let response;
        let payload;
        for (let attempt = 0; attempt < 2; attempt++) {
          response = await fetch(endpoint, { headers: this._data?.token ? { Authorization: `Bearer ${this._data.token}` } : {} });
          payload = await response.json().catch(() => null);
          if (response.ok || (response.status !== 502 && response.status !== 503 && response.status !== 504) || attempt === 1) break;
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        if (!response.ok) throw new Error(payload?.message || `Hierarki Prosbis tidak dapat dimuat (${response.status}).`);
        this._renderRows(Array.isArray(payload) ? payload : []);
        this._loaded = true;
      } catch (error) {
        this._renderError(error?.message || 'Hierarki Prosbis tidak dapat dimuat.');
        this.dispatchEvent(new CustomEvent('fiona-prosbis-hierarchy-error', { detail: { error }, bubbles: true }));
      } finally {
        this._loading = false;
      }
    }

    _renderLoading() { this.shadowRoot.innerHTML = `<style>${styles}</style><div class="state">Memuat hierarki Prosbis…</div>`; }
    _renderError(message) {
      this.shadowRoot.innerHTML = `<style>${styles}</style><div class="state error"><span></span><button type="button">Coba lagi</button></div>`;
      this.shadowRoot.querySelector('span').textContent = message;
      this.shadowRoot.querySelector('button').addEventListener('click', () => this._load());
    }

    _renderRows(rows) {
      this.shadowRoot.innerHTML = `<style>${styles}</style><div class="wrap"><table><thead><tr><th>Level</th><th>Index</th><th>Prosbis</th></tr></thead><tbody></tbody></table></div>`;
      const body = this.shadowRoot.querySelector('tbody');
      for (const row of rows) {
        const tr = document.createElement('tr');
        const relation = String(row.relation || row.Relation || '').toLowerCase();
        if (relation) tr.classList.add(`is-${relation}`);
        const level = Number(row.level ?? row.Level);
        const index = String(row.indexNumber ?? row.IndexNumber ?? '');
        const name = String(row.description ?? row.Description ?? row.code ?? row.Code ?? '—');
        const levelCell = document.createElement('td'); levelCell.textContent = Number.isFinite(level) ? `L${level}` : '—';
        const indexCell = document.createElement('td'); indexCell.textContent = index || '—';
        const processCell = document.createElement('td');
        processCell.className = 'process';
        processCell.style.paddingLeft = `${12 + Math.max(0, (Number.isFinite(level) ? level : index.split('.').filter(Boolean).length) - 1) * 16}px`;
        processCell.textContent = name;
        tr.append(levelCell, indexCell, processCell);
        body.appendChild(tr);
      }
      if (!rows.length) body.innerHTML = '<tr><td colspan="3" class="empty">Tidak ada hierarki Prosbis.</td></tr>';
    }
  }

  const styles = `:host{display:block;font:12px/1.45 system-ui,sans-serif;color:#334155}.wrap{max-height:420px;overflow:auto;border:1px solid #e2e8f0;border-radius:8px}table{width:100%;border-collapse:collapse;background:#fff}th,td{padding:8px 10px;border-bottom:1px solid #eef2f7;text-align:left;vertical-align:top}th{position:sticky;top:0;background:#f8fafc;color:#475569;font-size:11px;text-transform:uppercase;letter-spacing:.03em}td:first-child,td:nth-child(2){white-space:nowrap;color:#64748b}.process{font-weight:500}.is-selected{background:#e0f2fe}.is-selected .process{font-weight:700;color:#0369a1}.is-ancestor{background:#fafafa;color:#64748b}.is-sibling{background:#fcfcfd}.empty,.state{padding:16px;text-align:center;color:#64748b}.error{color:#b91c1c;display:grid;gap:8px;justify-items:center}.error button{border:1px solid #fecaca;border-radius:5px;background:#fff;color:#b91c1c;padding:4px 8px;cursor:pointer}`;
  if (!customElements.get(TAG_NAME)) customElements.define(TAG_NAME, FionaProsbisHierarchy);
  if (typeof module !== 'undefined') module.exports = { FionaProsbisHierarchy };
})();
