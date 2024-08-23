let selectedText = "RASCI by Job";
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
    // Set modal content based on selectedText
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
              <input class="checkbox_animated" id="checked-head-rbp" type="checkbox">
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
              <input class="checkbox_animated" id="checked-body-rbp" type="checkbox">
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
                <input class="radio_animated" id="checked-body-bp" type="radio" name="rdo-ani">
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

    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById("modalSearch"));
    modal.show();
  });

function selectAllJob(event) {
  // Access the checkbox element using event.target
  const checkbox = event.target;

  // Get the checked state of the checkbox
  const isChecked = checkbox.checked;

  // You can now use this value to perform any desired actions
  console.log(`Checkbox is ${isChecked ? "checked" : "unchecked"}`);

  // If you need to check all other checkboxes, you could do something like this:
  const allCheckboxes = document.querySelectorAll("#checked-body-job");
  allCheckboxes.forEach((cb) => (cb.checked = isChecked));
}
