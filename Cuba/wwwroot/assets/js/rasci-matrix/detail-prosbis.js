function detailsProsbis() {
  const toalJob = `<p>Total Job : 5 |
  <img src="/assets/images/rasci/r.svg" alt="R Icon" style="margin-top:-4px;padding-left:5px"><label style="padding-left:5px">0</label> 
  <img src="/assets/images/rasci/a.svg" alt="A Icon" style="margin-top:-4px;padding-left:5px"><label style="padding-left:5px">0</label> 
  <img src="/assets/images/rasci/s.svg" alt="S Icon" style="margin-top:-4px;padding-left:5px"><label style="padding-left:5px">0</label> 
  <img src="/assets/images/rasci/c.svg" alt="C Icon" style="margin-top:-4px;padding-left:5px"><label style="padding-left:5px">0</label> 
  <img src="/assets/images/rasci/i.svg" alt="I Icon" style="margin-top:-4px;padding-left:5px"><label style="padding-left:5px">0</label> 
  <img src="/assets/images/rasci/comment.svg" alt="Comment Icon" style="margin-top:-4px;padding-left:5px"><label style="padding-left:5px">0</label>
  </p>`;
  theadContent = `<tr>
          <th scope="col" style="width: 50px;text-align:center">
          No 
          </th>
          <th scope="col" style="width: 80px">Job Title</th>
          <th scope="col" style="width: 80px">Directorate</th>
          <th scope="col">Division</th>
          <th scope="col">Work Unit</th>
          <th scope="col">RASCI Notation</th>
        </tr>`;
  bodyContent = `<tr>
        <th scope="row">
        </th>
        <td>Mark</td>
        <td>Otto</td>
        <td>Otto</td>
        <td>Otto</td>
        <td>Otto</td>
    </tr>
    <tr>
        <th scope="row">
        </th>
        <td>Mark</td>
        <td>Otto</td>
        <td>Otto</td>
        <td>Otto</td>
        <td>Otto</td>
    </tr>
    <tr>
      <th scope="row">
      </th>
      <td>Mark</td>
      <td>Otto</td>
      <td>Otto</td>
      <td>Otto</td>
      <td>Otto</td>
    </tr>`;
  document.getElementById("prosbis-details-header").innerHTML = theadContent;
  document.getElementById("prosbis-details-body").innerHTML = bodyContent;
  document.getElementById("total-job").innerHTML = toalJob;
  const modal = new bootstrap.Modal(
    document.getElementById("modalBusinessPro"),
  );
  modal.show();
}
