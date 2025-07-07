async function detailDraft() {
  try {
    const dataDraft = getState("dataDetailDraft");
    const payload = {
      Page: 1,
      PageSize: 5,
    };
    const queryString = new URLSearchParams(payload).toString();
    const listData = await fetchDraftListProsbis(dataDraft.draftId, queryString);
    console.log("dataDraft", dataDraft);
    if (dataDraft) {
      const bodyInfo = `
      <div class="col-3 custom-col">
        <label style="color:#9F9FA5">Draft Name</label>
        <div style="display: flex; align-items: center; font-weight: 600; font-size: 14px;">
          <span style="flex-grow: 1; text-align: center; padding-left: 10px">${dataDraft.draftName}</span>
             <button class=" btn btn-outline-light btn-small-icon" type="button" onclick="handleRename()">
              <img src="/assets/images/rasci/icon_pencil.svg" alt="Filter Icon">
          </button>
        </div>
      </div>
      <div class="col-3 custom-col">
        <label style="color:#9F9FA5">Organization Data Source</label>
        <label style="font-weight: 600;font-size: 14px">${dataDraft.draftSO.draftParentName}</label>
      </div>
      <div class="col-3 custom-col">
        <label style="color:#9F9FA5">Created by</label>
        <label style="font-weight: 600;font-size: 14px">${dataDraft.createdBy ? dataDraft.createdBy : "-"}</label>
        <label style="color:#9F9FA5">${
          dataDraft.createdDate ? new Date(dataDraft.createdDate).toLocaleDateString() : "-"
        }</label>
      </div>
      <div class="col-3 custom-col">
        <label style="color:#9F9FA5">Updated by</label>
        <label style="font-weight: 600;font-size: 14px">${dataDraft.createdBy ? dataDraft.createdBy : "-"}</label>
        <label style="color:#9F9FA5">${
          dataDraft.createdDate ? new Date(dataDraft.createdDate).toLocaleDateString() : "-"
        }</label>
      </div>
    `;
      const draftInfo = document.getElementById("draft-info");
      if (draftInfo) draftInfo.innerHTML = bodyInfo;
    }
    console.log("listData", listData.data);
    if (listData.data.length > 0) {
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
  } catch (error) {}
}

async function renderTableActivity(listData) {
  try {
    const bodyDetail = `
        <div class="col-12" style="text-align: left;">
           <span style="font-size:13px">Activity Type :</span>
           <button class="btn btn-outline-light btn-rounded" style="width:60px" type="button">
              All
            </button>
            <button class="btn btn-outline-light btn-rounded"  type="button">
              Upload
            </button>
            <button class="btn btn-outline-light btn-rounded" type="button">
              Add New Business Process
            </button>
            <button class="btn btn-outline-light btn-rounded" type="button">
              Add/Edit RASCI
            </button>
            <button class="btn btn-outline-light btn-rounded" type="button">
              Edit Business Process
            </button>
            <button class="btn btn-outline-light btn-rounded" type="button">
              Delete Business Process
            </button>
       </div>
       <div class="col-4  mt-3" style="text-align: left;">
          <div class="faq-form">
                <input class="form-control" type="text" placeholder="Search.."><i class="search-icon"
                    data-feather="search"></i>
            </div>
        </div>
        <div class="col-8 text-end mt-3" style="padding-right:23px">
          <button class="btn btn-primary" type="button">
          <img src="/assets/images/icon_import.svg" alt="Filter Icon" style="margin-top: -5px;"> Import</button>
            <button class="btn btn-primary" type="button">
            <img src="/assets/images/icon_export.svg" alt="Filter Icon" style="margin-top: -5px;"> Export</button>
        </div>
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
                                    data.jobPosition?.length
                                      ? `<div class="long-text" data-bs-toggle="tooltip" data-bs-placement="bottom" 
                                         title="${data.jobPosition[0].jobCode} - ${data.jobPosition[0].jobName}">
                                         ${data.jobPosition[0].jobCode} - ${data.jobPosition[0].jobName}
                                         </div>` +
                                        (data.jobPosition.length > 1
                                          ? `<small style="color:#9F9FA5;cursor: pointer">+${
                                              data.jobPosition.length - 1
                                            } more</small>`
                                          : "")
                                      : "-"
                                  }
                                </td>
                                <td>
                                  ${
                                    data.businessProcessName?.length
                                      ? `<div class="long-text" data-bs-toggle="tooltip" data-bs-placement="bottom" 
                                         title="${data.businessProcessName[0].indexGroup} - ${data.businessProcessName[0].description}">
                                         ${data.businessProcessName[0].indexGroup} - ${data.businessProcessName[0].description}
                                         </div>` +
                                        (data.businessProcessName.length > 1
                                          ? `<small style="color:#9F9FA5;cursor: pointer">+${
                                              data.businessProcessName.length - 1
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
                                    ${data.modifiedDate ? "at " + new Date(data.modifiedDate).toLocaleString() : "-"}
                                  </small>
                                </td>
                                <td style="text-align: center;">
                                  <button class="btn btn-outline-light btn-small-icon" type="button" 
                                    onclick="triggleDetailActivity('${data.draftListId}', '${data.draftType}')">
                                    <img src="/assets/images/rasci/icon_detail.svg" alt="Detail Icon">
                                  </button>  
                                  <button class="btn btn-outline-light btn-small-icon" type="button">
                                    <img src="/assets/images/rasci/icon_pencil.svg" alt="Edit Icon">
                                  </button>
                                  <button class="btn btn-outline-danger btn-small-icon" type="button">
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
    renderPaginationDetailDraft(currentPage, totalPages);
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
function renderPaginationDetailDraft(currentPage, totalPages) {
  const paginationContainer = document.getElementById("list-pagedraft");
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
  setState("payloadDetailDraftPage", { ...payloadDetailDraftPage, Page: pageNumber });
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
  setState("payloadDetailDraftPage", { ...payloadDetailDraftPage, PageSize: itemsPerPage });
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
    const payload = {
      type: "submission",
    };
    const result = await draftSubmittoApproval(payload, dataDraft.draftInfo.id);
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
  setState("deleteDraftProsbis", dataDraft?.draftInfo.id);
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
