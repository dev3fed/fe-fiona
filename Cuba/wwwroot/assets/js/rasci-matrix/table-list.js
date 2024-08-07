document.addEventListener("dataLoaded", function () {
  loadTableHeader(appState.resultJabatan);
  loadTableBody(appState.resultProsbis);
});

document.addEventListener("DOMContentLoaded", function () {
  loadTableHeader(appState.resultJabatan);
  loadTableBody(appState.resultProsbis);
  feather.replace();
});

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

  // Inisialisasi ulang tooltips
  var tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]'),
  );
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
}

function loadTableBody(prosbisList) {
  const expandedRows = appState.idProsbis;
  const bodyContent = prosbisList
    ?.map((val, i) => {
      const levelClass = val.level ? `level-${val.level}` : "";
      const isExpanded = expandedRows.includes(val.indexGroup)
        ? "chevron-up"
        : "chevron-down";
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
                    <li><a class="dropdown-item"><img src="/assets/images/rasci/eye.svg" alt="Filter Icon">Detail</a></li>
                    <li><a class="dropdown-item"><img src="/assets/images/rasci/pencil.svg" alt="Filter Icon">Edit</a></li>
                    <li><a class="dropdown-item"><img src="/assets/images/rasci/trash.svg" alt="Filter Icon">Delete</a></li>
                  </ul>
                </div>
              </div>
           </div>
          </td>
          <td></td>
          <td></td>
          <td></td>
        </tr>`;
    })
    .join("");

  const tableBody = document.getElementById("table-body");
  if (tableBody) {
    tableBody.innerHTML = bodyContent;
    feather.replace(); // Ensure feather icons are replaced after DOM update
  } else {
    console.error("Table body element not found");
  }
}

function onModalProsbis() {
  // Show the modal
  const modal = new bootstrap.Modal(
    document.getElementById("modalBusinessPro"),
  );
  modal.show();
}

function handleCollapse(id) {
  const parentId = id;
  const parentRow = document.getElementById(parentId);
  if (parentRow) {
    if (!appState.idProsbis.includes(parentId)) {
      appState.idProsbis = [...appState.idProsbis, parentId.toString()];
      const result = traverse(appState.allDataProsbis, appState.idProsbis);
      renderDataProsbis(result);
    } else {
      const listSelectedId = appState.idProsbis;
      const index = appState.idProsbis.indexOf(parentId.toString());
      const idFiltered = filterData(listSelectedId, parentId.toString());
      if (idFiltered && index > -1) appState.idProsbis.splice(index, 1);
      const result = traverse(appState.allDataProsbis, idFiltered);
      renderDataProsbis(result);
    }

    feather.replace(); // Update the feather icons
  }
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
