const selectedValue = $("#dataSource-competency").val();

const appState = new Proxy(
  {
    draftList: [],
    dataEditDraft: {},
    dataDetailDraft: {},
    deleteDraftCompetency: "",
    selectedType: "position",
    currentPageY: 1,
    currentPageX: 1,
    payloadJob: {
      dataSource: selectedValue,
      page: 1,
      pageSize: 15,
    },
    payloadCompetency: {
      dataSource: selectedValue,
      page: 1,
      pageSize: 10,
    },
    payloadDeleteActivity: {},
    payloadTblBehavior: {},
    payloadTblTechnical: {},
    jobInformation: {},
    payloadAddCompetency: [],
    detailProficiency: {},
    resultJob: [],
    resultCompetency: [],
    resultMapping: [],
    totalJob: 0,
    totalCompetency: 0,
    // remove below
    storageDataCompetency: [],
    storageDataMapping: [],
  },
  {
    set(target, property, value) {
      if (target[property] !== value) {
        // Set the new value
        target[property] = value;
        if (property === "dataDetailDraft") {
          detailDraft();
        }
      }
      return true;
    },
  },
);
function setState(key, value) {
  appState[key] = value;
}

function getState(key) {
  return appState[key];
}
window.setState = setState;
window.getState = getState;
