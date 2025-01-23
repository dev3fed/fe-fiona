function starter() {
  $("#selectPrlOrgTo").attr("disabled", true);
  $("#selectCoordinationWith").attr("disabled", true);
  $("#subPositionDiv").hide();
}

function initializeList() {
  const uniqueValues = (key) => [...new Set(lsListPosition.map((item) => item[key]))];
  const mapToSelectData = (key) => uniqueValues(key).map((item) => ({ id: item, text: item }));
  // if isbasked = yes, then using orgUnitName as positionName
  const mapToSelectDataPosition = lsListPosition.map((item) => ({
    id: item.positionId,
    text: item.isBasket == "Yes" ? item.orgUnitName : item.positionName,
  }));

  console.log(lsListPosition);
  // for selectOrgUnitParentName and selectPrlOr, distinct lsListPosition data by orgUnitId, and text by orgUnitName + " - " + orgUnitId
  const mapToSelectDataOrgUnitParent = uniqueValues("orgUnitParentId").map((item) => ({
    id: item,
    text: lsListPosition.find((x) => x.orgUnitParentId == item).orgUnitParent + " - " + item,
  }));
  return [
    {
      dataId: "selectJobReference",
      data: mapToSelectDataPosition,
    },
    { dataId: "selectOrgUnitParentName", data: mapToSelectDataOrgUnitParent },
    { dataId: "selectPrlOrg", data: prl },
    { dataId: "selectPrlOrgTo", data: prl },
    {
      dataId: "selectDirectReport",
      data: mapToSelectDataPosition,
    },
    { dataId: "selectFunction", data: mapToSelectData("function") },
    { dataId: "selectDivision", data: mapToSelectData("division") },
    { dataId: "selectSubDivision", data: mapToSelectData("subDivision") },
    { dataId: "selectDepartment", data: mapToSelectData("department") },
    { dataId: "selectSection", data: mapToSelectData("section") },
    { dataId: "selectCareerType", data: mapToSelectData("careerType") },
    { dataId: "selectCareerLevel", data: mapToSelectData("careerLevel") },
    { dataId: "selectAbbrvPosition", data: mapToSelectData("abbrvPositon") },
    { dataId: "selectKBO", data: mapToSelectData("kbo") },
    { dataId: "selectCostCenter", data: mapToSelectData("costCenterDesc") },
    { dataId: "selectPersonalAreaName", data: mapToSelectData("personalAreaName") },
    { dataId: "selectPersonalSubareaName", data: mapToSelectData("personalSubAreaName") },
    { dataId: "selectCoordinationWith", data: mapToSelectData("coordinationWith") },
    { dataId: "selectSkillGroupMain", data: mapToSelectData("mainSkillGroup") },
    { dataId: "selectSubSkillGroupMain", data: mapToSelectData("mainSubSkillGroup") },
    { dataId: "selectSkillGroupSecond", data: mapToSelectData("secondSkillGroup") },
    { dataId: "selectSubSkillGroupSecond", data: mapToSelectData("secondSubSkillGroup") },
    { dataId: "selectSkillGroupThird", data: mapToSelectData("thirdSkillGroup") },
    { dataId: "selectSubSkillGroupThird", data: mapToSelectData("thirdSubSkillGroup") },
  ];
}

function saveAsDraft() {
  const positionId = urlParams.get("positionId");
  let type = "create";
  let data = {};
  if (positionId) {
    type = "edit";
    data = lsListPosition.find((item) => item.positionId == positionId);
  }
  saveInputAttribut(type, data);
  swal("Saved", "Save as Draft", "success");
  window.location.href = "/organization/index?focusNode=" + positionId;
}

function addSubPos() {
  const subPosDiv = $("#subPosDiv").children();
  const countSubPosDiv = subPosDiv.length;
  const newSubPosDiv = subPosDiv.first().clone();
  newSubPosDiv.attr("id", "rowPosDiv" + countSubPosDiv);
  newSubPosDiv.find("#modalSelectCareerLevel").attr("id", "modalSelectCareerLevel" + countSubPosDiv);
  newSubPosDiv.find("#modalSelectAbbrvPosition").attr("id", "modalSelectAbbrvPosition" + countSubPosDiv);
  newSubPosDiv.find("#modalInputSubPositionName").attr("id", "modalInputSubPositionName" + countSubPosDiv);
  newSubPosDiv.find("#modalSelectPrlOrgSubPos").attr("id", "modalSelectPrlOrgSubPos" + countSubPosDiv);
  newSubPosDiv.find("#modalInputFormation").attr("id", "modalInputFormation" + countSubPosDiv);
  newSubPosDiv.find(".add-sub-pos").removeClass("add-sub-pos").addClass("delete-sub-pos");
  newSubPosDiv.find("#addSubPos").attr("id", "deleteSubPos" + countSubPosDiv);
  newSubPosDiv.find(`#deleteSubPos${countSubPosDiv}`).attr("onclick", "deleteSubPos(" + countSubPosDiv + ")");
  newSubPosDiv.find("#imageIcon").attr("id", "imageIcon" + countSubPosDiv);
  newSubPosDiv.find("#imageIcon" + countSubPosDiv).attr("src", "/assets/images/rasci/trash-white.svg");
  // imageIcon
  newSubPosDiv.appendTo("#subPosDiv");
}

function deleteSubPos(countSubPosDiv) {
  $("#rowPosDiv" + countSubPosDiv).remove();
}

function checkBasketSelected(selectBasket) {
  // $("#prlOrgDiv, #prlOrgToDiv").toggleClass("col-md-6 col-md-4");
  $("#subPositionDiv").hide();
  $("#careerLevelDiv, #abbrvPositionDiv, #formationDiv").show();
  $("#selectPrlOrgTo").prop("disabled", true);
  if (selectBasket == "Yes") {
    // $("#prlOrgDiv, #prlOrgToDiv").removeClass("col-md-4").addClass("col-md-6");
    $("#subPositionDiv").show();
    $("#careerLevelDiv, #abbrvPositionDiv, #formationDiv").hide();
    $("#selectPrlOrgTo").prop("disabled", false);
  }
}

$(document).ready(function () {
  // check query url
  checkDataOrganization();
  const positionId = urlParams.get("positionId");

  const updateDataDraft = initializeList();
  getDataList(updateDataDraft);
  starter();
  if (positionId) {
    $("#headerForm").text("Edit Position");
    $("#breadcrumbForm").text("Edit Position");
    insertFormPostion(positionId);
    const data = lsListPosition.find((item) => item.positionId == positionId);
    checkBasketSelected(data);
  }
  // changes inside detail
  $("#selectCareerType").on("change", function (event) {
    const selectCareerType = event.target.value;
    $("#selectBasket").prop("disabled", false);
    if (selectCareerType == "Managerial") {
      $("#selectBasket").prop("disabled", true);
      $("#selectBasket").val("No");
    }
    updateCareerLevel(selectCareerType);
  });

  $("#selectCareerLevel").on("change", function (event) {
    const selectCareerType = $("#selectCareerType").val();
    const selectCareerLevel = event.target.value;
    openAll();
    updateAbbrvPosition(selectCareerType, selectCareerLevel);
    updatePrlOrg(selectCareerType, selectCareerLevel);
  });

  $("#modalSelectCareerLevel").on("change", function (event) {
    const selectCareerType = $("#modalInputCareerType").val();
    const selectCareerLevel = event.target.value;

    // modalSelectAbbrvPosition disable false
    $("#modalSelectAbbrvPosition").attr("disabled", false);
    $("#modalInputSubPositionName").attr("disabled", false);
    $("#modalSelectPrlOrgSubPos").attr("disabled", false);
    $("#modalInputFormation").attr("disabled", false);

    updateAbbrvPositionModal(selectCareerType, selectCareerLevel);
    // const selectCareerLevel = event.target.value;
    // openAll();
    // updatePrlOrg(selectCareerType, selectCareerLevel);
  });

  $("#selectCoordination").on("change", function (event) {
    const value = event.target.value;
    $("#selectCoordinationWith").attr("disabled", true);
    if (value == "Yes") {
      $("#selectCoordinationWith").attr("disabled", false);
    }
  });

  $("#selectBasket").on("change", function (event) {
    const selectBasket = event.target.value;
    checkBasketSelected(selectBasket);
  });

  // click new subordinate
  $("#newSubordinate").click(function () {
    window.location.href = "/organization/new-subordinate";
    localStorage.removeItem("uniquePosCode");
    localStorage.setItem("uniquePosCode", uuidv4());
  });

  $("#duplicateJob").click(function () {
    window.location.href = "/organization/detailzz?duplicate=true";
  });

  $("#duplicateButton").click(async function () {
    const duplicate = $("#selectJobReference").val();
    insertFormPostion(duplicate);
    // duplicateJob(duplicate);
  });

  $("#addSubPosition").click(function () {
    $("#modalAddSubPosition").modal("show");
  });

  $("#modalInputFormation").on("change", function (event) {
    const countFormation = event.target.value;
    const subPosDiv = $("#subPosDiv").children();
    console.log(countFormation);
  });

  $("#saveSubPos").click(function () {
    swal("Saved", "Save Sub Position", "success");
  });

  $("#saveAsDraft").click(function () {
    const getDraftById = lsListDraft.find((item) => item.draftId == organizationAttribute.orgUnitId);
    const positionName = $("#inputPositionName").val();
    const action = [
      {
        button: "Cancel",
        className: "btn-primary",
        callback: function () {
          hideModal(`modalConfirm`);
        },
      },
      {
        button: "Save",
        className: "btn-outline-dark",
        callbackFunction: "saveAsDraft",
      },
    ];
    modalConfrimHelper(
      "confirm",
      "Save Position",
      `Are you sure you want to save the position <b>${positionName}</b> to the draft <b>${getDraftById.draftName}</b>?`,
      "",
      action,
      "",
      ""
    );
  });

  $("#back").click(function () {
    window.location.href = "/organization/index";
  });
});
