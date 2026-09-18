async function searchJobCompare(event) {
  const inputSearch = event.target.value;
  const draftSoId = getState("draftSoId");
  const selectedValue = $("#dataSource-rasci").val();
  if (inputSearch.length < 3) return;

  try {
    const payload = {
      Type: "job",
      Search: inputSearch,
      DraftSoId: draftSoId,
      DraftRasciId: selectedValue == "master" ? null : selectedValue,
    };
    const queryString = new URLSearchParams(payload).toString();
    const { status, data } = await SearchMatrix(queryString);
    if (status === 200 && data.length) {
      const chkJobList = document.getElementById("chk-job-list");
      const jobSelectedList = document.getElementById("job-selected-list");

      if (!chkJobList || !jobSelectedList) {
        return console.error("Elemen yang dibutuhkan tidak ditemukan.");
      }

      chkJobList.innerHTML = data
        .map(
          (item) => `
        <div class="row-item">
          <div class="column-checkbox">
            <input class="checkbox_animated" type="checkbox" prlOrg="${item.prlOrg}" value="${item.unitCode}" data-name="${item.positionName}">
          </div>
          <div class="column-item-name">
            ${item.positionName}
          </div>
        </div>
      `,
        )
        .join("");

      chkJobList.addEventListener("change", (e) => {
        if (e.target.classList.contains("checkbox_animated")) {
          const value = e.target.value;
          const name = e.target.getAttribute("data-name");
          const prlOrg = e.target.getAttribute("prlOrg");
          if (e.target.checked) {
            if (!document.getElementById(`selected-job-${value};${prlOrg}`)) {
              const selectedItem = document.createElement("div");
              selectedItem.className = "selected-item";
              selectedItem.id = `selected-job-${value};${prlOrg}`;
              selectedItem.innerHTML = `
                ${name}
                <span class="remove-item" data-value="${value}" prlOrg=${prlOrg}>
                  <i class="fas fa-times"></i>
                </span>
              `;
              jobSelectedList.appendChild(selectedItem);
            }
          } else {
            const itemToRemove = document.getElementById(`selected-job-${value};${prlOrg}`);
            if (itemToRemove) itemToRemove.remove();
          }
          if (jobSelectedList.childElementCount > 1) {
            document.getElementById("apply-compare")?.removeAttribute("disabled");
            document.getElementById("apply-compare-ai")?.removeAttribute("disabled");
          } else {
            document.getElementById("apply-compare")?.setAttribute("disabled", "disabled");
            document.getElementById("apply-compare-ai")?.setAttribute("disabled", "disabled");
          }
        }
      });

      jobSelectedList.addEventListener("click", (e) => {
        if (e.target.closest(".remove-item")) {
          const value = e.target.closest(".remove-item").getAttribute("data-value");
          const prlOrg = e.target.closest(".remove-item").getAttribute("prlOrg");
          const checkbox = document.querySelector(`input[type="checkbox"][value="${value}"][prlOrg="${prlOrg}"]`);
          if (checkbox) checkbox.checked = false;
          document.getElementById(`selected-job-${value};${prlOrg}`).remove();
        }
      });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function applyCompare() {
  const draftSoId = getState("draftSoId");
  const draftRasciId = getState("draftRasciId");
  const spinner = document.getElementById("applyCompare");
  spinner.style.display = "inline-block";
  const selectedItems = Array.from(document.querySelectorAll("#job-selected-list .selected-item")).map((item) => {
    const span = item.querySelector(".remove-item");
    return {
      id: span.getAttribute("data-value"),
      prl: span.getAttribute("prlorg"),
      name: item.childNodes[0].textContent.trim(),
    };
  });

  const unitCode = selectedItems.map((item) => item.id);
  const prl = selectedItems.map((item) => item.prl);
  const payload = {
    draftRasciId: draftRasciId == "master" ? null : draftRasciId,
    unitCode: unitCode,
    prlOrg: prl,
    row: 1,
    rowSize: 15,
  };
  const payloadJob = {
    col: 1,
    colSize: 10,
    indexNumber: [],
    draftRasciId: draftRasciId == "master" ? null : draftRasciId,
    unitCode: unitCode,
    draftSoId: draftSoId,
    prlOrg: prl,
  };

  try {
    const resultPosition = await fetchPositionMatrix(payloadJob);
    setState("idSearchProsbis", "");
    const resultMatrix = await fetchProsbisMatrix(payload);
    const combineIndex = resultMatrix.data.map((val) => val.indexNumber);
    if (resultMatrix.success === true) {
      selectedJobIds = [];
      const modalElement = document.getElementById("modalJobCompare");
      const modal = bootstrap.Modal.getInstance(modalElement);
      spinner.style.display = "none";
      setState("isSearchMatrix", true);
      setState("payloadPosition", payloadJob);
      setState("payloadProsbis", payload);
      setState("actionType", "POS_THEN_BP");
      setState("actionExport", "searchByPosition");
      setState("resultProsbis", resultMatrix.data);
      setState("resultJabatan", resultPosition.data);
      setState("totalProsbis", resultMatrix.totalResult);
      setState("totalJob", resultPosition.totalResult);
      loadTableBody(resultMatrix.data);
      loadTableHeader(resultPosition.data);
      mapRasciCells(combineIndex, resultPosition.data);
      setState("currentPageY", 1);
      setState("currentPageX", 1);
      if (modal) {
        modal.hide();
      }
    }
  } catch (error) {
    console.error("Error fetching data matrix", error);
  }
}

async function handleCloseModal() {
  const chkJobList = document.getElementById("chk-job-list");
  if (chkJobList) {
    chkJobList.innerHTML = "";
  }
  const jobSelectedList = document.getElementById("job-selected-list");
  if (jobSelectedList) {
    jobSelectedList.innerHTML = "";
  }
  const inputSearch = document.getElementById("inputSearchCompare");
  if (inputSearch) {
    inputSearch.value = "";
  }
}

// ==================== Smart Position Compare (Fiona AI) Functions ====================
let smartCompareLastSharedIndexes = [];

async function applySmartCompareAi() {
  const selectedItems = Array.from(document.querySelectorAll("#job-selected-list .selected-item")).map((item) => {
    return item.childNodes[0].textContent.trim();
  }).filter(name => name.length > 0);

  if (selectedItems.length < 2) {
    if (typeof swal !== "undefined") {
      swal("Peringatan", "Silakan pilih minimal 2 posisi jabatan untuk dibandingkan dengan Fiona AI.", "warning");
    }
    return;
  }

  const spinner = document.getElementById("spinnerCompareAi");
  if (spinner) spinner.style.display = "inline-block";

  const selectedValue = $("#dataSource-rasci").val();
  const draftRasciId = selectedValue === "master" ? null : selectedValue;

  const payload = {
    Type: "compare-ai",
    Search: selectedItems.join(","),
    DraftRasciId: draftRasciId,
  };
  const queryString = new URLSearchParams(payload).toString();

  try {
    const res = await SearchMatrix(queryString);
    if (spinner) spinner.style.display = "none";

    if (res.status === 200 && res.data) {
      // Hide JobCompare modal
      const modalCompareEl = document.getElementById("modalJobCompare");
      if (modalCompareEl) {
        const modalCompare = bootstrap.Modal.getInstance(modalCompareEl);
        if (modalCompare) modalCompare.hide();
      }

      // Populate Smart Compare Result modal
      document.getElementById("smartCompareExecSummary").innerText = res.data.executiveSummary || "Analisis perbandingan selesai.";
      document.getElementById("smartCompareWorkloadBalance").innerText = res.data.workloadBalanceAnalysis || "-";
      document.getElementById("smartCompareRecommendation").innerText = res.data.recommendation || "-";

      smartCompareLastSharedIndexes = res.data.sharedProcessIndexNumbers || [];
      const sharedCount = res.data.sharedProcessesCount || 0;
      document.getElementById("smartCompareSharedCountInfo").innerText = `Terdapat ${sharedCount} proses bisnis bersama (joint responsibility)`;
      document.getElementById("btnFilterSharedMatrix").disabled = sharedCount === 0;

      // Render side-by-side metric cards
      const metricsRow = document.getElementById("smartCompareMetricsRow");
      const metrics = res.data.metrics || [];
      if (metricsRow) {
        metricsRow.innerHTML = metrics.map(m => `
          <div class="col-md-${Math.max(3, Math.floor(12 / metrics.length))}">
            <div class="card border-0 shadow-sm p-3 bg-white rounded border-top border-4 border-primary h-100">
              <h6 class="fw-bold text-dark text-truncate mb-2" title="${m.positionName}">${m.positionName}</h6>
              <div class="d-flex justify-content-between align-items-center mb-1">
                <span class="small text-muted">Accountable ('A'):</span>
                <span class="badge bg-danger fw-bold fs-6">${m.totalAccountable}</span>
              </div>
              <div class="d-flex justify-content-between align-items-center mb-1">
                <span class="small text-muted">Responsible ('R'):</span>
                <span class="badge bg-primary fw-bold fs-6">${m.totalResponsible}</span>
              </div>
              <div class="d-flex justify-content-between align-items-center">
                <span class="small text-muted">Total Prosbis Dipetakan:</span>
                <span class="badge bg-secondary fw-bold fs-6">${m.totalMappedProcesses}</span>
              </div>
            </div>
          </div>
        `).join("");
      }

      // Show Result modal
      const modalResult = new bootstrap.Modal(document.getElementById("modalSmartCompareResult"));
      modalResult.show();
    } else {
      if (typeof swal !== "undefined") {
        swal("Gagal", "Gagal mengambil data perbandingan dari Fiona AI.", "error");
      }
    }
  } catch (error) {
    console.error("Error running Smart Compare AI:", error);
    if (spinner) spinner.style.display = "none";
    if (typeof swal !== "undefined") {
      swal("Gagal", "Terjadi kesalahan saat memproses perbandingan posisi Fiona AI.", "error");
    }
  }
}

async function filterSharedProcessesToMatrix() {
  if (!smartCompareLastSharedIndexes || smartCompareLastSharedIndexes.length === 0) return;

  const draftSoId = getState("draftSoId");
  const selectedValue = $("#dataSource-rasci").val();
  const draftRasciId = selectedValue === "master" ? null : selectedValue;

  const payloadByBusiness = {
    draftRasciId: draftRasciId,
    level: [],
    indexNumber: smartCompareLastSharedIndexes,
    expandNumber: [],
    prlOrg: [],
    unitCode: [],
    row: 1,
    rowSize: 15,
  };

  try {
    const resultMatrix = await fetchProsbisMatrix(payloadByBusiness);
    if (resultMatrix.success === true) {
      const payloadJob = {
        col: 1,
        colSize: 10,
        draftRasciId: draftRasciId,
        indexNumber: smartCompareLastSharedIndexes,
        draftSoId: draftSoId,
      };
      const resultPosition = await fetchPositionMatrix(payloadJob);
      const combineIndex = resultMatrix.data.map((val) => val.indexNumber);

      SelectedProsbisId = [];
      const modalElement = document.getElementById("modalSmartCompareResult");
      const modal = bootstrap.Modal.getInstance(modalElement);

      setState("idSearchProsbis", "");
      setState("isSearchMatrix", true);
      setState("payloadProsbis", payloadByBusiness);
      setState("payloadPosition", payloadJob);
      setState("actionType", "BP_THEN_JOB");
      setState("actionExport", "searchByBusiness");
      setState("resultProsbis", resultMatrix.data);
      setState("resultJabatan", resultPosition.data);
      setState("totalProsbis", resultMatrix.totalResult);
      setState("totalJob", resultPosition.totalResult);
      loadTableBody(resultMatrix.data);
      loadTableHeader(resultPosition.data);
      mapRasciCells(combineIndex, resultPosition.data);
      setState("currentPageY", 1);
      setState("currentPageX", 1);

      if (modal) {
        modal.hide();
      }
      if (typeof swal !== "undefined") {
        swal("Berhasil", `Grid RASCI Matrix berhasil di-filter ke ${smartCompareLastSharedIndexes.length} proses bisnis bersama.`, "success");
      }
    }
  } catch (error) {
    console.error("Error applying shared processes filter:", error);
    if (typeof swal !== "undefined") {
      swal("Gagal", "Terjadi kesalahan saat menerapkan filter ke matrix.", "error");
    }
  }
}
