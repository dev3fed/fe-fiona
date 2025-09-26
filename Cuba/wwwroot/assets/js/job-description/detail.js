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
  const onlyShowdata = localStorage.getItem("onlyShowdata") || "";
  if (onlyShowdata !== "") {
    $(
      "#v-pills-stkReference-tab, #v-pills-fungsiReference-tab, #v-pills-tugasHaReference-tab, #v-pills-koordinasiInternalReference-tab, #v-pills-relasiEksternalReference-tab"
    ).hide();
    $(
      "#fungsiReference, #tugasHaReference, #koordinasiInternalReference, #relasiEksternalReference, #stkReference"
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
    } else {
    }
    localStorage.setItem("onlyShowdata", onlyShowdata);
  }
  const getDataJobDesc = await getAllJobDescData(getDraftExisting, id, prlOrgParam, prlOrgTarget);

  localStorage.setItem("selectedJobDescReference", JSON.stringify(getDataJobDesc));
  localStorage.setItem("isFullRefer", JSON.stringify(false));

  const lsAvailable = JSON.parse(localStorage.getItem("lsAvailable"));

  const selectedJobDescReference = JSON.parse(localStorage.getItem("selectedJobDescReference"));
  const tugasHaSelected =
    selectedJobDescReference.countTugasHa?.data.filter((item) => item.status === "AVAILABLE") || [];

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
  // return;

  const chkJobList = document.getElementById("chk-job-list");
  // const jobSelectedList = document.getElementById("job-selected-list");

  function callPopover(param, dataDetail) {
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

  // $("#modalJobCompareDetail").modal("show");
  // await applySelectedData(jobId, prlOrg, prlOrg);

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
    localStorage.setItem("fungsi", JSON.stringify(getDataJobDesc?.fungsiJabatan));
    // Initialize CKEditor for .summernote elements
    if (typeof ClassicEditor !== "undefined") {
      document.querySelectorAll(".summernote").forEach((element) => {
        ClassicEditor.create(element, {
          toolbar: TOOLBAR_SHORT,
          removePlugins: REMOVE_PLUGINS,
          ui: CKEDITOR_UI_CONFIG,
        })
          .then((editor) => {
            // Store the editor instance to the element for later reference
            element.ckeditorInstance = editor;
            editor.setData(getDataJobDesc?.fungsiJabatan?.deskripsi || "");
            console.log("CKEditor instance created and stored for .summernote element");
          })
          .catch((error) => {
            console.error("CKEditor initialization error:", error);
          });
      });
    } else {
      document.querySelectorAll(".summernote").forEach((element) => {
        element.innerHTML = getDataJobDesc?.fungsiJabatan?.deskripsi || "";
      });
    }
    console.log(getDataJobDesc?.fungsiJabatan);
    getDataJobDesc?.fungsiJabatan.jobReferences.map((item) => {
      const textReference = `(Reference from : ${item.jobReference.jobName}) - ${
        item.jobReference.skNumber ? item.jobReference.skNumber : "-"
      }`;
      $("#fungsiReferenceContainer").append(`<li>${item.fungsiJabatan}</li>`);
      $("#fungsiReferenceContainer").append(
        `<p style="font-size: 12px; font-style: italic; margin-top: -10px; margin-bottom: 10px;">${textReference}</p>`
      );
    });
  }

  if (getDataJobDesc.tugasTanggungJawabUmum) {
    localStorage.setItem("tugasUmum", JSON.stringify(getDataJobDesc.tugasTanggungJawabUmum.data));
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
        `${countAvailable}/${countAll} of business processes have been fulfilled. You can add them by clicking add data or add from references button. [See detail]`
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
    localStorage.setItem("wewenang", JSON.stringify(getDataJobDesc.wewenang.data));
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
    localStorage.setItem("persyaratanJabatan", JSON.stringify(getDataJobDesc.persyaratanJabatan.data));
    updateTable("persyaratan", getDataJobDesc.persyaratanJabatan.data, tabCusJD.pj);
  }

  if (getDataJobDesc.persyaratanKhusus) {
    // getDataJobDesc.persyaratanKhusus.data.map((item) => {
    //   item.pk = [item.pendidikanMinimal, item.pengalamanKerja];
    // });
    localStorage.setItem("persyaratanKhusus", JSON.stringify([]));
    // updateTable("persyaratanKhusus", [], [...tabCusJD.pk, "action"]);
    // localStorage.setItem("persyaratanKhusus", JSON.stringify(getDataJobDesc.persyaratanKhusus.data));
    // updateTable("persyaratanKhusus", getDataJobDesc.persyaratanKhusus.data, [...tabCusJD.pk, "action"]);
  }
  const divKompetensiTeknisGeneral = $("#kompetensiGeneral");
  const divKompetensiTeknisMandatory = $("#kompetensiMandatory");
  const divKompetensiTeknisSpesifik = $("#kompetensiSpesifik");
  const divKompetensiPerilaku = $("#kompetensiPerilaku");

  localStorage.setItem("kompetensiTeknis", JSON.stringify(getDataJobDesc.kompetensiTeknis.data));
  localStorage.setItem("kompetensiPerilaku", JSON.stringify(getDataJobDesc.kompetensiPerilaku.data));

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
    const confirm = await confirmFunction("Are you sure want to save this draft?");
    if (!confirm) {
      return;
    }

    console.log("jobId", jobId);
    console.log("prlOrg", prlOrg);
    // get all data from local storage
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

    const paramJobRef = paramsJobReferences;
    const params = paramsSaveDraft;

    // identifikasi jabatan
    params.identifikasiJabatan.jobId = jobId;
    params.identifikasiJabatan.prlOrg = prlOrg;
    params.identifikasiJabatan.unitKerjaFungsi = identifikasi.unitKerjaFungsi;
    params.identifikasiJabatan.lokasiKerja = identifikasi.lokasiKerja;
    params.identifikasiJabatan.direktorat = identifikasi.direktorat;
    params.identifikasiJabatan.atasanLangsung = identifikasi.atasanLangsung;
    params.identifikasiJabatan.noSuratKeputusan = identifikasi.noSuratKeputusan;
    params.identifikasiJabatan.tanggalSuratKeputusan = identifikasi.tanggalSuratKeputusan;
    params.identifikasiJabatan.jobReferences = [];

    // fungsi jabatan
    params.fungsiJabatan.jobId = jobId;
    params.fungsiJabatan.prlOrg = prlOrg;
    // $(".summernote").summernote("code") || ""; using ckeditor
    const summernoteElement = document.querySelector(".summernote");
    let deskripsiFungsi = "";
    deskripsiFungsi = summernoteElement.ckeditorInstance.getData();
    // if (summernoteElement && summernoteElement.ckeditorInstance) {
    // deskripsiFungsi = summernoteElement.ckeditorInstance.getData();
    // } else {
    //   deskripsiFungsi = fungsi.deskripsi || "";
    // }
    deskripsiFungsi = deskripsiFungsi.replace(/^<p>|<\/p>$/g, "").trim();
    params.fungsiJabatan.deskripsi = deskripsiFungsi;
    params.fungsiJabatan.jobReferences = fungsi.jobReferences;

    // tugas dan tanggung jawab akhir
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

    // tugas dan tanggung jawab umum
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

    // wewenang
    const paramsWewenang = params.wewenang[0];
    params.wewenang = [];
    wewenang.forEach((item) => {
      const objWewenang = { ...paramsWewenang };
      objWewenang.jobId = jobId;
      objWewenang.prlOrg = prlOrg;
      objWewenang.listKewenangan = item.wewenang || [];
      objWewenang.jobReferences = [];
    });

    // koordinasi internal
    const paramsKoordinasi = params.koordinasiInternal[0];
    params.koordinasiInternal = [];
    koordinasiInternal.forEach((item) => {
      const objKoordinasi = { ...paramsKoordinasi };
      objKoordinasi.jobId = jobId;
      objKoordinasi.prlOrg = prlOrg;
      objKoordinasi.pihakInternal = item.pihakInternal || "";
      objKoordinasi.aktivitas = item.aktivitas || "";
      objKoordinasi.internalProcess = item.internalProcess || null;
      objKoordinasi.jobReferences = [];
      if (item.jobReferences && item.jobReferences.length > 0) {
        objKoordinasi.jobReferences = item.jobReferences;
      }
      params.koordinasiInternal.push(objKoordinasi);
    });

    // relasi eksternal
    const paramsRelasi = params.relasiEksternal[0];
    params.relasiEksternal = [];
    relasiEksternal.forEach((item) => {
      const objRelasi = { ...paramsRelasi };
      objRelasi.jobId = jobId;
      objRelasi.prlOrg = prlOrg;
      objRelasi.pihakEksternal = item.pihakEksternal || "";
      objRelasi.aktivitas = item.aktivitas || "";
      objRelasi.jobReferences = [];
      if (item.jobReferences && item.jobReferences.length > 0) {
        objRelasi.jobReferences = item.jobReferences;
      }
      params.relasiEksternal.push(objRelasi);
    });

    // stk
    const paramsStk = params.stk[0];
    params.stk = [];
    stk.forEach((item) => {
      const obJStk = { ...paramsStk };
      obJStk.jobId = jobId;
      obJStk.prlOrg = prlOrg;
      obJStk.stkNumber = item.stkNumber;
      obJStk.penanggungJawab = item.penanggungJawab || "";
      obJStk.stkTitle = item.stkTitle || "";
      obJStk.jobReferences = [];
      if (item.jobReferences && item.jobReferences.length > 0) {
        obJStk.jobReferences = item.jobReferences;
      }
      params.stk.push(obJStk);
    });

    // persyaratan jabatan
    params.persyaratanJabatan = persyaratanJabatan.map((item) => ({
      ...item,
      jobId: jobId,
      prlOrg: prlOrg,
      jobReferences: [],
    }));

    // persyaratan khusus
    params.persyaratanKhusus = persyaratanKhusus.map((item) => ({
      ...item,
      jobId: jobId,
      prlOrg: prlOrg,
      jobReferences: [],
    }));

    // kompetensi perilaku
    params.kompetensiPerilaku = kompetensiPerilaku.map((item) => ({
      ...item,
      jobId: jobId,
      prlOrg: prlOrg,
      jobReferences: [],
    }));

    // kompetensi teknis
    params.kompetensiTeknis = kompetensiTeknis;
    console.log("params sebelum saveDraft", params);

    // saveDetailDraft
    loader(true);
    // async function saveDetailDraft({ draftId, jobId, prlOrg, data }) {
    const save = await updateDetailDraft({ draftId: getDraftExisting.draftId, jobId, prlOrg, data: params });
    if (save.statusCode === 200) {
      loader(false);
      swalAlert("Success", "Draft saved successfully", "success");
      // redirect to job-desc.html
      setTimeout(() => {
        window.location.href = "/job-description/index";
      }, 1500);
    } else {
      loader(false);
      swalAlert("Error", save.message || "Failed to save draft", "error");
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
        `${countAvailable}/${countAll} of business processes have been fulfilled. You can add them by clicking add data or add from references button`
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
