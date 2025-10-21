document.addEventListener("DOMContentLoaded", function () {
  fetctListDatasource();
  feather.replace();
});

const getSummaryList = async (draftId) => {
  try {
    let statusValue = document.getElementById("status-summary").value;
    console.log("statusValue", statusValue);
    const payload = {
      dataSource: "master",
      keySearch: "",
      searchValue: "",
      filter: statusValue === "all" ? ["available", "not-available", "waiting-approval", "on-progress"] : [statusValue],
      page: 1,
      limit: 10,
    };
    setState("payloadSummary", payload);
    const resultList = await fetchSummaryList(payload);
    renderTableSummary(resultList);
  } catch (error) {
    console.error("Error fetching summary list:", error);
  }
};
function fetctListDatasource(draftId = null) {
  $.ajax({
    url: `${url_api}/api/Utilities/selection`,
    dataType: "json",
    data: {
      type: "draft-comp",
      page: 1,
      search: "",
    },
    success: function (response) {
      if (response && response.data && response.data.result) {
        let $select = $("#dataSource-summary");
        $select.find("option:not(:first)").remove(); // Hapus opsi lama kecuali yang pertama

        response.data.result.forEach((item) => {
          let isSelected = draftId && item.id == draftId;
          let $option = new Option(item.text, item.id, isSelected, isSelected);
          $($option).attr("data-draftso", item.draftSo); // Tambahkan atribut data-draftso
          $select.append($option);
        });

        if (draftId) {
          let newOption = new Option(`Draft ${draftId}`, draftId, true, true);
          $(newOption).attr("data-draftso", "your-value-here"); // Jika perlu, set manual
          $select.append(newOption);
        }

        $select.select2({
          placeholder: "Choose",
          allowClear: true,
        });

        if (draftId) {
          $select.val(draftId).trigger("change");
        }
      }
    },
  });
}
document.getElementById("status-summary").addEventListener("change", async function () {
  try {
    const statusSummary = this.value;
    const payloadSummary = getState("payloadSummary");
    const payload = {
      ...payloadSummary,
      filter:
        statusSummary === "all" ? ["available", "not available", "waiting approval", "on progress"] : [statusSummary],
    };
    setState("payloadSummary", payload);
  } catch (error) {}
});
const renderTableSummary = (resultList) => {
  if (resultList.data.data.length > 0) {
    const listData = resultList.data;
    const bodySummary = listData.data
      .map((element, i) => {
        // Determine status styling
        let statusText = element.kkjStatus || "N/A";
        let statusHtml = `<span style="
            display: inline-block;
            background-color: #b9fbc0;
            color: #16a34a;
            font-weight: 500;
            padding: 4px 12px;
            border-radius: 4px;
            line-height: 1;
            ">${statusText}</span>`;
        const startIndex = (listData.meta.page - 1) * listData.meta.limit;
        const valString = JSON.stringify(element).replace(/"/g, "&quot;");
        return `
            <tr>
              <td style="text-align:center">${startIndex + i + 1}</td>
              <td>${element.positionName || "N/A"}</td>
              <td style="text-align:center">${element.functionName || "N/A"}</td>
              <td style="text-align:center">${element.divisionName || "N/A"}</td>
              <td style="width: 120px;">${statusHtml}</td>
              <td style="text-align:center;width: 100px;">
               <button onclick="showDetail(${valString})" data-position-name="${(element.positionName || "").replace(
          /"/g,
          "&quot;",
        )}" class="btn btn-outline-light d-inline-flex align-items-center justify-content-center" type="button" aria-label="Detail">
               <img src="/assets/images/rasci/icon_detail.svg" alt="Detail Icon" style="width:18px; height:18px; object-fit:contain; vertical-align:middle; margin-right:5px;">
               <span>Detail</span>
               </button> 
              </td>
            </tr>`;
      })
      .join("");
    document.getElementById("body-summary").innerHTML = bodySummary;
    const itemsPerPage = listData.meta.limit;
    const totalPages = Math.ceil(listData.meta.count / itemsPerPage);
    const currentPage = listData.meta.page;
    const start = (currentPage - 1) * itemsPerPage + 1;
    renderPaginationSummary(currentPage, totalPages);
    const totalPage = document.getElementById("total-summary-page");
    if (totalPage) {
      totalPage.innerHTML = `
          <div class="row">
            <div class="col-2">
              <select class="form-select digits"  style="width:62%;" id="limitPageSummary" onchange="changeNumberSummaryPage(event)">
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
        listData.meta.count < itemsPerPage * currentPage ? listData.meta.count : itemsPerPage * currentPage
      } of ${listData.meta.count} records</label>
            </div>
          </div>
        `;
    }
    let selectElement = document.getElementById("limitPageSummary");
    selectElement.value = listData.meta.limit;
  }
};
const selectTypePosition = (text) => {
  const payloadSummary = getState("payloadSummary");
  console.log("text", text);
  let payload = { ...payloadSummary, keySearch: text.toLowerCase() };
  console.log("payload", payload);
  setState("payloadSummary", payload);
  document.getElementById("btnSearchType").innerText = text;
  document.getElementById("inputSearchSummary").value = "";
};
const triggerSearchSummary = async () => {
  try {
    const payloadSummary = getState("payloadSummary");
    let searchValue = document.getElementById("inputSearchSummary").value;
    const spinner = document.getElementById("loadingSearchSummary");
    spinner.style.display = "inline-block";
    let payload = { ...payloadSummary, searchValue: searchValue };
    console.log("payload", payload);
    setState("payloadSummary", payload);
    const result = await fetchSummaryList(payload);
    renderTableSummary(result);
    spinner.style.display = "none";
  } catch (error) {}
};
function renderPaginationSummary(currentPage, totalPages) {
  const paginationContainer = document.getElementById("list-summary-page");
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
        ${currentPage === 1 ? 'tabindex="-1"' : `onclick="changePageSummary(${1})"`}
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
          ${currentPage === 1 ? 'tabindex="-1"' : `onclick="changePageSummary(${currentPage - 1})"`}
        >
          «
        </a>
      </li>
    `);
  for (let i = startPage; i <= endPage; i++) {
    paginationButtons.push(`
      <li class="page-item ${i === currentPage ? "active" : ""}">
        <a class="page-link" href="javascript:void(0)" onclick="changePageSummary(${i})">${i}</a>
      </li>
    `);
  }

  paginationButtons.push(`
      <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
        <a 
          class="page-link" 
          href="javascript:void(0)" 
          ${currentPage === totalPages ? 'tabindex="-1"' : `onclick="changePageSummary(${currentPage + 1})"`}
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
          ${currentPage === totalPages ? 'tabindex="-1"' : `onclick="changePageSummary(${totalPages})"`}
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

const clearSearchSummary = async () => {
  try {
    document.getElementById("inputSearchSummary").value = "";
    document.getElementById("btnSearchType").innerText = "Position";
    const spinner = document.getElementById("loadingClearSummary");
    spinner.style.display = "inline-block";
    const statusEl = document.getElementById("status-summary");
    let statusValue = "all";
    if (statusEl) {
      statusEl.value = statusValue;
      if (window.jQuery && $(statusEl).data("select2")) {
        $(statusEl).val(statusValue).trigger("change");
      }
    }
    const payloadSummary = getState("payloadSummary");
    let payload = {
      ...payloadSummary,
      searchValue: "",
      keySearch: "Position",
      filter: statusValue === "all" ? ["available", "not-available", "waiting-approval", "on-progress"] : [statusValue],
    };

    setState("payloadSummary", payload);
    const result = await fetchSummaryList(payload);
    renderTableSummary(result);
    spinner.style.display = "none";
  } catch (error) {}
};
async function changePageSummary(pageNumber) {
  const payloadSummary = getState("payloadSummary");
  const payload = {
    ...payloadSummary,
    page: pageNumber,
    limit: payloadSummary.limit,
  };
  const result = await fetchSummaryList(payload);
  renderTableSummary(result);
  setState("payloadSummary", payload);
}
async function changeNumberSummaryPage(event) {
  const itemsPerPage = parseInt(event.target.value, 10);
  const payloadSummary = getState("payloadSummary");
  const payload = {
    ...payloadSummary,
    page: payloadSummary.page,
    limit: itemsPerPage,
  };
  setState("payloadSummary", payload);
  const result = await fetchSummaryList(payload);
  renderTableSummary(result);
}
