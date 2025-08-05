async function initializeHelper(data) {
  if (!data) {
    //
  }

  // Show loading before starting chart initialization
  if (typeof showChartLoading === "function") {
  } else {
    // Fallback loading for legacy support
    const osContainer = document.getElementById("osContainer");
    if (osContainer) {
      osContainer.innerHTML = `
      <div style="display: flex; justify-content: center; align-items: center; height: 200px; flex-direction: column;">
      <div style="border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; width: 40px; height: 40px; animation: spin 2s linear infinite;"></div>
      <p style="margin-top: 10px; color: #666;">Loading chart...</p>
      </div>
      <style>
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
        }
        </style>
        `;
    }
  }

  showChartLoading("chart-container-custom");
  try {
    const dataChart = await chartShow({
      draftId: organizationAttribute.orgUnitId,
      jobCode: "10132406",
      depth: 5,
    });

    if (!dataChart.data) {
      dataChart.data = [];
    }
    dataChart.data.forEach((item) => {
      item.id = item.id_org_unit;
    });

    const self = dataChart.data.find((item) => item.id == "10132406");
    const parent = dataChart.data.find((item) => item.id == self.pid);
    dataChart.data = dataChart.data.filter((item) => item.id != self.pid);
    if (parent) {
      parent.pid = null;
    }
    dataChart.data.unshift(parent);

    initializeChartSystem(dataChart.data);

    // testing dataMaster
    // initializeChartSystem(dataMaster);

    // Wait for chart to complete rendering before hiding loading
    setTimeout(() => {
      if (typeof hideChartLoading === "function") {
        hideChartLoading("chart-container-custom");
      }
      console.log("Chart initialization and loading completed");
    }, 1500); // Wait 1.5 seconds for chart to fully render
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
}

function updateDataList(orgUnitId, orgUnitName) {
  if (organizationAttribute.orgUnitId == "" || organizationAttribute.orgUnitId == null) return;
  // update bagan
  // dotnet ef migrations remove; dotnet ef migrations add rasci; dotnet ef database update
  // initializeHelper(data);
  // update data list draft
}

$("#searchOrgNodeButton").on("click", function () {
  const searchValue = $("#searchOrgNode").val();
  // focusNode(searchValue);
});

$("#searchOrgNode").on("change", function () {
  let searchValue = $("#searchOrgNode").val();
  // console.log("masuk sini", searchValue);
  // if (searchValue == "10132405") {
  //   searchValue = "10132406"; // hardcode for testing
  // }
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
  localStorage.setItem("organizationAttribute", JSON.stringify(organizationAttribute));
  const buttons = ["#createJob", "#designCost", "#editJob", "#deleteJob", "#duplicateJob"];
  buttons.forEach((button) => $(button).toggle(organizationAttribute.orgUnitId !== "1"));
  if (organizationAttribute.orgUnitId == "1") {
    $("#pillsSoSection").attr("style", "display:none !important");
    $("#labelChart").attr("style", "display:none !important");
    // $("#createDraft").show();
  } else {
    // $("#createDraft").attr("style", "display:none !important");
    $("#pillsSoSection").show();
    $("#labelChart").show();
  }
}

async function confirmDuplicate(id) {
  await draftJobDuplicate({
    draftId: organizationAttribute.orgUnitId,
    userId: "system",
    unitCodeReference: $("#positionId").val(),
  });
  $("#modalConfirm").modal("hide");
  swal("Success", "Position has been duplicated", "success");
}

async function duplicateJob(draftId, positionId) {
  $("#modalDetailJob").modal("hide");
  const action = [
    actionBack,
    {
      button: "Edit",
      className: "btn-primary",
      callbackFunction: "confirmDuplicate",
    },
  ];
  modalConfrimHelper(
    "confirm",
    "Duplicate Position",
    "<span>Are you sure want to duplicate <b>Manager Strategic Planning</b> position?</span>",
    "",
    action,
    "40%",
    1
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

const positionId = $("#positionId").val();

function confirmDeleteOption(value) {
  hideModal(`modalConfirm`);
  swal(
    "Saved",
    "Activity delete Manager Strategic Planning position has been saved to draft Evaluasi Struktur Organisasi 2025",
    "success"
  );
}

async function confirmDeleteJob(unitCode) {
  const positionId = $("#positionId").val();
  // check radio button name deleteOption
  const deleteOption = $("input[name='deleteOption']:checked").val();
  // return;
  // takeout data if directReportId is empty or ''
  const tableVarious = $("#editMoveVariousTable");
  const data = tableVarious.DataTable().rows().data().toArray();
  const dataSelect = data.map((item) => ({
    unitCode: item[0],
    unitCodeParent: $(`#editSelect${item[0]}`).val(),
  }));
  const dataSelectFiltered = dataSelect.filter((item) => item.unitCodeParent != "" && item.unitCodeParent != null);
  if (deleteOption == "deleteAll") {
    const deleteData = await draftJobDelete({
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
  } else if (deleteOption == "deleteMoveSpesific") {
    const geteditSelectNewValue = $("#editSelectNew").val();
    const movePosition = dataSelect.map((item) => ({
      unitCode: item.unitCode,
      unitCodeParent: geteditSelectNewValue,
    }));
    await moveJob(movePosition);
    const deleteData = await draftJobDelete({
      draftId: organizationAttribute.orgUnitId,
      unitCode: unitCode,
      prlOrg: "8-9",
      userId: "system",
    });
    if (deleteData) {
      swal("Success", "Position has been deleted", "success");
      // hide modal
      $("#modalConfirm").modal("hide");
    }
  } else {
    await moveJob(dataSelectFiltered);
    const deleteData = await draftJobDelete({
      draftId: organizationAttribute.orgUnitId,
      unitCode: unitCode,
      prlOrg: "8-9",
      userId: "system",
    });
    if (deleteData) {
      swal("Success", "Position has been deleted", "success");
      // hide modal
      $("#modalConfirm").modal("hide");
    }
  }
}

async function handleEditJob() {
  statusHelper.formPositionAsCreated = false;
  const getPositionById = $(`#positionId`).val();
  $("#modalDetailJob").modal("hide");
  const getDataSub = await draftJobSubordinate({
    draftId: organizationAttribute.orgUnitId,
    jobCode: $("#positionId").val(),
  });
  const dataSub =
    getDataSub?.data?.map((item) => ({
      unitCode: item.unitCode,
      unitName: item.unitName,
    })) ?? [];
  if (!dataSub.length) {
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
  callSelect2("editMoveVariousTable");
}

async function handleDeleteJob() {
  const getDataSub = await draftJobSubordinate({
    draftId: organizationAttribute.orgUnitId,
    jobCode: $("#positionId").val(),
  });

  const dataSub =
    getDataSub?.data?.map((item) => ({
      unitCode: item.unitCode,
      unitName: item.unitName,
    })) ?? [];
  // const findChildren = lsListPosition.filter((x) => x.directReportId == getPositionById);
  //  have no children then straght redirect
  // create table editMoveVariousTable
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
  const divDeleteSpesific = `<span>Are you sure want to delete <b>Manager Strategic Planning</b> position?</span>
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
  // callSelect2("editMoveSpesificTable");
  // callSelect2("editMoveVariousTable");
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
  // callSelect2("editMoveSpesificTable");
}

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

async function confirmEditJob() {
  const positionId = $("#positionId").val();
  const editPositionBox = $("input[name='editPositionBox']:checked").val();
  if (editPositionBox == "editSelf") {
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
    console.log("dataSelectFiltered", dataSelectFiltered);

    const result = await moveJob(dataSelectFiltered);
    swal("Success", "position has been moved to new  parent position", "success");
    $("#modalConfirm").modal("hide");
    return;
    // if (!dataSelectFiltered.length) {
    //   alert("Please select direct report");
    //   return;
    // }
    // dataSelectFiltered.forEach((item) => {
    //   const position = lsListPosition.find((x) => x.positionId == item.positionId);
    //   const directReport = lsListPosition.find((x) => x.positionId == item.directReportId);

    //   // update listPosition
    //   // update directReportId
    //   const indexPosition = lsListPosition.findIndex((x) => x.positionId == item.positionId);
    //   lsListPosition[indexPosition].directReportId = parseInt(item.directReportId);
    //   lsListPosition[indexPosition].directReport = directReport.position;

    //   lsListPosition[indexPosition].draftId = organizationAttribute.orgUnitId;
    //   lsListPosition[indexPosition].type = "edit";

    //   const payload = {
    //     positionId: item.positionId,
    //     draftId: organizationAttribute.orgUnitId,
    //     // add other necessary properties here
    //   };

    //   console.log("item.directReportId", item.directReportId);
    //   const checkData = lsListDetailDraft.find(
    //     (item) => item.positionId == payload.positionId && item.draftId == payload.draftId
    //   );

    //   if (checkData) {
    //     const index = lsListDetailDraft.findIndex(
    //       (item) => item.positionId == payload.positionId && item.draftId == payload.draftId
    //     );
    //     lsListDetailDraft[index] = lsListPosition[indexPosition];
    //   } else {
    //     lsListDetailDraft.push(lsListPosition[indexPosition]);
    //   }

    //   // update listDraftOrgNode and listOrgNode
    //   const indexOrgNode = lsListOrgNode.findIndex((x) => x.id_position == item.positionId);
    //   console.log(indexOrgNode);
    //   lsListOrgNode[indexOrgNode].id_position_atasan_langsung = parseInt(item.directReportId);
    //   lsListOrgNode[indexOrgNode].pid = parseInt(item.directReportId);
    //   lsListOrgNode[indexOrgNode].tags.push("edit");
    //   lsListOrgNode[indexOrgNode].draft_id = organizationAttribute.orgUnitId;
    //   lsListOrgNode[indexOrgNode].type = "edit";

    //   const checkData2 = lsListDraftOrgNode.find(
    //     (item) => item.id_position == payload.positionId && item.draft_id == payload.draftId
    //   );
    //   if (checkData2) {
    //     const index = lsListDraftOrgNode.findIndex(
    //       (item) => item.id_position == payload.positionId && item.draft_id == payload.draftId
    //     );
    //     lsListDraftOrgNode[index] = lsListOrgNode[indexOrgNode];
    //   } else {
    //     lsListDraftOrgNode.push(lsListOrgNode[indexOrgNode]);
    //   }
    //   // localStorage.setItem("listPosition", JSON.stringify(lsListPosition));
    //   localStorage.setItem("listDraftDetail", JSON.stringify(lsListDetailDraft));
    //   // localStorage.setItem("listOrgNode", JSON.stringify(lsListOrgNode));
    //   localStorage.setItem("listDraftOrgNode", JSON.stringify(lsListDraftOrgNode));
    // });

    // return;

    changeOrganization(organizationAttribute.orgUnitId, organizationAttribute.orgUnitName);
    getDataOrganization(organizationAttribute.orgUnitId);
    $("#modalConfirm").modal("hide");
    swal("Success", "Job has been edited", "success");
    focusNode(positionId);
    // const checkData = lsListDetailDraft.find(
    //   (item) => item.positionId == payload.positionId && item.draftId == payload.draftId
    // );
    // console.log("checkData 1", checkData, payload.draftId);

    // if (checkData) {
    //   const index = lsListDetailDraft.findIndex(
    //     (item) => item.positionId == payload.positionId && item.draftId == payload.draftId
    //   );
    //   lsListDetailDraft[index] = payload;
    // } else {
    //   lsListDetailDraft.push(payload);
    // }
  }
}

function callSelect2(params) {
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

async function showRasciMatrix() {
  const getPositionById = $(`#positionId`).val();
  // redirect in target="_blank"
  window.open("/Rasci/index?jobId=" + getPositionById, "_blank");
}
async function showJobDesc() {
  const getPositionById = $(`#positionId`).val();
  // redirect in target="_blank"
  window.open("/job-description/detail?&id=" + getPositionById, "_blank");
}

async function confirmDeleteDraft(id) {
  lsListDraft = lsListDraft.filter((x) => x.draftId != id);
  localStorage.setItem("listDraft", JSON.stringify(lsListDraft));
  getTableListDraft(lsListDraft.filter((x) => x.draftName != "Master Data SO"));

  getDataList([
    {
      dataId: "selectDraftOrganization",
      data: lsListDraft.map((item) => ({ id: item.draftId, text: item.draftName })),
    },
    {
      dataId: "selectDraftName",
      data: lsListDraft.map((item) => ({ id: item.draftId, text: item.draftName })),
      isHide: true,
    },
  ]);
  hideModal(`modalConfirm`);
  swal("Success", "Draft has been deleted", "success");
}

async function deleteDraft(paramsId) {
  const getDraftById = await lsListDraft.find((x) => x.draftId == paramsId);
  if (!getDraftById) {
    swal("Error", "Draft not found", "error");
    return;
  }
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
    `Are you sure want to delete <b>${getDraftById.draftName}</b> draft?`,
    "All Position title in this draft will be deleted, including related RASCI notations, Competencies, and Position Descriptions",
    action,
    "",
    getDraftById.draftId
  );
}

function detailDraft(id) {
  window.location.href = "/organization/draft-detail?draftId=" + id;
  changeOrganization(id, lsListDraft.find((x) => x.draftId == id).draftName);
}

function detailapproval(id) {
  window.location.href = "/organization/approval-detail?draftId=" + id;
}

function checkIsMasterData() {
  if (organizationAttribute.orgUnitName == "Master Data SO") {
    // modal z-index 99999
    $("#modalCreateDraftSO").modal("show").attr("style", "z-index: 1070");
    $("#inputDraftName").val("");
    return true;
  }
  return false;
}

function createJob() {
  $("#modalLabelOSDraft").text("Create Organization Structure Draft");
  const isMasterData = checkIsMasterData();
  if (!isMasterData) {
    window.location.href = "/organization/form-position";
  }
}

function onChangeEditOption(e, value) {
  // moveSubordinate
  // editSelf
  const valueSpesific =
    e.value == "editSelf" ? "row m-t-10  m-b-10 p-10 m-r-10" : "row m-t-10  m-b-10 d-none p-10 m-r-10";
  const valueVarious =
    e.value == "moveSubordinate" ? "row m-t-10  m-b-10 p-10 m-r-10" : "row m-t-10  m-b-10 d-none p-10 m-r-10";
  // $("#deleteMoveSpesificDiv").attr("class", valueSpesific);
  $("#deleteMoveVariousDiv").attr("class", valueVarious);
}
function onChangeDeleteOption(e, value) {
  const valueSpesific =
    e.value == "deleteMoveSpesific" ? "row m-t-10  m-b-10 p-10 m-r-10" : "row m-t-10  m-b-10 d-none p-10 m-r-10";
  const valueVarious =
    e.value == "deleteMoveVarious" ? "row m-t-10  m-b-10 p-10 m-r-10" : "row m-t-10  m-b-10 d-none p-10 m-r-10";
  $("#deleteMoveSpesificDiv").attr("class", valueSpesific);
  $("#deleteMoveVariousDiv").attr("class", valueVarious);
}

$("input[name='radioDraft']").on("change", function () {
  const radioValue = $("input[name='radioDraft']:checked").val();
  const value = { target: { value: radioValue, name: "DraftName", checked: false } };
  if (radioValue == "newDraft") {
    value.target.checked = true;
  }
  onChangeSwith(value, "DraftName");
});

// validasi continue draft
$("#continueButton").click(async function () {
  const draftName = $("#inputDraftName").val() ?? $("#selectDraftName").val();
  if (storeData.listDraft.find((x) => x.draftName == $("#inputDraftName").val())) {
    swal("Failed", `${draftName} draft is already exist, please change to another draft name`, "error");
    return;
  }

  if (!draftName) {
    alert("Draft Name is required");
    return;
  }

  const saveDraft = await createDraftSO(draftName);

  if (saveDraft.status == 500) {
    swal("Failed", saveDraft.error, "error");
    return;
  }
  const getDataDraft = await chartDraftList();
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
  await changeDataSourceFilter(filter);
  $("#modalPreviewDesignCost").modal("show");
});

$("#selectDraftFilterByDataSource").on("change", async function () {
  const filter = $("#selectDraftFilterByDataSource").val();
  await changeDataSourceFilter(filter);
});

// click export org chart
$("#exportOrgChart").click(function () {
  // alert("exportOrgChart");
});

// change select draft organization
$("#selectDraftOrganization").change(async function () {
  changeOrganization($("#selectDraftOrganization").val(), $("#selectDraftOrganization option:selected").text());
  // getDataOrganization(organizationAttribute.orgUnitId);
  initializeHelper();
  // const getListOrgNode = await chartOrgNodeList({
  //   draftId: organizationAttribute.orgUnitId,
  // });
  getDataListAsync([
    {
      id: "searchOrgNode",
      endpoint: "chart/job/list",
      draftId: organizationAttribute.orgUnitId,
    },
  ]);
  // storeData.listOrgNode = getListOrgNode.data.length > 0 ? getListOrgNode.data : [];
  // if (typeof storeData.listOrgNode == "string") {
  //   alert("masuk sini 2");
  //   return;
  // }
  // getDataList([
  //   {
  //     dataId: "searchOrgNode",
  //     data:
  //       storeData.listOrgNode.length > 0
  //         ? storeData.listOrgNode.map((item) => ({ id: item.unitCode, text: item.unitName }))
  //         : [],
  //   },
  // ]);
});

$(document).ready(async function () {
  loader(false);

  const getDataDraft = await chartDraftList();
  const getDataApproval = await approvedList();
  storeData.listDraft = getDataDraft.data;
  await checkDataOrganization(storeData.listDraft);

  // initialize table
  getTableListDraft(storeData.listDraft.filter((x) => x.draftName != "Master Data SO"));
  getTableListApproval(getDataApproval.data);
  // getTableListLog();
  getDataList([
    {
      dataId: "selectDraftOrganization",
      data: storeData.listDraft.map((item) => ({ id: item.draftId, text: item.draftName })),
    },
  ]);

  await checkDataOrganization(storeData.listDraft);

  $("#createDraft").on("click", function () {
    $("#modalCreateDraftSO").modal("show").attr("style", "z-index: 1070");
    $("#inputDraftName").val("");
    return true;
  });

  // check data Initial
  // getDataOrganization(organizationAttribute.orgUnitId);

  $("#selectDraftOrganization").val(organizationAttribute.orgUnitId).trigger("change");
  const focusNode = urlParams.get("focusNode");
  const activeTab = urlParams.get("activeTab");
  if (focusNode) {
    setTimeout(async () => {
      // alert('masok')
      let data = await chartJobDetail({
        draftId: organizationAttribute.orgUnitId,
        jobCode: focusNode,
      });
      data = data.data;
      // $("#searchOrgNode").val(focusNode).trigger("change");
      $("#searchOrgNode").append(new Option(data.position, focusNode, true, true)).trigger("change");
    }, 1000);
  }

  if (activeTab) {
    const linkTab = "#pills" + activeTab.charAt(0).toUpperCase() + activeTab.slice(1);
    setTimeout(() => {
      $(linkTab).tab("show");
    }, 2000);
  }
});
