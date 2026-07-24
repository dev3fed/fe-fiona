const openSpecificCompetency = async () => {
  const dataSource = $("#dataSource-competency").val();
  const draftName = $("#dataSource-competency option:selected").text();
  const modalDetailPos = document.getElementById("ModalDetailPos");
  const jobInformation = getState("jobInformation");
  const closeModal = bootstrap.Modal.getInstance(modalDetailPos);
  const competencyList = getState("payloadAddCompetency");
  console.log("competencyList", competencyList);

  const mandatoryCompe = competencyList.filter((item) => item.selectedType === "mandatory");
  const generalCompe = competencyList.filter((item) => item.selectedType === "general");
  const specificCompe = competencyList.filter(
    (item) => item.selectedType === "specific" || item.compType === "specific",
  );
  const modal = new bootstrap.Modal(document.getElementById("modalAddCompetency"));
  closeModal.hide();

  let mandatoryDisabled = "";
  let mandatoryLabelStyle = "";
  let generalDisabled = "";
  let generalLabelStyle = "";
  let specificDisabled = "";
  let specificLabelStyle = "";

  if (mandatoryCompe.length > 4) {
    mandatoryDisabled = "disabled";
    mandatoryLabelStyle = "background-color: #E0E0E0; color: #A0A0A0; cursor: not-allowed;";
  }
  if (generalCompe.length > 2) {
    generalDisabled = "disabled";
    generalLabelStyle = "background-color: #E0E0E0; color: #A0A0A0; cursor: not-allowed;";
  }
  if (specificCompe.length > 8) {
    specificDisabled = "disabled";
    specificLabelStyle = "background-color: #E0E0E0; color: #A0A0A0; cursor: not-allowed;";
  }

  const formContent = `
    <div class="row mb-2">
      <div class="col-12 d-flex align-items-center">
        <div style="min-width:150px; font-weight:500; margin-right:6px;">Competency Draft</div>
        <div style="margin-right:6px;">:</div>
        <div class="fw-bold flex-fill">${draftName}</div>
      </div>
    </div>

    <div class="row mb-2">
      <div class="col-12 d-flex align-items-center">
        <div style="min-width:150px; font-weight:500; margin-right:6px;">Position</div>
        <div style="margin-right:6px;">:</div>
        <div class="fw-bold flex-fill">${jobInformation.positionName || "N/A"}</div>
      </div>
    </div>

    <div class="col-12">
      <hr>
      <div class="col mb-3">
        <div class="m-t-15 m-checkbox-inline custom-radio-ml">
            <div class="form-check form-check-inline radio radio-primary">
                <input class="form-check-input" id="radioNonreference" type="radio" name="optradio" value="nonReference" onchange="handleRadioChange(event)" checked>
                <label class="form-check-label mb-0" for="radioNonreference">Add Technical Competency</label>
            </div>
            <div class="form-check form-check-inline radio radio-primary">
                <input class="form-check-input" id="radioReference" type="radio" name="optradio" value="reference" onchange="handleRadioChange(event)" >
                <label class="form-check-label mb-0" for="radioReference">Add Technical Competency from Reference</label>
            </div>
        </div>
      </div>
    </div>
  `;

  // const bodyJobRef = `
  // <label class="form-label">Position Reference</label>
  //   <select class="form-select digits" name="jobIdRef" id="jobIdRef" onchange="onInputPositionName(event)">
  //   </select>
  // `;
  console.log("specificCompe", specificCompe);
  const bodySelectSpecific = `
  <div class="row">
    <div class="col-12 mt-3 mb-3">
      <label>Competency</label>
      <select class="form-select digits" name="competencyId" id="competencyId" onchange="onSelectCompetency(event)" ${specificCompe.length >= 9 ? "disabled" : ""}></select>
    </div>
    <div id="sg-ssg-info" class="col-12" style="display:none;">
      <label style="color:#03a9f4; cursor:pointer;" 
             onmouseover="this.style.textDecoration='underline'" 
             onmouseout="this.style.textDecoration='none'" onclick="handleSeeDictionary()">See dictionary</label>
      <label id="sg-ssg-label" style="display:block; margin-top:2px;"></label>
      <hr style="margin-top:20px;margin-bottom:20px"/>
    </div>
    
    <div class="option-row">
      <div>
        <label>Proficiency Level</label>
        <div class="d-flex gap-2">
          <input type="radio" class="btn-check" name="optLvl" id="level1" autocomplete="off" value="1">
          <label class="circle-option" for="level1">1</label>

          <input type="radio" class="btn-check" name="optLvl" id="level2" autocomplete="off" value="2">
          <label class="circle-option" for="level2">2</label>

          <input type="radio" class="btn-check" name="optLvl" id="level3" autocomplete="off" value="3">
          <label class="circle-option" for="level3">3</label>

          <input type="radio" class="btn-check" name="optLvl" id="level4" autocomplete="off" value="4">
          <label class="circle-option" for="level4">4</label>
        </div>
      </div>

    </div>
    <hr class="mt-4"/>
  </div>
  `;

  cardSelectedCompetency(specificCompe);
  cardSelectedCompeRef(specificCompe);
  disabledElementSelect2(specificCompe);
  document.getElementById("select-speccompe").innerHTML = bodySelectSpecific;
  // document.getElementById("comperef").innerHTML = bodyJobRef;

  const bodyContent = document.getElementById("form-competency");
  if (bodyContent) {
    bodyContent.innerHTML = formContent;
  }

  selectJobReference();
  selectSkillGroup();
  selectSubSkillGroup();
  selectCompetencyList();
  modal.show();
  updateRadioButtonState();
};

function updateRadioButtonState() {
  const competencyList = getState("payloadAddCompetency") || [];
  const mandatoryCompe = competencyList.filter((item) => item.selectedType === "mandatory");
  const generalCompe = competencyList.filter((item) => item.selectedType === "general");
  const specificCompe = competencyList.filter((item) => item.selectedType === "specific");

  const typeMandatoryInput = document.getElementById("typeMandatory");
  const typeMandatoryLabel = document.querySelector('label[for="typeMandatory"]');
  const typeGeneralInput = document.getElementById("typeGeneral");
  const typeGeneralLabel = document.querySelector('label[for="typeGeneral"]');
  const typeSpecificInput = document.getElementById("typeSpecific");
  const typeSpecificLabel = document.querySelector('label[for="typeSpecific"]');

  if (typeMandatoryInput && typeMandatoryLabel) {
    if (mandatoryCompe.length > 4) {
      typeMandatoryInput.disabled = true;
      typeMandatoryLabel.style.backgroundColor = "#E0E0E0";
      typeMandatoryLabel.style.color = "#A0A0A0";
      typeMandatoryLabel.style.cursor = "not-allowed";
      typeMandatoryLabel.style.border = "1px solid #A0A0A0";
    } else {
      typeMandatoryInput.disabled = false;
      typeMandatoryLabel.style = "";
    }
  }
  if (typeGeneralInput && typeGeneralLabel) {
    if (generalCompe.length > 2) {
      typeGeneralInput.disabled = true;
      typeGeneralLabel.style.backgroundColor = "#E0E0E0";
      typeGeneralLabel.style.color = "#A0A0A0";
      typeGeneralLabel.style.cursor = "not-allowed";
      typeGeneralLabel.style.border = "1px solid #A0A0A0";
    } else {
      typeGeneralInput.disabled = false;
      typeGeneralLabel.style = "";
    }
  }
  if (typeSpecificInput && typeSpecificLabel) {
    if (specificCompe.length > 8) {
      typeSpecificInput.disabled = true;
      typeSpecificLabel.style.backgroundColor = "#E0E0E0";
      typeSpecificLabel.style.color = "#A0A0A0";
      typeSpecificLabel.style.cursor = "not-allowed";
      typeSpecificLabel.style.border = "1px solid #A0A0A0";
    } else {
      typeSpecificInput.disabled = false;
      typeSpecificLabel.style = "";
    }
  }

  updateButtonStateBySelectsAndCompetency();
}

async function cardSelectedCompeRef(competencyList) {
  try {
    let specificCompe = [];
    let specificCount = 0;
    console.log("competencyList", competencyList);
    if (competencyList.length > 0) {
      specificCompe = competencyList;
      specificCount = specificCompe.length;
    }

    const specificContent =
      specificCount > 0
        ? `
        <div class="table-responsive scrollable-tbl" style="max-height: 275px;">
          <table class="table tbl-border">
            <thead style="background-color: #006CA9;">
              <tr>
                <th scope="col" style="width: 50px; text-align: center;">No</th>
                <th scope="col">Competency</th>
                <th scope="col" style="width: 50px;">Level</th>
                <th scope="col" style="width: 60px;">Remove</th>
              </tr>
            </thead>
            <tbody>
              ${specificCompe
                .map(
                  (item, index) => `
                <tr>
                  <td style="text-align: center;">${index + 1}</td>
                  <td>${item.compeName}</td>
                  <td style="text-align: center;">${item.selectedLvl}</td>
                  <td style="text-align: center;">
                     <button class="btn btn-outline-danger btn-small-icon" type="button" onclick="removeCompeRef('${
                       item.compeId
                     }')">
                        <img src="/assets/images/rasci/icon_delete.svg" alt="Delete Icon" class="icon-svg">
                      </button>
                  </td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
        </div>
      `
        : `
        <div class="col-12">
          <div class="competency-box">
            <span class="icon"><img src="/assets/images/competency/vector.svg"></span>
            <span class="desc">Selected specific competency will appear here</span>
          </div>
        </div>
      `;

    const bodySelectedCompe = `
      <div class="competency-section ">
        <!-- Specific -->
        <div class="row mb-2  ">
          <div class="col-12">
            <label style="font-weight: bold;margin-top:8px">Specific (${specificCount}/9)</label>
          </div>
          ${specificContent}
        </div>
      </div>
    `;

    document.getElementById("selected-comperef").innerHTML = bodySelectedCompe;
  } catch (error) {
    console.error("Error in cardSelectedCompetency:", error);
  }
}
async function cardSelectedCompetency(competencyList) {
  try {
    let specificCompe = [];
    let specificCount = 0;
    console.log("competencyList", competencyList);
    if (competencyList.length > 0) {
      specificCompe = competencyList;
      specificCount = specificCompe.length;
    }

    const specificContent =
      specificCount > 0
        ? `
        <div class="table-responsive scrollable-tbl" style="max-height: 320px;">
          <table class="table tbl-border">
            <thead style="background-color: #006CA9;">
              <tr>
                <th scope="col" style="width: 50px; text-align: center;">No</th>
                <th scope="col">Competency</th>
                <th scope="col" style="width: 50px;">Level</th>
                <th scope="col" style="width: 60px;">Remove</th>
              </tr>
            </thead>
            <tbody>
              ${specificCompe
                .map(
                  (item, index) => `
                <tr>
                  <td style="text-align: center;">${index + 1}</td>
                  <td>${item.compeName}</td>
                  <td style="text-align: center;">${item.selectedLvl}</td>
                  <td style="text-align: center;">
                     <button class="btn btn-outline-danger btn-small-icon" type="button" onclick="removeCompetency('${
                       item.compeId
                     }')">
                        <img src="/assets/images/rasci/icon_delete.svg" alt="Delete Icon" class="icon-svg">
                      </button>
                  </td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
        </div>
      `
        : `
        <div class="col-12">
          <div class="competency-box">
            <span class="icon"><img src="/assets/images/competency/vector.svg"></span>
            <span class="desc">Selected specific competency will appear here</span>
          </div>
        </div>
      `;

    const bodySelectedCompe = `
      <div class="competency-section ">
        <!-- Specific -->
        <div class="row mb-2  ">
          <div class="col-12">
            <label>Specific (${specificCount}/9)</label>
          </div>
          ${specificContent}
        </div>
      </div>
    `;

    document.getElementById("selected-compe").innerHTML = bodySelectedCompe;
  } catch (error) {
    console.error("Error in cardSelectedCompetency:", error);
  }
}

function updateButtonStateBySelectsAndCompetency() {
  // const sgId = $("#sgId").val();
  // const ssgId = $("#ssgId").val();
  const competencyId = $("#competencyId").val();
  const selectedLvl = $('input[name="optLvl"]:checked').val();
  const selectedType = $('input[name="optType"]:checked').val();
  const btnSelectedCompe = document.getElementById("btn-selectedCompe");

  const competencyList = getState("payloadAddCompetency") || [];
  const mandatoryCompe = competencyList.filter((item) => item.selectedType === "mandatory");
  const generalCompe = competencyList.filter((item) => item.selectedType === "general");
  const specificCompe = competencyList.filter((item) => item.selectedType === "specific");

  const isAllSelectFilled = competencyId && competencyId.length > 0;

  const isRadioFilled = selectedLvl;

  const isCompeLimitExceeded = mandatoryCompe.length > 2 && generalCompe.length > 0 && specificCompe.length > 8;

  if (btnSelectedCompe) {
    if (isAllSelectFilled && isRadioFilled && !isCompeLimitExceeded) {
      btnSelectedCompe.disabled = false;
      btnSelectedCompe.classList.remove("btn-disabled");
    } else {
      btnSelectedCompe.disabled = true;
      btnSelectedCompe.classList.add("btn-disabled");
    }
  }
}

// async function onSelectSg(event) {
//   updateButtonStateBySelectsAndCompetency();
// }
// async function onSelectSsg(event) {
//   updateButtonStateBySelectsAndCompetency();
// }
async function onSelectCompetency(event) {
  try {
    const idPosition = event.target.value || null;
    if (!idPosition) return;
    const result = await fetchSgandSsg(idPosition);

    if (result && result.data) {
      const { sgName, ssgName } = result.data;
      const sgSsgDiv = document.getElementById("sg-ssg-info");
      const sgSsgLabel = document.getElementById("sg-ssg-label");

      if (sgSsgDiv && sgSsgLabel) {
        sgSsgDiv.style.display = "block";
        sgSsgLabel.textContent = `SG: ${sgName}, SSG: ${ssgName}`;
      }
    } else {
      const sgSsgDiv = document.getElementById("sg-ssg-info");
      if (sgSsgDiv) sgSsgDiv.style.display = "none";
    }

    updateButtonStateBySelectsAndCompetency();
  } catch (error) {
    console.error(error);
  }
}
$(document).on("change", 'input[name="optLvl"]', function () {
  console.log("optLvl changed");
  updateButtonStateBySelectsAndCompetency();
});

$(document).on("change", 'input[name="optType"]', function () {
  console.log("optType changed");
  updateButtonStateBySelectsAndCompetency();
});

async function removeCompeRef(compeId) {
  const competencyList = getState("payloadAddCompetency") || [];
  const updatedList = competencyList
    .filter((item) => item.selectedType === "specific")
    .filter((item) => item.compeId !== compeId);
  setState("payloadAddCompetency", updatedList);
  disabledElementSelect2(updatedList);
  cardSelectedCompeRef(updatedList);
  cardSelectedCompetency(updatedList);
  updateRadioButtonState();
}
async function removeCompetency(compeId) {
  const competencyList = getState("payloadAddCompetency") || [];
  const updatedList = competencyList
    .filter((item) => item.selectedType === "specific")
    .filter((item) => item.compeId !== compeId);
  setState("payloadAddCompetency", updatedList);
  disabledElementSelect2(updatedList);
  cardSelectedCompeRef(updatedList);
  cardSelectedCompetency(updatedList);
  updateRadioButtonState();
}
function disabledElementSelect2(updatedList) {
  const competencyIdElement = document.getElementById("competencyId");
  const inputSearchref = document.getElementById("search-position-ref");
  if (competencyIdElement) {
    if (updatedList.length >= 9) {
      competencyIdElement.disabled = true;
      inputSearchref.disabled = true;
    } else {
      competencyIdElement.disabled = false;
      inputSearchref.disabled = false;
    }
  }
}
function selectJobReference() {
  let $select = $("#dataSource-rasci");
  let selectedOption = $select.find(":selected"); // Ambil elemen option yang terpilih
  let selectedDraftSo = selectedOption.attr("data-draftso");
  $("#jobIdRef")
    .select2({
      dropdownParent: $("#modalAddCompetency"),
      placeholder: "Choose",
      allowClear: true,
      delay: 250,
      ajax: {
        url: `${url_api}/api/Utilities/selection`,
        dataType: "json",
        data: function (params) {
          return {
            search: params.term || "",
            page: params.page || 1,
            type: "position",
            draftId: selectedDraftSo,
          };
        },
        processResults: function (data) {
          if (data && data.data) {
            return {
              results: data.data.result,
              pagination: {
                more: data.data.pagination.more,
              },
            };
          }
          return { results: [] };
        },
        cache: true,
      },
      templateResult: function (item) {
        return item.text;
      },
    })
    .on("select2:open", function () {
      page = 1;
    });
}

const handleRadioChange = (event) => {
  const value = event.target.value;
  const jobSelect = $("#jobIdRef");
  // setState("payloadAddCompetency", []);
  // cardSelectedCompetency([]);
  // updateRadioButtonState();
  if (value === "reference") {
    // $("#comperef").show();
    $("#card-positionlistref").show();
    $("#specCompe, #selectedcompe").hide();
  } else if (value === "nonReference") {
    jobSelect.val(null).trigger("change");
    $("#card-positionlistref").hide();
    // $("#comperef").hide();
    $("#specCompe, #selectedcompe").show();
  }
};

function selectCompetencyList() {
  const competencyId = $("#dataSource-competency").val();
  $("#competencyId")
    .select2({
      dropdownParent: $("#modalAddCompetency"),
      placeholder: "Choose",
      allowClear: true,
      delay: 250,
      ajax: {
        url: `${url_api}/api/Utilities/selection`,
        dataType: "json",
        data: function (params) {
          return {
            search: params.term || "",
            page: params.page || 1,
            type: "competency",
            draftId: competencyId,
          };
        },
        processResults: function (data) {
          if (data && data.data) {
            return {
              results: data.data?.value.data.result,
              pagination: {
                more: data.data?.value.data.pagination.more,
              },
            };
          }
          return { results: [] };
        },
        cache: true,
      },
      templateResult: function (item) {
        return item.text;
      },
    })
    .on("select2:open", function () {
      page = 1;
    });
}

function selectSubSkillGroup() {
  let $select = $("#dataSource-competency");
  let selectedOption = $select.find(":selected");
  let selectedDraftSo = selectedOption.attr("data-draftso");
  $("#ssgId")
    .select2({
      dropdownParent: $("#modalAddCompetency"),
      placeholder: "Choose",
      allowClear: true,
      delay: 250,
      ajax: {
        url: `${url_api}/api/Utilities/selection`,
        dataType: "json",
        data: function (params) {
          return {
            search: params.term || "",
            page: params.page || 1,
            type: "sub-skill-group",
            draftId: selectedDraftSo,
          };
        },
        processResults: function (data) {
          if (data && data.data) {
            return {
              results: data.data.result,
              pagination: {
                more: data.data.pagination.more,
              },
            };
          }
          return { results: [] };
        },
        cache: true,
      },
      templateResult: function (item) {
        return item.text;
      },
    })
    .on("select2:open", function () {
      page = 1;
    });
}

function selectSkillGroup() {
  let $select = $("#dataSource-competency");
  let selectedOption = $select.find(":selected");
  let selectedDraftSo = selectedOption.attr("data-draftso");
  $("#sgId")
    .select2({
      dropdownParent: $("#modalAddCompetency"),
      placeholder: "Choose",
      allowClear: true,
      delay: 250,
      ajax: {
        url: `${url_api}/api/Utilities/selection`,
        dataType: "json",
        data: function (params) {
          return {
            search: params.term || "",
            page: params.page || 1,
            type: "skill-group",
            draftId: selectedDraftSo,
          };
        },
        processResults: function (data) {
          if (data && data.data) {
            return {
              results: data.data.result,
              pagination: {
                more: data.data.pagination.more,
              },
            };
          }
          return { results: [] };
        },
        cache: true,
      },
      templateResult: function (item) {
        return item.text;
      },
    })
    .on("select2:open", function () {
      page = 1;
    });
}

const searchPositionRef = async (value) => {
  try {
    const dataSource = $("#dataSource-competency").val();
    const positionName = value || null;

    // Handle when input is cleared
    if (!positionName || positionName.trim() === "") {
      $("#position-ref-list").hide();
      $("#default-position-ref").show();
      return;
    }

    // Validate minimum length
    if (positionName.length < 4) return;

    const payload = {
      draftId: dataSource,
      search: positionName,
      type: "position",
    };
    const queryString = "?" + new URLSearchParams(payload).toString();
    const result = await fetchUtilitiesPosition(queryString);
    $("#position-ref-list").show();
    $("#default-position-ref").hide();
    const positionRefList = $("#position-ref-list");

    const positions = result.data.result || [];

    if (positions.length === 0) {
      positionRefList.html(`
        <div class="position-ref-item" style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
          <span class="icon" ><img src="/assets/images/competency/magnifer.svg" style="width: 32px; height: 32px;"></span>
          <div style="font-weight: 600; color: #999; text-align: center; padding: 12px;">
            Data not found
          </div>
        </div>
      `);
      return;
    }

    const positionHTML = positions
      .map(
        (item) => `
      <div class="position-ref-item" onclick="onInputPositionName('${item.id}', '${item.text}')">
        <div style="font-weight: 600; color: #03A9F4; margin-bottom: 4px;">
          ${item.text}
        </div>
        <div style="font-size: 12px; color: #999;">
          -
        </div>
      </div>
    `,
      )
      .join("");

    positionRefList.html(positionHTML);
    // const payload = {
    //   dataSource: dataSource,
    //   page: 1,
    //   pageSize: 999,
    // };
    // const result = await fetchCompetencyReference(payload);
    // const competencyList = result?.data?.level || [];
    // console.log("first", competencyList);
    // if (competencyList.length > 0) {
    //   const elementComperef = document.getElementById("table-comperef");
    //   elementComperef.style.display = "block";
    //   console.log("competencyList", competencyList);
    //   const dataMandatory = competencyList.filter((item) => item.compType.toLowerCase() === "mandatory");
    //   const dataGeneral = competencyList.filter((item) => item.compType.toLowerCase() === "general");
    //   const dataSpecific = competencyList.filter((item) => item.compType.toLowerCase() === "specific");
    //   console.log("dataMandatory", dataMandatory);
    //   console.log("dataGeneral", dataGeneral);
    //   console.log("dataSpecific", dataSpecific);
    //   const bodyTableCompeRef = `
    //   <label class="form-label">Technical Competencies of ${positionName}</label>
    //                     <div class="card-tablebusinessreference">
    //                         <div class="row">
    //                             <div class="col-4">
    //                                 <h6 style="font-weight: bold;">Mandatory</h6>
    //                                 <table class="mt-2 mb-3 table tbl-border">
    //                                     <thead>
    //                                      <tr>
    //                                      <th scope="col" style="width: 40px;text-align:center">
    //                                      <input type="checkbox" class="form-check-input"  onclick="toggleSelectAllMandatory(this)">
    //                                      </th>
    //                                       <th scope="col" style="width: 40px;text-align:center">No</th>
    //                                       <th scope="col" style="width: 200px">Competency</th>
    //                                      <th scope="col" style="width: 150px;text-align:center">Proficiency Level</th>
    //                                     </tr>
    //                                     </thead>
    //                                     <tbody>
    //                                     ${dataMandatory
    //                                       .map(
    //                                         (item, index) => `
    //                                         <tr>
    //                                             <td style="text-align:center">
    //                                               <input type="checkbox" class="form-check-input" name="mandatoryCompeRef" value="${
    //                                                 item.id || item.compCode
    //                                               }" onclick="singleSelectMandatory(this)">
    //                                             </td>
    //                                             <td style="text-align:center">${index + 1}</td>
    //                                             <td style="color:#03a9f4; cursor:pointer;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">${
    //                                               item.compName
    //                                             }</td>
    //                                             <td style="text-align:center">${item.proficiencyLevel}</td>
    //                                         </tr>
    //                                     `,
    //                                       )
    //                                       .join("")}
    //                                     </tbody>
    //                                 </table>
    //                             </div>
    //                             <div class="col-4">
    //                                 <h6 style="font-weight: bold;">General</h6>
    //                                 <table class="mt-2 mb-3 table tbl-border">
    //                                     <thead>
    //                                     <tr>
    //                                     <th scope="col" style="width: 40px;text-align:center">
    //                                     <input type="checkbox" class="form-check-input"  onclick="toggleSelectAllGeneral(this)">
    //                                     </th>
    //                                       <th scope="col" style="width: 40px;text-align:center">No</th>
    //                                       <th scope="col" style="width: 200px">Competency</th>
    //                                       <th scope="col" style="width: 150px;text-align:center">Proficiency Level</th>
    //                                     </tr>
    //                                     </thead>
    //                                     <tbody>
    //                                     ${dataGeneral
    //                                       .map(
    //                                         (item, index) => `
    //                                         <tr>
    //                                             <td style="text-align:center">
    //                                               <input type="checkbox" class="form-check-input" name="generalCompeRef" value="${
    //                                                 item.id || item.compCode
    //                                               }" onclick="singleSelectGeneral(this)">
    //                                             </td>
    //                                             <td style="text-align:center">${index + 1}</td>
    //                                             <td style="color:#03a9f4; cursor:pointer;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">${
    //                                               item.compName
    //                                             }</td>
    //                                             <td style="text-align:center">${item.proficiencyLevel}</td>
    //                                         </tr>
    //                                     `,
    //                                       )
    //                                       .join("")}
    //                                     </tbody>
    //                                 </table>
    //                             </div>
    //                             <div class="col-4 ">
    //                                 <h6 style="font-weight: bold;">Specific</h6>
    //                                 <table class="mt-2 mb-3 table tbl-border">
    //                                     <thead>
    //                                     <tr>
    //                                     <th scope="col" style="width: 40px;text-align:center">
    //                                     <input type="checkbox" class="form-check-input"  onclick="toggleSelectAllSpecific(this)">
    //                                     </th>
    //                                       <th scope="col" style="width: 40px;text-align:center">No</th>
    //                                       <th scope="col" style="width: 200px">Competency</th>
    //                                       <th scope="col" style="width: 150px;text-align:center">Proficiency Level</th>
    //                                     </tr>
    //                                     </thead>
    //                                     <tbody>
    //                                     ${dataSpecific
    //                                       .map(
    //                                         (item, index) => `
    //                                         <tr>
    //                                             <td style="text-align:center">
    //                                               <input type="checkbox" class="form-check-input" name="specificCompeRef" value="${
    //                                                 item.id || item.compCode
    //                                               }" onclick="singleSelectSpecific(this)">
    //                                             </td>
    //                                             <td style="text-align:center">${index + 1}</td>
    //                                             <td style="color:#03a9f4; cursor:pointer;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">${
    //                                               item.compName
    //                                             }</td>
    //                                             <td style="text-align:center">${item.proficiencyLevel}</td>
    //                                         </tr>
    //                                     `,
    //                                       )
    //                                       .join("")}
    //                                     </tbody>
    //                                 </table>
    //                             </div>
    //                         </div>
    //                     </div>`;
    //   elementComperef.innerHTML = bodyTableCompeRef;
    // }
  } catch (error) {
    console.error("Error fetching competency reference:", error);
  }
};
const onInputPositionName = async (id, name) => {
  const dataSource = $("#dataSource-competency").val();
  const payload = {
    dataSource: dataSource,
    page: 1,
    pageSize: 999,
    jobCode: [id],
  };
  const result = await fetchCompetencyReference(payload);
  const competencyList = result?.data?.level || [];
  const updatedList = competencyList.filter((item) => item.compType === "specific");

  console.log("first", updatedList);
  cardListpositionComperef(updatedList);
  document.getElementById("position-comperef-default").style.display = "none";
  document.getElementById("position-comperef").style.display = "block";
};

async function cardListpositionComperef(competencyList) {
  try {
    let specificCompe = [];
    let specificCount = 0;
    console.log("competencyList", competencyList);
    if (competencyList.length > 0) {
      specificCompe = competencyList;
      specificCount = specificCompe.length;
    }

    const specificContent =
      specificCount > 0
        ? `
        <div class="table-responsive scrollable-tbl" style="max-height: 275px;">
          <table class="table tbl-border">
            <thead style="background-color: #006CA9;">
              <tr>
                <th scope="col" style="width: 50px; text-align: center;">No</th>
                <th scope="col">Competency</th>
                <th scope="col" style="width: 50px;">Level</th>
              </tr>
            </thead>
            <tbody>
              ${specificCompe
                .map(
                  (item, index) => `
                <tr>
                  <td style="text-align: center;">${index + 1}</td>
                  <td>${item.compName}</td>
                  <td style="text-align: center;">${item.level}</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
        </div>
      `
        : `
        <div class="col-12">
          <div class="competency-box">
            <span class="icon"><img src="/assets/images/competency/vector.svg"></span>
            <span class="desc">Selected specific competency will appear here</span>
          </div>
        </div>
      `;

    const bodyPositionComperef = `
      <div class="competency-section ">
        <!-- Specific -->
        <div class="row mb-2  ">
          <div class="col-12">
            <label style="font-weight: bold;margin-top:8px">Specific (${specificCount}/9)</label>
          </div>
          ${specificContent}
        </div>
      </div>
    `;

    document.getElementById("position-comperef").innerHTML = bodyPositionComperef;
  } catch (error) {
    console.error("Error in cardSelectedCompetency:", error);
  }
}

const toggleSelectAllMandatory = (source) => {
  const checkboxes = document.getElementsByName("mandatoryCompeRef");
  const payloadAddCompetency = getState("payloadAddCompetency") || [];
  const jobInformation = getState("jobInformation");

  checkboxes.forEach((checkbox) => {
    checkbox.checked = source.checked;
  });

  if (source.checked) {
    const newCompe = Array.from(checkboxes)
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => {
        const row = checkbox.closest("tr");
        return {
          compeId: checkbox.value,
          compeName: row?.children[2]?.textContent || "",
          selectedLvl: row?.children[3]?.textContent || "",
          selectedType: "mandatory",
          unitCode: jobInformation.unitCode,
          prlOrg: jobInformation.prlOrg,
        };
      })
      .filter(
        (data) =>
          !payloadAddCompetency.some((item) => item.compeId === data.compeId && item.selectedType === "mandatory"),
      );

    const sentData = [...payloadAddCompetency, ...newCompe];
    console.log("payloadAddCompetency", sentData);
    setState("payloadAddCompetency", sentData);
    cardSelectedCompetency(sentData);
  } else {
    const filtered = payloadAddCompetency.filter((item) => item.selectedType !== "mandatory");
    setState("payloadAddCompetency", filtered);
    cardSelectedCompetency(filtered);
  }
  updateRadioButtonState();
};

const toggleSelectAllGeneral = (source) => {
  const checkboxes = document.getElementsByName("generalCompeRef");
  const payloadAddCompetency = getState("payloadAddCompetency") || [];
  const jobInformation = getState("jobInformation");

  checkboxes.forEach((checkbox) => {
    checkbox.checked = source.checked;
  });

  if (source.checked) {
    const newCompe = Array.from(checkboxes)
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => {
        const row = checkbox.closest("tr");
        return {
          compeId: checkbox.value,
          compeName: row?.children[2]?.textContent || "",
          selectedLvl: row?.children[3]?.textContent || "",
          selectedType: "general",
          unitCode: jobInformation.unitCode,
          prlOrg: jobInformation.prlOrg,
        };
      })
      .filter(
        (data) =>
          !payloadAddCompetency.some((item) => item.compeId === data.compeId && item.selectedType === "general"),
      );

    const sentData = [...payloadAddCompetency, ...newCompe];
    setState("payloadAddCompetency", sentData);
    cardSelectedCompetency(sentData);
  } else {
    const filtered = payloadAddCompetency.filter((item) => item.selectedType !== "general");
    setState("payloadAddCompetency", filtered);
    cardSelectedCompetency(filtered);
  }
  updateRadioButtonState();
};

const toggleSelectAllSpecific = (source) => {
  const checkboxes = document.getElementsByName("specificCompeRef");
  const payloadAddCompetency = getState("payloadAddCompetency") || [];
  const jobInformation = getState("jobInformation");

  checkboxes.forEach((checkbox) => {
    checkbox.checked = source.checked;
  });

  if (source.checked) {
    const newCompe = Array.from(checkboxes)
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => {
        const row = checkbox.closest("tr");
        return {
          compeId: checkbox.value,
          compeName: row?.children[2]?.textContent || "",
          selectedLvl: row?.children[3]?.textContent || "",
          selectedType: "specific",
          unitCode: jobInformation.unitCode,
          prlOrg: jobInformation.prlOrg,
        };
      })
      .filter(
        (data) =>
          !payloadAddCompetency.some((item) => item.compeId === data.compeId && item.selectedType === "specific"),
      );

    const sentData = [...payloadAddCompetency, ...newCompe];
    setState("payloadAddCompetency", sentData);
    cardSelectedCompetency(sentData);
  } else {
    const filtered = payloadAddCompetency.filter((item) => item.selectedType !== "specific");
    setState("payloadAddCompetency", filtered);
    cardSelectedCompetency(filtered);
  }
  updateRadioButtonState();
};

const singleSelectSpecific = (checkbox) => {
  const payloadAddCompetency = getState("payloadAddCompetency") || [];
  const jobInformation = getState("jobInformation");
  const compeId = checkbox.value;
  const row = checkbox.closest("tr");

  if (checkbox.checked) {
    if (!payloadAddCompetency.some((item) => item.compeId === compeId && item.selectedType === "specific")) {
      const newCompe = {
        compeId: compeId,
        compeName: row?.children[2]?.textContent || "",
        selectedLvl: row?.children[3]?.textContent || "",
        selectedType: "specific",
        unitCode: jobInformation.unitCode,
        prlOrg: jobInformation.prlOrg,
      };
      const sentData = [...payloadAddCompetency, newCompe];
      setState("payloadAddCompetency", sentData);
      cardSelectedCompetency(sentData);
    }
  } else {
    // Remove only the unchecked one
    const filtered = payloadAddCompetency.filter(
      (item) => !(item.compeId === compeId && item.selectedType === "specific"),
    );
    setState("payloadAddCompetency", filtered);
    cardSelectedCompetency(filtered);
  }
  updateRadioButtonState();
};
const singleSelectMandatory = (checkbox) => {
  const payloadAddCompetency = getState("payloadAddCompetency") || [];
  const jobInformation = getState("jobInformation");
  const compeId = checkbox.value;
  const row = checkbox.closest("tr");

  if (checkbox.checked) {
    if (!payloadAddCompetency.some((item) => item.compeId === compeId && item.selectedType === "mandatory")) {
      const newCompe = {
        compeId: compeId,
        compeName: row?.children[2]?.textContent || "",
        selectedLvl: row?.children[3]?.textContent || "",
        selectedType: "mandatory",
        unitCode: jobInformation.unitCode,
        prlOrg: jobInformation.prlOrg,
      };
      const sentData = [...payloadAddCompetency, newCompe];
      setState("payloadAddCompetency", sentData);
      cardSelectedCompetency(sentData);
    }
  } else {
    const filtered = payloadAddCompetency.filter(
      (item) => !(item.compeId === compeId && item.selectedType === "mandatory"),
    );
    setState("payloadAddCompetency", filtered);
    cardSelectedCompetency(filtered);
  }
  updateRadioButtonState();
};

const singleSelectGeneral = (checkbox) => {
  const payloadAddCompetency = getState("payloadAddCompetency") || [];
  const jobInformation = getState("jobInformation");
  const compeId = checkbox.value;
  const row = checkbox.closest("tr");

  if (checkbox.checked) {
    if (!payloadAddCompetency.some((item) => item.compeId === compeId && item.selectedType === "general")) {
      const newCompe = {
        compeId: compeId,
        compeName: row?.children[2]?.textContent || "",
        selectedLvl: row?.children[3]?.textContent || "",
        selectedType: "general",
        unitCode: jobInformation.unitCode,
        prlOrg: jobInformation.prlOrg,
      };
      const sentData = [...payloadAddCompetency, newCompe];
      setState("payloadAddCompetency", sentData);
      cardSelectedCompetency(sentData);
    }
  } else {
    const filtered = payloadAddCompetency.filter(
      (item) => !(item.compeId === compeId && item.selectedType === "general"),
    );
    setState("payloadAddCompetency", filtered);
    cardSelectedCompetency(filtered);
  }
  updateRadioButtonState();
};
async function triggleSelectCompe() {
  const selectedCompe = $("#competencyId");
  const compeId = selectedCompe.val();
  const CompeName = selectedCompe.find(":selected").text();
  const selectedLvl = $('input[name="optLvl"]:checked').val();
  const payloadAddCompetency = getState("payloadAddCompetency");
  const btnSelectedCompe = document.getElementById("btn-selectedCompe");
  const jobInformation = getState("jobInformation");
  const dataSelectedCompe = {
    compeId: compeId,
    compeName: CompeName,
    selectedLvl: selectedLvl,
    selectedType: "specific",
    unitCode: jobInformation.unitCode,
    prlOrg: jobInformation.prlOrg,
  };
  const updatedList = payloadAddCompetency
    .filter((item) => item.selectedType === "specific")
    .filter((item) => item.compeId !== compeId);
  console.log("payloadAddCompetency", payloadAddCompetency);
  console.log("dataSelectedCompe", dataSelectedCompe);
  const sentData = [...updatedList, dataSelectedCompe];
  setState("payloadAddCompetency", sentData);
  cardSelectedCompeRef(sentData);
  cardSelectedCompetency(sentData);
  updateRadioButtonState();
  disabledElementSelect2(sentData);
  $("#competencyId").val(null).trigger("change");
  $('input[name="optLvl"]').prop("checked", false);
  $('input[name="optType"]').prop("checked", false);
  btnSelectedCompe.disabled = true;
  btnSelectedCompe.classList.add("btn-disabled");
}

function closeModalCompetency() {
  const jobSelect = $("#jobIdRef");
  jobSelect.val(null).trigger("change");
  $("#card-positionlistref").hide();
  // $("#comperef").hide();
  $("#specCompe, #selectedcompe").show();
  setState("payloadAddCompetency", []);
  cardSelectedCompeRef([]);
  cardSelectedCompetency([]);
  disabledElementSelect2([]);
  updateRadioButtonState();
}

const handleSaveDraftCompe = async () => {
  try {
    const payloadAddCompetency = getState("payloadAddCompetency");
    const spinBtn = document.getElementById("spinBtncompetency");
    const modalAddCompetency = document.getElementById("modalAddCompetency");
    const modal = bootstrap.Modal.getInstance(modalAddCompetency);
    const jobInformation = getState("jobInformation");

    if (spinBtn) spinBtn.style.display = "inline-block";
    const payload = {
      draftId: $("#dataSource-competency").val() || null,
      data: [
        {
          unitCode: jobInformation.unitCode || "",
          prlOrg: jobInformation.prlOrg || "",
          competency: payloadAddCompetency.map((item) => ({
            compCode: item.compeId,
            level: item.selectedLvl,
            compType: item.selectedType,
          })),
        },
      ],
    };
    // console.log("payload", payload);
    const result = await fetchAddtechnicalCompetency(payload);

    if (result.success === true) {
      const draftName = $("#dataSource-competency option:selected").text();
      swal({
        title: "SUCCESS",
        icon: "success",
        buttons: false,
        timer: 2000,
        content: {
          element: "div",
          attributes: {
            innerHTML: `<span style="text-align: center;">Your activity has been save as draft.</span>
          <br>
          <span>You can check in <b>${draftName}</b> at draft tab.</span>
          `,
          },
        },
      }).then(async () => {
        setTimeout(() => {
          handleSearchCompetency();
          closeModalCompetency();
          if (modal) modal.hide();
          spinBtn.style.display = "none";
        }, 200);
      });
    } else {
      console.log("result", result.error.results[0].alreadyExists);
      const alreadyExistsList = result.error.results[0].alreadyExists
        .map((item) => `<li>${item.replace(/\s*\([^)]*\)/g, "")}</li>`)
        .join("");
      spinBtn.style.display = "none";
      swal({
        title: "SAVE FAILED",
        icon: "error",
        buttons: {
          confirm: {
            text: "OK",
            value: true,
            visible: true,
            className: "",
            closeModal: true,
          },
        },
        content: {
          element: "div",
          attributes: {
            innerHTML: `<div style="text-align: center;">
              <p style="font-size: 16px; margin: 15px 0;">The competencies below already exist in <strong>${jobInformation.positionName}</strong> position, please select another competency.</p>
              <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; text-align: left; max-height: 90px; overflow-y: auto;">
                <ul style="margin: 0; padding-left: 20px;">
                  ${alreadyExistsList}
                </ul>
              </div>
            </div>`,
          },
        },
      });
    }
  } catch (error) {
    console.error("Error saving draft:", error);
  }
};

const handleSeeDictionary = () => {
  const competencyId = $("#competencyId").val();
  console.log("Selected competency:", competencyId);
  handleDictionary("Technical", competencyId);
  // const modalAddCompetency = bootstrap.Modal.getInstance(document.getElementById("modalAddCompetency"));
  // if (modalAddCompetency) modalAddCompetency.hide();
};
