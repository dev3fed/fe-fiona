function handleClickCard() {
  const tableDraft = document.getElementById("table-draft");
  const emptyCard = document.getElementById("empty-draft");
  if (tableDraft) {
    tableDraft.style.display = "block";
  }
  if (emptyCard) {
    emptyCard.style.display = "none";
  }
}

function handleBack() {
  const draftDetail = document.getElementById("draft-detail");
  const mainMatrix = document.getElementById("main-matrix");
  const headerMatrix = document.getElementById("header-matrix");
  const headerDetail = document.getElementById("header-detail-draft");
  if (draftDetail) {
    draftDetail.style.display = "none";
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
}
function handleOpenDetail() {
  const draftDetail = document.getElementById("draft-detail");
  const mainMatrix = document.getElementById("main-matrix");
  const headerMatrix = document.getElementById("header-matrix");
  const headerDetail = document.getElementById("header-detail-draft");
  if (draftDetail) {
    draftDetail.style.display = "block";
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
}
