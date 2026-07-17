document.addEventListener("DOMContentLoaded", function () {
  fetctListDatasource();
  feather.replace();
});

const getSummaryListNotAvailable = async (draftId) => {
  try {
    let selectElement = document.querySelector("#dataSource-competency");
    const payload = {
      dataSource: selectElement ? selectElement.value : null,
      page: 1,
      limit: 10,
    };
    const queryString = "?" + new URLSearchParams(payload).toString();
    const resultList = await fetchNotAvailable(queryString);
    const totalRow = resultList.data.meta.totalRecords || 0;
    const warningList = document.getElementById("warning-list");
    const tableSummary = document.getElementById("table-summary");
    if (warningList) {
      if (totalRow > 0) {
        warningList.style.display = "inline-block";
        tableSummary.style.marginTop = "0px";
        warningList.innerHTML = `There are ${totalRow} positions with requirement (KKJ) are not available
          <strong style="font-weight:600; color:#D02138;cursor:pointer;" onclick="handleShowWarning()">[Click here to show]</strong>`;
      } else {
        warningList.style.display = "none";
      }
    }
  } catch (error) {
    console.error("Error fetching summary list:", error);
  }
};
const getSummaryList = async (draftId) => {
  try {
    let statusValue = document.getElementById("status-summary").value;
    let selectElement = document.querySelector("#dataSource-competency");
    console.log("statusValue", statusValue);
    const payload = {
      dataSource: selectElement ? selectElement.value : null,
      keySearch: "",
      searchValue: "",
      filter: statusValue === "all" ? ["available", "not-available", "waiting-approval", "on-progress"] : [statusValue],
      page: 1,
      limit: 10,
    };
    setState("payloadSummary", payload);
    const resultList = await fetchSummaryList(payload);
    renderTableSummary(resultList);
  } catch (error) {
    console.error("Error fetching summary list:", error);
  }
};
function fetctListDatasource(draftId = null) {
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
        let $select = $("#dataSource-summary");
        $select.find("option:not(:first)").remove(); // Hapus opsi lama kecuali yang pertama

        response.data.result.forEach((item) => {
          let isSelected = draftId && item.id == draftId;
          let $option = new Option(item.text, item.id, isSelected, isSelected);
          $($option).attr("data-draftso", item.draftSo); // Tambahkan atribut data-draftso
          $select.append($option);
        });

        if (draftId) {
          let newOption = new Option(`Draft ${draftId}`, draftId, true, true);
          $(newOption).attr("data-draftso", "your-value-here"); // Jika perlu, set manual
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
document.getElementById("status-summary").addEventListener("change", async function () {
  try {
    const statusSummary = this.value;
    const payloadSummary = getState("payloadSummary");
    const payload = {
      ...payloadSummary,
      filter:
        statusSummary === "all" ? ["available", "not available", "waiting approval", "on progress"] : [statusSummary],
    };
    setState("payloadSummary", payload);
  } catch (error) {}
});
const renderTableSummary = (resultList) => {
  if (resultList && resultList.data && Array.isArray(resultList.data.data) && resultList.data.data.length > 0) {
    const listData = resultList.data;
    const bodySummary = listData.data
      .map((element, i) => {
        // Determine status styling
        let statusText = element.kkjStatus || "N/A";
        let statusClass = (statusText || "").toLowerCase();
        let isNotAvailable = statusClass === "not-available" || statusClass === "not available";
        const valString = JSON.stringify(element).replace(/"/g, "&quot;");

        const actionButtons = isNotAvailable
          ? `<button class="btn btn-primary btn-icon" type="button" onclick='loadDetailCompeSummary(${valString})' aria-label="Add Competency">
                 <img src="/assets/images/rasci/plus.svg" alt="Filter Icon" />
                 Add Competency
               </button>`
          : `<button onclick="showDetail(${valString})" data-position-name="${(element.positionName || "").replace(
              /"/g,
              "&quot;",
            )}" class="btn btn-outline-light d-inline-flex align-items-center justify-content-center" type="button" aria-label="Detail">
                 <img src="/assets/images/rasci/icon_detail.svg" alt="Detail Icon" style="width:18px; height:18px; object-fit:contain; vertical-align:middle; margin-right:5px;">
                 <span>Detail</span>
               </button>`;
        let bgColor, textColor;
        switch (statusClass) {
          case "on progress":
            bgColor = "#FFE7C5";
            textColor = "#E18400";
            break;
          case "waiting approval":
            bgColor = "#E6F0F6";
            textColor = "#006CA9";
            break;
          case "available":
            bgColor = "#B5FFC7";
            textColor = "#009024";
            break;
          case "not-available":
          case "not available":
            bgColor = "#FAE9EB";
            textColor = "#D02138";
            break;
          default:
            bgColor = "#F5F5F5";
            textColor = "#666666";
        }
        let capitalizedStatus = statusText
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(" ");
        let statusHtml = `<span style="
          display:inline-block;
          width:120px;
          text-align:center;
          background-color:${bgColor};
          color:${textColor};
          font-weight:500;
          padding:8px 0;
          border-radius:4px;
          line-height:1;
          box-sizing:border-box;
          ">${capitalizedStatus}</span>`;
        const startIndex = (listData.meta.page - 1) * listData.meta.limit;
        return `
            <tr>
              <td style="text-align:center">${startIndex + i + 1}</td>
              <td>${element.positionName || "N/A"}</td>
              <td style="text-align:center">${element.functionName || "N/A"}</td>
              <td style="text-align:center">${element.divisionName || "N/A"}</td>
              <td style="text-align:center">${element.departmentName || "N/A"}</td>
              <td style="width: 120px;text-align:center">${statusHtml}</td>
              <td style="text-align:center;width:${isNotAvailable ? "200px" : "100px"}">
               ${actionButtons}
              </td>
            </tr>`;
      })
      .join("");
    document.getElementById("body-summary").innerHTML = bodySummary;
    const itemsPerPage = listData.meta.limit;
    const totalPages = Math.ceil(listData.meta.count / itemsPerPage);
    const currentPage = listData.meta.page;
    const start = (currentPage - 1) * itemsPerPage + 1;
    renderPaginationSummary(currentPage, totalPages);
    const totalPage = document.getElementById("total-summary-page");
    if (totalPage) {
      totalPage.innerHTML = `
          <div class="row">
            <div class="col-2">
              <select class="form-select digits"  style="width:62%;" id="limitPageSummary" onchange="changeNumberSummaryPage(event)">
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
            <div class="col-10">
              <label style="padding-top:7px;margin-left:-60px">Showing ${start} to ${
                listData.meta.count < itemsPerPage * currentPage ? listData.meta.count : itemsPerPage * currentPage
              } of ${listData.meta.count} records</label>
            </div>
          </div>
        `;
    }
    let selectElement = document.getElementById("limitPageSummary");
    if (selectElement) selectElement.value = listData.meta.limit;
  } else {
    // Handle empty or missing data: clear table, reset pagination and totals
    const meta =
      resultList && resultList.data && resultList.data.meta ? resultList.data.meta : { limit: 10, count: 0, page: 1 };
    document.getElementById("body-summary").innerHTML =
      `<tr><td colspan="6" style="text-align:center">No records found</td></tr>`;
    const currentPage = meta.page || 1;
    const totalPages = Math.max(1, Math.ceil((meta.count || 0) / (meta.limit || 1)));
    renderPaginationSummary(currentPage, totalPages);
    const totalPage = document.getElementById("total-summary-page");
    if (totalPage) {
      const start = 0;
      const end = 0;
      totalPage.innerHTML = `
          <div class="row">
            <div class="col-2">
              <select class="form-select digits"  style="width:62%;" id="limitPageSummary" onchange="changeNumberSummaryPage(event)">
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
            <div class="col-10">
              <label style="padding-top:7px;margin-left:-60px">Showing ${start} to ${end} of ${
                meta.count || 0
              } records</label>
            </div>
          </div>
        `;
    }
    let selectElement = document.getElementById("limitPageSummary");
    if (selectElement) selectElement.value = meta.limit || 10;
  }
};

const selectTypePosition = (text) => {
  const payloadSummary = getState("payloadSummary");
  let payload = { ...payloadSummary, keySearch: text.toLowerCase() };
  setState("payloadSummary", payload);
  document.getElementById("searchTypeSummary").innerText = text;
  document.getElementById("inputSearchSummary").value = "";
};
const triggerSearchSummary = async () => {
  try {
    const payloadSummary = getState("payloadSummary");
    let searchValue = document.getElementById("inputSearchSummary").value;
    const spinner = document.getElementById("loadingSearchSummary");
    spinner.style.display = "inline-block";
    let payload = { ...payloadSummary, searchValue: searchValue, page: 1, limit: 10 };
    setState("payloadSummary", payload);
    const result = await fetchSummaryList(payload);
    console.log("result", result);
    renderTableSummary(result);
    spinner.style.display = "none";
  } catch (error) {}
};
function renderPaginationSummary(currentPage, totalPages) {
  const paginationContainer = document.getElementById("list-summary-page");
  if (!paginationContainer) return;

  let pagesToShow = 3;
  let startPage = Math.max(currentPage - Math.floor(pagesToShow / 2), 1);
  let endPage = Math.min(startPage + pagesToShow - 1, totalPages);

  if (endPage - startPage + 1 < pagesToShow) {
    startPage = Math.max(endPage - pagesToShow + 1, 1);
  }

  const paginationButtons = [];
  paginationButtons.push(`
    <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
      <a 
        class="page-link" 
        href="javascript:void(0)"  
        ${currentPage === 1 ? 'tabindex="-1"' : `onclick="changePageSummary(${1})"`}
      >
      ←
      </a>
    </li>
  `);

  paginationButtons.push(`
      <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
        <a 
          class="page-link" 
          href="javascript:void(0)"  
          ${currentPage === 1 ? 'tabindex="-1"' : `onclick="changePageSummary(${currentPage - 1})"`}
        >
          «
        </a>
      </li>
    `);
  for (let i = startPage; i <= endPage; i++) {
    paginationButtons.push(`
      <li class="page-item ${i === currentPage ? "active" : ""}">
        <a class="page-link" href="javascript:void(0)" onclick="changePageSummary(${i})">${i}</a>
      </li>
    `);
  }

  paginationButtons.push(`
      <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
        <a 
          class="page-link" 
          href="javascript:void(0)" 
          ${currentPage === totalPages ? 'tabindex="-1"' : `onclick="changePageSummary(${currentPage + 1})"`}
        >
          » 
        </a>
      </li>
    `);
  paginationButtons.push(`
      <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
        <a 
          class="page-link" 
          href="javascript:void(0)" 
          ${currentPage === totalPages ? 'tabindex="-1"' : `onclick="changePageSummary(${totalPages})"`}
        >
          →
        </a>
      </li>
    `);

  paginationContainer.innerHTML = `
    <nav aria-label="Page navigation">
      <ul class="pagination id="pagination-list" pagination-primary">
        ${paginationButtons.join("")}
      </ul>
    </nav>
  `;
}

const clearSearchSummary = async () => {
  try {
    document.getElementById("inputSearchSummary").value = "";
    document.getElementById("searchTypeSummary").innerText = "Position";
    const spinner = document.getElementById("loadingClearSummary");
    spinner.style.display = "inline-block";
    const statusEl = document.getElementById("status-summary");
    let statusValue = "all";
    if (statusEl) {
      statusEl.value = statusValue;
      if (window.jQuery && $(statusEl).data("select2")) {
        $(statusEl).val(statusValue).trigger("change");
      }
    }
    const payloadSummary = getState("payloadSummary");
    let payload = {
      ...payloadSummary,
      searchValue: "",
      keySearch: "Position",
      filter: statusValue === "all" ? ["available", "not-available", "waiting-approval", "on-progress"] : [statusValue],
      page: 1,
      limit: 10,
    };

    setState("payloadSummary", payload);
    const result = await fetchSummaryList(payload);
    renderTableSummary(result);
    spinner.style.display = "none";
  } catch (error) {}
};
async function changePageSummary(pageNumber) {
  const payloadSummary = getState("payloadSummary");
  const payload = {
    ...payloadSummary,
    page: pageNumber,
    limit: payloadSummary.limit,
  };
  const result = await fetchSummaryList(payload);
  renderTableSummary(result);
  setState("payloadSummary", payload);
}
async function changeNumberSummaryPage(event) {
  const itemsPerPage = parseInt(event.target.value, 10);
  const payloadSummary = getState("payloadSummary");
  const payload = {
    ...payloadSummary,
    page: payloadSummary.page,
    limit: itemsPerPage,
  };
  setState("payloadSummary", payload);
  const result = await fetchSummaryList(payload);
  renderTableSummary(result);
}

const showDetail = async (data) => {
  try {
    const { unitCode = "", prlOrg = "" } = data;
    const modal = new bootstrap.Modal(document.getElementById("ModalSummaryInfo"));
    modal.show();
    setState("payloadDetailJob", { unitCode, prlOrg });
    modalSummaryInfoPosition(unitCode, prlOrg);
    cardTblSummaryMandatory(unitCode, prlOrg);
    // cardTblSummaryGeneral(unitCode, prlOrg);
    cardTblSummarySpecific(unitCode, prlOrg);
    cardTblSummaryBehavior(unitCode, prlOrg);
  } catch (error) {
    console.error("Error showing detail:", error);
  }
};

const loadDetailCompeSummary = async (data) => {
  try {
    let competencyList = getState("payloadAddCompetency");
    const dataSource = $("#dataSource-competency").val();
    const code = data.unitCode || "";
    const prl = data.prlOrg || "";
    const payload = `${dataSource}/${code}/${prl}`;

    const resultMandatory = await fetchDetailPositionMandatory(payload);
    const resultTechnical = await fetchDetailPositionTechnical(payload);

    if (resultMandatory.data || resultTechnical.data) {
      const listMandatory = resultMandatory?.data.compData || [];
      const listTechnical = resultTechnical?.data.compData || [];

      const transformCompetency = (element, isMandatory = false) => ({
        ...element,
        compeId: element.compCode,
        compeName: isMandatory ? element.name : element.compName,
        selectedType: element.compType,
        selectedLvl: isMandatory ? element.proficiencyLevel : element.level,
      });

      const generalCompetencies = listTechnical.filter((element) => element.compType.toLowerCase() === "general");
      const specificCompetencies = listTechnical.filter((element) => element.compType.toLowerCase() === "specific");

      competencyList = [
        ...(competencyList || []),
        ...listMandatory.map((element) => transformCompetency(element, true)),
        ...generalCompetencies.map((element) => transformCompetency(element)),
        ...specificCompetencies.map((element) => transformCompetency(element)),
      ];

      setState("jobInformation", data);
      setState("payloadAddCompetency", competencyList);
    } else {
      setState("payloadAddCompetency", []);
    }

    openAddCompetencySummary(data);
  } catch (error) {}
};

const openAddCompetencySummary = async (data) => {
  try {
    const competencyList = getState("payloadAddCompetency");
    const draftName = $("#dataSource-competency option:selected").text();
    // setState("jobInformation", data);
    const jobInformation = data || {};
    console.log("competencyList", competencyList);
    const mandatoryCompe = competencyList.filter((item) => item.selectedType === "mandatory");
    const generalCompe = competencyList.filter((item) => item.selectedType === "general");
    const specificCompe = competencyList.filter((item) => item.selectedType === "specific");
    const modal = new bootstrap.Modal(document.getElementById("ModalAddCompeSummary"));
    let mandatoryDisabled = "";
    let mandatoryLabelStyle = "";
    let generalDisabled = "";
    let generalLabelStyle = "";
    let specificDisabled = "";
    let specificLabelStyle = "";
    if (mandatoryCompe.length > 4) {
      mandatoryDisabled = "disabled";
      mandatoryLabelStyle = "background-color: #E0E0E0; color: #A0A0A0; cursor: not-allowed;";
    }
    if (generalCompe.length > 2) {
      generalDisabled = "disabled";
      generalLabelStyle = "background-color: #E0E0E0; color: #A0A0A0; cursor: not-allowed;";
    }
    if (specificCompe.length > 8) {
      specificDisabled = "disabled";
      specificLabelStyle = "background-color: #E0E0E0; color: #A0A0A0; cursor: not-allowed;";
    }

    const formContent = `
    <div class="row mb-2">
      <div class="col-12 d-flex align-items-center">
        <div style="min-width:150px; font-weight:500; margin-right:6px;">Competency Draft</div>
        <div style="margin-right:6px;">:</div>
        <div class="fw-bold flex-fill">${draftName}</div>
      </div>
    </div>

    <div class="row mb-2">
      <div class="col-12 d-flex align-items-center">
        <div style="min-width:150px; font-weight:500; margin-right:6px;">Position</div>
        <div style="margin-right:6px;">:</div>
        <div class="fw-bold flex-fill">${jobInformation.positionName || "N/A"}</div>
      </div>
    </div>

    <div class="col-12">
      <hr>
      <div class="col mb-3">
        <div class="m-t-15 m-checkbox-inline custom-radio-ml">
            <div class="form-check form-check-inline radio radio-primary">
                <input class="form-check-input" id="radioNonreference" type="radio" name="optradio" value="nonRefsummary" onchange="handleRadioChangesummary(event)" checked>
                <label class="form-check-label mb-0" for="radioNonreference">Add Technical Competency</label>
            </div>
            <div class="form-check form-check-inline radio radio-primary">
                <input class="form-check-input" id="radioReference" type="radio" name="optradio" value="refsummary" onchange="handleRadioChangesummary(event)" >
                <label class="form-check-label mb-0" for="radioReference">Add Technical Competency from Reference</label>
            </div>
        </div>
      </div>
    </div>
  `;

    const bodyJobRef = `
  <label class="form-label">Position Reference</label>
    <select class="form-select digits" name="jobidRefsummary" id="jobidRefsummary" onchange="onSelectPosrefsummary(event)">
    </select>
  `;

    const bodySelectSpecific = `
  <div class="row">
    <div class="col-12 mt-3 mb-3">
      <label>Competency</label>
      <select class="form-select digits" name="compesummaryId" id="compesummaryId" onchange="onSelectCompesummary(event)"></select>
    </div>
    <div id="sg-ssg-info" class="col-12" style="display:none;">
      <label style="color:#03a9f4; cursor:pointer;" 
             onmouseover="this.style.textDecoration='underline'" 
             onmouseout="this.style.textDecoration='none'" onclick="handleSeeDictsummary()">See dictionary</label>
      <label id="sg-ssg-label" style="display:block; margin-top:2px;"></label>
      <hr style="margin-top:20px;margin-bottom:20px"/>
    </div>
    
    <div class="option-row">
      <div>
        <label>Proficiency Level</label>
        <div class="d-flex gap-2">
          <input type="radio" class="btn-check" name="optLvl" id="level1" autocomplete="off" value="1">
          <label class="circle-option" for="level1">1</label>

          <input type="radio" class="btn-check" name="optLvl" id="level2" autocomplete="off" value="2">
          <label class="circle-option" for="level2">2</label>

          <input type="radio" class="btn-check" name="optLvl" id="level3" autocomplete="off" value="3">
          <label class="circle-option" for="level3">3</label>

          <input type="radio" class="btn-check" name="optLvl" id="level4" autocomplete="off" value="4">
          <label class="circle-option" for="level4">4</label>
        </div>
      </div>

   
    </div>
    <hr class="mt-4"/>
  </div>
  `;

    cardSelectedCompesummary(competencyList);
    document.getElementById("select-speccompesummary").innerHTML = bodySelectSpecific;
    document.getElementById("compesummaryref").innerHTML = bodyJobRef;

    const bodyContent = document.getElementById("form-compesummary");
    if (bodyContent) {
      bodyContent.innerHTML = formContent;
    }
    selectJobRefsummary();
    skillGroupsummary();
    subSkillGroupsummary();
    compesummaryList();
    modal.show();
    updateRadioButtonState();
  } catch (error) {}
};

const handleShowWarning = async () => {
  try {
    document.getElementById("status-summary").value = "not available";
    const payloadSummary = getState("payloadSummary");
    const payload = { ...payloadSummary, searchValue: "", filter: ["not available"], limit: 10, page: 1 };

    setState("payloadSummary", payload);
    const result = await fetchSummaryList(payload);

    if (result) {
      renderTableSummary(result);
    }
  } catch (error) {
    console.error("Error in handleShowWarning:", error);
  }
};

const handleSeeDictsummary = () => {
  const compesummaryId = $("#compesummaryId").val();
  console.log("Selected competency:", compesummaryId);
  handleDictsummary("Technical", compesummaryId);
};
