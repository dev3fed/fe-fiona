document.addEventListener("dataLoaded", function () {
  if (appState.resultJabatan.length > 0 && appState.resultProsbis.length > 0) {
    console.log("appState.resultProsbis", appState.resultProsbis);
    setTimeout(() => {
      hideLoading();
      loadTableHeader(appState.resultJabatan);
      loadTableBody(appState.resultProsbis);
    }, 1000);
  }
});

document.addEventListener("DOMContentLoaded", function () {
  showLoading();
  loadTableHeader(appState.resultJabatan);
  loadTableBody(appState.resultProsbis);
  feather.replace();
});

function showLoading() {
  const loadingContainer = document.querySelector(".loading-container");
  const tableWrapper = document.querySelector(".scrollable-table");
  const animation = lottie.loadAnimation({
    container: document.getElementById("icon-container"),
    path: "../assets/json/loading-rasci-matrix.json",
    renderer: "svg",
    loop: true,
    autoplay: true,
    name: "Demo Animation",
  });
  if (loadingContainer && tableWrapper) {
    loadingContainer.style.display = "flex";
    tableWrapper.style.display = "none";
  }
}

function hideLoading() {
  const loadingContainer = document.querySelector(".loading-container");
  const tableWrapper = document.querySelector(".scrollable-table");

  if (loadingContainer && tableWrapper) {
    loadingContainer.style.display = "none";
    tableWrapper.style.display = "block";
  } else {
    console.error("Loading container or table wrapper not found in the DOM.");
  }
}
function loadTableHeader() {
  const jobTitleList = appState.resultJabatan;
  const headerContent = `
          <tr style="height:30px">
              <th scope="col" class="level-col head-cell">Level</th>
              <th scope="col" class="index-col head-cell">Index</th>
              <th scope="col" class="headcol head-cell"><span style="padding-left:10px;">Proses Bisnis</span></th>
              ${jobTitleList
                ?.map(
                  (val, i) => `
              <th scope="col" class="jabatan-cell jabatan-level-${val.level}"
                  style="width: 170px">
                  <div class='jabatan-cell-outer-wrapper'>
                    <div class='jabatan-cell-wrapper' data-bs-toggle="tooltip" data-bs-placement="bottom" title="${val.name}">
                      ${val.name} 
                    </div>
                  </div>
                  <div>
                   <button class="dropdown-btn" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false"
                      style="cursor: pointer;">
                      <i class="fas fa-ellipsis-v" style="font-size: 14px;"></i>
                  </button>
                   <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
                      <li><a class="dropdown-item"><img src="/assets/images/rasci/eye.svg" alt="Filter Icon">Detail</a></li>
                      <li><a class="dropdown-item"><img src="/assets/images/rasci/clipboard.svg" alt="Filter Icon">Job Description</a></li>
                      <li><a class="dropdown-item"><img src="/assets/images/rasci/document.svg" alt="Filter Icon">Competency</a></li>
                      <li><a class="dropdown-item"><img src="/assets/images/rasci/chart.svg" alt="Filter Icon">Lead Indicator</a></li>
                  </ul>
                  </div>
              </th>
          `,
                )
                .join("")}
          </tr>
          `;
  document.getElementById("table-header").innerHTML = headerContent;
  initializeTooltips();
}

function loadTableBody(prosbisList) {
  const expandedRows = appState.idProsbis;
  const jobTitleList = appState.resultJabatan;
  const visibleProsbis = prosbisList;
  console.log("visibleProsbis", visibleProsbis);
  const bodyContent = visibleProsbis
    ?.map((val, i) => {
      const levelClass = val.level ? `level-${val.level}` : "";
      const isExpanded = expandedRows.includes(val.indexGroup)
        ? "chevron-up"
        : "chevron-down";
      const rasciCells = mapRasciCells(val.id, jobTitleList);
      return `
        <tr class="clusterize-cluster ${levelClass}" id="${val.indexGroup}">
          <td scope="row" class="level-col" style="font-size:10px;font-weight: 500 !important;">
            L${val.level}
          </td>
          <td class="index-col" style="text-align:left;font-size:10px;font-weight: 500 !important;"><span style="padding-left:5px;">${
            val.indexGroup
          }</span></td>
          <td class="headcol" style="font-size:10px;font-weight: 500 !important;">
           <div class="prosbis-cell-wrapper">
              <div class="hierarchy-icon-wrapper">
                ${
                  val.hasChild
                    ? `<i data-feather="${isExpanded}" class="hierarchy-icon"
                    style="width:24px;" onclick="handleCollapse('${val.indexGroup}')"></i>`
                    : ``
                }
              </div>
              <div class="flex-fill prosbis-name" onclick="onModalProsbis()">${
                val.description
              }</div>
              <div class="ellipsis-menu prosbis-row-ellipsis">
                <div class="dropright">
                  <button type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false"
                  style="border: none; background: transparent; cursor: pointer;">
                  <i class="fas fa-ellipsis-v"></i>
                  </button>
                  <ul class="dropdown-menu " aria-labelledby="dropdownMenuButton">
                    <li onclick="onModalProsbis()"><a class="dropdown-item"><img src="/assets/images/rasci/eye.svg" alt="Filter Icon">Detail</a></li>
                    <li><a class="dropdown-item"><img src="/assets/images/rasci/pencil.svg" alt="Filter Icon">Edit</a></li>
                    <li><a class="dropdown-item"><img src="/assets/images/rasci/trash.svg" alt="Filter Icon">Delete</a></li>
                  </ul>
                </div>
              </div>
           </div>
          </td>
          ${rasciCells}
        </tr>`;
    })
    .join("");

  const tableBody = document.getElementById("table-body");
  if (tableBody) {
    tableBody.innerHTML = bodyContent;
    feather.replace();
    initializeTooltips();
  } else {
    console.error("Table body element not found");
  }
}

// Map RASCI Cells (Memoized)
const mapRasciCellsCache = new Map();
function mapRasciCells(businessProcessId, jobTitleList) {
  const cacheKey = `${businessProcessId}-${jobTitleList.length}`;
  if (mapRasciCellsCache.has(cacheKey)) {
    return mapRasciCellsCache.get(cacheKey);
  }

  const rasciMapping = appState.resultRasciMapping;
  const rasciCells = jobTitleList
    .map((jobTitle) => {
      const rasciItems = rasciMapping.filter(
        (rm) =>
          rm.businessProcessId === businessProcessId &&
          rm.jobTitleId === jobTitle.id,
      );
      let rasciIcons = "",
        comments = [];

      rasciItems.forEach((item) => {
        switch (item.rasciCode) {
          case "R":
            rasciIcons += `<img src="/assets/images/rasci/r.svg" alt="R Icon" style="padding-right:2px">`;
            break;
          case "A":
            rasciIcons += `<img src="/assets/images/rasci/a.svg" alt="A Icon" style="padding-right:2px">`;
            break;
          case "S":
            rasciIcons += `<img src="/assets/images/rasci/s.svg" alt="S Icon" style="padding-right:2px">`;
            break;
          case "C":
            rasciIcons += `<img src="/assets/images/rasci/c.svg" alt="C Icon" style="padding-right:2px">`;
            break;
          case "I":
            rasciIcons += `<img src="/assets/images/rasci/i.svg" alt="I Icon" style="padding-right:2px">`;
            break;
        }
        if (item.comment) {
          comments.push(`<li>${item.rasciCode}: ${item.comment}</li>`);
        }
      });
      if (comments.length > 0) {
        const commentTooltip = `<ul>${comments.join("")}</ul>`;
        rasciIcons += `<img src="/assets/images/rasci/comment.svg" alt="Comment Icon" style="padding-right:2px" data-bs-toggle="tooltip"  data-bs-placement="right" data-bs-html="true" title="${commentTooltip}">`;
      }
      return `<td>
        <div class="rasci-container">
          <div class="rasci-icons">
            ${rasciIcons}
          </div>
          <img src="/assets/images/rasci/pencil_rasci.svg" alt="Pencil Icon" class="pencil-icon">
        </div>
        </td>`;
    })
    .join("");

  mapRasciCellsCache.set(cacheKey, rasciCells);
  return rasciCells;
}

// Initialize tooltips after rendering
function initializeTooltips() {
  const tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]'),
  );
  tooltipTriggerList.map(
    (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl),
  );
}
function onModalProsbis() {
  detailsProsbis();
}

async function handleCollapse(id) {
  const parentId = id;
  const parentRow = document.getElementById(parentId);
  if (parentRow) {
    if (!appState.idProsbis.includes(parentId)) {
      appState.idProsbis = [...appState.idProsbis, parentId.toString()];
      appState.resetIdProsbis = appState.idProsbis;
      const payload = { parentId: appState.idProsbis.join(",") };
      const resultMatrix = await fetchDataMatrix(payload);
      console.log("insert appState.idProsbis", appState.idProsbis);
      console.log("inser appState.resetIdProsbis", appState.resetIdProsbis);
      // const result = traverse(appState.allDataProsbis, appState.idProsbis);
      resultAllData(resultMatrix?.data);
    } else {
      const listSelectedId = appState.resetIdProsbis;
      const index = appState.idProsbis.indexOf(parentId.toString());
      // const idFiltered = filterData(listSelectedId, parentId.toString());
      console.log("listSelectedId", listSelectedId);
      // resetIdProsbis
      const hideId = filterArray(parentRow.id, listSelectedId);
      console.log("hideId", hideId);
      appState.resetIdProsbis = hideId;
      console.log("appState.resetIdProsbis", appState.resetIdProsbis);
      if (index > -1) appState.idProsbis.splice(index, 1);
      console.log("reset appState.idProsbis", appState.idProsbis);
      const payload = { parentId: appState.resetIdProsbis.join(",") };
      console.log("payload", payload);
      const resultMatrix = await fetchDataMatrix(payload);
      // const result = traverse(appState.allDataProsbis, idFiltered);
      resultAllData(resultMatrix?.data);
    }

    feather.replace();
  }
}
function filterArray(input, array) {
  // Helper function to determine if a value is a descendant of another
  function isDescendant(parent, child) {
    return child.startsWith(parent + ".") || child === parent;
  }

  // Filter the array to exclude descendants of the input value
  const result = array.filter((value) => {
    // Include value if it is not a descendant of the input
    return !isDescendant(input, value) && value !== input;
  });

  // Sort the result array
  return result.sort((a, b) => {
    const aParts = a.split(".").map(Number);
    const bParts = b.split(".").map(Number);

    for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
      const aPart = aParts[i] || 0;
      const bPart = bParts[i] || 0;
      if (aPart !== bPart) {
        return aPart - bPart;
      }
    }
    return 0;
  });
}
function filterData(data, selectedId) {
  // Memisahkan selectedId menjadi array parts
  const selectedParts = selectedId.split(".");
  const selectedDepth = selectedParts.length;
  return data.filter((item) => {
    const itemParts = item.split(".");
    // Menyaring elemen yang berada di luar cabang yang dipilih
    for (let i = 0; i < selectedDepth; i++) {
      // Jika item memiliki kedalaman yang sama atau lebih dalam, dan tidak sama dengan selectedId, sertakan item
      if (itemParts[i] !== selectedParts[i]) {
        return true;
      }
    }
    // Jika elemen berada dalam cabang yang dipilih, jangan sertakan
    return false;
  });
}

function traverse(data, filters) {
  let result = [];
  let addedItems = new Set();
  function helper(parentId) {
    data.forEach((item) => {
      if (item.parentId === parentId && !addedItems.has(item.indexGroup)) {
        result.push(item);
        addedItems.add(item.indexGroup);
        if (filters.includes(item.indexGroup)) {
          helper(item.indexGroup);
        }
      }
    });
  }
  filters.forEach((filter) => {
    data.forEach((item) => {
      if (
        item.indexGroup === filter &&
        item.parentId === null &&
        !addedItems.has(item.indexGroup)
      ) {
        result.push(item);
        addedItems.add(item.indexGroup);
        helper(item.indexGroup);
      }
    });
  });
  // Menambahkan semua elemen level 1 (parentId === null) tanpa duplikasi
  data.forEach((item) => {
    if (item.parentId === null && !addedItems.has(item.indexGroup)) {
      result.push(item);
      addedItems.add(item.indexGroup);
    }
  });
  // Mengurutkan berdasarkan indexGroup
  result.sort((a, b) => {
    const indexGroupA = a.indexGroup.split(".").map(Number);
    const indexGroupB = b.indexGroup.split(".").map(Number);
    for (let i = 0; i < Math.max(indexGroupA.length, indexGroupB.length); i++) {
      const numA = indexGroupA[i] || 0;
      const numB = indexGroupB[i] || 0;
      if (numA !== numB) {
        return numA - numB;
      }
    }
    return 0;
  });

  return result;
}

async function clearInput() {
  appState.idProsbis = [];
  // resultAllData(appState.resultProsbis);
  const resultMatrix = await fetchDataMatrix();
  // const result = traverse(appState.allDataProsbis, appState.idProsbis);
  resultAllData(resultMatrix?.data);
  document.getElementById("inputText").value = "";
}
