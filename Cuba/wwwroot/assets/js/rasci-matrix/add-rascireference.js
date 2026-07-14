// start section edit commentar & notation pada modal add rasci reference
async function handleEditComment(data) {
  try {
    // console.log("data", data);
    const dataChangeNotasi = getState("dataChangeNotasi");
    setState("editRasciNotation", data);
    // console.log("dataChangeNotasi", dataChangeNotasi);
    openModalEditRascinotation(dataChangeNotasi, data);
  } catch (error) {}
}
async function handleDeleteProsbis(param) {
  try {
    const listSelectedProsbisref = getState("listSelectedProsbisref") || [];
    const deleted = listSelectedProsbisref.filter((item) => item.indexNumber !== param.indexNumber);
    const checkbox = document.getElementById(`checked-prosbisref-${param.indexNumber}`);
    if (checkbox) {
      checkbox.checked = false;
    }
    setState("listSelectedProsbisref", deleted);
    cardSelectedProsbisref();
  } catch (error) {}
}

async function handleDeleteSummerProsbis(param) {
  try {
    const listSelectedProsbisref = getState("listSelectedProsbisref") || [];
    const deleted = listSelectedProsbisref.filter((item) => item.indexNumber !== param.indexNumber);
    const checkbox = document.getElementById(`checked-prosbisref-${param.indexNumber}`);
    if (checkbox) {
      checkbox.checked = false;
    }
    setState("listSelectedProsbisref", deleted);
    cardSelectedSummerProsbisref();
  } catch (error) {}
}
// end section edit commentar & notation pada modal add rasci reference

async function openModalEditRascinotation(result, dataProsbis) {
  try {
    const modal = new bootstrap.Modal(document.getElementById("modalNotationRef"));
    modal.show();
    const rasciNotation = getState("rasciNotation") || [];
    const notation = dataProsbis.rasciNotation.map((item) => {
      return {
        rasciCode: item.notation,
        comment: item.comment,
      };
    });
    const formContent = `
          <div class="col-12">
            <div >
              <label class="form-label" style="width:19%">RASCI Matrix Draft</label>
              <label> : </label>
            <b class="form-label">${result.draftName}</b>
            </div>
          </div>
          <div class="col-12">
            <div >
                <label class="form-label" style="width:19%">Position</label>
                 <label> : </label>
            <b class="form-label">${result.jobName || "-"}</b>
            </div>
          </div>
          <div class="col-12">
            <div >
                <label class="form-label" style="width:19%">Business Process</label>
                 <label> : </label>
            <b class="form-label">${dataProsbis.indexNumber} - ${dataProsbis.description}</b>
            </div>
          </div>
          <div class="col-12">
            <div >
                <label class="form-label" style="width:19%">Reference From</label>
                 <label> : </label>
            <b class="form-label">${dataProsbis.jobRefName}</b>
            </div>
          </div>
        `;

    theadContent = `<tr>
            <th scope="col" style="width: 50px">Check</th>
            <th scope="col" style="width: 150px;text-align:center">RASCI Notation</th>
            <th scope="col">Comment (Optional)</th>
            </tr>`;

    const output = mergeRasciData(notation, rasciNotation);
    setState("rasciNotation", output);
    tblChangeNotationRef(output);
    document.getElementById("tbl-notatationref-header").innerHTML = theadContent;

    const bodyContent = document.getElementById("form-notatationref");
    if (bodyContent) {
      bodyContent.innerHTML = formContent;
    }

    // Initialize Bootstrap Select
    $(".selectpicker").selectpicker();
  } catch (error) {}
}

async function cardSelectedProsbisref() {
  const listSelectedProsbisref = getState("listSelectedProsbisref");
  const elementSelectedproref = document.getElementById("selectedBisproref");
  elementSelectedproref.innerHTML = ` 
    <label class="form-label">Selected Business Process</label>
       <div class="card-tblbusiness" style=" max-height: 300px;">
       </div>`;
  if (listSelectedProsbisref.length > 0) {
    const tblProsbisref = `
      <label class="form-label">Selected Business Process (${listSelectedProsbisref.length})</label>
       <div class="card-tblbusiness" style=" max-height: 300px;">
           <div class="table-responsive scrollable mt-2" style=" max-height: 260px;">
               <table class="table tbl-border-notation">
                   <thead>
                   <tr>
                       <th scope="col" style="width: 50px">Level</th>
                       <th scope="col" style="width: 80px;text-align:center">Index</th>
                       <th scope="col" >Business Process</th>
                       <th scope="col" style="width: 120px;text-align:center">RASCI</th>
                       <th scope="col" style="width: 100px;text-align:center">Action</th>
                   </tr>
                   </thead>
                   <tbody>
                 <tr>
                 ${listSelectedProsbisref
                   .map((item, index) => {
                     let rasciIcons = "";
                     let comments = [];
                     item.rasciNotation.forEach((value) => {
                       switch (value.notation) {
                         case "R":
                           rasciIcons += `<img src="/assets/images/rasci/r.svg" alt="R Icon" style="padding-right:2px">`;
                           break;
                         case "A":
                           rasciIcons += `<img src="/assets/images/rasci/a.svg" alt="A Icon" style="padding-right:2px">`;
                           break;
                         case "S":
                           rasciIcons += `<img src="/assets/images/rasci/s.svg" alt="S Icon" style="padding-right:2px">`;
                           break;
                         case "C":
                           rasciIcons += `<img src="/assets/images/rasci/c.svg" alt="C Icon" style="padding-right:2px">`;
                           break;
                         case "I":
                           rasciIcons += `<img src="/assets/images/rasci/i.svg" alt="I Icon" style="padding-right:2px">`;
                           break;
                       }

                       if (value.comment) {
                         comments.push(`<li>${value.notation}: ${value.comment}</li>`);
                       }
                     });

                     if (comments.length > 0) {
                       const commentTooltip = `<ul>${comments.join("")}</ul>`;
                       rasciIcons += `<img src="/assets/images/rasci/comment.svg" alt="Comment Icon" style="padding-right:2px" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-html="true" title="${commentTooltip}">`;
                     }
                     return `
                     <td style="text-align:center">
                       ${item.level}
                     </td>
                     <td style="text-align:center">
                     ${item.indexNumber}
                     </td>
                     <td>
                     ${item.description}
                     </td>
                     <td>
                         <div class="rasci-container">
                           <div class="rasci-icons">${rasciIcons}</div>
                         </div>
                     </td>
                      <td style="text-align:center">
                        <img src="/assets/images/rasci/danger-circle.svg" alt="Filter Icon"
                            class="example-popover" style="margin-top:-2px;height: 20px;" data-bs-toggle="tooltip"
                            data-bs-placement="top" title="Add/Edit Comment" >
                        <button class="btn btn-outline-light btn-small-icon" type="button" onclick="handleEditComment(${JSON.stringify(
                          item,
                        ).replace(/"/g, "&quot;")})">
                            <img src="/assets/images/rasci/icon_pencil.svg" alt="Edit Icon">
                        </button>
                         <button class="btn btn-outline-danger btn-small-icon" type="button" onclick="handleDeleteProsbis(${JSON.stringify(
                           item,
                         ).replace(/"/g, "&quot;")})">
                          <img src="/assets/images/rasci/icon_delete.svg" alt="Delete Icon" class="icon-svg">
                        </button>
                     </td>
                 </tr>
                   `;
                   })
                   .join("")}
                 </tbody>
               </table>
           </div>
       </div>
     `;
    elementSelectedproref.innerHTML = tblProsbisref;
  } else {
    elementSelectedproref.innerHTML = ` 
    <label class="form-label">Selected Business Process</label>
       <div class="card-tblbusiness" style=" max-height: 300px;">
       </div>`;
  }
  initializeTooltips();
}
async function cardSelectedSummerProsbisref() {
  const listSelectedProsbisref = getState("listSelectedProsbisref");
  const elementSelectedproref = document.getElementById("selectedBisproSummerRef");
  elementSelectedproref.innerHTML = ` 
    <label class="form-label">Selected Business Process</label>
       <div class="card-tblbusiness" style=" max-height: 300px;">
       </div>`;
  if (listSelectedProsbisref.length > 0) {
    const tblProsbisref = `
      <label class="form-label">Selected Business Process (${listSelectedProsbisref.length})</label>
       <div class="card-tblbusiness" style=" max-height: 300px;">
           <div class="table-responsive scrollable mt-2" style=" max-height: 260px;">
               <table class="table tbl-border-notation">
                   <thead>
                   <tr>
                       <th scope="col" style="width: 50px">Level</th>
                       <th scope="col" style="width: 80px;text-align:center">Index</th>
                       <th scope="col" >Business Process</th>
                       <th scope="col" style="width: 120px;text-align:center">RASCI</th>
                       <th scope="col" style="width: 100px;text-align:center">Action</th>
                   </tr>
                   </thead>
                   <tbody>
                 <tr>
                 ${listSelectedProsbisref
                   .map((item, index) => {
                     let rasciIcons = "";
                     let comments = [];
                     item.rasciNotation.forEach((value) => {
                       switch (value.notation) {
                         case "R":
                           rasciIcons += `<img src="/assets/images/rasci/r.svg" alt="R Icon" style="padding-right:2px">`;
                           break;
                         case "A":
                           rasciIcons += `<img src="/assets/images/rasci/a.svg" alt="A Icon" style="padding-right:2px">`;
                           break;
                         case "S":
                           rasciIcons += `<img src="/assets/images/rasci/s.svg" alt="S Icon" style="padding-right:2px">`;
                           break;
                         case "C":
                           rasciIcons += `<img src="/assets/images/rasci/c.svg" alt="C Icon" style="padding-right:2px">`;
                           break;
                         case "I":
                           rasciIcons += `<img src="/assets/images/rasci/i.svg" alt="I Icon" style="padding-right:2px">`;
                           break;
                       }

                       if (value.comment) {
                         comments.push(`<li>${value.notation}: ${value.comment}</li>`);
                       }
                     });

                     if (comments.length > 0) {
                       const commentTooltip = `<ul>${comments.join("")}</ul>`;
                       rasciIcons += `<img src="/assets/images/rasci/comment.svg" alt="Comment Icon" style="padding-right:2px" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-html="true" title="${commentTooltip}">`;
                     }
                     return `
                     <td style="text-align:center">
                       ${item.level}
                     </td>
                     <td style="text-align:center">
                     ${item.indexNumber}
                     </td>
                     <td>
                     ${item.description}
                     </td>
                     <td>
                         <div class="rasci-container">
                           <div class="rasci-icons">${rasciIcons}</div>
                         </div>
                     </td>
                      <td style="text-align:center">
                        <img src="/assets/images/rasci/danger-circle.svg" alt="Filter Icon"
                            class="example-popover" style="margin-top:-2px;height: 20px;" data-bs-toggle="tooltip"
                            data-bs-placement="top" title="Add/Edit Comment" >
                        <button class="btn btn-outline-light btn-small-icon" type="button" onclick="handleEditComment(${JSON.stringify(
                          item,
                        ).replace(/"/g, "&quot;")})">
                            <img src="/assets/images/rasci/icon_pencil.svg" alt="Edit Icon">
                        </button>
                         <button class="btn btn-outline-danger btn-small-icon" type="button" onclick="handleDeleteSummerProsbis(${JSON.stringify(
                           item,
                         ).replace(/"/g, "&quot;")})">
                          <img src="/assets/images/rasci/icon_delete.svg" alt="Delete Icon" class="icon-svg">
                        </button>
                     </td>
                 </tr>
                   `;
                   })
                   .join("")}
                 </tbody>
               </table>
           </div>
       </div>
     `;
    elementSelectedproref.innerHTML = tblProsbisref;
  } else {
    elementSelectedproref.innerHTML = ` 
    <label class="form-label">Selected Business Process</label>
       <div class="card-tblbusiness" style=" max-height: 300px;">
       </div>`;
  }
  initializeTooltips();
}
function tblChangeNotationRef(rasciNotation) {
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
          oninput="updateComment('${letter.rasciCode}', this.value)">
      </td>
    </tr>
  `,
    )
    .join("");
  let tdBody = rasciRows;
  document.getElementById("tbl-notatationref-body").innerHTML = tdBody;
}

async function saveNotationRef() {
  const rasciNotation = getState("rasciNotation") || [];
  const listSelectedProsbisref = getState("listSelectedProsbisref");
  const editRasciNotation = getState("editRasciNotation");
  const dataChangeNotasi = getState("dataChangeNotasi");
  const selectedRasciNotation = rasciNotation.filter((item) => item.isChecked === true);
  const output = selectedRasciNotation.map((item) => {
    return {
      notation: item.rasciCode,
      comment: item.comment,
    };
  });
  const updateData = { ...editRasciNotation, rasciNotation: output };
  setState("editRasciNotation", updateData);
  const updateList = updateListSelectedProsbisref(listSelectedProsbisref, updateData);
  setState("listSelectedProsbisref", updateList);
  const updatePayload = updateBusProsMapped(dataChangeNotasi, updateData);
  if (updateList.length > 0) {
    const modalNotationRef = document.getElementById("modalNotationRef");
    const modal = bootstrap.Modal.getInstance(modalNotationRef);
    modal.hide();
    setState("dataChangeNotasi", updatePayload);
    backChangeNotationRow();
    cardSelectedProsbisref();
  }
}

function updateListSelectedProsbisref(listSelectedProsbisref, update) {
  return listSelectedProsbisref.map((item) => {
    if (item.indexNumber === update.indexNumber) {
      return {
        ...item,
        rasciNotation: update.rasciNotation,
      };
    }
    return item;
  });
}

function updateBusProsMapped(dataChangeNotasi, updateData) {
  return {
    ...dataChangeNotasi,
    busProsMapped: dataChangeNotasi.busProsMapped.map((item) => {
      if (item.parentId === updateData.indexNumber) {
        return {
          ...item,
          rasciNotation: updateData.rasciNotation.map((notation) => ({
            rasciCode: notation.notation, // Ubah notation ke rasciCode
            comment: notation.comment,
            isChecked: true, // Asumsikan true karena ada di update
          })),
        };
      }
      return item;
    }),
  };
}
