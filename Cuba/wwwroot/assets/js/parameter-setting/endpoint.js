// /api/TechnicalCompetency/detail-dictionary/{compCode}
async function getDetailDictionaryAsync(params) {
  const api = `${url.baseUrl}/api/TechnicalCompetency/detail-dictionary/${params.compCode}`; // Sesuaikan dengan endpoint
  try {
    const result = await ajaxRequest(api, "GET", params); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    throw error;
  }
}

// http://localhost:5095/api/Parameter/list-mandatory
async function getListMandatoryAsync(params) {
  const api = `${url.baseUrl}/api/Parameter/list-mandatory?page=${params.page}&pageSize=${params.pageSize}&search=${params.search}`; // Sesuaikan dengan endpoint
  try {
    const result = await ajaxRequest(api, "GET", params); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    throw error;
  }
}

// /api/Parameter/general
async function getGeneralAsync(params) {
  const api = `${url.baseUrl}/api/Parameter/general`; // Sesuaikan dengan endpoint
  try {
    const result = await ajaxRequest(api, "GET", params); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    throw error;
  }
}

// /api/Parameter/weight-setting
async function getWeightSettingAsync(params) {
  const api = `${url.baseUrl}/api/Parameter/weight-setting`; // Sesuaikan dengan endpoint
  try {
    const result = await ajaxRequest(api, "GET", params); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    throw error;
  }
}

// http://localhost:5095/api/Parameter/general?parameterValue=1
async function postGeneralAsync(params) {
  const api = `${url.baseUrl}/api/Parameter/general?parameterValue=${params.parameterValue}`; // Sesuaikan dengan endpoint
  try {
    const result = await ajaxRequest(api, "POST", params); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    throw error;
  }
}
// /api/Parameter/edit-mandatory
async function editMandatoryAsync(params) {
  const api = `${url.baseUrl}/api/Parameter/edit-mandatory`; // Sesuaikan dengan endpoint
  try {
    const result = await ajaxRequest(api, "POST", params); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    throw error;
  }
}

// /api/Parameter/weight-setting
async function postWeightSettingAsync(params) {
  const api = `${url.baseUrl}/api/Parameter/weight-setting`; // Sesuaikan dengan endpoint
  try {
    const result = await ajaxRequest(api, "POST", params); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    throw error;
  }
}
