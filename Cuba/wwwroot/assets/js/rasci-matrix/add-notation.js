// start section add notation by column row
function onModalAddNotation() {
  const modal = new bootstrap.Modal(document.getElementById("modalAddNotation"));
  console.log("modal", modal);
  modal.show();
  const prosbisLevel = getState("prosbisLevel");
  const rasciNotation = getState("rasciNotation") || [];

  const formContent = `
      <div class="col-12">
      <div>
        <label class="form-label">RASCI Matrix Draft Name</label>
        <select class="form-select digits" disabled>
          <option>Choose</option>
        </select>
      </div>
      <hr style="margin-top:25px;margin-bottom:20px"/>
    </div>
    <div class="col-12">
      <div class="mb-2">
        <label class="form-label">Position</label>
         <select class="form-select digits" name="jobIdNotation" id="jobIdNotation">
    </select>
      </div>
    </div>
    <div class="col-12">
      <div class="col mb-3">
        <div class="m-t-15 m-checkbox-inline custom-radio-ml">
            <div class="form-check form-check-inline radio radio-primary">
                <input class="form-check-input" id="radioNonreference" type="radio" name="optradio" value="nonReference" onchange="handleRadioChange(event)" checked>
                <label class="form-check-label mb-0" for="radioNonreference">Add RASCI Notation</label>
            </div>
            <div class="form-check form-check-inline radio radio-primary">
                <input class="form-check-input" id="radioReference" type="radio" name="optradio" value="reference"  onchange="handleRadioChange(event)">
                <label class="form-check-label mb-0" for="radioReference">Add RASCI Notation from reference</label>
            </div>
        </div>
      </div>
    </div>
`;

  // const bodySelectBusiness = `
  //   <div class="row">
  //     <div class="col-3">
  //       <select class="form-select digits">
  //         <option>Level</option>
  //         ${prosbisLevel.map((opt) => `<option value="${opt.id}">${opt.text}</option>`)}
  //       </select>
  //     </div>
  //     <div class="col-9">
  //       <select class="form-select digits"  disabled>
  //         <option>Choose</option>
  //         <option>2</option>
  //         <option>3</option>
  //         <option>4</option>
  //         <option>5</option>
  //       </select>
  //     </div>
  //   </div>
  //   `;
  // theadContent = `<tr>
  //       <th scope="col" style="width: 50px">Check</th>
  //       <th scope="col" style="width: 120px;text-align:center">RASCI Notation</th>
  //       <th scope="col">Comment (Optional)</th>
  //       </tr>`;

  tblRasciNotation(rasciNotation);
  // document.getElementById("select-business").innerHTML = bodySelectBusiness;
  // document.getElementById("tbl-notation-header").innerHTML = theadContent;

  const bodyContent = document.getElementById("form-notation");
  if (bodyContent) {
    bodyContent.innerHTML = formContent;
  }

  // Initialize Bootstrap Select
  $(".selectpicker").selectpicker();
  selectJobNotation();
}

function selectJobNotation() {
  const dataProsbis = getState("insertProsbis");
  $("#jobIdNotation")
    .select2({
      dropdownParent: $("#modalAddNotation"),
      placeholder: "Choose",
      allowClear: true,
      delay: 250,
      ajax: {
        url: `${url_api}/api/Utilities/selection`,
        dataType: "json",
        data: function (params) {
          return {
            search: params.term || "",
            page: params.page || 1,
            type: "job",
            draftId: dataProsbis.draftId,
          };
        },
        processResults: function (data) {
          if (data && data.data) {
            return {
              results: data.data.res,
              pagination: {
                more: data.data.pagination.more,
              },
            };
          }
          return { results: [] };
        },
        cache: true,
      },
      templateResult: function (item) {
        return item.text;
      },
    })
    .on("select2:open", function () {
      page = 1;
    });
}

const handleRadioChange = (event) => {
  const value = event.target.value;
  if (value === "reference") {
    const elementPosref = document.getElementById("posref");
    const elementBispro = document.getElementById("bispro");
    const elementSelectedBispro = document.getElementById("selectedBispro");
    elementPosref.style.display = "block";
    elementBispro.style.display = "none";
    elementSelectedBispro.style.display = "none";
  } else if (value === "nonReference") {
    const elementPosref = document.getElementById("posref");
    const elementBispro = document.getElementById("bispro");
    const elementSelectedBispro = document.getElementById("selectedBispro");
    elementPosref.style.display = "none";
    elementBispro.style.display = "block";
    elementSelectedBispro.style.display = "block";
  }
};
const tblRasciNotation = (rasciNotation) => {
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
      <td style="text-align:center">
        <img src="/assets/images/rasci/${letter.rasciCode.toLowerCase()}.svg" alt="${
        letter.rasciCode
      } Icon" style="padding-right:2px">
      </td>
      <td>
        <input class="form-control" type="text" placeholder="Type Comment" id="comment${letter.rasciCode}" 
               value="${letter.comment || ""}" 
               ${!letter.isChecked ? "disabled" : ""} 
               oninput="updateRasciComment('${letter.rasciCode}', this.value)">
      </td>
    </tr>
`,
    )
    .join("");
  tdBody = rasciRows;
  document.getElementById("tbl-notation-body").innerHTML = tdBody;
};

function updateRasciComment(rasciCode, value) {
  const rasciNotation = getState("rasciNotation");
  const updatedRasciNotation = rasciNotation.map((letter) => {
    if (letter.rasciCode === rasciCode) {
      return { ...letter, comment: value };
    }
    return letter;
  });

  setState("rasciNotation", updatedRasciNotation);
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
  const modal = new bootstrap.Modal(document.getElementById("modalNotationRow"));
  modal.show();
  const prosbisLevel = getState("prosbisLevel");
  console.log("prosbisLevel", prosbisLevel);

  const formContent = `
      <div class="col-12">
        <div >
          <label class="form-label" style="width:19%">RASCI Matrix Draft</label>
          <label> : </label>
        <b class="form-label">RASCI Evaluasi Struktur Organisasi 2025 versi Citra</b>
        </div>
      </div>
      <div class="col-12">
        <div >
            <label class="form-label" style="width:19%">Position</label>
             <label> : </label>
        <b class="form-label">321405689 - Direktur Keuangan</b>
        </div>
      </div>
      <div class="col-12">
        <div >
            <label class="form-label" style="width:19%">Business Process</label>
             <label> : </label>
        <b class="form-label">Market, Sell, and Commercialization Products and Services</b>
        </div>
      </div>
    `;

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
