document.addEventListener("dataLoaded", function () {
  const jobList = getState("jobList");
  const competencyList = getState("competencyList");
  loadTableHeader(competencyList);
  loadTableBody(jobList);
  feather.replace();
});

document.addEventListener("DOMContentLoaded", function () {
  const jobList = getState("jobList");
  const competencyList = getState("competencyList");
  loadTableHeader(competencyList);
  loadTableBody(jobList);
  feather.replace();
});

function loadTableHeader(competencyList) {
  const totalMandatory = competencyList.filter((item) => item.category === "mandatory").length;
  const totalGeneral = competencyList.filter((item) => item.category === "general").length;
  const totalSpecific = competencyList.filter((item) => item.category === "specific").length;
  const headerContent = `
        <tr style="height: 30px;">
            <th rowspan="2" class="headcol head-cell" style="position:sticky;top:0; z-index:1 vertical-align: middle;text-align: center;">
                <span style="padding-left:10px;">Job Title</span>
            </th>
            <th class="tg-baqh competency-cell color-mandatory " colspan="${totalMandatory}">
                Mandatory</th>
            <th class="tg-baqh competency-cell color-general" colspan="${totalGeneral}">General </th>
            <th class="tg-baqh competency-cell color-specific" colspan="${totalSpecific}">Specific</th>
        </tr>
            <tr style="height: 50px;">
                ${competencyList
                  ?.map(
                    (val, i) => `
                     <th class="color-${val.category} competency-cell">
                            <div class='competency-cell-wrapper' data-bs-toggle="tooltip" data-bs-placement="bottom"
                                title="${val.competency_name}" onclick="handleDetailCompetency(${val.id})">
                                ${val.competency_name}
                            </div>
                        </th>
            `,
                  )
                  .join("")}
            </tr>
            `;
  document.getElementById("table-header").innerHTML = headerContent;
  initializeTooltips();
}

function loadTableBody(jobList) {
  const competencyList = getState("competencyList");
  const competencyMapping = getState("competencyMapping");
  const bodyContent = jobList
    ?.map((val, i) => {
      const compeCells = mapCompetencyCells(val.id, competencyList, competencyMapping);
      return `
          <tr>
             <td class="headcol">
                <div class="joblist-cell-wrapper">
                    <div class="flex-fill joblist-name">${val.job_name}</div>
                </div>
              </td>
              ${compeCells}
          </tr>`;
    })
    .join("");

  const tableBody = document.getElementById("table-body");
  if (tableBody) {
    tableBody.innerHTML = bodyContent;
    feather.replace();
    initializeTooltips();
  } else {
    console.error("Table body element not found");
  }
}

// Initialize tooltips after rendering
function initializeTooltips() {
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));
}

// Map RASCI Cells (Memoized)
const compentencyCellsChace = new Map();

function mapCompetencyCells(jobId, competencyList, competencyMapping) {
  // Tambahkan timestamp atau versi data ke cacheKey
  const timestamp = new Date().toISOString();
  const cacheKey = `${jobId}-${competencyList.length}-${timestamp}`;

  if (compentencyCellsChace.has(cacheKey)) {
    return compentencyCellsChace.get(cacheKey);
  }

  if (competencyMapping.length === 0) {
    return "";
  }

  const compeCells = competencyList
    .map((competency) => {
      const competencyItem = competencyMapping.filter((rm) => rm.jobId === jobId && rm.compeId === competency.id);
      let competencyLevel = "";
      competencyItem.forEach((item) => {
        if (item) {
          competencyLevel = item.level;
        }
      });
      return `<td>
                <div class="competency-container">
                    <div class="competency-value">
                        ${competencyLevel} 
                    </div>
                    <img src="/assets/images/rasci/pencil_rasci.svg" alt="Pencil Icon" class="pencil-icon" onclick="openModalEditDepth(${jobId},${competency.id})">
                </div>
            </td>`;
    })
    .join("");

  // Cache the result only if it's valid
  if (compeCells) {
    compentencyCellsChace.set(cacheKey, compeCells);
  }

  return compeCells;
}

const openModalEditDepth = (jobId, competencyId) => {
  const competencyList = getState("competencyList");
  const competencyMapping = getState("competencyMapping");
  const jobList = getState("jobList");
  // Cari level berdasarkan jobId dan competencyId
  const competencyLevel = competencyMapping.find((rm) => rm.jobId === jobId && rm.compeId === competencyId);
  const compeCategory = competencyList.find((compe) => compe.id === competencyId);
  const dataJob = jobList.find((job) => job.id === jobId);

  setState("dataEditDraft", { compeId: competencyId, jobId: jobId, level: competencyLevel?.level || null });

  const btnDraft = document.getElementById("btnSaveDraft");
  const btnApproval = document.getElementById("btnSubmitApproval");
  btnDraft.disabled = competencyLevel?.level ? false : true;
  btnApproval.disabled = competencyLevel?.level ? false : true;
  if (compeCategory?.category !== "mandatory") {
    const modal = new bootstrap.Modal(document.getElementById("modalEditDepthLevel"));
    modal.show();

    const selectedLevel = competencyLevel?.level || "";

    // Array dinamis untuk level
    const levels = [1, 2, 3, 4];

    // Fungsi untuk membuat radio button secara dinamis
    const renderRadioButtons = (levels, selectedLevel, compeCategory) => {
      let radioButtons = levels
        .map((level) => {
          // Kondisi disabled jika compeCategory === "general" dan level < selectedLevel
          const isDisabled = compeCategory?.category === "general" && level < selectedLevel;

          return `
            <div class="form-check form-check-inline radio radio-primary">
              <input 
                class="form-check-input" 
                id="radioinline${level}" 
                type="radio" 
                name="radio1" 
                value="${level}" 
                onchange="changeLevel()"
                ${level === selectedLevel ? "checked" : ""}
                ${isDisabled ? "disabled" : ""}
              >
              <label class="form-check-label mb-0" for="radioinline${level}">${level}</label>
            </div>`;
        })
        .join("");

      // Tambahkan opsi "No Level/Remove" jika compeCategory === "specific"
      if (compeCategory?.category === "specific") {
        radioButtons += `
            <div class="form-check form-check-inline radio radio-primary">
              <input 
                class="form-check-input" 
                id="radioinlineNone" 
                type="radio" 
                name="radio1" 
                value="none"
                onchange="changeLevel()"
                ${selectedLevel === "none" ? "checked" : ""}
              >
              <label class="form-check-label mb-0" for="radioinlineNone">No Level/Remove</label>
            </div>`;
      }

      return radioButtons;
    };
    console.log("compeCategory", compeCategory);
    // Isi konten form secara dinamis
    const category = {
      mandatory: "Mandatory",
      general: "General",
      specific: "Specific",
    };
    const formContent = `
        <div class="col-12">
            <div class="mb-2">
              <label style="color:#9F9FA5">Job Title</label>
              <h6>${dataJob.job_name}</h6>
            </div>
        </div>
        <div class="col-12">
            <div class="mt-3">
              <label style="color:#9F9FA5">${category[compeCategory.category]} Competency</label>
              <h6 style="color:#03A9F4; cursor: pointer" onclick="handleDetailCompetency(${compeCategory.id})">${
      compeCategory.competency_name
    }</h6>
            </div>
        </div>
        <div class="col-12">
            <div class="mt-4">
              <label>Depth Level</label>
              <div class="col">
                  <div class="m-t-10 m-checkbox-inline">
                    ${renderRadioButtons(levels, selectedLevel, compeCategory)}
                  </div>
              </div>
            </div>
        </div>
      `;

    const bodyContent = document.getElementById("form-editdepthlevel");
    if (bodyContent) {
      bodyContent.innerHTML = formContent;
    }
  } else {
    const modal = new bootstrap.Modal(document.getElementById("ModalWarning"));
    modal.show();

    const formContent = `
    <div class="col-12">
        <div class="mb-2 m-4" style="text-align: center">
        <img src="/assets/images/competency/close-circle.svg" class="mb-3"
                        alt="Filter Icon" style="margin-right: 8px;margin-top:-10px">
          <h4>CAN'T EDIT</h4>
        </div>
    </div>
    <div class="col-12">
        <div class="mt-2" style="text-align: center">
          <label>Mandatory competency depth level cannot be changed/edited</label>
        </div>
    </div>
    <div class="col-12 mt-3">
      <button class="btn btn-outline-light" type="button" style="width: 100%" data-bs-dismiss="modal">
      OK</button>
    </div>
  `;

    const bodyContent = document.getElementById("form-warning");
    if (bodyContent) {
      bodyContent.innerHTML = formContent;
    }
  }
};

const changeLevel = () => {
  const selectedValue = document.querySelector('input[name="radio1"]:checked').value;
  const btnDraft = document.getElementById("btnSaveDraft");
  const btnApproval = document.getElementById("btnSubmitApproval");
  btnDraft.disabled = selectedValue ? false : true;
  btnApproval.disabled = selectedValue ? false : true;
};
const openModalSaveDraft = () => {
  const modal = new bootstrap.Modal(document.getElementById("modalSaveDraft"));
  modal.show();
};
const openModalApprovalDepthLevel = () => {
  // get value from input radio id radioinlineNone
  const selectedValue = document.querySelector('input[name="radio1"]:checked').value;
  console.log("cek", selectedValue);
};
function handleInputDraftName(value) {
  const btnSave = document.getElementById("compeSavedraft");
  if (!btnSave) {
    console.error("Button not found");
    return;
  }
  btnSave.disabled = value.length > 3 ? false : true;
}

async function saveAsDraft() {
  try {
    const draftName = document.getElementById("draftName").value;
    const selectedValue = document.querySelector('input[name="radio1"]:checked').value;
    const dataEditDraft = getState("dataEditDraft");
    const draftList = getState("draftList");
    const jobList = getState("jobList").find((job) => job.id === dataEditDraft.jobId);
    const competencyList = getState("competencyList").find((compe) => compe.id === dataEditDraft.compeId);
    const date = new Date();
    const type = "draft";
    const DepthLevelAfter = selectedValue;

    const inputValue = {
      id: draftList.length + 1,
      draftName,
      createdDate: date,
      createdBy: "Superadmin",
      type,
      jobTitle: jobList,
      GeneralCompeName: competencyList,
      DepthLevelBefore: dataEditDraft.level,
      DepthLevelAfter,
      reqId: `Req/${new Date().toLocaleDateString()}/00${draftList.length + 1}`,
      typeDetail: "Edit General Competency Depth Level",
    };
    console.log("inputValue", inputValue);
    setState("draftList", [...draftList, inputValue]);
    const draftListAfter = getState("draftList");
    if (draftListAfter.length > 0) {
      const modalSaveDraft = document.getElementById("modalSaveDraft");
      const modalSave = bootstrap.Modal.getInstance(modalSaveDraft);
      const modalEditDepthLevel = document.getElementById("modalEditDepthLevel");
      const modalEdit = bootstrap.Modal.getInstance(modalEditDepthLevel);
      document.getElementById("draftName").value = "";
      const btnSave = document.getElementById("compeSavedraft");
      const btnDraft = document.getElementById("btnSaveDraft");
      const btnApproval = document.getElementById("btnSubmitApproval");

      btnSave.disabled = true;
      btnDraft.disabled = true;
      btnApproval.disabled = true;

      if (modalSave) {
        modalSave.hide();
      }
      if (modalEdit) {
        modalEdit.hide();
      }
      setTimeout(() => {
        swal({
          title: "SUCCESS",
          icon: "success",
          buttons: false,
          timer: 2000,
          content: {
            element: "div",
            attributes: {
              innerHTML: `<div style="text-align: center;">Your activity has been saved as a draft. You can check in the draft tab.</div>`,
            },
          },
        }).then(async () => {
          const IsNotEmpty = draftListAfter.length;
          handleClickCard(IsNotEmpty);
          loadTableBodyDraft(draftListAfter);
          $("#pills-draft-tab").tab("show");
        });
      }, 100);
    }
  } catch (error) {
    console.error("Error saving draft:", error);
  }
}

const handleDetailCompetency = async (id) => {
  // open modal dengan id modalDetailCompe
  const competencyList = getState("competencyList");
  const dataDetail = await fetchCompetencyDetail(id);
  const findcompetencyList = competencyList.find((compe) => compe.id === dataDetail.data.idcompetency);
  const modal = new bootstrap.Modal(document.getElementById("modalDetailCompe"));
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

  const modalBodyContent = document.getElementById("body-detailcompe");
  if (modalBodyContent) {
    modalBodyContent.innerHTML = formContent;
  }
};
