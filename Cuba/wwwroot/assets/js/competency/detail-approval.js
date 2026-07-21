const detailApproval = () => {
  const detailApproval = getState("dataDetailApproval");
  const labelStatus = {
    0: "Draft",
    1: "Approved",
    2: "Rejected",
    3: "Submitted",
  };
  if (detailApproval) {
    const infoBody = `
     <div class="col-2 custom-col">
        <label style="color:#9F9FA5">Draft Name</label>
        <label style="font-weight: 600;font-size: 14px">${detailApproval.draftName || "-"}</label>
        <label>-</label>
    </div>
    <div class="col-3 custom-col">
        <label style="color:#9F9FA5">Organization Data Source</label>
        <label style="font-weight: 600;font-size: 14px">${detailApproval.draftSoName || "-"}</label>
    </div>
    <div class="col-3 custom-col">
        <label style="color:#9F9FA5">Submitted Date</label>
        <label style="font-weight: 600;font-size: 14px">${detailApproval.submittedBy || "-"}</label>
        <label>${
          detailApproval.submittedDate ? new Date(detailApproval.submittedDate).toLocaleDateString() : "-"
        }</label>
    </div>
    <div class="col-2 custom-col">
        <label style="color:#9F9FA5">Approval/Reject Date</label>
        <label style="font-weight: 600;font-size: 14px">${
          detailApproval.approvalDate ? new Date(detailApproval.approvalDate).toLocaleDateString() : "-"
        }</label>
    </div>
    <div class="col-2 custom-col">
        <label style="color:#9F9FA5">Status</label>
        <label style="font-weight: 600;font-size: 14px">${labelStatus[detailApproval.status] || "-"}</label>
    </div>`;
    const headerActivity = document.getElementById("header-activity-approval");
    if (detailApproval?.data.length > 0) {
      if (headerActivity) headerActivity.style.display = "block";

      renderTableActivityApproval(detailApproval);
    } else {
      const bodyEmpty = `
          <div class="empty-activity-body">
        
          </div>
        `;
      const emptyActivity = document.getElementById("empty-activityapproval");
      if (emptyActivity) emptyActivity.innerHTML = bodyEmpty;
    }
    const infoContainer = document.getElementById("info-approval");
    if (infoContainer) infoContainer.innerHTML = infoBody;
  }
};

const renderTableActivityApproval = (listData) => {
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
                                    onclick="triggleDetailActivityApproval('${data.positionCode}')">
                                    <img src="/assets/images/rasci/icon_detail.svg" alt="Detail Icon">
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
            <div id="total-pageapproval">
            </div>
        </div>
        <div class="col-3 mt-3 d-flex justify-content-end" style="padding-right: 20px;">
            <div id="list-pageapproval">
            </div>
        </div>
     `;

    const detailActivityApproval = document.getElementById("detail-activityapproval");
    if (detailActivityApproval) {
      detailActivityApproval.innerHTML = bodyDetail;
    }
    const itemsPerPage = listData.pageSize;
    const totalPages = Math.ceil(listData.totalPages / itemsPerPage);
    const currentPage = listData.currentPage;
    const start = (listData.currentPage - 1) * itemsPerPage + 1;
    renderPaginationDetailApproval(currentPage, totalPages);
    const totalPage = document.getElementById("total-pageapproval");

    if (totalPage) {
      totalPage.innerHTML = `
          <div class="row">
            <div class="col-2">
              <select class="form-select digits"  style="width:62%;" id="limitApprovalPage" onchange="changeActivityApprovalItemsPerPage(event)">
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
                listData.totalPages < itemsPerPage * listData.currentPage
                  ? listData.totalPages
                  : itemsPerPage * listData.currentPage
              } of ${listData.totalPages} records</label>
            </div>
          </div>
        `;
    }
    let selectElement = document.getElementById("limitApprovalPage");
    selectElement.value = listData.pageSize;

    initializeTooltips();
    // Inisialisasi Feather Icons
    feather.replace();
  } catch (error) {}
};

function renderPaginationDetailApproval(currentPage, totalPages) {
  const paginationContainer = document.getElementById("list-pageapproval");
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
        ${currentPage === 1 ? 'tabindex="-1"' : `onclick="handleActivityApprovalPageChange(${1})"`}
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
          ${currentPage === 1 ? 'tabindex="-1"' : `onclick="handleActivityApprovalPageChange(${currentPage - 1})"`}
        >
          «
        </a>
      </li>
    `);
  for (let i = startPage; i <= endPage; i++) {
    paginationButtons.push(`
      <li class="page-item ${i === currentPage ? "active" : ""}">
        <a class="page-link" href="javascript:void(0)" onclick="handleActivityApprovalPageChange(${i})">${i}</a>
      </li>
    `);
  }

  paginationButtons.push(`
      <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
        <a 
          class="page-link" 
          href="javascript:void(0)" 
          ${
            currentPage === totalPages
              ? 'tabindex="-1"'
              : `onclick="handleActivityApprovalPageChange(${currentPage + 1})"`
          }
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
          ${currentPage === totalPages ? 'tabindex="-1"' : `onclick="handleActivityApprovalPageChange(${totalPages})"`}
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

async function handleActivityApprovalPageChange(pageNumber) {
  const payloadDetailDraftPage = getState("payloadDetailDraftPage");
  const payload = {
    ...payloadDetailDraftPage,
    Page: pageNumber,
    PageSize: payloadDetailDraftPage.PageSize,
  };
  setState("payloadDetailDraftPage", payload);
  const dataDetailApproval = getState("dataDetailApproval");
  const queryString = `${dataDetailApproval.draftId}?` + new URLSearchParams(payload).toString();
  const detailResult = await fetchDetailDraft(queryString);

  renderTableActivityApproval(detailResult.data);
}
async function changeActivityApprovalItemsPerPage(event) {
  const itemsPerPage = parseInt(event.target.value, 10);
  const payloadDetailDraftPage = getState("payloadDetailDraftPage");

  const payload = {
    ...payloadDetailDraftPage,
    Page: payloadDetailDraftPage.Page,
    PageSize: itemsPerPage,
  };
  setState("payloadDetailDraftPage", payload);
  const dataDetailApproval = getState("dataDetailApproval");
  const queryString = `${dataDetailApproval.draftId}?` + new URLSearchParams(payload).toString();
  const detailResult = await fetchDetailDraft(queryString);
  renderTableActivityApproval(detailResult.data);
}

const triggleDetailActivityApproval = async (positionCode) => {
  try {
    const dataApproval = getState("dataDetailApproval");
    const result = await fetchEditActivityCompetency(dataApproval.draftId, positionCode);
    const modal = new bootstrap.Modal(document.getElementById("modalActivityApproval"));
    modal.show();
    const modalTitle = document.getElementById("modalActivityApprovalTitle");
    if (modalTitle) {
      modalTitle.innerHTML = `Activity Detail Add/Edit Competency to Position `;
    }

    renderTabledetailActivity(result.data);
  } catch (error) {
    console.error("Error fetching activity competency:", error);
  }
};
const renderTabledetailActivity = async (listData) => {
  try {
    // setState("dataDetailDraft", dataActivity.data);
    const detailInfo = listData;
    const contentBody = `
      <div class="row">
        <div class="col-12 ">
            <label>Position: ${detailInfo[0].jobCode} - ${detailInfo[0].positionName}</label>
            <hr style="margin-top: 0;" />
        </div>
         <div class="col-12 ">
      <div class="card-tblbusiness" style="max-height: 300px;">
        <div class="table-responsive scrollable-posdetail mt-1" style="max-height: 260px;">
        <table class="table tbl-border">
          <thead>
          <tr>
            <th scope="col" style="width: 40px;text-align:center">No</th>
            <th scope="col" style="width: 200px">Competency</th>
            <th scope="col" style="width: 100px;text-align:center">Type</th>
            <th scope="col" style="width: 80px;text-align:center">Level (Before)</th>
            <th scope="col" style="width: 80px;text-align:center">Level (After)</th>
          </tr>
          </thead>
          <tbody>
          ${detailInfo
            .map((item, idx) => {
              return `
                <tr>
                <td style="text-align:center">${idx + 1}</td>
                <td>
                ${item.competencyName || "-"}
                ${
                  item.competencyReference
                    ? `<br><small style="color:#9F9FA5">(${item.competencyReference})</small>`
                    : ""
                }
                </td>
                <td style="text-align:center">
                   ${item.competencyType || "-"}
                </td>
                <td style="text-align:center">
                  ${item.levelBefore || "-"}
                </td>
                <td style="text-align:center">
                  ${item.levelAfter || "-"}
                </td>
                </tr>
              `;
            })
            .join("")}
          </tbody>
        </table>
        </div>
      </div>
      </div>
      </div>
  `;
    const contentActivityCompe = document.getElementById("contentActivityApproval");
    if (contentActivityCompe) {
      contentActivityCompe.innerHTML = contentBody;
    }
    feather.replace();
    initializeTooltips();
  } catch (error) {}
};

const handleOpenApprovalModal = async () => {
  try {
    const detailApproval = getState("dataDetailApproval");
    const modal = new bootstrap.Modal(document.getElementById("modalApproval"));
    modal.show();
    const modalTitle = document.getElementById("modalApprovalLabel");
    if (modalTitle) {
      modalTitle.innerHTML = `Are you sure want to approve this <b>${detailApproval.draftName}</b> draft?`;
    }
  } catch (error) {
    console.error("Error approving:", error);
  }
};

const handleApprove = async () => {
  try {
    const detailApproval = getState("dataDetailApproval");
    console.log("detailApproval", detailApproval);
    const spinBtn = document.getElementById("spinbtnApprove");
    if (spinBtn) spinBtn.style.display = "inline-block";
    const payload = {
      draftId: detailApproval.draftId,
      IsApproved: true,
    };
    const queryString = "?" + new URLSearchParams(payload).toString();
    console.log("queryString", queryString);
    const result = await fetchIsApproved(queryString);
    console.log("first", result);

    if (result.success === true) {
      const modalElement = document.getElementById("modalApproval");
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) modal.hide();
      swal({
        title: "SUCCESS",
        icon: "success",
        buttons: false,
        timer: 2000,
        content: {
          element: "div",
          attributes: {
            innerHTML: `<span style="text-align: center;">APPROVED</span>
          <br>
          <span>You can check in <b>${detailApproval.draftName}</b> draft has been approved.</span>
          `,
          },
        },
      }).then(async () => {
        spinBtn.style.display = "none";
        const detailResult = await fetchDetailDraft(detailApproval.draftId);
        console.log("detailResult", detailResult);
        if (detailResult.success === true) {
          setState("dataDetailApproval", detailResult.data);
        }
      });
    }
  } catch (error) {}
};
const handleOpenRejectModal = async () => {
  try {
    const modal = new bootstrap.Modal(document.getElementById("ModalReject"));
    modal.show();
  } catch (error) {
    console.error("Error rejecting approval:", error);
  }
};

const handleReject = async () => {
  try {
    const detailApproval = getState("dataDetailApproval");
    const rejectComment = document.getElementById("rejectComment")?.value || "";
    const spinBtn = document.getElementById("spinbtnReject");
    if (spinBtn) spinBtn.style.display = "inline-block";
    const payload = {
      draftId: detailApproval.draftId,
      comment: rejectComment,
      IsApproved: false,
    };
    const queryString = "?" + new URLSearchParams(payload).toString();
    const result = await fetchIsApproved(queryString);

    if (result.success === true) {
      const modalElement = document.getElementById("ModalReject");
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) modal.hide();
      swal({
        title: "SUCCESS",
        icon: "success",
        buttons: false,
        timer: 2000,
        content: {
          element: "div",
          attributes: {
            innerHTML: `<span style="text-align: center;">APPROVED</span>
          <br>
          <span>You can check in <b>${detailApproval.draftName}</b> draft has been approved.</span>
          `,
          },
        },
      }).then(async () => {
        spinBtn.style.display = "none";
        const detailResult = await fetchDetailDraft(detailApproval.draftId);
        if (detailResult.success === true) {
          setState("dataDetailApproval", detailResult.data);
        }
      });
    }
  } catch (error) {}
};

const inputSearchAppChange = async (event) => {
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
    const dataDetailApproval = getState("dataDetailApproval");
    const queryString = `${dataDetailApproval.draftId}?` + new URLSearchParams(payload).toString();
    const detailResult = await fetchDetailDraft(queryString);

    renderTableActivityApproval(detailResult.data);
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
  const dataDetailApproval = getState("dataDetailApproval");
  const queryString = `${dataDetailApproval.draftId}?` + new URLSearchParams(payload).toString();
  const detailResult = await fetchDetailDraft(queryString);
  renderTableActivityApproval(detailResult.data);
};

const handleAppChange = async (event) => {
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
  const dataDetailApproval = getState("dataDetailApproval");
  const queryString = `${dataDetailApproval.draftId}?` + new URLSearchParams(payload).toString();
  const detailResult = await fetchDetailDraft(queryString);
  renderTableActivityApproval(detailResult.data);
};
