// action detail activity table
async function triggleDetailActivity(id) {
  console.log("first", id);
  try {
    const modal = new bootstrap.Modal(document.getElementById("modalActivityDetail"));
    modal.show();
    const dataActivity = await fetchDetailDraftActivity(id);
    console.log("dataActivity", dataActivity.data);
    const dataHeader = dataActivity?.data.businessProcess;
    const dataFooter = dataActivity?.data.rasciMapping;
    const elementHeader = `
        <div class="col-7 custom-col" style="text-align: left">
          <label style="color:#9F9FA5">Business Process Name</label>
          <div style="display: flex;  font-weight: 600; font-size: 14px;">
            <span>${dataHeader.indexGroup} - ${dataHeader.businessProcessName} XXXX</span>
          </div>
        </div>
        <div class="col-5 custom-col" style="text-align: left; border-right:none">
          <label style="color:#9F9FA5">Level</label>
          <label style="font-weight: 600;font-size: 14px">5</label>
        </div>
         <div class="col-12 custom-col" style="text-align: left">
         <hr style="margin-right: 10px">
          <label style="color:#9F9FA5">Parent</label>
          <label style="font-weight: 600;font-size: 14px">${dataHeader.parentId} - ${
      dataHeader.parentName ? dataHeader.parentName : "-"
    }</label>
        </div>
      `;
    const elementLabel = `<span>Selected Position (total: ${dataFooter.length})</span>`;

    const elementFooter = dataFooter
      .map((item, index) => {
        return `
         ${index !== 0 ? "<div><hr></div>" : " "}
        <span class="mb-2" style="display: flex; font-weight: 600; font-size: 14px;">
        ${item.jobCode} - ${item.jobName}
        </span>
        ${item.notations
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
    // const elementFooter = `
    //     <div class=" custom-row-full">
    //         <span style="color:#9F9FA5">Rasci Notasi</span>
    //       <ul style="list-style-type:disc;padding-left:20px">
    //       ${notation.map((item) => `<li>${item.RasciCode} &nbsp : &nbsp ${item.Comment}</li>`).join("")}
    //       </ul>

    //     </div>
    //   `;

    const bodyheader = document.getElementById("header-avtivity-detail");
    if (bodyheader) bodyheader.innerHTML = elementHeader;
    const bodyLabel = document.getElementById("label-position");
    if (bodyLabel) bodyLabel.innerHTML = elementLabel;

    const bodyfooter = document.getElementById("footer-activity-detail");
    if (bodyfooter) bodyfooter.innerHTML = elementFooter;
  } catch (error) {}
}
