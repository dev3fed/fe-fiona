$(document).ready(function () {
  // check query url
  const urlParams = new URLSearchParams(window.location.search);
  const activeTab = urlParams.get("activeTab");
  const draftId = urlParams.get("draftId");
  // duplicateDiv

  let typeId = "uniqueId";
  let identifier = "";
  if (draftId) {
    typeId = "draftId";
    identifier = draftId;
  }
  checkUniqueCode(typeId, identifier);
  defaultState();
  getAllMutiselect();
  defaultTab();

  if (activeTab) {
    const currentTab = $(".tab.active").attr("id");
    const activeTabz = tabArray[parseInt(activeTab)];

    $("#" + currentTab).removeClass("active");
    $("#" + currentTab).hide();

    $("#" + activeTabz).addClass("active");
    $("#" + activeTabz).show();

    const spanBefore = document.querySelectorAll("span." + currentTab);
    spanBefore.forEach((span) => {
      span.classList.remove("active");
      span.classList.add("active-last");
    });
    const spanAfter = document.querySelectorAll("span." + activeTabz);
    spanAfter.forEach((span) => {
      span.classList.add("active");
    });

    if (activeTabz === "preview") {
      $("#next").hide();
      $("#back").show();
    }
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
    // addSubPosition();
    // alert("open modal");
    modalSubPosition(true);
  });

  // click new subordinate
  $("#newSubordinate").click(function () {
    window.location.href = "/organization/new-subordinate";
    localStorage.removeItem("uniquePosCode");
    localStorage.setItem("uniquePosCode", uuidv4());
  });

  $("#newJob").click(function () {
    window.location.href = "/organization/detail";
  });

  $("#duplicateJob").click(function () {
    window.location.href = "/organization/detailzz?duplicate=true";
  });

  $("#duplicateButton").click(async function () {
    // detailJobPositionByCode
    // const cleanUrl = window.location.origin + window.location.pathname;
    // history.replaceState(null, "", cleanUrl);
    const duplicate = $("#selectJobReference").val();
    // alert(duplicate);
    // return;
    const param = await detailJobPositionByCode(duplicate);
    // const param = await detailJobPositionByCode("30261353"); //SAM Retail Kediri
    duplicateJob(param?.data);
  });

  // click duplicate subordinate
  $("#duplicateSubordinate").click(function () {});

  $("#saveSubPos").click(function () {
    helperSaveSubPosition();
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

  // saveAsDraft

  $("#saveAsDraft").click(function () {
    swal({
      title: "Are you sure?",
      text: "You will save this job as draft",
      icon: "warning",
      buttons: true,
      dangerMode: true,
      // async await
    }).then(async (willSave) => {
      if (willSave) {
        await saveInputAttribut();
        await saveInputSgSsg();
        await checkUniqueCode();
        // redirect to list draft
        window.location.href = "/organization/index?activeTab=draft";
      }
    });
  });

  // detailChartPreview("os-container", draftDetail?.directReport, res.data);
});
