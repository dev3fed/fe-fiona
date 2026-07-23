// // $(document).ready(function () { make it asynch
// $(document).ready(async function () {
//   getTableListDraftDetail(listDraftDetail);
//   const urlParams = new URLSearchParams(window.location.search);
//   const draftId = urlParams.get("draftId");
//   const res = await detailDraftOrganizationStructure(draftId);

//   const draft = res.data?.draft;
//   const draftDetail = res.data?.draftDetail;
//   const draftSubordinate = res.data?.listJobSubordinate;
//   const draftSgSsg = res.data?.listJobSssg;

//   $("#draftName").text(draft?.draftName);
//   $("#requestId").text(draft?.requestId);
//   $("#createdBy").text(draft?.createBy);
//   $("#createdDate").text(draft?.createdAt);
//   $("#draftType").text(draft?.typeDetail);

//   $("#positionName").text(draftDetail?.positionName ?? "-");
//   $("#abbrvPosition").text(draftDetail?.abbrvPosition ?? "-");
//   $("#orgUnitName").text(draftDetail?.orgUnitName ?? "-");
//   $("#orgPrl").text(draftDetail?.prlOrg ?? "-");
//   $("#formation").text(draftDetail?.formation ?? "-");
//   $("#careerType").text(draftDetail?.careerType ?? "-");
//   $("#careerLevel").text(draftDetail?.careerLevel ?? "-");
//   $("#basket").text(draftDetail?.isBasket == true ? "Yes" : "No");
//   $("#directReport").text(draftDetail?.directReport ?? "-");
//   $("#neckFunction").text(draftDetail?.neckFunction == true ? "Yes" : "No");
//   $("#isProject").text(draftDetail?.isProject == true ? "Yes" : "No");
//   $("#coordination").text(draftDetail?.isCoordination == true ? "Yes" : "No");
//   $("#coordinationWith").text(draftDetail?.coordinationWith ?? "-");
//   $("#directorate").text(draftDetail?.function == "null" ? "-" : draftDetail?.section);
//   $("#division").text(draftDetail?.division == "null" ? "-" : draftDetail?.section);
//   $("#subdivision").text(draftDetail?.subDivision == "null" ? "-" : draftDetail?.section);
//   $("#department").text(draftDetail?.department == "null" ? "-" : draftDetail?.section);
//   $("#section").text(draftDetail?.section == "null" ? "-" : draftDetail?.section);
//   $("#personnelAreaName").text(
//     draftDetail?.personalAreaName == "null" || draftDetail?.personalAreaName == "" ? "-" : draftDetail?.personalAreaName
//   );

//   // listJobSubordinate
//   const data = draftSubordinate.length > 0 ? draftSubordinate : [];
//   getTablePositionDetail(data);
//   console.log("draftSgSsg", draftSgSsg);

//   $("#mainSkillGroup").text(draftSgSsg?.mainSg?.text ?? "-");
//   $("#mainSubSkillGroup").text(draftSgSsg?.mainSsg?.text ?? "-");
//   $("#secondSkillGroup").text(draftSgSsg?.secondSg?.text ?? "-");
//   $("#secondSubSkillGroup").text(draftSgSsg?.secondSsg?.text ?? "-");
//   $("#thirdSkillGroup").text(draftSgSsg?.thirdSg?.text ?? "-");
//   $("#thirdSubSkillGroup").text(draftSgSsg?.thirdSsg?.text ?? "-");

//   detailChartPreview("os-preview-container", draftDetail?.directReport, res.data);
//   // get table draft detail list
// });

async function checkPage() {
  // cons
  const status = 3;
  const user = JSON.parse(localStorage.getItem("user")) === "admin" ? "superadmin" : "superadmin";
  console.log("status", status);
  console.log("user", user);
  $("#statusApproval").html(
    `<span class="p-2 b-r-8 w-100 text-center ${statusApprovalClass[1]}">${statusApproval[1]}</span>`,
  );
  // delete draft and submit approval must be hide, becouse it used only for draft detail page
  $("#deleteDraft, #submitApproval").hide();
  $("#acceptApproval, #rejectApproval").show();

  const shouldShowApprovalButtons = user === "admin" && (status === 1 || status === 4);
  $("#acceptApproval, #rejectApproval").toggle(shouldShowApprovalButtons);
  if (lastPath === "draft-detail") {
    $("#statusApproval, #acceptApproval, #rejectApproval").hide();
    $("#deleteDraft, #submitApproval").show();
  } else {
    $("#detailTitle").text("Approval Detail");
    $("#draftDetailBreadcrumb").text("Approval Detail");
    $("#statusApproval, #acceptApproval, #rejectApproval").show();
  }

  const hideButtons = status !== 5 && status !== 6;
  const hideDraftButtons = status !== 0 && status !== 3;
  const hideAllButtons = status === 6;

  $("#exportFile, #finalize").toggle(!hideButtons);
  $("#deleteDraft, #submitApproval").toggle(!hideDraftButtons);
  if (hideAllButtons) {
    $("#exportFile, #finalize, #deleteDraft, #submitApproval").hide();
  }
}

function updateDatetoIndonesianFormat(dateString) {
  const date = new Date(dateString);
  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };
  return date.toLocaleDateString("id-ID", options);
}

async function initializeDraftDetail(getDraft) {
  const createdDate = updateDatetoIndonesianFormat(getDraft?.createdDate);
  const updatedDate = getDraft?.modifiedDate ? updateDatetoIndonesianFormat(getDraft?.modifiedDate) : null;
  const submittedDate = getDraft?.submittedDate ? updateDatetoIndonesianFormat(getDraft?.submittedDate) : null;
  const rejectedDate = getDraft?.rejectedDate ? updateDatetoIndonesianFormat(getDraft?.rejectedDate) : null;
  const approvedDate = getDraft?.approvedDate ? updateDatetoIndonesianFormat(getDraft?.approvedDate) : null;
  const rejectApproved = approvedDate ? approvedDate : rejectedDate;

  $("#draftName").text(getDraft?.draftName);
  $("#draftNameApproval").text(getDraft?.draftName);
  $("#requestId").text(getDraft?.draftId);
  $("#requestIdApproval").text(getDraft?.draftId);
  $("#createdBy").text(getDraft?.createdBy);
  $("#createdDate").text(createdDate);
  $("#updatedBy").text(getDraft?.modifiedBy);
  $("#updatedDate").text(updatedDate ? updatedDate : "-");
  $("#submittedBy").text(getDraft?.submittedBy ?? "System");
  $("#submittedDate").text(submittedDate ? submittedDate : "-");
  $("#approvedRejectBy").text("System");
  $("#approvedRejectDate").text(rejectApproved ? rejectApproved : "-");
  let statusText = "Draft";
  let statusClass = "bg-secondary";
  if (getDraft.isSubmitted) {
    statusText = "On Review";
    statusClass = "label-warning-custom";
  }
  if (getDraft.isRejected) {
    statusText = "Rejected";
    statusClass = "label-danger-custom";
  }
  if (getDraft.isApproved) {
    statusText = "Approved";
    statusClass = "label-success-custom";
  }
  if (getDraft.isFinalized) {
    statusText = "Finalized";
    statusClass = "label-primary-custom";
  }
  $(`#statusApproval`).html(`<span class="p-2 b-r-8 ${statusClass}">${statusText}</span>`);
}

//  =================
// detail draft
//  =================

function addJobTitle() {
  window.location.href = "/organization/form-position";
}
function importDraft() {
  alert("importDraft");
}

function exportDraft() {
  alert("exportDraft");
}
async function backToOrg(params) {
  const urlParts = window.location.pathname.split("/");
  const lastPath = urlParts.pop() || urlParts.pop();
  console.log("lastPath", lastPath);
  if (lastPath === "approval-detail") {
    window.location.href = "/organization/index?activeTab=request";
  } else {
    window.location.href = "/organization/index?activeTab=draft";
  }
}
async function confirmDeleteDraft(id) {
  let rollback = await rollbackDraftSO(id);
  console.log("rollback", rollback);
  if (rollback.data.status == "Failed") {
    // data.desctiption
    swal("Error", rollback.data.description, "error");
    return;
  } else {
    if (rollback) {
      swal("Success", "Draft has been deleted", "success");
      // wait 2s
      // setTimeout(() => {
      //   window.location.href = "/organization/index";
      // }, 3000);
    }
    // wait 2s then redirect to organization index
    setTimeout(() => {
      window.location.href = "/organization/index";
    }, 2000);
  }
}

function deleteDraft() {
  // const getDraftById = lsListDraft.find((x) => x.draftId == organizationAttribute.orgUnitId);
  const draftName = $("#draftName").text();

  const action = [
    {
      button: "Cancel",
      className: "btn-primary",
      callback: function () {
        hideModal(`modalConfirm`);
      },
    },
    {
      button: "Delete",
      className: "btn-outline-dark",
      callbackFunction: "confirmDeleteDraft",
    },
  ];
  modalConfrimHelper(
    "delete",
    "Delete Draft",
    `Are you sure want to delete <b>${draftName}</b> draft?`,
    "All Position title in this draft will be deleted, including related RASCI notations, Competencies, and Position Descriptions",
    action,
    "",
    urlParams.get("draftId"),
  );
}

function confirmDelete(id) {
  // alert("confirmDelete" + id);
  hideModal(`modalConfirm`);
  swal("Deleted", "Activity data has been deleted", "success");
}

async function confirmSubmit(id) {
  const draftId = urlParams.get("draftId");
  loader(true);
  await draftSubmitToApproval(draftId);
  const getDataDraft = await draftDetailById(draftId);
  loader(false);
  $("#modalConfirm").modal("hide");
  swal("Success", "Draft has been submitted to approval", "success");
  checkButtonDraftDetail(getDataDraft.data);
  // move to organization index
  window.location.href = "/organization/index?activeTab=request";
}

async function confirmSubmitApproval(id) {
  loader(true);
  const draftId = urlParams.get("draftId");
  await draftApprove(draftId);
  const getDataDraft = await draftDetailById(draftId);
  checkButtonDraftDetail(getDataDraft.data);
  $("#modalConfirm").modal("hide");
  swal("Approved", "draft has been approved.", "success");
  loader(false);
  // wait 2sc then redirect to organization index
  setTimeout(() => {
    window.location.href = "/organization/index?activeTab=request";
  }, 1000);
}
async function confirmRejectApproval(id) {
  loader(true);
  const draftId = urlParams.get("draftId");
  await draftReject(draftId, rejectReason);
  const getDataDraft = await draftDetailById(draftId);
  checkButtonDraftDetail(getDataDraft.data);
  $("#modalConfirm").modal("hide");
  swal("Rejected", "draft has been rejected.", "success");
  loader(false);
  setTimeout(() => {
    window.location.href = "/organization/index?activeTab=draft";
  }, 1000);
}

async function previewDesignCost() {
  await changeDataDesignCostFilter($("#selectDraftFilterByDataSource").val());
  $("#modalPreviewDesignCost").modal("show");
}

$("#selectDraftFilterByDataSource").on("change", async function () {
  await changeDataDesignCostFilter($(this).val());
});

async function previewOrgChart() {
  getDataListAsync([
    {
      id: "searchOrgNode",
      endpoint: "chart/job/list",
      draftId: organizationAttribute.orgUnitId,
      dropdownParent: $("#modalPreviewOrgChart"),
    },
  ]);
  $("#modalPreviewOrgChart").modal("show");
  showChartLoading("chart-container-custom");
  try {
    const dataChart = await chartShow({
      draftId: organizationAttribute.orgUnitId,
      jobCode: defaultNodeId,
      depth: 5,
    });
    renderOrgChart(dataChart.data, defaultNodeId, false);
    setTimeout(() => {
      if (typeof hideChartLoading === "function") {
        hideChartLoading("chart-container-custom");
      }
      console.log("Chart initialization and loading completed");
    }, 1500); // Wait 1.5 seconds for chart to fully render
  } catch (error) {
    console.error("Error in initializeHelper:", error);
    // Hide loading and show error message on failure
    if (typeof hideChartLoading === "function") {
      hideChartLoading("chart-container-custom");
    }
    // Show error message in chart container
    const container = document.querySelector(".chart-container-custom") || document.getElementById("osContainer");
    if (container) {
      container.innerHTML =
        '<div style="text-align: center; padding: 20px; color: #999;">Chart loading failed. Please try again.</div>';
    }
  }
}

$("#searchOrgNode").on("change", function () {
  const searchValue = $("#searchOrgNode").val();
  if (!searchValue) return;
  focusNode(searchValue);
});

function submitToApproval() {
  const draftId = urlParams.get("draftId");
  const draftName = $("#draftName").text();
  const action = [
    actionBack,
    {
      button: "Yes, Submit",
      className: "btn-primary",
      callbackFunction: "confirmSubmit",
    },
  ];
  modalConfrimHelper(
    "confirm",
    "Submit to Approval",
    `Are you sure want to submit to approval <b>${draftName}</b> draft?`,
    "You cannot change data after submit",
    action,
    "",
    draftId,
  );
}

function finalizeApproval() {
  $("#modalUploadFinalized").modal("show");
}

async function clickUploadFunction() {
  const file = $("#fileImportDraft")[0].files[0];
  const sendFile = await uploadZhroomDraftSO(organizationAttribute.orgUnitId, file);
  if (sendFile.status != 200) {
    swal("Failed", "Failed to import data draft", "error");
    return;
  }
  swal("Success", "Data has been imported", "success");
  hideModal(`modalConfirm`);
}

function editPositionDraft(id) {
  localStorage.setItem("backPage", "draft-detail");
  window.location.href = "/organization/form-position?unitCode=" + id;
}

async function detailPositionDraftOld(id) {
  let findPosition = await chartJobDetail({
    draftId: organizationAttribute.orgUnitId,
    jobCode: id,
  });
  findPosition = findPosition?.data;
  if (findPosition == undefined) {
    alert("Data not found");
    return;
  }
  console.log("findPosition", findPosition);
  $("#jobName").text(
    findPosition.positionName == "" || findPosition.positionName == null ? "-" : findPosition.positionName,
  );
  $("#positionName").text(
    findPosition.positionName == "" || findPosition.positionName == null ? "-" : findPosition.positionName,
  );
  $("#abbrvPosition").text(
    findPosition.abbreviationName == "" || findPosition.abbreviationName == null ? "-" : findPosition.abbreviationName,
  );
  $("#orgUnitName").text(findPosition.unitName == "" || findPosition.unitName == null ? "-" : findPosition.unitName);
  $("#orgPrl").text(findPosition.prlOrg == "" || findPosition.prlOrg == null ? "-" : findPosition.prlOrg);
  $("#formation").text(findPosition.formation == "" || findPosition.formation == null ? "-" : findPosition.formation);
  $("#careerType").text(
    findPosition.careerTypeName == "" || findPosition.careerTypeName == null ? "-" : findPosition.careerTypeName,
  );
  $("#careerLevel").text(
    findPosition.careerLevelName == "" || findPosition.careerLevelName == null ? "-" : findPosition.careerLevelName,
  );
  $("#basket").text(findPosition.basket.length > 0 ? "Yes" : "No");
  $("#directReport").text(
    findPosition.directorateName == "" || findPosition.directorateName == null ? "-" : findPosition.directorateName,
  );
  $("#neckFunction").text(findPosition.isNeck ? "Yes" : "No");
  $("#isProject").text(findPosition.isProject ? "Yes" : "No");
  $("#coordination").text(findPosition.coordinationWith !== "" ? "Yes" : "No");
  $("#coordinationWith").text(
    findPosition.coordinationWith == "" || findPosition.coordinationWith == null ? "-" : findPosition.coordinationWith,
  );
  $("#directorate").text(
    findPosition.directorateName == "" || findPosition.directorateName == null ? "-" : findPosition.directorateName,
  );
  $("#division").text(
    findPosition.divisionName == "" || findPosition.divisionName == null ? "-" : findPosition.divisionName,
  );
  $("#subDivision").text(
    findPosition.subDivisionName == "" || findPosition.subDivisionName == null ? "-" : findPosition.subDivisionName,
  );
  $("#department").text(
    findPosition.departmentName == "" || findPosition.departmentName == null ? "-" : findPosition.departmentName,
  );
  $("#section").text(findPosition.section == "" || findPosition.section == null ? "-" : findPosition.section);
  $("#personnelAreaName").text(
    findPosition.sectionName == "" || findPosition.sectionName == null ? "-" : findPosition.sectionName,
  );

  const skillGroup = findPosition?.skillGroups ? findPosition?.skillGroups : [];
  const arrayType = ["Main", "Second", "Third"];
  if (skillGroup.length > 0) {
    findPosition.skillGroups.forEach((item, index) => {
      $(`#modal${arrayType[index]}SkillGroup`).text(item.skillGroupName);
      $(`#modal${arrayType[index]}SubSkillGroup`).text(item.subSkillGroupName);
    });
  }

  $("#modalDetailJobDraft").modal("show");
}

async function detailPositionDraft(id) {
  await modalJobPopup(id);
}

async function detailapproval(id) {
  $("#deleteJob, #editJob, #handleExport, #duplicateJob, #showJobdesc, #showRasciMatrix").hide();
  await modalJobPopup(id);
}

async function confirmRollback(unitCodePrlOrg) {
  const [unitCode, prlOrg] = unitCodePrlOrg.split(",");
  const rollback = await deleteJobAndSubordinates({
    draftId: organizationAttribute.orgUnitId,
    unitCode: unitCode,
    prlOrg: prlOrg,
    userId: "system",
  });

  if (rollback) {
    hideModal(`modalConfirm`);
    swal("Success", "Data has been rollback", "success");
    const getDataDraft = await draftDetailById(organizationAttribute.orgUnitId);
    checkButtonDraftDetail(getDataDraft.data);
  }
  // const getDataDraft = await draftDetailById(organizationAttribute.orgUnitId);
}

function deletePositionDraft(positionId, prlOrg) {
  const action = [
    {
      button: "Back",
      className: "btn-primary",
      callback: function () {
        hideModal(`modalConfirm`);
      },
    },
    {
      button: "delete",
      className: "btn-outline-danger",
      callbackFunction: "confirmRollback",
    },
  ];
  modalConfrimHelper(
    "delete",
    "Delete Data",
    `Are you sure you want to rollback the activity?`,
    "All information in the draft related to this position will be rollback, including details about subordinates, RASCI notations, Competencies, and Position Descriptions",
    action,
    "",
    `${positionId},${prlOrg}`,
  );
}

function acceptApproval() {
  const draftName = $("#draftName").text();
  const action = [
    actionBack,
    {
      button: "Confirm Approve",
      className: "btn-primary",
      callback: function () {
        confirmSubmitApproval(1);
      },
    },
  ];
  modalConfrimHelper(
    "confirm",
    "Approve Request",
    `Are you sure want to approve this <b>${draftName}</b> draft?`,
    "",
    action,
  );
}

function rejectApproval() {
  const action = [
    actionBack,
    {
      button: "Confirm Reject",
      className: "btn-primary",
      callback: function () {
        confirmRejectApproval(1);
      },
    },
  ];
  modalConfrimHelper(
    "confirm",
    "Reject Request",
    "Reject Comment <br> <textarea class='form-control' id='rejectReason' rows='3'></textarea>",
    "",
    action,
  );
}

function checkButtonDraftDetail(data) {
  const urlParts = window.location.pathname.split("/");
  const lastPath = urlParts.pop() || urlParts.pop();
  // hideModal(`modalConfirm`);
  // console.log("getDataDraft.data", data);
  const submitApprovalButton = $("#submitApproval");
  const acceptApprovalButton = $("#acceptApproval");
  const rejectApprovalButton = $("#rejectApproval");
  const finalizeConfirm = $("#finalize");
  const deleteDraft = $("#deleteDraft");
  const exportPSSHCButton = $("#exportFilePSSHC");

  // submitApprovalButton.toggle(!data.isSubmitted && !data.isApproved && !data.isFinalized);
  // acceptApprovalButton.toggle(data.isSubmitted && !data.isApproved);
  // rejectApprovalButton.toggle(data.isSubmitted && !data.isApproved);
  // finalizeConfirm.toggle(data.isApproved || data.isFinalized);

  submitApprovalButton.show();
  acceptApprovalButton.hide();
  rejectApprovalButton.hide();
  finalizeConfirm.hide();
  console.log("data", data);
  // data.isApproved = true;
  exportPSSHCButton.hide();
  let step = 0;
  let userRole = "admin";
  if (data?.isSubmitted) {
    $("#deleteDraft").hide();
    step = 1;
    submitApprovalButton.hide();
    acceptApprovalButton.show();
    rejectApprovalButton.show();
  }

  if (data?.isRejected) {
    $("#exportTemplate, #importDataDraft, #downloadTemplate, #exportDataDraft, #deleteDraft").hide();
    step = 2;
    submitApprovalButton.show();
    acceptApprovalButton.hide();
    rejectApprovalButton.hide();
  }

  if (data?.isApproved) {
    // image in id editDraftName hide
    $("#exportTemplate, #importDataDraft, #downloadTemplate, #exportDataDraft, #deleteDraft").hide();
    $("#editDraftName").hide();
    step = 3;
    submitApprovalButton.hide();
    acceptApprovalButton.hide();
    rejectApprovalButton.hide();
    exportPSSHCButton.show();
    finalizeConfirm.show();
    deleteDraft.hide();
  }

  if (data?.isFinalized) {
    $("#exportTemplate, #importDataDraft, #downloadTemplate, #exportDataDraft, #deleteDraft").hide();
    $("#editDraftName").hide();
    step = 4;
    submitApprovalButton.hide();
    exportPSSHCButton.hide();
    finalizeConfirm.hide();
    deleteDraft.hide();
  }
  if (lastPath === "draft-detail") {
    acceptApprovalButton.hide();
    rejectApprovalButton.hide();
    $("#infoApproval").hide();
  } else {
    // $("#draftNameApproval").text(data?.draftName);
    $("#exportTemplate").hide();
    $("#detailTitle").text("Approval Detail");
    $("#draftDetailBreadcrumb").text("Approval Detail");
    $("#infoDraft").hide();
    // finalizeConfirm.hide();
  }

  if (lastPath === "approval-detail") {
    $("#editDraftName,#submitApproval,#downloadTemplate, #exportDataDraft, #importDataDraft").hide();
  }

  return { step, userRole };
}

$("#finalizeConfirm").on("click", async function () {
  // alert('masok')
  loader(true);
  const file = $("#file-input")[0].files[0];
  const sendFinalize = await draftFinalize(organizationAttribute.orgUnitId, file);
  if (sendFinalize.status == 200) {
    hideModal(`modalUploadFinalized`);
    loader(false);
    swal("Success", "Draft has been finalized", "success");
  } else {
    const message = sendFinalize?.message ?? "Failed to finalize draft";
    swal("Failed", message, "error");
    loader(false);
  }
});

$(document).ready(async function () {
  let draftId = urlParams.get("draftId");
  const getDataDraft = await draftDetailById(draftId);
  checkDataOrganizationLocalStorage();
  const getDataListDraft = await listDetailJobs({
    draftId: draftId,
    page: 1,
    pageSize: 10000,
  });
  // console.log(storeData.listDraft);
  // const getDraft = storeData.listDraft.find((x) => x.draftId == draftId);
  // await checkDataOrganization(storeData.listDraft);

  checkDataOrganization();
  await initializeDraftDetail(getDataDraft.data);

  const getStatusDraft = checkButtonDraftDetail(getDataDraft.data);
  console.log("getStatusDraft", getStatusDraft);
  // checkPage();
  getTableListDraftDetail(getDataListDraft.data, getStatusDraft);
  uploadFinalizeHandler();

  $(".tab-custom").on("click", function () {
    $(this).attr("id");
    $(".tab-custom").removeClass("active");
    $(this).addClass("active");

    const value = $(this).attr("id");
    if (value == "all") {
      getTableListDraftDetail(getDataListDraft.data.filter((x) => x.draftId == draftId));
    } else {
      console.log("getDataListDraft.data", getDataListDraft.data);
      console.log("value", value);
      getTableListDraftDetail(getDataListDraft.data.filter((x) => x.draftId == draftId && x.actionType == value));
    }
  });

  // // tab-custom class on change
  // $(".tab-custom").on("click", function () {
  //   $(this).attr("id");
  //   const value = $(this).attr("id");
  //   if (value == "all") {
  //     getTableListDraftDetail(lsListDetailDraft.filter((x) => x.draftId == draftId));
  //   } else {
  //     getTableListDraftDetail(lsListDetailDraft.filter((x) => x.draftId == draftId && x.type == value));
  //   }

  //   // $(".tab-custom").removeClass("active");
  //   // $(this).addClass("active");
  // });

  $("#exportTemplate").click(async function () {
    try {
      // Check if ExcelJS is available
      if (typeof ExcelJS === "undefined") {
        alert("ExcelJS library not loaded. Please refresh the page and try again.");
        return;
      }

      // Create new workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Organization Template");

      // Direktorat	Direktorat Teknis	Fungsi	Divisi	Sub Division	Departemen	Section	cek	ID Org Unit	KBO (Org Unit Abbr)	Org Unit Name	ID Position	PJ	Position	cek2	Stack	Coordination	Coordination to	Jabatan fungsi leher	Position Abbreviation	IS dummy position?	Dummy Description	Person Id	Pers.No.	Name	Person Grade	ID Job	Job Name	Garis Lapor	Layering	Job Gradeanisasi	8-9	10-11	12-13	14-15	16-18	19-21	22-24	Career Type	Career Level	Main Skill Group	Main Subskill Group	Second Skill Group	Second Subskill Group	Third Skill Group	Third Subskill Group	Company Code	Company Name	Perusahaan	Personnel Area	Personnel Area Name	Personnel Subarea	Personnel Subarea Name	Group	Personnel Admin	Payscale Area Posisi	Desc. Payscale Area Posisi	Payscale Type Posisi	Desc. Payscale Type Posisi	Cost Center Posisi	Cost Center Description	ID Position Atasan Langsung	Position Atasan Langsung	ID Position Chief	Position Chief	Resource	No SK	PJS Position	helper idou x prl	lookup ke zhroom fadil
      // Add headers
      const headers = [
        "Direktorat",
        "Direktorat Teknis",
        "Fungsi",
        "Divisi",
        "Sub Division",
        "Departemen",
        "Section",
        "cek",
        "ID Org Unit",
        "KBO (Org Unit Abbr)",
        "Org Unit Name",
        "ID Position",
        "PJ",
        "Position",
        "cek2",
        "Stack",
        "Coordination",
        "Coordination to",
        "Jabatan fungsi leher",
        "Position Abbreviation",
        "IS dummy position?",
        "Dummy Description",
        "Person Id",
        "Pers.No.",
        "Name",
        "Person Grade",
        "ID Job",
        "Job Name",
        "Garis Lapor",
        "Layering",
        "Job Gradeanisasi",
        "8-9",
        "10-11",
        "12-13",
        "14-15",
        "16-18",
        "19-21",
        "22-24",
        "Career Type",
        "Career Level",
        "Main Skill Group",
        "Main Subskill Group",
        "Second Skill Group",
        "Second Subskill Group",
        "Third Skill Group",
        "Third Subskill Group",
        "Company Code",
        "Company Name",
        "Perusahaan",
        "Personnel Area",
        "Personnel Area Name",
        "Personnel Subarea",
        "Personnel Subarea Name",
        "Group",
        "Personnel Admin",
        "Payscale Area Posisi",
        "Desc. Payscale Area Posisi",
        "Payscale Type Posisi",
        "Desc. Payscale Type Posisi",
        "Cost Center Posisi",
        "Cost Center Description",
        "ID Position Atasan Langsung",
        "Position Atasan Langsung",
        "ID Position Chief",
        "Position Chief",
        "Resource",
        "No SK",
        "PJS Position",
        "helper idou x prl",
      ];

      // Add header row
      const headerRow = worksheet.addRow(headers);

      // Style columns "Stack" to "Jabatan fungsi leher" with yellow background
      // Stack = kolom 16, Coordination = 17, Coordination to = 18, Jabatan fungsi leher = 19
      for (let colIndex = 16; colIndex <= 19; colIndex++) {
        const cell = headerRow.getCell(colIndex);
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFFFF00" }, // Yellow background
        };
        cell.font = {
          bold: true,
          color: { argb: "FF000000" }, // Black text
        };
        cell.alignment = {
          horizontal: "center",
          vertical: "middle",
        };
      }

      // Style columns "8-9" to "22-24" with yellow background
      // "8-9" = kolom 32, "10-11" = 33, "12-13" = 34, "14-15" = 35, "16-18" = 36, "19-21" = 37, "22-24" = 38
      for (let colIndex = 32; colIndex <= 38; colIndex++) {
        const cell = headerRow.getCell(colIndex);
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFFFF00" }, // Yellow background
        };
        cell.font = {
          bold: true,
          color: { argb: "FF000000" }, // Black text
        };
        cell.alignment = {
          horizontal: "center",
          vertical: "middle",
        };
      }

      // Style all header cells
      headerRow.eachCell((cell, colNumber) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
        cell.font = cell.font || {};
        cell.font.bold = true;
        cell.alignment = cell.alignment || {};
        cell.alignment.horizontal = "center";
        cell.alignment.vertical = "middle";
      });

      // Set column widths
      worksheet.columns = [
        { width: 20 }, // Position Name
        { width: 15 }, // Abbreviation
        { width: 20 }, // Org Unit
        { width: 12 }, // Job Grade
        { width: 12 }, // Formation
        { width: 15 }, // Career Type
        { width: 15 }, // Career Level
        { width: 20 }, // Direct Report
        { width: 15 }, // Neck Function
        { width: 12 }, // Is Project
        { width: 15 }, // Coordination
        { width: 20 }, // Coordination With
      ];

      // Add empty rows for data entry
      for (let i = 0; i < 3; i++) {
        worksheet.addRow(["", "", "", "", "", "", "", "", "", "", "", ""]);
      }

      // Generate Excel file buffer
      const buffer = await workbook.xlsx.writeBuffer();

      // Create blob and download
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "organization-template.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error creating Excel file:", error);
      alert("Error creating Excel file: " + error.message);
    }
  });

  $("#exportDataDraft").click(async function () {
    try {
      const draftId = urlParams.get("draftId");
      const exportData = await exportZhroomToExcel({ draftId });
      const draftName = $("#draftName").text().replace(/\s+/g, "-").toLowerCase();

      if (exportData) {
        console.log("exportData", exportData);
        // Untuk responseType blob, data sudah berupa Blob object
        const blob =
          exportData instanceof Blob
            ? exportData
            : new Blob([exportData], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `export-draft-${draftName}.xlsx`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        swal("Failed", "Failed to export data", "error");
      }
    } catch (error) {
      console.error("Export error:", error);
      swal("Failed", "Failed to export data: " + error.message, "error");
    }
  });

  $("#exportFilePSSHC").on("click", async function () {
    try {
      const draftId = urlParams.get("draftId");
      const exportData = await exportSshcToExcel({ draftId });
      const draftName = $("#draftName").text().replace(/\s+/g, "-").toLowerCase();
      if (exportData) {
        const blob =
          exportData instanceof Blob
            ? exportData
            : new Blob([exportData], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `export-psshc-draft-${draftName}.xlsx`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        swal("Failed", "Failed to export PSSHC data", "error");
      }
    } catch (error) {
      console.error("Export PSSHC error:", error);
      swal("Failed", "Failed to export PSSHC data: " + error.message, "error");
    }
  });

  $("#importDataDraft").on("click", async function () {
    const uploadFile = await confirmFunction("Upload", "Are you sure want to upload file?");
    if (uploadFile) {
      $("#fileImportDraft").click();
    }
  });

  $("#fileImportDraft").on("change", function () {
    const action = [
      {
        button: "Cancel",
        className: "btn-primary",
        callback: function () {
          hideModal(`modalConfirm`);
        },
      },
      {
        button: "Yes, Submit",
        className: "btn-primary",
        callbackFunction: "clickUploadFunction",
      },
    ];
    modalConfrimHelper(
      "confirm",
      "Import Data",
      "Are you sure want to import data from this file?",
      "All data in this draft will be replaced with the data in the file",
      action,
      "",
      1,
    );

    // const file = $("#fileImportDraft")[0].files[0];
    // const reader = new FileReader();
    // reader.onload = function (e) {
    //   const data = e.target.result;
    //   console.log(data);
    // };
    // reader.readAsText(file);
  });

  $("#editDraftName").on("click", function () {
    $("#inputDraftName").val($("#draftName").text());
    $("#modalLabelOSDraft").text("Edit Draft Name");
    $("#createDraftSO").text("Update Draft Name");
    $("#modalCreateDraftSO").modal("show").attr("style", "z-index: 1070");
  });

  $("#createDraftSO").on("click", async function () {
    const draftName = $("#inputDraftName").val();
    if (!draftName) {
      swal("Failed", "Draft name is required", "error");
      return;
    }
    const draftId = urlParams.get("draftId");
    $("#draftName").text(draftName);
    $("#modalCreateDraftSO").modal("hide");
    const updateDraft = await renameDraftSO({ id: draftId, name: draftName });
    swal("Success", "Draft name has been updated", "success");
    lsListDraft.map((x) => {
      if (x.draftId == draftId) {
        x.draftName = draftName;
      }
      return x;
    });
    localStorage.setItem("listDraft", JSON.stringify(lsListDraft));
    changeOrganization();
    $("#modalLabelOSDraft").text("Create Draft SO");
    $("#inputDraftName").val("");
    $("#createDraftSO").text("Create Draft");
  });
});
