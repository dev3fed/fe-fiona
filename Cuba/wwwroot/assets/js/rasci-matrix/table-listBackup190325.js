document.addEventListener("dataLoaded", async function () {
  try {
    if (appState.resultProsbis.length > 0) {
      const payloadPosition = getState("payloadPosition");
      const prosbisNumber = appState.resultProsbis.map((val) => val.indexNumber);
      if (prosbisNumber.length > 0) {
        const resultPosition = await fetchPositionMatrix({ ...payloadPosition, indexNumber: prosbisNumber });
        console.log("resultPosition", resultPosition);
        setState("payloadPosition", { ...payloadPosition, indexNumber: prosbisNumber });
      }
      setTimeout(() => {
        hideLoading();
        // loadTableHeader(appState.resultJabatan);
        // loadTableBody(appState.resultProsbis);
      }, 100);
    }
    //  else {
    //   showDataEmpty();
    // }
    hideLoading();
  } catch (error) {}
});

document.addEventListener("DOMContentLoaded", async function () {
  let selectElement = document.querySelector("#dataSource-rasci");

  if (selectElement.value === "master" || selectElement.value === "") {
    document.getElementById("pills-warningtab").style.display = "none";
    document.getElementById("btnAddBp").style.display = "none";
    document.getElementById("btnAddNotation").style.display = "none";
    document.getElementById("btnFormdraft").style.display = "flex";
  }
  // setTimeout(() => {
  //   const tableContainer = document.querySelector(".scrollable-table");
  //   if (tableContainer) {
  //     tableContainer.scrollTop = 100;
  //   }
  // }, 0);
  showLoading();
  // loadTableHeader(appState.resultJabatan);
  const loader = document.getElementById("loader");
  loader.style.display = "none";
  loadTableBody(appState.resultProsbis);
  fetchDatasource();
  feather.replace();
});

function fetchDatasource(draftId = null) {
  $.ajax({
    url: `${url_api}/api/Utilities/selection`,
    dataType: "json",
    data: {
      type: "draft-rasci",
      page: 1,
      search: "",
    },
    success: function (response) {
      if (response && response.data && response.data.result) {
        let $select = $("#dataSource-rasci");
        $select.find("option:not(:first)").remove();
        response.data.result.forEach((item) => {
          let isSelected = draftId && item.id == draftId;
          $select.append(new Option(item.text, item.id, isSelected, isSelected));
        });
        if (draftId) {
          let newOption = new Option(`Draft ${draftId}`, draftId, true, true);
          $select.append(newOption);
        }
        $select.select2({
          placeholder: "Choose",
          allowClear: true,
        });
        if (draftId) {
          $select.val(draftId).trigger("change");
        }
      }
    },
  });
}

async function changeDataSource(dataSource) {
  try {
    const payloadProsbis = getState("payloadProsbis");
    const payloadPosition = getState("payloadPosition");
    if (dataSource !== "master" || dataSource === "") {
      document.getElementById("pills-warningtab").style.display = "flex";
      document.getElementById("btnAddBp").style.display = "flex";
      document.getElementById("btnAddNotation").style.display = "flex";
      document.getElementById("btnFormdraft").style.display = "none";
    } else {
      document.getElementById("pills-warningtab").style.display = "none";
      document.getElementById("btnAddBp").style.display = "none";
      document.getElementById("btnAddNotation").style.display = "none";
      document.getElementById("btnFormdraft").style.display = "flex";
    }
    const payload = {
      ...payloadProsbis,
      draftRasciId: dataSource === "master" ? null : dataSource,
      row: 1,
      rowSize: 15,
    };
    const resultProsbis = await fetchProsbisMatrix(payload);
    const storageDataPosition = getState("storageDataPosition");
    const prosbisNumber = resultProsbis.data.map((val) => val.indexNumber);
    if (prosbisNumber.length > 0 && resultProsbis.success === true) {
      const payloadJob = {
        ...payloadPosition,
        draftRasciId: dataSource === "master" ? null : dataSource,
        indexNumber: prosbisNumber,
      };
      setState("payloadPosition", payloadJob);
      const resultPosition = await fetchPositionMatrix(payloadJob);
      const combinePosition = [...storageDataPosition, ...resultPosition.data];
      setState("storageDataPosition", combinePosition);
      setTimeout(() => {
        $("#table-body").empty();
        loadTableHeader(resultPosition.data);
        loadTableBody(resultProsbis.data);
        mapRasciCells(prosbisNumber, combinePosition);
      }, 100);
    }
  } catch (error) {}
}
// Event listener untuk infinite scroll

const showDataEmpty = () => {
  const textInfo = document.getElementById("text-info");
  const loadingIcon = document.getElementById("icon-container");
  textInfo.textContent = "Oops! There's nothing here yet.";
  loadingIcon.style.display = "none";
};
function showLoading() {
  const loadingContainer = document.querySelector(".loading-container");
  const textInfo = document.getElementById("text-info");
  textInfo.textContent = "Please wait, loading data";
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
function renderStaticHeader() {
  return `
    <tr style="height:30px">
      <th scope="col" class="level-col head-cell">Level</th>
      <th scope="col" class="index-col head-cell">Index</th>
      <th scope="col" class="headcol head-cell"><span style="padding-left:10px;">Proses Bisnis</span></th>
    </tr>
  `;
}
function appendDynamicHeader(jobTitleList) {
  const headerRow = document.querySelector("#table-header tr");
  console.log("headerRow", headerRow);
  if (!headerRow) {
    console.error("Element #table-header tr tidak ditemukan!");
    return;
  }

  // console.log("jobTitleList", jobTitleList);

  jobTitleList?.forEach((val) => {
    // Escape karakter yang tidak valid dalam selector
    // console.log("val", val);
    const uniqueClass = `jabatan-level-${val.level}`;

    // console.log("Mengecek keberadaan:", uniqueClass);
    // if (headerRow.querySelector(`.${uniqueClass}`)) {
    //   console.log("Kolom sudah ada, tidak ditambahkan lagi.");
    //   return;
    // }

    const jobTh = document.createElement("th");
    jobTh.scope = "col";
    jobTh.className = `jabatan-cell ${uniqueClass}`;
    jobTh.style.width = "170px";

    // Simpan semua data di dalam `data-* attributes`
    jobTh.dataset.level = val.level;
    jobTh.dataset.positionName = val.positionName;
    jobTh.dataset.positionNameNk = val.positionNameNk;
    jobTh.dataset.prlOrg = val.prlOrg;
    jobTh.dataset.responsibility = val.responsibility;
    jobTh.dataset.sequence = val.sequence;
    jobTh.dataset.unitCode = val.unitCode;

    jobTh.innerHTML = `
      <div class='jabatan-cell-outer-wrapper'>
        <div class='jabatan-cell-wrapper' data-bs-toggle="tooltip" data-bs-placement="bottom" title="${val.positionName}">
          ${val.positionName} 
        </div>
      </div>
      <div>
        <button class="dropdown-btn" type="button" data-bs-toggle="dropdown" aria-expanded="false" style="cursor: pointer;">
          <i class="fas fa-ellipsis-v" style="font-size: 14px;"></i>
        </button>
        <ul class="dropdown-menu dropdown-menu-end">
          <li onclick="triggleDetailJob(${val.prlOrg})">
            <a class="dropdown-item"><img src="/assets/images/rasci/eye.svg" alt="Filter Icon">Detail</a>
          </li>
          <li><a class="dropdown-item"><img src="/assets/images/rasci/document.svg" alt="Filter Icon">Competency</a></li>
          <li><a class="dropdown-item"><img src="/assets/images/rasci/clipboard.svg" alt="Filter Icon">Job Description</a></li>
        </ul>
      </div>
    `;

    headerRow.appendChild(jobTh);
    // console.log("Kolom baru ditambahkan:", jobTh);
  });

  console.log("Jumlah header TH setelah update:", headerRow.children.length);
  initializeTooltips();
}

function loadTableHeader(jobTitleList) {
  const headerTable = document.getElementById("table-header");
  headerTable.innerHTML = renderStaticHeader(); // Menggunakan fungsi header statis

  appendDynamicHeader(jobTitleList);
}
// function loadTableHeader(jobTitleList) {
//   const headerContent = `
//           <tr style="height:30px">
//               <th scope="col" class="level-col head-cell">Level</th>
//               <th scope="col" class="index-col head-cell">Index</th>
//               <th scope="col" class="headcol head-cell"><span style="padding-left:10px;">Proses Bisnis</span></th>
//               ${jobTitleList
//                 ?.map(
//                   (val, i) => `
//               <th scope="col" class="jabatan-cell jabatan-level-${val.level}"
//                   style="width: 170px">
//                   <div class='jabatan-cell-outer-wrapper'>
//                     <div class='jabatan-cell-wrapper' data-bs-toggle="tooltip" data-bs-placement="bottom" title="${val.positionName}">
//                       ${val.positionName}
//                     </div>
//                   </div>
//                   <div>
//                    <button class="dropdown-btn" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false"
//                       style="cursor: pointer;">
//                       <i class="fas fa-ellipsis-v" style="font-size: 14px;"></i>
//                   </button>
//                    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
//                       <li onclick="triggleDetailJob(${val.prlOrg})"><a class="dropdown-item"><img src="/assets/images/rasci/eye.svg" alt="Filter Icon">Detail</a></li>
//                       <li><a class="dropdown-item"><img src="/assets/images/rasci/document.svg" alt="Filter Icon">Competency</a></li>
//                       <li><a class="dropdown-item"><img src="/assets/images/rasci/clipboard.svg" alt="Filter Icon">Job Description</a></li>
//                   </ul>
//                   </div>
//               </th>
//           `,
//                 )
//                 .join("")}
//           </tr>
//           `;
//   document.getElementById("table-header").innerHTML = headerContent;
//   initializeTooltips();
// }

function loadTableBody(prosbisList) {
  const expandedRows = appState.idProsbis;
  const jobTitleList = appState.resultJabatan;
  const visibleProsbis = prosbisList;
  const rasciMapping = appState.resultRasciMapping || [];
  const isSearch = getState("isSearchMatrix");
  const idProsbisSelected = getState("idSearchProsbis");
  // console.log("visibleProsbis", visibleProsbis);
  const tableBody = document.getElementById("table-body");
  if (!tableBody) return;
  const fragment = document.createDocumentFragment();
  visibleProsbis?.forEach((val, i) => {
    const levelClass =
      val.level && idProsbisSelected == val.indexNumber
        ? `level-${val.level} highlight`
        : val.level
        ? `level-${val.level}`
        : "";
    const isExpanded = expandedRows.includes(val.indexNumber) ? "chevron-up" : "chevron-down";
    const row = document.createElement("tr");

    row.id = `row-${val.indexNumber}`;
    row.classList.add("clusterize-cluster", levelClass);
    // const rasciCells = mapRasciCells(val.indexNumber, positionList);
    row.innerHTML = `
          <td scope="row" class="level-col" style="font-size:12px;font-weight: 500 !important;">
            L${val.level}
          </td>
          <td class="index-col" style="text-align:left;font-size:12px;font-weight: 500 !important;"><span style="padding-left:5px;">${
            val.indexNumber
          }</span></td>
          <td class="headcol" style="font-size:12px;font-weight: 500 !important;">
           <div class="prosbis-cell-wrapper">
              <div class="hierarchy-icon-wrapper">
                ${
                  isSearch == false && val.hasChild
                    ? `<i data-feather="${isExpanded}" class="hierarchy-icon" id="icon-${val.indexNumber}"
                    style="width:24px;" onclick="handleCollapse('${val.indexNumber}')"></i>`
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
                  <ul class="dropdown-menu " aria-labelledby="dropdownMenuButton">
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
                    )})" ><a class="dropdown-item" style="color: red !important;"><img src="/assets/images/rasci/small_redtrush.svg" alt="Filter Icon">Delete</a></li>
                  </ul>
                </div>
              </div>
           </div>
          </td>
        
          `;
    fragment.appendChild(row);
  });

  tableBody.appendChild(fragment);

  // var clusterize = new Clusterize({
  //   rows: bodyContent,
  //   scrollId: "table-container",
  //   contentId: "table-body",
  // });
  // const tableBody = document.getElementById("table-body");
  feather.replace();
  initializeTooltips();
}

function getRowById(rowId) {
  return document.querySelector(`[id="${rowId}"]`);
}

function getAllIndexNumbers() {
  const indexNumbers = [];
  document.querySelectorAll("#table-body tr").forEach((row) => {
    const indexNumber = row.id.replace("row-", ""); // Ambil dari id row
    if (indexNumber) indexNumbers.push(indexNumber);
  });
  return indexNumbers;
}

function getJobTitleData() {
  const headerCells = document.querySelectorAll("#table-header tr .jabatan-cell");
  const jobData = [];

  headerCells.forEach((cell) => {
    let responsibilityData = null;

    if (cell.dataset.responsibility) {
      responsibilityData = JSON.parse(cell?.dataset?.responsibility);
      try {
      } catch (error) {
        console.error("Error parsing responsibility data:", error);
      }
    }

    jobData.push({
      level: cell.dataset.level,
      positionName: cell.dataset.positionName,
      positionNameNk: cell.dataset.positionNameNk,
      prlOrg: cell.dataset.prlOrg,
      responsibility: responsibilityData, // Menggunakan hasil parsing
      sequence: cell.dataset.sequence,
      unitCode: cell.dataset.unitCode,
    });
  });

  return jobData;
}

// Map RASCI Cells (Memoized)
const mapRasciCellsCache = new Map();

// function mapRasciCells(indexNumber, position) {

//   const rasciCells = position
//     .map((value) => {
//       let rasciIcons = "";
//       let comments = [];
//       if (value?.responsibility !== null) {
//         const findNotation = value?.responsibility.find((item) => item.indexNumber === indexNumber);
//         switch (findNotation?.notation) {
//           case "R":
//             rasciIcons += `<img src="/assets/images/rasci/r.svg" alt="R Icon" style="padding-right:2px">`;
//             break;
//           case "A":
//             rasciIcons += `<img src="/assets/images/rasci/a.svg" alt="A Icon" style="padding-right:2px">`;
//             break;
//           case "S":
//             rasciIcons += `<img src="/assets/images/rasci/s.svg" alt="S Icon" style="padding-right:2px">`;
//             break;
//           case "C":
//             rasciIcons += `<img src="/assets/images/rasci/c.svg" alt="C Icon" style="padding-right:2px">`;
//             break;
//           case "I":
//             rasciIcons += `<img src="/assets/images/rasci/i.svg" alt="I Icon" style="padding-right:2px">`;
//             break;
//         }

//         if (findNotation?.comment) {
//           comments.push(`<li>${findNotation?.notation}: ${findNotation?.comment}</li>`);
//         }

//         if (comments.length > 0) {
//           const commentTooltip = `<ul>${comments.join("")}</ul>`;
//           rasciIcons += `<img src="/assets/images/rasci/comment.svg" alt="Comment Icon" style="padding-right:2px" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-html="true" title="${commentTooltip}">`;
//         }
//         return `<td>
//       <div class="rasci-container">
//         <div class="rasci-icons">${rasciIcons}</div>
//         <img src="/assets/images/rasci/pencil_rasci.svg" alt="Pencil Icon" class="pencil-icon">
//       </div>
//     </td>`;
//       } else {
//         return `<td>
//         <div class="rasci-container">
//           <div class="rasci-icons"></div>
//           <img src="/assets/images/rasci/pencil_rasci.svg" alt="Pencil Icon" class="pencil-icon">
//         </div>
//       </td>`;
//       }
//     })
//     .join("");

//   // if (rasciCells) {
//   //   mapRasciCellsCache.set(cacheKey, rasciCells);
//   // }

//   return rasciCells;
// }

// Initialize tooltips after rendering
function mapRasciCells(indexNumbers, positions) {
  indexNumbers.forEach((indexNumber) => {
    const row = getRowById(`row-${indexNumber}`);
    if (!row) {
      console.warn(`Baris dengan ID #row-${indexNumber} tidak ditemukan!`);
      return;
    }
    positions.forEach((value) => {
      let rasciIcons = "";
      let comments = [];

      if (value?.responsibility) {
        const findNotation = value.responsibility.find((item) => item.indexNumber === indexNumber);

        if (findNotation) {
          switch (findNotation.notation) {
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

          if (findNotation.comment) {
            comments.push(`<li>${findNotation.notation}: ${findNotation.comment}</li>`);
          }
        }
      }

      if (comments.length > 0) {
        const commentTooltip = `<ul>${comments.join("")}</ul>`;
        rasciIcons += `<img src="/assets/images/rasci/comment.svg" alt="Comment Icon" style="padding-right:2px" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-html="true" title="${commentTooltip}">`;
      }
      // **Cek apakah kolom sudah ada dalam baris dengan data posisi unik**
      const existingColumn = row.querySelector(`td[data-index="${indexNumber}-${value.prlOrg}-${value.unitCode}"]`);
      if (!existingColumn) {
        const tdElement = document.createElement("td");
        tdElement.dataset.index = `${indexNumber}-${value.prlOrg}-${value.unitCode}`; // Tambahkan index unik
        tdElement.innerHTML = `
          <div class="rasci-container">
            <div class="rasci-icons">${rasciIcons}</div>
            <img src="/assets/images/rasci/pencil_rasci.svg" alt="Pencil Icon" class="pencil-icon">
          </div>
        `;

        // **Tambahkan ke dalam baris yang sesuai**
        row.appendChild(tdElement);
      }
    });
  });

  initializeTooltips();
}

function initializeTooltips() {
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));
}
function onModalProsbis(data) {
  setState("dataDetailProsbis", data);
  detailsProsbis();
}

async function handleCollapse(id) {
  const parentId = id;
  const parentRow = document.getElementById(parentId);
  const icon = document.getElementById(`icon-${id}`);

  if (parentRow) {
    if (!appState.idProsbis.includes(parentId)) {
      appState.idProsbis = [...appState.idProsbis, parentId.toString()];
      appState.resetIdProsbis = appState.resetIdProsbis.filter((item) => !parentId.toString().includes(item));
      const selectId = filterChild(appState.idProsbis, appState.resetIdProsbis);
      const payload = { parentId: selectId.join(",") };
      const resultMatrix = await fetchDataMatrix(payload);
      // const result = traverse(appState.allDataProsbis, appState.idProsbis);
      resultAllData(resultMatrix?.data);
    } else {
      const listSelectedId = appState.idProsbis;
      const index = appState.idProsbis.indexOf(parentId.toString());
      // const idFiltered = filterData(listSelectedId, parentId.toString());
      appState.resetIdProsbis = [...appState.resetIdProsbis, parentId.toString()];
      // resetIdProsbis
      const idFiltered = filterArray(appState.resetIdProsbis, listSelectedId);
      if (idFiltered && index > -1) appState.idProsbis.splice(index, 1);
      const payload = { parentId: idFiltered.join(",") };
      const resultMatrix = await fetchDataMatrix(payload);
      // const result = traverse(appState.allDataProsbis, idFiltered);
      resultAllData(resultMatrix?.data);
    }

    feather.replace();
  }
}
function filterChild(array, input) {
  const inputSet = new Set(input);
  return array.filter((item) => {
    return ![...inputSet].some((val) => item.startsWith(val + "."));
  });
}
function filterArray(inputs, array) {
  function isDescendant(parent, child) {
    return child.startsWith(parent + ".") || child === parent;
  }
  const result = array.filter((value) => {
    return !inputs.some((input) => isDescendant(input, value)) && !inputs.includes(value);
  });

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
  const selectedParts = selectedId.split(".");
  const selectedDepth = selectedParts.length;
  return data.filter((item) => {
    const itemParts = item.split(".");
    for (let i = 0; i < selectedDepth; i++) {
      if (itemParts[i] !== selectedParts[i]) {
        return true;
      }
    }
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
      if (item.indexGroup === filter && item.parentId === null && !addedItems.has(item.indexGroup)) {
        result.push(item);
        addedItems.add(item.indexGroup);
        helper(item.indexGroup);
      }
    });
  });
  data.forEach((item) => {
    if (item.parentId === null && !addedItems.has(item.indexGroup)) {
      result.push(item);
      addedItems.add(item.indexGroup);
    }
  });
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
  appState.resetIdProsbis = [];
  // resultAllData(appState.resultProsbis);
  const resultMatrix = await fetchDataMatrix();
  // const result = traverse(appState.allDataProsbis, appState.idProsbis);
  resultAllData(resultMatrix?.data);
  setState("isSearchMatrix", false);
  setState("idSearchProsbis", "");
  setState("currentPageY", 0);
  setState("currentPageX", 0);
  setState("strorageProsbis", []);
  setState("storageJabatan", []);
  const tableHeader = document.getElementById("table-header");
  const tableBody = document.getElementById("table-body"); // Merujuk ke <tbody>
  tableHeader.innerHTML = "";
  tableBody.innerHTML = "";
  document.getElementById("inputText").value = "";
  document.getElementById("inputSearchCompare").value = "";
  handleCloseModal();
  resetAllFilterRasci();
}

function sendDetailbp(data) {
  setState("dataDetailProsbis", data);
  onModalChoose("editProsbis");
}
function checkChildrenProsbis(data) {
  if (data.hasChild !== true) {
    setState("dataDeleteProsbis", data);
    onModalChoose("deleteProsbis");
  } else {
    setTimeout(() => {
      swal({
        title: "CAN’T DELETE",
        icon: "error",
        buttons: false,
        timer: 2000,
        content: {
          element: "div",
          attributes: {
            innerHTML: `<div style="text-align: center;">Cannot delete business processes that have child processes.</div>`,
          },
        },
      }).then(async () => {});
    }, 200);
  }
}
async function openModalDeleteBusinesspro() {
  const dataDeleteProsbis = getState("dataDeleteProsbis");
  const modal = new bootstrap.Modal(document.getElementById("modalDeleteBp"));
  modal.show();

  const bodyLabel = `<label>Are you sure want to delete this business process?</label>
                    <h6 class="mt-2" style="font-weight: bold;">
                        ${dataDeleteProsbis.indexGroup} ${dataDeleteProsbis.description}
                    </h6>`;
  document.getElementById("form-deletebp").innerHTML = bodyLabel;
}

async function handleSaveDeletebp() {
  const dataDeleteProsbis = getState("dataDeleteProsbis");
  const spinner = document.getElementById("loadingDeletebp");
  spinner.style.display = "inline-block";
  const payload = {
    draftId: dataDeleteProsbis.draftId,
    draftType: "Delete Business Process",
    draftName: dataDeleteProsbis.draftName,
    parentId: dataDeleteProsbis.indexGroup,
  };
  const result = await submitDraftProsbis(payload);
  if (result.status === 200) {
    const modalDeleteBp = document.getElementById("modalDeleteBp");
    const modalDelete = bootstrap.Modal.getInstance(modalDeleteBp);
    document.getElementById("draftName").value = "";
    if (modalDelete) {
      modalDelete.hide();
    }
    setTimeout(() => {
      swal({
        title: "SUCCESS",
        icon: "success",
        buttons: false,
        timer: 2500,
        content: {
          element: "div",
          attributes: {
            innerHTML: `<span style="text-align: center;">Your activity has been save as draft.</span>
            <br>
            <span>You can check in <b>${result.data.draftName}</b> at draft tab.</span>
            `,
          },
        },
      }).then(async () => {
        spinner.style.display = "none";
        const payload = {
          Page: 1,
          PageSize: 5,
        };
        const queryString = new URLSearchParams(payload).toString();
        const dataDraft = await fetchDraftProsbis(queryString);
        const IsNotEmpty = dataDraft.data.length;
        handleClickCard(IsNotEmpty);
        loadTableBodyDraft(dataDraft);
        $("#pills-draft-tab").tab("show");
      });
    }, 100);
  }
}
