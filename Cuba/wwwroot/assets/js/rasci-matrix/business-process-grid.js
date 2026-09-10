let luckysheetInitialized = false;
let luckysheetLoading = false;
let isFullscreenProsbis = false;
let modifiedRowIndexes = new Set();
let prosbisIdMapByIdx = new Map();
let prosbisOriginalIdxMap = new Map();
let rowOriginalIdMap = new Map();

function getRowDatabaseId(r) {
  if (typeof rowOriginalIdMap !== "undefined" && rowOriginalIdMap.has(r)) {
    return rowOriginalIdMap.get(r) || 0;
  }
  return 0;
}

$(document).ready(function () {
  $("#pills-business-process-tab").on("shown.bs.tab", function () {
    syncDataSourceDropdown();
    ensureLuckysheetResourcesLoaded(function () {
      if (!luckysheetInitialized) {
        initLuckysheetProsbisGrid(true);
      } else if (typeof luckysheet !== "undefined") {
        setTimeout(function () {
          luckysheet.resize();
        }, 150);
      }
    });
  });

  $(document).on("click", "#btn-refresh-prosbis-grid", function (e) {
    e.preventDefault();
    initLuckysheetProsbisGrid(true);
  });

  $(document).on("click", "#btn-save-prosbis-grid", function (e) {
    e.preventDefault();
    saveLuckysheetProsbisGrid();
  });

  $(document).on("change", "#dataSource-prosbis", function () {
    initLuckysheetProsbisGrid(true);
  });

  $(document).on("change", "#dataSource-rasci", function () {
    syncDataSourceDropdown();
  });

  $(document).on("click", "#btn-fullscreen-prosbis-grid", function (e) {
    e.preventDefault();
    toggleFullscreenProsbis();
  });

  $(window).on("resize", function () {
    if (luckysheetInitialized && typeof luckysheet !== "undefined") {
      luckysheet.resize();
      fixLuckysheetLayoutOffsets();
    }
  });

  document.addEventListener("dataLoaded", function () {
    syncDataSourceDropdown();
  });

  $(document).on("click", "#luckysheet-icon-morebtn, .luckysheet-toolbar-more-btn", function () {
    setTimeout(function () {
      const $btn = $("#luckysheet-icon-morebtn");
      const $menu = $("#luckysheet-icon-morebtn-div, #luckysheet-icon-morebtn-menu, .luckysheet-toolbar-more-menu");
      if ($btn.length > 0 && $menu.length > 0) {
        const btnRect = $btn[0].getBoundingClientRect();
        const menuWidth = $menu.outerWidth() || 200;
        let targetLeft = btnRect.right - menuWidth;
        if (targetLeft < 10) targetLeft = 10;

        $menu.css({
          position: "fixed",
          top: btnRect.bottom + 4 + "px",
          left: targetLeft + "px",
          right: "auto",
          bottom: "auto",
          "z-index": "9999995",
          display: "block",
          visibility: "visible",
          opacity: "1",
        });
      }
    }, 30);
  });

  $(document).on(
    "click",
    '#luckysheet-icon-text-color, #luckysheet-icon-bg-color, #luckysheet-icon-cell-color, div[id*="luckysheet-icon-text-color"], div[id*="luckysheet-icon-cell-color"], div[id*="luckysheet-icon-bg-color"], .sp-replacer, .luckysheet-toolbar-combo-button, .luckysheet-toolbar-menu-button-arrow',
    function (e) {
      const $clicked = $(this);
      const $targetBtn = $clicked.closest(
        '.luckysheet-toolbar-button, .luckysheet-toolbar-combo-button, div[id*="luckysheet-icon-"]',
      );
      const targetElement = $targetBtn.length > 0 ? $targetBtn[0] : this;

      setTimeout(function () {
        const $colorMenus = $(
          '#luckysheet-icon-text-color-menu-menuButton, #luckysheet-icon-cell-color-menu-menuButton, .sp-container, .luckysheet-color-menu, #luckysheet-icon-text-color-menu, #luckysheet-icon-bg-color-menu, div[id*="color-menu"], .luckysheet-spectrum-container',
        );
        $colorMenus.each(function () {
          const $menu = $(this);
          if ($menu.length > 0) {
            const btnRect = targetElement.getBoundingClientRect();
            const menuWidth = $menu.outerWidth() || 240;
            let targetLeft = btnRect.left;
            if (targetLeft + menuWidth > window.innerWidth - 10) {
              targetLeft = window.innerWidth - menuWidth - 10;
            }
            if (targetLeft < 10) targetLeft = 10;

            $menu
              .css({
                position: "fixed",
                top: btnRect.bottom + 4 + "px",
                left: targetLeft + "px",
                right: "auto",
                bottom: "auto",
                "z-index": "99999999",
                display: "block",
                visibility: "visible",
                opacity: "1",
              })
              .removeClass("sp-hidden");
          }
        });
      }, 30);
    },
  );

  window.addEventListener(
    "keydown",
    function (e) {
      if (e.keyCode === 116 || (e.ctrlKey && (e.keyCode === 82 || e.key === "r" || e.key === "R"))) {
        window.location.reload();
      }
    },
    true,
  );

  $(document).on(
    "paste",
    "#luckysheet-business-process-container, .luckysheet-cell-input, .luckysheet-input-box",
    function () {
      setTimeout(function () {
        processModifiedRange(null, "Clipboard Paste Event");
      }, 150);
      setTimeout(function () {
        processModifiedRange(null, "Clipboard Paste Event (Delayed)");
      }, 400);
    },
  );
});

function fixLuckysheetLayoutOffsets() {
  const $editor = $("#luckysheet-wa-editor, .luckysheet-wa-editor");
  const $formulaBar = $("#luckysheet-wa-calculate, .luckysheet-wa-calculate, #luckysheet-formula-bar-config");
  const $sheetArea = $("#luckysheet-sheet-area, .luckysheet-sheet-area");
  const $gridWindow = $('#luckysheet-grid-window, .luckysheet-grid-window, div[id*="luckysheet-grid-window"]');
  if ($gridWindow.length > 0) {
    $gridWindow.css({ top: "0px" });
  }

  if ($editor.length > 0) {
    const editorHeight = $editor.outerHeight() || 40;

    if ($formulaBar.length > 0) {
      $formulaBar.css({
        position: "absolute",
        top: editorHeight + "px",
        left: "0px",
        right: "0px",
        width: "100%",
        height: "28px",
        "z-index": "900",
        background: "#ffffff",
        display: "flex",
        "align-items": "center",
      });

      const formulaHeight = $formulaBar.is(":visible") ? $formulaBar.outerHeight() || 28 : 0;
      const totalTop = editorHeight + formulaHeight;

      if ($sheetArea.length > 0) {
        $sheetArea.css({
          position: "absolute",
          top: totalTop + "px",
          left: "0px",
          right: "0px",
          width: "100%",
          height: `calc(100% - ${totalTop}px)`,
        });
      }
    }
  }

  if (typeof luckysheet !== "undefined" && luckysheet.resize) {
    luckysheet.resize();
  }
}

function ensureLuckysheetResourcesLoaded(callback) {
  if (typeof luckysheet !== "undefined") {
    if (callback) callback();
    return;
  }

  if (luckysheetLoading) {
    let checkInt = setInterval(function () {
      if (typeof luckysheet !== "undefined") {
        clearInterval(checkInt);
        if (callback) callback();
      }
    }, 100);
    return;
  }

  luckysheetLoading = true;

  if (!document.getElementById("luckysheet-css-core")) {
    const cssFiles = [
      "https://cdn.jsdelivr.net/npm/luckysheet@latest/dist/plugins/css/pluginsCss.css",
      "https://cdn.jsdelivr.net/npm/luckysheet@latest/dist/plugins/plugins.css",
      "https://cdn.jsdelivr.net/npm/luckysheet@latest/dist/css/luckysheet.css",
      "https://cdn.jsdelivr.net/npm/luckysheet@latest/dist/assets/iconfont/iconfont.css",
    ];

    cssFiles.forEach((href, idx) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      if (idx === 0) link.id = "luckysheet-css-core";
      document.head.appendChild(link);
    });
  }

  const _mainJQuery = window.jQuery;
  const _mainDollar = window.$;

  const script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/npm/luckysheet@latest/dist/plugins/js/plugin.js";
  script.onload = function () {
    const script2 = document.createElement("script");
    script2.src = "https://cdn.jsdelivr.net/npm/luckysheet@latest/dist/luckysheet.umd.js";
    script2.onload = function () {
      if (_mainJQuery && window.jQuery !== _mainJQuery) {
        window.jQuery = _mainJQuery;
        window.$ = _mainDollar;
      }
      luckysheetLoading = false;
      if (callback) callback();
    };
    document.body.appendChild(script2);
  };
  document.body.appendChild(script);
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

function getLuckysheetCellValue(cell) {
  if (cell === null || cell === undefined) return "";
  if (typeof cell === "object") {
    const val = cell.v !== undefined && cell.v !== null ? cell.v : cell.m;
    return val !== undefined && val !== null ? String(val).trim() : "";
  }
  return String(cell).trim();
}

function processModifiedRange(rangeInput, source = "Update") {
  let ranges = [];

  if (typeof rangeInput === "number") {
    ranges = [{ row: [rangeInput, rangeInput] }];
  } else if (Array.isArray(rangeInput)) {
    ranges = rangeInput;
  } else if (rangeInput && typeof rangeInput === "object") {
    ranges = [rangeInput];
  } else if (typeof luckysheet !== "undefined" && luckysheet.getselectrange) {
    const sel = luckysheet.getselectrange();
    if (sel && sel.length > 0) {
      ranges = sel;
    }
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
        if (r > 0) {
          affectedRows.add(r);
        }
      }
    }
  });

  if (affectedRows.size === 0 && typeof luckysheet !== "undefined" && luckysheet.getselectrange) {
    const sel = luckysheet.getselectrange();
    if (sel && sel.length > 0) {
      sel.forEach((rg) => {
        if (rg && Array.isArray(rg.row) && rg.row.length >= 2) {
          const minR = Math.min(rg.row[0], rg.row[1]);
          const maxR = Math.max(rg.row[0], rg.row[1]);
          for (let r = minR; r <= maxR; r++) {
            if (r > 0) affectedRows.add(r);
          }
        }
      });
    }
  }

  if (affectedRows.size > 0) {
    affectedRows.forEach((r) => {
      modifiedRowIndexes.add(r);
      if (typeof luckysheet !== "undefined") {
        try {
          const fileData = luckysheet.getluckysheetfile();
          if (fileData && fileData[0] && fileData[0].data && fileData[0].data[r]) {
            const gRow = fileData[0].data[r];
            const targetId = getRowDatabaseId(r);
            if (gRow[0]) {
              gRow[0]._id = targetId;
              if (typeof gRow[0].v === "object" && gRow[0].v !== null) {
                gRow[0].v._id = targetId;
              }
            }
            gRow._id = targetId;
          }
        } catch (e) {
          console.warn("Failed to sanitize row _id:", e);
        }
      }
    });

    setTimeout(function () {
      affectedRows.forEach((r) => {
        const itemPayload = extractLuckysheetRowPayload(r);
        if (itemPayload) {
          console.log(`[Luckysheet Change Tracker] ${source} at Row ${r}:`, itemPayload);
          console.log("JSON Item Payload:\n" + JSON.stringify(itemPayload, null, 2));
        }
      });
    }, 60);
  }
}

function extractLuckysheetRowPayload(r) {
  if (typeof luckysheet === "undefined") return null;
  const fileData = luckysheet.getluckysheetfile();
  if (!fileData || !fileData[0] || !fileData[0].data) return null;

  const gridData = fileData[0].data;
  const row = gridData[r];
  if (!row) return null;

  const rawIdxVal = getLuckysheetCellValue(row[0]);

  let desc = "";
  let level = 1;
  for (let c = 1; c <= 8; c++) {
    const txt = getLuckysheetCellValue(row[c]);
    if (txt !== "") {
      desc = txt;
      level = c;
      break;
    }
  }

  if (!desc && rawIdxVal) {
    level = rawIdxVal.split(".").length;
  }

  const notes = getLuckysheetCellValue(row[9]);
  const definisi = getLuckysheetCellValue(row[10]);
  const input = getLuckysheetCellValue(row[11]);
  const output = getLuckysheetCellValue(row[12]);

  let cellNotes = "";
  for (let c = 0; c <= 12; c++) {
    if (row[c]) {
      const ps = row[c].ps || (row[c].v && typeof row[c].v === "object" ? row[c].v.ps : null);
      if (ps) {
        if (typeof ps === "string" && ps.trim()) {
          cellNotes = ps.trim();
          break;
        } else if (typeof ps === "object" && ps.value !== undefined && ps.value !== null && String(ps.value).trim()) {
          cellNotes = String(ps.value).trim();
          break;
        }
      }
    }
  }

  let rowId = getRowDatabaseId(r);

  let parentIdVal = "";
  if (level > 1) {
    const parentIndexByLevel = {};
    for (let i = 1; i <= r; i++) {
      const curRow = gridData[i];
      if (!curRow) continue;
      let curLvl = 1;
      for (let c = 1; c <= 8; c++) {
        if (curRow[c] && (curRow[c].v || curRow[c].m)) {
          curLvl = c;
          break;
        }
      }
      const curIdx = curRow[0] ? (curRow[0].v || curRow[0].m || "").toString().trim() : "";
      if (curIdx) {
        parentIndexByLevel[curLvl] = curIdx;
      }
    }
    for (let k = level - 1; k >= 1; k--) {
      if (parentIndexByLevel[k]) {
        parentIdVal = parentIndexByLevel[k];
        break;
      }
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

  return {
    id: rowId,
    indexNumber: rawIdxVal,
    parentId: parentIdVal,
    level: level,
    description: desc,
    notes: notes,
    definisi: definisi,
    input: input,
    output: output,
    cellNotes: cellNotes,
    cellProperties: cellProperties,
  };
}

function toggleFullscreenProsbis() {
  isFullscreenProsbis = !isFullscreenProsbis;
  const $card = $("#luckysheet-business-process-card");
  const $icon = $("#fullscreen-icon");

  if (isFullscreenProsbis) {
    $card.addClass("luckysheet-fullscreen-active");
    $icon.removeClass("fa-expand").addClass("fa-compress");
  } else {
    $card.removeClass("luckysheet-fullscreen-active");
    $icon.removeClass("fa-compress").addClass("fa-expand");
  }

  if (typeof luckysheet !== "undefined") {
    setTimeout(function () {
      luckysheet.resize();
      fixLuckysheetLayoutOffsets();
    }, 150);
    setTimeout(function () {
      luckysheet.resize();
      fixLuckysheetLayoutOffsets();
    }, 350);
  }
}

async function initLuckysheetProsbisGrid(forceReload = false) {
  const $container = $("#luckysheet-business-process-container");
  if ($container.length === 0) return;

  try {
    if (typeof luckysheet === "undefined") {
      console.error("Luckysheet library is not loaded.");
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
      const headerTb = cIdx === 5 ? 1 : 0;
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
        const pbId = pb.id || pb.Id || pb.businessProcessId || pb.BusinessProcessId || 0;
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

        celldata.push({ r: r, c: 0, v: { v: idxStr, m: idxStr, _id: pbId, ff: 1, fs: 11, tb: 0 } });

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

        const textWrapMode = colLevel === 5 ? 2 : 1;
        const cellNotesVal = pb.cellNotes || pb.CellNotes || "";

        const descCellObj = { v: desc, m: desc, fc: colorHex, bl: isBold, tb: textWrapMode, ff: 1, fs: 11 };
        if (cellNotesVal) {
          descCellObj.ps = { value: cellNotesVal, isShow: false };
        }

        celldata.push({ r: r, c: colLevel, v: descCellObj });

        celldata.push({ r: r, c: 9, v: { v: pb.notes || "", m: pb.notes || "", ff: 1, fs: 11, tb: 0 } });
        celldata.push({
          r: r,
          c: 10,
          v: {
            v: pb.definisi || pb.definition || pb.processDefinition || "",
            m: pb.definisi || pb.definition || pb.processDefinition || "",
            ff: 1,
            fs: 11,
            tb: 0,
          },
        });
        celldata.push({ r: r, c: 11, v: { v: pb.input || "", m: pb.input || "", ff: 1, fs: 11, tb: 0 } });
        celldata.push({ r: r, c: 12, v: { v: pb.output || "", m: pb.output || "", ff: 1, fs: 11, tb: 0 } });

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

    const options = {
      container: "luckysheet-business-process-container",
      title: "Business Process Spreadsheet",
      lang: "en",
      showinfobar: false,
      defaultFontFamily: "Arial",
      defaultFontSize: 11,
      showtoolbar: true,
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
      showsheetbar: true,
      showsheetbarConfig: {
        add: false,
        menu: false,
      },
      cellRightClickConfig: {
        matrix: false,
        chart: false,
        image: false,
        link: false,
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
      showformulaBar: true,
      showstatisticBar: true,
      allowUpdate: true,
      defaultRowHeight: 25,
      column: baseHeaders.length,
      row: (prosbisList.length || 15) + 30,
      hook: {
        cellUpdated: function (r, c, oldValue, newValue, isRange) {
          processModifiedRange({ row: [r, r], column: [c, c] }, `Cell Updated at Row ${r}, Col ${c}`);
        },
        rangePasteAfter: function (range, pasteCutData) {
          console.log("[Luckysheet Hook] rangePasteAfter triggered:", range);
          processModifiedRange(range, "Range Paste");
        },
        updated: function (operate) {
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
            console.log(`[Luckysheet Change Tracker] Row Inserted at ${insertIdx}, rowOriginalIdMap updated.`);
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
            console.log(`[Luckysheet Change Tracker] Row Deleted at ${deleteIdx}, rowOriginalIdMap updated.`);
          }
        },
      },
      data: [
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
      ],
    };

    if (forceReload && luckysheetInitialized) {
      luckysheet.destroy();
    }

    setTimeout(function () {
      luckysheet.create(options);
      luckysheetInitialized = true;
      modifiedRowIndexes.clear();

      try {
        const fileData = luckysheet.getluckysheetfile();
        if (fileData && fileData[0] && fileData[0].data && prosbisList && prosbisList.length > 0) {
          const gData = fileData[0].data;
          prosbisList.forEach((pb, idx) => {
            const r = idx + 1;
            if (gData[r]) {
              const idxVal = pb.indexNumber || pb.IndexNumber || "";
              if (!gData[r][0]) gData[r][0] = { v: idxVal, m: idxVal };
              const dbId = pb.id || pb.Id || pb.businessProcessId || pb.BusinessProcessId || 0;
              gData[r][0]._id = dbId;
              gData[r]._id = dbId;
            }
          });
        }
      } catch (e) {
        console.warn("Failed to attach _id to grid rows:", e);
      }

      setTimeout(function () {
        if (typeof luckysheet !== "undefined") {
          luckysheet.resize();
          fixLuckysheetLayoutOffsets();
        }
      }, 150);
      setTimeout(function () {
        fixLuckysheetLayoutOffsets();
      }, 400);

      let fixCount = 0;
      const fixTimer = setInterval(function () {
        fixLuckysheetLayoutOffsets();
        fixCount++;
        if (fixCount > 15) clearInterval(fixTimer);
      }, 200);
    }, 50);
  } catch (err) {
    console.error("Failed to initialize Luckysheet:", err);
  }
}

async function saveLuckysheetProsbisGrid() {
  const spinBtn = document.getElementById("loadingSaveSheet");
  if (spinBtn) spinBtn.style.display = "inline-block";

  if (typeof luckysheet === "undefined") {
    console.error("Luckysheet library is not loaded.");
    if (typeof Swal !== "undefined") Swal.fire("Error", "Luckysheet belum dimuat.", "error");
    else alert("Luckysheet belum dimuat.");
    return;
  }

  try {
    if (luckysheet.exitEditMode) {
      luckysheet.exitEditMode();
    }

    const fileData = luckysheet.getluckysheetfile();
    if (!fileData || !fileData[0] || !fileData[0].data) {
      console.warn("No grid data found in Luckysheet.");
      if (typeof Swal !== "undefined") Swal.fire("Info", "Tidak ada data pada grid.", "info");
      else alert("Tidak ada data pada grid.");
      return;
    }

    const gridData = fileData[0].data;
    const selectedDs =
      $("#dataSource-prosbis").val() || (typeof selectedValue !== "undefined" ? selectedValue : "master");

    const items = [];
    const parentIndexByLevel = {};
    const seqByLevel = {};
    const tempIdMap = new Map(prosbisIdMapByIdx);

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

      // Extract row ID strictly from original row mapping (or 0 for new/copied rows)
      let rowId = getRowDatabaseId(r);

      // Determine parentId based on current tree hierarchy state
      let parentIdVal = null;
      if (level > 1) {
        for (let k = level - 1; k >= 1; k--) {
          if (parentIndexByLevel[k]) {
            parentIdVal = parentIndexByLevel[k];
            break;
          }
        }
      }

      // Increment sequence for this level under active parent
      seqByLevel[level] = (seqByLevel[level] || 0) + 1;

      // Reset sequence counters and parent references for deeper levels
      for (let k = level + 1; k <= 8; k++) {
        seqByLevel[k] = 0;
        delete parentIndexByLevel[k];
      }

      // Calculate computed index number
      let computedIndex = "";
      if (level === 1) {
        computedIndex = String(seqByLevel[1]);
      } else {
        computedIndex = parentIdVal ? `${parentIdVal}.${seqByLevel[level]}` : String(seqByLevel[level]);
      }

      parentIndexByLevel[level] = computedIndex;

      // Dynamically update visual display in Luckysheet Cell 0 in memory if changed
      if (rawIdxVal !== computedIndex) {
        if (row[0] && typeof row[0].v === "object" && row[0].v !== null) {
          row[0].v.v = computedIndex;
          row[0].v.m = computedIndex;
        } else if (row[0]) {
          row[0].v = computedIndex;
          row[0].m = computedIndex;
        } else {
          row[0] = { v: computedIndex, m: computedIndex, ff: 1, fs: 11, tb: 0 };
        }
      }

      // Extract cell properties for formatting
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

      // Only collect items that are newly inserted (rowId === 0) or explicitly edited by user in Luckysheet
      const isDirty = rowId === 0 || modifiedRowIndexes.has(r);
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

    const payload = {
      dataSource: selectedDs,
      items: items,
    };

    console.log("=== PAYLOAD SAVE BATCH (POST /api/BusinessProcess/save-batch) ===");
    console.log(JSON.stringify(payload, null, 2));

    if (items.length === 0) {
      const warningPromise = swal({
        title: "Warning",
        icon: "warning",
        buttons: false,
        timer: 2000,
        content: {
          element: "div",
          attributes: {
            innerHTML: `<span style="text-align: center;">Tidak ada baris data Business Process yang diubah.</span>
       
          `,
          },
        },
      });
      const fullscreenElement =
        document.fullscreenElement ||
        document.querySelector("#luckysheet-business-process-card.luckysheet-fullscreen-active");
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

    const dsLabel = selectedDs === "master" ? "Master Data Prosbis" : "Draft Prosbis";

    const confirmSave = async () => {
      const warningPromise = swal({
        title: "Save Changes?",
        text: "Are you sure you want to save the changes to this business process data?",
        icon: "info",
        className: "save-changes-swal",
        buttons: {
          cancel: {
            text: "Back",
            visible: true,
            className: "swal-button--cancel",
          },
          confirm: {
            text: "Save Changes",
            className: "swal-button--confirm",
          },
        },
      });
      const fullscreenElement =
        document.fullscreenElement ||
        document.querySelector("#luckysheet-business-process-card.luckysheet-fullscreen-active");
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

      console.log("Save response from backend:", response);

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
        initLuckysheetProsbisGrid(true);
      } else {
        const errMsg = response && response.error ? response.error : "Gagal menyimpan data ke database.";
        if (typeof Swal !== "undefined") {
          Swal.fire("Error", errMsg, "error");
        } else if (typeof swal !== "undefined") {
          swal({
            title: "Error",
            text: errMsg,
            icon: "error",
          }).then(() => {
            if (spinBtn) spinBtn.style.display = "none";
          });
        } else {
          alert("Error: " + errMsg);
        }
      }
    }
  } catch (err) {
    console.error("Save error:", err);
    if (typeof Swal !== "undefined") Swal.fire("Error", "Gagal menyimpan data: " + err.message, "error");
    else alert("Gagal menyimpan data: " + err.message);
  }
}

window.initLuckysheetProsbisGrid = initLuckysheetProsbisGrid;
window.saveLuckysheetProsbisGrid = saveLuckysheetProsbisGrid;
window.toggleFullscreenProsbis = toggleFullscreenProsbis;
window.fixLuckysheetLayoutOffsets = fixLuckysheetLayoutOffsets;
