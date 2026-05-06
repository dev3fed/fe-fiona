function getTableListJobDes() {
  if ($.fn.DataTable.isDataTable("#jobdescList")) {
    $("#jobdescList").DataTable().destroy();
  }
  const searchValue = $("#searchJobDesc").val();
  const status = $("#selectStatusJobDesc").val().trim();
  const searchBy = $("#btnSearchType").text().toLowerCase();
  $("#jobdescList").DataTable({
    dom: '<"d-flex justify-content-between"fB>rt<"d-flex justify-content-between bottom"lip><"clear">', // Make bottom flex as well
    buttons: [],
    serverSide: true,
    ajax: function (data, callback, settings) {
      $.ajax({
        url: `${url.baseUrl}/${url["job-description"]}/get-list-positions/${data.start}/${data.length}?position=${
          searchBy === "position" ? searchValue : ""
        }&division=${searchBy === "division" ? searchValue : ""}&function=${
          searchBy === "function" ? searchValue : ""
        }&department=${searchBy === "department" ? searchValue : ""}&status=${status}&draftId=${
          draftExistingJobDesc.draftId
        }`,
        type: "GET",
        data: {
          draw: data.draw,
          start: data.start,
          length: data.length,
          search: data.search.value,
          order: data.order,
        },
        success: function (res) {
          callback({
            draw: data.draw,
            recordsTotal: res.count || 0,
            recordsFiltered: res.count || 0,
            data: res.data || [],
          });
        },
        error: function () {
          callback({
            draw: data.draw,
            recordsTotal: 0,
            recordsFiltered: 0,
            data: [],
          });
        },
      });
    },
    sort: false,
    searching: false,
    paging: true,
    pageLength: 10,
    lengthMenu: [5, 10, 25, 50, 100],
    columns: [
      {
        title: "No",
        data: null,
        render: function (data, type, row, meta) {
          return meta.row + meta.settings._iDisplayStart + 1;
        },
      },
      {
        title: "Job Title",
        data: "jobTitle",
      },
      {
        title: "Function",
        data: "function",
      },
      {
        title: "Division",
        data: "division",
      },
      {
        title: "Department",
        data: "department",
      },
      {
        title: "Section",
        data: "section",
      },
      {
        title: "Jobdesc Status",
        className: "text-center",
        data: null,
        render: function (data) {
          if (data.jobDescStatus == "AVAILABLE") {
            return `<span class="badge text-center p-2" style="background-color:#B5FFC7;color:#009024">Available</span>`;
          } else if (data.jobDescStatus == "NOT AVAILABLE") {
            return `<span class="badge text-center p-2" style="background-color:#FAE9EB;color:#D02138">Not Available</span>`;
          } else if (data.jobDescStatus == "ON PROGRESS") {
            return `<span class="badge text-center p-2" style="background-color:#FFE7C5;color:#E18400">On Progress</span>`;
          } else {
            return `<span class="badge text-center p-2" style="background-color:#E6F0F6;color:#006CA9">Waiting Approval</span>`;
          }
        },
      },
      {
        title: "Action",
        width: "10%",
        data: null,
        render: function (data) {
          if (data.jobDescStatus == "NOT AVAILABLE" && draftExistingJobDesc.draftId != defaultMasterId) {
            return `
            <button class="" style="padding:5px 10px ;font-size:12px;width:80%;color:white;background:#006ca9;border:none"  onclick="createJobDesc('${data.jobId}','${data.prlOrg}','${data.positionCode}')"><i class="fas fa-plus p-r-5"></i> Create</button>
            `;
          } else if (data.jobDescStatus == "AVAILABLE" && draftExistingJobDesc.draftId != defaultMasterId) {
            return `
            <button class="" style="padding:5px 10px ;font-size:12px;width:80%;color:black;background:transparent;border:1px solid black"  onclick="createJobDesc('${data.jobId}','${data.prlOrg}','${data.positionCode}')"><i class="fas fa-eye p-r-5"></i> Detail</button>
            `;
          } else {
            return `
            <button class="" style="padding:5px 10px ;font-size:12px;width:80%;color:black;background:transparent;border:1px solid black" onclick="detailJobDesc('${data.jobId}','${data.prlOrg}','${data.positionCode}')"><i class="fas fa-eye p-r-5"></i> Detail</button>
            `;
          }
        },
      },
    ],
  });
}

function getTableListDraft(params) {
  params = params.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
  if ($.fn.DataTable.isDataTable("#draftList")) {
    $("#draftList").DataTable().destroy();
  }
  $("#draftList").DataTable({
    dom: '<"d-flex justify-content-between"fB>rt<"bottom"ip><"clear">',
    buttons: [],
    autoWidth: false,
    searching: false, // Disable the search box
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
        title: "Draft Name",
        data: "draftName",
        width: "25%",
      },
      {
        title: "RASCI MATRIX Data Source",
        data: "draftName",
        width: "25%",
      },
      {
        title: "Created By",
        width: "15%",
        data: null,
        render: function (data) {
          return `
          <span>${data?.createdBy}</span>
          <br/>
          <span class="text-muted f-12">${data.createdDate}</span>
          `;
        },
      },
      {
        title: "Updated By",
        width: "15%",
        data: null,
        render: function (data) {
          return `
          <span>${data?.modifiedBy}</span>
          <br/>
          <span class="text-muted f-12">${data?.modifiedDate}</span>
          `;
        },
      },
      {
        title: "Action",
        width: "15%",
        data: null,
        render: function (data) {
          const draftId =
            data.draftOrganizationId + "|" + data.draftRasciMatrixId + "|" + data.draftId + "|" + data.draftName;
          return checkButtonTable("draftList", draftId, "draft-detail");
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

async function getTableListDraftDetail(data) {
  if ($.fn.DataTable.isDataTable("#draftListDetail")) {
    $("#draftListDetail").DataTable().destroy();
  }

  $("#draftListDetail").DataTable({
    dom: '<"d-flex justify-content-between"fB>rt<"bottom"ip><"clear">',
    buttons: [],
    autoWidth: false,
    data: data,
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
        data: null,
        width: "15%",
        render: function (data) {
          let text = "Created New Job";
          console.log("data", data);
          if (data.actionType === "Update") {
            text = "Edit Job";
          } else if (data.actionType === "Delete") {
            text = "Delete Job";
          }
          return text;
        },
      },
      {
        title: "ID Position",
        data: "jobId",
        width: "10%",
      },
      {
        title: "Position Name",
        data: "jobName",
        width: "20%",
      },

      {
        title: "Created By",
        data: "createdBy",
        width: "15%",
      },
      {
        title: "Updated By",
        data: "modifiedBy",
        width: "15%",
      },
      {
        title: "Action",
        width: "20%",
        data: null,
        render: function (data) {
          const id = data.jobId + "|" + data.prlOrg + "|" + data.positionCode;
          return checkButtonTable("positionList", id, window.location.pathname.split("/").pop());
        },
      },
    ],
  });
}
// editSubPosition button on table subPositionList

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
          const date = data?.submittedDate;
          if (!date) {
            return "-";
          }
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
          const draftId =
            data.draftOrganizationId + "|" + data.draftRasciMatrixId + "|" + data.draftId + "|" + data.draftName;
          return checkButtonTable("approvalList", draftId, "approval-detail");
        },
      },
    ],
  });
}

function getTableListLog(params) {
  if ($.fn.DataTable.isDataTable("#logList")) {
    $("#logList").DataTable().destroy();
  }
  listLog = [
    {
      id: 1,
      "date-time": "05/05/2021 10:00",
      "user-name": "Yani",
      "draft-name": "Draft Name",
      detail: "Edit Org Unit Name from Enhancement to Enhancement for Manager Enhancement",
    },
  ];
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
