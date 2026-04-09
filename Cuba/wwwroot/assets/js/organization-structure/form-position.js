function starter() {
  $("#selectPrlOrgTo").attr("disabled", true);
  $("#selectCoordinationWith").attr("disabled", true);
  $("#subPositionDiv").hide();
}

async function initializeList() {
  const _function = await functionList(organizationAttribute.orgUnitId);
  console.log("_function", _function);
  const _abbrv = await abbrvPositionList(organizationAttribute.orgUnitId);
  const draftId = organizationAttribute.orgUnitId;
  getDataListAsync([
    {
      id: "selectJobReference",
      endpoint: "chart/job/list",
      draftId: draftId,
    },
    {
      id: "selectDivision",
      endpoint: "draft/division/list",
      draftId: draftId,
    },
    {
      id: "selectSubDivision",
      endpoint: "draft/sub-division/list",
      draftId: draftId,
    },
    {
      id: "selectDepartment",
      endpoint: "draft/department/list",
      draftId: draftId,
    },
    {
      id: "selectSection",
      endpoint: "draft/section/list",
      addedParams: "",
      draftId: draftId,
    },
    { id: "selectCareerType", endpoint: "draft/career-type/list", draftId: draftId, showId: false },
    { id: "selectCareerLevel", endpoint: "draft/career-level/list", draftId: draftId, showId: false },
    // { id: "selectAbbrvPosition", endpoint: "draft/job-abbriviation/list", draftId: draftId },
    { id: "selectKBO", endpoint: "draft/kbo/list", draftId: draftId },
    { id: "selectCostCenter", endpoint: "draft/cost-center/list", draftId: draftId },
    { id: "selectPersonalAreaName", endpoint: "draft/personnel-area/list", draftId: draftId },
    { id: "selectPersonalSubareaName", endpoint: "draft/personnel-sub-area/list", draftId: draftId },
    { id: "selectOrgUnitParentName", endpoint: "draft/unit/list", draftId: draftId, showId: true },
    // { id: "selectDirectReport", endpoint: "draft/position/list", draftId: draftId, showId: true },
    { id: "selectDirectReport", endpoint: "chart/job/list", draftId: draftId, showId: true },
    { id: "selectCoordinationWith", endpoint: "chart/job/list", draftId: draftId },
    { id: "selectSkillGroupMain", endpoint: "draft/skill-group/list", draftId: draftId, showId: false },
    {
      id: "selectSubSkillGroupMain",
      endpoint: "draft/sub-skill-group/list",
      draftId: draftId,
      showId: false,
    },
    { id: "selectSkillGroupSecond", endpoint: "draft/skill-group/list", draftId: draftId, showId: false },
    { id: "selectSubSkillGroupSecond", endpoint: "draft/sub-skill-group/list", draftId: draftId, showId: false },
    { id: "selectSkillGroupThird", endpoint: "draft/skill-group/list", draftId: draftId, showId: false },
    { id: "selectSubSkillGroupThird", endpoint: "draft/sub-skill-group/list", draftId: draftId, showId: false },
  ]);
  return [
    {
      dataId: "selectFunction",
      data: _function.data.map((item) => ({ id: item.Id, text: item.Name })),
    },
    {
      dataId: "selectAbbrvPosition",
      data: _abbrv.data.map((item) => ({ id: item.id, text: item.abbreviation })),
    },
    {
      dataId: "selectPrlOrg",
      data: prl.map((item) => ({ id: item, text: item })),
    },
    {
      dataId: "selectPrlOrgTo",
      data: prl.map((item) => ({ id: item, text: item })),
    },
    // {
    //   dataId: "selectCareerType",
    //   data: careerType.value.data.map((item) => ({ id: item.id, text: item.name })),
    // },
  ];
}

async function saveAsDraft() {
  const positionId = urlParams.get("unitCode");
  let type = "create";
  if (positionId) type = "edit";
  hideModal(`modalConfirm`);
  loader(true);
  const save = await saveInputAttribut(type);
  console.log("save", save.data.unit.unitCode);
  // loader(false);
  // return;
  if (save.status == 200) {
    const getPosition = $("#inputPositionName").val();
    const sanitizedPosition = encodeURIComponent(getPosition);
    swal("Saved", "Save as Draft", "success");
    setTimeout(() => {
      loader(false);
      if (localStorage.getItem("backPage") && localStorage.getItem("backPage") === "draft-detail") {
        window.location.href = "/organization/draft-detail?draftId=" + organizationAttribute.orgUnitId;
        return;
      }
      window.location.href =
        "/organization/index?focusNode=" + save.data.unit.unitCode + "&positionName=" + sanitizedPosition;
    }, 1500);
  } else {
    const message = save.message || save.title || "Failed to save job .";
    swal("Error", message, "error");
    loader(false);
  }
}

function addSubPosition() {
  const positionId = urlParams.get("unitCode");
  let type = "create";
  if (positionId) type = "edit";
  const dataAddSubPos = {};

  dataAddSubPos.subPosId = $("#modalInputSubPosId").val() == "" ? 0 : parseInt($("#modalInputSubPosId").val(), 10);
  dataAddSubPos.careerLevelCode = $("#modalSelectCareerLevel").val();
  dataAddSubPos.careerLevelName = $("#modalSelectCareerLevel option:selected").text();
  dataAddSubPos.careerTypeCode = $("#selectCareerType").val();
  dataAddSubPos.careerTypeName = $("#selectCareerType option:selected").text();
  dataAddSubPos.abbrvPositionCode = $("#modalSelectAbbrvPosition").val();
  dataAddSubPos.abbrvPositionName = $("#modalSelectAbbrvPosition option:selected").text();
  dataAddSubPos.modalInputSubPositionName = $("#modalInputSubPositionName").val();
  dataAddSubPos.modalSelectPrlOrgSubPos = parseInt($("#modalSelectPrlOrg").val());
  dataAddSubPos.modalSelectPrlOrgToSubPos = parseInt($("#modalSelectPrlOrgTo").val()) || 0;
  dataAddSubPos.modalInputFormation = parseInt($("#modalInputFormation").val());
  dataAddSubPos.unitCode = "";
  dataAddSubPos.unitName = $("#inputOrgUnitName").val();
  if (type == "edit") {
    dataAddSubPos.unitCode = positionId;
  }
  dataAddSubPos.unitParentCode = $("#selectOrgUnitParentName").val();
  dataAddSubPos.unitParentName = $("#selectOrgUnitParentName option:selected").text();
  let subJobPos = JSON.parse(localStorage.getItem("subJobPos"));
  console.log("dataAddSubPos", dataAddSubPos);
  //  count how many div with id include subPosDiv
  dataAddSubPos.formationBasket = [];
  const countsubPosDiv = $("[id^=subPosDiv]").length;
  console.log("countsubPosDiv", countsubPosDiv);
  if (countsubPosDiv >= 1) {
    let counted;
    for (let i = 1; i <= countsubPosDiv; i++) {
      counted = i;
      if (i == 1) {
        counted = "";
      }
      const prlOrg = $("#modalSelectPrlOrgSubPos" + counted).val() || "";
      dataAddSubPos.formationBasket.push({
        prlOrg: prlOrg,
        positionName: $("#modalInputSubPositionName" + counted).val(),
      });
    }
  }
  console.log("dataAddSubPos", dataAddSubPos);
  let id;
  const name =
    dataAddSubPos.formationBasket.length > 1
      ? dataAddSubPos.formationBasket.map((item) => item.positionName).join(", ")
      : dataAddSubPos.modalInputSubPositionName;
  if (dataAddSubPos.subPosId !== 0) {
    id = dataAddSubPos.subPosId;
    const index = subJobPos.findIndex((item) => item.subPosId == dataAddSubPos.subPosId);
    subJobPos[index] = {
      subPosId: id,
      unitCode: dataAddSubPos.unitCode,
      unitName: dataAddSubPos.unitName,
      unitParentCode: dataAddSubPos.unitParentCode,
      unitParentName: dataAddSubPos.unitParentName,
      jobPositionName: name,
      layer: 5,
      prlFrom: dataAddSubPos.modalSelectPrlOrgSubPos,
      prlTo: dataAddSubPos.modalSelectPrlOrgToSubPos,
      prlPlan: 4,
      formation: dataAddSubPos.modalInputFormation,
      careerLevel: {
        careerLevelCode: dataAddSubPos.careerLevelCode,
        careerLevelName: dataAddSubPos.careerLevelName,
      },
      careerType: {
        careerTypeCode: dataAddSubPos.careerTypeCode,
        careerTypeName: dataAddSubPos.careerTypeName,
      },
      abbrivation: {
        careerJobName: dataAddSubPos.abbrvPositionName,
        jobAbbrivationName: dataAddSubPos.abbrvPositionName.substring(0, 12),
        jobAbbrivationCode: dataAddSubPos.abbrvPositionCode,
        isNew: false,
      },
      formationBasket: dataAddSubPos.formationBasket,
    };
  } else {
    id = dataAddSubPos.subPosId !== 0 ? dataAddSubPos.subPosId : subJobPos.length + 1;
    subJobPos.push({
      subPosId: id,
      unitCode: dataAddSubPos.unitCode,
      unitName: dataAddSubPos.unitName,
      unitParentCode: dataAddSubPos.unitParentCode,
      unitParentName: dataAddSubPos.unitParentName,
      jobPositionName: name,
      layer: 5,
      prlFrom: dataAddSubPos.modalSelectPrlOrgSubPos,
      prlTo: dataAddSubPos.modalSelectPrlOrgToSubPos,
      prlPlan: 4,
      formation: dataAddSubPos.modalInputFormation,
      careerLevel: {
        careerLevelCode: dataAddSubPos.careerLevelCode,
        careerLevelName: dataAddSubPos.careerLevelName,
      },
      careerType: {
        careerTypeCode: dataAddSubPos.careerTypeCode,
        careerTypeName: dataAddSubPos.careerTypeName,
      },
      abbrivation: {
        careerJobName: dataAddSubPos.abbrvPositionName,
        jobAbbrivationName: dataAddSubPos.abbrvPositionName.substring(0, 12),
        jobAbbrivationCode: dataAddSubPos.abbrvPositionCode,
        isNew: false,
      },
      formationBasket: dataAddSubPos.formationBasket,
    });
  }
  localStorage.setItem("subJobPos", JSON.stringify(subJobPos));

  $("#modalAddSubPosition").modal("hide");
  swal("Saved", "Save Sub Position", "success");
  checkBasketSelected("Yes");
}

$("#inputPositionName").on("input", function () {
  const checkBasketSelected = $("#selectBasket").val();
  if (checkBasketSelected == "Yes") {
    $("#inputOrgUnitName").val($(this).val());
  }
});

function checkBasketSelected(selectBasket) {
  // $("#prlOrgDiv, #prlOrgToDiv").toggleClass("col-md-6 col-md-4");
  $("#subPositionDiv").hide();
  $("#careerLevelDiv, #abbrvPositionDiv, #formationDiv, #prlOrgToDiv").show();
  $("#selectPrlOrgTo").prop("disabled", true);
  $("#inputOrgUnitName").prop("disabled", false);
  // alert("masuk");
  if (selectBasket == "Yes") {
    $("#inputOrgUnitName").val($("#inputPositionName").val());
    // alert("masuk 1");
    const subJobPos = JSON.parse(localStorage.getItem("subJobPos"));
    // $("#prlOrgDiv, #prlOrgToDiv").removeClass("col-md-4").addClass("col-md-6");
    $("#subPositionDiv").show();
    $("#careerLevelDiv, #abbrvPositionDiv, #formationDiv").hide();
    $("#selectPrlOrgTo").prop("disabled", false);
    $("#inputOrgUnitName").prop("disabled", true);
    updateDivSubPosition(subJobPos);
  } else {
    $("#prlOrgToDiv").hide();
    localStorage.setItem("subJobPos", JSON.stringify([]));
  }
}

function addSubPos() {
  // duplicate div with id subPosDiv
  const newSubPosDiv = $("#subPosDiv").clone();
  const count = $(".sub-pos-card").length + 1;
  console.log("count", count);
  newSubPosDiv.attr("id", "subPosDiv" + count);

  // Remove existing Select2 containers from cloned div
  newSubPosDiv.find(".select2-container").remove();

  // find class add-sub-pos inside newSubPosDiv and change its class to delete-sub-pos
  newSubPosDiv.find(".add-sub-pos").removeClass("add-sub-pos").addClass("delete-sub-pos");
  // find id addSubPos and onClick to call function deleteSubPos
  newSubPosDiv.find("#addSubPos").attr("onclick", "deleteSubPos(`" + count + "`)");

  // change id to deleteSubPos
  newSubPosDiv.find("#addSubPos").attr("id", "deleteSubPos" + count);
  // change button class to btn-danger
  newSubPosDiv.find("#imageIcon").attr("src", "/assets/images/rasci/trash.svg");

  // find label for and input with id modalInputSubPositionName and change its id to modalInputSubPositionName + count
  newSubPosDiv.find(".form-label[for='modalInputSubPositionName']").attr("for", "modalInputSubPositionName" + count);
  newSubPosDiv
    .find("#modalInputSubPositionName")
    .attr("id", "modalInputSubPositionName" + count)
    .val("");
  // find label for and input with id modalSelectPrlOrgSubPos and change its id to modalSelectPrlOrgSubPos + count

  // remove #modalSelectPrlOrgSubPos and #modalSelectPrlOrgToSubPos

  // Update the first select (PRL Org)
  const firstSelect = newSubPosDiv.find("select").first();
  newSubPosDiv
    .find("label")
    .first()
    .attr("for", "modalSelectPrlOrgSubPos" + count);
  firstSelect.attr("id", "modalSelectPrlOrgSubPos" + count);
  firstSelect.val(null).trigger("change");

  // Update the second select (PRL Org To)
  // const secondSelect = newSubPosDiv.find("select").last();
  // newSubPosDiv
  //   .find("label")
  //   .last()
  //   .attr("for", "modalSelectPrlOrgToSubPos" + count);
  // secondSelect.attr("id", "modalSelectPrlOrgToSubPos" + count);
  // secondSelect.val(null).trigger("change");

  // Refresh Select2 for the new selects
  newSubPosDiv.find("select").each(function () {
    $(this).select2({
      dropdownParent: $("#modalAddSubPosition"),
    });
  });

  $("#subPosDiv").after(newSubPosDiv);
  // getDataList([
  //   // modalSelectPrlOrgSubPos
  //   {
  //     dataId: "modalSelectPrlOrgSubPos " + count,
  //     data: prl.map((item) => ({ id: item, text: item })),
  //     dropdownParent: $("#modalAddSubPosition"),
  //   },
  //   {
  //     dataId: "modalSelectPrlOrgToSubPos" + count,
  //     data: prl.map((item) => ({ id: item, text: item })),
  //     dropdownParent: $("#modalAddSubPosition"),
  //   },
  // ]);
  // find label for and input with id modalSelectPrlOrgToSubPos and change its id to modalSelectPrlOrgToSubPos + count
}

function deleteSubPos(countSubPosDiv) {
  console.log("countSubPosDiv", countSubPosDiv);
  $("#subPosDiv" + countSubPosDiv).remove();
}

// Function to update PRL To options based on PRL From value
function updatePrlToOptions(selectedPrlFrom, selectedPrlTo) {
  const selectedValue = selectedPrlFrom || $("#selectPrlOrg").val();
  if (!selectedValue) return;

  const prlIndex = prl.indexOf(parseInt(selectedValue));
  const prlToOptions = prl.slice(prlIndex + 1);

  // Only clear and repopulate if basket is selected
  if ($("#selectBasket").val() == "Yes") {
    $("#selectPrlOrgTo").empty();
    prlToOptions.forEach((value) => {
      $("#selectPrlOrgTo").append(new Option(value, value));
    });

    // If selectedPrlTo is provided, set it as the selected value
    if (selectedPrlTo && prlToOptions.includes(parseInt(selectedPrlTo))) {
      $("#selectPrlOrgTo").val(selectedPrlTo);
    }
  }
}

$(document).ready(async function () {
  loader(true);

  $("#selectPrlOrg").on("change", function () {
    // Only update if this is a manual change and basket is selected
    if ($("#selectBasket").val() == "Yes") {
      updatePrlToOptions($(this).val());
    }
  });

  // $('#selectPrlOrgTo').on('change', function () {
  //   alert('masok 2');
  // });
  $("#selectOrgUnitParentName").attr("disabled", true);
  // remove local storage subJobPos
  localStorage.setItem("subJobPos", JSON.stringify([]));

  $("#selectDirectReport").on("change", async function (event) {
    loader(true);
    // wait 200 ms
    // await new Promise((resolve) => setTimeout(resolve, 200));
    const value = event.target.value;
    const detailDirectReport = await getDetailJob(value);
    console.log("detailDirectReport", detailDirectReport);
    await fillAttributeDirectReport(detailDirectReport);
    // const detailDirectReport
  });

  $("#selectBasket").on("change", function (event) {
    // console.log("basket selected");
    const selectBasket = event.target.value;
    // alert("Basket selected: " + selectBasket);
    checkBasketSelected(selectBasket);
  });

  // Konfigurasi skill groups untuk pendekatan yang lebih dinamis
  const skillGroupConfigs = [
    {
      mainId: "selectSkillGroupMain",
      subId: "selectSubSkillGroupMain",
      label: "Skill Group Main",
    },
    {
      mainId: "selectSkillGroupSecond",
      subId: "selectSubSkillGroupSecond",
      label: "Skill Group Second",
    },
    {
      mainId: "selectSkillGroupThird",
      subId: "selectSubSkillGroupThird",
      label: "Skill Group Third",
    },
  ];

  // Helper function untuk setup skill group events
  function setupSkillGroupEvents(config) {
    const { mainId, subId, label } = config;

    // Event ketika skill group main berubah
    $(`#${mainId}`).on("change", function (event) {
      const value = event.target.value;
      $(`#${subId}`).val(null).trigger("change");

      if (value) {
        getDataListAsync([
          {
            id: subId,
            endpoint: "draft/sub-skill-group/list",
            draftId: organizationAttribute.orgUnitId,
            showId: false,
            dependOn: [
              {
                get: "text",
                inputType: "select2",
                urlParam: "skillGroup",
                valueFrom: mainId,
              },
            ],
          },
        ]);
      }
    });

    // Event ketika sub skill group dropdown dibuka
    $(`#${subId}`).on("select2:opening", function (e) {
      const skillGroupValue = $(`#${mainId}`).val();
      if (!skillGroupValue) {
        e.preventDefault();
        swal("Warning", `Please select ${label} first`, "warning");
        return false;
      }
    });
  }

  // Setup semua skill group events secara dinamis
  skillGroupConfigs.forEach((config) => setupSkillGroupEvents(config));

  // const selectPrlOrg = $("#selectPrlOrg").val();
  // const selectPrlOrgTo = $("#selectPrlOrgTo").val();
  // const selectCareerType = $("#selectCareerType").val();
  // ketika ada pergerakan di tiga id itu, career level harus di refresh
  $("#selectPrlOrg, #selectPrlOrgTo, #selectCareerType").on("change", function () {
    console.log("refresh career level");
    $("#selectCareerLevel").val(null).trigger("change");

    const params =
      $("#selectBasket").val() == "No"
        ? {
            get: "value",
            inputType: "select2",
            urlParam: "prlOrgFrom",
            valueFrom: "selectPrlOrg",
          }
        : {
            get: "value",
            inputType: "select2",
            urlParam: "prlOrgTo",
            valueFrom: "selectPrlOrgTo",
          };

    getDataListAsync([
      {
        id: "selectCareerLevel",
        endpoint: "draft/career-level/list",
        draftId: organizationAttribute.orgUnitId,
        showId: false,
        dependOn: [
          {
            get: "value",
            inputType: "select2",
            urlParam: "prlOrgFrom",
            valueFrom: "selectPrlOrg",
          },
          params,
          {
            get: "text",
            inputType: "select2",
            urlParam: "careerType",
            valueFrom: "selectCareerType",
          },
        ],
      },
    ]);
  });

  function getPrlRangeLimited() {
    const prlOrg = $("#modalSelectPrlOrg").val();
    const prlOrgTo = $("#modalSelectPrlOrgTo").val();
    // check if prlOrgTo or prlOrg is null or empty
    if (prlOrgTo == null || prlOrgTo == "" || prlOrg == null || prlOrg == "") {
      // semua option yang memili id berawalan modalSelectPrlOrgSubPos dihapus listnya
      $("[id^=modalSelectPrlOrgSubPos]").empty();
      return;
    }
    const listPrl = prl.filter((item) => item >= parseInt(prlOrg) && item <= parseInt(prlOrgTo));
    const prlRangeLimited = [];
    for (let i = 0; i < prlRange.length; i++) {
      const range = prlRange[i];
      const [start, end] = range.split("-").map(Number);
      // check if start or end is in listPrl
      if (listPrl.includes(start) || listPrl.includes(end)) {
        prlRangeLimited.push(range);
      }
    }
    return prlRangeLimited;
  }
  $("#modalSelectPrlOrg, #modalSelectPrlOrgTo").on("change", function () {
    // terus slicing prlRange
    // find all id that start with modalSelectPrlOrgSubPos and clear its options
    const prlRange = getPrlRangeLimited();
    if (!prlRange) return;
    const arrayObjDataList = [];
    $("[id^=modalSelectPrlOrgSubPos]").each(function () {
      $(this).empty();
      arrayObjDataList.push({
        dataId: $(this).attr("id"),
        data: prlRange.map((item) => ({ id: item, text: item })),
        dropdownParent: $("#modalAddSubPosition"),
      });
    });
    getDataListAsync([
      {
        id: "modalSelectCareerLevel",
        endpoint: "draft/career-level/list",
        draftId: organizationAttribute.orgUnitId,
        dropdownParent: $("#modalAddSubPosition"),
        showId: false,
        dependOn: [
          {
            get: "value",
            inputType: "select2",
            urlParam: "prlOrgFrom",
            valueFrom: "modalSelectPrlOrg",
          },
          {
            get: "value",
            inputType: "select2",
            urlParam: "prlOrgTo",
            valueFrom: "modalSelectPrlOrgTo",
          },
          {
            get: "text",
            inputType: "select2",
            urlParam: "careerType",
            valueFrom: "selectCareerType",
          },
        ],
      },
    ]);

    getDataList(arrayObjDataList);
  });

  // ketika salah satu modalSelectPrlOrgSubPos dipilih, maka yang lain harus di filter juga
  // $(document).on("change", "[id^=modalSelectPrlOrgSubPos]", function () {
  //   const prlRangeLimited = getPrlRangeLimited();
  //   if (!prlRangeLimited) return;

  //   const currentSelectId = $(this).attr("id");
  //   console.log("prlRangeLimited", prlRangeLimited);

  //   // Kumpulkan semua nilai yang sudah dipilih dari dropdown LAIN (exclude current dropdown)
  //   const allSelectedValues = [];
  //   $("[id^=modalSelectPrlOrgSubPos]").each(function () {
  //     const selectId = $(this).attr("id");
  //     const value = $(this).val();

  //     // Skip current dropdown yang sedang berubah
  //     if (selectId !== currentSelectId && value) {
  //       allSelectedValues.push(value);
  //     }
  //   });

  //   const uniqueSelectedValues = [...new Set(allSelectedValues)];
  //   console.log("uniqueSelectedValues", uniqueSelectedValues);

  //   // Update dropdown lain (exclude current dropdown)
  //   $("[id^=modalSelectPrlOrgSubPos]").each(function () {
  //     const $currentSelect = $(this);
  //     const currentValue = $currentSelect.val();
  //     const selectId = $currentSelect.attr("id");

  //     // Skip dropdown yang sedang berubah
  //     if (selectId === currentSelectId) {
  //       return;
  //     }

  //     // Filter data: hilangkan yang sudah dipilih dropdown lain, tapi pertahankan current value dropdown ini
  //     const filteredData = prlRangeLimited.filter((item) => {
  //       if (item === currentValue) {
  //         return true; // keep current value of this dropdown
  //       }
  //       return !uniqueSelectedValues.includes(item);
  //     });

  //     getDataList([
  //       {
  //         dataId: selectId,
  //         data: filteredData.map((item) => ({ id: item, text: item })),
  //         dropdownParent: $("#modalAddSubPosition"),
  //       },
  //     ]);

  //     // Restore value jika masih ada di filtered data
  //     if (currentValue && filteredData.includes(currentValue)) {
  //       $currentSelect.val(currentValue);
  //     }
  //   });
  // });

  $("#modalSelectCareerLevel").on("select2:opening", function (e) {
    // check selectPrlOrg selectPrlOrgTo dan text selectCareerType
    const selectPrlOrg = $("#modalSelectPrlOrg").val();
    const selectPrlOrgTo = $("#modalSelectPrlOrgTo").val();
    if (!selectPrlOrg || !selectPrlOrgTo) {
      e.preventDefault();
      swal("Warning", `Please select PRL Org range`, "warning");
      return false;
    }
  });
  $("#selectCareerLevel").on("select2:opening", function (e) {
    // check selectBasket
    const selectBasket = $("#selectBasket").val();
    if (selectBasket == "Yes") {
      return;
    }
    // check selectPrlOrg selectPrlOrgTo dan text selectCareerType
    const selectPrlOrg = $("#selectPrlOrg").val();
    const selectPrlOrgTo = $("#selectPrlOrgTo").val();
    const selectCareerType = $("#selectCareerType").val();
    if (!selectPrlOrg) {
      e.preventDefault();
      swal("Warning", `Please select PRL Org first`, "warning");
      return false;
    }
  });
  $("#selectCoordination").on("change", function (event) {
    const value = event.target.value;
    $("#selectCoordinationWith").attr("disabled", true);
    if (value == "Yes") {
      $("#selectCoordinationWith").attr("disabled", false);
    }
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
    await insertFormPosition(duplicate);
    // duplicateJob(duplicate);
  });

  $("#addSubPosition").click(function () {
    $("#modalAddSubPosition").modal("show");
    modalSubPosition();
  });

  $("#modalInputFormation").on("change", function (event) {
    const countFormation = event.target.value;
    const subPosDiv = $("#subPosDiv").children();
  });
  function subPosFormValidation() {
    const requiredFields = [
      { id: "modalSelectCareerLevel", name: "Career Level", value: $("#modalSelectCareerLevel").val() },
      { id: "modalSelectAbbrvPosition", name: "Abbreviation Position", value: $("#modalSelectAbbrvPosition").val() },
      { id: "modalSelectPrlOrg", name: "PRL Org", value: $("#modalSelectPrlOrg").val() },
      { id: "modalSelectPrlOrgTo", name: "PRL Org To", value: $("#modalSelectPrlOrgTo").val() },
      { id: "modalInputFormation", name: "Formation", value: $("#modalInputFormation").val() },
    ];

    // Cek field mana yang kosong
    const emptyFields = [];
    requiredFields.forEach((field) => {
      if (!field.value || field.value.trim() === "") {
        emptyFields.push(field.name);
      }
    });

    // Cek semua modalSelectPrlOrgSubPos juga harus diisi
    const prlSubPosFields = [];
    const selectedPrlValues = []; // Untuk cek duplikasi

    // check range prl limited
    const prlRange = getPrlRangeLimited();

    $("[id^=modalSelectPrlOrgSubPos]").each(function (index) {
      const value = $(this).val();
      const positionName = $("#modalInputSubPositionName" + (index === 0 ? "" : index + 1)).val();

      if (!value || value.trim() === "") {
        prlSubPosFields.push(`PRL Range for Position ${index + 1}`);
      } else {
        // Cek duplikasi PRL Range
        if (selectedPrlValues.includes(value)) {
          prlSubPosFields.push(`Duplicate PRL Range "${value}" found in Position ${index + 1}`);
        } else {
          selectedPrlValues.push(value);
        }
      }

      if (!positionName || positionName.trim() === "") {
        prlSubPosFields.push(`Position Name ${index + 1}`);
      }
    });

    // Check apakah semua PRL range sudah dipilih
    if (prlRange && selectedPrlValues.length > 0) {
      const unselectedRanges = prlRange.filter((range) => !selectedPrlValues.includes(range));
      if (unselectedRanges.length > 0) {
        prlSubPosFields.push(
          `PRL Ranges not assigned: ${unselectedRanges.join(
            ", ",
          )}. Please assign all available PRL ranges or adjust the range.`,
        );
      }
    }

    const allEmptyFields = [...emptyFields, ...prlSubPosFields];

    if (allEmptyFields.length > 0) {
      const fieldList = allEmptyFields.map((field) => `  • ${field}`).join("\n\n");
      swal("Validation Error", `Please fill in the following required fields:\n\n${fieldList}`, "warning");
      return false;
    }

    return true;
  }

  $("#saveSubPos").click(function () {
    const isValid = subPosFormValidation();
    if (!isValid) {
      return; // Stop execution if validation fails
    }
    // Proceed with save if validation passes
    addSubPosition();
  });

  // Bootstrap form validation
  function initializeFormValidation() {
    // Add CSS for Select2 invalid styling if not already added
    if (!document.getElementById("select2-validation-styles")) {
      const style = document.createElement("style");
      style.id = "select2-validation-styles";
      style.textContent = `
        .select2-container.is-invalid .select2-selection {
          border-color: #dc3545 !important;
          box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25) !important;
        }
        .select2-container.is-invalid .select2-selection--single {
          border-color: #dc3545 !important;
        }
      `;
      document.head.appendChild(style);
    }

    // Check all form controls with required attribute
    const form = document.querySelectorAll(".form-control[required], .form-select[required]");
    let hasErrors = false;
    const isBasket = $("#selectBasket").val();

    form.forEach((input) => {
      const type = input.type || input.tagName.toLowerCase();
      const value = input.value.trim();
      if (isBasket === "Yes" && (input.name === "selectCareerLevel" || input.id === "inputFormation")) {
        // Skip validation for career level and job family if basket is "Yes"
        return;
      } else {
        if (input.name === "prlOrgTo") {
          return;
        }
      }

      // Skip validation for certain fields if basket is "Yes"

      if (type === "text" || type === "number" || type === "email") {
        if (!value) {
          input.classList.add("is-invalid");
          hasErrors = true;
        } else {
          input.classList.remove("is-invalid");
        }
      } else if (input.tagName.toLowerCase() === "select" || type === "select-one") {
        // For Select2 dropdowns, find the Select2 container
        const select2Container = input.parentElement.querySelector(".select2-container");
        if (select2Container) {
          if (!value || value === "" || value === "null") {
            select2Container.classList.add("is-invalid");
            hasErrors = true;
          } else {
            select2Container.classList.remove("is-invalid");
          }
        } else {
          // Fallback for regular select elements
          if (!value || value === "" || value === "null") {
            input.classList.add("is-invalid");
            hasErrors = true;
          } else {
            input.classList.remove("is-invalid");
          }
        }
      }
      console.log("hasErrors", hasErrors);
      console.log("input", input);
      console.log("value", value);
    });
    // console.log errornya dimana

    return !hasErrors; // Return true if no errors, false if there are errors
  }

  // Real-time validation - remove invalid class when user fills the field
  function setupRealTimeValidation() {
    const form = document.querySelectorAll(".form-control[required], .form-select[required]");

    form.forEach((input) => {
      const type = input.type || input.tagName.toLowerCase();

      if (type === "text" || type === "number" || type === "email") {
        // Add event listener for input fields
        input.addEventListener("input", function () {
          if (this.value.trim()) {
            this.classList.remove("is-invalid");
          }
        });
      } else if (input.tagName.toLowerCase() === "select" || type === "select-one") {
        // Add event listener for select fields (including Select2)
        $(input).on("change", function () {
          const value = $(this).val();
          const select2Container = this.parentElement.querySelector(".select2-container");

          if (value && value !== "" && value !== "null") {
            if (select2Container) {
              select2Container.classList.remove("is-invalid");
            } else {
              this.classList.remove("is-invalid");
            }
          }
        });
      }
    });
  }

  // Initialize real-time validation
  setupRealTimeValidation();

  // Initialize form validation

  $("#saveAsDraft").click(function () {
    // Validate form before proceeding
    const isValid = initializeFormValidation();

    if (!isValid) {
      swal("Validation Error", "Please fill in all required fields before saving.", "warning");
      return;
    }

    // Proceed with save if validation passes
    const positionId = urlParams.get("unitCode");
    const positionName = $("#inputPositionName").val();
    const draftName = organizationAttribute.orgUnitName;
    let type = "Create";
    if (positionId) type = "Edit";
    let textButton = "Yes, " + type;
    const action = [
      {
        button: "Cancel",
        className: "btn-outline-dark",
        callback: function () {
          hideModal(`modalConfirm`);
        },
      },
      {
        button: textButton,
        className: "btn-primary",
        callbackFunction: "saveAsDraft",
      },
    ];
    modalConfrimHelper(
      "confirm",
      `${type} Position`,
      `Are you sure you want to ${type} the position <b>${positionName}</b> to the draft <b>${draftName}</b>?`,
      "",
      action,
      "50%",
      "",
    );
  });

  $("#back").click(function () {
    const backPage = localStorage.getItem("backPage");
    alert(backPage);
    if (backPage && backPage === "draft-detail") {
      window.location.href = "/organization/draft-detail?draftId=" + organizationAttribute.orgUnitId;
      return;
    }
    window.location.href = "/organization/index";
  });

  localStorage.setItem("logState", JSON.stringify(logData));
  checkDataOrganizationLocalStorage();
  const positionId = urlParams.get("unitCode");
  const updateDataDraft = await initializeList();
  getDataList(updateDataDraft);
  starter();
  if (positionId) {
    $("#headerForm").text("Edit Position");
    $("#breadcrumbForm").text("Edit Position");
    await insertFormPosition(positionId);
    const formattedParams = formattedInputAttribut("edit");
    let logState = JSON.parse(localStorage.getItem("logState"));
    logState.status = "edit";
    logState.initParams = formattedParams;
    localStorage.setItem("logState", JSON.stringify(logState));
  }
  loader(false);
});
