// start section add notation by column row
function openModalEditBusinesspro() {
  const modal = new bootstrap.Modal(
    document.getElementById("modalEditBusinesspro"),
  );
  modal.show();
  const prosbisLevel = getState("prosbisLevel");
  console.log("prosbisLevel", prosbisLevel);

  const formContent = `
    <div class="col-3">
      <div class="mb-3">
        <label class="form-label">Level</label>
        <select class="form-select digits" disabled>
          <option>Choose</option>
          ${prosbisLevel.map(
            (opt) => `<option value="${opt.id}">${opt.text}</option>`,
          )}
        </select>
      </div>
    </div>
    <div class="col-9">
      <div class="mb-3">
        <label class="form-label">Parent</label>
        <select class="form-select digits" name="parentId" id="parentId" disabled>
        </select>
      </div>
    </div>
     <div class="col-12">
      <div>
        <label class="form-label">Business Process Name</label>
        <textarea class="form-control"></textarea>
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
