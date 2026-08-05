const url = {
  baseUrl: url_api,
  "api-organization": "api/organization-structure",
  "api-export-organization": "api/ExportOrganization",
};
const token = localStorage.getItem("token");
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const endPoint = "api/MasterData";
const urlParams = new URLSearchParams(window.location.search);
const lastPath = window.location.pathname.split("/").pop();
const organizationAttribute = {
  orgUnitId: null,
  orgUnitName: null,
};
const actionBack = {
  button: "Back",
  className: "btn-outline-primary",
  callback: function () {
    hideModal(`modalConfirm`);
  },
};
const statusHelper = {
  formPositionAsCreated: true,
};
const statusApproval = {
  1: "Submmited",
  2: "Approved",
  3: "Rejected",
  4: "Finalized",
};
const statusApprovalClass = {
  1: "label-info-custom",
  2: "label-success-custom",
  3: "label-info-custom",
  4: "label-primary-custom",
};

const prl = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28];
const prlRange = ["8-9", "10-11", "12-13", "14-15", "16-18", "19-21", "22-24", "25-26", "27-28"];

// form position data
const formPositionData = {
  id: null,
  "org-unit": null,
  "position-name": null,
  "is-basket": null,
  "prl-org": null,
  "prl-org-to": null,
  formation: null,
  "org-unit-parent": null,
  "direct-report": null,
  function: null,
  division: null,
  "sub-division": null,
  department: null,
  section: null,
  "career-type": null,
  "career-level": null,
  "abbrv-position": null,
  "org-unit-name": null,
  kbo: null,
  "personal-area": null,
  "personal-sub-area": null,
  "cost-center": null,
  "neck-function": null,
  "is-project": null,
  "is-coordination": null,
  "coordination-with": null,
  "main-skill-group": null,
  "main-sub-skill-group": null,
  "second-skill-group": null,
  "second-sub-skill-group": null,
  "third-skill-group": null,
  "third-sub-skill-group": null,
  "sub-position": [],
};

if (!localStorage.getItem("subJobPos")) {
  localStorage.setItem("subJobPos", JSON.stringify([]));
}
const subJobPos = JSON.parse(localStorage.getItem("subJobPos"));

const payloadPosition = {
  draftId: null,
  positionId: null,
  positionName: "",
  isBasket: "",
  prlOrg: null,
  prlOrgTo: null,
  orgUnitParentId: null,
  orgUnitParent: "",
  directReportId: null,
  directReport: "",
  function: "",
  division: "",
  subDivision: "",
  department: "",
  section: "",
  careerLevel: "",
  careerType: "",
  abbrvPosition: "",
  orgUnitId: null,
  orgUnitName: "",
  kbo: "",
  costCenterPosisi: "",
  costCenterDesc: "",
  personalAreaCode: "",
  personalAreaName: "",
  personalSubareaCode: "",
  personalSubareaName: "",
  formation: null,
  neckFunction: false,
  isProject: false,
  isCoordination: false,
  coordinationWith: "",
  mainSkillGroup: "",
  mainSubSkillGroup: "",
  secondSkillGroup: "",
  secondSubSkillGroup: "",
  thirdSkillGroup: "",
  thirdSubSkillGroup: "",
  skNumber: "",
  incumbent: {
    employeeId: null,
    employeeName: "",
    prlPlanComp: null,
  },
  listSubPosition: [],
};

// wait 1 second
// let initializeLocalStorage = (key, defaultValue) => {
//   let value = localStorage.getItem(key);
//   if (!value) {
//     localStorage.setItem(key, JSON.stringify(defaultValue));
//     return defaultValue;
//   }
//   return JSON.parse(value);
// };

// let lsListDraft = initializeLocalStorage("listDraft", listDraft);
// let lsListOrgNode = initializeLocalStorage("listOrgNode", myData);
// let lsListPosition = initializeLocalStorage("listPosition", positionDetail);
// let lsListDetailDraft = initializeLocalStorage("listDraftDetail", []);
// let lsListDraftOrgNode = initializeLocalStorage("listDraftOrgNode", []);
// let lsListApproval = initializeLocalStorage("listApproval", []);

const storeData = {
  listDraft: [],
  listOrgNode: [],
};

// get draft detail
const draftDetail = [
  {
    id: 1,
    "draft-name": "Draft Name",
    "created-by": "Superadmin",
    "created-date": "05/05/2021",
    "updated-date": "05/05/2021",
    "updated-by": "Superadmin",
  },
];

// get list draft detail
const listDraftDetail = [
  {
    id: 1,
    "activity-type": "create new position",
    "id-org-unit": "B0001",
    "id-pos": "Q0001",
    "job-title": "VP Human Capital",
    prl: "23",
    "direct-report": "Direktur SDM",
  },
];

// get log list
const listLog = [
  {
    id: 1,
    "date-time": "05/05/2021 10:00",
    "user-name": "Yani",
    "draft-name": "Draft Name",
    detail: "Edit Org Unit Name from Enhancement to Enhancement for Manager Enhancement",
  },
];

// delete subordinate list
const deleteSubordinateList = [
  { id: 1, "subordinate-name": "Subordinate Name 1" },
  {
    id: 2,
    "subordinate-name": "Subordinate Name 2",
  },
  {
    id: 3,
    "subordinate-name": "Subordinate Name 3",
  },
];

// ---------------
// const div
// ---------------

const formPositionParam = {
  userId: "system",
  draftId: "",
  unit: {
    unitCode: null,
    unitName: "",
    layer: 1,
    prlPlan: 8,
    prlOrgFrom: 8,
    prlOrgTo: null, // null if not exist
    formation: 1,
    isNeckFunction: false,
    isProject: false,
    isCoordinate: false,
    isBasket: false,
    kbo: "",
    costCenter: "",
    positionName: "",
  },
  careerType: {
    careerTypeCode: "",
    careerTypeName: "",
  },
  careerLevel: {
    careerLevelCode: "",
    careerLevelName: "",
  },
  function: {
    functionCode: "",
    functionName: "",
    isNew: false,
  },
  division: {
    divisionCode: "",
    divisionName: "",
    isNew: false,
  },
  subDivision: {
    subDivisionCode: "",
    subDivisionName: "",
    isNew: false,
  },
  department: {
    departmentCode: "",
    departmentName: "",
    isNew: false,
  },
  section: {
    sectionCode: "",
    sectionName: "",
    isNew: false,
  },
  personnelArea: {
    personnelAreaCode: "",
    personnelAreaName: "",
    isNew: false,
  },
  personnelSubArea: {
    personnelSubAreaCode: "",
    personnelSubAreaName: "",
    isNew: false,
  },
  directReportTo: {
    jobPositionCode: "",
    jobPositionName: "",
  },
  unitParent: {
    unitCode: "",
    unitName: "",
  },
  abbrivation: {
    careerJobName: "",
    jobAbbrivationName: "",
    isNew: false,
  },
  coordinateWith: {
    unitCode: "",
    unitName: "",
  },
  skillGroups: [
    {
      skillGroupCode: "",
      skillGroupName: "",
      subSkillGroupCode: "",
      subSkillGroupName: "",
      isNew: false,
      subSkillGroupSequence: 1,
    },
  ],
  subOrdinates: [
    {
      unitCode: null,
      unitName: null,
      unitParentCode: null,
      unitParentName: null,
      jobPositionName: null,
      layer: 1,
      prlFrom: 12,
      prlTo: 15,
      prlPlan: 1,
      formation: 1,
      formationBasket: [],
      careerLevel: {
        careerLevelCode: "",
        careerLevelName: "",
      },
      careerType: {
        careerTypeCode: "",
        careerTypeName: "",
      },
      abbrivation: {
        careerJobName: null,
        jobAbbrivationName: "",
        jobAbbrivationCode: "",
        isNew: false,
      },
    },
  ],
};

const subOrdinates = {
  unitCode: null,
  unitName: null,
  unitParentCode: null,
  unitParentName: null,
  jobPositionName: null,
  layer: 1,
  prlFrom: 8,
  prlTo: 9,
  prlPlan: 1,
  formation: 1,
  careerLevel: {
    careerLevelCode: "",
    careerLevelName: "",
  },
  careerType: {
    careerTypeCode: "",
    careerTypeName: "",
  },
  abbrivation: {
    careerJobName: null,
    jobAbbrivationName: "",
    isNew: false,
  },
};

// Chart Loading HTML Template
const CHART_LOADING_HTML = `
  <div id="chart-loading-overlay" style="
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background-color: rgba(248, 249, 250, 0.95);
    z-index: 2;
    border-radius: 4px;
  ">
    <div style="
      border: 4px solid #e9ecef;
      border-top: 4px solid #007bff;
      border-radius: 50%;
      width: 60px;
      height: 60px;
      animation: chart-spin 1.2s linear infinite;
    "></div>
    <p style="
      margin-top: 20px;
      color: #495057;
      font-size: 16px;
      font-weight: 500;
      text-align: center;
      margin-bottom: 8px;
    ">Loading organization chart...</p>
    <p style="
      margin: 0;
      color: #6c757d;
      font-size: 14px;
      text-align: center;
    ">Please wait while we prepare your data</p>
  </div>
  <style>
    @keyframes chart-spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  </style>
`;

const defaultNodeId = "10132405";
// const defaultMasterId = "1";
const defaultMasterId = "00000000-0000-0000-0000-000000000001";
const directReportAttrIds =
  "#selectFunction, #FunctionSwitch, #selectDivision, #DivisionSwitch, #selectSubDivision, #SubDivisionSwitch, #selectDepartment, #DepartmentSwitch, #selectSection, #SectionSwitch";

const logData = {
  status: "create",
  initParams: {},
  currentParams: {},
  log: [],
};

const test = {
  status: 200,
  message: "Success",
  data: [
    {
      id_position_atasan_langsung: "10132684",
      jumlah_formasi: "5",
      actionType: "Read",
      gl: "",
      position: "Ast Manager Fuel Channel Administration \u0026 Data Management",
      assistant: false,
      pid: "10132684",
      project: false,
      basket: false,
      layering: "L4",
      coordination: true,
      id_position_parent: "30259248",
      position_parent: "Retail Sales Sumbagut",
      isMergeFormation: true,
      id: "10164934",
      isNeck: false,
      id_org_unit: "10164934",
      hasChildren: false,
      org_unit_name: "Fuel Channel Administration \u0026 Data Management",
      tags: [],
      prl: "17",
      id_position: "30316916",
      coordinationWith: {},
    },
    {
      bc_1_flagMergeFormation: "A",
      pid: "10164934",
      prl: "11-14",
      bc_4_id_position: "30316918",
      bc_4_pid: "10164934",
      isNeck: false,
      bc_2_gl: "0",
      bc_2_id_position_atasan_langsung: "10164934",
      bc_1_prl: "14",
      bc_1_id_position: "30316917",
      id: "10164935",
      coordination: true,
      gl: "",
      bc_2_flagMergeFormation: "A",
      bc_2_actionType: "Read",
      bc_4_actionType: "Read",
      bc_4_prl: "11",
      bc_3_id_position_parent: "30316916",
      bc_1_gl: "0",
      bc_3_flagMergeFormation: "B",
      isMergeFormation: true,
      bc_4_jumlah_formasi: "1",
      bc_2_position_parent: "Fuel Channel Administration \u0026 Data Management",
      bc_3_id_position_atasan_langsung: "10164934",
      id_position_atasan_langsung: "10164934",
      bc_2_basket: false,
      bc_1_id_position_parent: "30316916",
      bc_1_assistant: false,
      bc_2_assistant: false,
      bc_1_pid: "10164934",
      bc_3_actionType: "Read",
      bc_2_id_org_unit: "10164935",
      bc_4_assistant: false,
      bc_3_position_parent: "Fuel Channel Administration \u0026 Data Management",
      bc_3_org_unit_name: "Fuel Sales Administration \u0026 Data Statistics",
      bc_4_id_position_parent: "30316916",
      bc_3_idx: "3",
      bc_3_id_org_unit: "10164935",
      bc_3_pid: "10164934",
      id_position_parent: "30316916",
      bc_4_position: "Jr Assistant II Fuel Sales Administration \u0026 Data Statistics",
      bc_2_idx: "2",
      bc_4_org_unit_name: "Fuel Sales Administration \u0026 Data Statistics",
      position: "Officer I Fuel Sales Administration \u0026 Data Statistics",
      bc_1_jumlah_formasi: "1",
      bc_1_layering: "L5",
      bc_1_id: "1",
      bc_1_basket: false,
      bc_2_pid: "10164934",
      bc_4_flagMergeFormation: "B",
      bc_2_org_unit_name: "Fuel Sales Administration \u0026 Data Statistics",
      bc_4_id: "4",
      layering: "L6",
      bc_4_id_org_unit: "10164935",
      bc_2_jumlah_formasi: "1",
      bc_2_position: "Jr Officer I-II Fuel Sales Administration \u0026 Data Statistics",
      bc_3_id_position: "30316918",
      bc_3_gl: "0",
      project: false,
      bc_3_layering: "L6",
      bc_1_actionType: "Read",
      coordinationWith: {},
      bc_3_id: "3",
      jumlah_formasi: "1",
      bc_2_id: "2",
      bc_1_idx: "1",
      bc_2_id_position: "30316917",
      actionType: "Read",
      bc_3_assistant: false,
      bc_1_org_unit_name: "Fuel Sales Administration \u0026 Data Statistics",
      id_org_unit: "10164935",
      bc_3_prl: "12",
      assistant: false,
      bc_1_id_position_atasan_langsung: "10164934",
      bc_2_layering: "L5",
      bc_1_position_parent: "Fuel Channel Administration \u0026 Data Management",
      bc_4_basket: false,
      position_parent: "Fuel Channel Administration \u0026 Data Management",
      id_position: "30316918",
      bc_4_layering: "L6",
      org_unit_name: "Fuel Sales Administration \u0026 Data Statistics",
      bc_3_jumlah_formasi: "1",
      bc_3_basket: false,
      bc_2_id_position_parent: "30316916",
      bc_4_idx: "4",
      bc_3_position: "Jr Assistant II Fuel Sales Administration \u0026 Data Statistics",
      bc_1_position: "Officer I Fuel Sales Administration \u0026 Data Statistics",
      basket: true,
      tags: ["basket_4"],
      bc_2_prl: "12-13",
      bc_4_id_position_atasan_langsung: "10164934",
      bc_4_gl: "0",
      hasChildren: false,
      bc_4_position_parent: "Fuel Channel Administration \u0026 Data Management",
      bc_1_id_org_unit: "10164935",
    },
    {
      bc_1_flagMergeFormation: "A",
      pid: "10164934",
      prl: "12-15",
      isNeck: false,
      bc_2_gl: "0",
      bc_2_id_position_atasan_langsung: "10164934",
      bc_1_prl: "14-15",
      bc_1_id_position: "30316919",
      id: "10164936",
      coordination: true,
      gl: "",
      bc_2_flagMergeFormation: "A",
      bc_2_actionType: "Read",
      bc_3_id_position_parent: "30316916",
      bc_1_gl: "0",
      bc_3_flagMergeFormation: "B",
      isMergeFormation: true,
      bc_2_position_parent: "Fuel Channel Administration \u0026 Data Management",
      bc_3_id_position_atasan_langsung: "10164934",
      id_position_atasan_langsung: "10164934",
      bc_2_basket: false,
      bc_1_id_position_parent: "30316916",
      bc_1_assistant: false,
      bc_2_assistant: false,
      bc_1_pid: "10164934",
      bc_3_actionType: "Read",
      bc_2_id_org_unit: "10164936",
      bc_3_position_parent: "Fuel Channel Administration \u0026 Data Management",
      bc_3_org_unit_name: "Fuel Channel Administration",
      bc_3_idx: "3",
      bc_3_id_org_unit: "10164936",
      bc_3_pid: "10164934",
      id_position_parent: "30316916",
      bc_2_idx: "2",
      position: "Officer II Fuel Channel Administration",
      bc_1_jumlah_formasi: "1",
      bc_1_layering: "L5",
      bc_1_id: "1",
      bc_1_basket: false,
      bc_2_pid: "10164934",
      bc_2_org_unit_name: "Fuel Channel Administration",
      layering: "L6",
      bc_2_jumlah_formasi: "1",
      bc_2_position: "Officer II Fuel Channel Administration",
      bc_3_id_position: "30316920",
      bc_3_gl: "0",
      project: false,
      bc_3_layering: "L6",
      bc_1_actionType: "Read",
      coordinationWith: {},
      bc_3_id: "3",
      jumlah_formasi: "1",
      bc_2_id: "2",
      bc_1_idx: "1",
      bc_2_id_position: "30316919",
      actionType: "Read",
      bc_3_assistant: false,
      bc_1_org_unit_name: "Fuel Channel Administration",
      id_org_unit: "10164936",
      bc_3_prl: "12-13",
      assistant: false,
      bc_1_id_position_atasan_langsung: "10164934",
      bc_2_layering: "L5",
      bc_1_position_parent: "Fuel Channel Administration \u0026 Data Management",
      position_parent: "Fuel Channel Administration \u0026 Data Management",
      id_position: "30316920",
      org_unit_name: "Fuel Channel Administration",
      bc_3_jumlah_formasi: "1",
      bc_3_basket: false,
      bc_2_id_position_parent: "30316916",
      bc_3_position: "Jr Officer I-II Fuel Channel Administration",
      bc_1_position: "Officer I-II Fuel Channel Administration",
      basket: true,
      tags: ["basket_3"],
      bc_2_prl: "13",
      hasChildren: false,
      bc_1_id_org_unit: "10164936",
    },
  ],
};
