function detailDraft(id) {
  window.location.href = `/job-description/draft-detail`;
}

$(document).ready(async function () {
  $("#createJobDesc").click(function () {
    window.location.href = "/job-description/detail";
  });

  localStorage.getItem("statusManager")
    ? localStorage.getItem("statusManager")
    : localStorage.setItem("statusManager", "not available");
  localStorage.getItem("statusSbm")
    ? localStorage.getItem("statusSbm")
    : localStorage.setItem("statusSbm", "not available");

  let dataList = dataListJobDescription;
  dataList[0].jobStatus = localStorage.getItem("statusManager");
  dataList[1].jobStatus = localStorage.getItem("statusSbm");
  console.log("dataList", localStorage.getItem("statusManager"));
  getTableListJobDes(dataList);
  // $("#selectStatusJobDesc").select2({});

  $("#selectStatusJobDesc").on("change", function () {
    const value = $(this).val() ?? "";
    const search = $("#searchJobDesc").val() ?? "";
    filterListJobDesc(value, search);
  });

  $("#searchJobDesc").on("input", function () {
    const value = $("#selectStatusJobDesc").val() ?? "";
    const search = $(this).val() ?? "";
    filterListJobDesc(value, search);
  });

  $("#createDraft").click(function () {
    $("#modalCreateDraftJobDesc").modal("show");
  });

  $("#selectJobDescDraft").change(function () {
    const value = $(this).val();
    console.log("value", value);
    if (value == "1") {
      $("#pills-warningtab").attr("style", "display:none !important");
    } else {
      $("#pills-warningtab").show();
    }
  });
  getTableListDraft();
  getTableListApproval();
  getTableListLog();
});
