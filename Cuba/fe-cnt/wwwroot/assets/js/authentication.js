document.addEventListener("DOMContentLoaded", function () {
  checkMenuVisibility();
  checkTokenValidity();
  checkTokenExpiration();
});

function checkMenuVisibility() {
  const listMenu = JSON.parse(localStorage.getItem("listMenu"));
  if (Array.isArray(listMenu)) {
    listMenu.forEach((menu) => {
      const menuElement = document.getElementById(menu.menuName);
      if (menuElement) {
        menuElement.classList.remove("hide-menu");
      }
    });
  } else {
    console.warn("No valid listMenu found in localStorage.");
  }
}

function decodeToken() {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found in localStorage");
    return null;
  }

  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}

function checkTokenExpiration() {
  const decodedToken = decodeToken();
  if (decodedToken) {
    const currentTime = Math.floor(Date.now() / 1000);
    if (decodedToken.exp && decodedToken.exp < currentTime) {
      console.warn("Token has expired. Clearing localStorage and redirecting to login.");
      handleLogout();
    }
  }
}

function checkTokenValidity() {
  const decodedToken = decodeToken();
  if (!decodedToken) {
    console.warn("Invalid token. Clearing localStorage and redirecting to login.");
    handleLogout();
  }
}

// async function ajaxRequest(url, method, data = null) {
//   try {
//     const isFormData = data instanceof FormData;

//     const response = await $.ajax({
//       url,
//       type: method,
//       data: isFormData ? data : data ? JSON.stringify(data) : null,
//       processData: !isFormData,
//       contentType: isFormData ? false : "application/json",
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("token")}`,
//       },
//     });

//     return response;
//   } catch (error) {
//     if (error.status === 401) {
//       console.warn("Token has expired. Redirecting to login.");
//       handleLogout();
//     } else {
//       console.error("Error fetching data from API", error);
//       $("#resultJabatan").html("Error fetching data from API");
//       throw error;
//     }
//   }
// }
async function ajaxRequest(url, method, data = null, responseType = "json") {
  try {
    const isFormData = data instanceof FormData;

    const response = await $.ajax({
      url,
      type: method,
      data: isFormData ? data : data ? JSON.stringify(data) : null,
      processData: !isFormData,
      contentType: isFormData ? false : "application/json",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      xhrFields: {
        responseType: responseType === "blob" ? "blob" : undefined,
      },
    });

    return response;
  } catch (error) {
    if (error.status === 401) {
      console.warn("Token expired, redirecting...");
      handleLogout();
    } else {
      console.error("API error", error);
    }
    throw error;
  }
}

function handleLogout() {
  localStorage.clear();
  window.location.href = "/";
}
