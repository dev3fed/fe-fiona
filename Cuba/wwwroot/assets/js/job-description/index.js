function detailDraft(id) {
  const data = id.split("|");
  draftExistingJobDesc.draftId = data[2];
  draftExistingJobDesc.draftRasciId = data[1];
  draftExistingJobDesc.draftOrganizationId = data[0];
  draftExistingJobDesc.draftName = data[3];
  localStorage.setItem("draftExistingJobDesc", JSON.stringify(draftExistingJobDesc));

  window.location.href = `/job-description/draft-detail?draftId=${draftExistingJobDesc.draftId}`;
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

  $("#saveDraft").click(async function () {
    // Save draft logic here
    // both inputDraftName and selectDraftRacsi must be filled
    const inputDraftName = $("#inputDraftName").val();
    const selectDraftRacsi = $("#selectDraftRacsi").val();
    if (inputDraftName == "" || selectDraftRacsi == null) {
      swal("Please fill in all required fields");
      return;
    }
    const confirmSave = await confirmFunction("Are you sure you want to save the draft?");
    if (!confirmSave) return;
    const saveData = await createDraft({
      draftName: inputDraftName,
      draftRasciId: selectDraftRacsi.split("|")[0],
      draftOrganizationId: selectDraftRacsi.split("|")[1],
    });
    if (saveData.status == 200) {
      swal("Draft saved successfully", { icon: "success" }).then(() => {
        location.reload();
      });
    } else {
      swal("Failed to save draft", { icon: "error" });
    }
  });

  // get draft list
  const dataListDraft = await draftList();
  const rasciList = await getRasciList();
  console.log("rasciList", rasciList);
  getDataList([
    {
      dataId: "selectJobDescDraft",
      data: dataListDraft.data.map((item) => ({
        id: item.draftOrganizationId + "|" + item.draftRasciId + "|" + item.draftId,
        text: item.draftName,
      })),
    },
    {
      dataId: "selectDraftRacsi",
      data: rasciList.data.result.map((item) => ({
        id: item.id + "|" + item.draftSo,
        text: item.text,
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
    const value = $(this).val();
    console.log("Selected draft:", value);
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
