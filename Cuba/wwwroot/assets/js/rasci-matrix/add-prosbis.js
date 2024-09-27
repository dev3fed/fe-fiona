function onModalAddBp() {
  const modal = new bootstrap.Modal(document.getElementById("modalAddBp"));
  modal.show();

  const formContent = `
  <div class="col-3">
      <div class="mb-3">
          <label class="form-label">Level</label>
          <select class="form-select digits" onclick="onSelect(event)">
              <option>Choose</option>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
              <option>6</option>
          </select>
      </div>
  </div>
  <div class="col-9">
      <div class="mb-3">
          <label class="form-label">Parent</label>
          <select class="form-select digits" id="selecttParent" disabled> 
              <option>Choose</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
          </select>
      </div>
  </div>
  <div class="col-12">
      <div>
          <label class="form-label">Business Process Name</label>
          <textarea class="form-control"></textarea>
      </div>
      <div class="mt-4">
          <label class="form-label">Job</label>
           <select class="form-select digits"> 
              <option>Choose</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
          </select>
      </div>
  </div>`;
  theadContent = `<tr>
        <th scope="col" style="width: 50px">
        Check
        </th>
        <th scope="col" style="width: 150px;text-align:center">RASCI Notation</th>
        <th scope="col">Comment (Optional)</th>
        </tr>`;
  tdBody = `
        <tr>
            <th scope="row">
              <label class="radio-label" for="checked-body-bp">
               <input class="checkbox_animated" id="checked-r" type="checkbox" onclick="onCheckR(event)">
              </label>
            </th>
             <td style="text-align:center">
              <img src="/assets/images/rasci/r.svg" alt="R Icon">
             </td>
            <td>
             <input class="form-control" type="text" placeholder="Type Comment" id="commentR" disabled>
            </td>
        </tr>
        <tr>
            <th scope="row">
              <label class="radio-label" for="checked-body-bp">
               <input class="checkbox_animated" id="checked-a" type="checkbox" onclick="onCheckA(event)">
              </label>
            </th>
             <td style="text-align:center">
             <img src="/assets/images/rasci/a.svg" alt="A Icon" style="padding-right:2px">
             </td>
            <td>
               <input class="form-control" type="text" placeholder="Type Comment" id="commentA" disabled>
            </td>
        </tr>
        <tr>
            <th scope="row">
              <label class="radio-label" for="checked-body-bp">
               <input class="checkbox_animated" id="checked-s" type="checkbox" onclick="onCheckS(event)">
              </label>
            </th>
             <td style="text-align:center">
             <img src="/assets/images/rasci/s.svg" alt="S Icon" style="padding-right:2px">
             </td>
            <td>
               <input class="form-control" type="text" placeholder="Type Comment" id="commentS" disabled> 
            </td>
        </tr>
        <tr>
            <th scope="row">
              <label class="radio-label" for="checked-body-bp">
               <input class="checkbox_animated" id="checked-c" type="checkbox" onclick="onCheckC(event)">
              </label>
            </th>
             <td style="text-align:center">
             <img src="/assets/images/rasci/c.svg" alt="C Icon" style="padding-right:2px">
             </td>
            <td>
               <input class="form-control" type="text" placeholder="Type Comment" id="commentC" disabled>
            </td>
        </tr>
        <tr>
            <th scope="row">
              <label class="radio-label" for="checked-body-bp">
               <input class="checkbox_animated" id="checked-i" type="checkbox" onclick="onCheckI(event)">
              </label>
            </th>
             <td style="text-align:center">
             <img src="/assets/images/rasci/i.svg" alt="I Icon" style="padding-right:2px">
             </td>
            <td>
               <input class="form-control" type="text" placeholder="Type Comment" id="commentI" disabled>
            </td>
        </tr>
        `;
  document.getElementById("tbl-add-prosbis-header").innerHTML = theadContent;
  document.getElementById("tbl-add-prosbis-body").innerHTML = tdBody;
  const bodyContent = document.getElementById("form-content");
  if (bodyContent) {
    bodyContent.innerHTML = formContent;
  }
  $(document).ready(function () {
    $("#mySelect").select2({
      placeholder: "Select an option",
      allowClear: true,
    });
  });
}

function onSelect(event) {
  const value = event.target.value;
  const parentSelect = document.querySelector("#selecttParent");
  if (value != "Choose") {
    parentSelect.disabled = false;
  } else {
    parentSelect.disabled = true;
  }
}
function onCheckR(event) {
  const isChecked = event.target.checked;
  const comment = document.getElementById("commentR");
  comment.disabled = !isChecked;
}

function onCheckA(event) {
  const isChecked = event.target.checked;
  const comment = document.getElementById("commentA");
  comment.disabled = !isChecked;
}

function onCheckS(event) {
  const isChecked = event.target.checked;
  const comment = document.getElementById("commentS");
  comment.disabled = !isChecked;
}

function onCheckC(event) {
  const isChecked = event.target.checked;
  const comment = document.getElementById("commentC");
  comment.disabled = !isChecked;
}

function onCheckI(event) {
  const isChecked = event.target.checked;
  const comment = document.getElementById("commentI");
  comment.disabled = !isChecked;
}
