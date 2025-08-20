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
  } else {
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
  console.log("confirmDeleteDraft", id);
  let rollback = await rollbackDraftSO(id);
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
    urlParams.get("draftId")
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
  const dataChart = await chartShow({
    draftId: organizationAttribute.orgUnitId,
    jobCode: "10132405",
    depth: 3,
  });

  if (!dataChart.data) {
    swal("Warning", "Data not found", "warning");
    return;
  }
  dataChart.data.forEach((item) => {
    item.id = item.id_org_unit;
  });
  helperOrgChart(true, "os-container", dataChart.data, true);

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
  window.location.href = "/organization/form-position?unitCode=" + id;
}

async function detailPositionDraft(id) {
  let findPosition = await chartJobDetail({
    draftId: organizationAttribute.orgUnitId,
    jobCode: id,
  });
  findPosition = findPosition?.data;
  if (findPosition == undefined) {
    alert("Data not found");
    return;
    // data = lsListPosition.find((item) => item.positionId == dataDefault);
  }
  // const findPosition = lsListDetailDraft.find((x) => x.positionId == id);
  console.log("findPosition", findPosition);
  $("#jobName").text(
    findPosition.positionName == "" || findPosition.positionName == null ? "-" : findPosition.positionName
  );
  $("#positionName").text(
    findPosition.positionName == "" || findPosition.positionName == null ? "-" : findPosition.positionName
  );
  $("#abbrvPosition").text(
    findPosition.abbreviationName == "" || findPosition.abbreviationName == null ? "-" : findPosition.abbreviationName
  );
  $("#orgUnitName").text(findPosition.unitName == "" || findPosition.unitName == null ? "-" : findPosition.unitName);
  $("#orgPrl").text(findPosition.prlOrg == "" || findPosition.prlOrg == null ? "-" : findPosition.prlOrg);
  $("#formation").text(findPosition.formation == "" || findPosition.formation == null ? "-" : findPosition.formation);
  $("#careerType").text(
    findPosition.careerTypeName == "" || findPosition.careerTypeName == null ? "-" : findPosition.careerTypeName
  );
  $("#careerLevel").text(
    findPosition.careerLevelName == "" || findPosition.careerLevelName == null ? "-" : findPosition.careerLevelName
  );
  $("#basket").text(findPosition.basket.length > 0 ? "Yes" : "No");
  $("#directReport").text(
    findPosition.directorateName == "" || findPosition.directorateName == null ? "-" : findPosition.directorateName
  );
  $("#neckFunction").text(findPosition.isNeck ? "Yes" : "No");
  $("#isProject").text(findPosition.isProject ? "Yes" : "No");
  $("#coordination").text(findPosition.coordinationWith !== "" ? "Yes" : "No");
  $("#coordinationWith").text(
    findPosition.coordinationWith == "" || findPosition.coordinationWith == null ? "-" : findPosition.coordinationWith
  );
  $("#directorate").text(
    findPosition.directorateName == "" || findPosition.directorateName == null ? "-" : findPosition.directorateName
  );
  $("#division").text(
    findPosition.divisionName == "" || findPosition.divisionName == null ? "-" : findPosition.divisionName
  );
  $("#subDivision").text(
    findPosition.subDivisionName == "" || findPosition.subDivisionName == null ? "-" : findPosition.subDivisionName
  );
  $("#department").text(
    findPosition.departmentName == "" || findPosition.departmentName == null ? "-" : findPosition.departmentName
  );
  $("#section").text(findPosition.section == "" || findPosition.section == null ? "-" : findPosition.section);
  $("#personnelAreaName").text(
    findPosition.sectionName == "" || findPosition.sectionName == null ? "-" : findPosition.sectionName
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

async function confirmRollback(unitCode) {
  // alert("confirmRollback" + unitCode);
  const rollback = await deleteJobAndSubordinates({
    draftId: organizationAttribute.orgUnitId,
    unitCode: unitCode,
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

function deletePositionDraft(positionId) {
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
    positionId
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
  // console.log("getDataDraft.data", data);
  const submitApprovalButton = $("#submitApproval");
  const acceptApprovalButton = $("#acceptApproval");
  const rejectApprovalButton = $("#rejectApproval");
  const finalizeConfirm = $("#finalize");
  const deleteDraft = $("#deleteDraft");

  // submitApprovalButton.toggle(!data.isSubmitted && !data.isApproved && !data.isFinalized);
  // acceptApprovalButton.toggle(data.isSubmitted && !data.isApproved);
  // rejectApprovalButton.toggle(data.isSubmitted && !data.isApproved);
  // finalizeConfirm.toggle(data.isApproved || data.isFinalized);

  submitApprovalButton.show();
  acceptApprovalButton.hide();
  rejectApprovalButton.hide();
  finalizeConfirm.hide();
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
    finalizeConfirm.show();
    deleteDraft.hide();
  }

  if (data.isFinalized) {
    submitApprovalButton.hide();
    finalizeConfirm.hide();
    deleteDraft.hide();
  }
  if (lastPath === "draft-detail") {
    acceptApprovalButton.hide();
    rejectApprovalButton.hide();
  } else {
    finalizeConfirm.hide();
  }
}

$("#finalizeConfirm").on("click", async function () {
  // alert('masok')
  const file = $("#file-input")[0].files[0];
  const sendFinalize = await draftFinalize(organizationAttribute.orgUnitId, file);
  if (sendFinalize) {
    hideModal(`modalUploadFinalized`);
    swal("Success", "Draft has been finalized", "success");
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

  checkButtonDraftDetail(getDataDraft.data);
  // checkPage();
  getTableListDraftDetail(getDataListDraft.data);
  uploadFinalizeHandler();

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
    $("#createDraftSO").text("Update Draft Name");
    $("#modalCreateDraftSO").modal("show").attr("style", "z-index: 1070");
  });

  $("#createDraftSO").on("click", async function () {
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
    $("#modalLabelOSDraft").text("Create Draft SO");
    $("#inputDraftName").val("");
    $("#createDraftSO").text("Create Draft");
  });
});
