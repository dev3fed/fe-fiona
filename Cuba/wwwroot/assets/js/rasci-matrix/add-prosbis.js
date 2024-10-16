function onModalAddBp() {
  const modal = new bootstrap.Modal(document.getElementById("modalAddBp"));
  modal.show();
  const prosbisLevel = getState("prosbisLevel");
  const formContent = `
    <div class="col-2">
      <div class="mb-3">
        <label class="form-label">Level</label>
        <select class="form-select digits" onclick="onSelect(event)">
          <option>Choose</option>
          ${prosbisLevel.map(
            (opt) => `<option value="${opt.id}">${opt.text}</option>`,
          )}
        </select>
      </div>
    </div>
    <div class="col-10">
        <div class="mb-3">
          <label class="form-label">Parent</label>
          <select class="form-select digits" name="parentId" id="parentId" disabled onchange="onSelectParentId(event)">
          </select>
        </div>
    </div>
    <div class="col-12">
      <div>
        <label class="form-label">Business Process Name</label>
        <textarea class="form-control" oninput="onInputProsbis(event)"></textarea>
      </div>
      <div class="mt-4">
          <label class="form-label">Job</label>
          <select class="form-select digits" name="jobId" id="jobId"  onchange="onSelectJobId(event)">
          </select>
      </div>
    </div>`;

  theadContent = `<tr>
        <th scope="col" style="width: 50px">Check</th>
        <th scope="col" style="width: 150px;text-align:center">RASCI Notation</th>
        <th scope="col">Comment (Optional)</th>
        </tr>`;
  const rasciNotation = getState("insertProsbis").rasciNotation || [];
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
        <input class="form-control" type="text" placeholder="Type Comment" id="comment${
          letter.rasciCode
        }" 
               value="${letter.comment || ""}" 
               ${!letter.isChecked ? "disabled" : ""} 
               oninput="updateComment('${letter.rasciCode}', this.value)">
      </td>
    </tr
`,
    )
    .join("");
  tdBody = rasciRows;

  document.getElementById("tbl-add-prosbis-header").innerHTML = theadContent;
  document.getElementById("tbl-add-prosbis-body").innerHTML = tdBody;

  const bodyContent = document.getElementById("form-content");
  if (bodyContent) {
    bodyContent.innerHTML = formContent;
  }

  // Initialize Bootstrap Select
  $(".selectpicker").selectpicker();
  updateSelect2ByProsbis();
  updateSelect2ByJob();
}
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
  console.log("value", value);
  const parentSelect = document.querySelector("#parentId");
  if (value === "Choose" || value == 1) {
    parentSelect.disabled = true;

    if (parentSelect.value) {
      parentSelect.value = "";
      onSelectParentId({ target: { value: "" } });
    }
  } else {
    parentSelect.disabled = false;
  }
  setState("selectedLevel", value);
  setState("insertProsbis", { ...appState.insertProsbis, level: value });
}
function onSelectParentId(event) {
  const value = event.target.value;
  const dataProsbis = getState("insertProsbis");
  setState("insertProsbis", { ...dataProsbis, parentId: value });
}
function onSelectJobId(event) {
  const value = event.target.value;
  const dataProsbis = getState("insertProsbis");
  setState("insertProsbis", { ...dataProsbis, jobTitleId: value });
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

  const dataProsbis = getState("insertProsbis");
  const updatedRasciNotation = dataProsbis.rasciNotation.map((letter) => {
    if (letter.rasciCode === rasciCode) {
      return {
        ...letter,
        isChecked,
        comment: isChecked ? commentInput.value : "",
      };
    }
    return letter;
  });

  setState("insertProsbis", {
    ...dataProsbis,
    rasciNotation: updatedRasciNotation,
  });
}

function updateComment(rasciCode, value) {
  const dataProsbis = getState("insertProsbis");
  const updatedRasciNotation = dataProsbis.rasciNotation.map((letter) => {
    if (letter.rasciCode === rasciCode) {
      return { ...letter, comment: value };
    }
    return letter;
  });

  setState("insertProsbis", {
    ...dataProsbis,
    rasciNotation: updatedRasciNotation,
  });
}

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
          loadTableBodyDraft(dataDraft.data.data);
          $("#pills-draft-tab").tab("show");
        });
      }, 100);
    }
  } catch (error) {
    console.error("Error saving draft:", error);
  }
}
async function saveApproval() {
  try {
    const dataProsbis = getState("insertProsbis");

    const inputValue = {
      ...dataProsbis,
      category: "add",
      type: "submission",
    };

    const result = await submitDraftProsbis(inputValue);

    if (result.status === 200) {
      const modalAprroval = document.getElementById("modalAprroval");
      const mdlApproval = bootstrap.Modal.getInstance(modalAprroval);
      const modalAddBp = document.getElementById("modalAddBp");
      const modalAdd = bootstrap.Modal.getInstance(modalAddBp);
      if (mdlApproval) {
        mdlApproval.hide();
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
              innerHTML: `<div style="text-align: center;">Your request has been submitted successfully. You can check your request in approval list tab.</div>`,
            },
          },
        }).then(async () => {
          if (modalAdd) {
            modalAdd.hide();
          }
          backFromModalBp();
          const payload = {
            Type: "approval",
            Page: 1,
            Limit: 10,
          };
          const queryString = new URLSearchParams(payload).toString();
          const dataApproval = await fetchDraftProsbis(queryString);
          loadTableBodyApproval(dataApproval.data.data);
          $("#pills-approval-tab").tab("show");
        });
      }, 100);
    }
  } catch (error) {
    console.error("Error saving draft:", error);
  }
}

function handleInputDraftName(value) {
  const btnSave = document.getElementById(`btnSaveDraft`);
  btnSave.disabled = value.length > 3 ? false : true;
}
function openModalConfrim() {
  const openModal = new bootstrap.Modal(
    document.getElementById("modalAprroval"),
  );
  openModal.show();
}
function backFromModalBp() {
  const dataProsbis = getState("insertProsbis");
  const updatedRasciNotation = dataProsbis.rasciNotation.map((letter) => {
    return { ...letter, comment: "", isChecked: false };
  });

  setState("insertProsbis", {
    ...dataProsbis,
    rasciNotation: updatedRasciNotation,
  });
}

function formValidation() {
  const { level, name, jobTitleId } = getState("insertProsbis");
  const isValid = level && name && jobTitleId;
  document.getElementById("saveDraftBtn").disabled = !isValid;
  document.getElementById("submitApprovalBtn").disabled = !isValid;
}

document.querySelectorAll("input, select, textarea").forEach((input) => {
  input.addEventListener("input", formValidation);
});
