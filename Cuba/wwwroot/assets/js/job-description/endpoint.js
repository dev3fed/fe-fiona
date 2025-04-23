// http://localhost:5095/api/rasci-matrix/draft/list?Page=1&PageSize=5
async function draftRasciMatrix() {
  const api = `${url.baseUrl}/${url["rasci-matrix"]}/draft/list?Page=1&PageSize=5`;
  try {
    const result = await ajaxRequest(api, "GET"); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    console.error("Error fetching data from API");
    throw error;
  }
}

// 'http://localhost:5095/api/job-description/draft/create/asd?draftRasciId=ad&draftName=ads&description=asd'
async function postDraftJobDesc(params) {
  const api = `${url.baseUrl}/${url["job-description"]}/draft/create/${params.draftSOId}?draftRasciId=${params.draftRasciId}&draftName=${params.draftName}`;
  try {
    const result = await ajaxRequest(api, "POST", params); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    console.error("Error fetching data from API");
    throw error;
  }
}

// /api/job-description/draft/list/{page}/{pageSize}
async function listDraftJobDesc(page, pageSize) {
  const api = `${url.baseUrl}/${url["job-description"]}/draft/list/${page}/${pageSize}`;
  try {
    const result = await ajaxRequest(api, "GET"); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    console.error("Error fetching data from API");
    throw error;
  }
}

// http://localhost:5095/api/job-description/draft/list-detail/38646e81-bbcc-46e0-8f99-6c00e67d8aad/1/10
async function listDraftDetailJobDesc(draftId, page, pageSize) {
  const api = `${url.baseUrl}/${url["job-description"]}/draft/list-detail/${draftId}/${page}/${pageSize}`;
  try {
    const result = await ajaxRequest(api, "GET"); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    console.error("Error fetching data from API");
    throw error;
  }
}

// 'http://localhost:5095/api/job-description/draft/rename/2fc3e013-85ee-459c-a042-b83b1e8e647e?draftName=jobdes1&description=testing%20jobdesc1'
async function renameDraftJobDesc(params) {
  const api = `${url.baseUrl}/${url["job-description"]}/draft/rename/${params.draftId}?draftName=${params.draftName}&description=${params.description}`;
  try {
    const result = await ajaxRequest(api, "PUT", params); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    console.error("Error fetching data from API");
    throw error;
  }
}

// http://localhost:5095/api/job-description/draft/delete/asd
async function deleteDraftJobDesc(draftId) {
  const api = `${url.baseUrl}/${url["job-description"]}/draft/delete/${draftId}`;
  try {
    const result = await ajaxRequest(api, "DELETE"); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    console.error("Error fetching data from API");
    throw error;
  }
}
