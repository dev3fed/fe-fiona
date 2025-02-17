function modalConfrimHelper(type, titleModal, message, note, action, modalSize, paramsId) {
  if (modalSize) {
    $("#modalConfirm").find(".modal-dialog").addClass(modalSize);
  }
  $("#modalConfirmTitle").html("");
  $("#modalConfirmBody").html("");
  $("#modalConfirmFooter").html("");

  let icon =
    type == "delete"
      ? '<i class="fas fa-exclamation-triangle text-danger"></i>'
      : type == "success"
      ? '<i class="fas fa-check-circle text-success"></i>'
      : '<i class="fas fa-exclamation-circle text-warning"></i>';
  let title = `<span class="p-l-10">` + titleModal + `</span>`;
  $("#modalConfirmTitle").html(icon + title);
  $("#modalConfirmBody").html(
    `<div class="f-14" role="alert">` +
      message +
      `
    </div>`
  );

  if (note) {
    $("#modalConfirmBody").append(
      `<div class="alert alert-danger-custom m-t-10" role="alert">
        <strong>Note:</strong> ` +
        note +
        `
      </div>`
    );
  }

  if (action) {
    action.forEach((item) => {
      if (item.callback) {
        $("#modalConfirmFooter").append(
          `<button type="button" class="btn ` +
            item.className +
            ` m-r-5" onclick="(` +
            item.callback +
            `)()">` +
            item.button +
            `</button>`
        );
        return;
      }
      $("#modalConfirmFooter").append(
        `<button type="button" class="btn ` +
          item.className +
          ` m-r-5" onclick="(async () => { await ${item.callbackFunction}(\`${paramsId}\`); })()">` +
          item.button +
          `</button>`
      );
    });
  }

  $("#modalConfirm").modal("show");
}

async function openModalSaveDraft(params) {
  const action = [
    {
      button: "Cancel",
      className: "btn-primary",
      callback: function () {
        hideModal(`modalConfirm`);
      },
    },
    {
      button: "Yes, Save",
      className: "btn-outline-dark",
      callbackFunction: "confirmSave",
    },
  ];
  modalConfrimHelper("confirm", "Save Change", `Are you sure want to save this change?`, "", action, "", 1);
}

function confirmSave() {
  swal("Success", "Data has been saved", "success");
}

const handleDetailCompetency = async (id) => {
  // open modal dengan id modalDetailCompe
  // const competencyList = getState("competencyList");
  // const dataDetail = await fetchCompetencyDetail(id);
  // const findcompetencyList = competencyList.find((compe) => compe.id === dataDetail.data.idcompetency);
  $("#modalDetailCompe").modal("show");
  const findcompetencyList = { competency_name: "Competency Name" };
  const dataDetail = {
    data: {
      definition: "Definition",
      level1: ["Level 1", "Level 1", "Level 1"],
      level2: ["Level 2", "Level 2", "Level 2"],
      level3: ["Level 3", "Level 3", "Level 3"],
      level4: ["Level 4", "Level 4", "Level 4"],
    },
  };

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

const openModalEditDepth = (jobId, competencyId) => {
  // const competencyList = getState("competencyList");
  // const competencyMapping = getState("competencyMapping");
  // const jobList = getState("jobList");
  // // Cari level berdasarkan jobId dan competencyId
  // const competencyLevel = competencyMapping.find((rm) => rm.jobId === jobId && rm.compeId === competencyId);
  // const compeCategory = competencyList.find((compe) => compe.id === competencyId);
  // const dataJob = jobList.find((job) => job.id === jobId);

  // setState("dataEditDraft", { compeId: competencyId, jobId: jobId, level: competencyLevel?.level || null });

  // const btnDraft = document.getElementById("btnSaveDraft");
  // const btnApproval = document.getElementById("btnSubmitApproval");
  // btnDraft.disabled = competencyLevel?.level ? false : true;
  // btnApproval.disabled = competencyLevel?.level ? false : true;
  const compeCategory = { category: "mandatory" };
  const competencyLevel = { level: 1 };
  const dataJob = { job_name: "Job Name" };

  $("#modalEditDepthLevel").modal("show");

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
};

async function loadTableHeader(params) {
  const contentHeader = `
      <tr style="height: 30px;">
        <th rowspan="2" class="headcol head-cell color-mandatory" style="position:sticky;top:0; z-index:1 vertical-align: middle;text-align: center;">
            <span style="padding-left:10px;">Mandatory Competency</span>
        </th>
        <th class="tg-baqh competency-cell color-mandatory" colspan="4">
            Managerial</th>
        <th class="tg-baqh competency-cell color-mandatory" colspan="10">Generalist </th>
      </tr>
      <tr style="height: 50px;">
          ${params.tableHeader
            ?.map(
              (val, i) => `
                <th class="competency-cell color-mandatory">
                      <div class='competency-cell-wrapper' data-bs-toggle="tooltip" data-bs-placement="bottom"
                          title="${val.text}" onclick="handleDetailCompetency(${val.id})">
                          ${val.text}
                      </div>
                  </th>
              `
            )
            .join("")}
      </tr>
    `;

  $("#table-header").append(contentHeader);
}

function mapCompetencyCells(jobId, competencyList) {
  console.log(jobId);
  console.log(competencyList);
  return competencyList
    ?.map((val, i) => {
      const competency = val;

      return `<td>
                <div class="competency-container">
                    <div class="competency-value">
                        ${competency?.value ?? "-"}
                      </div>
                      <img src="../assets/images/rasci/pencil_rasci.svg" alt="Edit Icon" class="edit-icon" onclick="openModalEditDepth(${jobId}, ${
        competency.id
      })">
                </div>
            </td>`;
    })
    .join("");
}

async function loadTableBody(params) {
  // const competencyList = getState("competencyList");
  // const competencyMapping = getState("competencyMapping");
  const bodyContent = params.tableBody
    ?.map((val, i) => {
      const compeCells = mapCompetencyCells(val.job_id, val.competency);
      return `
            <tr>
                <td class="headcol">
                  <div class="joblist-cell-wrapper">
                      <div class="flex-fill joblist-name" onclick="handleDetailCompetency(${val.job_id})">${val.job_name}
                      </div>
                  </div>
                </td>
                ${compeCells}
            </tr>`;
    })
    .join("");

  // const tableB

  $("#table-body").append(bodyContent);
}

$(document).ready(async function () {
  loadTableHeader(dataDummy);
  loadTableBody(dataDummy);
});
