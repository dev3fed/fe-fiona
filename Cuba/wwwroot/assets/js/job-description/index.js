$(document).ready(function () {
  $("#createJobDesc").click(function () {
    window.location.href = "/job-description/detail";
  });

  localStorage.getItem("statusManager")
    ? localStorage.getItem("statusManager")
    : localStorage.setItem("statusManager", "not available");
  localStorage.getItem("statusSbm")
    ? localStorage.getItem("statusSbm")
    : localStorage.setItem("statusSbm", "not available");

  getDataList([
    {
      dataId: "selectDraftOrganization",
      data: lsListDraft.map((item) => ({ id: item.draftId, text: item.draftName })),
    },
  ]);
  checkDataOrganization();

  let dataList = dataListJobDescription;
  dataList[0].jobStatus = localStorage.getItem("statusManager");
  dataList[1].jobStatus = localStorage.getItem("statusSbm");
  getTableListJobDes(dataList);

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
});

$("#selectDraftOrganization").change(function () {
  changeOrganization($("#selectDraftOrganization").val(), $("#selectDraftOrganization option:selected").text());
});
