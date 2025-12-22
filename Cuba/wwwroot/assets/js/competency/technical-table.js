document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchTechnical");
  if (searchInput) {
    searchInput.addEventListener("input", async (event) => {
      const keyword = event.target.value.trim();
      if (keyword.length >= 4 || keyword.length === 0) {
        const payloadTblTechnical = getState("payloadTblTechnical");
        const payload = {
          ...payloadTblTechnical,
          page: 1,
          pageSize: 10,
          search: keyword,
        };
        const queryString = "?" + new URLSearchParams(payload).toString();
        const listData = await fetchTechnicalList(queryString);
        renderTableTchnical(listData.data);
        setState("payloadTblTechnical", payload);
      }
    });
  }
  const url = `${url_api}/api/Utilities/selection`;
  selectSkillGroupTechnical(url);
  selectSubSkillGroupTechnical(url);

  $("#skillGroupTechnical").on("select2:clear", async function (e) {
    const payloadTblTechnical = getState("payloadTblTechnical");
    const payload = {
      ...payloadTblTechnical,
      page: 1,
      sgName: "",
      ssgName: "",
    };
    $("#subSkillGroupTechnical").val(null).trigger("change");
    const url = `${url_api}/api/Utilities/selection`;
    selectSubSkillGroupTechnical(url);
    const queryString = "?" + new URLSearchParams(payload).toString();
    const listData = await fetchTechnicalList(queryString);
    renderTableTchnical(listData.data);
    setState("payloadTblTechnical", payload);
  });
  $("#skillGroupTechnical").on("select2:select", async function (e) {
    const selectedId = e.params.data.id;
    const selectedText = e.params.data.text;
    const payloadTblTechnical = getState("payloadTblTechnical");
    const payload = {
      ...payloadTblTechnical,
      page: 1,
      sgName: selectedText,
      ssgName: "",
    };

    const queryString = "?" + new URLSearchParams(payload).toString();
    const listData = await fetchTechnicalList(queryString);
    $("#subSkillGroupTechnical").val(null).trigger("change");
    const url = `${url_api}/api/TechnicalCompetency/sub-skill-group/${selectedId}`;
    subSkillGroupBySg(url);
    renderTableTchnical(listData.data);
    setState("payloadTblTechnical", payload);
  });

  $("#subSkillGroupTechnical").on("select2:clear", async function (e) {
    const payloadTblTechnical = getState("payloadTblTechnical");
    const payload = {
      ...payloadTblTechnical,
      page: 1,
      ssgName: "",
    };
    $("#subSkillGroupTechnical").val(null).trigger("change");
    const queryString = "?" + new URLSearchParams(payload).toString();
    const listData = await fetchTechnicalList(queryString);
    renderTableTchnical(listData.data);
    setState("payloadTblTechnical", payload);
  });

  $("#subSkillGroupTechnical").on("select2:select", async function (e) {
    const selectedText = e.params.data.text;
    const payloadTblTechnical = getState("payloadTblTechnical");
    const payload = {
      ...payloadTblTechnical,
      page: 1,
      ssgName: selectedText,
    };
    const queryString = "?" + new URLSearchParams(payload).toString();
    const listData = await fetchTechnicalList(queryString);
    renderTableTchnical(listData.data);
    setState("payloadTblTechnical", payload);
  });
});

const renderTableTchnical = async (technicalList) => {
  try {
    const listData = technicalList;
    if (listData.data.length > 0) {
      const bodyContent = listData.data
        .map((val, i) => {
          const startIndex = (listData.page - 1) * listData.limit;
          return `
              <tr>
                <th scope="row" style="text-align:center">${startIndex + i + 1}</th>
                <td>${val.sgName || "-"}</td>
                <td>${val.ssgName || "-"}</td>
                <td>${val.compName || "-"}</td>
                <td style="width: 120px;text-align:center">
                  <button class="btn btn-outline-primary" type="button" onclick="handleDetailDictionary('Technical','${
                    val.compCode
                  }')">
                    <i class="icon-eye" style="font-size: 12px;" > Detail</i> 
                  </button>
                </td>
              </tr>`;
        })
        .join("");
      const tableBody = document.getElementById("body-technical");
      if (tableBody) {
        tableBody.innerHTML = bodyContent;
      }
      const itemsPerPage = listData.limit;
      const totalPages = Math.ceil(listData.count / itemsPerPage);
      const currentPage = listData.page;
      const start = (listData.page - 1) * itemsPerPage + 1;
      renderPaginationTechnical(currentPage, totalPages);
      const totalPage = document.getElementById("total-technical-page");
      if (totalPage) {
        totalPage.innerHTML = `
          <div class="row">
            <div class="col-2">
              <select class="form-select digits"  style="width:62%;" id="limitDetailPage" onchange="changePageSizeTechnical(event)">
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
          listData.count < itemsPerPage * listData.page ? listData.count : itemsPerPage * listData.page
        } of ${listData.count} records</label>
            </div>
          </div>
        `;
      }
      let selectElement = document.getElementById("limitDetailPage");
      selectElement.value = listData.limit;
    } else {
      bodyContent = `
          <tr>
            <td colspan="5" style="text-align:center">Data not found</td>
          </tr>
        `;
      const tableBody = document.getElementById("body-technical");
      if (tableBody) {
        tableBody.innerHTML = bodyContent;
      }
    }
  } catch (error) {
    console.error("Error rendering table behavior:", error);
  }
};

function renderPaginationTechnical(currentPage, totalPages) {
  const paginationContainer = document.getElementById("list-technical-page");
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
        ${currentPage === 1 ? 'tabindex="-1"' : `onclick="handleChangePageTechnical(${1})"`}
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
          ${currentPage === 1 ? 'tabindex="-1"' : `onclick="handleChangePageTechnical(${currentPage - 1})"`}
        >
          «
        </a>
      </li>
    `);
  for (let i = startPage; i <= endPage; i++) {
    paginationButtons.push(`
      <li class="page-item ${i === currentPage ? "active" : ""}">
        <a class="page-link" href="javascript:void(0)" onclick="handleChangePageTechnical(${i})">${i}</a>
      </li>
    `);
  }

  paginationButtons.push(`
      <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
        <a 
          class="page-link" 
          href="javascript:void(0)" 
          ${currentPage === totalPages ? 'tabindex="-1"' : `onclick="handleChangePageTechnical(${currentPage + 1})"`}
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
          ${currentPage === totalPages ? 'tabindex="-1"' : `onclick="handleChangePageTechnical(${totalPages})"`}
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
async function changePageSizeTechnical(event) {
  const itemsPerPage = parseInt(event.target.value, 10);
  const payloadTblTechnical = getState("payloadTblTechnical");
  const payload = {
    ...payloadTblTechnical,
    page: payloadTblTechnical.page,
    pageSize: itemsPerPage,
  };
  const queryString = "?" + new URLSearchParams(payload).toString();
  const listData = await fetchTechnicalList(queryString);
  renderTableTchnical(listData.data);
  setState("payloadTblTechnical", payload);
}

async function handleChangePageTechnical(pageNumber) {
  const payloadTblTechnical = getState("payloadTblTechnical");
  const payload = {
    ...payloadTblTechnical,
    page: pageNumber,
    pageSize: payloadTblTechnical.pageSize,
  };
  const queryString = "?" + new URLSearchParams(payload).toString();
  const listData = await fetchTechnicalList(queryString);
  renderTableTchnical(listData.data);
  setState("payloadTblTechnical", payload);
}
