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
      coordination: false,
      coordinationWith: {},
      actionType: "Read",
      id_org_unit: "10132405",
      id_position: "30258741",
      hasChildren: false,
      id: "10132405",
      org_unit_name: "PT Pertamina Patra Niaga",
      prl: "28",
      id_position_parent: "30258741",
      id_position_atasan_langsung: null,
      isMergeFormation: false,
      gl: "GL0D",
      basket: false,
      assistant: false,
      isNeck: false,
      tags: [],
      position: "Direktur Utama",
      project: false,
      pid: null,
      position_parent: "PT Pertamina Patra Niaga",
      layering: "L0",
      jumlah_formasi: 4796,
    },
    {
      coordination: false,
      coordinationWith: {},
      actionType: "Read",
      id_org_unit: "10132408",
      id_position: "30258744",
      hasChildren: false,
      id: "10132408",
      org_unit_name: "Perencanaan & Pengembangan Bisnis",
      prl: "26",
      id_position_parent: "30258741",
      id_position_atasan_langsung: "10132405",
      isMergeFormation: false,
      gl: "GL0",
      basket: false,
      assistant: false,
      isNeck: false,
      tags: [],
      position: "Direktur Perencanaan & Pengembangan Bisnis",
      project: false,
      pid: "10132405",
      position_parent: "PT Pertamina Patra Niaga",
      layering: "L1",
      jumlah_formasi: 78,
    },
    {
      coordination: false,
      coordinationWith: {},
      actionType: "Read",
      id_org_unit: "10132470",
      id_position: "30258852",
      hasChildren: false,
      id: "10132470",
      org_unit_name: "Pemasaran Pusat & Niaga",
      prl: "26",
      id_position_parent: "30258741",
      id_position_atasan_langsung: "10132405",
      isMergeFormation: false,
      gl: "GL0",
      basket: false,
      assistant: false,
      isNeck: false,
      tags: [],
      position: "Direktur Pemasaran Pusat & Niaga",
      project: false,
      pid: "10132405",
      position_parent: "PT Pertamina Patra Niaga",
      layering: "L1",
      jumlah_formasi: 229,
    },
    {
      coordination: false,
      coordinationWith: {},
      actionType: "Read",
      id_org_unit: "10132544",
      id_position: "30259031",
      hasChildren: false,
      id: "10132544",
      org_unit_name: "Pemasaran Regional",
      prl: "26",
      id_position_parent: "30258741",
      id_position_atasan_langsung: "10132405",
      isMergeFormation: false,
      gl: "GL0",
      basket: false,
      assistant: false,
      isNeck: false,
      tags: [],
      position: "Direktur Pemasaran Regional",
      project: false,
      pid: "10132405",
      position_parent: "PT Pertamina Patra Niaga",
      layering: "L1",
      jumlah_formasi: 1168,
    },
    {
      coordination: false,
      coordinationWith: {},
      actionType: "Read",
      id_org_unit: "10135292",
      id_position: "30262953",
      hasChildren: false,
      id: "10135292",
      org_unit_name: "Rekayasa & Infrastruktur Darat",
      prl: "26",
      id_position_parent: "30258741",
      id_position_atasan_langsung: "10132405",
      isMergeFormation: false,
      gl: "GL0",
      basket: false,
      assistant: false,
      isNeck: false,
      tags: [],
      position: "Direktur Rekayasa & Infrastruktur Darat",
      project: false,
      pid: "10132405",
      position_parent: "PT Pertamina Patra Niaga",
      layering: "L1",
      jumlah_formasi: 2899,
    },
    {
      coordination: false,
      coordinationWith: {},
      actionType: "Read",
      id_org_unit: "10135447",
      id_position: "30263205",
      hasChildren: false,
      id: "10135447",
      org_unit_name: "Keuangan",
      prl: "25",
      id_position_parent: "30258741",
      id_position_atasan_langsung: "10132405",
      isMergeFormation: false,
      gl: "GL0",
      basket: false,
      assistant: false,
      isNeck: false,
      tags: [],
      position: "Direktur Keuangan",
      project: false,
      pid: "10132405",
      position_parent: "PT Pertamina Patra Niaga",
      layering: "L1",
      jumlah_formasi: 104,
    },
    {
      coordination: false,
      coordinationWith: {},
      actionType: "Read",
      id_org_unit: "10135488",
      id_position: "30263310",
      hasChildren: false,
      id: "10135488",
      org_unit_name: "SDM & Penunjang Bisnis",
      prl: "25",
      id_position_parent: "30258741",
      id_position_atasan_langsung: "10132405",
      isMergeFormation: false,
      gl: "GL0",
      basket: false,
      assistant: false,
      isNeck: false,
      tags: [],
      position: "Direktur SDM & Penunjang Bisnis",
      project: false,
      pid: "10132405",
      position_parent: "PT Pertamina Patra Niaga",
      layering: "L1",
      jumlah_formasi: 129,
    },
    {
      bc_1_idx: "1",
      bc_2_layering: "L6",
      bc_1_layering: "L5",
      bc_2_basket: false,
      hasChildren: false,
      bc_1_org_unit_name: "Executive Secretary",
      actionType: "Read",
      bc_1_prl: "14",
      bc_2_jumlah_formasi: "1",
      project: false,
      bc_2_idx: "2",
      coordinationWith: {},
      bc_1_gl: "1",
      prl: "12-14",
      bc_2_prl: "12-13",
      bc_2_id_position: "30258742",
      bc_1_id_position_atasan_langsung: "10132405",
      basket: true,
      bc_2_gl: "1",
      bc_2_org_unit_name: "Executive Secretary",
      bc_1_id: "10132406",
      bc_2_pid: "10132405",
      bc_2_id_org_unit: "10132406",
      bc_1_assistant: false,
      bc_1_id_position: "30258742",
      bc_1_flagMergeFormation: "A",
      bc_2_id_position_atasan_langsung: "10132405",
      bc_2_id: "10132406",
      id_position: "30258742",
      coordination: false,
      bc_1_position: "Sr Executive Secretary",
      layering: "L5",
      bc_2_actionType: "Read",
      bc_1_actionType: "Read",
      bc_1_jumlah_formasi: "1",
      bc_2_position: "Sr Secretary",
      org_unit_name: "Executive Secretary",
      bc_2_id_position_parent: null,
      id_position_parent: "30258741",
      isMergeFormation: true,
      pid: "10132405",
      tags: ["basket_2", "assistant"],
      position_parent: "PT Pertamina Patra Niaga",
      bc_2_position_parent: "PT Pertamina Patra Niaga",
      bc_2_assistant: false,
      id: "10132406",
      bc_1_id_org_unit: "10132406",
      bc_1_pid: "10132405",
      bc_1_basket: false,
      gl: "GL1",
      id_position_atasan_langsung: "10132405",
      position: "Executive Secretary",
      bc_1_position_parent: "PT Pertamina Patra Niaga",
      id_org_unit: "10132406",
      jumlah_formasi: 1,
      bc_2_flagMergeFormation: "A",
      assistant: false,
      bc_1_id_position_parent: null,
      isNeck: true,
    },
    {
      bc_1_idx: "1",
      bc_2_layering: "L5",
      bc_1_layering: "L4",
      bc_2_basket: false,
      hasChildren: false,
      bc_1_org_unit_name: "Assistant to Director",
      actionType: "Read",
      bc_1_prl: "16-18",
      bc_2_jumlah_formasi: "1",
      project: false,
      bc_2_idx: "2",
      coordinationWith: {},
      bc_1_gl: "1",
      prl: "14-18",
      bc_2_prl: "14-15",
      bc_2_id_position: "30258743",
      bc_1_id_position_atasan_langsung: "10132405",
      basket: true,
      bc_2_gl: "1",
      bc_2_org_unit_name: "Assistant to Director",
      bc_1_id: "10132407",
      bc_2_pid: "10132405",
      bc_2_id_org_unit: "10132407",
      bc_1_assistant: false,
      bc_1_id_position: "30258743",
      bc_1_flagMergeFormation: "A",
      bc_2_id_position_atasan_langsung: "10132405",
      bc_2_id: "10132407",
      id_position: "30258743",
      coordination: false,
      bc_1_position: "Assistant to Director",
      layering: "L5",
      bc_2_actionType: "Read",
      bc_1_actionType: "Read",
      bc_1_jumlah_formasi: "1",
      bc_2_position: "Assistant to Director ",
      org_unit_name: "Assistant to Director",
      bc_2_id_position_parent: null,
      id_position_parent: "30258741",
      isMergeFormation: true,
      pid: "10132405",
      tags: ["basket_2", "assistant"],
      position_parent: "PT Pertamina Patra Niaga",
      bc_2_position_parent: "PT Pertamina Patra Niaga",
      bc_2_assistant: false,
      id: "10132407",
      bc_1_id_org_unit: "10132407",
      bc_1_pid: "10132405",
      bc_1_basket: false,
      gl: "GL1",
      id_position_atasan_langsung: "10132405",
      position: "Assistant to Director",
      bc_1_position_parent: "PT Pertamina Patra Niaga",
      id_org_unit: "10132407",
      jumlah_formasi: 1,
      bc_2_flagMergeFormation: "A",
      assistant: false,
      bc_1_id_position_parent: null,
      isNeck: true,
    },
    {
      coordination: false,
      coordinationWith: {},
      actionType: "Read",
      id_org_unit: "10135559",
      id_position: "30263416",
      hasChildren: false,
      id: "10135559",
      org_unit_name: "Legal Counsel",
      prl: "23",
      id_position_parent: "30258741",
      id_position_atasan_langsung: "10132405",
      isMergeFormation: false,
      gl: "GL1",
      basket: false,
      assistant: false,
      isNeck: true,
      tags: ["assistant"],
      position: "VP Legal Counsel",
      project: false,
      pid: "10132405",
      position_parent: "PT Pertamina Patra Niaga",
      layering: "L2",
      jumlah_formasi: 29,
    },
    {
      coordination: false,
      coordinationWith: {},
      actionType: "Read",
      id_org_unit: "10135589",
      id_position: "30263466",
      hasChildren: false,
      id: "10135589",
      org_unit_name: "Audit Executive",
      prl: "23",
      id_position_parent: "30258741",
      id_position_atasan_langsung: "10132405",
      isMergeFormation: false,
      gl: "GL1",
      basket: false,
      assistant: false,
      isNeck: true,
      tags: ["assistant"],
      position: "Chief Audit Executive",
      project: false,
      pid: "10132405",
      position_parent: "PT Pertamina Patra Niaga",
      layering: "L2",
      jumlah_formasi: 52,
    },
    {
      coordination: false,
      coordinationWith: {},
      actionType: "Read",
      id_org_unit: "10135628",
      id_position: "30263518",
      hasChildren: false,
      id: "10135628",
      org_unit_name: "HSSE",
      prl: "23",
      id_position_parent: "30258741",
      id_position_atasan_langsung: "10132405",
      isMergeFormation: false,
      gl: "GL1",
      basket: false,
      assistant: false,
      isNeck: true,
      tags: ["assistant"],
      position: "VP HSSE",
      project: false,
      pid: "10132405",
      position_parent: "PT Pertamina Patra Niaga",
      layering: "L2",
      jumlah_formasi: 34,
    },
    {
      bc_1_idx: "1",
      bc_2_layering: "L3",
      bc_1_layering: "L2",
      bc_2_basket: false,
      hasChildren: false,
      bc_1_org_unit_name: "Centre of Excellence",
      actionType: "Read",
      bc_1_prl: "22-23",
      bc_2_jumlah_formasi: "4",
      project: false,
      bc_2_idx: "2",
      coordinationWith: {},
      bc_1_gl: "1",
      prl: "19-23",
      bc_2_prl: "19-21",
      bc_2_id_position: "30263552",
      bc_1_id_position_atasan_langsung: "10132405",
      basket: true,
      bc_2_gl: "1",
      bc_2_org_unit_name: "Centre of Excellence",
      bc_1_id: "10135643",
      bc_2_pid: "10132405",
      bc_2_id_org_unit: "10135643",
      bc_1_assistant: false,
      bc_1_id_position: "30263552",
      bc_1_flagMergeFormation: "A",
      bc_2_id_position_atasan_langsung: "10132405",
      bc_2_id: "10135643",
      id_position: "30263552",
      coordination: false,
      bc_1_position: "Principal Expert I-II Centre of Excellence",
      layering: "L3",
      bc_2_actionType: "Read",
      bc_1_actionType: "Read",
      bc_1_jumlah_formasi: "4",
      bc_2_position: "Sr Expert I-III Centre of Excellence",
      org_unit_name: "Centre of Excellence",
      bc_2_id_position_parent: null,
      id_position_parent: "30258741",
      isMergeFormation: true,
      pid: "10132405",
      tags: ["basket_2"],
      position_parent: "PT Pertamina Patra Niaga",
      bc_2_position_parent: "PT Pertamina Patra Niaga",
      bc_2_assistant: false,
      id: "10135643",
      bc_1_id_org_unit: "10135643",
      bc_1_pid: "10132405",
      bc_1_basket: false,
      gl: "GL1",
      id_position_atasan_langsung: "10132405",
      position: "Centre of Excellence",
      bc_1_position_parent: "PT Pertamina Patra Niaga",
      id_org_unit: "10135643",
      jumlah_formasi: 4,
      bc_2_flagMergeFormation: "A",
      assistant: false,
      bc_1_id_position_parent: null,
      isNeck: false,
    },
    {
      coordination: false,
      coordinationWith: {},
      actionType: "Read",
      id_org_unit: "10163342",
      id_position: "30313700",
      hasChildren: false,
      id: "10163342",
      org_unit_name: "Corporate Secretary",
      prl: "23",
      id_position_parent: "30258741",
      id_position_atasan_langsung: "10132405",
      isMergeFormation: false,
      gl: "GL1",
      basket: false,
      assistant: false,
      isNeck: true,
      tags: ["assistant"],
      position: "Corporate Secretary",
      project: false,
      pid: "10132405",
      position_parent: "PT Pertamina Patra Niaga",
      layering: "L2",
      jumlah_formasi: 35,
    },
    {
      coordination: false,
      coordinationWith: {},
      actionType: "Read",
      id_org_unit: "10164483",
      id_position: "30315805",
      hasChildren: false,
      id: "10164483",
      org_unit_name: "Manajemen Risiko",
      prl: "25",
      id_position_parent: "30258741",
      id_position_atasan_langsung: "10132405",
      isMergeFormation: false,
      gl: "GL1",
      basket: false,
      assistant: false,
      isNeck: false,
      tags: [],
      position: "Direktur Manajemen Risiko",
      project: false,
      pid: "10132405",
      position_parent: "PT Pertamina Patra Niaga",
      layering: "L1",
      jumlah_formasi: 32,
    },
  ],
};
