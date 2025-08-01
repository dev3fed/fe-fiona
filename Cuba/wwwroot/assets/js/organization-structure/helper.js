function loader(status) {
  status == true ? $("#loader").show() : $("#loader").hide();
}

async function checkUniqueCode(typeId, identifier) {
  uuid.uniqueCode = localStorage.getItem("uniqueCode");
  uuid.uniquePosCode = localStorage.getItem("uniquePosCode");
  const draftId = urlParams.get("draftId");
  const duplicate = urlParams.get("duplicate");
  const editUrl = urlParams.get("edit");
  const positionId = urlParams.get("positionId");
  if (editUrl) {
    $("#selectDraftType").append(new Option("Edit Job", "1", true, true));
  }
  codeId = uuid.uniqueCode;
  if (draftId) {
    codeId = draftId;
  }
  if (positionId) {
    const res = await detailJobPositionByCode(positionId);
    const data = res.data;
    duplicateJob(data);
  }

  $("#duplicateDiv").hide();
  $("#contentDiv").show();
  if (duplicate) {
    $("#duplicateDiv").show();
    // $("#selectJobReference").attr("disabled", false);
    // $("#contentDiv").hide();
    updateJobReference();
  }
  // if (uuid.uniqueCode != null && uuid.uniquePosCode != null) {
  if (uuid.uniqueCode != null) {
    try {
      const res = await detailDraftOrganizationStructure(codeId);
      if (res.status == 404) {
        dataAvailable = false;
        return;
      }
      if (draftId) {
        uuid.uniqueCode = res.data.draft?.uniqueCode;
        localStorage.setItem("uniqueCode", uuid.uniqueCode);
      }
      const dataObject = res.data;
      updatedAll(dataObject);

      detailChartPreview("os-preview-container", dataObject?.draftDetail?.directReport, res.data);

      const resSubordinate = await listDraftJobSubordinate(uuid.uniqueCode);
      const dataSubordinate = resSubordinate.data;

      const resSubPosition = await listDraftJobSubPosition(uuid.uniqueCode);
      const dataSubPosition = resSubPosition.data;

      // console.log("kesini lagi ga ya");
      updateDivSubPosition(dataSubPosition, dataObject);
      updateDivSubordinate(dataSubordinate, dataObject);
    } catch (error) {
      $("#resultJabatan").html("Error fetching data from API");
      throw error;
    }
  }

  if (uuid.uniqueCode == null) {
    dataAvailable = false;
    localStorage.setItem("uniqueCode", uuidv4());
    localStorage.setItem("uniquePosCode", uuidv4());
    uuid.uniqueCode = localStorage.getItem("uniqueCode");
    uuid.uniquePosCode = localStorage.getItem("uniquePosCode");
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
      const firstDraft = draftList[0];
      organizationAttribute.orgUnitId = firstDraft.draftId;
      organizationAttribute.orgUnitName = firstDraft.draftName;
      localStorage.setItem("organizationAttribute", JSON.stringify(organizationAttribute));
    }
  }
  // append value to input
  // $("#selectDraftOrganization").val(organizationAttribute.orgUnitId).trigger("change");

  // disabled selectDraftOrganization
  $("#selectDraftOrganization").prop("disabled", true);
}

function checkDataOrganizationLocalStorage() {
  const data = JSON.parse(localStorage.getItem("organizationAttribute"));
  if (data) {
    Object.keys(organizationAttribute).forEach((key) => {
      if (data[key]) {
        organizationAttribute[key] = data[key];
      }
    });
  }
}

function setOrganizationAttribute() {
  organizationAttribute.orgUnitId = null;
  organizationAttribute.orgUnitName = "";
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
  const data = getDetailPosition.data;

  // clear all input
  clearAllInput();

  $("#inputPositionName").val(data?.positionName);
  $("#selectPrlOrg").val(data?.prlOrgFrom).trigger("change");
  $("#selectPrlOrgTo").val(data?.prlOrgTo).trigger("change");
  $("#selectFunction").val(data?.functionCode).trigger("change");
  $("#inputOrgUnitName").val(data?.unitName);
  $("#inputFormation").val(data?.formation);
  if (data?.directReportCode) {
    $("#selectDirectReport").append(new Option(data?.directReportName, data?.directReportCode, true, true));
  }
  if (data?.parentCode) {
    $("#selectOrgUnitParentName").append(new Option(data?.parentName, data?.parentCode, true, true));
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
  if (data?.personalAreaCode) {
    $("#selectPersonalAreaName").append(new Option(data?.personalAreaName, data?.personalAreaCode, true, true));
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
  if (basket.length > 0) {
    data.basket.forEach((item, index) => {
      const params = { ...subOrdinates };
      params.subPosId = index + 1;
      params.unitCode = item.unitCode;
      params.unitName = item.unitName;
      params.unitParentCode = data?.parentCode;
      params.unitParentName = data?.parentName;
      params.jobPositionName = item.jobPositionName || "";
      params.layer = item.layer;
      params.prlFrom = item.prlOrgFrom;
      params.prlTo = item.prlOrgTo;
      params.formation = item.formation;
      params.prlPlan = 4;
      params.careerLevel = {
        careerLevelCode: "",
        careerLevelName: "",
      };
      params.careerType = {
        careerTypeCode: "",
        careerTypeName: data?.careerTypeName,
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

async function checkUniqueCodeSubordinate() {
  const id = urlParams.get("id");
  const edit = urlParams.get("edit");
  if (edit) {
    statusAction = "edit";
  }

  uuid.uniqueCode = localStorage.getItem("uniqueCode");
  uuid.uniquePosCode = localStorage.getItem("uniquePosCode");
  uuid.directReport = localStorage.getItem("directReport");

  if (uuid.uniqueCode != null && uuid.uniquePosCode != null) {
    try {
      dataAvailable = false;
      const res = await detailDraftOrganizationStructure(uuid.uniqueCode);
      const dataObject = res.data;
      if (id) {
        const findDataSubordinate = res.data.listJobSubordinate.find((item) => item.id == id);
        // console.log(findDataSubordinate);
        uuid.uniqueCode = findDataSubordinate.uniqueCode;
        uuid.uniquePosCode = findDataSubordinate.uniquePosCode;
        localStorage.setItem("uniqueCode", uuid.uniqueCode);
        localStorage.setItem("uniquePosCode", uuid.uniquePosCode);
        updatedAllSubordinate(findDataSubordinate);
      }
      $("#selectDirectReport").append(new Option(uuid.directReport, uuid.directReport, true, true)).trigger("change");

      const resSubPosition = await listDraftJobSubPosition(uuid.uniquePosCode);
      const dataSubPosition = resSubPosition.data;
      dataStorage = dataObject;
      console.log("dataStorage", dataStorage);
      if (dataSubPosition?.length > 0) {
        dataAvailable = true;
      }

      updateDivSubPositionSubordinate(dataSubPosition, dataObject);
    } catch (error) {
      $("#resultJabatan").html("Error fetching data from API");
      throw error;
    }
  }

  if ($("#selectDraftType").val() == 0 && uuid.uniqueCode == null && uuid.uniquePosCode == null) {
    localStorage.setItem("uniqueCode", uuidv4());
    localStorage.setItem("uniquePosCode", uuidv4());
    uuid.uniqueCode = localStorage.getItem("uniqueCode");
    uuid.uniquePosCode = localStorage.getItem("uniquePosCode");
  }
}

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function defaultState() {
  $("#subPositionDiv").hide();
  $("#inputFormation").val("1");
  // dataSubPosition hide
  $("#dataSubPosition").hide();
  $("#joinFormationDiv").hide();

  $("[id^=select]").attr("disabled", true);
  $("[id^=input]").attr("disabled", true);

  // inputdraftname dan career type tidak bisa di disable
  $("#inputDraftName").attr("disabled", false);
  $("#selectCareerType").attr("disabled", false);
  $("#selectJobReference").attr("disabled", false);
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

async function saveInputAttribut(type) {
  const unitCode = urlParams.get("unitCode");
  const payload = formPositionParam;
  payload.draftId = organizationAttribute.orgUnitId;
  payload.userId = "system";
  payload.unit.unitCode = type == "edit" ? unitCode : null;
  payload.unit.unitName = $("#inputPositionName").val();
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
  payload.personnelSubArea.personnelSubAreaCode = payload.personnelSubArea.personnelSubAreaCode
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
  payload.unitParent.unitName = $("#selectOrgUnitParentName option:selected").text() || "Operational Risk Papua-Maluku";
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

  console.log("payload", payload);
  // return;

  const result = type === "edit" ? await draftJobUpdateAsDraft(payload) : await draftJobSaveAsDraft(payload);
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
  payload.abbrvPositon = $("#selectAbbrvPosition").val()
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
      dataId: "modalSelectPrlOrgSubPos",
      data: prl.map((item) => ({ id: item, text: item })),
      dropdownParent: $("#modalAddSubPosition"),
    },
    {
      dataId: "modalSelectPrlOrgToSubPos",
      data: prl.map((item) => ({ id: item, text: item })),
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

function refreshDataSubordinate() {
  checkUniqueCodeSubordinate();
  // defaultState();
  // getAllMutiselect();
  // defaultTab();
  // getTablePositionList refresh data
}

async function editSubPosition(id) {
  // addSubPos("edit", id);
  await modalSubPosition(true);
  // get local storage subJobPos
  const subJobPos = JSON.parse(localStorage.getItem("subJobPos"));
  const data = subJobPos.find((item) => item.subPosId == id);
  console.log("id", id);
  console.log(data);
  console.log(data.jobPositionName);
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
  $("#modalSelectPrlOrgSubPos").val(data.prlFrom).trigger("change");
  $("#modalSelectPrlOrgToSubPos").val(data.prlTo).trigger("change");
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
  const positionId = $("#positionId").val();
  duplicateJob(draftId, positionId);
}

// async function handleExport(params) {
//   // alert("Export");
// }

function saveOrgDetailBulk(draftId, dataObject) {
  dataObject.forEach((payload) => {
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
    // if (payload.isBasket == "Yes") {
    if (payload.listSubPosition.length > 0) {
      const bracket = `bracket_${payload.listSubPosition.length}`;
      orgPayload.tags.push(bracket);
    }
    payload.listSubPosition.forEach((item, idx) => {
      orgPayload[`bc_${idx + 1}_id_position`] = item.subPositionId;
      orgPayload[`bc_${idx + 1}_position`] = item.subPositionName;
      orgPayload[`bc_${idx + 1}_id_position_atasan_langsung`] = payload.directReportId;
      orgPayload[`bc_${idx + 1}_layering`] = "L3";
      orgPayload[`bc_${idx + 1}_gl`] = "GL1";
      orgPayload[`bc_${idx + 1}_prl`] =
        item.prlOrg == item.prlOrgTo ? item.prlOrg : `${item.prlOrg} - ${item.prlOrgTo}`;
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
    if (checkData) {
      const index = lsListDraftOrgNode.findIndex(
        (item) => item.id_position == payload.positionId && item.draft_id == payload.draftId
      );
      lsListDraftOrgNode[index] = orgPayload;
    } else {
      lsListDraftOrgNode.push(orgPayload);
    }
    console.log("orgPayload", orgPayload);
  });
  console.log("lsListDraftOrgNode", lsListDraftOrgNode);

  localStorage.setItem("listDraftOrgNode", JSON.stringify(lsListDraftOrgNode));
}

function getallChildrenOrg(parentNode) {
  let children = lsListOrgNode.filter((item) => parseInt(item.pid) === parseInt(parentNode.id));
  children.forEach((child) => {
    children = children.concat(getallChildrenNode(child));
  });
  return children;
}

function getallChildrenPosition(parentNode) {
  let children = lsListPosition.filter((item) => parseInt(item.directReportId) == parseInt(parentNode));
  children.forEach((child) => {
    children = children.concat(getallChildrenPosition(child.positionId));
  });
  return children;
}

function correctedDirectReport(parentNode) {
  let parent = lsListPosition.find((item) => item.positionId == parentNode);
  const positionIdCopy = parent.positionIdCopy;
  let children = lsListPosition.filter((item) => parseInt(item.directReportId) == parseInt(parentNode));
  children.forEach((child) => {
    child.directReportIdCopy = positionIdCopy;
    children = children.concat(correctedDirectReport(child.positionId));
  });
  return children;
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
  // $("#jobName").text(data?.positionName ? data?.positionName : data?.orgUnitName ?? "");
  // $("#positionId").val(data.unitCode);
  // $("#modalDirectorate").text("Pertamina Patra Niaga");
  // $("#modalDivision").text(checkValue(data?.divisionName));
  // $("#modalSubDivision").text(checkValue(data?.subDivisionName));
  // $("#modalDepartment").text(checkValue(data?.departmentName));
  // $("#modalSection").text(checkValue(data?.sectionName));
  // $("#modalPersonnelAreaName").text(checkValue(data?.personnelAreaName));
  // $("#modalPersonnelAreaSubname").text(checkValue(data?.personnelSubAreaName));
  // $("#modalCareerType").text(checkValue(data?.careerTypeName));
  // $("#modalCareerLevel").text(checkValue(data?.careerLevelName));
  // $("#modalAbbrvPosition").text(checkValue(data?.abbrvPosition));
  // $("#modalOrgUnitName").text(checkValue(data?.unitName));
  // $("#modalPositionName").text(checkValue(data?.positionName));
  // $("#modalOrgPRL").text(checkValue(data?.prlOrg));
  // $("#modalFormation").text(checkValue(data?.formation));
  // $("#modalDirectReport").text(checkValue(data?.parentName));
  // $("#modalNeckFunction").text(checkValue(data?.neckFunction));
  // $("#modalIsProject").text(checkValue(data?.isProject));
  // $("#modalIsCoordination").text(checkValue(data?.isCoordination));
  // $("#modalCoordinationWith").text(checkValue(data?.coordinationWith));
  // $("#modalFunction").text(checkValue(data?.functionName));
  // $("#modalSKNumber").text(checkValue(data?.skNumber));

  // $("#modalMainSkillGroup").text(data?.skillGroups?.[0]?.skillGroupName ?? "");
  // $("#modalMainSubSkillGroup").text(data?.skillGroups?.[0]?.subSkillGroupCode ?? "");
  // $("#modalSecondSkillGroup").text(data?.skillGroups?.[1]?.skillGroupName ?? "");
  // $("#modalSecondSubSkillGroup").text(data?.skillGroups?.[1]?.subSkillGroupCode ?? "");
  // $("#modalThirdSkillGroup").text(data?.skillGroups?.[2]?.skillGroupName ?? "");
  // $("#modalThirdSubSkillGroup").text(data?.skillGroups?.[2]?.subSkillGroupCode ?? "");

  // $("#incumbentId").text(data?.incumbents[0]?.personCode ?? "");
  // $("#incumbentName").text(data?.incumbents[0]?.personName ?? "");
  // $("#prlPlanComp").text(data?.incumbents[0]?.prlPlan ?? "");

  // $("#modalDetailJob").modal("show");

  console.log("data", data);
  $("#jobName").text(checkValue(data.positionName));
  $("#positionId").val(data.positionId);
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

  $("#modalPersonnelAreaSub").text(checkValue(data?.personnelSubareaCode));
  $("#modalPersonnelAreaSubname").text(checkValue(data?.personnelSubareaName));
  $("#modalSKNumber").text(checkValue(data?.sourceOfSK));

  $("#modalOrgPRL").text(checkValue(data?.prlOrg));
  $("#modalFormation").text(checkValue(data?.formation));

  $("#modalNeckFunction").text(data?.neckFunction ?? "");
  $("#modalIsProject").text(data?.isProject ?? "");
  $("#modalIsCoordination").text(data?.isCoordination ?? "");
  $("#modalCoordinationWith").text(data?.coordinationWith ?? "");

  $("#modalMainSkillGroup").text(data?.skillGroups?.[0]?.skillGroupName ?? "");
  $("#modalMainSubSkillGroup").text(data?.skillGroups?.[0]?.subSkillGroupName ?? "");
  $("#modalSecondSkillGroup").text(data?.skillGroups?.[1]?.skillGroupName ?? "");
  $("#modalSecondSubSkillGroup").text(data?.skillGroups?.[1]?.subSkillGroupName ?? "");
  $("#modalThirdSkillGroup").text(data?.skillGroups?.[2]?.skillGroupName ?? "");
  $("#modalThirdSubSkillGroup").text(data?.skillGroups?.[2]?.subSkillGroupName ?? "");

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
    data.positionList = data.positionList.sort((a, b) => a.positionName.localeCompare(b.positionName));

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

    // Render position list table
    const $positionBody = $("#tablePositionListBody").empty();
    (data?.positionList || []).forEach((item, i) => {
      $positionBody.append(`<tr>
      <td>${i + 1}</td>
      <td>${item.positionName}</td>
      <td>${item.careerLevel}</td>
      <td>${item.prlOrg}</td>
      <td>${item.formation}</td>
      </tr>`);
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

  // $("#incumbentCard").hide();
  // $("#incumbentCard").addClass("d-none");
  // if (organizationAttribute?.orgUnitId == "1") {
  //   $("#incumbentCard").show();
  //   $("#incumbentCard").removeClass("d-none");
  // }

  // let totalFormationSelf = 0;
  // if (data.isBasket == "Yes") {
  //   const tableBasketBody = $("#tableBasketIncumbent tbody");
  //   const tablePositionListBody = $("#tablePositionList tbody");
  //   tableBasketBody.html("");
  //   tablePositionListBody.html("");
  //   data.listSubPosition.forEach((item, index) => {
  //     const incumbent = item.incumbent && item.incumbent[0] ? item.incumbent[0] : null;

  //     const no = index + 1;
  //     const prlOrgSum = item.prlOrg == item.prlOrgTo ? item.prlOrg : `${item.prlOrg} - ${item.prlOrgTo}`;
  //     if (incumbent) {
  //       $("#tableBasketIncumbent tbody").append(
  //         `<tr>
  //               <td>` +
  //           no +
  //           `</td>
  //               <td>` +
  //           item.incumbent[0].employeeId +
  //           `</td>
  //               <td>` +
  //           item.incumbent[0].employeeName +
  //           `</td>
  //               <td>` +
  //           item.incumbent[0].prlPlanComp +
  //           `</td>
  //               <td>` +
  //           item.subPositionId +
  //           `</td>
  //               <td>` +
  //           item.subPositionName +
  //           `</td>
  //             </tr>`
  //       );
  //     }
  //     $("#tablePositionListBody").append(
  //       `<tr>
  //         <td>` +
  //         no +
  //         `</td>
  //         <td>` +
  //         item.subPositionName +
  //         `</td>
  //         <td>` +
  //         item.careerLevel +
  //         `</td>
  //         <td>` +
  //         prlOrgSum +
  //         `</td>
  //         <td>` +
  //         item.formation +
  //         `</td>

  //       </tr>`
  //     );
  //   });
  // }

  // if (data.isBasket == "Yes") {
  //   $("#positionListCard").show();
  //   $("#nonBasketIncumbent").hide();
  //   $("#basketIncumbent").show();

  //   if (dataOrg.tags.some((tag) => tag.startsWith("bracket_"))) {
  //     // console.log("bracket_");
  //     const bracket = dataOrg.tags.find((tag) => tag.startsWith("bracket_"));
  //     const bracketValue = bracket.split("_")[1];
  //     totalFormationSelf += parseInt(bracketValue);
  //   } else {
  //     // console.log("no bracket_");
  //     totalFormationSelf += findChildrenOrg.jumlah_formasi;
  //   }
  //   $("#modalFormation").text(totalFormationSelf ?? "");
  // } else {
  //   $("#positionListCard").hide();
  //   $("#nonBasketIncumbent").show();
  //   $("#basketIncumbent").hide();
  // }
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
  return data
    .filter((item) => item.pid === parentId)
    .map((item) => ({
      id: item.id,
      text: item.position,
      icon: "icofont icofont-plus font-theme",
      a_attr: item.a_attr ? null : { class: "no-children" }, // add class if no children
      children: createHierarchy(data, item.id) ?? null,
    }));
}

async function helperOrgTree(params) {
  // const olah = createHierarchy(test2, "10132405");
  // console.log("olah", olah);
  // return;
  // console.log("olah", olah);
  // refresh jsTree
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
  // Show loading
  showChartLoading("osContainer");

  try {
    const dataChart = await chartShow({
      draftId: organizationAttribute.orgUnitId,
      jobCode: nodeId,
      depth: 5,
    });

    // change chartid id from id_org_unit
    if (!dataChart.data) {
      dataChart.data = [];
    }
    dataChart.data.forEach((item) => {
      item.id = item.id_org_unit;
    });

    setTimeout(async () => {
      try {
        await helperOrgChart(true, "osContainer", dataChart.data, true, { expand: true, nodeId: nodeId });
        console.log("Chart focus completed successfully");
      } catch (error) {
        console.error("Error rendering chart:", error);
        const container = document.getElementById("osContainer");
        if (container) {
          container.innerHTML =
            '<div style="text-align: center; padding: 20px; color: #999;">Chart loading failed</div>';
        }
      } finally {
        hideChartLoading("osContainer");
      }
    }, 500);
  } catch (error) {
    console.error("Error in focusNode:", error);
    const container = document.getElementById("osContainer");
    if (container) {
      container.innerHTML = '<div style="text-align: center; padding: 20px; color: #999;">Chart loading failed</div>';
    }
    hideChartLoading("osContainer");
  }
}

function getallChildrenNode(parentNode) {
  let children = lsListOrgNode.filter((item) => item.pid === parentNode.id);
  children.forEach((child) => {
    children = children.concat(getallChildrenNode(child));
  });
  return children;
}

function helperOrgChartTester(init, id, data, isFocusNode, object) {
  OrgChart.templates.myTemplate = Object.assign({}, OrgChart.templates.ana);
  OrgChart.templates.myTemplate.size = [200, 200];
  OrgChart.templates.myTemplate.node = `
    <circle cx="100" cy="100" r="100" fill="#4D4D4D" stroke-width="1" stroke="#aeaeae"></circle>
    <text style="font-size: 24px;" fill="#ffffff" x="100" y="90" text-anchor="middle">{val}</text>
    <text style="font-size: 16px;" fill="#ffffff" x="100" y="60" text-anchor="middle">{val}</text>
    <circle cx="150" cy="50" r="20" fill="#ffffff" stroke="#aeaeae" stroke-width="1"></circle>
    <text style="font-size: 24px;" fill="#4D4D4D" x="150" y="55" text-anchor="middle">+</text>
`;

  var chart = new OrgChart("#osContainer", {
    template: "myTemplate",
    nodes: [
      { id: 1, name: "Parent Node" },
      // { id: 2, pid: 1, name: "Child Node" },
    ],
  });

  // click event on plus
  chart.on("plus", function (sender, node) {
    console.log("plus", node);
  });
}

function helperOrgChart(init, id, data, isFocusNode, object) {
  if (!init) {
    return false;
  }
  const param = {};
  if (isFocusNode) {
    param.collapsed = {
      level: 2,
      allChildren: true,
    };
  }

  const default_t = Object.assign({}, OrgChart.templates.base);
  default_t.size = [220, 70];
  default_t.ripple = null;
  default_t.img_0 = null;
  default_t.node = `<rect x="0" y="0" height="{h}" width="{w}" fill="#ffffff" stroke-width="1" stroke="#000"></rect>`;
  default_t.position = `<g><text data-width="140" style="font-size:12px;" text-anchor="middle" dominant-baseline="middle" fill="#353238" x="80" y="25" data-text-overflow="multiline">{val}</text></g>`;
  default_t.prl = `<g><rect x="180" y="0" height="35" width="40" fill="#ffffff" stroke-width="1" stroke="#000"></rect><text style="font-size:12px;text-anchor: middle;" fill="#353238" x="200" y="22.5">{val}</text></g>`;
  default_t.jumlah_formasi = `<g><rect x="180" y="35" height="35" width="40" fill="#ffffff" stroke-width="1" stroke="#000"></rect><text style="font-size:12px; text-anchor: middle;" fill="#353238" x="200" y="57.5">{val}</text></g>`;

  default_t.expandCollapseSize = 10;
  default_t.link = `<path stroke-linejoin="round" stroke-width="1" fill="none" d="{edge}" />`;
  default_t.plus = `<g><circle cx="5" cy="5" r="5" class="boc-fill" stroke="#000" stroke-width="1"></circle>
  <line x1="3" y1="5" x2="7" y2="5" stroke-width="1" stroke="#000"></line>
  <line x1="5" y1="3" x2="5" y2="7" stroke-width="1" stroke="#000"></line></g>`;
  default_t.minus = `<g><circle cx="5" cy="5" r="5" class="boc-fill" stroke="#000" stroke-width="1"></circle>
  <line x1="3" y1="5" x2="7" y2="5" stroke-width="1" stroke="#000"></line></g>`;
  // default_t.plus = ``;
  // default_t.minus = ``;
  // chaert separation
  OrgChart.templates.split = Object.assign({}, OrgChart.templates.base);
  // RESET_MOVABLE_ONEXPANDCOLLAPSE

  OrgChart.templates.split.size = [0, 0];
  OrgChart.templates.split.node = "";
  OrgChart.templates.default_t = default_t;
  OrgChart.templates.default_t.menuButton =
    '<div style="position:absolute;right:0px;top:20px; width:40px;height:50px;cursor:pointer;" data-ctrl-menu="">' +
    '<hr style="background-color: black; height: 3px;margin:0px; border: none;">' +
    '<hr style="background-color: black; height: 3px; border: none;">' +
    '<hr style="background-color: black; height: 3px; border: none;">' +
    "</div>";

  const baseNodeBinding = {
    position: "position",
    prl: "prl",
    jumlah_formasi: "jumlah_formasi",
    org_unit: "org_unit_name",
    level: "level",
  };

  function bracketTemplateGenerator(bracketSize) {
    const template = Object.assign({}, OrgChart.templates.default_t);
    template.size = [220, 0];
    for (let i = 0; i < bracketSize; i++) {
      template.size = [template.size[0], 120];
    }
    template.position = null;
    template.prl = null;
    template.jumlah_formasi = null;
    template.org_unit =
      `<g>` +
      '<rect x="0" y="0" height="40" width="220" fill="#ffffff" stroke-width="1" stroke="#000"></rect>' +
      `<text style="font-size:11px;text-anchor: middle;" fill="#353238" x="110" y="20">{val}</text>` +
      `</g>`;

    let height = 40;
    for (let i = 1; i <= bracketSize; i++) {
      const yPosition = 40 + (i - 1) * 40;
      const yTextPosition = 60 + (i - 1) * 40;
      height += 40;
      template.size = [template.size[0], height];
      template[`bc_${i}_position`] =
        `<g>` +
        `<rect x="0" y="${yPosition}" height="40" width="140" fill="#ffffff" stroke-width="1" stroke="#000"></rect>` +
        `<text data-width="120" style="font-size:10px;text-anchor: middle;" fill="#353238" x="70" y="${yTextPosition}" data-text-overflow="multiline">{val}</text>` +
        `</g>`;
      template[`bc_${i}_prl`] =
        `<g>` +
        `<rect x="140" y="${yPosition}" height="40" width="40" fill="#ffffff" stroke-width="1" stroke="#000"></rect>` +
        `<text style="font-size:11px;text-anchor: middle;" fill="#353238" x="160" y="${
          yTextPosition + 4
        }">{val}</text>` +
        `</g>`;
      template[`bc_${i}_level`] =
        `<g>` +
        // `<rect x="180" y="${yPosition}" id="{val}" height="40" width="40" fill="transparent" stroke-width="1" stroke="#000"></rect>` +
        `<rect x="180" y="${yPosition}" id="{val}" height="40" width="40" fill="#ffffff" stroke-width="1" stroke="#000"></rect>` +
        `</g>`;
      template[`bc_${i}_jumlah_formasi`] =
        `<g>` +
        `<rect x="180" y="${yPosition}" height="40" width="40" fill="#ffffff" stroke-width="1" stroke="#000"></rect>` +
        `<text style="font-size:11px;text-anchor: middle;" fill="#353238" x="200" y="${
          yTextPosition + 4
        }">{val}</text>` +
        `</g>`;
    }

    return template;
  }

  function bracketTemplateGeneratorJoinFormation(bracketSizeFormat) {
    const bracketSize = bracketSizeFormat.split("_")[0];
    const bracketSplitted = bracketSizeFormat.split("_").slice(1);
    // console.log({bracketSize})
    console.log({ bracketSplitted });
    const template = Object.assign({}, OrgChart.templates.default_t);
    template.size = [220, 0];
    for (let i = 0; i < bracketSize; i++) {
      template.size = [template.size[0], 120];
    }
    template.position = null;
    template.prl = null;
    template.jumlah_formasi = null;
    template.org_unit =
      `<g>` +
      '<rect x="0" y="0" height="40" width="220" fill="#ffffff" stroke-width="1" stroke="#000"></rect>' +
      `<text style="font-size:11px;text-anchor: middle;" fill="#353238" x="110" y="20">{val}</text>` +
      `</g>`;

    let height = 40;
    for (let i = 1; i <= bracketSize; i++) {
      // alert('masuk 3')
      const yPosition = 40 + (i - 1) * 40;
      const yTextPosition = 60 + (i - 1) * 40;
      height += 40;
      template.size = [template.size[0], height];
      template[`bc_${i}_position`] =
        `<g>` +
        `<rect x="0" y="${yPosition}" height="40" width="140" fill="#ffffff" stroke-width="1" stroke="#000"></rect>` +
        `<text data-width="120" style="font-size:8px;text-anchor: middle;" fill="#353238" x="70" y="${
          yTextPosition - 5
        }" data-text-overflow="multiline">{val}</text>` +
        `</g>`;
      template[`bc_${i}_prl`] =
        `<g>` +
        `<rect x="140" y="${yPosition}" height="40" width="40" fill="#ffffff" stroke-width="1" stroke="#000"></rect>` +
        `<text style="font-size:11px;text-anchor: middle;" fill="#353238" x="160" y="${
          yTextPosition + 4
        }">{val}</text>` +
        `</g>`;
      template[`bc_${i}_level`] =
        `<g>` +
        `<rect x="180" y="${yPosition}" id="{val}" height="40" width="40" fill="#ffffff" stroke-width="1" stroke="#000"></rect>` +
        `</g>`;
      // template[`bc_${i}_jumlah_formasi`] =
      //   `<g>` +
      //   `<rect x="180" y="${yPosition}" height="40" width="40" fill="#ffffff" stroke-width="1" stroke="#000"></rect>` +
      //   `<text style="font-size:11px;text-anchor: middle;" fill="#353238" x="200" y="${
      //     yTextPosition + 4
      //   }">{val}</text>` +
      //   `</g>`;
    }
    let yHeight = 0;
    let yTextPosition = 0;
    let yPosition = 0;
    for (let i = 0; i < bracketSplitted.length; i++) {
      if (i == 0) {
        yPosition = 40;
        yHeight = 40 * parseInt(bracketSplitted[i]);
        yTextPosition = yHeight / 2 + yPosition;
        // yTextPosition = yHeight + 20;
        // console.log(bracketSplitted[i])
      } else {
        yPosition = yHeight + yPosition;
        yHeight = 40 * bracketSplitted[i];
        yTextPosition = yHeight / 2 + yPosition;
      }
      template[`bc_${i + 1}_jumlah_formasi`] =
        `<g>` +
        `<rect x="180" y="${yPosition}" height="${yHeight}" width="40" fill="#ffffff" stroke-width="1" stroke="#000"></rect>` +
        `<text style="font-size:11px;text-anchor: middle;"  x="200" y="${yTextPosition}">{val}</text>` +
        `</g>`;
    }

    return template;
  }

  const bracketLimit = 20;

  for (let i = 1; i <= bracketLimit; i++) {
    OrgChart.templates[`bracket_${i}_t`] = bracketTemplateGenerator(i);
  }

  const nodeBinding = {
    ...baseNodeBinding,
  };

  const tags = {};

  // console.log({baseNodeBinding})
  for (let i = 1; i <= bracketLimit; i++) {
    for (let key in baseNodeBinding) {
      nodeBinding[`bc_${i}_${key}`] = `bc_${i}_${key}`;
    }
    tags[`basket_${i}`] = {
      template: `bracket_${i}_t`,
    };
  }

  // console.log("data", data);
  const dataMerged = data.filter((item) => item.isMergeFormation === true && item.basket == true);
  console.log("dataMerged", dataMerged);
  // const isMerge = dataMerged.some((item) =>
  //   Object.keys(item).some((key) => key.match(/^bc_\d+_isMerge$/) && item[key])
  // );
  // console.log("isMerge", isMerge);
  // console.log("dataMerged", dataMerged);

  let tagsCustomMergeArray = [];

  dataMerged.forEach((item) => {
    // if (!item.isMerge) return;
    // const isMerge = Object.keys(item).some((key) => key.match(/^bc_\d+_isMerge$/) && item[key]);
    // console.log("isMerge", isMerge);
    // if (!isMerge) return;
    const dataSelected = item;
    // console.log("dataSelected", dataSelected);
    // remove insie item.tags where tag starts with basket_
    item.tags = item.tags.filter((tag) => !tag.startsWith("basket_"));
    // cari yang key nya ada text "type"
    const getType = Object.entries(dataSelected)
      .filter(([key]) => key.includes("flagMergeFormation"))
      .map(([key, value]) => ({ key, value }));
    const totalBAsket = getType.length;
    let tagCustomMerge = "";
    if (totalBAsket > 0) {
      tagCustomMerge = `basket_${totalBAsket}`;
    }
    const customMergeLabel = "Z";
    getType.forEach((ita, ida) => {
      if (item[ita.key] == null) {
        item[ita.key] = customMergeLabel + String(ida + 1);
        ita.value = customMergeLabel + String(ida + 1);
      }
    });

    // check ada yang value nilai value getType yang sama atu tidak. contoh = [{a:1},{b:2},{c:1}]
    const storeValues = [];
    const uniqueValues = new Set(getType.map((item) => item.value));
    uniqueValues.forEach((value) => {
      const count = getType.filter((item) => item.value === value).length;
      storeValues.push({ value, count });
    });
    console.log("uniqueValues", uniqueValues);
    // console.log("storeValues", storeValues);

    // storeValues.sort((a, b) => {
    //   if (a.value === null && b.value === null) return 0;
    //   if (a.value === null) return 1;
    //   if (b.value === null) return -1;
    //   return a.value.localeCompare(b.value);
    // });
    console.log("storeValues sorted", storeValues);

    storeValues.forEach((itx, index) => {
      console.log("stroreValues idx", index);
      console.log("itx", itx);
      const tagFormation = `bc_${index + 1}_jumlah_formasi`;
      console.log("tagFormation", tagFormation);
      // console.log("itx", itx);
      // console.log("item", item);
      // console.log("item[tagFormation]", item[tagFormation]);

      // find in item ke includes _flagMergeFormation and value matches itx.value
      const flagMergeFormationKey = Object.keys(item)
        .filter((key) => key.includes("_flagMergeFormation") && item[key] === itx.value)
        .sort((a, b) => {
          return a.localeCompare(b);
        });
      console.log("flagMergeFormationKey", flagMergeFormationKey);

      flagMergeFormationKey.forEach((key) => {
        console.log("key", key);
        const separation = key.split("_");
        const bracketIndex = separation[1]; // get the index of the bracket
        item[tagFormation] = item[`bc_${bracketIndex}_jumlah_formasi`] || 0; // set jumlah_formasi to count
      });

      // item["bc_1_jumlah_formasi"] = 1; // example to set jumlah_formasi
      // item["bc_2_jumlah_formasi"] = 2; // example to set jumlah_formasi
      // item["bc_3_jumlah_formasi"] = 3; // set jumlah_formasi to count

      // find in item if key includes _jumlah_formasi and value matches itx.value (type-safe)
      // const keyFound = Object.keys(item)
      //   .filter((key) => key.includes("_jumlah_formasi"))
      //   .sort((a, b) => {
      //     return a.localeCompare(b);
      //   });
      // const mergeKeyFound = Object.keys(item)
      //   .filter((key) => key.includes("_flagMergeFormation"))
      //   .sort((a, b) => {
      //     return a.localeCompare(b);
      //   });
      // console.log("keyFound", keyFound);
      // console.log("mergeKeyFound", mergeKeyFound);
      // // console.log("keyFound", keyFound);
      // // console.log("item", item);
      // keyFound.forEach((key, idz) => {
      //   // console.log("key", key);
      //   // console.log(mergeKeyFound[idz]);
      //   // console.log("item[key]", item[key]);
      //   // console.log("itx.value", itx.value);
      //   // if (item[key] == itx.value) {
      //   // console.log("key", key);
      //   // console.log("item[key]", item[key]);
      //   // item[tagFormation] = itx.count;
      //   // console.log("masuk", key);
      //   // item[key] = itx.count;
      //   // }
      //   // console.log("key", key);
      //   // console.log("item[key]", item[key]);
      //   // console.log("item[key]", item[key]);
      //   // if (item[key] == 0) return;
      //   // console.log("key 2", key);
      //   // item[tagFormation] = itx.count;
      //   // if (item[key] == itx.value) {
      //   //   item[tagFormation] = item[key];
      //   //   console.log("masuk", key);
      //   //   // item[key] = itx.count;
      //   // }
      // });

      // const keyFound = Object.keys(dataSelected).find((key) => key.includes(itx.value));
      // console.log("keyFound", keyFound);
      // tagCustomMerge
      // console.log("itx.counte", itx.counte);
      tagCustomMerge += `_${itx.count}`;
      // console.log("tagFormation", tagFormation);
    });
    item.tags.push(tagCustomMerge);
    tagsCustomMergeArray.push(tagCustomMerge);
    console.log("tagsCustomMergeArray before unique", tagCustomMerge);
  });

  // console.log("tagsCustomMergeArray", tagsCustomMergeArray);
  tagsCustomMergeArray = [...new Set(tagsCustomMergeArray)];
  // console.log("tagsCustomMergeArray", tagsCustomMergeArray);

  tagsCustomMergeArray.forEach((ity) => {
    // remove basket_ from ity
    const itemReplaced = ity.replace("basket_", "");
    tags[ity] = {
      template: `${ity}_t`,
    };
    OrgChart.templates[`${ity}_t`] = bracketTemplateGeneratorJoinFormation(itemReplaced);
  });

  // for (let i = 1; i <= bracketLimit; i++) {
  //   for (let key in baseNodeBinding) {
  //     nodeBinding[`bc_${i}_${key}`] = `bc_${i}_${key}`;
  //   }
  //   tags[`basket_${i}`] = {
  //     template: `bracket_${i}_t`,
  //   };
  // }
  // console.log(OrgChart.templates);
  // console.log({tags})

  // add tags
  // "hasChildren": {
  //   template: "withChildren"
  // }
  // tags["hasChildren"] = {
  //   template: "withChildren",
  // };

  //  templates: {
  //     withChildren: Object.assign({}, OrgChart.templates.base, {
  //       node: '<rect x="0" y="0" width="250" height="100" fill="lightblue"></rect>',
  //       plus: '<circle cx="225" cy="50" r="15" fill="green" stroke="black" stroke-width="2"></circle>',
  //   })
  // }

  // templates["withChildren"] = Object.assign({}, OrgChart.templates.base, {

  // console.log("testOrgBagan", testOrgBagan);

  // remove duplicate id in array data
  // data = data.filter((item, index, self) => self.findIndex((t) => t.id === item.id) === index);

  OrgChart.RESET_MOVABLE_ONEXPANDCOLLAPSE = true;
  OrgChart.SEARCH_CLOSE_RESULT_ON_ESCAPE_OR_CLICKOUTSIDE = true;
  // remove chart first, then create new chart
  const chartContainer = document.getElementById(id);
  if (chartContainer) {
    chartContainer.innerHTML = "";
  }
  if (document.getElementById(id)) {
    document.getElementById(id).innerHTML = "";
  } else {
    const container = document.createElement("div");
    container.id = id;
    document.body.appendChild(container);
  }

  let chart = new OrgChart(document.getElementById(id), {
    collapse: {
      ...param.collapsed,
      // level: 2,
      // allChildren: true,
    },
    template: "default_t",
    nodeBinding,
    enableSearch: false,
    assistantSeparation: 10,
    levelSeparation: 30,
    scaleInitial: OrgChart.match.boundary,
    // nodes: testOrgBagan,
    // nodes: test,
    nodes: data,
    align: OrgChart.ORIENTATION,
    // movable: OrgChart.movable.node,
    nodeMouseClick: false,
    // menu: {
    //   pdf: { text: "Export PDF" },
    //   png: { text: "Export PNG" },
    //   svg: { text: "Export SVG" },
    // },
    toolbar: {
      fullScreen: true,
      zoom: true,
      fit: true,
    },
    tags,
  });

  chart.on("init", function (sender) {
    const title = document.createElement("button");
    title.style.position = "absolute";
    title.style.right = "0px";
    title.style.top = "87px";
    title.style.width = "50px";
    title.style.textAlign = "center";
    title.style.color = "#757575";
    title.style.backgroundColor = "transparent";
    title.style.border = "none";
    title.style.fontSize = "42px";
    title.style.color = "grey";

    title.innerHTML = `<i class="fa fa-refresh"></i>`;
    // add id to title
    title.addEventListener("click", function () {
      // Show loading for refresh
      showChartLoading("osContainer");

      setTimeout(() => {
        helperOrgChart(true, "osContainer", lsListOrgNode, true);
      }, 100);
    });
    chart.element.appendChild(title);

    // Hide loading when chart is ready
    setTimeout(() => {
      hideChartLoading("osContainer");
    }, 100);

    // console.log("node", chart.nodes);
    // const nodes = chart.nodes;
    // // node object to array
    // const nodesArray = Object.keys(nodes).map((key) => nodes[key]);
    // nodesArray.forEach((node) => {
    //   if (!chart.getNode(node.id).children || chart.getNode(node.id).children.length === 0) {
    //     // add tags
    //     chart.addTag(node.id, "hidePlus");
    //   }
    //   console.log("node", chart.getNode(node.id).children);
    // });
    // chart.node.forEach((node) => {
    // if (!chart.getNode(node.id).children || chart.getNode(node.id).children.length === 0) {
    //   chart.addTag(node.id, "hidePlus");
    // }
    // });
  });

  chart.onExportStart((args) => {
    args.styles += document.getElementById("myStyle").outerHTML;
  });

  chart.onExportEnd((args) => {
    console.log(args);
  });

  chart.onUpdated(() => {});

  chart.on("expcollclick", function (sender, collapse, id, ids) {
    // alert("masd");
  });

  chart.on("node-layout", function (sender, args) {
    const childrenCount = args?.childrenIds?.length;
    if (childrenCount > 10) {
      args.layout = OrgChart.treeRightOffset;
    } else {
      args.layout = OrgChart.normal;
    }
  });

  chart.on("click", async (sender, node) => {
    // const param = {};
    const nodeID = node.node.id;
    await modalJobPopup(nodeID);

    // expandCollapse
    // chart.expand(node.node.id);

    // const nodeID = node.node.id;
    // console.log("nodeID", nodeID);
    // const dataChart = await chartShow({
    //   draftId: organizationAttribute.orgUnitId,
    //   jobCode: nodeID,
    //   depth: 2,
    // });
    // dataChart.data.forEach((item) => {
    //   item.id = item.id_org_unit;
    // });

    // remove find where pid = nodeID
    // const dataChartFiltered = dataChart.data
    //   .filter((item) => !data.find((element) => element.id === item.id_org_unit))
    //   .filter((item) => item.pid == nodeID);
    // console.log("dataChartFiltered", dataChartFiltered);
    // dataChartFiltered.forEach((item) => {
    //   setTimeout(() => {
    //     chart.addNode(item);
    //   }, 300);
    // });

    // check if node have children
    //  check if node have children expanded
  });

  // chart on right click
  chart.on("contextmenu", function (sender, args) {
    args.event.preventDefault(); // Prevent default browser menu

    // Remove existing menu
    let existingMenu = document.getElementById("custom-menu");
    if (existingMenu) {
      existingMenu.remove();
    }
  });

  chart.on("searchclick", (sender, node) => {
    return false;
  });

  $("#handleExportPdf")
    .off("click")
    .on("click", function () {
      const nodeId = $("#positionId").val();
      chart.exportPDF({
        filename: `${nodeId}.pdf`,
        expandChildren: false,
      });
      $("#modalDetailJob").modal("hide");
    });

  $("#handleExportPng")
    .off("click")
    .on("click", function () {
      const nodeId = $("#positionId").val();
      chart.exportPNG({
        // expandChildren: true,
        // min: false,
        openInNewTab: true,
        filename: `${nodeId}.png`,
        // parentLevels: 1,
        // childLevels: 1,
        expandChildren: false,
      });
      $("#modalDetailJob").modal("hide");
    });

  $("#handleExportSvg")
    .off("click")
    .on("click", function () {
      const nodeId = $("#positionId").val();
      chart.exportSVG({
        // expandChildren: true,
        // min: false,
        filename: `${nodeId}.svg`,
        // parentLevels: 1,
        // childLevels: 1,
        expandChildren: false,
      });
      $("#modalDetailJob").modal("hide");
    });

  // $("#handleExport").on("click", function () {
  //   const nodeId = $("#positionId").val();
  //   const position = lsListPosition.find((item) => item.positionId == nodeId);
  //   console.log("masuk 3");
  //   // exportPDF(nodeId);
  //   chart.exportPDF({ filename: `${position.positionName}.pdf`, expandChildren: false, nodeId: nodeId });
  //   // chart remove certain tags
  //   chart.removeTags(["pointed"]);

  //   $("#modalDetailJob").modal("hide");
  // });

  // function handleExport() {
  //   const nodeId = $("#positionId").val();
  //   console.log("masuk 2");
  // }

  if (object?.expand) {
    let selfNode = data.find((item) => item.id == object.nodeId);
    const getChildrenNode = data.filter((item) => item.pid == object.nodeId).map((item) => item.id) || [];
    const siblingNode = data.filter((item) => item.pid == selfNode?.pid).map((item) => item.id) || [];
    const getAll = [...getChildrenNode, ...siblingNode];
    setTimeout(() => {
      chart.expand(object.nodeId, getAll);
    }, 500);
    setTimeout(() => {
      chart.fit();
    }, 800);
  }
}

async function changeDataSourceFilter(value) {
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
function showChartLoading(containerId) {
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = `
      <div id="chart-loading-overlay" style="
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        background-color: rgba(255, 255, 255, 0.9);
        z-index: 1000;
      ">
        <div style="
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3498db;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          animation: chart-spin 1s linear infinite;
        "></div>
        <p style="
          margin-top: 15px;
          color: #666;
          font-size: 16px;
          font-weight: 500;
          text-align: center;
        ">Loading organization chart...</p>
      </div>
      <style>
        @keyframes chart-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `;

    // Ensure container has relative positioning for absolute positioning to work
    const containerStyle = window.getComputedStyle(container);
    if (containerStyle.position === "static") {
      container.style.position = "relative";
    }
  }
}

function hideChartLoading(containerId) {
  const container = document.getElementById(containerId);
  if (container) {
    // Remove loading overlay
    const loadingOverlay = container.querySelector("#chart-loading-overlay");
    const loadingStyle = container.querySelector("style");

    if (loadingOverlay) {
      loadingOverlay.remove();
    }
    if (loadingStyle) {
      loadingStyle.remove();
    }

    console.log(`Chart loading hidden for container: ${containerId}`);
  }
}
