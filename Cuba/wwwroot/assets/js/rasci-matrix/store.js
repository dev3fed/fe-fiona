let selectedValue = $("#dataSource-rasci").val();
let selectedOption = $(this).find(":selected");
let selectedDraftSo = selectedOption.attr("data-draftso");
const appState = new Proxy(
  {
    storageJabatan: [],
    storageProsbis: [],
    allDataJabatan: [],
    resultJabatan: [],
    resultProsbis: [],
    allDataProsbis: [],
    idProsbis: [],
    resetIdProsbis: [],
    resultRasciMapping: [],
    isSearchMatrix: false,
    idSearchProsbis: "",
    prosbisLevel: [],
    filterJobList: [],
    checkedParentId: [],
    selectedLevel: 0,
    //start filter rasci matrix
    rasciNotationFilter: [],
    levelFilter: [],
    levelSeries: [],
    visibleJobs: [],
    selectedJobId: [],
    selectedPosition: [],
    disabledJobId: [],
    dataDeleteProsbis: {},
    dataDetailProsbis: {},
    editRasciNotation: {},
    isShowRasciJob: false,
    draftRasciId: null,
    draftSoId: null,
    defaultIndexNumber: [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
      "13",
      "14",
      "15",
      "16",
      "17",
      "18",
      "19",
      "20",
    ],
    actionType: "BP_THEN_JOB",
    totalProsbis: 0,
    totalJob: 0,
    expandNumber: [],
    indexNumberForPosition: [],
    pageLevel1: 1,
    pageLevel2: 1,
    pageLevel3: 1,
    pageLevel4: 1,
    pageLevel5: 1,
    pageLevel6: 1,
    pageLevel7: 1,
    pageLevel8: 1,
    totalJobLevel1: 0,
    totalJobLevel2: 0,
    totalJobLevel3: 0,
    totalJobLevel4: 0,
    totalJobLevel5: 0,
    totalJobLevel6: 0,
    totalJobLevel7: 0,
    totalJobLevel8: 0,
    payloadProsbis: {
      draftRasciId: selectedValue === "master" ? null : selectedValue,
      level: [],
      row: 1,
      rowSize: 15,
      indexNumber: [],
    },
    payloadPosition: {
      draftRasciId: selectedValue === "master" ? null : selectedValue,
      draftSoId: null,
      unitCode: [],
      prlOrg: [],
      level: [],
      rasciNotation: [],
      col: 1,
      colSize: 10,
    },
    storageDataPosition: [],
    // itemsPerPageY: 20,
    currentPageY: 1,
    // itemsPerPageX: 20,
    currentPageX: 1,
    detailJob: {},
    listSelectedProsbisref: [],
    dataChangeNotasi: {
      busProsMapped: [],
    },
    payloadDraftList: {
      Page: 1,
      PageSize: 5,
    },
    payloadDetailDraftPage: {
      Page: 1,
      PageSize: 5,
    },
    //end filter rasci matrix
    dataDetailDraft: {},
    editDrafProsbis: {
      rasciNotation: [],
    },
    deleteDraftProsbis: "",
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
    insertProsbis: {
      parentId: null,
      jobMapped: [],
    },
    approvalData: [
      {
        requestId: "Req/RM/01122024/001",
        draftName: "Usulan Perubahan Fungsi Marketing",
        organizationSource: "Usulan Perubahan Fungsi Marketing",
        status: "On Review",
      },
    ],
    logHistoryData: [
      {
        no: 8,
        dateTime: "",
        user: "Superadmin",
        draftName: "Usulan Perubahan Fungsi Marketing",
        detail: "Create draft Pembuatan Bisnis Proses Baru",
      },
      {
        no: 7,
        dateTime: "",
        user: "Superadmin",
        draftName: "Usulan Perubahan Fungsi Marketing",
        detail:
          "Add/Edit RASCI notation for Manager B2C Brand & Loyalty Program (Business process: 2.1.5 Pengelolaan brand, RASCI notation before: -, RASCI notation after: R) reference from Manager B2C Loyalty & Marketing Program.",
      },
      {
        no: 6,
        dateTime: "",
        user: "Superadmin",
        draftName: "Usulan Perubahan Fungsi Marketing",
        detail:
          "Add/Edit RASCI notation for Manager B2C Brand & Loyalty Program (Business process: 2.1.5.2 Melakukan brand positioning, RASCI notation before: -, RASCI notation after: A) reference from Manager B2C Loyalty & Marketing Program.",
      },
      {
        no: 5,
        dateTime: "",
        user: "Superadmin",
        draftName: "Usulan Perubahan Fungsi Marketing",
        detail:
          "Add/Edit RASCI notation for Manager B2C Brand & Loyalty Program (Business process: 2.1.5.3 Mengelola brand identity, RASCI notation before: -, RASCI notation after: A) reference from Manager B2C Loyalty & Marketing Program.",
      },
      {
        no: 4,
        dateTime: "",
        user: "Superadmin",
        draftName: "Usulan Perubahan Fungsi Marketing",
        detail:
          "Edit RASCI notation for Manager B2C Brand & Loyalty Program (Business process: 2.1.5 Pengelolaan brand, RASCI notation before: R, RASCI notation after: A)",
      },
      {
        no: 3,
        dateTime: "",
        user: "Superadmin",
        draftName: "Usulan Perubahan Fungsi Marketing",
        detail:
          "Edit RASCI notation for Manager B2C Brand & Loyalty Program (Business process: 2.1.5.2 Melakukan brand positioning, RASCI notation before: A, RASCI notation after: A)",
      },
      {
        no: 2,
        dateTime: "",
        user: "Superadmin",
        draftName: "Usulan Perubahan Fungsi Marketing",
        detail:
          "Edit RASCI notation for Manager B2C Brand & Loyalty Program (Business process: 2.1.5 Pengelolaan brand, RASCI notation before: R, RASCI notation after: A)",
      },
      {
        no: 1,
        dateTime: "",
        user: "Superadmin",
        draftName: "Usulan Perubahan Fungsi Marketing",
        detail: "Submit to Approval draft Pembuatan Bisnis Proses Baru",
      },
    ],
  },
  {
    set(target, property, value) {
      if (target[property] !== value) {
        // Set the new value
        target[property] = value;
        updateSelect2ByProsbis();
        updateSelect2ByJob();
        formValidation();
        formValidationNotation();
        if (property === "dataDetailDraft") {
          detailDraft();
        } else if (property === "editDrafProsbis") {
          updateSelectEditProsbis();
        } else if (property === "checkedParentId") {
          dataListJobChecked();
        }
      }
      return true;
    },
  },
);
function setState(key, value) {
  appState[key] = value;
}

// Fungsi untuk mendapatkan nilai state saat ini
function getState(key) {
  return appState[key];
}
window.setState = setState;
window.getState = getState;
