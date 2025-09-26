const openModalActivityAddnot = async () => {
  const rasciNotation = getState("rasciNotation") || [];
  const dataDetailDraft = getState("dataDetailDraft") || {};
  const dataChangeNotasi = getState("dataChangeNotasi");
  const resultLevel = await fetchSelectLevel(dataDetailDraft.draftId);
  const listLevel = resultLevel?.data.result;
  const url = `${dataDetailDraft.draftId}?draftListId=${dataDetailDraft.draftListId}`;
  const dataActivity = await fetchDetailDraftActivity(url);
  setState("dataDetailDraft", dataActivity.data);
  const detailInfo = dataActivity?.data.mappingData;
  console.log("first", detailInfo);
  const formContent = `
                <div class="col-12 mb-2">
                    <div>
                        <label class="form-label">RASCI Matrix Draft Name</label>
                        <select class="form-select digits" disabled>
                            <option value="${dataDetailDraft.draftId}">${dataDetailDraft.draftName}</option>
                        </select>
                    </div>
            </div>
            <div class="col-12">
                <div class="mb-2">
                    <label class="form-label">Position</label>
                     <select class="form-select digits" name="activity-idposition" id="activity-idposition" disabled>
                            <option value="${detailInfo?.[0]?.positionCode || ""}">${
    detailInfo?.[0]?.positionName || ""
  }</option>
                     </select>
                </div>
            </div>
    `;

  const bodySelectBusiness = `
        <div class="row">
          <div class="col-3">
            <select class="form-select digits" onchange="onSelectActivitylevel(event)" name="activity-idlevel" id="activity-idlevel">
             <option>Choose</option>
                ${listLevel.map((opt) => `<option value="${opt.id}">${opt.text}</option>`)}
            </select>
          </div>
          <div class="col-9">
            <select class="form-select digits" name="activity-businessId" id="activity-businessId" disabled  onchange="onselectActivityProsbis(event)">
            </select>
          </div>
        </div>
        `;
  const theadContent = `<tr>
            <th scope="col" style="width: 50px">Check</th>
            <th scope="col" style="width: 120px;text-align:center">RASCI Notation</th>
            <th scope="col">Comment (Optional)</th>
            </tr>`;
  ChangeActivityNotation(rasciNotation);
  cardSelectActivityNotation(dataChangeNotasi);
  document.getElementById("select-activitybusiness").innerHTML = bodySelectBusiness;
  document.getElementById("tbl-activitynotation-header").innerHTML = theadContent;
  //   document.getElementById("posref").innerHTML = bodyJobRef;

  const bodyContent = document.getElementById("form-activitynotation");
  if (bodyContent) {
    bodyContent.innerHTML = formContent;
  }
  const modal = new bootstrap.Modal(document.getElementById("modalActivityAddnot"));
  modal.show();
  // Initialize Bootstrap Select
  $(".selectpicker").selectpicker();
  select2Activityprosbis();
  //   selectJobPosition();
  //   selectJobReference();
  initializeTooltips();
};

const select2Activityprosbis = () => {
  const dataDetailDraft = getState("dataDetailDraft") || {};

  const levelId = $("#activity-idlevel").val();
  $("#activity-businessId")
    .select2({
      dropdownParent: $("#modalActivityAddnot"),
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
            draftId: dataDetailDraft.draftId,
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
};

const onSelectActivitylevel = (event) => {
  const value = event.target.value;
  const parentSelect = document.querySelector("#activity-businessId");

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
};

const ChangeActivityNotation = (rasciNotation) => {
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
  document.getElementById("tbl-activitynotation-body").innerHTML = tdBody;
};

const triggleSelectActivitybp = async () => {
  const selectedBusinessId = $("#activity-businessId");
  const selectedLevel = $("#activity-idlevel");
  //   const selectedJobId = document.getElementById("jobIdPosition");
  const selectedValue = selectedBusinessId.val();
  //   const selectedJobValue = selectedJobId.value;
  const dataDetailDraft = getState("dataDetailDraft") || {};
  const businessName = selectedBusinessId.find(":selected").text();
  const dataChangeNotasi = getState("dataChangeNotasi") || {};
  const rasciNotation = getState("rasciNotation") || [];
  //   const [orgUnitCode, orgPrl] = selectedJobValue.split(";");
  console.log("dataDetailDraft", dataDetailDraft);
  const payload = {
    draftId: dataDetailDraft.draftId,
    draftListId: dataDetailDraft.draftListId,
    draftType: "Add/Edit RASCI",
    orgUnitCode: dataDetailDraft.unitCodeOrg,
    orgPrl: dataDetailDraft.prlOrg,
    busProsMapped: [
      ...dataChangeNotasi.busProsMapped,
      {
        businessName,
        parentId: selectedValue,
        rasciNotation: rasciNotation,
      },
    ],
  };
  console.log("payload", payload);
  setState("dataChangeNotasi", payload);
  setTimeout(() => {
    selectedBusinessId.val(null).trigger("change");
    selectedLevel.val(null).trigger("change");
    const updatedRasciNotation = rasciNotation.map((letter) => {
      return { ...letter, comment: "", isChecked: false };
    });
    setState("rasciNotation", updatedRasciNotation);
    ChangeActivityNotation(updatedRasciNotation);
    cardSelectActivityNotation(payload);
    $("#btn-activityselectedbusiness").prop("disabled", true);
  }, 200);
};

const cardSelectActivityNotation = (param) => {
  const bodyBisuness = param.busProsMapped
    .map((value) => {
      const rasciNotation = value.rasciNotation.filter((item) => item.isChecked);
      return `<div class="card-listjob mb-2">
          <div class="row">
            <div class="col-10">
              <span style="font-size:13px;font-weight:bold">${value.businessName}</span>
            </div>
            <div class="col-2 d-flex justify-content-end">
              <button class="btn btn-outline-danger btn-sm " type="button" onclick="deleteActivitybpList('${
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
  document.getElementById("selected-activitybusiness").innerHTML = bodyBisuness;
};

async function onselectActivityProsbis(event) {
  const prosbisId = event.target.value;
  if (!prosbisId) return;
  $("#btn-activityselectedbusiness").prop("disabled", false);

  try {
  } catch (error) {}
}

const deleteActivitybpList = (id) => {
  const dataChangeNotasi = getState("dataChangeNotasi");
  const removeData = dataChangeNotasi.busProsMapped.filter((item) => item.parentId !== id);
  const result = { ...dataChangeNotasi, busProsMapped: removeData };
  setState("dataChangeNotasi", result);
  cardSelectActivityNotation(result);
};

const backChangeActivityNotation = () => {
  const rasciNotation = getState("rasciNotation");
  const updatedRasciNotation = rasciNotation.map((letter) => {
    return { ...letter, comment: "", isChecked: false };
  });
  setState("dataChangeNotasi", { busProsMapped: [] });
  setState("rasciNotation", updatedRasciNotation);
  //   const jobSelect = $("#jobIdRef");
  //   jobSelect.val(null).trigger("change");
  //   $("#table-prosbisref").hide();
  //   $("#posref").hide();
  //   $("#activity-bispro, #selected-activitybispro").show();
};

const saveNewActivityNotation = async () => {
  try {
    const dataChangeNotasi = getState("dataChangeNotasi");
    const spinner = document.getElementById("spinBtnNotation");
    if (spinner) spinner.style.display = "inline-block";
    const payload = {
      draftId: dataChangeNotasi.draftId,
      draftListId: dataChangeNotasi.draftListId,
      draftType: dataChangeNotasi.draftType,
      orgUnitCode: dataChangeNotasi.orgUnitCode,
      orgPrl: dataChangeNotasi.orgPrl,
      busProsMapped: dataChangeNotasi.busProsMapped,
    };
    const result = await submitDraftProsbis(payload);

    if (result.status === 200) {
      const modalEl = document.getElementById("modalActivityAddnot");
      const modal = bootstrap.Modal.getInstance(modalEl);

      swal({
        title: "SUCCESS",
        icon: "success",
        buttons: false,
        timer: 2000,
        content: {
          element: "div",
          attributes: {
            innerHTML: `<span style="text-align: center;">Your activity has been saved as draft.</span>
              <br>
              <span>You can check in <b>${result?.data.draftName}</b> at draft tab.</span>`,
          },
        },
      }).then(async () => {
        if (spinner) spinner.style.display = "none";
        if (modal) modal.hide();
        backChangeNotationRow();
        await renderTableEditnotActivity(dataChangeNotasi.draftListId, dataChangeNotasi.draftId);
      });
    } else {
      if (spinner) spinner.style.display = "none";
      swal({
        title: "Error",
        text: "Failed to save draft.",
        icon: "error",
        button: "OK",
      });
    }
  } catch (error) {
    const spinner = document.getElementById("spinBtnNotation");
    if (spinner) spinner.style.display = "none";
    swal({
      title: "Error",
      text: "An error occurred while saving.",
      icon: "error",
      button: "OK",
    });
    console.error("editNotActivity error:", error);
  }
};
