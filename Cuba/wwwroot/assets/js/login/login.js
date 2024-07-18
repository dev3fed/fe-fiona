$(document).ready(function () {
  $("#loginButton").click(function (e) {
    e.preventDefault();
    var username = $("#username").val();
    var password = $("#password").val();
    state.username = username;
    state.password = password;
    window.location.href = "/HomePage/Index";
    onSubmit(username, password);
    console.log("username", username, password, state);
  });
});
