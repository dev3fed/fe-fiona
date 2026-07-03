const triggleDetailActivity = async (positionCode) => {
  try {
    console.log("positionCode", positionCode);
    const dataDraft = getState("dataDetailDraft");
    const result = await fetchEditActivityCompetency(dataDraft.draftId, positionCode);
    const modal = new bootstrap.Modal(document.getElementById("modalActivityCompe"));
    modal.show();
    const modalTitle = document.getElementById("modalActivityCompeTitle");
    if (modalTitle) {
      modalTitle.innerHTML = `Activity Detail Add/Edit Competency to Position `;
    }
    const positionLabel = document.getElementById("positionLabelActivityCompe");
    if (positionLabel) {
      positionLabel.innerHTML = `Position:<strong style="margin-left: 5px;"> ${result.data[0].jobCode} - ${result.data[0].positionName}</strong>`;
    }
    setState("dataListDraftActivity", result.data);
    renderTableEditActivity(result.data);
  } catch (error) {
    console.error("Error fetching activity competency:", error);
  }
};
const inputSearchActivityCompe = async (event) => {
  try {
    const searchValue = event.target.value;
    const listData = getState("dataListDraftActivity");

    if (searchValue.length < 3) {
      renderTableEditActivity(listData);
      return;
    }

    const filteredData = listData.filter((item) => {
      const competencyName = item.competencyName || "";
      const competencyType = item.competencyType || "";
      return (
        competencyName.toLowerCase().includes(searchValue.toLowerCase()) ||
        competencyType.toLowerCase().includes(searchValue.toLowerCase())
      );
    });
    renderTableEditActivity(filteredData);
  } catch (error) {
    console.error("Error searching activity competency:", error);
  }
};

const renderTableEditActivity = async (listData) => {
  try {
    const detailInfo = listData;
    const contentBody = `
      <div class="row">
         <div class="col-12 ">
      <div class="card-tblbusiness" style="max-height: 300px;">
        <div class="table-responsive scrollable-posdetail mt-1" style="max-height: 260px;">
        <table class="table tbl-border">
          <thead>
          <tr>
            <th scope="col" style="width: 40px;text-align:center">No</th>
            <th scope="col" style="width: 200px">Competency</th>
            <th scope="col" style="width: 100px;text-align:center">Type</th>
            <th scope="col" style="width: 80px;text-align:center">Level (Before)</th>
            <th scope="col" style="width: 80px;text-align:center">Level (After)</th>
            <th scope="col" style="width: 60px;text-align:center">Action</th>
          </tr>
          </thead>
          <tbody>
          ${detailInfo
            .map((item, idx) => {
              return `
                <tr>
                <td style="text-align:center">${idx + 1}</td>
                <td>
                ${item.competencyName || "-"}
                ${
                  item.competencyReference
                    ? `<br><small style="color:#9F9FA5">(${item.competencyReference})</small>`
                    : ""
                }
                </td>
                <td style="text-align:center">
                   ${item.competencyType || "-"}
                </td>
                <td style="text-align:center">
                  ${item.levelBefore || "-"}
                </td>
                <td style="text-align:center">
                  ${item.levelAfter || "-"}
                </td>
                <td style="text-align:center">
                  <button class="btn btn-outline-light btn-small-icon" type="button" onclick='handleEditActivitycompe(JSON.parse(this.getAttribute("data-detail")))' data-detail='${JSON.stringify(
                    item,
                  )}'>
                    <img src="/assets/images/rasci/icon_pencil.svg" alt="Edit Icon">
                  </button>
                </td>
                </tr>
              `;
            })
            .join("")}
          </tbody>
        </table>
        </div>
      </div>
      </div>
      </div>
  `;
    const contentActivityCompe = document.getElementById("contentActivityCompe");
    if (contentActivityCompe) {
      contentActivityCompe.innerHTML = contentBody;
    }
    feather.replace();
    initializeTooltips();
  } catch (error) {}
};

const handleEditActivitycompe = (detailActivity) => {
  const dataDraft = getState("dataDetailDraft");
  console.log("first", dataDraft);
  console.log("detailActivity", detailActivity);
  const payload = {
    draftId: dataDraft.draftId,
    positionCode: detailActivity.unitCode,
    compCode: detailActivity.competencyCode,
    compeType: detailActivity.competencyType,
  };
  setState("detailProficiency", payload);
  const modalActivityCompe = document.getElementById("modalActivityCompe");
  const closeModal = bootstrap.Modal.getInstance(modalActivityCompe);
  if (closeModal) closeModal.hide();

  const modal = new bootstrap.Modal(document.getElementById("modalEditActivityCompe"));
  modal.show();
  const selectedLevel = detailActivity.levelAfter || "";
  const levels = [1, 2, 3, 4];
  const renderRadioButtons = (levels, selectedLevel, compeCategory) => {
    let radioButtons = levels
      .map((level) => {
        // Kondisi disabled jika compeCategory === "general" dan level < selectedLevel
        const isDisabled = compeCategory === "general" && levelBefore < selectedLevel;

        return `
            <div class="form-check form-check-inline radio radio-primary">
              <input
                class="form-check-input"
                id="radioinline${level}"
                type="radio"
                name="activityRadio"
                value="${level}"
                ${level === selectedLevel ? "checked" : ""}
                ${isDisabled ? "disabled" : ""}
              >
              <label class="form-check-label mb-0" for="radioinline${level}">${level}</label>
            </div>`;
      })
      .join("");

    // Tambahkan opsi "No Level/Remove" jika compeCategory === "specific"
    if (compeCategory === "specific") {
      radioButtons += `
            <div class="form-check form-check-inline radio radio-primary">
              <input
                class="form-check-input"
                id="activityLevel"
                type="radio"
                name="activityRadio"
                value="none"
                ${selectedLevel === "none" ? "checked" : ""}
              >
              <label class="form-check-label mb-0" for="activityLevel">Remove</label>
            </div>`;
    }

    return radioButtons;
  };
  const category = {
    mandatory: "Mandatory",
    general: "General",
    specific: "Specific",
  };
  const formContent = `
        <div class="col-12">
          <div class="row mb-2">
            <div class="col-4" style="display: flex; justify-content: space-between; align-items: center;">
              <label style="color:#9F9FA5">Competency Draft</label>
              <label>:</label>
            </div>
            <div class="col-8">
              <h6>${dataDraft.draftName}</h6>
            </div>
          </div>
        </div>
        <div class="col-12">
          <div class="row mb-2">
            <div class="col-4" style="display: flex; justify-content: space-between; align-items: center;">
              <label style="color:#9F9FA5">Position</label>
              <label>:</label>
            </div>
            <div class="col-8">
              <h6>${detailActivity.positionName}</h6>
            </div>
          </div>
        </div>
        <div class="col-12">
          <div class="row mb-2">
            <div class="col-4" style="display: flex; justify-content: space-between; align-items: center;">
              <label style="color:#9F9FA5">${category[detailActivity.competencyType]} Competency</label>
              <label>:</label>
            </div>
            <div class="col-8">
              <h6 style="color:#03A9F4; cursor: pointer" onclick="handleDetailCompetency('${
                detailActivity.competencyType
              }','${detailActivity.competencyCode}')">${detailActivity.competencyName}</h6>
            </div>
          </div>
        </div>
        <div class="col-12">
          <div class="row">
            <div class="col-4" style="display: flex; justify-content: space-between; align-items: center;">
              <label style="color:#9F9FA5">Proficiency Level</label>
              <label>:</label>
            </div>
            <div class="col-8">
               <div class="m-t-10 m-checkbox-inline">
                    ${renderRadioButtons(levels, selectedLevel, detailActivity.competencyType)}
                  </div>
            </div>
          </div>
        </div>
      `;

  const bodyContent = document.getElementById("form-editactivitycompe");
  if (bodyContent) {
    bodyContent.innerHTML = formContent;
  }
};
const deleteActivityDraft = async (positionCode) => {
  const dataDraft = getState("dataDetailDraft");
  setState("payloadDeleteActivity", { positionCode: positionCode, draftId: dataDraft.draftId });
  const modal = new bootstrap.Modal(document.getElementById("modalNotifdeleteactivity"));
  modal.show();
  try {
  } catch (error) {
    console.log("Error deleting activity draft", error);
  }
};

const confirmDeleteActivityDraft = async () => {
  const { draftId, positionCode } = getState("payloadDeleteActivity");
  const spinBtn = document.getElementById("spinDeleteactivity");
  if (spinBtn) spinBtn.style.display = "inline-block";
  try {
    const result = await fetchDeleteActivityDraft(draftId, positionCode);
    console.log("result", result);
    if (result.success === true) {
      const modalDelDraft = document.getElementById("modalNotifdeleteactivity");
      const modal = bootstrap.Modal.getInstance(modalDelDraft);
      if (modal) modal.hide();
      swal({
        title: "SUCCESS",
        icon: "success",
        buttons: false,
        timer: 2000,
        content: {
          element: "div",
          attributes: {
            innerHTML: `<div style="text-align: center;">Add/Edit Competency to Position activity data has been deleted.</div>`,
          },
        },
      }).then(async () => {
        const payloadDetailDraftPage = getState("payloadDetailDraftPage");
        const payload = {
          ...payloadDetailDraftPage,
          Page: 1,
          PageSize: payloadDetailDraftPage.PageSize,
        };
        setState("payloadDetailDraftPage", payload);
        const dataDraft = getState("dataDetailDraft");
        const queryString = `${dataDraft.draftId}?` + new URLSearchParams(payload).toString();
        const detailResult = await fetchDetailDraft(queryString);
        console.log("detailResult", detailResult);
        if (detailResult.success === true) {
          renderTableActivity(detailResult.data);
          setState("dataDetailDraft", detailResult.data);
        }
        if (spinBtn) spinBtn.style.display = "none";
      });
    } else {
      const modalDelDraft = document.getElementById("modalNotifdeleteactivity");
      const modal = bootstrap.Modal.getInstance(modalDelDraft);
      if (modal) modal.hide();
      swal({
        title: "FAILED",
        icon: "error",
        buttons: false,
        timer: 2000,
        content: {
          element: "div",
          attributes: {
            innerHTML: `<div style="text-align: center;">Failed to delete Add/Edit Competency to Position activity data. Please try again.</div>`,
          },
        },
      }).then(async () => {
        if (spinBtn) spinBtn.style.display = "none";
      });
    }
  } catch (error) {
    console.log("Error deleting activity draft", error);
  }
};

const openModalApprovalActivityCompe = async () => {
  try {
    const selectedValue = document.querySelector('input[name="activityRadio"]:checked').value;
    const detailProficiency = getState("detailProficiency");
    const dataDraft = getState("dataDetailDraft");
    const spinBtn = document.getElementById("spinBtnActivityCompe");

    if (spinBtn) spinBtn.style.display = "inline-block";
    detailProficiency.proficiencyLevel = selectedValue;
    const payload = {
      draftId: dataDraft.draftId,
      positionCode: detailProficiency.positionCode,
      compCode: detailProficiency.compCode,
      compeType: detailProficiency.compeType,
      proficiencyLevel: detailProficiency.proficiencyLevel,
    };
    console.log("payload", payload);
    const result = await fetchSaveProficiencyLevel(payload);
    if (result.success === true) {
      const modalEditActivityCompe = document.getElementById("modalEditActivityCompe");
      const modal = bootstrap.Modal.getInstance(modalEditActivityCompe);
      if (modal) {
        modal.hide();
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
              innerHTML: `<span style="text-align: center;">Your activity has been save as draft.</span>
              <br>
              <span>You can check in <b>${result.data.data.draftName}</b> at draft tab.</span>
              `,
            },
          },
        }).then(async () => {
          spinBtn.style.display = "none";
        });
      }, 100);
    }
  } catch (error) {}
};

const modalActivityeditCompetency = async () => {
  try {
    const dataDetailDraft = getState("dataDetailDraft");
    const detailProficiency = getState("detailProficiency");
    const competencyList = getState("payloadAddCompetency");
    const mandatoryCompe = competencyList.filter((item) => item.selectedType === "mandatory");
    const generalCompe = competencyList.filter((item) => item.selectedType === "general");
    const specificCompe = competencyList.filter((item) => item.selectedType === "specific");
    console.log("first", dataDetailDraft);
    console.log("detailProficiency", detailProficiency);
    const modalActivityCompe = document.getElementById("modalActivityCompe");
    const closeModal = bootstrap.Modal.getInstance(modalActivityCompe);
    if (closeModal) closeModal.hide();
    const modal = new bootstrap.Modal(document.getElementById("ModalActivityAddcompe"));
    modal.show();

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
      <div class="col-2 d-flex">
        <span class="form-label" style="min-width: 130px;">Competency Draft</span>
        <span class="mx-1">:</span>
      </div>
      <div class="col-10 fw-bold">
        ${dataDetailDraft.draftName || "N/A"}
      </div>
    </div>

    <div class="row mb-2">
      <div class="col-2 d-flex">
        <span class="form-label" style="min-width: 130px;">Position</span>
        <span class="mx-1">:</span>
      </div>
      <div class="col-10 fw-bold">
        ${dataDetailDraft.data[0].positionName || "N/A"}
      </div>
    </div>
    <div class="col-12">
    <hr>

    </div>
  `;

    //   <div class="col mb-3">
    //   <div class="m-t-15 m-checkbox-inline custom-radio-ml">
    //       <div class="form-check form-check-inline radio radio-primary">
    //           <input class="form-check-input" id="radioNonactivityreference" type="radio" name="optradio" value="nonReference" onchange="handleActivityChange(event)" checked>
    //           <label class="form-check-label mb-0" for="radioNonactivityreference">Add Technical Competency</label>
    //       </div>
    //       <div class="form-check form-check-inline radio radio-primary">
    //           <input class="form-check-input" id="radioActivityReference" type="radio" name="optradio" value="reference" onchange="handleActivityChange(event)" >
    //           <label class="form-check-label mb-0" for="radioActivityReference">Add Technical Competency from Reference</label>
    //       </div>
    //   </div>
    // </div>

    //   const bodyJobRef = `
    // <label class="form-label">Position Reference</label>
    //   <select class="form-select digits" name="jobIdRef" id="jobIdRef" onchange="onSelectPositionRefer(event)">
    //   </select>
    // `;

    const bodySelectSpecific = `
    <div class="row">
      <div class="col-12 mt-3 mb-3">
        <label>Competency</label>
        <select class="form-select digits" name="activityCompeId" id="activityCompeId" onchange="onSelectActivityCompetency(event)"></select>
      </div>
      <div id="sg-ssg-info" class="col-12" style="display:none;">
        <label style="color:#03a9f4; cursor:pointer;"
               onmouseover="this.style.textDecoration='underline'"
               onmouseout="this.style.textDecoration='none'">See dictionary</label>
        <label id="sg-ssg-label" style="display:block; margin-top:2px;"></label>
        <hr style="margin-top:20px;margin-bottom:20px"/>
      </div>

      <div class="option-row">
        <div>
          <label>Proficiency Level</label>
          <div class="d-flex gap-2">
            <input type="radio" class="btn-check" name="activity-optLvl" id="level1" autocomplete="off" value="1">
            <label class="circle-option" for="level1">1</label>

            <input type="radio" class="btn-check" name="activity-optLvl" id="level2" autocomplete="off" value="2">
            <label class="circle-option" for="level2">2</label>

            <input type="radio" class="btn-check" name="activity-optLvl" id="level3" autocomplete="off" value="3">
            <label class="circle-option" for="level3">3</label>

            <input type="radio" class="btn-check" name="activity-optLvl" id="level4" autocomplete="off" value="4">
            <label class="circle-option" for="level4">4</label>
          </div>
        </div>
      </div>
      <hr class="mt-4"/>
    </div>
    `;

    cardSelectedActivityCompetency(competencyList);
    document.getElementById("select-activitySpeccompe").innerHTML = bodySelectSpecific;
    // document.getElementById("activity-comperef").innerHTML = bodyJobRef;
    const bodyContent = document.getElementById("form-activity-competency");
    if (bodyContent) {
      bodyContent.innerHTML = formContent;
    }
    selectActivityCompetencyList();
    updateRadioBtnState();
  } catch (error) {}
};
function selectActivityCompetencyList() {
  const dataDetailDraft = getState("dataDetailDraft");
  $("#activityCompeId")
    .select2({
      dropdownParent: $("#ModalActivityAddcompe"),
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
            draftId: dataDetailDraft.draftId,
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
async function cardSelectedActivityCompetency(competencyList) {
  try {
    let specificCompe = [];
    let specificCount = 0;

    if (competencyList.length > 0) {
      specificCompe = competencyList;
      specificCount = specificCompe.length;
    }
    const specificContent =
      specificCount > 0
        ? `
        <div class="table-responsive scrollable-tbl" style="max-height: 420px;">
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
                     <button class="btn btn-outline-danger btn-small-icon" type="button" onclick="removeActivityCompetency('${
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

        <!-- Specific -->
        <div class="row mb-2">
          <div class="col-12">
            <label>Specific (${specificCount}/9)</label>
          </div>
          ${specificContent}
        </div>
      </div>
    `;

    document.getElementById("selected-activitycompe").innerHTML = bodySelectedCompe;
  } catch (error) {
    console.error("Error in cardSelectedCompetency:", error);
  }
}

function updateRadioBtnState() {
  const competencyList = getState("payloadAddCompetency") || [];
  const mandatoryCompe = competencyList.filter((item) => item.selectedType === "mandatory");
  const generalCompe = competencyList.filter((item) => item.selectedType === "general");
  const specificCompe = competencyList.filter((item) => item.selectedType === "specific");

  const typeMandatoryInput = document.getElementById("activitytypeMandatory");
  const typeMandatoryLabel = document.querySelector('label[for="activitytypeMandatory"]');
  const typeGeneralInput = document.getElementById("activitytypeGeneral");
  const typeGeneralLabel = document.querySelector('label[for="activitytypeGeneral"]');
  const typeSpecificInput = document.getElementById("activitytypeSpecific");
  const typeSpecificLabel = document.querySelector('label[for="activitytypeSpecific"]');

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

  updateBtnBySelectsAndCompetency();
}

async function triggleSelectActivityCompe() {
  const selectedCompe = $("#activityCompeId");
  const compeId = selectedCompe.val();
  const CompeName = selectedCompe.find(":selected").text();
  const selectedLvl = $('input[name="activity-optLvl"]:checked').val();
  const selectedType = $('input[name="activityOptType"]:checked').val();
  const payloadAddCompetency = getState("payloadAddCompetency");
  const btnSelectedCompe = document.getElementById("btn-activitySelectedCompe");
  const dataDetailDraft = getState("dataDetailDraft");
  const dataSelectedCompe = {
    compeId: compeId,
    compeName: CompeName,
    selectedLvl: selectedLvl,
    selectedType: selectedType,
    unitCode: dataDetailDraft.data[0].unitCode,
    prlOrg: dataDetailDraft.data[0].prl,
  };
  const sentData = [...payloadAddCompetency, dataSelectedCompe];
  console.log("sentData", sentData);
  setState("payloadAddCompetency", sentData);
  cardSelectedActivityCompetency(sentData);
  updateRadioBtnState();
  $("#activityCompeId").val(null).trigger("change");
  $('input[name="activity-optLvl"]').prop("checked", false);
  $('input[name="activityOptType"]').prop("checked", false);
  btnSelectedCompe.disabled = true;
  btnSelectedCompe.classList.add("btn-disabled");
}

function updateBtnBySelectsAndCompetency() {
  const activityCompeId = $("#activityCompeId").val();
  const selectedLvl = $('input[name="activity-optLvl"]:checked').val();
  const selectedType = $('input[name="activityOptType"]:checked').val();
  const btnSelectedCompe = document.getElementById("btn-activitySelectedCompe");

  const competencyList = getState("payloadAddCompetency") || [];
  const mandatoryCompe = competencyList.filter((item) => item.selectedType === "mandatory");
  const generalCompe = competencyList.filter((item) => item.selectedType === "general");
  const specificCompe = competencyList.filter((item) => item.selectedType === "specific");

  const isAllSelectFilled = activityCompeId && activityCompeId.length > 0;

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

async function onSelectActivityCompetency(event) {
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

    updateBtnBySelectsAndCompetency();
  } catch (error) {
    console.error(error);
  }
}

$(document).on("change", 'input[name="activity-optLvl"]', function () {
  updateBtnBySelectsAndCompetency();
});

$(document).on("change", 'input[name="activityOptType"]', function () {
  updateBtnBySelectsAndCompetency();
});
async function removeActivityCompetency(compeId) {
  const competencyList = getState("payloadAddCompetency") || [];
  const updatedList = competencyList.filter((item) => item.compeId !== compeId);
  setState("payloadAddCompetency", updatedList);
  cardSelectedActivityCompetency(updatedList);
  updateRadioBtnState();
}

function closeModalActivityCompetency() {
  // const jobSelect = $("#jobIdRef");
  // jobSelect.val(null).trigger("change");
  // $("#table-comperef").hide();
  // $("#comperef").hide();
  console.log("cek");
  $("#activitySpeccompe, #activitySelectedcompe").show();
  setState("payloadAddCompetency", []);
  cardSelectedActivityCompetency([]);
  updateRadioBtnState();
}

const handleSaveDraftActivityCompe = async () => {
  try {
    const dataDetailDraft = getState("dataDetailDraft");
    const payloadAddCompetency = getState("payloadAddCompetency");
    const spinBtn = document.getElementById("spinBtnactivitycompetency");
    const modalAddCompetency = document.getElementById("ModalActivityAddcompe");
    const modal = bootstrap.Modal.getInstance(modalAddCompetency);

    if (spinBtn) spinBtn.style.display = "inline-block";
    const payload = {
      draftId: dataDetailDraft.draftId || null,
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
      swal({
        title: "SUCCESS",
        icon: "success",
        buttons: false,
        timer: 2000,
        content: {
          element: "div",
          attributes: {
            innerHTML: `<span style="text-align: center;">Data has been added</span>
          `,
          },
        },
      }).then(async () => {
        if (modal) modal.hide();
        spinBtn.style.display = "none";
      });
    }
  } catch (error) {
    console.error("Error saving draft:", error);
  }
};
