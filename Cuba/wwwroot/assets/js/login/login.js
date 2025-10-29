$(document).ready(function () {
  const $loginButton = $("#loginButton");
  const $username = $("#username");
  const $password = $("#password");
  const $errorMessage = $("#errorMessage");

  // Fungsi untuk menampilkan atau menyembunyikan tombol login
  function toggleLoginButton() {
    const isFormFilled = $username.val() && $password.val();
    $loginButton.prop("disabled", !isFormFilled);

    // Sembunyikan alert jika form kembali diisi setelah error
    if (isFormFilled) {
      hideAlert();
    }
  }

  function showAlert(message) {
    $errorMessage
      .html(
        `<img class="img-fluid me-2" src="/assets/images/logo/warning-alert.svg" alt="alert" />
              <span>${message}</span>`,
      )
      .removeClass("hidden-alert");
  }

  function hideAlert() {
    $errorMessage.addClass("hidden-alert");
  }

  $username.add($password).on("input", toggleLoginButton);

  // Event handler untuk tombol login
  $loginButton.click(async function (e) {
    e.preventDefault();
    const spinner = document.getElementById("loginSpinner");
    spinner.style.display = "inline-block";

    try {
      const result = await loginApi({
        username: $username.val(),
        password: $password.val(),
      });

      if (result.status === 200) {
        const { menuPermission, modules, token, name, employeeId } = result.data;
        setTimeout(() => {
          spinner.style.display = "none";
          localStorage.setItem("userName", name);
          localStorage.setItem("userId", employeeId);
          localStorage.setItem("module", JSON.stringify(modules));
          localStorage.setItem("listMenu", JSON.stringify(menuPermission));
          localStorage.setItem("token", token);

          // Redirect after login
          window.location.href = `${baseUrl}HomePage/Index`;
        }, 500);
      } else {
        showAlert(result.message);
        spinner.style.display = "none";
      }
    } catch (error) {
      showAlert("An error occurred during login. Please try again.");
    }
  });

  // Inisialisasi state awal tombol login
  toggleLoginButton();
});
