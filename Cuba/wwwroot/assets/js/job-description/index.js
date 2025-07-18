function detailDraft(id) {
  window.location.href = `/job-description/draft-detail`;
}

async function checkDraftSelected(listDraft) {
  localStorage.getItem("draftExistingJobDesc") ??
    localStorage.setItem("draftExistingJobDesc", JSON.stringify(draftExistingJobDesc));
  const data = JSON.parse(localStorage.getItem("draftExistingJobDesc"));
  Object.keys(draftExistingJobDesc).forEach((key) => {
    if (data[key]) {
      draftExistingJobDesc[key] = data[key];
    }
  });

  if (draftExistingJobDesc.draftId == "" || draftExistingJobDesc.draftId == null) {
    // get first draft
    const firstDraft = listDraft[0];
    draftExistingJobDesc.draftId = firstDraft.draftId;
    draftExistingJobDesc.draftRasciId = firstDraft.draftRasciId;
    draftExistingJobDesc.draftOrganizationId = firstDraft.draftOrganizationId;
    draftExistingJobDesc.draftName = firstDraft.draftName;
    localStorage.setItem("draftExistingJobDesc", JSON.stringify(draftExistingJobDesc));
  }

  const draftId =
    draftExistingJobDesc.draftOrganizationId +
    "|" +
    draftExistingJobDesc.draftRasciId +
    "|" +
    draftExistingJobDesc.draftId;
  // append value to input
  $("#selectJobDescDraft").val(draftId).trigger("change");
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

  // get draft list
  const dataListDraft = await draftList();
  getDataList([
    {
      dataId: "selectJobDescDraft",
      data: dataListDraft.data.map((item) => ({
        id: item.draftOrganizationId + "|" + item.draftRasciId + "|" + item.draftId,
        text: item.draftName,
      })),
    },
  ]);
  checkDraftSelected(dataListDraft.data);

  // get data for table job description list
  getTableListJobDes();

  $("#selectStatusJobDesc").on("change", function () {
    // const value = $(this).val() ?? "";
    // const search = $("#searchJobDesc").val() ?? "";
    // filterListJobDesc(value, search);
    getTableListJobDes();
  });

  // function onSelectType(text) {
  //   setState("selectedType", text);
  //   document.getElementById("btnSearchType").innerText = text;
  //   document.getElementById("inputText").value = "";
  // }

  $(".di").on("click", function () {
    const value = $(this).attr("value");
    console.log("Selected type:", value);
    document.getElementById("btnSearchType").innerText = value.charAt(0).toUpperCase() + value.slice(1);
  });

  // ketika inputan serach selesai ketik
  $("#searchFilter").on("click", function () {
    // const value = $("#selectStatusJobDesc").val() ?? "";
    // const search = $(this).val() ?? "";
    // filterListJobDesc(value, search);
    getTableListJobDes();
  });

  $("#clearFilter").on("click", function () {
    $("#searchJobDesc").val("");
    $("#selectStatusJobDesc").val("all");
    getTableListJobDes();
  });

  $("#createDraft").click(function () {
    $("#modalCreateDraftJobDesc").modal("show");
  });

  $("#selectJobDescDraft").change(function () {
    const value = $(this).val();
    if (value == "1") {
      $("#pills-warningtab").attr("style", "display:none !important");
    } else {
      $("#pills-warningtab").show();
    }
  });

  getTableListApproval();
  getTableListLog();

  checkDraftSelected(dataListDraft.data);

  $("#selectJobDescDraft").on("change", function () {
    const value = $(this).val();
    const data = value.split("|");
    draftExistingJobDesc.draftId = data[2];
    draftExistingJobDesc.draftRasciId = data[1];
    draftExistingJobDesc.draftOrganizationId = data[0];
    draftExistingJobDesc.draftName = $(this).find("option:selected").text();
    localStorage.setItem("draftExistingJobDesc", JSON.stringify(draftExistingJobDesc));
  });
});
