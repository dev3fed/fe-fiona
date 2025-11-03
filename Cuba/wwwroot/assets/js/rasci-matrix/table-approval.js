document.addEventListener("dataLoaded", async function () {
  try {
    const payload = getState("payloadApproval");
    const statusApproval = document.getElementById("statusApproval").value;
    payload.Filter = statusApproval;
    setState("payloadApproval", payload);
    const queryString = new URLSearchParams(payload).toString();

    const result = await fetchApprovalList(queryString);
    if (result.data.data.length > 0) {
      renderTableApproval(result.data);
    }
  } catch (error) {
    console.error("Error loading data history:", error);
  }
});

$("#approvalDate").datepicker({
  onSelect: async function (formattedDate) {
    const payloadApproval = getState("payloadApproval");
    const [month, day, year] = formattedDate.split("/");
    const approvedDateFilter = `ApprovedDate:${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

    let filterValue = (payloadApproval.Filter || "")
      .split(",")
      .filter((f) => !/^ApprovedDate:/i.test(f.trim()))
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
    const queryString = new URLSearchParams(payload).toString();

    const result = await fetchApprovalList(queryString);
    renderTableApproval(result.data);
  },
});
$("#submittedDate").datepicker({
  onSelect: async function (formattedDate) {
    const payloadApproval = getState("payloadApproval");
    const [month, day, year] = formattedDate.split("/");
    const submittedDateFilter = `SubmittedDate:${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

    let filterValue = (payloadApproval.Filter || "")
      .split(",")
      .filter((f) => !/^SubmittedDate:/i.test(f.trim()))
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
    const queryString = new URLSearchParams(payload).toString();

    const result = await fetchApprovalList(queryString);
    renderTableApproval(result.data);
  },
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
  const queryString = new URLSearchParams(payload).toString();

  const result = await fetchApprovalList(queryString);
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
  const queryString = new URLSearchParams(payload).toString();

  const result = await fetchApprovalList(queryString);
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
        return `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()}, ${pad(date.getHours())}:${pad(
          date.getMinutes(),
        )}`;
      };

      const statusMap = {
        1: "Approval",
        2: "Reject",
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
      const statusText = statusMap[data.isStatus] || "-";
      let statusHtml = `<span style="
          display:inline-block;
          width:120px;
          text-align:center;
          background-color:${getStatusColor(data.isStatus)};
          color:${getTextColor(data.isStatus)};
          font-weight:500;
          padding:8px 0;
          border-radius:4px;
          line-height:1;
          box-sizing:border-box;
          ">${statusText}</span>`;
      const requestId =
        data.requestId ||
        (() => {
          const now = new Date();
          const pad = (n) => n.toString().padStart(2, "0");
          const day = pad(now.getDate());
          const month = pad(now.getMonth() + 1);
          const year = now.getFullYear();
          const seq = Math.floor(Math.random() * 1000)
            .toString()
            .padStart(3, "0");
          return `Req/RM/${day}${month}${year}/${seq}`;
        })();
      return `
        <tr>
          <td style="text-align:center">${index + 1}</td>
          <td>${requestId}</td>
          <td>${data.draftName || "-"}</td>
          <td>${data.orgNameSource || "-"}</td>
          <td>${formatDate(data.createdDate)}</td>
          <td>${formatDate(data.modifiedDate)}</td>
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

  const tableBody = document.getElementById("body-approval");
  if (tableBody) {
    tableBody.innerHTML = tblBody;
  }
  const itemsPerPage = listData.pageSize;
  const totalPages = Math.ceil(listData.total / itemsPerPage);
  const currentPage = listData.page;
  const start = (listData.page - 1) * itemsPerPage + 1;
  renderPaginationApproval(currentPage, totalPages);
  const totalPage = document.getElementById("total-approval-page");
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
  const paginationContainer = document.getElementById("list-approval-page");
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
  const queryString = new URLSearchParams(payload).toString();
  const result = await fetchApprovalList(queryString);
  renderTableApproval(result.data);
}

async function changePageApproval(pageNumber) {
  const payloadApproval = getState("payloadApproval");
  const payload = {
    ...payloadApproval,
    Page: pageNumber,
    pageSize: payloadApproval.pageSize,
  };
  const result = await fetchApprovalList(queryString);
  renderTableApproval(result.data);
  setState("payloadApproval", payload);
}

function handleApprovalBack() {
  const approvalDetail = document.getElementById("approval-detail");
  const mainMatrix = document.getElementById("main-matrix");
  const headerMatrix = document.getElementById("header-matrix");
  const headerDetail = document.getElementById("header-detail-approval");
  const draftInfo = document.getElementById("info-approval");
  setState("dataDetailAproval", {});
  if (draftInfo) draftInfo.innerHTML = "";
  const emptyActivity = document.getElementById("empty-activityapproval");
  if (emptyActivity) emptyActivity.innerHTML = "";
  const tblActivity = document.getElementById("detail-activityapproval");
  if (tblActivity) tblActivity.innerHTML = "";
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
const handleDetailApproval = async (draftId) => {
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
  const dataApproval = await fetchDraftProsbisByid(draftId);
  if (dataApproval.status === 200) {
    setState("dataDetailAproval", dataApproval.data);
  }
};
