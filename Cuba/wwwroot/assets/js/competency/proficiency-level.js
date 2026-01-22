const openModalEditDepth = async (jobCode, compCode, compeType) => {
  const selectedValue = $("#dataSource-competency").val();
  const payload = {
    dataSource: selectedValue,
    positionCode: jobCode,
    compeType: compeType,
    competencyCode: compCode,
  };
  const queryString = "?" + new URLSearchParams(payload).toString();
  const result = await fetchProficiencyLevel(queryString);
  console.log("result", result);
  setState("detailProficiency", { ...result.data, compeType: compeType });
  const competencyLevel = result.data.proficiencyLevel;
  const compeCategory = result.data.competencyType || compeType;
  const detailData = result.data;

  const btnApproval = document.getElementById("btnSubmitApproval");
  btnApproval.disabled = competencyLevel ? false : true;

  // if (compeCategory !== "mandatory") {
  const modal = new bootstrap.Modal(document.getElementById("modalEditDepthLevel"));
  modal.show();

  const selectedLevel = competencyLevel || "";

  // Array dinamis untuk level
  const levels = [1, 2, 3, 4];

  // Fungsi untuk membuat radio button secara dinamis
  const renderRadioButtons = (levels, selectedLevel, compeCategory) => {
    let radioButtons = levels
      .map((level) => {
        // Kondisi disabled jika compeCategory === "general" dan level < selectedLevel
        const isDisabled = compeCategory === "general" && level < selectedLevel;

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
    if (compeCategory === "specific") {
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
  // Isi konten form secara dinamis
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
              <h6>${detailData.draftName}</h6>
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
              <h6>${detailData.positionName}</h6>
            </div>
          </div>
        </div>
        <div class="col-12">
          <div class="row mb-2">
            <div class="col-4" style="display: flex; justify-content: space-between; align-items: center;">
              <label style="color:#9F9FA5">${category[compeCategory]} Competency</label>
              <label>:</label>
            </div>
            <div class="col-8">
              <h6 style="color:#03A9F4; cursor: pointer" onclick="handleDetailCompetency('${
                detailData.competencyType
              }','${detailData.compCode}')">${detailData.compName}</h6>
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
  // }
  // else {
  //   const modal = new bootstrap.Modal(document.getElementById("ModalWarning"));
  //   modal.show();
  //   const formContent = `
  //   <div class="col-12">
  //       <div class="mb-2 m-4" style="text-align: center">
  //       <img src="/assets/images/competency/close-circle.svg" class="mb-3"
  //                       alt="Filter Icon" style="margin-right: 8px;margin-top:-10px">
  //         <h4>CAN'T EDIT</h4>
  //       </div>
  //   </div>
  //   <div class="col-12">
  //       <div class="mt-2" style="text-align: center">
  //         <label>Mandatory competency depth level cannot be changed/edited</label>
  //       </div>
  //   </div>
  //   <div class="col-12 mt-3">
  //     <button class="btn btn-outline-light" type="button" style="width: 100%" data-bs-dismiss="modal">
  //     OK</button>
  //   </div>
  // `;

  //   const bodyContent = document.getElementById("form-warning");
  //   if (bodyContent) {
  //     bodyContent.innerHTML = formContent;
  //   }
  // }
};

const openModalApprovalDepthLevel = async () => {
  try {
    const selectedValue = document.querySelector('input[name="radio1"]:checked').value;
    const draftId = $("#dataSource-competency").val();
    const detailProficiency = getState("detailProficiency");
    const payload = {
      draftId: draftId,
      positionCode: detailProficiency.positionCode,
      compCode: detailProficiency.compCode,
      proficiencyLevel: selectedValue,
      compeType: detailProficiency.compeType,
    };
    console.log("payload", payload);
    const result = await fetchSaveProficiencyLevel(payload);
    console.log("result", result);
    if (result.success === true) {
      const modalEditDepthLevel = document.getElementById("modalEditDepthLevel");
      const modal = bootstrap.Modal.getInstance(modalEditDepthLevel);
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
          // spinner.style.display = "none";
          // const payload = {
          //   Page: 1,
          //   PageSize: 5,
          // };
          // const queryString = new URLSearchParams(payload).toString();
          // const dataDraft = await fetchDraftProsbis(queryString);
          // const IsNotEmpty = dataDraft.data.length;
          // handleClickCard(IsNotEmpty);
          // loadTableBodyDraft(dataDraft);
          handleSearchCompetency();
        });
      }, 100);
    }
    // fetchSaveProficiencyLevel()
  } catch (error) {}
};

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
          customClass: {
            popup: "swal-custom-popup",
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
