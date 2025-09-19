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
  localStorage.setItem("isFullRefer", JSON.stringify(false));

  const lsAvailable = JSON.parse(localStorage.getItem("lsAvailable"));
  const countNotAvailable = lsAvailable.countNotAvailable;
  const codeNotAvailable = lsAvailable.codeNotAvailable;
  const codeAvailable = lsAvailable.codeAvailable;

  const selectedJobDescReference = JSON.parse(localStorage.getItem("selectedJobDescReference"));
  const tugasHaSelected =
    selectedJobDescReference.countTugasHa?.data.filter((item) => item.status === "AVAILABLE") || [];
  const countTugasHaSelected = tugasHaSelected.length;
  const codeAvailableSelected = tugasHaSelected.map((item) => item.indexNumber);
  // const codeAvailableSelected = tugasHaSelected.map((item) => item.indexNumber);

  // check if codeAvailableSelected contains all codeNotAvailable
  // const isFullRefer = codeNotAvailable.every((code) => codeAvailableSelected.includes(code));
  const isFullRefer = false;
  localStorage.setItem("isFullRefer", JSON.stringify(isFullRefer));

  $(".notifWarning").hide();
  if (!isFullRefer) {
    $(".notifWarning").show();
  }

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
    tabCusJD.koordinasi,
  );
  updateTableSelected("relasiEksternalReference", getDataJobDesc?.relasiEksternal?.data || [], tabCusJD.relation);
  updateTableSelected(
    "stkReference",
    getDataJobDesc?.stk?.data.filter((item) => item.stkNumber !== null && item.stkNumber !== undefined) || [],
    ["no", ...tabCusJD.stk],
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
      })),
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
    console.log("getDataJobDesc.identifikasiJabatan", getDataJobDesc.identifikasiJabatan);
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
        `<li style="display: flex; justify-content: space-between;"><span>${item.komtekMandatoriName}</span><span>${item.level}</span></li>`,
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
        `<li style="display: flex; justify-content: space-between;"><span>${item.komtekGeneralName}</span><span>${item.level}</span></li>`,
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
        `<li style="display: flex; justify-content: space-between;"><span>${item.komtekSpesifikName}</span><span>${item.level}</span></li>`,
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
      (item) => item.stkNumber !== null && item.stkNumber !== undefined,
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
      1,
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
      1,
    );
  });

  $("#labelFulfillTugasHa").on("click", function () {
    $("#modalBusinessProcess").modal("show");

    const lsAvailable = JSON.parse(localStorage.getItem("lsAvailable"));
    const countAll = lsAvailable.countAll;
    const countAvailable = lsAvailable.countAvailable;
    const countNotAvailable = lsAvailable.countNotAvailable;
    const isFullFilled = countAvailable === countAll || countNotAvailable === 0;
    const $label = $("#notifWarningModalBP");
    $label
      .toggleClass("label-success-custom", isFullFilled)
      .toggleClass("label-danger-custom", !isFullFilled)
      .toggleClass("p-2", true);

    if (!isFullFilled) {
      $label.html(
        `${countAvailable}/${countAll} of business processes have been fulfilled. You can add them by clicking add data or add from references button`,
      );
    } else {
      $label.html(`All business processes have been fulfilled (${countAll}/${countAll})`);
    }
    console.log("lsAvailable", lsAvailable);
    // get modalBusinessProcessBody
    const modalBusinessProcessBody = document.getElementById("modalBusinessProcessBody");
    const allBusPro = lsAvailable.available.concat(lsAvailable.notAvailable);

    modalBusinessProcessBody.innerHTML = "";
    let content = `
      <div class="table-responsive" style="overflow-x: auto;">
        <table class="tableMasterData" id="tugasHaRecTable" style="width:100%">
          <thead>
            <tr>
              <th style="width:50%">Business Process</th>
              <th style="width:20%">Notation</th>
              <th style="width:30%">Availibity</th>
            </tr>
          </thead>
          <tbody class="tbodBispro">
          </tbody>
        </table>
      </div>
        `;
    modalBusinessProcessBody.innerHTML = content;
    let tbodBispro = document.querySelector(".tbodBispro");
    for (let item of allBusPro) {
      const statusIcon = item.status === "AVAILABLE" ? "available" : "nonavail";
      const statusText = item.status === "AVAILABLE" ? "Available" : "Not Available";
      const statusColor = item.status === "AVAILABLE" ? "#06BE00" : "#D02138";
      tbodBispro.innerHTML += `
        <tr>
          
          <td class="p-3" style="place-content: flex-start">
            <span class="">${item.indexNumber} - ${item.description}</span>
          </td>
          <td style="place-items:center">
            <div style="width:20px; height:20px; background-color:#E3E3E3; border-radius:50%; border:1px solid #9F9FA5; display:flex; align-items:center; justify-content:center;">
            <span style="font-weight:bold;font-size: 12px;">R</span>
            </div>
          </td>
          <td style="color:${statusColor};text-align:center">
            <span>${statusText}</span>
            <img src="/assets/images/rasci/${statusIcon}.svg" alt="${statusText} Icon" style="padding-left: 2px;vertical-align:middle;">
          </td>
        </tr>
      `;
    }
  });

  $("#searchBusinessProcess").on("input", function () {
    const searchTerm = $(this).val().toLowerCase();
    $("#tugasHaRecTable tbody tr").each(function () {
      const rowText = $(this).text().toLowerCase();
      $(this).toggle(rowText.includes(searchTerm));
    });
  });

  /* <div id="filterBusinessProcess" class="m-b-3">
                    <input type="text" id="searchBusinessProcess" placeholder="Search Business Process..." class="form-control mb-2" />
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="checkbox" id="availableCheckbox" value="available" checked>
                        <label class="form-check-label" for="availableCheckbox">Available</label>   
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="checkbox" id="notAvailableCheckbox" value="notAvailable">
                        <label class="form-check-label" for="notAvailableCheckbox">Not Available</label>
                    </div>
                </div>
                 */
  function filterBusinessProcessTable() {
    const availableChecked = $("#availableCheckbox").is(":checked");
    const notAvailableChecked = $("#notAvailableCheckbox").is(":checked");

    $("#tugasHaRecTable tbody tr").each(function () {
      const rowText = $(this).text();
      const isAvailable = rowText.includes("Available") && !rowText.includes("Not Available");
      const isNotAvailable = rowText.includes("Not Available");

      let shouldShow = false;
      if (availableChecked && isAvailable) shouldShow = true;
      if (notAvailableChecked && isNotAvailable) shouldShow = true;

      $(this).toggle(shouldShow);
    });
  }

  $("#availableCheckbox, #notAvailableCheckbox").on("change", filterBusinessProcessTable);
});
