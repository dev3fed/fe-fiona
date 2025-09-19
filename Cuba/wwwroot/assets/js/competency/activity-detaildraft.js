const triggleDetailActivity = async (positionCode) => {
  try {
    console.log("positionCode", positionCode);
    const dataDraft = getState("dataDetailDraft");
    const result = await fetchEditActivityCompetency(dataDraft.draftId, positionCode);
    const modal = new bootstrap.Modal(document.getElementById("modalActivityCompe"));
    modal.show();
    const modalTitle = document.getElementById("modalActivityCompeTitle");
    if (modalTitle) {
      modalTitle.innerHTML = `Activity Detail Add/Edit Competency to Position `;
    }
    console.log("result", result.data);
    renderTableEditActivity(result.data);
  } catch (error) {
    console.error("Error fetching activity competency:", error);
  }
};
const renderTableEditActivity = async (listData) => {
  try {
    // setState("dataDetailDraft", dataActivity.data);
    const detailInfo = listData;
    const contentBody = `
      <div class="row">
        <div class="col-12 ">
            <label>Position: ${detailInfo[0].positionCode} - ${detailInfo[0].positionName}</label>
            <hr style="margin-top: 0;" />
        </div>
        <div class="col-12 mb-2 d-flex justify-content-end">
         <button class="btn btn-primary btn-sm" onclick="openModalActivityAddnot()">
           <img src="/assets/images/rasci/plus.svg" alt="Filter Icon" style="margin-top: -1px;"> Add Technical Competency
         </button>
        </div>
         <div class="col-12 ">
      <div class="card-tblbusiness" style="max-height: 300px;">
        <div class="table-responsive scrollable-posdetail mt-1" style="max-height: 260px;">
        <table class="table tbl-border">
          <thead>
          <tr>
            <th scope="col" style="width: 40px;text-align:center">No</th>
            <th scope="col" style="width: 200px">Competency</th>
            <th scope="col" style="width: 100px;text-align:center">Type</th>
            <th scope="col" style="width: 80px;text-align:center">Level (Before)</th>
            <th scope="col" style="width: 80px;text-align:center">Level (After)</th>
            <th scope="col" style="width: 60px;text-align:center">Action</th>
          </tr>
          </thead>
          <tbody>
          ${detailInfo
            .map((item, idx) => {
              return `
                <tr>
                <td style="text-align:center">${idx + 1}</td>
                <td>
                ${item.competencyName || "-"}
                ${
                  item.competencyReference
                    ? `<br><small style="color:#9F9FA5">(${item.competencyReference})</small>`
                    : ""
                }
                </td>
                <td style="text-align:center">
                   ${item.competencyType || "-"}
                </td>
                <td style="text-align:center">
                  ${item.levelBefore || "-"}
                </td>
                <td style="text-align:center">
                  ${item.levelAfter || "-"}
                </td>
                <td style="text-align:center">
                  <button class="btn btn-outline-light btn-small-icon" type="button" >
                    <img src="/assets/images/rasci/icon_pencil.svg" alt="Edit Icon">
                  </button>
                </td>
                </tr>
              `;
            })
            .join("")}
          </tbody>
        </table>
        </div>
      </div>
      </div>
      </div>
  `;
    const contentActivityCompe = document.getElementById("contentActivityCompe");
    if (contentActivityCompe) {
      contentActivityCompe.innerHTML = contentBody;
    }
    feather.replace();
    initializeTooltips();
  } catch (error) {}
};

const deleteActivityDraft = async (positionCode) => {
  const dataDraft = getState("dataDetailDraft");
  console.log("dataDraft", dataDraft);
  setState("payloadDeleteActivity", { positionCode: positionCode, draftId: dataDraft.draftId });
  const modal = new bootstrap.Modal(document.getElementById("modalNotifdeleteactivity"));
  modal.show();
  try {
  } catch (error) {
    console.log("Error deleting activity draft", error);
  }
};

const confirmDeleteActivityDraft = async () => {
  const { draftId, positionCode } = getState("payloadDeleteActivity");
  const spinBtn = document.getElementById("spinDeleteactivity");
  if (spinBtn) spinBtn.style.display = "inline-block";
  try {
    const result = await fetchDeleteActivityDraft(draftId, positionCode);
    if (result.success === true) {
      const modalDelDraft = document.getElementById("modalNotifdeleteactivity");
      const modal = bootstrap.Modal.getInstance(modalDelDraft);
      if (modal) modal.hide();
      swal({
        title: "SUCCESS",
        icon: "success",
        buttons: false,
        timer: 2000,
        content: {
          element: "div",
          attributes: {
            innerHTML: `<div style="text-align: center;">Add/Edit Competency to Position activity data has been deleted.</div>`,
          },
        },
      }).then(async () => {
        const detailResult = await fetchDetailDraft(draftId);
        if (detailResult.success === true) {
          setState("dataDetailDraft", detailResult.data);
        }
        if (spinBtn) spinBtn.style.display = "none";
      });
    }
  } catch (error) {
    console.log("Error deleting activity draft", error);
  }
};
