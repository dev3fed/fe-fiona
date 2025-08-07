async function onModalChoose(type, jobId, prosbisId) {
  const modal = new bootstrap.Modal(document.getElementById("modalChoosedraft"));
  modal.show();
  const body = document.getElementById("body-choosedraft");
  body.innerHTML = `
  <div class="col mb-3">
    <div class="m-t-15 m-checkbox-inline custom-radio-ml">
        <div class="form-check form-check-inline radio radio-primary">
            <input class="form-check-input" id="radionewdraft" type="radio" name="optradio" value="optNewdraft" onchange="onSelectDraft(event)" checked>
            <label class="form-check-label mb-0" for="radionewdraft">New draft</label>
        </div>
        <div class="form-check form-check-inline radio radio-primary">
            <input class="form-check-input" id="radioexisting" type="radio" name="optradio" value="optExisting" onchange="onSelectDraft(event)">
            <label class="form-check-label mb-0" for="radioexisting">Existing draft</label>
        </div>
    </div>
  </div>
  <div class="row">
        <input class="form-control" type="text" id="type-action" value="${type}" hidden>
        <input class="form-control" type="text" id="jobid-action" value="${jobId}" hidden>
        <input class="form-control" type="text" id="prosbisid-action" value="${prosbisId}" hidden>
    <div class="col-12">
        <label class="form-label">Organization Data Source</label>
        <select class="form-select">
            <option selected="" disabled="" value="">Choose organization data source</option>
            <option>...</option>
        </select>
    </div>
    <div class="col-12 mt-3" id="draft-name-container">
        <label class="form-label">Draft Name</label>
        <input class="form-control" type="text" id="input-draftname" placeholder="Input draft name">
    </div>
  </div>`;
}

function onSelectDraft(event) {
  const draftNameContainer = document.getElementById("draft-name-container");
  if (event.target.value === "optExisting") {
    draftNameContainer.innerHTML = `
      <label class="form-label">Draft Name</label>
      <select class="form-select" id="select-draftname">
         
      </select>`;
  } else if (event.target.value === "optNewdraft") {
    draftNameContainer.innerHTML = `
      <label class="form-label">Draft Name</label>
      <input class="form-control" type="text" id="input-draftname" placeholder="Input draft name">`;
  }
  // Initialize Bootstrap Select
  $(".selectpicker").selectpicker();
  updateSelect2DraftList();
}

// async function handleContinue() {
//   try {
//     const typeAction = document.getElementById("type-action");
//     const typeJob = document.getElementById("jobid-action");
//     const typeProsbis = document.getElementById("prosbisid-action");
//     const radionewdraft = document.getElementById("radionewdraft").checked;
//     const spinner = document.getElementById("loadingChoose");
//     const dataProsbis = getState("insertProsbis");
//     spinner.style.display = "inline-block";
//     if (radionewdraft === true) {
//       const inputDraftName = document.getElementById("input-draftname").value;
//       const payload = {
//         draftName: inputDraftName,
//         draftSOId: "",
//       };
//       const result = await createDraftRasci(payload);
//       if (result.success === true) {
//         const dataResult = result?.data;
//         const dataSend = {
//           ...dataProsbis,
//           draftId: dataResult.draftId,
//           draftName: dataResult.draftName,
//           draftSOId: dataResult.draftSOId,
//         };
//         setState("insertProsbis", dataSend);
//         const modalChoose = document.getElementById("modalChoosedraft");
//         const hideModalChoose = bootstrap.Modal.getInstance(modalChoose);
//         if (hideModalChoose) {
//           hideModalChoose.hide();
//         }
//         setTimeout(() => {
//           swal({
//             title: "SUCCESS",
//             icon: "success",
//             buttons: false,
//             timer: 2000,
//             content: {
//               element: "div",
//               attributes: {
//                 innerHTML: `<div style="text-align: center;">${dataResult.draftName} draft has been saved</div>`,
//               },
//             },
//           }).then(async () => {
//             const type = typeAction.value;
//             spinner.style.display = "none";
//             if (type === "addNewBp") {
//               onModalAddBp();
//             } else if (type === "addNotation") {
//               const dataChangeNotasi = getState("dataChangeNotasi");
//               const dataSend = {
//                 ...dataChangeNotasi,
//                 draftId: dataResult.draftId,
//                 draftName: dataResult.draftName,
//                 draftSOId: "",
//               };
//               setState("dataChangeNotasi", dataSend);
//               onModalAddNotation();
//             } else if (type === "editNotation") {
//               const dataDetailProsbis = getState("dataDetailProsbis");
//               const dataSend = {
//                 ...dataDetailProsbis,
//                 draftId: dataResult.draftId,
//                 draftName: dataResult.draftName,
//                 draftSOId: "",
//               };
//               setState("dataDetailProsbis", dataSend);
//               openModalNotRow(typeJob.value, typeProsbis.value);
//             } else if (type === "editProsbis") {
//               const dataDetailProsbis = getState("dataDetailProsbis");
//               const dataSend = {
//                 ...dataDetailProsbis,
//                 draftId: dataResult.draftId,
//                 draftName: dataResult.draftName,
//                 draftSOId: "",
//               };
//               setState("dataDetailProsbis", dataSend);
//               openModalEditBusinesspro();
//             } else if (type === "deleteProsbis") {
//               const dataDelete = getState("dataDeleteProsbis");
//               const dataSend = {
//                 ...dataDelete,
//                 draftId: dataResult.draftId,
//                 draftName: dataResult.draftName,
//                 draftSOId: "",
//               };
//               setState("dataDeleteProsbis", dataSend);
//               openModalDeleteBusinesspro();
//             }
//           });
//         }, 200);
//       }
//     } else {
//       const modalChoose = document.getElementById("modalChoosedraft");
//       const hideModalChoose = bootstrap.Modal.getInstance(modalChoose);
//       const selectDraftName = document.getElementById("select-draftname");
//       const draftId = selectDraftName.value;
//       const textDraftName =
//         selectDraftName.options[selectDraftName.selectedIndex].text;
//       const dataSend = {
//         ...dataProsbis,
//         draftId: draftId,
//         draftName: textDraftName,
//         draftSOId: "",
//       };
//       setState("insertProsbis", dataSend);
//       if (hideModalChoose) {
//         hideModalChoose.hide();
//       }
//       spinner.style.display = "none";
//       const type = typeAction.value;
//       if (type === "addNewBp") {
//         onModalAddBp();
//       } else if (type === "addNotation") {
//         const dataChangeNotasi = getState("dataChangeNotasi");
//         const dataSend = {
//           ...dataChangeNotasi,
//           draftId: draftId,
//           draftName: textDraftName,
//           draftSOId: "",
//         };
//         setState("dataChangeNotasi", dataSend);
//         onModalAddNotation();
//       } else if (type === "editNotation") {
//         const dataDetailProsbis = getState("dataDetailProsbis");
//         const dataSend = {
//           ...dataDetailProsbis,
//           draftId: draftId,
//           draftName: textDraftName,
//           draftSOId: "",
//         };
//         setState("dataDetailProsbis", dataSend);
//         openModalNotRow(typeJob.value, typeProsbis.value);
//       } else if (type === "editProsbis") {
//         const dataDetailProsbis = getState("dataDetailProsbis");
//         const dataSend = {
//           ...dataDetailProsbis,
//           draftId: draftId,
//           draftName: textDraftName,
//           draftSOId: "",
//         };
//         setState("dataDetailProsbis", dataSend);
//         openModalEditBusinesspro();
//       } else if (type === "deleteProsbis") {
//         const dataDelete = getState("dataDeleteProsbis");
//         const dataSend = {
//           ...dataDelete,
//           draftId: draftId,
//           draftName: textDraftName,
//           draftSOId: "",
//         };
//         setState("dataDeleteProsbis", dataSend);
//         openModalDeleteBusinesspro();
//       }
//     }
//   } catch (error) {}
// }
async function onModalAddBp() {
  try {
    const rasciNotation = getState("rasciNotation") || [];
    const dataProsbis = getState("insertProsbis");
    const draftidRasci = $("#dataSource-rasci").val();
    const draftName = $("#dataSource-rasci option:selected").text();
    const resultLevel = await fetchSelectLevel(draftidRasci);
    const modal = new bootstrap.Modal(document.getElementById("modalAddBp"));
    modal.show();
    if (resultLevel.status === 200) {
      const listLevel = resultLevel?.data.result;
      const formContent = `
    <div class="col-12">
      <div>
        <label class="form-label">RASCI Matrix Draft Name</label>
        <select class="form-select digits" disabled>
          <option value="${draftidRasci}">${draftName}</option>
        </select>
      </div>
      <hr style="margin-top:25px;margin-bottom:20px"/>
    </div>
    <div class="col-2">
      <div class="mb-3">
        <label class="form-label">Level</label>
        <select class="form-select digits" onchange="onSelect(event)" id="idprosbisLevel">
          <option>Choose</option>
          ${listLevel.map((opt) => `<option value="${opt.id}">${opt.text}</option>`)}
        </select>
      </div>
    </div>
    <div class="col-10">
        <div class="mb-3">
          <label class="form-label">Parent</label>
          <select class="form-select digits" name="parentId" id="parentId" disabled>
          </select>
        </div>
    </div>
    <div class="col-12">
      <div>
        <label class="form-label">Business Process Name</label>
        <textarea class="form-control" oninput="onInputProsbis(event)"></textarea>
      </div>
    </div>`;
      const bodySelectJob = `
    <select class="form-select digits" name="jobId" id="jobId">
    </select>
    `;
      theadContent = `<tr>
        <th scope="col" style="width: 50px">Check</th>
        <th scope="col" style="width: 120px;text-align:center">RASCI Notation</th>
        <th scope="col">Comment (Optional)</th>
        </tr>`;

      tblNotation(rasciNotation);
      cardSelectedJoblist(dataProsbis);
      document.getElementById("select-job").innerHTML = bodySelectJob;
      document.getElementById("tbl-add-prosbis-header").innerHTML = theadContent;

      const bodyContent = document.getElementById("form-content");
      if (bodyContent) {
        bodyContent.innerHTML = formContent;
      }
      // Initialize Bootstrap Select
      $(".selectpicker").selectpicker();
      updateSelect2ByProsbis();
      updateSelect2ByJob();
    }
  } catch (error) {}
}

const cardSelectedJoblist = (param) => {
  const bodyJoblist = param.jobMapped
    .map((value) => {
      const rasciNotation = value.rasciNotation.filter((item) => item.isChecked);
      return `<div class="card-listjob mb-2">
          <div class="row">
            <div class="col-10">
              <span style="font-size:13px;font-weight:bold">${value.jobName}</span>
            </div>
            <div class="col-2 d-flex justify-content-end">
              <button class="btn btn-outline-danger btn-sm " type="button" onclick="deleteJoblist(${
                value.jobId
              })" style="padding: 0; width: 25px; height: 22px; display: flex; justify-content: center; align-items: center;">
                <i class="icon-trash" style="font-size: 14px;padding-right:2px"></i>
              </button>
            </div> 
              ${rasciNotation
                .map((letter) => {
                  return `<div class="col-1 mb-1">
                          <img src="/assets/images/rasci/${letter.rasciCode.toLowerCase()}.svg" alt="${
                    letter.rasciCode
                  } Icon" style="padding-right:2px">
                  </div>
                  <div class="col-11" style="text-align:left">
                  <span>: ${letter.comment}</span>
                  </div>
                  `;
                })
                .join("")}
          </div>
        </div>`;
    })
    .join("");
  document.getElementById("selected-job").innerHTML = bodyJoblist;
};
const deleteJoblist = (id) => {
  const dataProsbis = getState("insertProsbis");
  const removeData = dataProsbis.jobMapped.filter((item) => Number(item.jobId) !== Number(id));
  const result = { ...dataProsbis, jobMapped: removeData };
  setState("insertProsbis", result);
  cardSelectedJoblist(result);
};
const tblNotation = (rasciNotation) => {
  const rasciRows = rasciNotation
    .map(
      (letter) => `
  <tr>
      <th scope="row">
        <label class="radio-label" for="checked-body-bp">
          <input class="checkbox_animated" 
                 id="checked-${letter.rasciCode.toLowerCase()}" 
                 type="checkbox" 
                 data-rasci="${letter.rasciCode}" 
                 ${letter.isChecked ? "checked" : ""} 
                 onclick="onCheck(event, '${letter.rasciCode}')">
        </label>
      </th>
      <td style="text-align:center">
        <img src="/assets/images/rasci/${letter.rasciCode.toLowerCase()}.svg" alt="${
        letter.rasciCode
      } Icon" style="padding-right:2px">
      </td>
      <td>
        <input class="form-control" type="text" placeholder="Type Comment" id="comment${letter.rasciCode}" 
               value="${letter.comment || ""}" 
               ${!letter.isChecked ? "disabled" : ""} 
               oninput="updateComment('${letter.rasciCode}', this.value)">
      </td>
    </tr>
`,
    )
    .join("");
  tdBody = rasciRows;
  document.getElementById("tbl-add-prosbis-body").innerHTML = tdBody;
};

function updateSelect2DraftList() {
  $("#select-draftname")
    .select2({
      dropdownParent: $("#modalChoosedraft"),
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
            type: "draft-rasci",
            draftId: "ad24a853-5f57-40a0-a367-3b46c2f3b2b0",
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

function updateSelect2ByProsbis() {
  const draftidRasci = $("#dataSource-rasci").val();
  const idprosbisLevel = $("#idprosbisLevel").val();
  $("#parentId")
    .select2({
      dropdownParent: $("#modalAddBp"),
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
            type: "business-process",
            level: idprosbisLevel - 1,
            draftId: draftidRasci,
          };
        },
        processResults: function (data) {
          if (data.data && data.data.result) {
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

function updateSelect2ByJob() {
  const draftidRasci = $("#dataSource-rasci").val();
  let $select = $("#dataSource-rasci");
  let selectedOption = $select.find(":selected"); // Ambil elemen option yang terpilih
  let selectedDraftSo = selectedOption.attr("data-draftso");
  $("#jobId")
    .select2({
      dropdownParent: $("#modalAddBp"),
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

function onSelect(event) {
  const value = event.target.value;
  const parentSelect = document.querySelector("#parentId");

  if (value === "Choose" || value == 1) {
    parentSelect.disabled = true;

    if (parentSelect.value) {
      parentSelect.value = "";
    }
  } else {
    parentSelect.disabled = false;
    if (parentSelect.value) {
      parentSelect.value = "";
    }
  }
  setState("selectedLevel", value);
  setState("insertProsbis", { ...appState.insertProsbis, level: value });
}

function onInputProsbis(event) {
  const value = event.target.value;
  const dataProsbis = getState("insertProsbis");
  setState("insertProsbis", { ...dataProsbis, businessProcessName: value });
}
function onCheck(event, rasciCode) {
  const isChecked = event.target.checked;
  const commentInput = document.getElementById(`comment${rasciCode}`);

  commentInput.disabled = !isChecked;
  commentInput.value = isChecked ? commentInput.value : "";

  const rasciNotation = getState("rasciNotation");

  const updatedRasciNotation = rasciNotation.map((letter) => {
    if (letter.rasciCode === rasciCode) {
      return {
        ...letter,
        isChecked,
        comment: isChecked ? commentInput.value : "",
      };
    }
    return letter;
  });
  setState("rasciNotation", updatedRasciNotation);
  tblChangeNotationRef(updatedRasciNotation);
}

function updateComment(rasciCode, value) {
  const rasciNotation = getState("rasciNotation");
  const updatedRasciNotation = rasciNotation.map((letter) => {
    if (letter.rasciCode === rasciCode) {
      return { ...letter, comment: value };
    }
    return letter;
  });

  setState("rasciNotation", updatedRasciNotation);
}
const triggleSelectJob = () => {
  const selectedJobId = $("#jobId");
  const selectedParentId = document.getElementById("parentId");
  const selectedValue = selectedJobId.val();
  const selectedParentValue = selectedParentId.value;
  const jobName = selectedJobId.find(":selected").text();
  const dataProsbis = getState("insertProsbis") || {};
  const rasciNotation = getState("rasciNotation") || [];
  const [orgUnitCode, orgPrl] = selectedValue.split(";");

  const payload = {
    ...dataProsbis,
    parentId: selectedParentValue,
    jobMapped: [
      ...dataProsbis.jobMapped,
      {
        jobName,
        orgUnitCode: orgUnitCode,
        orgPrl: orgPrl,
        rasciNotation: rasciNotation,
      },
    ],
  };
  setState("insertProsbis", payload);
  setTimeout(() => {
    selectedJobId.val(null).trigger("change");
    // disabled btn id btn-selectedjob
    // const btnSelectedJob = document.getElementById("btn-selectedjob");
    // btnSelectedJob.disabled = true;
    const updatedRasciNotation = rasciNotation.map((letter) => {
      return { ...letter, comment: "", isChecked: false };
    });
    setState("rasciNotation", updatedRasciNotation);
    tblNotation(updatedRasciNotation);
    cardSelectedJoblist(payload);
  }, 200);
};

async function saveAsDraft() {
  try {
    const dataProsbis = getState("insertProsbis");
    const spinner = document.getElementById("saveDraftBtn");
    const draftId = $("#dataSource-rasci").val();
    spinner.style.display = "inline-block";
    const inputValue = {
      ...dataProsbis,
      draftId: draftId,
      draftJobSource: null,
      draftType: "Add New Business Process",
    };
    console.log("cek");
    const result = await submitDraftProsbis(inputValue);
    if (result.status === 200) {
      const modalAddBp = document.getElementById("modalAddBp");
      const modalAdd = bootstrap.Modal.getInstance(modalAddBp);
      document.getElementById("draftName").value = "";
      const btnDraft = document.getElementById("saveDraftBtn");
      btnDraft.disabled = true;
      const resultMatrix = await lastStateTableMatrix();
      if (resultMatrix) {
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
              <span>You can check in <b>${result.data.draftName}</b> at draft tab.</span>
              `,
            },
          },
        }).then(async () => {
          spinner.style.display = "none";
          if (modalAdd) {
            modalAdd.hide();
          }
          backFromModalBp();
          const payload = {
            Page: 1,
            PageSize: 5,
          };
          const queryString = new URLSearchParams(payload).toString();
          const dataDraft = await fetchDraftProsbis(queryString);
          loadTableBodyDraft(dataDraft);
        });
      }
    }
  } catch (error) {
    console.error("Error saving draft:", error);
  }
}

function handleInputDraftName(value) {
  const btnSave = document.getElementById("prosbisSavedraft");
  if (!btnSave) {
    console.error("Button not found");
    return;
  }
  btnSave.disabled = value.length > 3 ? false : true;
}
function openModalConfrim() {
  const openModal = new bootstrap.Modal(document.getElementById("modalAprroval"));
  openModal.show();
}
function backFromModalBp() {
  const rasciNotation = getState("rasciNotation");
  const updatedRasciNotation = rasciNotation.map((letter) => {
    return { ...letter, comment: "", isChecked: false };
  });
  setState("insertProsbis", { parentId: null, jobMapped: [] });
  setState("rasciNotation", updatedRasciNotation);
}

function formValidation() {
  const { level, businessProcessName, jobMapped } = getState("insertProsbis");
  const isValid = level && businessProcessName && jobMapped.length > 0;
  // console.log("jobMapped", jobMapped);
  // get value from select id jobId
  const selectedJobId = $("#jobId");
  const selectedValue = selectedJobId.val();
  // console.log("selectedValue", selectedValue);
  // const btnSelectedJob = document.getElementById("btn-selectedjob");
  // btnSelectedJob.disabled = true;
  document.getElementById("saveDraftBtn").disabled = !isValid;
}

document.querySelectorAll("input, select, textarea").forEach((input) => {
  input.addEventListener("input", formValidation);
});

function handleClickAlert() {
  const modal = new bootstrap.Modal(document.getElementById("modalAddmapping"));
  modal.show();

  let bodyContent = `
    <div class="row">
        <div class="col-12">
            <div class="mapping-alert">
              <span class="alert-text">
                  Please mapping RASCI to the positions below by clicking "Add RASCI" button.
              </span>
          </div>
        </div>
        <div class="col-12 mt-2"> 
           <input class="form-control" type="text" placeholder="Search">
        </div>
          <div class="col-12 mt-2"> 
          <div class="table-responsive mt-2" style=" max-height: 450px;">
              <table class="table tbl-border-add-prosbis">
                  <thead>
                      <tr>
                      <th scope="col" style="width: 50px;text-align:center">No</th>
                        <th scope="col" style="width: 150px">ID Position</th>
                        <th scope="col" style="width: 380px">Position</th>
                        <th scope="col" style="width: 100px">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <th scope="row">
        
                      </th>
                      <td style="text-align:center">

                      </td>
                      <td style="text-align:center">

                      </td>
                      <td>
                    <button class="btn btn-primary" style="width: 100%;"
                       type="button" onclick="handleAddRasci()">Add RASCI</button>
                      </td>
                    </tbody>
              </table>
          </div>

        </div>
        `;

  document.getElementById("body-addmapping").innerHTML = bodyContent;
}

function handleAddRasci() {
  const modalMapping = document.getElementById("modalAddmapping");
  const modal = bootstrap.Modal.getInstance(modalMapping);
  modal.hide();
  onModalAddNotation();
}
