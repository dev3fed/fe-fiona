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
