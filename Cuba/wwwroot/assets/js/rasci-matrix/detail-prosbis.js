const detailsProsbis = () => {
  layoutTabProsbis();
  layoutTabHierarchy();
  layoutTabCompetency();
  const modal = new bootstrap.Modal(document.getElementById("modalBusinessPro"));
  modal.show();
};

const layoutTabProsbis = () => {
  const totalJob = `<p>Total Job : 5 |
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
  document.getElementById("total-job").innerHTML = totalJob;
};
const layoutTabHierarchy = () => {
  theadContentHierarchy = `<tr>
  <th scope="col" style="width: 80px">Level</th>
  <th scope="col" style="width: 120px">Index</th>
  <th scope="col">Business Process</th>
</tr>`;
  bodyContentHierarchy = `<tr>
<td>Mark</td>
<td>Otto</td>
<td>Otto</td>
</tr>`;
  document.getElementById("prosbis-hierarchy-header").innerHTML = theadContentHierarchy;
  document.getElementById("prosbis-hierarchy-body").innerHTML = bodyContentHierarchy;
};

const layoutTabCompetency = () => {
  theadContentCompetency = `<tr>
  <th scope="col" style="width: 50px">No</th>
  <th scope="col" style="width: 240px">Skill Group</th>
  <th scope="col" style="width: 240px">Sub Skill Group</th>
  <th scope="col">Competency</th>
</tr>`;
  bodyContentCompetency = `<tr>
<td></td>
<td>Otto</td>
<td>Otto</td>
<td>Otto</td>
</tr>`;
  document.getElementById("prosbis-competencies-header").innerHTML = theadContentCompetency;
  document.getElementById("prosbis-competencies-body").innerHTML = bodyContentCompetency;
};
