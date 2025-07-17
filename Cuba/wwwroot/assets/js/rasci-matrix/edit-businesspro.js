// start section add notation by column row
function openModalEditBusinesspro() {
  const modal = new bootstrap.Modal(
    document.getElementById("modalEditBusinesspro"),
  );
  modal.show();
  const dataDetailProsbis = getState("dataDetailProsbis");
  const formContent = `
      <div class="col-12">
        <div >
          <label class="form-label" style="width:25%">RASCI Matrix Draft</label>
          <label> : </label>
        <b class="form-label">${dataDetailProsbis.draftName}</b>
        </div>
      </div>
      <div class="col-12">
        <div >
            <label class="form-label" style="width:25%">Business Process Level</label>
             <label> : </label>
        <b class="form-label">${dataDetailProsbis.level}</b>
        </div>
      </div>
       <div class="col-12">
        <div >
            <label class="form-label" style="width:25%">Business Process Index</label>
             <label> : </label>
        <b class="form-label">${dataDetailProsbis.indexNumber}</b>
        </div>
      </div>
     <div class="col-12 mt-2">
      <div>
        <label class="form-label">Business Process Name</label>
        <textarea class="form-control" id="prosbisName">${dataDetailProsbis.description}</textarea>
      </div>
    </div>
    `;

  const bodyContent = document.getElementById("form-businesspro");
  if (bodyContent) {
    bodyContent.innerHTML = formContent;
  }

  // Initialize Bootstrap Select
  $(".selectpicker").selectpicker();
}

async function handleEditbp() {
  const dataDetailProsbis = getState("dataDetailProsbis");
  const prosbisName = document.getElementById("prosbisName").value;
  const spinner = document.getElementById("loadingRenamebp");
  spinner.style.display = "inline-block";

  const payload = {
    draftId: dataDetailProsbis.draftId,
    draftType: "Edit Business Process",
    draftName: dataDetailProsbis.draftName,
    parentId: dataDetailProsbis.indexNumber,
    businessProcessName: prosbisName,
  };
  const result = await submitDraftProsbis(payload);
  if (result.status === 200) {
    const modalEditBusinesspro = document.getElementById(
      "modalEditBusinesspro",
    );
    const modalEditbp = bootstrap.Modal.getInstance(modalEditBusinesspro);
    document.getElementById("draftName").value = "";
    const resultMatrix = await lastStateTableMatrix();
    if (resultMatrix) {
      swal({
        title: "SUCCESS",
        icon: "success",
        buttons: false,
        timer: 2500,
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
        if (modalEditbp) {
          modalEditbp.hide();
        }
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
}

// function onSelect(event) {
//   const value = event.target.value;
//   const parentSelect = document.querySelector("#selecttParent");
//   parentSelect.disabled = value === "Choose" || value == 1;

//   console.log("value", value);
// }

// function onCheck(event, commentId) {
//   const isChecked = event.target.checked;
//   const comment = document.getElementById(commentId);
//   comment.disabled = !isChecked;
// }

// end section add notation by column row
