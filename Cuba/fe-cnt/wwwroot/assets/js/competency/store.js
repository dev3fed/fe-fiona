const selectedValue = $("#dataSource-competency").val();

const appState = new Proxy(
  {
    draftList: [
      // {
      //   id: 1,
      //   draftName: "add prosbis test-01",
      //   createdDate: "2024-11-23T11:58:42.273Z",
      //   createdBy: "Superadmin",
      //   type: "draft",
      //   jobTitle: {
      //     id: 120,
      //     job_name: "Manager Corporate Communication",
      //     job_level: 3,
      //   },
      //   GeneralCompeName: {
      //     id: 498,
      //     competency_name: "Brand Equity Management",
      //     category: "specific",
      //   },
      //   DepthLevelBefore: 2,
      //   DepthLevelAfter: "3",
      //   reqId: "Req/11/23/2024/002",
      //   typeDetail: "Edit General Competency Depth Level",
      // },
    ],
    dataEditDraft: {},
    dataDetailDraft: {},
    deleteDraftCompetency: 0,
    jobList: [],
    selectedType: "position",
    competencyList: [],
    competencyMapping: [],
    currentPageY: 1,
    currentPageX: 1,
    payloadJob: {
      dataSource: selectedValue,
      page: 1,
      pageSize: 15,
    },
    payloadCompetency: {
      dataSource: selectedValue,
      page: 1,
      pageSize: 10,
    },
    detailProficiency: {},
    storageDataCompetency: [],
    storageDataMapping: [],
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

// START NEW API SERVICE COMPETENCY
async function fetchJobList(params) {
  const url = `${url_api}/api/TechnicalCompetency/list-job${params}`;
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

async function fetchCompetencyList(payload) {
  const url = `${url_api}/api/TechnicalCompetency/list-competency/position-code`;
  try {
    const result = await ajaxRequest(url, "POST", payload);
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

async function fetchCompetencyMapping(payload) {
  const url = `${url_api}/api/TechnicalCompetency/list-competency/competency-mapping`;
  try {
    const result = await ajaxRequest(url, "POST", payload);
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

async function fetchDraftList() {
  const url = `${url_api}/api/TechnicalCompetency/draft-competency?page=1&pageSize=10`;
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

async function fetchDeleteDraft(id) {
  const url = `${url_api}/api/TechnicalCompetency/draft-competency/${id}`;
  try {
    const result = await ajaxRequest(url, "DELETE");
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

async function fetchCreateDraft(payload) {
  const url = `${url_api}/api/TechnicalCompetency/draft-competency${payload}`;
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
        data: result.data,
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

async function fetchDetailDraft(id) {
  const url = `${url_api}/api/TechnicalCompetency/draft-competency/${id}`;
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

async function fetchRenameDraft(payload) {
  const url = `${url_api}/api/TechnicalCompetency/rename-draft-competency${payload}`;
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

async function fetchMandatoryList(payload) {
  const url = `${url_api}/api/TechnicalCompetency/mandatory-competency-dictionary${payload}`;
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

async function fetchTechnicalList(payload) {
  const url = `${url_api}/api/TechnicalCompetency/technical-competency-dictionary${payload}`;
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

async function fetchBehaviorList(payload) {
  const url = `${url_api}/api/TechnicalCompetency/behavioural-competency-dictionary${payload}`;
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

async function fetchProficiencyLevel(payload) {
  const url = `${url_api}/api/TechnicalCompetency/get-proficiency-level${payload}`;
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

async function fetchSaveProficiencyLevel(payload) {
  const url = `${url_api}/api/TechnicalCompetency/edit-proficiency-level`;
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

// END NEW API SERVICE COMPETENCY

//OLD API SERVICE COMPETENCY
async function fetchDataCompetency(params) {
  const url = `${url_api}/api/TechnicalCompetency`;
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
  const url = `${url_api}/api/TechnicalCompetency/detail-dictionary/${payload}`;
  try {
    const result = await ajaxRequest(url, "GET");
    return result;
  } catch (error) {
    console.error("Error fetching data from API");
    throw error;
  }
}
// END OLD API SERVICE COMPETENCY
async function fetchData() {
  try {
    const [draftList] = await Promise.all([fetchDraftList()]);
    console.log("draftList", draftList);
    // appState.competencyMapping = dataCompetency.data.competencyMapping;
    // appState.jobList = dataCompetency.data.jobList;
    // appState.competencyList = dataCompetency.data.competencyList;
    appState.draftList = draftList.data;
    document.dispatchEvent(new Event("dataLoaded"));
  } catch (error) {
    console.error("Error fetching data", error);
  }
}

// Initial data fetch
fetchData();
