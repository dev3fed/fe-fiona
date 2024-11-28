function checkLocalStorage() {
  localStorage.removeItem("fungsi");
  localStorage.removeItem("tugasHa");
  localStorage.removeItem("koordinasi");
  localStorage.removeItem("relation");
  localStorage.removeItem("mandatori");
  localStorage.removeItem("general");
  localStorage.removeItem("spesifik");
  localStorage.getItem("fungsi") ? localStorage.getItem("fungsi") : localStorage.setItem("fungsi", "");
  localStorage.getItem("tugasHa") ? localStorage.getItem("tugasHa") : localStorage.setItem("tugasHa", "");
  localStorage.getItem("koordinasi") ? localStorage.getItem("koordinasi") : localStorage.setItem("koordinasi", "");
  localStorage.getItem("relation") ? localStorage.getItem("relation") : localStorage.setItem("relation", "");
  localStorage.getItem("mandatori") ? localStorage.getItem("mandatori") : localStorage.setItem("mandatori", "");
  localStorage.getItem("general") ? localStorage.getItem("general") : localStorage.setItem("general", "");
  localStorage.getItem("spesifik") ? localStorage.getItem("spesifik") : localStorage.setItem("spesifik", "");
}

function updateIdentifikasiJob(params) {
  $("#function").text(params.function);
  $("#location").text(params.location);
  $("#directorat").text(params.directorat);
  $("#directReport").text(params.directReport);
  $("#sk").text(params.sk);
}

function updateTable(params, data, rowHeader, refer) {
  // console.log(params, data, rowHeader);
  // get table body
  const tableBody = $(`#${params}Table tbody`);
  tableBody.empty();
  let row = "";
  if (data.length === 0) {
    row = `<tr>
      <td colspan="100%" class="text-center p-10">Data not found</td>
    </tr>`;
    tableBody.append(row);
    return;
  }
  data.forEach((item) => {
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
      const arrayType = Array.isArray(item[header]);
      if (arrayType) {
        row += `<td class="tdClass" ><ul style="list-style-type:disc">`;
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
}

function getJobReference(params) {
  updateIdentifikasiJob(params.identifikasi);
  updateTable("tugasUmum", params.tugasUmum, ["id", "header", "tugas"]);
  updateTable("wewenang", params.wewenang, ["id", "wewenang"]);
  updateTable("persyaratan", params.education);
}

async function getJobReferenceDetail() {
  // alert("masok");

  // checkbox_id_ where class contains "checbox-compare"
  // const selectedJob = Array.from(document.querySelectorAll("input[type=checkbox].checbox-compare:checked"))
  //   .map((item) => item.id.replace("checkbox_id_", "")) // to number
  //   .map((item) => parseInt(item));

  // const findData = dataJobDescCompare.filter((item) => selectedJob.includes(item.identifikasi.id));
  isDisableButton(false);
  $(".summernote").summernote("enable");

  const dataFungsi = localStorage.getItem("fungsi") !== "" ? JSON.parse(localStorage.getItem("fungsi")) : [];
  let codeFungsi = "";
  dataFungsi.map((item) => {
    codeFungsi += `${item?.fungsi}<br/><span style="font-size:10px;color:grey">(reference from : ${item?.reference})</span><br/><br/>`;
  });
  $(".summernote").summernote("code", codeFungsi ?? "");
  // input to fungsi jabatan in summernote
  const dataTugasHa = localStorage.getItem("tugasHa") !== "" ? JSON.parse(localStorage.getItem("tugasHa")) : [];
  const dataKoordinasi =
    localStorage.getItem("koordinasi") !== "" ? JSON.parse(localStorage.getItem("koordinasi")) : [];
  const dataRelation = localStorage.getItem("relation") !== "" ? JSON.parse(localStorage.getItem("relation")) : [];
  const dataMandatori = localStorage.getItem("mandatori") !== "" ? JSON.parse(localStorage.getItem("mandatori")) : [];
  const dataGeneral = localStorage.getItem("general") !== "" ? JSON.parse(localStorage.getItem("general")) : [];
  const dataSpesifik = localStorage.getItem("spesifik") !== "" ? JSON.parse(localStorage.getItem("spesifik")) : [];

  updateTable("tugasHa", dataTugasHa, ["id", "responsible", "output", "lead", "action"]);
  updateTable("koordinasi", dataKoordinasi, ["id", "internal", "aktivitas", "action"]);
  updateTable("relation", dataRelation, ["id", "eksternal", "aktivitas", "action"]);
  // updateTable("mandatori", dataMandatori, ["id", "mandatori", "action"]);
  // kompetensiTable tbody empty
  const tableBody = $(`#kompetensiTable tbody`);
  tableBody.empty();
  // generalTable tbody empty
  let row = "<tr>";
  row += `<td class="tdClass"><b>Kompetensi Teknis Mandatory</b></td>`;
  row += `<td class="tdClass"><b>Level</b></td>`;
  row += `</tr>`;
  dataMandatori.forEach((item) => {
    const reference = item.reference
      ? `<br/><span style="font-size:10px;color:grey">(reference from : ${item.reference})</span>`
      : "";
    row += `<tr>`;
    row += `<td class="tdClass">${item?.komtekMandatoriName}${reference}</td>`;
    row += `<td class="tdClass">${item?.level}</td>`;
    row += `</tr>`;
  });

  row += `<tr>`;
  row += `<td class="tdClass"><b>Kompetensi Teknis General</b></td>`;
  row += `<td class="tdClass"><b>Level</b></td>`;
  row += `<tr>`;
  dataGeneral.forEach((item) => {
    const reference = item.reference
      ? `<br/><span style="font-size:10px;color:grey">(reference from : ${item.reference})</span>`
      : "";
    row += `<tr>`;
    row += `<td class="tdClass">${item?.komtekGeneralName}${reference}</td>`;
    row += `<td class="tdClass">${item?.level}</td>`;
    row += `</tr>`;
  });
  row += `<td class="tdClass"><b>Kompetensi Teknis Spesifik</b></td>`;
  row += `<td class="tdClass"><b>Level</b></td>`;
  row += `</tr>`;
  dataSpesifik.forEach((item) => {
    const reference = item.reference
      ? `<br/><span style="font-size:10px;color:grey">(reference from : ${item.reference})</span>`
      : "";
    row += `<tr>`;
    row += `<td class="tdClass">${item?.komtekSpesifikName}${reference}</td>`;
    row += `<td class="tdClass">${item?.level}</td>`;
    row += `</tr>`;
  });
  tableBody.append(row);
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

async function searchJobCompare(event, isPercentage) {
  const chkJobList = document.getElementById("chk-job-list");
  const jobSelectedList = document.getElementById("job-selected-list");
  if (isPercentage) {
    const value = event.target.value;
    const chkJobListPercentage = document.getElementById("chk-job-list-percentage");

    // chkJobListPercentage.innerHTML = dataJobDescCompare
    //   .map((item) => ({
    //     id: item?.identifikasi?.id,
    //     name: item?.identifikasi?.jobName,
    //     percentage: Math.floor(Math.random() * 50) + 50,

    //   }))
    //   .filter((item) => item.percentage >= value)
    //   .map(
    //     (item) =>
    //       `
    //       <div class="row-item">
    //         <div class="column-item-name" onClick="applyCompare(${item.id})">
    //           ${item.name} <span class="badge badge-danger">${item.percentage}% Similarities</span>
    //         </div>
    //       </div>
    //     `
    //   )
    //   .join("");
    const findData = dataJobDescCompare.filter((item) => item.identifikasi.percentage >= value);
    const urlParams = new URLSearchParams(window.location.search);
    const idPos = urlParams.get("id");
    const selectedIdPos = dataJobDesc.find((item) => item.identifikasi.id == idPos);
    // if selectedIdPos?.identifikasi?.jobName include manager
    let include = "sbm";
    if (selectedIdPos?.identifikasi?.jobName.toLowerCase().includes("manager")) {
      include = "manager";
    }

    const dataCk = dataJobDescCompare
      .map((item) => ({
        id: item?.identifikasi?.id,
        name: item?.identifikasi?.jobName,
        percentage: item?.identifikasi?.percentage,
      }))
      .filter((item) => item.percentage >= value && item.name.toLowerCase().includes(include));

    dataCk.forEach((item) => {
      let color = "";
      if (item.percentage >= 90) {
        color = "background-color: #28a745";
      } else if (item.percentage >= 80) {
        color = "background-color: #17a2b8";
      } else if (item.percentage >= 70) {
        color = "background-color: #ffc107";
      } else if (item.percentage >= 60) {
        color = "background-color: #007bff";
      } else if (item.percentage >= 50) {
        color = "background-color: #dc3545";
      }
      item.badge = `<span class="badge" style="${color}">${item.percentage}% Similarities</span>`;
    });

    chkJobListPercentage.innerHTML = dataCk
      .map(
        (item) =>
          `
          <div class="row-item">
            <div class="column-item-name" onClick="applyCompare(${item.id})">
              ${item.name} 
              ${item.badge}
            </div>
          </div>
        `
      )
      .join("");

    return;
  }

  const data = dataJobDescCompare
    .map((item) => ({ id: item?.identifikasi?.id, name: item?.identifikasi?.jobName }))
    .filter((item) => item.name.toLowerCase().includes(event?.target?.value.toLowerCase()));

  chkJobList.innerHTML = data
    .map(
      (item) => `
        <div class="row-item">
          <div class="column-item-name" onClick="applyCompare(${item.id})"> 
            ${item.name}
          </div>
        </div>
      `
    )
    .join("");

  // chkJobList.addEventListener("change", (e) => {
  //   if (e.target.classList.contains("checkbox_animated")) {
  //     const value = e.target.value;
  //     const name = e.target.getAttribute("data-name");

  //     if (e.target.checked) {
  //       if (!document.getElementById(`selected-job-${value}`)) {
  //         const selectedItem = document.createElement("div");
  //         selectedItem.className = "selected-item";
  //         selectedItem.id = `selected-job-${value}`;
  //         selectedItem.innerHTML = `
  //               ${name}
  //               <span class="remove-item" data-value="${value}">
  //                 <i class="fas fa-times"></i>
  //               </span>
  //             `;
  //         jobSelectedList.appendChild(selectedItem);
  //       }
  //     } else {
  //       const itemToRemove = document.getElementById(`selected-job-${value}`);
  //       if (itemToRemove) itemToRemove.remove();
  //     }
  //   }
  // });

  // jobSelectedList.addEventListener("click", (e) => {
  //   if (e.target.closest(".remove-item")) {
  //     const value = e.target.closest(".remove-item").getAttribute("data-value");
  //     const checkbox = document.querySelector(`input[type="checkbox"][value="${value}"]`);
  //     if (checkbox) checkbox.checked = false;
  //     document.getElementById(`selected-job-${value}`).remove();
  //   }
  // });
}

async function applyCompare(id) {
  // open modal
  $("#modalJobCompareDetail").modal("show");
  // const jobSelectedList = document.getElementById("job-selected-list");
  // const selectedItems = Array.from(jobSelectedList.children).map((item) => ({
  //   id: item.id.replace("selected-job-", ""),
  //   name: item.textContent.trim(),
  // }));
  // console.log("selectedItems", selectedItems);
  // $("#chooseJob").hide();
  // $("#detailJob").show();
  // selectedData.selectedJobDesc = selectedItems;
  await applySelectedData(id);
}

async function addJobReference() {
  $("#modalJobCompare").modal("show");
  $("#percentageDiv").hide();
  // $("#detailJob").show();

  // searchJobCompare();
}

async function applySelectedData(id) {
  $("#detailJob").empty();
  let data = dataJobDescCompare.filter((item) => item.identifikasi.id === id);
  selectedData.selectedJobDesc = data[0];
  let row = "<div class='row'>";
  for (const item of data) {
    const listInternal = item?.koordinasi;
    const listExternal = item?.relation;
    row += `
      <div class="col-md-12">
        <div class="container vertical-scroll scroll-content">
          <div class="">
          <label class="container-checkbox" id="detailJobName">${item?.identifikasi?.jobName}
            <input onclick="checkboxReference(this)" type="checkbox" id="checkbox_jobdesc_all" class="checkbox_animated checbox-compare" checked>
            <span class="checkmark"></span>
          </label>
          </div>
          <h6 class="card-title mt-4">1. IDENTIFIKASI JABATAN</h6>
          <div class="table-responsive ">
            <table class="tableIndentifikasiCompare">
              <tbody>
                  <tr>
                      <td>Unit Kerja / Fungsi</td>
                      <td><span id="function">${item?.identifikasi?.function}</span></td>
                  </tr>
                  <tr>
                      <td>Lokasi</td>
                      <td><span id="location">${item?.identifikasi?.location}</span></td>
                  </tr>
                  <tr>
                      <td>Direktorat</td>
                      <td><span id="directorat">${item?.identifikasi?.directorat}</span></td>
                  </tr>
                  <tr>
                      <td>Atasan Langsung</td>
                      <td><span id="directReport">${item?.identifikasi?.directReport}</span></td>
                  </tr>
                  <tr>
                      <td>Surat Keputusan</td>
                      <td><span id="sk">${item?.identifikasi?.location}</span></td>
                  </tr>
              </tbody>
            </table>
          </div>`;
    row += `<br>
          <label class="container-checkbox mt-3"><h6>2. FUNGSI JABATAN</h6>
            <input onclick="checkboxReference(this)" type="checkbox" id="checkbox_fungsi" class="checkbox_animated checbox-compare" checked>
            <span class="checkmark" style="width:20px;height:20px" ></span>
          </label>
          <span class="" id="fungsiText">${item?.fungsi}.</span> 
          `;
    row += `<br>
          <label class="container-checkbox mt-3"><h6>3. TUGAS, TANGGUNG JAWAB DAN HASIL AKHIR</h6>
            <input onclick="checkboxReference(this)" type="checkbox" id="checkbox_tugas_ha_all" class="checkbox_animated checbox-compare" checked>
            <span class="checkmark" style="width:20px;height:20px" ></span>
          </label>
          <span class="mt-2" style="font-size:11px;color:grey">Merupakan acuan dalam melaksanakan tugasnya. Jika dibutuhkan, dalam situasi tertentu tingkat prioritas dan perubahan tugas dan tanggung jawab dapat disesuaikan dengan kebutuhan perusahaan.</span>
        `;
    for (let j = 0; j < item?.tugasHa.length; j++) {
      const listItemOutput = await addList(item?.tugasHa[j].output);
      const listItemLeadingIndicator = await addList(item?.tugasHa[j].lead);
      row += `
            <div class="mt-2">
              <div class="card p-1 m-0">
                <div class="card-header" style="background:#B0D1E4;color:#006CA9;padding:8px;font-weight: 600;">
                  <label class="container-checkbox m-0"><span style="font-size:16px !important"> No. ${item?.tugasHa[j].id}</span>
                    <input onclick="checkboxReference(this)" type="checkbox" id="checkbox_tugas_ha_${item?.tugasHa[j].id}" class="checkbox_animated checbox-compare" checked>
                    <span class="checkmark" style="top:30%;left:10px;width:17px;height:17px" ></span>
                  </label>
                </div>
                <div class="card-body p-2" style="border:1px solid #B0D1E4">
                  <div class="p-2"style="border:1px solid #EAEAEB;border-radius:8px">
                  <h6 class="mt-2">Tugas & Tanggung Jawab</h6>
                  <hr>
                  <span class="mt-1 text-secondary">Mengarahkan, memonitor dan mengevaluasi kegiatan pengembangan dan pengelolaan event produk ritel seperti pameran produk dll</span>
                  </div>
                  <div class="p-2 mt-3"style="border:1px solid #EAEAEB;border-radius:8px">
                    <h6 class="mt-2">Hasil Akhir yang Diharapkan</h6>
                    <hr>
                    <ul class="m-3 text-secondary" style="list-style-type:disc">
                    ${listItemOutput}
                    </ul>
                  </div>
                  <div class="p-2 mt-3"style="border:1px solid #EAEAEB;border-radius:8px">
                    <h6 class="mt-2">Lead Indicator</h6>
                    <hr>
                    <ul class="m-3 text-secondary" style="list-style-type:disc">
                    ${listItemLeadingIndicator}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          `;
    }
    // row += `<br>
    //       <h6 class="mt-4">4. TUGAS DAN TANGGUNG JAWAB UMUM</h6>
    //     `;
    // for (let j = 0; j < item?.tugasUmum.length; j++) {
    //   const listItemOutput = await addList(item?.tugasUmum[j].tugas);
    //   row += `
    //         <div class="mt-2">
    //           <div class="card p-1 m-0">
    //             <div class="card-header" style="background:#B0D1E4;color:#006CA9;padding:8px;font-weight: 600;font-size: 14px;">
    //               <span style="font-size:16px !important;color:#006CA9;padding-left:15px">No. ${item?.tugasUmum[j].id}</span>
    //             </div>
    //             <div class="card-body p-2" style="border:1px solid #B0D1E4">
    //               <div class="p-2"style="border:1px solid #EAEAEB;border-radius:8px">
    //               <h6 class="mt-2">Tugas & Tanggung Jawab</h6>
    //               <hr>
    //               <span class="mt-1">${item?.tugasUmum[j].header}</span>
    //               </div>
    //               <div class="p-2 mt-3"style="border:1px solid #EAEAEB;border-radius:8px">
    //                 <h6 class="mt-2">Hasil Akhir yang Diharapkan</h6>
    //                 <hr>
    //                 <ul class="m-3 text-secondary" style="list-style-type:disc">
    //                 ${listItemOutput}
    //                 </ul>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       `;
    // }
    // row += `<br>
    //       <h6 class="mt-4">5. WEWENANG</h6>
    //       <div class="table-responsive m-t-10">
    //           <table class="tableMasterData w-100" id="masterDataList">
    //               <thead>
    //                   <tr>
    //                       <th>Id</th>
    //                       <th>Wewenang</th>
    //                   </tr>
    //               </thead>
    //               <tbody>
    //               `;
    // for (let j = 0; j < item?.wewenang.length; j++) {
    //   row += `
    //                     <tr class="p-3">
    //                         <td class="p-3">${item?.wewenang[j].id}</td>
    //                         <td class="p-3">${item?.wewenang[j].wewenang}</td>
    //                     </tr>
    //                   `;
    // }
    // row += ` </tbody>
    //             </table>
    //         </div>
    // `;
    row += `
          <br>
          <label class="container-checkbox mt-3"><h6>4. KOORDINASI INTERNAL</h6>
            <input onclick="checkboxReference(this)" type="checkbox" id="checkbox_internal_all" class="checkbox_animated checbox-compare" checked>
            <span class="checkmark" style="width:20px;height:20px" ></span>
          </label>
          <div class="table-responsive mt-2">
            <table class="tableMasterData">
                <thead>
                    <tr>
                        <th>Pihak Internal</th>
                        <th>Aktivitas</th>
                    </tr>
                </thead>
              <tbody>`;
    for (const element of listInternal) {
      const listItemOutput = await addList(element.aktivitas);
      row += `
                        <tr class="p-3">
                            <td class="p-3">
                              <label class="container-checkbox m-0"><span style="font-size:14px !important">${element.internal}</span>
                                <input onclick="checkboxReference(this)" type="checkbox" id="checkbox_internal_${element.id}" class="checkbox_animated checbox-compare" checked>
                                <span class="checkmark" style="top:30%;left:10px;width:17px;height:17px" ></span>
                              </label>
                            </td>
                            <td class="p-3">${listItemOutput}</td>
                        </tr>
                      `;
    }
    row += ` </tbody>
            </table>
            </div>
            `;
    row += `
          <label class="container-checkbox mt-3"><h6>5. KOORDINASI EKSTERNAL</h6>
            <input onclick="checkboxReference(this)" type="checkbox" id="checkbox_eksternal_all" class="checkbox_animated checbox-compare" checked>
            <span class="checkmark" style="width:20px;height:20px" ></span>
          </label>
          <div class="table-responsive mt-2">
            <table class="tableMasterData">
                <thead>
                    <tr>
                        <th>Pihak Eksternal</th>
                        <th>Aktivitas</th>
                    </tr>
                </thead>
              <tbody>`;
    for (const element of listExternal) {
      const listItemOutput = await addList(element?.aktivitas);
      row += `
                        <tr class="p-3">
                            <td class="p-3">
                              <label class="container-checkbox m-0"><span style="font-size:14px !important">${element.eksternal}</span>
                                <input onclick="checkboxReference(this)" type="checkbox" id="checkbox_eksternal_${element.id}" class="checkbox_animated checbox-compare" checked>
                                <span class="checkmark" style="top:30%;left:10px;width:17px;height:17px" ></span>
                              </label>
                            </td>
                            <td class="p-3">${listItemOutput}</td>
                        </tr>
                      `;
    }
    row += ` </tbody>
            </table>
            </div>
            `;
    row += `
          <br>
          <label class="container-checkbox mt-3"><h6>6. PERSYARATAN JABATAN</h6>
            <input onclick="checkboxReference(this)" type="checkbox" id="checkbox_persyaratan_all" class="checkbox_animated checbox-compare" checked>
            <span class="checkmark" style="width:20px;height:20px" ></span>
          </label>
          <div class="mt-2">
            <div class="card p-1 m-0">
              <div class="card-header" style="background:#B0D1E4;color:#006CA9;padding:8px;font-weight: 600;font-size: 14px;">
                1. Pendidikan dan Pengalaman
              </div>
              <div class="card-body p-2" style="border:1px solid #B0D1E4">
                  `;
    for (let j = 0; j < item?.education.length; j++) {
      row += `${item?.education[j]} <br><br>`;
    }
    row += `
              </div>
            </div>
          </div>
        `;
    row += `
          <br>
          <div class="mt-2">
            <div class="card p-1 m-0">
              <div class="card-header" style="background:#B0D1E4;color:#006CA9;padding:8px;font-weight: 600;font-size: 14px;">
                2. Persyaratan Khusus
              </div>
              <div class="card-body p-2" style="border:1px solid #B0D1E4">
                  `;
    for (let j = 0; j < item?.persyaratanKhusus.length; j++) {
      row += `${item?.persyaratanKhusus[j]} <br><br>`;
    }
    row += `
              </div>
            </div>
          </div>
        `;
    row += `
          <div class="mt-2">
            <div class="card p-1 m-0">
                <div class="card-header" style="background:#B0D1E4;color:#006CA9;padding:8px;font-weight: 600;font-size: 14px;">
                  3. Kompetensi
                </div>
              <div class="card-body p-2" style="border:1px solid #B0D1E4">
                <div class="p-2 mb-3"style="border:1px solid #EAEAEB;border-radius:8px">
                <h6 class="mt-2">Kompetensi Teknis Mandatori</h6>
                <hr>
                <div class="table-responsive m-t-10">
                  <table class="tableMasterData w-100" id="masterDataList">
                      <thead>
                          <tr>
                              <th>Nama Kompetensi</th>
                              <th>Level Kedalaman</th>
                          </tr>
                      </thead>
                      <tbody>`;
    for (let j = 0; j < item?.komtekMandatori.length; j++) {
      row += `
            <tr class="p-3">
                <td class="p-3">
                  <label class="container-checkbox m-0"><span style="font-size:14px !important">${item?.komtekMandatori[j].komtekMandatoriName}</span>
                    <input onclick="checkboxReference(this)" type="checkbox" id="checkbox_persyaratan_mandatori_${item?.komtekMandatori[j].id}" class="checkbox_animated checbox-compare" checked>
                    <span class="checkmark" style="top:30%;left:10px;width:17px;height:17px" ></span>
                  </label>
                </td>
                <td class="p-3">${item?.komtekMandatori[j].level}</td>
            </tr>
          `;
    }
    row += `</tbody>
                  </table>
                  </div>
                  </div>
                `;

    row += ` 
              <div class="p-2 mb-3"style="border:1px solid #EAEAEB;border-radius:8px">
                <h6 class="mt-3">Kompetensi Teknis General</h6>
                <hr>
                <div class="table-responsive m-t-10">
                  <table class="tableMasterData w-100" id="masterDataList">
                      <thead>
                          <tr>
                              <th>Nama Kompetensi</th>
                              <th>Level Kedalaman</th>
                          </tr>
                      </thead>
                      <tbody>`;
    for (let j = 0; j < item?.komtekGeneral.length; j++) {
      row += `
                          <tr class="p-3">
                            <td class="p-3">
                              <label class="container-checkbox m-0"><span style="font-size:14px !important">${item?.komtekGeneral[j].komtekGeneralName}</span>
                                <input onclick="checkboxReference(this)" type="checkbox" id="checkbox_persyaratan_general_${item?.komtekGeneral[j].id}" class="checkbox_animated checbox-compare" checked>
                                <span class="checkmark" style="top:30%;left:10px;width:17px;height:17px" ></span>
                              </label>
                            </td>
                            <td class="p-3">${item?.komtekGeneral[j].level}</td>
                          </tr>
                        `;
    }
    row += `</tbody>
                  </table>
                </div>
                </div>`;

    row += ` 
                <div class="p-2"style="border:1px solid #EAEAEB;border-radius:8px">
                <h6 class="mt-3">Kompetensi Teknis Spesifik</h6>
                <hr>
                <div class="table-responsive m-t-10">
                  <table class="tableMasterData w-100" id="masterDataList">
                      <thead>
                          <tr>
                              <th>Nama Kompetensi</th>
                              <th>Level Kedalaman</th>
                          </tr>
                      </thead>
                      <tbody>`;
    for (let j = 0; j < item?.komtekSpesifik.length; j++) {
      row += `
                          <tr class="p-3">
                            <td class="p-3">
                                <label class="container-checkbox m-0"><span style="font-size:14px !important">${item?.komtekSpesifik[j].komtekSpesifikName}</span>
                                  <input onclick="checkboxReference(this)" type="checkbox" id="checkbox_persyaratan_spesifik_${item?.komtekSpesifik[j].id}" class="checkbox_animated checbox-compare" checked>
                                  <span class="checkmark" style="top:30%;left:10px;width:17px;height:17px" ></span>
                                </label>
                              </td>    
                            <td class="p-3">${item?.komtekSpesifik[j].level}</td>
                          </tr>
                        `;
    }
    row += `</tbody>
                  </table>
                    </div>
                    </div>
                </div>

                </div>
                </div>`;

    // row += ` </div>
    //         </div>
    //       </div>
    //     `;
    row += `
        </div>
      </div>`;
  }
  row += "</div>";
  $("#detailJob").append(row);
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

function createJobDesc(id) {
  const redirectTo = "/job-description/detail?create=true&id=" + id;
  window.location.href = redirectTo;
}

function detailJobDesc(id) {
  const redirectTo = "/job-description/detail?&id=" + id;
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

async function saveReference() {
  const dataSelected = selectedData.selectedJobDesc;
  const checkboxList = Array.from(document.querySelectorAll("input[type=checkbox].checbox-compare")).filter(
    (item) => !item.id.includes("all") && item.checked
  );
  const checboxFungsi = checkboxList.find((item) => item.id === "checkbox_fungsi");
  const checboxTugasHa = checkboxList.filter((item) => item.id.includes("checkbox_tugas_ha"));
  const checboxInternal = checkboxList.filter((item) => item.id.includes("checkbox_internal"));
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

  // hide modal
  // swal confirmation
  swal({
    title: "Are you sure?",
    text: "You will save this reference to your job description",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then(async (willSave) => {
    if (willSave) {
      // redirectTo("job-description");
      await getJobReferenceDetail();
      $("#modalJobCompareDetail").modal("hide");
      swal("Success!", "Reference has been saved", "success");
    }
  });
}
