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
    </div>`,
  );

  if (note) {
    $("#modalConfirmBody").append(
      `<div class="alert alert-danger-custom m-t-10" role="alert">
        <strong>Note:</strong> ` +
        note +
        `
      </div>`,
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
            `</button>`,
        );
        return;
      }
      $("#modalConfirmFooter").append(
        `<button type="button" class="btn ` +
          item.className +
          ` m-r-5" onclick="(async () => { await ${item.callbackFunction}(\`${paramsId}\`); })()">` +
          item.button +
          `</button>`,
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

async function confirmSave() {
  // console.log( $('#radio1').val())
  // value radio button name radio1

  const update = await editMandatoryAsync({
    compCode: $("#code").val(),
    careerType: $("#type").val(),
    careerLevel: $("#level").val(),
    proficiencyLevel: $('input[name="radio1"]:checked').val(),
  });

  hideModal(`modalConfirm`);

  swal("Success", "Data has been saved", "success");
}

const handleDetailCompetency = async (id) => {
  const dataDetaill = await getDetailDictionaryAsync({ compCode: id });
  const data = dataDetaill.data;
  $("#modalDetailCompe").modal("show");
  const formContent = `
    <div class="col-12 scrollable-content" style="min-height: 620px;">
        <div class="mb-2">
          <h6>${data.compName} </h6>
        </div>

        <div class="custom-card-approval">
            <div class="header-card-approval">
                Detail
            </div>
            <div>
                <div class=" custom-row-full">
                    <label>${data?.definition}</label>
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
              ${data?.levels?.[1]?.map((item) => `<li> ${item}</li>`).join("")}
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
                  ${data?.levels?.[2]?.map((item) => `<li> ${item}</li>`).join("")}
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
                  ${data?.levels?.[3]?.map((item) => `<li> ${item}</li>`).join("")}
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
                    ${data?.levels?.[4]?.map((item) => `<li> ${item}</li>`).join("")}
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

const openModalEditDepth = (level, type, name, compCode, proficiencyLevel) => {
  const compeCategory = { category: "mandatory" };
  const competencyLevel = { level: 1 };
  const dataJob = { job_name: "Job Name" };

  $("#modalEditDepthLevel").modal("show");

  const selectedLevel = competencyLevel?.level || "";

  // Array dinamis untuk level
  const levels = [1, 2, 3, 4];

  // Fungsi untuk membuat radio button secara dinamis
  const renderRadioButtons = (levels, selectedLevel) => {
    let radioButtons = levels
      .map((level) => {
        // Kondisi disabled jika compeCategory === "general" dan level < selectedLevel
        return `
            <div class="form-check form-check-inline radio radio-primary">
              <input 
                class="form-check-input" 
                id="radioinline${level}" 
                type="radio" 
                name="radio1" 
                value="${level}" 
                ${level === selectedLevel ? "checked" : ""}
              >
              <label class="form-check-label mb-0" for="radioinline${level}">${level}</label>
            </div>`;
      })
      .join("");

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
        <input type="hidden" class="form-control" value="${compCode}" id="code" >
        <input type="hidden" class="form-control" value="${level}" id="level" >
        <input type="hidden" class="form-control" value="${type}" id="type" >
        <div class="col-6">
            <div class="mb-2">
              <label style="color:#9F9FA5">Career Type</label>
              <h6>${type}</h6>
            </div>
        </div>
        <div class="col-6">
            <div class="mb-2">
              <label style="color:#9F9FA5">Career Level</label>
              <h6>${level}</h6>
            </div>
        </div>
        <div class="col-12">
            <div class="mt-3">
              <label style="color:#9F9FA5">Mandatory Competency</label>
            
              <h6 style="color:#03A9F4; cursor: pointer"  onclick="handleDetailCompetency('${compCode}')">${name}</h6>
            </div>
        </div>
        <div class="col-12">
            <div class="mt-4">
              <label>Depth Level</label>
              <div class="col">
                  <div class="m-t-10 m-checkbox-inline">
                    ${renderRadioButtons(levels, proficiencyLevel)}
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

// $('#btnSaveDraft').on('click', async function() {
//   alert('masok')
// });

async function loadTableHeader(params) {
  const headerCareerType = params.filter(
    (item, index, self) => index === self.findIndex((t) => t.careerType === item.careerType),
  );
  const listHeader = params.filter(
    (item, index, self) =>
      index === self.findIndex((t) => t.careerLevel === item.careerLevel && t.careerType === item.careerType),
  );
  let headerTop = ``;
  let headerBottom = ``;
  headerCareerType.forEach((item, index) => {
    const countListHeader = listHeader.filter((x) => x.careerType === item.careerType);
    headerTop += `<th class="tg-baqh competency-cell color-mandatory" colspan="${countListHeader.length}">${item.careerType}</th>`;
    countListHeader.forEach((val, i) => {
      headerBottom += `<th class="competency-cell color-mandatory">
                          <div class='competency-cell-wrapper' data-bs-toggle="tooltip" data-bs-placement="bottom"
                            title="${val.careerLevel}">
                            ${val.careerLevel}
                          </div>
                      </th>
                      `;
    });
  });

  const contentHeader =
    `
      <tr style="height: 30px;">
        <th rowspan="2" class="headcol head-cell color-mandatory" style="position:sticky;top:0; z-index:1 vertical-align: middle;text-align: center;">
            <span style="padding-left:10px;">Mandatory Competency</span>
        </th>
        ` +
    headerTop +
    `
      </tr>
      <tr style="height: 50px;">
        ` +
    headerBottom +
    `
      </tr>
    `;

  $("#table-header").append(contentHeader);
}

function mapCompetencyCells(data) {
  let cell = ``;
  data.dataHeader.forEach((header) => {
    // console.log({header})
    const isAvailable = data.allData.find(
      (x) => x.careerType === header.careerType && x.careerLevel === header.careerLevel && x.name === data.item.name,
    );
    if (isAvailable.proficiencyLevel) {
      cell += `<td>
                <div class="competency-container">
                    <div class="competency-value">
                        ${isAvailable.proficiencyLevel ?? "-"}
                      </div>
                      <img src="../assets/images/rasci/pencil_rasci.svg" alt="Edit Icon" class="edit-icon" onclick="openModalEditDepth('${header.careerLevel}','${header.careerType}','${data.item.name}','${data.item.compCode}', ${
                        data.item?.proficiencyLevel
                      })">
                    </div>
                </td>`;
    } else {
      cell += `<td></td>`;
    }
  });
  return cell;
  // return competencyList
  //   ?.map((val, i) => {
  //     const competency = val;

  //     return `<td>
  //               <div class="competency-container">
  //                   <div class="competency-value">
  //                       ${competency?.value ?? "-"}
  //                     </div>
  //                     <img src="../assets/images/rasci/pencil_rasci.svg" alt="Edit Icon" class="edit-icon" onclick="openModalEditDepth(${jobId}, ${
  //       competency.id
  //     })">
  //               </div>
  //           </td>`;
  //   })
  //   .join("");
}

async function loadTableBody(params) {
  const headerCareerType = params.filter(
    (item, index, self) => index === self.findIndex((t) => t.careerType === item.careerType),
  );
  const listHeader = params.filter(
    (item, index, self) =>
      index === self.findIndex((t) => t.careerLevel === item.careerLevel && t.careerType === item.careerType),
  );
  let dataHeader = [];
  headerCareerType.forEach((item, index) => {
    const countListHeader = listHeader.filter((x) => x.careerType === item.careerType);
    countListHeader.forEach((val, i) => {
      dataHeader.push({
        careerLevel: val.careerLevel,
        careerType: item.careerType,
      });
    });
  });

  const getALlName = params.filter((item, index, self) => index === self.findIndex((t) => t.name === item.name));
  let bodyContent = ``;
  let compeCells = ``;
  getALlName.forEach((item, index) => {
    compeCells = mapCompetencyCells({
      item: item,
      dataHeader: dataHeader,
      allData: params,
    });
    bodyContent += `
              <tr>
                  <td class="headcol">
                    <div class="joblist-cell-wrapper">
                        <div class="flex-fill joblist-name" onclick="handleDetailCompetency('${item.compCode}')">${item.name}
                        </div>
                    </div>
                  </td>
                    ${compeCells}
              </tr>`;
  });
  $("#table-body").append(bodyContent);
  // let headerTop = ``;
  // let headerBottom = ``;
  // headerCareerType.forEach((item, index) => {
  //   const countListHeader = listHeader.filter((x) => x.careerType === item.careerType);
  //   headerTop += `<th class="tg-baqh competency-cell color-mandatory" colspan="${countListHeader.length}">${item.careerType}</th>`;
  //   countListHeader.forEach((val, i) => {
  //     headerBottom += `<th class="competency-cell color-mandatory">
  //                         <div class='competency-cell-wrapper' data-bs-toggle="tooltip" data-bs-placement="bottom"
  //                           title="${val.careerLevel}">
  //                           ${val.careerLevel}
  //                         </div>
  //                     </th>
  //                     `;
  //   });
  // });
  // const bodyContent = params.tableBody
  //   ?.map((val, i) => {
  //     const compeCells = mapCompetencyCells(val.job_id, val.competency);
  //     return `
  //           <tr>
  //               <td class="headcol">
  //                 <div class="joblist-cell-wrapper">
  //                     <div class="flex-fill joblist-name" onclick="handleDetailCompetency(${val.job_id})">${val.job_name}
  //                     </div>
  //                 </div>
  //               </td>
  //               ${compeCells}
  //           </tr>`;
  //   })
  //   .join("");
  // $("#table-body").append(bodyContent);
}

async function updateTableSkillGroup(params) {
  // table-body-skill-group
  // find table tableMasterData tbody
  // clear table
  // append new data
  // const data = [
  //   {
  //     totalSkillGroup: '1 Skill Group',
  //     'sg1': '100%',
  //     'sg2': '0%',
  //     'sg3': '0%',
  //   },
  //   {
  //     totalSkillGroup: '2 Skill Group',
  //     'sg1': '67%',
  //     'sg2': '33%',
  //     'sg3': '0%',
  //   },
  //   {
  //     totalSkillGroup: '3 Skill Group',
  //     'sg1': '50%',
  //     'sg2': '30%',
  //     'sg3': '20%',
  //   },
  // ];
  const data = params.map((item, index) => {
    return {
      id: index + 1,
      totalSkillGroup: item.name,
      sg1: item.main,
      sg2: item.second,
      sg3: item.third,
    };
  });

  const table = document.getElementById("table-body-skill-group");
  table.innerHTML = "";
  data.forEach((item, index) => {
    console.log(item);
    const row = table.insertRow(index);
    Object.keys(item).forEach((key, idx) => {
      const cell = row.insertCell(idx);
      cell.innerHTML = item[key];
    });

    // Add action button
    const actionCell = row.insertCell(Object.keys(item).length);
    actionCell.innerHTML = `
      <button class="btn btn-sm btn-primary" onclick='handleAction(${JSON.stringify(item).replace(/'/g, "\\'")})'>Action</button>
    `;
  });
}

function handleAction(index) {
  console.log("handleAction", index);
  // form-edit-skill-group update
  const form = document.getElementById("form-edit-skill-group");
  // form.reset();
  form.innerHTML = "";
  form.innerHTML += `<input type="hidden" id="editSgId" name="id" value="${index.id - 1}">`;

  const data = index;
  if (data.sg1) {
    form.innerHTML += `
    <div class="col-md-4">
      <div class="form-group">
        <label id="label-ssg" for="sg1">Main SG Weight (%)</label>
        <input type="text" class="form-control skillGroupEvent" id="sg1" name="sg1" placeholder="" value="${data.sg1}">
      </div>
    </div>`;
  }
  if (data.sg2) {
    form.innerHTML += `
    <div class="col-md-4">
      <div class="form-group">
        <label id="label-ssg" for="sg2">Second SG Weight (%)</label>
        <input type="text" class="form-control skillGroupEvent" id="sg2" name="sg2" placeholder="" value="${data.sg2}">
      </div>
    </div>`;
  }
  if (data.sg3) {
    form.innerHTML += `
    <div class="col-md-4">
      <div class="form-group">
        <label id="label-ssg" for="sg3">Third SG Weight (%)</label>
        <input type="text" class="form-control skillGroupEvent" id="sg3" name="sg3" placeholder="" value="${data.sg3}">
      </div>
    </div>`;
  }

  const totalWeight = document.getElementById("total-weight");
  totalWeight.innerHTML = `Total Weight : 100 %`;

  $("#modalSkillGroup").modal("show");
}

$(document).on("change", ".skillGroupEvent", function () {
  const totalWeight = document.getElementById("total-weight");
  const sg1 = document.getElementById("sg1")?.value || 0;
  const sg2 = document.getElementById("sg2")?.value || 0;
  const sg3 = document.getElementById("sg3")?.value || 0;
  const total = parseInt(sg1) + parseInt(sg2) + parseInt(sg3);
  totalWeight.innerHTML = `Total Weight : ${total} %`;
  if (total != 100) {
    totalWeight.style.color = "red";
    totalWeight.style.backgroundColor = "rgba(255, 0, 0, 0.1)";
    totalWeight.innerHTML = `Total Weight : ${total} % (Total weight must be 100%)`;
    $("#btnSaveSkillGroup").prop("disabled", total !== 100);
  } else {
    totalWeight.style.color = "#006CA9";
    totalWeight.style.backgroundColor = "#E6F6FD";
    totalWeight.innerHTML = `Total Weight : ${total} %`;
    $("#btnSaveSkillGroup").prop("disabled", false);
  }
});

$("#btnSaveSkillGroup").on("click", async function () {
  const sg1 = document.getElementById("sg1")?.value || 0;
  const sg2 = document.getElementById("sg2")?.value || 0;
  const sg3 = document.getElementById("sg3")?.value || 0;
  const isActive = true;
  const id = $("#editSgId").val();
  const data = {
    id: id,
    main: sg1,
    second: sg2,
    third: sg3,
    isActive: isActive,
  };
  const update = await postWeightSettingAsync(data);
  swal("Success", "Data has been saved", "success");
});

function cancelEditProficiency() {
  const isChecked = $(this).prop("checked") ? true : false;
  $("#editProficiency").prop("checked", !isChecked);
  hideModal(`modalConfirm`);
}

async function updateProficiencyFeature() {
  const isChecked = $("#editProficiency").prop("checked") ? "1" : "0";
  await postGeneralAsync({
    parameterValue: isChecked,
  });

  hideModal(`modalConfirm`);
  swal("Success", `Proficiency feature has been ${isChecked ? "enabled" : "disabled"}.`, "success");
}

$("#editProficiency").on("change", async function () {
  const isChecked = $(this).prop("checked") ? true : false;
  const text = isChecked ? "Enable" : "Disable";

  const action = [
    {
      button: "No, Back",
      className: "btn-outline-dark",
      callbackFunction: "cancelEditProficiency",
    },
    {
      button: `Yes, ${text}`,
      className: "btn-primary",
      callbackFunction: "updateProficiencyFeature",
    },
  ];

  modalConfrimHelper(
    "confirm",
    `Confirmation`,
    `
    <span>${text} this feature?</span>
    <br/>
    <span class="p-2 mt-1 bg-warning-outline-custom">By activating this feature, the proficiency level of general competency can be changed below the previous level.</span>
    `,
    "",
    action,
  );
});

$(document).ready(async function () {
  // const dataDetailDictionary = await getDetailDictionaryAsync({ compCode: 1 });
  const getDataMandatory = await getListMandatoryAsync({
    page: 1,
    pageSize: 1000,
  });

  const dataMandatory = getDataMandatory.data;
  // dataMandatory.data unique by name

  loadTableHeader(dataMandatory.data);
  loadTableBody(dataMandatory.data);

  const dataGeneral = await getGeneralAsync();
  const getDataWeightSetting = await getWeightSettingAsync();
  const dataWeightSetting = getDataWeightSetting.data.data;
  await updateTableSkillGroup(dataWeightSetting);
  console.log({ dataWeightSetting });

  const isActiveEditProficiencyLevel = dataGeneral.data.parametterValue;
  $("#editProficiency").prop("checked", false);
  if (isActiveEditProficiencyLevel == "1") {
    $("#editProficiency").prop("checked", true);
  }
});
