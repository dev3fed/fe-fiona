function onModalAddBp() {
  const modal = new bootstrap.Modal(document.getElementById("modalAddBp"));
  modal.show();
  const prosbisLevel = getState("prosbisLevel");
  const rasciNotation = getState("rasciNotation") || [];
  const dataProsbis = getState("insertProsbis");

  const formContent = `
    <div class="col-12">
      <div>
        <label class="form-label">RASCI Matrix Draft Name</label>
        <select class="form-select digits" >
          <option>Choose</option>
        </select>
      </div>
      <hr style="margin-top:25px;margin-bottom:20px"/>
    </div>
    <div class="col-2">
      <div class="mb-3">
        <label class="form-label">Level</label>
        <select class="form-select digits" onchange="onSelect(event)">
          <option>Choose</option>
          ${prosbisLevel.map((opt) => `<option value="${opt.id}">${opt.text}</option>`)}
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
function updateSelect2ByProsbis() {
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
            type: "prosbis",
            level: appState.selectedLevel,
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
            type: "jobtitle",
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
  setState("insertProsbis", { ...dataProsbis, name: value });
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
  const payload = {
    ...dataProsbis,
    parentId: selectedParentValue,
    jobMapped: [
      ...dataProsbis.jobMapped,
      {
        jobName,
        jobId: selectedValue,
        rasciNotation: rasciNotation,
      },
    ],
  };
  setState("insertProsbis", payload);
  setTimeout(() => {
    selectedJobId.val(null).trigger("change");
    // disabled btn id btn-selectedjob
    const btnSelectedJob = document.getElementById("btn-selectedjob");
    btnSelectedJob.disabled = true;
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
    const draftName = document.getElementById("draftName").value;
    const dataProsbis = getState("insertProsbis");
    const inputValue = {
      ...dataProsbis,
      draftName,
      category: "add",
      type: "draft",
    };

    const result = await submitDraftProsbis(inputValue);

    if (result.status === 200) {
      const modalSaveDraft = document.getElementById("modalSaveDraft");
      const modalSave = bootstrap.Modal.getInstance(modalSaveDraft);
      const modalAddBp = document.getElementById("modalAddBp");
      const modalAdd = bootstrap.Modal.getInstance(modalAddBp);
      document.getElementById("draftName").value = "";
      const btnSave = document.getElementById("prosbisSavedraft");
      const btnDraft = document.getElementById("saveDraftBtn");
      // const btnApproval = document.getElementById("submitApprovalBtn");

      btnSave.disabled = true;
      btnDraft.disabled = true;
      // btnApproval.disabled = true;

      if (modalSave) {
        modalSave.hide();
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
              innerHTML: `<div style="text-align: center;">Your request has been submitted successfully. You can check your request in the approval list tab.</div>`,
            },
          },
        }).then(async () => {
          if (modalAdd) {
            modalAdd.hide();
          }
          backFromModalBp();
          const payload = {
            Type: "draft",
            Page: 1,
            Limit: 10,
          };
          const queryString = new URLSearchParams(payload).toString();
          const dataDraft = await fetchDraftProsbis(queryString);
          const IsNotEmpty = dataDraft.data.data.length;
          handleClickCard(IsNotEmpty);
          loadTableBodyDraft(dataDraft.data.data);
          $("#pills-draft-tab").tab("show");
        });
      }, 100);
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

  setState("rasciNotation", updatedRasciNotation);
}

function formValidation() {
  const { level, name, jobMapped } = getState("insertProsbis");
  const isValid = level && name;
  console.log("jobMapped", jobMapped);
  // get value from select id jobId
  const selectedJobId = $("#jobId");
  const selectedValue = selectedJobId.val();
  console.log("selectedValue", selectedValue);
  // const btnSelectedJob = document.getElementById("btn-selectedjob");
  // btnSelectedJob.disabled = true;
  document.getElementById("saveDraftBtn").disabled = !isValid;
  // document.getElementById("submitApprovalBtn").disabled = !isValid;
}

document.querySelectorAll("input, select, textarea").forEach((input) => {
  input.addEventListener("input", formValidation);
});
