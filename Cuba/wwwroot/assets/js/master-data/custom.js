$(document).ready(function () {
  //  on click inside table example where class is false_input
  $("#examplee").on("click", ".false_input", function () {
    var id = $(this).attr("id");
    $("#" + id.replace("falseinput_", "fileinput_")).trigger("click");
  });

  $("#examplee").on("change", ".fileinput", function () {
    var id = $(this).attr("id");
    $("#" + id.replace("fileinput_", "div_")).show();
    // labelfile_ is the id of the label that will show the file name, onlu the file name
    $("#" + id.replace("fileinput_", "labelfile_")).text(
      $(this).val().split("\\").pop()
    );
  });
  //  cancelfile_ is the id of the cancel icon
  $("#examplee").on("click", ".cancelfile", function () {
    var id = $(this).attr("id");
    $("#" + id.replace("cancelfile_", "div_")).hide();
    $("#" + id.replace("cancelfile_", "labelfile_")).text("");
    $("#" + id.replace("cancelfile_", "fileinput_")).val("");
  });
});
