async function triggleDetailJob(val) {
  try {
    const modal = new bootstrap.Modal(document.getElementById("ModalDetailJob"));
    const draftSoId = getState("draftSoId");
    modal.show();
    setState("detailJob", val);
    const payload = {
      draftId: draftSoId || null,
      unitCode: val.unitCode,
      prlOrg: val.prlOrg || null,
    };
    const queryString = new URLSearchParams(payload).toString();
    const resultDetail = await fetchDetailJob(queryString);
    let detailInfo = resultDetail.data;
    let infoSkillGroup = detailInfo.skillGroups;
    let incumbent = detailInfo.incumbents;
    let division = detailInfo?.division?.divisionName || "-";
    let department = detailInfo?.department?.departmentName || "-";
    let careerType = detailInfo?.unit.careerTypeName || "-";
    let careerLevel = detailInfo?.unit.careerLevelName || "-";
    let subDivision = detailInfo?.subDivision || "-";
    let unit = detailInfo?.unit || {};
    let directReportTo = detailInfo?.directReportTo || "-";
    let personArea = detailInfo?.personnelArea || "-";
    let personSubArea = detailInfo?.personnelSubArea || "-";
    const JobName = `${val.positionName}`;
    const cardAttribute = `
       <div class="col-2" style="text-align: left; border-right: 1px solid #BFBFC2;">
            <label style="color: #9F9FA5; display: block;">ID Organization Unit</label>
            <label style="font-weight: 600; font-size: 14px">${unit?.unitCode || "-"}</label>
        </div>
        <div class="col-3 " style="text-align: left;border-right:1px solid #BFBFC2">
          <label style="color:#9F9FA5;display: block">Organization Unit</label>
          <label style="font-weight: 600;font-size: 14px">${unit?.unitName || "-"}</label>
        </div>
          <div class="col-3 " style="text-align: left;border-right:1px solid #BFBFC2">
          <label style="color:#9F9FA5; display: block;">ID Position</label>
          <label style="font-weight: 600;font-size: 14px">${directReportTo?.jobPositionCode || "-"}</label>
        </div>
          <div class="col-4 " style="text-align: left">
          <label style="color:#9F9FA5;display: block">Position Name</label>
          <label style="font-weight: 600;font-size: 14px">${directReportTo?.jobPositionName || "-"}</label>
        </div>
        <div class="col-12">
            <hr style="margin-right: 10px">
        </div>
        <div class="col-2 " style="text-align: left;border-right:1px solid #BFBFC2">
          <label style="color:#9F9FA5;display: block;">ID Organization Unit Parent</label>
          <label style="font-weight: 600;font-size: 14px">${unit?.unitParentCode || "-"}</label>
        </div>
        <div class="col-3 " style="text-align: left;border-right:1px solid #BFBFC2">
          <label style="color:#9F9FA5;display: block">Organization Unit Parent</label>
          <label style="font-weight: 600;font-size: 14px">${unit?.unitParentName || "-"}</label>
        </div>
          <div class="col-3 " style="text-align: left;border-right:1px solid #BFBFC2">
          <label style="color:#9F9FA5;display: block;">ID Position Direct Report</label>
          <label style="font-weight: 600;font-size: 14px">${directReportTo?.jobPositionParentCode || "-"}</label>
        </div>
          <div class="col-4 " style="text-align: left">
          <label style="color:#9F9FA5;display: block">Direct Report</label>
          <label style="font-weight: 600;font-size: 14px">${directReportTo?.jobPositionParentName || "-"}</label>
        </div>
          <div class="col-12">
            <hr style="margin-right: 10px">
        </div>
        <div class="col-2 " style="text-align: left;border-right:1px solid #BFBFC2">
          <label style="color:#9F9FA5;display: block;">Directorate</label>
          <label style="font-weight: 600;font-size: 14px">${"-"}</label>
        </div>
        <div class="col-3 " style="text-align: left;border-right:1px solid #BFBFC2">
          <label style="color:#9F9FA5;display: block">Function</label>
          <label style="font-weight: 600;font-size: 14px">${detailInfo?.function?.functionName || "-"}</label>
        </div>
          <div class="col-3 " style="text-align: left;border-right:1px solid #BFBFC2">
          <label style="color:#9F9FA5;display: block;">Division</label>
          <label style="font-weight: 600;font-size: 14px">${division || "-"}</label>
        </div>
          <div class="col-4 " style="text-align: left">
          <label style="color:#9F9FA5;display: block">Sub Division</label>
          <label style="font-weight: 600;font-size: 14px">${subDivision || "-"}</label>
        </div>
          <div class="col-12">
            <hr style="margin-right: 10px">
        </div>
        <div class="col-2 " style="text-align: left;border-right:1px solid #BFBFC2">
          <label style="color:#9F9FA5;display: block;">Department</label>
          <label style="font-weight: 600;font-size: 14px">${department || "-"}</label>
        </div>
        <div class="col-3 " style="text-align: left;border-right:1px solid #BFBFC2">
          <label style="color:#9F9FA5;display: block">Section</label>
          <label style="font-weight: 600;font-size: 14px">${detailInfo?.section || "-"}</label>
        </div>
          <div class="col-3 " style="text-align: left;border-right:1px solid #BFBFC2">
          <label style="color:#9F9FA5;display: block;">Career Type</label>
          <label style="font-weight: 600;font-size: 14px">${careerType || "-"}</label>
        </div>
          <div class="col-4 " style="text-align: left">
          <label style="color:#9F9FA5;display: block">Career Level</label>
          <label style="font-weight: 600;font-size: 14px">${careerLevel || "-"}</label>
          </label>
        </div>
          <div class="col-12">
            <hr style="margin-right: 10px">
        </div>
        <div class="col-2 " style="text-align: left;border-right:1px solid #BFBFC2">
          <label style="color:#9F9FA5;display: block;">Abbrv Position</label>
          <label style="font-weight: 600;font-size: 14px">${detailInfo?.abbrvPosition || "-"}</label>
        </div>
        <div class="col-3 " style="text-align: left;border-right:1px solid #BFBFC2">
          <label style="color:#9F9FA5;display: block">KBO</label>
          <label style="font-weight: 600;font-size: 14px">${unit?.kbo || "-"}</label>
        </div>
          <div class="col-3 " style="text-align: left;border-right:1px solid #BFBFC2">
          <label style="color:#9F9FA5;display: block;">Cost Center</label>
          <label style="font-weight: 600;font-size: 14px">${unit?.costCenterDescription || "-"}</label>
        </div>
          <div class="col-4 " style="text-align: left">
          <label style="color:#9F9FA5;display: block">Personnel Area</label>
          <label style="font-weight: 600;font-size: 14px">${personArea?.personnelAreaCode || "-"}</label>
        </div>
        <div class="col-12">
            <hr style="margin-right: 10px">
        </div>
        <div class="col-2 " style="text-align: left;border-right:1px solid #BFBFC2">
          <label style="color:#9F9FA5;display: block;">Personnel Area Name</label>
          <label style="font-weight: 600;font-size: 14px">${personArea?.personnelAreaName || "-"}</label>
        </div>
        <div class="col-3 " style="text-align: left;border-right:1px solid #BFBFC2">
          <label style="color:#9F9FA5;display: block">Personnel Sub Area</label>
          <label style="font-weight: 600;font-size: 14px">${personSubArea?.personnelSubAreaCode || "-"}</label>
        </div>
          <div class="col-3 " style="text-align: left;border-right:1px solid #BFBFC2">
          <label style="color:#9F9FA5;display: block;">Personnel Sub Area Name</label>
          <label style="font-weight: 600;font-size: 14px">${personSubArea?.personnelSubAreaName || "-"}</label>
        </div>
          <div class="col-4 " style="text-align: left">
          <label style="color:#9F9FA5;display: block">SK Number</label>
          <label style="font-weight: 600;font-size: 14px">${incumbent[0]?.sourceOfSk || "-"}</label>
        </div>
    `;
    const cardsgContent = (() => {
      const groups = infoSkillGroup || [];
      const titles = ["Main", "Second", "Third"];
      return [0, 1, 2]
        .map((i) => {
          const g = groups[i] || {};
          const extraClass = i === 2 ? "mb-2" : "";
          const extraStyle = i === 2 ? "margin-right:10px;" : "";
          return `
        <div class="col-4 ${extraClass}">
          <div style="padding-top: 20px;display:flex">
          <div style="padding:10px;margin-top:10px;${extraStyle}border:1px solid #BFBFC2;width: 100%;border-radius: 5px;">
            <label style="color:#9F9FA5;fonti-size:12px">${titles[i]} Skill Group</label><br/>
            <label style="font-weight: 600;font-size: 14px">${g.skillGroupName || "-"}</label><br/>

            <label class="mt-2" style="color:#9F9FA5;fonti-size:12px">${titles[i]} Sub Skill Group</label><br/>
            <label style="font-weight: 600;font-size: 14px">${g.subSkillGroupName || "-"}</label>
          </div>
          </div>
        </div>
        `;
        })
        .join("");
    })();
    const cardIncumbent = `
        <div class="col-3">
          <label style="color:#9F9FA5;fonti-size:12px">Employee ID</label><br/>
          <label style="font-weight: 600;font-size: 14px">${incumbent[0]?.employeeId || "-"}</label><br/>
        </div>
        <div class="col-3">
          <label style="color:#9F9FA5;fonti-size:12px">Employee Name</label><br/>
          <label style="font-weight: 600;font-size: 14px">${incumbent[0]?.employeeName || "-"}</label><br/>
        </div>
        <div class="col-6">
          <label style="color:#9F9FA5;fonti-size:12px">Person Grade</label><br/>
          <label style="font-weight: 600;font-size: 14px">${incumbent[0]?.prlPlan || "-"}</label><br/>
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

async function handleShowJobdesc() {
  const detailJob = getState("detailJob");
  const draftSoId = getState("draftSoId");

  const isMaster = draftSoId === null || draftSoId === undefined || draftSoId === "";
  const urlJobDesc = `/job-description/detail?master=true&jobId=${detailJob.unitCode}&prlOrg=${detailJob.prlOrg}`;
  window.open(urlJobDesc, "_blank");
}
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
    prlOrg: [detailJob.prlOrg],
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
      setState("actionExport", "searchByPosition");
      setState("resultProsbis", resultMatrix.data);
      setState("resultJabatan", resultPosition.data);
      setState("totalProsbis", resultMatrix.totalResult);
      setState("totalJob", resultPosition.totalResult);
      loadTableBody(resultMatrix.data);
      loadTableHeader(resultPosition.data);
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
