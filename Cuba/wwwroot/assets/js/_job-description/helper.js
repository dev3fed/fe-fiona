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
      <td colspan="100%" class="text-center p-30">Data not found</td>
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
              <i class="fas fa-info-circle" data-toggle="popover" data-placement="top" title="Popover title" data-content="And here's some amazing content. It's very engaging. Right?"></i> 
            </div>
          </div>
        `,
      )
      .join("");

    $('[data-toggle="popover"]').popover();
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
      `,
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
  $("#modalJobCompareDetail").modal("show");
  await applySelectedData(id);
}

async function addJobReference() {
  $("#modalJobCompare").modal("show");
  $("#searchDiv").hide();
  // $("#detailJob").show();

  // searchJobCompare();
}

async function applySelectedData(id) {
  const arrayId = ["identifikasi", "fungsi", "tugas-ha", "koordinasi-internal", "relasi-eksternal", "stk"];
  arrayId.forEach((item) => {
    $(`#${item}`).empty();
  });
  let data = dataJobDescCompare.find((item) => item.identifikasi.id === id);
  selectedData.selectedJobDesc = data;
  let row = "<div class='row'>";
  const identifikasi = document.getElementById("identifikasi");
  const fungsi = document.getElementById("fungsi");
  const tugasHa = document.getElementById("tugas-ha");
  const koordinasiInternal = document.getElementById("koordinasi-internal");
  const relasiEksternal = document.getElementById("relasi-eksternal");
  const stk = document.getElementById("stk");

  // jaga-jaga kalau data tidak ada
  /* <div class="">
  <label class="container-checkbox" id="detailJobName">${data?.identifikasi?.jobName}
    <input onclick="checkboxReference(this)" type="checkbox" id="checkbox_jobdesc_all" class="checkbox_animated checbox-compare" checked>
    <span class="checkmark"></span>
  </label>
</div> */
  const identifikasiDiv = `
    <div class="col-md-12 mb-4">
        <span class="section-name mb-2 ">IDENTIFIKASI JABATAN</span>
        <div class="table-responsive ">
          <table class="tableIndentifikasiCompareModal">
            <tbody>
              <tr>
                <td class="identifikasi-header">Unit Kerja / Fungsi</td>
                <td><span class="content-class" id="function">${data?.identifikasi?.function}</span></td>
              </tr>
              <tr>
                <td class="identifikasi-header">Lokasi</td>
                <td><span class="content-class" id="location">${data?.identifikasi?.location}</span></td>
              </tr>
              <tr>
                <td class="identifikasi-header">Direktorat</td>
                <td><span class="content-class" id="directorat">${data?.identifikasi?.directorat}</span></td>
              </tr>
              <tr>
                <td class="identifikasi-header">Atasan Langsung</td>
                <td><span class="content-class" id="directReport">${data?.identifikasi?.directReport}</span></td>
              </tr>
              <tr>
                <td class="identifikasi-header">Surat Keputusan</td>
                <td><span class="content-class" id="sk">${data?.identifikasi?.location}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
    </div>
        `;
  identifikasi.innerHTML = identifikasiDiv;

  const fungsiDiv = `
    <div class="col-md-12 mb-4">
        <label class="container-checkbox mt-3"><span class="section-name mb-2 ">FUNGSI JABATAN</span>
          <input onclick="checkboxReference(this)" type="checkbox" id="checkbox_fungsi" class="checkbox_animated checbox-compare" checked>
          <span class="checkmark" style="width:20px;height:20px" ></span>
        </label>
        <span class="content-class" id="fungsiText">${data?.fungsi}.</span>
    </div>
    `;
  fungsi.innerHTML = fungsiDiv;

  let tugasHaRow = `
    <div class="table-responsive" style="overflow-x: auto;">
      <table class="tableMasterData" id="tugasHaTable" style="width:100%">
        <thead>
          <tr>
            <th style="width:10%">
              <label class="container-checkbox mt-3"><span class="section-name mb-2 "></span>
                <input onclick="checkboxReference(this)" type="checkbox" id="checkbox_tugas_ha" class="checkbox_animated checbox-compare" checked>
                <span class="checkmark" style="width:20px;height:20px" ></span>
              </label>
            </th>
            <th style="width:30%">Tugas & Tanggung Jawab</th>
            <th style="width:30%">Hasil Akhir Yang Diharapkan</th>
            <th style="width:30%">Leading Indicator</th>
          </tr>
        </thead>
        <tbody class="tbodyTugasHa">
        </tbody>
      </table>
    </div>
    `;

  const tugasHaDiv =
    `
    <div class="col-md-12 mb-3">
      <span class="section-name mb-1 ">TUGAS, TANGGUNG JAWAB DAN HASIL AKHIR</span>
      <span class="text-muted f-12" style="">Merupakan acuan dalam melaksanakan tugasnya. Jika dibutuhkan, dalam situasi tertentu tingkat prioritas dan perubahan tugas dan tanggung jawab dapat disesuaikan dengan kebutuhan perusahaan.</span>
    </div>
    <div class="col-md-12 mb-3">
    ` +
    tugasHaRow +
    `
    </div>
    <div class="col-12 mb-3">
        <span class="notifWarning">There are one or more tasks & responsibilities for which references are not available in this position, so it is necessary to seek references from other positions.</span>
    </div>
    `;

  tugasHa.innerHTML = tugasHaDiv;

  // tbodyTugasHa
  let bodyTugasHa = document.querySelector(".tbodyTugasHa");
  for (let j = 0; j < data?.tugasHa.length; j++) {
    const listItemOutput = await addList(data?.tugasHa[j].output);
    const listItemLeadingIndicator = await addList(data?.tugasHa[j].lead);

    bodyTugasHa.innerHTML += `
    <tr>
      <td class="p-3" style="place-content: flex-start">
        <label class="container-checkbox m-0"><span style="padding-top: 9px;padding-left: 5px;">${data?.tugasHa[j].id}</span>
          <input onclick="checkboxReference(this)" type="checkbox" id="checkbox_tugas_ha_${data?.tugasHa[j].id}" class="checkbox_animated checbox-compare" checked>
          <span class="checkmark" style="top:30%;left:10px;width:17px;height:17px" ></span>
        </label>
      </td>
      <td class="p-3" style="place-content: flex-start">
        <span class="">${data?.tugasHa[j].responsible}</span>
      </td> 
      <td class="p-3" style="place-content: flex-start">
        <ul class="" style="list-style-type:disc">
          ${listItemOutput}
        </ul>
      </td>
      <td class="p-3" style="place-content: flex-start">
        <ul class="" style="list-style-type:disc">
          ${listItemLeadingIndicator}
        </ul>
      </td>
    </tr>
    `;
  }

  let koordinasiInternalRow = `
    <div class="table-responsive" style="overflow-x: auto;">
      <table class="tableMasterData" id="koordinasiInternalTable" style="width:100%">
        <thead>
          <tr>
            <th style="width:10%">
              <label class="container-checkbox mt-3"><span class="section-name mb-2 "></span>
                <input onclick="checkboxReference(this)" type="checkbox" id="checkbox_ki" class="checkbox_animated checbox-compare" checked>
                <span class="checkmark" style="width:20px;height:20px" ></span>
              </label>
            </th>
            <th style="width:35%">Pihak Internal</th>
            <th style="width:55%">Aktivitas</th>
          </tr>
        </thead>
        <tbody class="tbodyKoordinasiInternal">
        </tbody>
      </table>
    </div>
  `;

  const koordinasiInternalDiv =
    `
    <div class="col-md-12 mb-3">
      <span class="section-name mb-1 ">KOORDINASI INTERNAL</span>
    </div>
    <div class="col-md-12 mb-3">
    ` +
    koordinasiInternalRow +
    `
    </div>
  `;

  koordinasiInternal.innerHTML = koordinasiInternalDiv;

  let bodyKoordinasiInternal = document.querySelector(".tbodyKoordinasiInternal");
  const listInternal = data?.koordinasi;
  for (let j = 0; j < listInternal.length; j++) {
    let listItemOutput = await addList(listInternal[j].aktivitas);
    bodyKoordinasiInternal.innerHTML += `
    <tr>
      <td class="p-3" style="place-content: flex-start">
        <label class="container-checkbox m-0"><span style="padding-top: 9px;padding-left: 5px;"></span>
          <input onclick="checkboxReference(this)" type="checkbox" id="checkbox_ki_${listInternal[j].id}" class="checkbox_animated checbox-compare" checked>
          <span class="checkmark" style="top:30%;left:10px;width:17px;height:17px" ></span>
        </label>
      </td>
      <td class="p-3" style="place-content: flex-start">
        <span class="">${listInternal[j].internal}</span>
      </td>
      <td class="p-3" style="place-content: flex-start">
        <ul class="" style="list-style-type:disc">
          ${listItemOutput}
        </ul>
      </td>
    </tr>
    `;
  }

  let relasiEksternalRow = `
    <div class="table-responsive" style="overflow-x: auto;">
      <table class="tableMasterData" id="relasiEksternalTable" style="width:100%">
        <thead>
          <tr>
            <th style="width:10%">
              <label class="container-checkbox mt-3"><span class="section-name mb-2 "></span>
                <input onclick="checkboxReference(this)" type="checkbox" id="checkbox_re" class="checkbox_animated checbox-compare" checked>
                <span class="checkmark" style="width:20px;height:20px" ></span>
              </label>
            </th>
            <th style="width:35%">Pihak Eksternal</th>
            <th style="width:55%">Aktivitas</th>
          </tr>
        </thead>
        <tbody class="tbodyRelasiEksternal">
        </tbody>
      </table>
    </div>
  `;

  const relasiEksternalDiv =
    `
    <div class="col-md-12 mb-3">
      <span class="section-name mb-1 ">RELASI EKSTERNAL</span>
    </div>
    <div class="col-md-12 mb-3">
    ` +
    relasiEksternalRow +
    `
    </div>
  `;

  relasiEksternal.innerHTML = relasiEksternalDiv;

  const listExternal = data?.relation;
  let bodyRelasiEksternal = document.querySelector(".tbodyRelasiEksternal");
  for (let j = 0; j < listExternal.length; j++) {
    let listItemOutput = await addList(listExternal[j].aktivitas);
    bodyRelasiEksternal.innerHTML += `
    <tr>
      <td class="p-3" style="place-content: flex-start">
        <label class="container-checkbox m-0"><span style="padding-top: 9px;padding-left: 5px;"></span>
          <input onclick="checkboxReference(this)" type="checkbox" id="checkbox_re_${listExternal[j].id}" class="checkbox_animated checbox-compare" checked>
          <span class="checkmark" style="top:30%;left:10px;width:17px;height:17px" ></span>
        </label>
      </td>
      <td class="p-3" style="place-content: flex-start">
        <span class="">${listExternal[j].eksternal}</span>
      </td>
      <td class="p-3" style="place-content: flex-start">
        <ul class="" style="list-style-type:disc">
          ${listItemOutput}
        </ul>
      </td>
    </tr>
    `;
  }

  let stkRow = `
    <div class="table-responsive" style="overflow-x: auto;">
      <table class="tableMasterData" id="stkTable" style="width:100%">
        <thead>
          <tr>
            <th style="width:10%">
              <label class="container-checkbox mt-3"><span class="section-name mb-2 "></span>
                <input onclick="checkboxReference(this)" type="checkbox" id="checkbox_stk" class="checkbox_animated checbox-compare" checked>
                <span class="checkmark" style="width:20px;height:20px" ></span>
              </label>
            </th>
            <th style="width:30%">No. STK</th>
            <th style="width:60%">Judul STK</th>
          </tr>
        </thead>
        <tbody class="tbodyStk">
        </tbody>
      </table>
    </div>
  `;

  const stkDiv =
    `
    <div class="col-md-12 mb-3">
      <span class="section-name mb-1 ">KOORDINASI INTERNAL</span>
    </div>
    <div class="col-md-12 mb-3">
    ` +
    stkRow +
    `</div>
  `;
  stk.innerHTML = stkDiv;
  const listSk = [
    { id: 1, noStk: "1", titleStk: "title 1" },
    { id: 2, noStk: "2", titleStk: "title 2" },
    { id: 3, noStk: "3", titleStk: "title 3" },
  ];
  let bodyStk = document.querySelector(".tbodyStk");
  for (let j = 0; j < listSk.length; j++) {
    bodyStk.innerHTML += `
    <tr>
      <td class="p-3" style="place-content: flex-start">
        <label class="container-checkbox m-0"><span style="padding-top: 9px;padding-left: 5px;"></span>
          <input onclick="checkboxReference(this)" type="checkbox" id="checkbox_stk_${listSk[j].id}" class="checkbox_animated checbox-compare" checked>
          <span class="checkmark" style="top:30%;left:10px;width:17px;height:17px" ></span>
        </label>
      </td>
      <td class="p-3" style="place-content: flex-start">
        <span class="">${listSk[j].noStk}</span>
      </td>
      <td class="p-3" style="place-content: flex-start">
        <span class="">${listSk[j].titleStk}</span>
      </td>
    </tr>
    `;
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

function checkButtonTable(buttonTable, id, lastPath, data) {
  console.log("data", data);
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
    alert(modalSize);
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
    action.forEach((item) => {
      if (item.callback) {
        $("#modalConfirmFooter").append(
          `<button type="button" class="btn ` +
            item.className +
            ` m-r-5" onclick="(` +
            item.callback +
            `)()">` +
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
