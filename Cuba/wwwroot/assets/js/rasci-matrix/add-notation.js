// start section add notation by column row
async function onModalAddNotation() {
  try {
    const modal = new bootstrap.Modal(document.getElementById("modalAddNotation"));
    modal.show();
    const rasciNotation = getState("rasciNotation") || [];
    const dataChangeNotasi = getState("dataChangeNotasi");
    const resultLevel = await fetchSelectLevel(dataChangeNotasi.draftId);
    const listLevel = resultLevel?.data.res;
    const formContent = `
        <div class="col-12">
        <div>
          <label class="form-label">RASCI Matrix Draft Name</label>
          <select class="form-select digits" disabled>
            <option value="${dataChangeNotasi.draftId}">${dataChangeNotasi.draftName}</option>
          </select>
        </div>
        <hr style="margin-top:25px;margin-bottom:20px"/>
      </div>
      <div class="col-12">
        <div class="mb-2">
          <label class="form-label">Position</label>
           <select class="form-select digits" name="jobIdNotation" id="jobIdNotation">
      </select>
        </div>
      </div>
      <div class="col-12">
        <div class="col mb-3">
          <div class="m-t-15 m-checkbox-inline custom-radio-ml">
              <div class="form-check form-check-inline radio radio-primary">
                  <input class="form-check-input" id="radioNonreference" type="radio" name="optradio" value="nonReference" onchange="handleRadioChange(event)" checked>
                  <label class="form-check-label mb-0" for="radioNonreference">Add RASCI Notation</label>
              </div>
              <div class="form-check form-check-inline radio radio-primary">
                  <input class="form-check-input" id="radioReference" type="radio" name="optradio" value="reference"  onchange="handleRadioChange(event)">
                  <label class="form-check-label mb-0" for="radioReference">Add RASCI Notation from reference</label>
              </div>
          </div>
        </div>
      </div>
  `;

    const bodySelectBusiness = `
      <div class="row">
        <div class="col-3">
          <select class="form-select digits" onchange="onSelectLevel(event)" name="levelId" id="levelId">
           <option value="" disabled selected>Level</option>
              ${listLevel.map((opt) => `<option value="${opt.id}">${opt.text}</option>`)}
          </select>
        </div>
        <div class="col-9">
          <select class="form-select digits" name="businessId" id="businessId" disabled>
          </select>
        </div>
      </div>
      `;
    const theadContent = `<tr>
          <th scope="col" style="width: 50px">Check</th>
          <th scope="col" style="width: 120px;text-align:center">RASCI Notation</th>
          <th scope="col">Comment (Optional)</th>
          </tr>`;

    tblChangeNotation(rasciNotation);
    cardSelectedNotasilist(dataChangeNotasi);
    document.getElementById("select-business").innerHTML = bodySelectBusiness;
    document.getElementById("tbl-notation-header").innerHTML = theadContent;

    const bodyContent = document.getElementById("form-notation");
    if (bodyContent) {
      bodyContent.innerHTML = formContent;
    }

    // Initialize Bootstrap Select
    $(".selectpicker").selectpicker();
    updateSelectProsbis();
    selectJobNotation();
  } catch (error) {}
}

const cardSelectedNotasilist = (param) => {
  const bodyBisuness = param.busProsMapped
    .map((value) => {
      const rasciNotation = value.rasciNotation.filter((item) => item.isChecked);
      return `<div class="card-listjob mb-2">
          <div class="row">
            <div class="col-10">
              <span style="font-size:13px;font-weight:bold">${value.businessName}</span>
            </div>
            <div class="col-2 d-flex justify-content-end">
              <button class="btn btn-outline-danger btn-sm " type="button" onclick="deleteBusinesslist(${
                value.parentId
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
  document.getElementById("selected-business").innerHTML = bodyBisuness;
};
const deleteBusinesslist = (id) => {
  const dataChangeNotasi = getState("dataChangeNotasi");
  const removeData = dataChangeNotasi.busProsMapped.filter((item) => Number(item.parentId) !== Number(id));
  const result = { ...dataChangeNotasi, busProsMapped: removeData };
  setState("dataChangeNotasi", result);
  cardSelectedNotasilist(result);
};

function updateSelectProsbis() {
  const dataChangeNotasi = getState("dataChangeNotasi");
  $("#businessId")
    .select2({
      dropdownParent: $("#modalAddNotation"),
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
            level: appState.selectedLevel,
            draftId: dataChangeNotasi.draftId,
          };
        },
        processResults: function (data) {
          if (data.data && data.data.res) {
            return {
              results: data.data.res,
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
function onSelectLevel(event) {
  const value = event.target.value;
  const parentSelect = document.querySelector("#businessId");

  if (value === "Choose" || value == 0) {
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
  setState("dataChangeNotasi", { ...appState.dataChangeNotasi, level: value });
}
async function triggleSelectBusiness() {
  const selectedBusinessId = $("#businessId");
  const selectedLevel = $("#levelId");
  const selectedJobId = document.getElementById("jobIdNotation");
  const selectedValue = selectedBusinessId.val();
  const selectedJobValue = selectedJobId.value;
  const businessName = selectedBusinessId.find(":selected").text();
  const dataChangeNotasi = getState("dataChangeNotasi") || {};
  const rasciNotation = getState("rasciNotation") || [];
  const payload = {
    ...dataChangeNotasi,
    jobId: selectedJobValue,
    busProsMapped: [
      ...dataChangeNotasi.busProsMapped,
      {
        businessName,
        parentId: selectedValue,
        rasciNotation: rasciNotation,
      },
    ],
  };
  setState("dataChangeNotasi", payload);
  setTimeout(() => {
    selectedBusinessId.val(null).trigger("change");
    selectedLevel.val(null).trigger("change");
    const updatedRasciNotation = rasciNotation.map((letter) => {
      return { ...letter, comment: "", isChecked: false };
    });
    setState("rasciNotation", updatedRasciNotation);
    tblChangeNotation(updatedRasciNotation);
    cardSelectedNotasilist(payload);
  }, 200);
}
function selectJobNotation() {
  const dataProsbis = getState("insertProsbis");
  $("#jobIdNotation")
    .select2({
      dropdownParent: $("#modalAddNotation"),
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
            type: "job",
            draftId: dataProsbis.draftId,
          };
        },
        processResults: function (data) {
          if (data && data.data) {
            return {
              results: data.data.res,
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
  if (value === "reference") {
    const elementPosref = document.getElementById("posref");
    const elementBispro = document.getElementById("bispro");
    const elementSelectedBispro = document.getElementById("selectedBispro");
    elementPosref.style.display = "block";
    elementBispro.style.display = "none";
    elementSelectedBispro.style.display = "none";
  } else if (value === "nonReference") {
    const elementPosref = document.getElementById("posref");
    const elementBispro = document.getElementById("bispro");
    const elementSelectedBispro = document.getElementById("selectedBispro");
    elementPosref.style.display = "none";
    elementBispro.style.display = "block";
    elementSelectedBispro.style.display = "block";
  }
};
const tblRasciNotation = (rasciNotation) => {
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
               oninput="updateRasciComment('${letter.rasciCode}', this.value)">
      </td>
    </tr>
`,
    )
    .join("");
  let tdBody = rasciRows;
  document.getElementById("tbl-notation-body").innerHTML = tdBody;
};

function updateRasciComment(rasciCode, value) {
  const rasciNotation = getState("rasciNotation");
  const updatedRasciNotation = rasciNotation.map((letter) => {
    if (letter.rasciCode === rasciCode) {
      return { ...letter, comment: value };
    }
    return letter;
  });

  setState("rasciNotation", updatedRasciNotation);
}

function backChangeNotation() {
  const rasciNotation = getState("rasciNotation");
  const updatedRasciNotation = rasciNotation.map((letter) => {
    return { ...letter, comment: "", isChecked: false };
  });
  setState("dataChangeNotasi", { busProsMapped: [] });
  setState("rasciNotation", updatedRasciNotation);
}

function formValidationNotation() {
  const { jobId, busProsMapped } = getState("dataChangeNotasi");
  const isValid = jobId && busProsMapped.length > 0;
  document.getElementById("btnDraftnotation").disabled = !isValid;
}

document.querySelectorAll("select").forEach((input) => {
  input.addEventListener("select", formValidationNotation);
});

async function openModalNotRow(jobId, prosbisId) {
  try {
    const modal = new bootstrap.Modal(document.getElementById("modalNotationRow"));
    modal.show();
    const rasciNotation = getState("rasciNotation") || [];
    const payload = {
      indexGroup: prosbisId,
      jobId: jobId,
    };
    const dataRow = await fetchDetailRasci(payload);
    const result = dataRow.data;
    const dataDetailProsbis = getState("dataDetailProsbis");
    const formContent = `
        <div class="col-12">
          <div >
            <label class="form-label" style="width:19%">RASCI Matrix Draft</label>
            <label> : </label>
          <b class="form-label">${dataDetailProsbis.draftName}</b>
          </div>
        </div>
        <div class="col-12">
          <div >
              <label class="form-label" style="width:19%">Position</label>
               <label> : </label>
          <b class="form-label">${result.position.code} - ${result.position.name}</b>
          </div>
        </div>
        <div class="col-12">
          <div >
              <label class="form-label" style="width:19%">Business Process</label>
               <label> : </label>
          <b class="form-label">${result.businessProcess.parentId} - ${result.businessProcess.description}</b>
          </div>
        </div>
      `;

    theadContent = `<tr>
          <th scope="col" style="width: 50px">Check</th>
          <th scope="col" style="width: 150px;text-align:center">RASCI Notation</th>
          <th scope="col">Comment (Optional)</th>
          </tr>`;

    const output = mergeRasciData(result.rasci, rasciNotation);
    setState("rasciNotation", output);
    setState("dataDetailProsbis", { ...dataDetailProsbis, jobId: jobId, indexGroup: prosbisId });
    tblChangeNotationRow(output);
    document.getElementById("tbl-notatrow-header").innerHTML = theadContent;

    const bodyContent = document.getElementById("form-notatrow");
    if (bodyContent) {
      bodyContent.innerHTML = formContent;
    }

    // Initialize Bootstrap Select
    $(".selectpicker").selectpicker();
  } catch (error) {}
}

function mergeRasciData(result, data) {
  // Buat salinan array data agar tidak merusak data asli
  const mergedData = data.map((item) => ({ ...item }));

  // Iterasi melalui result untuk memperbarui data
  result.forEach((res) => {
    const match = mergedData.find((item) => item.rasciCode === res.rasciCode);
    if (match) {
      match.comment = res.comment; // Perbarui komentar
      match.isChecked = true; // Set isChecked menjadi true
    }
  });

  return mergedData;
}

// end section add notation by column row
function tblChangeNotation(rasciNotation) {
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
  let tdBody = rasciRows;
  document.getElementById("tbl-notation-body").innerHTML = tdBody;
}
function tblChangeNotationRow(rasciNotation) {
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
  let tdBody = rasciRows;
  document.getElementById("tbl-notatrow-body").innerHTML = tdBody;
}

function backChangeNotationRow() {
  const rasciNotation = getState("rasciNotation");
  const updatedRasciNotation = rasciNotation.map((letter) => {
    return { ...letter, comment: "", isChecked: false };
  });
  setState("dataDetailProsbis", {});
  setState("rasciNotation", updatedRasciNotation);
}
async function saveNotationRow() {
  try {
    const rasciNotation = getState("rasciNotation") || [];
    const dataDetailProsbis = getState("dataDetailProsbis");
    const spinner = document.getElementById("loadingEditnotation");
    spinner.style.display = "inline-block";
    const inputValue = {
      draftName: dataDetailProsbis.draftName,
      draftId: dataDetailProsbis.draftId,
      draftType: "Add/Edit RASCI",
      jobId: dataDetailProsbis.jobId,
      busProsMapped: [{ parentId: dataDetailProsbis.indexGroup, rasciNotation }],
    };
    const result = await submitDraftProsbis(inputValue);
    if (result.status === 200) {
      const modalNotationRow = document.getElementById("modalNotationRow");
      const modal = bootstrap.Modal.getInstance(modalNotationRow);
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
              <span>You can check in <b>${result.data.draftName}</b> at draft tab.</span>
              `,
            },
          },
        }).then(async () => {
          if (modal) {
            modal.hide();
          }
          spinner.style.display = "none";
          const payload = {
            Page: 1,
            PageSize: 5,
          };
          const queryString = new URLSearchParams(payload).toString();
          const dataDraft = await fetchDraftProsbis(queryString);
          const IsNotEmpty = dataDraft.data.length;
          handleClickCard(IsNotEmpty);
          loadTableBodyDraft(dataDraft);
          $("#pills-draft-tab").tab("show");
        });
      }, 100);
    }
  } catch (error) {}
}
async function saveDraftnotation() {
  try {
    const dataChangeNotasi = getState("dataChangeNotasi");
    const inputValue = {
      draftName: dataChangeNotasi.draftName,
      draftId: dataChangeNotasi.draftId,
      draftType: "Add/Edit RASCI",
      jobId: dataChangeNotasi.jobId,
      busProsMapped: dataChangeNotasi.busProsMapped,
    };
    const result = await submitDraftProsbis(inputValue);
    if (result.status === 200) {
      const modalAddNotation = document.getElementById("modalAddNotation");
      const modal = bootstrap.Modal.getInstance(modalAddNotation);

      const btnDraft = document.getElementById("btnDraftnotation");
      btnDraft.disabled = true;
      // btnApproval.disabled = true;

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
              <span>You can check in <b>${result.data.draftName}</b> at draft tab.</span>
              `,
            },
          },
        }).then(async () => {
          if (modal) {
            modal.hide();
          }
          backFromModalBp();
          const payload = {
            Page: 1,
            PageSize: 5,
          };
          const queryString = new URLSearchParams(payload).toString();
          const dataDraft = await fetchDraftProsbis(queryString);
          const IsNotEmpty = dataDraft.data.length;
          handleClickCard(IsNotEmpty);
          loadTableBodyDraft(dataDraft);
          $("#pills-draft-tab").tab("show");
        });
      }, 100);
    }
  } catch (error) {}
}
