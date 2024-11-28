const url_api = '@(Environment.GetEnvironmentVariable("API_URL"))';
const tabArray = ["inputAttribute", "inputSgSsg", "inputSubordinate", "preview"];
const tabArrayIndex = ["chart", "draft", "2", "3"];
let statusAction = "add";
let dataAvailable = true;
let dataStorage;
const url = "http://localhost:5095";
const token = localStorage.getItem("token");
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const endPoint = "api/MasterData";
const urlParams = new URLSearchParams(window.location.search);
let helperId = "";
const uuid = {
  uniqueCode: "",
  uniquePosCode: "",
};

const initialDraftJob = {
  type: null,
  draftName: null,
  category: null,
  uniqueCode: null,
  careerType: null,
  careerLevel: null,
  isBakset: false,
  abbrvPosition: null,
  orgUnitName: null,
  positionName: null,
  prlOrg: null,
  formation: 0,
  directReport: null,
  neckFunction: false,
  isProject: false,
  isCoordination: false,
  coordinationWith: null,
  function: null,
  division: null,
  subDivision: null,
  department: null,
  section: null,
  personalAreaName: null,
  personalSubareaName: null,
};

const initialDraftJobSubordinate = {
  uniquePosCode: null,
  uniqueCode: null,
  careerLevel: null,
  careerType: null,
  isBasket: false,
  abbrvPosition: null,
  orgUnitName: null,
  positionName: null,
  prlOrg: null,
  formation: null,
  directReport: null,
  neckFunction: false,
  isProject: false,
  isCoordination: false,
  coordinationWith: null,
  function: null,
  division: null,
  subDivision: null,
  department: null,
  section: null,
  personalAreaName: null,
  personalSubareaName: null,
};

const initialDraftJobSgSsg = {
  uniqueCode: null,
  mainSg: 0,
  mainSsg: 0,
  secondSg: 0,
  secondSsg: 0,
  thirdSg: 0,
  thirdSsg: 0,
};

const initialDraftJobSubPosition = {
  uniqueCode: null,
  uniquePosCode: null,
  orgUnitName: null,
  careerType: null,
  careerLevel: null,
  abbrPosition: null,
  positionName: null,
  subPositionLevel: 0,
  prlOrg: 0,
  formation: 0,
  isJoinFormation: false,
  anotherSubPosition: null,
};
