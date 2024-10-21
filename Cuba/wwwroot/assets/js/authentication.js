function decodeToken() {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("No token found in localStorage");
    return null;
  }

  const tokenParts = token.split(".");

  if (tokenParts.length !== 3) {
    console.error("Invalid token format");
    return null;
  }

  try {
    const encodedPayload = tokenParts[1];
    const decodedPayload = JSON.parse(atob(encodedPayload));

    return decodedPayload;
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

window.onload = checkTokenExpiration;

async function ajaxRequest(url, method, data = null) {
  try {
    const response = await $.ajax({
      url: url,
      type: method,
      contentType: "application/json",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      data: data ? JSON.stringify(data) : null,
    });
    return response;
  } catch (error) {
    if (error.status === 401) {
      console.warn("Token has expired. Redirecting to login.");
      handleLogout();
    } else {
      console.error("Error fetching data from API", error);
      $("#resultJabatan").html("Error fetching data from API");
      throw error;
    }
  }
}

function handleLogout() {
  localStorage.clear();
  window.location.href = "/";
}
