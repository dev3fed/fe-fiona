const url = {
  baseUrl: "http://localhost:5095",
  "api-organization": "api/organization-structure",
};
const tabArray = ["inputAttribute", "inputSubordinate", "inputSgSsg", "preview"];
const tabArrayIndex = ["chart", "draft", "2", "3"];
let statusAction = "add";
let dataAvailable = true;
const token = localStorage.getItem("token");
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const urlParams = new URLSearchParams(window.location.search);
let helperId = "";
const uuid = {
  uniqueCode: "",
  uniquePosCode: "",
};

const selectedData = {
  selectedJobDesc: null,
  selectedJobReference: null,
};

const organizationAttribute = {
  orgUnitId: null,
  orgUnitName: null,
};

const dataListJobDescription = myData.map((data) => ({
  id: data.id_position,
  jobName: data.position,
  jobStatus: "available",
}));

const listDraft = [
  {
    draftId: 1,
    draftName: "Master Data SO",
    createdBy: "Superadmin",
    createdDate: "05/05/2021",
    modifiedDate: "05/05/2021",
    modifiedBy: "Superadmin",
  },
  {
    draftId: 2,
    draftName: "Draft Usulan Perubahan VP IT",
    createdBy: "Superadmin",
    createdDate: "05/05/2021",
    modifiedDate: "05/05/2021",
    modifiedBy: "Superadmin",
  },
];

let initializeLocalStorage = (key, defaultValue) => {
  let value = localStorage.getItem(key);
  if (!value) {
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  }
  return JSON.parse(value);
};

let lsListDraft = initializeLocalStorage("listDraft", listDraft);
let lsListOrgNode = initializeLocalStorage("listOrgNode", myData);
// let lsListPosition = initializeLocalStorage("listPosition", positionDetail);
// let lsListDetailDraft = initializeLocalStorage("listDraftDetail", []);
// let lsListDraftOrgNode = initializeLocalStorage("listDraftOrgNode", []);
// let lsListApproval = initializeLocalStorage("listApproval", []);
