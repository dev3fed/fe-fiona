document.addEventListener("DOMContentLoaded", async function () {
  const payload = getState("payloadLogHistory");
  const result = await fetchLoghistoryList(payload);
  const logHistoryData = result.data || [];
  renderTableLoghistory(logHistoryData);
  feather.replace();
});
document.addEventListener("dataLoaded", async function () {
  try {
    // const logHistoryData = getState("logHistoryData");
    const payload = getState("payloadLogHistory");
    const result = await fetchLoghistoryList(payload);
    const logHistoryData = result.data || [];
    renderTableLoghistory(logHistoryData);
  } catch (error) {
    console.error("Error loading data history:", error);
  }
});

const renderTableLoghistory = async (logHistoryData) => {
  try {
    const tableHistory = document.getElementById("table-history");
    const emptyCard = document.getElementById("empty-history");
    tableHistory.style.display = "block";
    emptyCard.style.display = "none";
    const listData = logHistoryData;
    const tblBody = listData.data
      .map((data, index) => {
        const date = new Date(data.dateTime);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const formattedDate = `${day}-${month}-${year}, ${hours}:${minutes}`;
        const startIndex = (listData.page - 1) * listData.limit;
        return `
            <tr>
              <td style="text-align:center">${startIndex + index + 1}</td>
              <td>${formattedDate}</td>
              <td>${data.username || "-"}</td>
              <td>${data.draftName || "-"}</td>
              <td>${data.detail || "-"}</td>
            </tr>
          `;
      })
      .join("");

    const tableBody = document.getElementById("history-body");
    if (tableBody) {
      tableBody.innerHTML = tblBody;
    }
    const itemsPerPage = listData.limit;
    const totalPages = Math.ceil(listData.totalRecords / itemsPerPage);
    const currentPage = listData.page;
    const start = (listData.page - 1) * itemsPerPage + 1;
    renderPaginationLoghistory(currentPage, totalPages);
    const totalPage = document.getElementById("total-loghistory-page");
    if (totalPage) {
      totalPage.innerHTML = `
          <div class="row">
            <div class="col-2">
              <select class="form-select digits"  style="width:62%;" id="limitPageLoghistory" onchange="changeNumberHistorypage(event)">
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
                listData.totalRecords < itemsPerPage * listData.page
                  ? listData.totalRecords
                  : itemsPerPage * listData.page
              } of ${listData.totalRecords} records</label>
            </div>
          </div>
        `;
    }
    let selectElement = document.getElementById("limitPageLoghistory");
    selectElement.value = listData.limit;
  } catch (error) {}
};

function renderPaginationLoghistory(currentPage, totalPages) {
  const paginationContainer = document.getElementById("list-loghistory-page");
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
        ${currentPage === 1 ? 'tabindex="-1"' : `onclick="changePageHistory(${1})"`}
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
          ${currentPage === 1 ? 'tabindex="-1"' : `onclick="changePageHistory(${currentPage - 1})"`}
        >
          «
        </a>
      </li>
    `);
  for (let i = startPage; i <= endPage; i++) {
    paginationButtons.push(`
      <li class="page-item ${i === currentPage ? "active" : ""}">
        <a class="page-link" href="javascript:void(0)" onclick="changePageHistory(${i})">${i}</a>
      </li>
    `);
  }

  paginationButtons.push(`
      <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
        <a 
          class="page-link" 
          href="javascript:void(0)" 
          ${currentPage === totalPages ? 'tabindex="-1"' : `onclick="changePageHistory(${currentPage + 1})"`}
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
          ${currentPage === totalPages ? 'tabindex="-1"' : `onclick="changePageHistory(${totalPages})"`}
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

$("#createdDateInput").datepicker({
  onSelect: async function (formattedDate, date, inst) {
    let formatted = "";
    if (formattedDate) {
      const [month, day, year] = formattedDate.split("/");
      formatted = `${day}-${month}-${year}`;
    } else {
      formatted = "";
    }
    const payloadLogHistory = getState("payloadLogHistory");
    const payload = {
      ...payloadLogHistory,
      date: formatted,
    };
    const listData = await fetchLoghistoryList(payload);
    renderTableLoghistory(listData.data);
    setState("payloadLogHistory", payload);
  },
});
$("#searchInput").on("input", async function () {
  const searchValue = $(this).val();
  if (searchValue.length < 4 && searchValue.length !== 0) {
    return;
  }
  const payloadLogHistory = getState("payloadLogHistory");
  const payload = {
    ...payloadLogHistory,
    search: searchValue,
    page: 1,
  };
  const result = await fetchLoghistoryList(payload);
  renderTableLoghistory(result.data);
  setState("payloadLogHistory", payload);
});

async function changeNumberHistorypage(event) {
  const itemsPerPage = parseInt(event.target.value, 10);
  const payloadLogHistory = getState("payloadLogHistory");
  const payload = {
    ...payloadLogHistory,
    page: payloadLogHistory.page,
    limit: itemsPerPage,
  };
  const listData = await fetchLoghistoryList(payload);
  renderTableLoghistory(listData.data);
  setState("payloadLogHistory", payload);
}

async function changePageHistory(pageNumber) {
  const payloadLogHistory = getState("payloadLogHistory");
  const payload = {
    ...payloadLogHistory,
    page: pageNumber,
    limit: payloadLogHistory.limit,
  };
  const result = await fetchLoghistoryList(payload);
  const logHistoryData = result.data || [];
  renderTableLoghistory(logHistoryData);
  setState("payloadLogHistory", payload);
}
