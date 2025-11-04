const detailApproval = async () => {
  try {
    const detailApproval = getState("dataDetailAproval");
    console.log("detailApproval", detailApproval);
    const labelStatus = {
      0: "Draft",
      1: "Approved",
      2: "Rejected",
      3: "On Review",
    };
    function getStatusColor(status) {
      switch (status) {
        case 0:
          return "#FFA800";
        case 1:
          return "#D1FED3";
        case 2:
          return "#F9E9EA";
        case 3:
          return "#FEE9B0";
        default:
          return "#E4E6EF";
      }
    }
    function getTextColor(status) {
      switch (status) {
        case 0:
          return "#000000";
        case 1:
          return "#4DB043";
        case 2:
          return "#CD2536";
        case 3:
          return "#B08803";
        default:
          return "#000000";
      }
    }
    const payload = {
      Page: 1,
      PageSize: 5,
    };
    const queryString = new URLSearchParams(payload).toString();
    const listData = await fetchDraftListProsbis(detailApproval.draftId, queryString);
    const btnReject = document.getElementById("btn-reject");
    const btnApprove = document.getElementById("btn-approve");
    const isHidden = detailApproval && [1, 2].includes(Number(detailApproval.isStatus));
    if (btnReject) btnReject.style.display = isHidden ? "none" : "inline-block";
    if (btnApprove) btnApprove.style.display = isHidden ? "none" : "inline-block";
    if (detailApproval) {
      const infoBody = `
     <div class="col-3 custom-col">
        <label style="color:#9F9FA5">Draft Name</label>
        <label style="font-weight: 600;font-size: 14px">${detailApproval.draftName || "-"}</label>
        <label>-</label>
    </div>
    <div class="col-3 custom-col">
        <label style="color:#9F9FA5">Organization Data Source</label>
        <label style="font-weight: 600;font-size: 14px">${detailApproval.draftSO?.draftName || "-"}</label>
    </div>
    <div class="col-2 custom-col">
        <label style="color:#9F9FA5">Submitted Date</label>
        <label style="font-weight: 600;font-size: 14px">${detailApproval.modifiedBy || "-"}</label>
        <label>${detailApproval.modifiedDate ? new Date(detailApproval.modifiedDate).toLocaleDateString() : "-"}</label>
    </div>
    <div class="col-2 custom-col">
        <label style="color:#9F9FA5">Approval/Reject Date</label>
        <label style="font-weight: 600;font-size: 14px">${
          detailApproval.approvedDate ? new Date(detailApproval.approvedDate).toLocaleDateString() : "-"
        }</label>
    </div>
    <div class="col-2 custom-col">
        <label style="color:#9F9FA5">Status</label>
        <label style="font-weight: 600;font-size: 14px;background-color: ${getStatusColor(
          detailApproval.isStatus,
        )};color: ${getTextColor(detailApproval.isStatus)}; font-weight:500;
          width:100px;text-align:center;
          padding:8px 0;
          border-radius:4px;
          line-height:1;
          box-sizing:border-box; display:inline-block;">${labelStatus[detailApproval.isStatus] || "-"}</label>
    </div>`;
      if (listData.data.length > 0) {
        console.log("listData", listData);
        renderTableActivityApproval(listData);
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
  } catch (error) {}
};

const renderTableActivityApproval = (listData) => {
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
                                        onclick="triggleDetailActivityApproval('${data.draftListId}', '${
                                  data.draftType
                                }')">
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

    const draftDetail = document.getElementById("detail-activityapproval");
    if (draftDetail) {
      draftDetail.innerHTML = bodyDetail;
    }
    const itemsPerPage = listData.pageSize;
    const totalPages = Math.ceil(listData.total / itemsPerPage);
    const currentPage = listData.page;
    const start = (listData.page - 1) * itemsPerPage + 1;
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
        listData.total < itemsPerPage * listData.page ? listData.total : itemsPerPage * listData.page
      } of ${listData.total} records</label>
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

async function changeActivityApprovalItemsPerPage(event) {
  const itemsPerPage = parseInt(event.target.value, 10);
  const payloadDetailDraftPage = getState("payloadDetailDraftPage");
  setState("payloadDetailDraftPage", {
    ...payloadDetailDraftPage,
    PageSize: itemsPerPage,
  });
  const payload = {
    Page: payloadDetailDraftPage.Page,
    PageSize: itemsPerPage,
  };
  const dataDraft = getState("dataDetailAproval");
  const queryString = new URLSearchParams(payload).toString();
  const listData = await fetchDraftListProsbis(dataDraft.draftId, queryString);
  renderTableActivityApproval(listData);
}

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
  setState("payloadDetailDraftPage", {
    ...payloadDetailDraftPage,
    Page: pageNumber,
  });
  const payload = {
    Page: pageNumber,
    PageSize: payloadDetailDraftPage.PageSize,
  };
  const dataDraft = getState("dataDetailAproval");
  const queryString = new URLSearchParams(payload).toString();
  const listData = await fetchDraftListProsbis(dataDraft.draftId, queryString);
  renderTableActivityApproval(listData);
}

const triggleDetailActivityApproval = async (draftId, draftType) => {
  try {
    const dataDraft = getState("dataDetailAproval");
    // const result = await fetchEditActivityCompetency(dataDraft.draftId, positionCode);
    // const modal = new bootstrap.Modal(document.getElementById("modalActivityCompe"));
    // modal.show();
    // const modalTitle = document.getElementById("modalActivityCompeTitle");
    // if (modalTitle) {
    //   modalTitle.innerHTML = `Activity Detail Add/Edit Competency to Position `;
    // }

    // renderTableActivityApproval(result.data);
  } catch (error) {
    console.error("Error fetching activity competency:", error);
  }
};

const handleOpenApprovalModal = async () => {
  try {
    const detailApproval = getState("dataDetailAproval");
    const modal = new bootstrap.Modal(document.getElementById("modalApproved"));
    modal.show();
    const modalTitle = document.getElementById("modalApprovedLabel");
    if (modalTitle) {
      modalTitle.innerHTML = `Are you sure want to approve this <b>${detailApproval.draftName}</b> draft?`;
    }
  } catch (error) {
    console.error("Error approving:", error);
  }
};

const handleApprove = async () => {
  try {
    const detailApproval = getState("dataDetailAproval");
    console.log("detailApproval", detailApproval);
    const spinBtn = document.getElementById("spinbtnApprove");
    if (spinBtn) spinBtn.style.display = "inline-block";

    const result = await fetchApproved(detailApproval.draftId);
    console.log("first", result);

    if (result.success === true) {
      const modalElement = document.getElementById("modalApproved");
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
        const dataApproval = await fetchDraftProsbisByid(detailApproval.draftId);
        console.log(dataApproval);
        if (dataApproval.status === 200) {
          setState("dataDetailAproval", dataApproval.data);
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
    const detailApproval = getState("dataDetailAproval");
    const rejectComment = document.getElementById("rejectComment")?.value || "";
    const spinBtn = document.getElementById("spinbtnReject");
    if (spinBtn) spinBtn.style.display = "inline-block";
    const queryString = `${detailApproval.draftId}/${rejectComment}`;
    const result = await fetchReject(queryString);

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
        const dataApproval = await fetchDraftProsbisByid(detailApproval.draftId);
        console.log(dataApproval);
        if (dataApproval.status === 200) {
          setState("dataDetailAproval", dataApproval.data);
        }
      });
    }
  } catch (error) {}
};
