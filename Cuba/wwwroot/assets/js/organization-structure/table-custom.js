function getTablePositionList(dataSet, status) {
  if ($.fn.DataTable.isDataTable("#subPositionList")) {
    $("#subPositionList").DataTable().destroy();
  }
  console.log("dataSet", dataSet);
  $("#subPositionList").DataTable({
    dom: '<"d-flex justify-content-between"fB>rt<"bottom"ip><"clear">',
    buttons: [
      // {
      //   text: '<img src="/assets/images/rasci/plus.svg" alt="Filter Icon" style="margin-top: -1px;margin-right: 2px;"> Duplicate Sub Position',
      //   className: "btn btn-primary tet-white asik dt-custom-btn",
      //   action: function (e, dt, node, config) {
      //     skidipi("Custom Button Clicked!");
      //   },
      // },
      {
        text: '<img src="/assets/images/rasci/plus.svg" alt="Filter Icon" style="margin-top: -1px;margin-right: 2px;"> Add New Sub Position',
        className: "btn btn-primary tet-white asik dt-custom-btn",
        action: function (e, dt, node, config) {
          // addSubPosition click
          // $("#modalAddSubPosition").modal("show");
          statusAction = "add";
          modalSubPosition(true);
        },
      },
    ],
    data: dataSet,
    autoWidth: false,
    sort: false,
    columns: [
      {
        title: "No",
        data: "subPosId",
        width: "5%",
        render: function (data, type, row, meta) {
          return meta.row + 1;
        },
      },
      {
        title: "Sub Position Name",
        width: "30%",
        data: null,
        render: function (data) {
          return data.jobPositionName;
        },
      },
      {
        title: "Career Level",
        width: "30%",
        data: null,
        render: function (data) {
          return data.careerLevel.careerLevelName;
        },
      },
      {
        title: "PRL Org",
        width: "15%",
        data: null,
        render: function (data) {
          if (!data.prlTo) {
            return data.prlFrom;
          }
          return `${data.prlFrom} - ${data.prlTo}`;
        },
      },
      {
        title: "Formation",
        width: "5%",
        data: "formation",
      },
      {
        title: "Action",
        data: null,
        width: "15%",
        render: function (data) {
          // button action edit and delete
          const editPositionDraft = `<button class="btn-custom-outline-primary" onclick="editSubPosition('${data.subPosId}')"> <i class="icon-pencil f-16"></i></button>`;
          const deletePositionDraft = `<button class="btn-custom-outline-danger" onclick="deleteSubPosition('${data.subPosId}')"><i class="icon-trash f-16"></i></button>`;
          return `${editPositionDraft} ${deletePositionDraft}`;
        },
      },
    ],
  });
}

function getTablePositionDetail(dataSet) {
  if ($.fn.DataTable.isDataTable("#subPositionList")) {
    $("#subPositionList").DataTable().destroy();
  }
  $("#subPositionList").DataTable({
    dom: '<"d-flex justify-content-between"fB>rt<"bottom"ip><"clear">',
    buttons: [],
    autoWidth: false,
    data: dataSet,
    sort: false,
    columns: [
      {
        title: "No",
        data: "subPosId",
        width: "5%",
        render: function (data, type, row, meta) {
          return meta.row + 1;
        },
      },
      {
        title: "Sub Position Name",
        width: "30%",
        data: "subPositionName",
      },
      // {
      //   title: "Career Level",
      //   width: "20%",
      //   data: "careerLevel",
      // },
      // {
      //   title: "PRL Org",
      //   width: "15%",
      //   data: "prlOrgToSubPos",
      // },
      // {
      //   title: "Formation",
      //   width: "15%",
      //   data: "formation",
      // },
      // {
      //   title: "Action",
      //   data: null,
      //   width: "30%",
      //   render: function (data) {
      //     return `
      //     <button class="" style="background:transparent;color:black;padding:4px 12px;font-size:12px;border:1px solid black;"  onclick="detailSubPosition('${data.subPosId}')"> <i class="icon-eye p-r-5"></i>Detail</button>
      //     `;
      //   },
      // },
    ],
  });
}

function getTableSubordinateList(dataSet) {
  if ($.fn.DataTable.isDataTable("#subordinateList")) {
    $("#subordinateList").DataTable().destroy();
  }
  $("#subordinateList").DataTable({
    dom: '<"d-flex justify-content-between"fB>rt<"bottom"ip><"clear">',
    buttons: [
      {
        text: '<img src="/assets/images/rasci/plus.svg" alt="Filter Icon" style="margin-top: -1px;margin-right: 2px;"> Duplicate Subordinate',
        className: "btn btn-primary tet-white asik dt-custom-btn",
        action: function (e, dt, node, config) {
          skidipi("Custom Button Clicked!");
        },
      },
      {
        text: '<img src="/assets/images/rasci/plus.svg" alt="Filter Icon" style="margin-top: -1px;margin-right: 2px;"> Add New Subordinate',
        className: "btn btn-primary tet-white asik dt-custom-btn",
        action: function (e, dt, node, config) {
          // addSubPosition click
          // $("#modalAddSubPosition").modal("show");
          // modalSubPosition();
          window.location.href = "/organization/new-subordinate";
          localStorage.removeItem("uniquePosCode");
          localStorage.setItem("uniquePosCode", uuidv4());
        },
      },
    ],
    data: dataSet,
    sort: false,
    columns: [
      {
        title: "No",
        data: "id",
        width: "5%",
        render: function (data, type, row, meta) {
          return meta.row + 1;
        },
      },
      {
        title: "Position Name",
        width: "20%",
        data: "positionName",
      },
      {
        title: "PRL Org",
        width: "10%",
        data: "prlOrg",
      },
      {
        title: "Formation",
        width: "20%",
        data: "formation",
      },
      {
        title: "Basket",
        data: null,
        width: "25%",
        render: function (data) {
          // button action edit and delete

          const isBasket = data.isBasket ? "Yes" : "No";
          return isBasket;
        },
      },
      {
        title: "Action",
        data: null,
        width: "25%",
        render: function (data) {
          // button action edit and delete
          return `
          <button class="btn btn-dark btn-sm" onclick="editSubordinate('${data.id}')">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteSubordinate('${data.id}')">Delete</button>
          `;
        },
      },
    ],
  });
}

async function getTableListDraft(params) {
  console.log("draftList", params);
  // createdDate descending
  params = params.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
  if ($.fn.DataTable.isDataTable("#draftList")) {
    $("#draftList").DataTable().destroy();
  }
  $("#draftList").DataTable({
    dom: '<"d-flex justify-content-between"fB>rt<"bottom"ip><"clear">',
    buttons: [],
    autoWidth: false,
    data: params,
    sort: false,
    searching: false, // Disable the search box
    columns: [
      {
        title: "No",
        data: "id",
        width: "5%",
        render: function (data, type, row, meta) {
          return meta.row + 1;
        },
      },
      {
        title: "Draft Name",
        data: "draftName",
        width: "50%",
      },
      {
        title: "Created By",
        width: "15%",
        data: null,
        render: function (data) {
          const createdDate = new Date(data.createdDate);
          // indonesian date format dd/mm/yyyy
          const formattedDate = createdDate.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });
          const formattedTime = createdDate.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          });
          return `
          <span>${data?.createdBy}</span>
          <br/>
          <span class="text-muted f-12">${formattedDate} ${formattedTime}</span>
          `;
        },
      },
      {
        title: "Updated By",
        width: "15%",
        data: null,
        render: function (data) {
          const modifiedDate = new Date(data.modifiedDate);
          const formattedDate = modifiedDate.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });
          const formattedTime = modifiedDate.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          });
          return `
          <span>${data?.modifiedBy}</span>
          <br/>
          <span class="text-muted f-12">${formattedDate} ${formattedTime}</span>
          `;
        },
      },
      {
        title: "Action",
        width: "15%",
        data: null,
        render: function (data) {
          console.log("check data", data);
          return checkButtonTable("draftList", data.draftId, lastPath);
        },
      },
    ],
  });
  // if ($.fn.DataTable.isDataTable("#requestList")) {
  //   $("#requestList").DataTable().destroy();
  // }
  // $("#requestList").DataTable({
  //   dom: '<"d-flex justify-content-between"fB>rt<"bottom"ip><"clear">',
  //   buttons: [],
  //   data: listDraft,
  //   sort: false,
  //   responsive: true,
  //   columns: [
  //     {
  //       title: "No",
  //       data: "id",
  //       width: "2%",
  //       render: function (data, type, row, meta) {
  //         return meta.row + 1;
  //       },
  //     },
  //     {
  //       title: "Draft Name",
  //       data: "draft-name",
  //       width: "30%",
  //     },
  //     {
  //       title: "Created By",
  //       data: "created-by",
  //       width: "30%",
  //     },
  //     {
  //       title: "Updated By",
  //       data: "updated-by",
  //       width: "30%",
  //     },
  //     {
  //       title: "Action",
  //       data: null,
  //       width: "8%",
  //       render: function (data) {
  //         return `
  //         <button class="btn btn-dark" style="padding:4px 12px;font-size:12px;"  onclick="editDraft('${data.id}')">Edit</button>
  //         <button class="btn btn-danger" style="padding:4px 12px;font-size:12px;"  onclick="deleteDraft('${data.id}')">Delete</button>
  //         `;
  //       },
  //     },
  //   ],
  // });
}

function getTableListApproval(params) {
  params = params.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
  if ($.fn.DataTable.isDataTable("#approvalList")) {
    $("#approvalList").DataTable().destroy();
  }
  $("#approvalList").DataTable({
    dom: '<"d-flex justify-content-between"fB>rt<"bottom"ip><"clear">',
    buttons: [],
    autoWidth: false,
    data: params,
    sort: false,
    searching: false, // Disable the search box
    columns: [
      {
        title: "No",
        data: "id",
        width: "5%",
        render: function (data, type, row, meta) {
          return meta.row + 1;
        },
      },
      {
        title: "Request ID",
        data: "draftId",
        width: "15%",
      },
      {
        title: "Draft Name",
        data: "draftName",
        width: "20%",
      },
      {
        title: "Submitted Date",
        width: "15%",
        data: null,
        render: function (data) {
          const submittedDate = new Date(data.submittedDate);
          const formattedDate = submittedDate.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });
          const formattedTime = submittedDate.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          });
          return `
          <span class="text-muted f-12">${formattedDate} ${formattedTime}</span>
          `;
        },
      },
      {
        title: "Approval/Reject Date",
        width: "15%",
        data: null,
        render: function (data) {
          const date = data?.approvalDate ? data.approvalDate : data.rejectedDate;
          if (!date) {
            return "-";
          }
          const approvalDate = new Date(date);
          const formattedDate = approvalDate.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });
          const formattedTime = approvalDate.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          });
          return `
          <span class="text-muted f-12">${formattedDate} ${formattedTime}</span>
          `;
        },
      },
      {
        title: "Status",
        data: null,
        width: "15%",
        render: function (data) {
          let statusText = "Draft";
          let statusClass = "bg-secondary";

          if (data.isSubmitted) {
            statusText = "On Review";
            statusClass = "label-warning-custom";
          }
          if (data.isRejected) {
            statusText = "Rejected";
            statusClass = "label-danger-custom";
          }
          if (data.isApproved) {
            statusText = "Approved";
            statusClass = "label-success-custom";
          }
          if (data.isFinalized) {
            statusText = "Finalized";
            statusClass = "label-primary-custom";
          }
          return `<span class="p-2 b-r-8 ${statusClass}">${statusText}</span>`;
        },
      },
      {
        title: "Action",
        width: "25%",
        className: "text-center",
        data: null,
        render: function (data) {
          // console.log("data", data)
          return checkButtonTable("approvalList", data.draftId, lastPath);
        },
      },
    ],
  });
}

function getTableListDraftDetail(params, getStatusDraft = { step: 0, userRole: "user" }) {
  if ($.fn.DataTable.isDataTable("#draftListDetail")) {
    $("#draftListDetail").DataTable().destroy();
  }

  $("#draftListDetail").DataTable({
    dom: '<"d-flex justify-content-between"fB>rt<"bottom"ip><"clear">',
    buttons: [],
    autoWidth: false,
    data: params,
    sort: false,
    columns: [
      {
        title: "No",
        data: "id",
        width: "5%",
        render: function (data, type, row, meta) {
          return meta.row + 1;
        },
      },
      {
        title: "Activity Type",
        data: "actionType",
        width: "15%",
        data: null,
        render: function (data) {
          let text = "Created New Job";
          if (data.actionType === "Update") {
            text = "Edit Job";
          } else if (data.actionType === "Delete") {
            text = "Delete Job";
          }
          return text;
        },
      },
      {
        title: "ID Org Unit",
        data: "unitCode",
        width: "10%",
      },
      {
        // title: "ID Pos",
        title: "ID Position",
        data: "positionCode",
        width: "10%",
      },
      {
        title: "Position Name",
        // title: "Job Title",
        data: "positionName",
        width: "20%",
      },
      {
        title: "PRL",
        data: "prlOrg",
        width: "5%",
      },
      {
        title: "Direct Report",
        data: "unitParentName",
        width: "20%",
      },
      {
        title: "Action",
        width: "25%",
        data: null,
        render: function (data) {
          return checkButtonTable(
            "positionList",
            data.unitCode,
            window.location.pathname.split("/").pop(),
            getStatusDraft,
            data,
          );
        },
      },
    ],
  });
}

function getTableListLog(params) {
  if ($.fn.DataTable.isDataTable("#logList")) {
    $("#logList").DataTable().destroy();
  }
  $("#logList").DataTable({
    dom: '<"d-flex justify-content-between"fB>rt<"bottom"ip><"clear">',
    layout: {
      topStart: {
        div: {
          className: "warn",
          id: "warn-btn",
          html: "Click button to acknowledge: <button>Ack</button>",
        },
      },
    },
    buttons: [],
    data: listLog,
    searching: false, // Disable the search box
    sort: false,
    columns: [
      {
        title: "No",
        data: "id",
        width: "2%",
        render: function (data, type, row, meta) {
          return meta.row + 1;
        },
      },
      {
        title: "Date Time",
        width: "23%",
        data: "date-time",
      },
      {
        title: "User",
        width: "25%",
        data: "user-name",
      },
      {
        title: "Draft Name",
        width: "25%",
        data: "draft-name",
      },
      {
        title: "Detail",
        width: "25%",
        data: "detail",
      },
    ],
  });
}

function getDeleteMoveVariousTable(params) {
  if ($.fn.DataTable.isDataTable("#deleteMoveVariousTable")) {
    $("#deleteMoveVariousTable").DataTable().destroy();
  }
  $("#deleteMoveVariousTable").DataTable({
    dom: '<"d-flex justify-content-between"fB>rt<"bottom"ip><"clear">',
    layout: {
      topStart: {
        div: {
          className: "warn",
          id: "warn-btn",
          html: "Click button to acknowledge: <button>Ack</button>",
        },
      },
    },
    buttons: [],
    data: deleteSubordinateList,
    searching: false, // Disable the search box
    sort: false,
    columns: [
      {
        title: "Suborinate",
        width: "100%",
        data: null,
        render: function (data) {
          return checkButtonTable("deleteMoveVariousTable", data?.["subordinate-name"]);
        },
      },
    ],
  });
}
