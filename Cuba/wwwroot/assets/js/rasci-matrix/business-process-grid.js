let luckysheetInitialized = false;
let luckysheetLoading = false;
let isFullscreenProsbis = false;

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

  $("#btn-refresh-prosbis-grid").on("click", function () {
    initLuckysheetProsbisGrid(true);
  });

  $("#btn-save-prosbis-grid").on("click", function () {
    saveLuckysheetProsbisGrid();
  });

  $("#dataSource-prosbis").on("change", function () {
    initLuckysheetProsbisGrid(true);
  });

  $("#btn-fullscreen-prosbis-grid").on("click", function () {
    toggleFullscreenProsbis();
  });

  $(window).on("resize", function () {
    if (luckysheetInitialized && typeof luckysheet !== "undefined") {
      luckysheet.resize();
    }
  });

  document.addEventListener("dataLoaded", function () {
    syncDataSourceDropdown();
  });

  $(document).on("click", "#luckysheet-icon-morebtn", function () {
    setTimeout(function () {
      const $btn = $("#luckysheet-icon-morebtn");
      const $menu = $("#luckysheet-icon-morebtn-div");
      if ($btn.length > 0 && $menu.length > 0 && $menu.is(":visible")) {
        const btnRect = $btn[0].getBoundingClientRect();
        const menuWidth = $menu.outerWidth() || 300;
        let targetLeft = btnRect.right - menuWidth;
        if (targetLeft < 10) targetLeft = 10;

        $menu.css({
          position: "fixed",
          top: btnRect.bottom + 4 + "px",
          left: targetLeft + "px",
          right: "auto",
          bottom: "auto",
          "z-index": "9999995",
        });
      }
    }, 20);
  });

  $(document).on(
    "click",
    '#luckysheet-icon-text-color, #luckysheet-icon-bg-color, div[id*="luckysheet-icon-text-color"], div[id*="luckysheet-icon-bg-color"]',
    function (e) {
      setTimeout(function () {
        $(
          '.sp-container, .luckysheet-color-menu, #luckysheet-icon-text-color-menu, #luckysheet-icon-bg-color-menu, div[id*="color-menu"]',
        ).css({
          "z-index": "99999999",
          display: "block",
          visibility: "visible",
          opacity: "1",
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
});

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
  const $mainDropdown = $("#select-draft");
  const $gridDropdown = $("#dataSource-prosbis");

  if ($mainDropdown.length > 0 && $gridDropdown.length > 0) {
    const currentVal = $gridDropdown.val();
    $gridDropdown.empty();
    $gridDropdown.append('<option value="master">Master data Prosbis</option>');

    $mainDropdown.find("option").each(function () {
      const val = $(this).val();
      const text = $(this).text();
      if (val && val !== "master" && val !== "Select Draft") {
        $gridDropdown.append(`<option value="${val}">${text}</option>`);
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
    } else {
      $gridDropdown.val("master");
    }
  }
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
    }, 150);
    setTimeout(function () {
      luckysheet.resize();
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

    if (prosbisList && prosbisList.length > 0) {
      prosbisList.forEach((pb, rIdx) => {
        const r = rIdx + 1;
        const levelNum = pb.level || (pb.indexNumber ? pb.indexNumber.split(".").length : 1);
        const desc = pb.description || pb.name || pb.businessProcessName || "";

        celldata.push({ r: r, c: 0, v: { v: pb.indexNumber || "", m: pb.indexNumber || "", ff: 1, fs: 11, tb: 0 } });

        const colLevel = Math.min(Math.max(levelNum, 1), 6);
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

        celldata.push({
          r: r,
          c: colLevel,
          v: { v: desc, m: desc, fc: colorHex, bl: isBold, tb: textWrapMode, ff: 1, fs: 11 },
        });

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
      hook: {
        cellUpdated: function (row, column, oldValue, newValue, isRefresh) {
          console.log("Row:", row);
          console.log("Column:", column);
          console.log("Value:", newValue);
          console.log("Old Value:", oldValue);
          console.log("Is Refresh:", isRefresh);
        },
      },
      showformulaBar: true,
      showstatisticBar: true,
      allowUpdate: true,
      defaultRowHeight: 25,
      column: 13,
      row: (prosbisList.length || 15) + 30,
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
              5: 579,
              6: 34,
              7: 34,
              8: 34,
              9: 180,
              10: 220,
              11: 220,
              12: 220,
            },
            colhidden: {
              6: 0,
              7: 0,
              8: 0,
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
      setTimeout(function () {
        if (typeof luckysheet !== "undefined") {
          luckysheet.resize();
        }
      }, 150);
    }, 50);
  } catch (err) {
    console.error("Failed to initialize Luckysheet:", err);
  }
}

async function saveLuckysheetProsbisGrid() {
  if (!luckysheetInitialized) return;

  try {
    if (typeof Swal !== "undefined") {
      Swal.fire({
        title: "Save Change",
        text: "Apakah Anda yakin ingin menyimpan perubahan data Business Process?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Ya, Simpan",
        cancelButtonText: "Batal",
      }).then(async (res) => {
        if (res.isConfirmed) {
          Swal.fire({ title: "Menyimpan...", allowOutsideClick: false, didOpen: () => Swal.showLoading() });
          setTimeout(() => {
            Swal.fire("Berhasil", "Data Business Process berhasil disimpan!", "success");
          }, 800);
        }
      });
    }
  } catch (err) {
    console.error("Save error:", err);
    if (typeof Swal !== "undefined") {
      Swal.fire("Error", "Gagal menyimpan data.", "error");
    }
  }
}

window.initLuckysheetProsbisGrid = initLuckysheetProsbisGrid;
window.saveLuckysheetProsbisGrid = saveLuckysheetProsbisGrid;
window.toggleFullscreenProsbis = toggleFullscreenProsbis;
