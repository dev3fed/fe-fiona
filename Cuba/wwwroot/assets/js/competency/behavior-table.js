document.getElementById("searchBehavior").addEventListener("input", function (event) {
  const value = event.target.value.trim();
  if (value.length >= 4 || value.length === 0) {
    handleSearchChange(event);
  }
});

const handleSearchChange = async (event) => {
  const searchValue = event.target.value.trim();
  const payloadTblBehavior = getState("payloadTblBehavior");
  const payload = {
    page: payloadTblBehavior.page,
    pageSize: payloadTblBehavior.pageSize,
    search: searchValue,
  };
  const queryString = "?" + new URLSearchParams(payload).toString();
  const listData = await fetchBehaviorList(queryString);
  renderTableBehavior(listData.data);
  setState("payloadTblBehavior", payload);
};

const renderTableBehavior = async (behaviorList) => {
  try {
    const listData = behaviorList;
    const bodyContent = listData.data
      .map((val, i) => {
        const startIndex = (listData.page - 1) * listData.limit;
        return `
                <tr>
                  <th scope="row" style="text-align:center">${startIndex + i + 1}</th>
                  <td>${val.behaviorList || "-"}</td>
                  <td>${val.definition || "-"}</td>
                  <td style="width: 120px;text-align:center">
                    <button class="btn btn-outline-primary" type="button" onclick="handleBehavior('Behavior','${
                      val.id
                    }')">
                      <i class="icon-eye" style="font-size: 12px;"> Detail</i>
                    </button>
                  </td>
                </tr>`;
      })
      .join("");
    const tableBody = document.getElementById("body-behavior");
    if (tableBody) {
      tableBody.innerHTML = bodyContent;
    }
    const itemsPerPage = listData.limit;
    const totalPages = Math.ceil(listData.count / itemsPerPage);
    const currentPage = listData.page;
    const start = (listData.page - 1) * itemsPerPage + 1;
    renderPaginationBehavior(currentPage, totalPages);
    const totalPage = document.getElementById("total-behavior-page");
    if (totalPage) {
      totalPage.innerHTML = `
          <div class="row">
            <div class="col-2">
              <select class="form-select digits"  style="width:62%;" id="limitPageBehavior" onchange="handleChangeItemsPerPage(event)">
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
    let selectElement = document.getElementById("limitPageBehavior");
    selectElement.value = listData.limit;
  } catch (error) {
    console.error("Error rendering table behavior:", error);
  }
};

function renderPaginationBehavior(currentPage, totalPages) {
  const paginationContainer = document.getElementById("list-behavior-page");
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
        ${currentPage === 1 ? 'tabindex="-1"' : `onclick="handleChangePage(${1})"`}
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
          ${currentPage === 1 ? 'tabindex="-1"' : `onclick="handleChangePage(${currentPage - 1})"`}
        >
          «
        </a>
      </li>
    `);
  for (let i = startPage; i <= endPage; i++) {
    paginationButtons.push(`
      <li class="page-item ${i === currentPage ? "active" : ""}">
        <a class="page-link" href="javascript:void(0)" onclick="handleChangePage(${i})">${i}</a>
      </li>
    `);
  }

  paginationButtons.push(`
      <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
        <a 
          class="page-link" 
          href="javascript:void(0)" 
          ${currentPage === totalPages ? 'tabindex="-1"' : `onclick="handleChangePage(${currentPage + 1})"`}
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
          ${currentPage === totalPages ? 'tabindex="-1"' : `onclick="handleChangePage(${totalPages})"`}
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
async function handleChangeItemsPerPage(event) {
  const itemsPerPage = parseInt(event.target.value, 10);
  const payloadTblBehavior = getState("payloadTblBehavior");
  const payload = {
    ...payloadTblBehavior,
    page: payloadTblBehavior.page,
    pageSize: itemsPerPage,
  };
  const queryString = "?" + new URLSearchParams(payload).toString();
  const listData = await fetchBehaviorList(queryString);
  renderTableBehavior(listData.data);
  setState("payloadTblBehavior", payload);
}

async function handleBehavior(type, code) {
  try {
    const dataDetail = await fetchCompeBehaviorDetail(code);
    const modal = new bootstrap.Modal(document.getElementById("ModalDetailBehavior"));
    modal.show();
    const modalTitle = document.getElementById("ModalDetailBehaviorTitle");
    if (modalTitle) {
      modalTitle.innerHTML = `${type} Competency Detail`;
    }
    const formContent = `
    <div class="col-12 scrollable-content" style="min-height: 620px;">
        <div class="mb-2">
          <h6 style="font-weight:bold">${dataDetail.data.behaviour_list} </h6>
        </div>
        ${createCard("Definition", dataDetail?.data.definition, true)}
    ${createDetailCards(dataDetail.data.detail)}
    </div>
  `;

    const modalBodyContent = document.getElementById("body-detailbehavior");
    if (modalBodyContent) {
      modalBodyContent.innerHTML = formContent;
    }
  } catch (error) {}
}
const createCard = (title, content, isDefinition = false) => {
  const cardContent = isDefinition
    ? `<div class="custom-row-full">
         <label>${content}</label>
       </div>`
    : `<div class="custom-row-full">
         <ul style="list-style-type: disc; margin-left: 20px; font-size: 13px;">
           ${content.map((item) => `<li>${item}</li>`).join("")}
         </ul>
       </div>`;

  return `
    <div class="custom-card-approval">
      <div class="header-card-approval">
        ${title}
      </div>
      <div${isDefinition ? "" : ' style="padding-top: 10px;"'}>
        ${cardContent}
      </div>
    </div>`;
};
const createDetailCards = (details) => {
  return details.map((item) => createCard(item.key, item.descriptions)).join("");
};
async function handleDetailDictionary(type, code) {
  try {
    const dataDetail = type != "Behavior" ? await fetchCompetencyDetail(code) : await fetchCompeBehaviorDetail(code);
    const modal = new bootstrap.Modal(document.getElementById("modalDetailDictionary"));

    modal.show();
    // Set the title of the modal id modalDetailDictionaryTitle
    const modalTitle = document.getElementById("modalDetailDictionaryTitle");
    if (modalTitle) {
      modalTitle.innerHTML = `${type} Competency Detail`;
    }
    const formContent = `
    <div class="col-12 scrollable-content" style="min-height: 620px;">
        <div class="mb-2">
          <h6 style="font-weight:bold">${dataDetail.data.compName} </h6>
        </div>

        <div class="custom-card-approval">
            <div class="header-card-approval">
                Definition
            </div>
            <div>
                <div class=" custom-row-full">
                    <label>${dataDetail?.data.definition}</label>
                </div>
            </div>
        </div>
        <div class="custom-card-approval">
            <div class="header-card-approval">
                Level 1 (Basic)
            </div>
            <div style="padding-top: 10px;">
                <div class=" custom-row-full">
                    <ul style="list-style-type: disc; margin-left: 20px;font-size: 13px;">
                    ${dataDetail?.data.levels[1].map((item) => `<li> ${item}</li>`).join("")}
                    </ul>
                </div>
            </div>
        </div>
        <div class="custom-card-approval">
            <div class="header-card-approval">
              Level 2 (Intermediate)
            </div>
            <div style="padding-top: 10px;">
                <div class=" custom-row-full">
                    <ul style="list-style-type: disc; margin-left: 20px;font-size: 13px;">
                    ${dataDetail?.data.levels[2].map((item) => `<li> ${item}</li>`).join("")}
                    </ul>
                </div>
            </div>
        </div>
        <div class="custom-card-approval">
            <div class="header-card-approval">
                Level 3 (Advance)
            </div>
            <div style="padding-top: 10px;">
                <div class=" custom-row-full">
                   <ul style="list-style-type: disc; margin-left: 20px;font-size: 13px;">
                    ${dataDetail?.data.levels[3].map((item) => `<li> ${item}</li>`).join("")}
                    </ul>
                </div>
            </div>
        </div>
        <div class="custom-card-approval">
            <div class="header-card-approval">
                Level 4 (Mastery)
            </div>
            <div style="padding-top: 10px;">
                <div class=" custom-row-full">
                    <ul style="list-style-type: disc; margin-left: 20px;font-size: 13px;">
                    ${dataDetail?.data.levels[4].map((item) => `<li> ${item}</li>`).join("")}
                    </ul>
                </div>
            </div>
        </div>
    </div>
  `;

    const modalBodyContent = document.getElementById("body-detaildictionary");
    if (modalBodyContent) {
      modalBodyContent.innerHTML = formContent;
    }
  } catch (error) {}
}

async function handleChangePage(pageNumber) {
  const payloadTblBehavior = getState("payloadTblBehavior");
  const payload = {
    ...payloadTblBehavior,
    page: pageNumber,
    pageSize: payloadTblBehavior.pageSize,
  };
  const queryString = "?" + new URLSearchParams(payload).toString();
  const listData = await fetchBehaviorList(queryString);
  renderTableBehavior(listData.data);
  setState("payloadTblBehavior", payload);
}
