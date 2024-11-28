function getTableListJobDes(dataList) {
  console.log("dataList", dataList);
  // const data = await listDraftOrganizationStructure(params);
  if ($.fn.DataTable.isDataTable("#jobdescList")) {
    $("#jobdescList").DataTable().destroy();
  }
  $("#jobdescList").DataTable({
    dom: '<"d-flex justify-content-between"fB>rt<"bottom"ip><"clear">',
    buttons: [],
    autoWidth: false,
    data: dataList,
    sort: false,
    searching: false,
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
        title: "Job Title",
        width: "55%",
        data: "jobName",
      },
      {
        title: "Jobdesc Status",
        width: "20%",
        // class : "text-center",
        tdClass: "text-center",
        data: null,
        render: function (data) {
          if (data.jobStatus == "available") {
            return `<span class="badge text-center p-2" style="background-color:#B5FFC7;color:#009024">Available</span>`;
          } else if (data.jobStatus == "not available") {
            return `<span class="badge text-center p-2" style="background-color:#FAE9EB;color:#D02138">Not Available</span>`;
          } else if (data.jobStatus == "on progress") {
            return `<span class="badge text-center p-2" style="background-color:#FFE7C5;color:#E18400">On Progress</span>`;
          } else {
            return `<span class="badge text-center p-2" style="background-color:#E6F0F6;color:#006CA9">Waiting Approval</span>`;
          }
        },
      },
      {
        title: "Action",
        width: "15%",
        data: null,
        render: function (data) {
          // random 1 or 2
          if (data.jobStatus == "not available") {
            return `
            <button class="" style="padding:4px 12px;font-size:12px;width:80%;color:white;background:#006ca9;border:none"  onclick="createJobDesc('${data.id}')"><i class="fas fa-plus p-r-5"></i> Create</button>
            `;
          } else {
            return `
            <button class="" style="padding:4px 12px;font-size:12px;width:80%;color:black;background:transparent;border:1px solid black" onclick="detailJobDesc('${data.id}')"><i class="fas fa-eye p-r-5"></i> Detail</button>
            `;
          }
        },
      },
    ],
  });
}

// editSubPosition button on table subPositionList
