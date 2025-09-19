// START NEW API SERVICE COMPETENCY
async function fetchJobList(params) {
  const url = `${url_api}/api/TechnicalCompetency/list-job${params}`;
  try {
    const result = await ajaxRequest(url, "GET");
    return {
      success: true,
      data: result.data.data,
      totalResult: result.data.totalRecords,
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
      totalResult: result.data.totalRecords,
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
  const url = `${url_api}/api/TechnicalCompetency/rename-draft-competency`;
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
      data: result,
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
      data: result,
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

async function fetchDetailPositionInfo(payload) {
  const url = `${url_api}/api/TechnicalCompetency/job-info/${payload}`;
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

async function fetchDetailPositionMandatory(payload) {
  const url = `${url_api}/api/TechnicalCompetency/mandatory/${payload}`;
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

async function fetchDetailPositionTechnical(payload) {
  const url = `${url_api}/api/TechnicalCompetency/technical/${payload}`;
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

async function fetchDetailPositionBehavior(payload) {
  const url = `${url_api}/api/TechnicalCompetency/behavioural${payload}`;
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

async function fetchSummalyList(payload) {
  const url = `${url_api}/api/TechnicalCompetency/summary-competency-mapping`;
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

async function fetchCompeBehaviorDetail(payload) {
  const url = `${url_api}/api/TechnicalCompetency/behavioural-detail/${payload}`;
  try {
    const result = await ajaxRequest(url, "GET");
    return result;
  } catch (error) {
    console.error("Error fetching data from API");
    throw error;
  }
}

async function fetchSgandSsg(payload) {
  const url = `${url_api}/api/TechnicalCompetency/sg-ssg-by-comp-code?compCode=${payload}`;
  try {
    const result = await ajaxRequest(url, "GET");
    return result;
  } catch (error) {
    console.error("Error fetching data from API");
    throw error;
  }
}

async function fetchCompetencyReference(payload) {
  const url = `${url_api}/api/TechnicalCompetency/list-competency/position-code`;
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

async function fetchAddtechnicalCompetency(payload) {
  const url = `${url_api}/api/TechnicalCompetency/draft/add-technical-competency`;
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

async function fetchDeleteActivityDraft(id, positionCode) {
  const url = `${url_api}/api/TechnicalCompetency/draft-competency/delete-action?draftId=${id}&positionCode=${positionCode}`;
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
async function fetchEditActivityCompetency(draftId, positionCode) {
  const url = `${url_api}/api/TechnicalCompetency/draft-competency/detail-action/${draftId}/${positionCode}`;
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
