document.addEventListener("dataLoaded", function () {
  // const jobList = getState("jobList");
  // const competencyList = getState("competencyList");
  // loadTableHeader(competencyList);
  // loadTableBody(jobList);
  feather.replace();
});

document.addEventListener("DOMContentLoaded", function () {
  // const jobList = getState("jobList");
  // const competencyList = getState("competencyList");
  let selectElement = document.querySelector("#dataSource-competency");

  selectedType = document
    .querySelector(".dropdown-menu .dropdown-item")
    .textContent.trim();

  if (selectElement.value === "master") {
    document.getElementById("pills-draft-tab").style.display = "none";
    document.getElementById("pills-approval-tab").style.display = "none";
    document.getElementById("pills-history-tab").style.display = "none";
  }
  fetctDataSourceComp();
  bodypageMandatory();
  bodypageTechnical();
  bodypageBehavior();
  // loadTableHeader(competencyList);
  // loadTableBody(jobList);
  feather.replace();
});

function fetctDataSourceComp(draftId = null) {
  $.ajax({
    url: `${url_api}/api/Utilities/selection`,
    dataType: "json",
    data: {
      type: "draft-comp",
      page: 1,
      search: "",
    },
    success: function (response) {
      if (response && response.data && response.data.result) {
        let $select = $("#dataSource-competency");
        $select.find("option:not(:first)").remove();
        response.data.result.forEach((item) => {
          let isSelected = draftId && item.id == draftId;
          $select.append(
            new Option(item.text, item.id, isSelected, isSelected),
          );
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
function onSelectType(text) {
  setState("selectedType", text);
  document.getElementById("btnSearchType").innerText = text;
  document.getElementById("inputText").value = "";
}
$(document).ready(function () {
  $("#inputText").keyup(function () {
    if ($(this).val() == "") {
      $("#btnSearchCompe").prop("disabled", true);
    } else {
      $("#btnSearchCompe").prop("disabled", false);
    }
  });
});

async function handleSearchCompetency() {
  try {
    const spinner = document.getElementById("loadingSearch");
    spinner.style.display = "inline-block";
    const searchType = getState("selectedType");
    const searchText = document.getElementById("inputText").value;
    let selectElement = document.querySelector("#dataSource-competency");
    const payloadJob = getState("payloadJob");
    const payloadCompetency = getState("payloadCompetency");
    const tableContainer = document.querySelector(".scrollable-table");

    // const storageDataCompetency = getState("storageDataCompetency");
    // const storageDataMapping = getState("storageDataMapping");
    // console.log("storageDataCompetency", storageDataCompetency);
    // console.log("storageDataMapping", storageDataMapping);
    // setState("storageDataCompetency", []);
    // setState("storageDataMapping", []);
    const payload = {
      ...payloadJob,
      dataSource: selectElement.value,
      filter: searchType,
      search: searchText,
      page: 1,
    };
    setState("payloadJob", payload);
    setState("currentPageY", 1);
    setState("currentPageX", 1);
    const queryString = "?" + new URLSearchParams(payload).toString();
    const resultJob = await fetchJobList(queryString);
    const listJobCode = resultJob.data.map((value) => value.positionCode);
    if (resultJob.data.length > 0) {
      const body = {
        ...payloadCompetency,
        dataSource: selectElement.value,
        jobCode: listJobCode,
        page: 1,
      };
      setState("payloadCompetency", body);
      const resultCompetency = await fetchCompetencyList(body);
      console.log("resultCompetency", resultCompetency);
      // const combineCompetency = [
      //   ...storageDataCompetency,
      //   ...resultCompetency.data.competency,
      // ];
      // const bodyMapping = {
      //   dataSource: selectElement.value,
      //   jobCode: resultJob.data.map((value) => value.jobCode),
      //   compCode: resultCompetency?.data.map((val) => val.compCode),
      //   page: 1,
      //   pageSize: 10,
      // };
      // const resultMapping = await fetchCompetencyMapping(bodyMapping);
      // appState.competencyMapping = resultMapping.data.level;
      // appState.jobList = resultJob.data;
      // appState.competencyList = resultCompetency?.data.competency;

      // set display id empty-competency none
      document.getElementById("empty-competency").style.display = "none";
      document.getElementById("table-competency").style.display = "block";
      // setState("storageDataCompetency", combineCompetency);
      // setState("storageDataMapping", resultCompetency.data.level);
      loadTableHeader(resultCompetency?.data.competency);
      loadTableBody(resultJob.data);
      mapCompetencyCells(
        listJobCode,
        resultCompetency.data.competency,
        resultCompetency.data.level,
      );
      tableContainer.scrollTop = 0;
      tableContainer.scrollLeft = 0;
    }
    spinner.style.display = "none";
  } catch (error) {}
}
function changeDataSource(dataSource) {
  if (dataSource !== "master") {
    document.getElementById("pills-draft-tab").style.display = "flex";
    document.getElementById("pills-approval-tab").style.display = "flex";
    document.getElementById("pills-history-tab").style.display = "flex";
    // document.getElementById("btnCreateDraft").style.display = "none";
  } else {
    document.getElementById("pills-draft-tab").style.display = "none";
    document.getElementById("pills-approval-tab").style.display = "none";
    document.getElementById("pills-history-tab").style.display = "none";
    // document.getElementById("btnCreateDraft").style.display = "flex";
  }
}

function loadTableHeader(competencyList) {
  const headerTable = document.getElementById("table-header");
  headerTable.innerHTML = renderStaticHeader(); // buat #header-row-1 dan #header-row-2

  appendDynamicHeader(competencyList); // baru di sini aman diisi
}

function renderStaticHeader() {
  return `
    <tr style="height: 30px;" id="header-row-1">
      <th rowspan="2" class="headcol head-cell" style="
        position: sticky;
        left: 0;
        top: 0;
        z-index: 5;
        background-color: #fff;
        vertical-align: middle;
        text-align: center;
      ">
        <span style="padding-left:10px;">Job Title</span>
      </th>
    </tr>
    <tr id="header-row-2" style="height: 50px;"></tr>
  `;
}

function appendDynamicHeader(competencyList) {
  const totalMandatory = competencyList.filter(
    (item) => item.compType === "mandatory",
  ).length;
  const totalGeneral = competencyList.filter(
    (item) => item.compType === "general",
  ).length;
  const totalSpecific = competencyList.filter(
    (item) => item.compType === "specific",
  ).length;

  let row1HTML = `
  <tr style="height: 30px;">
    <th rowspan="2" class="headcol head-cell" style="position:sticky; top:0; left:0; z-index:5; background:#fff; vertical-align: middle; text-align: center;">
      <span style="padding-left:10px;">Job Title</span>
    </th>`;

  if (totalMandatory > 0) {
    row1HTML += `<th class="tg-baqh competency-cell color-mandatory" colspan="${totalMandatory}" style="position:sticky; top:0; z-index:6;">Mandatory</th>`;
  }
  if (totalGeneral > 0) {
    row1HTML += `<th class="tg-baqh competency-cell color-general" colspan="${totalGeneral}" style="position:sticky; top:0; z-index:6;">General</th>`;
  }
  if (totalSpecific > 0) {
    row1HTML += `<th class="tg-baqh competency-cell color-specific" colspan="${totalSpecific}" style="position:sticky; top:0; z-index:6;">Specific</th>`;
  }

  row1HTML += `</tr>`;

  // Baris kedua: kompetensi per kolom
  let row2HTML = `<tr style="height: 50px;">`;

  competencyList.forEach((val) => {
    row2HTML += `
      <th class="color-${val.compType} competency-cell">
        <div class='competency-cell-wrapper' data-bs-toggle="tooltip" data-bs-placement="bottom"
             title="${val.compName}" onclick="handleDetailCompetency('${val.compCode}')">
          ${val.compName}
        </div>
      </th>`;
  });

  row2HTML += `</tr>`;

  // Gabungkan kedua baris
  const headerContent = row1HTML + row2HTML;
  document.getElementById("table-header").innerHTML = headerContent;

  initializeTooltips();
}

function loadTableBody(jobList) {
  const tableBody = document.getElementById("table-body");
  if (!tableBody) {
    console.error("Table body element not found");
    return;
  }

  let bodyContent = "";

  jobList?.forEach((val) => {
    const valString = JSON.stringify(val).replace(/"/g, "&quot;");

    bodyContent += `
      <tr id="tr-${val.positionCode}" class="clusterize-cluster">
        <td class="headcol" style="text-align:left;font-size:12px;font-weight: 500 !important;">
          <div class="joblist-cell-wrapper">
            <div class="flex-fill joblist-name" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-custom-class="custom-tooltip"
              title="${val.positionName}"
              onclick="handleClickPosition('${val.positionCode}', ${valString})">
              ${val.positionName}
            </div>
            <div class="ellipsis-menu prosbis-row-ellipsis">
              <div class="dropright">
                <button type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false"
                  style="border: none; background: transparent; cursor: pointer;">
                  <i class="fas fa-ellipsis-v"></i>
                </button>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  <li onclick="handleClickPosition('${val.positionCode}')">
                    <a class="dropdown-item"><img src="/assets/images/rasci/eye.svg" alt="Icon">Detail</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </td>
      </tr>
    `;
  });

  tableBody.innerHTML = bodyContent;
  feather.replace();
  initializeTooltips();
}

function handleClickPosition(positionCode) {
  const modal = new bootstrap.Modal(document.getElementById("ModalDetailPos"));
  modal.show();
  modalInfoPosition(positionCode);
  cardTblMandatory(positionCode);
  cardTblGeneral(positionCode);
  cardTblSpecific(positionCode);
  cardTblBehavior(positionCode);
  modalTabBehavior(positionCode);
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

function mapCompetencyCells(listJobCode, listCompetency, competencyMapping) {
  console.log("listJobCode", listJobCode);
  console.log("listCompetency", listCompetency);
  console.log("competencyMapping", competencyMapping);

  listJobCode.forEach((jobCode) => {
    const row = getRowById(`tr-${jobCode}`);
    if (!row) {
      console.warn(`Baris dengan ID #tr-${jobCode} tidak ditemukan!`);
      return;
    }
    row.querySelectorAll("td[data-index]").forEach((td) => td.remove());
    listCompetency.forEach((value) => {
      const competencyItem = competencyMapping.find(
        (rm) => rm.positionCode === jobCode && rm.compCode === value.compCode,
      );
      // console.log("competencyItem", competencyItem);

      const tdElement = document.createElement("td");
      tdElement.dataset.index = `${jobCode}-${value.compCode}`;

      const level = competencyItem?.level || "";

      tdElement.innerHTML = `
        <div class="competency-container">
          <div class="competency-value">
            ${level}
          </div>
          <img src="/assets/images/rasci/pencil_rasci.svg" alt="Pencil Icon" class="pencil-icon" onclick="openModalEditDepth('${jobCode}', '${value.compCode}')">
        </div>
      `;

      row.appendChild(tdElement);
    });
  });
}

const changeLevel = () => {
  const selectedValue = document.querySelector(
    'input[name="radio1"]:checked',
  ).value;
  const btnApproval = document.getElementById("btnSubmitApproval");
  btnApproval.disabled = selectedValue ? false : true;
};
const openModalSaveDraft = () => {
  const modal = new bootstrap.Modal(document.getElementById("modalSaveDraft"));
  modal.show();
};

function handleInputDraftName(value) {
  const btnSave = document.getElementById("compeSavedraft");
  if (!btnSave) {
    console.error("Button not found");
    return;
  }
  btnSave.disabled = value.length > 3 ? false : true;
}
