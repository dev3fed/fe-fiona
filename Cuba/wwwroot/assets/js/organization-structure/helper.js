async function checkUniqueCode(typeId, identifier) {
  uuid.uniqueCode = localStorage.getItem("uniqueCode");
  uuid.uniquePosCode = localStorage.getItem("uniquePosCode");
  const draftId = urlParams.get("draftId");
  const duplicate = urlParams.get("duplicate");
  const editUrl = urlParams.get("edit");
  const positionCode = urlParams.get("positionCode");
  if (editUrl) {
    $("#selectDraftType").append(new Option("Edit Job", "1", true, true));
  }
  codeId = uuid.uniqueCode;
  if (draftId) {
    codeId = draftId;
  }
  if (positionCode) {
    const res = await detailJobPositionByCode(positionCode);
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

async function duplicateJob(param) {
  const dataAttribute = param?.attribute;
  const jobAttribute = dataAttribute?.jobAttribute;
  const ssg = param?.sssg;
  const dataInitial = {
    draft: null,
    draftDetail: null,
    listJobSssg: ssg,
    listJobSubPosition: null,
  };

  uuid.uniqueCode = dataAttribute?.uniqueCode;
  localStorage.setItem("uniqueCode", uuid.uniqueCode);
  uuid.uniquePosCode = dataAttribute?.uniquePosCode ? dataAttribute?.uniquePosCode : uuidv4();
  localStorage.setItem("uniquePosCode", uuid.uniquePosCode);
  dataInitial.draft = $("#inputDraftName").val(); // draftName
  dataInitial.draftDetail = jobAttribute;
  dataInitial.draftDetail.positionName = dataAttribute?.jobPositionName;
  dataInitial.draftDetail.abbrvPosition = dataAttribute?.positionAbbreviation;
  // console.log(dataInitial);
  // dataInitial.draftDetail?.positionName = jobAttribute?.positionName;

  // const draft = dataObject?.draft;
  // const draftDetail = dataObject?.draftDetail;
  // const draftSsg = dataObject?.listJobSssg;
  updatedAll(dataInitial);
  $("#contentDiv").show();
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
  // $("#selectPrlOrg").append(new Option(draftDetail?.prlOrg, draftDetail?.prlOrg, true, true));
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

function updateDivSubPosition(dataSubPosition, dataObject) {
  $("#noDataSubPosition").show();
  $("#dataSubPosition").hide();
  if (dataObject?.listJobSubPosition.length > 0) {
    $("#noDataSubPosition").hide();
    $("#dataSubPosition").show();
    getTablePositionList(dataObject?.listJobSubPosition);
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

async function saveInputAttribut() {
  const payload = initialDraftJob;
  payload.uniqueCode = uuid.uniqueCode;
  payload.type = "draft";
  payload.category = "add";
  if ($("#selectDraftType").val() == 1) {
    payload.category = "edit";
  }
  payload.draftName = $("#inputDraftName").val();
  payload.careerType = $("#selectCareerType").val();
  payload.careerLevel = $("#selectCareerLevel").val();
  payload.isBakset = $("#selectBasket").val() == "Yes" ? true : false;
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
  if ($("#selectPrlOrg").val() !== "" && $("#selectPrlOrgTo").val() !== "null" && $("#selectPrlOrgTo").val() !== null) {
    payload.prlOrg = $("#selectPrlOrg").val() + "-" + $("#selectPrlOrgTo").val();
  }
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
  await postInputAttribute(payload);
  // remove query params
  const draftId = urlParams.get("draftId");
  let cleanUrl = window.location.origin + window.location.pathname;
  if (draftId) {
    cleanUrl = cleanUrl + "?draftId=" + draftId;
  }
  history.replaceState(null, "", cleanUrl);
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

function modalSubPosition(defaultState) {
  $("[id^=modalSelect]").attr("disabled", false);
  $("[id^=modalInput]").attr("disabled", false);
  $("#modalAddSubPosition").modal("show");
  const inputOrgUnitName =
    $("#inputOrgUnitName").val() == "" ? $("#selectOrgUnitName").val() : $("#inputOrgUnitName").val() ?? "";
  const careerType = $("#selectCareerType").val() ?? "";
  $("#modalInputOrgUnitName").val(inputOrgUnitName).attr("disabled", true);
  $("#modalInputCareerType").val(careerType).attr("disabled", true);
  if (defaultState) {
    defaultStateMOdal();
  }
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
  statusAction = "edit";
  helperId = id;
  // alert(id);
  const listDetailJobSubPosition = await detailDraftJobSubPosition(id);

  modalSubPosition(false);
  if (listDetailJobSubPosition) {
    // appen modalSelectCareerLevel
    $("#modalSelectCareerLevel").append(
      new Option(listDetailJobSubPosition.data.careerLevel, listDetailJobSubPosition.data.careerLevel, true, true)
    );
    updateAbbrvPositionModal(listDetailJobSubPosition.data.careerType, listDetailJobSubPosition.data.careerLevel);
    $("#modalSelectAbbrvPosition").append(
      new Option(listDetailJobSubPosition.data.abbrPosition, listDetailJobSubPosition.data.abbrPosition, true, true)
    );
    // modalSelectPrlOrgSubPos
    updatePrlOrg(listDetailJobSubPosition.data.careerType, listDetailJobSubPosition.data.careerLevel);
    $("#modalSelectPrlOrgSubPos").append(
      new Option(listDetailJobSubPosition.data.prlOrg, listDetailJobSubPosition.data.prlOrg, true, true)
    );
    $("#modalInputFormation").val(listDetailJobSubPosition.data.formation);
    // positionName
    $("#modalInputSubPositionName").val(listDetailJobSubPosition.data.positionName);
  }
}

function editDraft(id) {
  // alert(id);
  // redirec to detail?id=id
  window.location.href = "/organization/detail?draftId=" + id;
}
function detailDraft(id) {
  // alert(id);
  // redirec to detail?id=id
  window.location.href = "/organization/draft-detail?draftId=" + id;
}

function deleteDraft(id) {
  swal({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then(async (result) => {
    if (result) {
      try {
        await deleteDraftOrganizationStructure(id);
        swal("Deleted", "Draft has been deleted successfully", "success");
        getTableListDraft();
      } catch (error) {
        console.log(error);
      }
    }
  });
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
        await deleteDraftJobSubPosition(id);
        const getUrlPathName = window.location.pathname;
        if (getUrlPathName === "/organization/new-subordinate") {
          refreshDataSubordinate();
        } else {
          refreshData();
        }
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

async function handleEdit(params) {
  const draftId = urlParams.get("draftId");
  window.location.href = "/organization/detail?draftId=" + draftId;
}
async function handleEditJob(params) {
  const positionCode = $("#positionCode").val();
  window.location.href = "/organization/detail?edit=true&positionCode=" + positionCode;
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

async function handleBack(params) {
  window.location.href = "/organization/index?activeTab=draft";
}

async function modalJobPopup(params) {
  const data = params?.data;
  const attribute = data?.attribute;
  const jobAttribute = attribute?.jobAttribute;
  const ssg = data?.sssg;
  const incumbent = data?.incumbent;

  $("#jobName").text(attribute?.jobPositionName);
  $("#positionCode").val(attribute?.jobPositionCode);
  $("#modalDirectorate").text(jobAttribute?.directorate ?? "-");
  $("#modalDivision").text(jobAttribute?.division ?? "-");
  $("#modalSubDivision").text(jobAttribute?.subDivision ?? "-");
  $("#modalDepartment").text(jobAttribute?.department ?? "-");
  $("#modalSection").text(jobAttribute?.section ?? "-");
  $("#modalPersonnelAreaName").text(jobAttribute?.personalAreaName ?? "-");
  $("#modalPersonalSubArea").text(jobAttribute?.personalSubareaName ?? "-");
  $("#modalCareerType").text(jobAttribute?.careerType ?? "-");
  $("#modalCareerLevel").text(jobAttribute?.careerLevel ?? "-");
  $("#modalAbbrvPosition").text(jobAttribute?.abbrvPosition ?? "-");
  $("#modalOrgUnitName").text(jobAttribute?.orgUnitName ?? "-");
  $("#modalPositionName").text(jobAttribute?.positionName ?? "-");
  $("#modalOrgPRL").text(jobAttribute?.prlOrg ?? "-");
  $("#modalFormation").text(jobAttribute?.formation ?? "-");
  $("#modalDirectReport").text(jobAttribute?.directReport ?? "-");
  $("#modalNeckFunction").text(jobAttribute?.neckFunction ?? "-");
  $("#modalIsProject").text(jobAttribute?.isProject ?? "-");
  $("#modalIsCoordination").text(jobAttribute?.isCoordination ?? "-");
  $("#modalCoordinationWith").text(jobAttribute?.coordinationWith ?? "-");
  $("#modalFunction").text(jobAttribute?.function ?? "-");
  $("#modalSKNumber").text(jobAttribute?.numberOfSK ?? "-");

  $("#modalMainSkillGroup").text(ssg?.mainSg?.text ?? "-");
  $("#modalMainSubSkillGroup").text(ssg?.mainSsg?.text ?? "-");
  $("#modalSecondSkillGroup").text(ssg?.secondSg?.text ?? "-");
  $("#modalSecondSubSkillGroup").text(ssg?.secondSsg?.text ?? "-");
  $("#modalThirdSkillGroup").text(ssg?.thirdSg?.text ?? "-");
  $("#modalThirdSubSkillGroup").text(ssg?.thirdSsg?.text ?? "-");

  $("#incumbentId").text(incumbent?.personId ?? "-");
  $("#incumbentName").text(incumbent?.name ?? "-");
  $("#prlPlanComp").text(incumbent?.prlPlanComp ?? "-");

  $("#modalDetailJob").modal("show");
}
