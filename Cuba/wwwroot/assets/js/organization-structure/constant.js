const url = {
  baseUrl: "http://localhost:5095",
  "api-organization": "api/organization-structure",
};
const token = localStorage.getItem("token");
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const endPoint = "api/MasterData";
const urlParams = new URLSearchParams(window.location.search);
const lastPath = window.location.pathname.split("/").pop();
console.log("lastPath", lastPath);
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
  0: "Draft",
  1: "Submmited",
  2: "Approved",
  3: "Rejected",
  4: "Re Submit",
  5: "Approved",
  6: "Finalized",
};
const statusApprovalClass = {
  0: "label-warning-custom",
  1: "label-warning-custom",
  2: "label-success-custom",
  3: "label-danger-custom",
  4: "label-info-custom",
  5: "label-primary-custom",
  6: "label-success-custom",
};

const prl = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 26, 27, 28];

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

// const lsOrgNode = localStorage.getItem("lsOrgNode")
//   ? JSON.parse(localStorage.getItem("lsOrgNode"))
//   : JSON.parse(localStorage.setItem("lsOrgNode", JSON.stringify(myData)));

// get list draft
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
  abbrvPositon: "",
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
let lsListPosition = initializeLocalStorage("listPosition", positionDetail);
let lsListDetailDraft = initializeLocalStorage("listDraftDetail", []);
let lsListDraftOrgNode = initializeLocalStorage("listDraftOrgNode", []);
let lsListApproval = initializeLocalStorage("listApproval", []);

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

// get approval draft
// const listApproval = [
//   {
//     id: 1,
//     "request-id": "R0001",
//     "draft-name": "Draft Name",
//     "submitted-date": "05/05/2021",
//     "approval-reject-date": "05/05/2021",
//     status: "1",
//   },
//   {
//     id: 2,
//     "request-id": "R0002",
//     "draft-name": "Draft Name",
//     "submitted-date": "05/05/2021",
//     "approval-reject-date": "05/05/2021",
//     status: "2",
//   },
//   {
//     id: 3,
//     "request-id": "R0003",
//     "draft-name": "Draft Name",
//     "submitted-date": "05/05/2021",
//     "approval-reject-date": "05/05/2021",
//     status: "3",
//   },
//   {
//     id: 4,
//     "request-id": "R0004",
//     "draft-name": "Draft Name",
//     "submitted-date": "05/05/2021",
//     "approval-reject-date": "05/05/2021",
//     status: "4",
//   },
//   {
//     id: 5,
//     "request-id": "R0005",
//     "draft-name": "Draft Name",
//     "submitted-date": "05/05/2021",
//     "approval-reject-date": "05/05/2021",
//     status: "5",
//   },
// ];

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
  {
    id: 1,
    "subordinate-name": "Subordinate Name 1",
  },
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
const divDeleteSpesific = `<span>Are you sure want to delete <b>Manager Strategic Planning</b> position?</span>
    <br/>
    <div class="col">
        <div class="mb-3 m-t-15 custom-radio-ml">
            <div class="form-check radio radio-primary">
                <input class="form-check-input" id="radio1" type="radio" name="deleteOption" value="deleteAll" onclick="onChangeDeleteOption(this, 'deleteOption')" checked="true">
                <label class="form-check-label" for="radio1">Delete position & subordinate</span></label>
            </div>
            <div class="form-check radio radio-primary">
              <input class="form-check-input" id="radio2" type="radio"  name="deleteOption" value="deleteMoveSpesific" onclick="onChangeDeleteOption(this, 'deleteOption')">
              <label class="form-check-label" for="radio2">Delete position & move subordinate reporting line to specific position</label>
              <div class="row m-t-10 m-b-10 d-none p-10 m-r-10" id="deleteMoveSpesificDiv" style="background-color: #f5f5f5;">
                <div class="form-group"> 
                  <div class="col-sm-12">
                    <span class="text-muted f-12">Org Unit</span> 
                    <select class="form-control" id="selectOrgUnitDelete" name="selectOrgUnitDelete">
                      <option value="0">Select Org Unit</option>
                      <option value="1">Org Unit 1</option>
                    </select>
                  </div>
                  <div class="col-sm-12 m-t-10">
                    <span class="text-muted f-12">Direct Report</span> 
                    <select class="form-control" id="selectDirectReportDelete" name="selectDirectReportDelete">
                      <option value="0">Select Position</option>
                      <option value="1">Manager Strategic Planning</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div class="form-check radio radio-primary">
                <input class="form-check-input" id="radio3" type="radio" name="deleteOption" value="deleteMoveVarious" onclick="onChangeDeleteOption(this, 'deleteOption')">
                <label class="form-check-label" for="radio3">Delete position & move subordinate reporting line to various positions</label>
                <div class="row m-t-10 m-b-10 d-none p-10 m-r-10" id="deleteMoveVariousDiv" style="background-color: #f5f5f5;">
                  <div class="col-sm-12">
                      <div class="table-responsive">
                        <table class="tableMasterData table table-hover w-100" id="deleteMoveVariousTable">
                        </table>
                      </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
    </div>
    `;
