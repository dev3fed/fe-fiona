const appState = new Proxy(
  {
    allDataJabatan: [],
    resultJabatan: null,
    allDataProsbis: [],
    resultProsbis: null,
    idProsbis: [],
    resetIdProsbis: [],
    resultRasciMapping: [],
  },
  {
    set(target, property, value) {
      if (property === "resultJabatan") {
        target[property] = value;
        loadTableHeader(target.resultJabatan);
      } else if (property === "resultProsbis") {
        target[property] = value;
        loadTableBody(target.resultProsbis);
      } else if (property === "resultRasciMapping") {
        target[property] = value;
        loadTableBody(target.resultProsbis);
      } else if (property === "idProsbis") {
        target[property] = value;
      } else {
        target[property] = value;
      }
      return true;
    },
  },
);

// async function getProsbisList() {
//   try {
//     const result = await $.ajax({
//       type: "GET",
//       url: `${url_api}/api/BusinessProcess`,
//     });
//     return result;
//   } catch (error) {
//     console.log("Error fetching Prosbis data from API");
//     $("#resultProsbis").html("Error fetching data from API");
//     throw error;
//   }
// }

// async function getJobTitleList() {
//   try {
//     const result = await $.ajax({
//       type: "GET",
//       url: `${url_api}/api/jobtitle`,
//     });
//     return result;
//   } catch (error) {
//     console.log("Error fetching Job Title data from API");
//     $("#resultJabatan").html("Error fetching data from API");
//     throw error;
//   }
// }

// async function getrasciMappingList() {
//   try {
//     const result = await $.ajax({
//       type: "GET",
//       url: `${url_api}/api/rascimapping`,
//     });
//     return result;
//   } catch (error) {
//     console.log("Error fetching Job Title data from API");
//     $("#resultJabatan").html("Error fetching data from API");
//     throw error;
//   }
// }

async function SearchMatrix(params) {
  try {
    const result = await $.ajax({
      type: "GET",
      url: `${url_api}/api/RasciMapping/searchBy?type=${params.type}&search=${params.search}`,
    });
    return result;
  } catch (error) {
    console.log("Error fetching Job Title data from API");
    $("#resultJabatan").html("Error fetching data from API");
    throw error;
  }
}

async function fetchDataMatrix(params) {
  try {
    const result = await $.ajax({
      type: "POST",
      url: `${url_api}/api/RasciMapping`,
      contentType: "application/json",
      data: JSON.stringify(params),
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
    const [dataMatrix] = await Promise.all([fetchDataMatrix()]);
    appState.resultJabatan = dataMatrix?.data.jobTitle;
    appState.resultProsbis = dataMatrix?.data.businessProcess;
    appState.resultRasciMapping = dataMatrix?.data.rasciMatrix;

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
