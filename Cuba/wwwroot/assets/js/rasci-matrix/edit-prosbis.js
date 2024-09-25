function handleOpenDetailBp() {
  const modal = new bootstrap.Modal(document.getElementById("modalEdit"));
  modal.show();
  console.log("cek edit");
  const formContent = `
  <div class="col-6">
  <label class="form-label">Draft Name</label>
       <input class="form-control" type="text" placeholder="Draft Name" >
  </div>
  <div class="col-6">
  <label class="form-label">Draft Type</label>
       <input class="form-control" type="text" placeholder="Draft Type" disabled>
  </div>
  <div class="col-12 mt-3 mb-2">
   <h6 class="f-w-600">Business Process Info</h6>
  </div>
  <div class="col-3">
      <div class="mb-3">
          <label class="form-label">Level</label>
          <select class="form-select digits">
              <option>Choose</option>
              <option>L1</option>
              <option>L2</option>
              <option>L3</option>
              <option>L4</option>
              <option>L5</option>
              <option>L6</option>
          </select>
      </div>
  </div>
  <div class="col-9">
      <div class="mb-3">
          <label class="form-label">Parent</label>
          <select class="form-select digits">
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
      <div class="mt-3">
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
               <input class="checkbox_animated" id="checked-r" type="checkbox">
              </label>
            </th>
             <td style="text-align:center">
              <img src="/assets/images/rasci/r.svg" alt="R Icon">
             </td>
            <td>
             <input class="form-control" type="text" placeholder="Type Comment" disabled>
            </td>
        </tr>
        <tr>
            <th scope="row">
              <label class="radio-label" for="checked-body-bp">
               <input class="checkbox_animated" id="checked-a" type="checkbox">
              </label>
            </th>
             <td style="text-align:center">
             <img src="/assets/images/rasci/a.svg" alt="A Icon" style="padding-right:2px">
             </td>
            <td>
               <input class="form-control" type="text" placeholder="Type Comment" disabled>
            </td>
        </tr>
        <tr>
            <th scope="row">
              <label class="radio-label" for="checked-body-bp">
               <input class="checkbox_animated" id="checked-s" type="checkbox">
              </label>
            </th>
             <td style="text-align:center">
             <img src="/assets/images/rasci/s.svg" alt="S Icon" style="padding-right:2px">
             </td>
            <td>
               <input class="form-control" type="text" placeholder="Type Comment" disabled>
            </td>
        </tr>
        <tr>
            <th scope="row">
              <label class="radio-label" for="checked-body-bp">
               <input class="checkbox_animated" id="checked-c" type="checkbox">
              </label>
            </th>
             <td style="text-align:center">
             <img src="/assets/images/rasci/c.svg" alt="C Icon" style="padding-right:2px">
             </td>
            <td>
               <input class="form-control" type="text" placeholder="Type Comment" disabled>
            </td>
        </tr>
        <tr>
            <th scope="row">
              <label class="radio-label" for="checked-body-bp">
               <input class="checkbox_animated" id="checked-i" type="checkbox">
              </label>
            </th>
             <td style="text-align:center">
             <img src="/assets/images/rasci/i.svg" alt="I Icon" style="padding-right:2px">
             </td>
            <td>
               <input class="form-control" type="text" placeholder="Type Comment" disabled>
            </td>
        </tr>
        `;
  document.getElementById("tbl-edit-prosbis-header").innerHTML = theadContent;
  document.getElementById("tbl-edit-prosbis-body").innerHTML = tdBody;
  const bodyContent = document.getElementById("form-content-edit");
  if (bodyContent) {
    bodyContent.innerHTML = formContent;
  }
}
