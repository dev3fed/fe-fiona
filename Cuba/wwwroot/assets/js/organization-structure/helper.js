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

async function checkDataOrganization() {
  localStorage.getItem("organizationAttribute") ??
    localStorage.setItem("organizationAttribute", JSON.stringify(organizationAttribute));
  const data = JSON.parse(localStorage.getItem("organizationAttribute"));
  Object.keys(organizationAttribute).forEach((key) => {
    if (data[key]) {
      organizationAttribute[key] = data[key];
    }
  });
  // append value to input
  $("#selectDraftOrganization").val(organizationAttribute.orgUnitId).trigger("change");
}

async function insertFormPostion(paramId) {
  const getDetailPosition = lsListPosition.find((item) => item.positionId == paramId);
  console.log(getDetailPosition);
  const fields = [
    { id: "#selectCareerType", value: getDetailPosition?.careerType, type: "select" },
    { id: "#selectCareerLevel", value: getDetailPosition?.careerLevel, type: "select" },
    { id: "#selectAbbrvPosition", value: getDetailPosition?.abbrvPosition, type: "select" },
    { id: "#selectOrgUnitParentName", value: getDetailPosition?.orgUnitParentId, type: "select" },
    { id: "#selectOrgUnitName", value: getDetailPosition?.orgUnitName, type: "select" },
    { id: "#inputPositionName", value: getDetailPosition?.positionName, type: "input" },
    { id: "#selectPrlOrg", value: getDetailPosition?.prlOrg, type: "select" },
    { id: "#selectPrlOrgTo", value: getDetailPosition?.prlOrgTo, type: "select" },
    { id: "#inputFormation", value: getDetailPosition?.formation || 1, type: "input" },
    { id: "#inputOrgUnitName", value: getDetailPosition?.orgUnitName, type: "input" },
    { id: "#selectKBO", value: getDetailPosition?.kbo, type: "select" },
    { id: "#selectCostCenter", value: getDetailPosition?.costCenterDesc, type: "select" },
    { id: "#selectDirectReport", value: getDetailPosition?.directReportId, type: "select" },
    { id: "#selectFunction", value: getDetailPosition?.function, type: "select" },
    { id: "#selectDivision", value: getDetailPosition?.division, type: "select" },
    { id: "#selectSubDivision", value: getDetailPosition?.subDivision, type: "select" },
    { id: "#selectDepartment", value: getDetailPosition?.department, type: "select" },
    { id: "#selectSection", value: getDetailPosition?.section, type: "select" },
    { id: "#selectPersonalAreaName", value: getDetailPosition?.personalAreaName, type: "select" },
    { id: "#selectSkillGroupMain", value: getDetailPosition?.mainSkillGroup, type: "select" },
    { id: "#selectSubSkillGroupMain", value: getDetailPosition?.mainSubSkillGroup, type: "select" },
    { id: "#selectSkillGroupSecond", value: getDetailPosition?.secondSkillGroup, type: "select" },
    { id: "#selectSubSkillGroupSecond", value: getDetailPosition?.secondSubSkillGroup, type: "select" },
    { id: "#selectSkillGroupThird", value: getDetailPosition?.thirdSkillGroup, type: "select" },
    { id: "#selectSubSkillGroupThird", value: getDetailPosition?.thirdSubSkillGroup, type: "select" },
  ];

  fields.forEach(({ id, value, type }) => {
    if (type === "select") {
      $(id).val(value).trigger("change");
    } else {
      $(id).val(value);
    }
  });

  $("#selectBasket").attr("disabled", true).val("No").trigger("change");
  if (getDetailPosition?.isBasket == "Yes") {
    $("#selectBasket").attr("disabled", false).val("Yes").trigger("change");
  }
  if (getDetailPosition?.neckFunction) {
    $("#selectNeckFunction").prop("checked", true).trigger("change");
  }
  if (getDetailPosition?.isProject) {
    $("#selectIsProject").prop("checked", true).trigger("change");
  }
  if (getDetailPosition?.isCoordination) {
    $("#selectCoordination").prop("checked", true).trigger("change");
    $("#selectCoordinationWith")
      .append(new Option(getDetailPosition?.coordinationWith, getDetailPosition?.coordinationWith, true, true))
      .attr("disabled", false);
  }

  $("#noDataSubPosition").show();
  if (getDetailPosition?.listSubPosition.length > 0) {
    // hide noDataSubPosition
    updateDivSubPosition(getDetailPosition?.listSubPosition, getDetailPosition);
    // $("#noDataSubPosition").hide();
    // getTablePositionList(getDetailPosition?.listSubPosition);
  }
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

function updateDivSubPosition(dataSubPosition, dataObject) {
  $("#noDataSubPosition").show();
  $("#dataSubPosition").hide();
  if (dataObject?.listSubPosition.length > 0) {
    $("#noDataSubPosition").hide();
    $("#dataSubPosition").show();
    getTablePositionList(dataObject?.listSubPosition);
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

async function saveInputAttribut(type, data) {
  const payload = payloadPosition;
  payload.type = type;
  saveEmployeeDetails(payload, data);
  saveOrgDetails(payload);
  if (payload.type == "edit") {
    data = lsListPosition.find((item) => item.positionId == payload.positionId);
    swal("Saved", "Position has been updated", "success");
    // wait 1 second
    setTimeout(() => {
      window.location.href = "/organization/index?focusNode=" + payload.positionId;
    }, 1000);
  } else {
    swal("Saved", "Position has been saved", "success");
    const getDirectReport = payload.positionId;
    setTimeout(() => {
      window.location.href = "/organization/index?focusNode=" + getDirectReport;
    }, 1000);
  }
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

function modalSubPosition(defaultState) {
  $("#modalAddSubPosition").modal("show");
  // $("[id^=modalSelect]").attr("disabled", false);
  // $("[id^=modalInput]").attr("disabled", false);
  // const inputOrgUnitName =
  //   $("#inputOrgUnitName").val() == "" ? $("#selectOrgUnitName").val() : $("#inputOrgUnitName").val() ?? "";
  // const careerType = $("#selectCareerType").val() ?? "";
  // $("#modalInputOrgUnitName").val(inputOrgUnitName).attr("disabled", true);
  // $("#modalInputCareerType").val(careerType).attr("disabled", true);
  // if (defaultState) {
  //   defaultStateMOdal();
  // }
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
  $("#modalAddSubPosition").modal("show");
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

async function modalJobPopup(params) {
  const dataDefault = 30313912;
  let data = lsListPosition.find((item) => item.positionId == params);
  console.log("params", params);
  console.log("data", data);
  if (data == undefined) {
    data = lsListPosition.find((item) => item.positionId == dataDefault);
  }
  console.log(data?.incumbent[0]?.employeeId);
  $("#jobName").text(data?.positionName ? data?.positionName : data?.orgUnitName ?? "");
  $("#positionId").val(data.positionId);
  $("#modalDirectorate").text("Pertamina Patra Niaga");
  $("#modalDivision").text(data?.division ?? "");
  $("#modalSubDivision").text(data?.subDivision ?? "");
  $("#modalDepartment").text(data?.department ?? "");
  $("#modalSection").text(data?.section ?? "");
  $("#modalPersonnelAreaName").text(data?.personalAreaName ?? "");
  $("#modalPersonnelAreaSubname").text(data?.personalSubareaName ?? "");
  $("#modalCareerType").text(data?.careerType ?? "");
  $("#modalCareerLevel").text(data?.careerLevel ?? "");
  $("#modalAbbrvPosition").text(data?.abbrvPosition ?? "");
  $("#modalOrgUnitName").text(data?.orgUnitName ?? "");
  $("#modalPositionName").text(data?.positionName ?? "");
  $("#modalOrgPRL").text(data?.prlOrg ?? "");
  $("#modalFormation").text(data?.formation ?? "");
  $("#modalDirectReport").text(data?.directReport ?? "");
  $("#modalNeckFunction").text(data?.neckFunction ?? "");
  $("#modalIsProject").text(data?.isProject ?? "");
  $("#modalIsCoordination").text(data?.isCoordination ?? "");
  $("#modalCoordinationWith").text(data?.coordinationWith ?? "");
  $("#modalFunction").text(data?.function ?? "");
  $("#modalSKNumber").text(data?.skNumber ?? "");

  $("#modalMainSkillGroup").text(data?.mainSkillGroup ?? "");
  $("#modalMainSubSkillGroup").text(data?.mainSubSkillGroup ?? "");
  $("#modalSecondSkillGroup").text(data?.secondSkillGroup ?? "");
  $("#modalSecondSubSkillGroup").text(data?.secondSubSkillGroup ?? "");
  $("#modalThirdSkillGroup").text(data?.thirdSkillGroup ?? "");
  $("#modalThirdSubSkillGroup").text(data?.thirdSubSkillGroup ?? "");

  $("#incumbentId").text(data?.incumbent[0]?.employeeId ?? "");
  $("#incumbentName").text(data?.incumbent[0]?.employeeName ?? "");
  $("#prlPlanComp").text(data?.incumbent[0]?.prlPlanComp ?? "");

  $("#modalDetailJob").modal("show");
}

function modalConfrimHelper(type, titleModal, message, note, action, modalSize, paramsId) {
  console.log("paramsId", paramsId);
  if (modalSize) {
    $("#modalConfirm").find(".modal-dialog").addClass(modalSize);
  }
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
  // refresh jsTree
  $("#orgThreeDiv").jstree("destroy");
  $("#orgThreeDiv").jstree({
    core: {
      data: createHierarchy(params),
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
  $("#orgThreeDiv").on("contextmenu", ".jstree-node", function (e) {
    e.preventDefault();
    const node = $("#orgThreeDiv").jstree(true).get_node($(this).attr("id"));
    focusNode(node.id);
    $("#modalOrgTree").modal("hide");
  });
}

// ======================
// helper bagan org
// ======================

function focusNode(nodeId) {
  let selfNode = lsListOrgNode.find((item) => item.id == nodeId);
  let parentNode = lsListOrgNode.find((item) => item.id == selfNode?.pid) || {};
  const childrenData = getallChildrenNode(parentNode);
  const data = [parentNode, ...childrenData].filter((item) => item.id != nodeId);

  selfNode = {
    ...selfNode,
    tags: [...selfNode.tags, "pointed"],
  };
  data.push(selfNode);

  // let grandParentNode = lsListOrgNode.find((item) => item.id == parentNode?.pid) || {};
  // let childrenNode = lsListOrgNode.filter((item) => item.pid == nodeId) || [];
  // let brotherNode = lsListOrgNode.filter((item) => item.pid == selfNode?.pid) || [];

  // brotherNode = brotherNode.filter((item) => item.id != nodeId);

  // if (brotherNode.length % 2 == 0 && brotherNode.length > 0) {
  //   const middle = brotherNode.length / 2;
  //   brotherNode.splice(middle, 0, selfNode);
  // } else if (brotherNode.length % 2 != 0 && brotherNode.length > 0) {
  //   const middle = (brotherNode.length - 1) / 2;
  //   brotherNode.splice(middle, 0, selfNode);
  // } else {
  //   brotherNode = [selfNode];
  // }

  // const dataDated = [grandParentNode, parentNode, ...brotherNode, ...childrenNode];

  // chart.load(dataDated);

  // hide node 39020818
  // chart.hide(39020818);
  setTimeout(() => {
    helperOrgChart(true, "os-container", data, true, { expand: true, nodeId: nodeId });
    // const getChildrenNode = lsListOrgNode.filter((item) => item.pid == nodeId).map((item) => item.id) || [];
    // const siblingNode = lsListOrgNode.filter((item) => item.pid == selfNode?.pid).map((item) => item.id) || [];
    // const getAll = [...getChildrenNode, ...siblingNode];
    // chart.expand(nodeId, getAll);
  }, 500);
}

function getallChildrenNode(parentNode) {
  let children = lsListOrgNode.filter((item) => item.pid === parentNode.id);
  children.forEach((child) => {
    children = children.concat(getallChildrenNode(child));
  });
  return children;
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
  // default_t.link = `<path stroke-linejoin="round" stroke-width="1" fill="none" d="{edge}" />`;
  default_t.plus = `<g><circle cx="5" cy="5" r="5" class="boc-fill" stroke="#000" stroke-width="1"></circle>
  <line x1="3" y1="5" x2="7" y2="5" stroke-width="1" stroke="#000"></line>
  <line x1="5" y1="3" x2="5" y2="7" stroke-width="1" stroke="#000"></line></g>`;
  default_t.minus = `<g><circle cx="5" cy="5" r="5" class="boc-fill" stroke="#000" stroke-width="1"></circle>
  <line x1="3" y1="5" x2="7" y2="5" stroke-width="1" stroke="#000"></line></g>`;
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
    template.position =
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

  const bracketLimit = 20;

  for (let i = 1; i <= bracketLimit; i++) {
    OrgChart.templates[`bracket_${i}_t`] = bracketTemplateGenerator(i);
  }

  const nodeBinding = {
    ...baseNodeBinding,
  };

  const tags = {};

  for (let i = 1; i <= bracketLimit; i++) {
    for (let key in baseNodeBinding) {
      nodeBinding[`bc_${i}_${key}`] = `bc_${i}_${key}`;
    }
    tags[`bracket_${i}`] = {
      template: `bracket_${i}_t`,
    };
  }

  OrgChart.RESET_MOVABLE_ONEXPANDCOLLAPSE = true;
  OrgChart.SEARCH_CLOSE_RESULT_ON_ESCAPE_OR_CLICKOUTSIDE = true;
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
    nodes: data,
    align: OrgChart.ORIENTATION,
    movable: OrgChart.movable.node,
    nodeMouseClick: false,
    menu: {
      pdf: { text: "Export PDF" },
      png: { text: "Export PNG" },
      svg: { text: "Export SVG" },
    },
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
      // myData.forEach((item) => {
      //   item.tags = item.tags.filter((tag) => tag !== "edit");
      // });
      // chart.load(myData);
      helperOrgChart(true, "os-container", lsListOrgNode, true);
    });
    chart.element.appendChild(title);
  });

  chart.onExportStart((args) => {
    args.styles += document.getElementById("myStyle").outerHTML;
  });

  chart.onExportEnd((args) => {
    console.log(args);
  });

  chart.onUpdated(() => {});

  chart.on("expcollclick", function (sender, collapse, id, ids) {});

  chart.on("node-layout", function (sender, args) {
    const childrenCount = args?.childrenIds?.length;
    if (childrenCount > 10) {
      args.layout = OrgChart.treeRightOffset;
    } else {
      args.layout = OrgChart.normal;
    }
  });

  chart.on("click", async (sender, node) => {
    const param = {};
    const nodeID = node.node.id;
    await modalJobPopup(nodeID);
  });

  chart.on("searchclick", (sender, node) => {
    return false;
  });

  $("#handleExport").on("click", function () {
    const nodeId = $("#positionId").val();
    const position = lsListPosition.find((item) => item.positionId == nodeId);
    console.log("masuk 3");
    // exportPDF(nodeId);
    chart.exportPDF({ filename: `${position.positionName}.pdf`, expandChildren: false, nodeId: nodeId });
    // chart remove certain tags
    chart.removeTags(["pointed"]);

    $("#modalDetailJob").modal("hide");
  });

  // function handleExport() {
  //   const nodeId = $("#positionId").val();
  //   console.log("masuk 2");
  // }

  if (object?.expand) {
    let selfNode = lsListOrgNode.find((item) => item.id == object.nodeId);
    const getChildrenNode = lsListOrgNode.filter((item) => item.pid == object.nodeId).map((item) => item.id) || [];
    const siblingNode = lsListOrgNode.filter((item) => item.pid == selfNode?.pid).map((item) => item.id) || [];
    const getAll = [...getChildrenNode, ...siblingNode];
    setTimeout(() => {
      chart.expand(object.nodeId, getAll);
    }, 500);
  }
}
