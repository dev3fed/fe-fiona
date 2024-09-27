function handleApprovalList() {
  const tableApproval = document.getElementById("table-approval");
  const emptyCard = document.getElementById("empty-approval");
  if (tableApproval) {
    tableApproval.style.display = "block";
  }
  if (emptyCard) {
    emptyCard.style.display = "none";
  }
}

function handleApprovalBack() {
  const approvalDetail = document.getElementById("approval-detail");
  const mainMatrix = document.getElementById("main-matrix");
  const headerMatrix = document.getElementById("header-matrix");
  const headerDetail = document.getElementById("header-detail-approval");
  if (approvalDetail) {
    approvalDetail.style.display = "none";
  }
  if (mainMatrix) {
    mainMatrix.style.display = "block";
  }
  if (headerDetail) {
    headerDetail.style.display = "none";
  }
  if (headerMatrix) {
    headerMatrix.style.display = "block";
  }
  // Remove ?id=1 from the URL
  const url = new URL(window.location);
  url.searchParams.delete("id"); // Remove the 'id' parameter
  window.history.pushState({}, "", url); // Update the URL without reloading the page
}
function handleDetailApproval() {
  const approvalDetail = document.getElementById("approval-detail");
  const mainMatrix = document.getElementById("main-matrix");
  const headerMatrix = document.getElementById("header-matrix");
  const headerDetail = document.getElementById("header-detail-approval");
  if (approvalDetail) {
    approvalDetail.style.display = "block";
  }
  if (mainMatrix) {
    mainMatrix.style.display = "none";
  }
  if (headerDetail) {
    headerDetail.style.display = "block";
  }
  if (headerMatrix) {
    headerMatrix.style.display = "none";
  }
  // Add or update ?id=1 in the current URL without refreshing
  const url = new URL(window.location);
  url.searchParams.set("id", 1); // Set id=1
  window.history.pushState({}, "", url); // Update the URL without reloading the page
}
