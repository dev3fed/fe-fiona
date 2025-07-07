// const asik =
let dataSet = [];

$(document).ready(function () {
  getDataMasterData()
    .then(function (data) {
      dataSet = data.data;
      getTable(dataSet);
    })
    .catch(function (error) {
      console.error("Error:", error); // Handle any errors that occur
    });

  // reset Button
  $("#reset-button").click(function () {
    // swal fire
    swal({
      title: "Confirm Reset",
      text: "All your selected data will be deleted",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        $(".fileinput").val("");
        $(".labelfile").text("");
        $(".cancelfile").hide();
        $("div[id^='div_']").hide();
        swal("Reset Success", {
          icon: "success",
        });
      } else {
        swal("Reset Cancelled");
      }
    });
  });

  $("#submit-button").click(function () {
    // swal fire for confirmation
    swal({
      title: "Are you sure?",
      text: "Once submitted, you will not be able to recover this data!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willSubmit) => {
      if (willSubmit) {
        // swal fire for success
        let formData = new FormData();
        $("input[id^='fileinput_']").each(function () {
          if ($(this).val() !== "") {
            const file = this.files[0];
            formData.append("Files", file);
            formData.append("Name", $(this).next().val());
          }
        });

        uploadMasterDataFile(formData)
          .then(function (data) {
            if (data.status === 200) {
              swal("Upload Success", {
                icon: "success",
              });
              // refresh page
              setTimeout(() => {
                location.reload();
              }, 1000);
              // swal("Upload Success, Please wait for the process to complete", {
              //   icon: "success",
              // });

              // location.reload();
            } else {
              console.log("error");
            }
          })
          .catch(function (error) {
            console.error("Error:", error); // Handle any errors that occur
          });
      } else {
        swal("Submission Cancelled");
      }
    });
  });
});
