function getTable(dataSet) {
  // $("#masterDataList").DataTable({
  //   dom: '<"d-flex justify-content-between"fB>rt<"bottom"ip><"clear">',
  //   buttons: [
  //     {
  //       text: '<img src="/assets/images/rasci/plus.svg" alt="Filter Icon" style="margin-top: -1px;margin-right: 2px;"> Duplicate Subordinate',
  //       className: "btn btn-primary tet-white asik dt-custom-btn",
  //       action: function (e, dt, node, config) {
  //         skidipi("Custom Button Clicked!");
  //       },
  //     },
  //     {
  //       text: '<img src="/assets/images/rasci/plus.svg" alt="Filter Icon" style="margin-top: -1px;margin-right: 2px;"> Add New Subordinate',
  //       className: "btn btn-primary tet-white asik dt-custom-btn",
  //       action: function (e, dt, node, config) {
  //         alert("Custom Button Clicked!");
  //       },
  //     },
  //   ],
  //   data: dataSet,
  //   sort: false,
  //   columns: [
  //     {
  //       title: "No",
  //       data: "id",
  //       width: "5%",
  //       render: function (data, type, row, meta) {
  //         return meta.row + 1;
  //       },
  //     },
  //     {
  //       title: "File Name",
  //       width: "20%",
  //       data: "name",
  //     },
  //     {
  //       title: "Upload",
  //       width: "20%",
  //       data: null,
  //       render: function (data, type, row) {
  //         // choose file with icon
  //         return (
  //           `
  //           <div style="">
  //             <a id="falseinput_` +
  //           data?.subName +
  //           `" class="btn btn-outline-primary mb-2 false_input"> <i class="icofont icofont-upload-alt"></i> Choose File</a>
  //             <input name="file" style="display:none" class="fileinput"  id="fileinput_` +
  //           data?.subName +
  //           `" type="file"  value=""/>
  //             <input type="hidden" name="name" value="` +
  //           data?.subName +
  //           `"/>
  //           <br/>
  //             <div class="" style="display:none;align-self:center" id="div_` +
  //           data?.subName +
  //           `">
  //                   <span class="labelfile" id="labelfile_` +
  //           data?.subName +
  //           `"></span>
  //                     <i class="fa fa-times-circle cancelfile" style="color:red" id="cancelfile_` +
  //           data?.subName +
  //           `"
  //               ></i>
  //             </div>
  //           </div>
  //           `
  //         );
  //       },
  //     },
  //     {
  //       title: "Upload Date",
  //       width: "15%",
  //       data: null,
  //       render: function (data, type, row) {
  //         // choose file with icon
  //         if (data?.uploadDate === null) return "";
  //         const date = new Date(data?.uploadDate);
  //         return date.getDate() + " " + monthNames[date.getMonth()] + " " + date.getFullYear();
  //       },
  //     },
  //     {
  //       title: "Upload By",
  //       width: "10%",
  //       data: null,
  //       render: function (data, type, row) {
  //         // choose file with icon
  //         return data?.uploadBy;
  //       },
  //     },
  //     {
  //       title: "Download",
  //       width: "15%",
  //       data: null,
  //       render: function (data, type, row) {
  //         // choose file with icon
  //         // <i class="icofont icofont-download"></i>
  //         let link = data?.fileDownload
  //           ? `<a href="` +
  //             data?.fileDownload +
  //             `" class=" mb-2">
  //              ` +
  //             data?.fileName +
  //             `</a>`
  //           : "";
  //         return link;
  //       },
  //     },
  //     {
  //       title: "History",
  //       data: null,
  //       width: "15%",
  //       render: function (data) {
  //         return `
  //         <span class="txt-primary detail" id=""> Detail </span>
  //         `;
  //       },
  //     },
  //   ],
  // });
  // $("#subPositionList").DataTable({
  //   dom: '<"d-flex justify-content-between"fB>rt<"bottom"ip><"clear">',
  //   buttons: [
  //     {
  //       text: '<img src="/assets/images/rasci/plus.svg" alt="Filter Icon" style="margin-top: -1px;margin-right: 2px;"> Duplicate Subordinate',
  //       className: "btn btn-primary tet-white asik dt-custom-btn",
  //       action: function (e, dt, node, config) {
  //         skidipi("Custom Button Clicked!");
  //       },
  //     },
  //     {
  //       text: '<img src="/assets/images/rasci/plus.svg" alt="Filter Icon" style="margin-top: -1px;margin-right: 2px;"> Add New Subordinate',
  //       className: "btn btn-primary tet-white asik dt-custom-btn",
  //       action: function (e, dt, node, config) {
  //         alert("Custom Button Clicked!");
  //       },
  //     },
  //   ],
  //   data: dataSet,
  //   sort: false,
  //   columns: [
  //     {
  //       title: "No",
  //       data: "id",
  //       width: "5%",
  //       render: function (data, type, row, meta) {
  //         return meta.row + 1;
  //       },
  //     },
  //     {
  //       title: "File Name",
  //       width: "20%",
  //       data: "name",
  //     },
  //     {
  //       title: "Upload",
  //       width: "20%",
  //       data: null,
  //       render: function (data, type, row) {
  //         // choose file with icon
  //         return (
  //           `
  //           <div style="">
  //             <a id="falseinput_` +
  //           data?.subName +
  //           `" class="btn btn-outline-primary mb-2 false_input"> <i class="icofont icofont-upload-alt"></i> Choose File</a>
  //             <input name="file" style="display:none" class="fileinput"  id="fileinput_` +
  //           data?.subName +
  //           `" type="file"  value=""/>
  //             <input type="hidden" name="name" value="` +
  //           data?.subName +
  //           `"/>
  //           <br/>
  //             <div class="" style="display:none;align-self:center" id="div_` +
  //           data?.subName +
  //           `">
  //                   <span class="labelfile" id="labelfile_` +
  //           data?.subName +
  //           `"></span>
  //                     <i class="fa fa-times-circle cancelfile" style="color:red" id="cancelfile_` +
  //           data?.subName +
  //           `"
  //               ></i>
  //             </div>
  //           </div>
  //           `
  //         );
  //       },
  //     },
  //     {
  //       title: "Upload Date",
  //       width: "15%",
  //       data: null,
  //       render: function (data, type, row) {
  //         // choose file with icon
  //         if (data?.uploadDate === null) return "";
  //         const date = new Date(data?.uploadDate);
  //         return date.getDate() + " " + monthNames[date.getMonth()] + " " + date.getFullYear();
  //       },
  //     },
  //     {
  //       title: "Upload By",
  //       width: "10%",
  //       data: null,
  //       render: function (data, type, row) {
  //         // choose file with icon
  //         return data?.uploadBy;
  //       },
  //     },
  //     {
  //       title: "Download",
  //       width: "15%",
  //       data: null,
  //       render: function (data, type, row) {
  //         // choose file with icon
  //         // <i class="icofont icofont-download"></i>
  //         let link = data?.fileDownload
  //           ? `<a href="` +
  //             data?.fileDownload +
  //             `" class=" mb-2">
  //              ` +
  //             data?.fileName +
  //             `</a>`
  //           : "";
  //         return link;
  //       },
  //     },
  //     {
  //       title: "History",
  //       data: null,
  //       width: "15%",
  //       render: function (data) {
  //         return `
  //         <span class="txt-primary detail" id=""> Detail </span>
  //         `;
  //       },
  //     },
  //   ],
  // });
}

function getTablePositionList(dataSet, status) {
  if ($.fn.DataTable.isDataTable("#subPositionList")) {
    $("#subPositionList").DataTable().destroy();
  }
  $("#subPositionList").DataTable({
    dom: '<"d-flex justify-content-between"fB>rt<"bottom"ip><"clear">',
    buttons: [
      {
        text: '<img src="/assets/images/rasci/plus.svg" alt="Filter Icon" style="margin-top: -1px;margin-right: 2px;"> Duplicate Sub Position',
        className: "btn btn-primary tet-white asik dt-custom-btn",
        action: function (e, dt, node, config) {
          skidipi("Custom Button Clicked!");
        },
      },
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
        title: "Sub Position Name",
        width: "20%",
        data: "positionName",
      },
      {
        title: "Career Level",
        width: "20%",
        data: "careerLevel",
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
        title: "Action",
        data: null,
        width: "25%",
        render: function (data) {
          // button action edit and delete
          return `
          <button class="btn btn-dark btn-sm" onclick="editSubPosition('${data.id}')">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteSubPosition('${data.id}')">Delete</button>
          `;
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
        data: "id",
        width: "10%",
        render: function (data, type, row, meta) {
          return meta.row + 1;
        },
      },
      {
        title: "Sub Position Name",
        width: "30%",
        data: "positionName",
      },
      {
        title: "Career Level",
        width: "20%",
        data: "careerLevel",
      },
      {
        title: "PRL Org",
        width: "15%",
        data: "prlOrg",
      },
      {
        title: "Formation",
        width: "15%",
        data: "formation",
      },
      {
        title: "Action",
        data: null,
        width: "30%",
        render: function (data) {
          return `
          <button class="" style="background:transparent;color:black;padding:4px 12px;font-size:12px;border:1px solid black;"  onclick="detailSubPosition('${data.id}')"> <i class="icon-eye p-r-5"></i>Detail</button>
          `;
        },
      },
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
  const data = await listDraftOrganizationStructure(params);
  if ($.fn.DataTable.isDataTable("#draftList")) {
    $("#draftList").DataTable().destroy();
  }
  $("#draftList").DataTable({
    dom: '<"d-flex justify-content-between"fB>rt<"bottom"ip><"clear">',
    buttons: [
      {
        text: '<img src="/assets/images/rasci/plus.svg" alt="Filter Icon" style="margin-top: -1px;margin-right: 2px;"> Duplicate Job',
        className: "btn btn-primary tet-white asik dt-custom-btn",
        action: function (e, dt, node, config) {
          localStorage.removeItem("uniqueCode");
          window.location.href = "/organization/detail?duplicate=true";
        },
      },
      {
        text: '<img src="/assets/images/rasci/plus.svg" alt="Filter Icon" style="margin-top: -1px;margin-right: 2px;"> Add New Job',
        className: "btn btn-primary tet-white asik dt-custom-btn",
        action: function (e, dt, node, config) {
          localStorage.removeItem("uniqueCode");
          window.location.href = "/organization/detail";
        },
      },
    ],
    autoWidth: false,
    data: data.data,
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
        title: "Request ID",
        width: "18%",
        data: "reqId",
      },
      {
        title: "Draft Name",
        width: "15%",
        data: "draftName",
      },
      {
        title: "Created By",
        width: "15%",
        data: "name",
      },
      {
        title: "Created Date",
        width: "15%",
        data: "createdAt",
      },
      {
        title: "Type",
        width: "15%",
        data: "typeDetail",
      },
      {
        title: "Action",
        width: "15%",
        data: null,
        render: function (data) {
          return `
          <button class="" style="background:transparent;color:black;padding:4px 12px;font-size:12px;border:1px solid black;"  onclick="detailDraft('${data.id}')"> <i class="icon-eye p-r-5"></i>Detail</button>
          <button class="" style="background:transparent;color:red;padding:4px 12px;font-size:12px;border:1px solid red;"  onclick="deleteDraft('${data.id}')"><i class="icon-trash p-r-5"></i> Delete</button>
          `;
        },
      },
    ],
  });
  if ($.fn.DataTable.isDataTable("#requestList")) {
    $("#requestList").DataTable().destroy();
  }
  $("#requestList").DataTable({
    dom: '<"d-flex justify-content-between"fB>rt<"bottom"ip><"clear">',
    buttons: [],
    data: data.data,
    sort: false,
    responsive: true,
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
        title: "Request ID",
        data: "reqId",
      },
      {
        title: "Type",
        data: "typeDetail",
      },
      {
        title: "Requester",
        data: "name",
      },
      {
        title: "Approver",
        data: "name",
      },
      {
        title: "Status",
        data: "name",
      },
      {
        title: "Action",
        data: null,
        render: function (data) {
          return `
          <button class="btn btn-dark" style="padding:4px 12px;font-size:12px;"  onclick="editDraft('${data.id}')">Edit</button>
          <button class="btn btn-danger" style="padding:4px 12px;font-size:12px;"  onclick="deleteDraft('${data.id}')">Delete</button>
          `;
        },
      },
    ],
  });
}

async function getTableListLog(params) {
  const data = await listDraftOrganizationStructure(params);
  if ($.fn.DataTable.isDataTable("#logList")) {
    $("#logList").DataTable().destroy();
  }
  $("#logList").DataTable({
    dom: '<"d-flex justify-content-between"fB>rt<"bottom"ip><"clear">',
    buttons: [],
    data: data.data,
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
        data: "reqId",
      },
      {
        title: "User",
        width: "25%",
        data: "draftName",
      },
      {
        title: "Activity",
        width: "25%",
        data: "name",
      },
      {
        title: "Detail",
        width: "25%",
        data: "createdAt",
      },
    ],
  });
}

// editSubPosition button on table subPositionList
