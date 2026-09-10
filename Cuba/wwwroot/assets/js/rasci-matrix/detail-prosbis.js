const detailsProsbis = async () => {
  try {
    const modal = new bootstrap.Modal(document.getElementById("modalBusinessPro"));
    modal.show();
    const dataDetailProsbis = getState("dataDetailProsbis");
    const payload = {
      draftRasciId: dataDetailProsbis.draftRasci,
      draftSOId: dataDetailProsbis.draftSo,
    };
    const queryString = new URLSearchParams(payload).toString();
    const result = await fetchRelatedJob(dataDetailProsbis.indexNumber, queryString);
    console.log("result", result);
    const dataJob = result.data.relatedPosition;
    const dataHierarchy = result.data.businessProcess;
    const dataDefinition = result.data.definitionInputOutput;
    const bodyTitle = `
    <div class="mb-2" id="prosbis-title">
                    <h6 class="mb-2" style="font-weight: bold;">${dataDetailProsbis.description}</h6>
                    <label>Level ${dataDetailProsbis.level} | Index ${dataDetailProsbis.indexNumber}</label>
                </div>
    `;
    document.getElementById("prosbis-title").innerHTML = bodyTitle;
    layoutTabProsbis(dataJob);
    layoutTabDefinition(dataDefinition);
    layoutTabHierarchy(dataHierarchy, dataDetailProsbis.indexNumber);
    layoutTabCompetency();
  } catch (error) {}
};

const layoutTabDefinition = (data) => {
  console.log("data");
  const formContent = `
    <div class="col-12 scrollable-content"  style="max-height: 300px; overflow-y: auto;">
        <div class="custom-card-approval">
            <div class="header-card-approval">
                Definition
            </div>
            <div>
                <div class=" custom-row-full">
                    <label>${data?.definition || "-"}</label>
                </div>
            </div>
        </div>
         <div class="custom-card-approval">
            <div class="header-card-approval">
                Input
            </div>
           <div style="padding-top: 10px;">
                <div class=" custom-row-full">
                    <ul style="list-style-type: disc; margin-left: 20px;font-size: 13px;">
                   ${Array.isArray(data?.input) ? data.input.map((item) => `<li> ${item}</li>`).join("") || "-" : "-"}
                    </ul>
                </div>
            </div>
        </div>
          <div class="custom-card-approval">
            <div class="header-card-approval">
                Output/Product/Deliverables
            </div>
            <div style="padding-top: 10px;">
                <div class=" custom-row-full">
                    <ul style="list-style-type: disc; margin-left: 20px;font-size: 13px;">
                    ${Array.isArray(data?.output) ? data.output.map((item) => `<li> ${item}</li>`).join("") || "-" : "-"}
                    </ul>
                </div>
            </div>
        </div>
    </div>
   
  `;

  const bodyDefinition = document.getElementById("body-definition");
  if (bodyDefinition) {
    bodyDefinition.innerHTML = formContent;
  }
};
const layoutTabProsbis = (data) => {
  let countR = 0;
  let countA = 0;
  let countS = 0;
  let countC = 0;
  let countI = 0;
  let countComments = 0;
  data.forEach((item) => {
    item.notation.forEach((note) => {
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
  <p>Total Position : ${data.length} |
    <img src="/assets/images/rasci/r.svg" alt="R Icon" style="margin-top:-4px;padding-left:5px"><label style="padding-left:5px">${countR}</label> 
    <img src="/assets/images/rasci/a.svg" alt="A Icon" style="margin-top:-4px;padding-left:5px"><label style="padding-left:5px">${countA}</label> 
    <img src="/assets/images/rasci/s.svg" alt="S Icon" style="margin-top:-4px;padding-left:5px"><label style="padding-left:5px">${countS}</label> 
    <img src="/assets/images/rasci/c.svg" alt="C Icon" style="margin-top:-4px;padding-left:5px"><label style="padding-left:5px">${countC}</label> 
    <img src="/assets/images/rasci/i.svg" alt="I Icon" style="margin-top:-4px;padding-left:5px"><label style="padding-left:5px">${countI}</label> 
    <img src="/assets/images/rasci/comment.svg" alt="Comment Icon" style="margin-top:-4px;padding-left:5px"><label style="padding-left:5px">${countComments}</label>
  </p>`;
  theadContent = `<tr>
          <th scope="col" style="width: 50px;text-align:center">
          No 
          </th>
          <th scope="col" style="width: 230px">Position</th>
          <th scope="col" style="width: 120px">Directorate</th>
          <th scope="col">Division</th>
          <th scope="col">Sub Division</th>
          <th scope="col">Department</th>
          <th scope="col">Section</th>
          <th scope="col" style="width: 140px;text-align:center">RASCI Notation</th>
        </tr>`;
  bodyContent = `<tr>
    ${data
      ?.map((item, index) => {
        let rasciIcons = "";
        let comments = [];
        item.notation.forEach((value) => {
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
          <th scope="row" style="text-align:center">
          ${index + 1}
          </th>
          <td>${item.positionName || "-"}</td>
          <td>${item.functionName || "-"}</td>
          <td>${item.divisionName || "-"}</td>
          <td>${item.subDivisionName || "-"}</td>
          <td>${item.departmentName || "-"}</td>
          <td>${item.sectionName || "-"}</td>
          <td>
            <div class="rasci-container">
              <div class="rasci-icons">${rasciIcons}</div>
            </div>
          </td> 
        </tr>`;
      })
      .join("")}`;

  document.getElementById("job-details-header").innerHTML = theadContent;
  document.getElementById("job-details-body").innerHTML = bodyContent;
  document.getElementById("total-job").innerHTML = totalJob;
  initializeTooltips();
};
const layoutTabHierarchy = (data, indexNumber) => {
  const theadContentHierarchy = `<tr>
  <th scope="col" style="width: 80px;text-align:center">Level</th>
  <th scope="col" style="width: 120px;text-align:left">Index</th>
  <th scope="col" style="text-align:left">Business Process</th>
</tr>`;
  const bodyContentHierarchy = data
    .map((item) => {
      const levelClass =
        indexNumber == item.indexNumber ? `level-${item.level} highlight` : item.level ? `level-${item.level}` : "";
      return `
      <tr class="clusterize-cluster ${levelClass}">
        <td class="level-col" style="text-align:center">L${item.level}</td>
        <td class="level-col" style="text-align:left">${item.indexNumber}</td>
        <td class="level-col" style="text-align:left">
        <div class="prosbis-cell-wrapper">
        ${item.description}
        </div>
        </td>
      </tr>`;
    })
    .join("");
  document.getElementById("prosbis-hierarchy-header").innerHTML = theadContentHierarchy;
  document.getElementById("prosbis-hierarchy-body").innerHTML = bodyContentHierarchy;
};

// const layoutTabCompetency = () => {
//   theadContentCompetency = `<tr>
//   <th scope="col" style="width: 50px">No</th>
//   <th scope="col" style="width: 240px">Skill Group</th>
//   <th scope="col" style="width: 240px">Sub Skill Group</th>
//   <th scope="col">Competency</th>
// </tr>`;
//   bodyContentCompetency = `<tr>
// <td></td>
// <td>Otto</td>
// <td>Otto</td>
// <td>Otto</td>
// </tr>`;
//   document.getElementById("prosbis-competencies-header").innerHTML =
//     theadContentCompetency;
//   document.getElementById("prosbis-competencies-body").innerHTML =
//     bodyContentCompetency;
// };

const handleDetailDeletebp = () => {
  const dataDetailProsbis = getState("dataDetailProsbis");
  const modalBusinessPro = document.getElementById("modalBusinessPro");
  const modal = bootstrap.Modal.getInstance(modalBusinessPro);
  if (modal) {
    modal.hide();
  }
  checkChildrenProsbis(dataDetailProsbis);
};

const handleDetailEditbp = () => {
  const dataDetailProsbis = getState("dataDetailProsbis");
  const modalBusinessPro = document.getElementById("modalBusinessPro");
  const modal = bootstrap.Modal.getInstance(modalBusinessPro);
  if (modal) {
    modal.hide();
  }
  sendDetailbp(dataDetailProsbis);
};

const handleCheckSeriesLevel = (event) => {
  const level = parseInt(event.target.id.replace("prosbis-l", ""));
  let selectedLevels = getState("levelSeries") || [];

  if (event.target.checked) {
    if (!selectedLevels.includes(level)) {
      selectedLevels.push(level);
    }
  } else {
    const index = selectedLevels.indexOf(level);
    if (index > -1) {
      selectedLevels.splice(index, 1);
    }
  }

  setState("levelSeries", selectedLevels);
};

const openSeiesOfProcess = () => {
  const modal = new bootstrap.Modal(document.getElementById("ModalSeriesProses"));
  modal.show();
  const dataDetailProsbis = getState("dataDetailProsbis");
  const bodyTitle = `
    <div class="col-12">
      <h6 class="mb-2" style="font-weight: bold;">${dataDetailProsbis.description}</h6>
      <label>Level ${dataDetailProsbis.level} | Index ${dataDetailProsbis.indexNumber}</label>
      <hr/>
    </div>
    <div class="col-12 mb-3">
      <span style="color: #595962;">Select Business Process level to show</span>
    </div>
    <div class="col-12">
      <div class="animate-chk">
        ${[1, 2, 3, 4, 5, 6]
          .map(
            (level) => `
          <label class="d-inline-block" for="chk-prosbis-${level}" style="width: 80px;">
            <input class="checkbox_animated" id="prosbis-l${level}" type="checkbox">
            L${level}
          </label>
        `,
          )
          .join("")}
      </div>
    </div>
  `;

  document.getElementById("series-proses").innerHTML = bodyTitle;

  for (let i = 1; i <= 6; i++) {
    const checkbox = document.getElementById(`prosbis-l${i}`);
    if (checkbox) {
      checkbox.addEventListener("change", handleCheckSeriesLevel);
    }
  }
};

const applySeriesProses = async () => {
  try {
    const levelSeries = getState("levelSeries");
    const spinner = document.getElementById("applySeries");
    const dataDetailProsbis = getState("dataDetailProsbis");
    const draftSoId = getState("draftSoId");
    const draftRasciId = getState("draftRasciId");
    spinner.style.display = "inline-block";
    const payloadByBusiness = {
      draftRasciId: draftRasciId == "master" ? null : draftRasciId,
      level: levelSeries,
      indexNumber: [dataDetailProsbis.indexNumber],
      expandNumber: [],
      row: 1,
      rowSize: 15,
    };
    setState("idSearchProsbis", dataDetailProsbis.indexNumber);
    const resultMatrix = await fetchProsbisMatrix(payloadByBusiness);
    const combineIndex = resultMatrix.data.map((val) => val.indexNumber);
    if (resultMatrix.success === true) {
      const payloadJob = {
        col: 1,
        colSize: 10,
        draftRasciId: draftRasciId == "master" ? null : draftRasciId,
        indexNumber: [dataDetailProsbis.indexNumber],
        prlOrg: [],
        unitCode: [],
        draftSoId: draftSoId || null,
      };
      const resultPosition = await fetchPositionMatrix(payloadJob);

      const ModalSeriesProses = document.getElementById("ModalSeriesProses");
      const modal = bootstrap.Modal.getInstance(ModalSeriesProses);
      const modalBusinessPro = document.getElementById("modalBusinessPro");
      const modalProsbis = bootstrap.Modal.getInstance(modalBusinessPro);
      setState("isSearchMatrix", true);
      setState("levelSeries", []);
      setState("payloadProsbis", payloadByBusiness);
      setState("payloadPosition", payloadJob);
      setState("actionType", "BP_THEN_JOB");
      setState("resultProsbis", resultMatrix.data);
      setState("resultJabatan", resultPosition.data);
      setState("totalProsbis", resultMatrix.totalResult);
      setState("totalJob", resultPosition.totalResult);
      loadTableBody(resultMatrix.data);
      loadTableHeader(resultPosition.data);
      mapRasciCells(combineIndex, resultPosition.data);
      if (modal && modalProsbis) {
        modal.hide();
        modalProsbis.hide();
        spinner.style.display = "none";
      }
    } else {
      setState("levelSeries", []);
      setTimeout(() => {
        spinner.style.display = "none";
      }, 2000);
    }
  } catch (error) {}
};

const showRasciMatrixBybp = async () => {
  const dataDetailProsbis = getState("dataDetailProsbis");
  const draftSoId = getState("draftSoId");
  const draftRasciId = getState("draftRasciId");
  const spinner = document.getElementById("showRasci");
  spinner.style.display = "inline-block";
  try {
    const payloadByBusiness = {
      draftRasciId: draftRasciId == "master" ? null : draftRasciId,
      level: [],
      indexNumber: [dataDetailProsbis.indexNumber],
      expandNumber: [],
      row: 1,
      rowSize: 15,
    };
    try {
      const resultMatrix = await fetchProsbisMatrix(payloadByBusiness);
      const combineIndex = resultMatrix.data.map((val) => val.indexNumber);
      if (resultMatrix.success === true) {
        const payloadJob = {
          col: 1,
          colSize: 10,
          draftRasciId: draftRasciId == "master" ? null : draftRasciId,
          indexNumber: combineIndex,
          prlOrg: [],
          unitCode: [],
          draftSoId: draftSoId,
        };
        const resultPosition = await fetchPositionMatrix(payloadJob);
        SelectedProsbisId = [];
        setState("idSearchProsbis", "");
        const modalElement = document.getElementById("modalBusinessPro");
        const modal = bootstrap.Modal.getInstance(modalElement);
        setState("isSearchMatrix", true);
        setState("payloadProsbis", payloadByBusiness);
        setState("payloadPosition", payloadJob);
        setState("actionExport", "searchByBusiness");
        setState("resultProsbis", resultMatrix.data);
        setState("resultJabatan", resultPosition.data);
        setState("totalProsbis", resultMatrix.totalResult);
        setState("totalJob", resultPosition.totalResult);
        loadTableBody(resultMatrix.data);
        loadTableHeader(resultPosition.data);
        mapRasciCells(combineIndex, resultPosition.data);
        if (modal && resultPosition.success === true) {
          spinner.style.display = "none";
          modal.hide();
        }
      }
    } catch (error) {
      console.error("Error fetching data matrix", error);
    }
  } catch (error) {}
};
