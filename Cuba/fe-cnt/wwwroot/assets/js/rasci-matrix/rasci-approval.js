document.addEventListener("dataLoaded", async function () {
  try {
    const payload = {
      Type: "approval",
      Page: 1,
      Limit: 10,
    };
    const queryString = new URLSearchParams(payload).toString();
    const dataApproval = await fetchDraftProsbis(queryString);
    if (dataApproval && dataApproval.data && Array.isArray(dataApproval.data.data)) {
      const IsNotEmpty = dataApproval.data.data.length;
      handleApprovalList(IsNotEmpty);
      loadTableBodyApproval(dataApproval.data.data);
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
      Type: "approval",
      Page: 1,
      Limit: 10,
    };
    const queryString = new URLSearchParams(payload).toString();
    const dataApproval = await fetchDraftProsbis(queryString);
    if (dataApproval && dataApproval.data && Array.isArray(dataApproval.data.data)) {
      const IsNotEmpty = dataApproval.data.data.length;
      handleApprovalList(IsNotEmpty);
      loadTableBodyApproval(dataApproval.data.data);
      feather.replace();
    } else {
      console.error("No data found or invalid data structure");
    }
  } catch (error) {
    console.error("Error fetching or loading data:", error);
  }
});

function handleApprovalList(length) {
  const tableApproval = document.getElementById("table-approval");
  const emptyCard = document.getElementById("empty-approval");
  if (tableApproval && length > 0) {
    tableApproval.style.display = "block";
  }
  if (emptyCard && length > 0) {
    emptyCard.style.display = "none";
  }
}

function loadTableBodyApproval(dataList) {
  if (!dataList || dataList.length === 0) {
    document.getElementById(
      "body-approval",
    ).innerHTML = `<tr><td colspan="7" style="text-align:center;">No data available</td></tr>`;
    return;
  }
  const statusLabel = {
    2: "Approval",
    3: "Approve",
    4: "Rejected",
  };
  const bodyContent = dataList
    .map((val, i) => {
      return `
      <tr>
        <th scope="row" style="text-align:center">${i + 1}</th>
        <td style="width:150px">${val.reqId || "-"}</td>
        <td  style="width:120px">${val.typeDetail || "-"}</td>
        <td>${val.createBy ? val.createBy : "-"}</td>
        <td>${val.approveBy || "-"}</td>
        <td style="width: 60px;text-align:center">
            ${val.status ? `<span class="badge badge-success custom-badge">${statusLabel[val.status]}</span>` : "-"} 
        </td>
       <td style="width: 100px;text-align:center">
            <button class="btn btn-outline-primary" type="button"
                onclick="handleDetailApproval()"><i class="icon-eye"></i>
                Detail</button>
        </td>
      </tr>`;
    })
    .join("");

  const tableBody = document.getElementById("body-approval");
  if (tableBody) {
    tableBody.innerHTML = bodyContent;
  }
}
function handleApprovalBack() {
  const approvalDetail = document.getElementById("approval-detail");
  const mainMatrix = document.getElementById("main-matrix");
  const headerMatrix = document.getElementById("header-matrix");
  const headerDetail = document.getElementById("header-detail-approval");
  if (approvalDetail) {
    approvalDetail.style.display = "none";
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
function handleDetailApproval() {
  const approvalDetail = document.getElementById("approval-detail");
  const mainMatrix = document.getElementById("main-matrix");
  const headerMatrix = document.getElementById("header-matrix");
  const headerDetail = document.getElementById("header-detail-approval");
  if (approvalDetail) {
    approvalDetail.style.display = "block";
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

  // const url = new URL(window.location);
  // url.searchParams.set("id", 1);
  // window.history.pushState({}, "", url);
}
