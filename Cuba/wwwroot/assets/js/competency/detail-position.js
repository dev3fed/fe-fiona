const modalInfoPosition = async (code, prl) => {
  try {
    const dataSource = $("#dataSource-competency").val();
    const payload = {
      dataSource: dataSource,
      page: 1,
      pageSize: 10,
    };
    const queryString = `${code}/${prl}?` + new URLSearchParams(payload).toString();
    const result = await fetchDetailPositionInfo(queryString);
    if (result.success === true) {
      const detailInformation = result?.data.jobDetail[0];
      setState("jobInformation", detailInformation);
      if (detailInformation) {
        const positionName = `
        <span style="font-weight: bold;margin-bottom:5px">${detailInformation.positionName}</span> <br/>
         <small style="color:#9F9FA5">
            PRL Org: ${detailInformation.prlOrg},Formation Total : ${detailInformation.formation}
         </small>
        `;
        const bodyInfo = `
        <div class="col-2" style="text-align: left; border-right: 1px solid #BFBFC2;">
            <label style="color: #9F9FA5; display: block;">ID Org Unit</label>
            <label style="font-weight: 600; font-size: 14px">${detailInformation.unitCode}</label>
        </div>
        <div class="col-3 " style="text-align: left;border-right:1px solid #BFBFC2">
          <label style="color:#9F9FA5;display: block">Org Unit</label>
          <label style="font-weight: 600;font-size: 14px">${detailInformation.unitName}</label>
        </div>
          <div class="col-3 " style="text-align: left;border-right:1px solid #BFBFC2">
          <label style="color:#9F9FA5; display: block;">ID Position</label>
          <label style="font-weight: 600;font-size: 14px">${detailInformation.positionCode}</label>
        </div>
          <div class="col-4 " style="text-align: left">
          <label style="color:#9F9FA5;display: block">Position Name</label>
          <label style="font-weight: 600;font-size: 14px">${detailInformation.positionName}</label>
        </div>
        <div class="col-12">
            <hr style="margin-right: 10px">
        </div>
        <div class="col-2 " style="text-align: left;border-right:1px solid #BFBFC2">
          <label style="color:#9F9FA5;display: block;">ID Org Unit Parent</label>
          <label style="font-weight: 600;font-size: 14px">${detailInformation.parentUnitCode}</label>
        </div>
        <div class="col-3 " style="text-align: left;border-right:1px solid #BFBFC2">
          <label style="color:#9F9FA5;display: block">Org Unit Parent</label>
          <label style="font-weight: 600;font-size: 14px">${detailInformation.parentUnitName}</label>
        </div>
          <div class="col-3 " style="text-align: left;border-right:1px solid #BFBFC2">
          <label style="color:#9F9FA5;display: block;">ID Position Direct Report</label>
          <label style="font-weight: 600;font-size: 14px">${
            detailInformation.parentPositionCode ? detailInformation.parentPositionCode : "-"
          }</label>
        </div>
          <div class="col-4 " style="text-align: left">
          <label style="color:#9F9FA5;display: block">Direct Report</label>
          <label style="font-weight: 600;font-size: 14px">${
            detailInformation.parentPositionName ? detailInformation.parentPositionName : "-"
          }</label>
        </div>
          <div class="col-12">
            <hr style="margin-right: 10px">
        </div>
        <div class="col-2 " style="text-align: left;border-right:1px solid #BFBFC2">
          <label style="color:#9F9FA5;display: block;">Directorate</label>
          <label style="font-weight: 600;font-size: 14px">${detailInformation.directorate}</label>
        </div>
        <div class="col-3 " style="text-align: left;border-right:1px solid #BFBFC2">
          <label style="color:#9F9FA5;display: block">Function</label>
          <label style="font-weight: 600;font-size: 14px">${
            detailInformation.functionName ? detailInformation.functionName : "-"
          }</label>
        </div>
          <div class="col-3 " style="text-align: left;border-right:1px solid #BFBFC2">
          <label style="color:#9F9FA5;display: block;">Division</label>
          <label style="font-weight: 600;font-size: 14px">${
            detailInformation.division ? detailInformation.division : "-"
          }</label>
        </div>
          <div class="col-4 " style="text-align: left">
          <label style="color:#9F9FA5;display: block">Sub Division</label>
          <label style="font-weight: 600;font-size: 14px">${
            detailInformation.subDivision ? detailInformation.subDivision : "-"
          }</label>
        </div>
          <div class="col-12">
            <hr style="margin-right: 10px">
        </div>
        <div class="col-2 " style="text-align: left;border-right:1px solid #BFBFC2">
          <label style="color:#9F9FA5;display: block;">Department</label>
          <label style="font-weight: 600;font-size: 14px">${
            detailInformation.department ? detailInformation.department : "-"
          }</label>
        </div>
        <div class="col-3 " style="text-align: left;border-right:1px solid #BFBFC2">
          <label style="color:#9F9FA5;display: block">Section</label>
          <label style="font-weight: 600;font-size: 14px">${
            detailInformation.section ? detailInformation.section : "-"
          }</label>
        </div>
          <div class="col-3 " style="text-align: left;border-right:1px solid #BFBFC2">
          <label style="color:#9F9FA5;display: block;">Career Type</label>
          <label style="font-weight: 600;font-size: 14px">${
            detailInformation.careerType ? detailInformation.careerType : "-"
          }</label>
        </div>
          <div class="col-4 " style="text-align: left">
          <label style="color:#9F9FA5;display: block">Career Level</label>
          <label style="font-weight: 600;font-size: 14px">${
            detailInformation.careerLevel ? detailInformation.careerLevel : "-"
          }</label>
        </div>
          <div class="col-12">
            <hr style="margin-right: 10px">
        </div>
        <div class="col-2 " style="text-align: left;border-right:1px solid #BFBFC2">
          <label style="color:#9F9FA5;display: block;">Abbrv Position</label>
          <label style="font-weight: 600;font-size: 14px">${
            detailInformation.abbrvPosition ? detailInformation.abbrvPosition : "-"
          }</label>
        </div>
        <div class="col-3 " style="text-align: left;border-right:1px solid #BFBFC2">
          <label style="color:#9F9FA5;display: block">KBO</label>
          <label style="font-weight: 600;font-size: 14px">${detailInformation.kbo ? detailInformation.kbo : "-"}</label>
        </div>
          <div class="col-3 " style="text-align: left;border-right:1px solid #BFBFC2">
          <label style="color:#9F9FA5;display: block;">Cost Center</label>
          <label style="font-weight: 600;font-size: 14px">${
            detailInformation.costCenter ? detailInformation.costCenter : "-"
          }</label>
        </div>
          <div class="col-4 " style="text-align: left">
          <label style="color:#9F9FA5;display: block">Personnel Area</label>
          <label style="font-weight: 600;font-size: 14px">${
            detailInformation.personnelArea ? detailInformation.personnelArea : "-"
          }</label>
        </div>
        <div class="col-12">
            <hr style="margin-right: 10px">
        </div>
        <div class="col-2 " style="text-align: left;border-right:1px solid #BFBFC2">
          <label style="color:#9F9FA5;display: block;">Personnel Area Name</label>
          <label style="font-weight: 600;font-size: 14px">${
            detailInformation.personnelAreaName ? detailInformation.personnelAreaName : "-"
          }</label>
        </div>
        <div class="col-3 " style="text-align: left;border-right:1px solid #BFBFC2">
          <label style="color:#9F9FA5;display: block">Personnel Sub Area</label>
          <label style="font-weight: 600;font-size: 14px">${
            detailInformation.personnelSubArea ? detailInformation.personnelSubArea : "-"
          }</label>
        </div>
          <div class="col-3 " style="text-align: left;border-right:1px solid #BFBFC2">
          <label style="color:#9F9FA5;display: block;">Personnel Sub Area Name</label>
          <label style="font-weight: 600;font-size: 14px">${
            detailInformation.personnelSubAreaName ? detailInformation.personnelSubAreaName : "-"
          }</label>
        </div>
          <div class="col-4 " style="text-align: left">
          <label style="color:#9F9FA5;display: block">SK Number</label>
          <label style="font-weight: 600;font-size: 14px">${
            detailInformation.skNumber ? detailInformation.skNumber : "-"
          }</label>
        </div>
      `;
        const cardsgContent = `
    <div class="col-4">
    <div style="padding-top: 20px;display:flex">
        <div style="padding:10px;margin-top:10px;border:1px solid #BFBFC2;width: 100%;border-radius: 5px;">
            <label style="color:#9F9FA5;fonti-size:12px">Main Skill Group</label><br/>
            <label style="font-weight: 600;font-size: 14px">${
              detailInformation.mainSkillGroup ? detailInformation.mainSkillGroup : "-"
            }</label><br/>

            <label class="mt-2" style="color:#9F9FA5;fonti-size:12px">Main Sub Skill Group</label><br/>
            <label style="font-weight: 600;font-size: 14px">${
              detailInformation.mainSubSkillGroup ? detailInformation.mainSubSkillGroup : "-"
            }</label>
        </div>
    </div>
    </div>
    <div class="col-4">
        <div style="padding-top: 20px;display:flex">
            <div style="padding:10px;margin-top:10px;border:1px solid #BFBFC2;width: 100%;border-radius: 5px;">
                <label style="color:#9F9FA5;fonti-size:12px">Second Skill Group</label><br/>
                <label style="font-weight: 600;font-size: 14px">${
                  detailInformation.secondSkillGroup ? detailInformation.secondSkillGroup : "-"
                }</label><br/>

                <label class="mt-2" style="color:#9F9FA5;fonti-size:12px">Second Sub Skill Group</label><br/>
                <label style="font-weight: 600;font-size: 14px">${
                  detailInformation.secondSubSkillGroup ? detailInformation.secondSubSkillGroup : "-"
                }</label>
            </div>
        </div>
    </div>
    <div class="col-4 mb-2">
        <div style="padding-top: 20px;display:flex">
            <div style="padding:10px;margin-top:10px;margin-right:10px;border:1px solid #BFBFC2;width: 100%;border-radius: 5px;">
                <label style="color:#9F9FA5;fonti-size:12px">Third Skill Group</label><br/>
                <label style="font-weight: 600;font-size: 14px">${
                  detailInformation.thirdSkillGroup ? detailInformation.thirdSkillGroup : "-"
                }</label><br/>

                <label class="mt-2" style="color:#9F9FA5;fonti-size:12px">Third Sub Skill Group</label><br/>
                <label style="font-weight: 600;font-size: 14px">${
                  detailInformation.thirdSubSkillGroup ? detailInformation.thirdSubSkillGroup : "-"
                }</label>
            </div>
        </div>
    </div>
    `;
        const cardIncumbent = `
        <div class="col-3">
            <label style="color:#9F9FA5;fonti-size:12px">Employee ID</label><br/>
            <label style="font-weight: 600;font-size: 14px">${detailInformation.incumbentEmployeeId}</label><br/>
        </div>
        <div class="col-3">
            <label style="color:#9F9FA5;fonti-size:12px">Employee Name</label><br/>
            <label style="font-weight: 600;font-size: 14px">${detailInformation.incumbentEmployeeName}</label><br/>
        </div>
        <div class="col-6">
            <label style="color:#9F9FA5;fonti-size:12px">PRL Plan Comp</label><br/>
            <label style="font-weight: 600;font-size: 14px">${detailInformation.prlPlanComp}</label><br/>
        </div>
`;
        const jobInfo = document.getElementById("job-info");
        const sgContent = document.getElementById("skill-group-content");
        const incContent = document.getElementById("incumbent-content");
        const positionLabel = document.getElementById("position-name");
        if (sgContent && jobInfo) {
          sgContent.innerHTML = cardsgContent;
          jobInfo.innerHTML = bodyInfo;
          incContent.innerHTML = cardIncumbent;
          positionLabel.innerHTML = positionName;
        }
      }
    }
  } catch (error) {}
};

const cardTblMandatory = async (code, prl) => {
  const dataSource = $("#dataSource-competency").val();
  const payload = `${dataSource}/${code}/${prl}`;
  try {
    const result = await fetchDetailPositionMandatory(payload);
    const mandatoryNoData = document.getElementById("mandatory-no-data");
    const mandatoryContent = document.getElementById("mandatory-content");
    if (mandatoryContent) {
      mandatoryContent.style.display = result.data !== undefined ? "block" : "none";
    }
    if (mandatoryNoData) {
      mandatoryNoData.style.display = result.data !== undefined ? "none" : " block";
    }
    if (result.success === true) {
      const listMandatory = result?.data.compData || [];
      const labelMandatory = document.getElementById("labelMandatory");

      if (labelMandatory) {
        labelMandatory.innerHTML = `Mandatory (${listMandatory.length}/5)`;
      }
      const theadMandatory = `
          <tr>
            <th scope="col" style="width: 40px;text-align:center">No</th>
            <th scope="col" style="width: 400px">Competency</th>
            <th scope="col" style="width: 150px;text-align:center">Proficiency Level</th>
            <th scope="col" style="width: 70px;text-align:center">Action</th>

          </tr>`;

      const bodyMandatory = listMandatory
        .map((element, i) => {
          return `
            <tr>
              <td  style="text-align:Center">${i + 1}</td>
              <td style="color:#03a9f4; cursor:pointer;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'" onclick="handleDetailInfo('Mandatory','${
                element.compCode
              }')">${element.name}</td>
              <td style="text-align:Center">${element.proficiencyLevel}</td>
              <td style="text-align:Center">
                <img src="/assets/images/rasci/pencil_rasci.svg" alt="Pencil Icon" style="width: 15px; height: 20px; cursor: pointer;" onclick="openEditDepthLevel(${JSON.stringify(
                  element,
                ).replace(/"/g, "&quot;")},${code},${prl});">

              </td>
            </tr>`;
        })
        .join("");

      document.getElementById("mandatory-competency-header").innerHTML = theadMandatory;
      document.getElementById("mandatory-competency-body").innerHTML = bodyMandatory;
    }
  } catch (error) {
    console.error(error);
  }
};

const cardTblGeneral = async (code, prl) => {
  const dataSource = $("#dataSource-competency").val();
  const payload = `${dataSource}/${code}/${prl}`;

  try {
    const result = await fetchDetailPositionTechnical(payload);
    const generalNoData = document.getElementById("general-no-data");
    const generalContent = document.getElementById("general-competency-content");
    if (generalContent) {
      generalContent.style.display = result.data !== undefined ? "block" : "none";
    }
    if (generalNoData) {
      generalNoData.style.display = result.data !== undefined ? "none" : " block";
    }

    if (result.success === true) {
      const listTechnical = result?.data.compData || [];
      const generalCompetencies = listTechnical.filter((element) => element.compType.toLowerCase() === "general");
      const labelCore = document.getElementById("labelCore");
      if (labelCore) {
        labelCore.innerHTML = `General (${generalCompetencies.length}/3)`;
      }

      const theadTechnical = `
            <tr>
              <th scope="col" style="width: 40px;text-align:center">No</th>
              <th scope="col" style="width: 300px">Competency</th>
              <th scope="col" style="width: 160px;text-align:center">Proficiency Level</th>
            <th scope="col" style="width: 70px;text-align:center">Action</th>

            </tr>`;

      const bodyTechnical = listTechnical
        .filter((element) => element.compType.toLowerCase() === "general")
        .map((element, i) => {
          return `
              <tr>
                <td  style="text-align:Center">${i + 1}</td>
                <td style="color:#03a9f4; cursor:pointer;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'" onclick="handleDetailInfo('General','${
                  element.compCode
                }')">
                ${element.compName}</td>
                <td style="text-align:Center">${element.level}</td>
               <td style="text-align:Center">
                  <img src="/assets/images/rasci/pencil_rasci.svg" alt="Pencil Icon" style="width: 15px; height: 20px; cursor: pointer;" onclick="openEditDepthLevel(${JSON.stringify(
                    element,
                  ).replace(/"/g, "&quot;")},${code},${prl});">
              </td>
              </tr>`;
        })
        .join("");

      document.getElementById("technical-competency-header").innerHTML = theadTechnical;
      document.getElementById("technical-competency-body").innerHTML = bodyTechnical;
    }
  } catch (error) {
    console.error(error);
  }
};

const cardTblSpecific = async (code, prl) => {
  const dataSource = $("#dataSource-competency").val();
  const payload = `${dataSource}/${code}/${prl}`;

  try {
    const result = await fetchDetailPositionTechnical(payload);
    const specificNoData = document.getElementById("specific-no-data");
    const specificContent = document.getElementById("specific-competency-content");
    if (specificContent) {
      specificContent.style.display = result.data !== undefined ? "block" : "none";
    }
    if (specificNoData) {
      specificNoData.style.display = result.data !== undefined ? "none" : " block";
    }
    if (result.success === true) {
      const listTechnical = result?.data.compData || [];
      const specificCompetencies = listTechnical.filter((element) => element.compType.toLowerCase() === "specific");
      const labelSpecific = document.getElementById("labelSpecific");
      const specificNoData = document.getElementById("specific-no-data");

      if (specificNoData) {
        specificNoData.style.display = specificCompetencies.length > 0 ? "none" : " block";
      }
      if (labelSpecific) {
        labelSpecific.innerHTML = `Specific (${specificCompetencies.length}/9)`;
      }
      const theadTechnical = `
            <tr>
              <th scope="col" style="width: 40px;text-align:center">No</th>
              <th scope="col" style="width: 300px">Competency</th>
              <th scope="col" style="width: 160px;text-align:center">Proficiency Level</th>
            <th scope="col" style="width: 70px;text-align:center">Action</th>

            </tr>`;

      const bodyTechnical = listTechnical
        .filter((element) => element.compType.toLowerCase() === "specific")
        .map((element, i) => {
          return `
              <tr>
                <td  style="text-align:Center">${i + 1}</td>
                <td style="color:#03a9f4; cursor:pointer;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'" onclick="handleDetailInfo('Specific','${
                  element.compCode
                }')">${element.compName}</td>
                <td style="text-align:Center">${element.level}</td>
                <td style="text-align:Center">
                  <img src="/assets/images/rasci/pencil_rasci.svg" alt="Pencil Icon" style="width: 15px; height: 20px; cursor: pointer;" onclick="openEditDepthLevel(${JSON.stringify(
                    element,
                  ).replace(/"/g, "&quot;")},${code},${prl})">
              </td>
              </tr>`;
        })
        .join("");

      document.getElementById("technical-specifit-header").innerHTML = theadTechnical;
      document.getElementById("technical-specifit-body").innerHTML = bodyTechnical;
    }
  } catch (error) {
    console.error(error);
  }
};
const cardTblBehavior = async (code, prl) => {
  const dataSource = $("#dataSource-competency").val();
  const payload = {
    dataSource: dataSource,
    unitCode: code,
    prlOrg: prl,
  };
  const queryString = "/unitprl?" + new URLSearchParams(payload).toString();

  try {
    const result = await fetchDetailPositionBehavior(queryString);
    const behaviorNoData = document.getElementById("behavior-no-data");
    const behaviorContent = document.getElementById("behavior-content");
    if (behaviorContent) {
      behaviorContent.style.display = result.data.behaviourList.length > 0 ? "block" : "none";
    }
    if (behaviorNoData) {
      behaviorNoData.style.display = result.data.behaviourList.length > 0 ? "none" : " block";
    }
    if (result.success === true) {
      const listBehavior = result?.data.behaviourList[0]?.behaviouralDictionary || [];
      const theadMandatory = `
          <tr>
            <th scope="col" style="width: 40px;text-align:center">No</th>
            <th scope="col" style="width: 400px">Competency</th>
          </tr>`;

      const bodyMandatory = listBehavior
        .map((element, i) => {
          return `
            <tr>
              <td  style="text-align:Center">${i + 1}</td>
              <td style="color:#03a9f4; cursor:pointer;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'" onclick="onBehaviorClick('Behavior','${
                element.id
              }')">${element.behaviourDict}</td>
            </tr>`;
        })
        .join("");

      document.getElementById("mandatory-behavior-header").innerHTML = theadMandatory;
      document.getElementById("mandatory-behavior-body").innerHTML = bodyMandatory;
    }
  } catch (error) {
    console.error(error);
  }
};

// const modalTabBehavior = async (code) => {
//   const dataSource = $("#dataSource-competency").val();
//   const payload = {
//     dataSource: dataSource,
//     positionCode: code,
//   };
//   const queryString = "?" + new URLSearchParams(payload).toString();

//   try {
//     const result = await fetchDetailPositionBehavior(queryString);
//     if (result.success === true) {
//       const listBehavior = result?.data.behaviourList[0].behaviouralDictionary || [];
//       console.log("listBehavior", listBehavior);

//       let html =
//         '<div style="display: grid; grid-auto-flow: column; grid-template-rows: repeat(5, auto); gap: 15px 40px; padding-left: 10px;">';

//       listBehavior.forEach((item) => {
//         html += `<div style="white-space: nowrap; color: #03a9f4; font-size: 12px; cursor: pointer;" onclick="onBehaviorClick('Behavior','${item.id}')">${item.behaviourDict}</div>`;
//       });

//       html += "</div>";

//       document.getElementById("behavior-competency-body").innerHTML = html;
//     }
//   } catch (error) {
//     console.error(error);
//   }
// };

const onBehaviorClick = async (type, code) => {
  try {
    const dataDetail = await fetchCompeBehaviorDetail(code);
    const modalElement = document.getElementById("ModalDetailPos");
    const closeModal = bootstrap.Modal.getInstance(modalElement);
    if (closeModal) {
      closeModal.hide();
    }
    const modal = new bootstrap.Modal(document.getElementById("ModalDetailKkj"));
    modal.show();
    const modalTitle = document.getElementById("ModalDetailKkjTitle");
    if (modalTitle) {
      modalTitle.innerHTML = `${type} Competency Detail`;
    }
    const formContent = `
    <div class="col-12 scrollable-content" style="min-height: 620px;">
        <div class="mb-2">
          <h6 style="font-weight:bold">${dataDetail.data.behaviour_list} </h6>
        </div>
      ${cardDefinition("Definition", dataDetail?.data.definition, true)}
      ${cardDetailBehavior(dataDetail.data.detail)}
    </div>
  `;

    const modalBodyContent = document.getElementById("body-detailKkj");
    if (modalBodyContent) {
      modalBodyContent.innerHTML = formContent;
    }
  } catch (error) {}
};
const cardDefinition = (title, content, isDefinition = false) => {
  const cardContent = isDefinition
    ? `<div class="custom-row-full">
         <label>${content}</label>
       </div>`
    : `<div class="custom-row-full">
         <ul style="list-style-type: disc; margin-left: 20px; font-size: 13px;">
           ${content.map((item) => `<li>${item}</li>`).join("")}
         </ul>
       </div>`;

  return `
    <div class="custom-card-approval">
      <div class="header-card-approval">
        ${title}
      </div>
      <div${isDefinition ? "" : ' style="padding-top: 10px;"'}>
        ${cardContent}
      </div>
    </div>`;
};
const cardDetailBehavior = (details) => {
  return details.map((item) => cardDefinition(item.key, item.descriptions)).join("");
};
async function handleDetailInfo(type, code) {
  try {
    // close modal ModalDetailPos
    const modalElement = document.getElementById("ModalDetailPos");
    const closeModal = bootstrap.Modal.getInstance(modalElement);
    if (closeModal) {
      closeModal.hide();
    }
    const dataDetail = type != "Behavior" ? await fetchCompetencyDetail(code) : await fetchCompeBehaviorDetail(code);
    const modal = new bootstrap.Modal(document.getElementById("ModalDetailKkj"));

    modal.show();
    const modalTitle = document.getElementById("ModalDetailKkjTitle");
    if (modalTitle) {
      modalTitle.innerHTML = `${type} Competency Detail`;
    }
    const formContent = `
    <div class="col-12 scrollable-content" style="min-height: 620px;">
        <div class="mb-2">
          <h6 style="font-weight:bold">${dataDetail.data.compName} </h6>
        </div>

        <div class="custom-card-approval">
            <div class="header-card-approval">
                Definition
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
                    ${dataDetail?.data.levels[1].map((item) => `<li> ${item}</li>`).join("")}
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
                    ${dataDetail?.data.levels[2].map((item) => `<li> ${item}</li>`).join("")}
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
                    ${dataDetail?.data.levels[3].map((item) => `<li> ${item}</li>`).join("")}
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
                    ${dataDetail?.data.levels[4].map((item) => `<li> ${item}</li>`).join("")}
                    </ul>
                </div>
            </div>
        </div>
    </div>
    <div class="col-12">
  `;

    const modalBodyContent = document.getElementById("body-detailKkj");
    if (modalBodyContent) {
      modalBodyContent.innerHTML = formContent;
    }
  } catch (error) {}
}

const handleCloseBehavior = async () => {
  const payload = getState("payloadDetailJob");

  await modalInfoPosition(payload.unitCode, payload.prlOrg);
  await cardTblMandatory(payload.unitCode, payload.prlOrg);
  await cardTblGeneral(payload.unitCode, payload.prlOrg);
  await cardTblSpecific(payload.unitCode, payload.prlOrg);
  await cardTblBehavior(payload.unitCode, payload.prlOrg);

  const closeModal = document.getElementById("ModalDetailKkj");
  if (closeModal) {
    const bootstrapModal = bootstrap.Modal.getInstance(closeModal);
    bootstrapModal.hide();
  }
  const modal = new bootstrap.Modal(document.getElementById("ModalDetailPos"));
  modal.show();
};

const openEditDepthLevel = (element, code, prl) => {
  const jobCode = `${code};${prl}`;
  const compCode = element.compCode;
  const compeType = element.compType;
  const modal = document.getElementById("ModalDetailPos");
  openModalEditDepth(jobCode, compCode, compeType);

  if (modal) {
    const bootstrapModal = bootstrap.Modal.getInstance(modal);
    bootstrapModal.hide();
  }
};
