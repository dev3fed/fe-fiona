/**
 * Fiona AI Assistant - Web Component Host Bridge for Cuba Razor Application
 * Connects <fiona-ai-assistant> Custom Element with Cuba's host state,
 * page context, and handles custom events.
 */

(function () {
  'use strict';

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  function resolvePageContext() {
    const context = {
      route: window.location.pathname,
      page: document.title,
    };

    // Extract draftRasciId from URL or hidden input
    const urlParams = new URLSearchParams(window.location.search);
    const draftFromUrl = urlParams.get('draftRasciId') || urlParams.get('id');
    const hiddenDraftInput = document.getElementById('DraftId') || document.getElementById('draftRasciId');

    const draftId = draftFromUrl || (hiddenDraftInput ? hiddenDraftInput.value : null);
    if (draftId) {
      context.draftRasciId = draftId;
      context.sourceLabel = `Draft RASCI (${draftId})`;
    } else {
      context.sourceLabel = 'Matriks RASCI Master';
    }

    return context;
  }

  function initBridge() {
    const el = document.querySelector('fiona-ai-assistant');
    if (!el) return;

    // Pass resolved page context
    const initialContext = resolvePageContext();
    el.setAttribute('page-context-json', JSON.stringify(initialContext));

    // Pass auth token if present
    const token = getCookie('token') || localStorage.getItem('authToken') || '';
    if (token) {
      el.setAttribute('auth-token', token);
    }

    // Listen for events dispatched from Web Component
    el.addEventListener('fiona:jd-applied', (event) => {
      const detail = event.detail || {};
      const jobTitle = detail.jobTitle || 'Jabatan Terkait';
      const msg = `Uraian Jabatan "${jobTitle}" berhasil diterapkan ke sistem.`;

      if (typeof window.Swal !== 'undefined') {
        window.Swal.fire({
          icon: 'success',
          title: 'Berhasil Diterapkan',
          text: msg,
          confirmButtonColor: '#2563eb',
        });
      } else {
        alert(msg);
      }
    });

    el.addEventListener('fiona:navigate', (event) => {
      if (event.detail && event.detail.path) {
        window.location.href = event.detail.path;
      }
    });

    // Expose global bridge helper
    window.FionaBridge = {
      open() {
        el.setAttribute('initial-open', 'true');
      },
      close() {
        el.removeAttribute('initial-open');
      },
      updateContext(ctx) {
        const merged = { ...resolvePageContext(), ...ctx };
        el.setAttribute('page-context-json', JSON.stringify(merged));
      },
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBridge);
  } else {
    initBridge();
  }
})();
