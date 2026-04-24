function updateDraftLs(id) {
  const data = id.split("|");
  // Fixed mapping to match standard format: draftId|draftRasciId|draftOrganizationId|draftName|organizationDraftId
  draftExistingJobDesc.draftId = data[0];
  draftExistingJobDesc.draftRasciId = data[1];
  draftExistingJobDesc.draftOrganizationId = data[2];
  draftExistingJobDesc.draftName = data[3];
  draftExistingJobDesc.organizationDraftId = data[4];
  localStorage.setItem("draftExistingJobDesc", JSON.stringify(draftExistingJobDesc));
  $("#selectJobDescDraft").append(
    new Option(
      draftExistingJobDesc.draftName,
      draftExistingJobDesc.draftId +
        "|" +
        (draftExistingJobDesc.draftRasciId || "") +
        "|" +
        draftExistingJobDesc.draftOrganizationId +
        "|" +
        draftExistingJobDesc.draftName +
        "|" +
        draftExistingJobDesc.organizationDraftId,
      true,
      true,
    ),
  );
}

function detailDraft(params) {
  const splitParam = params.split("|");
  const draftId = splitParam[2]; // draftId is at index 2
  const findData = storeData.listDraft.find((x) => x.draftId == draftId);
  if (!findData) {
    swal("Draft not found", "The selected draft could not be found. Please try again.", "error");
    return;
  }

  // Convert object to proper string format for updateDraftLs
  const draftString =
    findData.draftId +
    "|" +
    (findData.draftRasciId || "") +
    "|" +
    findData.draftOrganizationId +
    "|" +
    findData.draftName +
    "|" +
    (findData.organizationDraftId || "");

  updateDraftLs(draftString);
  window.location.href = "/job-description/draft-detail?draftId=" + draftExistingJobDesc.draftId;
}

function detailapproval(params) {
  const splitParam = params.split("|");
  const draftId = splitParam[2]; // draftId is at index 2
  const findData = storeData.listDraft.find((x) => x.draftId == draftId);
  if (!findData) {
    swal("Draft not found", "The selected draft could not be found. Please try again.", "error");
    return;
  }

  // Convert object to proper string format for updateDraftLs
  const draftString =
    findData.draftId +
    "|" +
    (findData.draftRasciId || "") +
    "|" +
    findData.draftOrganizationId +
    "|" +
    findData.draftName +
    "|" +
    (findData.organizationDraftId || "");

  updateDraftLs(draftString);
  window.location.href = "/job-description/approval-detail?draftId=" + draftExistingJobDesc.draftId;
}

async function deleteDraft(paramsId) {
  console.log("paramsId", paramsId);
  const split = paramsId.split("|");
  // Format: draftId|draftRasciId|draftOrganizationId|draftName|organizationDraftId
  const draft = storeData.listDraft.find((x) => x.draftId == split[0]);

  const action = [
    {
      button: "Cancel",
      className: "btn-primary",
      callback: function () {
        hideModal(`modalConfirm`);
      },
    },
    {
      button: "Delete",
      className: "btn-outline-dark",
      callbackFunction: "confirmDeleteDraft",
    },
  ];
  modalConfrimHelper(
    "delete",
    "Delete Draft",
    `Are you sure want to delete <b>${draft?.draftName}</b> draft?`,
    "All Position title in this draft will be deleted, including related RASCI notations, Competencies, and Position Descriptions",
    action,
    "",
    paramsId,
  );
}

async function confirmDeleteDraft(id) {
  const seperateId = id.split("|");
  loader(true);
  // Fixed: draftId is at index [0] in the standard format
  let deleteData = await draftDelete(seperateId[0]);
  if (deleteData) {
    await initializeJobDescriptionData();
    hideModal(`modalConfirm`);
    swal("Success", "Draft has been deleted", "success");
  } else {
    swal("Failed to delete draft", "error");
  }
  loader(false);
}

async function initializeJobDescriptionData() {
  try {
    // Fetch all required data
    const dataListDraft = await draftList(1, 9999);
    const dataListApproval = await draftApprovalList(1, 9999);
    const rasciList = await getRasciList();

    // Update store data
    storeData.listDraft = dataListDraft.data;
    storeData.listApproval = dataListApproval.data;
    storeData.rasciList = rasciList.data;

    console.log("Draft List:", storeData.listDraft);
    // Setup dropdown data
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

    // Initialize UI components
    checkDraftSelected(storeData.listDraft);
    updateNotifNotAvailable();

    // Load table data
    getTableListDraft(storeData.listDraft.filter((x) => x.draftId != defaultMasterId));
    getTableListApproval(storeData.listApproval);
  } catch (error) {
    console.error("Error initializing job description data:", error);
    swal("Error", "Failed to load data. Please refresh the page.", "error");
  }
}

function checkDraftSelected(listDraft) {
  // Safety check for empty listDraft
  if (!listDraft || listDraft.length === 0) {
    console.log("No drafts available");
    return;
  }

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
    if (!firstDraft) {
      console.log("First draft not found");
      return;
    }
    draftExistingJobDesc.draftId = firstDraft.draftId;
    draftExistingJobDesc.draftRasciId = firstDraft.draftRasciId ? firstDraft.draftRasciId : "";
    draftExistingJobDesc.draftOrganizationId = firstDraft.draftOrganizationId ? firstDraft.draftOrganizationId : "";
    draftExistingJobDesc.draftName = firstDraft.draftName ? firstDraft.draftName : "";
    draftExistingJobDesc.organizationDraftId = firstDraft.organizationDraftId ? firstDraft.organizationDraftId : "";
    localStorage.setItem("draftExistingJobDesc", JSON.stringify(draftExistingJobDesc));
  }

  // Validate required fields before creating draftId string
  if (!draftExistingJobDesc.draftId || !draftExistingJobDesc.draftOrganizationId) {
    console.log("Required draft fields missing:", draftExistingJobDesc);
    return;
  }

  const draftRasciId = draftExistingJobDesc.draftRasciId ? draftExistingJobDesc.draftRasciId : "";
  const draftObj =
    draftExistingJobDesc.draftId +
    "|" +
    draftRasciId +
    "|" +
    draftExistingJobDesc.draftOrganizationId +
    "|" +
    (draftExistingJobDesc.draftName || "") +
    "|" +
    (draftExistingJobDesc.organizationDraftId || "");

  console.log("Selected draft :>", draftObj);

  // Add small delay to ensure dropdown is populated
  setTimeout(() => {
    // Debug: Check if dropdown has options
    const dropdownOptions = $("#selectJobDescDraft option");
    console.log("Dropdown options count:", dropdownOptions.length);

    // Debug: Check if our value exists in dropdown
    const matchingOption = $("#selectJobDescDraft option[value='" + draftObj + "']");
    console.log("Matching option found:", matchingOption.length > 0);

    if (matchingOption.length === 0) {
      console.log("Available options:");
      dropdownOptions.each(function (i, option) {
        console.log(i + ":", $(option).val(), "->", $(option).text());
      });

      // Try to find best match by draftId only
      const draftId = draftExistingJobDesc.draftId;
      const bestMatch = $("#selectJobDescDraft option").filter(function () {
        return $(this)
          .val()
          .startsWith(draftId + "|");
      });

      if (bestMatch.length > 0) {
        console.log("Found best match:", bestMatch.val());
        $("#selectJobDescDraft").val(bestMatch.val()).trigger("change");
        return;
      }
    }

    // Set the value and trigger change
    console.log("Setting dropdown value to:", draftObj);
    const prevVal = $("#selectJobDescDraft").val();
    $("#selectJobDescDraft").val(draftObj);
    const newVal = $("#selectJobDescDraft").val();

    console.log("Previous value:", prevVal);
    console.log("New value after set:", newVal);

    if (newVal === draftObj) {
      console.log("Value set successfully, triggering change");
      $("#selectJobDescDraft").trigger("change");
    } else {
      console.log("Failed to set value - option not found in dropdown");
    }
  }, 300);

  // disable selectJobDescDraft if draftId is not empty
  // $("#selectJobDescDraft").prop("disabled", true);
}

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

$(document).ready(async function () {
  $("#createJobDesc").click(function () {
    window.location.href = "/job-description/detail";
  });

  $("#saveDraft").click(async function () {
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
    if (saveData.status == 200) {
      $("#modalCreateDraftJobDesc").modal("hide");
      swal("Success", "Draft saved successfully", "success");

      // Update localStorage with newly created draft
      draftExistingJobDesc.draftId = saveData.data.draftId;
      draftExistingJobDesc.draftRasciId = saveData.data.draftRasciId || saveData.data.draftRasciMatrixId || "";
      draftExistingJobDesc.draftOrganizationId = saveData.data.draftOrganizationId;
      draftExistingJobDesc.draftName = saveData.data.draftName;
      draftExistingJobDesc.organizationDraftId = saveData.data.organizationDraftId;
      localStorage.setItem("draftExistingJobDesc", JSON.stringify(draftExistingJobDesc));

      // Reload data and auto-select the newly created draft
      await initializeJobDescriptionData();
    } else {
      swal("Failed to save draft", { icon: "error" });
    }
  });

  // Define event handlers FIRST before initialization
  $("#selectJobDescDraft").change(function () {
    console.log("masuk sini");
    const value = $(this).val();
    console.log("Selected draft value:", value);

    // Add null check to prevent split error
    if (!value || value === null) {
      console.log("No draft selected or value is null");
      return;
    }

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

  // Initialize job description data AFTER event handlers are defined
  await initializeJobDescriptionData();

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

  $("#createDraft, #createViaDraftTab").click(function () {
    $("#modalCreateDraftJobDesc").modal("show");
  });

  getTableListLog();

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
