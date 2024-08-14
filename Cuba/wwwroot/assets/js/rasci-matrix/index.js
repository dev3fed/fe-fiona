let selectedText = "RASCI by Job";
document.addEventListener("dataLoaded", function () {});
function setSelectedText(text) {
  selectedText = text;
  document.getElementById("btnGroupDrop1").innerText = text;
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
            <label class="checkbox-label" for="chk-ani-1">
              <input class="checkbox_animated" id="chk-ani-1" type="checkbox" checked="">
            </label>
          </th>
          <th scope="col">Job Level</th>
          <th scope="col">Job Title</th>
        </tr>`;
        bodyContent = resultTblJob
          ?.map((item, i) => {
            return `<tr>
            <th scope="row">
             <label class="checkbox-label" for="chk-ani-1">
              <input class="checkbox_animated" id="chk-ani-1" type="checkbox" checked="">
            </label>
            </th>
            <td>${item.level}</td>
            <td>${item.name}</td>
        </tr>`;
          })
          .join("");
        break;
      case "RASCI by Bus...":
        console.log(resultTblRbp);

        modalSearchTitle = "Search RASCI by Business Process";
        searchLabel = `Search result for <b>"${inputText}"</b> (${resultTblRbp?.length} result)`;
        theadContent = `<tr>
          <th scope="col" style="width: 50px"> 
            <label class="checkbox-label" for="chk-ani-1">
              <input class="checkbox_animated" id="chk-ani-1" type="checkbox" checked="">
            </label>
          </th>
          <th scope="col" style="width: 80px">Level</th>
          <th scope="col" style="width: 80px">Index</th>
          <th scope="col">Business Process</th>
        </tr>`;
        bodyContent = resultTblRbp
          ?.map((item, i) => {
            return `<tr>
            <th scope="row">
              <label class="checkbox-label" for="chk-ani-1">
              <input class="checkbox_animated" id="chk-ani-1" type="checkbox" checked="">
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
           <th scope="col" style="width: 80px">Level</th>
          <th scope="col" style="width: 80px">Index</th>
          <th scope="col">Business Process</th>
        </tr>`;
        bodyContent = resultTblBp
          ?.map((item, i) => {
            `<tr>
            <th scope="row">
              <label class="radio-label" for="edo-ani-1">
                <input class="radio_animated" id="edo-ani-1" type="radio" name="rdo-ani" checked="">
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
