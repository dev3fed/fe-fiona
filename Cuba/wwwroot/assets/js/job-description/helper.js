function loader(status) {
  if (status == true) {
    $("#loading-overlay").addClass("show").show();
  } else {
    $("#loading-overlay").removeClass("show").hide();
  }
}

function updateIdentifikasiJob(params) {
  localStorage.setItem("identifikasi", JSON.stringify(params));
  $("#jabatan").text(params.jobName ?? "Data not found");
  $("#function").text(params.unitKerjaFungsi ?? "Data not found");
  $("#location").text(params.lokasiKerja ?? "Data not found");
  $("#directorat").text(params.direktorat ?? "Data not found");
  $("#directReport").text(params.atasanLangsung ?? "Data not found");
  $("#sk").text(params.noSuratKeputusan ?? "Data not found");
  $("#skDate").text(params.tanggalSuratKeputusan ?? "Data not found");
}

function updateTable(params, data, rowHeader) {
  console.log(`Updating table for ${params} with data:`, data, "and rowHeader:", rowHeader);
  // get table body
  const tableBody = $(`#${params}Table tbody`);
  console.log("tableBody", tableBody);
  tableBody.empty();
  let row = "";
  if (data.length === 0) {
    row = `<tr>
      <td colspan="100%" class="text-center p-30">Data not found</td>
    </tr>`;
    tableBody.append(row);
    return;
  }

  // if items in data is not array, convert to array
  if (!Array.isArray(data)) {
    // data = [data];
    return false;
  }

  data.forEach((item, inc) => {
    console.log(`Processing item ${inc} for ${params}:`, item);
    const reference = item.jobReferences !== undefined && item.jobReferences.length > 0 ? item.jobReferences[0] : "";
    const referenceHtml =
      reference !== ""
        ? `<br/><span style="font-size:10px;color:grey">(reference from : ${reference.jobName} - ${reference.skNumber})</span>`
        : "";
    row = `<tr>`;
    if (!rowHeader) {
      row += `<td class="tdClass">${item}</td>`;
      row += `</tr>`;
      tableBody.append(row);
      return;
    }
    rowHeader.forEach((header, idx) => {
      if (header === "no") {
        row += `<td class="tdClass">${inc + 1}</td>`;
        return;
      }

      if (header === "index") {
        const uniqueTanggungJawab = item?.tanggungJawabProses?.filter(
          (process, index, self) => index === self.findIndex((p) => p.indexNumber === process.indexNumber),
        );
        if (uniqueTanggungJawab && uniqueTanggungJawab.length === 1) {
          // Single item - display as span with tooltip
          row += `<td class="tdClass text-primary">
            <span data-bs-toggle="tooltip" data-bs-trigger="click" title="${uniqueTanggungJawab[0]?.description}">
              ${uniqueTanggungJawab[0]?.indexNumber}
            </span>
          </td>`;
        } else if (uniqueTanggungJawab && uniqueTanggungJawab.length > 1) {
          // Multiple items - display as list
          const listItems = uniqueTanggungJawab
            .map(
              (process) =>
                `<li><span class="text-primary" style="cursor:pointer" data-bs-toggle="tooltip" data-bs-trigger="click" title="${process?.description}">${process?.indexNumber}</span></li>`,
            )
            .join("");
          row += `<td class="tdClass">
            <ul style="margin: 0; padding-left: 15px; list-style-type: disc;">
              ${listItems}
            </ul>
          </td>`;
        } else {
          // No data
          row += `<td class="tdClass text-primary">-</td>`;
        }
        return;
      }
      // header inside customTableHeader
      if (customTableHeaderNoArray.includes(header)) {
        if (Array.isArray(item[header])) {
          item[header] = item[header].join(", ");
        }
      }

      if (customTableHeaderCleaned.includes(header)) {
        item[header] = item[header].toString().replace(/[\[\]"]/g, "");
      }

      const arrayType = Array.isArray(item[header]);
      if (arrayType) {
        const isHeaderArray = customTableHeaderHeader.includes(header);
        row += `<td class="tdClass" ><ul style="list-style-type:
        ${isHeaderArray ? "none" : "disc"}; padding-left: 20px; margin: 0; padding: 15px !important;
        ">`;
        item[header].forEach((arrayItem) => {
          row += `<li>${arrayItem}</li>`;
        });
        row += `</ul>
              ${referenceHtml}
              </td>`;
        return;
      }
      if (header === "action") {
        const mergeButton = `<button type="button" alt="Merge With" title="Merge With" class="btn btn-info" id="mergeData('${params}',${inc})" onclick="mergeData('${params}',${inc})"> <i class="fas fa-spin fa-sync-alt"></i></button>`;
        const isMergeButton = params === "tugasHa" ? mergeButton : "";
        row +=
          `<td class="p-3">
        ` +
          isMergeButton +
          `
          <button type="button" class="btn btn-primary" id="editData('${params}',${inc})" onclick="editData('${params}',${inc})"> <i class="fas fa-edit"></i></button>
          <button type="button" class="btn btn-danger" id="deleteData('${params}',${inc})" onclick="deleteData('${params}',${inc})"> <i class="fas fa-trash"></i></button>
        </td>`;
        return;
      }
      row += `<td class="tdClass">${item[header]}${header !== "id" ? referenceHtml : ""}</td>`;
    });

    row += `</tr>`;
    tableBody.append(row);
  });

  $('[data-bs-toggle="tooltip"]').tooltip({
    trigger: "click",
  });
}

function updateTableSelected(params, data, rowHeader, refer) {
  const tableBody = $(`#${params}Table tbody`);
  tableBody.empty();
  let row = "";
  if (data.length === 0) {
    row = `<tr>
      <td colspan="100%" class="text-center p-30">Data not found</td>
    </tr>`;
    tableBody.append(row);
    return;
  }

  // if items in data is not array, convert to array
  if (!Array.isArray(data)) {
    // data = [data];
    console.warn(`Data for ${params} is not an array, converting to array`);
    return false;
  }

  data.forEach((item, inc) => {
    const reference = item.reference ? item.reference : "";
    const referenceHtml =
      reference !== "" ? `<br/><span style="font-size:10px;color:grey">(reference from : ${reference})</span>` : "";
    row = `<tr>`;
    if (!rowHeader) {
      row += `<td class="tdClass">${item}</td>`;
      row += `</tr>`;
      tableBody.append(row);
      return;
    }
    rowHeader.forEach((header, idx) => {
      if (header === "no") {
        // row += `<td class="tdClass">${inc + 1}</td>`;
        row += `<td class="p-3" style="place-content: flex-start">
        <label class="container-checkbox m-0">
          <input onclick="checkboxReference(this)" type="checkbox" id="checkbox_${params}_${inc}" class="checkbox_animated checbox-compare" checked>
          <span class="checkmark" style="top:30%;left:10px;width:17px;height:17px" ></span>
        </label>
      </td>`;
        return;
      }

      if (header === "index") {
        const uniqueTanggungJawab = item?.tanggungJawabProses?.filter(
          (process, index, self) => index === self.findIndex((p) => p.indexNumber === process.indexNumber),
        );
        if (uniqueTanggungJawab && uniqueTanggungJawab.length === 1) {
          // Single item - display as span with tooltip
          row += `<td class="tdClass text-primary">
            <span data-bs-toggle="tooltip" data-bs-trigger="click" title="${uniqueTanggungJawab[0]?.description}">
              ${uniqueTanggungJawab[0]?.indexNumber}
            </span>
          </td>`;
        } else if (uniqueTanggungJawab && uniqueTanggungJawab.length > 1) {
          // Multiple items - display as list
          const listItems = uniqueTanggungJawab
            .map(
              (process) =>
                `<li><span class="text-primary" style="cursor:pointer" data-bs-toggle="tooltip" data-bs-trigger="click" title="${process?.description}">${process?.indexNumber}</span></li>`,
            )
            .join("");
          row += `<td class="tdClass" style="padding-left:10px !important">
            <ul style="margin: 0; list-style-type: disc; padding-left: 15px !important;">
              ${listItems}
            </ul>
          </td>`;
        } else {
          // No data
          row += `<td class="tdClass text-primary">-</td>`;
        }
        return;
      }
      // header inside customTableHeader
      if (customTableHeaderNoArray.includes(header)) {
        if (Array.isArray(item[header])) {
          item[header] = item[header].join(", ");
        }
      }

      if (customTableHeaderCleaned.includes(header)) {
        item[header] = item[header].toString().replace(/[\[\]"]/g, "");
      }

      const arrayType = Array.isArray(item[header]);
      if (arrayType) {
        const isHeaderArray = customTableHeaderHeader.includes(header);
        row += `<td class="tdClass" ><ul style="list-style-type:
        ${isHeaderArray ? "none" : "disc"}; padding-left: 20px; margin: 0; padding-left: 15px !important;
        ">`;
        item[header].forEach((arrayItem) => {
          row += `<li>${arrayItem}</li>`;
        });
        row += `</ul>
              ${referenceHtml}
              </td>`;
        return;
      }
      if (header === "action") {
        row += `<td class="p-3">
          <button type="button" class="btn btn-primary" id="editData${idx}" onclick="editData(${idx})"> <i class="fas fa-edit"></i></button>
          <button type="button" class="btn btn-danger" id="deleteData${idx}" onclick="deleteData(${idx})"> <i class="fas fa-trash"></i></button>
        </td>`;
        return;
      }
      row += `<td class="tdClass">${item[header]}${header !== "id" ? referenceHtml : ""}</td>`;
    });

    row += `</tr>`;
    tableBody.append(row);
  });

  $('[data-bs-toggle="tooltip"]').tooltip({
    trigger: "click",
  });
}

function updateTableRecommend(params, data, rowHeader, refer) {
  const tableBody = $(`#${params}Table tbody`);
  // console.log(" Updating recommendation table for", params, "with data:", data, "and rowHeader:", rowHeader);
  tableBody.empty();
  let row = "";
  if (data.length === 0) {
    row = `<tr>
      <td colspan="100%" class="text-center p-30">Data not found</td>
    </tr>`;
    tableBody.append(row);
    return;
  }

  // if items in data is not array, convert to array
  if (!Array.isArray(data)) {
    // data = [data];
    return false;
  }

  data.forEach((item, inc) => {
    console.log(item.idx);
    // console.log("Processing item", item, "with reference", item.reference);
    const reference = item.reference ? item.reference : "";
    const referenceHtml =
      reference !== "" ? `<br/><span style="font-size:10px;color:grey">(reference from : ${reference})</span>` : "";
    row = `<tr>`;
    if (!rowHeader) {
      row += `<td class="tdClass">${item}</td>`;
      row += `</tr>`;
      tableBody.append(row);
      return;
    }
    rowHeader.forEach((header, idx) => {
      if (header === "no") {
        // row += `<td class="tdClass">${inc + 1}</td>`;
        row += `<td class="p-3" style="place-content: flex-start">
        <label class="container-radio m-0">
          <input onclick="selectRecommendRow(this)" type="radio" name="radio_${params}" id="checkbox_${item.idx}" class="checkbox_animated checbox-compare">
          <span class="radiomark" style="top:30%;left:10px;width:17px;height:17px" ></span>
        </label>
      </td>`;
        return;
      }

      if (header === "index") {
        console.log("Processing index header for item", item?.tanggungJawabProses);
        const uniqueTanggungJawab = item?.tanggungJawabProses?.filter(
          (process, index, self) => index === self.findIndex((p) => p.indexNumber === process.indexNumber),
        );
        console.log("Unique tanggung jawab for item", item, "is", uniqueTanggungJawab);
        if (uniqueTanggungJawab && uniqueTanggungJawab.length === 1) {
          // Single item - display as span with tooltip
          row += `<td class="tdClass text-primary">
            <span data-bs-toggle="tooltip" data-bs-trigger="click" title="${uniqueTanggungJawab[0]?.description}">
              ${uniqueTanggungJawab[0]?.indexNumber}
            </span>
          </td>`;
        } else if (uniqueTanggungJawab && uniqueTanggungJawab.length > 1) {
          // Multiple items - display as list
          const listItems = uniqueTanggungJawab
            .map(
              (process) =>
                `<li><span class="text-primary" style="cursor:pointer" data-bs-toggle="tooltip" data-bs-trigger="click" title="${process?.description}">${process?.indexNumber}</span></li>`,
            )
            .join("");
          row += `<td class="tdClass" style="padding-left:10px !important">
            <ul style="margin: 0; list-style-type: disc; padding-left: 15px !important;">
              ${listItems}
            </ul>
          </td>`;
        } else {
          // No data
          row += `<td class="tdClass text-primary">-</td>`;
        }
        return;
      }
      // header inside customTableHeader
      if (customTableHeaderNoArray.includes(header)) {
        if (Array.isArray(item[header])) {
          item[header] = item[header].join(", ");
        }
      }

      if (customTableHeaderCleaned.includes(header)) {
        item[header] = item[header].toString().replace(/[\[\]"]/g, "");
      }

      const arrayType = Array.isArray(item[header]);
      if (arrayType) {
        const isHeaderArray = customTableHeaderHeader.includes(header);
        row += `<td class="tdClass" ><ul style="list-style-type:
        ${isHeaderArray ? "none" : "disc"}; padding-left: 20px; margin: 0; padding-left: 15px !important;
        ">`;
        item[header].forEach((arrayItem) => {
          row += `<li>${arrayItem}</li>`;
        });
        row += `</ul>
              ${referenceHtml}
              </td>`;
        return;
      }
      if (header === "action") {
        row += `<td class="p-3">
          <button type="button" class="btn btn-primary" id="editData${idx}" onclick="editData(${idx})"> <i class="fas fa-edit"></i></button>
          <button type="button" class="btn btn-danger" id="deleteData${idx}" onclick="deleteData(${idx})"> <i class="fas fa-trash"></i></button>
        </td>`;
        return;
      }
      row += `<td class="tdClass">${item[header]}${header !== "id" ? referenceHtml : ""}</td>`;
    });

    row += `</tr>`;
    tableBody.append(row);
  });

  $('[data-bs-toggle="tooltip"]').tooltip({
    trigger: "click",
  });
}

function getJobReference(params) {
  updateIdentifikasiJob(params.identifikasi);
  updateTable("tugasUmum", params.tugasUmum, ["id", "header", "tugas"]);
  updateTable("wewenang", params.wewenang, ["id", "wewenang"]);
  updateTable("persyaratanJabatan", params.education);
}

async function getJobReferenceDetail() {
  const lsFungsi = localStorage.getItem("fungsi") !== "" ? JSON.parse(localStorage.getItem("fungsi")) : [];
  const lsTugasHa = localStorage.getItem("tugasHa") !== "" ? JSON.parse(localStorage.getItem("tugasHa")) : [];
  const lsKoordinasiInternal =
    localStorage.getItem("koordinasiInternal") !== "" ? JSON.parse(localStorage.getItem("koordinasiInternal")) : [];
  const lsRelasiEksternal =
    localStorage.getItem("relasiEksternal") !== "" ? JSON.parse(localStorage.getItem("relasiEksternal")) : [];
  const lsStk = localStorage.getItem("stk") !== "" ? JSON.parse(localStorage.getItem("stk")) : [];

  console.log("lsFungsi", lsFungsi);
  console.log("lsTugasHa", lsTugasHa);
  console.log("lsKoordinasiInternal", lsKoordinasiInternal);
  console.log("lsRelasiEksternal", lsRelasiEksternal);
  console.log("lsStk", lsStk, localStorage.getItem("stk"));

  // Initialize CKEditor for .summernote elements
  if (typeof CKEDITOR !== "undefined" && CKEDITOR) {
    document.querySelectorAll(".summernote").forEach((element) => {
      // Check if CKEditor instance already exists
      if (element.ckeditorInstance) {
        // Just replace the content in existing editor
        element.ckeditorInstance.setData(lsFungsi.deskripsi || "");
      } else {
        // Don't create new instances to prevent adding new textareas
        // The CKEditor should already be initialized elsewhere
      }
    });
  } else {
    document.querySelectorAll(".summernote").forEach((element) => {
      element.innerHTML = lsFungsi.deskripsi || "";
    });
  }

  console.log("lsFungsi", lsFungsi);
  // remove p inside fungsiReferenceContainer to prevent duplicates
  $("#fungsiReferenceContainer p").remove();
  lsFungsi.jobReferences.map((item) => {
    const textReference = `(Reference from : ${item.jobName}) - ${item.skNumber ? item.skNumber : "-"}`;
    $("#fungsiReferenceContainer").append(
      `<p style="font-size: 12px; font-style: italic; margin-top: -10px; margin-bottom: 10px;">${textReference}</p>`,
    );
  });

  console.log("lsStk.length", lsStk.length);
  // Filter data arrays properly
  const filteredTugasHa =
    lsTugasHa.length > 0 && Array.isArray(lsTugasHa)
      ? lsTugasHa.filter((item) => item.responsible && item.responsible.length > 0)
      : [];
  console.log("lsTugasHa", lsTugasHa);
  const filteredStk =
    lsStk.length > 0 && Array.isArray(lsStk)
      ? lsStk.filter((item) => item.stkNumber !== null && item.stkNumber !== undefined)
      : [];

  updateTable("tugasHa", filteredTugasHa, [...tabCusJD.tugasHa, "action"]);
  updateTable("koordinasi", lsKoordinasiInternal, [...tabCusJD.koordinasi, "action"]);
  updateTable("relation", lsRelasiEksternal, [...tabCusJD.relation, "action"]);
  updateTable("stk", filteredStk, [...tabCusJD.stk, "action"]);
}

async function addList(data) {
  let list = "";
  for (const item of data) {
    list += `<li>${item}</li>`;
  }
  return list;
}

function isDisableButton(isDisabled) {
  if (isDisabled) {
    $("[id^=addJob]").prop("disabled", true);
    $("[id^=editData]").prop("disabled", true);
  } else {
    // all button with id contains "btn" will be disabled
    $("[id^=addJob]").prop("disabled", false);
    $("[id^=editData]").prop("disabled", false);
  }
}

// async function searchJobCompare(event, isPercentage) {
//   const chkJobList = document.getElementById("chk-job-list");
//   const jobSelectedList = document.getElementById("job-selected-list");
//   if (isPercentage) {
//     const value = event.target.value;
//     const chkJobListPercentage = document.getElementById(
//       "chk-job-list-percentage"
//     );

//     // chkJobListPercentage.innerHTML = dataJobDescCompare
//     //   .map((item) => ({
//     //     id: item?.identifikasi?.id,
//     //     name: item?.identifikasi?.jobName,
//     //     percentage: Math.floor(Math.random() * 50) + 50,

//     //   }))
//     //   .filter((item) => item.percentage >= value)
//     //   .map(
//     //     (item) =>
//     //       `
//     //       <div class="row-item">
//     //         <div class="column-item-name" onClick="applyCompare(${item.id})">
//     //           ${item.name} <span class="badge badge-danger">${item.percentage}% Similarities</span>
//     //         </div>
//     //       </div>
//     //     `
//     //   )
//     //   .join("");
//     const findData = dataJobDescCompare.filter(
//       (item) => item.identifikasi.percentage >= value
//     );
//     const urlParams = new URLSearchParams(window.location.search);
//     const idPos = urlParams.get("id");
//     const selectedIdPos = dataJobDesc.find(
//       (item) => item.identifikasi.id == idPos
//     );
//     // if selectedIdPos?.identifikasi?.jobName include manager
//     let include = "sbm";
//     if (
//       selectedIdPos?.identifikasi?.jobName.toLowerCase().includes("manager")
//     ) {
//       include = "manager";
//     }

//     const dataCk = dataJobDescCompare
//       .map((item) => ({
//         id: item?.identifikasi?.id,
//         name: item?.identifikasi?.jobName,
//         percentage: item?.identifikasi?.percentage,
//       }))
//       .filter(
//         (item) =>
//           item.percentage >= value && item.name.toLowerCase().includes(include)
//       );

//     dataCk.forEach((item) => {
//       let color = "";
//       if (item.percentage >= 90) {
//         color = "background-color: #28a745";
//       } else if (item.percentage >= 80) {
//         color = "background-color: #17a2b8";
//       } else if (item.percentage >= 70) {
//         color = "background-color: #ffc107";
//       } else if (item.percentage >= 60) {
//         color = "background-color: #007bff";
//       } else if (item.percentage >= 50) {
//         color = "background-color: #dc3545";
//       }
//       item.badge = `<span class="badge" style="${color}">${item.percentage}% Similarities</span>`;
//     });

//     chkJobListPercentage.innerHTML = dataCk
//       .map(
//         (item) =>
//           `
//           <div class="row-item">
//             <div class="column-item-name" onClick="applyCompare(${item.id})">
//               ${item.name}
//               ${item.badge}
//               <i class="fas fa-info-circle" data-toggle="popover" data-placement="top" title="Popover title" data-content="And here's some amazing content. It's very engaging. Right?"></i>
//             </div>
//           </div>
//         `
//       )
//       .join("");

//     $('[data-toggle="popover"]').popover();
//     return;
//   }

//   const data = dataJobDescCompare
//     .map((item) => ({
//       id: item?.identifikasi?.id,
//       name: item?.identifikasi?.jobName,
//     }))
//     .filter((item) =>
//       item.name.toLowerCase().includes(event?.target?.value.toLowerCase())
//     );

//   chkJobList.innerHTML = data
//     .map(
//       (item) => `
//         <div class="row-item">
//           <div class="column-item-name" onClick="applyCompare(${item.id})">
//             ${item.name}
//           </div>
//         </div>
//       `
//     )
//     .join("");

//   // chkJobList.addEventListener("change", (e) => {
//   //   if (e.target.classList.contains("checkbox_animated")) {
//   //     const value = e.target.value;
//   //     const name = e.target.getAttribute("data-name");

//   //     if (e.target.checked) {
//   //       if (!document.getElementById(`selected-job-${value}`)) {
//   //         const selectedItem = document.createElement("div");
//   //         selectedItem.className = "selected-item";
//   //         selectedItem.id = `selected-job-${value}`;
//   //         selectedItem.innerHTML = `
//   //               ${name}
//   //               <span class="remove-item" data-value="${value}">
//   //                 <i class="fas fa-times"></i>
//   //               </span>
//   //             `;
//   //         jobSelectedList.appendChild(selectedItem);
//   //       }
//   //     } else {
//   //       const itemToRemove = document.getElementById(`selected-job-${value}`);
//   //       if (itemToRemove) itemToRemove.remove();
//   //     }
//   //   }
//   // });

//   // jobSelectedList.addEventListener("click", (e) => {
//   //   if (e.target.closest(".remove-item")) {
//   //     const value = e.target.closest(".remove-item").getAttribute("data-value");
//   //     const checkbox = document.querySelector(`input[type="checkbox"][value="${value}"]`);
//   //     if (checkbox) checkbox.checked = false;
//   //     document.getElementById(`selected-job-${value}`).remove();
//   //   }
//   // });
// }

async function applyCompare(id, prlOrg, prlOrgTarget) {
  $("#modalJobCompareDetail").modal("show");
  await applySelectedData(id, prlOrg, prlOrgTarget);
}

async function addJobReference(showData = "") {
  // $("#modalJobCompareDetail").modal("show");
  // await applySelectedData(jobId, prlOrg, prlOrg);
  // return;
  $("#modalJobCompare").modal("show");
  $("#searchDiv").hide();
  localStorage.setItem("onlyShowdata", "");
  if (showData) {
    localStorage.setItem("onlyShowdata", showData);
  }
}

function filterListJobDesc(value, search) {
  let data = dataListJobDescription;

  if (value !== "") {
    data = data.filter((item) => item.jobStatus === value);
  }
  if (search) {
    data = data.filter((item) => item.jobName.toLowerCase().includes(search.toLowerCase()));
  }
  getTableListJobDes(data);
}

function createJobDesc(jobId, prlOrg, positionCode) {
  const redirectTo = `/job-description/detail?jobId=${jobId}&prlOrg=${prlOrg}&positionCode=${positionCode}`;
  window.location.href = redirectTo;
}

function detailJobDesc(jobId, prlOrg, positionCode) {
  const redirectTo = `/job-description/detail?master=true&jobId=${jobId}&prlOrg=${prlOrg}&positionCode=${positionCode}`;
  window.location.href = redirectTo;
}

function selectRecommendRow(val) {
  const $table = $(val).closest("table");
  $table.find("tr").css("background-color", "");
  $(val).closest("tr").css("background-color", "#d4edda");

  const $card = $(val).closest(".card");
  $card.find(".card-header").addClass("bg-success text-white");
}

function saveRecommendation() {
  const selectedInputs = $("#modalRecomendationBody input[type='radio']:checked");
  if (selectedInputs.length === 0) {
    swal("No selection", "Please select a recommendation before saving.", "warning");
    return;
  }
  const selectedIds = selectedInputs
    .map(function () {
      return $(this).attr("id");
    })
    .get();
  const cleanedSelectedIds = selectedIds.map((id) => id.replace("checkbox_", ""));
  const data = JSON.parse(localStorage.getItem("dataTugasHARecom"));
  const selectedData = data.filter((item) => cleanedSelectedIds.includes(item.idx.toString()));

  if (selectedData.length > 0) {
    const confrim = confirmFunction("Are you sure?", "Do you want to apply this recommendation?");
    confrim.then((willApply) => {
      if (willApply) {
        saveRecommendationAttribute(selectedData);
        $("#modalJobCompareDetail, #modalJobCompare").modal("hide");
      } else {
        swal("Cancelled", "Your recommendation has not been applied.", "info");
      }
    });
  }
}

async function saveRecommendationAttribute(selectedData) {
  loader(true);

  console.log("Selected data for recommendation:", selectedData);
  const selectedJobDescReference = JSON.parse(localStorage.getItem("selectedJobDescReference")) ?? {};

  // Add jobReferences to each selected item
  const processedItems = selectedData.map((item) => {
    if (!Array.isArray(item.jobReferences)) {
      item.jobReferences = [];
    }
    item.jobReferences.push({
      jobId: selectedData?.jobReferences?.jobId || null,
      jobName: selectedData?.jobReferences?.jobName || null,
      skNumber: selectedData?.jobReferences?.noSuratKeputusan || null,
      prlOrg: selectedData?.jobReferences?.prlOrg || null,
    });
    return item;
  });

  // Collect unique tanggungJawabProses for availability calculation
  let arraySelectedBusPro = [];
  processedItems.forEach((item) => {
    arraySelectedBusPro.push(...(item?.tanggungJawabProses ?? []));
  });
  const uniqueSelectedBusPro = arraySelectedBusPro.filter(
    (process, index, self) => index === self.findIndex((p) => p.indexNumber === process.indexNumber),
  );
  updateCalculateLsAvailable(uniqueSelectedBusPro);

  // Update tugasHa localStorage
  let localData = [];
  try {
    const storedData = localStorage.getItem("tugasHa");
    if (storedData && storedData !== "") {
      localData = JSON.parse(storedData);
    }
    if (!Array.isArray(localData)) {
      localData = [];
    }
  } catch (error) {
    console.warn("Error parsing localStorage for tugasHa:", error);
    localData = [];
  }

  localData.push(...processedItems);
  localStorage.setItem("tugasHa", JSON.stringify(localData));

  saveTugasHa();

  await getJobReferenceDetail();
  $("#modalRecomendation").modal("hide");
  loader(false);
  swal("Success!", "Recommendation saved to your job description", "success");
}

async function checkboxReference(val) {
  const isChecked = val.checked;
  const id = val.id;

  if (id !== "checkbox_jobdesc_all") {
    if (val.id.includes("all")) {
      const splitVal = val.id.split("all")[0];
      $("[id^=" + splitVal + "]").prop("checked", isChecked);
      return;
    }
    $("[id^=" + id + "]").prop("checked", isChecked);
    return;
  }
  if (!isChecked) {
    $("[id^=checkbox_]").prop("checked", false);
    return;
  }
  $("[id^=checkbox_]").prop("checked", true);
}

function confirmFunction(title, text) {
  // give alert confirm
  return swal({
    title: title || "Are you sure?",
    text: text || "Make sure all data is correct before proceeding.",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then((willProceed) => {
    return willProceed; // true if user clicks OK, false if user clicks Cancel
  });
}

async function callOtherRecommendations() {
  loader(true);
  saveReferenceAttribute();
  const getDataJobDesc = JSON.parse(localStorage.getItem("selectedJobDescReference"));
  const lsAvailable = JSON.parse(localStorage.getItem("lsAvailable"));
  const notAvailable = lsAvailable?.notAvailable || [];
  const getUniqueCode = notAvailable.map((item) => item.code);
  const codeNotAvailable = [...new Set(getUniqueCode)];
  const notAvailableList = TEST_1[0].notAvailable || [];
  const dataTugasHARecom = TEST_2;
  localStorage.setItem("dataTugasHARecom", JSON.stringify([]));
  const modalBody = document.getElementById("modalRecomendationBody");
  const cleanObjTugasHARecom = dataTugasHARecom
    .filter((item) => item.responsible.length > 0)
    .map((item, idx) => {
      return {
        idx: idx + 1,
        ...item,
      };
    });
  localStorage.setItem("dataTugasHARecom", JSON.stringify(cleanObjTugasHARecom));
  // updateTable("tugasHa", dataTugasHA, [...tabCusJD.tugasHa, "action"]);

  const accordionItems = notAvailableList
    .map(
      (item, index) => `
    <div class="card">
      <div class="card-header" id="heading${item.indexNumber.replace(/\./g, "_")}">
        <h5 class="mb-0">
          <button class="btn btn-link collapsed" data-bs-toggle="collapse" data-bs-target="#collapse${item.indexNumber.replace(/\./g, "_")}" aria-expanded="false" aria-controls="collapse${item.indexNumber.replace(/\./g, "_")}">
            <span class="me-2">#${index + 1}</span>${item.indexNumber} - ${item.description}
          </button>
        </h5>
      </div>
      <div class="collapse" id="collapse${item.indexNumber.replace(/\./g, "_")}" aria-labelledby="heading${item.indexNumber.replace(/\./g, "_")}">
        <div class="card-body">
          <div class="table-responsive m-t-10">
              <table class="tableMasterData w-100" id="tugasHaRecom${item.indexNumber.replace(/\./g, "_")}Table">
                  <thead>
                      <tr>
                          <th style="width:2%"></th>
                          <th style="width:2%">No</th>
                          <th style="width:25%">Tugas & Tanggung Jawab</th>
                          <th style="width:25%">Hasil Akhir Yang Diharapkan</th>
                          <th style="width:25%">Leading Indicator</th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr class="p-20">
                          <td colspan="6" class="p-15 text-center">Data Not Found</td>
                      </tr>
                  </tbody>
              </table>
          </div>
        </div>
      </div>
    </div>`,
    )
    .join("");

  modalBody.innerHTML = `
    <div class="default-according" id="accordion1">
      ${accordionItems || '<p class="text-center text-muted p-3">No items to display.</p>'}
    </div>`;

  notAvailableList.forEach((item) => {
    const findData = cleanObjTugasHARecom.filter((data) =>
      data.tanggungJawabProses.some((proses) => proses.indexNumber === item.indexNumber),
    );
    updateTableRecommend(`tugasHaRecom${item.indexNumber.replace(/\./g, "_")}`, findData || [], tabCusJD.tugasHa);
  });
  loader(false);
  $("#modalRecomendation").modal("show");
}

function callConfirmReference() {
  const action = [
    {
      button: "Back",
      className: "btn-outline-dark",
      callback: function () {
        hideModal(`modalConfirm`);
      },
    },
    {
      button: "No, Skip",
      className: "btn-outline-dark",
      callback: function () {
        hideModal(`modalConfirm`);
        loader(true);
        saveReferenceAttribute();
        $("#modalJobCompare").modal("hide");
        $("#modalJobCompareDetail").modal("hide");
        loader(false);
        swal("Success!", "Reference saved to your job description", "success");
      },
    },
    {
      button: "Yes, Continue",
      className: "btn-primary",
      callback: function () {
        hideModal(`modalConfirm`);

        callOtherRecommendations();
      },
    },
  ];
  modalConfrimHelper(
    "confirm",
    "Warning",
    `<span class="notifWarning">One or more tasks and responsibilities require references, which are unavailable in this position. Therefore, it is necessary to seek references from other positions.</span><br>Do you want to seek references from other positions?`,
    "",
    action,
    "50%",
    1,
  );
}

async function saveReferenceAttribute() {
  const onlyShowdata = localStorage.getItem("onlyShowdata") == "" ? false : localStorage.getItem("onlyShowdata");
  const checkboxList = Array.from(document.querySelectorAll("input[type=checkbox].checbox-compare")).filter(
    (item) => !item.id.includes("all") && item.checked,
  );
  const selectedJobDescReference = JSON.parse(localStorage.getItem("selectedJobDescReference")) ?? "[]";
  let checboxFungsi = checkboxList.find((item) => item.id === "checkbox_fungsi");
  let checboxTugasHa = checkboxList.filter((item) => item.id.includes("checkbox_tugasHaReference"));
  let checboxInternal = checkboxList.filter((item) => item.id.includes("checkbox_koordinasiInternalReference"));
  let checboxEksternal = checkboxList.filter((item) => item.id.includes("checkbox_relasiEksternalReference"));
  let checkboxStk = checkboxList.filter((item) => item.id.includes("checkbox_stkReference"));

  // console.log("checboxTugasHa", checboxTugasHa);
  // return;
  // Reset other checkboxes based on onlyShowdata filter
  if (onlyShowdata) {
    if (onlyShowdata !== "stk") checkboxStk = [];
    if (onlyShowdata !== "relation") checboxEksternal = [];
    if (onlyShowdata !== "koordinasi") checboxInternal = [];
    if (onlyShowdata !== "tugasHa") checboxTugasHa = [];
    if (onlyShowdata !== "fungsi") checboxFungsi = undefined;
  }

  // Dynamic function to process checkbox references
  const processCheckboxReference = (checkboxes, config) => {
    if (checkboxes.length === 0) return;

    const { checkAllId, dataPath, localStorageKey, checkboxPrefix } = config;
    const isCheckedAll = checkboxes.find((item) => item.id === checkAllId);

    const selectedItems = checkboxes
      .map((item) => {
        const id = item.id.split(`${checkboxPrefix}_`)[1];
        return selectedJobDescReference?.[dataPath]?.data?.[id];
      })
      .filter((item) => item)
      .map((item) => {
        // Ensure jobReferences is always an array
        if (!Array.isArray(item.jobReferences)) {
          item.jobReferences = [];
        }

        item.jobReferences.push({
          jobId: selectedJobDescReference?.identifikasiJabatan?.jobId,
          jobName: selectedJobDescReference?.identifikasiJabatan?.jobName,
          skNumber: selectedJobDescReference?.identifikasiJabatan?.noSuratKeputusan,
          jobId: jobId,
          prlOrg: prlOrg,
        });

        return item;
      });

    selectedJobDescReference[dataPath].data = selectedItems;
    if (localStorageKey === "tugasHa") {
      console.log(checkboxes, config, dataPath);
      console.log("selectedItems tugasHa", selectedItems);
      let arraySelectedBusPro = [];
      selectedItems.forEach((item) => {
        arraySelectedBusPro.push(...(item?.tanggungJawabProses ?? []));
      });
      const uniqueSelectedBusPro = arraySelectedBusPro.filter(
        (process, index, self) => index === self.findIndex((p) => p.indexNumber === process.indexNumber),
      );
      updateCalculateLsAvailable(uniqueSelectedBusPro);
    }
    // }

    // Update localStorage
    // check selectedJobDescReference[dataPath]?.data is array
    if (!Array.isArray(selectedJobDescReference?.[dataPath]?.data)) {
      console.warn(`${dataPath} is not an array, skipping localStorage update`);
      return;
    }

    let localData = [];
    try {
      const storedData = localStorage.getItem(localStorageKey);
      if (storedData && storedData !== "") {
        localData = JSON.parse(storedData);
      }
      // Ensure localData is an array
      if (!Array.isArray(localData)) {
        localData = [];
      }
    } catch (error) {
      console.warn(`Error parsing localStorage for ${localStorageKey}:`, error);
      localData = [];
    }

    localData.push(...(selectedJobDescReference?.[dataPath]?.data ?? []));
    localStorage.setItem(localStorageKey, JSON.stringify(localData));
  };

  if (checboxFungsi != undefined) {
    const localData =
      localStorage.getItem("fungsi") == "" || localStorage.getItem("fungsi") == "{}"
        ? { deskripsi: "", jobReferences: [] }
        : JSON.parse(localStorage.getItem("fungsi"));
    console.log("localData fungsi", localData);
    let dataFungsi = "";
    const fungsiElement = document.querySelector("#fungsiTextReference");
    if (fungsiElement && fungsiElement.ckeditorInstance) {
      dataFungsi = fungsiElement.ckeditorInstance.getData();
    } else if (fungsiElement) {
      dataFungsi = fungsiElement.innerHTML || fungsiElement.value;
    }
    const getFungsiText = localData.deskripsi + " " + dataFungsi;
    localData.deskripsi = getFungsiText;
    localData.jobReferences.push({
      jobId: selectedJobDescReference?.identifikasiJabatan?.jobId,
      jobName: selectedJobDescReference?.identifikasiJabatan?.jobName,
      skNumber: selectedJobDescReference?.identifikasiJabatan?.noSuratKeputusan,
      jobId: jobId,
      prlOrg: prlOrg,
    });
    localStorage.setItem("fungsi", JSON.stringify(localData));
  }

  // Process tugas ha
  processCheckboxReference(checboxTugasHa, {
    checkAllId: "checkbox_tugasHaReference",
    dataPath: "tugasTanggungJawabAkhir",
    localStorageKey: "tugasHa",
    checkboxPrefix: "checkbox_tugasHaReference",
  });

  // Process coordination internal
  processCheckboxReference(checboxInternal, {
    checkAllId: "checkbox_koordinasiInternalReference",
    dataPath: "koordinasiInternal",
    localStorageKey: "koordinasiInternal",
    checkboxPrefix: "checkbox_koordinasiInternalReference",
  });

  // Process external relations
  processCheckboxReference(checboxEksternal, {
    checkAllId: "checkbox_relasiEksternalReference",
    dataPath: "relasiEksternal",
    localStorageKey: "relasiEksternal",
    checkboxPrefix: "checkbox_relasiEksternalReference",
  });

  // Process STK
  processCheckboxReference(checkboxStk, {
    checkAllId: "checkbox_stkReference",
    dataPath: "stk",
    localStorageKey: "stk",
    checkboxPrefix: "checkbox_stkReference",
  });

  saveTugasHa();

  await getJobReferenceDetail();
}

async function saveTugasHa() {
  const tugasHa = JSON.parse(localStorage.getItem("tugasHa")) || [];
  // tugas dan tanggung jawab akhir
  const params = paramsSaveDraft;
  const paramsTugasAkhir = params.tugasTanggungJawabAkhir[0];
  params.tugasTanggungJawabAkhir = [];
  tugasHa.forEach((item) => {
    const objTugasHa = { ...paramsTugasAkhir };
    objTugasHa.jobId = jobId;
    objTugasHa.prlOrg = prlOrg;
    objTugasHa.tanggungJawab = item.responsible || [];
    objTugasHa.uraian = item.uraian || "";
    objTugasHa.hasilAkhir = item.output || [];
    objTugasHa.leadingIndikator = item.lead || [];
    // filter unique
    objTugasHa.tanggungJawabProses = item.tanggungJawabProses
      .map((tr) => tr.code)
      .filter((v, i, a) => a.indexOf(v) === i);
    objTugasHa.hasilAkhirProses = item.hasilAkhirProses.map((hr) => hr.code).filter((v, i, a) => a.indexOf(v) === i);
    objTugasHa.jobReferences = [];
    if (item.jobReferences && item.jobReferences.length > 0) {
      objTugasHa.jobReferences = item.jobReferences;
    }
    params.tugasTanggungJawabAkhir.push(objTugasHa);
  });
  console.log("params.tugasTanggungJawabAkhir", params.tugasTanggungJawabAkhir);
}

async function saveReference() {
  const onlyShowdata = localStorage.getItem("onlyShowdata") ?? false;
  const isFullRefer = JSON.parse(localStorage.getItem("isFullRefer")) ?? false;
  console.log("onlyShowdata", onlyShowdata);
  console.log("isFullRefer", isFullRefer);

  // if not full reference or onlyShowdata is tugasHa, call confirm reference
  if (!isFullRefer && (onlyShowdata == "tugasHa" || onlyShowdata === false || onlyShowdata === "")) {
    callConfirmReference();
    return;
  }
  const confirm = await confirmFunction("Save Reference", "Are you sure you want to save the selected references?");
  if (!confirm) return;
  await saveReferenceAttribute();
}

function checkButtonTable(buttonTable, id, lastPath, data) {
  const user = localStorage.getItem("user") === "admin" ? "admin" : "admin";
  const status = "2";
  // swith case by parameter buttonTable and lastPath
  switch (buttonTable) {
    case "deleteMoveVariousTable":
      return `<span class="f-14">${id}</span>
          <br/>
          <div class="col m-t-5 m-b-5">
            <div class="col-sm-12">
              <span class="text-muted f-12">Org Unit</span> 
              <select class="form-control" id="selectOrgUnitDelete" name="selectOrgUnitDelete">
                <option value="0">Select Org Unit</option>
                <option value="1">Org Unit 1</option>
              </select>
            </div>
            <div class="col-sm-12 m-t-10">
              <span class="text-muted f-12">Direct Report</span> 
              <select class="form-control" id="selectDirectReportDelete" name="selectDirectReportDelete">
                <option value="0">Select Position</option>
                <option value="1">Manager Strategic Planning</option>
              </select>
            </div>
          </div>`;
    case "positionList":
      if (lastPath === "draft-detail") {
        let editPositionDraft = `<button class="btn-custom-outline-primary" onclick="editJobDesc('${id}')"> <i class="icon-pencil f-16"></i></button>`;
        const detailPositionDraft = `<button class="btn-custom-outline-dark" onclick="detailJobDesc('${id}')"> <i class="icon-eye f-16"></i></button>`;
        // const deletePositionDraft = `<button class="btn-custom-outline-danger" onclick="deleteJobDesc('${id}')"><i class="icon-trash f-16"></i></button>`;
        if (data?.actionType == "Delete") {
          editPositionDraft = "";
        }
        return `${editPositionDraft} ${detailPositionDraft} `;
        // return `${editPositionDraft} ${detailPositionDraft} ${deletePositionDraft}`;
      } else {
        const detail = `<button class="btn-custom-outline-dark" onclick="detailapproval('${id}')"> <i class="icon-eye f-16"></i></button>`;
        return `${detail}`;
      }
    case "draftList":
      const detailDraft = `<button class="btn-custom-outline-dark" onclick="detailDraft('${id}')"> <i class="icon-eye f-16"></i></button>`;
      const deleteDraft = `<button class="btn-custom-outline-danger" onclick="deleteDraft('${id}')"><i class="icon-trash f-16"></i></button>`;
      return `${detailDraft} ${deleteDraft}`;
    case "approvalList":
      const detail = `<button class="btn-custom-outline-dark" onclick="detailapproval('${id}')"> <i class="icon-eye f-16"></i></button>`;
      const approve = `<button class="btn-custom-outline-primary" onclick="acceptApproval('${id}')"> <i class="icon-check f-16"></i></button>`;
      const reject = `<button class="btn-custom-outline-danger" onclick="rejectApproval('${id}')"> <i class="icon-close f-16"></i></button>`;
      if (status === "1" || status === "4") {
        return `${detail} ${user === "admin" ? `${approve} ${reject}` : ""}`;
      } else if (status === "2" || status === "3" || status === "5") {
        return detail;
      } else {
        return `${detail} ${user === "admin" ? `${approve} ${reject}` : ""}`;
      }
    default:
      return ``;
  }
}

function modalConfrimHelper(type, titleModal, message, note, action, modalSize, paramsId) {
  if (modalSize) {
    // update modal size css width, exm: 90%
    $("#modalConfirm")
      .find(".modal-dialog")
      .css("width", modalSize + "!important");
  } else {
    $("#modalConfirm").find(".modal-dialog").css("width", "90%");
  }
  $("#modalConfirmTitle").html("");
  $("#modalConfirmBody").html("");
  $("#modalConfirmFooter").html("");

  let icon =
    type == "delete"
      ? '<i class="fas fa-exclamation-triangle text-danger"></i>'
      : type == "success"
        ? '<i class="fas fa-check-circle text-success"></i>'
        : '<i class="fas fa-exclamation-circle text-warning"></i>';
  let title = `<span class="p-l-10">` + titleModal + `</span>`;
  $("#modalConfirmTitle").html(icon + title);
  $("#modalConfirmBody").html(
    `<div class="f-14" role="alert">` +
      message +
      `
    </div>`,
  );

  if (note) {
    $("#modalConfirmBody").append(
      `<div class="alert alert-danger-custom m-t-10" role="alert">
        <strong>Note:</strong> ` +
        note +
        `
      </div>`,
    );
  }

  if (action) {
    action.forEach((item, index) => {
      if (item.callback) {
        // Store the callback function globally with a unique identifier
        const callbackId = `modalCallback_${Date.now()}_${index}`;
        window[callbackId] = item.callback;

        $("#modalConfirmFooter").append(
          `<button type="button" class="btn ` +
            item.className +
            ` m-r-5" onclick="window.${callbackId}()">` +
            item.button +
            `</button>`,
        );
        return;
      }
      $("#modalConfirmFooter").append(
        `<button type="button" class="btn ` +
          item.className +
          ` m-r-5" onclick="(async () => { await ${item.callbackFunction}(\`${paramsId}\`); })()">` +
          item.button +
          `</button>`,
      );
    });
  }

  $("#modalConfirm").modal("show");
}

function hideModal(id) {
  $("#" + id).modal("hide");
}

function getallChildrenNode(parentNode) {
  const lsListOrgNode = JSON.parse(localStorage.getItem("listOrgNode") || "[]");
  let children = lsListOrgNode.filter((item) => item.pid === parentNode.id);
  children.forEach((child) => {
    children = children.concat(getallChildrenNode(child));
  });
  return children;
}

// ======================
// helper bagan org
// ======================
async function focusNode(nodeId) {
  // Show loading with proper container detection
  showChartLoading("chart-container-custom");
  // console.log("Focusing on node:", organizationAttribute);
  const getDraftExisting = JSON.parse(localStorage.getItem("draftExistingJobDesc") || "{}");

  try {
    const dataChart = await chartShow({
      draftId: getDraftExisting.organizationDraftId,
      jobCode: nodeId,
      depth: 5,
    });
    console.log("dataChart for focusNode:", dataChart);

    const dataTest = {
      status: 200,
      message: "Success",
      data: [
        {
          layering: "L2",
          org_unit_name: "Retail Marketing",
          pid: "10132544",
          gl: "GL1",
          position: "VP Marketing",
          prl: "23",
          jumlah_formasi: 34,
          coordinationWith: {},
          actionType: "Read",
          tags: [],
          coordination: false,
          isNeck: false,
          basket: false,
          position_parent: "Pemasaran Regional",
          id_position_atasan_langsung: "10132544",
          id: "10163455",
          assistant: false,
          isMergeFormation: false,
          id_org_unit: "10163455",
          id_position: "30313912",
          id_position_parent: "30259031",
          project: false,
          hasChildren: false,
        },
        {
          layering: "L3",
          org_unit_name: "Market Research & Pricing",
          pid: "10163455",
          gl: "GL2",
          position: "Manager Market Research & Pricing",
          prl: "20",
          jumlah_formasi: 11,
          coordinationWith: {},
          actionType: "Read",
          tags: [],
          coordination: false,
          isNeck: false,
          basket: false,
          position_parent: "Retail Marketing",
          id_position_atasan_langsung: "10163455",
          id: "10163456",
          assistant: false,
          isMergeFormation: false,
          id_org_unit: "10163456",
          id_position: "30313913",
          id_position_parent: "30313912",
          project: false,
          hasChildren: false,
        },
        {
          layering: "L3",
          org_unit_name: "Event Management",
          pid: "10163455",
          gl: "GL2",
          position: "Manager Event Management",
          prl: "19",
          jumlah_formasi: 10,
          coordinationWith: {},
          actionType: "Read",
          tags: [],
          coordination: false,
          isNeck: false,
          basket: false,
          position_parent: "Retail Marketing",
          id_position_atasan_langsung: "10163455",
          id: "10163461",
          assistant: false,
          isMergeFormation: false,
          id_org_unit: "10163461",
          id_position: "30313924",
          id_position_parent: "30313912",
          project: false,
          hasChildren: false,
        },
        {
          layering: "L3",
          org_unit_name: "B2C Marketing & Loyalty Program",
          pid: "10163455",
          gl: "GL2",
          position: "Manager B2C Marketing & Loyalty Program",
          prl: "21",
          jumlah_formasi: 12,
          coordinationWith: {},
          actionType: "Read",
          tags: [],
          coordination: false,
          isNeck: false,
          basket: false,
          position_parent: "Retail Marketing",
          id_position_atasan_langsung: "10163455",
          id: "10163465",
          assistant: false,
          isMergeFormation: false,
          id_org_unit: "10163465",
          id_position: "30313934",
          id_position_parent: "30313912",
          project: false,
          hasChildren: false,
        },
        {
          layering: "L3",
          org_unit_name: "B2C Marketing & Loyalty Program",
          pid: "10163455",
          gl: "GL2",
          position: "Manager B2C Marketing & Loyalty Program",
          prl: "21",
          jumlah_formasi: 12,
          coordinationWith: {},
          actionType: "Read",
          tags: [],
          coordination: false,
          isNeck: false,
          basket: false,
          position_parent: "Retail Marketing",
          id_position_atasan_langsung: "10163455",
          id: "10163465",
          assistant: false,
          isMergeFormation: false,
          id_org_unit: "10163465",
          id_position: "30313934",
          id_position_parent: "30313912",
          project: false,
          hasChildren: false,
        },
        {
          layering: "L4",
          org_unit_name: "Marketing Program",
          pid: "10163465",
          gl: "GL3",
          position: "Sr Officer III Marketing Program",
          prl: "16-18",
          jumlah_formasi: 1,
          coordinationWith: {},
          actionType: "Read",
          tags: [],
          coordination: false,
          isNeck: false,
          basket: false,
          position_parent: "B2C Marketing & Loyalty Program",
          id_position_atasan_langsung: "10163465",
          id: "10163466",
          assistant: false,
          isMergeFormation: false,
          id_org_unit: "10163466",
          id_position: "30313935",
          id_position_parent: "30313934",
          project: false,
          hasChildren: false,
        },
        {
          isMergeFormation: true,
          bc_1_org_unit_name: "Fuel Marketing Program",
          bc_1_basket: false,
          bc_2_id_position_atasan_langsung: "10163465",
          org_unit_name: "Fuel Marketing Program",
          gl: "GL3",
          bc_2_prl: "12-13",
          bc_1_jumlah_formasi: "1",
          bc_2_id_position_parent: null,
          basket: true,
          bc_1_actionType: "Read",
          bc_2_org_unit_name: "Fuel Marketing Program",
          id_position: "30313936",
          bc_2_id_position: "30313936",
          bc_1_id_position_atasan_langsung: "10163465",
          bc_2_basket: false,
          bc_1_position: "Officer I-II Fuel Marketing Program",
          bc_2_pid: "10163465",
          actionType: "Read",
          bc_2_position: "Jr Officer I-II Fuel Marketing Program",
          bc_2_jumlah_formasi: "1",
          coordinationWith: {},
          project: false,
          bc_1_gl: "3",
          bc_2_gl: "3",
          id_org_unit: "10163467",
          bc_2_layering: "L6",
          tags: ["basket_2"],
          isNeck: false,
          bc_2_idx: "2",
          coordination: false,
          position: "Fuel Marketing Program",
          bc_1_id_position: "30313936",
          bc_2_flagMergeFormation: "A",
          hasChildren: false,
          bc_1_idx: "1",
          position_parent: "B2C Marketing & Loyalty Program",
          jumlah_formasi: 1,
          bc_2_assistant: false,
          bc_1_prl: "14-15",
          bc_1_layering: "L5",
          id: "10163467",
          prl: "12-15",
          bc_1_id_org_unit: "10163467",
          id_position_parent: "30313934",
          bc_1_id: "10163467",
          bc_1_flagMergeFormation: "A",
          bc_2_position_parent: "B2C Marketing & Loyalty Program",
          layering: "L5",
          bc_2_id: "10163467",
          id_position_atasan_langsung: "10163465",
          pid: "10163465",
          bc_2_actionType: "Read",
          bc_2_id_org_unit: "10163467",
          bc_1_assistant: false,
          assistant: false,
          bc_1_pid: "10163465",
          bc_1_id_position_parent: null,
          bc_1_position_parent: "B2C Marketing & Loyalty Program",
        },
        {
          isMergeFormation: true,
          bc_1_org_unit_name: "Gas Marketing Program",
          bc_1_basket: false,
          bc_2_id_position_atasan_langsung: "10163465",
          org_unit_name: "Gas Marketing Program",
          gl: "GL3",
          bc_2_prl: "12-13",
          bc_1_jumlah_formasi: "1",
          bc_2_id_position_parent: null,
          basket: true,
          bc_1_actionType: "Read",
          bc_2_org_unit_name: "Gas Marketing Program",
          id_position: "30313937",
          bc_2_id_position: "30313937",
          bc_1_id_position_atasan_langsung: "10163465",
          bc_2_basket: false,
          bc_1_position: "Officer I-II Gas Marketing Program",
          bc_2_pid: "10163465",
          actionType: "Read",
          bc_2_position: "Jr Officer I-II Gas Marketing Program",
          bc_2_jumlah_formasi: "1",
          coordinationWith: {},
          project: false,
          bc_1_gl: "3",
          bc_2_gl: "3",
          id_org_unit: "10163468",
          bc_2_layering: "L6",
          tags: ["basket_2"],
          isNeck: false,
          bc_2_idx: "2",
          coordination: false,
          position: "Gas Marketing Program",
          bc_1_id_position: "30313937",
          bc_2_flagMergeFormation: "A",
          hasChildren: false,
          bc_1_idx: "1",
          position_parent: "B2C Marketing & Loyalty Program",
          jumlah_formasi: 1,
          bc_2_assistant: false,
          bc_1_prl: "14-15",
          bc_1_layering: "L5",
          id: "10163468",
          prl: "12-15",
          bc_1_id_org_unit: "10163468",
          id_position_parent: "30313934",
          bc_1_id: "10163468",
          bc_1_flagMergeFormation: "A",
          bc_2_position_parent: "B2C Marketing & Loyalty Program",
          layering: "L5",
          bc_2_id: "10163468",
          id_position_atasan_langsung: "10163465",
          pid: "10163465",
          bc_2_actionType: "Read",
          bc_2_id_org_unit: "10163468",
          bc_1_assistant: false,
          assistant: false,
          bc_1_pid: "10163465",
          bc_1_id_position_parent: null,
          bc_1_position_parent: "B2C Marketing & Loyalty Program",
        },
        {
          isMergeFormation: true,
          bc_1_org_unit_name: "Digital Marketing Program",
          bc_1_basket: false,
          bc_2_id_position_atasan_langsung: "10163465",
          org_unit_name: "Digital Marketing Program",
          gl: "GL3",
          bc_2_prl: "12-13",
          bc_1_jumlah_formasi: "1",
          bc_2_id_position_parent: null,
          basket: true,
          bc_1_actionType: "Read",
          bc_2_org_unit_name: "Digital Marketing Program",
          id_position: "30313938",
          bc_2_id_position: "30313938",
          bc_1_id_position_atasan_langsung: "10163465",
          bc_2_basket: false,
          bc_1_position: "Officer I-II Digital Marketing Program",
          bc_2_pid: "10163465",
          actionType: "Read",
          bc_2_position: "Jr Officer I-II Digital Marketing Program",
          bc_2_jumlah_formasi: "1",
          coordinationWith: {},
          project: false,
          bc_1_gl: "3",
          bc_2_gl: "3",
          id_org_unit: "10163469",
          bc_2_layering: "L6",
          tags: ["basket_2"],
          isNeck: false,
          bc_2_idx: "2",
          coordination: false,
          position: "Digital Marketing Program",
          bc_1_id_position: "30313938",
          bc_2_flagMergeFormation: "A",
          hasChildren: false,
          bc_1_idx: "1",
          position_parent: "B2C Marketing & Loyalty Program",
          jumlah_formasi: 1,
          bc_2_assistant: false,
          bc_1_prl: "14-15",
          bc_1_layering: "L5",
          id: "10163469",
          prl: "12-15",
          bc_1_id_org_unit: "10163469",
          id_position_parent: "30313934",
          bc_1_id: "10163469",
          bc_1_flagMergeFormation: "A",
          bc_2_position_parent: "B2C Marketing & Loyalty Program",
          layering: "L5",
          bc_2_id: "10163469",
          id_position_atasan_langsung: "10163465",
          pid: "10163465",
          bc_2_actionType: "Read",
          bc_2_id_org_unit: "10163469",
          bc_1_assistant: false,
          assistant: false,
          bc_1_pid: "10163465",
          bc_1_id_position_parent: null,
          bc_1_position_parent: "B2C Marketing & Loyalty Program",
        },
        {
          coordinationWith: {},
          bc_3_pid: "10163465",
          bc_3_layering: "L6",
          coordination: false,
          bc_2_jumlah_formasi: "1",
          org_unit_name: "Loyalty Program",
          bc_1_pid: "10163465",
          bc_2_prl: "14-15",
          bc_1_assistant: false,
          hasChildren: false,
          bc_1_layering: "L4",
          id_org_unit: "10163470",
          bc_2_position_parent: "B2C Marketing & Loyalty Program",
          bc_1_position_parent: "B2C Marketing & Loyalty Program",
          bc_3_org_unit_name: "Loyalty Program",
          tags: ["basket_3"],
          bc_1_gl: "3",
          bc_1_org_unit_name: "Loyalty Program",
          prl: "12-18",
          bc_1_jumlah_formasi: "1",
          layering: "L4",
          position: "Loyalty Program",
          bc_3_position_parent: "B2C Marketing & Loyalty Program",
          bc_2_org_unit_name: "Loyalty Program",
          bc_2_id_position_atasan_langsung: "10163465",
          id_position: "30313939",
          bc_2_flagMergeFormation: null,
          id_position_atasan_langsung: "10163465",
          bc_2_pid: "10163465",
          bc_3_id_position_atasan_langsung: "10163465",
          position_parent: "B2C Marketing & Loyalty Program",
          bc_3_gl: "3",
          bc_3_actionType: "Read",
          bc_1_position: "Sr Officer I-III Loyalty Program",
          bc_1_basket: false,
          bc_1_id_position_atasan_langsung: "10163465",
          gl: "GL3",
          bc_3_id_position_parent: null,
          isMergeFormation: false,
          bc_2_actionType: "Read",
          bc_3_assistant: false,
          assistant: false,
          bc_1_idx: "1",
          bc_3_idx: "3",
          bc_3_basket: false,
          bc_2_gl: "3",
          bc_1_id_position_parent: null,
          basket: true,
          bc_1_id: "10163470",
          bc_1_id_position: "30313939",
          isNeck: false,
          bc_3_id: "10163470",
          bc_1_flagMergeFormation: null,
          bc_1_id_org_unit: "10163470",
          id: "10163470",
          bc_2_assistant: false,
          bc_2_id: "10163470",
          bc_3_id_org_unit: "10163470",
          bc_3_id_position: "30313939",
          bc_3_position: "Jr Officer I-II Loyalty Program",
          bc_3_flagMergeFormation: null,
          jumlah_formasi: 1,
          bc_3_jumlah_formasi: "1",
          bc_2_layering: "L5",
          pid: "10163465",
          bc_2_id_position: "30313939",
          bc_2_id_position_parent: null,
          bc_3_prl: "12-13",
          bc_2_idx: "2",
          bc_2_basket: false,
          bc_1_actionType: "Read",
          bc_2_position: "Officer I-II Loyalty Program",
          id_position_parent: "30313934",
          actionType: "Read",
          project: false,
          bc_1_prl: "16-18",
          bc_2_id_org_unit: "10163470",
        },
        {
          layering: "L4",
          org_unit_name: "Brand Management",
          pid: "10163465",
          gl: "GL3",
          position: "Sr Officer II Brand Management",
          prl: "16-17",
          jumlah_formasi: 1,
          coordinationWith: {},
          actionType: "Read",
          tags: [],
          coordination: false,
          isNeck: false,
          basket: false,
          position_parent: "B2C Marketing & Loyalty Program",
          id_position_atasan_langsung: "10163465",
          id: "10163471",
          assistant: false,
          isMergeFormation: false,
          id_org_unit: "10163471",
          id_position: "30313942",
          id_position_parent: "30313934",
          project: false,
          hasChildren: false,
        },
        {
          isMergeFormation: true,
          bc_1_org_unit_name: "Fuel Brand Management",
          bc_1_basket: false,
          bc_2_id_position_atasan_langsung: "10163465",
          org_unit_name: "Fuel Brand Management",
          gl: "GL3",
          bc_2_prl: "12-13",
          bc_1_jumlah_formasi: "1",
          bc_2_id_position_parent: null,
          basket: true,
          bc_1_actionType: "Read",
          bc_2_org_unit_name: "Fuel Brand Management",
          id_position: "30313943",
          bc_2_id_position: "30313943",
          bc_1_id_position_atasan_langsung: "10163465",
          bc_2_basket: false,
          bc_1_position: "Officer I-II Fuel Brand Management",
          bc_2_pid: "10163465",
          actionType: "Read",
          bc_2_position: "Jr Officer I-II Fuel Brand Management",
          bc_2_jumlah_formasi: "1",
          coordinationWith: {},
          project: false,
          bc_1_gl: "3",
          bc_2_gl: "3",
          id_org_unit: "10163472",
          bc_2_layering: "L6",
          tags: ["basket_2"],
          isNeck: false,
          bc_2_idx: "2",
          coordination: false,
          position: "Fuel Brand Management",
          bc_1_id_position: "30313943",
          bc_2_flagMergeFormation: "A",
          hasChildren: false,
          bc_1_idx: "1",
          position_parent: "B2C Marketing & Loyalty Program",
          jumlah_formasi: 1,
          bc_2_assistant: false,
          bc_1_prl: "14-15",
          bc_1_layering: "L5",
          id: "10163472",
          prl: "12-15",
          bc_1_id_org_unit: "10163472",
          id_position_parent: "30313934",
          bc_1_id: "10163472",
          bc_1_flagMergeFormation: "A",
          bc_2_position_parent: "B2C Marketing & Loyalty Program",
          layering: "L5",
          bc_2_id: "10163472",
          id_position_atasan_langsung: "10163465",
          pid: "10163465",
          bc_2_actionType: "Read",
          bc_2_id_org_unit: "10163472",
          bc_1_assistant: false,
          assistant: false,
          bc_1_pid: "10163465",
          bc_1_id_position_parent: null,
          bc_1_position_parent: "B2C Marketing & Loyalty Program",
        },
        {
          isMergeFormation: true,
          bc_1_org_unit_name: "Gas Brand Management",
          bc_1_basket: false,
          bc_2_id_position_atasan_langsung: "10163465",
          org_unit_name: "Gas Brand Management",
          gl: "GL3",
          bc_2_prl: "12-13",
          bc_1_jumlah_formasi: "1",
          bc_2_id_position_parent: null,
          basket: true,
          bc_1_actionType: "Read",
          bc_2_org_unit_name: "Gas Brand Management",
          id_position: "30313944",
          bc_2_id_position: "30313944",
          bc_1_id_position_atasan_langsung: "10163465",
          bc_2_basket: false,
          bc_1_position: "Officer I-II Gas Brand Management",
          bc_2_pid: "10163465",
          actionType: "Read",
          bc_2_position: "Jr Officer I-II Gas Brand Management",
          bc_2_jumlah_formasi: "1",
          coordinationWith: {},
          project: false,
          bc_1_gl: "3",
          bc_2_gl: "3",
          id_org_unit: "10163473",
          bc_2_layering: "L6",
          tags: ["basket_2"],
          isNeck: false,
          bc_2_idx: "2",
          coordination: false,
          position: "Gas Brand Management",
          bc_1_id_position: "30313944",
          bc_2_flagMergeFormation: "A",
          hasChildren: false,
          bc_1_idx: "1",
          position_parent: "B2C Marketing & Loyalty Program",
          jumlah_formasi: 1,
          bc_2_assistant: false,
          bc_1_prl: "14-15",
          bc_1_layering: "L5",
          id: "10163473",
          prl: "12-15",
          bc_1_id_org_unit: "10163473",
          id_position_parent: "30313934",
          bc_1_id: "10163473",
          bc_1_flagMergeFormation: "A",
          bc_2_position_parent: "B2C Marketing & Loyalty Program",
          layering: "L5",
          bc_2_id: "10163473",
          id_position_atasan_langsung: "10163465",
          pid: "10163465",
          bc_2_actionType: "Read",
          bc_2_id_org_unit: "10163473",
          bc_1_assistant: false,
          assistant: false,
          bc_1_pid: "10163465",
          bc_1_id_position_parent: null,
          bc_1_position_parent: "B2C Marketing & Loyalty Program",
        },
        {
          isMergeFormation: true,
          bc_1_org_unit_name: "Digital Brand Management",
          bc_1_basket: false,
          bc_2_id_position_atasan_langsung: "10163465",
          org_unit_name: "Digital Brand Management",
          gl: "GL3",
          bc_2_prl: "12-13",
          bc_1_jumlah_formasi: "1",
          bc_2_id_position_parent: null,
          basket: true,
          bc_1_actionType: "Read",
          bc_2_org_unit_name: "Digital Brand Management",
          id_position: "30313945",
          bc_2_id_position: "30313945",
          bc_1_id_position_atasan_langsung: "10163465",
          bc_2_basket: false,
          bc_1_position: "Officer I-II Digital Brand Management",
          bc_2_pid: "10163465",
          actionType: "Read",
          bc_2_position: "Jr Officer I-II Digital Brand Management",
          bc_2_jumlah_formasi: "1",
          coordinationWith: {},
          project: false,
          bc_1_gl: "3",
          bc_2_gl: "3",
          id_org_unit: "10163474",
          bc_2_layering: "L6",
          tags: ["basket_2"],
          isNeck: false,
          bc_2_idx: "2",
          coordination: false,
          position: "Digital Brand Management",
          bc_1_id_position: "30313945",
          bc_2_flagMergeFormation: "A",
          hasChildren: false,
          bc_1_idx: "1",
          position_parent: "B2C Marketing & Loyalty Program",
          jumlah_formasi: 1,
          bc_2_assistant: false,
          bc_1_prl: "14-15",
          bc_1_layering: "L5",
          id: "10163474",
          prl: "12-15",
          bc_1_id_org_unit: "10163474",
          id_position_parent: "30313934",
          bc_1_id: "10163474",
          bc_1_flagMergeFormation: "A",
          bc_2_position_parent: "B2C Marketing & Loyalty Program",
          layering: "L5",
          bc_2_id: "10163474",
          id_position_atasan_langsung: "10163465",
          pid: "10163465",
          bc_2_actionType: "Read",
          bc_2_id_org_unit: "10163474",
          bc_1_assistant: false,
          assistant: false,
          bc_1_pid: "10163465",
          bc_1_id_position_parent: null,
          bc_1_position_parent: "B2C Marketing & Loyalty Program",
        },
      ],
    };

    // Update chart data (assuming this function handles chart rendering)
    renderOrgChart(dataChart.data, nodeId, true);
    // renderOrgChart(test1, "10132410", true);

    // Wait for chart to complete rendering before hiding loading
    setTimeout(() => {
      if (typeof hideChartLoading === "function") {
        hideChartLoading("chart-container-custom");
      }
    }, 1500); // Wait 1.5 seconds for chart to fully render
  } catch (error) {
    console.error("Error in focusNode:", error);

    // Hide loading on error
    if (typeof hideChartLoading === "function") {
      hideChartLoading("chart-container-custom");
    }

    // Show error message
    const container = document.querySelector(".chart-container-custom") || document.getElementById("osContainer");
    if (container) {
      container.innerHTML =
        '<div style="text-align: center; padding: 20px; color: #999;">Chart loading failed. Please try again.</div>';
    }
  }
}

// Organization Chart Loading Functions
function showChartLoading(
  containerClass,
  isCustom = false,
  height = "480px",
  width = "100%",
  text = "Loading Chart...",
) {
  let container = document.querySelector(`.${containerClass}`);
  container.innerHTML = CHART_LOADING_HTML;

  // Ensure container has proper positioning for loading overlay
  const containerStyle = window.getComputedStyle(container);
  if (containerStyle.position === "static") {
    container.style.position = "relative";
  }

  // Ensure container has minimum dimensions for chart (1200x800)
  if (containerStyle.width === "0px" || containerStyle.height === "0px") {
    if (isCustom) {
      container.style.minHeight = height;
      container.style.minWidth = width;
      const headerLoading = container.querySelector("#header-loading-chart");
      if (headerLoading) {
        headerLoading.innerText = text;
      }
    } else {
      container.style.minWidth = "1200px";
      container.style.minHeight = "800px";
    }
  } else {
    if (isCustom) {
      container.style.minHeight = height;
      container.style.minWidth = width;
      const headerLoading = container.querySelector("#header-loading-chart");
      if (headerLoading) {
        headerLoading.innerText = text;
      }
    } else {
      container.style.minWidth = "1200px";
      container.style.minHeight = "800px";
    }
  }
}
function hideChartLoading(containerClass) {
  let container = document.querySelector(`.${containerClass}`);
  // Remove loading overlay and styles
  const loadingOverlay = container.querySelector("#chart-loading-overlay");
  const loadingStyle = container.querySelector("style");

  if (loadingOverlay) {
    loadingOverlay.remove();
  }
  if (loadingStyle) {
    loadingStyle.remove();
  }
}

// Toggle visibility of #addJobPJ and #addJobReferencePJ buttons based on persyaratanJabatan data length
function updateAddJobPJVisibility(params, data) {
  $("#addJobPJ, #addJobReferencePJ").show();
  if (params === "persyaratanJabatan" && data.length >= 1) {
    $("#addJobPJ, #addJobReferencePJ").hide();
  }
}

// Action button functions for table rows
function editData(params, index) {
  // Get data from localStorage based on the params
  if (params == "koordinasi") params = "koordinasiInternal";
  if (params == "relation") params = "relasiEksternal";
  if (params == "tugasHa") params = "tugasHa";
  if (params == "stk") params = "stk";
  if (params == "persyaratanKhusus") params = "persyaratanKhusus";
  if (params == "persyaratanJabatan") params = "persyaratanJabatan";

  let data = [];
  try {
    const storageData = localStorage.getItem(params);
    data = storageData ? JSON.parse(storageData) : [];

    updateAddJobPJVisibility(params, data);
  } catch (error) {
    swal("Error", "Failed to load data for editing", "error");
    return;
  }

  // Check if index is valid
  if (index < 0 || index >= data.length) {
    swal("Error", "Invalid data index", "error");
    return;
  }

  const itemToEdit = data[index];

  // Show confirmation before editing
  swal({
    title: "Edit Item",
    text: "Do you want to edit this item?",
    icon: "info",
    buttons: {
      cancel: "Cancel",
      confirm: "Edit",
    },
  }).then((willEdit) => {
    if (willEdit) {
      params == "relasiEksternal" ? (params = "relation") : params;
      params == "koordinasiInternal" ? (params = "koordinasi") : params;
      console.log("Editing item:", itemToEdit, "at index:", index, "in params:", params);
      updateJobDescItem(params, index, false);
    }
  });
}

function deleteData(params, index) {
  let paramsLs;
  if (params == "koordinasi") paramsLs = "koordinasiInternal";
  if (params == "relation") paramsLs = "relasiEksternal";
  if (params == "tugasHa") paramsLs = "tugasHa";
  if (params == "stk") paramsLs = "stk";
  if (params == "persyaratanKhusus") paramsLs = "persyaratanKhusus";
  if (params == "persyaratanJabatan") paramsLs = "persyaratanJabatan";

  console.log("Attempting to delete item at index:", index, "in params:", paramsLs);
  // Get data from localStorage based on the params
  let data = [];
  try {
    const storageData = localStorage.getItem(paramsLs);
    let arrayDeleted = [];
    if (paramsLs === "tugasHa") {
      const findDeleted = JSON.parse(storageData).find((item, idx) => idx === index);
      findDeleted.tanggungJawabProses.forEach((element) => {
        arrayDeleted.push(element);
      });
      updateCalculateLsAvailable([], arrayDeleted);
    }
    data = storageData ? JSON.parse(storageData) : [];
  } catch (error) {
    console.error("Error parsing localStorage data:", error);
    swal("Error", "Failed to load data for deletion", "error");
    return;
  }

  // Check if index is valid
  if (index < 0 || index >= data.length) {
    swal("Error", "Invalid data index", "error");
    return;
  }

  const itemToDelete = data[index];
  console.log("Attempting to delete item:", itemToDelete, "at index:", index, "in params:", paramsLs);
  // Show confirmation before deleting
  swal({
    title: "Are you sure?",
    text: "This action cannot be undone. Do you want to delete this item?",
    icon: "warning",
    buttons: {
      cancel: "Cancel",
      confirm: {
        text: "Delete",
        value: true,
        className: "btn-danger",
      },
    },
    dangerMode: true,
  }).then((willDelete) => {
    if (willDelete) {
      // Remove item from array
      data.splice(index, 1);

      // Update localStorage using the correct localStorage key
      localStorage.setItem(paramsLs, JSON.stringify(data));

      // Refresh the table display using the original params for table name
      refreshTableDisplay(params, data);
      updateAddJobPJVisibility(params, data);

      swal("Deleted!", "The item has been deleted successfully.", "success");
    }
  });
}

function mergeData(params, index) {
  $("#modalBusProMerge").modal("show");
  const tugasHaData = localStorage.getItem("tugasHa") !== "" ? JSON.parse(localStorage.getItem("tugasHa")) : [];
  if (tugasHaData.length === 0) {
    swal("Info", "No Tugas dan Tanggung Jawab Akhir data available to merge.", "info");
    return;
  }
  // give index number to each item in tugasHaData
  tugasHaData.forEach((item, idx) => {
    item.index = idx;
  });
  // get data selected by index
  const getDataSelected = tugasHaData[index];
  const getDataElsewhere = tugasHaData.filter((item, idx) => idx !== index);

  const modalBusProMergeBody = document.getElementById("modalBusProMergeBody");
  const uniqueBusPro = getDataSelected.tanggungJawabProses.filter(
    (process, index, self) => index === self.findIndex((p) => p.indexNumber === process.indexNumber),
  );
  const textUniqueBusPro = uniqueBusPro.map((process) => process.indexNumber + " - " + process.description);
  modalBusProMergeBody.innerHTML = "";
  let content = `
    <div class="mb-3">
        <input type="hidden" id="mergeIndexSelected" value="${getDataSelected.index}" />
        <h6 class="modal-title" id="">Description No. ${getDataSelected.index + 1}</h6> 
        <h6 class="modal-title" id="modalBusProMergeLabel">${textUniqueBusPro.join(", ")}</h6> 
    </div>
      <div class="table-responsive" style="overflow-x: auto;">
        <table class="tableMasterData" id="relatedBusProTable" style="width:100%">
          <thead>
            <tr>
              <th style="width:10%">
                <input type="checkbox" id="selectAllBusPro" onclick="toggleSelectAllBusPro(this)" />
              </th>
              <th style="width:15%">Description No.</th>
              <th style="width:75%">Related Business Process</th>
            </tr>
          </thead>
          <tbody class="tbodBisproMerge">
          </tbody>
        </table>
      </div>
        `;
  modalBusProMergeBody.innerHTML = content;
  let tbodBisproMerge = document.querySelector(".tbodBisproMerge");
  for (let [idx, item] of getDataElsewhere.entries()) {
    // unique indexNumber from item.tanggungJawabProses
    const uniqueIndex = item.tanggungJawabProses.filter(
      (process, index, self) => index === self.findIndex((p) => p.indexNumber === process.indexNumber),
    );
    let textIndexDescription = uniqueIndex.map((process) => process.indexNumber + " - " + process.description);
    tbodBisproMerge.innerHTML += `
        <tr>
          <td class="p-3" style="place-content: center">
            <input type="checkbox" class="checkboxBusPro" value="${item.index}" />
          </td>
          <td class="p-3" style="place-content: center">
            <span class="">${item.index + 1}</span>
          </td>
          <td class="p-3" style="place-content: flex-start">
            <span class="">${textIndexDescription.join(", ")}</span>
          </td>
        </tr>
      `;
  }
}

async function mergeBusPro() {
  const mergeIndexSelected = document.getElementById("mergeIndexSelected").value;
  const checkboxes = Array.from(document.querySelectorAll(".checkboxBusPro:checked"));
  if (checkboxes.length === 0) {
    swal("Info", "Please select at least one item to merge.", "info");
    return;
  }
  const confirm = await confirmFunction(
    "Merge Business Processes",
    "Are you sure you want to merge the selected business processes?",
  );
  if (!confirm) return;
  const selectedIndexes = checkboxes.map((checkbox) => parseInt(checkbox.value));
  const tugasHaData = localStorage.getItem("tugasHa") !== "" ? JSON.parse(localStorage.getItem("tugasHa")) : [];
  const itemToMerge = tugasHaData[mergeIndexSelected];

  console.log("Merging item at index:", mergeIndexSelected, "with selected indexes:", selectedIndexes);
  console.log("Item to merge before:", itemToMerge);

  // Merge tanggungJawabProses from selected items into itemToMerge, avoiding duplicates, and merge lead, output, responsible as well
  selectedIndexes.forEach((idx) => {
    const item = tugasHaData[idx];
    item.tanggungJawabProses.forEach((process) => {
      // Check for duplicates before adding
      if (!itemToMerge.tanggungJawabProses.some((p) => p.indexNumber === process.indexNumber)) {
        itemToMerge.tanggungJawabProses.push(process);
      }
    });

    // Merge lead, output, responsible - handle both string and array types
    ["lead", "output", "responsible"].forEach((field) => {
      if (!item[field]) return;

      // Ensure itemToMerge[field] is an array
      if (!itemToMerge[field]) {
        itemToMerge[field] = [];
      } else if (!Array.isArray(itemToMerge[field])) {
        itemToMerge[field] = [itemToMerge[field]];
      }

      const values = Array.isArray(item[field]) ? item[field] : [item[field]];
      values.forEach((val) => {
        if (val && !itemToMerge[field].some((existing) => JSON.stringify(existing) === JSON.stringify(val))) {
          itemToMerge[field].push(val);
        }
      });
    });
  });

  // Calculate how many items before mergeIndexSelected will be removed
  const itemsRemovedBefore = selectedIndexes.filter((idx) => idx < mergeIndexSelected).length;
  const newMergeIndex = mergeIndexSelected - itemsRemovedBefore;

  // Remove merged items from tugasHaData (sort indexes descending to avoid shifting issues)
  const sortedIndexes = selectedIndexes.sort((a, b) => b - a);
  sortedIndexes.forEach((idx) => {
    tugasHaData.splice(idx, 1);
  });

  // Update the merged item at the correct position after removals
  tugasHaData[newMergeIndex] = itemToMerge;

  // Update localStorage
  localStorage.setItem("tugasHa", JSON.stringify(tugasHaData));
  // Refresh table display
  refreshTableDisplay("tugasHa", tugasHaData);
  $("#modalBusProMerge").modal("hide");
  swal("Success", "Business processes merged successfully.", "success");
}

// Helper function to refresh table display after deletion
function refreshTableDisplay(params, data) {
  try {
    // Determine the appropriate table headers based on params
    let tableHeaders = [];
    switch (params) {
      case "tugasHa":
        tableHeaders = [...tabCusJD.tugasHa, "action"];
        break;
      case "koordinasi":
        tableHeaders = [...tabCusJD.koordinasi, "action"];
        break;
      case "relation":
        tableHeaders = [...tabCusJD.relation, "action"];
        break;
      case "stk":
        tableHeaders = [...tabCusJD.stk, "action"];
        break;
      case "persyaratanKhusus":
        tableHeaders = [...tabCusJD.persyaratanKhusus, "action"];
        break;
      case "persyaratanJabatan":
        tableHeaders = [...tabCusJD.persyaratanJabatan, "action"];
        break;
      default:
        return;
    }

    // Update the table using existing updateTable function
    updateTable(params, data, tableHeaders);
  } catch (error) {
    console.error("Error refreshing table display:", error);
  }
}

async function saveJobDescItem(type, id, isAdd = true) {
  const ls = mappingAddUpdate[type];

  if (!ls) {
    swal("Error", "Unsupported item type for saving", "error");
    return;
  }
  const confirm = await confirmFunction("Save Item", `Are you sure you want to ${isAdd ? "add" : "update"} this item?`);
  if (!confirm) return;
  const isMustBulletedList = MUST_BULLETED_LIST.includes(type);
  if (isAdd) {
    const lsData =
      localStorage.getItem(ls.ls) == "" ||
      localStorage.getItem(ls.ls) == null ||
      localStorage.getItem(ls.ls) == undefined
        ? []
        : JSON.parse(localStorage.getItem(ls.ls));
    console.log("lsData before add", lsData);
    const newItem = { ...ls.defaultData };
    // get data from ckeditor instance or fallback to element content
    // const lsParam = type;
    // let tableParam = type;
    ls.ids.forEach((itemId) => {
      const element = document.querySelector(`#${itemId}`);
      if (element && element.ckeditorInstance) {
        let data = element.ckeditorInstance.getData();
        // Remove wrapping p tags from CKEditor data
        data = data.replace(/^<p>|<\/p>$/g, "").trim();
        if (data.includes("<ul>") && data.includes("<li>")) {
          // Extract list items and convert to array
          const listItems = data.match(/<li>(.*?)<\/li>/g);
          if (listItems) {
            const arrayData = listItems.map((item) => item.replace(/<\/?li>/g, "").trim());
            newItem[itemId] = arrayData;
          } else {
            newItem[itemId] = data;
          }
        } else {
          newItem[itemId] = data;
        }
      } else if (element) {
        newItem[itemId] = element.value || element.innerHTML;
      }
    });
    if (type === "tugasHa") {
      const arraySelectedBusPro = JSON.parse(localStorage.getItem("arraySelectedBusPro")) || [];
      const arrayRemovedBusPro = JSON.parse(localStorage.getItem("arrayRemovedBusPro")) || [];
      if (arraySelectedBusPro.length > 0) {
        newItem.tanggungJawabProses = arraySelectedBusPro;
      } else {
        newItem.tanggungJawabProses = [];
        swal("Warning", "Please select at least one Business Process for Tugas dan Tanggung Jawab Akhir", "warning");
        return;
      }
      updateCalculateLsAvailable(arraySelectedBusPro, arrayRemovedBusPro);
    }
    console.log("newItem", newItem);
    lsData.push(newItem);
    localStorage.setItem(ls.ls, JSON.stringify(lsData));
    if (type === "persyaratanJabatan") {
      updateAddJobPJVisibility(type, lsData);
    }
    console.log("lsData", lsData);
    console.log("type", type);
    updateTable(type, lsData, [...tabCusJD[type], "action"]);
    $("#modalAddJobDescItem").modal("hide");
    swal("Success", `${type.toUpperCase()} item added successfully`, "success");
    return;
  } else {
    const lsData = localStorage.getItem(ls.ls) !== "" ? JSON.parse(localStorage.getItem(ls.ls)) : [];
    if (id === undefined || !lsData[id]) {
      swal("Error", "Invalid item ID for update", "error");
      return;
    }
    // Update existing item
    ls.ids.forEach((itemId) => {
      const element = document.querySelector(`#${itemId}`);
      if (element && element.ckeditorInstance) {
        let data = element.ckeditorInstance.getData();
        // Remove wrapping p tags from CKEditor data
        data = data.replace(/^<p>|<\/p>$/g, "").trim();

        //  if isMustBulletedList and data does not contain bulleted list, then seperate per paragraph and convert to array
        // Check if data contains bulleted list and convert to array
        if (data.includes("<ul>") && data.includes("<li>")) {
          // Extract list items and convert to array
          const listItems = data.match(/<li>(.*?)<\/li>/g);
          if (listItems) {
            const arrayData = listItems.map((item) => item.replace(/<\/?li>/g, "").trim());
            lsData[id][itemId] = arrayData;
          } else {
            lsData[id][itemId] = data;
          }
        } else {
          lsData[id][itemId] = isMustBulletedList
            ? data
                .split(/<\/?p>/)
                .map((line) => line.trim())
                .filter((line) => line !== "")
            : data;
        }
      } else if (element) {
        lsData[id][itemId] = isMustBulletedList
          ? element.value
            ? element.value
                .split(/<\/?p>/)
                .map((line) => line.trim())
                .filter((line) => line !== "")
            : []
          : element.value || element.innerHTML;
      }
    });

    if (type === "tugasHa") {
      const arraySelectedBusPro = JSON.parse(localStorage.getItem("arraySelectedBusPro")) || [];
      if (arraySelectedBusPro.length > 0) {
        lsData[id].tanggungJawabProses = arraySelectedBusPro;
      } else {
        lsData[id].tanggungJawabProses = [];
        swal("Warning", "Please select at least one Business Process for Tugas dan Tanggung Jawab Akhir", "warning");
        return;
      }
      const arrayRemovedBusPro = JSON.parse(localStorage.getItem("arrayRemovedBusPro")) || [];
      // update localStorage arraySelectedBusPro to empty array and lsAvailable notAvailable to full data
      updateCalculateLsAvailable(arraySelectedBusPro, arrayRemovedBusPro);
    }
    localStorage.setItem(ls.ls, JSON.stringify(lsData));
    updateTable(type, lsData, [...tabCusJD[type], "action"]);
    $("#modalAddJobDescItem").modal("hide");
    swal("Success", `${type.toUpperCase()} item updated successfully`, "success");
    return;
  }
}

function updateCalculateLsAvailable(arraySelectedBusPro = [], arrayRemovedBusPro = []) {
  const lsAvailable = JSON.parse(localStorage.getItem("lsAvailable")) || {};
  let notAvailable = lsAvailable.notAvailable || [];
  let available = lsAvailable.available || [];
  let countAll = lsAvailable.countAll || 0;
  let codeAvailable = lsAvailable.codeAvailable || [];
  let codeNotAvailable = lsAvailable.codeNotAvailable || [];
  let countAvailable = lsAvailable.countAvailable || 0;
  let countNotAvailable = lsAvailable.countNotAvailable || 0;

  if (arraySelectedBusPro.length > 0) {
    // ada pergerakan
    // takeout arraySelectedBusPro from notAvailable and push to available
    arraySelectedBusPro.forEach((item) => {
      const index = notAvailable.findIndex((i) => i.indexNumber === item.indexNumber);
      if (index !== -1) {
        available.push(notAvailable[index]);
        notAvailable.splice(index, 1);
      }
    });
  }
  if (arrayRemovedBusPro.length > 0) {
    // ada pergerakan
    // takeout arrayRemovedBusPro from available and push to notAvailable
    arrayRemovedBusPro.forEach((item) => {
      const index = available.findIndex((i) => i.indexNumber === item.indexNumber);
      if (index !== -1) {
        notAvailable.push(available[index]);
        available.splice(index, 1);
      }
    });
  }

  countAll = available.length + notAvailable.length;
  countAvailable = available.length;
  countNotAvailable = notAvailable.length;
  // available status = 'AVAILABLE', notAvailable status = 'NOT AVAILABLE'
  available = available.map((item) => ({ ...item, status: "AVAILABLE" }));
  notAvailable = notAvailable.map((item) => ({ ...item, status: "NOT AVAILABLE" }));
  codeAvailable = [...new Set(available.map((item) => item.indexNumber))];
  codeNotAvailable = [...new Set(notAvailable.map((item) => item.indexNumber))];

  localStorage.setItem(
    "lsAvailable",
    JSON.stringify({
      available,
      notAvailable,
      countAll,
      codeAvailable,
      codeNotAvailable,
      countAvailable,
      countNotAvailable,
    }),
  );
  localStorage.setItem("arraySelectedBusPro", JSON.stringify([]));
  const isFullFilled = countAvailable === countAll || countNotAvailable === 0;
  const $label = $("#labelFulfillTugasHa");
  $label
    .toggleClass("label-success-custom", isFullFilled)
    .toggleClass("label-danger-custom", !isFullFilled)
    .css("cursor", "pointer")
    .attr("title", "Click to see detail");

  if (!isFullFilled) {
    $label.html(
      `${countAvailable}/${countAll} of business processes have been fulfilled. You can add them by clicking add data or add from references button. [See detail]`,
    );
  } else {
    $label.html(`All business processes have been fulfilled (${countAll}/${countAll})`);
  }
}

function relatedBusPro() {
  // $("#modalAddJobDescItem").modal("hide");
  $("#modalRelatedBusPro").modal("show");
  const modalRelatedBusPro = document.getElementById("modalRelatedBusProBody");
  const lsAvailable = JSON.parse(localStorage.getItem("lsAvailable"));
  const allResponsibilites = [...lsAvailable.notAvailable, ...lsAvailable.available];
  modalRelatedBusPro.innerHTML = "";
  let content = `
      <div class="table-responsive" style="overflow-x: auto;">
        <table class="tableMasterData" id="relatedBusProTable" style="width:100%">
          <thead>
            <tr>
              <th style="width:20%">
                <input type="checkbox" id="selectAllBusPro" onclick="toggleSelectAllBusPro(this)" />
              </th>
              <th style="width:80%">Business Process</th>
            </tr>
          </thead>
          <tbody class="tbodBispro">
          </tbody>
        </table>
      </div>
        `;
  modalRelatedBusPro.innerHTML = content;
  let tbodBispro = document.querySelector(".tbodBispro");
  for (let item of allResponsibilites) {
    tbodBispro.innerHTML += `
        <tr>
          <td class="p-3" style="place-content: center">
            <input type="checkbox" class="checkboxBusPro" value="${item.indexNumber}" />
          </td>
          <td class="p-3" style="place-content: flex-start">
            <span class="">${item.indexNumber} - ${item.description}</span>
          </td>
        </tr>
      `;
  }
  if (allResponsibilites.length === 0) {
    tbodBispro.innerHTML = `
        <tr class="no-data-row">
          <td colspan="2" class="text-center p-3">
            No business processes available to add.
          </td>
        </tr>
      `;
    $("#addSelectedBusProBtn").prop("disabled", true);
  }
}

function toggleSelectAllBusPro(source) {
  const checkboxes = document.querySelectorAll(".checkboxBusPro");
  const searchTerm = document.getElementById("searchBusinessProcess").value.toLowerCase();
  const visibleCheckboxes = Array.from(checkboxes).filter((checkbox) => {
    const row = checkbox.closest("tr");
    return row && row.style.display !== "none";
  });
  const checkboxesToToggle = searchTerm ? visibleCheckboxes : checkboxes;
  checkboxesToToggle.forEach((checkbox) => {
    checkbox.checked = source.checked;
  });
}

async function addSelectedBusPro() {
  const selectedCheckboxes = Array.from(document.querySelectorAll(".checkboxBusPro:checked"));
  if (selectedCheckboxes.length === 0) {
    swal("Warning", "Please select at least one business process", "warning");
    return;
  }
  const lsAvailable = JSON.parse(localStorage.getItem("lsAvailable"));
  const allResponsibilites = [...lsAvailable.notAvailable, ...lsAvailable.available];
  const selectedValues = selectedCheckboxes
    .map((checkbox) => checkbox.value)
    .map((value) => {
      const matchedItem = allResponsibilites.find((item) => item.indexNumber === value);
      return {
        indexNumber: matchedItem ? matchedItem.indexNumber : null,
        description: matchedItem ? matchedItem.description : null,
        code: matchedItem ? matchedItem.code : null,
      };
    })
    .filter((item) => item.indexNumber !== null);

  const confirm = await confirmFunction(
    "Add Business Processes",
    `Are you sure you want to add the selected business processes?`,
  );
  if (!confirm) return;
  const existingSelected = JSON.parse(localStorage.getItem("arraySelectedBusPro")) || [];
  const combinedSelected = Array.from(new Set([...existingSelected, ...selectedValues]));
  selectedValues.length = 0;
  localStorage.setItem("arraySelectedBusPro", JSON.stringify(combinedSelected));

  const selectedBusProContainer = document.getElementById("selectedBusProContainer");
  selectedBusProContainer.innerHTML = "";
  const arraySelectedBusPro = JSON.parse(localStorage.getItem("arraySelectedBusPro")) || [];
  arraySelectedBusPro.forEach((val) => {
    selectedBusProContainer.innerHTML += `
      <div class="badge bg-primary m-1 p-2" style="font-size: 0.9rem;">
        ${val.indexNumber} - ${val.description}
        <span class="icon-delete" onclick="removeSelectedBusPro('${val.indexNumber}')">&times;</span>
      </div>
    `;
  });
  // uncheck all checkboxes in modalRelatedBusPro
  document.getElementById("selectAllBusPro").checked = false;
  const checkboxes = document.querySelectorAll(".checkboxBusPro");
  checkboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });
  // close modal

  swal("Success", "Selected business processes added", "success");
  $("#modalRelatedBusPro").modal("hide");
}

async function removeSelectedBusPro(value) {
  const confirm = await confirmFunction(
    "Remove Business Process",
    `Are you sure you want to remove the business process ${value}?`,
  );
  if (!confirm) return;

  let selectedValues = JSON.parse(localStorage.getItem("arraySelectedBusPro")) || [];
  const removedValue = selectedValues.find((item) => item.indexNumber === value);
  selectedValues = selectedValues.filter((item) => item.indexNumber !== value);
  localStorage.setItem("arraySelectedBusPro", JSON.stringify(selectedValues));
  const selectedBusProContainer = document.getElementById("selectedBusProContainer");
  selectedBusProContainer.innerHTML = "";
  const arraySelectedBusPro = JSON.parse(localStorage.getItem("arraySelectedBusPro")) || [];
  arraySelectedBusPro.forEach((val) => {
    selectedBusProContainer.innerHTML += `
      <div class="badge bg-primary m-1 p-2" style="font-size: 0.9rem;">
        ${val.indexNumber} - ${val.description}
        <span class="icon-delete" onclick="removeSelectedBusPro('${val.indexNumber}')">&times;</span>
      </div>
    `;
  });

  // add value back to notAvailable in lsAvailable
  const removeSelected = JSON.parse(localStorage.getItem("arrayRemovedBusPro")) || [];
  removeSelected.push(removedValue);
  localStorage.setItem("arrayRemovedBusPro", JSON.stringify(removeSelected));

  // uncheck checkbox in modalRelatedBusPro
  swal("Success", "Selected business processes removed", "success");
  $("#modalRelatedBusPro").modal("hide");
}

$("#searchBusinessProcess").on("input", function () {
  // filterBusinessProcessTable();
  const searchTerm = $(this).val().toLowerCase();
  $("#relatedBusProTable tbody tr").each(function () {
    const rowText = $(this).text().toLowerCase();
    $(this).toggle(rowText.includes(searchTerm));
  });
});

$("#searchRasciAvailability").on("input", function () {
  filterRasciAvailability();
});
$("#availableCheckbox, #notAvailableCheckbox").on("change", filterRasciAvailability);

function filterRasciAvailability() {
  const availableChecked = $("#availableCheckbox").is(":checked");
  const notAvailableChecked = $("#notAvailableCheckbox").is(":checked");
  const searchTerm = $("#searchRasciAvailability").val().toLowerCase();
  let visibleRowCount = 0;

  $("#tugasHaRecTable tbody tr").each(function () {
    // Skip the "no data" row if it exists
    if ($(this).hasClass("no-data-row")) {
      return;
    }

    const rowText = $(this).text();
    const rowTextLower = rowText.toLowerCase();
    const isAvailable = rowText.includes("Available") && !rowText.includes("Not Available");
    const isNotAvailable = rowText.includes("Not Available");

    // Check if row matches search term
    const matchesSearch = searchTerm === "" || rowTextLower.includes(searchTerm);

    // Check if row matches availability filter
    let matchesAvailabilityFilter = false;
    if (availableChecked && isAvailable) matchesAvailabilityFilter = true;
    if (notAvailableChecked && isNotAvailable) matchesAvailabilityFilter = true;

    // Show row only if it matches both search and availability filters
    const shouldShow = matchesSearch && matchesAvailabilityFilter;
    $(this).toggle(shouldShow);

    if (shouldShow) {
      visibleRowCount++;
    }
  });

  // Remove existing "no data" row
  $("#tugasHaRecTable tbody .no-data-row").remove();

  // Add "no data" row if no rows are visible
  if (visibleRowCount === 0) {
    const noDataRow = `
        <tr class="no-data-row">
          <td colspan="3" class="text-center p-4" style="color: #666;">
            <i class="fas fa-info-circle mb-2"></i><br>
            No business processes match the current filters
          </td>
        </tr>
      `;
    $("#tugasHaRecTable tbody").append(noDataRow);
  }
}
function updateJobDescItem(type, id, isAdd = true) {
  localStorage.setItem("arrayRemovedBusPro", JSON.stringify([]));
  localStorage.setItem("arraySelectedBusPro", JSON.stringify([]));
  // Implement edit logic based on type and id
  console.log(`Update Job Description Item - Type: ${type}, ID: ${id}, Is Add: ${isAdd}`);
  const mapping = mappingAddUpdate[type];
  console.log("mapping", mapping);
  if (!mapping) {
    swal("Error", "Unsupported item type for editing", "error");
    return;
  }
  $("#modalAddJobDescItemTitle").text(isAdd ? "Add New Item" : "Edit Item");
  $("#modalAddJobDescItemBody").html(""); // Clear previous content
  const ls = localStorage.getItem(mapping.ls) !== "" ? JSON.parse(localStorage.getItem(mapping.ls)) : [];
  if (type === "tugasHa") {
    // add button choose related business process
    $("#modalAddJobDescItemBody").append(`
      <div class="form-group mb-3">
        <button class="btn btn-primary btn-sm" id="relatedBusPro" onclick="relatedBusPro()">Choose Related Business Process</button>
      </div>
      <div class="mb-3" id="selectedBusProContainer">
      </div>
    `);
  }
  if (isAdd) {
    id = undefined;
    // create text area by looping mapping.ids
    mapping.ids.forEach((itemId) => {
      $("#modalAddJobDescItemBody").append(`
          <div class="form-group mb-3">
            <label style="font-weight: bold;font-size: 1rem;" for="${itemId}">${itemId
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase())}</label>
            <textarea id="${itemId}" class="form-control" rows="4"></textarea>
          </div>
        `);
    });
    // Initialize CKEditor 4.8.0 for textareas
    const isMustBulletedList = MUST_BULLETED_LIST.includes(type);
    if (typeof CKEDITOR !== "undefined" && CKEDITOR && mapping.toolbar) {
      mapping.ids.forEach((itemId) => {
        const editor = CKEDITOR.replace(itemId, {
          toolbar: isMustBulletedList
            ? [{ name: "paragraph", items: ["BulletedList"] }]
            : [
                { name: "editing", items: ["Undo", "Redo"] },
                { name: "basicstyles", items: ["Bold", "Italic", "Underline"] },
                { name: "paragraph", items: ["BulletedList", "NumberedList"] },
              ],
          removePlugins: "elementspath",
          resize_enabled: false,
          height: 180,
          uiColor: "#ffffff",
          enterMode: CKEDITOR.ENTER_P,
          shiftEnterMode: CKEDITOR.ENTER_BR,
          allowedContent: true,
          fillEmptyBlocks: false,
          autoParagraph: false,
          startupFocus: false,
          entities: false,
          basicEntities: false,
          forceEnterMode: true,
        });

        // Store the editor instance for compatibility
        document.querySelector(`#${itemId}`).ckeditorInstance = {
          getData: () => editor.getData(),
          setData: (data) => editor.setData(data),
          _editor: editor,
        };

        editor.on("instanceReady", function () {
          editor.setData("");
          console.log(`✅ CKEditor 4.8.0 initialized for ${itemId}`);
        });

        editor.on("error", function (evt) {
          console.error(`❌ CKEditor 4.8.0 error for ${itemId}:`, evt.data);
        });
      });
    }
  } else {
    if (id === undefined || !ls[id]) {
      swal("Error", "Invalid item ID for editing", "error");
      return;
    }
    const itemData = ls[id];
    if (type === "tugasHa") {
      // load selected business process from itemData.tanggungJawabProses uniquely
      const selectedBusPro = itemData.tanggungJawabProses.filter((item, index, self) => {
        return index === self.findIndex((t) => t.indexNumber === item.indexNumber);
      });
      const selectedBusProContainer = document.getElementById("selectedBusProContainer");
      let arraySelectedBusPro = [];
      selectedBusPro.forEach((item) => {
        arraySelectedBusPro.push({
          code: item.code,
          indexNumber: item.indexNumber,
          description: item.description,
        });
      });
      localStorage.setItem("arraySelectedBusPro", JSON.stringify(arraySelectedBusPro));
      selectedBusProContainer.innerHTML = "";
      selectedBusPro.forEach((item) => {
        selectedBusProContainer.innerHTML += `
        <div class="badge bg-primary m-1 p-2" style="font-size: 0.9rem;">
          ${item.indexNumber} - ${item.description}
          <span class="icon-delete" onclick="removeSelectedBusPro('${item.indexNumber}')">&times;</span>
        </div>
    `;
      });
    }

    console.log("itemData", itemData);
    console.log("mapping", mapping);

    // create text area by looping mapping.ids and fill with data from ls[id]
    mapping.ids.forEach((itemId) => {
      console.log("itemId", itemId);
      console.log(mapping.listIds);
      const isList = mapping.listIds && mapping.listIds.includes(itemId);
      console.log("isList", isList);
      let value = "";
      if (isList && Array.isArray(itemData[itemId])) {
        // Convert array to HTML ul/li format
        const listItems = itemData[itemId].map((item) => `<li>${item}</li>`).join("");
        value = listItems ? `<ul>${listItems}</ul>` : "";
      } else {
        value = itemData[itemId] || "";
      }
      $("#modalAddJobDescItemBody").append(`
          <div class="form-group mb-3">
            <label style="font-weight: bold;font-size: 1rem;" for="${itemId}">${itemId
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase())}</label>
            <textarea id="${itemId}" class="form-control" rows="4">${value || ""}</textarea>
          </div>
        `);
    });
    // Initialize CKEditor 4.8.0 for textareas with existing data
    if (typeof CKEDITOR !== "undefined" && CKEDITOR && mapping.toolbar) {
      // if type included in mustBulletedList then force value to be bulleted list and disable toolbar other than bulleted list
      const isMustBulletedList = MUST_BULLETED_LIST.includes(type);
      mapping.ids.forEach((itemId) => {
        const isList = mapping.listIds && mapping.listIds.includes(itemId);
        let value = "";
        if (isList && Array.isArray(itemData[itemId])) {
          // Convert array to HTML ul/li format
          const listItems = itemData[itemId].map((item) => `<li>${item}</li>`).join("");
          value = listItems ? `<ul>${listItems}</ul>` : "";
        } else {
          value = itemData[itemId] || "";
        }

        const editor = CKEDITOR.replace(itemId, {
          toolbar: isMustBulletedList
            ? [{ name: "paragraph", items: ["BulletedList"] }]
            : [
                { name: "editing", items: ["Undo", "Redo"] },
                { name: "basicstyles", items: ["Bold", "Italic", "Underline"] },
                { name: "paragraph", items: ["BulletedList", "NumberedList"] },
              ],
          removePlugins: "elementspath",
          resize_enabled: false,
          height: 180,
          uiColor: "#ffffff",
          enterMode: CKEDITOR.ENTER_P,
          shiftEnterMode: CKEDITOR.ENTER_BR,
          allowedContent: true,
          fillEmptyBlocks: false,
          autoParagraph: false,
          startupFocus: false,
          entities: false,
          basicEntities: false,
          forceEnterMode: true,
        });

        // Store the editor instance for compatibility
        document.querySelector(`#${itemId}`).ckeditorInstance = {
          getData: () => editor.getData(),
          setData: (data) => editor.setData(data),
          _editor: editor,
        };

        editor.on("instanceReady", function () {
          editor.setData(value || "");
          console.log(`✅ CKEditor 4.8.0 initialized for ${itemId} with data`);
        });

        editor.on("error", function (evt) {
          console.error(`❌ CKEditor 4.8.0 error for ${itemId}:`, evt.data);
        });
      });
    }
  }
  // create button inside div
  $("#modalAddJobDescItemFooter").html(`
    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
    <button type="button" class="btn btn-primary" onclick="saveJobDescItem('${type}', ${id}, ${isAdd})">Save</button>
  `);
  $("#modalAddJobDescItem").modal("show");
}
