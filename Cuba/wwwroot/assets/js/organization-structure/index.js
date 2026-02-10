async function initializeHelper() {
  showChartLoading("chart-container-custom");
  try {
    // const dataChart = test;
    // renderOrgChart(dataChart, "10135490", true);
    // const dataChart = test2;
    // renderOrgChart(dataChart.data, "10164009", true);
    const dataChart = await chartShow({
      draftId: organizationAttribute.orgUnitId,
      jobCode: defaultNodeId,
      depth: 3,
    });
    renderOrgChart(dataChart.data, defaultNodeId, false);
    console.log("Data chart fetched ==>:", dataChart.data);
    setTimeout(() => {
      if (typeof hideChartLoading === "function") {
        hideChartLoading("chart-container-custom");
      }
      console.log("Chart initialization and loading completed");
    }, 1500); // Wait 1.5 seconds for chart to fully render
    // helperOrgTree(dataChart);
  } catch (error) {
    console.error("Error in initializeHelper:", error);
    // Hide loading and show error message on failure
    if (typeof hideChartLoading === "function") {
      hideChartLoading("chart-container-custom");
    }
    // Show error message in chart container
    const container = document.querySelector(".chart-container-custom") || document.getElementById("osContainer");
    if (container) {
      container.innerHTML =
        '<div style="text-align: center; padding: 20px; color: #999;">Chart loading failed. Please try again.</div>';
    }
  }
  // renderOrgChart(dataz, "10135504", false);
}

$("#searchOrgNode").on("change", function () {
  let searchValue = $("#searchOrgNode").val();
  console.log("Search value:", searchValue);
  console.log("Search value:", searchValue);
  if (!searchValue) return;
  focusNode(searchValue);
});

$(".chart-container-custom").on("click", "foreignObject", async function (e) {
  const clickTarget = $(e.target);

  // Skip if clicking on expand/collapse buttons or their children
  if (
    clickTarget.closest(".node-button-foreign-object").length > 0 ||
    clickTarget.closest('[class*="button"]').length > 0
  ) {
    return; // Let the expand/collapse functionality work normally
  }

  e.stopPropagation();

  // Get the node data from the __data__ property
  const nodeData = this.__data__;
  if (nodeData && nodeData.data) {
    const data = nodeData.data;
    await modalJobPopup(data.id);
  }
});

function changeOrganization(value, text) {
  organizationAttribute.orgUnitId = value;
  organizationAttribute.orgUnitName = text;
  organizationAttribute.isMasterData = organizationAttribute.orgUnitId == defaultMasterId ? true : false;
  // organizationAttribute.isMasterData = organizationAttribute.orgUnitId == defaultMasterId ? true : false;
  localStorage.setItem("organizationAttribute", JSON.stringify(organizationAttribute));
  const buttons = ["#createJob", "#designCost", "#editJob", "#deleteJob", "#duplicateJob"];
  buttons.forEach((button) => $(button).toggle(organizationAttribute.orgUnitId !== defaultMasterId));
  if (organizationAttribute.isMasterData) {
    $("#pillsSoSection").attr("style", "display:none !important");
    $("#labelChart").attr("style", "display:none !important");
    $("#showJobdesc").show();
    $("#showRasciMatrix").show();
  } else {
    // $("#incumbentCard").attr("style", "display:none !important");
    $("#showJobdesc").hide();
    $("#showRasciMatrix").hide();
    $("#pillsSoSection").show();
    $("#labelChart").show();
  }
}

async function confirmDuplicate(id) {
  loader(true);
  const positionId = $("#inputOUCode").val();
  const duplicate = await draftJobDuplicate({
    draftId: organizationAttribute.orgUnitId,
    userId: "system",
    unitCodeReference: positionId,
  });

  if (duplicate?.status !== 200) {
    swal("Error", "Failed to duplicate position", "error");
    loader(false);
    return;
  }
  $("#modalConfirm").modal("hide");
  focusNode(positionId);
  swal("Success", "Position has been duplicated", "success");
  loader(false);
}
function handleExportFun(type) {
  const focusNodeId = $("#modalOrgUnitId").text();
  $("#modalDetailJob").modal("hide");
  if (type === "svg") {
    chartExportSVG(focusNodeId);
  } else if (type === "pdf") {
    chartExportPDF(focusNodeId);
  } else if (type === "png") {
    chartExportPNG(focusNodeId);
  }
}

async function duplicateJob() {
  const positionName = $("#jobName").text();
  $("#modalDetailJob").modal("hide");
  const action = [
    actionBack,
    {
      button: "Duplicate",
      className: "btn-primary",
      callbackFunction: "confirmDuplicate",
    },
  ];
  modalConfrimHelper(
    "confirm",
    "Duplicate Position",
    `<span>Are you sure want to duplicate <b>${positionName}</b> position?</span>`,
    "",
    action,
    "40%",
    1,
  );
  $("#modalConfirm").modal("show");
}

// function getDataOrganization(orgUnitId) {
//   initializeHelper();
// const dataListPosition = lsListDetailDraft.filter((x) => x.draftId == orgUnitId);
// const dataListOrg = lsListDraftOrgNode.filter((x) => x.draft_id == orgUnitId);
// lsListOrgNode = [...myData];
// lsListPosition = [...positionDetail];
// console.log(lsListPosition.length);
// dataListPosition.forEach((item) => {
//   const index = lsListPosition.findIndex((x) => x.positionId == item.positionId);
//   if (item.type == "create") {
//     lsListPosition.push(item);
//   } else if (item.type == "edit") {
//     if (index == -1) {
//       lsListPosition.push(item);
//     } else {
//       lsListPosition[index] = item;
//     }
//   } else if (item.type == "delete") {
//     lsListPosition.splice(index, 1);
//   }
// });
// dataListOrg.forEach((item) => {
//   const index = lsListOrgNode.findIndex((x) => x.id_position == item.id_position);
//   if (item.type == "create") {
//     lsListOrgNode.push(item);
//   } else if (item.type === "edit") {
//     if (index == -1) {
//       lsListOrgNode.push(item);
//     } else {
//       lsListOrgNode[index] = item;
//     }
//   } else if (item.type === "delete") {
//     lsListOrgNode.splice(index, 1);
//   }
//   // console.log("lsListOrgNode", lsListOrgNode);
// });
// initializeHelper();
// getDataList([
//   {
//     dataId: "searchOrgNode",
//     data: lsListOrgNode.map((item) => ({ id: item.id_position, text: item.position })),
//   },
// ]);
// localStorage.setItem("listOrgNode", JSON.stringify(lsListOrgNode));
// localStorage.setItem("listPosition", JSON.stringify(lsListPosition));
// }

async function getInitialData() {
  const listDraft = await listDraftSO();
  return {
    listDraft: listDraft?.value?.data ?? [],
  };
}

const positionId = $("#inputOUCode").val();

function confirmDeleteOption(value) {
  hideModal(`modalConfirm`);
  swal(
    "Saved",
    "Activity delete Manager Strategic Planning position has been saved to draft Evaluasi Struktur Organisasi 2025",
    "success",
  );
}

// modal confirm delete job
async function confirmDeleteJob(unitCode) {
  const positionId = $("#inputOUCode").val();
  const prlOrg = $("#modalPrlOrg").text();
  const positionName = $("#jobName").text();
  const deleteOption = $("input[name='deleteOption']:checked").val();
  const tableVarious = $("#editMoveVariousTable");
  const data = tableVarious.DataTable().rows().data().toArray();
  const dataSelect = data.map((item) => ({
    unitCode: item[0],
    unitCodeParent: $(`#editSelect${item[0]}`).val(),
  }));
  const dataSelectFiltered = dataSelect.filter((item) => item.unitCodeParent != "" && item.unitCodeParent != null);
  if (deleteOption == "deleteAll") {
    const willProceed = await confirmFunction(
      "Confirm Delete",
      "Are you sure you want to delete " + positionName + " ?",
    );
    if (!willProceed) {
      return; // User cancelled, exit function
    }
    loader(true);
    const deleteData = await deleteJobAndSubordinates({
      draftId: organizationAttribute.orgUnitId,
      unitCode: positionId,
      prlOrg: prlOrg,
      userId: "system",
    });
    if (deleteData) {
      swal("Success", "Job has been deleted", "success");
      // hide modal
      $("#modalConfirm").modal("hide");
    }
    loader(false);
  } else if (deleteOption == "deleteMoveSpesific") {
    const geteditSelectNewValue = $("#editSelectNew").val();
    console.log("geteditSelectNewValue", geteditSelectNewValue);
    if (geteditSelectNewValue == "" || geteditSelectNewValue == null) {
      swal("Error", "Please select direct report", "error");
      return;
    }
    const willProceed = await confirmFunction(
      "Confirm Delete & Move",
      "Are you sure you want to delete " + positionName + " & move subordinates?",
    );
    if (!willProceed) {
      return; // User cancelled, exit function
    }
    const movePosition = dataSelect.map((item) => ({
      unitCode: item.unitCode,
      unitCodeParent: geteditSelectNewValue,
    }));
    loader(true);
    await moveJob(movePosition);
    const deleteData = await deleteJobAndSubordinates({
      draftId: organizationAttribute.orgUnitId,
      unitCode: positionId,
      prlOrg: prlOrg,
      userId: "system",
    });
    if (deleteData) {
      swal("Success", "Position has been deleted", "success");
      // hide modal
      $("#modalConfirm").modal("hide");
    }
    loader(false);
  } else {
    if (!dataSelectFiltered.length) {
      swal("Error", "Please select direct report", "error");
      return;
    }
    if (!dataSelectFiltered.length) {
      swal("Error", "Please select direct report", "error");
      return;
    }
    const willProceed = await confirmFunction(
      "Confirm Delete & Move",
      "Are you sure you want to delete " + positionName + " & move subordinates?",
    );
    if (!willProceed) {
      return; // User cancelled, exit function
    }
    loader(true);
    await moveJob(dataSelectFiltered);
    const deleteData = await deleteJobAndSubordinates({
      draftId: organizationAttribute.orgUnitId,
      unitCode: positionId,
      prlOrg: prlOrg,
      userId: "system",
    });
    if (deleteData) {
      swal("Success", "Position has been deleted", "success");
      // hide modal
      $("#modalConfirm").modal("hide");
    }
    loader(false);
  }
  changeOrganization(organizationAttribute.orgUnitId, organizationAttribute.orgUnitName);
  focusNode(positionId);
}

// handle edit job
async function handleEditJob() {
  statusHelper.formPositionAsCreated = false;
  const getPositionById = $(`#inputOUCode`).val();
  $("#modalDetailJob").modal("hide");
  const getDataSub = await draftJobSubordinate({
    draftId: organizationAttribute.orgUnitId,
    jobCode: $("#inputOUCode").val(),
  });
  const dataSub =
    getDataSub?.data?.map((item) => ({
      unitCode: item.unitCode,
      unitName: item.unitName,
    })) ?? [];
  if (!dataSub.length) {
    localStorage.removeItem("backPage");
    window.location.href = "/organization/form-position?unitCode=" + getPositionById;
    return;
  }
  let table = ` <table class="tableMasterData table table-hover w-100" id="editMoveVariousTable">`;
  table += `<thead>
    <tr>
      <th>Position Id</th>
      <th>Position Name</th>
      <th>Direct Report</th>
      </tr> </thead>`;
  table += `<tbody>`;
  dataSub.forEach((item, idx) => {
    table += `<tr>
      <td width="20%">${item.unitCode}</td>
      <td width="30%">${item.unitName}</td>
      <td width="50%">
      <select class="form-control classEditSelect" id="editSelect${item.unitCode}" name="selectDirectReport">
      </select>
      </td>
      </tr>`;
  });
  table += `</tbody>`;

  table += `</table>`;

  const divEditSpesific = `
    <div class="col">
        <div class="mb-3 m-t-15 custom-radio-ml">
            <div class="form-check radio radio-primary">
                <input class="form-check-input" id="radio1" type="radio" name="editPositionBox" value="editSelf" onclick="onChangeEditOption(this, 'editSelf')" checked="true">
                <label class="form-check-label" for="radio1">Edit Position</span></label>
            </div>
            <div class="form-check radio radio-primary">
                <input class="form-check-input" id="radio3" type="radio" name="editPositionBox" value="moveSubordinate" onclick="onChangeEditOption(this, 'moveSubordinate')">
                <label class="form-check-label" for="radio3">move subordinate to new position</label>
                <div class="row m-t-10 m-b-10 d-none p-10 m-r-10" id="deleteMoveVariousDiv" style="background-color: #f5f5f5;">
                  <div class="col-sm-12">
                      <div class="table-responsive">
                        ${table}
                      </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
    </div>
    `;
  // select2 activate for class editSelect

  const action = [
    actionBack,
    {
      button: "Edit",
      className: "btn-primary",
      callbackFunction: "confirmEditJob",
    },
  ];
  modalConfrimHelper("confirm", "Edit Position", divEditSpesific, "", action, "60%", 1);
  callSelect2Edit("editMoveVariousTable");
}

// handle delete job
async function handleDeleteJob() {
  const positionName = $("#jobName").text();
  const positionId = $("#inputOUCode").val();
  const parentId = $("#modalDirectReportOrgUnitId").text();
  const getDataSub = await draftJobSubordinate({
    draftId: organizationAttribute.orgUnitId,
    jobCode: $("#inputOUCode").val(),
  });

  const dataSub =
    getDataSub?.data?.map((item) => ({
      unitCode: item.unitCode,
      unitName: item.unitName,
    })) ?? [];

  if (!dataSub.length) {
    const willProceed = await confirmFunction(
      "Confirm Delete",
      "Are you sure you want to delete " + positionName + " ?",
    );
    if (!willProceed) {
      return; // User cancelled, exit function
    }
    $("#modalDetailJob").modal("hide");
    loader(true);
    const deleteData = await deleteJobAndSubordinates({
      draftId: organizationAttribute.orgUnitId,
      unitCode: positionId,
      prlOrg: "8-9",
      userId: "system",
    });
    if (deleteData) {
      swal("Success", "Job has been deleted", "success");
      // hide modal
      $("#modalConfirm").modal("hide");
    }
    loader(false);
    changeOrganization(organizationAttribute.orgUnitId, organizationAttribute.orgUnitName);
    focusNode(parentId);
    return;
  }
  let table = ` <table class="tableMasterData table table-hover w-100" id="editMoveVariousTable">`;
  table += `<thead>
      <tr>
        <th>Position Id</th>
        <th>Position Name</th>
        <th>Direct Report</th>
        </tr> </thead>`;
  table += `<tbody>`;
  dataSub.forEach((item, idx) => {
    table += `<tr>
        <td width="20%">${item.unitCode}</td>
        <td width="30%">${item.unitName}</td>
        <td width="50%">
          <select class="form-control classEditSelect" id="editSelect${item.unitCode}" name="selectDirectReport">
          </select>
        </td>
        </tr>`;
  });
  table += `</tbody>`;

  table += `</table>`;

  // handleEditJob
  const divDeleteSpesific = `<span>Are you sure want to delete <b>${positionName}</b> position?</span>
    <br/>
    <div class="col">
        <div class="mb-3 m-t-15 custom-radio-ml">
            <div class="form-check radio radio-primary">
                <input class="form-check-input" id="radio1" type="radio" name="deleteOption" value="deleteAll" onclick="onChangeDeleteOption(this, 'deleteOption')" checked="true">
                <label class="form-check-label" for="radio1">Delete position & subordinate</span></label>
            </div>
            <div class="form-check radio radio-primary">
              <input class="form-check-input" id="radio2" type="radio"  name="deleteOption" value="deleteMoveSpesific" onclick="onChangeDeleteOption(this, 'deleteOption')">
              <label class="form-check-label" for="radio2">Delete position & move subordinate reporting line to specific position</label>
              <div class="row m-t-10 m-b-10 d-none p-10 m-r-10" id="deleteMoveSpesificDiv" style="background-color: #f5f5f5;">
                <div class="col-sm-12">
                    <select class="form-control classEditSelectNew" id="editSelectNew" name="selectDirectReportNew">
                    </select>
                </div>
              </div>
            </div>
            <div class="form-check radio radio-primary">
                <input class="form-check-input" id="radio3" type="radio" name="deleteOption" value="deleteMoveVarious" onclick="onChangeDeleteOption(this, 'deleteOption')">
                <label class="form-check-label" for="radio3">Delete position & move subordinate reporting line to various positions</label>
                <div class="row m-t-10 m-b-10 d-none p-10 m-r-10" id="deleteMoveVariousDiv" style="background-color: #f5f5f5;">
                  <div class="col-sm-12">
                      <div class="table-responsive">
                        ${table}
                      </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
    </div>
    `;

  $("#modalDetailJob").modal("hide");
  const action = [
    actionBack,
    {
      button: "Delete",
      className: "btn-danger",
      callbackFunction: "confirmDeleteJob",
    },
  ];
  modalConfrimHelper("delete", "Delete Position", divDeleteSpesific, "", action, "70%", 1);
  // getDeleteMoveVariousTable();
  // callSelect2Edit("editMoveSpesificTable");
  // callSelect2Edit("editMoveVariousTable");
  $("#modalConfirm").on("shown.bs.modal", function () {
    $(".classEditSelect")
      .select2({
        dropdownParent: $(`#editMoveVariousTable`),
        allowClear: true,
        delay: 250,
        ajax: {
          url: `${url.baseUrl}/${url["api-organization"]}/chart/job/list?draftId=` + organizationAttribute.orgUnitId,
          dataType: "json",
          data: function (params) {
            return {
              search: params.term || "",
              page: params.page || 1,
              pageSize: 10,
            };
          },
          processResults: function (data, params) {
            params.page = params.page || 1;

            return {
              results: data.data.map((item) => ({
                id: item.unitCode || item.Id || item.id, // The ID for Select2
                text: item.unitName || item.Name || item.name, // The text that appears in the dropdown
              })),
              pagination: {
                more: data.hasMore, // Boolean to indicate if more data is available
              },
            };
          },
          cache: true,
        },
      })
      .on("select2:open", function () {
        page = 1;
      });
    $(".classEditSelectNew")
      .select2({
        dropdownParent: $(`#modalConfirm`),
        allowClear: true,
        delay: 250,
        ajax: {
          url: `${url.baseUrl}/${url["api-organization"]}/chart/job/list?draftId=` + organizationAttribute.orgUnitId,
          dataType: "json",
          data: function (params) {
            return {
              search: params.term || "",
              page: params.page || 1,
              pageSize: 10,
            };
          },
          processResults: function (data, params) {
            params.page = params.page || 1;

            return {
              results: data.data.map((item) => ({
                id: item.unitCode || item.Id || item.id, // The ID for Select2
                text: item.unitName || item.Name || item.name, // The text that appears in the dropdown
              })),
              pagination: {
                more: data.hasMore, // Boolean to indicate if more data is available
              },
            };
          },
          cache: true,
        },
      })
      .on("select2:open", function () {
        page = 1;
      });
  });
  // callSelect2Edit("editMoveSpesificTable");
}

// move job function
async function moveJob(dataSelectFiltered) {
  for (const item of dataSelectFiltered) {
    const saveMoveJob = await draftJobMove({
      draftId: organizationAttribute.orgUnitId,
      unitCodes: [item.unitCode],
      unitCodeParent: item.unitCodeParent,
      userId: "system",
    });
  }
}

// confirm edit job
async function confirmEditJob() {
  const positionId = $("#inputOUCode").val();
  const editPositionBox = $("input[name='editPositionBox']:checked").val();
  if (editPositionBox == "editSelf") {
    loader(true);
    localStorage.removeItem("backPage");
    window.location.href = "/organization/form-position?unitCode=" + positionId;
  } else {
    const table = $("#editMoveVariousTable");
    const data = table.DataTable().rows().data().toArray();
    // get data select inside table
    const dataSelect = data.map((item) => ({
      unitCode: item[0],
      unitCodeParent: $(`#editSelect${item[0]}`).val(),
    }));

    // takeout data if directReportId is empty or ''
    const dataSelectFiltered = dataSelect.filter((item) => item.unitCodeParent != "" && item.unitCodeParent != null);
    if (!dataSelectFiltered.length) {
      swal("Error", "Please select direct report", "error");
      return;
    }
    const willProceed = await confirmFunction("Confirm Move", "Are you sure you want to move subordinates?");
    if (!willProceed) {
      return; // User cancelled, exit function
    }

    loader(true);
    const result = await moveJob(dataSelectFiltered);
    changeOrganization(organizationAttribute.orgUnitId, organizationAttribute.orgUnitName);
    $("#modalConfirm").modal("hide");
    swal("Success", "Job has been edited", "success");
    loader(false);
    focusNode(positionId);
  }
}

function callSelect2Edit(params) {
  $("#modalConfirm").on("shown.bs.modal", function () {
    $(".classEditSelect")
      .select2({
        dropdownParent: $(`#${params}`),
        allowClear: true,
        delay: 250,
        ajax: {
          url: `${url.baseUrl}/${url["api-organization"]}/chart/job/list?draftId=` + organizationAttribute.orgUnitId,
          dataType: "json",
          data: function (params) {
            return {
              search: params.term || "",
              page: params.page || 1,
              pageSize: 10,
            };
          },
          processResults: function (data, params) {
            params.page = params.page || 1;

            return {
              results: data.data.map((item) => ({
                id: item.unitCode || item.Id || item.id, // The ID for Select2
                text: item.unitName || item.Name || item.name, // The text that appears in the dropdown
              })),
              pagination: {
                more: data.hasMore, // Boolean to indicate if more data is available
              },
            };
          },
          cache: true,
        },
      })
      .on("select2:open", function () {
        page = 1;
      });
  });
}

//  redirect to rasci matrix
async function showRasciMatrix(prlOrgRange = null) {
  let getOuCode = $(`#inputOUCode`).val();
  let prlOrg = $("#modalPrlOrg").text();
  let isBasket = $("#isBasket").val();
  if (isBasket == "true") {
    prlOrg = prlOrgRange;
  }
  const urlRasci = `/Rasci/Index?ouId=${getOuCode}&prlOrg=${prlOrg}`;
  window.open(urlRasci, "_blank");
}

// redirect to job description
async function showJobDesc(ouCode = null, prlOrgRange = null) {
  let getOuCode = $(`#inputOUCode`).val();
  let prlOrg = $("#modalPrlOrg").text();
  let isBasket = $("#isBasket").val();
  if (isBasket == "true") {
    getOuCode = ouCode;
    prlOrg = prlOrgRange;
  }
  const urlJobDesc = `/job-description/detail?master=true&jobId=${getOuCode}&prlOrg=${prlOrg}`;
  window.open(urlJobDesc, "_blank");
}

// confirm delete draft
async function confirmDeleteDraft(id) {
  loader(true);
  let rollback = await rollbackDraftSO(id);
  if (rollback.data.status == "Failed") {
    // data.desctiption
    swal("Error", rollback.data.description, "error");
    loader(false);
    return;
  }
  if (rollback) {
    storeData.listDraft = storeData.listDraft.filter((x) => x.draftId != id);
    localStorage.setItem("listDraft", JSON.stringify(storeData.listDraft));
    getTableListDraft(storeData.listDraft.filter((x) => x.draftName != "Master Data SO"));
    console.log("organizationAttribute.orgUnitId", organizationAttribute);
    getDataList([
      {
        dataId: "selectDraftOrganization",
        data: storeData.listDraft.map((item) => ({ id: item.draftId, text: item.draftName })),
      },
      {
        dataId: "selectDraftName",
        data: storeData.listDraft.map((item) => ({ id: item.draftId, text: item.draftName })),
        isHide: true,
      },
    ]);
    await checkDataOrganization(storeData.listDraft);
    $("#selectDraftOrganization").val(organizationAttribute.orgUnitId).trigger("change");
    hideModal(`modalConfirm`);
    swal("Success", "Draft has been deleted", "success");
  }
  loader(false);
}

// modal delete draft
async function deleteDraft(paramsId) {
  console.log("paramsId", storeData.listDraft);
  const draft = storeData.listDraft.find((x) => x.draftId == paramsId);
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

// redirect to detail draft
function detailDraft(id) {
  changeOrganization(id, storeData.listDraft.find((x) => x.draftId == id).draftName);
  window.location.href = "/organization/draft-detail?draftId=" + id;
}

// redirect to detail approval
function detailapproval(id) {
  window.location.href = "/organization/approval-detail?draftId=" + id;
}

// check if organization is Master Data SO
function checkIsMasterData() {
  if (organizationAttribute.orgUnitName == "Master Data SO") {
    // modal z-index 99999
    $("#modalCreateDraftSO").modal("show").attr("style", "z-index: 1070");
    $("#inputDraftName").val("");
    return true;
  }
  return false;
}

// redirect to form position
function createJob() {
  $("#modalLabelOSDraft").text("Create Organization Structure Draft");
  const isMasterData = checkIsMasterData();
  if (!isMasterData) {
    window.location.href = "/organization/form-position";
  }
}

// function change edit type
function onChangeEditOption(e, value) {
  const valueSpesific =
    e.value == "editSelf" ? "row m-t-10  m-b-10 p-10 m-r-10" : "row m-t-10  m-b-10 d-none p-10 m-r-10";
  const valueVarious =
    e.value == "moveSubordinate" ? "row m-t-10  m-b-10 p-10 m-r-10" : "row m-t-10  m-b-10 d-none p-10 m-r-10";
  // $("#deleteMoveSpesificDiv").attr("class", valueSpesific);
  $("#deleteMoveVariousDiv").attr("class", valueVarious);
}

// function change delete type
function onChangeDeleteOption(e, value) {
  const valueSpesific =
    e.value == "deleteMoveSpesific" ? "row m-t-10  m-b-10 p-10 m-r-10" : "row m-t-10  m-b-10 d-none p-10 m-r-10";
  const valueVarious =
    e.value == "deleteMoveVarious" ? "row m-t-10  m-b-10 p-10 m-r-10" : "row m-t-10  m-b-10 d-none p-10 m-r-10";
  $("#deleteMoveSpesificDiv").attr("class", valueSpesific);
  $("#deleteMoveVariousDiv").attr("class", valueVarious);
}

// click create draft
$("#createDraftSO").click(async function () {
  const draftName = $("#inputDraftName").val() ?? $("#selectDraftName").val();
  if (storeData.listDraft.find((x) => x.draftName == $("#inputDraftName").val())) {
    swal("Failed", `${draftName} draft is already exist, please change to another draft name`, "error");
    return;
  }
  if (!draftName) {
    swal("Failed", "Draft name is required", "error");
    return;
  }
  loader(true);
  const saveDraft = await createDraftSO(draftName);
  if (saveDraft.status == 500) {
    swal("Failed", saveDraft.error, "error");
    return;
  }
  const getDataDraft = await chartDraftList(1, 99);
  storeData.listDraft = getDataDraft.data;
  $("#modalCreateDraftSO").modal("hide");
  getDataList([
    {
      dataId: "selectDraftOrganization",
      data: storeData.listDraft.map((item) => ({ id: item.draftId, text: item.draftName })),
    },
  ]);
  getTableListDraft(storeData.listDraft.filter((x) => x.draftName != "Master Data SO"));
  changeOrganization(saveDraft.data.draftId, saveDraft.data.draftName);
  $("#selectDraftOrganization").val(organizationAttribute.orgUnitId).trigger("change");
  // initializeHelper
  initializeHelper();
  loader(false);
  swal("Success", `Draft ${draftName} has been created`, "success");
});

// click view org tree
$("#viewOrgTree").click(function () {
  $("#modalOrgTree").modal("show");
});

// click create job
$("#createJob").click(function () {
  statusHelper.formPositionAsCreated = true;
  createJob();
});

// click design cost
$("#designCost").click(async function () {
  const filter = $("#selectDraftFilterByDataSource").val();
  await changeDataDesignCostFilter(filter);
  $("#modalPreviewDesignCost").modal("show");
});

$("#selectDraftFilterByDataSource").on("change", async function () {
  const filter = $("#selectDraftFilterByDataSource").val();
  await changeDataDesignCostFilter(filter);
});

// change select draft organization
$("#selectDraftOrganization").change(async function () {
  changeOrganization($("#selectDraftOrganization").val(), $("#selectDraftOrganization option:selected").text());

  getDataListAsync([
    {
      id: "searchOrgNode",
      endpoint: "chart/job/list",
      draftId: organizationAttribute.orgUnitId,
    },
  ]);
});

$(document).ready(async function () {
  const getDataDraft = await chartDraftList(1, 999);
  const getDataApproval = await approvedList(1, 999);
  storeData.listDraft = getDataDraft.data;
  storeData.listApproval = getDataApproval.data;
  // initialize table
  await checkDataOrganization(storeData.listDraft);
  const focusNode = urlParams.get("focusNode");
  const activeTab = urlParams.get("activeTab");
  const positionName = urlParams.get("positionName");

  console.log("storeData.listDraft", storeData.listDraft);

  getTableListDraft(storeData.listDraft.filter((x) => x.id != defaultMasterId && !x.isSubmitted && !x.isApproved));
  console.log("storeData.listDraft", storeData.listDraft);
  getTableListApproval(getDataApproval.data);
  getDataList([
    {
      dataId: "selectDraftOrganization",
      data: storeData.listDraft.map((item) => ({ id: item.draftId, text: item.draftName })),
    },
  ]);

  $("#approvalFilterRow").on("change input", "input, select", function () {
    const changedElement = $(this);
    const elementId = changedElement.attr("id");
    const elementValue = changedElement.val();

    // Handle specific approval filter elements
    if (elementId === "approvalDate") {
      console.log("Approval date changed:", elementValue);
      // Determine type based on current status
      const statusApproval = $("#statusApproval").val();
      const dateType =
        statusApproval === "isApproved" || statusApproval === "isRejected" ? "approvalDate" : "submittedDate";
      filterApprovalsByDate(elementValue, dateType);
    } else if (elementId === "submittedDate") {
      console.log("Submitted date changed:", elementValue);
      // Always use submittedDate type for this field
      filterApprovalsByDate(elementValue, "submittedDate");
    } else if (elementId === "searchApproval") {
      console.log("Approval search changed:", elementValue);
      filterApprovalsBySearch(elementValue);
    } else if (elementId === "statusApproval") {
      console.log("Approval status changed:", elementValue);
      // No need to reset data, updateApprovalFilters handles all filtering
      updateApprovalFilters();
      return; // Early return to avoid double call to updateApprovalFilters
    }

    // Update comprehensive approval filters
    updateApprovalFilters();
  });

  // Initialize approval datepicker with onSelect callback
  $("#approvalDate")
    .datepicker("destroy")
    .datepicker({
      language: "en",
      position: "bottom left",
      multipleDatesSeparator: ", ",
      onSelect: function (formattedDate, date, inst) {
        console.log("Approval datepicker date selected:", formattedDate);
        // Determine type based on current status
        const statusApproval = $("#statusApproval").val();
        const dateType =
          statusApproval === "isApproved" || statusApproval === "isRejected" ? "approvalDate" : "submittedDate";
        filterApprovalsByDate(formattedDate, dateType);
        updateApprovalFilters();
      },
    });

  $("#submittedDate").datepicker({
    language: "en",
    position: "bottom left",
    multipleDatesSeparator: ", ",
    onSelect: function (formattedDate, date, inst) {
      console.log("Submitted datepicker date selected:", formattedDate);
      // Determine type based on current status
      const statusApproval = $("#statusApproval").val();
      const dateType =
        statusApproval === "isApproved" || statusApproval === "isRejected" ? "approvalDate" : "submittedDate";
      filterApprovalsByDate(formattedDate, dateType);
      updateApprovalFilters();
    },
  });

  // Handle draft filter row changes
  $("#draftFilterRow").on("change input", "input, select", function () {
    const changedElement = $(this);
    const elementId = changedElement.attr("id");
    const elementValue = changedElement.val();

    // Handle specific elements
    if (elementId === "draftCreatedDate") {
      console.log("Draft created date changed:", elementValue);
      filterDraftsByDate(elementValue);
    } else if (elementId === "searchDraft") {
      console.log("Draft search changed:", elementValue);
      filterDraftsBySearch(elementValue);
    }

    // Update comprehensive filters
    updateDraftFilters();
  });

  // Initialize datepicker with onSelect callback (destroy existing instance first if any)
  $("#draftCreatedDate")
    .datepicker("destroy")
    .datepicker({
      language: "en",
      position: "bottom left",
      multipleDatesSeparator: ", ",
      onSelect: function (formattedDate, date, inst) {
        console.log("Datepicker date selected:", formattedDate);
        filterDraftsByDate(formattedDate);
        updateDraftFilters();
      },
    });
  // filter date range picker for draft created date

  await checkDataOrganization(storeData.listDraft);

  $("#createDraft, #createViaDraftTab").on("click", function () {
    $("#modalCreateDraftSO").modal("show").attr("style", "z-index: 1070");
    $("#inputDraftName").val("");
    return true;
  });

  $("#selectDraftOrganization").val(organizationAttribute.orgUnitId).trigger("change");

  if (focusNode) {
    setTimeout(async () => {
      // alert("test");
      // let data = await chartJobDetail({
      //   draftId: organizationAttribute.orgUnitId,
      //   jobCode: focusNode,
      // });
      // data = data.data;
      // console.log("data", data);

      // Positioname & satinize before     const sanitizedPosition = getPosition.replace(/&/g, "%26"), replace back to & when display

      $("#searchOrgNode")
        .append(new Option(positionName, focusNode, true, true))
        .trigger("change");
    }, 1000);
  } else {
    initializeHelper();
  }

  if (activeTab) {
    const linkTab = "#pills" + activeTab.charAt(0).toUpperCase() + activeTab.slice(1);
    setTimeout(() => {
      $(linkTab).tab("show");
    }, 2000);
  }
});

// Function to filter drafts by date
function filterDraftsByDate(selectedDate) {
  if (!selectedDate || !storeData.listDraft) return;

  try {
    // Parse the selected date
    const filterDate = new Date(selectedDate);

    // Filter drafts by created date
    const filteredDrafts = storeData.listDraft.filter((draft) => {
      if (!draft.createdDate) return true; // Include drafts without date

      const draftDate = new Date(draft.createdDate);
      return draftDate.toDateString() === filterDate.toDateString();
    });

    console.log("Filtered drafts by date:", filteredDrafts.length);
    getTableListDraft(filteredDrafts.filter((x) => x.id != defaultMasterId && !x.isSubmitted && !x.isApproved));
  } catch (error) {
    console.error("Error filtering drafts by date:", error);
  }
}

// Function to filter drafts by search term
function filterDraftsBySearch(searchTerm) {
  if (!storeData.listDraft) return;

  const filteredDrafts = storeData.listDraft.filter((draft) =>
    draft.draftName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  console.log("Filtered drafts by search:", filteredDrafts.length);
  getTableListDraft(filteredDrafts.filter((x) => x.id != defaultMasterId && !x.isSubmitted && !x.isApproved));
}

// Function to update all draft filters comprehensively
function updateDraftFilters() {
  const searchTerm = $("#searchDraft").val();
  const selectedDate = $("#draftCreatedDate").val();

  if (!storeData.listDraft) return;

  let filteredDrafts = [...storeData.listDraft];

  // Apply search filter
  if (searchTerm) {
    filteredDrafts = filteredDrafts.filter((draft) => draft.draftName.toLowerCase().includes(searchTerm.toLowerCase()));
  }

  // Apply date filter
  if (selectedDate) {
    try {
      const filterDate = new Date(selectedDate);
      filteredDrafts = filteredDrafts.filter((draft) => {
        if (!draft.createdDate) return true;
        const draftDate = new Date(draft.createdDate);
        return draftDate.toDateString() === filterDate.toDateString();
      });
    } catch (error) {
      console.error("Error applying date filter:", error);
    }
  }

  console.log("Comprehensive filter applied, results:", filteredDrafts.length);
  getTableListDraft(filteredDrafts.filter((x) => x.id != defaultMasterId && !x.isSubmitted && !x.isApproved));
}

// Function to filter approvals by date
function filterApprovalsByDate(selectedDate, type) {
  if (!selectedDate || !storeData.listApproval) return;

  try {
    // Parse the selected date
    const filterDate = new Date(selectedDate);

    // Filter approvals by different date fields based on type
    const filteredApprovals = storeData.listApproval.filter((approval) => {
      let targetDate;

      if (type === "approvalDate") {
        // For approval date, check approvedDate or rejectedDate
        targetDate = approval.approvedDate || approval.rejectedDate;
      } else {
        // Default to submittedDate for other cases
        targetDate = approval.submittedDate || approval.createdDate;
      }

      if (!targetDate) return true; // Include approvals without the target date

      const approvalDate = new Date(targetDate);
      return approvalDate.toDateString() === filterDate.toDateString();
    });

    console.log(`Filtered approvals by ${type || "submitted"} date:`, filteredApprovals.length);
    getTableListApproval(filteredApprovals);
  } catch (error) {
    console.error("Error filtering approvals by date:", error);
  }
}

// Function to filter approvals by search term
function filterApprovalsBySearch(searchTerm) {
  // if (!storeData.listApproval) return;

  console.log("storeData.listApproval", storeData.listApproval);
  console.log("searchTerm", searchTerm);

  const filteredApprovals = storeData.listApproval.filter((approval) =>
    approval.draftName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  getTableListApproval(filteredApprovals);
}

// Function to update all approval filters comprehensively
function updateApprovalFilters() {
  const searchTerm = $("#searchApproval").val();
  const approvalDate = $("#approvalDate").val();
  const submittedDate = $("#submittedDate").val();
  const statusApproval = $("#statusApproval").val();

  if (!storeData.listApproval) return;

  // Start with original data, don't modify storeData.listApproval directly
  let filteredApprovals = [...storeData.listApproval];

  // Apply status filter first
  if (statusApproval && statusApproval != "all") {
    filteredApprovals = filteredApprovals.filter((data) => {
      if (statusApproval == "isSubmitted") {
        return (
          data.isSubmitted == true && data.isRejected == false && data.isApproved == false && data.isFinalized == false
        );
      } else if (statusApproval == "isRejected") {
        return data.isRejected == true && data.isApproved == false;
      } else if (statusApproval == "isApproved") {
        return data.isApproved == true;
      } else if (statusApproval == "isFinalized") {
        return data.isFinalized == true;
      }
      return true;
    });
  }

  // Apply search filter
  if (searchTerm) {
    filteredApprovals = filteredApprovals.filter((approval) =>
      approval.draftName.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }

  // Apply date filters
  if (approvalDate || submittedDate) {
    try {
      filteredApprovals = filteredApprovals.filter((approval) => {
        let matchesFilter = true;

        // Check approval date filter
        if (approvalDate) {
          const filterDate = new Date(approvalDate);
          const targetDate = approval.approvedDate || approval.rejectedDate;
          if (targetDate) {
            const approvalDateObj = new Date(targetDate);
            matchesFilter = matchesFilter && approvalDateObj.toDateString() === filterDate.toDateString();
          } else {
            matchesFilter = false; // No approval/rejection date available
          }
        }

        // Check submitted date filter
        if (submittedDate) {
          const filterDate = new Date(submittedDate);
          const targetDate = approval.submittedDate || approval.createdDate;
          if (targetDate) {
            const submittedDateObj = new Date(targetDate);
            matchesFilter = matchesFilter && submittedDateObj.toDateString() === filterDate.toDateString();
          } else {
            matchesFilter = false; // No submitted date available
          }
        }

        return matchesFilter;
      });
    } catch (error) {
      console.error("Error applying date filters:", error);
    }
  }

  console.log("Comprehensive approval filter applied, results:", filteredApprovals.length);
  getTableListApproval(filteredApprovals);
}
