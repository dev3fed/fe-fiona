async function handleDeleteDraftActivity(id, draftType) {
  const draftRasciId = getState("draftRasciId");
  setState("draftActivityId", id);
  setState("draftActivityType", draftType);
  console.log("first", id);
  console.log("draftRasciId", draftRasciId);
  const draftTypeMessages = {
    "Add New Business Process": "Are you sure want to delete this Add New Business Process activity data?",
    "Delete Business Process": "Are you sure want to delete this Delete Business Process activity data?",
    "Edit Business Process": "Are you sure want to delete this Edit Business Process activity data?",
    "Add/Edit RASCI": "Are you sure want to delete this Add/Edit RASCI activity data?",
  };
  const information = draftTypeMessages[draftType] || "Are you sure want to delete this activity data?";

  try {
    const modal = new bootstrap.Modal(document.getElementById("modalDeleteActivitydraft"));
    modal.show();
    const contentDeleteActivitydraft = document.getElementById("contentInformation");

    if (contentDeleteActivitydraft) {
      contentDeleteActivitydraft.innerHTML = information;
    }
  } catch (error) {}
}

async function deleteActivitydraft() {
  try {
    const draftRasciId = getState("draftRasciId");
    const id = getState("draftActivityId");
    const draftType = getState("draftActivityType");
    const draftTypeMessages = {
      "Add New Business Process": "Add New Business Process activity data has been deleted",
      "Delete Business Process": "Edit Business Process activity data has been deleted",
      "Edit Business Process": "Delete Business Process activity data has been deleted",
      "Add/Edit RASCI": "Add/Edit RASCI activity data has been deleted",
    };
    const information = draftTypeMessages[draftType] || "Are you sure want to delete this activity data?";
    console.log("draftRasciId", draftRasciId);
    console.log("id", id);
    console.log("cek");
    const spinner = document.getElementById("btnDeleteActivitydraft");
    if (spinner) spinner.style.display = "inline-block";

    const url = `${id}?draftId=${draftRasciId}`;
    const deleteResult = await endpointDeleteDraftActivity(url);
    console.log("deleteResult", deleteResult);
    if (deleteResult.success === true) {
      const modal = bootstrap.Modal.getInstance(document.getElementById("modalDeleteActivitydraft"));
      if (modal) modal.hide();
      setTimeout(() => {
        swal({
          title: "DELETED",
          icon: "success",
          buttons: false,
          timer: 2000,
          content: {
            element: "div",
            attributes: {
              innerHTML: `<div style="text-align: center;">${information}</div>`,
            },
          },
          customClass: {
            popup: "swal-custom-popup",
          },
        }).then(async () => {
          spinner.style.display = "none";
          const payload = {
            Page: 1,
            PageSize: 5,
          };
          const queryString = new URLSearchParams(payload).toString();
          const listData = await fetchDraftListProsbis(draftRasciId, queryString);
          renderTableActivity(listData);
        });
      }, 200);
    }
  } catch (error) {}
}
async function triggleEditActivitybp(id) {
  const draftRasciId = getState("draftRasciId");
  console.log("first", id);
  console.log("draftRasciId", draftRasciId);
  const rasciNotation = getState("rasciNotation") || [];
  const dataProsbis = getState("insertProsbis");
  const draftName = $("#dataSource-rasci option:selected").text();
  console.log("first", draftName);
  const resultLevel = await fetchSelectLevel(draftRasciId);
  const modal = new bootstrap.Modal(document.getElementById("ModalEditActivitybp"));
  modal.show();
  try {
    if (resultLevel.status === 200) {
      const listLevel = resultLevel?.data.result;
      console.log("first", listLevel);
      const formContent = `
    <div class="col-2">
      <div class="mb-3">
        <label class="form-label">Level</label>
         <select class="form-select digits" disabled>
          <option value="${draftRasciId}">${draftName}</option>
        </select>
      </div>
    </div>
    <div class="col-10">
        <div class="mb-3">
          <label class="form-label">Parent</label>
          <select class="form-select digits" disabled>
          <option value="${draftRasciId}">${draftName}</option>
        </select>
        </div>
    </div>
    <div class="col-12">
      <div>
        <label class="form-label">Business Process Name</label>
        <textarea class="form-control"></textarea>
      </div>
    </div>`;
      const bodySelectJob = `
      <select class="form-select digits" name="jobeditId" id="jobeditId">
      </select>
      `;
      theadContent = `<tr>
          <th scope="col" style="width: 50px">Check</th>
          <th scope="col" style="width: 120px;text-align:center">RASCI Notation</th>
          <th scope="col">Comment (Optional)</th>
          </tr>`;

      editTblNotation(rasciNotation);
      cardSelectedEditJoblist(dataProsbis);
      document.getElementById("edit-select-job").innerHTML = bodySelectJob;
      document.getElementById("tbl-edit-bp-header").innerHTML = theadContent;

      const bodyContent = document.getElementById("formedit-content");
      if (bodyContent) {
        bodyContent.innerHTML = formContent;
      }
      select2EditJob();
    }
  } catch (error) {}
}
const cardSelectedEditJoblist = (param) => {
  const bodyJoblist = param.jobMapped
    .map((value) => {
      const rasciNotation = value.rasciNotation.filter((item) => item.isChecked);
      return `<div class="card-listjob mb-2">
          <div class="row">
            <div class="col-10">
              <span style="font-size:13px;font-weight:bold">${value.jobName}</span>
            </div>
            <div class="col-2 d-flex justify-content-end">
              <button class="btn btn-outline-danger btn-sm " type="button"  style="padding: 0; width: 25px; height: 22px; display: flex; justify-content: center; align-items: center;">
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
  document.getElementById("selected-edit-job").innerHTML = bodyJoblist;
};

const editTblNotation = (rasciNotation) => {
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
  document.getElementById("tbl-edit-bp-body").innerHTML = tdBody;
};
function select2EditJob() {
  const draftRasciId = $("#dataSource-rasci").val();
  let $select = $("#dataSource-rasci");
  let selectedOption = $select.find(":selected"); // Ambil elemen option yang terpilih
  let selectedDraftSo = selectedOption.attr("data-draftso");
  $("#jobeditId")
    .select2({
      dropdownParent: $("#ModalEditActivitybp"),
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

async function triggleDetailActivity(id, draftType) {
  const draftRasciId = getState("draftRasciId");
  try {
    if (draftType === "Add New Business Process") {
      detailAddprosbis(id, draftRasciId);
    } else if (draftType === "Delete Business Process") {
      detailDeleteBp(id, draftRasciId);
    } else if (draftType === "Edit Business Process") {
      detailEditBp(id, draftRasciId);
    } else if (draftType === "Add/Edit RASCI") {
      detailAddNotation(id, draftRasciId);
    }
  } catch (error) {}
}

async function detailAddprosbis(id, draftRasciId) {
  console.log("cek", id);
  console.log("draftRasciId", draftRasciId);
  try {
    const url = `${draftRasciId}?draftListId=${id}`;
    const dataActivity = await fetchDetailDraftActivity(url);
    console.log("dataActivity", dataActivity);
    const modal = new bootstrap.Modal(document.getElementById("modalDetaildraftAddBp"));
    modal.show();
    const dataHeader = dataActivity?.data.businessProcess;
    const dataFooter = dataActivity?.data.rasciMapping;
    const modalTitle = document.getElementById("modalDetaildraftAddBpTitle");
    if (modalTitle) {
      modalTitle.innerHTML = `Activity Detail Add/Edit RASCI`;
    }
    const elementFooter = dataFooter
      .map((item, index) => {
        return `
         ${index !== 0 ? "<div><hr></div>" : " "}
        <span class="mb-2" style="display: flex; font-weight: 600; font-size: 14px;">
        ${item.unitCode} - ${item.positionName}
        </span>
        ${item.rasciData
          .map(
            (item) => `
            <div class="row align-items-center mb-2">
                <div class="col-auto d-flex align-items-center">
                <img src="/assets/images/rasci/${item.notation.toLowerCase()}.svg" alt="${
              item.notation
            } Icon" style="height: 16px; width: 16px;">
                </div>
                <div class="col text-left">
                <span style="margin-left: auto;">:</span>
                <span style="font-size: 12px;">${item.comment}</span>
                </div>
            </div>
            `,
          )
          .join("")}
        `;
      })
      .join("");

    const contentBody = `
    <div class="custom-card-draft">
        <div class="header-card-draft">
            New Business Process
        </div>
        <div class="row" style="padding-top: 20px;" id="header-avtivity-detail">
          <div class="col-7 custom-col" style="text-align: left">
            <label label style="color:#9F9FA5">Business Process Name</label>
            <div style="display: flex;  font-weight: 600; font-size: 14px;">
              <span>${dataHeader.indexGroup || "0"} - ${dataHeader.businessProcessName}</span>
            </div>
         </div>
          <div class="col-5 custom-col" style="text-align: left; border-right:none">
            <label style="color:#9F9FA5">Level</label>
            <label style="font-weight: 600;font-size: 14px">${dataHeader.level || "-"}</label>
          </div>
          <div class="col-12 custom-col" style="text-align: left">
            <hr style="margin-right: 10px">
              <label style="color:#9F9FA5">Parent</label>
              <label style="font-weight: 600;font-size: 14px">${dataHeader.parentId || "0"} - ${
      dataHeader.parentName ? dataHeader.parentName : "-"
    }</label>
          </div>
        </div>
    </div>
    <div class="custom-card-draft" style="padding-top:30px">
        <div class="header-card-draft" id="label-position">
        <span>Selected Position (total: ${dataFooter.length})</span>
        </div>

        <div class="row scrollable-detailDraft" id="footer-activity-detail">
          ${elementFooter}
        </div>
    </div>
    `;
    const contentDetailDraftAddBpComponent = document.getElementById("contentDetailDraftAddBp");
    if (contentDetailDraftAddBpComponent) {
      contentDetailDraftAddBpComponent.innerHTML = contentBody;
    }
  } catch (error) {}
}

async function detailDeleteBp(id, draftRasciId) {
  try {
    const url = `${draftRasciId}?draftListId=${id}`;
    const dataActivity = await fetchDetailDraftActivity(url);
    console.log("dataActivity", dataActivity);
    const modal = new bootstrap.Modal(document.getElementById("modalDetailDeletebp"));
    modal.show();
    // const dataActivity = await fetchDetailDraftActivity(id);
    const dataInfo = dataActivity.data.businessProcess;
    const formContent = `
      <div class="col-12">
        <div >
            <label class="form-label" style="width:25%">Business Process Parent</label>
             <label> : </label>
            <b class="form-label">${dataInfo.parentId} - ${dataInfo.parentName}</b>

        </div>
      </div>
      <div class="col-12">
        <div >
            <label class="form-label" style="width:25%">Business Process Level</label>
             <label> : </label>
            <b class="form-label">${dataInfo.level}</b>

        </div>
      </div>
       <div class="col-12">
        <div >
            <label class="form-label" style="width:25%">Business Process Index</label>
             <label> : </label>
            <b class="form-label">${dataInfo.indexGroup}</b>

        </div>
      </div>
     <div class="col-12 mt-2">
      <div>
        <label class="form-label" style="width:25%">Business Process Name</label>
             <label> : </label>
              <b class="form-label">${dataInfo.description}</b>
      </div>
    </div>
    `;

    const bodyContent = document.getElementById("list-detaildeletebp");
    if (bodyContent) {
      bodyContent.innerHTML = formContent;
    }

    $(".selectpicker").selectpicker();
  } catch (error) {}
}

async function detailEditBp(id, draftRasciId) {
  const url = `${draftRasciId}?draftListId=${id}`;
  const dataActivity = await fetchDetailDraftActivity(url);
  console.log("dataActivity", dataActivity.data);
  const modal = new bootstrap.Modal(document.getElementById("ModalDetaileditbp"));
  modal.show();
  const dataInfo = dataActivity.data;
  const formContent = `
      <div class="col-12">
        <div >
          <label class="form-label" style="width:25%">RASCI Matrix Draft</label>
          <label> : ${dataInfo.draftName}</label>
        <b class="form-label"></b>
        </div>
      </div>
      <div class="col-12">
        <div >
            <label class="form-label" style="width:25%">Business Process Level</label>
             <label> : ${dataInfo.level}</label>
        <b class="form-label"></b>
        </div>
      </div>
       <div class="col-12">
        <div >
            <label class="form-label" style="width:25%">Business Process Index</label>
             <label> : ${dataInfo.indexNumber}</label>
        <b class="form-label"></b>
        </div>
      </div>
             <div class="col-12">
        <div >
            <label class="form-label" style="width:25%">Business Process Name (before)</label>
             <label> : ${dataInfo.oldBusinessProcess}</label>
        <b class="form-label"></b>
        </div>
      </div>
     <div class="col-12 mt-2">
      <div>
        <label class="form-label">Business Process Name (after)</label>
        <textarea class="form-control"  disabled>${dataInfo.newBusinessProcess}</textarea>
      </div>
    </div>
    `;

  const bodyContent = document.getElementById("detail-editbp");
  if (bodyContent) {
    bodyContent.innerHTML = formContent;
  }

  // const dataActivity = await fetchDetailDraftActivity(id);
  // const dataInfo = dataActivity.data.businessProcess;
}

async function detailAddNotation(id, draftRasciId) {
  console.log("first", id);
  const url = `${draftRasciId}?draftListId=${id}`;
  const dataActivity = await fetchDetailDraftActivity(url);
  console.log("dataActivity", dataActivity);
  const detailInfo = dataActivity?.data.mappingData;
  const modal = new bootstrap.Modal(document.getElementById("modalActivityEnot"));
  modal.show();
  const modalTitle = document.getElementById("modalActivityEnotTitle");
  if (modalTitle) {
    modalTitle.innerHTML = `Add/Edit RASCI Activity Detail `;
  }
  // Looping detailInfo.mappingData untuk membuat baris tabel dinamis

  // Generate table body with comment icons for old and new notation
  const contentBody = `
      <div class="row">
        <div class="col-12 ">
            <label>Position: ${detailInfo[0].positionCode} - ${detailInfo[0].positionName}</label>
            <hr style="margin-top: 0;" />
        </div>
        <div class="col-12 mb-2 d-flex justify-content-end">
         <button class="btn btn-primary btn-sm" onclick="openModalActivityAddnot()">  
           <img src="/assets/images/rasci/plus.svg" alt="Filter Icon" style="margin-top: -1px;"> Add RASCI
         </button>
        </div>
        <div class="col-12 ">
       <div class="card-tblbusiness" style=" max-height: 300px;">
         <div class="table-responsive scrollable mt-1" style=" max-height: 260px;">
             <table class="table tbl-border-notation">
                 <thead>
                 <tr>
                      <th scope="col" style="width: 50px">No</th>
                     <th scope="col" style="width: 50px">Level</th>
                     <th scope="col" style="width: 80px;text-align:center">Index</th>
                     <th scope="col" >Business Process</th>
                     <th scope="col" style="width: 120px;text-align:center">RASCI (Before)</th>
                     <th scope="col" style="width: 120px;text-align:center">RASCI (After)</th>
                     <th scope="col" style="width: 100px;text-align:center">Action</th>
                 </tr>
                 </thead>
                 <tbody>
                  ${
                    detailInfo.length === 0
                      ? `<tr><td colspan="7" style="text-align:center">No data</td></tr>`
                      : detailInfo
                          .map((item, idx) => {
                            // OLD COMMENT TOOLTIP
                            let oldCommentTooltip = "";
                            if (Array.isArray(item.oldNotation) && item.oldComment && item.oldComment.length > 0) {
                              oldCommentTooltip = item.oldComment
                                .map((c, i) => {
                                  const code = item.oldNotation[i]?.value || "";
                                  return code && c.value ? `${code} : ${c.value}` : "";
                                })
                                .filter(Boolean)
                                .join("<br>");
                            }
                            // If oldComment is empty, try to fallback to empty string
                            // NEW COMMENT TOOLTIP
                            let newCommentTooltip = "";
                            if (
                              item.newNotation &&
                              item.newNotation.value &&
                              item.newComment &&
                              item.newComment.value
                            ) {
                              newCommentTooltip = `${item.newNotation.value} : ${item.newComment.value}`;
                            }

                            return `
                          <tr>
                          <td>${idx + 1}</td>
                          <td>${item.level || "-"}</td>
                          <td style="text-align:center">${item.indexNo || "-"}</td>
                          <td>
                            ${item.businessProcessName || "-"}
                            ${
                              item.businessProcessReference
                                ? `<br><small style="color:#9F9FA5">(${item.businessProcessReference})</small>`
                                : ""
                            }
                          </td>
                          <td style="text-align:center">
                            ${
                              Array.isArray(item.oldNotation)
                                ? item.oldNotation
                                    .map(
                                      (n, i) =>
                                        `<img src="/assets/images/rasci/${n.value.toLowerCase()}.svg" alt="${
                                          n.value
                                        } Icon" style="height: 16px; width: 16px; margin-left: 6px;">`,
                                    )
                                    .join("")
                                : "-"
                            }
                            ${
                              oldCommentTooltip
                                ? `<img src="/assets/images/rasci/comment.svg" alt="Comment Icon" style="padding-right:2px" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-html="true" title="${oldCommentTooltip}">`
                                : ""
                            }
                          </td>
                          <td style="text-align:center">
                            ${
                              item.newNotation && item.newNotation.value
                                ? `<img src="/assets/images/rasci/${item.newNotation.value.toLowerCase()}.svg" alt="${
                                    item.newNotation.value
                                  } Icon" style="height: 16px; width: 16px; margin-left: 6px;">`
                                : "-"
                            }
                            ${
                              newCommentTooltip && item.newComment.value
                                ? `<img src="/assets/images/rasci/comment.svg" alt="Comment Icon" style="padding-right:2px" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-html="true" title="${newCommentTooltip}">`
                                : ""
                            }
                          </td>
                          <td style="text-align:center">
                            <button class="btn btn-outline-light btn-small-icon" type="button" onclick="handleEditNotation()">
                            <img src="/assets/images/rasci/icon_pencil.svg" alt="Edit Icon">
                            </button>
                          </td>
                          </tr>
                        `;
                          })
                          .join("")
                  }
               </tbody>
             </table>
            </div>
          </div>
        </div>
      </div>
  `;

  const contentDetailDraftEditnotComponent = document.getElementById("contentdetailEditnitation");
  if (contentDetailDraftEditnotComponent) {
    contentDetailDraftEditnotComponent.innerHTML = contentBody;
  }
  // const url = `${draftRasciId}?draftListId=${id}`;
  // const dataActivity = await fetchDetailDraftActivity(url);
  // console.log("dataActivity", dataActivity);
}

const handleEditNotation = () => {
  console.log("first");
  const modal = new bootstrap.Modal(document.getElementById("modalActivityEditnot"));
  modal.show();
  // console.log("data", data);
  // console.log("dataChangeNotasi", dataChangeNotasi);
  // const dataChangeNotasi = getState("dataChangeNotasi");
  // setState("editRasciNotation", data);
  // openModalEditRascinotation(dataChangeNotasi, data);
};

const openModalActivityAddnot = () => {
  const modal = new bootstrap.Modal(document.getElementById("modalActivityAddnot"));
  modal.show();
};
