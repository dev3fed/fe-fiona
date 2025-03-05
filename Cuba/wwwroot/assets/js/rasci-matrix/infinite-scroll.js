class VirtualTable {
  constructor(container, prosbisList, jobTitleList) {
    this.container = container;
    this.prosbisList = prosbisList;
    this.jobTitleList = jobTitleList;
    this.rowHeight = 30;
    this.columnWidth = 150;
    this.totalRows = prosbisList.length;
    this.totalColumns = jobTitleList.length;
    this.visibleRows = Math.ceil(container.clientHeight / this.rowHeight) + 1;
    this.visibleColumns = Math.ceil(container.clientWidth / this.columnWidth) + 1;
    this.header = document.getElementById("table-header");
    this.body = document.getElementById("table-body");
    this.renderHeader(jobTitleList);
    this.setupBody();
    this.container.addEventListener("scroll", () => this.render());
    this.render();
  }
  initializeTooltips() {
    const tooltipTriggerList = [...document.querySelectorAll('[data-bs-toggle="tooltip"]')];
    tooltipTriggerList.forEach((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));
  }

  setupBody() {
    const expandedRows = appState.idProsbis || [];
    const visibleProsbis = Array.isArray(this.prosbisList) ? this.prosbisList : []; // Pastikan visibleProsbis adalah array
    const isSearch = getState("isSearchMatrix");
    const idProsbisSelected = getState("idSearchProsbis");
    const tableBody = document.getElementById("table-body");
    const rasciMapping = getState("resultRasciMapping") || [];
    const jobList = getState("resultJabatan");
    if (!tableBody) {
      console.error("Table body element not found");
      return;
    }

    tableBody.innerHTML = ""; // Kosongkan tabel sebelum diisi ulang

    visibleProsbis.forEach((val) => {
      const tr = document.createElement("tr");
      tr.className = `clusterize-cluster ${val.level ? `level-${val.level}` : ""}`;
      tr.id = val.indexGroup;

      // Level Column
      const tdLevel = document.createElement("td");
      tdLevel.className = "level-col";
      tdLevel.style.fontSize = "12px";
      tdLevel.style.fontWeight = "500";
      tdLevel.textContent = `L${val.level}`;
      tr.appendChild(tdLevel);

      // Index Column
      const tdIndex = document.createElement("td");
      tdIndex.className = "index-col";
      tdIndex.style.textAlign = "left";
      tdIndex.style.fontSize = "12px";
      tdIndex.style.fontWeight = "500";
      tdIndex.innerHTML = `<span style="padding-left:5px;">${val.indexGroup}</span>`;
      tr.appendChild(tdIndex);

      // Proses Bisnis Column
      const tdProses = document.createElement("td");
      tdProses.className = "headcol";
      tdProses.style.fontSize = "12px";
      tdProses.style.fontWeight = "500";

      const prosbisWrapper = document.createElement("div");
      prosbisWrapper.className = "prosbis-cell-wrapper";

      // Hierarchy Icon
      if (!isSearch && val.hasChild) {
        const icon = document.createElement("i");
        icon.dataset.feather = expandedRows.includes(val.indexGroup) ? "chevron-up" : "chevron-down";
        icon.className = "hierarchy-icon";
        icon.id = `icon-${val.indexGroup}`;
        icon.style.width = "24px";
        icon.onclick = () => handleCollapse(val.indexGroup);
        prosbisWrapper.appendChild(icon);
      }

      // Proses Bisnis Name
      const prosbisName = document.createElement("div");
      prosbisName.className = "flex-fill prosbis-name";
      prosbisName.textContent = val.description;
      prosbisName.onclick = () => onModalProsbis(val);
      prosbisWrapper.appendChild(prosbisName);

      // Dropdown Menu
      const dropdownContainer = document.createElement("div");
      dropdownContainer.className = "ellipsis-menu prosbis-row-ellipsis";

      const button = document.createElement("button");
      button.type = "button";
      button.id = "dropdownMenuButton";
      button.dataset.bsToggle = "dropdown";
      button.ariaExpanded = "false";
      button.style.border = "none";
      button.style.background = "transparent";
      button.style.cursor = "pointer";
      button.innerHTML = `<i class="fas fa-ellipsis-v"></i>`;

      const dropdownMenu = document.createElement("ul");
      dropdownMenu.className = "dropdown-menu";
      dropdownMenu.ariaLabelledby = "dropdownMenuButton";

      const dropdownItems = [
        { text: "Detail", icon: "/assets/images/rasci/eye.svg", action: () => onModalProsbis(val) },
        { text: "Edit", icon: "/assets/images/rasci/pencil.svg", action: () => sendDetailbp(val) },
        {
          text: "Delete",
          icon: "/assets/images/rasci/small_redtrush.svg",
          action: () => checkChildrenProsbis(val),
          style: "color: red !important;",
        },
      ];

      dropdownItems.forEach((item) => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.className = "dropdown-item";
        a.innerHTML = `<img src="${item.icon}" alt="Icon"> ${item.text}`;
        if (item.style) a.style = item.style;
        a.onclick = item.action;
        li.appendChild(a);
        dropdownMenu.appendChild(li);
      });

      dropdownContainer.appendChild(button);
      dropdownContainer.appendChild(dropdownMenu);
      prosbisWrapper.appendChild(dropdownContainer);
      tdProses.appendChild(prosbisWrapper);
      tr.appendChild(tdProses);

      const rasciCells = this.mapRasciCells(
        val.id,
        appState.resultJabatan,
        appState.resultRasciMapping,
        val.indexGroup,
      );
      rasciCells.forEach((td) => tr.appendChild(td));
      // Tambahkan ke tableBody
      tableBody.appendChild(tr);
    });

    feather.replace();
    this.initializeTooltips();
  }

  mapRasciCells(businessProcessId, jobTitleList, rasciMapping, indexGroupId) {
    const cells = jobTitleList.map((job) => {
      const items = rasciMapping.filter((rm) => rm.businessProcessId === businessProcessId && rm.jobTitleId === job.id);
      const icons = items
        .map(
          ({ rasciCode }) =>
            `<img src="/assets/images/rasci/${rasciCode.toLowerCase()}.svg" alt="${rasciCode} Icon" style="padding-right:2px">`,
        )
        .join("");
      const commentTooltip = items.some((item) => item.comment)
        ? `<ul>${items.map(({ rasciCode, comment }) => `<li>${rasciCode}: ${comment}</li>`).join("")}</ul>`
        : "";

      const td = document.createElement("td");
      td.innerHTML = `
          <div class="rasci-container">
            <div class="rasci-icons">${icons}</div>
            ${
              commentTooltip
                ? `<img src="/assets/images/rasci/comment.svg" alt="Comment Icon" style="padding-right:2px" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-html="true" title="${commentTooltip}">`
                : ""
            }
            <img src="/assets/images/rasci/pencil_rasci.svg" alt="Pencil Icon" class="pencil-icon" onclick="onModalChoose('editNotation',${
              job.id
            }, '${indexGroupId}')">
          </div>
        `;

      return td;
    });

    return cells;
  }
  renderHeader(jobTitleList) {
    const tr = document.createElement("tr");
    tr.style.height = "30px"; // Sesuaikan tinggi row

    // Tambahkan kolom "Level"
    const thLevel = document.createElement("th");
    thLevel.scope = "col";
    thLevel.className = "level-col head-cell";
    thLevel.textContent = "Level";
    tr.appendChild(thLevel);

    // Tambahkan kolom "Index"
    const thIndex = document.createElement("th");
    thIndex.scope = "col";
    thIndex.className = "index-col head-cell";
    thIndex.textContent = "Index";
    tr.appendChild(thIndex);

    // Tambahkan kolom "Proses Bisnis"
    const thProses = document.createElement("th");
    thProses.scope = "col";
    thProses.className = "headcol head-cell";
    thProses.innerHTML = `<span style="padding-left:10px;">Proses Bisnis</span>`;
    tr.appendChild(thProses);

    // Tambahkan kolom berdasarkan jobTitleList
    jobTitleList.forEach((col) => {
      const th = document.createElement("th");
      th.scope = "col";
      th.className = `jabatan-cell jabatan-level-${col.level}`;
      th.style.width = "170px";

      // Wrapper luar
      const outerWrapper = document.createElement("div");
      outerWrapper.className = "jabatan-cell-outer-wrapper";

      // Wrapper dalam (tooltip)
      const innerWrapper = document.createElement("div");
      innerWrapper.className = "jabatan-cell-wrapper";
      innerWrapper.setAttribute("data-bs-toggle", "tooltip");
      innerWrapper.setAttribute("data-bs-placement", "bottom");
      innerWrapper.setAttribute("title", col.name);
      innerWrapper.textContent = col.name;

      outerWrapper.appendChild(innerWrapper);
      th.appendChild(outerWrapper);

      // Tambahkan dropdown button
      const dropdownContainer = document.createElement("div");

      const button = document.createElement("button");
      button.className = "dropdown-btn";
      button.type = "button";
      button.id = "dropdownMenuButton";
      button.setAttribute("data-bs-toggle", "dropdown");
      button.setAttribute("aria-expanded", "false");
      button.style.cursor = "pointer";
      button.innerHTML = `<i class="fas fa-ellipsis-v" style="font-size: 14px;"></i>`;

      const dropdownMenu = document.createElement("ul");
      dropdownMenu.className = "dropdown-menu dropdown-menu-end";
      dropdownMenu.setAttribute("aria-labelledby", "dropdownMenuButton");

      const dropdownItems = [
        { text: "Detail", icon: "/assets/images/rasci/eye.svg", action: `triggleDetailJob(${col.id})` },
        { text: "Competency", icon: "/assets/images/rasci/document.svg" },
        { text: "Job Description", icon: "/assets/images/rasci/clipboard.svg" },
      ];

      dropdownItems.forEach((item) => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.className = "dropdown-item";
        a.innerHTML = `<img src="${item.icon}" alt="Filter Icon"> ${item.text}`;
        if (item.action) a.setAttribute("onclick", item.action);
        li.appendChild(a);
        dropdownMenu.appendChild(li);
      });

      dropdownContainer.appendChild(button);
      dropdownContainer.appendChild(dropdownMenu);
      th.appendChild(dropdownContainer);

      tr.appendChild(th);
    });

    this.header.appendChild(tr);
    this.initializeTooltips();
  }

  render() {
    requestAnimationFrame(() => {
      this.body.innerHTML = "";
      this.setupBody();
      const fragment = document.createDocumentFragment();
      this.body.appendChild(fragment);
    });
  }
}

document.addEventListener("dataLoaded", function () {
  const resultJabatan = getState("resultJabatan");
  const resultProsbis = getState("resultProsbis");
  if (!resultJabatan || resultJabatan.length === 0) {
    console.error("resultJabatan is empty or undefined");
    return;
  }
  console.log("resultJabatan", resultJabatan);
  console.log("resultProsbis", resultProsbis);
  const container = document.getElementById("table-container");
  new VirtualTable(container, resultProsbis, resultJabatan);
});
