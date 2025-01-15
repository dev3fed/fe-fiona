const appState = new Proxy(
  {
    allDataJabatan: [],
    resultJabatan: null,
    allDataProsbis: [],
    resultProsbis: null,
    idProsbis: [],
    resetIdProsbis: [],
    resultRasciMapping: [],
    isSearchMatrix: false,
    idSearchProsbis: "",
    prosbisLevel: [],
    filterJobList: [],
    checkedParentId: [],
    selectedLevel: 0,
    //start filter rasci matrix
    rasciNotationFilter: [],
    levelFilter: [],
    visibleJobs: [],
    selectedJobId: [],
    disabledJobId: [],
    payloadDraftList: {
      Page: 1,
      PageSize: 5,
    },
    payloadDetailDraftPage: {
      Page: 1,
      PageSize: 5,
    },
    //end filter rasci matrix
    dataDetailDraft: {},
    editDrafProsbis: {
      rasciNotation: [],
    },
    deleteDraftProsbis: "",
    rasciNotation: [
      {
        rasciCode: "R",
        comment: "",
        isChecked: false,
      },
      {
        rasciCode: "A",
        comment: "",
        isChecked: false,
      },
      {
        rasciCode: "S",
        comment: "",
        isChecked: false,
      },
      {
        rasciCode: "C",
        comment: "",
        isChecked: false,
      },
      {
        rasciCode: "I",
        comment: "",
        isChecked: false,
      },
    ],
    insertProsbis: {
      parentId: null,
      jobMapped: [],
    },
  },
  {
    set(target, property, value) {
      if (target[property] !== value) {
        // Set the new value
        target[property] = value;
        loadTableHeader(target.resultJabatan);
        loadTableBody(target.resultProsbis);
        updateSelect2ByProsbis();
        updateSelect2ByJob();
        formValidation();
        if (property === "dataDetailDraft") {
          detailDraft();
        } else if (property === "editDrafProsbis") {
          updateSelectEditProsbis();
        } else if (property === "checkedParentId") {
          dataListJobChecked();
        }
        // if (
        //   property === "resultJabatan" ||
        //   property === "resultProsbis" ||
        //   property === "resultRasciMapping"
        // ) {
        //   target[property] = value;
        //   loadTableHeader(target.resultJabatan);
        //   loadTableBody(target.resultProsbis);
        // } else if (property === "idProsbis") {
        //   target[property] = value;
        // } else {
        //   target[property] = value;
        // }
      }
      return true;
    },
  },
);
function setState(key, value) {
  appState[key] = value; // This will trigger the Proxy set handler
}

// Fungsi untuk mendapatkan nilai state saat ini
function getState(key) {
  return appState[key];
}
window.setState = setState;
window.getState = getState;

async function SearchMatrix(params) {
  const url = `${url_api}/api/RasciMatrix/searchBy?type=${params.type}&search=${params.search}`;
  try {
    const result = await ajaxRequest(url, "GET");
    return result;
  } catch (error) {
    console.error("Error fetching data from API");
    $("#resultJabatan").html("Error fetching data from API");
    throw error;
  }
}

async function fetchDataMatrix(params) {
  const url = `${url_api}/api/RasciMatrix`;
  try {
    const result = await ajaxRequest(url, "POST", params);
    return result;
  } catch (error) {
    console.error("Error fetching data from API");
    $("#resultJabatan").html("Error fetching data from API");
    throw error;
  }
}

async function fetchSelectLevel(draftId) {
  const url = `${url_api}/api/Utilities/selection?Page=1&Type=level&DraftId=${draftId}`;
  try {
    const result = await ajaxRequest(url, "GET");
    return result;
  } catch (error) {
    console.error("Error fetching data from API");
    throw error;
  }
}

async function fetchDraftProsbis(params) {
  const url = `${url_api}/api/RasciMatrix/draft/list?${params}`;
  try {
    const result = await ajaxRequest(url, "GET");
    return result.data;
  } catch (error) {
    console.error("Error fetching data from API");
    throw error;
  }
}

async function fetchDraftListProsbis(idDraft, query) {
  const url = `${url_api}/api/RasciMatrix/draft/list/${idDraft}?${query}`;
  try {
    const result = await ajaxRequest(url, "GET");
    return result.data;
  } catch (error) {
    console.error("Error fetching data from API");
    throw error;
  }
}

async function fetchFilterJobList() {
  const url = `${url_api}/api/RasciMatrix/list-rasci-filter`;
  try {
    const result = await ajaxRequest(url, "GET");
    return result;
  } catch (error) {
    console.error("Error fetching data from API");
    throw error;
  }
}

async function fetchDraftProsbisByid(payload) {
  const url = `${url_api}/api/RasciMatrix/draft/detail/${payload}`;
  try {
    const result = await ajaxRequest(url, "GET");
    return result;
  } catch (error) {
    console.error("Error fetching data from API");
    throw error;
  }
}

async function submitDraftProsbis(payload) {
  const url = `${url_api}/api/RasciMatrix/draft/save`;
  try {
    const result = await ajaxRequest(url, "POST", payload);
    return result;
  } catch (error) {
    console.error("Error fetching data from API");
    throw error;
  }
}

async function updateDraftProsbis(payload, id) {
  const url = `${url_api}/api/BusinessProcess/draft/${id}`;
  try {
    const result = await ajaxRequest(url, "PUT", payload);
    return result;
  } catch (error) {
    console.error("Error fetching data from API");
    throw error;
  }
}

async function draftSubmittoApproval(payload, id) {
  const url = `${url_api}/api/BusinessProcess/draft-submission/${id}`;
  try {
    const result = await ajaxRequest(url, "PUT", payload);
    return result;
  } catch (error) {
    console.error("Error fetching data from API");
    throw error;
  }
}

async function deleteProsbisDraft(id) {
  const url = `${url_api}/api/RasciMatrix/draft/delete?draftId=${id}`;
  try {
    const result = await ajaxRequest(url, "DELETE");
    return result;
  } catch (error) {
    console.error("Error fetching data from API");
    throw error;
  }
}
async function createDraftRasci(payload) {
  const url = `${url_api}/api/RasciMatrix/draft/create`;
  try {
    const result = await ajaxRequest(url, "POST", payload);
    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error?.responseJSON.message || "Error fetching data from API",
    };
  }
}

async function endpointRenameDraft(params, payload) {
  const url = `${url_api}/api/RasciMatrix/draft/rename/${params}`;
  try {
    const result = await ajaxRequest(url, "PUT", payload);
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

async function fetchDetailDraftActivity(id) {
  const url = `${url_api}/api/RasciMatrix/draft/detail-list/${id}`;
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

async function fetchData() {
  try {
    // const [dataMatrix, prosbisLvl, filterJobList] = await Promise.all([
    //   fetchDataMatrix(),
    //   fetchSelectLevel(),
    //   fetchFilterJobList(),
    // ]);
    const [dataMatrix, prosbisLvl] = await Promise.all([fetchDataMatrix(), fetchSelectLevel()]);
    appState.resultJabatan = dataMatrix?.data.jobTitle;
    appState.resultProsbis = dataMatrix?.data.businessProcess;
    appState.resultRasciMapping = dataMatrix?.data.rasciMatrix;
    appState.prosbisLevel = prosbisLvl?.data.result;
    // const combinedData = [
    //   ...filterJobList?.data.level1.map((item) => ({ ...item, type: "level1" })),
    //   ...filterJobList?.data.level2.map((item) => ({ ...item, type: "level2" })),
    //   ...filterJobList?.data.level3.map((item) => ({ ...item, type: "level3" })),
    //   ...filterJobList?.data.level4.map((item) => ({ ...item, type: "level4" })),
    //   ...filterJobList?.data.level5.map((item) => ({ ...item, type: "level5" })),
    //   ...filterJobList?.data.level6.map((item) => ({ ...item, type: "level6" })),
    // ];
    // appState.filterJobList = combinedData;
    document.dispatchEvent(new Event("dataLoaded"));
  } catch (error) {
    console.error("Error fetching data", error);
  }
}

// Initial data fetch
fetchData();

function resultAllData(val) {
  // console.log(val);
  appState.resultJabatan = val.jobTitle;
  appState.resultProsbis = val.businessProcess;
  appState.resultRasciMapping = val.rasciMatrix;

  //
}
