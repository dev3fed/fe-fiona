document.addEventListener("dataLoaded", function () {
  // const jobList = getState("jobList");
  // const competencyList = getState("competencyList");
  // loadTableHeader(competencyList);
  // loadTableBody(jobList);
  feather.replace();
});

document.addEventListener("DOMContentLoaded", function () {
  // const jobList = getState("jobList");
  // const competencyList = getState("competencyList");
  let selectElement = document.querySelector("#dataSource-competency");

  selectedType = document.querySelector(".dropdown-menu .dropdown-item").textContent.trim();

  if (selectElement.value === "master") {
    document.getElementById("pills-competency-tabcontent").style.display = "none";
  }
  fetctDataSourceComp();
  // loadTableHeader(competencyList);
  // loadTableBody(jobList);
  feather.replace();
});

async function openPageDictionary() {
  try {
    const dictionaryPage = document.getElementById("dictionary-page");
    const mainCompetency = document.getElementById("main-competency");
    const headerCompetency = document.getElementById("header-competency");
    const headerDictionary = document.getElementById("header-dictionarypage");
    if (dictionaryPage) {
      dictionaryPage.style.display = "block";
    }
    if (mainCompetency) {
      mainCompetency.style.display = "none";
    }
    if (headerDictionary) {
      headerDictionary.style.display = "block";
    }
    if (headerCompetency) {
      headerCompetency.style.display = "none";
    }
    bodypageMandatory();
    bodypageTechnical();
    bodypageBehavior();
  } catch (error) {}
}
function fetctDataSourceComp(draftId = null) {
  $.ajax({
    url: `${url_api}/api/Utilities/selection`,
    dataType: "json",
    data: {
      type: "draft-comp",
      page: 1,
      search: "",
    },
    success: function (response) {
      if (response && response.data && response.data.result) {
        let $select = $("#dataSource-competency");
        $select.find("option:not(:first)").remove();
        response.data.result.forEach((item) => {
          let isSelected = draftId && item.id == draftId;
          $select.append(new Option(item.text, item.id, isSelected, isSelected));
        });
        if (draftId) {
          let newOption = new Option(`Draft ${draftId}`, draftId, true, true);
          $select.append(newOption);
        }
        $select.select2({
          placeholder: "Choose",
          allowClear: true,
        });
        if (draftId) {
          $select.val(draftId).trigger("change");
        }
      }
    },
  });
}
function onSelectType(text) {
  setState("selectedType", text);
  document.getElementById("btnSearchType").innerText = text;
  document.getElementById("inputText").value = "";
}
$(document).ready(function () {
  $("#inputText").keyup(function () {
    if ($(this).val() == "") {
      $("#btnSearchCompe").prop("disabled", true);
    } else {
      $("#btnSearchCompe").prop("disabled", false);
    }
  });
});

async function handleSearchCompetency() {
  try {
    const spinner = document.getElementById("loadingSearch");
    spinner.style.display = "inline-block";
    const searchType = getState("selectedType");
    const searchText = document.getElementById("inputText").value;
    let selectElement = document.querySelector("#dataSource-competency");
    const payloadJob = getState("payloadJob");
    const payloadCompetency = getState("payloadCompetency");
    const storageDataCompetency = getState("storageDataCompetency");
    const storageDataMapping = getState("storageDataMapping");
    console.log("storageDataCompetency", storageDataCompetency);
    console.log("storageDataMapping", storageDataMapping);
    setState("storageDataCompetency", []);
    setState("storageDataMapping", []);
    const payload = {
      ...payloadJob,
      dataSource: selectElement.value,
      filter: searchType,
      search: searchText,
      page: 1,
    };
    setState("payloadJob", payload);
    setState("currentPageY", 1);
    setState("currentPageX", 1);
    const queryString = "?" + new URLSearchParams(payload).toString();
    const resultJob = await fetchJobList(queryString);
    const listJobCode = resultJob.data.map((value) => value.positionCode);
    if (resultJob.data.length > 0) {
      const body = {
        ...payloadCompetency,
        dataSource: selectElement.value,
        jobCode: listJobCode,
        page: 1,
      };
      setState("payloadCompetency", body);
      const resultCompetency = await fetchCompetencyList(body);
      console.log("resultCompetency", resultCompetency);
      const combineCompetency = [...storageDataCompetency, ...resultCompetency.data.competency];
      // const bodyMapping = {
      //   dataSource: selectElement.value,
      //   jobCode: resultJob.data.map((value) => value.jobCode),
      //   compCode: resultCompetency?.data.map((val) => val.compCode),
      //   page: 1,
      //   pageSize: 10,
      // };
      // const resultMapping = await fetchCompetencyMapping(bodyMapping);
      // appState.competencyMapping = resultMapping.data.level;
      // appState.jobList = resultJob.data;
      // appState.competencyList = resultCompetency?.data.competency;

      // set display id empty-competency none
      document.getElementById("empty-competency").style.display = "none";
      document.getElementById("table-competency").style.display = "block";
      $("#table-body").empty();
      setTimeout(() => {
        setState("storageDataCompetency", combineCompetency);
        setState("storageDataMapping", resultCompetency.data.level);
        loadTableHeader(resultCompetency?.data.competency);
        loadTableBody(resultJob.data);
        mapCompetencyCells(listJobCode, combineCompetency, resultCompetency.data.level);
      }, 500);
    }
    spinner.style.display = "none";
  } catch (error) {}
}
function changeDataSource(dataSource) {
  if (dataSource !== "master") {
    document.getElementById("pills-competency-tabcontent").style.display = "flex";
    document.getElementById("btnCreateDraft").style.display = "none";
  } else {
    document.getElementById("pills-competency-tabcontent").style.display = "none";
    document.getElementById("btnCreateDraft").style.display = "flex";
  }
}

// function loadTableHeader(competencyList) {
//   const typeMap = {
//     mandatory: "Mandatory",
//     general: "General",
//     spesifik: "Specific",
//   };

//   const typeCounts = {
//     mandatory: competencyList.filter((item) => item.compType === "mandatory").length,
//     general: competencyList.filter((item) => item.compType === "general").length,
//     spesifik: competencyList.filter((item) => item.compType === "spesifik").length,
//   };

//   let headerRow1 = `
//     <tr style="height: 30px;">
//       <th rowspan="2" class="headcol head-cell" style="
//         position: sticky;
//         left: 0;
//         top: 0;
//         z-index: 5;
//         background-color: #fff;
//         vertical-align: middle;
//         text-align: center;
//       ">
//         <span style="padding-left:10px;">Job Title</span>
//       </th>`;

//   // Loop setiap jenis kompetensi
//   for (const [key, label] of Object.entries(typeMap)) {
//     if (typeCounts[key] > 0) {
//       headerRow1 += `<th class="tg-baqh competency-cell color-${key}" colspan="${typeCounts[key]}">${label}</th>`;
//     }
//   }

//   headerRow1 += `</tr>`;

//   const headerRow2 = `
//     <tr style="height: 50px;">
//       ${competencyList
//         .map(
//           (val) => `
//             <th class="color-${val.compType} competency-cell">
//               <div class='competency-cell-wrapper' data-bs-toggle="tooltip" data-bs-placement="bottom"
//                 title="${val.compName}" onclick="handleDetailCompetency('${val.compCode}')">
//                 ${val.compName}
//               </div>
//             </th>`,
//         )
//         .join("")}
//     </tr>
//   `;

//   document.getElementById("table-header").innerHTML = headerRow1 + headerRow2;
//   initializeTooltips();
// }

function loadTableHeader(competencyList) {
  const headerTable = document.getElementById("table-header");
  headerTable.innerHTML = renderStaticHeader(); // buat #header-row-1 dan #header-row-2

  appendDynamicHeader(competencyList); // baru di sini aman diisi
}

function renderStaticHeader() {
  return `
    <tr style="height: 30px;" id="header-row-1">
      <th rowspan="2" class="headcol head-cell" style="
        position: sticky;
        left: 0;
        top: 0;
        z-index: 5;
        background-color: #fff;
        vertical-align: middle;
        text-align: center;
      ">
        <span style="padding-left:10px;">Job Title</span>
      </th>
    </tr>
    <tr id="header-row-2" style="height: 50px;"></tr>
  `;
}

function appendDynamicHeader(competencyList) {
  const headerRow1 = document.getElementById("header-row-1");
  const headerRow2 = document.getElementById("header-row-2");

  if (!headerRow1 || !headerRow2) {
    console.error("Header row 1 atau 2 tidak ditemukan!");
    return;
  }

  const typeMap = {
    mandatory: "Mandatory",
    general: "General",
    spesifik: "Specific",
  };

  // 1. Hapus semua <th> dinamis sebelumnya dari headerRow1 (selain kolom "Job Title")
  headerRow1.querySelectorAll(".competency-cell").forEach((th) => th.remove());

  // 2. Hapus semua kolom dari headerRow2
  while (headerRow2.firstChild) {
    headerRow2.removeChild(headerRow2.firstChild);
  }

  // 3. Hitung jumlah kompetensi berdasarkan tipe
  const typeCounts = {
    mandatory: competencyList.filter((item) => item.compType === "mandatory").length,
    general: competencyList.filter((item) => item.compType === "general").length,
    spesifik: competencyList.filter((item) => item.compType === "spesifik").length,
  };

  // 4. Tambahkan kolom grup: Mandatory / General / Specific
  for (const [key, label] of Object.entries(typeMap)) {
    if (typeCounts[key] > 0) {
      const th = document.createElement("th");
      th.className = `tg-baqh competency-cell color-${key}`;
      th.colSpan = typeCounts[key];
      th.textContent = label;
      headerRow1.appendChild(th);
    }
  }

  // 5. Tambahkan kolom kompetensi satu per satu ke baris kedua
  competencyList.forEach((val) => {
    const th = document.createElement("th");
    th.className = `color-${val.compType} competency-cell`;

    const wrapper = document.createElement("div");
    wrapper.className = "competency-cell-wrapper";
    wrapper.setAttribute("data-bs-toggle", "tooltip");
    wrapper.setAttribute("data-bs-placement", "bottom");
    wrapper.title = val.compName;
    wrapper.textContent = val.compName;
    wrapper.onclick = () => handleDetailCompetency(val.compCode);

    th.appendChild(wrapper);
    headerRow2.appendChild(th);
  });

  initializeTooltips();
}

function loadTableBody(jobList) {
  const tableBody = document.getElementById("table-body");

  if (!tableBody) {
    console.error("Table body element not found");
    return;
  }

  // Kosongkan tbody sebelum isi baru ditambahkan
  // while (tableBody.firstChild) {
  //   tableBody.removeChild(tableBody.firstChild);
  // }

  // Tambahkan setiap baris
  jobList?.forEach((val) => {
    const tr = document.createElement("tr");
    tr.id = `tr-${val.positionCode}`;
    const td = document.createElement("td");
    td.className = "headcol";

    const wrapperDiv = document.createElement("div");
    wrapperDiv.className = "joblist-cell-wrapper";

    const nameDiv = document.createElement("div");
    nameDiv.className = "flex-fill joblist-name";
    nameDiv.textContent = val.positionName;

    nameDiv.onclick = () => {
      console.log("Clicked position:", val.positionName);
      // atau jalankan fungsi lain, misalnya:
      // openDetailModal(val.positionCode);

      // open modal by id ModalDetailPos
      const modal = new bootstrap.Modal(document.getElementById("ModalDetailPos"));
      modal.show();
    };

    wrapperDiv.appendChild(nameDiv);
    td.appendChild(wrapperDiv);
    tr.appendChild(td);
    tableBody.appendChild(tr);
  });

  feather.replace();
  initializeTooltips();
}

// Initialize tooltips after rendering
function initializeTooltips() {
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));
}

function mapCompetencyCells(listJobCode, listCompetency, competencyMapping) {
  // console.log("listJobCode", listJobCode);
  // console.log("listCompetency", listCompetency);
  // console.log("competencyMapping", competencyMapping);

  listJobCode.forEach((jobCode) => {
    const row = getRowById(`tr-${jobCode}`);
    if (!row) {
      console.warn(`Baris dengan ID #tr-${jobCode} tidak ditemukan!`);
      return;
    }
    row.querySelectorAll("td[data-index]").forEach((td) => td.remove());
    listCompetency.forEach((value) => {
      const competencyItem = competencyMapping.find(
        (rm) => rm.positionCode === jobCode && rm.compCode === value.compCode,
      );
      // console.log("competencyItem", competencyItem);

      const tdElement = document.createElement("td");
      tdElement.dataset.index = `${jobCode}-${value.compCode}`;

      const level = competencyItem?.level || "";

      tdElement.innerHTML = `
        <div class="competency-container">
          <div class="competency-value">
            ${level}
          </div>
          <img src="/assets/images/rasci/pencil_rasci.svg" alt="Pencil Icon" class="pencil-icon" onclick="openModalEditDepth('${jobCode}', '${value.compCode}')">
        </div>
      `;

      row.appendChild(tdElement);
    });
  });
}

const openModalEditDepth = async (jobCode, compCode) => {
  const selectedValue = $("#dataSource-competency").val();
  const payload = {
    dataSource: selectedValue,
    positionCode: jobCode,
    competencyCode: compCode,
  };
  const queryString = "?" + new URLSearchParams(payload).toString();
  const result = await fetchProficiencyLevel(queryString);
  setState("detailProficiency", result.data);
  const competencyLevel = result.data.proficiencyLevel;
  const compeCategory = result.data.competencyType;
  const detailData = result.data;

  const btnApproval = document.getElementById("btnSubmitApproval");
  btnApproval.disabled = competencyLevel ? false : true;

  if (compeCategory !== "mandatory") {
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
              <h6 style="color:#03A9F4; cursor: pointer" onclick="handleDetailCompetency('${detailData.compCode}')">${
      detailData.compName
    }</h6>
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
  const btnApproval = document.getElementById("btnSubmitApproval");
  btnApproval.disabled = selectedValue ? false : true;
};
const openModalSaveDraft = () => {
  const modal = new bootstrap.Modal(document.getElementById("modalSaveDraft"));
  modal.show();
};
const openModalApprovalDepthLevel = async () => {
  // get value from input radio id radioinlineNone
  try {
    //
    const selectedValue = document.querySelector('input[name="radio1"]:checked').value;
    const draftId = $("#dataSource-competency").val();
    const detailProficiency = getState("detailProficiency");
    console.log("detailProficiency", detailProficiency);
    console.log("cek", selectedValue);
    const payload = {
      draftId: draftId,
      positionCode: detailProficiency.positionCode,
      compCode: detailProficiency.compCode,
      proficiencyLevel: selectedValue,
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

const handleDetailCompetency = async (id) => {
  // open modal dengan id modalDetailCompe
  const dataDetail = await fetchCompetencyDetail(id);
  const modal = new bootstrap.Modal(document.getElementById("modalDetailCompe"));
  modal.show();

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

  const modalBodyContent = document.getElementById("body-detailcompe");
  if (modalBodyContent) {
    modalBodyContent.innerHTML = formContent;
  }
};
