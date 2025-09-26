function confirmApply() {
  swal("Success", "Job Description has been applied", "success");
}

$(document).ready(async function () {
  // initialize popover
  async function searchJobCompare(event, isPercentage) {
    const chkJobList = document.getElementById("chk-job-list");
    const jobSelectedList = document.getElementById("job-selected-list");
    if (isPercentage) {
      const value = event;
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
      const storeId = [];
      let innerHTML = "";
      for (let item of dataCk) {
        innerHTML += `
          <div class="row-item">
        <div class="column-item-name pointer" onClick="applyCompare(${item.id})">
          <span class="text-primary  text-decoration-none"><u>${item.name}</u></span> 
          ${item.badge}
        </div>
        <i class="pl-1 icon-nm fas fa-info-circle align-self-center"  href="#" tabindex="0" data-toggle="popOver${item.id}"></i>
          </div>
        `;
        storeId.push(item.id);
      }
      chkJobListPercentage.innerHTML = innerHTML;
      storeId.forEach((item) => {
        callPopover(item);
      });

      // Reinitialize popovers after updating the inner HTML

      // $('[data-toggle="popover"]').popover();

      return;
    }

    function callPopover(param) {
      $(`[data-toggle="popOver${param}"]`).popover({
        html: true,
        sanitize: false,
        title: "Rasci Similarities Detail",
        content: `
          <div style="width: 550px;">
          <table class="display" style="width: 100%">
            <thead>
              <tr>
                <th class="" style="width: 55%;">Business Process</th>
                <th class="" style="width: 15%;">Notation</th>
                <th class="" style="width: 30%;">Availability of reference</th>
            </thead>
            <tbody>
              <tr>
                <th class="" style="">9.1.2 - Pengelolaan kebutuhan ICT/digital</th>
                <td class="" style="">R</td>
                <td class="" style="">Available</td>
              </tr>
            </tbody>
          </table>
          </div>
        `,
        trigger: "focus",
      });
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

    $('[data-toggle="popover"]').popover();
  }

  checkLocalStorage();
  let activeTab = "identifikasi";
  if (activeTab) {
    const linkTab = "#v-pills-" + activeTab + "-tab";
    $(linkTab).tab("show");
  }

  const urlParams = new URLSearchParams(window.location.search);
  const idPos = urlParams.get("id");
  const isCrete = urlParams.get("create");
  if (idPos) {
    if (isCrete) {
      const findData = dataJobDesc.find((item) => item.identifikasi.id == idPos);
      $("#selectJobReference").val(findData.identifikasi.id);
      getJobReference(findData);
    } else {
      const findData = await dataJobDescCompare.find((item) => item.identifikasi.id == idPos);
      $("#selectJobReference").append(
        `<option value="${findData.identifikasi.id}">${findData.identifikasi.jobName}</option>`
      );
      $("#selectJobReference").val(findData.identifikasi.id);
      let dataFungsi = [{ fungsi: findData.fungsi }];
      let tugasHa = findData.tugasHa;
      let koordinasi = findData.koordinasi;
      let relation = findData.relation;
      localStorage.setItem("fungsi", JSON.stringify(dataFungsi));
      localStorage.setItem("tugasHa", JSON.stringify(tugasHa));
      localStorage.setItem("koordinasi", JSON.stringify(koordinasi));
      localStorage.setItem("relation", JSON.stringify(relation));

      getJobReference(findData);
      await getJobReferenceDetail();
    }
  }

  $(".summernote").summernote({
    height: 300,
    tabsize: 2,
    // disable font type button
    toolbar: [
      // [groupName, [list of button]]
      ["style", ["bold", "italic", "underline", "clear"]],
      ["font", ["strikethrough", "superscript", "subscript"]],
      ["para", ["ul", "ol", "paragraph"]],
    ],
  });
  $(".summernote").summernote("disable");

  $("#rangePercentage").ionRangeSlider({
    grid: true,
    grid_num: 5,
    min: 50,
    max: 100,
    step: 10,
  });

  // getJobReference(dataJobDesc);
  // await applySelectedData();
  // await getJobReferenceDetail();

  // multiSelect({ selectID: "JobReference", type: "jobposition" });

  // on change selectJobReference
  $("#selectJobReference").on("change", function (e) {
    const data = e.target.value;
    console.log("data", data);
    const findData = dataJobDesc.find((item) => item.identifikasi.id == data);
    console.log("findData", findData);
    getJobReference(findData);
    isDisableButton(false);
    $(".summernote").summernote("enable");
  });

  $("#saveReference").on("click", async function () {
    await getJobReferenceDetail();
    // hide modal
    $("#modalJobCompare").modal("hide");
  });

  $("#saveDraft").on("click", async function () {
    swal({
      title: "Are you sure?",
      text: "You will save this job description as draft",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willSave) => {
      if (willSave) {
        swal("Success", "Job Description has been deleted", "success");
        // const url = "/job-description/index";
        // window.location.href = url;
        // localStorage.setItem("statusManager", "on progress");
      }
    });
  });

  // searchReferenceBy radio button
  $("input[name='searchReferenceBy']").on("change", function () {
    const value = $(this).val();
    $("#percentageDiv").show();
    $("#searchDiv").hide();
    if (value != "searchByPercentage") {
      $("#percentageDiv").hide();
      $("#searchDiv").show();
    }
  });

  dataListJobDescription[0].jobStatus = localStorage.getItem("statusManager");
  dataListJobDescription[1].jobStatus = localStorage.getItem("statusSbm");

  //  radio button with name percentage-amount
  // ...existing code...

  // Listen for changes on the radio buttons within the form with ID 'percentage-amount-form'
  $("#percentage-amount-form input[name='percentage-amount']").on("change", function () {
    const value = $(this).val();
    searchJobCompare(value, true);
  });

  // ...existing code...

  // Listen for tab navigation events
  $('#v-pills-tab-modal a[data-bs-toggle="pill"]').on("shown.bs.tab", function (e) {
    const target = $(e.target).attr("href"); // activated tab
    activeTab = target.split("#v-pills-")[1];
    console.log("activeTab", activeTab);
    const element = document.getElementById(activeTab);
    if (element) {
      element.scrollIntoView();
    }
  });

  $("#modalCon").on("click", function () {
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
        callbackFunction: "confirmDeleteDraft",
      },
      {
        button: "Yes, Continue",
        className: "btn-primary",
        callbackFunction: "confirmDeleteDraft",
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
  });

  $("#applyRef").on("click", function () {
    const action = [
      {
        button: "Back",
        className: "btn-outline-dark",
        callback: function () {
          hideModal(`modalConfirm`);
        },
      },
      {
        button: "Yes, Continue",
        className: "btn-primary",
        callbackFunction: "confirmApply",
      },
    ];
    modalConfrimHelper(
      "confirm",
      "Warning",
      `Are you sure want to apply this job desc reference?`,
      "",
      action,
      "30%",
      1
    );
  });

  $("#popUpBispro").on("click", async function () {
    $("#modalBusinessProcess").modal("show");
    // get modalBusinessProcessBody
    const modalBusinessProcessBody = document.getElementById("modalBusinessProcessBody");
    modalBusinessProcessBody.innerHTML = "";
    let dataBispro = [
      {
        index: "9.1.2",
        name: "Pengelolaan kebutuhan ICT/digital",
        notation: "r",
        availability: "Available",
        descriptionNo: "4",
      },
      {
        index: "9.1.3",
        name: "Pengelolaan kebutuhan ICT/digital",
        notation: "r",
        availability: "Available",
        descriptionNo: "4",
      },
      {
        index: "9.1.4",
        name: "Pengelolaan kebutuhan ICT/digital",
        notation: "r",
        availability: "Available",
        descriptionNo: "4",
      },
      {
        index: "9.1.5",
        name: "Pengelolaan kebutuhan ICT/digital",
        notation: "r",
        availability: "Available",
        descriptionNo: "4",
      },
    ];
    let content = `
      <div class="table-responsive" style="overflow-x: auto;">
        <table class="tableMasterData" id="tugasHaRecTable" style="width:100%">
          <thead>
            <tr>
              <th style="width:40%">Business Process</th>
              <th style="width:10%">Notation</th>
              <th style="width:35%">Availibity</th>
              <th style="width:15%">Desc No</th>
            </tr>
          </thead>
          <tbody class="tbodBispro">
          </tbody>
        </table>
      </div>
        `;
    modalBusinessProcessBody.innerHTML = content;
    let tbodBispro = document.querySelector(".tbodBispro");
    for (let item of dataBispro) {
      tbodBispro.innerHTML += `
        <tr>
          
          <td class="p-3" style="place-content: flex-start">
            <span class="">${item.index} - ${item.name}</span>
          </td>
          <td class="p-3" style="place-content: flex-start">
            <span class="">${item.notation}</span>
          </td>
          <td class="p-3" style="place-content: flex-start">
            <span class="">${item.availability}</span>
          </td>
          <td class="p-3" style="place-content: flex-start">
            <span class="">${item.descriptionNo}</span>
          </td>
        </tr>
      `;
    }
  });

  $("#popUpMergeBisPro").on("click", async function () {
    $("#modalBusinessProcess").modal("show");
    // get modalBusinessProcessBody
    const modalBusinessProcessHeader = document.getElementById("modalBusinessProcessHeader");
    modalBusinessProcessHeader.innerHTML = "Merge With Other Business sentences";
    const modalBusinessProcessBody = document.getElementById("modalBusinessProcessBody");
    modalBusinessProcessBody.innerHTML = "";
    let dataBispro = [
      {
        index: "9.1.2",
        name: "Pengelolaan kebutuhan ICT/digital",
        notation: "r",
        availability: "Available",
        descriptionNo: "4",
      },
      {
        index: "9.1.3",
        name: "Pengelolaan kebutuhan ICT/digital",
        notation: "r",
        availability: "Available",
        descriptionNo: "4",
      },
      {
        index: "9.1.4",
        name: "Pengelolaan kebutuhan ICT/digital",
        notation: "r",
        availability: "Available",
        descriptionNo: "4",
      },
      {
        index: "9.1.5",
        name: "Pengelolaan kebutuhan ICT/digital",
        notation: "r",
        availability: "Available",
        descriptionNo: "4",
      },
    ];
    let content = `
      <div class="table-responsive" style="overflow-x: auto;">
        <table class="tableMasterData" id="tugasHaRecTable" style="width:100%">
          <thead>
            <tr>
              <th style="width:15%"></th>
              <th style="width:25%">Desc No</th>
              <th style="width:60%">Related Business Process</th>
            </tr>
          </thead>
          <tbody class="tbodBispro">
          </tbody>
        </table>
      </div>
        `;
    modalBusinessProcessBody.innerHTML = content;
    let tbodBispro = document.querySelector(".tbodBispro");
    for (let item of dataBispro) {
      tbodBispro.innerHTML += `
        <tr>
        <td class="p-3" style="place-content: flex-start">
          <span class="">${item.descriptionNo}</span>
        </td>
        <td class="p-3" style="place-content: flex-start">
          <span class="">${item.descriptionNo}</span>
        </td>
          <td class="p-3" style="place-content: flex-start">
            <span class="">${item.index} - ${item.name}</span>
          </td>
        </tr>
      `;
    }
  });

  $("#otherRec").on("click", async function () {
    $("#modalRecomendation").modal("show");
    const dataAll = [
      {
        index: "9.1.2",
        name: "Pengelolaan kebutuhan ICT/digital",
        tugas_ha_li: [
          {
            id: 1,
            responsible:
              "Melakukan kegiatan pengelolaan relasi dengan pelanggan terkait penjualan produk gas di Fungsi Retail Sales Sumbagsel khususnya di Area Sungai Penuh.",
            output: [
              "Pelaksanaan tindak lanjut penanganan saran dan keluhan pelanggan;",
              "Pelaksanaan tindak lanjut permintaan pelanggan;",
              "Program pembinaan relasi dengan pelanggan;",
              "Pelaksanaan kegiatan dan evaluasi pembinaan relasi dengan pelanggan.",
            ],
            lead: [
              "Tingkat kesesuaian dan ketepatan waktu tindak lanjut penyelesaian saran/pertanyaan/keluhan/permintaan pelanggan;",
              "Customer satisfaction index;",
              "Tingkat efektivitas pengelolaan kegiatan pembinaan relasi.",
            ],
          },
          {
            id: 2,
            responsible:
              "Melakukan kegiatan pengelolaan relasi dengan pelanggan terkait penjualan produk gas di Fungsi Retail Sales Sumbagsel khususnya di Area Sungai Penuh.",
            output: [
              "Pelaksanaan tindak lanjut penanganan saran dan keluhan pelanggan;",
              "Pelaksanaan tindak lanjut permintaan pelanggan;",
              "Program pembinaan relasi dengan pelanggan;",
              "Pelaksanaan kegiatan dan evaluasi pembinaan relasi dengan pelanggan.",
            ],
            lead: [
              "Tingkat kesesuaian dan ketepatan waktu tindak lanjut penyelesaian saran/pertanyaan/keluhan/permintaan pelanggan;",
              "Customer satisfaction index;",
              "Tingkat efektivitas pengelolaan kegiatan pembinaan relasi.",
            ],
          },
        ],
      },
    ];

    // let bodyTugasHa = document.querySelector(".tbodyTugasHa");
    // for (let j = 0; j < data?.tugasHa.length; j++) {
    //   const listItemOutput = addList(data?.tugasHa[j].output);
    //   const listItemLeadingIndicator = addList(data?.tugasHa[j].lead);

    //   bodyTugasHa.innerHTML += `
    //   <tr>
    //     <td class="p-3" style="place-content: flex-start">
    //       <label class="container-checkbox m-0"><span style="padding-top: 9px;padding-left: 5px;">${data?.tugasHa[j].id}</span>
    //         <input onclick="checkboxReference(this)" type="checkbox" id="checkbox_tugas_ha_rec_${data?.tugasHa[j].id}" class="checkbox_animated checbox-compare" checked>
    //         <span class="checkmark" style="top:30%;left:10px;width:17px;height:17px" ></span>
    //       </label>
    //     </td>
    //     <td class="p-3" style="place-content: flex-start">
    //       <span class="">${data?.tugasHa[j].responsible}</span>
    //     </td>
    //     <td class="p-3" style="place-content: flex-start">
    //       <ul class="" style="list-style-type:disc">
    //         ${listItemOutput}
    //       </ul>
    //     </td>
    //     <td class="p-3" style="place-content: flex-start">
    //       <ul class="" style="list-style-type:disc">
    //         ${listItemLeadingIndicator}
    //       </ul>
    //     </td>
    //   </tr>
    //   `;
    // }

    // update modalRecomendationBody
    const modalRecomendationBody = document.getElementById("modalRecomendationBody");
    let content = "";
    for (let item of dataAll) {
      let bodyTugasHa = ``;
      for (let j = 0; j < item?.tugas_ha_li.length; j++) {
        const listItemOutput = await addList(item?.tugas_ha_li[j].output);
        const listItemLeadingIndicator = await addList(item?.tugas_ha_li[j].lead);
        console.log("listItemOutput", listItemOutput);

        bodyTugasHa += `
            <tr>
        <td class="p-3" style="place-content: flex-start">
          <label class="container-radio m-0"><span style="padding-top: 9px;padding-left: 5px;">${item?.tugas_ha_li[j].id}</span>
            <input onclick="radioReference(this)" type="radio" name="radio_tugas_ha_rec" id="radio_tugas_ha_rec_${item?.tugas_ha_li[j].id}" class="radio_animated radio-compare">
            <span class="radiomark" style="top:30%;left:10px;width:17px;height:17px" ></span>
          </label>
        </td>
        <td class="p-3" style="place-content: flex-start">
          <span class="">${item?.tugas_ha_li[j].responsible}</span>
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

      let tugasHaRow =
        `
      <div class="table-responsive" style="overflow-x: auto;">
        <table class="tableMasterData" id="tugasHaRecTable" style="width:100%">
          <thead>
            <tr>
              <th style="width:10%">
              </th>
              <th style="width:30%">Tugas & Tanggung Jawab</th>
              <th style="width:30%">Hasil Akhir Yang Diharapkan</th>
              <th style="width:30%">Leading Indicator</th>
            </tr>
          </thead>
          <tbody class="tbodyTugasHaRec">
          ` +
        bodyTugasHa +
        `
          </tbody>
        </table>
      </div>
    `;

      const tugasHaDiv =
        `
      <div class="col-md-12 mb-3">
      ` +
        tugasHaRow +
        `
      </div>
      `;

      content +=
        `
        <div class="card-body">
          <div class="default-according" id="accordion">
            <div class="card">
                <div class="card-header" id="headingOne">
                    <h5 class="mb-0">
                        <button class="btn btn-link" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">${item.index} - ${item.name}
                        </button>
                    </h5>
                </div>
                <div class="collapse" id="collapseOne" aria-labelledby="headingOne" data-bs-parent="#accordion">
                    <div class="card-body">
        ` +
        tugasHaDiv +
        `
                    </div>
                </div>
            </div>
          </div>
        </div>
      `;
    }
    modalRecomendationBody.innerHTML = content;
  });
});
