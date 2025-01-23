$(document).ready(async function () {
  // check query url

  checkLocalStorage();
  let activeTab = "identifikasi";
  if (activeTab) {
    const linkTab = "#v-pills-" + activeTab + "-tab";
    $(linkTab).tab("show");
  }

  const urlParams = new URLSearchParams(window.location.search);
  const idPos = urlParams.get("id");
  const isCrete = urlParams.get("create");
  if (idPos) {
    if (isCrete) {
      const findData = dataJobDesc.find((item) => item.identifikasi.id == idPos);
      $("#selectJobReference").val(findData.identifikasi.id);
      getJobReference(findData);
    } else {
      const findData = await dataJobDescCompare.find((item) => item.identifikasi.id == idPos);
      $("#selectJobReference").append(
        `<option value="${findData.identifikasi.id}">${findData.identifikasi.jobName}</option>`
      );
      $("#selectJobReference").val(findData.identifikasi.id);
      let dataFungsi = [{ fungsi: findData.fungsi }];
      let tugasHa = findData.tugasHa;
      let koordinasi = findData.koordinasi;
      let relation = findData.relation;
      localStorage.setItem("fungsi", JSON.stringify(dataFungsi));
      localStorage.setItem("tugasHa", JSON.stringify(tugasHa));
      localStorage.setItem("koordinasi", JSON.stringify(koordinasi));
      localStorage.setItem("relation", JSON.stringify(relation));

      getJobReference(findData);
      await getJobReferenceDetail();
    }
  }

  $(".summernote").summernote({
    height: 300,
    tabsize: 2,
    // disable font type button
    toolbar: [
      // [groupName, [list of button]]
      ["style", ["bold", "italic", "underline", "clear"]],
      ["font", ["strikethrough", "superscript", "subscript"]],
      ["para", ["ul", "ol", "paragraph"]],
    ],
  });
  $(".summernote").summernote("disable");

  $("#rangePercentage").ionRangeSlider({
    grid: true,
    grid_num: 5,
    min: 50,
    max: 100,
    step: 10,
  });

  // getJobReference(dataJobDesc);
  // await applySelectedData();
  // await getJobReferenceDetail();

  // multiSelect({ selectID: "JobReference", type: "jobposition" });

  // on change selectJobReference
  $("#selectJobReference").on("change", function (e) {
    const data = e.target.value;
    console.log("data", data);
    const findData = dataJobDesc.find((item) => item.identifikasi.id == data);
    console.log("findData", findData);
    getJobReference(findData);
    isDisableButton(false);
    $(".summernote").summernote("enable");
  });

  $("#saveReference").on("click", async function () {
    await getJobReferenceDetail();
    // hide modal
    $("#modalJobCompare").modal("hide");
  });

  $("#saveDraft").on("click", async function () {
    swal({
      title: "Are you sure?",
      text: "You will save this job description as draft",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willSave) => {
      if (willSave) {
        // redirectTo("job-description");
        const url = "/job-description/index";
        window.location.href = url;
        localStorage.setItem("statusManager", "on progress");
      }
    });
  });

  // searchReferenceBy radio button
  $("input[name='searchReferenceBy']").on("change", function () {
    const value = $(this).val();
    $("#percentageDiv").hide();
    $("#searchDiv").show();

    if (value == "searchByPercentage") {
      $("#percentageDiv").show();
      $("#searchDiv").hide();
    }
  });

  // dataListJobDescription[0].jobStatus = localStorage.getItem("statusManager");
  // dataListJobDescription[1].jobStatus = localStorage.getItem("statusSbm");
});
