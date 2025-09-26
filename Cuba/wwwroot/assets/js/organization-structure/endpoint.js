async function ajaxRequestFile(url, method, data = null, file = null) {
  try {
    const formData = new FormData();
    if (data) {
      for (const key in data) {
        formData.append(key, data[key]);
      }
    }
    if (file) {
      formData.append("file", file);
    }
    const response = await $.ajax({
      url,
      type: method,
      contentType: false,
      processData: false,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      data: formData,
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

async function chartDraftList() {
  const api = `${url.baseUrl}/${url["api-organization"]}/draft/list`;
  try {
    const result = await ajaxRequest(api, "GET"); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    console.error("Error fetching data from API");
    $("#resultJabatan").html("Error fetching data from API");
    throw error;
  }
}

async function draftDetailById(params) {
  const api = `${url.baseUrl}/${url["api-organization"]}/draft/detail/${params}`;
  try {
    const result = await ajaxRequest(api, "GET"); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    console.error("Error fetching data from API");
    $("#resultJabatan").html("Error fetching data from API");
    throw error;
  }
}

async function chartOrgNodeList(params) {
  const api = `${url.baseUrl}/${url["api-organization"]}/chart/job/list`;
  try {
    const result = await ajaxRequest(api, "GET", params); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    console.error("Error fetching data from API");
    $("#chartJobPositionList").html("Error fetching data from API");
    throw error;
  }
}

// http://localhost:5095/api/organization-structure/chart/show
async function chartShow(params) {
  const api = `${url.baseUrl}/${url["api-organization"]}/chart/show`;
  try {
    const result = await ajaxRequest(api, "POST", params); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    console.error("Error fetching data from API");
    $("#chartJobPositionList").html("Error fetching data from API");
    throw error;
  }
}

// http://localhost:5095/api/organization-structure/chart/job/hiearchies
async function chartJobHiearchies(params) {
  const api = `${url.baseUrl}/${url["api-organization"]}/chart/job/hiearchies`;
  try {
    const result = await ajaxRequest(api, "POST", params); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    console.error("Error fetching data from API");
    $("#chartJobPositionList").html("Error fetching data from API");
    throw error;
  }
}

async function chartJobDetail(params) {
  const api = `${url.baseUrl}/${url["api-organization"]}/chart/job/detail?draftId=${params.draftId}&unitCode=${params.jobCode}`;
  try {
    const result = await ajaxRequest(api, "GET", params); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    console.error("Error fetching data from API");
    $("#chartJobPositionList").html("Error fetching data from API");
    throw error;
  }
}

async function functionList(params) {
  const api = `${url.baseUrl}/${url["api-organization"]}/draft/function/list?draftId=${params}`;
  try {
    const result = await ajaxRequest(api, "GET"); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    console.error("Error fetching data from API");
    $("#chartJobPositionList").html("Error fetching data from API");
    throw error;
  }
}

async function abbrvPositionList(params) {
  const api = `${url.baseUrl}/${url["api-organization"]}/draft/job-abbriviation/list?draftId=${params}`;
  try {
    const result = await ajaxRequest(api, "GET"); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    console.error("Error fetching data from API");
    $("#chartJobPositionList").html("Error fetching data from API");
    throw error;
  }
}

async function careerTypeList() {
  const api = `${url.baseUrl}/${url["api-organization"]}/draft/career-type/list`;
  try {
    const result = await ajaxRequest(api, "GET"); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    console.error("Error fetching data from API");
    $("#chartJobPositionList").html("Error fetching data from API");
    throw error;
  }
}

async function createDraftSO(params) {
  const api = `${url.baseUrl}/${url["api-organization"]}/draft/create/${params}`; // http://localhost:5095/api/organization-structure/draft/create/1
  try {
    const result = await ajaxRequest(api, "POST", {}); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    console.error("Error fetching data from API");
    $("#chartJobPositionList").html("Error fetching data from API");
    throw error;
  }
}

async function renameDraftSO(params) {
  const api = `${url.baseUrl}/${url["api-organization"]}/draft/rename/${params.id}/${params.name}`; // http://localhost:5095/api/organization-structure/draft/rename/1/tes
  try {
    const result = await ajaxRequest(api, "PUT", params); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    console.error("Error fetching data from API");
    $("#chartJobPositionList").html("Error fetching data from API");
    throw error;
  }
}

async function uploadDataDraftSO(params, file) {
  const api = `${url.baseUrl}/${url["api-organization"]}/draft/upload/${params}`; // http://localhost:5095/api/organization-structure/draft/upload/1
  console.log("file", file);
  try {
    const result = await ajaxRequestFile(api, "POST", params, file); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    console.error("Error fetching data from API");
    $("#chartJobPositionList").html("Error fetching data from API");
    throw error;
  }
}

async function draftSubmitToApproval(params) {
  const api = `${url.baseUrl}/${url["api-organization"]}/draft/submit-for-approval/${params}`;
  try {
    const result = await ajaxRequest(api, "POST", {}); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    console.error("Error fetching data from API");
    $("#chartJobPositionList").html("Error fetching data from API");
    throw error;
  }
}

async function draftApprove(params) {
  const api = `${url.baseUrl}/${url["api-organization"]}/draft/approve/${params}`;
  try {
    const result = await ajaxRequest(api, "POST", {}); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    console.error("Error fetching data from API");
    $("#chartJobPositionList").html("Error fetching data from API");
    throw error;
  }
}

async function draftReject(params) {
  const api = `${url.baseUrl}/${url["api-organization"]}/draft/reject/${params}`;
  try {
    const result = await ajaxRequest(api, "POST", {}); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    console.error("Error fetching data from API");
    $("#chartJobPositionList").html("Error fetching data from API");
    throw error;
  }
}

async function draftFinalize(params, file) {
  const api = `${url.baseUrl}/${url["api-organization"]}/draft/finalize/${params}`;
  try {
    const result = await ajaxRequestFile(api, "POST", params, file); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    console.error("Error fetching data from API");
    $("#chartJobPositionList").html("Error fetching data from API");
    throw error;
  }
}

async function approvedList() {
  const api = `${url.baseUrl}/${url["api-organization"]}/approval/list`;
  try {
    const result = await ajaxRequest(api, "GET"); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    console.error("Error fetching data from API");
    $("#chartJobPositionList").html("Error fetching data from API");
    throw error;
  }
}

// /api/organization-structure/draft/jobs/delete-job-and-subordinates
async function deleteJobAndSubordinates(params) {
  const api = `${url.baseUrl}/${url["api-organization"]}/draft/jobs/delete-job-and-subordinates`;
  try {
    const result = await ajaxRequest(api, "DELETE", params); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    console.error("Error fetching data from API");
    $("#resultJabatan").html("Error fetching data from API");
    throw error;
  }
}

// /api/organization-structure/draft/rollback/{draftId}
async function rollbackDraftSO(params) {
  const api = `${url.baseUrl}/${url["api-organization"]}/draft/rollback/${params}`;
  try {
    const result = await ajaxRequest(api, "POST", {}); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    console.error("Error fetching data from API");
    $("#resultJabatan").html("Error fetching data from API");
    throw error;
  }
}

// ========================================
// ========================================
// ========================================
async function postInputAttribute(params) {
  const api = `${url}/api/JobTitle/create-draft-job`;
  try {
    const result = await ajaxRequest(api, "POST", params); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    console.error("Error fetching data from API");
    $("#resultJabatan").html("Error fetching data from API");
    throw error;
  }
}

async function postInputSubordinate(params) {
  const api = `${url}/api/JobTitle/create-draft-job-subordinate`;
  try {
    const result = await ajaxRequest(api, "POST", params); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    console.error("Error fetching data from API");
    $("#resultJabatan").html("Error fetching data from API");
    throw error;
  }
}

// create-draft-job-sub-position
async function postInputSubPosition(params) {
  const api = `${url}/api/JobTitle/create-draft-job-sub-position`;
  try {
    const result = await ajaxRequest(api, "POST", params); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    console.error("Error fetching data from API");
    $("#resultJabatan").html("Error fetching data from API");
    throw error;
  }
}

async function postInputSgSsg(params) {
  const api = `${url}/api/JobTitle/create-draft-job-sssg`;
  try {
    const result = await ajaxRequest(api, "POST", params); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    console.error("Error fetching data from API");
    $("#resultJabatan").html("Error fetching data from API");
    throw error;
  }
}

// http://localhost:5095/api/JobTitle/list-draft-job-subordinate/91cf8ce3-6c95-4bab-8628-841dc013bbc2
async function listDraftJobSubordinate(uniqueCode) {
  const api = `${url}/api/JobTitle/list-draft-job-subordinate/${uniqueCode}`;
  try {
    const result = await ajaxRequest(api, "GET"); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    console.error("Error fetching data from API");
    $("#resultJabatan").html("Error fetching data from API");
    throw error;
  }
}

// http://localhost:5095/api/JobTitle/list-draft-job-sub-position/91cf8ce3-6c95-4bab-8628-841dc013bbc2
async function listDraftJobSubPosition(uniqueCode) {
  const api = `${url}/api/JobTitle/list-draft-job-sub-position/${uniqueCode}`;
  try {
    const result = await ajaxRequest(api, "GET"); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    console.error("Error fetching data from API");
    $("#resultJabatan").html("Error fetching data from API");
    throw error;
  }
}

// http://localhost:5095/api/JobTitle/list-draft-organization-structure
async function listDraftOrganizationStructure() {
  const api = `${url}/api/JobTitle/list-draft-organization-structure`;
  try {
    const result = await ajaxRequest(api, "GET"); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    console.error("Error fetching data from API");
    $("#resultJabatan").html("Error fetching data from API");
    throw error;
  }
}

// http://localhost:5095/api/JobTitle/detail-draft-organization-structure/1
async function detailDraftOrganizationStructure(id) {
  const api = `${url}/api/JobTitle/detail-draft-organization-structure/${id}`;
  try {
    const result = await ajaxRequest(api, "GET"); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    console.error("Error fetching data from API");
    $("#resultJabatan").html("Error fetching data from API");
    throw error;
  }
}

// http://localhost:5095/api/JobTitle/delete-draft-job-sub-position/1
async function deleteDraftJobSubPosition(id) {
  const api = `${url}/api/JobTitle/delete-draft-job-sub-position/${id}`;
  try {
    const result = await ajaxRequest(api, "DELETE"); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    console.error("Error fetching data from API");
    $("#resultJabatan").html("Error fetching data from API");
    throw error;
  }
}

// http://localhost:5095/api/JobTitle/delete-draft-job-subordinate/1
async function deleteDraftJobSubordinate(id) {
  const api = `${url}/api/JobTitle/delete-draft-job-subordinate/${id}`;
  try {
    const result = await ajaxRequest(api, "DELETE"); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    console.error("Error fetching data from API");
    $("#resultJabatan").html("Error fetching data from API");
    throw error;
  }
}

// http://localhost:5095/api/JobTitle/detail-draft-job-sub-position/48
async function detailDraftJobSubPosition(id) {
  const api = `${url}/api/JobTitle/detail-draft-job-sub-position/${id}`;
  try {
    const result = await ajaxRequest(api, "GET"); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    console.error("Error fetching data from API");
    $("#resultJabatan").html("Error fetching data from API");
    throw error;
  }
}

// http://localhost:5095/api/JobTitle/edit-draft-job-sub-position/48
async function editDraftJobSubPosition(params) {
  const api = `${url}/api/JobTitle/edit-draft-job-sub-position/${params.id}`;
  try {
    const result = await ajaxRequest(api, "PUT", params); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    console.error("Error fetching data from API");
    $("#resultJabatan").html("Error fetching data from API");
    throw error;
  }
}
// http://localhost:5095/api/JobTitle/edit-draft-job-subordinate/48
async function editDraftJobSubordinate(params) {
  const api = `${url}/api/JobTitle/edit-draft-job-subordinate/${params.id}`;
  try {
    const result = await ajaxRequest(api, "PUT", params); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    console.error("Error fetching data from API");
    $("#resultJabatan").html("Error fetching data from API");
    throw error;
  }
}

// /api/JobTitle/delete-draft-organization-structure/{id}
async function deleteDraftOrganizationStructure(id) {
  const api = `${url}/api/JobTitle/delete-draft-organization-structure/${id}`;
  try {
    const result = await ajaxRequest(api, "DELETE"); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    console.error("Error fetching data from API");
    $("#resultJabatan").html("Error fetching data from API");
    throw error;
  }
}

// http://localhost:5095/api/JobTitle/detail-job-position/30258741
async function detailJobPositionByCode(id) {
  const api = `${url}/api/JobTitle/detail-job-position/${id}`;
  try {
    const result = await ajaxRequest(api, "GET"); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    console.error("Error fetching data from API");
    $("#resultJabatan").html("Error fetching data from API");
    throw error;
  }
}

// pi/organization-structure/draft/jobs/move-job
async function draftJobMove(params) {
  const api = `${url.baseUrl}/${url["api-organization"]}/draft/jobs/move-job`;
  try {
    const result = await ajaxRequest(api, "PUT", params); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    console.error("Error fetching data from API");
    $("#resultJabatan").html("Error fetching data from API");
    throw error;
  }
}

// http://localhost:5095/api/organization-structure/draft/jobs/save-job-as-draft
async function draftJobSaveAsDraft(params) {
  const api = `${url.baseUrl}/${url["api-organization"]}/draft/jobs/save-job-as-draft`;
  try {
    const result = await ajaxRequest(api, "POST", params); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    console.error("Error fetching data from API");
    $("#resultJabatan").html("Error fetching data from API");
    throw error;
  }
}

// http://localhost:5095/api/organization-structure/draft/jobs/update-job-as-draf
async function draftJobUpdateAsDraft(params) {
  const api = `${url.baseUrl}/${url["api-organization"]}/draft/jobs/update-job-as-draft`;
  try {
    const result = await ajaxRequest(api, "PUT", params); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    console.error("Error fetching data from API");
    $("#resultJabatan").html("Error fetching data from API");
    throw error;
  }
}

// /api/organization-structure/draft/jobs/add-job-non-basket
async function draftJobAddNonBasket(params) {
  const api = `${url.baseUrl}/${url["api-organization"]}/draft/jobs/add-job-non-basket`;
  try {
    const result = await ajaxRequest(api, "POST", params); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    console.error("Error fetching data from API");
    $("#resultJabatan").html("Error fetching data from API");
    throw error;
  }
}

// /api/organization-structure/draft/jobs/add-job-basket
async function draftJobAddBasket(params) {
  const api = `${url.baseUrl}/${url["api-organization"]}/draft/jobs/add-job-basket`;
  try {
    const result = await ajaxRequest(api, "POST", params); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    console.error("Error fetching data from API");
    $("#resultJabatan").html("Error fetching data from API");
    throw error;
  }
}

// /api/organization-structure/draft/jobs/update-job-non-basket
async function draftJobUpdateNonBasket(params) {
  const api = `${url.baseUrl}/${url["api-organization"]}/draft/jobs/update-job-non-basket`;
  try {
    const result = await ajaxRequest(api, "PUT", params); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    console.error("Error fetching data from API");
    $("#resultJabatan").html("Error fetching data from API");
    throw error;
  }
}

// /api/organization-structure/draft/jobs/update-job-basket
async function draftJobUpdateBasket(params) {
  const api = `${url.baseUrl}/${url["api-organization"]}/draft/jobs/update-job-basket`;
  try {
    const result = await ajaxRequest(api, "PUT", params); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    console.error("Error fetching data from API");
    $("#resultJabatan").html("Error fetching data from API");
    throw error;
  }
}

// http://localhost:5095/api/organization-structure/draft/jobs/delete-job
async function draftJobDelete(params) {
  const api = `${url.baseUrl}/${url["api-organization"]}/draft/jobs/delete-job`;
  try {
    const result = await ajaxRequest(api, "DELETE", params); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    console.error("Error fetching data from API");
    $("#resultJabatan").html("Error fetching data from API");
    throw error;
  }
}

// http://localhost:5095/api/organization-structure/draft/jobs/job-subordinate?draftId=00bd73c8-c644-4bab-a3c9-899a44c76749&jobCode=10135534
async function draftJobSubordinate(params) {
  const api = `${url.baseUrl}/${url["api-organization"]}/draft/jobs/job-subordinate?draftId=${params.draftId}&jobCode=${params.jobCode}`;
  try {
    const result = await ajaxRequest(api, "GET", params); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    console.error("Error fetching data from API");
    $("#resultJabatan").html("Error fetching data from API");
    throw error;
  }
}

// http://localhost:5095/api/organization-structure/draft/jobs/duplicate-job
async function draftJobDuplicate(params) {
  const api = `${url.baseUrl}/${url["api-organization"]}/draft/jobs/duplicate-job`;
  try {
    const result = await ajaxRequest(api, "POST", params); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    console.error("Error fetching data from API");
    $("#resultJabatan").html("Error fetching data from API");
    throw error;
  }
}

// http://localhost:5095/design-cost-by-function?draftId=a7ce5e5c-7dd8-4683-9025-35f301340d19&page=1&pageSize=10
async function designCostByFunction(params) {
  const api = `${url.baseUrl}/design-cost-by-function?draftId=${params.draftId}&page=${params.page}&pageSize=${params.pageSize}`;
  try {
    const result = await ajaxRequest(api, "GET", params); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    console.error("Error fetching data from API");
    $("#resultJabatan").html("Error fetching data from API");
    throw error;
  }
}

// http://localhost:5095/design-cost-by-division?draftId=a7ce5e5c-7dd8-4683-9025-35f301340d19&page=1&pageSize=10
async function designCostByDivision(params) {
  const api = `${url.baseUrl}/design-cost-by-division?draftId=${params.draftId}&page=${params.page}&pageSize=${params.pageSize}`;
  try {
    const result = await ajaxRequest(api, "GET", params); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    console.error("Error fetching data from API");
    $("#resultJabatan").html("Error fetching data from API");
    throw error;
  }
}

// http://localhost:5095/design-cost-by-level?draftId=a7ce5e5c-7dd8-4683-9025-35f301340d19&page=1&pageSize=10
async function designCostByLevel(params) {
  const api = `${url.baseUrl}/design-cost-by-level?draftId=${params.draftId}&page=${params.page}&pageSize=${params.pageSize}`;
  try {
    const result = await ajaxRequest(api, "GET", params); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    console.error("Error fetching data from API");
    $("#resultJabatan").html("Error fetching data from API");
    throw error;
  }
}

// 'http://localhost:5095/api/organization-structure/draft/jobs/list-detail-jobs?draftId=d2e69277-3791-4f14-9f50-b55e1fca77f1&page=2&pageSize=10' \
async function listDetailJobs(params) {
  const api = `${url.baseUrl}/${url["api-organization"]}/draft/jobs/list-detail-jobs?draftId=${params.draftId}&page=${params.page}&pageSize=${params.pageSize}`;
  try {
    const result = await ajaxRequest(api, "GET", params); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    console.error("Error fetching data from API");
    $("#resultJabatan").html("Error fetching data from API");
    throw error;
  }
}
