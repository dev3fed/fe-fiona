async function detailDraft() {
  try {
    const dataDraft = getState("dataDetailDraft");
    const labelStatus = {
      0: "Draft",
      1: "Approved",
      2: "Rejected",
      3: "On Review",
    };
    const STATUS_COLORS = {
      0: { bg: "#FFA800", text: "#000000" },
      1: { bg: "#D1FED3", text: "#4DB043" },
      2: { bg: "#F9E9EA", text: "#CD2536" },
      3: { bg: "#FEE9B0", text: "#B08803" },
    };

    function getStatusColor(status) {
      return STATUS_COLORS[status]?.bg ?? "#E4E6EF";
    }

    function getTextColor(status) {
      return STATUS_COLORS[status]?.text ?? "#000000";
    }
    const payload = {
      Page: 1,
      PageSize: 5,
    };
    const queryString = new URLSearchParams(payload).toString();
    const listData = await fetchDraftListProsbis(dataDraft.draftId, queryString);
    if (dataDraft) {
      const bodyInfo = `
      <div class="${dataDraft.isStatus != 0 ? "col-3" : "col-4"} custom-col" style="text-align:center">
        <label style="color:#9F9FA5; display:block">Draft Name</label>
        <div style="font-weight: 600; font-size: 14px; display:flex; flex-direction:column; align-items:center;">
          <span style="padding-left: 10px">${dataDraft.draftName}</span>
          <button class="btn btn-outline-light btn-small-icon mt-2" type="button" onclick="handleRename()">
        <img src="/assets/images/rasci/icon_pencil.svg" alt="Filter Icon">
          </button>
        </div>
      </div>
      <div class="${dataDraft.isStatus != 0 ? "col-3" : "col-4"} custom-col" style="text-align:center">
        <label style="color:#9F9FA5; display:block">Organization Data Source</label>
        <label style="font-weight: 600;font-size: 14px; display:block">${dataDraft.draftSO.draftParentName}</label>
      </div>
      <div class="col-2 custom-col" style="text-align:center">
        <label style="color:#9F9FA5; display:block">Created by</label>
        <label style="font-weight: 600;font-size: 14px; display:block">${
          dataDraft.createdBy ? dataDraft.createdBy : "-"
        }</label>
        <label style="color:#9F9FA5; display:block">${
          dataDraft.createdDate ? new Date(dataDraft.createdDate).toLocaleDateString() : "-"
        }</label>
      </div>
      <div class="col-2 custom-col" style="text-align:center">
        <label style="color:#9F9FA5; display:block">Updated by</label>
        <label style="font-weight: 600;font-size: 14px; display:block">${
          dataDraft.createdBy ? dataDraft.createdBy : "-"
        }</label>
        <label style="color:#9F9FA5; display:block">${
          dataDraft.createdDate ? new Date(dataDraft.createdDate).toLocaleDateString() : "-"
        }</label>
      </div>
      ${
        dataDraft.isStatus != 0
          ? `
       <div class="col-2 custom-col" style="text-align:center">
        <label style="color:#9F9FA5; display:block">Status</label>
        <label style="font-size: 14px;  background-color: ${getStatusColor(dataDraft.isStatus)};color: ${getTextColor(
          dataDraft.isStatus,
        )}; font-weight:500;
          width:100px;text-align:center;
          padding:8px 0;
          border-radius:4px;
          line-height:1;
          box-sizing:border-box; display:inline-block;">${labelStatus[dataDraft.isStatus] || "-"}</label>
       </div>
      `
          : ``
      }
        `;
      const draftInfo = document.getElementById("draft-info");
      if (draftInfo) draftInfo.innerHTML = bodyInfo;
    }
    const headerActivity = document.getElementById("header-activity");

    if (listData.data.length > 0) {
      if (headerActivity) headerActivity.style.display = "block";
      renderTableActivity(listData);
    } else {
      const bodyEmpty = `
      <div class="empty-activity-body">
        <button class="btn btn-primary" type="button">
          <img src="/assets/images/icon_import.svg" alt="Filter Icon" style="margin-top: -5px;"> Import</button>
      </div>
    `;
      const emptyActivity = document.getElementById("empty-activity");

      if (emptyActivity) emptyActivity.innerHTML = bodyEmpty;
    }

    const isWarning = dataDraft.draftSO.isApproved;
    if (isWarning === false) {
      document.getElementById("warning-draft").style.display = "block";
      const soName = dataDraft.draftSO.draftName || "N/A";
      const warning = document.getElementById("warning-draft");
      const warningText = `
      <div style="
        display: inline-block;
        white-space: nowrap;
        background: #FFF8E1;
        border: 1px solid #8A6600;
        margin-top:12px;
        border-radius: 4px;
        padding: 6px 18px;
        color: #7A5A00;
        font-size: 12px;
        box-sizing: border-box;
        ">
        Can not submit to approval because organization data source from
        <strong style="font-weight:600; color:#554200;">${soName}</strong>
        draft has not been finalized.
      </div>
    `;
      if (warning) warning.innerHTML = warningText;
      const btnSubmit = document.getElementById("detail-draft-submitted");
      if (btnSubmit) btnSubmit.disabled = true;
    }
  } catch (error) {}
}

async function renderTableActivity(listData) {
  try {
    const bodyDetail = `

        <div class="col-12 mt-3">
          <div class="table-responsive scrollable" style=" max-height: 350px;">
              <table class="table tbl-border-add-prosbis">
                  <thead id="tbl-add-prosbis-header" style="background-color: #006CA9;">
                      <tr>
                          <th scope="col" style="width: 50px;text-align:center">
                              No
                          </th>
                          <th scope="col" style="width: 180px">Activity Type</th>
                          <th scope="col" style="width: 230px">Position</th>
                          <th scope="col" style="width: 250px">Business Process</th>
                          <th scope="col" style="width: 150px">Created By</th>
                          <th scope="col" style="width: 150px">Updated By</th>
                          <th scope="col" style="width: 100px;text-align: center;">Action</th>

                      </tr>
                  </thead>
                  <tbody id="body-draft">
                      ${
                        listData.data.length === 0
                          ? `<tr>
                            <td colspan="7" style="text-align: center; color: #9F9FA5;">
                              Data not available
                            </td>
                          </tr>`
                          : listData.data
                              .map((data, index) => {
                                const startIndex = (listData.page - 1) * listData.pageSize;
                                const jobList = Array.isArray(data.businessProcess)
                                  ? data.businessProcess.flatMap((bp) => bp.jobPosition || [])
                                  : data.businessProcess?.jobPosition || [];
                                return `
                                  <tr>
                                    <td style="width: 50px;text-align:center">
                                      ${startIndex + index + 1}
                                    </td>
                                    <td>
                                      ${data.draftType || "-"}
                                    </td>
                                    <td>
                                      ${
                                        jobList?.length
                                          ? `<div class="long-text" data-bs-toggle="tooltip" data-bs-placement="bottom" 
                                             title="${jobList[0].unitCode} - ${jobList[0].positionName}">
                                             ${jobList[0].unitCode} - ${jobList[0].positionName}
                                             </div>` +
                                            (jobList.length > 1
                                              ? `<small style="color:#9F9FA5;cursor: pointer">+${
                                                  jobList.length - 1
                                                } more</small>`
                                              : "")
                                          : "-"
                                      }
                                    </td>
                                    <td>
                                      ${
                                        data.businessProcess?.length
                                          ? `<div class="long-text" data-bs-toggle="tooltip" data-bs-placement="bottom" 
                                             title="${data.businessProcess[0].indexGroup} - ${data.businessProcess[0].description}">
                                             ${data.businessProcess[0].indexGroup} - ${data.businessProcess[0].description}
                                             </div>` +
                                            (data.businessProcess.length > 1
                                              ? `<small style="color:#9F9FA5;cursor: pointer">+${
                                                  data.businessProcess.length - 1
                                                } more</small>`
                                              : "")
                                          : "-"
                                      }
                                    </td>
                                    <td>
                                      ${data.createdBy || "-"}<br>
                                      <small style="color:#9F9FA5">
                                        ${data.createdDate ? "at " + new Date(data.createdDate).toLocaleString() : "-"}
                                      </small>
                                    </td>
                                    <td>
                                      ${data.modifiedBy || "-"}<br>
                                      <small style="color:#9F9FA5">
                                        ${
                                          data.modifiedDate ? "at " + new Date(data.modifiedDate).toLocaleString() : "-"
                                        }
                                      </small>
                                    </td>
                                    <td style="text-align: center;">
                                      <button class="btn btn-outline-light btn-small-icon" type="button" 
                                        onclick="triggleDetailActivity('${data.draftListId}', '${data.draftType}')">
                                        <img src="/assets/images/rasci/icon_detail.svg" alt="Detail Icon">
                                      </button>  
                                      ${
                                        data.draftType === "Add New Business Process"
                                          ? `<button class="btn btn-outline-light btn-small-icon" type="button" onclick="triggleEditActivitybp('${data.draftListId}')">
                                              <img src="/assets/images/rasci/icon_pencil.svg" alt="Edit Icon">
                                            </button>`
                                          : ""
                                      }
                                      <button class="btn btn-outline-danger btn-small-icon" type="button" onclick="handleDeleteDraftActivity('${
                                        data.draftListId
                                      }', '${data.draftType}')">
                                        <img src="/assets/images/rasci/icon_delete.svg" alt="Delete Icon" class="icon-svg">
                                      </button>
                                    </td>
                                  </tr>
                                `;
                              })
                              .join("")
                      }
                    </tbody>
              </table>
            </div>
        </div>
        <div class="col-9 mt-3">
            <div id="total-pagedraft">
            </div>
        </div>
        <div class="col-3 mt-3 d-flex justify-content-end" style="padding-right: 20px;">
            <div id="list-pagedraft">
            </div>
        </div>
     `;

    const draftDetail = document.getElementById("detail-prosbis");
    if (draftDetail) {
      draftDetail.innerHTML = bodyDetail;
    }
    const itemsPerPage = listData.pageSize;
    const totalPages = Math.ceil(listData.total / itemsPerPage);
    const currentPage = listData.page;
    const start = (listData.page - 1) * itemsPerPage + 1;
    renderDetailDraftPagination(currentPage, totalPages);
    const totalPage = document.getElementById("total-pagedraft");

    if (totalPage) {
      totalPage.innerHTML = `
          <div class="row">
            <div class="col-2">
              <select class="form-select digits"  style="width:62%;" id="limitDetailPage" onchange="handleChangeIDetailItemsPerPage(event)">
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
                listData.total < itemsPerPage * listData.page ? listData.total : itemsPerPage * listData.page
              } of ${listData.total} records</label>
            </div>
          </div>
        `;
    }
    let selectElement = document.getElementById("limitDetailPage");
    selectElement.value = listData.pageSize;

    initializeTooltips();
    // Inisialisasi Feather Icons
    feather.replace();
  } catch (error) {}
}
function renderDetailDraftPagination(currentPage, totalPages) {
  const paginationContainer = document.getElementById("list-pagedraft");

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
        ${currentPage === 1 ? 'tabindex="-1"' : `onclick="handleDetailPageChange(${1})"`}
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
          ${currentPage === 1 ? 'tabindex="-1"' : `onclick="handleDetailPageChange(${currentPage - 1})"`}
        >
          «
        </a>
      </li>
    `);
  for (let i = startPage; i <= endPage; i++) {
    paginationButtons.push(`
      <li class="page-item ${i === currentPage ? "active" : ""}">
        <a class="page-link" href="javascript:void(0)" onclick="handleDetailPageChange(${i})">${i}</a>
      </li>
    `);
  }

  paginationButtons.push(`
      <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
        <a 
          class="page-link" 
          href="javascript:void(0)" 
          ${currentPage === totalPages ? 'tabindex="-1"' : `onclick="handleDetailPageChange(${currentPage + 1})"`}
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
          ${currentPage === totalPages ? 'tabindex="-1"' : `onclick="handleDetailPageChange(${totalPages})"`}
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

async function handleDetailPageChange(pageNumber) {
  const payloadDetailDraftPage = getState("payloadDetailDraftPage");
  setState("payloadDetailDraftPage", {
    ...payloadDetailDraftPage,
    Page: pageNumber,
    PageSize: payloadDetailDraftPage.PageSize,
  });
  const payload = {
    Page: pageNumber,
    PageSize: payloadDetailDraftPage.PageSize,
  };
  const dataDraft = getState("dataDetailDraft");
  const queryString = new URLSearchParams(payload).toString();
  const listData = await fetchDraftListProsbis(dataDraft.draftId, queryString);
  renderTableActivity(listData);
}
async function handleChangeIDetailItemsPerPage(event) {
  const itemsPerPage = parseInt(event.target.value, 10);
  const payloadDetailDraftPage = getState("payloadDetailDraftPage");
  setState("payloadDetailDraftPage", {
    ...payloadDetailDraftPage,
    Page: payloadDetailDraftPage.Page,
    PageSize: itemsPerPage,
  });
  const payload = {
    Page: payloadDetailDraftPage.Page,
    PageSize: itemsPerPage,
  };
  const dataDraft = getState("dataDetailDraft");
  const queryString = new URLSearchParams(payload).toString();
  const listData = await fetchDraftListProsbis(dataDraft.draftId, queryString);
  renderTableActivity(listData);
}
async function handleRename() {
  const modal = new bootstrap.Modal(document.getElementById("modalRenameDraft"));
  modal.show();
  const dataDraft = getState("dataDetailDraft");
  const draftRename = document.getElementById("draftRename");
  if (draftRename && dataDraft) {
    draftRename.value = dataDraft.draftName || "";
  }
}
async function handleSubmitRenameDraft() {
  const draftRename = document.getElementById("draftRename");
  const spinner = document.getElementById("loadingRenameDraft");
  const draftId = getState("draftRasciId");
  spinner.style.display = "inline-block";
  const dataDraft = getState("dataDetailDraft");
  const payload = {
    draftName: draftRename.value,
  };
  const result = await endpointRenameDraft(dataDraft.draftId, payload);
  const modalRenameDraft = document.getElementById("modalRenameDraft");
  const modal = bootstrap.Modal.getInstance(modalRenameDraft);
  if (modal) modal.hide();
  if (result.success === true) {
    setTimeout(() => {
      swal({
        title: "SUCCESS",
        icon: "success",
        buttons: false,
        timer: 2000,
        content: {
          element: "div",
          attributes: {
            innerHTML: `<div style="text-align: center;">${result?.data.data.draftName} has been change</div>`,
          },
        },
        customClass: {
          popup: "swal-custom-popup",
        },
      }).then(async () => {
        spinner.style.display = "none";
        const id = result.data.data.draftId;
        const dataDraft = await fetchDraftProsbisByid(id);
        setState("dataDetailDraft", dataDraft.data);
        await fetchDatasource(draftId);
        await fetctListDatasource(draftId);
      });
    }, 200);
  } else {
    setTimeout(() => {
      swal({
        title: "FAILED",
        icon: "error",
        buttons: false,
        timer: 2000,
        content: {
          element: "div",
          attributes: {
            innerHTML: `<div style="text-align: center;">${draftRename.value} draft is already exist, please change to another draft name</div>`,
          },
        },
      }).then(async () => {
        spinner.style.display = "none";
        const id = result.data.data.draftId;
        const dataDraft = await fetchDraftProsbisByid(id);
        setState("dataDetailDraft", dataDraft.data);
      });
    }, 200);
  }
}
async function handleOpenDetailBp() {
  const modal = new bootstrap.Modal(document.getElementById("modalEdit"));
  modal.show();
  const prosbisLevel = getState("prosbisLevel");
  const dataDraft = getState("dataDetailDraft");
  const dataInfo = dataDraft.draftInfo;
  const dataDetail = dataDraft.draftDetail[0];
  const notation = JSON.parse(dataDetail.rasciNotation);
  try {
    const formContent = `
        <div class="col-6">
        <label class="form-label">Draft Name</label>
            <input class="form-control" type="text" id="edit-draftname" value="${
              dataInfo.draftName
            }" placeholder="Draft Name" >
        </div>
        <div class="col-6">
        <label class="form-label">Draft Type</label>
            <input class="form-control" type="text" placeholder="Draft Type" value="${dataInfo.typeDetail}" disabled>
        </div>
        <div class="col-12 mt-3 mb-2">
        <h6 class="f-w-600">Business Process Info</h6>
        </div>
        <div class="col-3">
            <div class="mb-3">
                <label class="form-label">Level</label>
                <select class="form-select digits" id="editLevel" onchange="onEditSelect(event)">
                  ${prosbisLevel.map(
                    (opt) =>
                      `<option value="${opt.id}" ${dataDetail.level === opt.id ? "selected" : ""}>${opt.text}</option>`,
                  )}
                </select>
            </div>
        </div>
        <div class="col-9">
            <div class="mb-3">
                <label class="form-label">Parent</label>
                <select 
                  class="form-select digits" 
                  name="editParentId" 
                  id="editParentId" 
                  ${dataDetail.level === 1 ? "disabled" : ""} 
                  onchange="onSelectEditParentId(event)"
                >
                  <option value="${dataDetail?.parentId}">
                    ${dataDetail?.parentIndex} ${dataDetail?.busProsNameBefore}
                  </option>
                </select>
            </div>
        </div>
        <div class="col-12">
            <div>
                <label class="form-label">Business Process Name</label>
                  <textarea class="form-control" id="edit-prosbisname">${dataDetail.busProsNameAfter}</textarea>
            </div>
            <div class="mt-3">
                <label class="form-label">Job</label>
                <select class="form-select digits" name="editJobId" id="editJobId"  onchange="onSelectEditJobId(event)">
                <option value=${dataDetail?.jobTitle.id}>${dataDetail?.jobTitle.name}</option>
          </select>
            </div>
        </div>`;
    const theadContent = `<tr>
        <th scope="col" style="width: 50px">
        Check
        </th>
        <th scope="col" style="width: 150px;text-align:center">RASCI Notation</th>
        <th scope="col">Comment (Optional)</th>
        </tr>`;
    const tdBody = notation
      .map((item) => {
        return `
              <tr>
                  <th scope="row">
                    <label class="radio-label" for="checked-body-bp">
                     <input class="checkbox_animated" id="checked-${item.RasciCode.toLowerCase()}" type="checkbox" ${
                       item.IsChecked ? "checked" : ""
                     } onclick="onCheckEdit(event, '${item.RasciCode}')" >
                    </label>
                  </th>
                  <td style="text-align:center">
                    <img src="/assets/images/rasci/${item.RasciCode.toLowerCase()}.svg" alt="${
                      item.RasciCode
                    } Icon" style="padding-right:2px">
                  </td>
                  <td>
                    <input class="form-control" type="text" placeholder="Type Comment" id="commentEdit${
                      item.RasciCode
                    }" value="${item.Comment}" ${item.IsChecked ? "" : "disabled"} oninput="updateDraftComment('${
                      item.RasciCode
                    }', this.value)">
                  </td>
              </tr>
          `;
      })
      .join("");

    document.getElementById("tbl-edit-prosbis-header").innerHTML = theadContent;
    document.getElementById("tbl-edit-prosbis-body").innerHTML = tdBody;
    const bodyContent = document.getElementById("form-content-edit");
    if (bodyContent) {
      bodyContent.innerHTML = formContent;
    }
    // Initialize Bootstrap Select
    $(".selectpicker").selectpicker();
    updateSelectEditProsbis();
    updateSelectEditJob();
  } catch (error) {
    console.error(error);
  }
}

function updateSelectEditProsbis() {
  const editDraft = getState("editDrafProsbis");
  $("#editParentId")
    .select2({
      dropdownParent: $("#modalEdit"),
      placeholder: "Choose",
      allowClear: true,
      delay: 250,
      ajax: {
        url: `${url_api}/api/Utilities/selection`,
        dataType: "json",
        data: function (params) {
          return {
            search: params.term || "",
            page: params.page || 1,
            type: "prosbis",
            level: editDraft.level,
          };
        },
        processResults: function (data) {
          if (data.data && data.data.result) {
            return {
              results: data.data.result,
              pagination: {
                more: data.data.pagination.more,
              },
            };
          }
          return { results: [] };
        },
        cache: true,
      },
      templateResult: function (item) {
        return item.text;
      },
    })
    .on("select2:open", function () {
      page = 1;
    });
}

function updateSelectEditJob() {
  $("#editJobId")
    .select2({
      dropdownParent: $("#modalEdit"),
      placeholder: "Choose",
      allowClear: true,
      delay: 250,
      ajax: {
        url: `${url_api}/api/Utilities/selection`,
        dataType: "json",
        data: function (params) {
          return {
            search: params.term || "",
            page: params.page || 1,
            type: "jobtitle",
          };
        },
        processResults: function (data) {
          if (data.data && data.data.result) {
            return {
              results: data.data.result,
              pagination: {
                more: data.data.pagination.more,
              },
            };
          }
          return { results: [] };
        },
        cache: true,
      },
      templateResult: function (item) {
        return item.text;
      },
    })
    .on("select2:open", function () {
      page = 1;
    });
}

function onEditSelect(event) {
  const value = event.target.value;
  const parentSelect = document.querySelector("#editParentId");
  if (value === "Choose" || value == 1) {
    parentSelect.disabled = true;

    if (parentSelect.value) {
      parentSelect.value = "";
      onSelectEditParentId({ target: { value: "" } });
    }
  } else {
    parentSelect.disabled = false;
  }
  setState("editDrafProsbis", { ...appState.editDrafProsbis, level: value });
}
function onSelectEditParentId(event) {
  const value = event.target.value;
  const dataProsbis = getState("editDrafProsbis");
  setState("editDrafProsbis", { ...dataProsbis, parentId: value });
}
function onSelectEditJobId(event) {
  const value = event.target.value;
  const dataProsbis = getState("editDrafProsbis");
  setState("editDrafProsbis", { ...dataProsbis, jobTitleId: value });
}
function onCheckEdit(event, rasciCode) {
  const isChecked = event.target.checked;
  const commentInput = document.getElementById(`commentEdit${rasciCode}`);
  commentInput.disabled = !isChecked;
  commentInput.value = isChecked ? commentInput.value : "";
  const dataProsbis = getState("editDrafProsbis");
  const updatedRasciNotation = dataProsbis.rasciNotation.map((letter) => {
    if (letter.RasciCode === rasciCode) {
      return {
        ...letter,
        IsChecked: isChecked,
        Comment: isChecked ? commentInput.value : "",
      };
    }
    return letter;
  });

  setState("editDrafProsbis", {
    ...dataProsbis,
    rasciNotation: updatedRasciNotation,
  });
}
function updateDraftComment(rasciCode, value) {
  const dataProsbis = getState("editDrafProsbis");
  const updatedRasciNotation = dataProsbis.rasciNotation.map((letter) => {
    if (letter.RasciCode === rasciCode) {
      return { ...letter, Comment: value };
    }
    return letter;
  });
  setState("editDrafProsbis", {
    ...dataProsbis,
    rasciNotation: updatedRasciNotation,
  });
}
async function saveEditDraft() {
  const dataDraft = getState("dataDetailDraft");
  const dataProsbis = getState("editDrafProsbis");
  const draftName = document.querySelector("#edit-draftname");
  const prosbisName = document.querySelector("#edit-prosbisname");
  const level = document.querySelector("#editLevel");
  const parentId = document.querySelector("#editParentId");
  const jobId = document.querySelector("#editJobId");
  try {
    const payloadSave = {
      draftName: draftName.value,
      name: prosbisName.value,
      level: level.value,
      parentId: parentId.value,
      jobTitleId: jobId.value,
      rasciNotation: dataProsbis.rasciNotation,
    };
    const result = await updateDraftProsbis(payloadSave, dataDraft.draftInfo.id);
    if (result.status === 200) {
      const afterSave = await fetchDraftProsbisByid(dataDraft.draftInfo.id);
      setState("dataDetailDraft", afterSave.data);
      const payload = {
        Page: 1,
        PageSize: 5,
      };
      const queryString = new URLSearchParams(payload).toString();
      const dataTableDraft = await fetchDraftProsbis(queryString);
      loadTableBodyDraft(dataTableDraft);
    }
  } catch (error) {
    console.log(error);
  }
}

async function openDetailApproval() {
  const openModal = new bootstrap.Modal(document.getElementById("modalDraftAprroval"));
  openModal.show();
}
async function handleSubmitApproval() {
  const dataDraft = getState("dataDetailDraft");
  try {
    const result = await draftSubmittoApproval(dataDraft.draftId);
    const modalDetailAprroval = document.getElementById("modalDraftAprroval");
    const modal = bootstrap.Modal.getInstance(modalDetailAprroval);
    if (result.status === 200) {
      if (modal) {
        modal.hide();
      }
      setTimeout(() => {
        swal({
          title: "SUCCESS",
          icon: "success",
          buttons: false,
          timer: 2000,
          content: {
            element: "div",
            attributes: {
              innerHTML: `<div style="text-align: center;">Your draft has been submit to approval. You can check in approval list tab.</div>`,
            },
          },
        }).then(async () => {
          backFromModalBp();
          const payload = {
            Type: "approval",
            Page: 1,
            Limit: 10,
          };
          const queryString = new URLSearchParams(payload).toString();
          const dataApproval = await fetchDraftProsbis(queryString);
          handleBack();
          const IsNotEmpty = dataApproval.data.data.length;
          handleApprovalList(IsNotEmpty);
          loadTableBodyApproval(dataApproval.data.data);
          $("#pills-approval-tab").tab("show");
        });
      }, 100);
    }
  } catch (error) {}
}

function deleteDraftFromdetail() {
  const dataDraft = getState("dataDetailDraft");
  const openModal = new bootstrap.Modal(document.getElementById("modalDeleteDraft"));
  openModal.show();
  setState("deleteDraftProsbis", dataDraft?.draftId);
}

async function confirmDeleteDetailDraft() {
  const id = getState("deleteDraftProsbis");
  try {
    const result = await deleteProsbisDraft(id);
    if (result.status === 200) {
      const modalDelDraft = document.getElementById("modalDeleteDraft");
      const modal = bootstrap.Modal.getInstance(modalDelDraft);
      if (modal) {
        modal.hide();
      }
      handleBack();
      setState("deleteDraftProsbis", 0);
      const payload = {
        Page: 1,
        PageSize: 5,
      };
      const queryString = new URLSearchParams(payload).toString();
      const dataDraft = await fetchDraftProsbis(queryString);
      const IsNotEmpty = dataDraft.data.length;
      changeemptyPageDraft(IsNotEmpty);
      loadTableBodyDraft(dataDraft);
    }
  } catch (error) {}
}
const handleActivityTypeChange = async (event) => {
  if (!event?.target?.value) return;
  const selectedValue = event.target.value;
  const payloadDetailDraftPage = getState("payloadDetailDraftPage");

  const payload = {
    ...payloadDetailDraftPage,
    Page: 1,
    PageSize: payloadDetailDraftPage.PageSize,
    Filter: `drafttype=${selectedValue}`,
  };
  console.log("payload", payloadDetailDraftPage);
  setState("payloadDetailDraftPage", payload);
  const dataDraft = getState("dataDetailDraft");
  const queryString = new URLSearchParams(payload).toString();
  const detailResult = await fetchDraftListProsbis(dataDraft.draftId, queryString);
  console.log("detailResult", detailResult);
  renderTableActivity(detailResult);
};

const inputSearchActivity = async (event) => {
  const searchValue = event.target.value;

  if (searchValue.length === 0) {
    const payloadDetailDraftPage = getState("payloadDetailDraftPage");

    const payload = {
      ...payloadDetailDraftPage,
      Page: 1,
      PageSize: payloadDetailDraftPage.PageSize,
      Search: "",
    };
    setState("payloadDetailDraftPage", payload);
    const dataDraft = getState("dataDetailDraft");
    const queryString = new URLSearchParams(payload).toString();
    const detailResult = await fetchDraftListProsbis(dataDraft.draftId, queryString);
    console.log("detailResult", detailResult);

    renderTableActivity(detailResult);
    return;
  }

  if (searchValue.length < 3) {
    return;
  }

  const payloadDetailDraftPage = getState("payloadDetailDraftPage");

  const payload = {
    ...payloadDetailDraftPage,
    Page: 1,
    PageSize: payloadDetailDraftPage.PageSize,
    Search: searchValue,
  };
  setState("payloadDetailDraftPage", payload);
  const dataDraft = getState("dataDetailDraft");
  const queryString = new URLSearchParams(payload).toString();
  const detailResult = await fetchDraftListProsbis(dataDraft.draftId, queryString);
  console.log("detailResult", detailResult);

  renderTableActivity(detailResult);
};

const exportDraftrasci = async () => {
  const dataDraft = getState("dataDetailDraft");
  const loader = document.getElementById("loadingExportDraftrasci");
  loader.style.display = "flex";
  try {
    const result = await fetchExportDraftrasci(dataDraft.draftId);
    if (result.success) {
      loader.style.display = "none";
    } else {
      loader.style.display = "none";
    }
  } catch (error) {}
};
