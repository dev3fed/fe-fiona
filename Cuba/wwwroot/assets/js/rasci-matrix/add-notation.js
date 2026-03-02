// start section add notation by column row
async function onModalAddNotation() {
  try {
    const modal = new bootstrap.Modal(document.getElementById("modalAddNotation"));
    modal.show();
    const rasciNotation = getState("rasciNotation") || [];
    const dataChangeNotasi = getState("dataChangeNotasi");
    const draftidRasci = $("#dataSource-rasci").val();
    const draftName = $("#dataSource-rasci option:selected").text();
    const resultLevel = await fetchSelectLevel(draftidRasci);
    const listLevel = resultLevel?.data.result;
    const formContent = `
        <div class="col-12 mb-2">
          <div>
            <label class="form-label">RASCI Matrix Draft Name</label>
            <select class="form-select digits" disabled>
              <option value="${draftidRasci}">${draftName}</option>
            </select>
          </div>
      </div>
      <div class="col-12">
        <div class="mb-2">
          <label class="form-label">Position</label>
           <select class="form-select digits" name="jobIdPosition" id="jobIdPosition" onchange="onSelectPosition(event)">
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
    const bodyJobRef = `
    <label class="form-label">Position Reference</label>
      <select class="form-select digits" name="jobIdRef" id="jobIdRef" onchange="onSelectJobRef(event)">
      </select>
    <hr style="margin-top:25px;margin-bottom:20px" />
    `;
    const bodySelectBusiness = `
      <div class="row">
        <div class="col-3">
          <select class="form-select digits" onchange="onSelectLevel(event)" name="levelId" id="levelId">
           <option>Choose</option>
              ${listLevel.map((opt) => `<option value="${opt.id}">${opt.text}</option>`)}
          </select>
        </div>
        <div class="col-9">
          <select class="form-select digits" name="businessId" id="businessId" disabled onchange="onSelectProsbisNonRef(event)">
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
    document.getElementById("posref").innerHTML = bodyJobRef;

    const bodyContent = document.getElementById("form-notation");
    if (bodyContent) {
      bodyContent.innerHTML = formContent;
    }

    // Initialize Bootstrap Select
    $(".selectpicker").selectpicker();
    updateSelect2ByNotation();
    selectJobPosition();
    selectJobReference();
    initializeTooltips();
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
              <button class="btn btn-outline-danger btn-sm " type="button" onclick="deleteBusinesslist('${
                value.parentId
              }')" style="padding: 0; width: 25px; height: 22px; display: flex; justify-content: center; align-items: center;">
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
  const removeData = dataChangeNotasi.busProsMapped.filter((item) => item.parentId !== id);
  const result = { ...dataChangeNotasi, busProsMapped: removeData };
  setState("dataChangeNotasi", result);
  cardSelectedNotasilist(result);
};

function updateSelect2ByNotation() {
  const draftidRasci = $("#dataSource-rasci").val();
  const levelId = $("#levelId").val();
  const selectedOption = $("#dataSource-rasci option:selected");
  const draftSo = selectedOption.data("draftso");
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
            level: levelId,
            draftId: draftidRasci,
            draftSo: draftSo,
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

async function onSelectProsbisNonRef(event) {
  const prosbisId = event.target.value;
  // if (!prosbisId) return;
  // $("#btn-selectedbusiness").prop("disabled", false);

  try {
  } catch (error) {}
}
async function onSelectJobRef(event) {
  const jobId = event.target.value;
  const dataChangeNotasi = getState("dataChangeNotasi");
  const draftidRasci = $("#dataSource-rasci").val();
  try {
    const reset = {
      ...dataChangeNotasi,
      busProsMapped: [],
    };
    setState("dataChangeNotasi", reset);
    if (jobId) {
      const [orgUnitCode, orgPrl] = jobId.split(";");
      const payload = {
        unitCode: orgUnitCode,
        prlOrg: orgPrl,
        draftRasciId: draftidRasci,
      };
      const queryString = "?" + new URLSearchParams(payload).toString();
      const result = await fetchProsbisByJob(queryString);
      if (result.success === true) {
        const dataTbl = result.data;
        const elementSelectedBispro = document.getElementById("table-prosbisref");
        const elementSelectedBisproref = document.getElementById("selectedBisproref");
        elementSelectedBisproref.style.display = "block";
        elementSelectedBispro.style.display = "block";
        const contentRefProsbis = `
        <label class="form-label">Business Process from reference</label>
        <div class="card-tblbusiness" style="height:300px !important">
          <div class="table-responsive scrollable mt-2" style=" max-height: 260px;">
            <table class="table tbl-border-notation">
                <thead>
                <tr>
                <th scope="col" style="width: 50px"></th>
              <th scope="col" style="width: 50px">Level</th>
              <th scope="col" style="width: 90px;text-align:center">Index</th>
              <th scope="col" >Business Process</th>
              <th scope="col" style="width: 120px;text-align:center">RASCI</th>
              </tr>
                </thead>
                <tbody>
                <tr>
                ${dataTbl
                  .map((item, index) => {
                    let rasciIcons = "";
                    let comments = [];
                    item.rasciNotation.forEach((value) => {
                      switch (value.notation) {
                        case "R":
                          rasciIcons += `<img src="/assets/images/rasci/r.svg" alt="R Icon" style="padding-right:2px">`;
                          break;
                        case "A":
                          rasciIcons += `<img src="/assets/images/rasci/a.svg" alt="A Icon" style="padding-right:2px">`;
                          break;
                        case "S":
                          rasciIcons += `<img src="/assets/images/rasci/s.svg" alt="S Icon" style="padding-right:2px">`;
                          break;
                        case "C":
                          rasciIcons += `<img src="/assets/images/rasci/c.svg" alt="C Icon" style="padding-right:2px">`;
                          break;
                        case "I":
                          rasciIcons += `<img src="/assets/images/rasci/i.svg" alt="I Icon" style="padding-right:2px">`;
                          break;
                      }

                      if (value.comment) {
                        comments.push(`<li>${value.notation}: ${value.comment}</li>`);
                      }
                    });

                    if (comments.length > 0) {
                      const commentTooltip = `<ul>${comments.join("")}</ul>`;
                      rasciIcons += `<img src="/assets/images/rasci/comment.svg" alt="Comment Icon" style="padding-right:2px" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-html="true" title="${commentTooltip}">`;
                    }
                    return `
                    <th scope="row">
                      <label class="radio-label" for="checked-body-bp">
                        <input class="checkbox_animated" id="checked-prosbisref-${item.indexNumber}" 
                          type="checkbox" value="${item.indexNumber}" 
                          onclick="onSelectProsbisRef(${JSON.stringify(item).replace(/"/g, "&quot;")});">
                      </label>
                    </th>
                    <td style="text-align:center">
                      ${item.level}
                    </td>
                    <td style="text-align:center">
                    ${item.indexNumber}
                    </td>
                    <td>
                    ${item.description}
                    </td>
                    <td>
                        <div class="rasci-container">
                          <div class="rasci-icons">${rasciIcons}</div>
                        </div>
                    </td>
                </tr>
                  `;
                  })
                  .join("")}
                </tbody>
            </table>
        </div>
        </div>`;
        elementSelectedBispro.innerHTML = contentRefProsbis;
      }
    } else {
      $("#table-prosbisref").hide();
      $("#selectedBisproref").hide();
      return;
    }
  } catch (error) {}
}

function onSelectPosition(item) {
  const dataChangeNotasi = getState("dataChangeNotasi") || {
    busProsMapped: [],
  };
  const jobName = $("#jobIdPosition").find(":selected").text();
  const jobId = item.target.value;
  const updatedPayload = {
    ...dataChangeNotasi,
    jobId: jobId,
    jobName: jobName,
  };
  setState("dataChangeNotasi", updatedPayload);
}
function onSelectProsbisRef(item) {
  const elementChecked = document.getElementById(`checked-prosbisref-${item.indexNumber}`);
  const isChecked = elementChecked.checked;
  const jobRefName = $("#jobIdRef").find(":selected").text();
  const draftName = $("#dataSource-rasci option:selected").text();
  const dataChangeNotasi = getState("dataChangeNotasi") || {
    busProsMapped: [],
  };
  const listSelectedProsbisref = getState("listSelectedProsbisref") || [];
  if (isChecked) {
    const notation = item.rasciNotation.map((notation) => ({
      rasciCode: notation.notation,
      comment: notation.comment,
      isChecked: isChecked,
    }));
    const updatedPayload = {
      ...dataChangeNotasi,
      draftName: draftName,
      busProsMapped: [
        ...dataChangeNotasi.busProsMapped.filter((entry) => entry.parentId !== item.indexNumber),
        {
          parentId: item.indexNumber,
          rasciNotation: notation,
        },
      ],
    };
    const sendData = { ...item, jobRefName: jobRefName };
    setState("listSelectedProsbisref", [...listSelectedProsbisref, sendData]);
    setState("dataChangeNotasi", updatedPayload);
  } else {
    const updatedPayload = {
      ...dataChangeNotasi,
      busProsMapped: dataChangeNotasi.busProsMapped.filter((entry) => entry.parentId !== item.indexNumber),
    };
    const removeList = listSelectedProsbisref.filter((entry) => entry.indexNumber !== item.indexNumber);
    setState("listSelectedProsbisref", removeList);
    setState("dataChangeNotasi", updatedPayload);
  }
  cardSelectedProsbisref();
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
  const selectedJobId = document.getElementById("jobIdPosition");
  const selectedValue = selectedBusinessId.val();
  const selectedJobValue = selectedJobId.value;
  const businessName = selectedBusinessId.find(":selected").text();
  const dataChangeNotasi = getState("dataChangeNotasi") || {};
  const rasciNotation = getState("rasciNotation") || [];
  const [orgUnitCode, orgPrl] = selectedJobValue.split(";");
  const payload = {
    ...dataChangeNotasi,
    orgUnitCode: orgUnitCode,
    orgPrl: orgPrl,
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
    $("#btn-selectedbusiness").prop("disabled", true);
  }, 200);
}
function selectJobPosition() {
  let $select = $("#dataSource-rasci");
  let selectedOption = $select.find(":selected"); // Ambil elemen option yang terpilih
  let selectedDraftSo = selectedOption.attr("data-draftso");
  $("#jobIdPosition")
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

function selectJobReference() {
  const draftidRasci = $("#dataSource-rasci").val();
  let $select = $("#dataSource-rasci");
  let selectedOption = $select.find(":selected"); // Ambil elemen option yang terpilih
  let selectedDraftSo = selectedOption.attr("data-draftso");
  $("#jobIdRef")
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
    $("#posref").show();
    $("#bispro, #selectedBispro").hide();
    cardSelectedNotasilist(reset);
    setState("dataChangeNotasi", reset);
    setState("listSelectedProsbisref", []);
    cardSelectedProsbisref();
    $("#btn-selectedbusiness").prop("disabled", true);
    // Reset dropdown levelId ke default
    $("#levelId").val("");
    // Kosongkan dan disable businessId
    $("#businessId").empty().prop("disabled", true);
  } else if (value === "nonReference") {
    jobSelect.val(null).trigger("change");
    $("#table-prosbisref").hide();
    $("#posref").hide();
    $("#bispro, #selectedBispro").show();
    setState("dataChangeNotasi", reset);
    setState("listSelectedProsbisref", []);
    cardSelectedProsbisref();
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
                 onclick="onCheckNotation(event, '${letter.rasciCode}')">
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
  const jobSelect = $("#jobIdRef");
  jobSelect.val(null).trigger("change");
  $("#table-prosbisref").hide();
  $("#posref").hide();
  $("#bispro, #selectedBispro").show();
}

function formValidationNotation() {
  const { jobId, busProsMapped } = getState("dataChangeNotasi");
  const listSelectedProsbisref = getState("listSelectedProsbisref");
  const isValid = (jobId && busProsMapped.length > 0) || (jobId && listSelectedProsbisref.length > 0);
  document.getElementById("btnDraftnotation").disabled = !isValid;
}

document.querySelectorAll("select").forEach((input) => {
  input.addEventListener("select", formValidationNotation);
});

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
                 onclick="onCheckNotation(event, '${letter.rasciCode}')">
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
                 onclick="onCheckNotation(event, '${letter.rasciCode}')">
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

function onCheckNotation(event, rasciCode) {
  const isChecked = event.target.checked;
  const commentInput = document.getElementById(`comment${rasciCode}`);
  commentInput.disabled = !isChecked;
  commentInput.value = isChecked ? commentInput.value : "";
  const selectedBusinessId = $("#businessId");
  const selectedLevel = $("#levelId");
  const selectedJobId = document.getElementById("jobIdPosition");
  const btn = $("#btn-selectedbusiness");
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
  const checkedCount = updatedRasciNotation.filter((l) => l.isChecked).length;

  if (selectedBusinessId && selectedLevel && selectedJobId && checkedCount > 0) {
    btn.prop("disabled", false);
  } else {
    btn.prop("disabled", true);
  }
}

function backChangeNotationRow() {
  const rasciNotation = getState("rasciNotation");
  const updatedRasciNotation = rasciNotation.map((letter) => {
    return { ...letter, comment: "", isChecked: false };
  });
  setState("dataDetailProsbis", {});
  setState("rasciNotation", updatedRasciNotation);
}

async function saveDraftnotation() {
  try {
    const spinner = document.getElementById("spinBtnNotation2");
    spinner.style.display = "inline-block";
    const dataChangeNotasi = getState("dataChangeNotasi");
    const draftRasciId = $("#dataSource-rasci").val();
    const selectedOption = $("#dataSource-rasci option:selected");
    const draftSoId = selectedOption.data("draftso");
    const jobId = dataChangeNotasi?.jobId;
    const [unitCode, prl] = jobId.split(";");
    const inputValue = {
      draftId: draftRasciId,
      draftJobSource: draftSoId,
      draftType: "Add/Edit RASCI",
      orgUnitCode: unitCode,
      orgPrl: prl,
      busProsMapped: dataChangeNotasi.busProsMapped,
    };
    const result = await submitDraftProsbis(inputValue);
    if (result.status === 200) {
      const modalAddNotation = document.getElementById("modalAddNotation");
      const modal = bootstrap.Modal.getInstance(modalAddNotation);
      const btnDraft = document.getElementById("btnDraftnotation");
      btnDraft.disabled = true;
      // btnApproval.disabled = true;
      const resultMatrix = await lastStateTableMatrix(inputValue);
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
              <span>You can check in <b>${result?.data.draftName}</b> at draft tab.</span>
              `,
            },
          },
        }).then(async () => {
          spinner.style.display = "none";
          if (modal) {
            modal.hide();
          }
          backChangeNotation();
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
  } catch (error) {}
}
