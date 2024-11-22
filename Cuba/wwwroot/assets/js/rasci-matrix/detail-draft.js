async function detailDraft() {
  try {
    const dataDraft = getState("dataDetailDraft");
    if (dataDraft) {
      const dataInfo = dataDraft.draftInfo;
      const dataDetail = dataDraft.draftDetail[0];
      const notation = JSON.parse(dataDetail.rasciNotation).filter((item) => item.IsChecked === true);
      const bodyInfo = `
      <div class="col-3 custom-col">
        <label style="color:#9F9FA5">Draft Name</label>
        <label style="font-weight: 600;font-size: 14px">${dataInfo.draftName}</label>
        <label>${dataInfo.reqId}</label>
      </div>
      <div class="col-3 custom-col">
        <label style="color:#9F9FA5">Created by</label>
        <label style="font-weight: 600;font-size: 14px">${dataInfo.createdBy ? dataInfo.createdBy : "-"}</label>
      </div>
      <div class="col-3 custom-col">
        <label style="color:#9F9FA5">Created Date</label>
        <label style="font-weight: 600;font-size: 14px">${
          dataInfo.createdAt ? new Date(dataInfo.createdAt).toLocaleDateString() : "-"
        }</label>
      </div>
      <div class="col-3 custom-col">
        <label style="color:#9F9FA5">Type</label>
        <label style="font-weight: 600;font-size: 14px">${dataInfo.typeDetail}</label>
      </div>`;
      const bodyDetail = `
       <div class="col-4 custom-col" style="text-align: left;">
            <span style="color:#9F9FA5">Business Process Name</span>
            <label style="font-weight: 600;font-size: 14px">${dataDetail.busProsNameAfter}</label>
        </div>
        <div class="col-1 custom-col">
            <span style="color:#9F9FA5">Level</span>
            <label style=" font-weight: 600;font-size: 14px">${dataDetail.level}</label>
        </div>
        <div class="col-7 custom-col" style="text-align: left;">
            <span style="color:#9F9FA5">Business Process Parent</span>
            <label style="font-weight: 600;font-size: 14px">${dataDetail.parentIndex} - ${dataDetail.busProsNameBefore}</label>
        </div>
      `;
      const bodyJob = `
        <div class=" custom-row-full">
            <span style="color:#9F9FA5">Job Title</span>
            <label style="font-weight: 600;font-size: 14px;padding-bottom: 10px;">${dataDetail?.jobTitle.name}</label>
        </div>
        <div class=" custom-row-full">
            <span style="color:#9F9FA5">Rasci Notasi</span>
          <ul style="list-style-type:disc;padding-left:20px">
          ${notation.map((item) => `<li>${item.RasciCode}</li>`).join("")}
          </ul>
        </div>
      `;
      const draftInfo = document.getElementById("draft-info");
      const draftDetail = document.getElementById("detail-prosbis");
      const draftJob = document.getElementById("detail-job");
      if (draftInfo && draftDetail && draftJob) {
        draftInfo.innerHTML = bodyInfo;
        draftDetail.innerHTML = bodyDetail;
        draftJob.innerHTML = bodyJob;
      }
    }
  } catch (error) {}
}

async function handleOpenDetailBp() {
  const modal = new bootstrap.Modal(document.getElementById("modalEdit"));
  modal.show();
  const prosbisLevel = getState("prosbisLevel");
  const dataDraft = getState("dataDetailDraft");
  const dataInfo = dataDraft.draftInfo;
  const dataDetail = dataDraft.draftDetail[0];
  const notation = JSON.parse(dataDetail.rasciNotation);
  try {
    const formContent = `
        <div class="col-6">
        <label class="form-label">Draft Name</label>
            <input class="form-control" type="text" id="edit-draftname" value="${
              dataInfo.draftName
            }" placeholder="Draft Name" >
        </div>
        <div class="col-6">
        <label class="form-label">Draft Type</label>
            <input class="form-control" type="text" placeholder="Draft Type" value="${dataInfo.typeDetail}" disabled>
        </div>
        <div class="col-12 mt-3 mb-2">
        <h6 class="f-w-600">Business Process Info</h6>
        </div>
        <div class="col-3">
            <div class="mb-3">
                <label class="form-label">Level</label>
                <select class="form-select digits" id="editLevel" onchange="onEditSelect(event)">
                  ${prosbisLevel.map(
                    (opt) =>
                      `<option value="${opt.id}" ${dataDetail.level === opt.id ? "selected" : ""}>${opt.text}</option>`,
                  )}
                </select>
            </div>
        </div>
        <div class="col-9">
            <div class="mb-3">
                <label class="form-label">Parent</label>
                <select 
                  class="form-select digits" 
                  name="editParentId" 
                  id="editParentId" 
                  ${dataDetail.level === 1 ? "disabled" : ""} 
                  onchange="onSelectEditParentId(event)"
                >
                  <option value="${dataDetail?.parentId}">
                    ${dataDetail?.parentIndex} ${dataDetail?.busProsNameBefore}
                  </option>
                </select>
            </div>
        </div>
        <div class="col-12">
            <div>
                <label class="form-label">Business Process Name</label>
                  <textarea class="form-control" id="edit-prosbisname">${dataDetail.busProsNameAfter}</textarea>
            </div>
            <div class="mt-3">
                <label class="form-label">Job</label>
                <select class="form-select digits" name="editJobId" id="editJobId"  onchange="onSelectEditJobId(event)">
                <option value=${dataDetail?.jobTitle.id}>${dataDetail?.jobTitle.name}</option>
          </select>
            </div>
        </div>`;
    const theadContent = `<tr>
        <th scope="col" style="width: 50px">
        Check
        </th>
        <th scope="col" style="width: 150px;text-align:center">RASCI Notation</th>
        <th scope="col">Comment (Optional)</th>
        </tr>`;
    const tdBody = notation
      .map((item) => {
        return `
              <tr>
                  <th scope="row">
                    <label class="radio-label" for="checked-body-bp">
                     <input class="checkbox_animated" id="checked-${item.RasciCode.toLowerCase()}" type="checkbox" ${
          item.IsChecked ? "checked" : ""
        } onclick="onCheckEdit(event, '${item.RasciCode}')" >
                    </label>
                  </th>
                  <td style="text-align:center">
                    <img src="/assets/images/rasci/${item.RasciCode.toLowerCase()}.svg" alt="${
          item.RasciCode
        } Icon" style="padding-right:2px">
                  </td>
                  <td>
                    <input class="form-control" type="text" placeholder="Type Comment" id="commentEdit${
                      item.RasciCode
                    }" value="${item.Comment}" ${item.IsChecked ? "" : "disabled"} oninput="updateDraftComment('${
          item.RasciCode
        }', this.value)">
                  </td>
              </tr>
          `;
      })
      .join("");

    document.getElementById("tbl-edit-prosbis-header").innerHTML = theadContent;
    document.getElementById("tbl-edit-prosbis-body").innerHTML = tdBody;
    const bodyContent = document.getElementById("form-content-edit");
    if (bodyContent) {
      bodyContent.innerHTML = formContent;
    }
    // Initialize Bootstrap Select
    $(".selectpicker").selectpicker();
    updateSelectEditProsbis();
    updateSelectEditJob();
  } catch (error) {
    console.error(error);
  }
}

function updateSelectEditProsbis() {
  const editDraft = getState("editDrafProsbis");
  $("#editParentId")
    .select2({
      dropdownParent: $("#modalEdit"),
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
            level: editDraft.level,
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

function updateSelectEditJob() {
  $("#editJobId")
    .select2({
      dropdownParent: $("#modalEdit"),
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

function onEditSelect(event) {
  const value = event.target.value;
  const parentSelect = document.querySelector("#editParentId");
  if (value === "Choose" || value == 1) {
    parentSelect.disabled = true;

    if (parentSelect.value) {
      parentSelect.value = "";
      onSelectEditParentId({ target: { value: "" } });
    }
  } else {
    parentSelect.disabled = false;
  }
  setState("editDrafProsbis", { ...appState.editDrafProsbis, level: value });
}
function onSelectEditParentId(event) {
  const value = event.target.value;
  const dataProsbis = getState("editDrafProsbis");
  setState("editDrafProsbis", { ...dataProsbis, parentId: value });
}
function onSelectEditJobId(event) {
  const value = event.target.value;
  const dataProsbis = getState("editDrafProsbis");
  setState("editDrafProsbis", { ...dataProsbis, jobTitleId: value });
}
function onCheckEdit(event, rasciCode) {
  const isChecked = event.target.checked;
  const commentInput = document.getElementById(`commentEdit${rasciCode}`);
  commentInput.disabled = !isChecked;
  commentInput.value = isChecked ? commentInput.value : "";
  const dataProsbis = getState("editDrafProsbis");
  const updatedRasciNotation = dataProsbis.rasciNotation.map((letter) => {
    if (letter.RasciCode === rasciCode) {
      return {
        ...letter,
        IsChecked: isChecked,
        Comment: isChecked ? commentInput.value : "",
      };
    }
    return letter;
  });

  setState("editDrafProsbis", {
    ...dataProsbis,
    rasciNotation: updatedRasciNotation,
  });
}
function updateDraftComment(rasciCode, value) {
  const dataProsbis = getState("editDrafProsbis");
  const updatedRasciNotation = dataProsbis.rasciNotation.map((letter) => {
    if (letter.RasciCode === rasciCode) {
      return { ...letter, Comment: value };
    }
    return letter;
  });
  setState("editDrafProsbis", {
    ...dataProsbis,
    rasciNotation: updatedRasciNotation,
  });
}
async function saveEditDraft() {
  const dataDraft = getState("dataDetailDraft");
  const dataProsbis = getState("editDrafProsbis");
  const draftName = document.querySelector("#edit-draftname");
  const prosbisName = document.querySelector("#edit-prosbisname");
  const level = document.querySelector("#editLevel");
  const parentId = document.querySelector("#editParentId");
  const jobId = document.querySelector("#editJobId");
  try {
    const payloadSave = {
      draftName: draftName.value,
      name: prosbisName.value,
      level: level.value,
      parentId: parentId.value,
      jobTitleId: jobId.value,
      rasciNotation: dataProsbis.rasciNotation,
    };
    const result = await updateDraftProsbis(payloadSave, dataDraft.draftInfo.id);
    if (result.status === 200) {
      const afterSave = await fetchDraftProsbisByid(dataDraft.draftInfo.id);
      setState("dataDetailDraft", afterSave.data);
      const payload = {
        Type: "draft",
        Page: 1,
        Limit: 5,
      };
      const queryString = new URLSearchParams(payload).toString();
      const dataTableDraft = await fetchDraftProsbis(queryString);
      loadTableBodyDraft(dataTableDraft.data.data);
    }
  } catch (error) {
    console.log(error);
  }
}

async function openDetailApproval() {
  const openModal = new bootstrap.Modal(document.getElementById("modalDraftAprroval"));
  openModal.show();
}
async function handleSubmitApproval() {
  const dataDraft = getState("dataDetailDraft");
  try {
    const payload = {
      type: "submission",
    };
    const result = await draftSubmittoApproval(payload, dataDraft.draftInfo.id);
    const modalDetailAprroval = document.getElementById("modalDraftAprroval");
    const modal = bootstrap.Modal.getInstance(modalDetailAprroval);
    if (result.status === 200) {
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
              innerHTML: `<div style="text-align: center;">Your draft has been submit to approval. You can check in approval list tab.</div>`,
            },
          },
        }).then(async () => {
          backFromModalBp();
          const payload = {
            Type: "approval",
            Page: 1,
            Limit: 10,
          };
          const queryString = new URLSearchParams(payload).toString();
          const dataApproval = await fetchDraftProsbis(queryString);
          handleBack();
          const IsNotEmpty = dataApproval.data.data.length;
          handleApprovalList(IsNotEmpty);
          loadTableBodyApproval(dataApproval.data.data);
          $("#pills-approval-tab").tab("show");
        });
      }, 100);
    }
  } catch (error) {}
}

function deleteDraftFromdetail() {
  const dataDraft = getState("dataDetailDraft");
  const openModal = new bootstrap.Modal(document.getElementById("modalDeleteDraft"));
  openModal.show();
  setState("deleteDraftProsbis", dataDraft?.draftInfo.id);
}

async function confirmDeleteDetailDraft() {
  const id = getState("deleteDraftProsbis");
  try {
    const result = await deleteProsbisDraft(id);
    if (result.status === 200) {
      const modalDelDraft = document.getElementById("modalDeleteDraft");
      const modal = bootstrap.Modal.getInstance(modalDelDraft);
      if (modal) {
        modal.hide();
      }
      handleBack();
      setState("deleteDraftProsbis", 0);
      const payload = {
        Type: "draft",
        Page: 1,
        Limit: 5,
      };
      const queryString = new URLSearchParams(payload).toString();
      const dataDraft = await fetchDraftProsbis(queryString);
      const IsNotEmpty = dataDraft.data.data.length;
      changeemptyPageDraft(IsNotEmpty);
      loadTableBodyDraft(dataDraft.data.data);
    }
  } catch (error) {}
}
