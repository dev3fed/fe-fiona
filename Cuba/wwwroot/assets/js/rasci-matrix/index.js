let selectedText = "RASCI by Job";
document.addEventListener("dataLoaded", function () {});
function setSelectedText(text) {
  selectedText = text;
  document.getElementById("btnGroupDrop1").innerText = text;
}

document.getElementById("searchButton").addEventListener("click", function () {
  // Set modal content based on selectedText
  const inputText = document.getElementById("inputText").value;
  let modalSearchTitle = "";
  let searchLabel = "";
  switch (selectedText) {
    case "RASCI by Job":
      modalSearchTitle = `Search RASCI by job `;
      searchLabel = `Search result for <b>"${inputText}"</b> (21 result)`;
      break;
    case "RASCI by Bus...":
      modalSearchTitle = "Search RASCI by Business Process";
      searchLabel = `Search result for <b>"${inputText}"</b> (21 result)`;
      break;
    case "Business Pro...":
      modalSearchTitle = "Search Business Process";
      searchLabel = `Search result for <b>"${inputText}"</b> (21 result)`;
      break;
    default:
      modalSearchTitle = "No content available";
  }
  document.getElementById("modalSearchTitle").innerHTML = modalSearchTitle;
  document.getElementById("searchLabel").innerHTML = searchLabel;

  // Show the modal
  const modal = new bootstrap.Modal(document.getElementById("modalSearch"));
  modal.show();
});
