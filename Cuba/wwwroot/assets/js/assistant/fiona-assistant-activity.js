(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.FionaAssistantActivity = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const toolNameTranslations = {
    'get_rasci_business_process': {
      label: { id: 'Memeriksa proses bisnis', en: 'Checking business processes' },
      runningSummary: { id: 'Mencari data proses bisnis yang sesuai…', en: 'Searching business process records…' },
      completeSummary: { id: 'Data proses bisnis berhasil diperoleh', en: 'Business process records retrieved' }
    },
    'get_rasci_positions': {
      label: { id: 'Memeriksa posisi & jabatan', en: 'Checking positions & roles' },
      runningSummary: { id: 'Mencari posisi dan unit kerja terkait…', en: 'Searching positions and organization units…' },
      completeSummary: { id: 'Data posisi berhasil diperoleh', en: 'Positions retrieved' }
    },
    'get_rasci_mappings': {
      label: { id: 'Memeriksa matriks tanggung jawab RASCI', en: 'Checking RASCI responsibilities' },
      runningSummary: { id: 'Mencari penetapan peran (R/A/S/C/I)…', en: 'Looking up responsibility assignments…' },
      completeSummary: { id: 'Matriks tanggung jawab berhasil diperiksa', en: 'Responsibility mappings retrieved' }
    },
    'display_rasci_table': {
      label: { id: 'Menyiapkan tampilan tabel RASCI', en: 'Preparing RASCI table view' },
      runningSummary: { id: 'Menyusun tabel interaktif…', en: 'Building interactive table…' },
      completeSummary: { id: 'Tabel RASCI siap ditampilkan', en: 'RASCI table ready' }
    },
    'get_rasci_table': {
      label: { id: 'Mengambil data tabel RASCI', en: 'Fetching RASCI table data' },
      runningSummary: { id: 'Memuat data tabel…', en: 'Loading table slice…' },
      completeSummary: { id: 'Data tabel siap', en: 'Table data ready' }
    },
    'get_duckdb_schema': {
      label: { id: 'Menyiapkan struktur data', en: 'Preparing data structure' },
      runningSummary: { id: 'Membaca katalog struktur data…', en: 'Reading data schemas…' },
      completeSummary: { id: 'Struktur data siap', en: 'Data structure ready' }
    },
    'get_sql_server_schema': {
      label: { id: 'Menyiapkan struktur data', en: 'Preparing data structure' },
      runningSummary: { id: 'Membaca skema basis data…', en: 'Reading database schema…' },
      completeSummary: { id: 'Struktur data siap', en: 'Data structure ready' }
    },
    'duckdb_query': {
      label: { id: 'Menganalisis & menghitung data', en: 'Analyzing & computing data' },
      runningSummary: { id: 'Memproses data dan perhitungan…', en: 'Processing data query…' },
      completeSummary: { id: 'Analisis data selesai', en: 'Data analysis completed' }
    },
    'sql_server_query': {
      label: { id: 'Menganalisis & mencari data', en: 'Analyzing & retrieving data' },
      runningSummary: { id: 'Memproses penarikan data…', en: 'Processing data query…' },
      completeSummary: { id: 'Penarikan data selesai', en: 'Data retrieval completed' }
    },
    'scratchpad_query': {
      label: { id: 'Mengolah data analisis', en: 'Processing analysis data' },
      runningSummary: { id: 'Menjalankan analisis data…', en: 'Running query analysis…' },
      completeSummary: { id: 'Pengolahan data selesai', en: 'Data processing completed' }
    },
    'duckdb_query_to_scratchpad': {
      label: { id: 'Mengorganisasi data kerja', en: 'Organizing workspace data' },
      runningSummary: { id: 'Menata data ke ruang kerja sementara…', en: 'Preparing workspace tables…' },
      completeSummary: { id: 'Data kerja berhasil diorganisasi', en: 'Workspace data organized' }
    },
    'sql_server_query_to_scratchpad': {
      label: { id: 'Mengorganisasi data kerja', en: 'Organizing workspace data' },
      runningSummary: { id: 'Menata data ke ruang kerja sementara…', en: 'Preparing workspace tables…' },
      completeSummary: { id: 'Data kerja berhasil diorganisasi', en: 'Workspace data organized' }
    },
    'scratchpad_exec': {
      label: { id: 'Menata ruang kerja analisis', en: 'Managing analysis workspace' },
      runningSummary: { id: 'Menyiapkan tabel kerja…', en: 'Updating workspace tables…' },
      completeSummary: { id: 'Ruang kerja siap', en: 'Workspace updated' }
    },
    'scratchpad_tables': {
      label: { id: 'Memeriksa ruang kerja analisis', en: 'Checking analysis workspace' },
      runningSummary: { id: 'Melihat status tabel kerja…', en: 'Checking workspace tables…' },
      completeSummary: { id: 'Ruang kerja siap', en: 'Workspace ready' }
    },
    'create_rasci_draft': {
      label: { id: 'Membuat draft RASCI baru', en: 'Creating new RASCI draft' },
      runningSummary: { id: 'Menyiapkan draft baru di sistem…', en: 'Initializing new draft…' },
      completeSummary: { id: 'Draft RASCI baru berhasil dibuat', en: 'New RASCI draft created' }
    },
    'rename_rasci_draft': {
      label: { id: 'Mengubah nama draft RASCI', en: 'Renaming RASCI draft' },
      runningSummary: { id: 'Memperbarui nama draft…', en: 'Updating draft title…' },
      completeSummary: { id: 'Nama draft berhasil diubah', en: 'Draft renamed successfully' }
    },
    'save_rasci_mapping': {
      label: { id: 'Menyimpan pemetaan RASCI', en: 'Saving RASCI mapping' },
      runningSummary: { id: 'Menyimpan perubahan ke draft…', en: 'Saving changes to draft…' },
      completeSummary: { id: 'Pemetaan RASCI berhasil disimpan', en: 'RASCI mapping saved successfully' }
    },
    'maf-native': {
      label: { id: 'Fiona sedang menganalisis', en: 'Fiona is analyzing' },
      runningSummary: { id: 'Menganalisis pertanyaan dan mengumpulkan data…', en: 'Analyzing question and gathering data…' },
      completeSummary: { id: 'Analisis & pengumpulan data selesai', en: 'Analysis completed' }
    },
    'maf-native-limit': {
      label: { id: 'Batas langkah tercapai', en: 'Action limit reached' },
      runningSummary: { id: 'Lanjutkan percakapan untuk memproses lebih lanjut', en: 'Continue the conversation to proceed further' },
      completeSummary: { id: 'Batas langkah tercapai', en: 'Action limit reached' }
    }
  };

  function sanitizeFriendlyLabel(rawLabel, category, status, lang = 'id') {
    const l = lang === 'en' ? 'en' : 'id';
    const cleanCategory = String(category || '').trim();
    if (toolNameTranslations[cleanCategory]) {
      return toolNameTranslations[cleanCategory].label[l];
    }
    let text = String(rawLabel || '').trim();
    if (!text || text.toLowerCase().startsWith('executing ') || text.toLowerCase().startsWith('executed ')) {
      const toolMatch = text.replace(/^(executing|executed)\s+/i, '').trim();
      if (toolNameTranslations[toolMatch]) {
        return toolNameTranslations[toolMatch].label[l];
      }
    }
    text = text.replace(/^executing\s+/i, l === 'en' ? 'Processing ' : 'Memproses ')
               .replace(/^executed\s+/i, l === 'en' ? 'Processed ' : 'Selesai memproses ')
               .replace(/native tool loop/i, l === 'en' ? 'analysis' : 'analisis')
               .replace(/fiona native maf/i, l === 'en' ? 'Fiona is analyzing' : 'Fiona sedang menganalisis')
               .replace(/mathematical runtime/i, l === 'en' ? 'data calculation' : 'perhitungan data')
               .replace(/native tool invocation started/i, l === 'en' ? 'Step in progress…' : 'Langkah sedang berjalan…')
               .replace(/native tool invocation completed/i, l === 'en' ? 'Step completed' : 'Langkah selesai')
               .replace(/get_rasci_business_process/i, l === 'en' ? 'business processes' : 'proses bisnis')
               .replace(/get_rasci_positions/i, l === 'en' ? 'positions' : 'posisi & jabatan')
               .replace(/get_rasci_mappings/i, l === 'en' ? 'RASCI mappings' : 'pemetaan RASCI')
               .replace(/display_rasci_table/i, l === 'en' ? 'RASCI table' : 'tabel RASCI')
               .replace(/duckdb_query/i, l === 'en' ? 'data calculation' : 'analisis data')
               .replace(/sql_server_query/i, l === 'en' ? 'database query' : 'pencarian data')
               .replace(/scratchpad_\w+/i, l === 'en' ? 'workspace' : 'ruang kerja analisis');
    return text || (l === 'en' ? 'Processing step' : 'Memproses langkah');
  }

  function sanitizeFriendlySummary(rawSummary, category, status, lang = 'id') {
    const l = lang === 'en' ? 'en' : 'id';
    const cleanCategory = String(category || '').trim();
    if (toolNameTranslations[cleanCategory]) {
      return status === 'running'
        ? toolNameTranslations[cleanCategory].runningSummary[l]
        : toolNameTranslations[cleanCategory].completeSummary[l];
    }
    let text = String(rawSummary || '').trim();
    text = text.replace(/native tool invocation started/i, l === 'en' ? 'Working…' : 'Sedang memproses…')
               .replace(/native tool invocation completed/i, l === 'en' ? 'Finished' : 'Selesai')
               .replace(/executing the native tool loop/i, l === 'en' ? 'Analyzing and gathering information…' : 'Menganalisis pertanyaan dan mengumpulkan informasi…')
               .replace(/native tool loop completed/i, l === 'en' ? 'All information gathered' : 'Semua informasi berhasil diproses');
    return text;
  }

  function formatDuration(milliseconds) {
    if (milliseconds < 1000) return Math.max(0, Math.round(milliseconds)) + 'ms';
    return (milliseconds / 1000).toFixed(milliseconds < 10000 ? 1 : 0) + 's';
  }

  function createActivityCard(config) {
    const { messagesContainer, syncEmpty, scrollToLatest, esc, onRetry } = config;
    const wrap = document.createElement('div');
    wrap.className = 'fiona-ai-message assistant fiona-ai-activity-message';
    const details = document.createElement('details');
    details.className = 'fiona-ai-activity is-running';
    details.open = true;
    details.innerHTML = '<summary class="fiona-ai-activity-summary"><span class="fiona-ai-activity-spinner" aria-hidden="true"></span><span class="fiona-ai-activity-title">Fiona sedang menganalisis…</span><span class="fiona-ai-activity-time">0s</span></summary><div class="fiona-ai-activity-agent" hidden></div><ol class="fiona-ai-activity-steps"></ol><p class="fiona-ai-activity-notice" hidden></p><button type="button" class="fiona-ai-activity-retry" hidden>Coba lagi</button>';
    wrap.appendChild(details);
    messagesContainer.appendChild(wrap);
    if (typeof syncEmpty === 'function') syncEmpty();
    if (typeof scrollToLatest === 'function') scrollToLatest();

    const title = details.querySelector('.fiona-ai-activity-title');
    const time = details.querySelector('.fiona-ai-activity-time');
    const stepsList = details.querySelector('.fiona-ai-activity-steps');
    const agent = details.querySelector('.fiona-ai-activity-agent');
    const notice = details.querySelector('.fiona-ai-activity-notice');
    const retry = details.querySelector('.fiona-ai-activity-retry');
    const started = performance.now();
    let language = 'id';
    let finished = false;
    let currentStepNum = 0;
    const stepMap = new Map();
    const activityMap = new Map();
    let thoughtCursor = null;

    const timer = setInterval(() => {
      if (!finished) {
        time.textContent = formatDuration(performance.now() - started);
      }
    }, 250);
    const stalled = setTimeout(() => {
      if (finished) return;
      notice.hidden = false;
      notice.textContent = language === 'en' ? 'Still working—some data requests take longer.' : 'Masih bekerja—beberapa permintaan data memerlukan waktu lebih lama.';
    }, 15000);

    function ensureThoughtCursor() {
      if (!thoughtCursor) {
        thoughtCursor = document.createElement('span');
        thoughtCursor.className = 'fiona-ai-thought-cursor';
        thoughtCursor.setAttribute('aria-hidden', 'true');
      }
      return thoughtCursor;
    }

    function getOrCreateStep(stepNum, phaseTitle) {
      const num = stepNum || 1;
      let stepItem = stepMap.get(num);
      if (!stepItem) {
        if (currentStepNum && currentStepNum !== num) {
          const prevStep = stepMap.get(currentStepNum);
          if (prevStep) {
            prevStep.element.classList.remove('is-running');
            prevStep.element.classList.add('is-success');
            if (prevStep.reasoningDetails) {
              prevStep.reasoningDetails.open = false;
              if (prevStep.reasoningBadge) prevStep.reasoningBadge.hidden = true;
            }
          }
        }
        currentStepNum = num;

        const li = document.createElement('li');
        li.className = 'fiona-ai-step-item is-running';
        li.dataset.step = String(num);

        const defaultLabel = phaseTitle || (language === 'en' ? `Step ${num}: Analyzing` : `Langkah ${num}: Menganalisis`);
        const safeEsc = typeof esc === 'function' ? esc : (v => v == null ? '' : String(v));
        li.innerHTML = `
          <div class="fiona-ai-step-header">
            <div class="fiona-ai-step-header-left">
              <span class="fiona-ai-step-icon" aria-hidden="true"></span>
              <strong class="fiona-ai-step-label">${safeEsc(defaultLabel)}</strong>
            </div>
            <span class="fiona-ai-step-time"></span>
          </div>
          <small class="fiona-ai-step-detail" hidden></small>
          <details class="fiona-ai-step-reasoning" hidden>
            <summary>
              <span class="fiona-ai-step-reasoning-summary-left">
                <span class="fiona-ai-step-reasoning-chevron" aria-hidden="true">›</span>
                <span class="fiona-ai-step-reasoning-title">${language === 'en' ? 'Reasoning' : 'Alasan'}</span>
                <span class="fiona-ai-step-reasoning-badge" hidden>${language === 'en' ? 'Thinking…' : 'Sedang berpikir…'}</span>
              </span>
            </summary>
            <div class="fiona-ai-step-reasoning-content"></div>
          </details>
        `;
        stepsList.appendChild(li);

        stepItem = {
          stepNum: num,
          element: li,
          label: li.querySelector('.fiona-ai-step-label'),
          detail: li.querySelector('.fiona-ai-step-detail'),
          time: li.querySelector('.fiona-ai-step-time'),
          reasoningDetails: li.querySelector('.fiona-ai-step-reasoning'),
          reasoningTitle: li.querySelector('.fiona-ai-step-reasoning-title'),
          reasoningBadge: li.querySelector('.fiona-ai-step-reasoning-badge'),
          reasoningContent: li.querySelector('.fiona-ai-step-reasoning-content'),
          startedAt: performance.now(),
          hasThought: false
        };
        stepMap.set(num, stepItem);
      }
      return stepItem;
    }

    function appendThought(chunk, step, phase) {
      if (!chunk) return;
      const stepNum = step || 1;
      const stepItem = getOrCreateStep(stepNum, phase);
      stepItem.hasThought = true;
      stepItem.reasoningDetails.hidden = false;

      const cursor = ensureThoughtCursor();
      if (cursor.parentNode) cursor.parentNode.removeChild(cursor);
      stepItem.reasoningContent.textContent += chunk;
      stepItem.reasoningContent.appendChild(cursor);

      stepItem.reasoningContent.scrollTop = stepItem.reasoningContent.scrollHeight;
      if (typeof scrollToLatest === 'function') scrollToLatest();
    }

    function upsert(activity) {
      if (!activity?.id) return;
      const friendlyLabel = sanitizeFriendlyLabel(activity.label, activity.category, activity.status, language);
      const friendlySummary = sanitizeFriendlySummary(activity.summary, activity.category, activity.status, language);

      if (activity.category === 'maf-native' || activity.id === 'maf-native') {
        if (activity.status === 'running') {
          title.textContent = friendlyLabel || (language === 'en' ? 'Fiona is analyzing…' : 'Fiona sedang menganalisis…');
        }
        return;
      }

      let stepItem = activityMap.get(activity.id);
      if (!stepItem) {
        stepItem = getOrCreateStep(currentStepNum || stepMap.size || 1, friendlyLabel);
        activityMap.set(activity.id, stepItem);
      }

      stepItem.label.textContent = friendlyLabel;
      const durationStr = activity.durationMs != null ? formatDuration(activity.durationMs) : null;
      const detailStr = [friendlySummary, durationStr].filter(Boolean).join(' · ');
      if (detailStr) {
        stepItem.detail.textContent = detailStr;
        stepItem.detail.hidden = false;
      }
      if (activity.status === 'success' || activity.status === 'complete') {
        stepItem.element.classList.remove('is-running');
        stepItem.element.classList.add('is-success');
        if (stepItem.reasoningBadge) stepItem.reasoningBadge.hidden = true;
        if (stepItem.reasoningDetails) stepItem.reasoningDetails.open = false;
      } else if (activity.status === 'error') {
        stepItem.element.classList.remove('is-running');
        stepItem.element.classList.add('is-error');
        if (stepItem.reasoningBadge) stepItem.reasoningBadge.hidden = true;
      }

      title.textContent = friendlyLabel || (language === 'en' ? 'Fiona is working' : 'Fiona sedang bekerja');
      if (typeof scrollToLatest === 'function') scrollToLatest();
    }

    function finish(kind, message) {
      if (finished) return;
      finished = true;
      clearInterval(timer);
      clearTimeout(stalled);
      if (thoughtCursor && thoughtCursor.parentNode) {
        thoughtCursor.parentNode.removeChild(thoughtCursor);
      }
      details.classList.remove('is-running');
      details.classList.add('is-' + kind);
      const elapsed = performance.now() - started;
      time.textContent = formatDuration(elapsed);

      for (const [, stepItem] of stepMap) {
        stepItem.element.classList.remove('is-running');
        if (kind === 'complete') {
          stepItem.element.classList.add('is-success');
        }
        if (stepItem.reasoningDetails) {
          stepItem.reasoningDetails.open = false;
          if (stepItem.reasoningBadge) stepItem.reasoningBadge.hidden = true;
          if (!stepItem.hasThought || !stepItem.reasoningContent.textContent.trim()) {
            stepItem.reasoningDetails.hidden = true;
          }
        }
      }

      const count = stepMap.size || 1;
      if (kind === 'complete') {
        title.textContent = language === 'en' ? `Completed · ${count} ${count === 1 ? 'step' : 'steps'}` : `Selesai · ${count} langkah`;
      } else {
        title.textContent = message || (language === 'en' ? 'Finished' : 'Selesai');
      }
      notice.hidden = true;
      details.open = kind !== 'complete';
    }

    retry.addEventListener('click', () => {
      if (typeof onRetry === 'function') onRetry();
    });

    details.classList.add('is-running');
    return {
      setLanguage(value) {
        language = value === 'en' ? 'en' : 'id';
        for (const [, stepItem] of stepMap) {
          if (stepItem.reasoningTitle) {
            stepItem.reasoningTitle.textContent = language === 'en' ? 'Reasoning' : 'Alasan';
          }
          if (stepItem.reasoningBadge && !stepItem.reasoningBadge.hidden) {
            stepItem.reasoningBadge.textContent = language === 'en' ? 'Thinking…' : 'Sedang berpikir…';
          }
        }
      },
      upsert,
      appendThought,
      complete() { finish('complete', ''); },
      stop() { finish('stopped', language === 'en' ? 'Stopped by you' : 'Dihentikan oleh Anda'); },
      fail(message) { finish('error', message || (language === 'en' ? 'Connection interrupted' : 'Koneksi terputus')); retry.hidden = false; },
      setConversation(value) {
        if (value && config.onSetConversation) config.onSetConversation(value);
      }
    };
  }

  async function streamChat(options) {
    const { api, token, body, card, signal, onPartial, FionaApiError, isModelKey, setConversationModel, persistModelPreference } = options;
    const response = await fetch(api + '/api/agent/chat/stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'text/event-stream', 'Authorization': 'Bearer ' + (typeof token === 'function' ? token() : token) },
      body: JSON.stringify(body),
      signal
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      const ErrorConstructor = FionaApiError || Error;
      const error = new ErrorConstructor(response.status, data.message || `Request failed (${response.status})`);
      error.code = data.code || data.errorCode || null;
      throw error;
    }
    if (!response.body) throw new Error('Streaming is not supported by this browser.');
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '', runId = null, sequence = 0, result = null;

    function handleEvent(eventType, dataText) {
      if (!dataText.trim()) return;
      const event = JSON.parse(dataText);
      if (runId && event.runId !== runId) return;
      if (!runId) runId = event.runId;
      if (event.sequence != null && event.sequence <= sequence) return;
      if (event.sequence != null) sequence = event.sequence;

      const type = (eventType || event.type || '').toUpperCase();
      if (type === 'RUN_STARTED') {
        const startedModelKey = event.metadata?.modelKey || event.modelKey;
        const validModel = typeof isModelKey === 'function' ? isModelKey(startedModelKey) : Boolean(startedModelKey);
        if (!validModel || (body.modelKey && startedModelKey.trim() !== body.modelKey)) {
          const ErrorConstructor = FionaApiError || Error;
          const error = new ErrorConstructor(409, 'The selected model could not be confirmed for this conversation. Start a new chat.');
          error.code = 'model_protocol_mismatch';
          throw error;
        }
        if (typeof setConversationModel === 'function') setConversationModel(startedModelKey);
        if (typeof persistModelPreference === 'function') persistModelPreference(startedModelKey);
        card.setLanguage(event.language);
        card.setConversation(event.conversationId);
      } else if (type === 'TOOL_CALL_START') {
        card.upsert({
          id: event.toolCallId || ('tool-' + (event.sequence || Date.now())),
          category: event.toolName,
          status: 'running',
          label: event.label
        });
      } else if (type === 'TOOL_CALL_RESULT') {
        card.upsert({
          id: event.toolCallId || ('tool-' + (event.sequence || Date.now())),
          category: event.toolName,
          status: event.status || 'complete',
          label: event.label,
          durationMs: event.durationMs,
          summary: event.summary
        });
      } else if (type === 'THOUGHT_CONTENT') {
        card.appendThought(event.delta || '', event.step, event.phase);
      } else if (type === 'TEXT_MESSAGE_CONTENT') {
        if (typeof onPartial === 'function') onPartial(event.delta || '');
      } else if (type === 'RUN_FINISHED') {
        result = event.result;
      } else if (type === 'RUN_ERROR') {
        throw new Error(event.message || 'Fiona could not complete this request.');
      }
    }

    function parseSseMessage(raw) {
      const lines = raw.split(/\r?\n/);
      let eventType = '';
      const dataLines = [];
      for (const line of lines) {
        if (line.startsWith('event:')) {
          eventType = line.slice(6).trim();
        } else if (line.startsWith('data:')) {
          dataLines.push(line.slice(5).trimStart());
        }
      }
      if (dataLines.length > 0) {
        handleEvent(eventType, dataLines.join('\n'));
      }
    }

    while (true) {
      const chunk = await reader.read();
      buffer += decoder.decode(chunk.value || new Uint8Array(), { stream: !chunk.done });
      let boundary;
      while ((boundary = buffer.indexOf('\n\n')) !== -1) {
        const rawMessage = buffer.slice(0, boundary);
        buffer = buffer.slice(boundary + 2);
        parseSseMessage(rawMessage);
      }
      if (chunk.done) break;
    }
    if (buffer.trim()) parseSseMessage(buffer);
    if (!result) throw new Error('The response stream ended before Fiona returned an answer.');
    return result;
  }

  return {
    toolNameTranslations,
    sanitizeFriendlyLabel,
    sanitizeFriendlySummary,
    formatDuration,
    createActivityCard,
    streamChat
  };
});
