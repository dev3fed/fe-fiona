function onModalAddBp() {
  const modal = new bootstrap.Modal(document.getElementById("modalAddBp"));
  modal.show();
  const prosbisLevel = getState("prosbisLevel");
  console.log("prosbisLevel", prosbisLevel);

  const formContent = `
    <div class="col-2">
      <div class="mb-3">
        <label class="form-label">Level</label>
        <select class="form-select digits" onclick="onSelect(event)">
          <option>Choose</option>
          ${prosbisLevel.map((opt) => `<option value="${opt.id}">${opt.text}</option>`)}
        </select>
      </div>
    </div>
    <div class="col-10">
      <div class="mb-3">
        <label class="form-label">Parent</label>
        <select class="js-data-example-ajax" id="mySelect2" style="width: 100%"></select>
      </div>
    </div>
    <div class="col-12">
      <div>
        <label class="form-label">Business Process Name</label>
        <textarea class="form-control"></textarea>
      </div>
      <div class="mt-4">
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

  document.getElementById("tbl-add-prosbis-header").innerHTML = theadContent;
  document.getElementById("tbl-add-prosbis-body").innerHTML = tdBody;

  const bodyContent = document.getElementById("form-content");
  if (bodyContent) {
    bodyContent.innerHTML = formContent;
  }

  // Initialize Bootstrap Select
  $(".selectpicker").selectpicker();
  $("#mySelect2").select2({
    allowClear: true,
    ajax: {
      url: `${url_api}/api/Utilities/selection`,
      dataType: "json",
      data: function (params) {
        var query = {
          search: params.term,
          page: params.page || 1,
          type: "prosbis",
          Level: 2,
        };

        // Query parameters will be ?search=[term]&type=public
        return query;
      },
    },
  });
}

function onSelect(event) {
  const value = event.target.value;
  const parentSelect = document.querySelector("#selecttParent");
  parentSelect.disabled = value === "Choose";

  console.log("value", value);
}

function onCheck(event, commentId) {
  const isChecked = event.target.checked;
  const comment = document.getElementById(commentId);
  comment.disabled = !isChecked;
}
