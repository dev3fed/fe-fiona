// export function test() {
//   console.log("test");
// }

// $(document).ready(function () {
//   // var dataSet = [
//   //   {
//   //     id: 1,
//   //     name: "Master Data Job",
//   //     fileUpload: "System Architect",
//   //     fileName: "",
//   //     controller: "masterDataJob",
//   //   },
//   //   {
//   //     id: 2,
//   //     name: "Master Business Process",
//   //     fileUpload: "System Architect",
//   //     fileName: "file2.xls",
//   //     controller: "masterBusinessProcess",
//   //   },
//   //   {
//   //     id: 3,
//   //     name: "Rasci Mapping",
//   //     fileUpload: "System Architect",
//   //     fileName: "file3.xls",
//   //     controller: "rasciMapping",
//   //   },
//   // ];
//   // test();
//   // const url = "http://localhost:5095/";
//   //   const token = localStorage.getItem("token");
//   //   console.log(token);
//   //   $.ajax({
//   //     url: url + "api/MasterData",
//   //     type: "GET",
//   //     headers: {
//   //       Authorization: "Bearer " + localStorage.getItem("token"),
//   //     },
//   //     success: function (data) {
//   //       var dataSet = data;
//   //       getTable(dataSet?.data);
//   //     },
//   //   });
//   // $("#masterDataList").DataTable({
//   //   data: dataSet,
//   //   sort: false,
//   //   columns: [
//   //     {
//   //       title: "No",
//   //       data: "id",
//   //       width: "5%",
//   //       render: function (data, type, row, meta) {
//   //         return meta.row + 1;
//   //       },
//   //     },
//   //     {
//   //       title: "File Name",
//   //       width: "20%",
//   //       data: "name",
//   //     },
//   //     {
//   //       title: "Upload",
//   //       width: "20%",
//   //       data: null,
//   //       render: function (data, type, row) {
//   //         // choose file with icon
//   //         return (
//   //           `
//   //           <div style="
//   //           ">
//   //             <a id="falseinput_` +
//   //           data?.controller +
//   //           `" class="btn btn-outline-primary mb-2 false_input"> <i class="icofont icofont-upload-alt"></i> Choose File</a>
//   //             <input name="file" style="display:none"  class="fileinput"  id="fileinput_` +
//   //           data?.controller +
//   //           `" type="file"  value=""/>
//   //             <input type="hidden" name="name" value="` +
//   //           data?.controller +
//   //           `"/>
//   //           <br/>
//   //             <div class="" style="display:none;align-self:center" id="div_` +
//   //           data?.controller +
//   //           `">
//   //                   <span class="labelfile" id="labelfile_` +
//   //           data?.controller +
//   //           `"></span>
//   //                     <i class="fa fa-times-circle cancelfile" style="color:red" id="cancelfile_` +
//   //           data?.controller +
//   //           `"
//   //               ></i>
//   //             </div>
//   //           </div>
//   //           `
//   //         );
//   //       },
//   //     },
//   //     {
//   //       title: "Upload Date",
//   //       width: "15%",
//   //       data: null,
//   //       render: function (data, type, row) {
//   //         // choose file with icon
//   //         return `
//   //           `;
//   //       },
//   //     },
//   //     {
//   //       title: "Upload By",
//   //       width: "10%",
//   //       data: null,
//   //       render: function (data, type, row) {
//   //         // choose file with icon
//   //         return `
//   //           `;
//   //       },
//   //     },
//   //     {
//   //       title: "Download",
//   //       width: "15%",
//   //       data: null,
//   //       render: function (data, type, row) {
//   //         // choose file with icon
//   //         return `
//   //           `;
//   //       },
//   //     },
//   //     {
//   //       title: "History",
//   //       data: null,
//   //       width: "15%",
//   //       render: function (data) {
//   //         return `
//   //           `;
//   //       },
//   //     },
//   //   ],
//   // });
// });
