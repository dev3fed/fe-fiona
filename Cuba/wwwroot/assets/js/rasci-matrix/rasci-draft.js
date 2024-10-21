document.addEventListener("dataLoaded", async function () {
  try {
    const payload = {
      Type: "draft",
      Page: 1,
      Limit: 5,
    };
    const queryString = new URLSearchParams(payload).toString();
    const dataDraft = await fetchDraftProsbis(queryString);
    if (dataDraft && dataDraft.data && Array.isArray(dataDraft.data.data)) {
      const IsNotEmpty = dataDraft.data.data.length;
      handleClickCard(IsNotEmpty);
      loadTableBodyDraft(dataDraft.data.data);
      feather.replace();
    } else {
      console.error("No data found or invalid data structure");
    }
  } catch (error) {
    console.error("Error fetching or loading data:", error);
  }
});

document.addEventListener("DOMContentLoaded", async function () {
  try {
    const payload = {
      Type: "draft",
      Page: 1,
      Limit: 10,
    };
    const queryString = new URLSearchParams(payload).toString();
    const dataDraft = await fetchDraftProsbis(queryString);
    if (dataDraft && dataDraft.data && Array.isArray(dataDraft.data.data)) {
      const IsNotEmpty = dataDraft.data.data.length;
      handleClickCard(IsNotEmpty);
      loadTableBodyDraft(dataDraft.data.data);
      feather.replace();
    } else {
      console.error("No data found or invalid data structure");
    }
  } catch (error) {
    console.error("Error fetching or loading data:", error);
  }
});
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
function loadTableBodyDraft(dataList) {
  if (!dataList || dataList.length === 0) {
    document.getElementById(
      "tbl-add-prosbis-body",
    ).innerHTML = `<tr><td colspan="7" style="text-align:center;">No data available</td></tr>`;
    return;
  }
  const bodyContent = dataList
    .map((val, i) => {
      return `
      <tr>
        <th scope="row" style="text-align:center">${i + 1}</th>
        <td>${val.reqId || "-"}</td>
        <td>${val.draftName || "-"}</td>
        <td>${val.createBy ? val.createBy : "-"}</td>
        <td>${val.createdAt ? new Date(val.createdAt).toLocaleDateString() : "-"}</td>
        <td>${val.typeDetail || "-"}</td>
        <td style="width: 200px;text-align:center">
          <button class="btn btn-outline-primary" type="button" onclick="handleOpenDetail(${val.id})">
            <i class="icon-eye"></i> Detail
          </button>
          <button class="btn btn-outline-danger" type="button" data-bs-toggle="modal" data-bs-target="#modalDelete" onclick="handleDeleteProsbisDraft(${
            val.id
          })">
            <i class="icon-trash"></i> Delete
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
function handleBack() {
  const draftDetail = document.getElementById("draft-detail");
  const mainMatrix = document.getElementById("main-matrix");
  const headerMatrix = document.getElementById("header-matrix");
  const headerDetail = document.getElementById("header-detail-draft");
  if (draftDetail) {
    draftDetail.style.display = "none";
  }
  if (mainMatrix) {
    mainMatrix.style.display = "block";
  }
  if (headerDetail) {
    headerDetail.style.display = "none";
  }
  if (headerMatrix) {
    headerMatrix.style.display = "block";
  }
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
  if (dataDraft.status === 200) {
    const dataDetail = dataDraft.data.draftDetail[0];
    const dataInfo = dataDraft.data.draftInfo;
    const notation = JSON.parse(dataDetail.rasciNotation);
    setState("editDrafProsbis", {
      draftName: dataInfo.draftName,
      type: dataInfo.typeDetail,
      rasciNotation: notation,
      level: dataDetail.level,
      name: dataDetail.busProsNameAfter,
      jobTitleId: dataDetail?.jobTitle.id,
      parentId: dataDetail?.parentId,
      parentIndex: dataDetail?.parentIndex,
      name: dataDetail?.busProsNameBefore,
    });
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
      setState("deleteDraftProsbis", 0);
      const payload = {
        Type: "draft",
        Page: 1,
        Limit: 5,
      };
      const queryString = new URLSearchParams(payload).toString();
      const dataDraft = await fetchDraftProsbis(queryString);
      loadTableBodyDraft(dataDraft.data.data);
    }
  } catch (error) {}
}
