async function getTableListDraft(params) {
  if ($.fn.DataTable.isDataTable("#draftList")) {
    $("#draftList").DataTable().destroy();
  }
  $("#draftList").DataTable({
    dom: '<"d-flex justify-content-between"fB>rt<"bottom"ip><"clear">',
    buttons: [
      {
        text: '<img src="/assets/images/rasci/plus.svg" alt="Filter Icon" style="margin-top: -1px;margin-right: 2px;"> Create Draft Organization Structure',
        className: "btn btn-primary tet-white asik dt-custom-btn",
        action: function (e, dt, node, config) {
          $("#modalCreateDraftSO").modal("show");
        },
      },
    ],
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
        title: "Draft Name",
        data: "draftName",
        width: "50%",
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
          return checkButtonTable("draftList", data.draftId, "draftList");
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
