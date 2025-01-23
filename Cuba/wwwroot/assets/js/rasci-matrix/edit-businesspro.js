// start section add notation by column row
function openModalEditBusinesspro() {
  const modal = new bootstrap.Modal(document.getElementById("modalEditBusinesspro"));
  modal.show();
  const prosbisLevel = getState("prosbisLevel");
  console.log("prosbisLevel", prosbisLevel);

  const formContent = `
      <div class="col-12">
        <div >
          <label class="form-label" style="width:25%">RASCI Matrix Draft</label>
          <label> : </label>
        <b class="form-label">RASCI Evaluasi Struktur Organisasi 2025 versi Citra</b>
        </div>
      </div>
      <div class="col-12">
        <div >
            <label class="form-label" style="width:25%">Business Process Parent</label>
             <label> : </label>
        <b class="form-label">321405689 - Direktur Keuangan</b>
        </div>
      </div>
      <div class="col-12">
        <div >
            <label class="form-label" style="width:25%">Business Process Level</label>
             <label> : </label>
        <b class="form-label">Market, Sell, and Commercialization Products and Services</b>
        </div>
      </div>
       <div class="col-12">
        <div >
            <label class="form-label" style="width:25%">Business Process Index</label>
             <label> : </label>
        <b class="form-label">Market, Sell, and Commercialization Products and Services</b>
        </div>
      </div>
     <div class="col-12 mt-3">
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
