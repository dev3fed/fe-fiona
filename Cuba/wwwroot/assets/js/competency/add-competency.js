const openSpecificCompetency = async () => {
  const dataSource = $("#dataSource-competency").val();
  const draftName = $("#dataSource-competency option:selected").text();
  const modalDetailPos = document.getElementById("ModalDetailPos");
  const jobInformation = getState("jobInformation");
  const closeModal = bootstrap.Modal.getInstance(modalDetailPos);
  const competencyList = getState("payloadAddCompetency");
  const coreCompe = competencyList.filter(
    (item) => item.selectedType === "core",
  );
  const specificCompe = competencyList.filter(
    (item) => item.selectedType === "specific",
  );
  const modal = new bootstrap.Modal(
    document.getElementById("modalAddCompetency"),
  );
  closeModal.hide();

  let coreDisabled = "";
  let coreLabelStyle = "";
  let specificDisabled = "";
  let specificLabelStyle = "";

  if (coreCompe.length > 2) {
    coreDisabled = "disabled";
    coreLabelStyle =
      "background-color: #E0E0E0; color: #A0A0A0; cursor: not-allowed;";
  }

  if (specificCompe.length > 8) {
    specificDisabled = "disabled";
    specificLabelStyle =
      "background-color: #E0E0E0; color: #A0A0A0; cursor: not-allowed;";
  }

  const formContent = `
    <div class="row mb-2">
      <div class="col-2 d-flex">
        <span class="form-label" style="min-width: 130px;">Competency Draft</span>
        <span class="mx-1">:</span>
      </div>
      <div class="col-10 fw-bold">
        ${draftName}
      </div>
    </div>

    <div class="row mb-2">
      <div class="col-2 d-flex">
        <span class="form-label" style="min-width: 130px;">Position</span>
        <span class="mx-1">:</span>
      </div>
      <div class="col-10 fw-bold">
        ${jobInformation.positionName || "N/A"}
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

  const bodyJobRef = `
  <label class="form-label">Position Reference</label>
    <select class="form-select digits" name="jobIdRef" id="jobIdRef">
    </select>
  <hr style="margin-top:25px;margin-bottom:20px" />
  `;

  const bodySelectSpecific = `
  <div class="row">
    <div class="col-12">
      <label>Skill Group</label>
      <select class="form-select digits" name="sgId" id="sgId" onchange="onSelectSg(event)"></select>
    </div>
    <div class="col-12 mt-3">
      <label>Sub Skill Group</label>
      <select class="form-select digits" name="ssgId" id="ssgId" onchange="onSelectSsg(event)"></select>
    </div>
    <div class="col-12 mt-3">
      <label>Competency</label>
      <select class="form-select digits" name="competencyId" id="competencyId" onchange="onSelectCompetency(event)"></select>
    </div>
    <div class="option-row mt-4">
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

      <div style="margin-left: 30px;">
        <label>Type</label>
        <div class="d-flex gap-2">
          <input type="radio" class="btn-check" name="optType" id="typeCore" autocomplete="off" value="core" ${coreDisabled}>
          <label class="oval-option" for="typeCore" style="${coreLabelStyle}">Core</label>

          <input type="radio" class="btn-check" name="optType" id="typeSpecific" autocomplete="off" value="specific" ${specificDisabled}>
          <label class="oval-option" for="typeSpecific" style="${specificLabelStyle}">Specific</label>
        </div>
      </div>
    </div>
    <hr/>
  </div>
  `;

  cardSelectedCompetency(competencyList);
  document.getElementById("select-speccompe").innerHTML = bodySelectSpecific;
  document.getElementById("comperef").innerHTML = bodyJobRef;

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
  const coreCompe = competencyList.filter(
    (item) => item.selectedType === "core",
  );
  const specificCompe = competencyList.filter(
    (item) => item.selectedType === "specific",
  );

  const typeCoreInput = document.getElementById("typeCore");
  const typeCoreLabel = document.querySelector('label[for="typeCore"]');
  const typeSpecificInput = document.getElementById("typeSpecific");
  const typeSpecificLabel = document.querySelector('label[for="typeSpecific"]');

  if (typeCoreInput && typeCoreLabel) {
    if (coreCompe.length > 2) {
      typeCoreInput.disabled = true;
      typeCoreLabel.style.backgroundColor = "#E0E0E0";
      typeCoreLabel.style.color = "#A0A0A0";
      typeCoreLabel.style.cursor = "not-allowed";
      typeCoreLabel.style.border = "1px solid #A0A0A0";
    } else {
      typeCoreInput.disabled = false;
      typeCoreLabel.style = "";
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

  // Pastikan tombol juga diperbarui setiap kali radio diupdate
  updateButtonStateBySelectsAndCompetency();
}

async function cardSelectedCompetency(competencyList) {
  try {
    let coreCompe = [];
    let specificCompe = [];
    let coreCount = 0;
    let specificCount = 0;

    if (competencyList.length > 0) {
      coreCompe = competencyList.filter((item) => item.selectedType === "core");
      specificCompe = competencyList.filter(
        (item) => item.selectedType === "specific",
      );
      coreCount = coreCompe.length;
      specificCount = specificCompe.length;
    }

    const coreContent =
      coreCount > 0
        ? `
        <div class="table-responsive " style="max-height: 200px;">
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
              ${coreCompe
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
            <span class="desc">Selected core competency will appear here</span>
          </div>
        </div>
      `;

    const specificContent =
      specificCount > 0
        ? `
        <div class="table-responsive scrollable-tbl" style="max-height: 150px;">
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
      <div class="competency-section">
        <!-- Core -->
        <div class="row mb-2">
          <div class="col-12">
            <label>Core (${coreCount}/3)</label>
          </div>
          ${coreContent}
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

    document.getElementById("selected-compe").innerHTML = bodySelectedCompe;
  } catch (error) {
    console.error("Error in cardSelectedCompetency:", error);
  }
}
function updateButtonStateBySelectsAndCompetency() {
  const sgId = $("#sgId").val();
  const ssgId = $("#ssgId").val();
  const competencyId = $("#competencyId").val();
  const selectedLvl = $('input[name="optLvl"]:checked').val();
  const selectedType = $('input[name="optType"]:checked').val();
  const btnSelectedCompe = document.getElementById("btn-selectedCompe");

  const competencyList = getState("payloadAddCompetency") || [];
  const coreCompe = competencyList.filter(
    (item) => item.selectedType === "core",
  );
  const specificCompe = competencyList.filter(
    (item) => item.selectedType === "specific",
  );

  const isAllSelectFilled =
    sgId &&
    sgId.length > 0 &&
    ssgId &&
    ssgId.length > 0 &&
    competencyId &&
    competencyId.length > 0;

  const isRadioFilled = selectedLvl && selectedType;

  const isCompeLimitExceeded = coreCompe.length > 2 && specificCompe.length > 8;

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

async function onSelectSg(event) {
  updateButtonStateBySelectsAndCompetency();
}
async function onSelectSsg(event) {
  updateButtonStateBySelectsAndCompetency();
}
async function onSelectCompetency(event) {
  updateButtonStateBySelectsAndCompetency();
}
$(document).on("change", 'input[name="optLvl"]', function () {
  console.log("optLvl changed");
  updateButtonStateBySelectsAndCompetency();
});

$(document).on("change", 'input[name="optType"]', function () {
  console.log("optType changed");
  updateButtonStateBySelectsAndCompetency();
});

async function removeCompetency(compeId) {
  const competencyList = getState("payloadAddCompetency") || [];
  const updatedList = competencyList.filter((item) => item.compeId !== compeId);
  setState("payloadAddCompetency", updatedList);
  cardSelectedCompetency(updatedList);
  updateRadioButtonState();
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
  const dataChangeNotasi = getState("dataChangeNotasi");
  const reset = {
    ...dataChangeNotasi,
    busProsMapped: [],
  };
  if (value === "reference") {
    $("#comperef").show();
    $("#specCompe, #selectedcompe").hide();
    // cardSelectedNotasilist(reset);
    // setState("dataChangeNotasi", reset);
    // setState("listSelectedProsbisref", []);
    // cardSelectedProsbisref();
  } else if (value === "nonReference") {
    jobSelect.val(null).trigger("change");
    $("#table-comperef").hide();
    $("#comperef").hide();
    $("#specCompe, #selectedcompe").show();
    // setState("dataChangeNotasi", reset);
    // setState("listSelectedProsbisref", []);
    // cardSelectedProsbisref();
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

async function triggleSelectCompe() {
  const selectedSg = $("#sgId");
  const sgId = selectedSg.val();
  const SgName = selectedSg.find(":selected").text();
  const selectedSsg = $("#ssgId");
  const ssgId = selectedSsg.val();
  const SsgName = selectedSsg.find(":selected").text();
  const selectedCompe = $("#competencyId");
  const compeId = selectedCompe.val();
  const CompeName = selectedCompe.find(":selected").text();
  const selectedLvl = $('input[name="optLvl"]:checked').val();
  const selectedLvlId = $('input[name="optLvl"]:checked').attr("id");
  const selectedType = $('input[name="optType"]:checked').val();
  const selectedTypeId = $('input[name="optType"]:checked').attr("id");
  const payloadAddCompetency = getState("payloadAddCompetency");
  const dataSelectedCompe = {
    sgId: sgId,
    sgName: SgName,
    ssgId: ssgId,
    ssgName: SsgName,
    compeId: compeId,
    compeName: CompeName,
    selectedLvl: selectedLvl,
    selectedType: selectedType,
  };
  const sentData = [...payloadAddCompetency, dataSelectedCompe];
  setState("payloadAddCompetency", sentData);
  cardSelectedCompetency(sentData);
  updateRadioButtonState();
  $("#sgId").val(null).trigger("change");
  $("#ssgId").val(null).trigger("change");
  $("#competencyId").val(null).trigger("change");
  $('input[name="optLvl"]').prop("checked", false);
  $('input[name="optType"]').prop("checked", false);
}
