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
  $("#statusApproval").html(
    `<span class="p-2 b-r-8 w-100 text-center ${statusApprovalClass[1]}">${statusApproval[1]}</span>`
  );
  // delete draft and submit approval must be hide, becouse it used only for draft detail page
  $("#deleteDraft, #submitApproval").hide();
  $("#acceptApproval, #rejectApproval").show();

  const shouldShowApprovalButtons = user === "admin" && (status === 1 || status === 4);
  $("#acceptApproval, #rejectApproval").toggle(shouldShowApprovalButtons);
  if (lastPath === "draft-detail") {
    $("#statusApproval, #acceptApproval, #rejectApproval").hide();
    $("#deleteDraft, #submitApproval").show();
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

async function initializeDraftDetail(getDraft) {
  $("#draftName").text(getDraft?.draftName);
  $("#createdBy").text(getDraft?.createdBy);
  $("#createdDate").text(getDraft?.createdDate);
  $("#updatedBy").text(getDraft?.modifiedBy);
  $("#updatedDate").text(getDraft?.modifiedDate);
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
  window.location.href = "/organization/index";
}

async function confirmDeleteDraft(id) {
  lsListDraft = lsListDraft.filter((x) => x.draftId != id);
  lsListDetailDraft = lsListDetailDraft.filter((x) => x.draftId != id);
  lsListPosition = lsListPosition.filter((x) => x.draftId != id);
  lsListOrgNode = lsListOrgNode.filter((x) => x.draftId != id);
  localStorage.setItem("listDraft", JSON.stringify(lsListDraft));
  localStorage.setItem("listDetailDraft", JSON.stringify(lsListDetailDraft));
  localStorage.setItem("listPosition", JSON.stringify(lsListPosition));
  localStorage.setItem("listOrgNode", JSON.stringify(lsListOrgNode));
  changeOrganization(0, "Master Data SO");
  swal("Success", "Draft has been deleted", "success");
  window.location.href = "/organization/index";
}

function deleteDraft() {
  const getDraftById = lsListDraft.find((x) => x.draftId == organizationAttribute.orgUnitId);
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
    `Are you sure want to delete <b>${getDraftById.draftName}</b> draft?`,
    "All Position title in this draft will be deleted, including related RASCI notations, Competencies, and Position Descriptions",
    action,
    "",
    getDraftById.draftId
  );
}

function confirmDelete(id) {
  // alert("confirmDelete" + id);
  hideModal(`modalConfirm`);
  swal("Deleted", "Activity data has been deleted", "success");
}

async function confirmSubmit(id) {
  const draftId = urlParams.get("draftId");
  await draftSubmitToApproval(draftId);
  const getDataDraft = await draftDetailById(draftId);
  $("#modalConfirm").modal("hide");
  swal("Success", "Draft has been submitted to approval", "success");
  checkButtonDraftDetail(getDataDraft.data);
}

async function confirmSubmitApproval(id) {
  const draftId = urlParams.get("draftId");
  await draftApprove(draftId);
  const getDataDraft = await draftDetailById(draftId);
  checkButtonDraftDetail(getDataDraft.data);
  $("#modalConfirm").modal("hide");
  swal("Approved", "draft has been approved.", "success");
}
async function confirmRejectApproval(id) {
  const draftId = urlParams.get("draftId");
  await draftReject(draftId, rejectReason);
  const getDataDraft = await draftDetailById(draftId);
  checkButtonDraftDetail(getDataDraft.data);
  $("#modalConfirm").modal("hide");
  swal("Rejected", "draft has been rejected.", "success");
}

function previewDesignCost() {
  $("#modalPreviewDesignCost").modal("show");
}

function previewOrgChart() {
  getDataList([
    {
      dataId: "searchOrgNode",
      data: lsListOrgNode.map((item) => ({ id: item.id_position, text: item.position })),
      dropdownParent: $("#modalPreviewOrgChart"),
    },
  ]);
  helperOrgChart(true, "os-container", lsListOrgNode, true);

  $("#modalPreviewOrgChart").modal("show");
}

$("#searchOrgNodeButton").on("click", function () {
  const searchValue = $("#searchOrgNode").val();
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
    draftId
  );
}

function finalizeApproval() {
  $("#modalUploadFinalized").modal("show");
}

async function clickUploadFunction() {
  const file = $("#fileImportDraft")[0].files[0];
  const sendFile = await uploadDataDraftSO(organizationAttribute.orgUnitId, file);
  swal("Success", "Data has been imported", "success");
  hideModal(`modalConfirm`);
}

function editPositionDraft(id) {
  window.location.href = "/organization/form-position?positionId=" + id;
}

function detailPositionDraft(id) {
  const findPosition = lsListDetailDraft.find((x) => x.positionId == id);
  console.log("findPosition", findPosition);
  $("#positionName").text(
    findPosition.positionName == "" || findPosition.positionName == null ? "-" : findPosition.positionName
  );
  $("#abbrvPosition").text(
    findPosition.abbrvPosition == "" || findPosition.abbrvPosition == null ? "-" : findPosition.abbrvPosition
  );
  $("#orgUnitName").text(
    findPosition.orgUnitName == "" || findPosition.orgUnitName == null ? "-" : findPosition.orgUnitName
  );
  $("#orgPrl").text(findPosition.prlOrg == "" || findPosition.prlOrg == null ? "-" : findPosition.prlOrg);
  $("#formation").text(findPosition.formation == "" || findPosition.formation == null ? "-" : findPosition.formation);
  $("#careerType").text(
    findPosition.careerType == "" || findPosition.careerType == null ? "-" : findPosition.careerType
  );
  $("#careerLevel").text(
    findPosition.careerLevel == "" || findPosition.careerLevel == null ? "-" : findPosition.careerLevel
  );
  $("#basket").text(findPosition.isBasket == "Yes" ? "Yes" : "No");
  $("#directReport").text(
    findPosition.directReport == "" || findPosition.directReport == null ? "-" : findPosition.directReport
  );
  $("#neckFunction").text(findPosition.neckFunction ? "Yes" : "No");
  $("#isProject").text(findPosition.isProject ? "Yes" : "No");
  $("#coordination").text(findPosition.isCoordination ? "Yes" : "No");
  $("#coordinationWith").text(
    findPosition.coordinationWith == "" || findPosition.coordinationWith == null ? "-" : findPosition.coordinationWith
  );
  $("#directorate").text(findPosition.function == "" || findPosition.function == null ? "-" : findPosition.function);
  $("#division").text(findPosition.division == "" || findPosition.division == null ? "-" : findPosition.division);
  $("#subDivision").text(
    findPosition.subDivision == "" || findPosition.subDivision == null ? "-" : findPosition.subDivision
  );
  $("#department").text(
    findPosition.department == "" || findPosition.department == null ? "-" : findPosition.department
  );
  $("#section").text(findPosition.section == "" || findPosition.section == null ? "-" : findPosition.section);
  $("#personnelAreaName").text(
    findPosition.personalAreaName == "" || findPosition.personalAreaName == null ? "-" : findPosition.personalAreaName
  );

  $("#modalMainSkillGroup").text(findPosition.mainSkillGroup);
  $("#modalMainSubSkillGroup").text(findPosition.mainSubSkillGroup);
  $("#modalSecondSkillGroup").text(findPosition.secondSkillGroup);
  $("#modalSecondSubSkillGroup").text(findPosition.secondSubSkillGroup);
  $("#modalThirdSkillGroup").text(findPosition.thirdSkillGroup);
  $("#modalThirdSubSkillGroup").text(findPosition.thirdSubSkillGroup);

  $("#modalDetailJobDraft").modal("show");
}

function deletePositionDraft(positionId) {
  const getPosition = lsListDetailDraft.find((x) => x.positionId == positionId);
  const action = [
    {
      button: "Back",
      className: "btn-primary",
      callback: function () {
        hideModal(`modalConfirm`);
      },
    },
    {
      button: "Delete",
      className: "btn-outline-dark",
      callback: function () {
        confirmDelete(1);
      },
    },
  ];
  modalConfrimHelper(
    "delete",
    "Delete Data",
    `Are you sure you want to delete the activity data for ${getPosition.positionName}?`,
    "All information in the draft related to this position will be deleted, including details about subordinates, RASCI notations, Competencies, and Position Descriptions",
    action
  );
}

$(".tab-custom").on("click", function () {
  $(this).attr("id");
  $(".tab-custom").removeClass("active");
  $(this).addClass("active");
});

function acceptApproval() {
  const action = [
    actionBack,
    {
      button: "Yes, Approve",
      className: "btn-primary",
      callback: function () {
        confirmSubmitApproval(1);
      },
    },
  ];
  modalConfrimHelper(
    "confirm",
    "Approve Request",
    "Are you sure want to approve this Evaluasi Struktur Organisasi 2025 draft?",
    "",
    action
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
    action
  );
}

function checkButtonDraftDetail(data) {
  // hideModal(`modalConfirm`);
  console.log("getDataDraft.data", data);
  const submitApprovalButton = $("#submitApproval");
  const acceptApprovalButton = $("#acceptApproval");
  const rejectApprovalButton = $("#rejectApproval");
  const finalizeButton = $("#finalize");

  // submitApprovalButton.toggle(!data.isSubmitted && !data.isApproved && !data.isFinalized);
  // acceptApprovalButton.toggle(data.isSubmitted && !data.isApproved);
  // rejectApprovalButton.toggle(data.isSubmitted && !data.isApproved);
  // finalizeButton.toggle(data.isApproved || data.isFinalized);

  submitApprovalButton.show();
  acceptApprovalButton.hide();
  rejectApprovalButton.hide();
  finalizeButton.hide();
  if (data.isSubmitted) {
    submitApprovalButton.hide();
    acceptApprovalButton.show();
    rejectApprovalButton.show();
  }

  if (data.isRejected) {
    submitApprovalButton.show();
    acceptApprovalButton.hide();
    rejectApprovalButton.hide();
  }

  if (data.isApproved) {
    submitApprovalButton.hide();
    acceptApprovalButton.hide();
    rejectApprovalButton.hide();
    finalizeButton.show();
  }

  if (data.isFinalized) {
    submitApprovalButton.hide();
    finalizeButton.show();
  }
}

$(document).ready(async function () {
  let draftId = urlParams.get("draftId");
  const getDataDraft = await draftDetailById(draftId);
  checkDataOrganizationLocalStorage();
  // console.log(storeData.listDraft);
  // const getDraft = storeData.listDraft.find((x) => x.draftId == draftId);
  // await checkDataOrganization(storeData.listDraft);

  checkDataOrganization();
  await initializeDraftDetail(getDataDraft.data);

  checkButtonDraftDetail(getDataDraft.data);
  // checkPage();
  // getTableListDraftDetail(lsListDetailDraft.filter((x) => x.draftId == draftId));
  // // uploadFinalizeHandler();

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

  $("#importDataDraft").on("click", function () {
    $("#fileImportDraft").click();
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
      1
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
    $("#modalCreateDraftSO").modal("show").attr("style", "z-index: 1070");
  });

  $("#continueButton").on("click", async function () {
    const draftName = $("#inputDraftName").val();
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
  });
});
