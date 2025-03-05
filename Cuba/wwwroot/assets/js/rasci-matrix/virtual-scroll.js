class VirtualTable {
  constructor(container, data, columns) {
    this.container = container;
    this.data = data;
    this.columns = columns;
    this.rowHeight = 30;
    this.columnWidth = 150;
    this.totalRows = data.length;
    this.totalColumns = columns.length;
    this.visibleRows = Math.ceil(container.clientHeight / this.rowHeight) + 1;
    this.visibleColumns = Math.ceil(container.clientWidth / this.columnWidth) + 1;
    this.header = document.getElementById("table-header");
    this.body = document.getElementById("table-body");
    this.renderHeader();
    this.setupBody();
    this.container.addEventListener("scroll", () => this.render());
    this.render();
  }

  setupBody() {
    // Atur tinggi spacer agar scrollbar muncul
    const spacer = document.createElement("tr");
    spacer.style.height = `${this.totalRows * this.rowHeight}px`;
    this.body.innerHTML = ""; // Bersihkan tbody
    this.body.appendChild(spacer);
  }

  renderHeader() {
    const tr = document.createElement("tr");
    this.columns.forEach((col, index) => {
      const th = document.createElement("th");
      th.textContent = col;
      th.style.width = this.columnWidth + "px";
      tr.appendChild(th);
    });
    this.header.appendChild(tr);
  }

  render() {
    requestAnimationFrame(() => {
      this.body.innerHTML = ""; // Bersihkan tbody sebelum menambahkan kembali
      this.setupBody(); // Pastikan spacer tetap ada

      const startRow = Math.floor(this.container.scrollTop / this.rowHeight);
      const endRow = Math.min(startRow + this.visibleRows, this.totalRows);
      const fragment = document.createDocumentFragment();

      for (let i = startRow; i < endRow; i++) {
        const tr = document.createElement("tr");
        tr.classList.add("virtual-row");
        tr.style.top = `${i * this.rowHeight}px`;

        this.columns.forEach((col, j) => {
          const td = document.createElement("td");
          td.textContent = this.data[i][col] || "-";
          td.style.width = this.columnWidth + "px";
          tr.appendChild(td);
        });

        fragment.appendChild(tr);
      }
      this.body.appendChild(fragment);
    });
  }
}

// Generate dummy data
const rowCount = 20000;
const colCount = 50;
const data = Array.from({ length: rowCount }, (_, rowIndex) => {
  const row = {};
  for (let colIndex = 0; colIndex < colCount; colIndex++) {
    row[`Column ${colIndex}`] = `R${rowIndex}C${colIndex}`;
  }
  return row;
});

const columns = Array.from({ length: colCount }, (_, i) => `Column ${i}`);
const container = document.getElementById("table-container");
new VirtualTable(container, data, columns);
