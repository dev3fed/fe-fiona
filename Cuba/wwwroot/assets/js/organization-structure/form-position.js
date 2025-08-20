function starter() {
  $("#selectPrlOrgTo").attr("disabled", true);
  $("#selectCoordinationWith").attr("disabled", true);
  $("#subPositionDiv").hide();
}

async function initializeList() {
  const _function = await functionList(organizationAttribute.orgUnitId);
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
    { id: "selectCareerType", endpoint: "draft/career-type/list", draftId: draftId },
    { id: "selectCareerLevel", endpoint: "draft/career-level/list", draftId: draftId },
    // { id: "selectAbbrvPosition", endpoint: "draft/job-abbriviation/list", draftId: draftId },
    { id: "selectPersonalAreaName", endpoint: "draft/personnel-area/list", draftId: draftId },
    { id: "selectPersonalSubareaName", endpoint: "draft/personnel-sub-area/list", draftId: draftId },
    { id: "selectOrgUnitParentName", endpoint: "draft/unit/list", draftId: draftId },
    { id: "selectDirectReport", endpoint: "draft/position/list", draftId: draftId },
    { id: "selectSkillGroupMain", endpoint: "draft/skill-group/list", draftId: draftId },
    { id: "selectSubSkillGroupMain", endpoint: "draft/sub-skill-group/list", draftId: draftId },
    { id: "selectSkillGroupSecond", endpoint: "draft/skill-group/list", draftId: draftId },
    { id: "selectSubSkillGroupSecond", endpoint: "draft/sub-skill-group/list", draftId: draftId },
    { id: "selectSkillGroupThird", endpoint: "draft/skill-group/list", draftId: draftId },
    { id: "selectSubSkillGroupThird", endpoint: "draft/sub-skill-group/list", draftId: draftId },
  ]);
  return [
    {
      dataId: "selectFunction",
      data: _function.data.map((item) => ({ id: item.functionCode, text: item.functionName })),
    },
    {
      dataId: "selectAbbrvPosition",
      data: _abbrv.data.map((item) => ({ id: item.id, text: item.name })),
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
  loader(true);
  // return;
  const save = await saveInputAttribut(type);
  console.log("save", save);
  if (save) {
    hideModal(`modalConfirm`);
    loader(false);
    swal("Saved", "Save as Draft", "success");
    setTimeout(() => {
      window.location.href = "/organization/index?focusNode=" + save.data.unitCode;
    }, 2000);
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
  dataAddSubPos.modalSelectPrlOrgSubPos = parseInt($("#modalSelectPrlOrgSubPos").val());
  dataAddSubPos.modalSelectPrlOrgToSubPos = parseInt($("#modalSelectPrlOrgToSubPos").val()) || 0;
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
  let id;
  if (dataAddSubPos.subPosId !== 0) {
    id = dataAddSubPos.subPosId;
    const index = subJobPos.findIndex((item) => item.subPosId == dataAddSubPos.subPosId);
    subJobPos[index] = {
      subPosId: id,
      unitCode: dataAddSubPos.unitCode,
      unitName: dataAddSubPos.unitName,
      unitParentCode: dataAddSubPos.unitParentCode,
      unitParentName: dataAddSubPos.unitParentName,
      jobPositionName: dataAddSubPos.modalInputSubPositionName,
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
    };
  } else {
    id = dataAddSubPos.subPosId !== 0 ? dataAddSubPos.subPosId : subJobPos.length + 1;
    subJobPos.push({
      subPosId: id,
      unitCode: dataAddSubPos.unitCode,
      unitName: dataAddSubPos.unitName,
      unitParentCode: dataAddSubPos.unitParentCode,
      unitParentName: dataAddSubPos.unitParentName,
      jobPositionName: dataAddSubPos.modalInputSubPositionName,
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
    });
  }
  localStorage.setItem("subJobPos", JSON.stringify(subJobPos));

  $("#modalAddSubPosition").modal("hide");
  swal("Saved", "Save Sub Position", "success");
  checkBasketSelected("Yes");
}

function deleteSubPos(countSubPosDiv) {
  $("#rowPosDiv" + countSubPosDiv).remove();
}

function checkBasketSelected(selectBasket) {
  // $("#prlOrgDiv, #prlOrgToDiv").toggleClass("col-md-6 col-md-4");
  $("#subPositionDiv").hide();
  $("#careerLevelDiv, #abbrvPositionDiv, #formationDiv").show();
  $("#selectPrlOrgTo").prop("disabled", true);
  // alert("masuk");
  if (selectBasket == "Yes") {
    // alert("masuk 1");
    const subJobPos = JSON.parse(localStorage.getItem("subJobPos"));
    // $("#prlOrgDiv, #prlOrgToDiv").removeClass("col-md-4").addClass("col-md-6");
    $("#subPositionDiv").show();
    $("#careerLevelDiv, #abbrvPositionDiv, #formationDiv").hide();
    $("#selectPrlOrgTo").prop("disabled", false);
    updateDivSubPosition(subJobPos);
  }
}

$(document).ready(async function () {
  loader(true);

  $("#selectBasket").on("change", function (event) {
    // console.log("basket selected");
    const selectBasket = event.target.value;
    alert("Basket selected: " + selectBasket);
    checkBasketSelected(selectBasket);
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
    insertFormPostion(duplicate);
    // duplicateJob(duplicate);
  });

  $("#addSubPosition").click(function () {
    $("#modalAddSubPosition").modal("show");
    modalSubPosition();
  });

  $("#modalInputFormation").on("change", function (event) {
    const countFormation = event.target.value;
    const subPosDiv = $("#subPosDiv").children();
    console.log(countFormation);
  });

  $("#saveSubPos").click(function () {
    // swal("Saved", "Save Sub Position", "success");
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

    form.forEach((input) => {
      const type = input.type || input.tagName.toLowerCase();
      const value = input.value.trim();

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
    });

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
    let type = "create";
    if (positionId) type = "edit";
    const action = [
      {
        button: "Cancel",
        className: "btn-outline-dark",
        callback: function () {
          hideModal(`modalConfirm`);
        },
      },
      {
        button: type,
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
      ""
    );
  });

  $("#back").click(function () {
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
    await insertFormPostion(positionId);
    const formattedParams = formattedInputAttribut("edit");
    let logState = JSON.parse(localStorage.getItem("logState"));
    logState.status = "edit";
    logState.initParams = formattedParams;
    localStorage.setItem("logState", JSON.stringify(logState));
  }
  loader(false);
});
