$(document).ready(function () {
  $("#loginButton").click(function (e) {
    e.preventDefault();
    var username = $("#username").val();
    var password = $("#password").val();
    state.username = username;
    state.password = password;
    // onSubmit(username, password);
    window.location.href = "/HomePage/Index";
    console.log("username", username, password, state);
  });
});
