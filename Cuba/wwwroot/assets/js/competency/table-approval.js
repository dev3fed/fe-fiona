document.addEventListener("DOMContentLoaded", async function () {
  await approvalData();
  feather.replace();
});
document.addEventListener("dataLoaded", async function () {
  try {
    await approvalData();
  } catch (error) {
    console.error("Error loading data history:", error);
  }
});
const approvalData = async () => {
  try {
    const payload = getState("payloadApproval");
    const statusApproval = document.getElementById("statusApproval").value;
    payload.Filter = statusApproval;
    setState("payloadApproval", payload);
    const result = await fetchApprovalList(payload);
    if (result.data && result.data.data.length > 0) {
      renderTableApproval(result.data);
    }
  } catch (error) {
    console.error("Error loading approval data:", error);
  }
};
$("#compeApprovalDate").datepicker({
  onSelect: async function (formattedDate) {
    const payloadApproval = getState("payloadApproval");
    const [month, day, year] = formattedDate.split("/");
    const approvedDateFilter = `approveddate:${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

    let filterValue = (payloadApproval.Filter || "")
      .split(",")
      .filter((f) => !/^approveddate:/i.test(f.trim()))
      .join(",");

    if (filterValue) {
      filterValue = `${approvedDateFilter},${filterValue}`;
    } else {
      filterValue = approvedDateFilter;
    }

    const payload = {
      ...payloadApproval,
      Filter: filterValue,
      Page: 1,
    };
    setState("payloadApproval", payload);
    const result = await fetchApprovalList(payload);
    renderTableApproval(result.data);
  },
});
$("#compeApprovalDate").on("input change", async function () {
  if ($(this).val() === "") {
    const payloadApproval = getState("payloadApproval");
    let filterValue = (payloadApproval.Filter || "")
      .split(",")
      .filter(
        (f) =>
          !/^ApprovedDate:/i.test(f.trim()) && !/^RejectedDate:/i.test(f.trim()) && !/^SubmittedDate:/i.test(f.trim()),
      )
      .join(",");

    const payload = {
      ...payloadApproval,
      Filter: filterValue,
      Page: 1,
    };
    setState("payloadApproval", payload);
    const result = await fetchApprovalList(payload);
    renderTableApproval(result.data);
  }
});
$("#compesubmitedDate").datepicker({
  onSelect: async function (formattedDate) {
    const payloadApproval = getState("payloadApproval");
    const [month, day, year] = formattedDate.split("/");
    const submittedDateFilter = `submitteddate:${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

    let filterValue = (payloadApproval.Filter || "")
      .split(",")
      .filter((f) => !/^submitteddate:/i.test(f.trim()))
      .join(",");

    if (filterValue) {
      filterValue = `${submittedDateFilter},${filterValue}`;
    } else {
      filterValue = submittedDateFilter;
    }

    const payload = {
      ...payloadApproval,
      Filter: filterValue,
      Page: 1,
    };
    setState("payloadApproval", payload);
    const result = await fetchApprovalList(payload);
    renderTableApproval(result.data);
  },
});
$("#compesubmitedDate").on("input change", async function () {
  if ($(this).val() === "") {
    const payloadApproval = getState("payloadApproval");
    let filterValue = (payloadApproval.Filter || "")
      .split(",")
      .filter((f) => !/^submitteddate:/i.test(f.trim()))
      .join(",");

    const payload = {
      ...payloadApproval,
      Filter: filterValue,
      Page: 1,
    };
    setState("payloadApproval", payload);
    const result = await fetchApprovalList(payload);
    renderTableApproval(result.data);
  }
});
document.getElementById("statusApproval").addEventListener("change", async function () {
  const statusApproval = this.value;
  const payloadApproval = getState("payloadApproval");
  let filterValue = payloadApproval.Filter || "";

  filterValue = filterValue
    .split(",")
    .filter((f) => !/^Status:/i.test(f.trim()))
    .join(",");

  if (filterValue) {
    filterValue = `${statusApproval},${filterValue}`;
  } else {
    filterValue = `${statusApproval}`;
  }

  const payload = {
    ...payloadApproval,
    Filter: filterValue,
    Page: 1,
  };
  setState("payloadApproval", payload);

  const result = await fetchApprovalList(payload);
  renderTableApproval(result.data);
});
$("#searchApproval").on("input", async function () {
  const searchValue = $(this).val();
  if (searchValue.length < 4 && searchValue.length !== 0) {
    return;
  }
  const payloadApproval = getState("payloadApproval");
  const payload = {
    ...payloadApproval,
    Search: searchValue,
    Page: 1,
  };
  const result = await fetchApprovalList(payload);
  renderTableApproval(result.data);
  setState("payloadApproval", payload);
});

const renderTableApproval = async (approvalData) => {
  const tableApproval = document.getElementById("table-approval");
  const emptyCard = document.getElementById("empty-approval");
  tableApproval.style.display = "block";
  emptyCard.style.display = "none";
  const listData = approvalData;
  const tblBody = listData.data
    .map((data, index) => {
      const formatDate = (dateStr) => {
        if (!dateStr) return "-";
        const date = new Date(dateStr);
        if (isNaN(date)) return "-";
        const pad = (n) => n.toString().padStart(2, "0");
        return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}, ${pad(date.getHours())}:${pad(
          date.getMinutes(),
        )}`;
      };

      const statusMap = {
        Approved: "Approval",
        Rejected: "Reject",
        Submitted: "On Review",
        Draft: "Draft",
      };
      function getStatusColor(status) {
        switch (status) {
          case 0:
            return "#FFA800";
          case "Approved":
            return "#D1FED3";
          case "Rejected":
            return "#F9E9EA";
          case "Submitted":
            return "#FEE9B0";
          case "Draft":
            return "#E0E0E0";
          default:
            return "#E4E6EF";
        }
      }
      function getTextColor(status) {
        switch (status) {
          case 0:
            return "#000000";
          case "Approved":
            return "#4DB043";
          case "Rejected":
            return "#CD2536";
          case "Submitted":
            return "#B08803";
          case "Draft":
            return "#000000";
          default:
            return "#000000";
        }
      }
      const startIndex = (listData.page - 1) * listData.pageSize;
      const statusText = statusMap[data.statusText] || "-";
      let statusHtml = `<span style="
          display:inline-block;
          width:120px;
          text-align:center;
          background-color:${getStatusColor(data.statusText)};
          color:${getTextColor(data.statusText)};
          font-weight:500;
          padding:8px 0;
          border-radius:4px;
          line-height:1;
          box-sizing:border-box;
          ">${statusText}</span>`;
      return `
        <tr>
          <td style="text-align:center">${startIndex + index + 1}</td>
          <td>${data.requestNumber || "-"}</td>
          <td>${data.draftName || "-"}</td>
          <td>${data.draftSoName || "-"}</td>
          <td>${formatDate(data.createdDate)}</td>
            <td>${
              data.statusText === "Approved"
                ? formatDate(data.approvedDate)
                : data.statusText === "Submitted"
                  ? "-"
                  : formatDate(data.rejectedDate)
            }</td>
          <td>${statusHtml}</td>
          <td style="width: 100px;text-align:center">
        <button class="btn btn-outline-primary" type="button" onclick="handleDetailApproval('${data.draftId}')">
          <i class="icon-eye"></i> 
        </button>
          </td>
        </tr>
      `;
    })
    .join("");

  const tableBody = document.getElementById("body-compeapproval");
  if (tableBody) {
    tableBody.innerHTML = tblBody;
  }
  const itemsPerPage = listData.pageSize;
  const totalPages = Math.ceil(listData.total / itemsPerPage);
  const currentPage = listData.page;
  const start = (listData.page - 1) * itemsPerPage + 1;
  renderPaginationApproval(currentPage, totalPages);
  const totalPage = document.getElementById("total-compeapproval-page");
  if (totalPage) {
    totalPage.innerHTML = `
          <div class="row">
            <div class="col-2">
              <select class="form-select digits"  style="width:62%;" id="limitPageApproval" onchange="changeNumberApprovalPage(event)">
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
  let selectElement = document.getElementById("limitPageApproval");
  selectElement.value = listData.pageSize;
};
function renderPaginationApproval(currentPage, totalPages) {
  const paginationContainer = document.getElementById("list-compeapproval-page");
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
        ${currentPage === 1 ? 'tabindex="-1"' : `onclick="changePageApproval(${1})"`}
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
          ${currentPage === 1 ? 'tabindex="-1"' : `onclick="changePageApproval(${currentPage - 1})"`}
        >
          «
        </a>
      </li>
    `);
  for (let i = startPage; i <= endPage; i++) {
    paginationButtons.push(`
      <li class="page-item ${i === currentPage ? "active" : ""}">
        <a class="page-link" href="javascript:void(0)" onclick="changePageApproval(${i})">${i}</a>
      </li>
    `);
  }

  paginationButtons.push(`
      <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
        <a 
          class="page-link" 
          href="javascript:void(0)" 
          ${currentPage === totalPages ? 'tabindex="-1"' : `onclick="changePageApproval(${currentPage + 1})"`}
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
          ${currentPage === totalPages ? 'tabindex="-1"' : `onclick="changePageApproval(${totalPages})"`}
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

async function changeNumberApprovalPage(event) {
  const itemsPerPage = parseInt(event.target.value, 10);
  const payloadApproval = getState("payloadApproval");
  const payload = {
    ...payloadApproval,
    Page: 1,
    pageSize: itemsPerPage,
  };
  setState("payloadApproval", payload);
  const result = await fetchApprovalList(payload);
  renderTableApproval(result.data);
}

async function changePageApproval(pageNumber) {
  const payloadApproval = getState("payloadApproval");
  const payload = {
    ...payloadApproval,
    Page: pageNumber,
    pageSize: payloadApproval.pageSize,
  };
  const result = await fetchApprovalList(payload);
  renderTableApproval(result.data);
  setState("payloadApproval", payload);
}

function handleApprovalBack() {
  const approvalDetail = document.getElementById("approval-detail");
  const mainCompetency = document.getElementById("main-competency");
  const headerCompetency = document.getElementById("header-competency");
  const headerDetail = document.getElementById("header-detail-approval");
  const approvalInfo = document.getElementById("info-approval");
  const headerActivity = document.getElementById("header-activity-approval");
  if (headerActivity) headerActivity.style.display = "none";
  setState("detailApproval", {});
  if (approvalInfo) approvalInfo.innerHTML = "";
  const emptyActivity = document.getElementById("empty-activityapproval");
  if (emptyActivity) emptyActivity.innerHTML = "";
  const tblActivity = document.getElementById("detail-activityapproval");
  if (tblActivity) tblActivity.innerHTML = "";

  if (approvalDetail) {
    approvalDetail.style.display = "none";
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
const handleDetailApproval = async (id) => {
  try {
    const approvalDetail = document.getElementById("approval-detail");
    const mainCompetency = document.getElementById("main-competency");
    const headerCompetency = document.getElementById("header-competency");
    const headerDetail = document.getElementById("header-detail-approval");
    if (approvalDetail) {
      approvalDetail.style.display = "block";
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
      setState("dataDetailApproval", detailResult.data);
    }
  } catch (error) {}
};
