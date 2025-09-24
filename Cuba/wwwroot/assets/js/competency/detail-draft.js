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
      console.log("dataDraft?.data.length", dataDraft?.data.length);
      if (dataDraft?.data.length > 0) {
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
            <button class="btn btn-outline-light btn-rounded" type="button">
              Upload
            </button>
            <button class="btn btn-outline-light btn-rounded" type="button">
              Add/Edit Competency to Position
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
            <img src="/assets/images/icon_import.svg" alt="Filter Icon" style="margin-top: -5px;">  Import</button>
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
    const totalPages = Math.ceil(listData.totalPages / itemsPerPage);
    const currentPage = listData.currentPage;
    const start = (listData.currentPage - 1) * itemsPerPage + 1;
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
        listData.totalPages < itemsPerPage * listData.currentPage
          ? listData.totalPages
          : itemsPerPage * listData.currentPage
      } of ${listData.totalPages} records</label>
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
    console.log("result", result);
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
// const handleDraftDetailCompetency = async (id) => {
//   console.log("id", id);
//   const competencyList = getState("competencyList");
//   const dataDetail = await fetchCompetencyDetail(id);
//   const findcompetencyList = competencyList.find((compe) => compe.id === dataDetail.data.idcompetency);
//   console.log("dataDetail", dataDetail);
//   const modal = new bootstrap.Modal(document.getElementById("modalDraftDetailCompe"));
//   modal.show();

//   const formContent = `
//     <div class="col-12 scrollable-content" style="min-height: 620px;">
//         <div class="mb-2">
//           <h6>${findcompetencyList.competency_name} </h6>
//         </div>

//         <div class="custom-card-approval">
//             <div class="header-card-approval">
//                 Detail
//             </div>
//             <div>
//                 <div class=" custom-row-full">
//                     <label>${dataDetail?.data.definition}</label>
//                 </div>
//             </div>
//         </div>
//         <div class="custom-card-approval">
//             <div class="header-card-approval">
//                 Level 1 (Basic)
//             </div>
//             <div style="padding-top: 10px;">
//                 <div class=" custom-row-full">
//                     <ul style="list-style-type: disc; margin-left: 20px;font-size: 13px;">
//                     ${dataDetail?.data.level1.map((item) => `<li> ${item}</li>`).join("")}
//                     </ul>
//                 </div>
//             </div>
//         </div>
//         <div class="custom-card-approval">
//             <div class="header-card-approval">
//               Level 2 (Intermediate)
//             </div>
//             <div style="padding-top: 10px;">
//                 <div class=" custom-row-full">
//                     <ul style="list-style-type: disc; margin-left: 20px;font-size: 13px;">
//                     ${dataDetail?.data.level2.map((item) => `<li> ${item}</li>`).join("")}
//                     </ul>
//                 </div>
//             </div>
//         </div>
//         <div class="custom-card-approval">
//             <div class="header-card-approval">
//                 Level 3 (Advance)
//             </div>
//             <div style="padding-top: 10px;">
//                 <div class=" custom-row-full">
//                    <ul style="list-style-type: disc; margin-left: 20px;font-size: 13px;">
//                     ${dataDetail?.data.level3.map((item) => `<li> ${item}</li>`).join("")}
//                     </ul>
//                 </div>
//             </div>
//         </div>
//         <div class="custom-card-approval">
//             <div class="header-card-approval">
//                 Level 4 (Mastery)
//             </div>
//             <div style="padding-top: 10px;">
//                 <div class=" custom-row-full">
//                     <ul style="list-style-type: disc; margin-left: 20px;font-size: 13px;">
//                     ${dataDetail?.data.level4.map((item) => `<li> ${item}</li>`).join("")}
//                     </ul>
//                 </div>
//             </div>
//         </div>
//     </div>
//     <div class="col-12">
//   `;

//   const modalBodyContent = document.getElementById("body-draftdetailcompe");
//   if (modalBodyContent) {
//     modalBodyContent.innerHTML = formContent;
//   }
// };

// const triggleEditCompetency = () => {
//   const dataDraft = getState("dataDetailDraft");
//   console.log("dataDraft", dataDraft);
//   const modal = new bootstrap.Modal(document.getElementById("modalDraftEditdepth"));
//   modal.show();

//   const formEditDepth = `
//         <div class="col-6">
//         <label class="form-label">Draft Name</label>
//             <input class="form-control" type="text" id="edit-draftname"  placeholder="Draft Name" >
//         </div>
//         <div class="col-6">
//         <label class="form-label">Draft Type</label>
//             <input class="form-control" type="text" placeholder="Draft Type"  disabled>
//         </div>
//         <div class="col-12 mt-3 mb-2">
//         <h6 class="f-w-600">Job Title & Technical Competency Info</h6>
//         </div>
//         <div class="col-12 mt-2 mb-2">
//         <label class="form-label">Job</label>
//             <input class="form-control" type="text" placeholder="Job"  disabled>
//         </div>
//          <div class="col-12 mt-2 mb-2">
//         <label class="form-label">Skill Group</label>
//             <input class="form-control" type="text" placeholder="Skill Group">
//         </div>
//          <div class="col-12 mt-2 mb-2">
//         <label class="form-label">Sub Skill Group</label>
//             <input class="form-control" type="text" placeholder="Sub Skill Group">
//         </div>
//          <div class="col-12 mt-2">
//         <label class="form-label">Technical Competency</label>
//             <input class="form-control" type="text" placeholder="Technical Competency">
//         </div>
//   `;
//   const bodyContent = document.getElementById("form-content-edit");
//   if (bodyContent) {
//     bodyContent.innerHTML = formEditDepth;
//   }
// };

const deleteDetailDraft = () => {
  const dataDraft = getState("dataDetailDraft");
  console.log("dataDraft", dataDraft);
  // open modal dengan id modalDraftDelete
  const modal = new bootstrap.Modal(document.getElementById("modalDraftDelete"));
  modal.show();
};

async function confirmDeleteDetailcompeDraft() {
  const { draftId } = getState("dataDetailDraft");
  const spinBtn = document.getElementById("btnspin-deletedetaildraft");
  if (spinBtn) spinBtn.style.display = "inline-block";
  try {
    const deleteResult = await fetchDeleteDraft(draftId);
    console.log("spinBtn", spinBtn);
    console.log("deleteResult", deleteResult);
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
    console.log("result", result);
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
