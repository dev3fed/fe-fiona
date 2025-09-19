// /api/dashboard/organization-structure/total-formation
async function fetchTotalFormation() {
  const api = `${url.baseUrl}/${url["dashboard"]}${url["organization-structure"]}/total-formation`;
  try {
    const result = await ajaxRequest(api, "GET"); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    console.error("Error fetching data from API (total-formation):", error);
  }
}

// /api/dashboard/organization-structure/total-project
async function fetchTotalProject() {
  const api = `${url.baseUrl}/${url["dashboard"]}${url["organization-structure"]}/total-project`;
  try {
    const result = await ajaxRequest(api, "GET");
    return result;
  } catch (error) {
    console.error("Error fetching data from API (total-project):", error);
  }
}
// /api/dashboard/organization-structure/total-positions-by-level
async function fetchTotalPositionsByLevel() {
  const api = `${url.baseUrl}/${url["dashboard"]}${url["organization-structure"]}/total-positions-by-level`;
  try {
    const result = await ajaxRequest(api, "GET");
    return result;
  } catch (error) {
    console.error("Error fetching data from API (total-positions-by-level):", error);
  }
}

// /api/dashboard/organization-structure/total-positions-by-directorate
async function fetchTotalPositionsByDirectorate() {
  const api = `${url.baseUrl}/${url["dashboard"]}${url["organization-structure"]}/total-positions-by-directorate`;
  try {
    const result = await ajaxRequest(api, "GET");
    return result;
  } catch (error) {
    console.error("Error fetching data from API (total-positions-by-directorate):", error);
  }
}

// /api/dashboard/organization-structure/total-organization-shape-job-grade-by-area
async function fetchTotalOrganizationShapeJobGradeByArea(params = {}) {
  const searchParams = new URLSearchParams();

  if (params.areaType) searchParams.append("areaType", params.areaType);
  if (params.directorate) searchParams.append("directorate", params.directorate);

  const queryString = searchParams.toString() ? `?${searchParams.toString()}` : "";
  const api = `${url.baseUrl}/${url["dashboard"]}${url["organization-structure"]}/total-organization-shape-job-grade-by-area${queryString}`;

  try {
    const result = await ajaxRequest(api, "GET");
    return result;
  } catch (error) {
    console.error("Error fetching data from API (total-organization-shape-job-grade-by-area):", error);
  }
}

// /api/dashboard/organization-structure/total-organization-shape-person-grade-by-area
async function fetchTotalOrganizationShapePersonGradeByArea(params = {}) {
  const searchParams = new URLSearchParams();

  if (params.areaType) searchParams.append("areaType", params.areaType);
  if (params.directorate) searchParams.append("directorate", params.directorate);

  const queryString = searchParams.toString() ? `?${searchParams.toString()}` : "";
  const api = `${url.baseUrl}/${url["dashboard"]}${url["organization-structure"]}/total-organization-shape-person-grade-by-area${queryString}`;

  try {
    const result = await ajaxRequest(api, "GET");
    return result;
  } catch (error) {
    console.error("Error fetching data from API (total-organization-shape-person-grade-by-area):", error);
  }
}

// /api/dashboard/rasci-matrix/total-business-process-value-chain
async function fetchTotalBusinessProcessValueChain() {
  const api = `${url.baseUrl}/${url["dashboard"]}${url["rasci-matrix"]}/total-business-process-value-chain`;
  try {
    const result = await ajaxRequest(api, "GET");
    return result;
  } catch (error) {
    console.error("Error fetching data from API (total-business-process-value-chain):", error);
  }
}

// /api/dashboard/rasci-matrix/total-rasci-content-notations
async function fetchTotalRasciContentNotations() {
  const api = `${url.baseUrl}/${url["dashboard"]}${url["rasci-matrix"]}/total-rasci-content-notations`;
  try {
    const result = await ajaxRequest(api, "GET");
    return result;
  } catch (error) {
    console.error("Error fetching data from API (total-rasci-content-notations):", error);
  }
}

// /api/dashboard/rasci-matrix/rasci-notations-by-level-business-process
async function fetchRasciNotationsByLevelBusinessProcess() {
  const api = `${url.baseUrl}/${url["dashboard"]}${url["rasci-matrix"]}/rasci-notations-by-level-business-process`;

  try {
    const result = await ajaxRequest(api, "GET");
    return result;
  } catch (error) {
    console.error("Error fetching data from API (rasci-notations-by-level-business-process):", error);
  }
}

// /api/dashboard/rasci-matrix/rasci-notations-by-job-name-level
async function fetchRasciNotationsByJobNameLevel() {
  const api = `${url.baseUrl}/${url["dashboard"]}${url["rasci-matrix"]}/rasci-notations-by-job-name-level`;

  try {
    const result = await ajaxRequest(api, "GET");
    return result;
  } catch (error) {
    console.error("Error fetching data from API (rasci-notations-by-job-name-level):", error);
  }
}

// /api/dashboard/rasci-matrix/rasci-notations-vs-formation
async function fetchRasciNotationsVsFormation() {
  const api = `${url.baseUrl}/${url["dashboard"]}${url["rasci-matrix"]}/rasci-notations-vs-formation`;
  try {
    const result = await ajaxRequest(api, "GET");
    return result;
  } catch (error) {
    console.error("Error fetching data from API (rasci-notations-vs-formation):", error);
  }
}

// /api/dashboard/competency/total-competencies
async function fetchTotalCompetencies() {
  const api = `${url.baseUrl}/${url["dashboard"]}${url["competency"]}/total-competencies`;
  try {
    const result = await ajaxRequest(api, "GET");
    return result;
  } catch (error) {
    console.error("Error fetching data from API (total-competencies):", error);
  }
}

// /api/dashboard/competency/top-10-specific-competencies
async function fetchTop10SpecificCompetencies() {
  const api = `${url.baseUrl}/${url["dashboard"]}${url["competency"]}/top-10-specific-competencies`;
  try {
    const result = await ajaxRequest(api, "GET");
    return result;
  } catch (error) {
    console.error("Error fetching data from API (top-10-specific-competencies):", error);
  }
}
