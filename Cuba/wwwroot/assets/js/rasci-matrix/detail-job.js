async function triggleDetailJob(val) {
  try {
    const modal = new bootstrap.Modal(
      document.getElementById("ModalDetailJob"),
    );
    const draftSoId = getState("draftSoId");
    modal.show();
    setState("detailJob", val);
    const payload = {
      draftId: draftSoId || null,
      unitCode: val.unitCode,
    };
    const queryString = new URLSearchParams(payload).toString();
    const resultDetail = await fetchDetailJob(queryString);
    const detailInfo = resultDetail.data;
    const infoSkillGroup = resultDetail.data.skillGroups;
    const JobName = `${val.positionName}`;
    const cardAttribute = `
      <div class="col-3">
          <label style="color:#9F9FA5;fonti-size:12px">Directorate</label><br/>
          <label style="font-weight: 600;font-size: 14px">${
            detailInfo.directorate || "-"
          }</label><br/>
      </div>
       <div class="col-2">
          <label style="color:#9F9FA5;fonti-size:12px">Division</label><br/>
          <label style="font-weight: 600;font-size: 14px">${
            detailInfo.division || "-"
          }</label><br/>
      </div>
       <div class="col-2">
          <label style="color:#9F9FA5;fonti-size:12px">Sub Division</label><br/>
          <label style="font-weight: 600;font-size: 14px">${
            detailInfo.subDivision || "-"
          }</label><br/>
      </div>
       <div class="col-2">
          <label style="color:#9F9FA5;fonti-size:12px">Department</label><br/>
          <label style="font-weight: 600;font-size: 14px">${
            detailInfo.department || "-"
          }</label><br/>
      </div>
       <div class="col-3">
          <label style="color:#9F9FA5;fonti-size:12px">Section</label><br/>
          <label style="font-weight: 600;font-size: 14px">${
            detailInfo.section || "-"
          }</label><br/>
      </div>
      <div class="col-12">
      <hr style="margin-right: 10px">
      </div>
  
      <div class="col-3">
          <label style="color:#9F9FA5;fonti-size:12px">Org Unit Name</label><br/>
          <label style="font-weight: 600;font-size: 14px">${
            detailInfo.unit.unitName || "-"
          }</label><br/>
      </div>
       <div class="col-2">
          <label style="color:#9F9FA5;fonti-size:12px">Org PRL</label><br/>
          <label style="font-weight: 600;font-size: 14px">${
            detailInfo.unit.prlOrg || "-"
          }</label><br/>
      </div>
       <div class="col-2">
          <label style="color:#9F9FA5;fonti-size:12px">Career Type</label><br/>
          <label style="font-weight: 600;font-size: 14px">${
            detailInfo.unit.careerTypeName || "-"
          }</label><br/>
      </div>
       <div class="col-2">
          <label style="color:#9F9FA5;fonti-size:12px">Career Level</label><br/>
          <label style="font-weight: 600;font-size: 14px">${
            detailInfo.unit.careerLevelName || "-"
          }</label><br/>
      </div>
       <div class="col-3">
          <label style="color:#9F9FA5;fonti-size:12px">Direct Report</label><br/>
          <label style="font-weight: 600;font-size: 14px">${
            detailInfo.directReportTo || "-"
          }</label><br/>
      </div>
      <div class="col-12">
      <hr style="margin-right: 10px">
      </div>
  
      <div class="col-3">
          <label style="color:#9F9FA5;fonti-size:12px">Personnel Area Name</label><br/>
          <label style="font-weight: 600;font-size: 14px">${
            detailInfo.personnelArea || "-"
          }</label><br/>
      </div>
       <div class="col-3">
          <label style="color:#9F9FA5;fonti-size:12px">Personnel Area Subname</label><br/>
          <label style="font-weight: 600;font-size: 14px">${
            detailInfo.personnelSubArea || "-"
          }</label><br/>
      </div>
       <div class="col-6">
          <label style="color:#9F9FA5;fonti-size:12px">SK Number</label><br/>
          <label style="font-weight: 600;font-size: 14px">${
            detailInfo.skNumber || "Field Belum ada"
          }</label><br/>
      </div>
    `;
    const cardsgContent = `
      <div class="col-4">
      <div style="padding-top: 20px;display:flex">
          <div style="padding:10px;margin-top:10px;border:1px solid #BFBFC2;width: 100%;border-radius: 5px;">
              <label style="color:#9F9FA5;fonti-size:12px">Main Skill Group</label><br/>
              <label style="font-weight: 600;font-size: 14px">${
                infoSkillGroup[0]?.skillGroupName || "-"
              }</label><br/>
  
              <label class="mt-2" style="color:#9F9FA5;fonti-size:12px">Main Sub Skill Group</label><br/>
              <label style="font-weight: 600;font-size: 14px">${
                infoSkillGroup[0]?.subSkillGroupName || "-"
              }</label>
          </div>
      </div>
      </div>
      <div class="col-4">
          <div style="padding-top: 20px;display:flex">
              <div style="padding:10px;margin-top:10px;border:1px solid #BFBFC2;width: 100%;border-radius: 5px;">
                  <label style="color:#9F9FA5;fonti-size:12px">Second Skill Group</label><br/>
                  <label style="font-weight: 600;font-size: 14px">${
                    infoSkillGroup[1]?.skillGroupName || "-"
                  }</label><br/>
  
                  <label class="mt-2" style="color:#9F9FA5;fonti-size:12px">Second Sub Skill Group</label><br/>
                  <label style="font-weight: 600;font-size: 14px">${
                    infoSkillGroup[1]?.subSkillGroupName || "-"
                  }</label>
              </div>
          </div>
      </div>
      <div class="col-4 mb-2">
          <div style="padding-top: 20px;display:flex">
              <div style="padding:10px;margin-top:10px;margin-right:10px;border:1px solid #BFBFC2;width: 100%;border-radius: 5px;">
                  <label style="color:#9F9FA5;fonti-size:12px">Third Skill Group</label><br/>
                  <label style="font-weight: 600;font-size: 14px">${
                    infoSkillGroup[2]?.skillGroupName || "-"
                  }</label><br/>
  
                  <label class="mt-2" style="color:#9F9FA5;fonti-size:12px">Third Sub Skill Group</label><br/>
                  <label style="font-weight: 600;font-size: 14px">${
                    infoSkillGroup[2]?.subSkillGroupName || "-"
                  }</label>
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
    const tabContent = document.getElementById("jobname");
    layoutTabRelatedBispro(val);
    if (sgContent && attributeContent) {
      sgContent.innerHTML = cardsgContent;
      attributeContent.innerHTML = cardAttribute;
      incContent.innerHTML = cardIncumbent;
      tabContent.innerHTML = JobName;
    }
  } catch (error) {}
}

const layoutTabRelatedBispro = async (data) => {
  let countR = 0;
  let countA = 0;
  let countS = 0;
  let countC = 0;
  let countI = 0;
  let countComments = 0;
  const draftidRasci = $("#dataSource-rasci").val();
  try {
    const payload = {
      unitCode: data.unitCode,
      prlOrg: data.prlOrg,
      draftRasciId: draftidRasci,
    };
    const queryString = "?" + new URLSearchParams(payload).toString();
    const result = await fetchProsbisByJob(queryString);
    if (result.success === false) return;

    result.data.forEach((item) => {
      item.rasciNotation.forEach((note) => {
        switch (note.notation) {
          case "R":
            countR++;
            break;
          case "A":
            countA++;
            break;
          case "S":
            countS++;
            break;
          case "C":
            countC++;
            break;
          case "I":
            countI++;
            break;
        }
        if (note.comment) {
          countComments++;
        }
      });
    });
    const totalJob = `
    <p>Total Business Process : ${result.data.length} |
      <img src="/assets/images/rasci/r.svg" alt="R Icon" style="margin-top:-4px;padding-left:5px"><label style="padding-left:5px">${countR}</label>
      <img src="/assets/images/rasci/a.svg" alt="A Icon" style="margin-top:-4px;padding-left:5px"><label style="padding-left:5px">${countA}</label>
      <img src="/assets/images/rasci/s.svg" alt="S Icon" style="margin-top:-4px;padding-left:5px"><label style="padding-left:5px">${countS}</label>
      <img src="/assets/images/rasci/c.svg" alt="C Icon" style="margin-top:-4px;padding-left:5px"><label style="padding-left:5px">${countC}</label>
      <img src="/assets/images/rasci/i.svg" alt="I Icon" style="margin-top:-4px;padding-left:5px"><label style="padding-left:5px">${countI}</label>
      <img src="/assets/images/rasci/comment.svg" alt="Comment Icon" style="margin-top:-4px;padding-left:5px"><label style="padding-left:5px">${countComments}</label>
    </p>`;
    theadContent = `<tr>
            <th scope="col" style="width: 60px">Level</th>
            <th scope="col" style="width: 120px">Index</th>
            <th scope="col">Business Process</th>
            <th scope="col" style="width: 140px;text-align:center">RASCI Notation</th>
          </tr>`;
    bodyContent = `<tr>
      ${result.data
        ?.map((item, index) => {
          let rasciIcons = "";
          let comments = [];
          item.rasciNotation.forEach((value) => {
            switch (value.notation) {
              case "R":
                rasciIcons += `<img src="/assets/images/rasci/r.svg" alt="R Icon" style="padding-right:2px">`;
                break;
              case "A":
                rasciIcons += `<img src="/assets/images/rasci/a.svg" alt="A Icon" style="padding-right:2px">`;
                break;
              case "S":
                rasciIcons += `<img src="/assets/images/rasci/s.svg" alt="S Icon" style="padding-right:2px">`;
                break;
              case "C":
                rasciIcons += `<img src="/assets/images/rasci/c.svg" alt="C Icon" style="padding-right:2px">`;
                break;
              case "I":
                rasciIcons += `<img src="/assets/images/rasci/i.svg" alt="I Icon" style="padding-right:2px">`;
                break;
            }

            if (value.comment) {
              comments.push(`<li>${value.notation}: ${value.comment}</li>`);
            }
          });

          if (comments.length > 0) {
            const commentTooltip = `<ul>${comments.join("")}</ul>`;
            rasciIcons += `<img src="/assets/images/rasci/comment.svg" alt="Comment Icon" style="padding-right:2px" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-html="true" title="${commentTooltip}">`;
          }

          return `<tr>

            <td>${item.level || "-"}</td>
            <td>${item.indexNumber || "-"}</td>
            <td>${item.description || "-"}</td>
            <td>
              <div class="rasci-container">
                <div class="rasci-icons">${rasciIcons}</div>
              </div>
            </td>
          </tr>`;
        })
        .join("")}`;

    document.getElementById("prosbis-details-header").innerHTML = theadContent;
    document.getElementById("prosbis-details-body").innerHTML = bodyContent;
    document.getElementById("total-prosbis").innerHTML = totalJob;
    initializeTooltips();
  } catch (error) {}
};

async function handleShowRasci() {
  const detailJob = getState("detailJob");
  const draftSoId = getState("draftSoId");
  const selectedValue = $("#dataSource-rasci").val();
  const spinner = document.getElementById("btnShowrasci");
  spinner.style.display = "inline-block";

  const payload = {
    draftRasciId: selectedValue === "master" ? null : selectedValue,
    unitCode: [detailJob.unitCode],
    prlOrg: [detailJob.prlOrg],
    row: 1,
    rowSize: 15,
  };

  const payloadJob = {
    col: 1,
    colSize: 10,
    indexNumber: [],
    draftRasciId: selectedValue === "master" ? null : selectedValue,
    unitCode: [detailJob.unitCode],
    detailJob: [detailJob.prlOrg],
    draftSoId: draftSoId,
  };

  try {
    const resultPosition = await fetchPositionMatrix(payloadJob);
    setState("idSearchProsbis", "");
    const resultMatrix = await fetchProsbisMatrix(payload);
    const combineIndex = resultMatrix.data.map((val) => val.indexNumber);
    if (resultMatrix.success === true) {
      selectedJobIds = [];
      const modalElement = document.getElementById("ModalDetailJob");
      const modal = bootstrap.Modal.getInstance(modalElement);
      setState("isSearchMatrix", true);
      setState("payloadProsbis", payload);
      setState("payloadPosition", payloadJob);
      setState("actionType", "POS_THEN_BP");
      setState("resultProsbis", resultMatrix.data);
      setState("resultJabatan", resultPosition.data);
      setState("totalProsbis", resultMatrix.totalResult);
      setState("totalJob", resultPosition.totalResult);
      loadTableBody(resultMatrix.data);
      appendDynamicHeader(resultPosition.data);
      mapRasciCells(combineIndex, resultPosition.data);
      setState("currentPageY", 1);
      setState("currentPageX", 1);
      spinner.style.display = "none";
      if (modal) {
        modal.hide();
      }
    }
  } catch (error) {
    console.error("Error fetching data matrix", error);
  }
}
