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
}

function handleSaveDraft() {
  const draftNameInput = document.getElementById("input-draftname").value;
  const spinner = document.getElementById("loadingSavedraft");
  spinner.style.display = "inline-block";
  const payload = {
    draftName: draftNameInput,
    draftSOId: "5d64fe52-3b91-4d21-a5b9-e5e809460392",
  };
  console.log("payload", payload);
  // try {
  //   const result = createDraftRasci(payload);
  //   if (result.success === true) {
  //     const modaldraft = document.getElementById("modalformDraft");
  //     const modal = bootstrap.Modal.getInstance(modaldraft);
  //     if (modal) {
  //       modal.hide();
  //     }
  //     setTimeout(() => {
  //       swal({
  //         title: "SUCCESS",
  //         icon: "success",
  //         buttons: false,
  //         timer: 2000,
  //         content: {
  //           element: "div",
  //           attributes: {
  //             innerHTML: `<div style="text-align: center;">Usulan perubahan KKJ divisi HC draft has been saved</div>`,
  //           },
  //         },
  //       });
  //     }, 1000);
  //     setTimeout(() => {
  //       spinner.style.display = "none";
  //     }, 2000);
  //   } else {
  //     spinner.style.display = "none";
  //   }
  // } catch (error) {
  //   spinner.style.display = "none";
  // }
}
function openDraftCompetency() {
  const modal = new bootstrap.Modal(document.getElementById("ModalDraftCompetency"));
  modal.show();
}
function handleSubmitDraft() {
  const draftNameInput = document.getElementById("input-draftname").value;
  const spinner = document.getElementById("loadingSavedraft");
  spinner.style.display = "inline-block";
  const payload = {
    draftName: draftNameInput,
    draftSOId: "5d64fe52-3b91-4d21-a5b9-e5e809460392",
  };
  console.log("payload", payload);
  // try {
  //   const result = createDraftRasci(payload);
  //   if (result.success === true) {
  //     const modaldraft = document.getElementById("modalformDraft");
  //     const modal = bootstrap.Modal.getInstance(modaldraft);
  //     if (modal) {
  //       modal.hide();
  //     }
  //     setTimeout(() => {
  //       swal({
  //         title: "SUCCESS",
  //         icon: "success",
  //         buttons: false,
  //         timer: 2000,
  //         content: {
  //           element: "div",
  //           attributes: {
  //             innerHTML: `<div style="text-align: center;">Usulan perubahan KKJ divisi HC draft has been saved</div>`,
  //           },
  //         },
  //       });
  //     }, 1000);
  //     setTimeout(() => {
  //       spinner.style.display = "none";
  //     }, 2000);
  //   } else {
  //     spinner.style.display = "none";
  //   }
  // } catch (error) {
  //   spinner.style.display = "none";
  // }
}
function handleSaveEmptyDraft() {
  const draftNameInput = document.getElementById("draftname-competency").value;
  const spinner = document.getElementById("loadingSubmitdraft");
  spinner.style.display = "inline-block";
  const payload = {
    draftName: draftNameInput,
    draftSOId: "5d64fe52-3b91-4d21-a5b9-e5e809460392",
  };
  console.log("payload", payload);
  // try {
  //   const result = createDraftRasci(payload);
  //   if (result.success === true) {
  //     const modaldraft = document.getElementById("modalformDraft");
  //     const modal = bootstrap.Modal.getInstance(modaldraft);
  //     if (modal) {
  //       modal.hide();
  //     }
  //     setTimeout(() => {
  //       swal({
  //         title: "SUCCESS",
  //         icon: "success",
  //         buttons: false,
  //         timer: 2000,
  //         content: {
  //           element: "div",
  //           attributes: {
  //             innerHTML: `<div style="text-align: center;">Usulan perubahan KKJ divisi HC draft has been saved</div>`,
  //           },
  //         },
  //       });
  //     }, 1000);
  //     setTimeout(() => {
  //       spinner.style.display = "none";
  //     }, 2000);
  //   } else {
  //     spinner.style.display = "none";
  //   }
  // } catch (error) {
  //   spinner.style.display = "none";
  // }
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
