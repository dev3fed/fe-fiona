const appState = new Proxy(
  {},
  {
    set(target, property, value) {
      if (target[property] !== value) {
        // Set the new value
        target[property] = value;
      }
      return true;
    },
  },
);
function setState(key, value) {
  appState[key] = value;
}

function getState(key) {
  return appState[key];
}
window.setState = setState;
window.getState = getState;

// START NEW API SERVICE SK LIST
async function fetchSklist() {
  const url = `${url_api}/api/sk-list?Page=1&PageSize=10`;
  try {
    const result = await ajaxRequest(url, "GET");
    return {
      success: true,
      data: result.data.data,
    };
  } catch (error) {
    console.log("error", error);
    return {
      success: false,
      error: error?.responseJSON.message || "Error fetching data from API",
    };
  }
}
async function fetchDetailSk(id) {
  const url = `${url_api}/preview-file/${id}`;
  try {
    const result = await ajaxRequest(url, "GET", null, "blob"); // 👈 ini penting
    return {
      success: true,
      data: result, // akan jadi Blob
    };
  } catch (error) {
    console.log("error", error);
    return {
      success: false,
      error: error?.responseJSON?.message || "Error fetching data from API",
    };
  }
}

async function fetchUploadSklist(payload) {
  const url = `${url_api}/upload`;
  try {
    const result = await ajaxRequest(url, "POST", payload);
    if (result.status === 400) {
      return {
        success: false,
        error: result.message,
      };
    } else {
      return {
        success: true,
        data: result,
      };
    }
  } catch (error) {
    console.log("error", error);
    return {
      success: false,
      error: error?.responseJSON.message || "Error fetching data from API",
    };
  }
}

// END NEW API SERVICE SK LIST
