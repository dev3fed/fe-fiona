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
      true,
    ),
  );
}

function detailDraft(params) {
  updateDraftLs(params);
  window.location.href = "/job-description/draft-detail?draftId=" + draftExistingJobDesc.draftId;
}

function checkDraftSelected(listDraft) {
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
          saveData.data.organizationDraftId,
      );
    } else {
      swal("Failed to save draft", { icon: "error" });
    }
  });

  // get draft list
  const dataListDraft = await draftList(1, 9999);
  const dataListApproval = await draftApprovalList(1, 9999);
  const rasciList = await getRasciList();
  storeData.listDraft = dataListDraft.data;
  storeData.listApproval = dataListApproval.data;
  storeData.rasciList = rasciList.data;
  console.log("storeData.listDraft", storeData.listDraft);

  getDataList([
    {
      dataId: "selectJobDescDraft",
      data: storeData.listDraft.map((item) => ({
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
  checkDraftSelected(storeData.listDraft);
  updateNotifNotAvailable();

  getTableListDraft(storeData.listDraft.filter((x) => x.draftId != defaultMasterId));
  getTableListApproval(storeData.listApproval);

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

  getTableListLog();

  checkDraftSelected(storeData.listDraft);

  function updateDraftSelection(data, selectedElement) {
    draftExistingJobDesc.draftId = data[0];
    draftExistingJobDesc.draftRasciId = data[1];
    draftExistingJobDesc.draftOrganizationId = data[2];
    draftExistingJobDesc.draftName = selectedElement.find("option:selected").text();
    draftExistingJobDesc.organizationDraftId = data[4];
    localStorage.setItem("draftExistingJobDesc", JSON.stringify(draftExistingJobDesc));
    if (draftExistingJobDesc.draftId != "" && draftExistingJobDesc.draftId != null) {
      getTableListJobDes();
      updateNotifNotAvailable();
    }
    $("#pillsJDSection").show();
    if (draftExistingJobDesc.draftId == defaultMasterId) {
      $("#pillsJDSection").attr("style", "display:none !important");
    }
  }

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
    updateDraftSelection(data, $(this));
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
        `There are ${result.count} positions with job descriptions not available. Click here to show.`,
      );
    });
  }

  // Generic filter function that works for both approvals and drafts
  function applyFilters(filterType) {
    const isApproval = filterType === "approval";
    const dataSource = isApproval ? storeData.listApproval : storeData.listDraft;

    if (!dataSource) return;

    let filteredData = [...dataSource];

    // Get filter values based on type
    if (isApproval) {
      const searchTerm = $("#searchApproval").val();
      const approvalDate = $("#approvalDate").val();
      const submittedDate = $("#submittedDate").val();
      const statusApproval = $("#statusApproval").val();

      // Apply status filter for approvals
      if (statusApproval && statusApproval !== "all") {
        filteredData = filteredData.filter((data) => {
          const statusMap = {
            isSubmitted: () => data.isSubmitted && !data.isRejected && !data.isApproved && !data.isFinalized,
            isRejected: () => data.isRejected && !data.isApproved,
            isApproved: () => data.isApproved,
            isFinalized: () => data.isFinalized,
          };
          return statusMap[statusApproval] ? statusMap[statusApproval]() : true;
        });
      }

      // Apply search filter
      if (searchTerm) {
        filteredData = filteredData.filter((item) => item.draftName.toLowerCase().includes(searchTerm.toLowerCase()));
      }

      // Apply date filters for approvals
      if (approvalDate || submittedDate) {
        try {
          filteredData = filteredData.filter((approval) => {
            let matches = true;

            if (approvalDate) {
              const filterDate = new Date(approvalDate).toDateString();
              const targetDate = approval.approvedDate || approval.rejectedDate;
              matches = matches && (targetDate ? new Date(targetDate).toDateString() === filterDate : false);
            }

            if (submittedDate) {
              const filterDate = new Date(submittedDate).toDateString();
              const targetDate = approval.submittedDate || approval.createdDate;
              matches = matches && (targetDate ? new Date(targetDate).toDateString() === filterDate : false);
            }

            return matches;
          });
        } catch (error) {
          console.error("Error applying date filters:", error);
        }
      }

      console.log("Approval filter applied, results:", filteredData.length);
      getTableListApproval(filteredData);
    } else {
      // Draft filtering
      const searchTerm = $("#searchDraft").val();
      const selectedDate = $("#draftCreatedDate").val();

      // Apply search filter
      if (searchTerm) {
        filteredData = filteredData.filter((draft) => draft.draftName.toLowerCase().includes(searchTerm.toLowerCase()));
      }

      // Apply date filter
      if (selectedDate) {
        try {
          const filterDate = new Date(selectedDate).toDateString();
          filteredData = filteredData.filter((draft) => {
            return draft.createdDate ? new Date(draft.createdDate).toDateString() === filterDate : true;
          });
        } catch (error) {
          console.error("Error applying date filter:", error);
        }
      }

      console.log("Draft filter applied, results:", filteredData.length);
      getTableListDraft(filteredData.filter((x) => x.id != defaultMasterId && !x.isSubmitted && !x.isApproved));
    }
  }

  // Simplified update functions
  const updateApprovalFilters = () => applyFilters("approval");
  const updateDraftFilters = () => applyFilters("draft");

  // Simplified event handlers
  $("#approvalFilterRow").on("change input", "input, select", function () {
    console.log(`Approval filter changed: ${$(this).attr("id")} = ${$(this).val()}`);
    updateApprovalFilters();
  });

  $("#draftFilterRow").on("change input", "input, select", function () {
    console.log(`Draft filter changed: ${$(this).attr("id")} = ${$(this).val()}`);
    updateDraftFilters();
  });

  // Simplified datepicker configurations
  const datepickerConfig = {
    language: "en",
    position: "bottom left",
    multipleDatesSeparator: ", ",
  };

  $("#draftCreatedDate")
    .datepicker("destroy")
    .datepicker({
      ...datepickerConfig,
      onSelect: () => updateDraftFilters(),
    });

  $("#approvalDate")
    .datepicker("destroy")
    .datepicker({
      ...datepickerConfig,
      onSelect: () => updateApprovalFilters(),
    });

  $("#submittedDate").datepicker({
    ...datepickerConfig,
    onSelect: () => updateApprovalFilters(),
  });

  const urlParams = new URLSearchParams(window.location.search);
  const activeTab = urlParams.get("activeTab");
  if (activeTab) {
    const linkTab = "#pills" + activeTab.charAt(0).toUpperCase() + activeTab.slice(1);
    setTimeout(() => {
      $(linkTab).tab("show");
    }, 1000);
  }
});
