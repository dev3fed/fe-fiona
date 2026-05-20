async function cardSelectedCompesummary(competencyList) {
  try {
    let mandatoryCompe = [];
    let generalCompe = [];
    let specificCompe = [];
    let mandatoryCount = 0;
    let generalCount = 0;
    let specificCount = 0;

    if (competencyList.length > 0) {
      mandatoryCompe = competencyList.filter((item) => item.selectedType === "mandatory");
      specificCompe = competencyList.filter((item) => item.selectedType === "specific");
      generalCompe = competencyList.filter((item) => item.selectedType === "general");
      generalCount = generalCompe.length;
      mandatoryCount = mandatoryCompe.length;
      specificCount = specificCompe.length;
    }

    const mandatoryContent =
      mandatoryCount > 0
        ? `
        <div class="table-responsive " style="max-height: 120px;">
          <table class="table tbl-border">
            <thead style="background-color: #006CA9;">
              <tr>
                <th scope="col" style="width: 50px; text-align: center;">No</th>
                <th scope="col">Competency</th>
                <th scope="col" style="width: 130px;">Proficiency Level</th>
                <th scope="col" style="width: 60px;">Remove</th>
              </tr>
            </thead>
            <tbody>
              ${mandatoryCompe
                .map(
                  (item, index) => `
                <tr>
                  <td style="text-align: center;">${index + 1}</td>
                  <td>${item.compeName}</td>
                  <td style="text-align: center;">${item.selectedLvl}</td>
                  <td style="text-align: center;">
                     <button class="btn btn-outline-danger btn-small-icon" type="button" onclick="removeCompesummary('${
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
            <span class="desc">Selected mandatory competency will appear here</span>
          </div>
        </div>
      `;
    const generalContent =
      generalCount > 0
        ? `
        <div class="table-responsive scrollable-tbl" style="max-height: 110px;">
          <table class="table tbl-border">
            <thead style="background-color: #006CA9;">
              <tr>
                <th scope="col" style="width: 50px; text-align: center;">No</th>
                <th scope="col">Competency</th>
                <th scope="col" style="width: 130px;">Proficiency Level</th>
                <th scope="col" style="width: 60px;">Remove</th>
              </tr>
            </thead>
            <tbody>
              ${generalCompe
                .map(
                  (item, index) => `
                <tr>
                  <td style="text-align: center;">${index + 1}</td>
                  <td>${item.compeName}</td>
                  <td style="text-align: center;">${item.selectedLvl}</td>
                  <td style="text-align: center;">
                      <button class="btn btn-outline-danger btn-small-icon" type="button" onclick="removeCompesummary('${
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
            <span class="desc">Selected general competency will appear here</span>
          </div>
        </div>
      `;
    const specificContent =
      specificCount > 0
        ? `
        <div class="table-responsive scrollable-tbl" style="max-height: 140px;">
          <table class="table tbl-border">
            <thead style="background-color: #006CA9;">
              <tr>
                <th scope="col" style="width: 50px; text-align: center;">No</th>
                <th scope="col">Competency</th>
                <th scope="col" style="width: 130px;">Proficiency Level</th>
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
                     <button class="btn btn-outline-danger btn-small-icon" type="button" onclick="removeCompesummary('${
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
      <div class="competency-section">
        <!-- Mandatory -->
        <div class="row mb-2">
          <div class="col-12">
            <label>Mandatory (${mandatoryCount}/5)</label>
          </div>
          ${mandatoryContent}
        </div>

         <!-- Specific -->
        <div class="row mb-2">
          <div class="col-12">
            <label>General (${generalCount}/3)</label>
          </div>
          ${generalContent}
        </div>

        <!-- Specific -->
        <div class="row mb-2">
          <div class="col-12">
            <label>Specific (${specificCount}/9)</label>
          </div>
          ${specificContent}
        </div>
      </div>
    `;

    document.getElementById("selected-compesummary").innerHTML = bodySelectedCompe;
  } catch (error) {
    console.error("Error in cardSelectedCompesummary:", error);
  }
}

function selectJobRefsummary() {
  let $select = $("#dataSource-rasci");
  let selectedOption = $select.find(":selected"); // Ambil elemen option yang terpilih
  let selectedDraftSo = selectedOption.attr("data-draftso");
  $("#jobidRefsummary")
    .select2({
      dropdownParent: $("#ModalAddCompeSummary"),
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

function skillGroupsummary() {
  let $select = $("#dataSource-competency");
  let selectedOption = $select.find(":selected");
  let selectedDraftSo = selectedOption.attr("data-draftso");
  $("#sgId")
    .select2({
      dropdownParent: $("#ModalAddCompeSummary"),
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
function subSkillGroupsummary() {
  let $select = $("#dataSource-competency");
  let selectedOption = $select.find(":selected");
  let selectedDraftSo = selectedOption.attr("data-draftso");
  $("#ssgId")
    .select2({
      dropdownParent: $("#ModalAddCompeSummary"),
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
function compesummaryList() {
  const compesummaryId = $("#dataSource-competency").val();
  $("#compesummaryId")
    .select2({
      dropdownParent: $("#ModalAddCompeSummary"),
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
            draftId: compesummaryId,
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

function updateRadioBtnCompesummary() {
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

  updateButtonStateBySelectsAndCompesummary();
}

function updateButtonStateBySelectsAndCompesummary() {
  // const sgId = $("#sgId").val();
  // const ssgId = $("#ssgId").val();
  const competencyId = $("#compesummaryId").val();
  const selectedLvl = $('input[name="optLvl"]:checked').val();
  const selectedType = $('input[name="optType"]:checked').val();
  const btnSelectedCompe = document.getElementById("btn-selectedCompesummary");

  const competencyList = getState("payloadAddCompetency") || [];
  const mandatoryCompe = competencyList.filter((item) => item.selectedType === "mandatory");
  const generalCompe = competencyList.filter((item) => item.selectedType === "general");
  const specificCompe = competencyList.filter((item) => item.selectedType === "specific");

  const isAllSelectFilled = competencyId && competencyId.length > 0;

  const isRadioFilled = selectedLvl && selectedType;

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
async function onSelectCompesummary(event) {
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

    updateButtonStateBySelectsAndCompesummary();
  } catch (error) {
    console.error(error);
  }
}
$(document).on("change", 'input[name="optLvl"]', function () {
  console.log("optLvl changed");
  updateButtonStateBySelectsAndCompesummary();
});

$(document).on("change", 'input[name="optType"]', function () {
  console.log("optType changed");
  updateButtonStateBySelectsAndCompesummary();
});
async function removeCompesummary(compeId) {
  const competencyList = getState("payloadAddCompetency") || [];
  const updatedList = competencyList.filter((item) => item.compeId !== compeId);
  setState("payloadAddCompetency", updatedList);
  cardSelectedCompesummary(updatedList);
  updateRadioBtnCompesummary();
}
async function triggleCompesummary() {
  const selectedCompe = $("#compesummaryId");
  const compeId = selectedCompe.val();
  const CompeName = selectedCompe.find(":selected").text();
  const selectedLvl = $('input[name="optLvl"]:checked').val();
  const selectedType = $('input[name="optType"]:checked').val();
  const payloadAddCompetency = getState("payloadAddCompetency");
  const btnSelectedCompe = document.getElementById("btn-selectedCompesummary");
  const jobInformation = getState("jobInformation");
  const dataSelectedCompe = {
    compeId: compeId,
    compeName: CompeName,
    selectedLvl: selectedLvl,
    selectedType: selectedType,
    unitCode: jobInformation.unitCode,
    prlOrg: jobInformation.prlOrg,
  };
  const sentData = [...payloadAddCompetency, dataSelectedCompe];
  setState("payloadAddCompetency", sentData);
  cardSelectedCompesummary(sentData);
  updateRadioBtnCompesummary();
  $("#compesummaryId").val(null).trigger("change");
  $('input[name="optLvl"]').prop("checked", false);
  $('input[name="optType"]').prop("checked", false);
  btnSelectedCompe.disabled = true;
  btnSelectedCompe.classList.add("btn-disabled");
}

const handleRadioChangesummary = (event) => {
  const value = event.target.value;
  const jobSelect = $("#jobidRefsummary");
  // setState("payloadAddCompetency", []);
  // cardSelectedCompesummary([]);
  // updateRadioBtnCompesummary();
  if (value === "refsummary") {
    $("#compesummaryref").show();
    $("#specCompesummary, #selectedcompesummary").hide();
  } else if (value === "nonRefsummary") {
    jobSelect.val(null).trigger("change");
    $("#table-compesummaryref").hide();
    $("#compesummaryref").hide();
    $("#specCompesummary, #selectedcompesummary").show();
  }
};
const onSelectPosrefsummary = async (event) => {
  const dataSource = $("#dataSource-competency").val();
  const idPosition = event.target.value || null;
  const fullText = event.target?.options[event.target.selectedIndex]?.text;
  const positionName = fullText?.includes("(")
    ? fullText.substring(fullText.indexOf("(") + 1, fullText.indexOf(")")).trim()
    : fullText;
  console.log("idPosition", idPosition);
  try {
    const payload = {
      dataSource: dataSource,
      page: 1,
      pageSize: 999,
      jobCode: [idPosition],
    };
    const result = await fetchCompetencyReference(payload);
    const competencyList = result?.data?.level || [];
    console.log("first", competencyList);
    if (competencyList.length > 0) {
      const elementComperef = document.getElementById("table-compesummaryref");
      elementComperef.style.display = "block";
      console.log("competencyList", competencyList);
      const dataMandatory = competencyList.filter((item) => item.compType.toLowerCase() === "mandatory");
      const dataGeneral = competencyList.filter((item) => item.compType.toLowerCase() === "general");
      const dataSpecific = competencyList.filter((item) => item.compType.toLowerCase() === "specific");
      console.log("dataMandatory", dataMandatory);
      console.log("dataGeneral", dataGeneral);
      console.log("dataSpecific", dataSpecific);
      const bodyTableCompeRef = `
      <label class="form-label">Technical Competencies of ${positionName}</label>
                        <div class="card-tablebusinessreference">
                            <div class="row">
                                <div class="col-4">
                                    <h6 style="font-weight: bold;">Mandatory</h6>
                                    <table class="mt-2 mb-3 table tbl-border">
                                        <thead>
                                         <tr>
                                         <th scope="col" style="width: 40px;text-align:center">
                                         <input type="checkbox" class="form-check-input"  onclick="toggleSelectAllMandatory(this)">
                                         </th>
                                          <th scope="col" style="width: 40px;text-align:center">No</th>
                                          <th scope="col" style="width: 200px">Competency</th>
                                         <th scope="col" style="width: 150px;text-align:center">Proficiency Level</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        ${dataMandatory
                                          .map(
                                            (item, index) => `
                                            <tr>
                                                <td style="text-align:center">
                                                  <input type="checkbox" class="form-check-input" name="mandatoryCompeRef" value="${
                                                    item.id || item.compCode
                                                  }" onclick="singleSelectMandatory(this)">
                                                </td>
                                                <td style="text-align:center">${index + 1}</td>
                                                <td style="color:#03a9f4; cursor:pointer;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">${
                                                  item.compName
                                                }</td>
                                                <td style="text-align:center">${item.proficiencyLevel}</td>
                                            </tr>
                                        `,
                                          )
                                          .join("")}

                                        </tbody>
                                    </table>
                                </div>
                                <div class="col-4">
                                    <h6 style="font-weight: bold;">General</h6>
                                    <table class="mt-2 mb-3 table tbl-border">
                                        <thead>
                                        <tr>
                                        <th scope="col" style="width: 40px;text-align:center">
                                        <input type="checkbox" class="form-check-input"  onclick="toggleSelectAllGeneral(this)">
                                        </th>
                                          <th scope="col" style="width: 40px;text-align:center">No</th>
                                          <th scope="col" style="width: 200px">Competency</th>
                                          <th scope="col" style="width: 150px;text-align:center">Proficiency Level</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        ${dataGeneral
                                          .map(
                                            (item, index) => `
                                            <tr>
                                                <td style="text-align:center">
                                                  <input type="checkbox" class="form-check-input" name="generalCompeRef" value="${
                                                    item.id || item.compCode
                                                  }" onclick="singleSelectGeneral(this)">
                                                </td>
                                                <td style="text-align:center">${index + 1}</td>
                                                <td style="color:#03a9f4; cursor:pointer;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">${
                                                  item.compName
                                                }</td>
                                                <td style="text-align:center">${item.proficiencyLevel}</td>
                                            </tr>
                                        `,
                                          )
                                          .join("")}

                                        </tbody>
                                    </table>
                                </div>
                                <div class="col-4 ">
                                    <h6 style="font-weight: bold;">Specific</h6>
                                    <table class="mt-2 mb-3 table tbl-border">
                                        <thead>
                                        <tr>
                                        <th scope="col" style="width: 40px;text-align:center">
                                        <input type="checkbox" class="form-check-input"  onclick="toggleSelectAllSpecific(this)">
                                        </th>
                                          <th scope="col" style="width: 40px;text-align:center">No</th>
                                          <th scope="col" style="width: 200px">Competency</th>
                                          <th scope="col" style="width: 150px;text-align:center">Proficiency Level</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        ${dataSpecific
                                          .map(
                                            (item, index) => `
                                            <tr>
                                                <td style="text-align:center">
                                                  <input type="checkbox" class="form-check-input" name="specificCompeRef" value="${
                                                    item.id || item.compCode
                                                  }" onclick="singleSelectSpecific(this)"> 
                                                </td>
                                                <td style="text-align:center">${index + 1}</td>
                                                <td style="color:#03a9f4; cursor:pointer;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">${
                                                  item.compName
                                                }</td>
                                                <td style="text-align:center">${item.proficiencyLevel}</td>
                                            </tr>
                                        `,
                                          )
                                          .join("")}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>`;
      elementComperef.innerHTML = bodyTableCompeRef;
    }
  } catch (error) {
    console.error("Error fetching competency reference:", error);
  }
};

function closeModalCompesummary() {
  const jobSelect = $("#jobIdSummaryRef");
  jobSelect.val(null).trigger("change");
  $("#table-compesummaryref").hide();
  $("#compesummaryref").hide();
  $("#specCompesummary, #selectedcompesummary").show();
  setState("payloadAddCompetency", []);
  cardSelectedCompesummary([]);
  updateRadioBtnCompesummary();
}

const saveCompesummary = async () => {
  try {
    const payloadAddCompetency = getState("payloadAddCompetency");
    const spinBtn = document.getElementById("spinBtncompesummary");
    const ModalAddCompeSummary = document.getElementById("ModalAddCompeSummary");
    const modal = bootstrap.Modal.getInstance(ModalAddCompeSummary);
    const jobInformation = getState("jobInformation");

    if (spinBtn) spinBtn.style.display = "inline-block";
    const payload = {
      draftId: $("#dataSource-competency").val() || null,
      data: [
        {
          unitCode: payloadAddCompetency[0]?.unitCode || "",
          prlOrg: payloadAddCompetency[0]?.prlOrg || "",
          competency: payloadAddCompetency.map((item) => ({
            compCode: item.compeId,
            level: item.selectedLvl,
            compType: item.selectedType,
          })),
        },
      ],
    };
    console.log("payload", payload);
    const result = await fetchAddtechnicalCompetency(payload);
    console.log("result", result);
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
        if (modal) modal.hide();
        spinBtn.style.display = "none";
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
