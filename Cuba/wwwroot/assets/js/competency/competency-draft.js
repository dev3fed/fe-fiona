function handleDataLoad() {
  const payload = getState("payloadDraftList");
  try {
    serviceDraftList(payload);
  } catch (error) {
    console.error("Error fetching or loading data:", error);
  }
}
document.addEventListener("dataLoaded", handleDataLoad);
document.addEventListener("DOMContentLoaded", handleDataLoad);

async function serviceDraftList(payload) {
  console.log("payload", payload);
  try {
    const queryString = new URLSearchParams(payload).toString();
    const dataDraft = await fetchDraftList(queryString);
    console.log("payload", payload);
    console.log("dataDraft", dataDraft.data);
    if (dataDraft && dataDraft.data && Array.isArray(dataDraft?.data.data)) {
      const IsNotEmpty = dataDraft?.data.data.length;
      handleClickCard(IsNotEmpty);
      loadTableBodyDraft(dataDraft.data);
      feather.replace();
    }
  } catch (error) {
    console.error("Error fetching or loading data:", error);
  }
}

$("#createdDateDraft").datepicker({
  onSelect: async function (formattedDate, date, inst) {
    let formatted = "";
    if (formattedDate) {
      const [month, day, year] = formattedDate.split("/");
      formatted = `${year}-${month}-${day}`;
    } else {
      formatted = "";
    }
    const payloadDraftList = getState("payloadDraftList");
    console.log("formatted", formatted);
    const payload = {
      ...payloadDraftList,
      Page: 1,
      filter: `Createddate:${formatted}`,
    };
    setState("payloadDraftList", payload);
    serviceDraftList(payload);
  },
});

$("#search-draftcompe").on("input", async function () {
  const searchValue = $(this).val();
  if (searchValue.length < 4 && searchValue.length !== 0) {
    return;
  }
  const payloadDraftList = getState("payloadDraftList");
  const payload = {
    ...payloadDraftList,
    search: searchValue,
    Page: 1,
  };
  setState("payloadDraftList", payload);
  serviceDraftList(payload);
});

function loadTableBodyDraft(response) {
  console.log("response", response);
  const { data: dataList, currentPage: page, pageSize, totalRecords: total } = response;
  if (!dataList || dataList.length === 0) {
    document.getElementById("body-draft").innerHTML =
      `<tr><td colspan="7" style="text-align:center;">No data available</td></tr>`;
    return;
  }
  const bodyContent = dataList
    .map((val, i) => {
      const startIndex = (page - 1) * pageSize;
      console.log("startIndex", startIndex);
      return `
        <tr>
          <th scope="row" style="text-align:center">${startIndex + i + 1}</th>
          <td>${val.draftName || "-"}</td>
          <td>${val.draftSoName || "-"}</td>
          <td>${val.createdBy ? val.createdBy : "-"}
            <br>
            <small style="color:#9F9FA5">
              ${val.createdDate ? "at " + new Date(val.createdDate).toLocaleString() : "-"}
            </small>
          </td>
          <td>${val.modifiedBy || "-"}
            <br>
            <small style="color:#9F9FA5">
              ${val.modifiedDate ? "at " + new Date(val.modifiedDate).toLocaleString() : "-"}
            </small>
          </td>
          <td style="width: 120px;text-align:center">
            <button class="btn btn-outline-primary" type="button" onclick="handleOpenDetail('${val.draftId}')">
              <i class="icon-eye"></i> 
            </button>
            <button class="btn btn-outline-danger" type="button" data-bs-toggle="modal" data-bs-target="#modalDelete" onclick="handleDeleteCompeDraft('${
              val.draftId
            }')">
              <i class="icon-trash"></i> 
            </button>
          </td>
        </tr>`;
    })
    .join("");
  const bodyTotalPage = `
    <div class="row">
        <div class="col-2"> 
        <select class="form-select digits" style="width:52%;">
          <option> 5</option>
          <option> 10</option>
          <option> 15</option>
          <option> 20</option>
        </select>
      </div>
      <div class="col-10">
        <label style="padding-top:7px;margin-left:-80px">Showing 1 to ${dataList.length} of 1 records</label>
      </div>
    </div>
  `;
  const bodyListPage = `
      <nav aria-label="Page navigation example">
        <ul class="pagination pagination-primary">
            <li class="page-item"><a class="page-link" href="javascript:void(0)" aria-label="Previous"><span aria-hidden="true">«</span><span class="sr-only">Previous</span></a></li>
            <li class="page-item"><a class="page-link" href="javascript:void(0)">1</a></li>
            <li class="page-item"><a class="page-link" href="javascript:void(0)">2</a></li>
            <li class="page-item"><a class="page-link" href="javascript:void(0)">3</a></li>
            <li class="page-item"><a class="page-link" href="javascript:void(0)" aria-label="Next"><span aria-hidden="true">»</span><span class="sr-only">Next</span></a></li>
        </ul>
      </nav>`;
  const tableBody = document.getElementById("body-draft");
  if (tableBody) {
    tableBody.innerHTML = bodyContent;
  }
  const itemsPerPage = pageSize;
  const totalPages = Math.ceil(total / itemsPerPage);
  const currentPage = page;
  const start = (page - 1) * itemsPerPage + 1;
  renderPagination(currentPage, totalPages);
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
  const payloadDraftList = getState("payloadDraftList");
  setState("payloadDraftList", { ...payloadDraftList, Page: pageNumber });
  const payload = {
    Page: pageNumber,
    PageSize: payloadDraftList.PageSize,
  };
  serviceDraftList(payload);
}

function handleChangeItemsPerPage(event) {
  const itemsPerPage = parseInt(event.target.value, 10);
  const payloadDraftList = getState("payloadDraftList");
  setState("payloadDraftList", { ...payloadDraftList, PageSize: itemsPerPage });
  const payload = {
    Page: payloadDraftList.Page,
    PageSize: itemsPerPage,
  };
  serviceDraftList(payload);
}

function openFormDraft() {
  const modal = new bootstrap.Modal(document.getElementById("modalformDraft"));
  modal.show();
  fetchSelect2Draftso("#modalformDraft", "#selects0-mainpage");
}

async function handleSaveDraft() {
  const draftNameInput = document.getElementById("input-draftname").value;
  const selectedValue = $("#selects0-mainpage").val();
  const spinner = document.getElementById("loadingSavedraft");
  spinner.style.display = "inline-block";
  const payload = {
    dataSource: selectedValue,
    draftCompName: draftNameInput,
  };
  const queryString = "?" + new URLSearchParams(payload).toString();
  try {
    const result = await fetchCreateDraft(queryString);
    const modaldraft = document.getElementById("modalformDraft");
    const modal = bootstrap.Modal.getInstance(modaldraft);
    if (result.success === true) {
      if (modal) {
        modal.hide();
      }
      let draftId = result?.data?.draftId;
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
          $("#input-draftname").val("");
          $("#selects0-mainpage").val("");
          const draftList = await fetchDraftList();
          fetctDataSourceComp(draftId);
          const IsNotEmpty = draftList.data.length;
          handleClickCard(IsNotEmpty);
          loadTableBodyDraft(draftList.data);
          feather.replace();
        });
      }, 100);
    } else {
      modal.hide();
      $("#input-draftname").val("");
      $("#selects0-mainpage").val("");
      spinner.style.display = "none";
      setTimeout(() => {
        swal({
          title: "FAILED",
          icon: "error",
          buttons: false,
          timer: 2000,
          content: {
            element: "div",
            attributes: {
              innerHTML: `<div style="text-align: center;">${result.error}, please change to another draft name</div>`,
            },
          },
        });
      }, 200);
    }
  } catch (error) {
    spinner.style.display = "none";
  }
}
function openEmptyDraftCompetency() {
  const modal = new bootstrap.Modal(document.getElementById("ModalCreateEmptydraft"));
  modal.show();
  fetchSelect2Draftso("#ModalCreateEmptydraft", "#selectso-emptydraftpage");
}
function openDraftCompetency() {
  const modal = new bootstrap.Modal(document.getElementById("ModalDraftCompetency"));
  modal.show();
  fetchSelect2Draftso("#ModalDraftCompetency", "#selectso-draftpage");
}
function fetchSelect2Draftso(elementId, selectId) {
  $(selectId)
    .select2({
      dropdownParent: $(elementId),
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
            type: "draft-so",
          };
        },
        processResults: function (data) {
          if (data && data.data) {
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
async function handleSubmitDraft() {
  const draftNameInput = document.getElementById("draftname-competency").value;
  const selectedValue = $("#selectso-draftpage").val();
  const spinner = document.getElementById("loadingSubmitdraft");
  spinner.style.display = "inline-block";
  const payload = {
    dataSource: selectedValue,
    draftCompName: draftNameInput,
  };
  const queryString = "?" + new URLSearchParams(payload).toString();
  try {
    const result = await fetchCreateDraft(queryString);
    const modaldraft = document.getElementById("ModalDraftCompetency");
    const modal = bootstrap.Modal.getInstance(modaldraft);
    if (result.success === true) {
      if (modal) {
        modal.hide();
      }
      fetctDataSourceComp();
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
          $("#draftname-competency").val("");
          $("#selectso-draftpage").val("");
          const draftList = await fetchDraftList();
          const IsNotEmpty = draftList.data.length;
          handleClickCard(IsNotEmpty);
          loadTableBodyDraft(draftList.data);
          feather.replace();
        });
      }, 100);
    } else {
      modal.hide();
      $("#draftname-competency").val("");
      $("#selectso-draftpage").val("");
      spinner.style.display = "none";
      setTimeout(() => {
        swal({
          title: "FAILED",
          icon: "error",
          buttons: false,
          timer: 2000,
          content: {
            element: "div",
            attributes: {
              innerHTML: `<div style="text-align: center;">${result.error}, please change to another draft name</div>`,
            },
          },
        });
      }, 200);
    }
  } catch (error) {
    spinner.style.display = "none";
  }
}
async function handleSaveEmptyDraft() {
  const draftNameInput = document.getElementById("input-emptydraftname").value;
  const selectedValue = $("#selectso-emptydraftpage").val();
  const spinner = document.getElementById("loadingEmptysavedraft");
  spinner.style.display = "inline-block";
  const payload = {
    dataSource: selectedValue,
    draftCompName: draftNameInput,
  };
  const queryString = "?" + new URLSearchParams(payload).toString();
  try {
    const result = await fetchCreateDraft(queryString);
    const modaldraft = document.getElementById("ModalCreateEmptydraft");
    const modal = bootstrap.Modal.getInstance(modaldraft);
    if (result.success === true) {
      if (modal) {
        modal.hide();
      }
      fetctDataSourceComp();
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
          $("#input-emptydraftname").val("");
          $("#selectso-emptydraftpage").val("");
          const draftList = await fetchDraftList();
          const IsNotEmpty = draftList.data.length;
          console.log("draftList", draftList);
          handleClickCard(IsNotEmpty);
          loadTableBodyDraft(draftList.data);
          feather.replace();
        });
      }, 100);
    } else {
      modal.hide();
      $("#input-emptydraftname").val("");
      $("#selectso-emptydraftpage").val("");
      spinner.style.display = "none";
      setTimeout(() => {
        swal({
          title: "FAILED",
          icon: "error",
          buttons: false,
          timer: 2000,
          content: {
            element: "div",
            attributes: {
              innerHTML: `<div style="text-align: center;">${result.error}, please change to another draft name</div>`,
            },
          },
        });
      }, 200);
    }
  } catch (error) {
    spinner.style.display = "none";
  }
}
// end section create draft competency

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

function handleDeleteCompeDraft(id) {
  setState("deleteDraftCompetency", id);
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
const confirmDeletecompeDraft = async () => {
  const id = getState("deleteDraftCompetency");
  const spinBtn = document.getElementById("btnspin-deletedraft");
  if (spinBtn) spinBtn.style.display = "inline-block";
  try {
    const deleteResult = await fetchDeleteDraft(id);
    if (deleteResult.success === true) {
      const modalDelDraft = document.getElementById("modalDelete");
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
        if (spinBtn) spinBtn.style.display = "none";
      });
    }
  } catch (error) {}
  // remove from draft list
};

async function handleOpenDetail(id) {
  console.log("first", id);
  try {
    const draftDetail = document.getElementById("draft-detail");
    const mainCompetency = document.getElementById("main-competency");
    const headerCompetency = document.getElementById("header-competency");
    const headerDetail = document.getElementById("header-detail-draft");
    const payloadDetailDraftPage = getState("payloadDetailDraftPage");

    if (draftDetail) {
      draftDetail.style.display = "block";
    }
    if (mainCompetency) {
      mainCompetency.style.display = "none";
    }
    if (headerDetail) {
      headerDetail.style.display = "block";
    }
    if (headerCompetency) {
      headerCompetency.style.display = "none";
    }
    const payload = {
      Page: payloadDetailDraftPage.Page,
      PageSize: payloadDetailDraftPage.PageSize,
    };
    const queryString = `${id}?` + new URLSearchParams(payload).toString();
    const detailResult = await fetchDetailDraft(queryString);
    if (detailResult.success === true) {
      setState("dataDetailDraft", detailResult.data);
    }
  } catch (error) {}
  // const dataDraft = await fetchDraftProsbisByid(id);
  // if (dataDraft.status === 200) {
  //   const dataDetail = dataDraft.data.draftDetail[0];
  //   const dataInfo = dataDraft.data.draftInfo;
  //   const notation = JSON.parse(dataDetail.rasciNotation);
  //   setState("editDrafProsbis", {
  //     draftName: dataInfo.draftName,
  //     type: dataInfo.typeDetail,
  //     rasciNotation: notation,
  //     level: dataDetail.level,
  //     name: dataDetail.busProsNameAfter,
  //     jobTitleId: dataDetail?.jobTitle.id,
  //     parentId: dataDetail?.parentId,
  //     parentIndex: dataDetail?.parentIndex,
  //     name: dataDetail?.busProsNameBefore,
  //   });
  //   setState("dataDetailDraft", dataDraft.data);
  // }
}

function handleBack() {
  const draftDetail = document.getElementById("draft-detail");
  const mainCompetency = document.getElementById("main-competency");
  const headerCompetency = document.getElementById("header-competency");
  const headerDetail = document.getElementById("header-detail-draft");
  const headerActivity = document.getElementById("header-activity-competency");
  const payload = getState("payloadDraftList");
  setState("dataDetailDraft", {});
  const draftInfo = document.getElementById("draft-competencyinfo");
  if (draftInfo) draftInfo.innerHTML = "";
  const emptyActivity = document.getElementById("empty-activity");
  if (emptyActivity) emptyActivity.innerHTML = "";
  const tblActivity = document.getElementById("draftactivity-competency");
  if (tblActivity) tblActivity.innerHTML = "";
  if (headerActivity) headerActivity.style.display = "none";
  if (draftDetail) {
    draftDetail.style.display = "none";
  }
  if (mainCompetency) {
    mainCompetency.style.display = "block";
  }
  if (headerDetail) {
    headerDetail.style.display = "none";
  }
  if (headerCompetency) {
    headerCompetency.style.display = "block";
  }
  serviceDraftList(payload);
}
