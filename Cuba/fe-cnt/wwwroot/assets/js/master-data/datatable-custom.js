function getTable(dataSet) {
  $("#masterDataList").DataTable({
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
        title: "File Name",
        width: "20%",
        data: "name",
      },
      {
        title: "Upload",
        width: "20%",
        data: null,
        render: function (data, type, row) {
          // choose file with icon
          return (
            `
            
            <div style="">
              <a id="falseinput_` +
            data?.subName +
            `" class="btn btn-outline-primary mb-2 false_input"> <i class="icofont icofont-upload-alt"></i> Choose File</a>
              <input name="file" style="display:none" class="fileinput"  id="fileinput_` +
            data?.subName +
            `" type="file"  value=""/>
              <input type="hidden" name="name" value="` +
            data?.subName +
            `"/>
            <br/>
              <div class="" style="display:none;align-self:center" id="div_` +
            data?.subName +
            `">
                    <span class="labelfile" id="labelfile_` +
            data?.subName +
            `"></span>
                      <i class="fa fa-times-circle cancelfile" style="color:red" id="cancelfile_` +
            data?.subName +
            `"
                ></i>
              </div>
            </div>
            `
          );
        },
      },
      {
        title: "Upload Date",
        width: "15%",
        data: null,
        render: function (data, type, row) {
          // choose file with icon
          if (data?.uploadDate === null) return "";
          const date = new Date(data?.uploadDate);
          return date.getDate() + " " + monthNames[date.getMonth()] + " " + date.getFullYear();
        },
      },
      {
        title: "Upload By",
        width: "10%",
        data: null,
        render: function (data, type, row) {
          // choose file with icon

          return data?.uploadBy;
        },
      },
      {
        title: "Download",
        width: "15%",
        data: null,
        render: function (data, type, row) {
          // choose file with icon
          // <i class="icofont icofont-download"></i>
          let link = data?.fileDownload
            ? `<a href="` +
              data?.fileDownload +
              `" class=" mb-2"> 
               ` +
              data?.fileName +
              `</a>`
            : "";

          return link;
        },
      },
      {
        title: "History",
        data: null,
        width: "15%",
        render: function (data) {
          return `
          <span class="txt-primary detail" id=""> Detail </span>
          `;
        },
      },
    ],
  });
}

function getTableUploadLog(dataSet) {
  $("#tableMasterDataLog").DataTable({
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
        title: "Upload Date",
        width: "30%",
        data: null,
        render: function (data, type, row) {
          if (data?.createdDate === null) return "";
          const date = new Date(data?.createdDate);
          return date.getDate() + " " + monthNames[date.getMonth()] + " " + date.getFullYear();
        },
      },
      {
        title: "Upload By",
        width: "30%",
        data: null,
        render: function (data, type, row) {
          return data?.uploadBy ? data?.uploadBy : "System";
        },
      },
      {
        title: "File",
        width: "30%",
        data: null,
        render: function (data, type, row) {
          // <i class="icofont icofont-download"></i>
          let link = data?.fileDownload
            ? `<a href="` +
              data?.fileDownload +
              `" class=" mb-2">
               ` +
              data?.fileName +
              `</a>`
            : "";

          return link;
        },
      },
    ],
  });
  $("#tableMasterDataLog").DataTable().destroy();
}

// ready
$(document).ready(function () {
  $("#masterDataList").on("click", ".false_input", function () {
    var id = $(this).attr("id");
    $("#" + id.replace("falseinput_", "fileinput_")).trigger("click");
  });

  // change file input
  $("#masterDataList").on("change", ".fileinput", function () {
    var id = $(this).attr("id");
    $("#" + id.replace("fileinput_", "div_")).show();
    $("#" + id.replace("fileinput_", "labelfile_")).text($(this).val().split("\\").pop());
  });

  // cancel file input
  $("#masterDataList").on("click", ".cancelfile", function () {
    var id = $(this).attr("id");
    $("#" + id.replace("cancelfile_", "div_")).hide();
    $("#" + id.replace("cancelfile_", "labelfile_")).text("");
    $("#" + id.replace("cancelfile_", "fileinput_")).val("");
  });

  // in table masterDataList where detail
  $("#masterDataList").on("click", ".detail", function () {
    const data = dataSet[$(this).closest("tr").index()];
    // modal show
    $("#modalNew").modal("show");
    // header modal
    $("#modalNew .modal-title").text("History Upload Jabatan");
    getMasterDataUploadLog(data?.subName)
      .then(function (data) {
        getTableUploadLog(data.data);
      })
      .catch(function (error) {
        console.error("Error:", error); // Handle any errors that occur
      });
  });
});
