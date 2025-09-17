const getDraftExisting = JSON.parse(localStorage.getItem("draftExistingJobDesc"));

// Debounce function untuk search
let searchTimeout;
function debounceSearchJobCompare(event, delay = 800) {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    searchJobCompare(event, false);
  }, delay);
}

function confirmApply() {
  swal("Success", "Job Description has been applied", "success");
}

function refreshDataLocalStorage() {
  const keys = [
    "fungsi",
    "lsAvailable",
    "tugasHa",
    "wewenang",
    "koordinasiInternal",
    "relasiEksternal",
    "persyaratanKhusus",
    "stk",
  ];
  keys.forEach((key) => localStorage.removeItem(key));
}

async function getAllJobDescData(draftExisting, id, prlOrgParam, prlOrgTarget) {
  const dataDetailJobDesc = {
    draftId: draftExisting.draftId,
    jobId: id,
    prlRange: prlOrgTarget,
    prlOrg: prlOrgTarget,
  };
  console.log("dataDetailJobDesc", dataDetailJobDesc);

  // Helper function to handle errors gracefully
  const safeApiCall = async (apiCall, fallbackValue = null) => {
    try {
      return await apiCall();
    } catch (error) {
      console.error(`API call failed:`, error);
      return fallbackValue;
    }
  };

  // Execute all API calls in parallel with error handling
  const [
    identifikasiJabatan,
    fungsiJabatan,
    tugasTanggungJawabUmum,
    countTugasHa,
    tugasTanggungJawabAkhir,
    wewenang,
    koordinasiInternal,
    relasiEksternal,
    persyaratanJabatan,
    persyaratanKhusus,
    kompetensiTeknis,
    kompetensiPerilaku,
    stk,
  ] = await Promise.allSettled([
    safeApiCall(() => getIdentifikasiJabatan(dataDetailJobDesc)),
    safeApiCall(() => getFungsiJabatan(dataDetailJobDesc)),
    safeApiCall(() => getTugasTanggungJawabUmum(dataDetailJobDesc)),
    safeApiCall(() => getAllTanggungJawabToRasci({ ...dataDetailJobDesc, page: 1, pageSize: 99 })),
    safeApiCall(() => getTugasTanggungJawabAkhir(dataDetailJobDesc)),
    safeApiCall(() => getWewenang(dataDetailJobDesc)),
    safeApiCall(() => getKoordinasiInternal(dataDetailJobDesc)),
    safeApiCall(() => getRelasiEksternal(dataDetailJobDesc)),
    safeApiCall(() => getPersyaratanJabatan(dataDetailJobDesc)),
    safeApiCall(() => getPersyaratanKhusus(dataDetailJobDesc)),
    safeApiCall(() => getKompetensiTeknis(dataDetailJobDesc)),
    safeApiCall(() => getKompetensiPerilaku(dataDetailJobDesc)),
    safeApiCall(() => getStk(dataDetailJobDesc)),
  ]);

  // Return the results, extracting values from settled promises
  return {
    identifikasiJabatan: identifikasiJabatan.status === "fulfilled" ? identifikasiJabatan.value : null,
    fungsiJabatan: fungsiJabatan.status === "fulfilled" ? fungsiJabatan.value : null,
    tugasTanggungJawabUmum: tugasTanggungJawabUmum.status === "fulfilled" ? tugasTanggungJawabUmum.value : null,
    countTugasHa: countTugasHa.status === "fulfilled" ? countTugasHa.value : null,
    tugasTanggungJawabAkhir: tugasTanggungJawabAkhir.status === "fulfilled" ? tugasTanggungJawabAkhir.value : null,
    wewenang: wewenang.status === "fulfilled" ? wewenang.value : null,
    koordinasiInternal: koordinasiInternal.status === "fulfilled" ? koordinasiInternal.value : null,
    relasiEksternal: relasiEksternal.status === "fulfilled" ? relasiEksternal.value : null,
    persyaratanJabatan: persyaratanJabatan.status === "fulfilled" ? persyaratanJabatan.value : null,
    persyaratanKhusus: persyaratanKhusus.status === "fulfilled" ? persyaratanKhusus.value : null,
    kompetensiTeknis: kompetensiTeknis.status === "fulfilled" ? kompetensiTeknis.value : null,
    kompetensiPerilaku: kompetensiPerilaku.status === "fulfilled" ? kompetensiPerilaku.value : null,
    stk: stk.status === "fulfilled" ? stk.value : null,
  };
}

async function applySelectedData(id, prlOrgParam, prlOrgTarget) {
  // showChartLoading("chk-job-list-percentage");
  const getDataJobDesc = await getAllJobDescData(getDraftExisting, id, prlOrgParam, prlOrgTarget);

  // const arrayId = ["identifikasi", "fungsi", "tugas-ha", "koordinasi-internal", "relasi-eksternal", "stk"];
  // arrayId.forEach((item) => {
  //   $(`#${item}`).empty();
  // });
  localStorage.setItem("selectedJobDescReference", JSON.stringify(getDataJobDesc));

  $("#jobNameReference").text(getDataJobDesc?.identifikasiJabatan?.jobName || DATA_NOT_FOUND);
  $("#functionReference").text(getDataJobDesc?.identifikasiJabatan?.unitKerjaFungsi || DATA_NOT_FOUND);
  $("#locationReference").text(getDataJobDesc?.identifikasiJabatan?.lokasiKerja || DATA_NOT_FOUND);
  $("#directoratReference").text(getDataJobDesc?.identifikasiJabatan?.direktorat || DATA_NOT_FOUND);
  $("#directReportReference").text(getDataJobDesc?.identifikasiJabatan?.atasanLangsung || DATA_NOT_FOUND);
  $("#skReference").text(getDataJobDesc?.identifikasiJabatan?.noSuratKeputusan || DATA_NOT_FOUND);
  $("#skDateReference").text(getDataJobDesc?.identifikasiJabatan?.tanggalSuratKeputusan || DATA_NOT_FOUND);

  $("#fungsiTextReference").text(getDataJobDesc?.fungsiJabatan?.deskripsi || DATA_NOT_FOUND);

  updateTableSelected("tugasHaReference", getDataJobDesc?.tugasTanggungJawabAkhir?.data || [], tabCusJD.tugasHa);
  updateTableSelected(
    "koordinasiInternalReference",
    getDataJobDesc?.koordinasiInternal?.data || [],
    tabCusJD.koordinasi
  );
  updateTableSelected("relasiEksternalReference", getDataJobDesc?.relasiEksternal?.data || [], tabCusJD.relation);
  updateTableSelected(
    "stkReference",
    getDataJobDesc?.stk?.data.filter((item) => item.stkNumber !== null && item.stkNumber !== undefined) || [],
    ["no", ...tabCusJD.stk]
  );
  // hideChartLoading("chk-job-list-percentage");
  return;
}

async function searchJobCompare(event, isPercentage = false) {
  console.log("searchJobCompare", event, isPercentage, getDraftExisting);
  // return;

  const chkJobList = document.getElementById("chk-job-list");
  // const jobSelectedList = document.getElementById("job-selected-list");

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

  if (isPercentage) {
    console.log("getDraftExisting", getDraftExisting);
    showChartLoading("chk-job-list-percentage", true, "480px", "100%", "Please wait, fetching data...");
    const value = event;
    const chkJobListPercentage = document.getElementById("chk-job-list-percentage");
    const params = {
      draftId: getDraftExisting.draftId,
      jobId: jobId,
      prlOrg: prlOrg,
      percentage: value,
    };

    const result = await getSimilarities(params);
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
      <div class="column-item-name pointer" onClick="applyCompare(${item.id},${item.prlOrgTo},'${item.prlOrgTo}')">
        <span class="text-primary  text-decoration-none"><u>${item.name}</u></span> 
        ${item.badge}
      </div>
      <i class="pl-1 icon-nm fas fa-info-circle align-self-center"  href="#" tabindex="0" data-toggle="popOver${item.id}"></i>
        </div>
      `;
      storeId.push(item.id);
    }
    if (result?.data?.length === 0) {
      innerHTML = DATA_NOT_FOUND_HTML;
    }
    chkJobListPercentage.innerHTML = innerHTML;
    storeId.forEach((item) => {
      const dataDetail = details.find((detail) => detail.jobIdTo === item);
      callPopover(item, dataDetail);
    });

    // Hide loading after processing is complete
    hideChartLoading("animate-chk");

    // Reinitialize popovers after updating the inner HTML

    // $('[data-toggle="popover"]').popover();
  } else {
    const value = event?.target?.value || "";
    showChartLoading("chk-job-list", true, "480px", "100%", "Please wait, fetching data...");
    if (value === "") {
      chkJobList.innerHTML = DATA_NOT_FOUND_HTML;
    } else {
      const result = await draftListJobDesc({
        draftId: getDraftExisting.draftId,
        position: value,
      });
      console.log("result", result);
      const data = result?.data
        .map((item) => ({
          id: item?.jobId,
          name: item?.positionName,
          prlOrg: item?.prlOrg,
          prlRange: item?.prlRange,
        }))
        .filter((item) => item.name.toLowerCase().includes(value.toLowerCase()));

      let innerHTML = "";
      for (let item of data) {
        innerHTML += `
        <div class="row-item">
          <div class="column-item-name pointer" onClick="applyCompare(${item.id},${item.prlOrg},'${item.prlOrg}')">
            <span class="text-primary  text-decoration-none"><u>${item.name}</u></span>
          </div>
        </div>
      `;
      }
      if (data.length === 0) {
        innerHTML = DATA_NOT_FOUND_HTML;
      }
      chkJobList.innerHTML = innerHTML;
    }
    hideChartLoading("animate-chk");
  }
}

function showEndpointErrorAlert(endpoint, data, errorMessage = "Data tidak valid atau kosong") {
  console.error(`${errorMessage} dari endpoint => ${url.baseUrl}/${url["job-description"]}/${endpoint}. `);
}
$(document).ready(async function () {
  refreshDataLocalStorage();
  let activeTab = "identifikasi";
  if (activeTab) {
    const linkTab = "#v-pills-" + activeTab + "-tab";
    $(linkTab).tab("show");
  }

  const getDataJobDesc = await getAllJobDescData(getDraftExisting, jobId, prlOrg, prlOrg);
  for (const key in getDataJobDesc) {
    if (getDataJobDesc[key] === null || getDataJobDesc[key] === undefined) {
      showEndpointErrorAlert(`job-description/${key}/show`, getDataJobDesc[key]);
      getDataJobDesc[key] = null;
    }
  }
  if (getDataJobDesc?.identifikasiJabatan) {
    updateIdentifikasiJob(getDataJobDesc?.identifikasiJabatan);
  }

  if (getDataJobDesc.fungsiJabatan) {
    const lsFungsi = [
      {
        fungsi: getDataJobDesc?.fungsiJabatan.deskripsi,
        jobReference: {},
      },
    ];
    localStorage.setItem("fungsi", JSON.stringify(lsFungsi));
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
    let summernoteContent = "";
    lsFungsi.forEach((item) => {
      summernoteContent += item.fungsi + "<br><br>";
      if (item.jobReference.jobName) {
        const textReference = `(Reference from : ${item.jobReference.jobName} - ${item.jobReference.noSuratKeputusan})`;
        summernoteContent += textReference + "<br><br>";
      }
    });
    $(".summernote").summernote("code", summernoteContent);
  }

  if (getDataJobDesc.tugasTanggungJawabUmum) {
    updateTable("tugasUmum", getDataJobDesc.tugasTanggungJawabUmum.data, tabCusJD.tugasUmum);
  }

  if (getDataJobDesc.countTugasHa) {
    const countAll = getDataJobDesc.countTugasHa.data.length;
    const available = getDataJobDesc.countTugasHa.data.filter((item) => item.status === "AVAILABLE");
    const notAvailable = getDataJobDesc.countTugasHa.data.filter((item) => item.status === "NOT AVAILABLE");
    const countAvailable = available.length;
    const countNotAvailable = notAvailable.length;
    const codeAvailable = available.map((item) => item.indexNumber);
    const codeNotAvailable = notAvailable.map((item) => item.indexNumber);

    const lsAvailable = {
      available,
      notAvailable,
      countAll,
      codeAvailable,
      codeNotAvailable,
      countAvailable,
      countNotAvailable,
    };
    localStorage.setItem("lsAvailable", JSON.stringify(lsAvailable));

    const $label = $("#labelFulfillTugasHa");
    $label
      .toggleClass("label-success-custom", countAvailable === countAll)
      .toggleClass("label-danger-custom", countAvailable !== countAll)
      .css("cursor", "pointer")
      .html(`${countAvailable}/${countAll} business processes have been fulfilled. <b>see detail</b>`);
  }
  if (getDataJobDesc.tugasTanggungJawabAkhir) {
    const cleanObj = getDataJobDesc.tugasTanggungJawabAkhir.data.filter((item) => item.responsible.length > 0);
    localStorage.setItem("tugasHa", JSON.stringify(cleanObj));
    updateTable("tugasHa", cleanObj, [...tabCusJD.tugasHa, "action"]);
  }

  if (getDataJobDesc.wewenang) {
    updateTable("wewenang", getDataJobDesc.wewenang.data, tabCusJD.wewenang);
  }

  if (getDataJobDesc.koordinasiInternal) {
    localStorage.setItem("koordinasiInternal", JSON.stringify(getDataJobDesc.koordinasiInternal.data));
    updateTable("koordinasi", getDataJobDesc.koordinasiInternal.data, [...tabCusJD.koordinasi, "action"]);
  }

  if (getDataJobDesc.relasiEksternal) {
    localStorage.setItem("relasiEksternal", JSON.stringify(getDataJobDesc.relasiEksternal.data));
    updateTable("relation", getDataJobDesc.relasiEksternal.data, [...tabCusJD.relation, "action"]);
  }
  if (getDataJobDesc.persyaratanJabatan) {
    getDataJobDesc.persyaratanJabatan.data.map((item) => {
      item.pj = [item.pendidikanMinimal, ...item.pengalamanKerja];
    });
    updateTable("persyaratan", getDataJobDesc.persyaratanJabatan.data, tabCusJD.pj);
  }

  if (getDataJobDesc.persyaratanKhusus) {
    getDataJobDesc.persyaratanKhusus.data.map((item) => {
      item.pk = [item.pendidikanMinimal, item.pengalamanKerja];
    });
    localStorage.setItem("persyaratanKhusus", JSON.stringify(getDataJobDesc.persyaratanKhusus.data));
    updateTable("persyaratanKhusus", getDataJobDesc.persyaratanKhusus.data, [...tabCusJD.pk, "action"]);
  }
  const divKompetensiTeknisGeneral = $("#kompetensiGeneral");
  const divKompetensiTeknisMandatory = $("#kompetensiMandatory");
  const divKompetensiTeknisSpesifik = $("#kompetensiSpesifik");
  const divKompetensiPerilaku = $("#kompetensiPerilaku");

  if (
    Array.isArray(getDataJobDesc.kompetensiTeknis.data.komtekMandatori) &&
    getDataJobDesc.kompetensiTeknis.data.komtekMandatori.length > 0
  ) {
    const $ul = $("<ul style='list-style-type: disc; padding-left: 20px;'></ul>");
    getDataJobDesc.kompetensiTeknis.data.komtekMandatori.forEach((item) => {
      $ul.append(
        `<li style="display: flex; justify-content: space-between;"><span>${item.komtekMandatoriName}</span><span>${item.level}</span></li>`
      );
    });
    divKompetensiTeknisMandatory.empty().append($ul);
  }

  if (
    Array.isArray(getDataJobDesc.kompetensiTeknis.data.komtekGeneral) &&
    getDataJobDesc.kompetensiTeknis.data.komtekGeneral.length > 0
  ) {
    const $ul = $('<ul style=""></ul>');
    getDataJobDesc.kompetensiTeknis.data.komtekGeneral.forEach((item) => {
      $ul.append(
        `<li style="display: flex; justify-content: space-between;"><span>${item.komtekGeneralName}</span><span>${item.level}</span></li>`
      );
    });
    divKompetensiTeknisGeneral.empty().append($ul);
  }

  if (
    Array.isArray(getDataJobDesc.kompetensiTeknis.data.komtekSpesifik) &&
    getDataJobDesc.kompetensiTeknis.data.komtekSpesifik.length > 0
  ) {
    const $ul = $('<ul style=""></ul>');
    getDataJobDesc.kompetensiTeknis.data.komtekSpesifik.forEach((item) => {
      $ul.append(
        `<li style="display: flex; justify-content: space-between;"><span>${item.komtekSpesifikName}</span><span>${item.level}</span></li>`
      );
    });
    divKompetensiTeknisSpesifik.empty().append($ul);
  }

  if (Array.isArray(getDataJobDesc.kompetensiPerilaku.data) && getDataJobDesc.kompetensiPerilaku.data.length > 0) {
    const $ul = $("<ul style='list-style-type: disc; padding-left: 20px;'></ul>");
    getDataJobDesc.kompetensiPerilaku.data.forEach((item) => {
      $ul.append(`<li><span>${item.namaKompetensi}</span></li>`);
    });
    divKompetensiPerilaku.append($ul);
  } else {
    divKompetensiPerilaku.append("<div class='text-center'>No data found</div>");
  }

  if (getDataJobDesc.stk) {
    // filter stk.data to remove items with empty stkNumber is null or undefined
    getDataJobDesc.stk.data = getDataJobDesc.stk.data.filter(
      (item) => item.stkNumber !== null && item.stkNumber !== undefined
    );
    localStorage.setItem("stk", JSON.stringify(getDataJobDesc.stk.data));
    updateTable("stk", getDataJobDesc.stk.data, [...tabCusJD.stk, "action"]);
  }

  focusNode(jobId);

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

  // $("#inputSearchCompare").on("input", function (e) {
  //   searchJobCompare(e, false, getDraftExisting);
  // });

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

  //  radio button with name percentage-amount
  // ...existing code...

  // Listen for changes on the radio buttons within the form with ID 'percentage-amount-form'
  $("#percentage-amount-form input[name='percentage-amount']").on("change", function () {
    const value = $(this).val();
    console.log("Selected debt amount option:", value);
    console.log(getDraftExisting, "getDraftExisting");
    searchJobCompare(value, true);
  });

  // ...existing code...

  // Listen for tab navigation events
  $('#v-pills-tab-modal a[data-bs-toggle="pill"]').on("shown.bs.tab", function (e) {
    const target = $(e.target).attr("href"); // activated tab
    activeTab = target.split("#v-pills-")[1];
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
