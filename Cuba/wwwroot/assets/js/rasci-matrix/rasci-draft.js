function handleDataLoad() {
  const payload = {
    Page: 1,
    PageSize: 5,
  };
  try {
    serviceDraftList(payload);
  } catch (error) {
    console.error("Error fetching or loading data:", error);
  }
}

document.addEventListener("dataLoaded", handleDataLoad);
document.addEventListener("DOMContentLoaded", handleDataLoad);

async function serviceDraftList(payload) {
  try {
    const queryString = new URLSearchParams(payload).toString();
    const dataDraft = await fetchDraftProsbis(queryString);
    if (dataDraft && dataDraft.data && Array.isArray(dataDraft.data)) {
      const IsNotEmpty = dataDraft.data.length;
      handleClickCard(IsNotEmpty);
      loadTableBodyDraft(dataDraft);
      feather.replace();
    }
  } catch (error) {
    console.error("Error fetching or loading data:", error);
  }
}
function handleClickCard(length) {
  const tableDraft = document.getElementById("table-draft");
  const emptyCard = document.getElementById("empty-draft");
  if (tableDraft && length > 0) {
    tableDraft.style.display = "block";
  }
  if (emptyCard && length > 0) {
    emptyCard.style.display = "none";
  }
}
function changeemptyPageDraft(length) {
  const tableDraft = document.getElementById("table-draft");
  const emptyCard = document.getElementById("empty-draft");
  if (tableDraft && length === 0) {
    tableDraft.style.display = "none";
  }
  if (emptyCard && length === 0) {
    emptyCard.style.display = "block";
  }
}
function loadTableBodyDraft(response) {
  const { data: dataList, page, pageSize, total } = response;

  if (!dataList || dataList.length === 0) {
    document.getElementById(
      "body-draft",
    ).innerHTML = `<tr><td colspan="7" style="text-align:center;">No data available</td></tr>`;
    return;
  }
  console.log("dataList", dataList);
  const bodyContent = dataList
    .map((val, i) => {
      const startIndex = (page - 1) * pageSize;
      return `
      <tr>
        <th scope="row" style="text-align:center">${startIndex + i + 1}</th>
        <td>${val.draftName || "-"}</td>
        <td>${val.orgName || "-"}</td>
        <td>${val.createdBy || "-"}
          <br>
          <small style="color:#9F9FA5">${
            val.createdDate ? "at " + new Date(val.createdDate).toLocaleDateString() : "-"
          }</small>
        </td>
        <td>${val.modifiedBy || "-"}
          <br>
          <small style="color:#9F9FA5">${
            val.modifiedDate ? "at " + new Date(val.modifiedDate).toLocaleDateString() : "-"
          }</small>
        </td>
        <td style="width: 100px;text-align:center">
          <button class="btn btn-outline-primary" type="button" onclick="handleOpenDetail('${val.draftId}')">
            <i class="icon-eye"></i> 
          </button>
          <button class="btn btn-outline-danger" type="button" data-bs-toggle="modal" data-bs-target="#modalDelete" onclick="handleDeleteProsbisDraft('${
            val.draftId
          }')">
            <i class="icon-trash"></i> 
          </button>
        </td>
      </tr>`;
    })
    .join("");

  const tableBody = document.getElementById("body-draft");
  if (tableBody) {
    tableBody.innerHTML = bodyContent;
  }

  const itemsPerPage = pageSize;
  const totalPages = Math.ceil(total / itemsPerPage);
  const currentPage = page;
  const start = (page - 1) * itemsPerPage + 1;
  renderPagination(currentPage, totalPages);

  // const limitPageSelect = document.getElementById("limitPage");
  // if (limitPageSelect) {
  //   limitPageSelect.value = pageSize;
  // }

  const totalPage = document.getElementById("total-page");

  if (totalPage) {
    totalPage.innerHTML = `
      <div class="row">
        <div class="col-2">
          <select class="form-select digits"  style="width:62%;" id="limitPage" onchange="handleChangeItemsPerPage(event)">
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
      total < itemsPerPage * page ? total : itemsPerPage * page
    } of ${total} records</label>
        </div>
      </div>
    `;
  }
  let selectElement = document.getElementById("limitPage");
  selectElement.value = pageSize;
}

function renderPagination(currentPage, totalPages) {
  const paginationContainer = document.getElementById("list-page");
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
        ${currentPage === 1 ? 'tabindex="-1"' : `onclick="handlePageChange(${1})"`}
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
          ${currentPage === 1 ? 'tabindex="-1"' : `onclick="handlePageChange(${currentPage - 1})"`}
        >
          «
        </a>
      </li>
    `);
  for (let i = startPage; i <= endPage; i++) {
    paginationButtons.push(`
      <li class="page-item ${i === currentPage ? "active" : ""}">
        <a class="page-link" href="javascript:void(0)" onclick="handlePageChange(${i})">${i}</a>
      </li>
    `);
  }

  paginationButtons.push(`
      <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
        <a 
          class="page-link" 
          href="javascript:void(0)" 
          ${currentPage === totalPages ? 'tabindex="-1"' : `onclick="handlePageChange(${currentPage + 1})"`}
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
          ${currentPage === totalPages ? 'tabindex="-1"' : `onclick="handlePageChange(${totalPages})"`}
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

function handlePageChange(pageNumber) {
  console.log(`Change to page ${pageNumber}`);
  const payloadDraftList = getState("payloadDraftList");
  setState("payloadDraftList", { ...payloadDraftList, Page: pageNumber });
  const payload = {
    Page: pageNumber,
    PageSize: payloadDraftList.PageSize,
  };
  console.log("payload", payload);
  serviceDraftList(payload);
}

function handleChangeItemsPerPage(event) {
  const itemsPerPage = parseInt(event.target.value, 10);

  // Update payloadDraftList state
  const payloadDraftList = getState("payloadDraftList");
  setState("payloadDraftList", { ...payloadDraftList, PageSize: itemsPerPage });

  // Prepare payload for service request
  const payload = {
    Page: payloadDraftList.Page,
    PageSize: itemsPerPage,
  };

  // Call the service function to fetch data
  serviceDraftList(payload);
}

function handleBack() {
  // const draftDetail = document.getElementById("draft-detail");
  // const mainMatrix = document.getElementById("main-matrix");
  // const headerMatrix = document.getElementById("header-matrix");
  // const headerDetail = document.getElementById("header-detail-draft");
  // if (draftDetail) {
  //   draftDetail.style.display = "none";
  // }
  // if (mainMatrix) {
  //   mainMatrix.style.display = "block";
  // }
  // if (headerDetail) {
  //   headerDetail.style.display = "none";
  // }
  // if (headerMatrix) {
  //   headerMatrix.style.display = "block";
  // }
  // set window reload
  window.location.reload();
}
async function handleOpenDetail(id) {
  const draftDetail = document.getElementById("draft-detail");
  const mainMatrix = document.getElementById("main-matrix");
  const headerMatrix = document.getElementById("header-matrix");
  const headerDetail = document.getElementById("header-detail-draft");
  if (draftDetail) {
    draftDetail.style.display = "block";
  }
  if (mainMatrix) {
    mainMatrix.style.display = "none";
  }
  if (headerDetail) {
    headerDetail.style.display = "block";
  }
  if (headerMatrix) {
    headerMatrix.style.display = "none";
  }
  const dataDraft = await fetchDraftProsbisByid(id);
  console.log("first", dataDraft);
  if (dataDraft.status === 200) {
    // const dataDetail = dataDraft.data.draftDetail[0];
    // const dataInfo = dataDraft.data.draftInfo;
    // const notation = JSON.parse(dataDetail.rasciNotation);
    // setState("editDrafProsbis", {
    //   draftName: dataInfo.data.draftName,
    //   type: dataInfo.typeDetail,
    //   rasciNotation: notation,
    //   level: dataDetail.level,
    //   name: dataDetail.busProsNameAfter,
    //   jobTitleId: dataDetail?.jobTitle.id,
    //   parentId: dataDetail?.parentId,
    //   parentIndex: dataDetail?.parentIndex,
    //   name: dataDetail?.busProsNameBefore,
    // });
    setState("dataDetailDraft", dataDraft.data);
  }
}

function handleDeleteProsbisDraft(id) {
  setState("deleteDraftProsbis", id);
}

async function confirmDeleteProsbisDraft() {
  const id = getState("deleteDraftProsbis");
  try {
    const result = await deleteProsbisDraft(id);
    if (result.status === 200) {
      const modalDelDraft = document.getElementById("modalDelete");
      const modal = bootstrap.Modal.getInstance(modalDelDraft);
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
              innerHTML: `<div style="text-align: center;">draft has been deleted</div>`,
            },
          },
        }).then(async () => {
          setState("deleteDraftProsbis", "");
          const payload = {
            Page: 1,
            PageSize: 5,
          };
          const queryString = new URLSearchParams(payload).toString();
          const dataDraft = await fetchDraftProsbis(queryString);
          const IsNotEmpty = dataDraft.data.length;
          changeemptyPageDraft(IsNotEmpty);
          loadTableBodyDraft(dataDraft);
        });
      }, 100);
    }
  } catch (error) {}
}

async function handleSaveDraft() {
  const draftNameInput = document.getElementById("input-draftname").value;
  const spinner = document.getElementById("loadingSavedraft");
  spinner.style.display = "inline-block";
  const payload = {
    draftName: draftNameInput,
    draftSOId: "5d64fe52-3b91-4d21-a5b9-e5e809460392",
  };
  try {
    const result = await createDraftRasci(payload);
    console.log(result);
    if (result.success === true) {
      const modaldraft = document.getElementById("modalformDraft");
      const modal = bootstrap.Modal.getInstance(modaldraft);
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
              innerHTML: `<div style="text-align: center;">${result?.data.draftName} draft has been saved</div>`,
            },
          },
        }).then(async () => {
          spinner.style.display = "none";
          const payload = {
            Page: 1,
            PageSize: 5,
          };
          const queryString = new URLSearchParams(payload).toString();
          const dataDraft = await fetchDraftProsbis(queryString);
          if (dataDraft.data && Array.isArray(dataDraft.data)) {
            const IsNotEmpty = dataDraft.data.length;
            handleClickCard(IsNotEmpty);
            loadTableBodyDraft(dataDraft);
            feather.replace();
          }
        });
      }, 100);
    }
  } catch (error) {}
}

async function handleSaveEmptyDraft() {
  const emptydraftNameInput = document.getElementById("input-emptydraftname").value;
  const spinner = document.getElementById("loadingEmptysavedraft");
  spinner.style.display = "inline-block";
  const payload = {
    draftName: emptydraftNameInput,
    draftSOId: "5d64fe52-3b91-4d21-a5b9-e5e809460392",
  };
  try {
    const result = await createDraftRasci(payload);
    if (result.success === true) {
      const modaldraft = document.getElementById("modalformEmptydraft");
      const modal = bootstrap.Modal.getInstance(modaldraft);
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
              innerHTML: `<div style="text-align: center;">${result?.data.draftName} draft has been saved</div>`,
            },
          },
        }).then(async () => {
          spinner.style.display = "none";
          const payload = {
            Page: 1,
            PageSize: 5,
          };
          const queryString = new URLSearchParams(payload).toString();
          const dataDraft = await fetchDraftProsbis(queryString);
          if (dataDraft && dataDraft.data && Array.isArray(dataDraft.data)) {
            const IsNotEmpty = dataDraft.data.length;
            handleClickCard(IsNotEmpty);
            loadTableBodyDraft(dataDraft);
            feather.replace();
          }
        });
      }, 100);
    }
  } catch (error) {}
}
