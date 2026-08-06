let getDraftExisting = JSON.parse(localStorage.getItem("draftExistingJobDesc"));

// Debounce function untuk search
let searchTimeout;
function debounceSearchJobCompare(event, delay = 800) {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    searchJobCompare(event, false);
  }, delay);
}

function backToList() {
  window.location.href = "/job-description/index";
}

function confirmApply() {
  swal("Success", "Job Description has been applied", "success");
}

function refreshDataLocalStorage() {
  const keys = [
    "fungsi",
    "lsAvailable",
    "tugasUmum",
    "tugasHa",
    "wewenang",
    "koordinasiInternal",
    "relasiEksternal",
    "persyaratanJabatan",
    "kompetensiPerilaku",
    "kompetensiTeknis",
    "persyaratanKhusus",
    "stk",
    "arraySelectedBusPro",
    "onlyShowdata",
  ];
  keys.forEach((key) => localStorage.removeItem(key));
}

/**
 * Prepares job description data from localStorage for saving as draft
 * @param {string} jobId - The job ID
 * @param {string} prlOrg - The Job Gradeanization value
 * @param {Object} paramsSaveDraft - The base parameters object for saving draft
 * @returns {Object} The prepared parameters object ready for API submission
 */
function prepareJobDescriptionData(jobId, prlOrg, paramsSaveDraft) {
  // Get all data from local storage
  const identifikasi = JSON.parse(localStorage.getItem("identifikasi")) || {};
  const fungsi = JSON.parse(localStorage.getItem("fungsi")) || {};
  const tugasUmum = JSON.parse(localStorage.getItem("tugasUmum")) || [];
  const tugasHa = JSON.parse(localStorage.getItem("tugasHa")) || [];
  const wewenang = JSON.parse(localStorage.getItem("wewenang")) || [];
  const koordinasiInternal = JSON.parse(localStorage.getItem("koordinasiInternal")) || [];
  const relasiEksternal = JSON.parse(localStorage.getItem("relasiEksternal")) || [];
  const persyaratanJabatan = JSON.parse(localStorage.getItem("persyaratanJabatan")) || [];
  const persyaratanKhusus = JSON.parse(localStorage.getItem("persyaratanKhusus")) || [];
  const kompetensiPerilaku = JSON.parse(localStorage.getItem("kompetensiPerilaku")) || [];
  const kompetensiTeknis = JSON.parse(localStorage.getItem("kompetensiTeknis")) || {};
  const stk = JSON.parse(localStorage.getItem("stk")) || [];

  // Clone the base parameters to avoid mutation
  const params = JSON.parse(JSON.stringify(paramsSaveDraft));

  // Identifikasi jabatan
  params.identifikasiJabatan.jobId = jobId;
  params.identifikasiJabatan.prlOrg = prlOrg;
  params.identifikasiJabatan.jobName = identifikasi.jobName;
  params.identifikasiJabatan.unitKerjaFungsi = identifikasi.unitKerjaFungsi;
  params.identifikasiJabatan.lokasiKerja = identifikasi.lokasiKerja;
  params.identifikasiJabatan.direktorat = identifikasi.direktorat;
  params.identifikasiJabatan.atasanLangsung = identifikasi.atasanLangsung;
  params.identifikasiJabatan.noSuratKeputusan = identifikasi.noSuratKeputusan;
  params.identifikasiJabatan.tanggalSuratKeputusan = identifikasi.tanggalSuratKeputusan;
  params.identifikasiJabatan.jobReferences = [];

  // Fungsi jabatan
  params.fungsiJabatan.jobId = jobId;
  params.fungsiJabatan.prlOrg = prlOrg;

  // Get description from CKEditor or contenteditable element
  const summernoteElement = document.querySelector(".summernote");
  let deskripsiFungsi = "";
  if (summernoteElement && summernoteElement.ckeditorInstance) {
    deskripsiFungsi = summernoteElement.ckeditorInstance.getData();
    deskripsiFungsi = deskripsiFungsi.replace(/^<p>|<\/p>$/g, "").trim();
  }
  params.fungsiJabatan.deskripsi = deskripsiFungsi;
  params.fungsiJabatan.jobReferences = fungsi.jobReferences || [];

  // Tugas dan tanggung jawab akhir
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
    // Filter unique values
    objTugasHa.tanggungJawabProses = (item.tanggungJawabProses || [])
      .map((tr) => tr.code)
      .filter((v, i, a) => a.indexOf(v) === i);
    objTugasHa.hasilAkhirProses = (item.hasilAkhirProses || [])
      .map((hr) => hr.code)
      .filter((v, i, a) => a.indexOf(v) === i);
    objTugasHa.jobReferences = [];
    if (item.jobReferences && item.jobReferences.length > 0) {
      objTugasHa.jobReferences = item.jobReferences;
    }
    params.tugasTanggungJawabAkhir.push(objTugasHa);
  });

  // Tugas dan tanggung jawab umum
  const paramsTugasUmum = params.tugasTanggungJawabUmum[0];
  params.tugasTanggungJawabUmum = [];
  tugasUmum.forEach((item) => {
    const objTugasUmum = { ...paramsTugasUmum };
    objTugasUmum.jobId = jobId;
    objTugasUmum.prlOrg = prlOrg;
    objTugasUmum.tanggungJawab = item.header || [];
    objTugasUmum.hasilAkhir = item.tugas || [];
    objTugasUmum.jobReferences = [];
    if (item.jobReferences && item.jobReferences.length > 0) {
      objTugasUmum.jobReferences = item.jobReferences;
    }
    params.tugasTanggungJawabUmum.push(objTugasUmum);
  });

  // Wewenang
  const paramsWewenang = params.wewenang[0];
  params.wewenang = [];
  wewenang.forEach((item) => {
    const objWewenang = { ...paramsWewenang };
    objWewenang.jobId = jobId;
    objWewenang.prlOrg = prlOrg;
    objWewenang.listKewenangan = item.wewenang || [];
    objWewenang.jobReferences = [];
    params.wewenang.push(objWewenang);
  });

  // Koordinasi internal
  const paramsKoordinasi = params.koordinasiInternal[0];
  params.koordinasiInternal = [];
  koordinasiInternal.forEach((item) => {
    const objKoordinasi = { ...paramsKoordinasi };
    objKoordinasi.jobId = jobId;
    objKoordinasi.prlOrg = prlOrg;
    objKoordinasi.pihakInternal = item.internal || "";
    objKoordinasi.aktivitas = item.aktivitas || "";
    objKoordinasi.internalProcess = item.internalProcess || null;
    objKoordinasi.jobReferences = [];
    if (item.jobReferences && item.jobReferences.length > 0) {
      objKoordinasi.jobReferences = item.jobReferences;
    }
    params.koordinasiInternal.push(objKoordinasi);
  });

  // Relasi eksternal
  const paramsRelasi = params.relasiEksternal[0];
  params.relasiEksternal = [];
  relasiEksternal.forEach((item) => {
    const objRelasi = { ...paramsRelasi };
    objRelasi.jobId = jobId;
    objRelasi.prlOrg = prlOrg;
    objRelasi.pihakEksternal = item.eksternal || "";
    objRelasi.aktivitas = item.aktivitas || "";
    objRelasi.jobReferences = [];
    if (item.jobReferences && item.jobReferences.length > 0) {
      objRelasi.jobReferences = item.jobReferences;
    }
    params.relasiEksternal.push(objRelasi);
  });

  // STK
  const paramsStk = params.stk[0];
  params.stk = [];
  stk.forEach((item) => {
    const objStk = { ...paramsStk };
    objStk.jobId = jobId;
    objStk.prlOrg = prlOrg;
    objStk.stkNumber = item.stkNumber;
    objStk.penanggungJawab = item.penanggungJawab || "";
    objStk.stkTitle = item.stkTitle || "";
    objStk.jobReferences = [];
    if (item.jobReferences && item.jobReferences.length > 0) {
      objStk.jobReferences = item.jobReferences;
    }
    params.stk.push(objStk);
  });

  // Persyaratan jabatan
  params.persyaratanJabatan = persyaratanJabatan.map((item) => ({
    ...item,
    jobId: jobId,
    prlOrg: prlOrg,
    jobReferences: [],
  }));

  // Persyaratan khusus
  params.persyaratanKhusus = persyaratanKhusus.map((item) => ({
    ...item,
    jobId: jobId,
    prlOrg: prlOrg,
    jobReferences: [],
  }));

  // Kompetensi perilaku
  params.kompetensiPerilaku = kompetensiPerilaku.map((item) => ({
    ...item,
    jobId: jobId,
    prlOrg: prlOrg,
    jobReferences: [],
  }));

  // Kompetensi teknis
  params.kompetensiTeknis = kompetensiTeknis;

  return params;
}

// Helper function to handle errors gracefully
const safeApiCall = async (apiCall, fallbackValue = null) => {
  try {
    return await apiCall();
  } catch (error) {
    console.error(`API call failed:`, error);
    return fallbackValue;
  }
};

async function generateJobDescDataNonEditable(draftExisting, id, prlOrgParam, prlOrgTarget) {
  // check prlOrgTarget includes - ,  prlOrgTarget.includes(",")
  const prlOrg = prlOrgTarget.includes("-") ? prlOrgTarget.split("-")[1] : prlOrgTarget;
  const dataDetailJobDesc = {
    draftId: draftExisting.draftId,
    jobId: id,
    prlRange: prlOrg,
    prlOrg: prlOrg,
    // jobId: 10135617,
    // prlRange: 18,
    // prlOrg: 18,
  };

  // Execute all API calls in parallel with error handling
  const [tugasTanggungJawabUmum, wewenang, persyaratanJabatan, countTugasHa] = await Promise.allSettled([
    safeApiCall(() => generateTanggungJawabUmum(dataDetailJobDesc)),
    safeApiCall(() => generateWewenang(dataDetailJobDesc)),
    safeApiCall(() => generatePersyaratanJabatan(dataDetailJobDesc)),
    safeApiCall(() => getAllTanggungJawabToRasci({ ...dataDetailJobDesc, page: 1, pageSize: 99 })),
  ]);

  // Return the results, extracting values from settled promises
  return {
    tugasTanggungJawabUmum: tugasTanggungJawabUmum.status === "fulfilled" ? tugasTanggungJawabUmum.value : null,
    wewenang: wewenang.status === "fulfilled" ? wewenang.value : null,
    persyaratanJabatan: persyaratanJabatan.status === "fulfilled" ? persyaratanJabatan.value : null,
    countTugasHa: countTugasHa.status === "fulfilled" ? countTugasHa.value : null,
  };
}

async function getAllJobDescData(draftExisting, id, prlOrgParam, prlOrgTarget) {
  const dataDetailJobDesc = {
    draftId: draftExisting.draftId,
    jobId: id,
    prlRange: prlOrgTarget,
    prlOrg: prlOrgTarget,
  };

  // Helper function to handle errors gracefully
  // const safeApiCall = async (apiCall, fallbackValue = null) => {
  //   try {
  //     return await apiCall();
  //   } catch (error) {
  //     console.error(`API call failed:`, error);
  //     return fallbackValue;
  //   }
  // };

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
  const onlyShowdata = localStorage.getItem("onlyShowdata") || "";
  console.log("onlyShowdata", onlyShowdata);
  if (onlyShowdata !== "") {
    $(
      "#v-pills-stkReference-tab, #v-pills-fungsiReference-tab, #v-pills-tugasHaReference-tab, #v-pills-koordinasiInternalReference-tab, #v-pills-relasiEksternalReference-tab ,#v-pills-persyaratanJabatanReference-tab",
    ).hide();
    $(
      "#fungsiReference, #tugasHaReference, #koordinasiInternalReference, #relasiEksternalReference, #stkReference, #persyaratanJabatanReference",
    ).hide();
    if (onlyShowdata == "stk") {
      $("#v-pills-stkReference-tab").show();
      $("#stkReference").show();
    } else if (onlyShowdata == "fungsi") {
      $("#v-pills-fungsiReference-tab").show();
      $("#fungsiReference").show();
    } else if (onlyShowdata == "tugasHa") {
      $("#v-pills-tugasHaReference-tab").show();
      $("#tugasHaReference").show();
    } else if (onlyShowdata == "koordinasi") {
      $("#v-pills-koordinasiInternalReference-tab").show();
      $("#koordinasiInternalReference").show();
    } else if (onlyShowdata == "relation") {
      $("#v-pills-relasiEksternalReference-tab").show();
      $("#relasiEksternalReference").show();
    } else if (onlyShowdata == "persyaratan") {
      $("#v-pills-persyaratanJabatanReference-tab").show();
      $("#persyaratanJabatanReference").show();
    }
    localStorage.setItem("onlyShowdata", onlyShowdata);
  }
  const getDataJobDesc = await getAllJobDescData(getDraftExisting, id, prlOrgParam, prlOrgTarget);

  localStorage.setItem("selectedJobDescReference", JSON.stringify(getDataJobDesc));
  localStorage.setItem("isFullRefer", JSON.stringify(false));

  const lsAvailable = JSON.parse(localStorage.getItem("lsAvailable"));
  const codeNotAvailable = lsAvailable?.codeNotAvailable || [];

  const codeAvailableSelectedArray =
    getDataJobDesc?.tugasTanggungJawabAkhir?.data?.flatMap(
      (item) => item.tanggungJawabProses?.map((proses) => proses.indexNumber) || [],
    ) || [];

  const codeAvailableSelected = codeAvailableSelectedArray.filter((v, i, a) => a.indexOf(v) === i);

  // compare codeAvailableSelected with codeNotAvailable

  let arraytugasTanggungJawabAkhir = [];

  // getDataJobDesc?.tugasTanggungJawabAkhir?.data?.forEach((item) => {
  //   const uniqueProses = [];
  //   const map = new Map();
  //   item.tanggungJawabProses?.forEach((proses) => {
  //     if (!map.has(proses.indexNumber)) {
  //       console.log("proses.indexNumber", proses.indexNumber);
  //       map.set(proses.indexNumber, true); // set any value to Map
  //       uniqueProses.push(proses);
  //     }
  //   });
  //   item.tanggungJawabProses = uniqueProses;
  // });

  getDataJobDesc?.tugasTanggungJawabAkhir?.data?.forEach((item) => {
    console.log("=====");
    const arrayProses = item.tanggungJawabProses?.map((proses) => proses.indexNumber) || [];
    console.log("arrayProses", arrayProses);
    // check arrayProses if includes codeNotAvailable

    console.log("codeNotAvailable", codeNotAvailable);
    const hasRelevantProcess = arrayProses.some((code) => codeNotAvailable.includes(code));
    if (hasRelevantProcess) {
      arraytugasTanggungJawabAkhir.push(item);
    }
    // item.tanggungJawabProses?.forEach((proses) => {
    //   if (codeNotAvailable.includes(proses.indexNumber)) {
    //     // Do something if both conditions are met
    //     isItemAdded = false;
    //   }
    // });
    // if (isItemAdded) {
    //   console.log("Adding item to arraytugasTanggungJawabAkhir", item);
    //   arraytugasTanggungJawabAkhir.push(item);
    // }
  });

  const selectedJobDescReference = JSON.parse(localStorage.getItem("selectedJobDescReference")) || {};
  selectedJobDescReference.tugasTanggungJawabAkhir.data = arraytugasTanggungJawabAkhir;
  console.log("selectedJobDescReference", selectedJobDescReference);
  localStorage.setItem("selectedJobDescReference", JSON.stringify(selectedJobDescReference));

  const isFullRefer = codeNotAvailable.every((code) => codeAvailableSelected.includes(code));
  const notAvailableRefer = codeNotAvailable.filter((code) => !codeAvailableSelected.includes(code));
  console.log("isFullRefer", isFullRefer);
  console.log("arraytugasTanggungJawabAkhir", arraytugasTanggungJawabAkhir);
  console.log("notAvailableRefer", notAvailableRefer);
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

  updateTableSelected("tugasHaReference", arraytugasTanggungJawabAkhir || [], tabCusJD.tugasHa);
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
  const chkJobList = document.getElementById("chk-job-list");
  // const jobSelectedList = document.getElementById("job-selected-list");

  function callPopover(param, dataDetail) {
    console.log("dataDetail in popover", dataDetail);
    // Generate popoverContent dynamically with if-else for status
    const dataArray = dataDetail?.data || [];
    let popoverContent = "";

    if (dataArray.length === 0) {
      popoverContent = `
        <tr>
          <td colspan="3" style="text-align:center;">No Data Available</td>
        </tr>
      `;
    } else {
      popoverContent = dataArray
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
    }
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
            </tr>
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
    showChartLoading("chk-job-list-percentage", true, "480px", "100%", "Please wait, fetching data...");
    const value = event;
    const chkJobListPercentage = document.getElementById("chk-job-list-percentage");

    const jobSimilaritiesData = JSON.parse(localStorage.getItem("jobSimilaritiesData"));
    const jobSimilaritiesDetails = JSON.parse(localStorage.getItem("jobSimilaritiesDetails"));
    const selectedSK = $("#selectSK").val() || null;
    console.log("selectedSK", selectedSK);
    const data = !selectedSK
      ? jobSimilaritiesData?.filter((item) => item.percentage >= value)
      : jobSimilaritiesData?.filter((item) => item.noSk === selectedSK && item.percentage >= value);
    console.log("jobSimilaritiesData", jobSimilaritiesData);
    console.log("data filtered", data);
    // dan urutan berdasarkan percentage yang paling tinggi

    if (data === undefined) {
      chkJobListPercentage.innerHTML = DATA_NOT_FOUND_HTML;
      hideChartLoading("animate-chk");
      return;
    }

    for (const item of data) {
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
    for (let item of data) {
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
    if (data.length === 0) {
      innerHTML = DATA_NOT_FOUND_HTML;
    }
    chkJobListPercentage.innerHTML = innerHTML;
    storeId.forEach((item) => {
      const dataDetail = jobSimilaritiesDetails.find((detail) => detail.jobIdTo === item);
      callPopover(item, dataDetail);
    });

    // Hide loading after processing is complete
    hideChartLoading("animate-chk");
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

function readOnlyPage() {
  $(".btn").hide();
  $("#labelFulfillTugasHa").hide();
  $("#handleExportPng , #backToListBtn").show();
  $("#exportImageBtn, #exportSVGBtn, #exportPDFBtn, #fitToScreenBtn, #zoomInBtn, #zoomOutBtn, #chartCompactBtn").show();

  // Delay CKEditor readonly setting to ensure it's fully initialized
  setTimeout(() => {
    const summernoteElement = document.querySelector(".summernote");
    if (summernoteElement && summernoteElement.ckeditorInstance && summernoteElement.ckeditorInstance._editor) {
      try {
        summernoteElement.ckeditorInstance._editor.setReadOnly(true);
        console.log("CKEditor set to readonly mode");
      } catch (error) {
        console.error("Failed to set CKEditor readonly:", error);
        // Fallback: disable contenteditable
        if (summernoteElement.contentEditable) {
          summernoteElement.contentEditable = "false";
        }
      }
    }
  }, 1000);
}
async function generateAndDownloadWord() {
  try {
    console.log("🚀 Starting Word document generation...");
    const params = prepareJobDescriptionData(jobId, prlOrg, paramsSaveDraft);
    console.log("Generating Word document with params:", params);

    const wordResult = await downloadWord(params);
    console.log("Word document generation response:", wordResult);
    if (!wordResult || !wordResult.data || !wordResult.data.fileUrl) {
      console.error("Invalid response from downloadWord:", wordResult);
      swal("Warning", "Failed to generate Word document. Invalid server response.", "warning");
      return;
    }

    const link = document.createElement("a");
    link.href = wordResult.data.fileUrl;
    link.download = `Job_Description_${jobId}.docx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      URL.revokeObjectURL(wordResult.data.fileUrl);
    }, 100);

    console.log("✅ Word document downloaded successfully");
    swal("Success", "Word document generated successfully!", "success");
  } catch (error) {
    console.error("❌ Error generating Word document:", error);
    swal("Warning", `Failed to generate Word document: ${error.message}`, "warning");
  }
}

async function getDetailJob(jobCode) {
  console.log("getDraftExisting", getDraftExisting);
  const detailJob = await chartJobDetail({
    draftId: getDraftExisting.organizationDraftId,
    jobCode: jobCode,
  });
  return detailJob;
}

$(document).ready(async function () {
  // $("#modalRecomendation").modal("show");
  // modalRecomendationBody
  // make list in modalRecomendationBody with codeNotAvailable

  localStorage.setItem("selectedJobDescReference", JSON.stringify([]));
  localStorage.setItem("isFullRefer", JSON.stringify(false));

  // return;
  loader(true);
  if (master) {
    const draftExistingJobDesc = JSON.parse(localStorage.getItem("draftExistingJobDesc"));
    const dataListDraft = await draftList();
    if (!draftExistingJobDesc || draftExistingJobDesc.draftOrganizationId == "" || draftExistingJobDesc == undefined) {
      const data = dataListDraft.data[0];
      console.log("data =>", data);
      getDraftExisting = {
        draftId: data.draftId,
        draftOrganizationId: data.draftOrganizationId,
        draftRasciId: data.draftRasciId,
        draftName: data.draftName,
        organizationDraftId: data.organizationDraftId,
      };
      localStorage.setItem(
        "draftExistingJobDesc",
        JSON.stringify({
          draftId: getDraftExisting.draftId,
          draftOrganizationId: getDraftExisting.draftOrganizationId,
          draftRasciId: getDraftExisting.draftRasciId,
          draftName: getDraftExisting.draftName,
          organizationDraftId: getDraftExisting.organizationDraftId,
        }),
      );
    }
    readOnlyPage();
  }
  const detailJobSO = await getDetailJob(jobId);
  getDataListAsync([
    {
      id: "selectSK",
      endpoint: "chart/job/list",
      // draftId: draftId,
    },
  ]);
  // const skList = await getSkList(1, 999);
  // console.log("skList", skList);

  async function updateDataSimilarities() {
    localStorage.removeItem("jobSimilaritiesData");
    localStorage.removeItem("jobSimilaritiesDetails");
    // $()
    const result = await getSimilarities({
      draftId: getDraftExisting.draftId,
      jobId: jobId,
      prlOrg: prlOrg,
      percentage: 50,
    });
    const data = result?.value?.data || [];
    console.log("getSimilarities result", result);
    if (data.length > 0) {
      const dataCompare = data
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
      localStorage.setItem("jobSimilaritiesData", JSON.stringify(dataCompare));

      $(
        "#addJobReference, #referenceFunction, #referenceTugasHa, #referenceKoordinasi, #referenceRelasi, #referencePk, #addJobReferencePJ, #referenceSTK",
      ).prop("disabled", false);
      // all class spinner display none
      $(".spinner-border").hide();

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
      const jobSimilaritiesDetails = await Promise.all(detailPromises);
      localStorage.setItem("jobSimilaritiesDetails", JSON.stringify(jobSimilaritiesDetails));
      console.log("jobSimilaritiesDetails", jobSimilaritiesDetails);
    } else {
      $(
        "#addJobReference, #referenceFunction, #referenceTugasHa, #referenceKoordinasi, #referenceRelasi, #referencePk, #addJobReferencePJ, #referenceSTK",
      ).prop("disabled", false);
      $(".spinner-border").hide();
    }

    return result;
  }

  updateDataSimilarities();
  console.log("detailJobSO", detailJobSO);

  // return;
  // await 3 seconds delay to simulate loading
  await new Promise((resolve) => setTimeout(resolve, 1000));

  refreshDataLocalStorage();
  let activeTab = "identifikasi";
  if (activeTab) {
    const linkTab = "#v-pills-" + activeTab + "-tab";
    $(linkTab).tab("show");
  }

  // $("#modalJobCompareDetail").modal("show");
  // await applySelectedData(jobId, prlOrg, prlOrg);

  console.log("getDraftExisting", getDraftExisting);
  let getDataJobDesc = await getAllJobDescData(getDraftExisting, jobId, prlOrg, prlOrg);
  console.log("getDataJobDesc", getDataJobDesc);
  console.log("getDataJobDesc", getDataJobDesc.countTugasHa);
  loader(false);
  for (const key in getDataJobDesc) {
    if (getDataJobDesc[key] === null || getDataJobDesc[key] === undefined) {
      showEndpointErrorAlert(`job-description/${key}/show`, getDataJobDesc[key]);
      getDataJobDesc[key] = null;
    }
  }
  if (getDataJobDesc?.identifikasiJabatan != null) {
    console.log("identifikasiJabatan", getDataJobDesc.identifikasiJabatan);

    updateIdentifikasiJob(getDataJobDesc?.identifikasiJabatan);
  } else {
    const dataParams = detailJobSO.data || {};
    console.log("dataParams ==>>", dataParams);
    const identifikasi = {
      jobName: dataParams.positionName || "",
      unitKerjaFungsi: dataParams.functionName || "",
      lokasiKerja: dataParams.location || "Kantor Pusat",
      direktorat: dataParams?.directorate?.directorateName || "",
      atasanLangsung: dataParams.directReportName || "",
      noSuratKeputusan: dataParams.sourceOfSK || "",
      tanggalSuratKeputusan: dataParams.skDate || "",
    };

    updateIdentifikasiJob(identifikasi);
    console.error("Identifikasi Jabatan data is null or undefined");
    console.log("call generate new");
    getDataJobDesc = await generateJobDescDataNonEditable(getDraftExisting, jobId, prlOrg, prlOrg);
    console.log("getDataJobDesc", getDataJobDesc);
  }

  const initializeEditor = () => {
    if (typeof CKEDITOR !== "undefined" && CKEDITOR) {
      console.log("CKEditor 4.8.0 is available, initializing...");

      document.querySelectorAll(".summernote").forEach((element) => {
        // Ensure element has an ID for CKEditor 4
        if (!element.id) {
          element.id = "ckeditor-" + Math.random().toString(36).substr(2, 9);
        }

        // CKEditor 4.8.0 optimized configuration
        const editor = CKEDITOR.replace(element.id, {
          toolbar: [
            { name: "editing", items: ["Undo", "Redo"] },
            { name: "basicstyles", items: ["Bold", "Italic", "Underline"] },
            { name: "paragraph", items: ["BulletedList", "NumberedList"] },
          ],
          removePlugins: "elementspath", // Remove bottom path bar
          resize_enabled: false,
          height: 220,
          uiColor: "#ffffff",
          enterMode: CKEDITOR.ENTER_P, // Use <p> tags for Enter
          shiftEnterMode: CKEDITOR.ENTER_BR, // Use <br> for Shift+Enter
          allowedContent: true, // Allow all content - important for v4.8.0
          fillEmptyBlocks: false, // Don't fill empty blocks with &nbsp;
          autoParagraph: false, // Don't auto-wrap content in <p> tags
          startupFocus: false, // Don't auto-focus editor on load
          // Specific settings for CKEditor 4.8.0
          entities: false, // Don't convert characters to HTML entities
          basicEntities: false, // Don't convert basic entities
          forceEnterMode: true, // Force the enter mode setting
        });

        // Store the editor instance for compatibility
        element.ckeditorInstance = {
          getData: () => editor.getData(),
          setData: (data) => editor.setData(data),
          _editor: editor, // Store reference to actual CKEditor instance
        };

        // Set initial data when editor is ready
        editor.on("instanceReady", function () {
          editor.setData(getDataJobDesc?.fungsiJabatan?.deskripsi || "");
          console.log("✅ CKEditor 4.8.0 successfully initialized for element:", element.id);

          // Ensure proper focus behavior for text input
          editor.focus();
        });

        // Handle editor errors
        editor.on("error", function (evt) {
          console.error("❌ CKEditor 4.8.0 error:", evt.data);
          setupContentEditable(element);
        });

        // Additional event for better text editing experience
        editor.on("key", function (evt) {
          // Ensure spacebar works properly
          if (evt.data.keyCode === 32) {
            // Spacebar
            return true; // Allow the space
          }
        });
      });
    } else {
      console.log("CKEditor 4.8.0 not available, using contenteditable fallback");
      document.querySelectorAll(".summernote").forEach((element) => {
        setupContentEditable(element);
      });
    }
  };

  // Helper function for contenteditable fallback
  function setupContentEditable(element) {
    element.contentEditable = true;
    element.innerHTML = getDataJobDesc?.fungsiJabatan?.deskripsi || "";
    element.style.border = "1px solid #ddd";
    element.style.padding = "12px";
    element.style.minHeight = "120px";
    element.style.outline = "none";
    element.style.borderRadius = "4px";
    element.style.fontSize = "14px";
    element.style.lineHeight = "1.5";
    element.style.backgroundColor = "#ffffff";

    element.ckeditorInstance = {
      getData: () => element.innerHTML,
      setData: (data) => (element.innerHTML = data),
    };

    console.log("📝 Contenteditable fallback initialized for .summernote element");
  }

  // Try to initialize immediately, or wait a bit if scripts are still loading
  if (typeof CKEDITOR !== "undefined" && CKEDITOR) {
    initializeEditor();
  } else {
    console.log("CKEditor 4.8.0 not ready yet, waiting 500ms...");
    setTimeout(initializeEditor, 500);
  }

  localStorage.setItem("fungsi", JSON.stringify({}));
  if (getDataJobDesc.fungsiJabatan) {
    localStorage.setItem("fungsi", JSON.stringify(getDataJobDesc?.fungsiJabatan));

    getDataJobDesc?.fungsiJabatan.jobReferences.map((item) => {
      const textReference = `(Reference from : ${item.jobReference.jobName}) - ${
        item.jobReference.skNumber ? item.jobReference.skNumber : "-"
      }`;
      $("#fungsiReferenceContainer").append(`<li>${item.fungsiJabatan}</li>`);
      $("#fungsiReferenceContainer").append(
        `<p style="font-size: 12px; font-style: italic; margin-top: -10px; margin-bottom: 10px;">${textReference}</p>`,
      );
    });
  } else {
  }

  localStorage.setItem("tugasUmum", JSON.stringify([]));
  if (getDataJobDesc.tugasTanggungJawabUmum) {
    localStorage.setItem("tugasUmum", JSON.stringify(getDataJobDesc.tugasTanggungJawabUmum.data));
    updateTable("tugasUmum", getDataJobDesc.tugasTanggungJawabUmum.data, tabCusJD.tugasUmum);
  }

  localStorage.setItem("lsAvailable", JSON.stringify({}));
  console.log("getDataJobDesc.tugasTanggungJawabUmum", getDataJobDesc.tugasTanggungJawabUmum);
  console.log("getDataJobDesc.countTugasHa", getDataJobDesc.countTugasHa);
  console.log("getDataJobDesc", getDataJobDesc);
  if (getDataJobDesc.countTugasHa) {
    const countAll = getDataJobDesc?.countTugasHa?.data?.length;
    const available = getDataJobDesc?.countTugasHa?.data?.filter((item) => item.status === "AVAILABLE");
    const notAvailable = getDataJobDesc?.countTugasHa?.data?.filter((item) => item.status === "NOT AVAILABLE");
    const countAvailable = available?.length;
    const countNotAvailable = notAvailable?.length;
    const codeAvailable = available?.map((item) => item.indexNumber);
    const codeNotAvailable = notAvailable?.map((item) => item.indexNumber);

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

  localStorage.setItem("tugasHa", JSON.stringify([]));
  if (getDataJobDesc.tugasTanggungJawabAkhir) {
    const cleanObj = getDataJobDesc.tugasTanggungJawabAkhir.data.filter((item) => item.responsible.length > 0);
    localStorage.setItem("tugasHa", JSON.stringify(cleanObj));
    updateTable("tugasHa", cleanObj, [...tabCusJD.tugasHa, "action"]);
  }

  localStorage.setItem("wewenang", JSON.stringify([]));
  if (getDataJobDesc.wewenang) {
    localStorage.setItem("wewenang", JSON.stringify(getDataJobDesc.wewenang.data));
    updateTable("wewenang", getDataJobDesc.wewenang.data, tabCusJD.wewenang);
  }

  localStorage.setItem("koordinasiInternal", JSON.stringify([]));
  if (getDataJobDesc.koordinasiInternal) {
    localStorage.setItem("koordinasiInternal", JSON.stringify(getDataJobDesc.koordinasiInternal.data));
    updateTable("koordinasi", getDataJobDesc.koordinasiInternal.data, [...tabCusJD.koordinasi, "action"]);
  }

  localStorage.setItem("relasiEksternal", JSON.stringify([]));
  if (getDataJobDesc.relasiEksternal) {
    localStorage.setItem("relasiEksternal", JSON.stringify(getDataJobDesc.relasiEksternal.data));
    updateTable("relation", getDataJobDesc.relasiEksternal.data, [...tabCusJD.relation, "action"]);
  }

  const dataPJ = [
    {
      jobId: "10132410",
      pjList: [
        "Sarjana dari berbagai jurusan, diutamakan dari Bisnis/Manajemen.",
        "S1 dengan pengalaman kerja > 15 tahun, atau S2 dengan pengalaman kerja 12 - 15 tahun.",
        "Pengalaman kerja di bidang Business Management, diutamakan di bidang Business Planning/Business Development.",
        "Min. 3 tahun menjabat posisi setingkat VP.",
      ],
      kompetensiTeknis: {
        mandatory: [
          { name: "HSSE General", level: "3" },
          { name: "HC Integrated", level: "3" },
          { name: "Strategic & Business Management", level: "3" },
          { name: "Risk Fundamental", level: "3" },
          { name: "Digital & Analytic Insight", level: "3" },
        ],
        general: [
          { name: "Business Knowledge", level: "2" },
          { name: "Business Opportunity Assessment", level: "2" },
          { name: "Program Management", level: "2" },
        ],
        specific: [
          { name: "Business Analysis & Forecasting", level: "3" },
          { name: "Corporate Strategic Planning", level: "3" },
          { name: "Business Valuation", level: "3" },
          { name: "Business Modelling", level: "3" },
          { name: "Business Performance Management", level: "3" },
          { name: "Portfolio Management", level: "3" },
          { name: "Corporate Restructuring", level: "3" },
        ],
      },
      kompetensiPerilaku: [
        { name: "Cultivating Networks & Partnerships" },
        { name: "Establishing Strategic Direction" },
        { name: "Operational Decision Making" },
        { name: "Entrepreneurial Insights" },
        { name: "Business Acumen" },
        { name: "Customer Relationship" },
        { name: "Leading Innovation" },
        { name: "Technology Savvy" },
        { name: "Change Leadership" },
        { name: "Building Organizational Talent" },
        { name: "Strategic Influence" },
        { name: "Optimizing Diversity" },
        { name: "Leading through Vision and Values" },
        { name: "Inspiring Excellence" },
        { name: "Learning Agility" },
      ],
    },
    {
      jobId: "Q1000045",
      pjList: [
        "Sarjana dari berbagai jurusan, diutamakan dari Bisnis/Manajemen.",
        "S1 dengan pengalaman kerja > 15 tahun, atau S2 dengan pengalaman kerja 12 - 15 tahun.",
        "Pengalaman kerja di bidang Business Management, diutamakan di bidang Business Planning/Business Development.",
        "Min. 3 tahun menjabat posisi setingkat VP.",
      ],
      kompetensiTeknis: {
        mandatory: [
          { name: "HSSE General", level: "2" },
          { name: "HC Integrated", level: "2" },
          { name: "Strategic & Business Management", level: "2" },
          { name: "Risk Fundamental", level: "2" },
          { name: "Digital & Analytic Insight", level: "2" },
        ],
        general: [
          { name: "Marketing Strategy and Planning", level: "3" },
          { name: "Customer Relation Management", level: "2" },
          { name: "Sales Strategy and Planning", level: "2" },
        ],
        specific: [
          { name: "Business Opportunity Assessment", level: "2" },
          { name: "Brand Management", level: "2" },
          { name: "Stakeholder Management", level: "3" },
          { name: "Business Partnership Management", level: "3" },
          { name: "Business Performance Management", level: "2" },
          { name: "Pricing Management", level: "3" },
          { name: "Market Research and Competitive Intelligence", level: "3" },
        ],
      },
      kompetensiPerilaku: [
        { name: "Building Networks" },
        { name: "Strategic Planning" },
        { name: "Operational Decision Making" },
        { name: "Business Insights" },
        { name: "Customer Orientation" },
        { name: "Leading Innovation" },
        { name: "Technology Savvy" },
        { name: "Facilitating Change" },
        { name: "Building Talent" },
        { name: "Creating an Inclusive Environment" },
        { name: "Influencing" },
        { name: "Inspiring Others" },
        { name: "Driving for Results" },
        { name: "Learning Agility" },
      ],
    },
  ];
  localStorage.setItem("persyaratanJabatan", JSON.stringify([]));
  if (getDataJobDesc.persyaratanJabatan) {
    if (jobId === "10132410" || jobId === "Q1000045") {
      getDataJobDesc.persyaratanJabatan.data = [
        {
          pengalamanKerja: dataPJ.find((item) => item.jobId === jobId)?.pjList || [],
        },
      ];
    }
    localStorage.setItem("persyaratanJabatan", JSON.stringify(getDataJobDesc.persyaratanJabatan.data));
    console.log("persyaratanJabatan", getDataJobDesc.persyaratanJabatan.data);
    if (getDataJobDesc.persyaratanJabatan.data.length >= 1) {
      $("#addJobPJ, #addJobReferencePJ").hide();
    }

    updateTable("persyaratanJabatan", getDataJobDesc.persyaratanJabatan.data, [
      ...tabCusJD.persyaratanJabatan,
      "action",
    ]);
  }

  localStorage.setItem("persyaratanKhusus", JSON.stringify([]));
  if (getDataJobDesc.persyaratanKhusus) {
    // getDataJobDesc.persyaratanKhusus.data.map((item) => {
    //   item.pk = [item.pendidikanMinimal, item.pengalamanKerja];
    // });
    localStorage.setItem("persyaratanKhusus", JSON.stringify([]));
    updateTable("persyaratanKhusus", [], [...tabCusJD.persyaratanKhusus, "action"]);
    // localStorage.setItem("persyaratanKhusus", JSON.stringify(getDataJobDesc.persyaratanKhusus.data));
    // updateTable("persyaratanKhusus", getDataJobDesc.persyaratanKhusus.data, [...tabCusJD.pk, "action"]);
  }
  const divKompetensiTeknisGeneral = $("#kompetensiGeneral");
  const divKompetensiTeknisMandatory = $("#kompetensiMandatory");
  const divKompetensiTeknisSpesifik = $("#kompetensiSpesifik");
  const divKompetensiPerilaku = $("#kompetensiPerilaku");

  if (jobId === "10132410" || jobId === "Q1000045") {
    getDataJobDesc.kompetensiTeknis = {
      data: {
        komtekMandatori:
          dataPJ
            .find((item) => item.jobId === jobId)
            ?.kompetensiTeknis?.mandatory.map((item) => ({
              komtekMandatoriName: item.name,
              level: item.level,
            })) || [],
        komtekGeneral:
          dataPJ
            .find((item) => item.jobId === jobId)
            ?.kompetensiTeknis?.general.map((item) => ({
              komtekGeneralName: item.name,
              level: item.level,
            })) || [],
        komtekSpesifik:
          dataPJ
            .find((item) => item.jobId === jobId)
            ?.kompetensiTeknis?.specific.map((item) => ({
              komtekSpesifikName: item.name,
              level: item.level,
            })) || [],
      },
    };
    getDataJobDesc.kompetensiPerilaku = {
      data:
        dataPJ
          .find((item) => item.jobId === jobId)
          ?.kompetensiPerilaku?.map((item) => ({
            namaKompetensi: item.name,
          })) || [],
    };
  }

  localStorage.setItem("kompetensiTeknis", JSON.stringify(getDataJobDesc?.kompetensiTeknis?.data || {}));
  localStorage.setItem("kompetensiPerilaku", JSON.stringify(getDataJobDesc?.kompetensiPerilaku?.data || []));

  if (
    getDataJobDesc?.kompetensiTeknis?.data?.komtekMandatori &&
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
    getDataJobDesc?.kompetensiTeknis?.data?.komtekGeneral &&
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
    getDataJobDesc?.kompetensiTeknis?.data?.komtekSpesifik &&
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

  if (
    getDataJobDesc?.kompetensiPerilaku?.data &&
    Array.isArray(getDataJobDesc.kompetensiPerilaku.data) &&
    getDataJobDesc.kompetensiPerilaku.data.length > 0
  ) {
    const $ul = $("<ul style='list-style-type: disc; padding-left: 20px;'></ul>");
    getDataJobDesc.kompetensiPerilaku.data.forEach((item) => {
      $ul.append(`<li><span>${item.namaKompetensi}</span></li>`);
    });
    divKompetensiPerilaku.append($ul);
  } else {
    divKompetensiPerilaku.append("<div class='text-center'>No data found</div>");
  }

  localStorage.setItem("stk", JSON.stringify([]));
  if (getDataJobDesc.stk) {
    // filter stk.data to remove items with empty stkNumber is null or undefined
    getDataJobDesc.stk.data = getDataJobDesc.stk.data.filter(
      (item) => item.stkNumber !== null && item.stkNumber !== undefined,
    );
    localStorage.setItem("stk", JSON.stringify(getDataJobDesc.stk.data));
    updateTable("stk", getDataJobDesc.stk.data, [...tabCusJD.stk, "action"]);
  }

  if (master) {
    readOnlyPage();
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

  $("#handleExportPng").on("click", async function () {
    try {
      console.log("🚀 Starting SVG generation...");
      const dataSvg = await chartUploadSVG();

      if (dataSvg) {
        // Test: Convert blob to URL untuk memastikan valid
        const testUrl = URL.createObjectURL(dataSvg);
        // Clean up test URL
        setTimeout(() => URL.revokeObjectURL(testUrl), 100);

        const uploadResult = await uploadSvg(dataSvg, jobId, prlOrg);

        if (uploadResult && uploadResult.success) {
          console.log("✅ SVG uploaded successfully:", uploadResult);
        } else {
          console.warn("⚠️ SVG upload failed, proceeding to download Word document anyway:", uploadResult);
          swal(
            "Warning",
            uploadResult?.message || "SVG upload failed, but Word document will still be downloaded.",
            "warning",
          );
        }

        // Generate and download Word document regardless of SVG upload result
        await generateAndDownloadWord();
      } else {
        console.error("❌ SVG blob is null or undefined");
        swal("Error", "Failed to generate SVG. Please try again.", "error");
      }
    } catch (error) {
      console.error("❌ Error in handleExportPng:", error);
      swal("Error", `Failed to generate SVG: ${error.message}, still proceeding to download Word document.`, "error");

      await generateAndDownloadWord();
    }

    return;
  });

  $("#saveDraft").on("click", async function () {
    const confirm = await confirmFunction("Are you sure want to save this draft?");
    if (!confirm) {
      return;
    }

    // Use the new function to prepare job description data
    const params = prepareJobDescriptionData(jobId, prlOrg, paramsSaveDraft);
    // console.log("Prepared params for saving draft:", params);
    // return;

    // Uncomment below when ready to save
    loader(true);
    try {
      const save = await updateDetailDraft({ draftId: getDraftExisting.draftId, jobId, prlOrg, data: params });
      console.log("Save draft response:", save);
      if (save && save?.value?.status === 200) {
        loader(false);
        swal("Success", "Draft saved successfully", "success");
        // redirect to job-desc.html
        setTimeout(() => {
          window.location.href = "/job-description/index";
        }, 1500);
      } else {
        loader(false);
        swal("Error", save?.message || "Failed to save draft", "error");
      }
    } catch (err) {
      console.error("saveDraft error:", err);
      swal("Error", err.message || "Failed to save draft", "error");
      loader(false);
    }
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

  // dataListJobDescription[0].jobStatus = localStorage.getItem("statusManager");
  // dataListJobDescription[1].jobStatus = localStorage.getItem("statusSbm");

  // Listen for changes on the radio buttons within the form with ID 'percentage-amount-form'
  $("#percentage-amount-form input[name='percentage-amount']").on("change", function () {
    const value = $(this).val();
    console.log("Selected debt amount option:", value);
    console.log(getDraftExisting, "getDraftExisting");
    searchJobCompare(value, true);
  });

  $("#selectSK").on("change", function () {
    const value = $(this).val();
    console.log("Selected SK option:", value);
    const valuePercentage = $("input[name='percentage-amount']:checked").val();
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
    $("#modalRasciAvailability").modal("show");

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
    // get modalRasciAvailabilityBody
    const modalRasciAvailabilityBody = document.getElementById("modalRasciAvailabilityBody");
    const allBusPro = lsAvailable.available.concat(lsAvailable.notAvailable);
    console.log("allBusPro", allBusPro);

    modalRasciAvailabilityBody.innerHTML = "";
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
          <tbody class="tbodRasciAvailability">
          </tbody>
        </table>
      </div>
        `;
    modalRasciAvailabilityBody.innerHTML = content;
    let tbodRasciAvailability = document.querySelector(".tbodRasciAvailability");
    console.log("tbodRasciAvailability", tbodRasciAvailability);
    tbodRasciAvailability.innerHTML = "";
    for (let item of allBusPro) {
      const statusIcon = item.status === "AVAILABLE" ? "available" : "nonavail";
      const statusText = item.status === "AVAILABLE" ? "Available" : "Not Available";
      const statusColor = item.status === "AVAILABLE" ? "#06BE00" : "#D02138";
      tbodRasciAvailability.innerHTML += `
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
});
