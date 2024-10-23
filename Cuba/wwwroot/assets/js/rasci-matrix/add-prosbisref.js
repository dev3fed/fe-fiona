function onModalAddBpref() {
  const modal = new bootstrap.Modal(document.getElementById("modalAddBpref"));
  modal.show();
  // const prosbisLevel = getState("prosbisLevel");
  const formContent = `
    <div class="col-12">
        <div class="mb-3">
          <label class="form-label">Job Title</label>
          <select class="form-select digits">
          </select>
        </div>
    </div>
    <div class="col-12">
      <div>
          <label class="form-label">Job Reference</label>
          <select class="form-select digits">
          </select>
      </div>
    </div>`;

  theadContent = `<tr>
        <th scope="col" style="width: 50px"></th>
        <th scope="col" style="width: 100px">Level</th>
        <th scope="col" style="width: 100px">Index</th>
        <th scope="col" style="width: 250px">Business Process</th>
        <th scope="col" style="width: 120px;text-align:center">RASCI Notation</th>
        <th scope="col" style="width: 50px;text-align:center" >Action</th>
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
      <td></td>
      <td></td>
      <td></td>

      <td style="text-align:center">
        <img src="/assets/images/rasci/${letter.rasciCode.toLowerCase()}.svg" alt="${
        letter.rasciCode
      } Icon" style="padding-right:2px">
      </td>
      <td style="text-align: center; vertical-align: middle;">
        <button class="btn btn-outline-light" type="button">
          <i class="icon-marker-alt"></i>
            Edit
        </button>
      </td>
    </tr>
`,
    )
    .join("");
  tdBody = rasciRows;

  document.getElementById("tbl-prosbisref-header").innerHTML = theadContent;
  document.getElementById("tbl-prosbisref-body").innerHTML = tdBody;

  const bodyContent = document.getElementById("form-bpref");
  if (bodyContent) {
    bodyContent.innerHTML = formContent;
  }

  // Initialize Bootstrap Select
  $(".selectpicker").selectpicker();
  // updateSelect2ByProsbis();
  // updateSelect2ByJob();
}
