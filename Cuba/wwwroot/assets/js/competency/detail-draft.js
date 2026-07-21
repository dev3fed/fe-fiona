async function detailDraft() {
  try {
    const dataDraft = getState("dataDetailDraft");
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
          <label style="font-weight: 600;font-size: 14px">${dataDraft.draftSoName}</label>
        </div>
        <div class="col-3 custom-col">
          <label style="color:#9F9FA5">Created by</label>
          <label style="font-weight: 600;font-size: 14px">${
            dataDraft.draftCreatedBy ? dataDraft.draftCreatedBy : "-"
          }</label>
          <label style="color:#9F9FA5">${
            dataDraft.draftCreatedDate ? new Date(dataDraft.draftCreatedDate).toLocaleDateString() : "-"
          }</label>
        </div>
        <div class="col-3 custom-col">
          <label style="color:#9F9FA5">Updated by</label>
          <label style="font-weight: 600;font-size: 14px">${
            dataDraft.draftUpdatedBy ? dataDraft.draftUpdatedBy : "-"
          }</label>
          <label style="color:#9F9FA5">${
            dataDraft.draftUpdatedDate ? new Date(dataDraft.draftUpdatedDate).toLocaleDateString() : "-"
          }</label>
        </div>`;
      const draftInfo = document.getElementById("draft-competencyinfo");
      if (draftInfo) draftInfo.innerHTML = bodyInfo;
      console.log("dataDraft?.totalRecords", dataDraft?.totalRecords);
      const headerActivity = document.getElementById("header-activity-competency");
      if (dataDraft?.totalRecords > 0) {
        if (headerActivity) headerActivity.style.display = "block";
        renderTableActivity(dataDraft);
      } else {
        const bodyEmpty = `
          <div class="empty-activity-body">
            <button class="btn btn-primary" type="button">
              <img src="/assets/images/icon_import.svg" alt="Filter Icon" style="margin-top: -5px;">  Import
            </button>
          </div>
        `;
        const emptyActivity = document.getElementById("empty-activity");
        if (emptyActivity) emptyActivity.innerHTML = bodyEmpty;
      }
      const isWarning = dataDraft.draftSO.isApproved;
      if (isWarning === false) {
        document.getElementById("warning-draft-competency").style.display = "block";
        const soName = dataDraft.draftSO.draftName || "N/A";
        const warning = document.getElementById("warning-draft-competency");
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
                          <th scope="col" style="width: 250px">Competency</th>
                          <th scope="col" style="width: 150px">Created By</th>
                          <th scope="col" style="width: 150px">Updated By</th>
                          <th scope="col" style="width: 100px;text-align: center;">Action</th>

                      </tr>
                  </thead>
                  <tbody id="body-draft">
                      ${
                        listData?.data.length === 0
                          ? `<tr>
                            <td colspan="7" style="text-align: center; color: #9F9FA5;">
                              Data not available
                            </td>
                          </tr>`
                          : listData?.data
                              .map((data, index) => {
                                const startIndex = (listData.currentPage - 1) * listData.pageSize;
                                return `
                              <tr>
                                <td style="width: 50px;text-align:center">
                                  ${startIndex + index + 1}
                                </td>
                                <td>
                                  ${data.activityType || "-"}
                                </td>
                                <td>
                                  ${
                                    data?.positionName
                                      ? `<div class="long-text" data-bs-toggle="tooltip" data-bs-placement="bottom" 
                                         title="${data.jobCode} - ${data.positionName}">
                                         ${data.jobCode} - ${data.positionName}
                                         </div>`
                                      : "-"
                                  }
                                </td>
                                <td>
                                  ${
                                    data?.competencyName
                                      ? `<div class="long-text" data-bs-toggle="tooltip" data-bs-placement="bottom" 
                                         title=" ${data.competencyName}">
                                          ${data.competencyName}
                                         </div>` +
                                        (data.totalCompetency > 1
                                          ? `<small style="color:#9F9FA5;cursor: pointer">+${data.totalCompetency} more</small>`
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
                                  ${data.updatedBy || "-"}<br>
                                  <small style="color:#9F9FA5">
                                    ${data.updatedDate ? "at " + new Date(data.updatedDate).toLocaleString() : "-"}
                                  </small>
                                </td>
                                <td style="text-align: center;">
                                  <button class="btn btn-outline-light btn-small-icon" type="button" 
                                    onclick="triggleDetailActivity('${data.positionCode}')">
                                    <img src="/assets/images/rasci/icon_detail.svg" alt="Detail Icon">
                                  </button>  
                                  <button class="btn btn-outline-danger btn-small-icon" type="button" onclick="deleteActivityDraft('${
                                    data.positionCode
                                  }')">
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

    const draftDetail = document.getElementById("draftactivity-competency");
    if (draftDetail) {
      draftDetail.innerHTML = bodyDetail;
    }
    const itemsPerPage = listData.pageSize;
    const totalPages = Math.ceil(listData.totalRecords / itemsPerPage);
    const currentPage = listData.currentPage;
    const start = (listData.currentPage - 1) * itemsPerPage + 1;
    renderPaginationDetailDraft(currentPage, totalPages);
    const totalPage = document.getElementById("total-pagedraft");

    if (totalPage) {
      totalPage.innerHTML = `
          <div class="row">
            <div class="col-2">
              <select class="form-select digits"  style="width:62%;" id="limitDetailPage" onchange="handleChangeDetailItemsPerPage(event)">
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
                listData.totalRecords < itemsPerPage * listData.currentPage
                  ? listData.totalRecords
                  : itemsPerPage * listData.currentPage
              } of ${listData.totalRecords} records</label>
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

const handleRename = async () => {
  const modal = new bootstrap.Modal(document.getElementById("modalRenameDraft"));
  modal.show();
  const dataDraft = getState("dataDetailDraft");
  const draftRename = document.getElementById("draftRename");
  if (draftRename && dataDraft) {
    draftRename.value = dataDraft.draftName || "";
  }
};

const handleSubmitRenameDraft = async () => {
  try {
    const draftNameInput = document.getElementById("draftRename").value;
    const dataDraft = getState("dataDetailDraft");
    const spinner = document.getElementById("loadingRenameDraft");
    spinner.style.display = "inline-block";
    const payload = {
      draftId: dataDraft.draftId,
      draftCompName: draftNameInput,
    };
    const result = await fetchRenameDraft(payload);
    const modalRenameDraft = document.getElementById("modalRenameDraft");
    const modal = bootstrap.Modal.getInstance(modalRenameDraft);
    if (modal) modal.hide();
    const draftName = result?.data?.data.draftName;
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
              innerHTML: `<div style="text-align: center;">${draftName} has been change</div>`,
            },
          },
          customClass: {
            popup: "swal-custom-popup",
          },
        }).then(async () => {
          spinner.style.display = "none";
          const detailResult = await fetchDetailDraft(dataDraft.draftId);
          if (detailResult.success === true) {
            setState("dataDetailDraft", detailResult.data);

            await fetctDataSourceComp(dataDraft.draftId);
            await fetctListDatasource(dataDraft.draftId);
          }
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
          const detailResult = await fetchDetailDraft(dataDraft.draftId);
          if (detailResult.success === true) {
            setState("dataDetailDraft", detailResult.data);
          }
        });
      }, 200);
    }
  } catch (error) {}
};

const deleteDetailDraft = () => {
  const dataDraft = getState("dataDetailDraft");
  const modal = new bootstrap.Modal(document.getElementById("modalDraftDelete"));
  modal.show();
};

async function confirmDeleteDetailcompeDraft() {
  const { draftId } = getState("dataDetailDraft");
  const spinBtn = document.getElementById("btnspin-deletedetaildraft");
  if (spinBtn) spinBtn.style.display = "inline-block";
  try {
    const deleteResult = await fetchDeleteDraft(draftId);
    if (deleteResult.success === true) {
      const modalDelDraft = document.getElementById("modalDraftDelete");
      const modal = bootstrap.Modal.getInstance(modalDelDraft);
      if (modal) {
        modal.hide();
      }
      fetctDataSourceComp();
      const listDraft = await fetchDraftList();
      const IsNotEmpty = listDraft.data.length;
      changeemptyPageDraft(IsNotEmpty);
      loadTableBodyDraft(listDraft.data);
      swal({
        title: "SUCCESS",
        icon: "success",
        buttons: false,
        timer: 2000,
        content: {
          element: "div",
          attributes: {
            innerHTML: `<div style="text-align: center;">${deleteResult.data.draftName} draft has been deleted.</div>`,
          },
        },
      }).then(() => {
        spinBtn.style.display = "none";
        handleBack();
      });
    }
  } catch (error) {}
}

async function openDetailApproval() {
  const openModal = new bootstrap.Modal(document.getElementById("modalDraftAprroval"));
  openModal.show();
}

async function handleSubmitApproval() {
  try {
    const dataDraft = getState("dataDetailDraft");
    const spinBtn = document.getElementById("spinbtnSaveDraft");
    if (spinBtn) spinBtn.style.display = "inline-block";
    const result = await fetchSubmitDraftCompetency(dataDraft.draftId);
    const modalDetailAprroval = document.getElementById("modalDraftAprroval");
    const modal = bootstrap.Modal.getInstance(modalDetailAprroval);
    if (result.success === true) {
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
              innerHTML: `<div style="text-align: center;">${dataDraft.draftName} draft has been submit to approval. You can check in approval tab.</div>`,
            },
          },
        }).then(async () => {
          spinBtn.style.display = "none";
          handleBack();
        });
      }, 100);
    }
  } catch (error) {}
}

async function handleDetailPageChange(pageNumber) {
  const payloadDetailDraftPage = getState("payloadDetailDraftPage");
  const payload = {
    ...payloadDetailDraftPage,
    Page: pageNumber,
    PageSize: payloadDetailDraftPage.PageSize,
  };
  setState("payloadDetailDraftPage", payload);
  const dataDraft = getState("dataDetailDraft");
  const queryString = `${dataDraft.draftId}?` + new URLSearchParams(payload).toString();
  const detailResult = await fetchDetailDraft(queryString);
  console.log("detailResult", detailResult);
  renderTableActivity(detailResult.data);
}
async function handleChangeDetailItemsPerPage(event) {
  const itemsPerPage = parseInt(event.target.value, 10);
  const payloadDetailDraftPage = getState("payloadDetailDraftPage");

  const payload = {
    ...payloadDetailDraftPage,
    Page: payloadDetailDraftPage.Page,
    PageSize: itemsPerPage,
  };
  setState("payloadDetailDraftPage", payload);
  const dataDraft = getState("dataDetailDraft");
  const queryString = `${dataDraft.draftId}?` + new URLSearchParams(payload).toString();
  const detailResult = await fetchDetailDraft(queryString);
  console.log("detailResult", detailResult);
  renderTableActivity(detailResult.data);
}

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
    const queryString = `${dataDraft.draftId}?` + new URLSearchParams(payload).toString();
    const detailResult = await fetchDetailDraft(queryString);
    console.log("detailResult", detailResult);

    renderTableActivity(detailResult.data);
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
  const queryString = `${dataDraft.draftId}?` + new URLSearchParams(payload).toString();
  const detailResult = await fetchDetailDraft(queryString);
  console.log("detailResult", detailResult);

  renderTableActivity(detailResult.data);
};

const handleActivityTypeChange = async (event) => {
  if (!event?.target?.value) return;
  const selectedValue = event.target.value;
  const payloadDetailDraftPage = getState("payloadDetailDraftPage");

  const payload = {
    ...payloadDetailDraftPage,
    Page: 1,
    PageSize: payloadDetailDraftPage.PageSize,
    filter: selectedValue,
  };
  setState("payloadDetailDraftPage", payload);
  const dataDraft = getState("dataDetailDraft");
  const queryString = `${dataDraft.draftId}?` + new URLSearchParams(payload).toString();
  const detailResult = await fetchDetailDraft(queryString);
  console.log("detailResult", detailResult);
  renderTableActivity(detailResult.data);
};
const exportDraftcompe = async () => {
  const dataDraft = getState("dataDetailDraft");
  const loader = document.getElementById("loadingExportDraftcompe");
  loader.style.display = "flex";
  try {
    const result = await fetchExportDraftcompe(dataDraft.draftId);
    if (result.success) {
      loader.style.display = "none";
    } else {
      loader.style.display = "none";
    }
  } catch (error) {}
};
