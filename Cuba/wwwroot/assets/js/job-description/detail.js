function confirmApply() {
  swal("Success", "Job Description has been applied", "success");
}

$(document).ready(async function () {
  const urlParams = new URLSearchParams(window.location.search);

  // from query string
  const jobId = urlParams.get("jobId");
  const prlOrg = urlParams.get("prlOrg");
  const positionCode = urlParams.get("positionCode");
  // console.log("positionCode", jobId);
  // initialize popover
  async function searchJobCompare(event, isPercentage) {
    const chkJobList = document.getElementById("chk-job-list");
    // const jobSelectedList = document.getElementById("job-selected-list");
    if (isPercentage) {
      const value = event;
      const chkJobListPercentage = document.getElementById("chk-job-list-percentage");
      const params = {
        draftId: getDraftExisting.draftId,
        jobId: jobId,
        prlOrg: prlOrg,
        percentage: value,
      };

      const result = await getSimilarities(params);
      console.log("result", result.data);

      // dan urutan berdasarkan percentage yang paling tinggi
      const dataCompare = result?.data
        .map((item) => ({
          id: item?.jobIdTarget,
          name: item?.positionNameTarget,
          percentage: item?.matchPercentage,
          jobIdFrom: item?.jobIdSource,
          prlOrgFrom: item?.prlOrgSource,
          jobIdTarget: item?.jobIdTarget,
          prlOrgTo: item?.prlOrgTarget,
        }))
        .sort((a, b) => b.percentage - a.percentage);

      // Fetch all details in parallel instead of sequentially
      const detailPromises = dataCompare.map((item) =>
        getAllTanggungJawabJobToJob({
          draftId: getDraftExisting.draftId,
          jobIdFrom: jobId,
          prlOrgFrom: prlOrg,
          jobIdTo: item.jobIdTarget,
          prlOrgTo: item.prlOrgTo,
          page: 1,
          pageSize: 99,
        }).then((res) => ({
          jobIdTo: item.jobIdTarget,
          data: res.data,
        }))
      );

      const details = await Promise.all(detailPromises);

      for (const item of dataCompare) {
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
      }
      const storeId = [];
      let innerHTML = "";
      for (let item of dataCompare) {
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
      if (result?.data?.length === 0) {
        innerHTML = `<div class="text-center">No data found</div>`;
      }
      chkJobListPercentage.innerHTML = innerHTML;
      storeId.forEach((item) => {
        const dataDetail = details.find((detail) => detail.jobIdTo === item);
        callPopover(item, dataDetail);
      });

      // Reinitialize popovers after updating the inner HTML

      // $('[data-toggle="popover"]').popover();

      return;
    }

    function callPopover(param, dataDetail) {
      console.log("callPopover", param, dataDetail);
      // Generate popoverContent dynamically with if-else for status
      const popoverContent = (dataDetail?.data || [])
        .map((item) => {
          let statusText = "";
          let statusColor = "";
          let statusIcon = "";
          if (item?.status === "AVAILABLE") {
            statusText = "Available";
            statusColor = "#06BE00";
            statusIcon = "available";
          } else if (item?.status === "NOT AVAILABLE") {
            statusText = "Not Available";
            statusColor = "#D02138";
            statusIcon = "nonavail";
          } else {
            statusText = "Unknown";
            statusColor = "#999";
            statusIcon = "unknown";
          }
          return `
            <tr>
            <td>${item?.indexNumberFrom || ""} - ${item?.descriptionFrom || ""}</td>
            <td style="place-items:center">
              <div style="width:20px; height:20px; background-color:#E3E3E3; border-radius:50%; border:1px solid #9F9FA5; display:flex; align-items:center; justify-content:center;">
              <span style="font-weight:bold;font-size: 12px;">${item?.notation || "R"}</span>
              </div>
            </td>
            <td style="color:${statusColor};text-align:center">
              <span>${statusText}</span>
              <img src="/assets/images/rasci/${statusIcon}.svg" alt="${statusText} Icon" style="padding-left: 2px;vertical-align:middle;">
            </td>
            </tr>
            `;
        })
        .join("");
      $(`[data-toggle="popOver${param}"]`).popover({
        html: true,
        sanitize: false,
        content: `
          <div style="width: 550px;">
          <h6 style="margin-bottom:10px">RASCI Similarities Detail</h6>
          <table class="display tableRasciSimilarities" style="width: 100%">
          <thead>
              <tr>
              <th style="width: 55%;">Business Process</th>
              <th style="width: 15%;">Notation</th>
              <th style="width: 30%;">Availability of reference</th>
              <tr>
          </thead>
          <tbody>
          ${popoverContent}
          </tbody>
          </table>
          </div>
        `,
        trigger: "focus",
      });
    }

    // const data = dataJobDescCompare
    //   .map((item) => ({
    //     id: item?.identifikasi?.id,
    //     name: item?.identifikasi?.jobName,
    //   }))
    //   .filter((item) =>
    //     item.name.toLowerCase().includes(event?.target?.value.toLowerCase())
    //   );

    // chkJobList.innerHTML = data
    //   .map(
    //     (item) => `
    //       <div class="row-item">
    //         <div class="column-item-name" onClick="applyCompare(${item.id})">
    //           ${item.name}
    //         </div>
    //       </div>
    //     `
    //   )
    //   .join("");

    // $('[data-toggle="popover"]').popover();
  }

  const getDraftExisting = JSON.parse(localStorage.getItem("draftExistingJobDesc"));

  function logWewenangFetchSuccess(params, data) {
    console.log(`get data ${params} berhasil, jika tabel belum muncul cek format data, exp:`, data);
  }
  function showEndpointErrorAlert(endpoint, data, errorMessage = "Data tidak valid atau kosong") {
    // alert(
    //   `Data dari endpoint ${url.baseUrl}/${url["job-description"]}/${endpoint} tidak valid atau kosong, data yang keluar hanya contoh. cek di console log`
    // );
    console.error(
      `${errorMessage} dari endpoint => ${url.baseUrl}/${url["job-description"]}/${endpoint}. contoh data expected:`,
      data
    );
  }

  const dataDetailJobDesc = {
    draftId: getDraftExisting.draftId,
    jobId: jobId,
    prlRange: prlOrg,
    prlOrg: prlOrg,
  };

  const dataBagan = {
    draftId: getDraftExisting.draftOrganizationId,
    jobCode: jobId,
    depth: 2,
  };

  let identifikasiJabatan = await getIdentifikasiJabatan(dataDetailJobDesc);
  const identifikasiJabatanData = {
    jobId: "Data Not Found",
    jobName: "Data Not Found",
    prlOrg: "Data Not Found",
    unitKerjaFungsi: "Data Not Found",
    lokasiKerja: "Data Not Found",
    direktorat: "Data Not Found",
    atasanLangsung: "Data Not Found",
    noSuratKeputusan: "Data Not Found",
    tanggalSuratKeputusan: "Data Not Found",
    jobReference: "Data Not Found",
    jobReferences: [],
  };
  if (!identifikasiJabatan.jobName) {
    showEndpointErrorAlert("job-description/identifikasi-jabatan/show", identifikasiJabatanData);
    identifikasiJabatan = identifikasiJabatanData;
  }

  updateIdentifikasiJob(identifikasiJabatan);

  // get fungsi jabatan = getFungsiJabatan
  let fungsiJabatan = await getFungsiJabatan(dataDetailJobDesc);
  const fungsiJabatanData = {
    deskripsi: "Data Not Found",
    "...": "...",
  };
  if (!fungsiJabatan.deskripsi) {
    showEndpointErrorAlert("job-description/fungsi-jabatan/show", fungsiJabatanData);
    fungsiJabatan = fungsiJabatanData;
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
  $(".summernote").summernote("enable");
  $(".summernote").summernote("code", fungsiJabatan.deskripsi);

  let tugasTanggungJawabUmum;
  try {
    tugasTanggungJawabUmum = await getTugasTanggungJawabUmum(dataDetailJobDesc);
    logWewenangFetchSuccess("job-description/tugas-tanggung-jawab-umum/show", tugasTanggungJawabUmum.data);
    updateTable("tugasUmum", tugasTanggungJawabUmum.data, tabCusJD.tugasUmum);
  } catch (error) {
    showEndpointErrorAlert("job-description/tugas-tanggung-jawab-umum/show", [], error.message);
  }

  try {
    const countTugasHa = await getAllTanggungJawabToRasci({ ...dataDetailJobDesc, page: 1, pageSize: 99 });
    const countAll = countTugasHa.data.length;
    const countAvailable = countTugasHa.data.filter((item) => item.status === "AVAILABLE").length;
    const $label = $("#labelFulfillTugasHa");
    $label
      .toggleClass("label-success-custom", countAvailable === countAll)
      .toggleClass("label-danger-custom", countAvailable !== countAll)
      .text(`${countAvailable}/${countAll} business processes have been fulfilled.`);
  } catch (error) {
    console.error("Error fetching countTugasHa:", error);
    showEndpointErrorAlert("job-description/tugas-tanggung-jawab-akhir/count", [], error.message);
  }

  let tugasTanggungJawabAkhir;
  const tugasTanggungJawabAkhirData = {
    data: dataJobDescCompare[0].tugasHa.filter((item) => item.responsible.length > 0),
  };
  try {
    tugasTanggungJawabAkhir = await getTugasTanggungJawabAkhir(dataDetailJobDesc);
    logWewenangFetchSuccess("job-description/tugas-tanggung-jawab-akhir/show", tugasTanggungJawabAkhirData);
    updateTable(
      "tugasHa",
      tugasTanggungJawabAkhir.data.filter((item) => item.responsible.length > 0),
      tabCusJD.tugasHa
    );
  } catch (error) {
    console.error("Error fetching tugasTanggungJawabAkhir:", error);
    showEndpointErrorAlert("job-description/tugas-tanggung-jawab-akhir/show", tugasTanggungJawabAkhirData);
  }

  let wewenang;
  const wewenangData = { data: dataJobDescCompare[0].wewenang };
  try {
    wewenang = await getWewenang(dataDetailJobDesc);
    logWewenangFetchSuccess("job-description/wewenang/show", wewenangData);
  } catch (error) {
    console.error("Error fetching wewenang:", error);
    showEndpointErrorAlert("job-description/wewenang/show", wewenangData);
    wewenang = wewenangData;
  }
  updateTable("wewenang", wewenang.data, tabCusJD.wewenang);

  let koordinasiInternal;
  const koordinasiInternalData = {
    data: dataJobDescCompare[0].koordinasi,
  };
  try {
    koordinasiInternal = await getKoordinasiInternal(dataDetailJobDesc);
    logWewenangFetchSuccess("job-description/koordinasi-internal/show", koordinasiInternalData);
  } catch (error) {
    console.error("Error fetching koordinasiInternal:", error);
    showEndpointErrorAlert("job-description/koordinasi-internal/show", dataJobDescCompare[0].koordinasi);
    koordinasiInternal = koordinasiInternalData;
  }

  updateTable("koordinasi", koordinasiInternal.data, tabCusJD.koordinasi);

  let relasiEksternal;
  const relasiEksternalData = { data: dataJobDescCompare[0].relation };

  try {
    relasiEksternal = await getRelasiEksternal(dataDetailJobDesc);
    logWewenangFetchSuccess("job-description/relasi-eksternal/show", relasiEksternalData);
    console.log("relasiEksternal", relasiEksternal);
  } catch (error) {
    console.error("Error fetching koordinasiInternal:", error);
    showEndpointErrorAlert("job-description/relasi-eksternal/show", relasiEksternalData);
    relasiEksternal = relasiEksternalData;
  }
  updateTable("relation", relasiEksternal.data, tabCusJD.relation);

  let persyaratanJabatan;
  const persyaratanJabatanData = { data: dataJobDescCompare[0].relation };

  try {
    persyaratanJabatan = await getPersyaratanJabatan(dataDetailJobDesc);
    logWewenangFetchSuccess("job-description/persyaratan-jabatan/show", persyaratanJabatanData);
    console.log("persyaratanJabatan.data =========>>>>", persyaratanJabatan.data);
    persyaratanJabatan.data = persyaratanJabatan.data.filter(
      (item) =>
        item.pendidikanMinimal &&
        typeof item.pendidikanMinimal === "string" &&
        item.pendidikanMinimal.trim() !== "" &&
        item.pengalamanKerja &&
        typeof item.pengalamanKerja === "string" &&
        item.pengalamanKerja.trim() !== ""
    );
    console.log("persyaratanJabatan.data =========>>>>", persyaratanJabatan.data);
    persyaratanJabatan.data.map((item) => {
      item.pj = [item.pendidikanMinimal, item.pengalamanKerja];
    });
    console.log("persyaratanJabatan", persyaratanJabatan);
    updateTable("persyaratan", persyaratanJabatan.data, tabCusJD.pj);
  } catch (error) {
    console.error("Error fetching persyaratanJabatan:", error);
    showEndpointErrorAlert("job-description/persyaratan-jabatan/show", persyaratanJabatanData);
    persyaratanJabatan = persyaratanJabatanData;
  }

  let persyaratanKhusus;
  const persyaratanKhususData = { data: dataJobDescCompare[0].relation };

  try {
    persyaratanKhusus = await getPersyaratanKhusus(dataDetailJobDesc);
    logWewenangFetchSuccess("job-description/persyaratan-jabatan/show", persyaratanKhususData);

    persyaratanKhusus.data.map((item) => {
      item.pk = [item.pendidikanMinimal, item.pengalamanKerja];
    });
    // updateTable(
    //   "persyaratanKhususTable",
    //   persyaratanKhusus.data,
    //   tabCusJD.persyaratan
    // );
  } catch (error) {
    console.error("Error fetching persyaratanKhusus:", error);
    persyaratanKhusus = persyaratanKhususData;
  }

  const divKompetensiTeknisGeneral = $("#kompetensiGeneral");
  const divKompetensiTeknisMandatory = $("#kompetensiMandatory");
  const divKompetensiTeknisSpesifik = $("#kompetensiSpesifik");
  // const divKompetensiPerilaku = $("#kompetensiPerilaku");

  let kompetensiTeknis;
  try {
    kompetensiTeknis = await getKompetensiTeknis(dataDetailJobDesc);
    logWewenangFetchSuccess("job-description/kompetensi-teknis/show", kompetensiTeknis);

    if (Array.isArray(kompetensiTeknis.data.komtekMandatori) && kompetensiTeknis.data.komtekMandatori.length > 0) {
      const $ul = $("<ul style='list-style-type: disc; padding-left: 20px;'></ul>");
      kompetensiTeknis.data.komtekMandatori.forEach((item) => {
        $ul.append(
          `<li style="display: flex; justify-content: space-between;"><span>${item.komtekMandatoriName}</span><span>${item.level}</span></li>`
        );
      });
      divKompetensiTeknisMandatory.empty().append($ul);
    }

    console.log("kompetensiTeknis.data.komtekGeneral", kompetensiTeknis.data.komtekGeneral);

    if (Array.isArray(kompetensiTeknis.data.komtekGeneral) && kompetensiTeknis.data.komtekGeneral.length > 0) {
      const $ul = $('<ul style=""></ul>');
      kompetensiTeknis.data.komtekGeneral.forEach((item) => {
        console.log("ada data komtekGeneral", item);
        $ul.append(
          `<li style="display: flex; justify-content: space-between;"><span>${item.komtekGeneralName}</span><span>${item.level}</span></li>`
        );
      });
      divKompetensiTeknisGeneral.empty().append($ul);
    }

    console.log("kompetensiTeknis.data.komtekSpesifik", kompetensiTeknis.data.komtekSpesifik);

    if (Array.isArray(kompetensiTeknis.data.komtekSpesifik) && kompetensiTeknis.data.komtekSpesifik.length > 0) {
      const $ul = $('<ul style=""></ul>');
      kompetensiTeknis.data.komtekSpesifik.forEach((item) => {
        console.log("ada data komtekSpesifik", item);
        $ul.append(
          `<li style="display: flex; justify-content: space-between;"><span>${item.komtekSpesifikName}</span><span>${item.level}</span></li>`
        );
      });
      divKompetensiTeknisSpesifik.empty().append($ul);
    }
  } catch (error) {
    console.error("Error fetching persyaratanKhusus:", error);
    showEndpointErrorAlert("job-description/persyaratan-jabatan/show", []);
  }

  let kompetensiPerilaku;
  try {
    kompetensiPerilaku = await getKompetensiPerilaku(dataDetailJobDesc);
    logWewenangFetchSuccess("job-description/kompetensi-perilaku/show", kompetensiPerilaku);
    const divKompetensiPerilaku = $("#kompetensiPerilaku");
    console.log("kompetensiPerilaku ==========", kompetensiPerilaku.data);
    divKompetensiPerilaku.empty();
    if (Array.isArray(kompetensiPerilaku.data) && kompetensiPerilaku.data.length > 0) {
      const $ul = $("<ul style='list-style-type: disc; padding-left: 20px;'></ul>");
      kompetensiPerilaku.data.forEach((item) => {
        $ul.append(`<li><span>${item.namaKompetensi}</span></li>`);
      });
      divKompetensiPerilaku.append($ul);
    } else {
      divKompetensiPerilaku.append("<div class='text-center'>No data found</div>");
    }
  } catch (error) {
    console.error("Error fetching kompetensiPerilaku:", error);
    showEndpointErrorAlert("job-description/kompetensi-perilaku/show", []);
  }

  let stk;
  try {
    stk = await getStk(dataDetailJobDesc);
    // filter stk.data to remove items with empty stkNumber is null or undefined
    stk.data = stk.data.filter((item) => item.stkNumber !== null && item.stkNumber !== undefined);
    logWewenangFetchSuccess("job-description/tugas-tanggung-jawab-akhir/show", stk.data);
    updateTable("stk", stk.data, tabCusJD.stk);
  } catch (error) {
    console.error("Error fetching stk:", error);
    showEndpointErrorAlert("job-description/tugas-tanggung-jawab-akhir/show", []);
  }

  // Store bagan data globally for tab navigation
  let globalBaganData = null;
  let globalDataBaganSelf = null;

  chartShow(dataBagan).then((bagan) => {
    if (bagan && bagan.data) {
      globalBaganData = bagan.data;
      globalDataBaganSelf = bagan.data.find((item) => item.id == jobId);
      console.log("dataBaganSelf", globalDataBaganSelf);
      console.log("bagan?.data", bagan.data);
      focusNode(globalDataBaganSelf, bagan.data);
    }
  });

  checkLocalStorage();
  let activeTab = "identifikasi";
  if (activeTab) {
    const linkTab = "#v-pills-" + activeTab + "-tab";
    $(linkTab).tab("show");
  }

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

  // $(".summernote").summernote("disable");

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
    const findData = dataJobDesc.find((item) => item.identifikasi.id == data);
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

  //  radio button with name debt-amount
  // ...existing code...

  // Listen for changes on the radio buttons within the form with ID 'debt-amount-form'
  $("#debt-amount-form input[name='debt-amount']").on("change", function () {
    const value = $(this).val();
    searchJobCompare(value, true);
  });

  // ...existing code...

  // Listen for tab navigation events
  $('#v-pills-tab-modal a[data-bs-toggle="pill"]').on("shown.bs.tab", function (e) {
    const target = $(e.target).attr("href"); // activated tab
    console.log("target", target);
    activeTab = target.split("#v-pills-")[1];
    console.log("activeTab", activeTab);
    if (activeTab === "bagan-primary" && globalDataBaganSelf && globalBaganData) {
      focusNode(globalDataBaganSelf, globalBaganData);
    }
    const element = document.getElementById(activeTab);
    if (element) {
      element.scrollIntoView();
      window.scrollBy({ top: -80, left: 0, behavior: "instant" }); // 80px jarak dari atas
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
