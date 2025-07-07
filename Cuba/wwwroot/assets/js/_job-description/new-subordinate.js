$(document).ready(function () {
  checkUniqueCodeSubordinate();
  defaultState();
  getAllMutiselect();
  defaultTab();

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
    $("#selectDirectReport").attr("disabled", true);
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
    $("#subPositionDiv").hide();
    $("#abbrvPositionDiv").show();
    $("#formationDiv").show();
    $("#selectPrlOrgTo").attr("disabled", true);
    if (selectBasket == "Yes") {
      $("#subPositionDiv").show();
      $("#abbrvPositionDiv").hide();
      $("#formationDiv").hide();
      $("#selectPrlOrgTo").attr("disabled", false);
    }
  });

  $("#next").click(function () {
    nextTab();
  });

  $("#back").click(function () {
    previousTab();
  });

  // click add sub position
  $("#addSubPosition").click(function () {
    statusAction = "add";
    modalSubPosition(true);
  });

  // click new subordinate
  $("#newSubordinate").click(function () {
    window.location.href = "/organization/new-subordinate";
  });

  $("#newJob").click(function () {
    window.location.href = "/organization/detail";
  });

  // $("#duplicateJob").click(function () {
  //   window.location.href = "/organization/detail";
  // });

  // click duplicate subordinate
  $("#duplicateSubordinate").click(function () {});

  $("#saveSubPos").click(function () {
    // alert("saveSubordinate");
    helperSaveSubPositionSubordinate();
  });

  $("#saveSubordinate").click(function () {
    helperSaveSubordinate();
    // move to detail page
    window.location.href = "/organization/detail?activeTab=1";
  });

  $("#backToDetail").click(function () {
    window.location.href = "/organization/detail?activeTab=1";
  });

  // // editSubPosition button on table subPositionList
  // $("#subPositionList").on("click", ".editSubPosition", function () {
  //   alert("editSubPosition");
  //   // const uniquePosCode = $(this).data("uniqueposcode");
  //   // editSubPosition(uniquePosCode);
  // });

  // $("#subPositionList").on("click", ".deleteSubPosition", function () {
  //   alert("deleteSubPosition");
  //   // const uniquePosCode = $(this).data("uniqueposcode");
  //   // deleteSubPosition(uniquePosCode);
  // });
});
