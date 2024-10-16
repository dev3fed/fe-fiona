// start section add notation by column row
function onModalAddNotation() {
  const modal = new bootstrap.Modal(
    document.getElementById("modalAddNotation"),
  );
  modal.show();
  const prosbisLevel = getState("prosbisLevel");
  console.log("prosbisLevel", prosbisLevel);

  const formContent = `
      <div class="col-12">
      <div class="mb-2">
        <label class="form-label">Job</label>
        <select class="selectpicker form-control digits" data-live-search="true">
          <option>Choose</option>
          <option>Option 1</option>
          <option>Option 2</option>
          <option>Option 3</option>
          <option>Option 4</option>
          <option>Option 5</option>
        </select>
      </div>
    </div>
    <div class="col-3">
      <div class="mt-2">
        <label class="form-label">Bussiness Process Level</label>
        <select class="form-select digits">
          <option>Choose</option>
          ${prosbisLevel.map(
            (opt) => `<option value="${opt.id}">${opt.text}</option>`,
          )}
        </select>
      </div>
    </div>
    <div class="col-9">
      <div class="mt-2">
        <label class="form-label">Business Process</label>
        <select class="form-select digits"  disabled>
          <option>Choose</option>
          <option>2</option>
          <option>3</option>
          <option>4</option>
          <option>5</option>
        </select>
      </div>
    </div>`;

  theadContent = `<tr>
        <th scope="col" style="width: 50px">Check</th>
        <th scope="col" style="width: 150px;text-align:center">RASCI Notation</th>
        <th scope="col">Comment (Optional)</th>
        </tr>`;

  const rasciRows = ["R", "A", "S", "C", "I"]
    .map(
      (letter) => `
    <tr>
      <th scope="row">
        <label class="radio-label" for="checked-body-bp">
          <input class="checkbox_animated" id="checked-${letter.toLowerCase()}" type="checkbox" onclick="onCheck(event, 'comment${letter}')">
        </label>
      </th>
      <td style="text-align:center">
        <img src="/assets/images/rasci/${letter.toLowerCase()}.svg" alt="${letter} Icon" style="padding-right:2px">
      </td>
      <td>
        <input class="form-control" type="text" placeholder="Type Comment" id="comment${letter}" disabled>
      </td>
    </tr>
  `,
    )
    .join("");

  tdBody = rasciRows;

  document.getElementById("tbl-notation-header").innerHTML = theadContent;
  document.getElementById("tbl-notation-body").innerHTML = tdBody;

  const bodyContent = document.getElementById("form-notation");
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

// start section add notation by column row

// start section add notation by column row
async function openModalNotRow(jobId, prosbisId) {
  console.log("cek", jobId, prosbisId);
  const modal = new bootstrap.Modal(
    document.getElementById("modalNotationRow"),
  );
  modal.show();
  const prosbisLevel = getState("prosbisLevel");
  console.log("prosbisLevel", prosbisLevel);

  const formContent = `
      <div class="col-12">
      <div class="mb-2">
        <label class="form-label">Job</label>
       <input class="form-control" type="text" placeholder="Type Comment"  disabled>
      </div>
    </div>
    <div class="col-3">
      <div class="mt-2">
        <label class="form-label">Bussiness Process Level</label>
         <input class="form-control" type="text" placeholder="Type Comment"  disabled>
      </div>
    </div>
    <div class="col-9">
      <div class="mt-2">
        <label class="form-label">Business Process</label>
         <input class="form-control" type="text" placeholder="Type Comment"  disabled>
      </div>
    </div>`;

  theadContent = `<tr>
        <th scope="col" style="width: 50px">Check</th>
        <th scope="col" style="width: 150px;text-align:center">RASCI Notation</th>
        <th scope="col">Comment (Optional)</th>
        </tr>`;

  const rasciRows = ["R", "A", "S", "C", "I"]
    .map(
      (letter) => `
    <tr>
      <th scope="row">
        <label class="radio-label" for="checked-body-bp">
          <input class="checkbox_animated" id="checked-${letter.toLowerCase()}" type="checkbox" onclick="onCheck(event, 'comment${letter}')">
        </label>
      </th>
      <td style="text-align:center">
        <img src="/assets/images/rasci/${letter.toLowerCase()}.svg" alt="${letter} Icon" style="padding-right:2px">
      </td>
      <td>
        <input class="form-control" type="text" placeholder="Type Comment" id="comment${letter}" disabled>
      </td>
    </tr>
  `,
    )
    .join("");

  tdBody = rasciRows;

  document.getElementById("tbl-notatrow-header").innerHTML = theadContent;
  document.getElementById("tbl-notatrow-body").innerHTML = tdBody;

  const bodyContent = document.getElementById("form-notatrow");
  if (bodyContent) {
    bodyContent.innerHTML = formContent;
  }

  // Initialize Bootstrap Select
  $(".selectpicker").selectpicker();
}
// end section add notation by column row
