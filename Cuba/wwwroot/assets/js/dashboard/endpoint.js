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
