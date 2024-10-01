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
    selectedLevel: 0,
    insertProsbis: {
      parentId: null,
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
  try {
    const result = await $.ajax({
      url: `${url_api}/api/RasciMapping/searchBy?type=${params.type}&search=${params.search}`,
      type: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return result;
  } catch (error) {
    console.log("Error fetching Job Title data from API");
    $("#resultJabatan").html("Error fetching data from API");
    throw error;
  }
}
// /Utilities/selection?Page=1&Type=level&Level=2
async function fetchDataMatrix(params) {
  try {
    const result = await $.ajax({
      url: `${url_api}/api/RasciMapping`,
      type: "POST",
      contentType: "application/json",
      headers: {
        Authorization: "Bearer " + token,
      },
      data: JSON.stringify(params),
    });
    return result;
  } catch (error) {
    console.log("Error fetching Job Title data from API");
    $("#resultJabatan").html("Error fetching data from API");
    throw error;
  }
}

async function fetchSelectLevel() {
  try {
    const result = await $.ajax({
      url: `${url_api}/api/Utilities/selection?Page=1&Type=level`,
      type: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return result;
  } catch (error) {
    console.log("Error fetching Job Title data from API");
    throw error;
  }
}

async function submitDraftProsbis(payload) {
  // token
  try {
    const result = await $.ajax({
      type: "POST",
      url: `${url_api}/api/BusinessProcess`,
      contentType: "application/json",
      headers: {
        Authorization: "Bearer " + token,
      },
      data: JSON.stringify(payload),
    });
    return result;
  } catch (error) {
    console.log("Error fetching Job Title data from API");
    throw error;
  }
}

async function fetchData() {
  try {
    const [dataMatrix, prosbisLvl] = await Promise.all([fetchDataMatrix(), fetchSelectLevel()]);
    appState.resultJabatan = dataMatrix?.data.jobTitle;
    appState.resultProsbis = dataMatrix?.data.businessProcess;
    appState.resultRasciMapping = dataMatrix?.data.rasciMatrix;
    appState.prosbisLevel = prosbisLvl?.data.result;

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
