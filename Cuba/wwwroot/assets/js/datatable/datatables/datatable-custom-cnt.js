$(document).ready(function () {
  var dataSet = [
    {
      id: 1,
      name: "Master Data Job",
      fileUpload: "System Architect",
      fileName: "",
      controller: "masterDataJob",
    },
    {
      id: 2,
      name: "Master Business Process",
      fileUpload: "System Architect",
      fileName: "file2.xls",
      controller: "masterBusinessProcess",
    },
    {
      id: 3,
      name: "Rasci Mapping",
      fileUpload: "System Architect",
      fileName: "file3.xls",
      controller: "rasciMapping",
    },
  ];

  $("#examplee").DataTable({
    data: dataSet,
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
        title: "File Name",
        width: "30%",
        data: "name",
      },
      {
        title: "Upload",
        // data: "fileUpload",
        width: "40%",
        data: null,
        render: function (data, type, row) {
          // choose file with icon
          return (
            `
            <div style="
                display: flex;
                gap: 5px;
            ">
              <a id="falseinput_` +
            data?.controller +
            `" class="btn btn-outline-primary false_input"> <i class="icofont icofont-upload-alt"></i> Choose File</a> 
              <input name="file" style="display:none"  class="fileinput"  id="fileinput_` +
            data?.controller +
            `" type="file"  value=""/>
              <input type="hidden" name="name" value="` +
            data?.controller +
            `"/>
              <div style="display:none;align-self:center" id="div_` +
            data?.controller +
            `">
                    <span class="" id="labelfile_` +
            data?.controller +
            `"></span>
                      <i class="fa fa-times-circle cancelfile" style="color:red" id="cancelfile_` +
            data?.controller +
            `"
                ></i>
              </div>
            </div>
            `
          );
        },
      },
      {
        title: "Download",
        data: null,
        width: "20%",
        render: function (data) {
          let fileName = "N/A";
          if (data?.fileName) {
            fileName = `<a href="#">` + data?.fileName + `</a>`;
          }
          // link with filename
          return fileName + ` <i data-feather="x-circle"></i>`;
          //   return fileName;
        },
      },
    ],
  });
  $("#examplee thead th").css("background-color", "#006ca9");
  $("#examplee thead th").css("color", "white");
});
