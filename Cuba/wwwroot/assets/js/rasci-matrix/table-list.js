document.addEventListener("dataLoaded", async function () {
  try {
    const { prlOrgArray, ouIdArray } = getUrlOrgParams(window.location.search);
    if (ouIdArray.length > 0 && prlOrgArray.length > 0) {
      await searchMatrixByParams(ouIdArray, prlOrgArray);
      hideLoading();
      feather.replace();
    } else {
      await defaultLoadMatrix();
      hideLoading();
      feather.replace();
    }
    //  else {
    //   showDataEmpty();
    // }
  } catch (error) {}
});
function getUrlOrgParams(search = window.location.search) {
  const params = new URLSearchParams(search);
  const ouId = params.get("ouId");
  const prlOrgRaw = params.get("prlOrg");
  const prlOrgArray = prlOrgRaw ? prlOrgRaw.split(",").map((s) => s.trim()) : [];
  const ouIdArray = prlOrgArray.length > 1 ? Array(prlOrgArray.length).fill(ouId) : ouId ? [ouId] : [];
  return { prlOrgArray, ouIdArray };
}
async function defaultLoadMatrix() {
  try {
    const selectedValue = $("#dataSource-rasci").val();
    const payload = {
      draftRasciId: selectedValue === "master" ? null : selectedValue,
      level: [],
      indexNumber: appState.defaultIndexNumber,
      row: 1,
      rowSize: 15,
    };
    const payloadPosition = getState("payloadPosition");
    const resultMatrix = await fetchProsbisMatrix(payload);
    const combineIndex = resultMatrix.data.map((val) => val.indexNumber);
    if (combineIndex.length > 0) {
      const resultPosition = await fetchPositionMatrix({
        ...payloadPosition,
        indexNumber: combineIndex,
      });
      setState("payloadPosition", {
        ...payloadPosition,
        indexNumber: combineIndex,
      });
      loadTableBody(resultMatrix.data);
      loadTableHeader(resultPosition.data);
      mapRasciCells(combineIndex, resultPosition.data);
    }
  } catch (error) {}
}
document.addEventListener("DOMContentLoaded", async function () {
  let selectElement = document.querySelector("#dataSource-rasci");
  infoValueChain(selectElement.value);
  if (selectElement.value === "master" || selectElement.value === "" || selectElement.value === null) {
    document.getElementById("pills-draft-tab").style.display = "none";
    document.getElementById("pills-approval-tab").style.display = "none";
    document.getElementById("pills-log-history-tab").style.display = "none";
    document.getElementById("pills-summary-tab").style.display = "none";

    document.getElementById("btnAddBp").style.display = "none";
    document.getElementById("btnAddNotation").style.display = "none";
    document.getElementById("btnDeleteDetail").style.display = "none";
    document.getElementById("btnEditDetail").style.display = "none";
  }
  showLoading();
  // loadTableHeader(appState.resultJabatan);
  const loader = document.getElementById("loader");
  loader.style.display = "none";
  // loadTableBody(appState.resultProsbis);
  fetchDatasource();
  feather.replace();
});

$("#dataSource-rasci").on("select2:select", async function (e) {
  try {
    let selectedOption = $(this).find(":selected");
    let selectedDraftSo = selectedOption.attr("data-draftso");
    const selectedValue = $("#dataSource-rasci").val();
    setState("draftSoId", selectedDraftSo);
    setState("draftRasciId", selectedValue);
    const jobList = await fetchFilterJobList(selectedValue);
    const combinedData = [
      ...jobList?.level1.map((item) => ({
        ...item,
        type: "level1",
      })),
      ...jobList?.level2.map((item) => ({
        ...item,
        type: "level2",
      })),
      ...jobList?.level3.map((item) => ({
        ...item,
        type: "level3",
      })),
      ...jobList?.level4.map((item) => ({
        ...item,
        type: "level4",
      })),
      ...jobList?.level5.map((item) => ({
        ...item,
        type: "level5",
      })),
      ...jobList?.level6.map((item) => ({
        ...item,
        type: "level6",
      })),
      ...jobList?.level7.map((item) => ({ ...item, type: "level7" })),
      ...jobList?.level8.map((item) => ({ ...item, type: "level8" })),
    ];
    setState("filterJobList", combinedData);
    ChangeSourceDraft();
    infoValueChain(selectedValue);
    // console.log("selectedDraftSo", selectedDraftSo);
    // console.log("selectedValue", selectedValue);
    changeDataSource(selectedValue, selectedDraftSo);
  } catch (error) {}
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
        const excludedIds = new Set(["1", "00000000-0000-0000-0000-000000000001"]);
        const result = Array.isArray(response?.data?.result)
          ? response.data.result.filter((item) => !excludedIds.has(String(item?.id)))
          : [];
        result.forEach((item) => {
          let isSelected = draftId && item.id == draftId;
          let $option = new Option(item.text, item.id, isSelected, isSelected);
          $($option).attr("data-draftso", item.draftSo);
          $select.append($option);
        });

        if (draftId) {
          let newOption = new Option(`Draft ${draftId}`, draftId, true, true);
          $(newOption).attr("data-draftso", "your-value-here");
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

async function changeDataSource(dataSource, draftSo) {
  // console.log("dataSource", dataSource, "draftSo", draftSo);
  try {
    const defaultIndexNumber = getState("defaultIndexNumber");
    $("#dataSource-summary").val(dataSource).trigger("change");
    document.getElementById("dataSource-summary").disabled = true;
    // console.log("defaultIndexNumber", defaultIndexNumber);

    if (dataSource !== "master" && dataSource !== "" && dataSource !== null) {
      // document.getElementById("pills-warningtab").style.display = "flex";

      document.getElementById("pills-draft-tab").style.display = "flex";
      document.getElementById("pills-approval-tab").style.display = "flex";
      document.getElementById("pills-log-history-tab").style.display = "flex";
      document.getElementById("pills-summary-tab").style.display = "flex";
      document.getElementById("btnAddBp").style.display = "flex";
      document.getElementById("btnAddNotation").style.display = "flex";
      document.getElementById("btnDeleteDetail").style.display = "inline-block";
      document.getElementById("btnEditDetail").style.display = "inline-block";
      getSummaryList(dataSource);
      getSummaryListNotAvailable(dataSource);
      // document.getElementById("btnFormdraft").style.display = "none";
    } else {
      // document.getElementById("pills-warningtab").style.display = "none";
      document.getElementById("pills-draft-tab").style.display = "none";
      document.getElementById("pills-approval-tab").style.display = "none";
      document.getElementById("pills-log-history-tab").style.display = "none";
      document.getElementById("pills-summary-tab").style.display = "none";
      document.getElementById("btnAddBp").style.display = "none";
      document.getElementById("btnAddNotation").style.display = "none";
      document.getElementById("btnDeleteDetail").style.display = "none";
      document.getElementById("btnEditDetail").style.display = "none";
      // document.getElementById("btnFormdraft").style.display = "flex";
    }
    // console.log("defaultIndexNumber", defaultIndexNumber);
    const payload = {
      indexNumber: defaultIndexNumber,
      expandNumber: [],
      draftRasciId: dataSource === "master" ? null : dataSource,
      row: 1,
      rowSize: 15,
    };
    // console.log("payload", payload);
    const resultProsbis = await fetchProsbisMatrix(payload);
    // console.log("resultProsbis", resultProsbis);
    const prosbisNumber = resultProsbis.data.map((val) => val.indexNumber);
    if (prosbisNumber.length > 0 && resultProsbis.success === true) {
      const payloadJob = {
        draftRasciId: dataSource === "master" ? null : dataSource,
        draftSoId: draftSo,
        indexNumber: prosbisNumber,
        col: 1,
        colSize: 10,
      };
      const tableContainer = document.querySelector(".scrollable-table");
      setState("payloadPosition", payloadJob);
      setState("payloadProsbis", payload);
      const resultPosition = await fetchPositionMatrix(payloadJob);
      setState("isSearchMatrix", false);
      setState("idSearchProsbis", "");
      setState("actionType", "BP_THEN_JOB");
      setState("resultProsbis", resultProsbis.data);
      setState("resultJabatan", resultPosition.data);
      setState("totalProsbis", resultProsbis.totalResult);
      setState("totalJob", resultPosition.totalResult);
      if (resultPosition.data.length > 0) {
        loadTableHeader(resultPosition.data);
        loadTableBody(resultProsbis.data);
        mapRasciCells(prosbisNumber, resultPosition.data);
        tableContainer.scrollTop = 0;
        tableContainer.scrollLeft = 0;
      }
    }
    return true;
  } catch (error) {
    return false;
  }
}

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

function loadTableHeader(jobTitleList) {
  const headerTable = document.getElementById("table-header");
  headerTable.innerHTML = renderStaticHeader();

  appendDynamicHeader(jobTitleList);
}

function renderStaticHeader() {
  return `
    <tr style="height:30px">
      <th scope="col" class="level-col head-cell">Level</th>
      <th scope="col" class="index-col head-cell">Index</th>
      <th scope="col" class="headcol head-cell"><span style="padding:10px">Proses Bisnis</span></th>
    </tr>
  `;
}
function appendDynamicHeader(jobTitleList) {
  const headerRow = document.querySelector("#table-header tr");
  if (!headerRow) {
    console.error("Element #table-header tr tidak ditemukan!");
    return;
  }

  let staticHeaders = "";
  headerRow.querySelectorAll("th:not(.jabatan-cell)").forEach((th) => {
    staticHeaders += th.outerHTML;
  });

  if (!jobTitleList || jobTitleList.length === 0) {
    console.warn("jobTitleList kosong, tidak ada kolom yang ditambahkan.");
    document.getElementById("table-header").innerHTML = `<tr>${staticHeaders}</tr>`;
    return;
  }

  let dynamicHeaders = "";
  jobTitleList.forEach((val) => {
    const uniqueClass = `jabatan-level-${val.level}`;
    const valString = JSON.stringify(val).replace(/"/g, "&quot;");
    const headerHTML = `
      <th scope="col" class="jabatan-cell ${uniqueClass}" style="width:170px"
        data-level="${val.level}"
        data-position-name="${val.positionName}"
        data-position-name-nk="${val.positionNameNk}"
        data-prl-org="${val.prlOrg}"
        data-responsibility="${val.responsibility}"
        data-sequence="${val.sequence}"
        data-unit-code="${val.unitCode}">
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
        <li onclick="triggleDetailJob(${valString})">
          <a class="dropdown-item"><img src="/assets/images/rasci/eye.svg" alt="Filter Icon">Detail</a>
        </li>
      </ul>
    </div>
      </th>
    `;
    //  <li><a class="dropdown-item"><img src="/assets/images/rasci/clipboard.svg" alt="Filter Icon">Job Description</a></li>
    dynamicHeaders += headerHTML;
  });

  document.getElementById("table-header").innerHTML = `<tr>${staticHeaders}${dynamicHeaders}</tr>`;
  initializeTooltips();
}
function loadTableBody(prosbisList) {
  const expandedRows = appState.idProsbis;
  const visibleProsbis = prosbisList;
  const isSearch = getState("isSearchMatrix");
  const idProsbisSelected = getState("idSearchProsbis");
  const tableBody = document.getElementById("table-body");
  const draftRasciId = getState("draftRasciId");
  const isMaster = draftRasciId === "master" || draftRasciId === null;
  if (!tableBody) return;
  let bodyContent = "";
  visibleProsbis?.forEach((val) => {
    const levelClass =
      val.level && idProsbisSelected == val.indexNumber
        ? `level-${val.level} highlight`
        : val.level
          ? `level-${val.level}`
          : "";
    const bgParent = val.isContextualParent === 1 ? `level-${val.level} prosbisparent` : "";
    const isNaFound = val.matchReason && val.matchReason === "NA_NO_POSITION_MAPPING" ? `level-${val.level} na` : "";
    const isRaFound = val.matchReason && val.matchReason === "RA_NO_NOTATION_MAPPING" ? `level-${val.level} nonra` : "";
    const isExpanded = expandedRows.includes(val.indexNumber) ? "chevron-up" : "chevron-down";
    const createTooltipImage = (img, title) =>
      `<img src="${img}" alt="Filter Icon"
                    class="example-popover" style="margin-top:-2px;" data-bs-toggle="tooltip"
                    data-bs-placement="top" title="${title}">`;

    const toolTipNa =
      val.matchReason === "NA_NO_POSITION_MAPPING"
        ? createTooltipImage("/assets/images/rasci/danger-circle.svg", "Tidak Ada Notasi RASCI (N/A)")
        : "";

    const toolTipRa =
      val.matchReason === "RA_NO_NOTATION_MAPPING"
        ? createTooltipImage("/assets/images/rasci/warning-circle.svg", "Tidak Ada Notasi RASCI (R/A)")
        : "";

    const valString = JSON.stringify(val).replace(/"/g, "&quot;");
    const hierarchyIcon =
      isSearch == false && val.hasChild
        ? `<div class="icon-wrapper" style="width:15px;height:15px;display:flex;align-items:center;justify-content:center;">
         <i data-feather="${isExpanded}" id="icon-${val.indexNumber}" onclick="handleCollapse('${val.indexNumber}')" style="width:15px;height:15px;"></i>
       </div>`
        : ``;

    bodyContent += `
      <tr id="row-${val.indexNumber}" class="clusterize-cluster ${levelClass} ${bgParent} ${isNaFound} ${isRaFound}">
        <td scope="row" class="level-col" style="font-size:13px;font-weight: 500 !important;">
          L${val.level}1
        </td>
        <td class="index-col" style="text-align:left;font-size:13px;font-weight: 500 !important;">
          <span style="padding-left:5px;">${val.indexNumber}</span>
        </td>
        <td class="headcol" style="font-size:12px;font-weight: 500 !important;">
          <div class="prosbis-cell-wrapper">
            <div class="hierarchy-icon-wrapper">${hierarchyIcon}</div>
            <div class="flex-fill prosbis-name" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-custom-class="custom-tooltip"
              title="${val.description}" onclick="onModalProsbis(${valString})">${val.description}</div>
                ${toolTipNa} ${toolTipRa}
            <div class="ellipsis-menu prosbis-row-ellipsis">
              <div class="dropright">
                <button type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false"
                  style="border: none; background: transparent; cursor: pointer;">
                  <i class="fas fa-ellipsis-v"></i>
                </button>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  <li onclick="onModalProsbis(${valString})">
                    <a class="dropdown-item"><img src="/assets/images/rasci/eye.svg" alt="Filter Icon">Detail</a>
                  </li>
                  <li onclick="sendDetailbp(${valString})" style="display: ${isMaster ? "none" : "flex"}">
                    <a class="dropdown-item"><img src="/assets/images/rasci/pencil.svg" alt="Filter Icon">Edit</a>
                  </li>
                   <li onclick="checkChildrenProsbis(${valString})" style="display: ${isMaster ? "none" : "flex"} ">
                    <a class="dropdown-item" style="color: red !important;">
                      <img src="/assets/images/rasci/small_redtrush.svg" alt="Filter Icon">Delete
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </td>
      </tr>`;
  });

  tableBody.innerHTML = bodyContent;
  feather.replace();
  initializeTooltips();
}

function getRowById(rowId) {
  return document.querySelector(`[id="${rowId}"]`);
}

function getAllIndexNumbers() {
  const indexNumbers = [];
  document.querySelectorAll("#table-body tr").forEach((row) => {
    const indexNumber = row.id.replace("row-", "");
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
      responsibility: responsibilityData,
      sequence: cell.dataset.sequence,
      unitCode: cell.dataset.unitCode,
    });
  });

  return jobData;
}

function mapRasciCells(indexNumbers, positions) {
  const draftRasciId = getState("draftRasciId");
  const isMaster = draftRasciId === "master" || draftRasciId === null;
  indexNumbers.forEach((indexNumber) => {
    const row = getRowById(`row-${indexNumber}`);
    if (!row) {
      console.warn(`Baris dengan ID #row-${indexNumber} tidak ditemukan!`);
      return;
    }

    const staticTds = Array.from(row.querySelectorAll("td")).filter((td) => !td.dataset.index);
    let rowContent = staticTds.map((td) => td.outerHTML).join("");

    positions.forEach((value) => {
      let rasciIcons = "";
      let comments = [];
      if (value?.responsibility) {
        const notations = value.responsibility.filter((item) => item.indexNumber === indexNumber);
        notations.forEach((notationItem) => {
          switch (notationItem.notation) {
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

          if (notationItem.comment) {
            comments.push(`<li>${notationItem.notation}: ${notationItem.comment}</li>`);
          }
        });
      }

      if (comments.length > 0) {
        const commentTooltip = `<ul>${comments.join("")}</ul>`;
        rasciIcons += `<img src="/assets/images/rasci/comment.svg" alt="Comment Icon" style="padding-right:2px" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-html="true" title="${commentTooltip}">`;
      }

      const rasciTd = `
    <td data-index="${indexNumber}-${value.prlOrg}-${value.unitCode}">
      <div class="rasci-container">
        <div class="rasci-icons">${rasciIcons}</div>
        <img  style="display: ${
          isMaster ? "none" : "flex"
        }" src="/assets/images/rasci/pencil_rasci.svg" alt="Pencil Icon" class="pencil-icon" onclick="handleEditNotationRow('${
          value.prlOrg
        }','${value.unitCode}', '${indexNumber}')">
      </div>
    </td>
  `;
      rowContent += rasciTd;
    });

    row.innerHTML = rowContent;
  });

  initializeTooltips();
}

function initializeTooltips() {
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));
}
function onModalProsbis(data) {
  const draftSoId = getState("draftSoId");
  const draftRasciId = getState("draftRasciId");
  setState("dataDetailProsbis", {
    ...data,
    draftRasci: draftRasciId === "master" ? null : draftRasciId,
    draftSo: draftSoId || null,
  });
  detailsProsbis();
}

async function handleCollapse(id) {
  const parentId = id.toString();
  const parentRow = document.getElementById(`row-${parentId}`);
  const draftSoId = getState("draftSoId");
  const selectedValue = getState("draftRasciId");
  const isMaster = selectedValue === "master";
  const draftRasciId = isMaster ? null : selectedValue;

  const icon = document.getElementById(`icon-${parentId}`);
  if (icon) {
    icon.setAttribute("data-feather", "loader");
    feather.replace();
    setTimeout(() => {
      const svgIcon = document.getElementById(`icon-${parentId}`);
      if (svgIcon && svgIcon.tagName === "svg") {
        svgIcon.classList.add("feather-loader");
      }
    }, 0);
  }

  if (!parentRow) return;

  const payloadProsbis = getState("payloadProsbis");
  const payloadPosition = getState("payloadPosition");
  const isExpanded = appState.idProsbis.includes(parentId);

  const updateStatesAndRender = async (expandNumbers) => {
    const payload = {
      ...payloadProsbis,
      draftRasciId,
      expandNumber: expandNumbers,
      row: 1,
      rowSize: 15,
    };
    const resultMatrix = await fetchProsbisMatrix(payload);
    if (!resultMatrix.success) {
      const errorIcon = document.getElementById(`icon-${id}`);
      if (errorIcon) {
        errorIcon.setAttribute("data-feather", isExpanded ? "chevron-down" : "chevron-up");
        feather.replace();
      }
      return;
    }
    const indexNumbers = resultMatrix.data.map((val) => val.indexNumber);
    const jobPayload = {
      ...payloadPosition,
      col: 1,
      colSize: 10,
      draftRasciId,
      draftSoId: draftSoId,
      indexNumber: indexNumbers,
    };
    const resultPosition = await fetchPositionMatrix(jobPayload);
    setTimeout(() => {
      loadTableBody(resultMatrix.data);
      loadTableHeader(resultPosition.data);
      mapRasciCells(indexNumbers, resultPosition.data);
      setState("payloadProsbis", payload);
      setState("payloadPosition", jobPayload);
      setState("resultProsbis", resultMatrix.data);
      setState("resultJabatan", resultPosition.data);
      setState("totalProsbis", resultMatrix.totalResult);
      setState("totalJob", resultPosition.totalResult);
      setState("actionType", "BP_THEN_JOB");
      setState("currentPageY", 1);
      setState("currentPageX", 1);
      hideAllTooltips();
    }, 100);
  };

  if (!isExpanded) {
    setState("idProsbis", [...appState.idProsbis, parentId]);
    setState(
      "resetIdProsbis",
      appState.resetIdProsbis.filter((item) => item !== parentId),
    );

    const selectedIds = filterChild(appState.idProsbis, appState.resetIdProsbis);
    await updateStatesAndRender(selectedIds);
  } else {
    const currentSelected = [...appState.idProsbis];
    const indexToRemove = currentSelected.indexOf(parentId);

    if (indexToRemove > -1) currentSelected.splice(indexToRemove, 1);

    setState("resetIdProsbis", [...appState.resetIdProsbis, parentId]);
    setState("idProsbis", currentSelected);

    const filteredIds = filterArray(appState.resetIdProsbis, currentSelected);
    await updateStatesAndRender(filteredIds);
  }

  feather.replace();
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
  const draftRasciId = getState("draftRasciId");
  const draftSoId = getState("draftSoId");
  const spinner = document.getElementById("loadingClear");
  const clearButton = document.getElementById("clearButton");
  spinner.style.display = "inline-block";
  const { prlOrgArray, ouIdArray } = getUrlOrgParams(window.location.search);
  if (ouIdArray.length > 0 && prlOrgArray.length > 0) {
    const params = new URLSearchParams(window.location.search);
    if (ouIdArray.length > 0 && prlOrgArray.length > 0 && params.has("ouId") && params.has("prlOrg")) {
      // Hapus parameter ouId dan prlOrg dari URL (reset)
      params.delete("ouId");
      params.delete("prlOrg");
      const newSearch = params.toString();
      const newUrl = window.location.pathname + (newSearch ? `?${newSearch}` : "");
      window.history.replaceState({}, document.title, newUrl);
    }
  }
  setState("resultProsbis", []);
  setState("resultJabatan", []);
  setState("idProsbis", []);
  setState("resetIdProsbis", []);
  setState("currentPageY", 1);
  setState("currentPageX", 1);
  const result = await changeDataSource(draftRasciId, draftSoId);
  // console.log("result", result);
  if (result) {
    spinner.style.display = "none";
    clearButton.blur();
    document.getElementById("inputText").value = "";
    document.getElementById("inputSearchCompare").value = "";
    handleCloseModal();
    resetAllFilterRasci();
    hideAllTooltips();
  }
}

async function ChangeSourceDraft() {
  const tableContainer = document.querySelector(".scrollable-table");
  tableContainer.scrollTop = 0;
  tableContainer.scrollLeft = 0;
  setState("resultProsbis", []);
  setState("resultJabatan", []);
  setState("idProsbis", []);
  setState("resetIdProsbis", []);
  setState("currentPageY", 1);
  setState("currentPageX", 1);
  document.getElementById("inputText").value = "";
  document.getElementById("inputSearchCompare").value = "";
  handleCloseModal();
  resetAllFilterRasci();
  hideAllTooltips();
}

async function lastStateTableMatrix(inputValue = "") {
  const dataStoreProsbis = getState("resultProsbis");
  const storageDataPosition = getState("resultJabatan");
  const actionType = getState("actionType");
  if (inputValue.draftType === "Add New Business Process") {
    return await oldVersionTableMatrix();
  } else if (inputValue.draftType?.includes("Edit Business Process")) {
    return await handleEditBusinessProcess(inputValue, dataStoreProsbis, storageDataPosition, actionType);
  } else if (inputValue.draftType?.includes("Delete Business Process")) {
    return await handleDeleteBusinessProcess(inputValue, dataStoreProsbis, storageDataPosition, actionType);
  } else {
    return await handleNotationUpdate(inputValue, dataStoreProsbis, storageDataPosition, actionType);
  }
}

async function handleEditBusinessProcess(inputValue, dataStoreProsbis, storageDataPosition, actionType) {
  const prosbisNumber = dataStoreProsbis.map((val) => val.indexNumber);
  const matchedProsbis = dataStoreProsbis.find((prosbis) => prosbis.indexNumber === inputValue.parentId);

  if (matchedProsbis) {
    matchedProsbis.description = inputValue.businessProcessName;
  }

  if (actionType === "BP_THEN_JOB" || actionType === "POS_THEN_BP") {
    loadTableHeader(storageDataPosition);
    loadTableBody(dataStoreProsbis);
    mapRasciCells(prosbisNumber, storageDataPosition);
  } else {
    updateProsbisState(dataStoreProsbis);
    loadTableBody(dataStoreProsbis);
  }

  return true;
}

async function handleDeleteBusinessProcess(inputValue, dataStoreProsbis, storageDataPosition, actionType) {
  const prosbisNumber = dataStoreProsbis.map((val) => val.indexNumber);
  const matchedProsbis = dataStoreProsbis.find((prosbis) => prosbis.indexNumber === inputValue.parentId);

  if (matchedProsbis) {
    const index = dataStoreProsbis.indexOf(matchedProsbis);
    if (index > -1) {
      dataStoreProsbis.splice(index, 1);
    }
  }

  if (actionType === "BP_THEN_JOB" || actionType === "POS_THEN_BP") {
    loadTableHeader(storageDataPosition);
    loadTableBody(dataStoreProsbis);
    mapRasciCells(prosbisNumber, storageDataPosition);
  } else {
    updateProsbisState(dataStoreProsbis);
    loadTableBody(dataStoreProsbis);
  }

  return true;
}

async function handleNotationUpdate(inputValue, dataStoreProsbis, storageDataPosition, actionType) {
  if (actionType !== "BP_THEN_JOB" && actionType !== "POS_THEN_BP") {
    return true;
  }
  const prosbisNumber = dataStoreProsbis.map((val) => val.indexNumber);
  const matchedPosition = storageDataPosition.find(
    (pos) => pos.prlOrg === inputValue.orgPrl && pos.unitCode === inputValue.orgUnitCode,
  );

  if (matchedPosition) {
    inputValue.busProsMapped.forEach((busProItem) => {
      updateResponsibilityForBusinessProcess(busProItem, matchedPosition);
    });
    return true;
  }

  loadTableHeader(storageDataPosition);
  loadTableBody(dataStoreProsbis);
  mapRasciCells(prosbisNumber, storageDataPosition);

  return true;
}

function updateResponsibilityForBusinessProcess(busProItem, matchedPosition) {
  const parentId = busProItem.parentId;
  const rasciNotations = busProItem.rasciNotation;
  const responsibilityItems = matchedPosition.responsibility.filter((resp) => resp.indexNumber === parentId);

  rasciNotations.forEach((rasciItem) => {
    updateOrAddNotation(rasciItem, responsibilityItems, matchedPosition, parentId);
  });

  removeUncheckedNotations(rasciNotations, matchedPosition, parentId);
}

function updateOrAddNotation(rasciItem, responsibilityItems, matchedPosition, parentId) {
  const existingResp = responsibilityItems.find((resp) => resp.notation === rasciItem.rasciCode);

  if (existingResp) {
    existingResp.notation = rasciItem.rasciCode;
    existingResp.comment = rasciItem.comment;
  } else if (rasciItem.isChecked) {
    const newResp = {
      indexNumber: parentId,
      unitCode: matchedPosition.unitCode,
      prlOrg: matchedPosition.prlOrg,
      notation: rasciItem.rasciCode,
      comment: rasciItem.comment,
    };
    matchedPosition.responsibility.push(newResp);
  }
}

function removeUncheckedNotations(rasciNotations, matchedPosition, parentId) {
  const rasciCodesInInput = rasciNotations.filter((r) => r.isChecked).map((r) => r.rasciCode);
  matchedPosition.responsibility = matchedPosition.responsibility.filter((resp) => {
    if (resp.indexNumber === parentId && !rasciCodesInInput.includes(resp.notation)) {
      return false;
    }
    return true;
  });
}

function updateProsbisState(dataStoreProsbis) {
  setState("resultProsbis", dataStoreProsbis);
  setState("resultJabatan", []);
  setState("totalProsbis", dataStoreProsbis.length);
  setState("totalJob", 0);
}

async function oldVersionTableMatrix() {
  const tableContainer = document.querySelector(".scrollable-table");
  const payloadProsbis = getState("payloadProsbis");
  const payloadPosition = getState("payloadPosition");
  const actionType = getState("actionType");

  const payload = {
    ...payloadProsbis,
    row: 1,
    rowSize: 15,
  };
  const payloadJob = {
    ...payloadPosition,
    col: 1,
    colSize: 10,
  };

  try {
    if (actionType === "BP_THEN_JOB") {
      const resultProsbis = await fetchProsbisMatrix(payload);
      const prosbisNumber = resultProsbis.data.map((val) => val.indexNumber);
      const resultPosition = await fetchPositionMatrix(payloadJob);
      setState("resultProsbis", resultProsbis.data);
      setState("resultJabatan", resultPosition.data);
      setState("totalProsbis", resultProsbis.totalResult);
      setState("totalJob", resultPosition.totalResult);
      setState("currentPageY", 1);
      setState("currentPageX", 1);
      if (resultPosition.data.length > 0) {
        loadTableHeader(resultPosition.data);
        loadTableBody(resultProsbis.data);
        mapRasciCells(prosbisNumber, resultPosition.data);
      }
    } else if (actionType === "BP_ONLY") {
      const resultProsbis = await fetchProsbisMatrix(payload);
      setState("resultProsbis", resultProsbis.data);
      setState("resultJabatan", []);
      setState("totalProsbis", resultProsbis.totalResult);
      setState("totalJob", 0);
      setState("currentPageY", 1);
      setState("currentPageX", 1);
      if (resultProsbis.data.length > 0) {
        loadTableBody(resultProsbis.data);
      }
    } else if (actionType === "POS_THEN_BP") {
      const resultProsbis = await fetchProsbisMatrix(payload);
      const prosbisNumber = resultProsbis.data.map((val) => val.indexNumber);
      const resultPosition = await fetchPositionMatrix(payloadJob);
      setState("resultProsbis", resultProsbis.data);
      setState("resultJabatan", resultPosition.data);
      setState("totalProsbis", resultProsbis.totalResult);
      setState("totalJob", resultPosition.totalResult);
      setState("currentPageY", 1);
      setState("currentPageX", 1);
      if (resultPosition.data.length > 0) {
        loadTableHeader(resultPosition.data);
        loadTableBody(resultProsbis.data);
        mapRasciCells(prosbisNumber, resultPosition.data);
      }
    }

    tableContainer.scrollTop = 0;
    tableContainer.scrollLeft = 0;

    return true;
  } catch (error) {
    console.error("Error in oldVersionTableMatrix:", error);
    return false;
  }
}

function sendDetailbp(data) {
  const draftidRasci = $("#dataSource-rasci").val();
  const draftName = $("#dataSource-rasci option:selected").text();
  const dataSend = {
    draftId: draftidRasci,
    draftName: draftName,
    draftSOId: "",
    level: data.level,
    indexNumber: data.indexNumber,
    description: data.description,
  };
  setState("dataDetailProsbis", dataSend);
  openModalEditBusinesspro();
}
function checkChildrenProsbis(data) {
  if (data.hasChild !== true) {
    const draftidRasci = $("#dataSource-rasci").val();
    const draftName = $("#dataSource-rasci option:selected").text();
    const dataSend = {
      ...data,
      draftId: draftidRasci,
      draftName: draftName,
      draftSOId: "",
    };
    setState("dataDeleteProsbis", dataSend);
    openModalDeleteBusinesspro();
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
                        ${dataDeleteProsbis.indexNumber} ${dataDeleteProsbis.description}
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
    parentId: dataDeleteProsbis.indexNumber,
  };
  const result = await submitDraftProsbis(payload);
  if (result.status === 200) {
    const modalDeleteBp = document.getElementById("modalDeleteBp");
    const modalDelete = bootstrap.Modal.getInstance(modalDeleteBp);
    document.getElementById("draftName").value = "";
    const resultMatrix = await lastStateTableMatrix(payload);
    if (resultMatrix) {
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
        if (modalDelete) {
          modalDelete.hide();
        }
        const payload = {
          Page: 1,
          PageSize: 5,
        };
        const queryString = new URLSearchParams(payload).toString();
        const dataDraft = await fetchDraftProsbis(queryString);
        const IsNotEmpty = dataDraft.data.length;
        handleClickCard(IsNotEmpty);
        loadTableBodyDraft(dataDraft);
      });
    }
  }
}
