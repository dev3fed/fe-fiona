async function detailDraft() {
  try {
    const dataDraft = getState("dataDetailDraft");
    if (dataDraft) {
      console.log("dataDraft", dataDraft);
      const category = {
        mandatory: "Mandatory",
        general: "General",
        specific: "Specific",
      };
      const bodyInfo = `
        <div class="col-3 custom-col">
          <label style="color:#9F9FA5">Draft Name</label>
          <label style="font-weight: 600;font-size: 14px">${dataDraft.draftName}</label>
          <label>${dataDraft.reqId}</label>
        </div>
        <div class="col-3 custom-col">
          <label style="color:#9F9FA5">Created by</label>
          <label style="font-weight: 600;font-size: 14px">${dataDraft.createdBy ? dataDraft.createdBy : "-"}</label>
        </div>
        <div class="col-3 custom-col">
          <label style="color:#9F9FA5">Created Date</label>
          <label style="font-weight: 600;font-size: 14px">${
            dataDraft.createdDate ? new Date(dataDraft.createdDate).toLocaleDateString() : "-"
          }</label>
        </div>
        <div class="col-3 custom-col">
          <label style="color:#9F9FA5">Type</label>
          <label style="font-weight: 600;font-size: 14px;padding-left:30px;padding-right:30px">${
            dataDraft.typeDetail
          }</label>
        </div>`;
      const bodyDetail = `
        <div class="col-3 custom-col" style="text-align: left;">
          <label style="color:#9F9FA5">Job Title</label>
          <label style="font-weight: 600;font-size: 14px">${dataDraft?.jobTitle.job_name}</label>
        </div>
        <div class="col-3 custom-col" style="text-align: left;">
          <label style="color:#9F9FA5">${category[dataDraft?.GeneralCompeName.category]} Competency Name</label>
          <label onclick="handleDraftDetailCompetency(${
            dataDraft?.GeneralCompeName.id
          })" style="color:#03A9F4;cursor:pointer; font-weight: 600;font-size: 14px">${
        dataDraft?.GeneralCompeName.competency_name
      }</label>
        </div>
        <div class="col-3 custom-col" style="text-align: left;">
          <label style="color:#9F9FA5">Depth Level (before edit)</label>
          <label style="font-weight: 600;font-size: 14px">${dataDraft?.DepthLevelBefore}</label>
        </div>
        <div class="col-3 custom-col" style="text-align: left;">
          <label style="color:#9F9FA5">Depth Level (after edit)</label>
          <label style="font-weight: 600;font-size: 14px">${dataDraft?.DepthLevelAfter}</label>
        </div>`;
      const draftInfo = document.getElementById("draft-competencyinfo");
      const detailCompetency = document.getElementById("detail-competency");
      if (draftInfo) {
        draftInfo.innerHTML = bodyInfo;
        detailCompetency.innerHTML = bodyDetail;
      }
    }
  } catch (error) {}
}

const handleDraftDetailCompetency = async (id) => {
  console.log("id", id);
  const competencyList = getState("competencyList");
  const dataDetail = await fetchCompetencyDetail(id);
  const findcompetencyList = competencyList.find((compe) => compe.id === dataDetail.data.idcompetency);
  console.log("dataDetail", dataDetail);
  const modal = new bootstrap.Modal(document.getElementById("modalDraftDetailCompe"));
  modal.show();

  const formContent = `
    <div class="col-12 scrollable-content" style="min-height: 620px;">
        <div class="mb-2">
          <h6>${findcompetencyList.competency_name} </h6>
        </div>
               
        <div class="custom-card-approval">
            <div class="header-card-approval">
                Detail
            </div>
            <div>
                <div class=" custom-row-full">
                    <label>${dataDetail?.data.definition}</label>
                </div>
            </div>
        </div>
        <div class="custom-card-approval">
            <div class="header-card-approval">
                Level 1 (Basic)
            </div>
            <div style="padding-top: 10px;">
                <div class=" custom-row-full">
                    <ul style="list-style-type: disc; margin-left: 20px;font-size: 13px;">
                    ${dataDetail?.data.level1.map((item) => `<li> ${item}</li>`).join("")}
                    </ul>
                </div>
            </div>
        </div>
        <div class="custom-card-approval">
            <div class="header-card-approval">
              Level 2 (Intermediate)
            </div>
            <div style="padding-top: 10px;">
                <div class=" custom-row-full">
                    <ul style="list-style-type: disc; margin-left: 20px;font-size: 13px;">
                    ${dataDetail?.data.level2.map((item) => `<li> ${item}</li>`).join("")}
                    </ul>
                </div>
            </div>
        </div>
        <div class="custom-card-approval">
            <div class="header-card-approval">
                Level 3 (Advance)
            </div>
            <div style="padding-top: 10px;">
                <div class=" custom-row-full">
                   <ul style="list-style-type: disc; margin-left: 20px;font-size: 13px;">
                    ${dataDetail?.data.level3.map((item) => `<li> ${item}</li>`).join("")}
                    </ul>
                </div>
            </div>
        </div>
        <div class="custom-card-approval">
            <div class="header-card-approval">
                Level 4 (Mastery)
            </div>
            <div style="padding-top: 10px;">
                <div class=" custom-row-full">
                    <ul style="list-style-type: disc; margin-left: 20px;font-size: 13px;">
                    ${dataDetail?.data.level4.map((item) => `<li> ${item}</li>`).join("")}
                    </ul>
                </div>
            </div>
        </div>
    </div>
    <div class="col-12">
  `;

  const modalBodyContent = document.getElementById("body-draftdetailcompe");
  if (modalBodyContent) {
    modalBodyContent.innerHTML = formContent;
  }
};

const triggleEditCompetency = () => {
  const dataDraft = getState("dataDetailDraft");
  console.log("dataDraft", dataDraft);
  const modal = new bootstrap.Modal(document.getElementById("modalDraftEditdepth"));
  modal.show();

  const formEditDepth = `
        <div class="col-6">
        <label class="form-label">Draft Name</label>
            <input class="form-control" type="text" id="edit-draftname"  placeholder="Draft Name" >
        </div>
        <div class="col-6">
        <label class="form-label">Draft Type</label>
            <input class="form-control" type="text" placeholder="Draft Type"  disabled>
        </div>
        <div class="col-12 mt-3 mb-2">
        <h6 class="f-w-600">Job Title & Technical Competency Info</h6>
        </div>
        <div class="col-12 mt-2 mb-2">
        <label class="form-label">Job</label>
            <input class="form-control" type="text" placeholder="Job"  disabled>
        </div>
         <div class="col-12 mt-2 mb-2">
        <label class="form-label">Skill Group</label>
            <input class="form-control" type="text" placeholder="Skill Group">
        </div>
         <div class="col-12 mt-2 mb-2">
        <label class="form-label">Sub Skill Group</label>
            <input class="form-control" type="text" placeholder="Sub Skill Group">
        </div>
         <div class="col-12 mt-2">
        <label class="form-label">Technical Competency</label>
            <input class="form-control" type="text" placeholder="Technical Competency">
        </div>
  `;
  const bodyContent = document.getElementById("form-content-edit");
  if (bodyContent) {
    bodyContent.innerHTML = formEditDepth;
  }
};

const deleteDetailDraft = () => {
  const dataDraft = getState("dataDetailDraft");
  console.log("dataDraft", dataDraft);
  // open modal dengan id modalDraftDelete
  const modal = new bootstrap.Modal(document.getElementById("modalDraftDelete"));
  modal.show();
};

async function confirmDeleteDetailcompeDraft() {
  const dataDraft = getState("dataDetailDraft");
  const draftList = getState("draftList");
  // remove from draft list
  setState(
    "draftList",
    draftList.filter((val) => val.id !== dataDraft.id),
  );
  const modalDelDraft = document.getElementById("modalDraftDelete");
  const modal = bootstrap.Modal.getInstance(modalDelDraft);
  if (modal) {
    modal.hide();
  }
  const draftListAfter = getState("draftList");
  const IsNotEmpty = draftListAfter.length;
  handleBack();
  changeemptyPageDraft(IsNotEmpty);
  loadTableBodyDraft(draftListAfter);
}
