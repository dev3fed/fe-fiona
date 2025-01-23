const appState = new Proxy(
  {
    draftList: [
      {
        id: 1,
        draftName: "add prosbis test-01",
        createdDate: "2024-11-23T11:58:42.273Z",
        createdBy: "Superadmin",
        type: "draft",
        jobTitle: {
          id: 120,
          job_name: "Manager Corporate Communication",
          job_level: 3,
        },
        GeneralCompeName: {
          id: 498,
          competency_name: "Brand Equity Management",
          category: "specific",
        },
        DepthLevelBefore: 2,
        DepthLevelAfter: "3",
        reqId: "Req/11/23/2024/002",
        typeDetail: "Edit General Competency Depth Level",
      },
    ],
    dataEditDraft: {},
    dataDetailDraft: {},
    deleteDraftCompetency: 0,
    jobList: [],
    competencyList: [],
    competencyMapping: [],
  },
  {
    set(target, property, value) {
      if (target[property] !== value) {
        // Set the new value
        target[property] = value;
        if (property === "dataDetailDraft") {
          detailDraft();
        }
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

async function fetchDataCompetency(params) {
  const url = `${API_URL_COMPE}/api/TechnicalCompetency`;
  try {
    const result = await ajaxRequest(url, "GET", params);
    return result;
  } catch (error) {
    console.error("Error fetching data from API");
    $("#resultJabatan").html("Error fetching data from API");
    throw error;
  }
}

async function fetchCompetencyDetail(payload) {
  const url = `${API_URL_COMPE}/api/TechnicalCompetency/kkj-detail/${payload}`;
  try {
    const result = await ajaxRequest(url, "GET");
    return result;
  } catch (error) {
    console.error("Error fetching data from API");
    throw error;
  }
}
// /TechnicalCompetency/kkj-detail
async function fetchData() {
  try {
    const [dataCompetency] = await Promise.all([fetchDataCompetency()]);
    appState.competencyMapping = dataCompetency.data.competencyMapping;
    appState.jobList = dataCompetency.data.jobList;
    appState.competencyList = dataCompetency.data.competencyList;
    document.dispatchEvent(new Event("dataLoaded"));
  } catch (error) {
    console.error("Error fetching data", error);
  }
}

// Initial data fetch
fetchData();
