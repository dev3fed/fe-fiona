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
            document.getElementById("apply-compare").removeAttribute("disabled");
          } else {
            document.getElementById("apply-compare").setAttribute("disabled", "disabled");
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
      setState("resultProsbis", resultMatrix.data);
      setState("resultJabatan", resultPosition.data);
      setState("totalProsbis", resultMatrix.totalResult);
      setState("totalJob", resultPosition.totalResult);
      loadTableBody(resultMatrix.data);
      appendDynamicHeader(resultPosition.data);
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
