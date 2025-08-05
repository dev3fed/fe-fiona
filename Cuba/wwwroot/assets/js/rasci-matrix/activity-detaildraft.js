async function handleDeleteDraftActivity(id, draftType) {
  const draftRasciId = getState("draftRasciId");
  setState("draftActivityId", id);
  setState("draftActivityType", draftType);
  console.log("first", id);
  console.log("draftRasciId", draftRasciId);
  const draftTypeMessages = {
    "Add New Business Process": "Are you sure want to delete this Add New Business Process activity data?",
    "Delete Business Process": "Are you sure want to delete this Delete Business Process activity data?",
    "Edit Business Process": "Are you sure want to delete this Edit Business Process activity data?",
    "Add/Edit RASCI": "Are you sure want to delete this Add/Edit RASCI activity data?",
  };
  const information = draftTypeMessages[draftType] || "Are you sure want to delete this activity data?";

  try {
    const modal = new bootstrap.Modal(document.getElementById("modalDeleteActivitydraft"));
    modal.show();
    const contentDeleteActivitydraft = document.getElementById("contentInformation");

    if (contentDeleteActivitydraft) {
      contentDeleteActivitydraft.innerHTML = information;
    }
  } catch (error) {}
}

async function deleteActivitydraft() {
  try {
    const draftRasciId = getState("draftRasciId");
    const id = getState("draftActivityId");
    const draftType = getState("draftActivityType");
    const draftTypeMessages = {
      "Add New Business Process": "Add New Business Process activity data has been deleted",
      "Delete Business Process": "Edit Business Process activity data has been deleted",
      "Edit Business Process": "Delete Business Process activity data has been deleted",
      "Add/Edit RASCI": "Add/Edit RASCI activity data has been deleted",
    };
    const information = draftTypeMessages[draftType] || "Are you sure want to delete this activity data?";
    console.log("draftRasciId", draftRasciId);
    console.log("id", id);
    console.log("cek");
    const spinner = document.getElementById("btnDeleteActivitydraft");
    if (spinner) spinner.style.display = "inline-block";

    const url = `${id}?draftId=${draftRasciId}`;
    const deleteResult = await endpointDeleteDraftActivity(url);
    console.log("deleteResult", deleteResult);
    if (deleteResult.success === true) {
      const modal = bootstrap.Modal.getInstance(document.getElementById("modalDeleteActivitydraft"));
      if (modal) modal.hide();
      setTimeout(() => {
        swal({
          title: "DELETED",
          icon: "success",
          buttons: false,
          timer: 2000,
          content: {
            element: "div",
            attributes: {
              innerHTML: `<div style="text-align: center;">${information}</div>`,
            },
          },
          customClass: {
            popup: "swal-custom-popup",
          },
        }).then(async () => {
          spinner.style.display = "none";
          const payload = {
            Page: 1,
            PageSize: 5,
          };
          const queryString = new URLSearchParams(payload).toString();
          const listData = await fetchDraftListProsbis(draftRasciId, queryString);
          renderTableActivity(listData);
        });
      }, 200);
    }
  } catch (error) {}
}
async function triggleEditActivitybp(id) {
  const draftRasciId = getState("draftRasciId");
  console.log("first", id);
  console.log("draftRasciId", draftRasciId);
  try {
  } catch (error) {}
}
async function triggleDetailActivity(id, draftType) {
  const draftRasciId = getState("draftRasciId");
  try {
    if (draftType === "Add New Business Process") {
      detailAddprosbis(id, draftRasciId);
    } else if (draftType === "Delete Business Process") {
      detailDeleteBp(id, draftType);
    } else if (draftType === "Edit Business Process") {
      detailEditBp(id, draftType);
    } else if (draftType === "Add/Edit RASCI") {
      detailAddNotation(id, draftRasciId);
    }
  } catch (error) {}
}

async function detailAddprosbis(id, draftRasciId) {
  console.log("cek", id);
  console.log("draftRasciId", draftRasciId);
  try {
    const url = `${draftRasciId}?draftListId=${id}`;
    const dataActivity = await fetchDetailDraftActivity(url);
    console.log("dataActivity", dataActivity);
    const modal = new bootstrap.Modal(document.getElementById("modalDetaildraftAddBp"));
    modal.show();
    const dataHeader = dataActivity?.data.businessProcess;
    const dataFooter = dataActivity?.data.rasciMapping;
    const modalTitle = document.getElementById("modalDetaildraftAddBpTitle");
    if (modalTitle) {
      modalTitle.innerHTML = `Activity Detail Add/Edit RASCI`;
    }
    const elementFooter = dataFooter
      .map((item, index) => {
        return `
         ${index !== 0 ? "<div><hr></div>" : " "}
        <span class="mb-2" style="display: flex; font-weight: 600; font-size: 14px;">
        ${item.unitCode} - ${item.positionName}
        </span>
        ${item.rasciData
          .map(
            (item) => `
            <div class="row align-items-center mb-2">
                <div class="col-auto d-flex align-items-center">
                <img src="/assets/images/rasci/${item.notation.toLowerCase()}.svg" alt="${
              item.notation
            } Icon" style="height: 16px; width: 16px;">
                </div>
                <div class="col text-left">
                <span style="margin-left: auto;">:</span>
                <span style="font-size: 12px;">${item.comment}</span>
                </div>
            </div>
            `,
          )
          .join("")}
        `;
      })
      .join("");

    const contentBody = `
    <div class="custom-card-draft">
        <div class="header-card-draft">
            New Business Process
        </div>
        <div class="row" style="padding-top: 20px;" id="header-avtivity-detail">
          <div class="col-7 custom-col" style="text-align: left">
            <label label style="color:#9F9FA5">Business Process Name</label>
            <div style="display: flex;  font-weight: 600; font-size: 14px;">
              <span>${dataHeader.indexGroup || "0"} - ${dataHeader.businessProcessName}</span>
            </div>
         </div>
          <div class="col-5 custom-col" style="text-align: left; border-right:none">
            <label style="color:#9F9FA5">Level</label>
            <label style="font-weight: 600;font-size: 14px">${dataHeader.level || "-"}</label>
          </div>
          <div class="col-12 custom-col" style="text-align: left">
            <hr style="margin-right: 10px">
              <label style="color:#9F9FA5">Parent</label>
              <label style="font-weight: 600;font-size: 14px">${dataHeader.parentId || "0"} - ${
      dataHeader.parentName ? dataHeader.parentName : "-"
    }</label>
          </div>
        </div>
    </div>
    <div class="custom-card-draft" style="padding-top:30px">
        <div class="header-card-draft" id="label-position">
        <span>Selected Position (total: ${dataFooter.length})</span>
        </div>

        <div class="row scrollable-detailDraft" id="footer-activity-detail">
          ${elementFooter}
        </div>
    </div>
    `;
    const contentDetailDraftAddBpComponent = document.getElementById("contentDetailDraftAddBp");
    if (contentDetailDraftAddBpComponent) {
      contentDetailDraftAddBpComponent.innerHTML = contentBody;
    }
  } catch (error) {}
}

async function detailDeleteBp(id) {
  try {
    const modal = new bootstrap.Modal(document.getElementById("modalDetailDeletebp"));
    modal.show();
    const dataActivity = await fetchDetailDraftActivity(id);
    const dataInfo = dataActivity.data.businessProcess;
    const formContent = `
      <div class="col-12">
        <div >
            <label class="form-label" style="width:25%">Business Process Parent</label>
             <label> : </label>
            <b class="form-label">${dataInfo.parentId} - ${dataInfo.parentName}</b>

        </div>
      </div>
      <div class="col-12">
        <div >
            <label class="form-label" style="width:25%">Business Process Level</label>
             <label> : </label>
            <b class="form-label">${dataInfo.level}</b>

        </div>
      </div>
       <div class="col-12">
        <div >
            <label class="form-label" style="width:25%">Business Process Index</label>
             <label> : </label>
            <b class="form-label">${dataInfo.indexGroup}</b>

        </div>
      </div>
     <div class="col-12 mt-2">
      <div>
        <label class="form-label" style="width:25%">Business Process Name</label>
             <label> : </label>
              <b class="form-label">${dataInfo.description}</b>
      </div>
    </div>
    `;

    const bodyContent = document.getElementById("list-detaildeletebp");
    if (bodyContent) {
      bodyContent.innerHTML = formContent;
    }

    $(".selectpicker").selectpicker();
  } catch (error) {}
}

async function detailEditBp(id) {
  const modal = new bootstrap.Modal(document.getElementById("ModalDetaileditbp"));
  modal.show();
  console.log("cek");
  // const dataActivity = await fetchDetailDraftActivity(id);
  // const dataInfo = dataActivity.data.businessProcess;
}

async function detailAddNotation(id, draftRasciId) {
  console.log("first", id);
  const modal = new bootstrap.Modal(document.getElementById("modalActivityEnot"));
  modal.show();
  const modalTitle = document.getElementById("modalActivityEnotTitle");
  if (modalTitle) {
    modalTitle.innerHTML = `Add/Edit RASCI Activity Detail `;
  }
  const contentBody = `
      <div class="row">
        <div class="col-12 ">
            <label>Position:</label>
            <hr style="margin-top: 0;" />
        </div>
        <div class="col-12 mb-2 d-flex justify-content-end">
         <button class="btn btn-primary btn-sm">  
           <img src="/assets/images/rasci/plus.svg" alt="Filter Icon" style="margin-top: -1px;"> Add RASCI
         </button>
        </div>
        <div class="col-12 ">
       <div class="card-tblbusiness" style=" max-height: 300px;">
         <div class="table-responsive scrollable mt-1" style=" max-height: 260px;">
             <table class="table tbl-border-notation">
                 <thead>
                 <tr>
                      <th scope="col" style="width: 50px">No</th>
                     <th scope="col" style="width: 50px">Level</th>
                     <th scope="col" style="width: 80px;text-align:center">Index</th>
                     <th scope="col" >Business Process</th>
                     <th scope="col" style="width: 120px;text-align:center">RASCI (Before)</th>
                     <th scope="col" style="width: 120px;text-align:center">RASCI (After)</th>
                     <th scope="col" style="width: 100px;text-align:center">Action</th>
                 </tr>
                 </thead>
                 <tbody>
                  <tr>
                      <td>1</td>
                      <td>1</td>
                      <td style="text-align:center">1.1</td>
                      <td>Business Process Name <br>
                      <small style="color:#9F9FA5">
                        (Reference from Manager Organization Capability)
                      </small>
                      </td>
                      <td style="text-align:center">
                          <img src="/assets/images/rasci/r.svg" alt="R Icon" style="height: 16px; width: 16px;">
                          <img src="/assets/images/rasci/a.svg" alt="A Icon" style="height: 16px; width: 16px;">
                      </td>
                      <td style="text-align:center">
                          <img src="/assets/images/rasci/s.svg" alt="S Icon" style="height: 16px; width: 16px;">
                          <img src="/assets/images/rasci/c.svg" alt="C Icon" style="height: 16px; width: 16px;">
                      </td>
                      <td style="text-align:center">
                          <button class="btn btn-outline-light btn-small-icon" type="button">
                                    <img src="/assets/images/rasci/icon_pencil.svg" alt="Edit Icon">
                                  </button>
                      </td>
                  </tr>
                  <!-- Add more rows as needed -->
               </tbody>
             </table>
            </div>
          </div>
        </div>
      </div>
  `;

  const contentDetailDraftEditnotComponent = document.getElementById("contentdetailEditnitation");
  if (contentDetailDraftEditnotComponent) {
    contentDetailDraftEditnotComponent.innerHTML = contentBody;
  }
  // const url = `${draftRasciId}?draftListId=${id}`;
  // const dataActivity = await fetchDetailDraftActivity(url);
  // console.log("dataActivity", dataActivity);
}
