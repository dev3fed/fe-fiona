function updateDraftLs(id) {
  const data = id.split("|");
  draftExistingJobDesc.draftOrganizationId = data[0];
  draftExistingJobDesc.draftRasciId = data[1];
  draftExistingJobDesc.draftId = data[2];
  draftExistingJobDesc.draftName = data[3];
  localStorage.setItem("draftExistingJobDesc", JSON.stringify(draftExistingJobDesc));
  $("#selectJobDescDraft").append(
    new Option(
      draftExistingJobDesc.draftName,
      draftExistingJobDesc.draftOrganizationId +
        "|" +
        draftExistingJobDesc.draftRasciId +
        "|" +
        draftExistingJobDesc.draftId +
        "|" +
        draftExistingJobDesc.organizationDraftId,
      true,
      true
    )
  );
}

async function checkDraftSelected(listDraft) {
  localStorage.getItem("draftExistingJobDesc") ??
    localStorage.setItem("draftExistingJobDesc", JSON.stringify(draftExistingJobDesc));
  const data = JSON.parse(localStorage.getItem("draftExistingJobDesc"));
  console.log("data draftExistingJobDesc from ls", draftExistingJobDesc);
  Object.keys(draftExistingJobDesc).forEach((key) => {
    if (data[key]) {
      draftExistingJobDesc[key] = data[key];
    }
  });

  if (draftExistingJobDesc.draftId == "" || draftExistingJobDesc.draftId == null) {
    // get first draft
    const firstDraft = listDraft[0];
    draftExistingJobDesc.draftId = firstDraft.draftId;
    draftExistingJobDesc.draftRasciId = firstDraft.draftRasciId ? firstDraft.draftRasciId : "";
    draftExistingJobDesc.draftOrganizationId = firstDraft.draftOrganizationId ? firstDraft.draftOrganizationId : "";
    draftExistingJobDesc.draftName = firstDraft.draftName ? firstDraft.draftName : "";
    draftExistingJobDesc.organizationDraftId = firstDraft.organizationDraftId ? firstDraft.organizationDraftId : "";
    localStorage.setItem("draftExistingJobDesc", JSON.stringify(draftExistingJobDesc));
  }
  console.log("draftExistingJobDesc", draftExistingJobDesc);
  const draftId =
    draftExistingJobDesc.draftId +
    "|" +
    (draftExistingJobDesc.draftRasciId ? draftExistingJobDesc.draftRasciId : "") +
    "|" +
    draftExistingJobDesc.draftOrganizationId +
    "|" +
    draftExistingJobDesc.draftName +
    "|" +
    draftExistingJobDesc.organizationDraftId;
  // append value to input
  console.log("Selected draft :>", draftId);
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
    // loader(true);
    // return;
    if (!confirm) return;
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
    console.log("saveData", saveData);
    if (saveData.status == 200) {
      $("#modalCreateDraftJobDesc").modal("hide");
      swal("Success", "Draft saved successfully", "success");
      // location.reload();
      updateDraftLs(
        saveData.data.draftOrganizationId +
          "|" +
          saveData.data.draftRasciId +
          "|" +
          saveData.data.draftId +
          "|" +
          saveData.data.draftName +
          "|" +
          saveData.data.organizationDraftId
      );
    } else {
      swal("Failed to save draft", { icon: "error" });
    }
  });

  // get draft list
  const dataListDraft = await draftList();
  const rasciList = await getRasciList();
  console.log("dataListDraft", dataListDraft);
  console.log("rasciList", rasciList);
  const test = dataListDraft.data[0];
  console.log("test", test);
  console.log(
    `${test.draftId}|${test.draftRasciId ? test.draftRasciId : ""}|${test.draftOrganizationId}|${test.draftName}|${
      test.organizationDraftId
    }`
  );

  getDataList([
    {
      dataId: "selectJobDescDraft",
      data: dataListDraft.data.map((item) => ({
        id: `${item.draftId}|${item.draftRasciId ? item.draftRasciId : ""}|${item.draftOrganizationId}|${
          item.draftName
        }|${item.organizationDraftId}`,
        text: item.draftName,
      })),
    },
    {
      dataId: "selectDraftRacsi",
      data: rasciList.data.result.map((item) => ({ id: item.id + "|" + item.draftSo, text: item.text })),
      dropdownParent: $("#modalCreateDraftJobDesc"),
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
    console.log("data draft selected:", data);
    draftExistingJobDesc.draftId = data[0];
    draftExistingJobDesc.draftRasciId = data[1];
    draftExistingJobDesc.draftOrganizationId = data[2];
    draftExistingJobDesc.draftName = $(this).find("option:selected").text();
    draftExistingJobDesc.organizationDraftId = data[4];
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
