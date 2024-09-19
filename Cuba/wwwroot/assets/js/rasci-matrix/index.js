let selectedText = "RASCI by Job";
let selectedJobIds = [];
let SelectedProsbisId = [];
let selectedSingleId = "";
document.addEventListener("dataLoaded", function () {});
document.addEventListener("DOMContentLoaded", function () {});
function setSelectedText(text) {
  selectedText = text;
  document.getElementById("btnGroupDrop1").innerText = text;
  document.getElementById("inputText").value = "";
}

document
  .getElementById("searchButton")
  .addEventListener("click", async function () {
    const inputText = document.getElementById("inputText").value;
    const searchType =
      selectedText == "RASCI by Job"
        ? "job"
        : selectedText == "RASCI by Bus..."
        ? "businessprocess"
        : "businessprocess";
    let resultTblRbp = [];
    let resultTblJob = [];

    let resultTblBp = [];
    const dataTbl = await SearchMatrix({ type: searchType, search: inputText });
    if (dataTbl.status == 200) {
      switch (selectedText) {
        case "RASCI by Job":
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
      case "RASCI by Job":
        modalSearchTitle = `Search RASCI by job `;
        searchLabel = `Search result for <b>"${inputText}"</b> (${resultTblJob?.length} result)`;
        theadContent = `<tr>
          <th scope="col" style="width: 50px">
            <label class="checkbox-label" for="checked-head-job">
              <input class="checkbox_animated" id="checked-head-job" type="checkbox" onchange="selectAllJob(event)">
            </label>
          </th>
          <th scope="col">Job Level</th>
          <th scope="col">Job Title</th>
        </tr>`;
        bodyContent = resultTblJob
          ?.map((item, i) => {
            return `<tr>
            <th scope="row">
             <label class="checkbox-label" for="checked-body-job">
              <input class="checkbox_animated" id="checked-body-job" type="checkbox" value="${item.id}">
            </label>
            </th>
            <td>${item.level}</td>
            <td>${item.name}</td>
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
              <input class="checkbox_animated" id="checked-body-rbp" type="checkbox" value="${item.indexGroup}">
            </label>
            </th>
            <td>${item.level}</td>
            <td>${item.indexGroup}</td>
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
                <input class="radio_animated" id="checked-body-bp" type="radio" name="rdo-ani" onchange="selectProsbisId(event)" value="${item.indexGroup}">
              </label>
            </th>
               <td>${item.level}</td>
            <td>${item.indexGroup}</td>
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

// function selectAllJob(event) {
//   // Access the checkbox element using event.target
//   const checkbox = event.target;

//   // Get the checked state of the checkbox
//   const isChecked = checkbox.checked;
//   console.log(resultTblJob);
//   // You can now use this value to perform any desired actions
//   console.log(`Checkbox is ${isChecked ? "checked" : "unchecked"}`);

//   // If you need to check all other checkboxes, you could do something like this:
//   const allCheckboxes = document.querySelectorAll("#checked-body-job");
//   allCheckboxes.forEach((cb) => (cb.checked = isChecked));
// }

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

  if (checkbox.checked) {
    if (jobId !== "on" && !selectedJobIds.includes(jobId)) {
      selectedJobIds.push(jobId);
    }
  } else {
    selectedJobIds = selectedJobIds.filter((id) => id !== jobId);
  }

  updateHeaderCheckboxJob();
}

function selectAllJob(event) {
  const isChecked = event.target.checked;
  const allCheckboxes = document.querySelectorAll(".checkbox_animated");
  const applyButton = document.getElementById("apply-search");

  if (isChecked) {
    selectedJobIds = [];
    allCheckboxes.forEach((cb) => {
      cb.checked = true;
      const jobId = cb.value;
      if (jobId !== "on" && !selectedJobIds.includes(jobId)) {
        selectedJobIds.push(jobId);
      }
    });
  } else {
    selectedJobIds = [];
    allCheckboxes.forEach((cb) => (cb.checked = false));
  }
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

async function applySearch() {
  switch (selectedText) {
    case "RASCI by Job":
      const payload = {
        type: "job",
        parentId: selectedJobIds.join(","), // Menggabungkan ID job
      };
      try {
        const resultMatrix = await fetchDataMatrix(payload); // Memanggil data
        if (resultMatrix.status === 200) {
          // Mendapatkan instance modal dan menutup modal
          resultAllData(resultMatrix?.data);
          selectedJobIds = [];
          const modalElement = document.getElementById("modalSearch");
          const modal = bootstrap.Modal.getInstance(modalElement);
          setState("isSearchMatrix", true);
          if (modal) {
            modal.hide(); // Menutup modal jika ada instance yang valid
          }
        }
      } catch (error) {
        console.error("Error fetching data matrix", error);
      }
      break;

    case "RASCI by Bus...":
      const payloadProsbis = {
        type: "bybusinessprocess",
        parentId: SelectedProsbisId.join(","), // Menggabungkan ID job
      };
      try {
        const resultMatrix = await fetchDataMatrix(payloadProsbis); // Memanggil data
        if (resultMatrix.status === 200) {
          // Mendapatkan instance modal dan menutup modal
          resultAllData(resultMatrix?.data);
          SelectedProsbisId = [];
          const modalElement = document.getElementById("modalSearch");
          const modal = bootstrap.Modal.getInstance(modalElement);
          setState("isSearchMatrix", true);
          appState.isSearchMatrix = true;
          if (modal) {
            modal.hide(); // Menutup modal jika ada instance yang valid
          }
        }
      } catch (error) {
        console.error("Error fetching data matrix", error);
      }
      break;

    default:
      const payloadSingleProsbis = {
        type: "businessprocess",
        parentId: selectedSingleId, // Menggabungkan ID job
      };
      try {
        const resultMatrix = await fetchDataMatrix(payloadSingleProsbis); // Memanggil data
        if (resultMatrix.status === 200) {
          // Mendapatkan instance modal dan menutup modal
          resultAllData(resultMatrix?.data);
          selectedSingleId = "";
          const modalElement = document.getElementById("modalSearch");
          const modal = bootstrap.Modal.getInstance(modalElement);
          setState("isSearchMatrix", true);
          if (modal) {
            modal.hide(); // Menutup modal jika ada instance yang valid
          }
        }
      } catch (error) {
        console.error("Error fetching data matrix", error);
      }
      break;
  }
}
