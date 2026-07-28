let selectedText = "RASCI by Pos...";
let selectedJobIds = [];
let selectedPrlIds = [];
let SelectedProsbisId = [];
let selectedSingleId = [];
document.addEventListener("dataLoaded", function () {});
document.addEventListener("DOMContentLoaded", function () {});
function setSelectedText(text) {
  selectedText = text;
  document.getElementById("btnGroupDrop1").innerText = text;
  document.getElementById("inputText").value = "";
}

document.getElementById("searchButton").addEventListener("click", async function () {
  const inputText = document.getElementById("inputText").value;
  const spinner = document.getElementById("loadingSearch");
  spinner.style.display = "inline-block";
  //
  const searchType =
    selectedText == "RASCI by Pos..."
      ? "job"
      : selectedText == "RASCI by Bus..."
        ? "businessprocess"
        : "businessprocess";
  const draftSoId = getState("draftSoId");
  const selectedValue = $("#dataSource-rasci").val();
  let resultTblRbp = [];
  let resultTblJob = [];

  let resultTblBp = [];
  const payload = {
    Type: searchType,
    Search: inputText,
    DraftSoId: draftSoId || null,
    DraftRasciId: selectedValue === "master" ? null : selectedValue,
  };
  const queryString = new URLSearchParams(payload).toString();
  const dataTbl = await SearchMatrix(queryString);
  if (dataTbl.status == 200) {
    spinner.style.display = "none";
    switch (selectedText) {
      case "RASCI by Pos...":
        resultTblJob = dataTbl.data;
        break;
      case "RASCI by Bus...":
        resultTblRbp = dataTbl.data;
        break;
      default:
        resultTblBp = dataTbl.data;
        break;
    }
  }
  let modalSearchTitle = "";
  let searchLabel = "";
  switch (selectedText) {
    case "RASCI by Pos...":
      modalSearchTitle = `Search RASCI by Position `;
      searchLabel = `Search result for <b>"${inputText}"</b> (${resultTblJob?.length} result)`;
      theadContent = `<tr>
          <th scope="col" style="width: 50px">
            <label class="checkbox-label" for="checked-head-job">
              <input class="checkbox_animated" id="checked-head-job" type="checkbox" onchange="selectAllJob(event)">
            </label>
          </th>
          <th scope="col">Position Level</th>
          <th scope="col">Position</th>
        </tr>`;
      bodyContent = resultTblJob
        ?.map((item, i) => {
          return `<tr>
            <th scope="row">
             <label class="checkbox-label" for="checked-body-job-${i}">
              <input class="checkbox_animated checkbox-body-job" id="checked-body-job" type="checkbox" 
              value="${item.unitCode || ""}" 
              prlOrg="${item.prlOrg || ""}">
            </label>
            </th>
            <td>${item.jobPositionAbbreviation || ""}</td>
            <td>${item.positionName || ""}</td>
        </tr>`;
        })
        .join("");
      break;
    case "RASCI by Bus...":
      modalSearchTitle = "Search RASCI by Business Process";
      searchLabel = `Search result for <b>"${inputText}"</b> (${resultTblRbp?.length} result)`;
      theadContent = `<tr>
          <th scope="col" style="width: 50px"> 
            <label class="checkbox-label" for="checked-head-rbp">
              <input class="checkbox_animated" id="checked-head-rbp" type="checkbox" onchange="selectAllProsbis(event)">
            </label>
          </th>
          <th scope="col" style="width: 50px">Level</th>
          <th scope="col" style="width: 80px">Index</th>
          <th scope="col">Business Process</th>
        </tr>`;
      bodyContent = resultTblRbp
        ?.map((item, i) => {
          return `<tr>
            <th scope="row">
              <label class="checkbox-label" for="checked-body-rbp">
              <input class="checkbox_animated" id="checked-body-rbp" type="checkbox" value="${item.indexNumber}">
            </label>
            </th>
            <td>${item.level}</td>
            <td>${item.indexNumber}</td>
            <td>${item.description}</td>
        </tr>`;
        })
        .join("");
      break;
    case "Business Pro...":
      modalSearchTitle = "Search Business Process";
      searchLabel = `Search result for <b>"${inputText}"</b> (${resultTblBp?.length} result)`;
      theadContent = `<tr>
          <th scope="col" style="width: 50px">
          Choose
          </th>
           <th scope="col" style="width: 50px">Level</th>
          <th scope="col" style="width: 80px">Index</th>
          <th scope="col">Business Process</th>
        </tr>`;
      bodyContent = resultTblBp
        ?.map((item, i) => {
          return `<tr>
            <th scope="row">
              <label class="radio-label" for="checked-body-bp">
                <input class="radio_animated" id="checked-body-bp" type="radio" name="rdo-ani" onchange="selectProsbisId(event)" value="${item.indexNumber}">
              </label>
            </th>
               <td>${item.level}</td>
            <td>${item.indexNumber}</td>
            <td>${item.description}</td>
        </tr>`;
        })
        .join("");
      break;
    default:
      modalSearchTitle = "No content available";
  }
  document.getElementById("modalSearchTitle").innerHTML = modalSearchTitle;
  document.getElementById("searchLabel").innerHTML = searchLabel;
  document.getElementById("tbl-search-header").innerHTML = theadContent;
  document.getElementById("tbl-search-body").innerHTML = bodyContent;

  document.querySelectorAll("#checked-body-job").forEach((checkbox) => {
    checkbox.addEventListener("change", selectSingleJob);
  });
  const headCheckboxJob = document.getElementById("checked-head-job");
  if (headCheckboxJob) {
    headCheckboxJob.addEventListener("change", selectAllJob);
  }
  document.querySelectorAll("#checked-body-rbp").forEach((checkbox) => {
    checkbox.addEventListener("change", selectSingleProsbis);
  });
  const headCheckboxProsbis = document.getElementById("checked-head-rbp");
  if (headCheckboxProsbis) {
    headCheckboxProsbis.addEventListener("change", selectAllProsbis);
  }
  // Show the modal
  const modal = new bootstrap.Modal(document.getElementById("modalSearch"));
  modal.show();
});
// Add event listener to the select-all checkbox

function selectProsbisId(event) {
  const jobId = event.target.value;
  selectedSingleId = jobId;
  const applyButton = document.getElementById("apply-search");
  if (applyButton) {
    applyButton.disabled = !jobId;
  }
}
function selectSingleJob(event) {
  const checkbox = event.target;
  const jobId = checkbox.value;
  const prlOrg = checkbox.getAttribute("prlOrg");
  if (checkbox.checked) {
    if (jobId !== "on") {
      selectedJobIds.push(jobId);
      selectedPrlIds.push(prlOrg);
    }
  }
  // else {
  //   selectedJobIds = selectedJobIds.filter((id) => id !== jobId);
  //   selectedPrlIds = selectedPrlIds.filter((id) => id !== prlOrg);
  // }
  updateHeaderCheckboxJob();
}

function selectAllJob(event) {
  const isChecked = event.target.checked;
  const bodyCheckboxes = document.querySelectorAll(".checkbox-body-job");
  const applyButton = document.getElementById("apply-search");

  selectedJobIds = [];
  selectedPrlIds = [];

  bodyCheckboxes.forEach((cb) => {
    cb.checked = isChecked;
    const jobId = cb.value;
    const prlOrg = cb.getAttribute("prlOrg");

    if (isChecked && jobId && jobId !== "on") {
      selectedJobIds.push(jobId);
      if (prlOrg) {
        selectedPrlIds.push(prlOrg);
      }
    }
  });
  if (applyButton) {
    applyButton.disabled = selectedJobIds.length === 0;
  }
}

function selectSingleProsbis(event) {
  const checkbox = event.target;
  const prosbisId = checkbox.value;
  if (checkbox.checked) {
    if (prosbisId !== "on" && !SelectedProsbisId.includes(prosbisId)) {
      SelectedProsbisId.push(prosbisId);
    }
  } else {
    SelectedProsbisId = SelectedProsbisId.filter((id) => id !== prosbisId);
  }

  updateHeaderCheckboxProsbis();
}

function selectAllProsbis(event) {
  const isChecked = event.target.checked;
  const allCheckboxes = document.querySelectorAll(".checkbox_animated");
  const applyButton = document.getElementById("apply-search");

  if (isChecked) {
    SelectedProsbisId = [];
    allCheckboxes.forEach((cb) => {
      cb.checked = true;
      const prosbisId = cb.value;
      if (prosbisId !== "on" && !SelectedProsbisId.includes(prosbisId)) {
        SelectedProsbisId.push(prosbisId);
      }
    });
  } else {
    SelectedProsbisId = [];
    allCheckboxes.forEach((cb) => (cb.checked = false));
  }
  if (applyButton) {
    applyButton.disabled = SelectedProsbisId.length === 0;
  }
}

function updateHeaderCheckboxJob() {
  const allCheckboxes = document.querySelectorAll(".checkbox_animated");
  const totalCheckbox = document.querySelectorAll("#checked-body-job");
  const headerCheckbox = document.getElementById("checked-head-job");
  const applyButton = document.getElementById("apply-search");

  const allChecked = Array.from(allCheckboxes).every((cb) => cb.checked);
  headerCheckbox.checked = allChecked;
  headerCheckbox.checked = selectedJobIds.length === totalCheckbox.length;
  if (applyButton) {
    applyButton.disabled = selectedJobIds.length === 0;
  }
}

function updateHeaderCheckboxProsbis() {
  const allCheckboxes = document.querySelectorAll(".checkbox_animated");
  const totalCheckbox = document.querySelectorAll("#checked-body-rbp");
  const headerCheckbox = document.getElementById("checked-head-rbp");
  const applyButton = document.getElementById("apply-search");
  const allChecked = Array.from(allCheckboxes).every((cb) => cb.checked);
  headerCheckbox.checked = allChecked;
  headerCheckbox.checked = SelectedProsbisId.length === totalCheckbox.length;

  if (applyButton) {
    applyButton.disabled = SelectedProsbisId.length === 0;
  }
}

async function searchMatrixByParams(ouIdArray, prlOrgArray) {
  selectedJobIds = ouIdArray;
  selectedPrlIds = prlOrgArray;
  const draftSoId = getState("draftSoId");
  const draftRasciId = getState("draftRasciId");
  const payload = {
    draftRasciId: draftRasciId == "master" ? null : draftRasciId,
    unitCode: selectedJobIds, // Menggabungkan ID job
    prlOrg: selectedPrlIds,
    row: 1,
    rowSize: 15,
  };

  const payloadJob = {
    col: 1,
    colSize: 10,
    indexNumber: [],
    draftRasciId: draftRasciId == "master" ? null : draftRasciId,
    draftSoId: draftSoId,
    unitCode: selectedJobIds,
    prlOrg: selectedPrlIds,
  };

  try {
    const resultPosition = await fetchPositionMatrix(payloadJob);
    const resultMatrix = await fetchProsbisMatrix(payload);
    const combineIndex = resultMatrix.data.map((val) => val.indexNumber);
    if (resultMatrix.success === true) {
      SelectedProsbisId = [];
      setState("isSearchMatrix", true);
      setState("idSearchProsbis", "");
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
      selectedJobIds = [];
      selectedPrlIds = [];
    }
  } catch (error) {
    console.error("Error fetching data matrix", error);
  }
}
async function applySearch() {
  const draftSoId = getState("draftSoId");
  const draftRasciId = getState("draftRasciId");
  const spinner = document.getElementById("applySearch");
  spinner.style.display = "inline-block";

  switch (selectedText) {
    case "RASCI by Pos...":
      const payload = {
        draftRasciId: draftRasciId == "master" ? null : draftRasciId,
        unitCode: selectedJobIds, // Menggabungkan ID job
        prlOrg: selectedPrlIds,
        row: 1,
        rowSize: 15,
      };
      const payloadJob = {
        col: 1,
        colSize: 10,
        indexNumber: [],
        draftRasciId: draftRasciId == "master" ? null : draftRasciId,
        draftSoId: draftSoId,
        unitCode: selectedJobIds,
        prlOrg: selectedPrlIds,
      };

      try {
        const resultPosition = await fetchPositionMatrix(payloadJob);
        const resultMatrix = await fetchProsbisMatrix(payload);
        const combineIndex = resultMatrix.data.map((val) => val.indexNumber);
        if (resultMatrix.success === true) {
          SelectedProsbisId = [];
          const modalElement = document.getElementById("modalSearch");
          const modal = bootstrap.Modal.getInstance(modalElement);
          setState("isSearchMatrix", true);
          setState("idSearchProsbis", "");
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
          selectedJobIds = [];
          selectedPrlIds = [];
          if (modal) {
            spinner.style.display = "none";
            modal.hide();
          }
        }
      } catch (error) {
        console.error("Error fetching data matrix", error);
      }
      break;

    case "RASCI by Bus...":
      const payloadByBusiness = {
        draftRasciId: draftRasciId == "master" ? null : draftRasciId,
        level: [],
        indexNumber: SelectedProsbisId,
        expandNumber: [],
        prlOrg: [],
        unitCode: [],
        row: 1,
        rowSize: 15,
      };
      try {
        const resultMatrix = await fetchProsbisMatrix(payloadByBusiness);
        const combineIndex = resultMatrix.data.map((val) => val.indexNumber);
        if (resultMatrix.success === true) {
          const payloadJob = {
            col: 1,
            colSize: 10,
            draftRasciId: draftRasciId == "master" ? null : draftRasciId,
            indexNumber: combineIndex,
            draftSoId: draftSoId,
          };
          const resultPosition = await fetchPositionMatrix(payloadJob);
          SelectedProsbisId = [];
          const modalElement = document.getElementById("modalSearch");
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
            spinner.style.display = "none";
            modal.hide();
          }
        }
      } catch (error) {
        console.error("Error fetching data matrix", error);
      }
      break;

    default:
      const payloadBusiness = {
        draftRasciId: draftRasciId == "master" ? null : draftRasciId,
        level: [],
        indexNumber: [selectedSingleId],
        expandNumber: [],
        type: "BusinessProcess",
        row: 1,
        rowSize: 15,
      };
      try {
        const resultMatrix = await fetchProsbisMatrix(payloadBusiness);
        if (resultMatrix.success === true) {
          // selectedSingleId = [];
          const modalElement = document.getElementById("modalSearch");
          const modal = bootstrap.Modal.getInstance(modalElement);
          setState("idSearchProsbis", selectedSingleId);
          setState("isSearchMatrix", true);
          setState("payloadProsbis", payloadBusiness);
          setState("resultProsbis", resultMatrix.data);
          setState("actionType", "BP_ONLY");
          setState("actionExport", "searchBusinessProcess");
          setState("resultJabatan", []);
          setState("totalProsbis", resultMatrix.totalResult);
          setState("totalJob", 0);
          loadTableBody(resultMatrix.data);
          loadTableHeader([]);
          setState("currentPageY", 1);
          setState("currentPageX", 1);
          if (modal) {
            spinner.style.display = "none";
            modal.hide();
          }
        }
      } catch (error) {
        console.error("Error fetching data matrix", error);
      }
      break;
  }
}
const handleExportMatrix = async () => {
  try {
    const payloadProsbis = getState("payloadProsbis");
    const payloadPosition = getState("payloadPosition");
    const actionExport = getState("actionExport");
    const loader = document.getElementById("loader");
    loader.style.display = "flex";
    let payload = {};
    let filename = "rasci_matrix_export.xlsx";

    switch (actionExport) {
      case "searchBusinessProcess":
        payload = {
          draftRasciId: payloadProsbis.draftRasciId || null,
          indexNumber: payloadProsbis.indexNumber || [],
          type: "BusinessProcess",
          unitCode: null,
          prlOrg: null,
          level: null,
          rasciNotation: null,
        };
        break;
      case "searchByBusiness":
        payload = {
          draftRasciId: payloadProsbis.draftRasciId || null,
          indexNumber: payloadProsbis.indexNumber || [],
          type: null,
          unitCode: null,
          prlOrg: null,
          level: null,
          rasciNotation: null,
        };
        break;
      case "searchByPosition":
        payload = {
          draftRasciId: payloadPosition.draftRasciId || null,
          indexNumber: null,
          type: null,
          unitCode: payloadPosition.unitCode,
          prlOrg: payloadProsbis.prlOrg,
          level: null,
          rasciNotation: null,
        };
        break;
      case "filterRasci":
        payload = {
          draftRasciId: payloadProsbis.draftRasciId || null,
          indexNumber: null,
          type: "filter",
          unitCode: payloadProsbis.unitCode || [],
          prlOrg: payloadProsbis.prlOrg || [],
          level: payloadProsbis.level || [],
          rasciNotation: payloadProsbis.rasciNotation || [],
        };
        break;
      default:
        payload = {
          draftRasciId: payloadProsbis.draftRasciId || null,
          indexNumber: null,
          unitCode: payloadProsbis.unitCode || [],
          prlOrg: payloadProsbis.prlOrg || [],
          level: payloadProsbis.level || [],
          rasciNotation: payloadProsbis.rasciNotation || [],
        };
    }
    const result = await fetchExportRasciMatrix(payload);
    if (result.success) {
      loader.style.display = "none";
      // File download already handled inside fetchExportRasciMatrix
      // Optionally show a success message here
    } else {
      console.error("Export failed:", result.error);
    }
  } catch (error) {
    console.error("Export failed:", error);
  }
};
