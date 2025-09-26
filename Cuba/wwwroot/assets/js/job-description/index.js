function detailDraft(id) {
  window.location.href = `/job-description/draft-detail?draftId=${id}`;
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

  // disable selectJobDescDraft if draftId is not empty
  // $("#selectJobDescDraft").prop("disabled", true);
}

$(document).ready(async function () {
  $("#createJobDesc").click(function () {
    window.location.href = "/job-description/detail";
  });

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
  await checkDraftSelected(dataListDraft.data);
  updateNotifNotAvailable();

  await getTableListDraft(dataListDraft.data);

  //

  $("#notifNotAvailable").click(function () {
    // scroll to table list job description
    $("#selectStatusJobDesc").val("not available").trigger("change");
  });

  // get data for table job description list
  getTableListJobDes();

  $("#selectStatusJobDesc").on("change", function () {
    getTableListJobDes();
  });

  $(".di").on("click", function () {
    const value = $(this).attr("value");
    console.log("Selected type:", value);
    document.getElementById("btnSearchType").innerText = value.charAt(0).toUpperCase() + value.slice(1);
  });

  // ketika inputan serach selesai ketik
  $("#searchFilter").on("click", function () {
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

  getTableListApproval();
  getTableListLog();

  checkDraftSelected(dataListDraft.data);

  $("#selectJobDescDraft").change(function () {
    alert("maok");
    const value = $(this).val();
    if (value == "1") {
      $("#pills-warningtab").hide();
      $("#pills-draft, #pills-request, #pills-log").hide();
    } else {
      $("#pills-warningtab").show();
    }
    const data = value.split("|");
    draftExistingJobDesc.draftId = data[2];
    draftExistingJobDesc.draftRasciId = data[1];
    draftExistingJobDesc.draftOrganizationId = data[0];
    draftExistingJobDesc.draftName = $(this).find("option:selected").text();
    localStorage.setItem("draftExistingJobDesc", JSON.stringify(draftExistingJobDesc));
    if (draftExistingJobDesc.draftId != "" && draftExistingJobDesc.draftId != null) {
      getTableListJobDes();
      updateNotifNotAvailable();
    }
  });

  function updateNotifNotAvailable() {
    console.log("updateNotifNotAvailable");
    $("#notifNotAvailable").hide();
    draftListJobDesc({
      draftId: draftExistingJobDesc.draftId,
      position: "",
      status: "not available",
      pageSize: 10,
    }).then((result) => {
      $("#notifNotAvailable").show();
      $("#notifNotAvailable").text(
        `There are ${result.count} positions with job descriptions not available. Click here to show.`
      );
    });
  }
});
