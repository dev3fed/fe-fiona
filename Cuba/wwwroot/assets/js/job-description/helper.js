function loader(status) {
  if (status == true) {
    $("#loading-overlay").addClass("show").show();
  } else {
    $("#loading-overlay").removeClass("show").hide();
  }
}

function updateIdentifikasiJob(params) {
  $("#jabatan").text(params.jobName ?? "Data not found");
  $("#function").text(params.unitKerjaFungsi ?? "Data not found");
  $("#location").text(params.lokasiKerja ?? "Data not found");
  $("#directorat").text(params.direktorat ?? "Data not found");
  $("#directReport").text(params.atasanLangsung ?? "Data not found");
  $("#sk").text(params.noSuratKeputusan ?? "Data not found");
  $("#skDate").text(params.tanggalSuratKeputusan ?? "Data not found");
}

function updateTable(params, data, rowHeader) {
  // get table body
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
    const reference = item.jobReference ? item.jobReference : "";
    const referenceHtml =
      reference !== ""
        ? `<br/><span style="font-size:10px;color:grey">(reference from : ${reference.jobName} - ${reference.noSuratKeputusan})</span>`
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
          (process, index, self) => index === self.findIndex((p) => p.indexNumber === process.indexNumber)
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
                `<li><span class="text-primary" style="cursor:pointer" data-bs-toggle="tooltip" data-bs-trigger="click" title="${process?.description}">${process?.indexNumber}</span></li>`
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
  updateTable("persyaratan", params.education);
}

async function getJobReferenceDetail() {
  const lsFungsi = localStorage.getItem("fungsi") !== "" ? JSON.parse(localStorage.getItem("fungsi")) : [];
  const lsTugasHa = localStorage.getItem("tugasHa") !== "" ? JSON.parse(localStorage.getItem("tugasHa")) : [];
  const lsKoordinasiInternal =
    localStorage.getItem("koordinasiInternal") !== "" ? JSON.parse(localStorage.getItem("koordinasiInternal")) : [];
  const lsRelasiEksternal =
    localStorage.getItem("relasiEksternal") !== "" ? JSON.parse(localStorage.getItem("relasiEksternal")) : [];
  const lsStk = localStorage.getItem("stk") !== "" ? JSON.parse(localStorage.getItem("stk")) : [];

  let summernoteContent = "";
  lsFungsi.forEach((item) => {
    summernoteContent += item.fungsi + "<br><br>";
    if (item.jobReference.jobName) {
      const textReference = `(Reference from : ${item.jobReference.jobName} - ${item.jobReference.noSuratKeputusan})`;
      summernoteContent += textReference + "<br><br>";
    }
  });
  $(".summernote").summernote("code", summernoteContent);

  // Filter data arrays properly
  const filteredTugasHa = lsTugasHa.filter((item) => item.responsible && item.responsible.length > 0);
  const filteredStk = lsStk.filter((item) => item.stkNumber !== null && item.stkNumber !== undefined);

  updateTable("tugasHa", filteredTugasHa, tabCusJD.tugasHa);
  updateTable("koordinasi", lsKoordinasiInternal, tabCusJD.koordinasi);
  updateTable("relation", lsRelasiEksternal, tabCusJD.relation);
  updateTable("stk", filteredStk, tabCusJD.stk);
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

async function addJobReference() {
  $("#modalJobCompare").modal("show");
  $("#searchDiv").hide();
  // $("#detailJob").show();

  // searchJobCompare();
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
  const redirectTo = `/job-description/detail?jobId=${jobId}&prlOrg=${prlOrg}&positionCode=${positionCode}`;
  window.location.href = redirectTo;
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

<<<<<<< HEAD
async function saveReference() {
  const dataSelected = selectedData.selectedJobDesc;
  const checkboxList = Array.from(document.querySelectorAll("input[type=checkbox].checbox-compare")).filter(
    (item) => !item.id.includes("all") && item.checked,
  );
  console.log("checkboxList", checkboxList);
  const checboxFungsi = checkboxList.find((item) => item.id === "checkbox_fungsi");
  const checboxTugasHa = checkboxList.filter((item) => item.id.includes("checkbox_tugas_ha"));
  const checboxInternal = checkboxList.filter((item) => item.id.includes("checkbox_ir"));
  const checboxEksternal = checkboxList.filter((item) => item.id.includes("checkbox_eksternal"));
  const checboxPersyaratanMandatori = checkboxList.filter((item) => item.id.includes("checkbox_persyaratan_mandatori"));
  const checboxPersyaratanGeneral = checkboxList.filter((item) => item.id.includes("checkbox_persyaratan_general"));
  const checboxPersyaratanSpesifik = checkboxList.filter((item) => item.id.includes("checkbox_persyaratan_spesifik"));
  const reference = dataSelected?.identifikasi?.jobName + " - " + dataSelected?.identifikasi?.sk;

  console.log("checboxFungsi", checboxFungsi);
  console.log("checboxTugasHa", checboxTugasHa);
  console.log("checboxInternal", checboxInternal);
  console.log("checboxEksternal", checboxEksternal);
  console.log("checboxPersyaratanMandatori", checboxPersyaratanMandatori);
  console.log("checboxPersyaratanGeneral", checboxPersyaratanGeneral);
  console.log("checboxPersyaratanSpesifik", checboxPersyaratanSpesifik);
  console.log("reference", reference);
  return;
  if (checboxFungsi) {
    const getLocalFungsi = localStorage.getItem("fungsi") !== "" ? JSON.parse(localStorage.getItem("fungsi")) : [];
    // add to array
    getLocalFungsi.push({
      reference: reference,
      fungsi: dataSelected?.fungsi,
    });
    localStorage.setItem("fungsi", JSON.stringify(getLocalFungsi));
  }

  if (checboxTugasHa.length > 0) {
    const getLocalTugasHa = localStorage.getItem("tugasHa") !== "" ? JSON.parse(localStorage.getItem("tugasHa")) : [];
    for (const item of checboxTugasHa) {
      const id = item.id.split("checkbox_tugas_ha_")[1];
      console.log("id", id);
      const findData = dataSelected?.tugasHa.find((item) => item.id == id);
      console.log("findData", findData);
      getLocalTugasHa.push({
        reference: reference,
        id: findData.id,
        output: findData.output,
        lead: findData.lead,
        responsible: findData.responsible,
      });
    }
    localStorage.setItem("tugasHa", JSON.stringify(getLocalTugasHa));
  }

  if (checboxInternal.length > 0) {
    const getLocalKoordinasi =
      localStorage.getItem("koordinasi") !== "" ? JSON.parse(localStorage.getItem("koordinasi")) : [];
    for (const item of checboxInternal) {
      const id = item.id.split("checkbox_internal_")[1];
      const findData = dataSelected?.koordinasi.find((item) => item.id == id);
      getLocalKoordinasi.push({
        reference: reference,
        id: findData.id,
        internal: findData.internal,
        aktivitas: findData.aktivitas,
      });
    }
    localStorage.setItem("koordinasi", JSON.stringify(getLocalKoordinasi));
  }

  if (checboxEksternal.length > 0) {
    const getLocalRelation =
      localStorage.getItem("relation") !== "" ? JSON.parse(localStorage.getItem("relation")) : [];
    for (const item of checboxEksternal) {
      const id = item.id.split("checkbox_eksternal_")[1];
      const findData = dataSelected?.relation.find((item) => item.id == id);
      getLocalRelation.push({
        reference: reference,
        id: findData.id,
        eksternal: findData.eksternal,
        aktivitas: findData.aktivitas,
      });
    }
    localStorage.setItem("relation", JSON.stringify(getLocalRelation));
  }

  if (checboxPersyaratanMandatori.length > 0) {
    const getLocalMandatori =
      localStorage.getItem("mandatori") !== "" ? JSON.parse(localStorage.getItem("mandatori")) : [];
    for (const item of checboxPersyaratanMandatori) {
      const id = item.id.split("checkbox_persyaratan_mandatori_")[1];
      console.log("dataSelected?.komtekMandatori", dataSelected?.komtekMandatori);
      const findData = dataSelected?.komtekMandatori.find((item) => item.id == id);
      getLocalMandatori.push({
        reference: reference,
        id: findData.id,
        komtekMandatoriName: findData.komtekMandatoriName,
        level: findData.level,
      });
    }
    localStorage.setItem("mandatori", JSON.stringify(getLocalMandatori));
  }

  if (checboxPersyaratanGeneral.length > 0) {
    const getLocalGeneral = localStorage.getItem("general") !== "" ? JSON.parse(localStorage.getItem("general")) : [];
    for (const item of checboxPersyaratanGeneral) {
      const id = item.id.split("checkbox_persyaratan_general_")[1];
      const findData = dataSelected?.komtekGeneral.find((item) => item.id == id);
      getLocalGeneral.push({
        reference: reference,
        id: findData.id,
        komtekGeneralName: findData.komtekGeneralName,
        level: findData.level,
      });
    }
    localStorage.setItem("general", JSON.stringify(getLocalGeneral));
  }

  if (checboxPersyaratanSpesifik.length > 0) {
    const getLocalSpesifik =
      localStorage.getItem("spesifik") !== "" ? JSON.parse(localStorage.getItem("spesifik")) : [];
    for (const item of checboxPersyaratanSpesifik) {
      const id = item.id.split("checkbox_persyaratan_spesifik_")[1];
      const findData = dataSelected?.komtekSpesifik.find((item) => item.id == id);
      getLocalSpesifik.push({
        reference: reference,
        id: findData.id,
        komtekSpesifikName: findData.komtekSpesifikName,
        level: findData.level,
      });
    }
    localStorage.setItem("spesifik", JSON.stringify(getLocalSpesifik));
  }

  swal({
    title: "Are you sure?",
    text: "You will save this reference to your job description",
=======
function confirmFunction(title, text) {
  // give alert confirm
  return swal({
    title: title || "Are you sure?",
    text: text || "Make sure all data is correct before proceeding.",
>>>>>>> e74399481b1764dd27736a160520eeeee58124dd
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then((willProceed) => {
    return willProceed; // true if user clicks OK, false if user clicks Cancel
  });
}

function callOtherRecommendations(data) {
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
        saveReferenceAttribute();
      },
    },
    {
      button: "Yes, Continue",
      className: "btn-primary",
      callback: function () {
        hideModal(`modalConfirm`);
        callOtherRecommendations("asikin aja");
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
    1
  );
}

async function saveReferenceAttribute() {
  loader(true);

  const checkboxList = Array.from(document.querySelectorAll("input[type=checkbox].checbox-compare")).filter(
    (item) => !item.id.includes("all") && item.checked
  );
  const selectedJobDescReference = JSON.parse(localStorage.getItem("selectedJobDescReference")) ?? "[]";
  const checboxFungsi = checkboxList.find((item) => item.id === "checkbox_fungsi");
  const checboxTugasHa = checkboxList.filter((item) => item.id.includes("checkbox_tugasHaReference"));
  const checboxInternal = checkboxList.filter((item) => item.id.includes("checkbox_koordinasiInternalReference"));
  const checboxEksternal = checkboxList.filter((item) => item.id.includes("checkbox_relasiEksternalReference"));
  const checkboxStk = checkboxList.filter((item) => item.id.includes("checkbox_stkReference"));

  // Dynamic function to process checkbox references
  const processCheckboxReference = (checkboxes, config) => {
    if (checkboxes.length === 0) return;

    const { checkAllId, dataPath, localStorageKey, checkboxPrefix } = config;
    const isCheckedAll = checkboxes.find((item) => item.id === checkAllId);

    if (isCheckedAll !== undefined) {
      // Process all items
      selectedJobDescReference?.[dataPath]?.data?.forEach((item) => {
        item.jobReference = {
          jobId: selectedJobDescReference?.identifikasiJabatan?.jobId,
          jobName: selectedJobDescReference?.identifikasiJabatan?.jobName,
          noSuratKeputusan: selectedJobDescReference?.identifikasiJabatan?.noSuratKeputusan,
        };
      });
    } else {
      // Process selected items only
      const selectedItems = checkboxes
        .map((item) => {
          const id = item.id.split(`${checkboxPrefix}_`)[1];
          return selectedJobDescReference?.[dataPath]?.data?.[id];
        })
        .filter((item) => item)
        .map((item) => {
          item.jobReference = {
            jobId: selectedJobDescReference?.identifikasiJabatan?.jobId,
            jobName: selectedJobDescReference?.identifikasiJabatan?.jobName,
            noSuratKeputusan: selectedJobDescReference?.identifikasiJabatan?.noSuratKeputusan,
          };
          return item;
        });

      selectedJobDescReference[dataPath].data = selectedItems;
    }

    // Update localStorage
    const localData =
      localStorage.getItem(localStorageKey) !== "" ? JSON.parse(localStorage.getItem(localStorageKey)) : [];
    localData.push(...(selectedJobDescReference?.[dataPath]?.data ?? []));
    localStorage.setItem(localStorageKey, JSON.stringify(localData));
  };

  if (checboxFungsi != undefined) {
    const localData = localStorage.getItem("fungsi") !== "" ? JSON.parse(localStorage.getItem("fungsi")) : [];
    const dataFungsi = $("#fungsiTextReference").summernote("code");
    localData.push({
      jobReference: {
        jobId: selectedJobDescReference?.identifikasiJabatan?.jobId,
        jobName: selectedJobDescReference?.identifikasiJabatan?.jobName,
        noSuratKeputusan: selectedJobDescReference?.identifikasiJabatan?.noSuratKeputusan,
      },
      fungsi: dataFungsi,
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

  await getJobReferenceDetail();
  $("#modalJobCompare").modal("hide");
  $("#modalJobCompareDetail").modal("hide");
  loader(false);
  swal("Success!", "Reference saved to your job description", "success");
}

async function saveReference() {
  const isFullRefer = JSON.parse(localStorage.getItem("isFullRefer")) ?? false;
  console.log("isFullRefer", isFullRefer);
  if (!isFullRefer) {
    callConfirmReference();
    return;
  }
  const confirm = await confirmFunction("Save Reference", "Are you sure you want to save the selected references?");
  if (!confirm) return;
  await saveReferenceAttribute();
}

function checkButtonTable(buttonTable, id, lastPath) {
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
        const editPositionDraft = `<button class="btn-custom-outline-primary" onclick="editJobDesc('${id}')"> <i class="icon-pencil f-16"></i></button>`;
        const detailPositionDraft = `<button class="btn-custom-outline-dark" onclick="detailJobDesc('${id}')"> <i class="icon-eye f-16"></i></button>`;
        const deletePositionDraft = `<button class="btn-custom-outline-danger" onclick="deleteJobDesc('${id}')"><i class="icon-trash f-16"></i></button>`;
        return `${editPositionDraft} ${detailPositionDraft} ${deletePositionDraft}`;
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

<<<<<<< HEAD
  console.log("filteredData", filteredData);
  filteredData.push(selfNode);
  filteredData.map((item) => {
    item.id = parseInt(item.id);
    item.pid = parseInt(item.pid);
  });
  console.log("filteredData", filteredData);
  setTimeout(() => {
    helperOrgChart(true, "os-container", filteredData, true, {
      expand: true,
      nodeId: selfNode.id,
=======
  try {
    const dataChart = await chartShow({
      draftId: getDraftExisting.draftOrganizationId,
      jobCode: nodeId,
      depth: 5,
>>>>>>> e74399481b1764dd27736a160520eeeee58124dd
    });

    // Update chart data (assuming this function handles chart rendering)
    renderOrgChart(dataChart.data, nodeId, true);

    // Wait for chart to complete rendering before hiding loading
    setTimeout(() => {
      if (typeof hideChartLoading === "function") {
        hideChartLoading("chart-container-custom");
      }
      console.log("Chart focus completed successfully");
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

<<<<<<< HEAD
// function helperOrgChart(init, id, data, isFocusNode, object) {
//   const lsListOrgNode = JSON.parse(localStorage.getItem("listOrgNode") || "[]");
//   console.log("data ==>", data);
//   if (!init) {
//     return false;
//   }
//   const param = {};
//   if (isFocusNode) {
//     param.collapsed = {
//       level: 2,
//       allChildren: true,
//     };
//   }

//   const default_t = Object.assign({}, OrgChart.templates.base);
//   default_t.size = [220, 70];
//   default_t.ripple = null;
//   default_t.img_0 = null;
//   default_t.node = `<rect x="0" y="0" height="{h}" width="{w}" fill="#ffffff" stroke-width="1" stroke="#000"></rect>`;
//   default_t.position = `<g><text data-width="180" style="font-size:11px;" text-anchor="middle" dominant-baseline="middle" fill="#353238" x="105" y="25" data-text-overflow="multiline">{val}</text></g>`;
//   // default_t.prl = `<g><rect x="180" y="0" height="35" width="40" fill="#ffffff" stroke-width="1" stroke="#000"></rect><text style="font-size:12px;text-anchor: middle;" fill="#353238" x="200" y="22.5">{val}</text></g>`;
//   // default_t.jumlah_formasi = `<g><rect x="180" y="35" height="35" width="40" fill="#ffffff" stroke-width="1" stroke="#000"></rect><text style="font-size:12px; text-anchor: middle;" fill="#353238" x="200" y="57.5">{val}</text></g>`;

//   default_t.expandCollapseSize = 10;
//   // default_t.link = `<path stroke-linejoin="round" stroke-width="1" fill="none" d="{edge}" />`;
//   default_t.plus = `<g><circle cx="5" cy="5" r="5" class="boc-fill" stroke="#000" stroke-width="1"></circle>
//   <line x1="3" y1="5" x2="7" y2="5" stroke-width="1" stroke="#000"></line>
//   <line x1="5" y1="3" x2="5" y2="7" stroke-width="1" stroke="#000"></line></g>`;
//   default_t.minus = `<g><circle cx="5" cy="5" r="5" class="boc-fill" stroke="#000" stroke-width="1"></circle>
//   <line x1="3" y1="5" x2="7" y2="5" stroke-width="1" stroke="#000"></line></g>`;
//   // chaert separation
//   OrgChart.templates.split = Object.assign({}, OrgChart.templates.base);
//   // RESET_MOVABLE_ONEXPANDCOLLAPSE

//   OrgChart.templates.split.size = [0, 0];
//   OrgChart.templates.split.node = "";
//   OrgChart.templates.default_t = default_t;
//   OrgChart.templates.default_t.menuButton =
//     '<div style="position:absolute;right:0px;top:20px; width:40px;height:50px;cursor:pointer;" data-ctrl-menu="">' +
//     '<hr style="background-color: black; height: 3px;margin:0px; border: none;">' +
//     '<hr style="background-color: black; height: 3px; border: none;">' +
//     '<hr style="background-color: black; height: 3px; border: none;">' +
//     "</div>";

//   const baseNodeBinding = {
//     position: "position",
//     prl: "prl",
//     jumlah_formasi: "jumlah_formasi",
//     org_unit: "org_unit_name",
//     level: "level",
//   };

//   // function bracketTemplateGenerator(bracketSize) {
//   //   const template = Object.assign({}, OrgChart.templates.default_t);
//   //   template.size = [220, 0];
//   //   for (let i = 0; i < bracketSize; i++) {
//   //     template.size = [template.size[0], 120];
//   //   }
//   //   template.position = null;
//   //   template.prl = null;
//   //   template.jumlah_formasi = null;
//   //   template.position =
//   //     `<g>` +
//   //     '<rect x="0" y="0" height="40" width="220" fill="#ffffff" stroke-width="1" stroke="#000"></rect>' +
//   //     `<text style="font-size:11px;text-anchor: middle;" fill="#353238" x="110" y="20">{val}</text>` +
//   //     `</g>`;

//   //   let height = 40;
//   //   for (let i = 1; i <= bracketSize; i++) {
//   //     const yPosition = 40 + (i - 1) * 40;
//   //     const yTextPosition = 60 + (i - 1) * 40;
//   //     height += 40;
//   //     template.size = [template.size[0], height];
//   //     template[`bc_${i}_position`] =
//   //       `<g>` +
//   //       `<rect x="0" y="${yPosition}" height="40" width="220" fill="#ffffff" stroke-width="1" stroke="#000"></rect>` +
//   //       `<text data-width="120" style="font-size:10px;text-anchor: middle;" fill="#353238" x="110" y="${yTextPosition}" data-text-overflow="multiline">{val}</text>` +
//   //       `</g>`;
//   //     // template[`bc_${i}_prl`] =
//   //     //   `<g>` +
//   //     //   `<rect x="140" y="${yPosition}" height="40" width="40" fill="#ffffff" stroke-width="1" stroke="#000"></rect>` +
//   //     //   `<text style="font-size:11px;text-anchor: middle;" fill="#353238" x="160" y="${
//   //     //     yTextPosition + 4
//   //     //   }">{val}</text>` +
//   //     //   `</g>`;
//   //     // template[`bc_${i}_level`] =
//   //     //   `<g>` +
//   //     //   // `<rect x="180" y="${yPosition}" id="{val}" height="40" width="40" fill="transparent" stroke-width="1" stroke="#000"></rect>` +
//   //     //   `<rect x="180" y="${yPosition}" id="{val}" height="40" width="40" fill="#ffffff" stroke-width="1" stroke="#000"></rect>` +
//   //     //   `</g>`;
//   //     // template[`bc_${i}_jumlah_formasi`] =
//   //     //   `<g>` +
//   //     //   `<rect x="180" y="${yPosition}" height="40" width="40" fill="#ffffff" stroke-width="1" stroke="#000"></rect>` +
//   //     //   `<text style="font-size:11px;text-anchor: middle;" fill="#353238" x="200" y="${
//   //     //     yTextPosition + 4
//   //     //   }">{val}</text>` +
//   //     //   `</g>`;
//   //   }

//   //   return template;
//   // }

//   const bracketLimit = 20;

//   for (let i = 1; i <= bracketLimit; i++) {
//     OrgChart.templates[`bracket_${i}_t`] = bracketTemplateGenerator(i);
//   }

//   const nodeBinding = {
//     ...baseNodeBinding,
//   };

//   const tags = {};

//   for (let i = 1; i <= bracketLimit; i++) {
//     for (let key in baseNodeBinding) {
//       nodeBinding[`bc_${i}_${key}`] = `bc_${i}_${key}`;
//     }
//     tags[`bracket_${i}`] = {
//       template: `bracket_${i}_t`,
//     };
//   }

//   console.log("tags", tags);

//   OrgChart.RESET_MOVABLE_ONEXPANDCOLLAPSE = true;
//   OrgChart.SEARCH_CLOSE_RESULT_ON_ESCAPE_OR_CLICKOUTSIDE = true;
//   let chart = new OrgChart(document.getElementById(id), {
//     collapse: {
//       ...param.collapsed,
//       // level: 2,
//       // allChildren: true,
//     },
//     template: "default_t",
//     nodeBinding,
//     enableSearch: false,
//     assistantSeparation: 10,
//     levelSeparation: 30,
//     scaleInitial: OrgChart.match.boundary,
//     nodes: data,
//     align: OrgChart.ORIENTATION,
//     movable: OrgChart.movable.node,
//     nodeMouseClick: false,
//     // menu
//     // menu: {
//     //   pdf: { text: "Export PDF" },
//     //   png: { text: "Export PNG" },
//     //   svg: { text: "Export SVG" },
//     // },
//     toolbar: {
//       fullScreen: true,
//       zoom: true,
//       fit: true,
//     },
//     tags,
//   });

//   chart.on("init", function (sender) {
//     // const title = document.createElement("button");
//     // title.style.position = "absolute";
//     // title.style.right = "0px";
//     // title.style.top = "87px";
//     // title.style.width = "50px";
//     // title.style.textAlign = "center";
//     // title.style.color = "#757575";
//     // title.style.backgroundColor = "transparent";
//     // title.style.border = "none";
//     // title.style.fontSize = "42px";
//     // title.style.color = "grey";
//     // title.innerHTML = `<i class="fa fa-refresh"></i>`;
//     // // add id to title
//     // title.addEventListener("click", function () {
//     //   // myData.forEach((item) => {
//     //   //   item.tags = item.tags.filter((tag) => tag !== "edit");
//     //   // });
//     //   // chart.load(myData);
//     //   helperOrgChart(true, "os-container", lsListOrgNode, true);
//     // });
//     // chart.element.appendChild(title);
//   });

//   chart.onExportStart((args) => {
//     args.styles += document.getElementById("myStyle").outerHTML;
//   });

//   chart.onExportEnd((args) => {
//     console.log(args);
//   });

//   chart.onUpdated(() => {});

//   chart.on("expcollclick", function (sender, collapse, id, ids) {});

//   chart.on("node-layout", function (sender, args) {
//     const childrenCount = args?.childrenIds?.length;
//     if (childrenCount > 10) {
//       args.layout = OrgChart.treeRightOffset;
//     } else {
//       args.layout = OrgChart.normal;
//     }
//   });

//   chart.on("click", async (sender, node) => {
//     const param = {};
//     const nodeID = node.node.id;
//     // await modalJobPopup(nodeID);
//   });

//   chart.on("searchclick", (sender, node) => {
//     return false;
//   });

//   $("#handleExportPdf")
//     .off("click")
//     .on("click", function () {
//       const nodeId = $("#positionId").val();
//       chart.exportPDF({
//         filename: `${nodeId}.pdf`,
//         expandChildren: false,
//       });
//       $("#modalDetailJob").modal("hide");
//     });

//   $("#handleExportPng").on("click", function () {
//     const nodeId = $("#positionId").val();
//     exportChartAsBlob();
//     $("#modalDetailJob").modal("hide");
//   });

//   function exportChartAsBlob() {
//     //  create canvas from div id os-container, then create png from canvas
//     const osContainer = document.getElementById("os-container");

//     if (typeof window.html2canvas === "undefined") {
//       console.error("html2canvas is not loaded.");
//       return;
//     }

//     window.html2canvas(osContainer).then((canvas) => {
//       // Get the image data
//       const ctx = canvas.getContext("2d");
//       const { width, height } = canvas;
//       const imageData = ctx.getImageData(0, 0, width, height);
//       const data = imageData.data;

//       // Find bounds
//       let top = null,
//         bottom = null,
//         left = null,
//         right = null;
//       for (let y = 0; y < height; y++) {
//         for (let x = 0; x < width; x++) {
//           const idx = (y * width + x) * 4;
//           // If not white and not fully transparent
//           if (
//             !(data[idx] === 255 && data[idx + 1] === 255 && data[idx + 2] === 255 && data[idx + 3] === 255) &&
//             data[idx + 3] !== 0
//           ) {
//             if (top === null) top = y;
//             if (left === null || x < left) left = x;
//             if (right === null || x > right) right = x;
//             bottom = y;
//           }
//         }
//       }

//       if (top !== null && left !== null && right !== null && bottom !== null) {
//         const croppedWidth = right - left + 1;
//         const croppedHeight = bottom - top + 1;
//         const croppedCanvas = document.createElement("canvas");
//         croppedCanvas.width = croppedWidth;
//         croppedCanvas.height = croppedHeight;
//         const croppedCtx = croppedCanvas.getContext("2d");
//         croppedCtx.putImageData(ctx.getImageData(left, top, croppedWidth, croppedHeight), 0, 0);

//         croppedCanvas.toBlob((blob) => {
//           if (blob) {
//             console.log("PNG Blob created (cropped)", blob);
//             // print blob
//             const url = URL.createObjectURL(blob);
//             const img = document.createElement("img");
//             img.src = url;
//             img.onload = () => {
//               // Optionally, you can revoke the object URL after use
//               URL.revokeObjectURL(url);
//               // Append the image to the body or any other element
//               document.body.appendChild(img);
//             };
//             // Download the image as well
//             const a = document.createElement("a");
//             a.href = url;
//             a.download = "orgchart-cropped.png";
//             document.body.appendChild(a);
//             a.click();
//             document.body.removeChild(a);
//           }
//         }, "image/png");
//       } else {
//         // fallback: no non-white content found
//         canvas.toBlob((blob) => {
//           if (blob) {
//             console.log("PNG Blob created (original)", blob);
//             // Download the original image as well
//             const url = URL.createObjectURL(blob);
//             const a = document.createElement("a");
//             a.href = url;
//             a.download = "orgchart.png";
//             document.body.appendChild(a);
//             a.click();
//             document.body.removeChild(a);
//           }
//         }, "image/png");
//       }
//     });
//   }

//   if (object?.expand) {
//     let selfNode = data.find((item) => item.id == object.nodeId);
//     const getChildrenNode = data.filter((item) => item.pid == object.nodeId).map((item) => item.id) || [];
//     const siblingNode = data.filter((item) => item.pid == selfNode?.pid).map((item) => item.id) || [];
//     const getAll = [...getChildrenNode, ...siblingNode];
//     setTimeout(() => {
//       chart.expand(selfNode.id, getAll);
//     }, 1000);
//     setTimeout(() => {
//       chart.fit();
//     }, 2000);
//   }
// }

function helperOrgChart(init, id, data, isFocusNode, object) {
  console.log(data);
  const dataWithIdNull = data.filter((item) => item.id !== null || item.pid !== null);
  console.log("dataWithIdNull", dataWithIdNull);

  if (!init) {
    return false;
  }

  // Show loading at the start of chart rendering
  if (typeof showChartLoading === "function") {
    showChartLoading("chart-container-custom");
  }

  const param = {};
  if (isFocusNode) {
    param.collapsed = {
      level: 2,
      allChildren: true,
    };
  }

  const default_t = Object.assign({}, OrgChart.templates.base);
  default_t.size = [220, 70];
  default_t.ripple = null;
  default_t.img_0 = null;
  default_t.node = `<rect x="0" y="0" height="{h}" width="{w}" fill="#ffffff" stroke-width="1" stroke="#000"></rect>`;
  default_t.position = `<g><text data-width="180" style="font-size:11px;" text-anchor="middle" dominant-baseline="middle" fill="#353238" x="105" y="25" data-text-overflow="multiline">{val}</text></g>`;
  // default_t.prl = `<g><rect x="180" y="0" height="35" width="40" fill="#ffffff" stroke-width="1" stroke="#000"></rect><text style="font-size:12px;text-anchor: middle;" fill="#353238" x="200" y="22.5">{val}</text></g>`;
  // default_t.jumlah_formasi = `<g><rect x="180" y="35" height="35" width="40" fill="#ffffff" stroke-width="1" stroke="#000"></rect><text style="font-size:12px; text-anchor: middle;" fill="#353238" x="200" y="57.5">{val}</text></g>`;

  default_t.expandCollapseSize = 10;
  // default_t.link = `<path stroke-linejoin="round" stroke-width="1" fill="none" d="{edge}" />`;
  default_t.plus = `<g><circle cx="5" cy="5" r="5" class="boc-fill" stroke="#000" stroke-width="1"></circle>
  <line x1="3" y1="5" x2="7" y2="5" stroke-width="1" stroke="#000"></line>
  <line x1="5" y1="3" x2="5" y2="7" stroke-width="1" stroke="#000"></line></g>`;
  default_t.minus = `<g><circle cx="5" cy="5" r="5" class="boc-fill" stroke="#000" stroke-width="1"></circle>
  <line x1="3" y1="5" x2="7" y2="5" stroke-width="1" stroke="#000"></line></g>`;
  // chaert separation
  OrgChart.templates.split = Object.assign({}, OrgChart.templates.base);
  // RESET_MOVABLE_ONEXPANDCOLLAPSE

  OrgChart.templates.split.size = [0, 0];
  OrgChart.templates.split.node = "";
  OrgChart.templates.default_t = default_t;
  OrgChart.templates.default_t.menuButton =
    '<div style="position:absolute;right:0px;top:20px; width:40px;height:50px;cursor:pointer;" data-ctrl-menu="">' +
    '<hr style="background-color: black; height: 3px;margin:0px; border: none;">' +
    '<hr style="background-color: black; height: 3px; border: none;">' +
    '<hr style="background-color: black; height: 3px; border: none;">' +
    "</div>";

  const baseNodeBinding = {
    position: "position",
    prl: "prl",
    jumlah_formasi: "jumlah_formasi",
    org_unit: "org_unit_name",
    level: "level",
  };

  function bracketTemplateGenerator(bracketSize) {
    const template = Object.assign({}, OrgChart.templates.default_t);
    template.size = [220, 0];
    for (let i = 0; i < bracketSize; i++) {
      template.size = [template.size[0], 120];
    }
    template.position = null;
    template.prl = null;
    template.jumlah_formasi = null;
    template.position =
      `<g>` +
      '<rect x="0" y="0" height="40" width="220" fill="#ffffff" stroke-width="1" stroke="#000"></rect>' +
      `<foreignObject x="5" y="5" width="210" height="30">` +
      `<div xmlns="http://www.w3.org/1999/xhtml" style="font-size:11px;text-align:center;color:#353238;font-family:Arial,sans-serif;line-height:1.2;word-wrap:break-word;overflow:hidden;display:flex;align-items:center;justify-content:center;height:30px;">{val}</div>` +
      `</foreignObject>` +
      `</g>`;

    let height = 40;
    for (let i = 1; i <= bracketSize; i++) {
      const yPosition = 40 + (i - 1) * 40;
      const yTextPosition = 60 + (i - 1) * 40;
      height += 40;
      template.size = [template.size[0], height];
      template[`bc_${i}_position`] =
        `<g>` +
        `<rect x="0" y="${yPosition}" height="40" width="220" fill="#ffffff" stroke-width="1" stroke="#000"></rect>` +
        `<text data-width="120" style="font-size:10px;text-anchor: middle;" fill="#353238" x="110" y="${yTextPosition}" data-text-overflow="multiline">{val}</text>` +
        `</g>`;
      // template[`bc_${i}_prl`] =
      //   `<g>` +
      //   `<rect x="140" y="${yPosition}" height="40" width="40" fill="#ffffff" stroke-width="1" stroke="#000"></rect>` +
      //   `<text style="font-size:11px;text-anchor: middle;" fill="#353238" x="160" y="${
      //     yTextPosition + 4
      //   }">{val}</text>` +
      //   `</g>`;
      // template[`bc_${i}_level`] =
      //   `<g>` +
      //   // `<rect x="180" y="${yPosition}" id="{val}" height="40" width="40" fill="transparent" stroke-width="1" stroke="#000"></rect>` +
      //   `<rect x="180" y="${yPosition}" id="{val}" height="40" width="40" fill="#ffffff" stroke-width="1" stroke="#000"></rect>` +
      //   `</g>`;
      // template[`bc_${i}_jumlah_formasi`] =
      //   `<g>` +
      //   `<rect x="180" y="${yPosition}" height="40" width="40" fill="#ffffff" stroke-width="1" stroke="#000"></rect>` +
      //   `<text style="font-size:11px;text-anchor: middle;" fill="#353238" x="200" y="${
      //     yTextPosition + 4
      //   }">{val}</text>` +
      //   `</g>`;
    }

    return template;
  }

  const bracketLimit = 20;

  for (let i = 1; i <= bracketLimit; i++) {
    OrgChart.templates[`bracket_${i}_t`] = bracketTemplateGenerator(i);
  }

  const nodeBinding = {
    ...baseNodeBinding,
  };

  const tags = {};

  // console.log({baseNodeBinding})
  for (let i = 1; i <= bracketLimit; i++) {
    for (let key in baseNodeBinding) {
      nodeBinding[`bc_${i}_${key}`] = `bc_${i}_${key}`;
    }
    tags[`basket_${i}`] = {
      template: `bracket_${i}_t`,
    };
  }

  // for (let i = 1; i <= bracketLimit; i++) {
  //   for (let key in baseNodeBinding) {
  //     nodeBinding[`bc_${i}_${key}`] = `bc_${i}_${key}`;
  //   }
  //   tags[`basket_${i}`] = {
  //     template: `bracket_${i}_t`,
  //   };
  // }
  // console.log(OrgChart.templates);
  // console.log({tags})

  // add tags
  // "hasChildren": {
  //   template: "withChildren"
  // }
  // tags["hasChildren"] = {
  //   template: "withChildren",
  // };

  //  templates: {
  //     withChildren: Object.assign({}, OrgChart.templates.base, {
  //       node: '<rect x="0" y="0" width="250" height="100" fill="lightblue"></rect>',
  //       plus: '<circle cx="225" cy="50" r="15" fill="green" stroke="black" stroke-width="2"></circle>',
  //   })
  // }

  // templates["withChildren"] = Object.assign({}, OrgChart.templates.base, {

  // console.log("testOrgBagan", testOrgBagan);

  // remove duplicate id in array data
  // data = data.filter((item, index, self) => self.findIndex((t) => t.id === item.id) === index);

  OrgChart.RESET_MOVABLE_ONEXPANDCOLLAPSE = true;
  OrgChart.SEARCH_CLOSE_RESULT_ON_ESCAPE_OR_CLICKOUTSIDE = true;
  // remove chart first, then create new chart
  const chartContainer = document.getElementById(id);
  if (chartContainer) {
    chartContainer.innerHTML = "";
  }
  if (document.getElementById(id)) {
    document.getElementById(id).innerHTML = "";
  }

  // Check if container exists, if not create it
  let containerElement;
  if (id === "osContainer") {
    // For legacy osContainer, try to find .chart-container instead
    containerElement = document.querySelector(".chart-container");
    if (!containerElement) {
      console.error("Chart container not found");
      return;
    }
  } else {
    containerElement = document.getElementById(id);
    if (!containerElement) {
      const container = document.createElement("div");
      container.id = id;
      document.body.appendChild(container);
      containerElement = container;
    }
  }

  let chart = new OrgChart(containerElement, {
    collapse: {
      ...param.collapsed,
      // level: 2,
      // allChildren: true,
    },
    template: "default_t",
    nodeBinding,
    enableSearch: false,
    assistantSeparation: 10,
    levelSeparation: 30,
    scaleInitial: OrgChart.match.boundary,
    fit: true, // Enable auto-fit
    // nodes: testOrgBagan,
    // nodes: test,
    nodes: data,
    align: OrgChart.ORIENTATION,
    // movable: OrgChart.movable.node,
    nodeMouseClick: false,
    // menu: {
    //   pdf: { text: "Export PDF" },
    //   png: { text: "Export PNG" },
    //   svg: { text: "Export SVG" },
    // },
    toolbar: {
      fullScreen: true,
      zoom: true,
      fit: true,
    },
    tags,
  });

  // chart.on("init", function (sender) {
  //   const title = document.createElement("button");
  //   title.style.position = "absolute";
  //   title.style.right = "0px";
  //   title.style.top = "87px";
  //   title.style.width = "50px";
  //   title.style.textAlign = "center";
  //   title.style.color = "#757575";
  //   title.style.backgroundColor = "transparent";
  //   title.style.border = "none";
  //   title.style.fontSize = "42px";
  //   title.style.color = "grey";

  //   title.innerHTML = `<i class="fa fa-refresh"></i>`;
  //   // add id to title
  //   title.addEventListener("click", function () {
  //     // Show loading for refresh with proper container detection
  //     if (typeof showChartLoading === "function") {
  //       showChartLoading("chart-container-custom");
  //     }

  //     setTimeout(() => {
  //       helperOrgChart(true, "osContainer", lsListOrgNode, true);
  //     }, 100);
  //   });
  //   chart.element.appendChild(title);

  //   // Hide loading when chart is ready with proper container detection
  //   setTimeout(() => {
  //     if (typeof hideChartLoading === "function") {
  //       hideChartLoading("chart-container-custom");
  //     }
  //   }, 100);

  //   // console.log("node", chart.nodes);
  //   // const nodes = chart.nodes;
  //   // // node object to array
  //   // const nodesArray = Object.keys(nodes).map((key) => nodes[key]);
  //   // nodesArray.forEach((node) => {
  //   //   if (!chart.getNode(node.id).children || chart.getNode(node.id).children.length === 0) {
  //   //     // add tags
  //   //     chart.addTag(node.id, "hidePlus");
  //   //   }
  //   //   console.log("node", chart.getNode(node.id).children);
  //   // });
  //   // chart.node.forEach((node) => {
  //   // if (!chart.getNode(node.id).children || chart.getNode(node.id).children.length === 0) {
  //   //   chart.addTag(node.id, "hidePlus");
  //   // }
  //   // });
  // });

  chart.onExportStart((args) => {
    args.styles += document.getElementById("myStyle").outerHTML;
  });

  chart.onExportEnd((args) => {
    console.log(args);
  });

  chart.onUpdated(() => {});

  chart.on("expcollclick", function (sender, collapse, id, ids) {
    // alert("masd");
  });

  chart.on("node-layout", function (sender, args) {
    const childrenCount = args?.childrenIds?.length;
    if (childrenCount > 10) {
      args.layout = OrgChart.treeRightOffset;
=======
// Organization Chart Loading Functions
function showChartLoading(
  containerClass,
  isCustom = false,
  height = "480px",
  width = "100%",
  text = "Loading Chart..."
) {
  let container = document.querySelector(`.${containerClass}`);
  container.innerHTML = CHART_LOADING_HTML;
  console.log({ containerClass, isCustom, height, width, text });

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
>>>>>>> e74399481b1764dd27736a160520eeeee58124dd
    } else {
      container.style.minWidth = "1200px";
      container.style.minHeight = "800px";
    }
<<<<<<< HEAD
  });

  chart.on("click", async (sender, node) => {
    // const param = {};
    const nodeID = node.node.id;
    await modalJobPopup(nodeID);

    // expandCollapse
    // chart.expand(node.node.id);

    // const nodeID = node.node.id;
    // console.log("nodeID", nodeID);
    // const dataChart = await chartShow({
    //   draftId: organizationAttribute.orgUnitId,
    //   jobCode: nodeID,
    //   depth: 2,
    // });
    // dataChart.data.forEach((item) => {
    //   item.id = item.id_org_unit;
    // });

    // remove find where pid = nodeID
    // const dataChartFiltered = dataChart.data
    //   .filter((item) => !data.find((element) => element.id === item.id_org_unit))
    //   .filter((item) => item.pid == nodeID);
    // console.log("dataChartFiltered", dataChartFiltered);
    // dataChartFiltered.forEach((item) => {
    //   setTimeout(() => {
    //     chart.addNode(item);
    //   }, 300);
    // });

    // check if node have children
    //  check if node have children expanded
  });

  // chart on right click
  chart.on("contextmenu", function (sender, args) {
    args.event.preventDefault(); // Prevent default browser menu

    // Remove existing menu
    let existingMenu = document.getElementById("custom-menu");
    if (existingMenu) {
      existingMenu.remove();
    }
  });

  chart.on("searchclick", (sender, node) => {
    return false;
  });

  $("#handleExportPdf")
    .off("click")
    .on("click", function () {
      const nodeId = $("#positionId").val();
      chart.exportPDF({
        filename: `${nodeId}.pdf`,
        expandChildren: false,
      });
      $("#modalDetailJob").modal("hide");
    });

  $("#handleExportPng")
    .off("click")
    .on("click", function () {
      const nodeId = $("#positionId").val();
      chart.exportPNG({
        // expandChildren: true,
        // min: false,
        openInNewTab: true,
        filename: `${nodeId}.png`,
        // parentLevels: 1,
        // childLevels: 1,
        expandChildren: false,
      });
      $("#modalDetailJob").modal("hide");
    });

  $("#handleExportSvg")
    .off("click")
    .on("click", function () {
      const nodeId = $("#positionId").val();
      chart.exportSVG({
        // expandChildren: true,
        // min: false,
        filename: `${nodeId}.svg`,
        // parentLevels: 1,
        // childLevels: 1,
        expandChildren: false,
      });
      $("#modalDetailJob").modal("hide");
    });

  // $("#handleExport").on("click", function () {
  //   const nodeId = $("#positionId").val();
  //   const position = lsListPosition.find((item) => item.positionId == nodeId);
  //   console.log("masuk 3");
  //   // exportPDF(nodeId);
  //   chart.exportPDF({ filename: `${position.positionName}.pdf`, expandChildren: false, nodeId: nodeId });
  //   // chart remove certain tags
  //   chart.removeTags(["pointed"]);

  //   $("#modalDetailJob").modal("hide");
  // });

  // function handleExport() {
  //   const nodeId = $("#positionId").val();
  //   console.log("masuk 2");
  // }

  if (object?.expand) {
    let selfNode = data.find((item) => item.id == object.nodeId);
    const getChildrenNode = data.filter((item) => item.pid == object.nodeId).map((item) => item.id) || [];
    const siblingNode = data.filter((item) => item.pid == selfNode?.pid).map((item) => item.id) || [];
    const getAll = [...getChildrenNode, ...siblingNode];
    setTimeout(() => {
      chart.expand(object.nodeId, getAll);
    }, 500);
    setTimeout(() => {
      chart.fit();
    }, 800);
=======
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
>>>>>>> e74399481b1764dd27736a160520eeeee58124dd
  }
}
