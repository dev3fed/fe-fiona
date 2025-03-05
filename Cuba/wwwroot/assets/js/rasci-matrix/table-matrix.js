function resetTable() {
  const tableHeader = document.getElementById("table-header");
  const tableBody = document.getElementById("table-body");

  // Hapus semua elemen dalam thead dan tbody
  while (tableHeader.firstChild) {
    tableHeader.removeChild(tableHeader.firstChild);
  }
  while (tableBody.firstChild) {
    tableBody.removeChild(tableBody.firstChild);
  }

  // Optional: Reset ukuran kolom agar tabel tidak berubah drastis
  const table = document.querySelector(".custom-border-table");
  table.style.tableLayout = "auto";

  console.log("Table header, body, and columns reset!");
}

function debounce(func, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
}

const tableContainer = document.querySelector(".scrollable-table");

tableContainer.addEventListener(
  "scroll",
  debounce(async function () {
    const bottomReached = tableContainer.scrollTop + tableContainer.clientHeight >= tableContainer.scrollHeight - 10;
    const rightReached = tableContainer.scrollLeft + tableContainer.clientWidth >= tableContainer.scrollWidth - 10;

    if (bottomReached) {
      console.log("scroll bottom");

      // const itemsPerPageY = getState("itemsPerPageY");
      let currentPageY = getState("currentPageY");
      let currentPageX = getState("currentPageX");
      // const storageProsbis = getState("storageProsbis");
      const resultProsbis = await fetchProsbisSumulation(currentPageY + 1, currentPageX);
      console.log("first", resultProsbis.data);
      loadTableBody(resultProsbis.data);
      setState("currentPageY", currentPageY + 1);
      // const startIndex = currentPageY * itemsPerPageY;
      // const endIndex = startIndex + itemsPerPageY;
      // console.log("currentPageY", currentPageY + 1);

      if (startIndex < storageProsbis.length) {
        // loadTableHeader(appState.resultJabatan);
        // renderRow(startIndex, endIndex);
        // setState("currentPageY", currentPageY + 1);
      }
    }

    if (rightReached) {
      console.log("scroll right");

      // const itemsPerPageX = getState("itemsPerPageX");
      // let currentPageX = getState("currentPageX");

      // const startIndex = currentPageX * itemsPerPageX;
      // const endIndex = startIndex + itemsPerPageX;

      // setState("currentPageX", currentPageX + 1);
      // renderColumn(startIndex, endIndex);
    }
  }, 300), // 300ms debounce delay
);

function renderRow(startIndex, endIndex) {
  console.log("Load data from", startIndex, "to", endIndex);

  const storageProsbis = getState("storageProsbis");
  const resultProsbis = getState("resultProsbis");
  const rasciMapping = getState("resultRasciMapping") || [];
  const jobTitleList = getState("resultJabatan");

  const updateProsbis = storageProsbis.slice(startIndex, endIndex);
  console.log("updateProsbis", updateProsbis);
  if (updateProsbis.length === 0) return; // Tidak ada data baru untuk dimuat

  const tableBody = document.getElementById("table-body");
  if (!tableBody) return;

  const fragment = document.createDocumentFragment();

  updateProsbis.forEach((val) => {
    const levelClass =
      val.level && getState("idSearchProsbis") == val.indexGroup
        ? `level-${val.level} highlight`
        : val.level
        ? `level-${val.level}`
        : "";

    const isExpanded = getState("idProsbis").includes(val.indexGroup) ? "chevron-up" : "chevron-down";

    const row = document.createElement("tr");
    row.id = `row-${val.indexGroup}`;
    row.classList.add("clusterize-cluster", levelClass);

    row.innerHTML = `
      <td scope="row" class="level-col" style="font-size:12px;font-weight: 500;">
        L${val.level}
      </td>
      <td class="index-col" style="text-align:left;font-size:12px;font-weight: 500;">
        <span style="padding-left:5px;">${val.indexGroup}</span>
      </td>
      <td class="headcol" style="font-size:12px;font-weight: 500;">
        <div class="prosbis-cell-wrapper">
          <div class="hierarchy-icon-wrapper">
            ${
              !getState("isSearchMatrix") && val.hasChild
                ? `<i data-feather="${isExpanded}" class="hierarchy-icon" id="icon-${val.indexGroup}"
                style="width:24px;" onclick="handleCollapse('${val.indexGroup}')"></i>`
                : ``
            }
          </div>
          <div class="flex-fill prosbis-name" onclick="onModalProsbis(${JSON.stringify(val).replace(
            /"/g,
            "&quot;",
          )})">${val.description}</div>
          <div class="ellipsis-menu prosbis-row-ellipsis">
            <div class="dropright">
              <button type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false"
              style="border: none; background: transparent; cursor: pointer;">
              <i class="fas fa-ellipsis-v"></i>
              </button>
              <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <li onclick="onModalProsbis(${JSON.stringify(val).replace(
                  /"/g,
                  "&quot;",
                )})"><a class="dropdown-item"><img src="/assets/images/rasci/eye.svg" alt="Filter Icon">Detail</a></li>
                <li onclick="sendDetailbp(${JSON.stringify(val).replace(
                  /"/g,
                  "&quot;",
                )})"><a class="dropdown-item"><img src="/assets/images/rasci/pencil.svg" alt="Filter Icon">Edit</a></li>
                <li onclick="checkChildrenProsbis(${JSON.stringify(val).replace(
                  /"/g,
                  "&quot;",
                )})" ><a class="dropdown-item" style="color: red;">
                  <img src="/assets/images/rasci/small_redtrush.svg" alt="Filter Icon">Delete</a></li>
              </ul>
            </div>
          </div>
        </div>
      </td>
    
    `;
    fragment.appendChild(row);
  });
  // setState("currentPageY", startIndex + 1);

  tableBody.appendChild(fragment);

  feather.replace();
  initializeTooltips();
}

function renderColumn(page, limit) {
  console.log("first", page);
  console.log("first", limit);
  const storageJabatan = getState("storageJabatan");
  const resultJabatan = getState("resultJabatan");
  const updatejob = storageJabatan.slice(page, limit);
  setState("resultJabatan", [...resultJabatan, ...updatejob]);
}
