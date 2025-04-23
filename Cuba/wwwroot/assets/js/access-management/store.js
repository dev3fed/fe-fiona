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
  }
);
function setState(key, value) {
  appState[key] = value;
}

function getState(key) {
  return appState[key];
}
window.setState = setState;
window.getState = getState;

// START NEW API SERVICE COMPETENCY
async function fetchUserList() {
  const url = `${url_api}/api/Users?Page=1&Limit=10`;
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

async function fetchRoleList() {
  const url = `${url_api}/api/Roles`;
  try {
    const result = await ajaxRequest(url, "GET");
    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.log("error", error);
    return {
      success: false,
      error: error?.responseJSON.message || "Error fetching data from API",
    };
  }
}

("http://localhost:5095/api/");
// async function fetchCompetencyList(payload) {
//   const url = `${url_api}/api/TechnicalCompetency/list-competency/position-code`;
//   try {
//     const result = await ajaxRequest(url, "POST", payload);
//     return {
//       success: true,
//       data: result.data.data,
//     };
//   } catch (error) {
//     console.log("error", error);
//     return {
//       success: false,
//       error: error?.responseJSON.message || "Error fetching data from API",
//     };
//   }
// }

// END NEW API SERVICE COMPETENCY
