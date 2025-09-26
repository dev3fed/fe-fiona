const detailApproval = async () => {
  try {
    const detailApproval = getState("dataDetailAproval");
    console.log("detailApproval", detailApproval);
    const labelStatus = {
      0: "Draft",
      1: "Approved",
      2: "Rejected",
      3: "Submitted",
    };
    if (detailApproval) {
      const infoBody = `
     <div class="col-2 custom-col">
        <label style="color:#9F9FA5">Draft Name</label>
        <label style="font-weight: 600;font-size: 14px">${detailApproval.draftName || "-"}</label>
        <label>-</label>
    </div>
    <div class="col-3 custom-col">
        <label style="color:#9F9FA5">Organization Data Source</label>
        <label style="font-weight: 600;font-size: 14px">${detailApproval.draftSoName || "-"}</label>
    </div>
    <div class="col-3 custom-col">
        <label style="color:#9F9FA5">Submitted Date</label>
        <label style="font-weight: 600;font-size: 14px">${detailApproval.submittedBy || "-"}</label>
        <label>${
          detailApproval.submittedDate ? new Date(detailApproval.submittedDate).toLocaleDateString() : "-"
        }</label>
    </div>
    <div class="col-2 custom-col">
        <label style="color:#9F9FA5">Approval/Reject Date</label>
        <label style="font-weight: 600;font-size: 14px">${
          detailApproval.approvalDate ? new Date(detailApproval.approvalDate).toLocaleDateString() : "-"
        }</label>
    </div>
    <div class="col-2 custom-col">
        <label style="color:#9F9FA5">Status</label>
        <label style="font-weight: 600;font-size: 14px">${labelStatus[detailApproval.status] || "-"}</label>
    </div>`;
      if (detailApproval?.data.length > 0) {
        // renderTableActivityApproval(detailApproval);
      } else {
        const bodyEmpty = `
          <div class="empty-activity-body">
        
          </div>
        `;
        const emptyActivity = document.getElementById("empty-activityapproval");
        if (emptyActivity) emptyActivity.innerHTML = bodyEmpty;
      }
      const infoContainer = document.getElementById("info-approval");
      if (infoContainer) infoContainer.innerHTML = infoBody;
    }
  } catch (error) {}
};
