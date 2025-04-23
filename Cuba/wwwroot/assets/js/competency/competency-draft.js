document.addEventListener("dataLoaded", async function () {
  const draftList = getState("draftList");
  try {
    if (draftList && Array.isArray(draftList)) {
      const IsNotEmpty = draftList.length;
      handleClickCard(IsNotEmpty);
      loadTableBodyDraft(draftList);
      feather.replace();
    } else {
      console.error("No data found or invalid data structure");
    }
  } catch (error) {
    console.error("Error fetching or loading data:", error);
  }
});
document.addEventListener("DOMContentLoaded", async function () {
  const draftList = getState("draftList");
  try {
    if (draftList && Array.isArray(draftList)) {
      const IsNotEmpty = draftList.length;
      handleClickCard(IsNotEmpty);
      loadTableBodyDraft(draftList);
      feather.replace();
    } else {
      console.log("cek");
      console.error("No data found or invalid data structure");
    }
  } catch (error) {
    console.error("Error fetching or loading data:", error);
  }
});

function loadTableBodyDraft(dataList) {
  const bodyContent = dataList
    .map((val, i) => {
      return `
        <tr>
          <th scope="row" style="text-align:center">${i + 1}</th>
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
            <button class="btn btn-outline-primary" type="button" onclick="handleOpenDetail(${val.id})">
              <i class="icon-eye"></i> 
            </button>
            <button class="btn btn-outline-danger" type="button" data-bs-toggle="modal" data-bs-target="#modalDelete" onclick="handleDeleteCompeDraft(${
              val.id
            })">
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
  const totalPage = document.getElementById("total-page");
  const listPage = document.getElementById("list-page");
  if (totalPage && listPage) {
    totalPage.innerHTML = bodyTotalPage;
    listPage.innerHTML = bodyListPage;
  }
}

// start section create draft competency

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
        url: `${API_URL_COMPE}/api/Utilities/selection`,
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
  console.log("id", id);
  try {
    const deleteResult = await fetchDeleteDraft(id);
    console.log("deleteResult", deleteResult);
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
      });
    }
  } catch (error) {}
  // remove from draft list
};

async function handleOpenDetail(id) {
  try {
    const draftDetail = document.getElementById("draft-detail");
    const mainCompetency = document.getElementById("main-competency");
    const headerCompetency = document.getElementById("header-competency");
    const headerDetail = document.getElementById("header-detail-draft");
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
    const detailResult = await fetchDetailDraft(id);
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
}
