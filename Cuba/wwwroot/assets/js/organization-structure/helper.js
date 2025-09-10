function loader(status) {
  if (status == true) {
    $("#loading-overlay").addClass("show").show();
  } else {
    $("#loading-overlay").removeClass("show").hide();
  }
}

// Helper function to extract PRL number from both range and single formats
function getPrlNumber(prlOrg) {
  if (prlOrg.includes("-")) {
    // Range format: extract first number (e.g., "14-15" -> 14)
    return parseInt(prlOrg.split("-")[0]);
  } else {
    // Single number format: parse directly (e.g., "12" -> 12)
    return parseInt(prlOrg);
  }
}

async function checkDataOrganization(draftList) {
  localStorage.getItem("organizationAttribute") ? checkDataOrganizationLocalStorage() : setOrganizationAttribute();
  localStorage.setItem("organizationAttribute", JSON.stringify(organizationAttribute));
  const data = JSON.parse(localStorage.getItem("organizationAttribute"));
  Object.keys(organizationAttribute).forEach((key) => {
    if (data[key]) {
      organizationAttribute[key] = data[key];
    }
  });

  // If organizationAttribute is empty or null, select the first available draft
  if (!organizationAttribute.orgUnitId || !organizationAttribute.orgUnitName) {
    if (draftList && draftList.length > 0) {
      console.log("draftList", draftList);
      const firstDraft = draftList.find((item) => item.draftId == "1");
      console.log("firstDraft", firstDraft);
      organizationAttribute.orgUnitId = firstDraft.draftId;
      organizationAttribute.orgUnitName = firstDraft.draftName;
      organizationAttribute.isMasterData = true;
      console.log(organizationAttribute);
      localStorage.setItem("organizationAttribute", JSON.stringify(organizationAttribute));
    }
  }
  // append value to input
  // $("#selectDraftOrganization").val(organizationAttribute.orgUnitId).trigger("change");

  // disabled selectDraftOrganization
  // $("#selectDraftOrganization").prop("disabled", true);
}

function checkDataOrganizationLocalStorage() {
  const data = JSON.parse(localStorage.getItem("organizationAttribute"));
  if (data) {
    Object.keys(organizationAttribute).forEach((key) => {
      console.log(data[key]);
      if (data[key]) {
        organizationAttribute[key] = data[key];
      }
    });
    organizationAttribute.isMasterData = organizationAttribute.draftId == "1" ? true : false;
  }
}

function setOrganizationAttribute() {
  organizationAttribute.orgUnitId = null;
  organizationAttribute.orgUnitName = "";
  organizationAttribute.isMasterData = false;
}

function clearAllInput() {
  localStorage.setItem("subJobPos", JSON.stringify([]));
  $("[id^=select]").val(null).trigger("change");
  $("[id^=input]").val(null);
  $("[id^=modalSelect]").val(null).trigger("change");
  $("[id^=modalInput]").val(null);
  $("#selectBasket").val("No").trigger("change");
  $("#selectNeckFunction").val("No").trigger("change");
  $("#selectIsProject").val("No").trigger("change");
  $("#selectCoordination").val("No").trigger("change");
}

async function insertFormPostion(paramId) {
  const getDetailPosition = await chartJobDetail({
    draftId: organizationAttribute.orgUnitId,
    jobCode: paramId,
  });
  const form = document.querySelectorAll(".form-control[required], .form-select[required]");
  // remove class is-invalid from all form elements
  form.forEach((element) => {
    element.classList.remove("is-invalid");

    // For Select2 dropdowns, also remove is-invalid from the Select2 container
    const select2Container = element.parentElement.querySelector(".select2-container");
    if (select2Container) {
      select2Container.classList.remove("is-invalid");
    }
  });
  const data = getDetailPosition.data;
  // clear all input
  clearAllInput();
  const positionName = data?.isBasket ? data?.unitName : data?.positionName;
  $("#inputPositionName").val(positionName);
  $("#selectPrlOrg").val(data?.prlOrgFrom).trigger("change");
  $("#selectPrlOrgTo").val(data?.prlOrgTo).trigger("change");
  $("#selectFunction").val(data?.functionCode).trigger("change");
  $("#inputOrgUnitName").val(data?.unitName);
  $("#inputFormation").val(data?.formation);
  if (data?.directReportCode) {
    $("#selectDirectReport").append(
      new Option(`${data?.directReportName} (${data?.directReportCode})`, data?.directReportCode, true, true)
    );
  }
  if (data?.parentCode) {
    $("#selectOrgUnitParentName").append(
      new Option(`${data?.parentName} (${data?.parentCode})`, data?.parentCode, true, true)
    );
  }
  if (data?.divisionCode) {
    $("#selectDivision").append(new Option(data?.divisionName, data?.divisionCode, true, true));
  }
  if (data?.subDivisionCode) {
    $("#selectSubDivision").append(new Option(data?.subDivisionName, data?.subDivisionCode, true, true));
  }
  if (data?.departmentCode) {
    $("#selectDepartment").append(new Option(data?.departmentName, data?.departmentCode, true, true));
  }
  if (data?.sectionCode) {
    $("#selectSection").append(new Option(data?.sectionName, data?.sectionCode, true, true));
  }
  if (data?.kbo) {
    $("#selectKBO").append(new Option(data?.kbo, data?.kbo, true, true));
  }
  if (data?.costCenterDescription) {
    $("#selectCostCenter").append(new Option(data?.costCenterDescription, data?.costCenterDescription, true, true));
  }
  if (data?.personnelAreaCode) {
    $("#selectPersonalAreaName").append(new Option(data?.personnelAreaName, data?.personnelAreaCode, true, true));
  }
  if (data?.personnelSubAreaCode) {
    $("#selectPersonalSubareaName").append(
      new Option(data?.personnelSubAreaName, data?.personnelSubAreaCode, true, true)
    );
  }
  if (data?.careerLevelName) {
    $("#selectCareerLevel").append(new Option(data?.careerLevelName, 1, true, true));
  }
  if (data?.careerTypeName) {
    $("#selectCareerType").append(new Option(data?.careerTypeName, 1, true, true));
  }

  const arraySkillGroup = ["selectSkillGroupMain", "selectSkillGroupSecond", "selectSkillGroupThird"];
  const arraySubSkillGroup = ["selectSubSkillGroupMain", "selectSubSkillGroupSecond", "selectSubSkillGroupThird"];

  const skillGroup = data?.skillGroups ? data?.skillGroups : [];
  const basket = data?.basket ? data?.basket : [];
  if (skillGroup.length > 0) {
    data.skillGroups.forEach((item, index) => {
      $(`#${arraySkillGroup[index]}`).append(new Option(item.skillGroupName, item.skillGroupCode, true, true));
      $(`#${arraySubSkillGroup[index]}`).append(new Option(item.subSkillGroupName, item.subSkillGroupCode, true, true));
    });
  }
  const arrayBasket = [];
  if (data.isBasket) {
    data.subOrdinates.forEach((item, index) => {
      console.log("item", item);
      const [prlFrom, prlTo] = item.prlOrg.includes("-") ? item.prlOrg.split("-") : [item.prlOrg, item.prlOrg];
      const params = { ...subOrdinates };
      params.subPosId = index + 1;
      params.unitCode = item.unitCode;
      params.unitName = item.unitName;
      params.unitParentCode = item.parentCode;
      params.unitParentName = item.parentName;
      params.jobPositionName = item.positionName || "";
      params.layer = item.layer;
      params.prlFrom = prlFrom;
      params.prlTo = prlTo;
      params.formation = item.formation || 1;
      params.prlPlan = 4;
      params.formationBasket = item.formationBasket || [];
      params.careerLevel = {
        careerLevelCode: data?.careerLevelCode || "",
        careerLevelName: data?.careerLevelName || "",
      };
      params.careerType = {
        careerTypeCode: data?.careerTypeCode || "",
        careerTypeName: data?.careerTypeName || "",
      };
      params.abbrivation = {
        careerJobName: "",
        jobAbbrivationName: "",
        isNew: false,
      };
      console.log("params", params);
      arrayBasket.push(params);
    });
    localStorage.setItem("subJobPos", JSON.stringify(arrayBasket));
    $("#selectBasket").val("Yes").trigger("change");
  } else {
    $("#selectBasket").val("No").trigger("change");
  }

  return;
}

function defaultState() {
  // Hide UI elements and set default values
  $("#subPositionDiv, #dataSubPosition, #joinFormationDiv").hide();
  $("#inputFormation").val("1");

  // Disable all form elements
  $("[id^=select], [id^=input]").attr("disabled", true);

  // Enable specific fields that should remain enabled
  $("#inputDraftName, #selectCareerType, #selectJobReference").attr("disabled", false);
}

function defaultStateMOdal() {
  $("[id^=modalSelect]").attr("disabled", true);
  $("[id^=modalInput]").attr("disabled", true);

  // inputdraftname dan career type tidak bisa di disable
  $("#modalSelectCareerLevel").attr("disabled", false);
  // $("#selectCareerType").attr("disabled", false);
}

function openAll() {
  $("[id^=select]").attr("disabled", false);
  $("[id^=input]").attr("disabled", false);
  $("#inputFormation").attr("disabled", true);
  $("#selectDraftType").attr("disabled", true);
  $("#selectPrlOrgTo").attr("disabled", true);

  // coordination with disable
  $("#selectCoordinationWith").attr("disabled", true);
}

function onChangeSwith(value, target) {
  const selectId = "#select" + target;
  const inputId = "#input" + target;
  $(inputId).val(null);
  $(inputId).hide();
  $(selectId).next(".select2-container").show();
  $(selectId).show();
  if (value.target.checked) {
    $(selectId).val(null).trigger("change");
    $(selectId).next(".select2-container").hide();
    $(selectId).hide();
    $(inputId).show();
  }
}

function activateButton() {
  $("#next").show();
  $("#back").show();
}

function defaultTab() {
  $(".tab").hide();
  $("#inputAttribute").show();
}

function updatedAll(dataObject) {
  openAll();
  const draft = dataObject?.draft;
  const draftDetail = dataObject?.draftDetail;
  const draftSsg = dataObject?.listJobSssg;
  getAllMutiselect();
  updateCareerLevel(draftDetail?.careerType);
  updateAbbrvPosition(draftDetail?.careerType, draftDetail?.careerLevel);
  updatePrlOrg(draftDetail?.careerType, draftDetail?.careerLevel);

  $("#inputDraftName").val(draft?.draftName);

  if (draft?.typeDetail == "Edit New Job") {
    $("#selectDraftType").append(new Option("Edit Job", "1", true, true));
  }
  $("#selectCareerType")
    .append(new Option(draftDetail?.careerType, draftDetail?.careerType, true, true))
    .trigger("change");
  $("#selectCareerLevel").append(new Option(draftDetail?.careerLevel, draftDetail?.careerLevel, true, true));

  if (draftDetail?.isBasket) {
    $("#selectBasket").attr("disabled", false);
    $("#selectBasket").val("Yes");
    $("#selectBasket").trigger("change");
  }
  $("#selectAbbrvPosition").append(new Option(draftDetail?.abbrvPosition, draftDetail?.abbrvPosition, true, true));
  $("#selectOrgUnitName").append(new Option(draftDetail?.orgUnitName, draftDetail?.orgUnitName, true, true));
  $("#inputPositionName").val(draftDetail?.positionName);
  $("#inputOrgUnitName").val(draftDetail?.orgUnitName);
  $("#selectKBO").append(new Option(draftDetail?.kbo, draftDetail?.kbo, true, true));
  $("#selectCostCenter").append(new Option(draftDetail?.costCenterPosisi, draftDetail?.costCenterPosisi, true, true));
  if (draftDetail?.prlOrg.includes("-")) {
    const prlOrgSplit = draftDetail?.prlOrg.split("-");
    $("#selectPrlOrg").append(new Option(prlOrgSplit[0], prlOrgSplit[0], true, true));
    $("#selectPrlOrgTo").append(new Option(prlOrgSplit[1], prlOrgSplit[1], true, true));
  } else {
    $("#selectPrlOrg").append(new Option(draftDetail?.prlOrg, draftDetail?.prlOrg, true, true));
  }
  $("#inputFormation")
    .val(draftDetail?.formation == null || draftDetail?.formation == "" ? 1 : draftDetail?.formation)
    .attr("disabled", false);
  $("#selectDirectReport").append(new Option(draftDetail?.directReport, draftDetail?.directReport, true, true));
  if (draftDetail?.neckFunction) {
    $("#selectNeckFunction").prop("checked", true);
    $("#selectNeckFunction").trigger("change");
  }
  if (draftDetail?.isProject) {
    $("#selectIsProject").prop("checked", true);
    $("#selectIsProject").trigger("change");
  }
  if (draftDetail?.isCoordination) {
    $("#selectCoordination").prop("checked", true);
    $("#selectCoordination").trigger("change");
    $("#selectCoordinationWith").append(
      new Option(draftDetail?.coordinationWith, draftDetail?.coordinationWith, true, true)
    );
    $("#selectCoordinationWith").attr("disabled", false);
  }

  $("#selectFunction").append(new Option(draftDetail?.function, draftDetail?.function, true, true));
  $("#selectDivision").append(new Option(draftDetail?.division, draftDetail?.division, true, true));
  $("#selectSubDivision").append(new Option(draftDetail?.subDivision, draftDetail?.subDivision, true, true));
  $("#selectDepartment").append(new Option(draftDetail?.department, draftDetail?.department, true, true));
  $("#selectSection").append(new Option(draftDetail?.section, draftDetail?.section, true, true));
  $("#selectPersonalAreaName").append(
    new Option(draftDetail?.personalAreaName, draftDetail?.personalAreaName, true, true)
  );

  console.log("draftSsg", draftSsg);

  $("#selectSkillGroupMain").append(new Option(draftSsg?.mainSg?.text, draftSsg?.mainSg?.id, true, true));
  $("#selectSubSkillGroupMain").append(new Option(draftSsg?.mainSsg?.text, draftSsg?.mainSsg?.id, true, true));
  $("#selectSkillGroupSecond").append(new Option(draftSsg?.secondSg?.text, draftSsg?.secondSg?.id, true, true));
  $("#selectSubSkillGroupSecond").append(new Option(draftSsg?.secondSsg?.text, draftSsg?.secondSsg?.id, true, true));
  $("#selectSkillGroupThird").append(new Option(draftSsg?.thirdSg?.text, draftSsg?.thirdSg?.id, true, true));
  $("#selectSubSkillGroupThird").append(new Option(draftSsg?.thirdSsg?.text, draftSsg?.thirdSsg?.id, true, true));
}

function updatedAllSubordinate(dataObject) {
  openAll();

  const draftDetail = dataObject;
  getAllMutiselect();
  updateCareerLevel(draftDetail?.careerType);
  updateAbbrvPosition(draftDetail?.careerType, draftDetail?.careerLevel);
  updatePrlOrg(draftDetail?.careerType, draftDetail?.careerLevel);

  $("#selectCareerType")
    .append(new Option(draftDetail?.careerType, draftDetail?.careerType, true, true))
    .trigger("change");
  $("#selectCareerLevel").append(new Option(draftDetail?.careerLevel, draftDetail?.careerLevel, true, true));

  if (draftDetail?.isBasket) {
    $("#selectBasket").attr("disabled", false);
    $("#selectBasket").val("Yes");
    $("#selectBasket").trigger("change");
  }
  $("#selectAbbrvPosition").append(new Option(draftDetail?.abbrvPosition, draftDetail?.abbrvPosition, true, true));
  $("#selectOrgUnitName").append(new Option(draftDetail?.orgUnitName, draftDetail?.orgUnitName, true, true));
  $("#inputPositionName").val(draftDetail?.positionName);
  $("#selectPrlOrg").append(new Option(draftDetail?.prlOrg, draftDetail?.prlOrg, true, true));
  $("#inputFormation").val(draftDetail?.formation);
  $("#selectDirectReport").append(new Option(draftDetail?.directReport, draftDetail?.directReport, true, true));
  draftDetail?.neckFunction
    ? $("#selectNeckFunction").prop("checked", true)
    : $("#selectNeckFunction").prop("checked", false);
  if (draftDetail?.neckFunction) {
    $("#selectNeckFunction").prop("checked", true);
    $("#selectNeckFunction").trigger("change");
  }
  if (draftDetail?.isProject) {
    $("#selectIsProject").prop("checked", true);
    $("#selectIsProject").trigger("change");
  }
  if (draftDetail?.isCoordination) {
    $("#selectCoordination").prop("checked", true);
    $("#selectCoordination").trigger("change");
    $("#selectCoordinationWith").append(
      new Option(draftDetail?.coordinationWith, draftDetail?.coordinationWith, true, true)
    );
    $("#selectCoordinationWith").attr("disabled", false);
  }

  $("#selectFunction").append(new Option(draftDetail?.function, draftDetail?.function, true, true));
  $("#selectDivision").append(new Option(draftDetail?.division, draftDetail?.division, true, true));
  $("#selectSubDivision").append(new Option(draftDetail?.subDivision, draftDetail?.subDivision, true, true));
  $("#selectDepartment").append(new Option(draftDetail?.department, draftDetail?.department, true, true));
  $("#selectSection").append(new Option(draftDetail?.section, draftDetail?.section, true, true));
  $("#selectPersonalAreaName").append(
    new Option(draftDetail?.personalAreaName, draftDetail?.personalAreaName, true, true)
  );
}

function updateDivSubPosition(dataSubPosition) {
  $("#noDataSubPosition").show();
  $("#dataSubPosition").hide();
  if (dataSubPosition.length > 0) {
    $("#noDataSubPosition").hide();
    $("#dataSubPosition").show();
    getTablePositionList(dataSubPosition);
  }
}

function updateDivSubPositionSubordinate(dataSubPosition, dataObject) {
  $("#noDataSubPosition").show();
  $("#dataSubPosition").hide();
  if (dataSubPosition.length > 0) {
    $("#noDataSubPosition").hide();
    $("#dataSubPosition").show();
    getTablePositionList(dataSubPosition);
  }
}
function updateDivSubordinate(dataSubordinate, dataObject) {
  const selectBasket = dataObject?.draftDetail?.isBasket;
  $("#titleSubordinate").text("There is no subordinate");
  $("#buttonSubordinateDiv").show();
  if (selectBasket) {
    $("#titleSubordinate").text("Basket position have no subordinates");
    $("#buttonSubordinateDiv").hide();
  }

  $("#noDataSubordinate").show();
  $("#dataSubordinate").hide();

  if (dataSubordinate.length > 0) {
    getTableSubordinateList(dataSubordinate);
    // noDataSubordinate
    $("#noDataSubordinate").hide();
    $("#dataSubordinate").show();
  }
}

async function nextTab() {
  activateButton();
  const currentTab = $(".tab.active").attr("id");
  const currentIndex = tabArray.indexOf(currentTab);
  const nextTab = tabArray[currentIndex + 1];

  $("#" + currentTab).removeClass("active");
  $("#" + currentTab).hide();

  $("#" + nextTab).addClass("active");
  $("#" + nextTab).show();

  // switch case based on currentTab
  switch (currentTab) {
    case "inputAttribute":
      await saveInputAttribut();
      await checkUniqueCode("uniqueId", "");
      localStorage.setItem("directReport", $("#inputPositionName").val());
      break;
    case "inputSubordinate":
      break;
    case "inputSgSsg":
      saveInputSgSsg();
      break;
    default:
      break;
  }

  const spanBefore = document.querySelectorAll("span." + currentTab);
  spanBefore.forEach((span) => {
    span.classList.remove("active");
    span.classList.add("active-last");
  });
  const spanAfter = document.querySelectorAll("span." + nextTab);
  spanAfter.forEach((span) => {
    span.classList.add("active");
  });

  if (nextTab === "preview") {
    $("#next").hide();
    $("#back").show();
  }
}

function previousTab() {
  activateButton();
  const currentTab = $(".tab.active").attr("id");
  const currentIndex = tabArray.indexOf(currentTab);
  const prevTab = tabArray[currentIndex - 1];

  $("#" + currentTab).removeClass("active");
  $("#" + currentTab).hide();

  $("#" + prevTab).addClass("active");
  $("#" + prevTab).show();

  const spanBefore = document.querySelectorAll("span." + currentTab);
  spanBefore.forEach((span) => {
    span.classList.remove("active");
  });
  const spanAfter = document.querySelectorAll("span." + prevTab);
  spanAfter.forEach((span) => {
    span.classList.remove("active-last");
    span.classList.add("active");
  });

  if (prevTab === "inputAttribute") {
    // show contentDiv
    $("#contentDiv").show();
    $("#back").hide();
    $("#next").show();
  }
}

// async function saveInputAttributOld(type, data) {
//   const payload = payloadPosition;
//   payload.type = type;
//   saveEmployeeDetails(payload, data);
//   saveOrgDetails(payload);
//   if (payload.type == "edit") {
//     data = lsListPosition.find((item) => item.positionId == payload.positionId);
//     swal("Saved", "Position has been updated", "success");
//     // wait 1 second
//     setTimeout(() => {
//       window.location.href = "/organization/index?focusNode=" + payload.positionId;
//     }, 1000);
//   } else {
//     swal("Saved", "Position has been saved", "success");
//     const getDirectReport = payload.positionId;
//     setTimeout(() => {
//       window.location.href = "/organization/index?focusNode=" + getDirectReport;
//     }, 1000);
//   }
// }

function formattedInputAttribut(type) {
  const unitCode = urlParams.get("unitCode");
  const payload = formPositionParam;
  payload.draftId = organizationAttribute.orgUnitId;
  payload.userId = "system";
  payload.unit.unitCode = type == "edit" ? unitCode : null;
  payload.unit.unitName = $("#inputOrgUnitName").val();
  payload.unit.positionName = $("#inputPositionName").val();
  payload.unit.layer = 4;
  payload.unit.isBasket = $("#selectBasket").val() == "Yes" ? true : false;
  const isBasket = payload.unit.isBasket;
  payload.unit.prlPlan = 12;
  payload.unit.prlOrgFrom = $("#selectPrlOrg").val();
  payload.unit.prlOrgTo = isBasket ? $("#selectPrlOrgTo").val() : null;
  payload.unit.formation = $("#inputFormation").val() == "" ? 1 : $("#inputFormation").val();
  payload.unit.isNeckFunction = $("#selectNeckFunction").prop("checked") ? true : false;
  payload.unit.isProject = $("#selectIsProject").prop("checked") ? true : false;
  payload.unit.isCoordinate = $("#selectCoordination").prop("checked") ? true : false;
  payload.unit.kbo = $("#selectKBO").val();
  payload.unit.costCenter = $("#selectCostCenter").val();
  // career type
  payload.careerType.careerTypeCode = $("#selectCareerType").val();
  payload.careerType.careerTypeName = $("#selectCareerType option:selected").text();
  // career level
  payload.careerLevel.careerLevelCode = $("#selectCareerLevel").val();
  payload.careerLevel.careerLevelName = $("#selectCareerLevel option:selected").text();
  // function
  payload.function.isNew = $("#FunctionSwitch").prop("checked");
  payload.function.functionCode = payload.function.isNew ? "" : $("#selectFunction").val();
  payload.function.functionName = payload.function.isNew
    ? $("#inputFunction").val()
    : $("#selectFunction option:selected").text();

  // division
  payload.division.isNew = $("#DivisionSwitch").prop("checked");
  payload.division.divisionCode = payload.division.isNew ? "" : $("#selectDivision").val();
  payload.division.divisionName = payload.division.isNew
    ? $("#inputDivision").val()
    : $("#selectDivision option:selected").text();
  // sub division
  payload.subDivision.isNew = $("#SubDivisionSwitch").prop("checked");
  payload.subDivision.subDivisionCode = payload.subDivision.isNew ? "" : $("#selectSubDivision").val();
  if (payload.subDivision.subDivisionCode == "null" || payload.subDivision.subDivisionCode == null) {
    payload.subDivision.subDivisionCode = "";
  }
  payload.subDivision.subDivisionName = payload.subDivision.isNew
    ? $("#inputSubDivision").val()
    : $("#selectSubDivision option:selected").text();
  payload.department.isNew = $("#DepartmentSwitch").prop("checked");
  // department
  payload.department.departmentCode = payload.department.isNew ? "" : $("#selectDepartment").val();
  if (payload.department.departmentCode == "null" || payload.department.departmentCode == null) {
    payload.department.departmentCode = "";
  }
  payload.department.departmentName = payload.department.isNew
    ? $("#inputDepartment").val()
    : $("#selectDepartment option:selected").text();
  // section
  payload.section.isNew = $("#SectionSwitch").prop("checked");
  payload.section.sectionCode = payload.section.isNew ? "" : $("#selectSection").val();
  if (payload.section.sectionCode == "null" || payload.section.sectionCode == null) {
    payload.section.sectionCode = "";
  }
  payload.section.sectionName = payload.section.isNew
    ? $("#inputSection").val()
    : $("#selectSection option:selected").text();
  // personnelArea
  payload.personnelArea.isNew = $("#PersonalAreaNameSwitch").prop("checked");
  payload.personnelArea.personnelAreaCode = payload.personnelArea.isNew ? "" : $("#selectPersonalAreaName").val();
  if (payload.personnelArea.personnelAreaCode == "null" || payload.personnelArea.personnelAreaCode == null) {
    payload.personnelArea.personnelAreaCode = "";
  }
  payload.personnelArea.personnelAreaName = payload.personnelArea.isNew
    ? $("#inputPersonalAreaName").val()
    : $("#selectPersonalAreaName option:selected").text();
  // personnelSubArea
  payload.personnelSubArea.isNew = $("#PersonalSubareaNameSwitch").prop("checked");
  payload.personnelSubArea.personnelSubAreaCode = payload.personnelSubArea.isNew
    ? ""
    : $("#selectPersonalSubareaName").val();
  if (
    payload.personnelSubArea.personnelSubAreaCode == "null" ||
    payload.personnelSubArea.personnelSubAreaCode == null
  ) {
    payload.personnelSubArea.personnelSubAreaCode = "";
  }
  payload.personnelSubArea.personnelSubAreaName = payload.personnelSubArea.isNew
    ? $("#inputPersonalSubareaName").val()
    : $("#selectPersonalSubareaName option:selected").text();
  // costCenter
  payload.unitParent.isNew = false;
  payload.unitParent.unitCode = $("#selectOrgUnitParentName").val() || "";
  payload.unitParent.unitName = $("#selectOrgUnitParentName option:selected").text() || "";
  // directReport
  payload.directReportTo.jobPositionCode = $("#selectDirectReport").val();
  payload.directReportTo.jobPositionName = $("#selectDirectReport option:selected").text();
  // abbreviation
  payload.abbrivation.isNew = $("#AbbrvPositionSwitch").prop("checked");
  payload.abbrivation.jobAbbrivationCode = payload.abbrivation.isNew ? "" : $("#selectAbbrvPosition").val();
  if (payload.abbrivation.jobAbbrivationCode == "null" || payload.abbrivation.jobAbbrivationCode == null) {
    payload.abbrivation.jobAbbrivationCode = "";
  }
  payload.abbrivation.careerJobName = payload.abbrivation.isNew
    ? $("#inputAbbrvPosition").val()
    : $("#selectAbbrvPosition option:selected").text();

  payload.abbrivation.jobAbbrivationName = payload.abbrivation.isNew
    ? $("#inputAbbrvPosition").val()
    : $("#selectAbbrvPosition option:selected").text();
  // get first 12 character
  payload.abbrivation.jobAbbrivationName = payload.abbrivation.jobAbbrivationName.substring(0, 12);

  // coordinateWith
  payload.coordinateWith.unitCode = payload.unit.isCoordinate ? $("#selectCoordinationWith").val() : "";
  payload.coordinateWith.unitName = payload.unit.isCoordinate
    ? $("#selectCoordinationWith option:selected").text()
    : "";

  payload.skillGroups = [];
  ["Main", "Second", "Third"].forEach((level, index) => {
    const skillGroup = $(`#selectSkillGroup${level}`).val();
    const subSkillGroup = $(`#selectSubSkillGroup${level}`).val();
    if (skillGroup != "null" && skillGroup != null) {
      payload.skillGroups.push({
        skillGroupCode: skillGroup,
        skillGroupName: $(`#selectSkillGroup${level} option:selected`).text(),
        subSkillGroupCode: subSkillGroup,
        subSkillGroupName: $(`#selectSubSkillGroup${level} option:selected`).text(),
        subSkillGroupSequence: index + 1,
      });
    }
  });

  payload.subOrdinates = [];
  let subJobPos = JSON.parse(localStorage.getItem("subJobPos"));
  if (subJobPos.length > 0) {
    payload.subOrdinates = subJobPos;
  }

  return payload;
}

async function saveInputAttribut(type) {
  const formPositionParam = formattedInputAttribut(type);
  // console.log("formPositionParam", formPositionParam);
  // console.log("formPositionParam", formPositionParam.unit.isBasket);
  const basket = formPositionParam.unit.isBasket;
  // return;
  // compare formPositionParam with localStorage logState.initParams
  const logState = JSON.parse(localStorage.getItem("logState"));
  if (logState && logState.initParams && type === "edit") {
    const initParams = logState.initParams;
    if (JSON.stringify(formPositionParam) === JSON.stringify(initParams)) {
      swal("No changes detected", "Please make changes before saving.", "info");
      return;
    } else {
      // Helper function to deep compare objects and find actual differences
      function findDeepDifferences(newObj, oldObj, path = "") {
        const differences = {};

        // Get all unique keys from both objects
        const allKeys = new Set([...Object.keys(newObj || {}), ...Object.keys(oldObj || {})]);

        for (const key of allKeys) {
          const newValue = newObj?.[key];
          const oldValue = oldObj?.[key];
          const currentPath = path ? `${path}.${key}` : key;

          // Skip if both values are exactly the same
          if (JSON.stringify(newValue) === JSON.stringify(oldValue)) {
            continue;
          }

          // If both are objects (not arrays or null), recursively compare
          if (
            newValue &&
            oldValue &&
            typeof newValue === "object" &&
            typeof oldValue === "object" &&
            !Array.isArray(newValue) &&
            !Array.isArray(oldValue)
          ) {
            const nestedDiffs = findDeepDifferences(newValue, oldValue, currentPath);
            Object.assign(differences, nestedDiffs);
          } else {
            // Only add if there's an actual difference
            if (newValue !== oldValue) {
              differences[currentPath] = {
                oldValue: oldValue,
                newValue: newValue,
              };
            }
          }
        }

        return differences;
      }

      // Helper function to group differences by parent object
      function groupDifferencesByParent(differences) {
        const grouped = {};

        for (const [path, diff] of Object.entries(differences)) {
          const parts = path.split(".");

          if (parts.length === 1) {
            // Top-level property
            grouped[path] = diff;
          } else {
            // Nested property - group by parent
            const parentKey = parts[0];
            const childKey = parts.slice(1).join(".");

            if (!grouped[parentKey]) {
              grouped[parentKey] = {};
            }

            // Create nested structure
            grouped[parentKey][childKey] = {
              oldValue: { [childKey]: diff.oldValue },
              newValue: { [childKey]: diff.newValue },
            };
          }
        }

        return grouped;
      }

      // Find actual differences between the objects
      const differences = findDeepDifferences(formPositionParam, initParams);

      // Remove entries where both old and new values are falsy
      Object.keys(differences).forEach((key) => {
        const diff = differences[key];
        if (!diff.oldValue && !diff.newValue) {
          delete differences[key];
        }
      });

      // Group differences by parent object
      const groupedDifferences = groupDifferencesByParent(differences);

      if (Object.keys(groupedDifferences).length > 0) {
        console.log("Differences found:", groupedDifferences);
      } else {
        console.log("No differences found.");
      }
    }
  }

  console.log("basket", basket);
  console.log("type", type);

  // Check if basket is selected and type is "edit"
  let result;
  if (basket) {
    result =
      type === "edit" ? await draftJobUpdateBasket(formPositionParam) : await draftJobAddBasket(formPositionParam);
  } else {
    result =
      type === "edit"
        ? await draftJobUpdateNonBasket(formPositionParam)
        : await draftJobAddNonBasket(formPositionParam);
  }
  return result;
}

function saveEmployeeDetails(payload, data) {
  payload.draftId = organizationAttribute.orgUnitId;
  // positionId random 10 digit
  if (payload.type == "edit") {
    payload.positionId = data.positionId;
    payload.orgUnitId = data.orgUnitId;
  }
  payload.positionId =
    payload.type == "edit" ? payload.positionId : Math.floor(1000000000 + Math.random() * 9000000000);
  payload.positionName = $("#inputPositionName").val();
  payload.isBasket = $("#selectBasket").val() == "Yes" ? "Yes" : "No";
  payload.prlOrg = $("#selectPrlOrg").val();
  payload.prlOrgTo = $("#selectPrlOrgTo").val();
  payload.orgUnitParentId = lsListPosition.find(
    (item) => item.orgUnitParentId == $("#selectOrgUnitParentName").val()
  )?.orgUnitParentId;
  payload.orgUnitParent = lsListPosition.find(
    (item) => item.orgUnitParentId == $("#selectOrgUnitParentName").val()
  )?.orgUnitParent;
  payload.directReportId = lsListPosition.find((item) => item.positionId == $("#selectDirectReport").val())?.positionId;
  payload.directReport = lsListPosition.find((item) => item.positionId == $("#selectDirectReport").val())?.positionName;
  payload.function = $("#selectFunction").val() ? $("#selectFunction").val() : $("#inputFunction").val();
  payload.division = $("#selectDivision").val() ? $("#selectDivision").val() : $("#inputDivision").val();
  payload.subDivision = $("#selectSubDivision").val() ? $("#selectSubDivision").val() : $("#inputSubDivision").val();
  payload.department = $("#selectDepartment").val() ? $("#selectDepartment").val() : $("#inputDepartment").val();
  payload.section = $("#selectSection").val() ? $("#selectSection").val() : $("#inputSection").val();
  payload.careerLevel = $("#selectCareerLevel").val() ? $("#selectCareerLevel").val() : $("#inputCareerLevel").val();
  payload.careerType = $("#selectCareerType").val() ? $("#selectCareerType").val() : $("#inputCareerType").val();
  payload.abbrvPosition = $("#selectAbbrvPosition").val()
    ? $("#selectAbbrvPosition").val()
    : $("#inputAbbrvPosition").val();
  payload.orgUnitId = payload.type == "edit" ? payload.orgUnitId : Math.floor(1000000000 + Math.random() * 9000000000);
  payload.orgUnitName = $("#inputOrgUnitName").val();
  payload.kbo = $("#selectKBO").val();
  payload.costCenterPosisi = $("#selectCostCenter").val() ? $("#selectCostCenter").val() : $("#inputCostCenter").val();
  payload.costCenterDesc = $("#selectCostCenter").val() ? $("#selectCostCenter").val() : $("#inputCostCenter").val();
  payload.personalAreaCode = $("#selectPersonalAreaCode").val()
    ? $("#selectPersonalAreaCode").val()
    : $("#inputPersonalAreaCode").val();
  payload.personalAreaName = $("#selectPersonalAreaName").val()
    ? $("#selectPersonalAreaName").val()
    : $("#inputPersonalAreaName").val();
  payload.personalSubareaCode = $("#selectPersonalSubareaCode").val()
    ? $("#selectPersonalSubareaCode").val()
    : $("#inputPersonalSubareaCode").val();
  payload.personalSubareaName = $("#selectPersonalSubareaName").val()
    ? $("#selectPersonalSubareaName").val()
    : $("#inputPersonalSubareaName").val();
  payload.formation = $("#inputFormation").val() == "" ? 1 : $("#inputFormation").val();
  payload.neckFunction = $("#selectNeckFunction").prop("checked") ? true : false;
  payload.isProject = $("#selectIsProject").prop("checked") ? true : false;
  payload.isCoordination = $("#selectCoordination").prop("checked") ? true : false;
  payload.coordinationWith = $("#selectCoordinationWith").val();
  payload.mainSkillGroup = $("#selectSkillGroupMain").val();
  payload.mainSubSkillGroup = $("#selectSubSkillGroupMain").val();
  payload.secondSkillGroup = $("#selectSkillGroupSecond").val();
  payload.secondSubSkillGroup = $("#selectSubSkillGroupSecond").val();
  payload.thirdSkillGroup = $("#selectSkillGroupThird").val();
  payload.thirdSubSkillGroup = $("#selectSubSkillGroupThird").val();
  payload.skNumber = "";
  // get data datatable, table id = subPositionList
  payload.listSubPosition = [];
  if ($("#selectBasket").val() == "Yes") {
    const table = $("#subPositionList").DataTable();
    const getDataList = table.rows().data().toArray();
    payload.listSubPosition = getDataList;
  }
  const checkData = lsListDetailDraft.find(
    (item) => item.positionId == payload.positionId && item.draftId == payload.draftId
  );
  console.log("checkData 1", checkData, payload.draftId);

  if (checkData) {
    const index = lsListDetailDraft.findIndex(
      (item) => item.positionId == payload.positionId && item.draftId == payload.draftId
    );
    lsListDetailDraft[index] = payload;
  } else {
    lsListDetailDraft.push(payload);
  }

  localStorage.setItem("listDraftDetail", JSON.stringify(lsListDetailDraft));
}
function saveOrgDetails(payload) {
  const orgPayload = {
    type: payload.type,
    draft_id: payload.draftId,
    id_position: payload.positionId,
    position: payload.positionName,
    id_position_atasan_langsung: payload.directReportId,
    layering: "L3",
    gl: "GL1",
    prl: payload.prlOrg == payload.prlOrgTo ? payload.prlOrg : `${payload.prlOrg} - ${payload.prlOrgTo}`,
    org_unit_name: payload.orgUnitName,
    id_org_unit: payload.orgUnitId,
    bracket: payload.listSubPosition.length > 0 ? true : false,
    assistant: payload.neckFunction,
    depth: 0,
    jumlah_formasi: payload.formation,
    id: payload.positionId,
    pid: payload.directReportId,
    tags: [],
  };

  if (payload.type == "create") {
    orgPayload.tags.push("create");
  }
  if (payload.type == "edit") {
    orgPayload.tags.push("edit");
  }
  if (payload.neckFunction == true) {
    orgPayload.tags.push("assistant");
  }
  if (payload.isBasket == "Yes") {
    const bracket = `bracket_${payload.listSubPosition.length}`;
    orgPayload.tags.push(bracket);
  }
  payload.listSubPosition.forEach((item, idx) => {
    orgPayload[`bc_${idx + 1}_id_position`] = item.subPositionId;
    orgPayload[`bc_${idx + 1}_position`] = item.subPositionName;
    orgPayload[`bc_${idx + 1}_id_position_atasan_langsung`] = payload.directReportId;
    orgPayload[`bc_${idx + 1}_layering`] = "L3";
    orgPayload[`bc_${idx + 1}_gl`] = "GL1";
    orgPayload[`bc_${idx + 1}_prl`] = item.prlOrg == item.prlOrgTo ? item.prlOrg : `${item.prlOrg} - ${item.prlOrgTo}`;
    orgPayload[`bc_${idx + 1}_org_unit_name`] = payload.orgUnitName;
    orgPayload[`bc_${idx + 1}_id_org_unit`] = payload.orgUnitId;
    orgPayload[`bc_${idx + 1}_bracket`] = false;
    orgPayload[`bc_${idx + 1}_assistant`] = false;
    orgPayload[`bc_${idx + 1}_depth`] = 0;
    orgPayload[`bc_${idx + 1}_jumlah_formasi`] = item.formation;
  });

  const checkData = lsListDraftOrgNode.find(
    (item) => item.id_position == payload.positionId && item.draft_id == payload.draftId
  );
  console.log("checkData 1", checkData, payload.draftId);
  if (checkData) {
    const index = lsListDraftOrgNode.findIndex(
      (item) => item.id_position == payload.positionId && item.draft_id == payload.draftId
    );
    lsListDraftOrgNode[index] = orgPayload;
  } else {
    lsListDraftOrgNode.push(orgPayload);
  }
  localStorage.setItem("listDraftOrgNode", JSON.stringify(lsListDraftOrgNode));
}

async function saveAddSubPosition() {
  const payload = initialDraftJobSubPosition;
  payload.uniquePosCode = uuid.uniquePosCode;
  payload.uniqueCode = uuid.uniqueCode;
  payload.careerLevel = $("#modalSelectCareerLevel").val();
  payload.careerType = $("#modalInputCareerType").val();
  payload.abbrPosition = $("#modalSelectAbbrvPosition").val();
  payload.orgUnitName = $("#modalInputOrgUnitName").val();
  payload.positionName = $("#modalInputSubPositionName").val();
  payload.prlOrg = $("#modalSelectPrlOrgSubPos").val();
  payload.formation = $("#modalInputFormation").val();
  payload.subPositionLevel = $('input[name="radio1"]:checked').val();

  // async await
  if (statusAction == "edit") {
    payload.id = helperId;
    await editDraftJobSubPosition(payload);
  } else {
    await postInputSubPosition(payload);
  }
}

async function saveInputSubordinate() {
  const payload = initialDraftJobSubordinate;
  payload.uniqueCode = uuid.uniqueCode;
  payload.uniquePosCode = uuid.uniquePosCode;
  payload.type = "draft";
  payload.category = "add";
  payload.draftName = $("#inputDraftName").val();
  payload.careerType = $("#selectCareerType").val();
  payload.careerLevel = $("#selectCareerLevel").val();
  payload.isBasket = $("#selectBasket").val() == "Yes" ? true : false;
  payload.abbrvPosition = null;
  payload.orgUnitName = null;

  if ($("#selectBasket").val() == "No") {
    payload.abbrvPosition =
      $("#inputAbbrvPosition").val() == null || $("#inputAbbrvPosition").val() == ""
        ? $("#selectAbbrvPosition").val()
        : $("#inputAbbrvPosition").val();
    payload.formation = $("#inputFormation").val();
  }
  payload.orgUnitName =
    $("#inputOrgUnitName").val() == null || $("#inputOrgUnitName").val() == ""
      ? $("#selectOrgUnitName").val()
      : $("#inputOrgUnitName").val();
  payload.prlOrg =
    $("#inputPrlOrg").val() == null || $("#inputPrlOrg").val() == ""
      ? $("#selectPrlOrg").val()
      : $("#inputPrlOrg").val();
  payload.directReport = $("#selectDirectReport").val();
  payload.neckFunction = $("#selectNeckFunction").val() == "Yes" ? true : false;
  payload.isProject = $("#selectIsProject").val() == "Yes" ? true : false;
  payload.isCoordination = $("#selectCoordination").val() == "Yes" ? true : false;
  payload.coordinationWith = $("#selectCoordinationWith").val();
  payload.function =
    $("#inputFunction").val() == null || $("#inputFunction").val() == ""
      ? $("#selectFunction").val()
      : $("#inputFunction").val();
  payload.division =
    $("#inputDivision").val() == null || $("#inputDivision").val() == ""
      ? $("#selectDivision").val()
      : $("#inputDivision").val();
  payload.subDivision =
    $("#inputSubDivision").val() == null || $("#inputSubDivision").val() == ""
      ? $("#selectSubDivision").val()
      : $("#inputSubDivision").val();
  payload.department =
    $("#inputDepartment").val() == null || $("#inputDepartment").val() == ""
      ? $("#selectDepartment").val()
      : $("#inputDepartment").val();
  payload.section =
    $("#inputSection").val() == null || $("#inputSection").val() == ""
      ? $("#selectSection").val()
      : $("#inputSection").val();
  payload.personalAreaName =
    $("#inputPersonalAreaName").val() == null || $("#inputPersonalAreaName").val() == ""
      ? $("#selectPersonalAreaName").val()
      : $("#inputPersonalAreaName").val();
  payload.personalSubareaName =
    $("#inputPersonalSubareaName").val() == null || $("#inputPersonalSubareaName").val() == ""
      ? $("#selectPersonalSubareaName").val()
      : $("#inputPersonalSubareaName").val();
  payload.positionName = $("#inputPositionName").val();
  // async await
  payload.id = null;
  // async await
  if (statusAction == "edit" || dataAvailable == true) {
    // uuid.uniquePosCode
    const data = dataStorage?.listJobSubordinate?.find((item) => item.uniquePosCode == uuid.uniquePosCode);
    console.log(data);
    payload.id = urlParams.get("id") ?? data?.id;
    await editDraftJobSubordinate(payload);
  } else {
    await postInputSubordinate(payload);
  }
}

async function saveInputSgSsg() {
  const payload = initialDraftJobSgSsg;
  payload.uniqueCode = uuid.uniqueCode;
  payload.mainSg =
    $("#selectSkillGroupMain").val() == "" || $("#selectSkillGroupMain").val() == null
      ? "0"
      : $("#selectSkillGroupMain").val();
  payload.mainSsg =
    $("#selectSubSkillGroupMain").val() == "" || $("#selectSubSkillGroupMain").val() == null
      ? "0"
      : $("#selectSubSkillGroupMain").val();
  payload.secondSg =
    $("#selectSkillGroupSecond").val() == "" || $("#selectSkillGroupSecond").val() == null
      ? "0"
      : $("#selectSkillGroupSecond").val();
  payload.secondSsg =
    $("#selectSubSkillGroupSecond").val() == "" || $("#selectSubSkillGroupSecond").val() == null
      ? "0"
      : $("#selectSubSkillGroupSecond").val();
  payload.thirdSg =
    $("#selectSkillGroupThird").val() == "" || $("#selectSkillGroupThird").val() == null
      ? "0"
      : $("#selectSkillGroupThird").val();
  payload.thirdSsg =
    $("#selectSubSkillGroupThird").val() == "" || $("#selectSubSkillGroupThird").val() == null
      ? "0"
      : $("#selectSubSkillGroupThird").val();

  await postInputSgSsg(payload);

  // async await
}

function clearInputModal() {
  $("#modalInputSubPosId").val("");
  $("#modalSelectCareerLevel").val("").trigger("change");
  $("#modalSelectAbbrvPosition").val("").trigger("change");
  $("#modalInputSubPositionName").val("");
  $("#modalSelectPrlOrgSubPos").val("").trigger("change");
  $("#modalSelectPrlOrgToSubPos").val("").trigger("change");
  $("#modalInputFormation").val("");

  // find subPosDiv
  const subPosDivs = $("[id^=subPosDiv]");
  subPosDivs.each(function (index) {
    if (index !== 0) {
      $(this).remove();
    }
  });
}

async function modalSubPosition() {
  const draftId = organizationAttribute.orgUnitId;
  const _abbrv = await abbrvPositionList(organizationAttribute.orgUnitId);
  $("#modalAddSubPosition").modal("show");
  clearInputModal();
  getDataListAsync([
    {
      id: "modalSelectCareerLevel",
      endpoint: "draft/career-level/list",
      draftId: draftId,
      dropdownParent: $("#modalAddSubPosition"),
    },
  ]);

  getDataList([
    // modalSelectPrlOrgSubPos
    {
      dataId: "modalSelectPrlOrg",
      data: prl.map((item) => ({ id: item, text: item })),
      dropdownParent: $("#modalAddSubPosition"),
    },
    {
      dataId: "modalSelectPrlOrgTo",
      data: prl.map((item) => ({ id: item, text: item })),
      dropdownParent: $("#modalAddSubPosition"),
    },
    {
      dataId: "modalSelectPrlOrgSubPos",
      data: prlRange.map((item) => ({ id: item, text: item })),
      dropdownParent: $("#modalAddSubPosition"),
    },
    {
      dataId: "modalSelectPrlOrgToSubPos",
      data: prlRange.map((item) => ({ id: item, text: item })),
      dropdownParent: $("#modalAddSubPosition"),
    },
    {
      dataId: "modalSelectAbbrvPosition",
      data: _abbrv.data.map((item) => ({ id: item.id, text: item.name })),
      dropdownParent: $("#modalAddSubPosition"),
    },
  ]);
}

function refreshData() {
  checkUniqueCode("uniqueId", "");
  defaultState();
  getAllMutiselect();
  defaultTab();
  // getTablePositionList refresh data
}

async function editSubPosition(id) {
  // addSubPos("edit", id);
  await modalSubPosition(true);
  // get local storage subJobPos
  const subJobPos = JSON.parse(localStorage.getItem("subJobPos"));
  const data = subJobPos.find((item) => item.subPosId == id);
  console.log(data);
  $("#modalInputSubPosId").val(data.subPosId);
  if (data.careerLevel.careerLevelCode) {
    $("#modalSelectCareerLevel").append(
      new Option(data.careerLevel.careerLevelName, data.careerLevel.careerLevelCode, true, true)
    );
  }
  if (data.abbrivation.jobAbbrivationCode) {
    $("#modalSelectAbbrvPosition").append(
      new Option(data.abbrivation.careerJobName, data.abbrivation.jobAbbrivationCode, true, true)
    );
  }

  $("#modalInputSubPositionName").val(data.jobPositionName);
  $("#modalSelectPrlOrg").val(data.prlFrom).trigger("change");
  $("#modalSelectPrlOrgTo").val(data.prlTo).trigger("change");

  const prlOrg = data.prlFrom == data.prlTo ? data.prlFrom : `${data.prlFrom}-${data.prlTo}`;
  if (data.formationBasket.length > 0) {
    data.formationBasket.forEach((item, idx) => {
      if (idx !== 0) addSubPos(item);
      $("#modalSelectPrlOrgSubPos" + (idx === 0 ? "" : idx + 1)).append(
        new Option(item.prlOrg, item.prlOrg, true, true)
      );
      $("#modalInputSubPositionName" + (idx === 0 ? "" : idx + 1)).val(item.positionName);
    });
  } else {
    console.log("masuk basket non merge");
    console.log({ prlOrg });
    $("#modalSelectPrlOrgSubPos").val(prlOrg).trigger("change");
  }
  $("#modalInputFormation").val(data.formation);
}

function editDraft(id) {
  // alert(id);
  // redirec to detail?id=id
  window.location.href = "/organization/detail?draftId=" + id;
}

function editSubordinate(id) {
  // alert(id);
  // redirect to new-subordinate?id=id
  window.location.href = "/organization/new-subordinate?id=" + id + "&edit=true";
}
async function deleteSubPosition(id) {
  swal({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then(async (result) => {
    if (result) {
      try {
        let subJobPos = JSON.parse(localStorage.getItem("subJobPos"));
        subJobPos = subJobPos.filter((item) => item.subPosId != id);
        localStorage.setItem("subJobPos", JSON.stringify(subJobPos));
        checkBasketSelected("Yes");

        // await deleteDraftJobSubPosition(id);
      } catch (error) {
        console.log(error);
      }
    }
  });
}

async function deleteSubordinate(id) {
  swal({
    title: "Are you sure?",
    text: "You won't be able to revert thiss!",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then(async (result) => {
    if (result) {
      try {
        const res = await deleteDraftJobSubordinate(id);
        // refreshData();
        await checkUniqueCode("uniqueId", "");
      } catch (error) {
        console.log(error);
      }
    }
  });
}

async function helperSaveSubPosition() {
  if (!dataAvailable) {
    await saveInputAttribut();
  }
  await saveAddSubPosition();
  swal("SAVED", "Sub position has been saved successfully", "success");
  $("#modalAddSubPosition").modal("hide");
  refreshData();
  // $("#subPositionList").DataTable().destroy();
}

async function helperSaveSubPositionSubordinate() {
  if (!dataAvailable) {
    await saveInputSubordinate();
  }
  await saveAddSubPosition();
  swal("SAVED", "Sub position has been saved successfully", "success");
  $("#modalAddSubPosition").modal("hide");
  refreshDataSubordinate();
  // $("#subPositionList").DataTable().destroy();
}

async function helperSaveSubordinate() {
  await saveInputSubordinate();
  // $("#subPositionList").DataTable().destroy();
}

async function handleDuplicate(params) {
  const draftId = organizationAttribute.orgUnitId;
  const positionId = $("#inputOUCode").val();
  duplicateJob(draftId, positionId);
}

async function handleDelete() {
  const draftId = urlParams.get("draftId");
  swal({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then(async (result) => {
    if (result) {
      try {
        await deleteDraftOrganizationStructure(draftId);
        swal("Deleted", "Draft has been deleted successfully", "success");
        handleBack();
      } catch (error) {
        console.log(error);
      }
    }
  });
}

function checkValue(value) {
  return value == null || value == "" ? "-" : value;
}

async function modalJobPopup(params) {
  let data = await chartJobDetail({
    draftId: organizationAttribute.orgUnitId,
    jobCode: params,
  });
  data = data?.data;
  if (data == undefined) {
    alert("Data not found");
    return;
  }
  const positionName = data?.isBasket ? data?.unitName : data?.positionName;
  $("#jobName").text(checkValue(positionName));
  $("#inputOUCode").val(data.unitCode);
  $("#inputPositionCode").val(data.positionCode);
  $("#modalPrlOrg").text(checkValue(data.prlOrg));
  $("#modalFormation").text(checkValue(data?.formation));

  $("#modalOrgUnitId").text(checkValue(data.unitCode));
  $("#modalOrgUnitName").text(checkValue(data.unitName));
  $("#modalPositionId").text(checkValue(data.positionCode));
  $("#modalPositionName").text(checkValue(data?.positionName));
  $("#modalOrgPositionName").text(data?.positionName ? data?.positionName : data?.orgUnitName ?? "");

  $("#modalDirectReportOrgUnitId").text(checkValue(data.parentCode));
  $("#modalDirectReportOrgUnitName").text(checkValue(data.parentName));
  $("#modalDirectReportId").text(checkValue(data.parentPositionCode));
  $("#modalDirectReportName").text(checkValue(data.parentPositionName));

  $("#modalDirectorate").text(checkValue(data?.directorateName));
  $("#modalFunction").text(checkValue(data?.functionName));
  $("#modalDivision").text(checkValue(data?.divisionName));
  $("#modalSubDivision").text(checkValue(data?.subDivisionName));
  $("#modalDepartment").text(checkValue(data?.departmentName));

  $("#modalSection").text(checkValue(data?.sectionName));
  $("#modalCareerType").text(checkValue(data?.careerTypeName));
  $("#modalCareerLevel").text(checkValue(data?.careerLevelName));
  $("#modalAbbrvPosition").text(checkValue(data?.abbreviationName));

  $("#modalKBO").text(checkValue(data?.kbo));
  $("#modalCostCenter").text(checkValue(data?.costCenterDescription));
  $("#modalPersonnelArea").text(checkValue(data?.personnelAreaCode));
  $("#modalPersonnelAreaName").text(checkValue(data?.personnelAreaName));

  $("#modalPersonnelAreaSub").text(checkValue(data?.personnelSubAreaCode));
  $("#modalPersonnelAreaSubname").text(checkValue(data?.personnelSubAreaName));
  $("#modalSKNumber").text(checkValue(data?.sourceOfSK));

  $("#modalOrgPRL").text(checkValue(data?.prlOrg));
  $("#modalFormation").text(checkValue(data?.formation));

  $("#modalNeckFunction").text(checkValue(data?.neckFunction));
  $("#modalIsProject").text(checkValue(data?.isProject));
  $("#modalIsCoordination").text(checkValue(data?.isCoordination));
  $("#modalCoordinationWith").text(checkValue(data?.coordinationWith));

  $("#modalMainSkillGroup").text(checkValue(data?.skillGroups?.[0]?.skillGroupName));
  $("#modalMainSubSkillGroup").text(checkValue(data?.skillGroups?.[0]?.subSkillGroupName));
  $("#modalSecondSkillGroup").text(checkValue(data?.skillGroups?.[1]?.skillGroupName));
  $("#modalSecondSubSkillGroup").text(checkValue(data?.skillGroups?.[1]?.subSkillGroupName));
  $("#modalThirdSkillGroup").text(checkValue(data?.skillGroups?.[2]?.skillGroupName));
  $("#modalThirdSubSkillGroup").text(checkValue(data?.skillGroups?.[2]?.subSkillGroupName));

  $("#modalDetailJob").modal("show");
  $("#nonBasketIncumbent").show();
  $("#incumbentCard").show();
  if (data?.isBasket) {
    $("#positionListCard, #basketIncumbent").show();
    $("#nonBasketIncumbent").hide();
    $(".no-basket").hide();
    // $("#positionListCard, #basketIncumbent").hide();

    // Render incumbents table
    // data?.incumbents make unique by item.personCode
    data.incumbents = data.incumbents.filter(
      (item, index, self) => index === self.findIndex((t) => t.personCode === item.personCode)
    );
    data.incumbents = data.incumbents.sort((a, b) => a.personCode.localeCompare(b.personCode));

    // data?.positionList make unique by item.positionCode item.positionName and item.prlOrg
    data.positionList = data.positionList.filter(
      (item, index, self) =>
        index === self.findIndex((t) => t.positionName === item.positionName && t.prlOrg === item.prlOrg)
    );

    const positionList = data.positionList.sort((a, b) => a.positionName.localeCompare(b.positionName));

    // cari data di data.positionList yang memiliki mergeFormation yang sama
    // exp output nya ke grouping berdasakarkan persamaan mergeFormation
    const filteredPositions = data.positionList.filter((item) => item.mergeFormation != null);

    // Group by mergeFormation
    const groupedByMergeFormation = filteredPositions.reduce((groups, item) => {
      const key = item.mergeFormation;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
      return groups;
    }, {});

    // Transform to expected output format
    let arrayPrlOrg = [];
    data.positionList = Object.keys(groupedByMergeFormation).map((mergeFormationKey) => {
      const dataPosition = groupedByMergeFormation[mergeFormationKey];
      const arrayKeys = dataPosition
        .map((item) => item.prlOrg)
        .map((prl) => {
          // Use global getPrlNumber function
          return getPrlNumber(prl);
        })
        .sort((a, b) => b - a); // Sort descending (besar ke
      arrayPrlOrg.push(...arrayKeys);
      return {
        mergerFormation: mergeFormationKey,
        totalRow: dataPosition.length,
        dataPosition: dataPosition,
        prlOrgs: arrayKeys,
      };
    });
    arrayPrlOrg.sort((a, b) => b - a); // Sort descending (besar ke kecil)

    let sortedPositionList = [];
    let count = 0;
    for (let i = 0; i < arrayPrlOrg.length; i++) {
      const matching = data.positionList.find((itx) => itx.prlOrgs.includes(arrayPrlOrg[i]));
      if (count < arrayPrlOrg.length && matching) {
        count += matching.totalRow;
        // Sort matching.dataPosition by prlOrg descending (besar ke kecil)
        matching.dataPosition.sort((a, b) => {
          // Use global getPrlNumber function
          return getPrlNumber(b.prlOrg) - getPrlNumber(a.prlOrg);
        });
        sortedPositionList.push(matching);
      }
    }
    console.log("sortedPositionList:", sortedPositionList);

    // data.positionList = data.positionList.sort((a, b) => a.positionName.localeCompare(b.positionName));

    const $basketBody = $("#tableBasketIncumbent tbody").empty();
    (data?.incumbents || []).forEach((item, i) => {
      if (item?.personCode == 0) {
        item.personCode = "-";
        item.personName = "Vacant";
        item.prlPlan = "-";
        item.positionCode = "-";
        item.positionName = "-";
      }
      if (item.prlPlan !== "-" && data.positionList && Array.isArray(data.positionList)) {
        // Function to expand PRL range (e.g., "12-13" becomes "12,13", "16-18" becomes "16,17,18")
        const expandPrlRange = (prlOrg) => {
          if (prlOrg.includes("-")) {
            const [start, end] = prlOrg.split("-").map((num) => parseInt(num));
            const expanded = [];
            for (let i = start; i <= end; i++) {
              expanded.push(i.toString());
            }
            return expanded.join(",");
          }
          return prlOrg;
        };

        const prlOrgCustom = positionList
          .map((pos) => expandPrlRange(pos.prlOrg))
          .filter((prl) => prl.includes(String(item.prlPlan)));
        const findPosition = positionList.find((pos) => expandPrlRange(pos.prlOrg).includes(String(item.prlPlan)));
        console.log("findPosition:", findPosition);
        console.log("prlOrgCustom:", prlOrgCustom);
        if (findPosition) {
          item.positionName = findPosition.positionName;
          item.positionCode = findPosition.positionCode;
        }
      }
      $basketBody.append(`<tr>
      <td>${i + 1}</td>
      <td>${item.personCode}</td>
      <td>${item.personName}</td>
      <td>${item.prlPlan}</td>
      <td>${item.positionCode}</td>
      <td>${item.positionName}</td>
      </tr>`);
    });

    // Render position list table
    const $positionBody = $("#tablePositionListBody").empty();
    let globalCount = 0;
    (sortedPositionList || []).forEach((group, i) => {
      group.dataPosition.forEach((item, j) => {
        globalCount++;
        console.log("globalCount:", globalCount);
        if (j == 0) {
          $positionBody.append(`<tr>
            <td>${globalCount}</td>
            <td>${item.positionName}</td>
            <td>${item.careerLevel}</td>
            <td>${item.prlOrg}</td>
            <td rowspan="${group.totalRow}">${item.formation}</td>
            </tr>`);
        } else {
          $positionBody.append(`<tr>
        <td>${globalCount}</td>
        <td>${item.positionName}</td>
        <td>${item.careerLevel}</td>
        <td>${item.prlOrg}</td>
        </tr>`);
        }
      });
    });
  } else {
    // alert("masuk non basket");
    $("#nonBasketIncumbent").show();
    $(".no-basket").show();
    $("#positionListCard, #basketIncumbent").hide();

    if (data?.incumbents?.length > 1) {
      $("#nonBasketIncumbent").hide();

      $("#basketIncumbent").show();
      data.incumbents = data.incumbents.filter(
        (item, index, self) => index === self.findIndex((t) => t.personCode === item.personCode)
      );
      data.incumbents = data.incumbents.sort((a, b) => a.personCode.localeCompare(b.personCode));
      const $basketBody = $("#tableBasketIncumbent tbody").empty();
      (data?.incumbents || []).forEach((item, i) => {
        if (item?.personCode == 0) {
          item.personCode = "-";
          item.personName = "Vacant";
          item.prlPlan = "-";
          item.positionCode = "-";
          item.positionName = "-";
        }
        $basketBody.append(`<tr>
      <td>${i + 1}</td>
      <td>${item.personCode}</td>
      <td>${item.personName}</td>
      <td>${item.prlPlan}</td>
      <td>${item.positionCode}</td>
      <td>${item.positionName}</td>
      </tr>`);
      });
    } else {
      $("#incumbentId").text(data?.incumbents?.[0]?.personCode ?? "-");
      $("#incumbentName").text(data?.incumbents?.[0]?.personName ?? "Vacant");
      $("#prlPlanComp").text(data?.incumbents?.[0]?.prlPlan ?? "Vacant");
      $("#modalCareerLevel").text(data?.positionList?.[0]?.careerLevel ?? "-");
    }
  }

  if (!data?.incumbents?.length) {
    $("#incumbentId").text("-");
    $("#incumbentName").text("Vacant");
    $("#prlPlanComp").text("-");
    $("#incumbentCard").show();
  }

  if (organizationAttribute.isMasterData) {
    $("#incumbentCard").show();
  } else {
    $("#incumbentCard").hide();
  }
}

function modalConfrimHelper(type, titleModal, message, note, action, modalSize, paramsId) {
  $("#modalConfirmTitle").html("");
  $("#modalConfirmBody").html("");
  $("#modalConfirmFooter").html("");

  let icon =
    type == "delete"
      ? '<i class="fas fa-exclamation-triangle text-danger"></i>'
      : type == "success"
      ? '<i class="fas fa-check-circle text-success"></i>'
      : '<i class="fas fa-exclamation-circle text-warning"></i>';
  let title = `<span class="p-l-10">` + titleModal + `</span>`;
  $("#modalConfirmTitle").html(icon + title);
  $("#modalConfirmBody").html(
    `<div class="f-14" role="alert">` +
      message +
      `
    </div>`
  );

  if (note) {
    $("#modalConfirmBody").append(
      `<div class="alert alert-danger-custom m-t-10" role="alert">
        <strong>Note:</strong> ` +
        note +
        `
      </div>`
    );
  }

  if (action) {
    action.forEach((item) => {
      if (item.callback) {
        $("#modalConfirmFooter").append(
          `<button type="button" class="btn ` +
            item.className +
            ` m-r-5" onclick="(` +
            item.callback +
            `)()">` +
            item.button +
            `</button>`
        );
        return;
      }
      $("#modalConfirmFooter").append(
        `<button type="button" class="btn ` +
          item.className +
          ` m-r-5" onclick="(async () => { await ${item.callbackFunction}(\`${paramsId}\`); })()">` +
          item.button +
          `</button>`
      );
    });
  }

  if (modalSize) {
    $("#modalConfirm").find(".modal-confirm").css("width", modalSize).css("max-width", modalSize);
  } else {
    $("#modalConfirm").find(".modal-confirm").css("width", "50%").css("max-width", "50%");
  }

  $("#modalConfirm").modal("show");
}

function hideModal(id) {
  $("#" + id).modal("hide");
}

function checkButtonTable(buttonTable, id, lastPath) {
  const user = localStorage.getItem("user") === "admin" ? "admin" : "admin";
  const status = "2";
  // swith case by parameter buttonTable and lastPath
  switch (buttonTable) {
    case "deleteMoveVariousTable":
      return `<span class="f-14">${id}</span>
          <br/>
          <div class="col m-t-5 m-b-5">
            <div class="col-sm-12">
              <span class="text-muted f-12">Org Unit</span> 
              <select class="form-control" id="selectOrgUnitDelete" name="selectOrgUnitDelete">
                <option value="0">Select Org Unit</option>
                <option value="1">Org Unit 1</option>
              </select>
            </div>
            <div class="col-sm-12 m-t-10">
              <span class="text-muted f-12">Direct Report</span> 
              <select class="form-control" id="selectDirectReportDelete" name="selectDirectReportDelete">
                <option value="0">Select Position</option>
                <option value="1">Manager Strategic Planning</option>
              </select>
            </div>
          </div>`;
    case "positionList":
      if (lastPath === "draft-detail") {
        const editPositionDraft = `<button class="btn-custom-outline-primary" onclick="editPositionDraft('${id}')"> <i class="icon-pencil f-16"></i></button>`;
        const detailPositionDraft = `<button class="btn-custom-outline-dark" onclick="detailPositionDraft('${id}')"> <i class="icon-eye f-16"></i></button>`;
        const deletePositionDraft = `<button class="btn-custom-outline-danger" onclick="deletePositionDraft('${id}')"><i class="icon-trash f-16"></i></button>`;
        return `${editPositionDraft} ${detailPositionDraft} ${deletePositionDraft}`;
      } else {
        const detail = `<button class="btn-custom-outline-dark" onclick="detailapproval('${id}')"> <i class="icon-eye f-16"></i></button>`;
        return `${detail}`;
      }
    case "draftList":
      const detailDraft = `<button class="btn-custom-outline-dark" onclick="detailDraft('${id}')"> <i class="icon-eye f-16"></i></button>`;
      const deleteDraft = `<button class="btn-custom-outline-danger" onclick="deleteDraft('${id}')"><i class="icon-trash f-16"></i></button>`;
      return `${detailDraft} ${deleteDraft}`;
    case "approvalList":
      const detail = `<button class="btn-custom-outline-dark" onclick="detailapproval('${id}')"> <i class="icon-eye f-16"></i></button>`;
      const approve = `<button class="btn-custom-outline-primary" onclick="acceptApproval('${id}')"> <i class="icon-check f-16"></i></button>`;
      const reject = `<button class="btn-custom-outline-danger" onclick="rejectApproval('${id}')"> <i class="icon-close f-16"></i></button>`;
      if (status === "1" || status === "4") {
        return `${detail} ${user === "admin" ? `${approve} ${reject}` : ""}`;
      } else if (status === "2" || status === "3" || status === "5") {
        return detail;
      } else {
        return `${detail} ${user === "admin" ? `${approve} ${reject}` : ""}`;
      }
    default:
      return ``;
  }
}

function uploadFinalizeHandler() {
  const dropZone = document.getElementById("drop-zone");
  const fileName = document.getElementById("finalize-file-name");
  const afterFinalize = document.getElementById("after-finalize");
  const fileInput = document.getElementById("file-input");
  const fileSize = document.getElementById("finalize-file-size");

  // Trigger file input on click
  dropZone.addEventListener("click", () => {
    fileInput.click();
  });

  // Handle file selection from the file input
  fileInput.addEventListener("change", (e) => {
    const files = e.target.files;
    handleFiles(files);
  });

  // Add drag-over class when hovering
  dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.add("dragover");
  });

  // Remove drag-over class when leaving
  dropZone.addEventListener("dragleave", (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.remove("dragover");
  });

  // Handle file drop
  dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.remove("dragover");
    fileInput.files = e.dataTransfer.files;
    const files = e.dataTransfer.files;
    handleFiles(files);
  });

  function handleFiles(files) {
    const file = files[0];
    const listItem = document.createElement("li");
    listItem.textContent = `${file.name} (${(file.size / 1024).toFixed(2)} KB)`;
    dropZone.style.display = "none";
    afterFinalize.style.display = "block";
    fileName.textContent = files[0].name;
    fileSize.textContent = (files[0].size / 1024).toFixed(2) + " KB";
  }
}

$("#removeFinalizedFile").on("click", function () {
  removeFinalizedFile();
});

function removeFinalizedFile() {
  const dropZone = document.getElementById("drop-zone");
  const afterFinalize = document.getElementById("after-finalize");
  const fileInput = document.getElementById("file-input");
  fileInput.value = "";
  dropZone.style.display = "flex";
  afterFinalize.style.display = "none";
}

// helper datePicker
function helperDatePicker() {
  $('input[name="datePicker"]').daterangepicker(
    {
      singleDatePicker: true,
      showDropdowns: true,
      // value null
      autoUpdateInput: false,
      locale: {
        cancelLabel: "Clear",
      },
    },
    function (start, end, label) {
      $(this).val(start.format("YYYY-MM-DD"));
    }
  );

  $('input[name="datePicker"]').on("apply.daterangepicker", function (ev, picker) {
    $(this).val(picker.startDate.format("YYYY-MM-DD"));
  });
}

// ======================
// helper orgTree
// ======================
function createHierarchy(data, parentId = null) {
  console.log("createHierarchy called data:", data);
  return data
    .filter((item) => item.pid === parentId)
    .map((item) => ({
      id: item.id,
      text: item.basket ? item.org_unit_name : item.position,
      icon: "icofont icofont-plus font-theme",
      a_attr: item.a_attr ? null : { class: "no-children" }, // add class if no children
      children: createHierarchy(data, item.id) ?? null,
    }));
}

async function helperOrgTree(params) {
  $("#orgThreeDiv").jstree("destroy");
  $("#orgThreeDiv").jstree({
    core: {
      data: createHierarchy(params, "10132405"),
    },
    plugins: ["ui", "types"],
    ui: {
      select_limit: 1,
    },
    types: {
      default: {
        icon: false,
      },
    },
    themes: {
      dots: false,
      icons: false,
    },
  });

  $("#orgThreeDiv").on("select_node.jstree", function (e, data) {
    data.node.children.forEach((item) => {
      const node = $("#orgThreeDiv").jstree(true).get_node(item);
      if (node.children.length === 0) {
        $("#orgThreeDiv").jstree(true).set_icon(node, "");
      }
    });
  });

  $("#orgThreeDiv").on("click", ".jstree-anchor", function (e) {
    if (e.detail === 2) {
      const node = $("#orgThreeDiv").jstree(true).get_node($(this).closest(".jstree-node").attr("id"));
      let newIcon;
      if (node.icon === true) {
        newIcon = true;
        $("#orgThreeDiv").jstree(true).set_icon(node, newIcon);
        return;
      }
      newIcon =
        node.icon === "icofont icofont-plus font-theme"
          ? "icofont icofont-minus font-theme"
          : "icofont icofont-plus font-theme";
      $("#orgThreeDiv").jstree(true).set_icon(node, newIcon);
    }
  });

  // right click
  $("#orgThreeDiv")
    .off("contextmenu", ".jstree-node")
    .on("contextmenu", ".jstree-node", function (e) {
      e.preventDefault();
      e.stopPropagation(); // Prevent bubbling to parent nodes
      const nodeId = $(this).attr("id");
      // Only trigger for the exact node right-clicked, not its parents
      if (e.target.closest(".jstree-node") && e.target.closest(".jstree-node").id === nodeId) {
        const node = $("#orgThreeDiv").jstree(true).get_node(nodeId);
        console.log("node", node);
        focusNode(node.id);
        $("#modalOrgTree").modal("hide");
      }
    });
}

// ======================
// helper bagan org
// ======================
async function focusNode(nodeId) {
  // Show loading with proper container detection
  showChartLoading("chart-container-custom");

  try {
    const dataChart = await chartShow({
      draftId: organizationAttribute.orgUnitId,
      jobCode: nodeId,
      depth: 5,
    });

    // Update chart data (assuming this function handles chart rendering)
    renderOrgChart(dataChart.data, nodeId, true);

    // Wait for chart to complete rendering before hiding loading
    setTimeout(() => {
      if (typeof hideChartLoading === "function") {
        hideChartLoading("chart-container-custom");
      }
      console.log("Chart focus completed successfully");
    }, 1500); // Wait 1.5 seconds for chart to fully render
  } catch (error) {
    console.error("Error in focusNode:", error);

    // Hide loading on error
    if (typeof hideChartLoading === "function") {
      hideChartLoading("chart-container-custom");
    }

    // Show error message
    const container = document.querySelector(".chart-container-custom") || document.getElementById("osContainer");
    if (container) {
      container.innerHTML =
        '<div style="text-align: center; padding: 20px; color: #999;">Chart loading failed. Please try again.</div>';
    }
  }
}

// get data design cost by function, division, or level
async function changeDataDesignCostFilter(value) {
  const tableBody = $("#tableDesignCostBody").empty();
  const tableFooter = $("#tableDesignCostFooter").empty();
  const data = {
    addHtml: "",
    totalFormationProposed: 0,
    totalCostYearProposed: 0,
    totalFormationExisting: 0,
    totalCostYearExisting: 0,
    totalFormationAdjustment: 0,
    totalCostYearAdjustment: 0,
  };

  const result = await (value === "function"
    ? designCostByFunction
    : value === "division"
    ? designCostByDivision
    : designCostByLevel)({
    draftId: organizationAttribute.orgUnitId,
    page: 1,
    pageSize: 10,
  });

  result.data.forEach((item, idx) => {
    data.addHtml += `<tr>
      <td>${idx + 1}</td>
      <td>${item.functionName || item.divisionName || item.layerName}</td>
      <td>${item.formationProposed}</td>
      <td>${item.costYearProposed.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}</td>
      <td>${item.formationExisting}</td>
      <td>${item.costYearExisting.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}</td>
      <td>${item.formationAdjustment}</td>
      <td>${item.costYearAdjustment.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}</td>
    </tr>`;
    data.totalFormationProposed += item.formationProposed;
    data.totalCostYearProposed += item.costYearProposed;
    data.totalFormationExisting += item.formationExisting;
    data.totalCostYearExisting += item.costYearExisting;
    data.totalFormationAdjustment += item.formationAdjustment;
    data.totalCostYearAdjustment += item.costYearAdjustment;
  });

  tableBody.append(data.addHtml);
  tableFooter.append(`<tr>
    <td colspan="2">Total</td>
    <td>${data.totalFormationProposed}</td>
    <td>${data.totalCostYearProposed.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}</td>
    <td>${data.totalFormationExisting}</td>
    <td>${data.totalCostYearExisting.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}</td>
    <td>${data.totalFormationAdjustment}</td>
    <td>${data.totalCostYearAdjustment.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}</td>
  </tr>`);
}

// Organization Chart Loading Functions
function showChartLoading(containerClass) {
  let container = document.querySelector(`.${containerClass}`);
  container.innerHTML = CHART_LOADING_HTML;

  // Ensure container has proper positioning for loading overlay
  const containerStyle = window.getComputedStyle(container);
  if (containerStyle.position === "static") {
    container.style.position = "relative";
  }

  // Ensure container has minimum dimensions for chart (1200x800)
  if (containerStyle.width === "0px" || containerStyle.height === "0px") {
    container.style.minWidth = "1200px";
    container.style.minHeight = "800px";
  }
}
function hideChartLoading(containerClass) {
  let container = document.querySelector(`.${containerClass}`);
  // Remove loading overlay and styles
  const loadingOverlay = container.querySelector("#chart-loading-overlay");
  const loadingStyle = container.querySelector("style");

  if (loadingOverlay) {
    loadingOverlay.remove();
  }
  if (loadingStyle) {
    loadingStyle.remove();
  }
}
