// Polyfill for window.crypto.randomFillSync required by FortuneSheet UMD bundle in browser environments
(function () {
  if (typeof window !== "undefined") {
    if (!window.crypto) window.crypto = {};
    if (!window.crypto.randomFillSync) {
      window.crypto.randomFillSync = function (buffer, offset, size) {
        if (!buffer) return buffer;
        const start = offset || 0;
        const len = size !== undefined ? size : buffer.length ? buffer.length - start : 0;
        const temp = new Uint8Array(len);
        if (typeof window.crypto.getRandomValues === "function") {
          window.crypto.getRandomValues(temp);
        } else {
          for (let i = 0; i < len; i++) temp[i] = Math.floor(Math.random() * 256);
        }
        for (let i = 0; i < len; i++) buffer[start + i] = temp[i];
        return buffer;
      };
    }
  }
})();

let fortunesheetInitialized = false;
let fortunesheetLoading = false;
let isFullscreenProsbis = false;
let modifiedRowIndexes = new Set();
let prosbisIdMapByIdx = new Map();
let prosbisOriginalIdxMap = new Map();
let rowOriginalIdMap = new Map();
let fortunesheetRoot = null;
let fortunesheetRef = { current: null };
let currentWorkbookData = null;

// Backward compatibility flag
let luckysheetInitialized = false;
let luckysheetLoading = false;

function getRowDatabaseId(r) {
  if (typeof rowOriginalIdMap !== "undefined" && rowOriginalIdMap.has(r)) {
    return rowOriginalIdMap.get(r) || 0;
  }
  return 0;
}

function getGridDataMatrix() {
  if (currentWorkbookData && currentWorkbookData[0]) {
    if (currentWorkbookData[0].data) return currentWorkbookData[0].data;
    if (currentWorkbookData[0].celldata) {
      const celldata = currentWorkbookData[0].celldata;
      const matrix = [];
      celldata.forEach((item) => {
        if (!matrix[item.r]) matrix[item.r] = [];
        matrix[item.r][item.c] = item.v;
      });
      return matrix;
    }
  }
  if (fortunesheetRef.current && typeof fortunesheetRef.current.getSheetData === "function") {
    try {
      const sData = fortunesheetRef.current.getSheetData();
      if (sData) return sData;
    } catch (e) {
      console.warn("Error calling getSheetData:", e);
    }
  }
  return null;
}

$(document).ready(function () {
  $("#pills-business-process-tab").on("shown.bs.tab", function () {
    syncDataSourceDropdown();
    ensureFortuneSheetResourcesLoaded(function () {
      if (!fortunesheetInitialized) {
        initFortuneSheetProsbisGrid(true);
      }
    });
  });

  $(document).on("click", "#btn-refresh-prosbis-grid", function (e) {
    e.preventDefault();
    initFortuneSheetProsbisGrid(true);
  });

  $(document).on("click", "#btn-save-prosbis-grid", function (e) {
    e.preventDefault();
    saveFortuneSheetProsbisGrid();
  });

  $(document).on("change", "#dataSource-prosbis", function () {
    initFortuneSheetProsbisGrid(true);
  });

  $(document).on("change", "#dataSource-rasci", function () {
    syncDataSourceDropdown();
  });

  $(document).on("click", "#btn-fullscreen-prosbis-grid", function (e) {
    e.preventDefault();
    toggleFullscreenProsbis();
  });

  $(window).on("resize", function () {
    if (fortunesheetInitialized) {
      fixFortuneSheetLayoutOffsets();
    }
  });

  document.addEventListener("dataLoaded", function () {
    syncDataSourceDropdown();
  });

  window.addEventListener(
    "keydown",
    function (e) {
      if (e.keyCode === 116 || (e.ctrlKey && (e.keyCode === 82 || e.key === "r" || e.key === "R"))) {
        window.location.reload();
      }
    },
    true
  );

  // Clipboard copy handler
  document.addEventListener(
    "copy",
    function (e) {
      const $container = $("#luckysheet-business-process-container, #fortunesheet-business-process-container");
      if ($container.length === 0) return;

      let sel = null;
      if (fortunesheetRef.current && typeof fortunesheetRef.current.getSelectRange === "function") {
        try {
          sel = fortunesheetRef.current.getSelectRange();
        } catch (err) {
          console.warn("getSelectRange error:", err);
        }
      }

      if (!sel || sel.length === 0) return;

      try {
        const gridData = getGridDataMatrix();
        if (!gridData) return;

        const r1 = Math.min(sel[0].row[0], sel[0].row[1]);
        const r2 = Math.max(sel[0].row[0], sel[0].row[1]);
        const c1 = Math.min(sel[0].column[0], sel[0].column[1]);
        const c2 = Math.max(sel[0].column[0], sel[0].column[1]);

        const textRows = [];
        for (let r = r1; r <= r2; r++) {
          const rowCells = [];
          for (let c = c1; c <= c2; c++) {
            const cell = gridData[r] ? gridData[r][c] : null;
            const textVal = getFortuneSheetCellValue(cell);
            rowCells.push(textVal);
          }
          textRows.push(rowCells.join("\t"));
        }

        const plainText = textRows.join("\n");
        if (plainText !== "" && e.clipboardData) {
          e.clipboardData.setData("text/plain", plainText);
          e.clipboardData.setData("text/html", plainText);
          e.preventDefault();
        }
      } catch (err) {
        console.warn("Custom copy handler error:", err);
      }
    },
    true
  );

  $(document).on(
    "paste",
    "#luckysheet-business-process-container, #fortunesheet-business-process-container, .luckysheet-cell-input, .fortune-cell-input",
    function () {
      setTimeout(function () {
        processModifiedRange(null, "Clipboard Paste Event");
      }, 150);
    }
  );

  // Disable right-click context menu on sheet tabs in bottom bar
  $(document).on(
    "contextmenu",
    ".fortune-sheet-tab, .fortune-sheet-tab-item, .fortune-sheet-tab-name, .fortune-sheet-area-bottom, #luckysheet-sheets-item, .luckysheet-sheets-item",
    function (e) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  );

  // Hide insert image & insert link in cell right click menu when opened
  $(document).on("contextmenu mousedown mouseup click", function () {
    setTimeout(hideContextMenuItems, 0);
    setTimeout(hideContextMenuItems, 20);
    setTimeout(hideContextMenuItems, 100);
  });
});

function hideContextMenuItems() {
  $(
    ".fortune-sheet-cols-menu-item, .luckysheet-cols-menu-item, .fortune-context-menu-item, " +
      ".fortune-cols-menu-item, [class*='cols-menu-item'], [class*='context-menu-item']"
  ).each(function () {
    const $item = $(this);

    // Skip parent popup containers
    if (
      $item.hasClass("fortune-context-menu") ||
      $item.hasClass("luckysheet-cols-menu") ||
      $item.hasClass("fortune-context-menu-container")
    ) {
      return;
    }

    const text = $item.text().toLowerCase().trim();
    const action = ($item.attr("data-action") || "").toLowerCase();
    if (
      action === "image" ||
      action === "link" ||
      action === "insertimage" ||
      action === "insertlink" ||
      action === "chart" ||
      text === "insert image" ||
      text === "insert link" ||
      text.startsWith("insert image") ||
      text.startsWith("insert link") ||
      text.includes("sisipkan gambar") ||
      text.includes("sisipkan link")
    ) {
      $item.attr(
        "style",
        "display: none !important; visibility: hidden !important; height: 0 !important; max-height: 0 !important; margin: 0 !important; padding: 0 !important; overflow: hidden !important; border: none !important;"
      );
    }
  });
}

if (typeof MutationObserver !== "undefined") {
  const contextMenuObserver = new MutationObserver(function () {
    hideContextMenuItems();
  });
  $(document).ready(function () {
    contextMenuObserver.observe(document.body, { childList: true, subtree: true });
  });
}

function hideFortuneSheetAddAndMenuButtons() {
  $(
    ".fortune-sheet-area-bottom, .fortune-sheetbar, .fortune-sheets-bottom, #luckysheet-sheet-area, .luckysheet-sheet-area, " +
      "#luckysheet-sheets-add, #fortune-sheets-add, #fortune-sheet-sheets-add, " +
      ".luckysheet-sheets-add, .fortune-sheets-add, .fortune-sheet-add, .fortune-sheet-tab-add, " +
      "[class*='sheet-add'], [class*='sheets-add'], [class*='add-sheet'], " +
      "#luckysheet-sheets-m, #fortune-sheets-m, #fortune-sheet-sheets-m, " +
      ".luckysheet-sheets-m, .fortune-sheets-m, .fortune-sheet-sheets-m, " +
      "[class*='sheets-m'], [class*='sheet-menu'], [class*='all-sheet'], [class*='list-btn'], [class*='sheet-area-bottom'], [class*='sheetbar']"
  ).attr(
    "style",
    "display: none !important; visibility: hidden !important; opacity: 0 !important; width: 0 !important; height: 0 !important; pointer-events: none !important; margin: 0 !important; padding: 0 !important;"
  );
}

let isFormulaResizing = false;
let formulaStartY = 0;
let formulaStartHeight = 0;
let $formulaTargetBar = null;

const formulaBarSelectors =
  ".fortune-formula-bar, #fortune-formula-bar, .luckysheet-wa-calculate, .fortune-wa-calculate, #luckysheet-wa-calculate, #fortune-wa-calculate, [class*='formula-bar'], [class*='wa-calculate']";

$(document).on("mousemove", formulaBarSelectors, function (e) {
  if (isFormulaResizing) return;
  const rect = this.getBoundingClientRect();
  if (e.clientY >= rect.bottom - 10 && e.clientY <= rect.bottom + 6) {
    $(this).css("cursor", "ns-resize");
  } else {
    $(this).css("cursor", "");
  }
});

$(document).on("mousedown", formulaBarSelectors, function (e) {
  const rect = this.getBoundingClientRect();
  if (e.clientY >= rect.bottom - 10 && e.clientY <= rect.bottom + 6) {
    e.preventDefault();
    e.stopPropagation();
    isFormulaResizing = true;
    $formulaTargetBar = $(this);
    $formulaTargetBar.addClass("formula-resizing-active");
    formulaStartY = e.clientY;
    formulaStartHeight = $formulaTargetBar.height() || 28;
    $("body").css({ cursor: "ns-resize", "user-select": "none" });
  }
});

$(document).on("mousemove.formulaDragDoc", function (e) {
  if (!isFormulaResizing || !$formulaTargetBar || $formulaTargetBar.length === 0) return;
  e.preventDefault();
  const dy = e.clientY - formulaStartY;
  const newHeight = Math.max(28, Math.min(300, formulaStartHeight + dy));

  $formulaTargetBar.css({
    height: newHeight + "px",
    "max-height": newHeight + "px",
    "min-height": newHeight + "px",
  });

  $formulaTargetBar
    .find(
      "#luckysheet-functionbox-cell, .fortune-fx-input, [class*='fx-input'], [class*='rich-text'], [class*='formula-input'], [contenteditable='true'], input, textarea, .luckysheet-formula-text-editor"
    )
    .css({
      height: Math.max(22, newHeight - 6) + "px",
      "max-height": Math.max(22, newHeight - 6) + "px",
    });

  if (fortunesheetRef.current && typeof fortunesheetRef.current.resize === "function") {
    try {
      fortunesheetRef.current.resize();
    } catch (err) {}
  }
});

$(document).on("mouseup.formulaDragDoc", function () {
  if (isFormulaResizing) {
    isFormulaResizing = false;
    if ($formulaTargetBar) $formulaTargetBar.removeClass("formula-resizing-active");
    $formulaTargetBar = null;
    $("body").css({ cursor: "", "user-select": "" });
    if (fortunesheetRef.current && typeof fortunesheetRef.current.resize === "function") {
      try {
        fortunesheetRef.current.resize();
      } catch (err) {}
    }
  }
});

function fixFortuneSheetLayoutOffsets() {
  hideFortuneSheetAddAndMenuButtons();
  if (fortunesheetRef.current && typeof fortunesheetRef.current.resize === "function") {
    try {
      fortunesheetRef.current.resize();
    } catch (e) {}
  }
  try {
    window.dispatchEvent(new Event("resize"));
  } catch (e) {}
}

function ensureFortuneSheetResourcesLoaded(callback) {
  if (typeof window.react !== "undefined" && typeof window.react.Workbook !== "undefined") {
    if (callback) callback();
    return;
  }

  if (fortunesheetLoading) {
    let checkInt = setInterval(function () {
      if (typeof window.react !== "undefined" && typeof window.react.Workbook !== "undefined") {
        clearInterval(checkInt);
        if (callback) callback();
      }
    }, 100);
    return;
  }

  fortunesheetLoading = true;
  luckysheetLoading = true;

  if (!document.getElementById("fortunesheet-css-core")) {
    const link = document.createElement("link");
    link.id = "fortunesheet-css-core";
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/npm/@fortune-sheet/react@1.0.4/dist/index.css";
    document.head.appendChild(link);
  }

  function loadScript(url, cb) {
    const script = document.createElement("script");
    script.src = url;
    script.onload = cb;
    script.onerror = function () {
      console.error("Failed to load script:", url);
    };
    document.body.appendChild(script);
  }

  const loadFortuneSheetBundle = function () {
    loadScript("https://cdn.jsdelivr.net/npm/@fortune-sheet/react@1.0.4/dist/index.umd.js", function () {
      fortunesheetLoading = false;
      luckysheetLoading = false;
      if (callback) callback();
    });
  };

  if (typeof window.React === "undefined") {
    loadScript("https://unpkg.com/react@18/umd/react.production.min.js", function () {
      if (typeof window.ReactDOM === "undefined") {
        loadScript("https://unpkg.com/react-dom@18/umd/react-dom.production.min.js", function () {
          loadFortuneSheetBundle();
        });
      } else {
        loadFortuneSheetBundle();
      }
    });
  } else if (typeof window.ReactDOM === "undefined") {
    loadScript("https://unpkg.com/react-dom@18/umd/react-dom.production.min.js", function () {
      loadFortuneSheetBundle();
    });
  } else {
    loadFortuneSheetBundle();
  }
}

function syncDataSourceDropdown() {
  const $gridDropdown = $("#dataSource-prosbis");
  if ($gridDropdown.length === 0) return;

  const currentVal = $gridDropdown.val();

  let $mainDropdown = $("#dataSource-rasci");
  if ($mainDropdown.length === 0 || $mainDropdown.find("option").length <= 1) {
    $mainDropdown = $("#select-draft");
  }

  $gridDropdown.empty();
  $gridDropdown.append('<option value="master">Master data Prosbis</option>');

  if ($mainDropdown.length > 0 && $mainDropdown.find("option").length > 1) {
    $mainDropdown.find("option").each(function () {
      const val = $(this).val();
      const text = $(this).text();
      if (val && val !== "master" && val !== "Select Draft" && val !== "Choose" && val !== "") {
        if ($gridDropdown.find(`option[value="${val}"]`).length === 0) {
          $gridDropdown.append(`<option value="${val}">${text}</option>`);
        }
      }
    });
  }

  if ($gridDropdown.find("option").length <= 1 && typeof fetchSelectDraftRasci === "function") {
    fetchSelectDraftRasci().then((response) => {
      if (response && response.data && response.data.result) {
        const excludedIds = new Set(["1", "00000000-0000-0000-0000-000000000001"]);
        const result = Array.isArray(response.data.result)
          ? response.data.result.filter((item) => !excludedIds.has(String(item?.id)))
          : [];
        result.forEach((item) => {
          if ($gridDropdown.find(`option[value="${item.id}"]`).length === 0) {
            $gridDropdown.append(`<option value="${item.id}">${item.text || item.id}</option>`);
          }
        });

        if (currentVal && $gridDropdown.find(`option[value="${currentVal}"]`).length > 0) {
          $gridDropdown.val(currentVal);
        } else if (
          typeof selectedValue !== "undefined" &&
          selectedValue &&
          $gridDropdown.find(`option[value="${selectedValue}"]`).length > 0
        ) {
          $gridDropdown.val(selectedValue);
        }
      }
    });
  }

  if (currentVal && $gridDropdown.find(`option[value="${currentVal}"]`).length > 0) {
    $gridDropdown.val(currentVal);
  } else if (
    typeof selectedValue !== "undefined" &&
    selectedValue &&
    $gridDropdown.find(`option[value="${selectedValue}"]`).length > 0
  ) {
    $gridDropdown.val(selectedValue);
  } else {
    $gridDropdown.val("master");
  }
}

function cleanFortuneSheetText(rawVal) {
  if (rawVal === null || rawVal === undefined) return "";
  let str = String(rawVal).trim();
  if (
    str.includes("<table") ||
    str.includes("luckysheet_copy_action_table") ||
    str.includes("<tr") ||
    str.includes("<td")
  ) {
    try {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = str;
      str = (tempDiv.textContent || tempDiv.innerText || "").trim();
    } catch (e) {
      str = str.replace(/<[^>]*>/g, "").trim();
    }
  }
  return str;
}

function getFortuneSheetCellValue(cell) {
  if (cell === null || cell === undefined) return "";
  if (typeof cell === "object") {
    const val = cell.v !== undefined && cell.v !== null ? cell.v : cell.m;
    const extracted = val !== undefined && val !== null ? String(val).trim() : "";
    return cleanFortuneSheetText(extracted);
  }
  return cleanFortuneSheetText(String(cell).trim());
}

function processModifiedRange(rangeInput, source = "Update") {
  let ranges = [];
  if (typeof rangeInput === "number") {
    ranges = [{ row: [rangeInput, rangeInput] }];
  } else if (Array.isArray(rangeInput)) {
    ranges = rangeInput;
  } else if (rangeInput && typeof rangeInput === "object") {
    ranges = [rangeInput];
  } else if (fortunesheetRef.current && typeof fortunesheetRef.current.getSelectRange === "function") {
    try {
      const sel = fortunesheetRef.current.getSelectRange();
      if (sel && sel.length > 0) ranges = sel;
    } catch (e) {}
  }

  const affectedRows = new Set();
  ranges.forEach((rg) => {
    if (!rg) return;
    let rStart = null;
    let rEnd = null;
    if (Array.isArray(rg.row) && rg.row.length >= 2) {
      rStart = rg.row[0];
      rEnd = rg.row[1];
    } else if (typeof rg.row === "number") {
      rStart = rg.row;
      rEnd = rg.row;
    } else if (typeof rg.r === "number") {
      rStart = rg.r;
      rEnd = rg.r;
    } else if (Array.isArray(rg.r) && rg.r.length >= 2) {
      rStart = rg.r[0];
      rEnd = rg.r[1];
    }

    if (rStart !== null && rEnd !== null) {
      const minR = Math.min(rStart, rEnd);
      const maxR = Math.max(rStart, rEnd);
      for (let r = minR; r <= maxR; r++) {
        if (r > 0) affectedRows.add(r);
      }
    }
  });

  const gridData = getGridDataMatrix();
  if (affectedRows.size > 0 && gridData) {
    affectedRows.forEach((r) => {
      modifiedRowIndexes.add(r);
      try {
        if (gridData[r]) {
          const gRow = gridData[r];
          const targetId = getRowDatabaseId(r);
          if (gRow[0]) {
            gRow[0]._id = targetId;
            if (typeof gRow[0].v === "object" && gRow[0].v !== null) gRow[0].v._id = targetId;
          }
          gRow._id = targetId;

          for (let c = 0; c < gRow.length; c++) {
            const cObj = gRow[c];
            if (!cObj) continue;
            if (
              typeof cObj.v === "string" &&
              (cObj.v.includes("<table") || cObj.v.includes("luckysheet_copy_action_table"))
            ) {
              const cleaned = cleanFortuneSheetText(cObj.v);
              cObj.v = cleaned;
              cObj.m = cleaned;
            } else if (typeof cObj.v === "object" && cObj.v !== null) {
              if (
                typeof cObj.v.v === "string" &&
                (cObj.v.v.includes("<table") || cObj.v.v.includes("luckysheet_copy_action_table"))
              ) {
                const cleaned = cleanFortuneSheetText(cObj.v.v);
                cObj.v.v = cleaned;
                cObj.v.m = cleaned;
              }
            }
            if (
              typeof cObj.m === "string" &&
              (cObj.m.includes("<table") || cObj.m.includes("luckysheet_copy_action_table"))
            ) {
              cObj.m = cleanFortuneSheetText(cObj.m);
            }
          }
        }
      } catch (e) {
        console.warn("Failed to sanitize row _id / HTML table content:", e);
      }
    });
  }
}

function toggleFullscreenProsbis() {
  isFullscreenProsbis = !isFullscreenProsbis;
  const $card = $("#luckysheet-business-process-card");
  const $icon = $("#fullscreen-icon");

  if (isFullscreenProsbis) {
    $card.addClass("luckysheet-fullscreen-active fortune-fullscreen-active");
    $icon.removeClass("fa-expand").addClass("fa-compress");
  } else {
    $card.removeClass("luckysheet-fullscreen-active fortune-fullscreen-active");
    $icon.removeClass("fa-compress").addClass("fa-expand");
  }

  fixFortuneSheetLayoutOffsets();
  setTimeout(function () {
    fixFortuneSheetLayoutOffsets();
  }, 50);
  setTimeout(function () {
    fixFortuneSheetLayoutOffsets();
  }, 150);
  setTimeout(function () {
    fixFortuneSheetLayoutOffsets();
  }, 350);
}

function processModifiedRange(range, source) {
  console.log("[FortuneSheet Change]", source, range);
  if (!range) return;
  if (typeof range === "object") {
    let rowRange = range.row || (Array.isArray(range) && range[0] ? range[0].row : null);
    if (rowRange && Array.isArray(rowRange) && rowRange.length >= 2) {
      let minR = Math.min(rowRange[0], rowRange[1]);
      let maxR = Math.max(rowRange[0], rowRange[1]);
      for (let r = minR; r <= maxR; r++) {
        if (r > 0) {
          modifiedRowIndexes.add(r);
          console.log(`[FortuneSheet] Row ${r} marked as modified. Modified rows list:`, Array.from(modifiedRowIndexes));
        }
      }
    } else if (typeof range.r === "number" && range.r > 0) {
      modifiedRowIndexes.add(range.r);
      console.log(`[FortuneSheet] Row ${range.r} marked as modified. Modified rows list:`, Array.from(modifiedRowIndexes));
    }
  }
}

async function initFortuneSheetProsbisGrid(forceReload = false) {
  let $container = $("#luckysheet-business-process-container");
  if ($container.length === 0) {
    $container = $("#fortunesheet-business-process-container");
  }
  if ($container.length === 0) return;

  try {
    if (typeof window.react === "undefined" || typeof window.react.Workbook === "undefined") {
      console.error("FortuneSheet library is not loaded.");
      return;
    }

    const selectedDs =
      $("#dataSource-prosbis").val() || (typeof selectedValue !== "undefined" ? selectedValue : "master");

    let prosbisList = [];

    // Load ALL data (pageSize = 99999) without pagination
    if (typeof fetchBusinessProcessHierarchy === "function") {
      const hierRes = await fetchBusinessProcessHierarchy(selectedDs, null, 1, 99999);
      if (hierRes && hierRes.success) {
        prosbisList = hierRes.flatList || [];
      }
    }

    if (prosbisList.length === 0 && typeof fetchProsbisMatrix === "function") {
      const payload = {
        draftRasciId: selectedDs !== "master" ? selectedDs : null,
        level: [],
        indexNumber:
          typeof appState !== "undefined" && appState.defaultIndexNumber ? appState.defaultIndexNumber : null,
        row: 1,
        rowSize: 99999,
      };
      const prosbisRes = await fetchProsbisMatrix(payload);
      if (prosbisRes && prosbisRes.success && prosbisRes.data) {
        prosbisList = prosbisRes.data;
      }
    }

    const celldata = [];

    const baseHeaders = [
      { text: "Index", bg: "#f8fafc", fc: "#0f172a", bl: 1 },
      { text: "L1", bg: "#f8fafc", fc: "#dc2626", bl: 1 },
      { text: "L2", bg: "#f8fafc", fc: "#2563eb", bl: 1 },
      { text: "L3", bg: "#f8fafc", fc: "#0284c7", bl: 1 },
      { text: "L4", bg: "#f8fafc", fc: "#7c3aed", bl: 1 },
      { text: "L5", bg: "#f8fafc", fc: "#3e4140ff", bl: 1 },
      { text: "L6", bg: "#f8fafc", fc: "#7c7a7aff", bl: 1 },
      { text: "L7", bg: "#f8fafc", fc: "#7c7a7aff", bl: 1 },
      { text: "L8", bg: "#f8fafc", fc: "#7c7a7aff", bl: 1 },
      { text: "Notes", bg: "#f8fafc", fc: "#0f172a", bl: 1 },
      { text: "Definisi", bg: "#f8fafc", fc: "#0f172a", bl: 1 },
      { text: "Input", bg: "#f8fafc", fc: "#0f172a", bl: 1 },
      { text: "Output/Product/Deliverables", bg: "#f8fafc", fc: "#0f172a", bl: 1 },
    ];

    baseHeaders.forEach((h, cIdx) => {
      const headerTb = 1;
      celldata.push({
        r: 0,
        c: cIdx,
        v: {
          v: h.text,
          m: h.text,
          bg: h.bg,
          fc: h.fc,
          bl: h.bl,
          tb: headerTb,
          ff: 1,
          fs: 11,
          ht: 1,
          vt: 1,
        },
      });
    });

    prosbisIdMapByIdx.clear();
    prosbisOriginalIdxMap.clear();
    rowOriginalIdMap.clear();

    if (prosbisList && prosbisList.length > 0) {
      prosbisList.forEach((pb, rIdx) => {
        const idxStr = String(pb.indexNumber || pb.IndexNumber || "").trim();
        const pbId = pb.id || pb.BusinessProcessId || pb.businessProcessId || 0;
        if (idxStr && pbId) {
          prosbisIdMapByIdx.set(idxStr, pbId);
          prosbisOriginalIdxMap.set(String(pbId), idxStr);
        }

        const r = rIdx + 1;
        if (pbId) {
          rowOriginalIdMap.set(r, pbId);
        }
        const levelNum = pb.level || pb.Level || (idxStr ? idxStr.split(".").length : 1);
        const desc = pb.description || pb.Description || pb.name || pb.businessProcessName || "";

        celldata.push({ r: r, c: 0, v: { v: idxStr, m: idxStr, _id: pbId, ff: 1, fs: 11, tb: 1 } });

        const colLevel = Math.min(Math.max(levelNum, 1), 8);
        let colorHex = "#0f172a";
        let isBold = 0;

        if (colLevel === 1) {
          colorHex = "#dc2626";
          isBold = 1;
        } else if (colLevel === 2) {
          colorHex = "#2563eb";
          isBold = 1;
        } else if (colLevel === 3) {
          colorHex = "#0284c7";
        } else if (colLevel === 4) {
          colorHex = "#7c3aed";
        } else if (colLevel === 5) {
          colorHex = "#3e4140ff";
        } else if (colLevel === 6) {
          colorHex = "#7c7a7aff";
        } else if (colLevel === 7) {
          colorHex = "#7c7a7aff";
        } else if (colLevel === 8) {
          colorHex = "#7c7a7aff";
        }

        const textWrapMode = 1;
        const cellNotesVal = pb.cellNotes || pb.CellNotes || "";

        const descCellObj = { v: desc, m: desc, fc: colorHex, bl: isBold, tb: textWrapMode, ff: 1, fs: 11 };
        if (cellNotesVal) {
          descCellObj.ps = { value: cellNotesVal, isShow: false };
        }

        celldata.push({ r: r, c: colLevel, v: descCellObj });

        celldata.push({ r: r, c: 9, v: { v: pb.notes || "", m: pb.notes || "", ff: 1, fs: 11, tb: 1 } });
        celldata.push({
          r: r,
          c: 10,
          v: {
            v: pb.definisi || pb.definition || pb.processDefinition || "",
            m: pb.definisi || pb.definition || pb.processDefinition || "",
            ff: 1,
            fs: 11,
            tb: 1,
          },
        });
        celldata.push({ r: r, c: 11, v: { v: pb.input || "", m: pb.input || "", ff: 1, fs: 11, tb: 1 } });
        celldata.push({ r: r, c: 12, v: { v: pb.output || "", m: pb.output || "", ff: 1, fs: 11, tb: 1 } });

        const cellPropsList = pb.cellProperties || pb.CellProperties || [];
        if (Array.isArray(cellPropsList) && cellPropsList.length > 0) {
          cellPropsList.forEach((cp) => {
            let cIdx = -1;
            const colNameNorm = (cp.columnName || cp.ColumnName || "").toLowerCase().trim();
            if (colNameNorm === "indexnumber") cIdx = 0;
            else if (colNameNorm === "description") cIdx = colLevel;
            else if (colNameNorm === "notes") cIdx = 9;
            else if (colNameNorm === "definisi" || colNameNorm === "definition") cIdx = 10;
            else if (colNameNorm === "input") cIdx = 11;
            else if (colNameNorm === "output") cIdx = 12;

            if (cIdx >= 0) {
              let target = celldata.find((cd) => cd.r === r && cd.c === cIdx);
              if (target && target.v) {
                const fc = cp.fontColor || cp.FontColor;
                const bg = cp.bgColor || cp.BgColor;
                const bl = cp.isBold !== undefined ? cp.isBold : cp.IsBold;
                const it = cp.isItalic !== undefined ? cp.isItalic : cp.IsItalic;
                const cl = cp.isStrike !== undefined ? cp.isStrike : cp.IsStrike;
                const un = cp.isUnderline !== undefined ? cp.isUnderline : cp.IsUnderline;
                const fs = cp.fontSize || cp.FontSize;
                let ff = cp.fontFamily || cp.FontFamily;

                if (fc) target.v.fc = fc;
                if (bg) target.v.bg = bg;
                if (bl !== null && bl !== undefined) target.v.bl = bl ? 1 : 0;
                if (it !== null && it !== undefined) target.v.it = it ? 1 : 0;
                if (cl !== null && cl !== undefined) target.v.cl = cl ? 1 : 0;
                if (un !== null && un !== undefined) target.v.un = un ? 1 : 0;
                if (fs) target.v.fs = parseInt(fs);
                if (ff !== null && ff !== undefined && ff !== "") {
                  const ffStr = String(ff).toLowerCase().trim();
                  if (ffStr === "arial" || ffStr === "1") ff = 1;
                  else if (ffStr === "times new roman" || ffStr === "0") ff = 0;
                  else if (ffStr === "tahoma" || ffStr === "2") ff = 2;
                  else if (ffStr === "verdana" || ffStr === "3") ff = 3;
                  else if (!isNaN(parseInt(ffStr))) ff = parseInt(ffStr);
                  target.v.ff = ff;
                }
              }
            }
          });
        }
      });
    }

    const sheetData = [
      {
        name: "Sheet1",
        color: "",
        status: 1,
        order: 0,
        celldata: celldata,
        config: {
          defaultrowlen: 25,
          columnlen: {
            0: 75,
            1: 34,
            2: 34,
            3: 34,
            4: 34,
            5: 350,
            6: 34,
            7: 34,
            8: 34,
            9: 180,
            10: 220,
            11: 220,
            12: 220,
          },
        },
      },
    ];

    currentWorkbookData = sheetData;

    const workbookProps = {
      ref: fortunesheetRef,
      data: sheetData,
      showinfobar: false,
      defaultFontFamily: "Arial",
      defaultFontSize: 11,
      defaultTextWrapMode: 1,
      showtoolbar: true,
      toolbarItems: [
        "undo",
        "redo",
        "format-painter",
        "clear-format",
        "|",
        "font",
        "font-size",
        "|",
        "bold",
        "italic",
        "strike-through",
        "underline",
        "|",
        "font-color",
        "background",
        "border",
        "merge-cell",
        "|",
        "horizontal-align",
        "vertical-align",
        "text-wrap",
        "text-rotation",
        "|",
        "freeze",
        "conditionFormat",
        "filter",
        "comment",
        "search",
      ],
      showtoolbarConfig: {
        paintFormat: false,
        currencyFormat: false,
        percentageFormat: false,
        numberDecrease: false,
        numberIncrease: false,
        moreFormats: false,
        textRotateMode: false,
        image: false,
        link: false,
        chart: false,
        pivotTable: false,
        function: false,
        conditionalFormat: false,
        dataVerification: false,
        splitColumn: false,
        screenshot: false,
        protection: false,
        print: false,
      },
      showsheetbar: false,
      showsheetbarConfig: {
        add: false,
        menu: false,
        sheet: false,
      },
      cellRightClickConfig: {
        matrix: false,
        chart: false,
        image: false,
        link: false,
        insertImage: false,
        insertLink: false,
        data: false,
      },
      sheetRightClickConfig: {
        delete: false,
        copy: false,
        rename: false,
        color: false,
        hide: false,
        move: false,
      },
      sheetTabContextMenu: [],
      showformulaBar: true,
      showstatisticBar: true,
      allowUpdate: true,
      defaultRowHeight: 25,
      column: baseHeaders.length,
      row: Math.max((prosbisList.length || 15) + 30, 50),
      onChange: function (newData) {
        currentWorkbookData = newData;
        console.log("[FortuneSheet] Grid data changed via onChange");
      },
      onCellUpdated: function (r, c, oldValue, newValue) {
        console.log(`[FortuneSheet] onCellUpdated top-level prop fired at Row ${r}, Col ${c}`, { oldValue, newValue });
        if (r > 0) modifiedRowIndexes.add(r);
      },
      onOp: function (ops) {
        console.log("[FortuneSheet] onOp top-level prop fired:", ops);
        if (Array.isArray(ops)) {
          ops.forEach(function (op) {
            if (op && typeof op.r === "number" && op.r > 0) {
              modifiedRowIndexes.add(op.r);
            } else if (op && Array.isArray(op.path)) {
              let rIdx = op.path[1];
              if (typeof rIdx === "number" && rIdx > 0) modifiedRowIndexes.add(rIdx);
            }
          });
        }
      },
      onAfterChange: function (changes) {
        console.log("[FortuneSheet] onAfterChange top-level prop fired:", changes);
      },
      hooks: {
        cellUpdated: function (r, c, oldValue, newValue) {
          console.log(`[FortuneSheet] Cell updated at Row ${r}, Col ${c}`, { oldValue, newValue });
          if (r > 0) modifiedRowIndexes.add(r);
          processModifiedRange({ row: [r, r], column: [c, c] }, `Cell Updated at Row ${r}, Col ${c}`);
        },
        rangePasteAfter: function (range) {
          console.log("[FortuneSheet] Range pasted:", range);
          if (range && range.row) {
            for (let r = Math.min(range.row[0], range.row[1]); r <= Math.max(range.row[0], range.row[1]); r++) {
              if (r > 0) modifiedRowIndexes.add(r);
            }
          }
          processModifiedRange(range, "Range Paste");
        },
        updated: function (operate) {
          console.log("[FortuneSheet] Sheet updated hook:", operate);
          if (operate) {
            if (operate.range) {
              processModifiedRange(operate.range, "Sheet Updated (" + (operate.type || "operate") + ")");
            } else if (Array.isArray(operate)) {
              operate.forEach((op) => {
                if (op && op.range) processModifiedRange(op.range, "Sheet Updated");
              });
            } else if (operate.type === "paste" || operate.type === "execCommand") {
              processModifiedRange(null, "Sheet Updated (" + operate.type + ")");
            }
          }
        },
        commentUpdated: function (r, c, oldValue, newValue) {
          console.log(`[FortuneSheet] Comment updated at Row ${r}, Col ${c}`, { oldValue, newValue });
          if (r > 0) modifiedRowIndexes.add(r);
          processModifiedRange({ row: [r, r], column: [c, c] }, `Comment Updated at Row ${r}, Col ${c}`);
        },
        rowInsertAfter: function (r) {
          const insertIdx = r + 1;
          if (insertIdx > 0) {
            const newMap = new Map();
            rowOriginalIdMap.forEach((val, k) => {
              if (k >= insertIdx) {
                newMap.set(k + 1, val);
              } else {
                newMap.set(k, val);
              }
            });
            newMap.set(insertIdx, 0);
            rowOriginalIdMap = newMap;
            modifiedRowIndexes.add(insertIdx);
          }
        },
        rowDeleteAfter: function (r) {
          const deleteIdx = r + 1;
          if (deleteIdx > 0) {
            const newMap = new Map();
            rowOriginalIdMap.forEach((val, k) => {
              if (k < deleteIdx) {
                newMap.set(k, val);
              } else if (k > deleteIdx) {
                newMap.set(k - 1, val);
              }
            });
            rowOriginalIdMap = newMap;
          }
        },
      },
    };

    if (!fortunesheetRoot) {
      if (ReactDOM.createRoot) {
        fortunesheetRoot = ReactDOM.createRoot($container[0]);
      } else {
        fortunesheetRoot = {
          render: function (element) {
            ReactDOM.render(element, $container[0]);
          },
        };
      }
    }

    const { Workbook } = window.react;
    // Use unique key so React unmounts old FortuneSheet instance and re-renders new sheetData on dataSource change
    const wbKey = "wb_" + String(selectedDs) + "_" + String(prosbisList.length) + "_" + Date.now();
    fortunesheetRoot.render(React.createElement(Workbook, Object.assign({ key: wbKey }, workbookProps)));

    fortunesheetInitialized = true;
    luckysheetInitialized = true;
    modifiedRowIndexes.clear();

    hideFortuneSheetAddAndMenuButtons();
    setTimeout(function () {
      hideFortuneSheetAddAndMenuButtons();
      initFormulaBarDraggableResize();
      fixFortuneSheetLayoutOffsets();
      $(document).off("contextmenu.fortunesheettab").on("contextmenu.fortunesheettab", ".fortune-sheet-tab, .fortune-sheet-area-bottom, .fortune-sheet-tab-node, .fortune-sheet-sheet-area", function (e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      });
    }, 150);
    setTimeout(function () {
      hideFortuneSheetAddAndMenuButtons();
    }, 500);
  } catch (err) {
    console.error("Failed to initialize FortuneSheet:", err);
  }
}

async function saveFortuneSheetProsbisGrid() {
  console.log("[FortuneSheet Save] Save triggered. Current modifiedRowIndexes:", Array.from(modifiedRowIndexes));
  const spinBtn = document.getElementById("loadingSaveSheet");
  if (spinBtn) spinBtn.style.display = "inline-block";

  if (typeof window.react === "undefined" || typeof window.react.Workbook === "undefined") {
    console.error("FortuneSheet library is not loaded.");
    if (typeof Swal !== "undefined") Swal.fire("Error", "FortuneSheet belum dimuat.", "error");
    else alert("FortuneSheet belum dimuat.");
    if (spinBtn) spinBtn.style.display = "none";
    return;
  }

  try {
    const gridData = getGridDataMatrix();
    if (!gridData) {
      console.warn("No grid data found in FortuneSheet.");
      if (typeof Swal !== "undefined") Swal.fire("Info", "Tidak ada data pada grid.", "info");
      else alert("Tidak ada data pada grid.");
      if (spinBtn) spinBtn.style.display = "none";
      return;
    }

    const selectedDs =
      $("#dataSource-prosbis").val() || (typeof selectedValue !== "undefined" ? selectedValue : "master");

    const items = [];
    const parentIndexByLevel = {};
    const seqByLevel = {};

    for (let r = 1; r < gridData.length; r++) {
      const row = gridData[r];
      if (!row) continue;

      const rawIdxVal = row[0] ? (row[0].v || row[0].m || "").toString().trim() : "";

      let desc = "";
      let level = 1;
      for (let c = 1; c <= 8; c++) {
        if (
          row[c] &&
          ((row[c].v !== undefined && row[c].v !== null && String(row[c].v).trim() !== "") ||
            (row[c].m !== undefined && row[c].m !== null && String(row[c].m).trim() !== ""))
        ) {
          desc = String(row[c].v !== undefined && row[c].v !== null ? row[c].v : row[c].m).trim();
          level = c;
          break;
        }
      }

      if (!desc && rawIdxVal) {
        level = rawIdxVal.split(".").length;
      }

      const notes = row[9] ? (row[9].v || row[9].m || "").toString().trim() : "";
      const definisi = row[10] ? (row[10].v || row[10].m || "").toString().trim() : "";
      const input = row[11] ? (row[11].v || row[11].m || "").toString().trim() : "";
      const output = row[12] ? (row[12].v || row[12].m || "").toString().trim() : "";

      let cellNotes = "";
      for (let c = 0; c <= 12; c++) {
        if (row[c]) {
          const ps = row[c].ps || (row[c].v && typeof row[c].v === "object" ? row[c].v.ps : null);
          if (ps) {
            if (typeof ps === "string" && ps.trim()) {
              cellNotes = ps.trim();
              break;
            } else if (
              typeof ps === "object" &&
              ps.value !== undefined &&
              ps.value !== null &&
              String(ps.value).trim()
            ) {
              cellNotes = String(ps.value).trim();
              break;
            }
          }
        }
      }

      if (!desc && !rawIdxVal && !notes && !definisi && !input && !output && !cellNotes) continue;

      let rowId = getRowDatabaseId(r);

      let parentIdVal = null;
      if (level > 1) {
        for (let k = level - 1; k >= 1; k--) {
          if (parentIndexByLevel[k]) {
            parentIdVal = parentIndexByLevel[k];
            break;
          }
        }
      }

      seqByLevel[level] = (seqByLevel[level] || 0) + 1;
      for (let k = level + 1; k <= 8; k++) {
        seqByLevel[k] = 0;
        delete parentIndexByLevel[k];
      }

      let computedIndex = "";
      if (level === 1) {
        computedIndex = String(seqByLevel[1]);
      } else {
        computedIndex = parentIdVal ? `${parentIdVal}.${seqByLevel[level]}` : String(seqByLevel[level]);
      }

      parentIndexByLevel[level] = computedIndex;

      if (rawIdxVal !== computedIndex) {
        if (row[0] && typeof row[0].v === "object" && row[0].v !== null) {
          row[0].v.v = computedIndex;
          row[0].v.m = computedIndex;
        } else if (row[0]) {
          row[0].v = computedIndex;
          row[0].m = computedIndex;
        } else {
          row[0] = { v: computedIndex, m: computedIndex, ff: 1, fs: 11, tb: 1 };
        }
      }

      const cellProperties = [];
      const colNames = [
        "indexNumber",
        "description",
        "description",
        "description",
        "description",
        "description",
        "description",
        "description",
        "description",
        "notes",
        "definisi",
        "input",
        "output",
      ];

      for (let c = 0; c <= 12; c++) {
        const cObj = row[c];
        if (!cObj) continue;
        const cellV = cObj && typeof cObj.v === "object" && cObj.v !== null ? cObj.v : cObj;

        const fc = cellV.fc || cObj.fc;
        const bg = cellV.bg || cObj.bg;
        const bl = (cellV.bl !== undefined ? cellV.bl : cObj.bl) === 1;
        const it = (cellV.it !== undefined ? cellV.it : cObj.it) === 1;
        const cl = (cellV.cl !== undefined ? cellV.cl : cObj.cl) === 1;
        const un = (cellV.un !== undefined ? cellV.un : cObj.un) === 1;
        const fs = cellV.fs || cObj.fs;
        const rawFf = cellV.ff || cObj.ff ? String(cellV.ff || cObj.ff) : null;

        let ffName = null;
        if (rawFf === "0" || rawFf === 0 || rawFf === "Times New Roman") ffName = "Times New Roman";
        else if (rawFf === "1" || rawFf === 1 || rawFf === "Arial") ffName = "Arial";
        else if (rawFf === "2" || rawFf === 2 || rawFf === "Tahoma") ffName = "Tahoma";
        else if (rawFf === "3" || rawFf === 3 || rawFf === "Verdana") ffName = "Verdana";
        else if (rawFf) ffName = rawFf;

        if (fc || bg || bl || it || cl || un || (fs && fs !== 11) || ffName) {
          cellProperties.push({
            columnName: colNames[c],
            fontColor: fc || null,
            bgColor: bg || null,
            isBold: bl,
            isItalic: it,
            isStrike: cl,
            isUnderline: un,
            fontSize: fs ? parseInt(fs) : null,
            fontFamily: ffName || null,
          });
        }
      }

      const isDirty = rowId === 0 || modifiedRowIndexes.size === 0 || modifiedRowIndexes.has(r);
      if (!isDirty) continue;

      items.push({
        id: rowId,
        indexNumber: computedIndex,
        parentId: parentIdVal || "",
        level: level,
        description: desc,
        notes: notes,
        definisi: definisi,
        input: input,
        output: output,
        cellNotes: cellNotes,
        indexSequence: seqByLevel[level],
        cellProperties: cellProperties,
      });
    }

    console.log("[FortuneSheet Save] Collected items to save count:", items.length, items);

    const payload = {
      dataSource: selectedDs,
      items: items,
    };

    if (items.length === 0) {
      const warningPromise = swal({
        title: "Warning",
        icon: "warning",
        buttons: false,
        timer: 2000,
        content: {
          element: "div",
          attributes: {
            innerHTML: `<span style="text-align: center;">Tidak ada baris data Business Process yang diubah.</span>`,
          },
        },
      });
      const fullscreenElement =
        document.fullscreenElement ||
        document.querySelector(
          "#luckysheet-business-process-card.luckysheet-fullscreen-active, #luckysheet-business-process-card.fortune-fullscreen-active"
        );
      if (fullscreenElement) {
        const moveOverlay = () => {
          const overlay = document.querySelector(".swal-overlay, .swal2-container");
          if (!overlay) return false;
          if (!fullscreenElement.contains(overlay)) {
            fullscreenElement.appendChild(overlay);
          }
          overlay.style.setProperty("z-index", "2147483647");
          return true;
        };
        const observer = new MutationObserver(() => {
          if (moveOverlay()) observer.disconnect();
        });
        observer.observe(document.body, { childList: true, subtree: true });
        requestAnimationFrame(moveOverlay);
        setTimeout(() => {
          moveOverlay();
          observer.disconnect();
        }, 1000);
      }

      warningPromise.then(async () => {
        spinBtn.style.display = "none";
      });
      return;
    }

    const confirmSave = async () => {
      const warningPromise = swal({
        title: "Save Changes?",
        text: "Are you sure you want to save the changes to this business process data?",
        icon: "info",
        className: "save-changes-swal",
        buttons: {
          cancel: { text: "Back", visible: true, className: "swal-button--cancel" },
          confirm: { text: "Save Changes", className: "swal-button--confirm" },
        },
      });
      const fullscreenElement =
        document.fullscreenElement ||
        document.querySelector(
          "#luckysheet-business-process-card.luckysheet-fullscreen-active, #luckysheet-business-process-card.fortune-fullscreen-active"
        );
      if (fullscreenElement) {
        const moveOverlay = () => {
          const overlay = document.querySelector(".swal-overlay, .swal2-container");
          if (!overlay) return false;
          if (!fullscreenElement.contains(overlay)) {
            fullscreenElement.appendChild(overlay);
          }
          overlay.style.setProperty("z-index", "2147483647");
          return true;
        };
        const observer = new MutationObserver(() => {
          if (moveOverlay()) observer.disconnect();
        });
        observer.observe(document.body, { childList: true, subtree: true });
        requestAnimationFrame(moveOverlay);
        setTimeout(() => {
          moveOverlay();
          observer.disconnect();
        }, 1000);
      }

      return warningPromise;
    };

    const isConfirmed = await confirmSave();
    if (isConfirmed) {
      if (typeof Swal !== "undefined") {
        Swal.fire({ title: "Menyimpan...", allowOutsideClick: false, didOpen: () => Swal.showLoading() });
      }

      const response = await saveBusinessProcessBatch(payload);

      if (typeof Swal !== "undefined") Swal.close();

      if (response && response.success) {
        modifiedRowIndexes.clear();
        if (typeof Swal !== "undefined") {
          Swal.fire("Berhasil", response.message || "Data Business Process berhasil disimpan!", "success");
        } else if (typeof swal !== "undefined") {
          swal({
            title: "SUCCESS",
            text: "Changes saved successfully.",
            icon: "success",
            buttons: false,
            timer: 2200,
            className: "rasci-success-alert",
          }).then(() => {
            if (spinBtn) spinBtn.style.display = "none";
          });
        }
        initFortuneSheetProsbisGrid(true);
      } else {
        const errMsg = response && response.error ? response.error : "Gagal menyimpan data ke database.";
        if (typeof Swal !== "undefined") {
          Swal.fire("Error", errMsg, "error");
        } else if (typeof swal !== "undefined") {
          swal({ title: "Error", text: errMsg, icon: "error" }).then(() => {
            if (spinBtn) spinBtn.style.display = "none";
          });
        } else {
          alert("Error: " + errMsg);
        }
      }
    } else {
      if (spinBtn) spinBtn.style.display = "none";
    }
  } catch (err) {
    console.error("Save error:", err);
    if (spinBtn) spinBtn.style.display = "none";
    if (typeof Swal !== "undefined") Swal.fire("Error", "Gagal menyimpan data: " + err.message, "error");
    else alert("Gagal menyimpan data: " + err.message);
  }
}

// Global Exports & Aliases
window.initFortuneSheetProsbisGrid = initFortuneSheetProsbisGrid;
window.initLuckysheetProsbisGrid = initFortuneSheetProsbisGrid;
window.saveFortuneSheetProsbisGrid = saveFortuneSheetProsbisGrid;
window.saveLuckysheetProsbisGrid = saveFortuneSheetProsbisGrid;
window.toggleFullscreenProsbis = toggleFullscreenProsbis;
window.fixFortuneSheetLayoutOffsets = fixFortuneSheetLayoutOffsets;
window.fixLuckysheetLayoutOffsets = fixFortuneSheetLayoutOffsets;
window.ensureFortuneSheetResourcesLoaded = ensureFortuneSheetResourcesLoaded;
window.ensureLuckysheetResourcesLoaded = ensureFortuneSheetResourcesLoaded;
window.cleanFortuneSheetText = cleanFortuneSheetText;
window.cleanLuckysheetText = cleanFortuneSheetText;
window.getFortuneSheetCellValue = getFortuneSheetCellValue;
window.getLuckysheetCellValue = getFortuneSheetCellValue;
