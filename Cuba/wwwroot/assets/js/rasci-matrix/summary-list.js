document.addEventListener("DOMContentLoaded", function () {
  fetctListDatasource();
  feather.replace();
});

const getSummaryList = async (draftId) => {
  try {
    let statusValue = document.getElementById("status-summary").value;
    const payload = {
      // dataSource: draftId,
      dataSource: "master",
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
      type: "draft-rasci",
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
  if (resultList.data.data.length > 0) {
    const listData = resultList.data;
    const bodySummary = listData.data
      .map((element, i) => {
        let statusText = element.status || "N/A";
        let statusClass = (statusText || "").toLowerCase();
        let isNotAvailable = statusClass === "not-available" || statusClass === "not available";
        let bgColor = isNotAvailable ? "#FAE9EB" : "#b9fbc0";
        let textColor = isNotAvailable ? "#D02138" : "#16a34a";
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
        const valString = JSON.stringify(element).replace(/"/g, "&quot;");
        return `
            <tr>
              <td style="text-align:center">${startIndex + i + 1}</td>
              <td>${element.positionName || "N/A"}</td>
              <td style="text-align:center">${element.functionName || "N/A"}</td>
              <td style="text-align:center">${element.divisionName || "N/A"}</td>
              <td style="width: 120px;text-align:center">${statusHtml}</td>
              <td style="text-align:center;width: 100px;">
               <button onclick="showDetail(${valString})" data-position-name="${(element.positionName || "").replace(
                 /"/g,
                 "&quot;",
               )}" class="btn btn-outline-light d-inline-flex align-items-center justify-content-center" type="button" aria-label="Detail">
               <img src="/assets/images/rasci/icon_detail.svg" alt="Detail Icon" style="width:18px; height:18px; object-fit:contain; vertical-align:middle; margin-right:5px;">
               <span>Detail</span>
               </button> 
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
    selectElement.value = listData.meta.limit;
  }
};

const onSelectType = (text) => {
  const payloadSummary = getState("payloadSummary");
  let payload = { ...payloadSummary, keySearch: text.toLowerCase() };
  setState("payloadSummary", payload);
  document.getElementById("btnSearchType").innerText = text;
  document.getElementById("inputSearchSummary").value = "";
};

const onSearchSummary = async () => {
  try {
    const payloadSummary = getState("payloadSummary");
    let searchValue = document.getElementById("inputSearchSummary").value;
    const spinner = document.getElementById("loadingSearchSummary");
    spinner.style.display = "inline-block";
    let payload = { ...payloadSummary, searchValue: searchValue };
    setState("payloadSummary", payload);
    const result = await fetchSummaryList(payload);
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
    document.getElementById("btnSearchType").innerText = "Position";
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

const showDetail = async (val) => {
  try {
    const modal = new bootstrap.Modal(document.getElementById("ModalDetailSummary"));
    const draftSoId = getState("draftSoId");

    modal.show();
    const payload = {
      draftId: draftSoId || null,
      unitCode: val.unitCode,
    };
    const queryString = new URLSearchParams(payload).toString();
    const resultDetail = await fetchDetailJob(queryString);
    let detailInfo = resultDetail.data;
    let infoSkillGroup = resultDetail.data.skillGroups;
    let incumbent = resultDetail.data.incumbents[0];
    let division = detailInfo?.division?.divisionName || "-";
    let department = detailInfo?.department?.departmentName || "-";
    let careerType = detailInfo?.unit.careerTypeName || "-";
    let careerLevel = detailInfo?.unit.careerLevelName || "-";
    let subDivision = detailInfo?.subDivision || "-";
    let directReportTo = detailInfo?.directReportTo?.jobPositionName || "-";
    let personArea = detailInfo?.personnelArea?.personnelAreaName || "-";
    let personSubArea = detailInfo?.personnelSubArea?.personnelSubAreaName || "-";
    const JobName = `${val.positionName}`;
    const cardAttribute = `
      <div class="col-3">
          <label style="color:#9F9FA5;fonti-size:12px">Directorate</label><br/>
          <label style="font-weight: 600;font-size: 14px">${detailInfo.directorate.directorateName || "-"}</label><br/>
      </div>
       <div class="col-2">
          <label style="color:#9F9FA5;fonti-size:12px">Division</label><br/>
          <label style="font-weight: 600;font-size: 14px">${division}</label><br/>
      </div>
       <div class="col-2">
          <label style="color:#9F9FA5;fonti-size:12px">Sub Division</label><br/>
          <label style="font-weight: 600;font-size: 14px">${subDivision}</label><br/>
      </div>
       <div class="col-2">
          <label style="color:#9F9FA5;fonti-size:12px">Department</label><br/>
          <label style="font-weight: 600;font-size: 14px">${department}</label><br/>
      </div>
       <div class="col-3">
          <label style="color:#9F9FA5;fonti-size:12px">Section</label><br/>
          <label style="font-weight: 600;font-size: 14px">${detailInfo.section || "-"}</label><br/>
      </div>
      <div class="col-12">
      <hr style="margin-right: 10px">
      </div>

      <div class="col-3">
          <label style="color:#9F9FA5;fonti-size:12px">Org Unit Name</label><br/>
          <label style="font-weight: 600;font-size: 14px">${detailInfo.unit.unitName || "-"}</label><br/>
      </div>
       <div class="col-2">
          <label style="color:#9F9FA5;fonti-size:12px">Org PRL</label><br/>
          <label style="font-weight: 600;font-size: 14px">${detailInfo.unit.prlPlan || "-"}</label><br/>
      </div>
       <div class="col-2">
          <label style="color:#9F9FA5;fonti-size:12px">Career Type</label><br/>
          <label style="font-weight: 600;font-size: 14px">${careerType}</label><br/>
      </div>
       <div class="col-2">
          <label style="color:#9F9FA5;fonti-size:12px">Career Level</label><br/>
          <label style="font-weight: 600;font-size: 14px">${careerLevel}</label><br/>
      </div>
       <div class="col-3">
          <label style="color:#9F9FA5;fonti-size:12px">Direct Report</label><br/>
          <label style="font-weight: 600;font-size: 14px">${directReportTo || "-"}</label><br/>
      </div>
      <div class="col-12">
      <hr style="margin-right: 10px">
      </div>

      <div class="col-3">
          <label style="color:#9F9FA5;fonti-size:12px">Personnel Area Name</label><br/>
          <label style="font-weight: 600;font-size: 14px">${personArea || "-"}</label><br/>
      </div>
       <div class="col-3">
          <label style="color:#9F9FA5;fonti-size:12px">Personnel Sub Area Name</label><br/>
          <label style="font-weight: 600;font-size: 14px">${personSubArea || "-"}</label><br/>
      </div>
       <div class="col-6">
          <label style="color:#9F9FA5;fonti-size:12px">SK Number</label><br/>
          <label style="font-weight: 600;font-size: 14px">${
            resultDetail.data.incumbents > 0 ? incumbent.sourceOfSk : "-"
          }</label><br/>
      </div>
    `;
    const cardsgContent = `
      <div class="col-4">
      <div style="padding-top: 20px;display:flex">
          <div style="padding:10px;margin-top:10px;border:1px solid #BFBFC2;width: 100%;border-radius: 5px;">
              <label style="color:#9F9FA5;fonti-size:12px">Main Skill Group</label><br/>
              <label style="font-weight: 600;font-size: 14px">${infoSkillGroup[0]?.skillGroupName || "-"}</label><br/>

              <label class="mt-2" style="color:#9F9FA5;fonti-size:12px">Main Sub Skill Group</label><br/>
              <label style="font-weight: 600;font-size: 14px">${infoSkillGroup[0]?.subSkillGroupName || "-"}</label>
          </div>
      </div>
      </div>
      <div class="col-4">
          <div style="padding-top: 20px;display:flex">
              <div style="padding:10px;margin-top:10px;border:1px solid #BFBFC2;width: 100%;border-radius: 5px;">
                  <label style="color:#9F9FA5;fonti-size:12px">Second Skill Group</label><br/>
                  <label style="font-weight: 600;font-size: 14px">${
                    infoSkillGroup[1]?.skillGroupName || "-"
                  }</label><br/>

                  <label class="mt-2" style="color:#9F9FA5;fonti-size:12px">Second Sub Skill Group</label><br/>
                  <label style="font-weight: 600;font-size: 14px">${infoSkillGroup[1]?.subSkillGroupName || "-"}</label>
              </div>
          </div>
      </div>
      <div class="col-4 mb-2">
          <div style="padding-top: 20px;display:flex">
              <div style="padding:10px;margin-top:10px;margin-right:10px;border:1px solid #BFBFC2;width: 100%;border-radius: 5px;">
                  <label style="color:#9F9FA5;fonti-size:12px">Third Skill Group</label><br/>
                  <label style="font-weight: 600;font-size: 14px">${
                    infoSkillGroup[2]?.skillGroupName || "-"
                  }</label><br/>

                  <label class="mt-2" style="color:#9F9FA5;fonti-size:12px">Third Sub Skill Group</label><br/>
                  <label style="font-weight: 600;font-size: 14px">${infoSkillGroup[2]?.subSkillGroupName || "-"}</label>
              </div>
          </div>
      </div>
      `;
    const cardIncumbent = `
            <div class="col-3">
                <label style="color:#9F9FA5;fonti-size:12px">Employee ID</label><br/>
                <label style="font-weight: 600;font-size: 14px">${
                  resultDetail.data.incumbents.length > 0 ? incumbent?.employeeId : "-"
                }</label><br/>
            </div>
            <div class="col-3">
                <label style="color:#9F9FA5;fonti-size:12px">Employee Name</label><br/>
                <label style="font-weight: 600;font-size: 14px">${
                  resultDetail.data.incumbents.length > 0 ? incumbent?.employeeName : "-"
                }</label><br/>
            </div>
            <div class="col-6">
                <label style="color:#9F9FA5;fonti-size:12px">PRL Plan Comp</label><br/>
                <label style="font-weight: 600;font-size: 14px">${
                  resultDetail.data.incumbents.length > 0 ? incumbent?.prlPlan : "-"
                }</label><br/>
            </div>
    `;
    const attributeContent = document.getElementById("jobSummary");
    const sgContent = document.getElementById("skillSummary");
    const incContent = document.getElementById("incumbentSummary");
    const tabContent = document.getElementById("jobnameSummary");
    layoutTabRelatedSummary(val);
    if (sgContent && attributeContent) {
      tabContent.innerHTML = JobName;
      sgContent.innerHTML = cardsgContent;
      attributeContent.innerHTML = cardAttribute;
      incContent.innerHTML = cardIncumbent;
    }
  } catch (error) {}
};
const layoutTabRelatedSummary = async (data) => {
  let countR = 0;
  let countA = 0;
  let countS = 0;
  let countC = 0;
  let countI = 0;
  let countComments = 0;
  const draftidRasci = $("#dataSource-rasci").val();
  try {
    const payload = {
      unitCode: data.unitCode,
      prlOrg: data.prlOrg,
      draftRasciId: draftidRasci,
    };
    const queryString = "?" + new URLSearchParams(payload).toString();
    const result = await fetchProsbisByJob(queryString);
    if (result.success === false) return;

    result.data.forEach((item) => {
      item.rasciNotation.forEach((note) => {
        switch (note.notation) {
          case "R":
            countR++;
            break;
          case "A":
            countA++;
            break;
          case "S":
            countS++;
            break;
          case "C":
            countC++;
            break;
          case "I":
            countI++;
            break;
        }
        if (note.comment) {
          countComments++;
        }
      });
    });
    const totalJob = `
    <p>Total Business Process : ${result.data.length} |
      <img src="/assets/images/rasci/r.svg" alt="R Icon" style="margin-top:-4px;padding-left:5px"><label style="padding-left:5px">${countR}</label>
      <img src="/assets/images/rasci/a.svg" alt="A Icon" style="margin-top:-4px;padding-left:5px"><label style="padding-left:5px">${countA}</label>
      <img src="/assets/images/rasci/s.svg" alt="S Icon" style="margin-top:-4px;padding-left:5px"><label style="padding-left:5px">${countS}</label>
      <img src="/assets/images/rasci/c.svg" alt="C Icon" style="margin-top:-4px;padding-left:5px"><label style="padding-left:5px">${countC}</label>
      <img src="/assets/images/rasci/i.svg" alt="I Icon" style="margin-top:-4px;padding-left:5px"><label style="padding-left:5px">${countI}</label>
      <img src="/assets/images/rasci/comment.svg" alt="Comment Icon" style="margin-top:-4px;padding-left:5px"><label style="padding-left:5px">${countComments}</label>
    </p>`;
    theadContent = `<tr>
            <th scope="col" style="width: 60px">Level</th>
            <th scope="col" style="width: 120px">Index</th>
            <th scope="col">Business Process</th>
            <th scope="col" style="width: 140px;text-align:center">RASCI Notation</th>
          </tr>`;
    bodyContent = `<tr>
      ${result.data
        ?.map((item, index) => {
          let rasciIcons = "";
          let comments = [];
          item.rasciNotation.forEach((value) => {
            switch (value.notation) {
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

            if (value.comment) {
              comments.push(`<li>${value.notation}: ${value.comment}</li>`);
            }
          });

          if (comments.length > 0) {
            const commentTooltip = `<ul>${comments.join("")}</ul>`;
            rasciIcons += `<img src="/assets/images/rasci/comment.svg" alt="Comment Icon" style="padding-right:2px" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-html="true" title="${commentTooltip}">`;
          }

          return `<tr>

            <td>${item.level || "-"}</td>
            <td>${item.indexNumber || "-"}</td>
            <td>${item.description || "-"}</td>
            <td>
              <div class="rasci-container">
                <div class="rasci-icons">${rasciIcons}</div>
              </div>
            </td>
          </tr>`;
        })
        .join("")}`;

    document.getElementById("summary-details-header").innerHTML = theadContent;
    document.getElementById("summary-details-body").innerHTML = bodyContent;
    document.getElementById("total-summary").innerHTML = totalJob;
    initializeTooltips();
  } catch (error) {}
};
