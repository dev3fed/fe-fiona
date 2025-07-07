async function triggleDetailJob(id) {
  const modal = new bootstrap.Modal(document.getElementById("ModalDetailJob"));
  modal.show();
  setState("detailJob", id);
  const cardAttribute = `
    <div class="col-3">
        <label style="color:#9F9FA5;fonti-size:12px">Directorate</label><br/>
        <label style="font-weight: 600;font-size: 14px">-</label><br/>
    </div>
     <div class="col-2">
        <label style="color:#9F9FA5;fonti-size:12px">Division</label><br/>
        <label style="font-weight: 600;font-size: 14px">Legal Counsel</label><br/>
    </div>
     <div class="col-2">
        <label style="color:#9F9FA5;fonti-size:12px">Sub Division</label><br/>
        <label style="font-weight: 600;font-size: 14px">-</label><br/>
    </div>
     <div class="col-2">
        <label style="color:#9F9FA5;fonti-size:12px">Department</label><br/>
        <label style="font-weight: 600;font-size: 14px">-</label><br/>
    </div>
     <div class="col-3">
        <label style="color:#9F9FA5;fonti-size:12px">Section</label><br/>
        <label style="font-weight: 600;font-size: 14px">-</label><br/>
    </div>
    <div class="col-12">
    <hr style="margin-right: 10px">
    </div>

    <div class="col-3">
        <label style="color:#9F9FA5;fonti-size:12px">Org Unit Name</label><br/>
        <label style="font-weight: 600;font-size: 14px">Legal Counsel</label><br/>
    </div>
     <div class="col-2">
        <label style="color:#9F9FA5;fonti-size:12px">Org PRL</label><br/>
        <label style="font-weight: 600;font-size: 14px">23</label><br/>
    </div>
     <div class="col-2">
        <label style="color:#9F9FA5;fonti-size:12px">Career Type</label><br/>
        <label style="font-weight: 600;font-size: 14px">Managerial</label><br/>
    </div>
     <div class="col-2">
        <label style="color:#9F9FA5;fonti-size:12px">Career Level</label><br/>
        <label style="font-weight: 600;font-size: 14px">Strategic Leader</label><br/>
    </div>
     <div class="col-3">
        <label style="color:#9F9FA5;fonti-size:12px">Direct Report</label><br/>
        <label style="font-weight: 600;font-size: 14px">Direktur Utama</label><br/>
    </div>
    <div class="col-12">
    <hr style="margin-right: 10px">
    </div>

    <div class="col-3">
        <label style="color:#9F9FA5;fonti-size:12px">Personnel Area Name</label><br/>
        <label style="font-weight: 600;font-size: 14px">Kantor Pusat SH C&T</label><br/>
    </div>
     <div class="col-3">
        <label style="color:#9F9FA5;fonti-size:12px">Personnel Area Subname</label><br/>
        <label style="font-weight: 600;font-size: 14px">KP Jakarta</label><br/>
    </div>
     <div class="col-6">
        <label style="color:#9F9FA5;fonti-size:12px">SK Number</label><br/>
        <label style="font-weight: 600;font-size: 14px">Kpts-005/PPN60000/2021-S8 tanggal 30 Juni 2021</label><br/>
    </div>
  `;
  const cardsgContent = `
    <div class="col-4">
    <div style="padding-top: 20px;display:flex">
        <div style="padding:10px;margin-top:10px;border:1px solid #BFBFC2;width: 100%;border-radius: 5px;">
            <label style="color:#9F9FA5;fonti-size:12px">Main Skill Group</label><br/>
            <label style="font-weight: 600;font-size: 14px">Business Management</label><br/>

            <label class="mt-2" style="color:#9F9FA5;fonti-size:12px">Main Sub Skill Group</label><br/>
            <label style="font-weight: 600;font-size: 14px">Business Planning</label>
        </div>
    </div>
    </div>
    <div class="col-4">
        <div style="padding-top: 20px;display:flex">
            <div style="padding:10px;margin-top:10px;border:1px solid #BFBFC2;width: 100%;border-radius: 5px;">
                <label style="color:#9F9FA5;fonti-size:12px">Second Skill Group</label><br/>
                <label style="font-weight: 600;font-size: 14px">Legal</label><br/>

                <label class="mt-2" style="color:#9F9FA5;fonti-size:12px">Second Sub Skill Group</label><br/>
                <label style="font-weight: 600;font-size: 14px">Legal Reasoning & Analysis</label>
            </div>
        </div>
    </div>
    <div class="col-4 mb-2">
        <div style="padding-top: 20px;display:flex">
            <div style="padding:10px;margin-top:10px;margin-right:10px;border:1px solid #BFBFC2;width: 100%;border-radius: 5px;">
                <label style="color:#9F9FA5;fonti-size:12px">Third Skill Group</label><br/>
                <label style="font-weight: 600;font-size: 14px">Legal</label><br/>

                <label class="mt-2" style="color:#9F9FA5;fonti-size:12px">Third Sub Skill Group</label><br/>
                <label style="font-weight: 600;font-size: 14px">Legal Presentation</label>
            </div>
        </div>
    </div>
    `;
  const cardIncumbent = `
        <div class="col-3">
            <label style="color:#9F9FA5;fonti-size:12px">Employee ID</label><br/>
            <label style="font-weight: 600;font-size: 14px">19251894</label><br/>
        </div>
        <div class="col-3">
            <label style="color:#9F9FA5;fonti-size:12px">Employee Name</label><br/>
            <label style="font-weight: 600;font-size: 14px">Lily Desy Saptania Rahayu</label><br/>
        </div>
        <div class="col-6">
            <label style="color:#9F9FA5;fonti-size:12px">PRL Plan Comp</label><br/>
            <label style="font-weight: 600;font-size: 14px">23</label><br/>
        </div>
`;
  const attributeContent = document.getElementById("job-attribute");
  const sgContent = document.getElementById("skill-group-content");
  const incContent = document.getElementById("incumbent-content");
  if (sgContent && attributeContent) {
    sgContent.innerHTML = cardsgContent;
    attributeContent.innerHTML = cardAttribute;
    incContent.innerHTML = cardIncumbent;
  }

  //
}

async function handleShowRasci() {
  const detailJob = getState("detailJob");
  const spinner = document.getElementById("btnShowrasci");
  spinner.style.display = "inline-block";

  const payload = {
    type: "job",
    jobId: [detailJob],
  };
  try {
    const resultMatrix = await fetchDataMatrix(payload);
    if (resultMatrix.status === 200) {
      resultAllData(resultMatrix?.data);
      selectedJobIds = [];
      const modalElement = document.getElementById("ModalDetailJob");
      const modal = bootstrap.Modal.getInstance(modalElement);
      setState("isSearchMatrix", true);
      spinner.style.display = "none";
      if (modal) {
        modal.hide();
      }
    }
  } catch (error) {
    console.error("Error fetching data matrix", error);
  }
}
