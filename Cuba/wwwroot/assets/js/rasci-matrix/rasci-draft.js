document.addEventListener("dataLoaded", async function () {
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
          <button class="btn btn-outline-primary" type="button" onclick="handleOpenDetail()">
            <i class="icon-eye"></i> Detail
          </button>
          <button class="btn btn-outline-danger" type="button" data-bs-toggle="modal" data-bs-target="#modalDelete">
            <i class="icon-trash"></i> Delete
          </button>
        </td>
      </tr>`;
    })
    .join("");

  const tableBody = document.getElementById("body-draft");
  if (tableBody) {
    tableBody.innerHTML = bodyContent;
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

  const url = new URL(window.location);
  url.searchParams.delete("id");
  window.history.pushState({}, "", url);
}
function handleOpenDetail() {
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
  const url = new URL(window.location);
  url.searchParams.set("id", 1);
  window.history.pushState({}, "", url);
}
