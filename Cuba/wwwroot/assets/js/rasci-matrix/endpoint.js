async function SearchMatrix(params) {
  const url = `${url_api}/api/rasci-matrix/searchBy?${params}`;
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
  const url = `${url_api}/api/rasci-matrix`;
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
  const url = `${url_api}/api/rasci-matrix/draft/list?${params}`;

  try {
    const result = await ajaxRequest(url, "GET");
    return result.data;
  } catch (error) {
    console.error("Error fetching data from API");
    throw error;
  }
}

async function fetchDraftListProsbis(idDraft, query) {
  const url = `${url_api}/api/rasci-matrix/draft/list/${idDraft}?${query}`;
  try {
    const result = await ajaxRequest(url, "GET");
    return result.data;
  } catch (error) {
    console.error("Error fetching data from API");
    throw error;
  }
}

async function fetchFilterJobList(draftId) {
  const url = `${url_api}/api/rasci-matrix/position-by-level?source=${draftId}`;
  try {
    const result = await ajaxRequest(url, "GET");
    return result.data;
  } catch (error) {
    console.error("Error fetching data from API");
    throw error;
  }
}
async function fetchJoblistCard(payload) {
  const url = `${url_api}/api/rasci-matrix/position-level-rasci`;
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
async function fetchDraftProsbisByid(payload) {
  const url = `${url_api}/api/rasci-matrix/draft/detail/${payload}`;
  try {
    const result = await ajaxRequest(url, "GET");
    return result;
  } catch (error) {
    console.error("Error fetching data from API");
    throw error;
  }
}

async function submitDraftProsbis(payload) {
  const url = `${url_api}/api/rasci-matrix/draft/save`;
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

async function draftSubmittoApproval(id) {
  const url = `${url_api}/api/rasci-matrix/draft/submission/${id}`;
  try {
    const result = await ajaxRequest(url, "POST");
    return result;
  } catch (error) {
    console.error("Error fetching data from API");
    throw error;
  }
}

async function deleteProsbisDraft(id) {
  const url = `${url_api}/api/rasci-matrix/draft/delete/${id}`;
  try {
    const result = await ajaxRequest(url, "DELETE");
    return result;
  } catch (error) {
    console.error("Error fetching data from API");
    throw error;
  }
}
async function createDraftRasci(payload) {
  const url = `${url_api}/api/rasci-matrix/draft/create`;
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
  const url = `${url_api}/api/rasci-matrix/draft/rename/${params}`;
  try {
    const result = await ajaxRequest(url, "PUT", payload);
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      error: error?.responseJSON.message || "Error fetching data from API",
    };
  }
}

async function fetchDetailDraftActivity(param) {
  const url = `${url_api}/api/rasci-matrix/draft/detail-list/${param}`;
  try {
    const result = await ajaxRequest(url, "GET");
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

async function endpointDeleteDraftActivity(param) {
  const url = `${url_api}/api/rasci-matrix/draft/list/delete/${param}`;
  try {
    const result = await ajaxRequest(url, "DELETE");
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

async function fetchRelatedJob(id, param) {
  const url = `${url_api}/api/rasci-matrix/business-process/detail/${id}?${param}`;
  try {
    const result = await ajaxRequest(url, "GET");
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

async function fetchProsbisByJob(param) {
  const url = `${url_api}/api/rasci-matrix/reference-from-position${param}`;
  try {
    const result = await ajaxRequest(url, "GET");
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

async function fetchProsbisSumulation(currentPageY, currentPageX) {
  const url = `${url_api}/api/rasci-matrix/draft/sumulation/test?draftId=7c7fd4fa-2849-4c12-82a8-26e9ff2d1649&row=${currentPageY}&rowSize=10&col=${currentPageX}&colSize=10`;
  try {
    const result = await ajaxRequest(url, "GET");
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
async function fetchProsbisMatrix(payload) {
  const url = `${url_api}/api/rasci-matrix/business-process`;
  try {
    const result = await ajaxRequest(url, "POST", payload);
    return {
      success: true,
      data: result.data.data,
      totalResult: result.data.totalCount,
    };
  } catch (error) {
    return {
      success: false,
      error: error?.responseJSON.message || "Error fetching data from API",
    };
  }
}

async function fetchPositionMatrix(payload) {
  const url = `${url_api}/api/rasci-matrix/position-rasci`;
  try {
    const result = await ajaxRequest(url, "POST", payload);
    return {
      success: true,
      data: result.data.data,
      totalResult: result.data.totalCount,
    };
  } catch (error) {
    return {
      success: false,
      error: error?.responseJSON.message || "Error fetching data from API",
    };
  }
}

async function fetchDetailNotationRow(payload) {
  const url = `${url_api}/api/rasci-matrix/draft/notation`;
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

async function fetchDetailJob(param) {
  const url = `${url_api}/api/organization-structure/draft/jobs/detail-job-as-draft?${param}`;
  try {
    const result = await ajaxRequest(url, "GET");
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

async function fetchLoghistoryList(payload) {
  const url = `${url_api}/api/log-history/list`;
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

async function fetchExportRasciMatrix(payload) {
  const url = `${url_api}/api/rasci-matrix/draft/export`;
  try {
    const response = await $.ajax({
      url,
      type: "POST",
      data: JSON.stringify(payload),
      contentType: "application/json",
      xhrFields: {
        responseType: "blob",
      },
    });

    // Create a link to download the file
    const blob = new Blob([response], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    link.download = `rasci-matrix-${timestamp}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error?.responseJSON?.message || "Error exporting file",
    };
  }
}
async function fetchApproved(payload) {
  const url = `${url_api}/api/rasci-matrix/draft/approve/${payload}`;
  try {
    const result = await ajaxRequest(url, "POST");
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
async function fetchReject(payload) {
  const url = `${url_api}/api/rasci-matrix/draft/reject/${payload}`;
  try {
    const result = await ajaxRequest(url, "POST");
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

async function fetchAllValueChain(payload) {
  let url = `${url_api}/api/value-chain/business-process/all`;
  if (payload !== "master") {
    url += `?draftSource=${payload}`;
  }
  try {
    const result = await ajaxRequest(url, "GET");
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

async function fetchApprovalList(payload) {
  const url = `${url_api}/api/rasci-matrix/draft/list/approval?${payload}`;
  try {
    const result = await ajaxRequest(url, "GET");
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

async function fetchSummaryList(payload) {
  const url = `${url_api}/api/rasci-matrix/draft/summary-rasci-mapping`;
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

async function fetchNotAvailable(payload) {
  const url = `${url_api}/api/rasci-matrix/draft/position-status-summary/${payload}`;
  try {
    const result = await ajaxRequest(url, "GET");
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
async function fetchData() {
  try {
    const payload = {
      draftRasciId: selectedValue === "master" ? null : selectedValue,
      level: [],
      indexNumber: appState.defaultIndexNumber,
      row: 1,
      rowSize: 15,
    };

    const [filterJobList] = await Promise.all([fetchFilterJobList("master")]);
    setState("payloadProsbis", payload);
    const combinedData = [
      ...filterJobList?.level1.map((item) => ({ ...item, type: "level1" })),
      ...filterJobList?.level2.map((item) => ({ ...item, type: "level2" })),
      ...filterJobList?.level3.map((item) => ({ ...item, type: "level3" })),
      ...filterJobList?.level4.map((item) => ({ ...item, type: "level4" })),
      ...filterJobList?.level5.map((item) => ({ ...item, type: "level5" })),
      ...filterJobList?.level6.map((item) => ({ ...item, type: "level6" })),
      ...filterJobList?.level7.map((item) => ({ ...item, type: "level7" })),
      ...filterJobList?.level8.map((item) => ({ ...item, type: "level8" })),
    ];
    appState.filterJobList = combinedData;
    document.dispatchEvent(new Event("dataLoaded"));
  } catch (error) {
    console.error("Error fetching data", error);
  }
}

fetchData();

// function resultAllData(val) {
//   appState.resultJabatan = val.jobTitle;
//   appState.resultProsbis = val.businessProcess;
//   appState.resultRasciMapping = val.rasciMatrix;

// }
