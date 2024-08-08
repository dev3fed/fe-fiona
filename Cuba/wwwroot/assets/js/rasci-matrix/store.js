const appState = new Proxy(
  {
    allDataJabatan: [],
    resultJabatan: null,
    allDataProsbis: [],
    resultProsbis: null,
    idProsbis: [],
    resultRasciMapping: [],
  },
  {
    set(target, property, value) {
      if (property === "resultJabatan") {
        target[property] = value;
        renderDataJob(value); // Call renderData when resultJabatan is updated
      } else if (property === "resultProsbis") {
        target[property] = value;
      } else if (property === "idProsbis") {
        target[property] = value;
      } else if (property === "allDataProsbis") {
        target[property] = value;
      } else {
        target[property] = value;
      }
      return true;
    },
  },
);

async function getProsbisList() {
  try {
    const result = await $.ajax({
      type: "GET",
      url: `${url_api}/api/BusinessProcess`,
    });
    return result;
  } catch (error) {
    console.log("Error fetching Prosbis data from API");
    $("#resultProsbis").html("Error fetching data from API");
    throw error;
  }
}

async function getJobTitleList() {
  try {
    const result = await $.ajax({
      type: "GET",
      url: `${url_api}/api/jobtitle`,
    });
    return result;
  } catch (error) {
    console.log("Error fetching Job Title data from API");
    $("#resultJabatan").html("Error fetching data from API");
    throw error;
  }
}

async function getrasciMappingList() {
  try {
    const result = await $.ajax({
      type: "GET",
      url: `${url_api}/api/rascimapping`,
    });
    return result;
  } catch (error) {
    console.log("Error fetching Job Title data from API");
    $("#resultJabatan").html("Error fetching data from API");
    throw error;
  }
}

async function fetchData() {
  try {
    const [prosbisData, jobTitleData, rasciMappingData] = await Promise.all([
      getProsbisList(),
      getJobTitleList(),
      getrasciMappingList(),
    ]);
    appState.resultJabatan = jobTitleData.data;
    appState.allDataProsbis = prosbisData?.data;
    appState.resultProsbis = prosbisData?.data.filter(
      (item) => item.level === 1,
    );
    appState.resultJabatan = jobTitleData.data;
    appState.resultRasciMapping = rasciMappingData.data;
    document.dispatchEvent(new Event("dataLoaded"));
  } catch (error) {
    console.error("Error fetching data", error);
  }
}

// Initial data fetch
fetchData();

function renderDataJob(data) {
  // console.log(data);
}
function renderDataProsbis(data) {
  loadTableBody(data);
}
