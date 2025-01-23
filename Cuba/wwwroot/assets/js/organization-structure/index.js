function initializeHelper(data) {
  if (!data) {
    //
  }
  // helper orTree
  helperOrgTree(lsListOrgNode);
  // get helper datePicker
  helperDatePicker();
  // helper bagan
  helperOrgChart(true, "os-container", lsListOrgNode, true);
}

function updateDataList(orgUnitId, orgUnitName) {
  if (organizationAttribute.orgUnitId == "" || organizationAttribute.orgUnitId == null) return;
  // update bagan

  // initializeHelper(data);
  // update data list draft
}

$("#searchOrgNodeButton").on("click", function () {
  const searchValue = $("#searchOrgNode").val();
  console.log("masuk sini");
  focusNode(searchValue);
});

$("#searchOrgNode").on("change", function () {
  focusNode($("#searchOrgNode").val());
});

function changeOrganization(value, text) {
  organizationAttribute.orgUnitId = value;
  organizationAttribute.orgUnitName = text;
  localStorage.setItem("organizationAttribute", JSON.stringify(organizationAttribute));
  const buttons = ["#createJob", "#designCost", "#editJob", "#deleteJob", "#duplicateJob"];
  buttons.forEach((button) => $(button).toggle(organizationAttribute.orgUnitId !== "1"));
  if (organizationAttribute.orgUnitId == "1") {
    $("#pills-warningtab").attr("style", "display:none !important");
    $("#labelChart").attr("style", "display:none !important");
    $("#createDraft").show();
  } else {
    $("#createDraft").attr("style", "display:none !important");
    $("#pills-warningtab").show();
    $("#labelChart").show();
  }
}

async function duplicateJob(draftId, positionId) {
  const data = [...lsListDetailDraft];
  const selftAttribute = lsListPosition.find((item) => item.positionId == positionId);
  const childrenSubordinate = getallChildrenPosition(positionId);
  const dataSubordinate = [selftAttribute, ...childrenSubordinate];
  lsListDetailDraft = JSON.parse(localStorage.getItem("listDraftDetail"));
  dataSubordinate.forEach((item) => {
    item.positionIdCopy = Math.floor(1000000000 + Math.random() * 9000000000);
    item.positionName = item.positionName + " (Copy)";
    // item.orgUnitIdCopy = Math.floor(1000000000 + Math.random() * 9000000000);
    // item.orgUnitName = item.orgUnitName + " (Copy)";
    if (item.listSubPosition.length > 0) {
      item.listSubPosition.forEach((subItem) => {
        // subItem.subPositionId = Math.floor(1000000000 + Math.random() * 9000000000);
        // subItem.subPositionName = subItem.subPositionName + " (Copy)";
      });
    }
  });
  // console.log("lsListDetailDraft 1", data);
  // console.log("lsListDetailDraft 2", lsListDetailDraft);
  // console.log("dataSubordinate", dataSubordinate);

  let dataSubordinateCopy = correctedDirectReport(positionId);
  dataSubordinateCopy = [selftAttribute, ...dataSubordinateCopy];
  // console.log("dataSubordinateCopy", dataSubordinateCopy);
  // console.log(dataSubordinateCopy);
  // console.log("lsListDetailDraft :>> ", lsListDetailDraft);
  // return;
  dataSubordinateCopy.forEach((item, idx) => {
    item.draftId = draftId;
    item.type = "create";
    if (idx == 0) {
      item.positionId = item.positionIdCopy;
      delete item.positionIdCopy;
      return;
    }
    item.positionId = item.positionIdCopy;
    item.directReportId = item.directReportIdCopy;
    // remove object item.positionIdCopy
    delete item.positionIdCopy;
    delete item.directReportIdCopy;
  });

  dataSubordinateCopy.forEach((itm) => {
    console.log("itm.draftId", itm.draftId);
    const checkData = lsListDetailDraft.find(
      (item) => item.positionId == itm.positionId && item.draftId == itm.draftId
    );
    // console.log("checkData", checkData);
    console.log("checkData", checkData);

    if (checkData) {
      console.log("masuk checkData");
      const index = lsListDetailDraft.findIndex(
        (item) => item.positionId == itm.positionId && item.draftId == itm.draftId
      );
      console.log("masuk checkData", lsListDetailDraft[index]);
      lsListDetailDraft[index] = itm;
    } else {
      lsListDetailDraft.push(itm);
    }
  });

  localStorage.setItem("listDraftDetail", JSON.stringify(lsListDetailDraft));
  saveOrgDetailBulk(draftId, dataSubordinateCopy);
  changeOrganization(draftId, lsListDraft.find((x) => x.draftId == draftId).draftName);
  getDataOrganization(draftId);
  focusNode(selftAttribute.positionId);
  $("#modalDetailJob").modal("hide");
  swal("Success", "Job has been duplicated", "success");
}

function getDataOrganization(orgUnitId) {
  const dataListPosition = lsListDetailDraft.filter((x) => x.draftId == orgUnitId);
  const dataListOrg = lsListDraftOrgNode.filter((x) => x.draft_id == orgUnitId);
  lsListOrgNode = [...myData];
  lsListPosition = [...positionDetail];
  console.log(lsListPosition.length);

  dataListPosition.forEach((item) => {
    const index = lsListPosition.findIndex((x) => x.positionId == item.positionId);
    if (item.type == "create") {
      lsListPosition.push(item);
    } else if (item.type == "edit") {
      if (index == -1) {
        lsListPosition.push(item);
      } else {
        lsListPosition[index] = item;
      }
    } else if (item.type == "delete") {
      lsListPosition.splice(index, 1);
    }
  });

  dataListOrg.forEach((item) => {
    const index = lsListOrgNode.findIndex((x) => x.id_position == item.id_position);
    if (item.type == "create") {
      lsListOrgNode.push(item);
    } else if (item.type === "edit") {
      if (index == -1) {
        lsListOrgNode.push(item);
      } else {
        lsListOrgNode[index] = item;
      }
    } else if (item.type === "delete") {
      lsListOrgNode.splice(index, 1);
    }
    // console.log("lsListOrgNode", lsListOrgNode);
  });
  initializeHelper();

  getDataList([
    {
      dataId: "searchOrgNode",
      data: lsListOrgNode.map((item) => ({ id: item.id_position, text: item.position })),
    },
  ]);

  localStorage.setItem("listOrgNode", JSON.stringify(lsListOrgNode));
  localStorage.setItem("listPosition", JSON.stringify(lsListPosition));
}

async function getInitialData() {
  const listDraft = await listDraftSO();
  return {
    listDraft: listDraft?.value?.data ?? [],
  };
}

const positionId = $("#positionId").val();
// async function handleEditJob(params) {
//   alert("masok");
//   const isMasterData = checkIsMasterData();
//   if (!isMasterData) {
//     window.location.href = "/organization/detail?edit=true&positionId=" + positionId;
//   }
// }

function confirmDeleteOption(value) {
  hideModal(`modalConfirm`);
  swal(
    "Saved",
    "Activity delete Manager Strategic Planning position has been saved to draft Evaluasi Struktur Organisasi 2025",
    "success"
  );
}

function confirmDeleteJob() {
  const positionId = $("#positionId").val();
  const draftId = organizationAttribute.orgUnitId;
  const position = lsListPosition.find((x) => x.positionId == positionId);
  const getParent = lsListPosition.find((x) => x.positionId == position.directReportId);
  const getchildren = getallChildrenPosition(positionId);
  const dataSubordinate = [position, ...getchildren];
  console.log(dataSubordinate);
  // delete from listPosition, listOrgNode, listDraftDetail, listDraftOrgNode
  dataSubordinate.forEach((item) => {
    const indexPosition = lsListPosition.findIndex((x) => x.positionId == item.positionId);
    const indexOrgNode = lsListOrgNode.findIndex((x) => x.id_position == item.positionId);
    const indexDraftDetail = lsListDetailDraft.findIndex((x) => x.positionId == item.positionId);
    const indexDraftOrgNode = lsListDraftOrgNode.findIndex((x) => x.id_position == item.positionId);

    // if indexDraftDetail and indexDraftOrgNode not found
    if (indexDraftDetail == -1 && indexDraftOrgNode == -1) {
      // change data type to delete
      // item.type = "delete";
      // console.log("item", item);
      lsListPosition[indexPosition].type = "delete";
      lsListOrgNode[indexOrgNode].type = "delete";
      lsListOrgNode[indexOrgNode].tags.push("delete");
    } else {
      lsListPosition.splice(indexPosition, 1);
      lsListOrgNode.splice(indexOrgNode, 1);
      lsListDetailDraft.splice(indexDraftDetail, 1);
      lsListDraftOrgNode.splice(indexDraftOrgNode, 1);
    }
  });

  localStorage.setItem("listPosition", JSON.stringify(lsListPosition));
  localStorage.setItem("listOrgNode", JSON.stringify(lsListOrgNode));
  localStorage.setItem("listDraftDetail", JSON.stringify(lsListDetailDraft));
  localStorage.setItem("listDraftOrgNode", JSON.stringify(lsListDraftOrgNode));

  changeOrganization(draftId, lsListDraft.find((x) => x.draftId == draftId).draftName);
  getDataOrganization(draftId);
  $("#modalConfirm").modal("hide");
  focusNode(getParent.positionId);
  swal("Success", "Job has been deleted", "success");
}

async function handleDeleteJob(params) {
  $("#modalDetailJob").modal("hide");
  const action = [
    actionBack,
    {
      button: "Delete",
      className: "btn-danger",
      callbackFunction: "confirmDeleteJob",
    },
  ];
  modalConfrimHelper("delete", "Delete Position", divDeleteSpesific, "", action, "modal-lg", 1);
  getDeleteMoveVariousTable();
}

function confirmEditJob() {
  const positionId = $("#positionId").val();
  const editPositionBox = $("input[name='editPositionBox']:checked").val();
  if (editPositionBox == "editSelf") {
    window.location.href = "/organization/form-position?positionId=" + positionId;
  } else {
    console.log("masuk sini");
    const table = $("#editMoveVariousTable").DataTable();
    const data = table.rows().data();
    // get data select inside table
    const dataSelect = data.map((item) => ({
      positionId: item[0],
      directReportId: $(`#editSelect${item[0]}`).val(),
    }));
    console.log(dataSelect);

    // takeout data if directReportId is empty or ''
    const dataSelectFiltered = dataSelect.filter((item) => item.directReportId != "" && item.directReportId != null);
    console.log(dataSelectFiltered);
    if (!dataSelectFiltered.length) {
      alert("Please select direct report");
      return;
    }
    // console.log($(`#editSelect0`).val());
    // console.log($(`#editSelect0`).text());
    //   {
    //   positionId: item[0],
    //   directReportId: $(`#editSelect${item[0]}`).val(),
    // }));
    // console.log(dataSelect);
  }
  // alert("masok");
}

async function handleEditJob() {
  statusHelper.formPositionAsCreated = false;
  const getPositionById = $(`#positionId`).val();
  $("#modalDetailJob").modal("hide");
  // const isMasterData = checkIsMasterData();
  // if (!isMasterData) {
  //   window.location.href = "/organization/form-position?positionId=" + getPositionById;
  // }
  const findChildren = lsListPosition.filter((x) => x.directReportId == getPositionById);
  const option = lsListPosition.map((item) => ({ id: item.positionId, text: item.positionName }));
  // create table editMoveVariousTable
  let table = ` <table class="tableMasterData table table-hover w-100" id="editMoveVariousTable">`;
  table += `<thead>
    <tr>
      <th>Position Id</th>
      <th>Position Name</th>
      <th>Direct Report</th>
      </tr> </thead>`;
  table += `<tbody>`;
  findChildren.forEach((item, idx) => {
    table += `<tr>
      <td>${item.positionId}</td>
      <td>${item.positionName}</td>
      <td>
      <select class="form-control classEditSelect" id="editSelect${item.positionId}" name="selectDirectReport">
        <option value="">Select Direct Report</option>
        ${
          option && option.length > 0
            ? option.map((item) => `<option value="${item.id}">${item.text}</option>`).join("")
            : ""
        }
      </select>
      </td>
      </tr>`;
  });
  table += `</tbody>`;

  table += `</table>`;

  console.log(findChildren);

  const divEditSpesific = `<span>Are you sure want to delete <b>Manager Strategic Planning</b> position?</span>
    <br/>
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
  modalConfrimHelper("confirm", "Edit Position", divEditSpesific, "", action, "modal-lg", 1);
  $("#modalConfirm").on("shown.bs.modal", function () {
    $(".classEditSelect").select2({
      dropdownParent: $("#editMoveVariousTable"),
      placeholder: "Select Direct Report",
      allowClear: true,
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
  // const checkbox radioDraft
  // const radioDraft = $("input[name='radioDraft']:checked").val();

  if (!draftName) {
    alert("Draft Name is required");
    return;
  }

  // if (radioDraft == "existingDraft" && !$("#selectDraftName").val()) {
  //   alert("Please select draft name");
  //   return;
  // }

  // if (radioDraft == "newDraft") {
  loader(true);
  const getListDraftId = lsListDraft.map((item) => item.draftId);
  const draftId = Math.max(...getListDraftId) + 1;
  const draft = {
    draftId: draftId,
    draftName: draftName,
    createdBy: "Superadmin",
    createdDate: new Date().toLocaleDateString("en-GB"),
    modifiedDate: new Date().toLocaleDateString("en-GB"),
    modifiedBy: "Superadmin",
  };
  lsListDraft.push(draft);
  localStorage.setItem("listDraft", JSON.stringify(lsListDraft));
  $("#modalCreateDraftSO").modal("hide");
  swal("Success", `Draft ${draftName} has been created`, "success");
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
  getTableListDraft(lsListDraft.filter((x) => x.draftName != "Master Data SO"));
  changeOrganization(draftId, draftName);
  $("#selectDraftOrganization").val(organizationAttribute.orgUnitId).trigger("change");
  loader(false);
  // window.location.href = "/organization/form-position";
  swal("Success", `Draft ${draftName} has been created`, "success");
  // } else {
  //   loader(true);
  //   $("#modalCreateDraftSO").modal("hide");
  //   swal("Success", `Draft ${draftName} has been selected`, "success");
  //   changeOrganization($("#selectDraftName").val(), $("#selectDraftName option:selected").text());
  //   getDataOrganization(organizationAttribute.orgUnitId);
  //   loader(false);
  //   // window.location.href = "/organization/form-position?positionId=" + $("#positionId").val();
  // }
  // if (statusHelper.formPositionAsCreated) {
  //   window.location.href = "/organization/form-position";
  // } else {
  //   window.location.href = "/organization/form-position?positionId=" + $("#positionId").val();
  // }
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
$("#designCost").click(function () {
  $("#modalPreviewDesignCost").modal("show");
});

// click export org chart
$("#exportOrgChart").click(function () {
  alert("exportOrgChart");
});

// change select draft organization
$("#selectDraftOrganization").change(function () {
  changeOrganization($("#selectDraftOrganization").val(), $("#selectDraftOrganization option:selected").text());
  getDataOrganization(organizationAttribute.orgUnitId);
  loader(true);
  // wait 1s for update data
  setTimeout(() => {
    loader(false);
  }, 1000);
});

$(document).ready(async function () {
  // initialize helper
  loader(true);

  // get initial data
  // const data = await getInitialData();
  // const dataListDraft = data.listDraft;

  // initialize table
  getTableListDraft(lsListDraft.filter((x) => x.draftName != "Master Data SO"));
  getTableListApproval(lsListApproval.filter((x) => x.draftName != "Master Data SO"));
  getTableListLog();

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

  $("#createDraft").on("click", function () {
    $("#modalCreateDraftSO").modal("show").attr("style", "z-index: 1070");
    $("#inputDraftName").val("");
    return true;
  });

  // check data Initial
  checkDataOrganization();
  // getDataOrganization(organizationAttribute.orgUnitId);

  let activeTab = urlParams.get("activeTab");
  let focusNode = urlParams.get("focusNode");
  if (focusNode) {
    // focusNode(focus
    setTimeout(() => {
      $("#searchOrgNode").val(focusNode).trigger("change");
    }, 1000);
  }

  if (activeTab) {
    const linkTab = "#pills-" + activeTab + "";
    setTimeout(() => {
      $(linkTab).tab("show");
    }, 2000);
  }
});
