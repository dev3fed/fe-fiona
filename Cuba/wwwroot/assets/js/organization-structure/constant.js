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

const defaultNodeId = "10132406";
const directReportAttrIds =
  "#selectFunction, #FunctionSwitch, #selectDivision, #DivisionSwitch, #selectSubDivision, #SubDivisionSwitch, #selectDepartment, #DepartmentSwitch, #selectSection, #SectionSwitch";

const logData = {
  status: "create",
  initParams: {},
  currentParams: {},
  log: [],
};

const test1 = [
  {
    coordination: "",
    id_position_parent: "30263310",
    bc_1_layering: "L6",
    gl: "GL1",
    isMergeFormation: true,
    position: "Sr Secretary",
    hasChildren: false,
    bc_2_basket: false,
    bc_2_id: "10135489",
    id_position_atasan_langsung: "10135488",
    bc_1_id_org_unit: "10135489",
    assistant: false,
    bc_2_gl: "1",
    actionType: "Read",
    bc_2_org_unit_name: "Secretary",
    bc_2_id_position_parent: null,
    bc_1_position_parent: "SDM & Penunjang Bisnis",
    bc_2_pid: "10135488",
    bc_1_assistant: false,
    org_unit_name: "Secretary",
    bc_1_id: "10135489",
    bc_1_gl: "1",
    bc_1_flagMergeFormation: "A",
    basket: true,
    bc_1_jumlah_formasi: "1",
    bc_2_id_position: "30263311",
    bc_1_position: "Sr Secretary",
    bc_1_org_unit_name: "Secretary",
    bc_2_position_parent: "SDM & Penunjang Bisnis",
    layering: "L6",
    bc_2_actionType: "Read",
    bc_2_id_position_atasan_langsung: "10135488",
    jumlah_formasi: 1,
    bc_2_position: "Sr Secretary",
    bc_1_prl: "12-13",
    id_position: "30263311",
    id_org_unit: "10135489",
    bc_2_layering: "L7",
    bc_1_id_position_parent: null,
    tags: ["basket_2", "assistant"],
    project: false,
    bc_1_actionType: "Read",
    bc_2_jumlah_formasi: "1",
    id: "10135489",
    isNeck: true,
    bc_2_assistant: false,
    position_parent: "SDM & Penunjang Bisnis",
    bc_1_pid: "10135488",
    prl: "10-13",
    bc_2_prl: "10-11",
    bc_2_flagMergeFormation: "A",
    bc_1_basket: false,
    bc_1_id_position_atasan_langsung: "10135488",
    bc_1_id_position: "30263311",
    bc_2_id_org_unit: "10135489",
    pid: "10135488",
  },
  {
    basket: false,
    position_parent: "SDM & Penunjang Bisnis",
    actionType: "Read",
    prl: "23",
    project: false,
    isMergeFormation: false,
    tags: [],
    position: "VP Human Capital",
    coordination: "",
    isNeck: false,
    pid: "10135488",
    id_position_parent: "30263310",
    gl: "GL1",
    hasChildren: false,
    id_org_unit: "10135490",
    id_position: "30263312",
    jumlah_formasi: 44,
    org_unit_name: "Human Capital",
    id_position_atasan_langsung: "10135488",
    assistant: false,
    layering: "L2",
    id: "10135490",
  },
  {
    basket: false,
    position_parent: "SDM & Penunjang Bisnis",
    actionType: "Read",
    prl: "23",
    project: false,
    isMergeFormation: false,
    tags: [],
    position: "VP Procurement & Asset Management",
    coordination: "",
    isNeck: false,
    pid: "10135488",
    id_position_parent: "30263310",
    gl: "GL1",
    hasChildren: false,
    id_org_unit: "10135505",
    id_position: "30263348",
    jumlah_formasi: 44,
    org_unit_name: "Procurement & Asset Management",
    id_position_atasan_langsung: "10135488",
    assistant: false,
    layering: "L2",
    id: "10135505",
  },
  {
    basket: false,
    position_parent: "SDM & Penunjang Bisnis",
    actionType: "Read",
    prl: "22",
    project: false,
    isMergeFormation: false,
    tags: [],
    position: "VP IT",
    coordination: "",
    isNeck: false,
    pid: "10135488",
    id_position_parent: "30263310",
    gl: "GL1",
    hasChildren: false,
    id_org_unit: "10135534",
    id_position: "30263384",
    jumlah_formasi: 39,
    org_unit_name: "IT",
    id_position_atasan_langsung: "10135488",
    assistant: false,
    layering: "L2",
    id: "10135534",
  },
  {
    basket: false,
    position_parent: "PT Pertamina Patra Niaga",
    actionType: "Read",
    prl: "25",
    project: false,
    isMergeFormation: false,
    tags: [],
    position: "Direktur SDM & Penunjang Bisnis",
    coordination: "",
    isNeck: false,
    pid: "10132405",
    id_position_parent: "30258741",
    gl: "GL0",
    hasChildren: true,
    id_org_unit: "10135488",
    id_position: "30263310",
    jumlah_formasi: 129,
    org_unit_name: "SDM & Penunjang Bisnis",
    id_position_atasan_langsung: "10132405",
    assistant: false,
    layering: "L1",
    id: "10135488",
  },
];
