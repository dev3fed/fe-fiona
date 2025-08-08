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
    depth: 5,
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
  $(".summernote").summernote("disable");
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
  } catch (error) {
    showEndpointErrorAlert("job-description/relasi-eksternal/show", relasiEksternalData);
    relasiEksternal = relasiEksternalData;
  }
  updateTable("relation", relasiEksternal.data, tabCusJD.relation);

  let persyaratanJabatan;
  const persyaratanJabatanData = { data: dataJobDescCompare[0].relation };

  try {
    persyaratanJabatan = await getPersyaratanJabatan(dataDetailJobDesc);
    logWewenangFetchSuccess("job-description/persyaratan-jabatan/show", persyaratanJabatanData);

    persyaratanJabatan.data.map((item) => {
      item.pj = [item.pendidikanMinimal, ...item.pengalamanKerja];
    });
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
      focusNode(globalDataBaganSelf, bagan.data);
    }
  });

  // const dataBaganku = [
  //   {
  //     id_position_atasan_langsung: "10132411",
  //     bc_3_org_unit_name: "Strategic Planning & Initiatives",
  //     bc_3_pid: "10132411",
  //     bc_1_id_position_parent: null,
  //     bc_3_position_parent: "Strategic Planning",
  //     basket: true,
  //     bc_2_id_position: "30258748",
  //     prl: "12-18",
  //     pid: "10132411",
  //     bc_1_id_position_atasan_langsung: "10132411",
  //     bc_2_id: "10132412",
  //     bc_2_position: "Analyst I-II Strategic Planning & Initiatives",
  //     coordination: "",
  //     bc_1_layering: "L4",
  //     bc_2_flagMergeFormation: "A",
  //     bc_3_position: "Jr Analyst I-II Strategic Planning & Initiatives",
  //     gl: "GL3",
  //     bc_1_position: "Sr Analyst I-III Strategic Planning & Initiatives",
  //     bc_3_id_position_parent: null,
  //     bc_2_id_position_parent: null,
  //     project: false,
  //     tags: ["basket_3"],
  //     isMergeFormation: true,
  //     bc_1_pid: "10132411",
  //     bc_1_org_unit_name: "Strategic Planning & Initiatives",
  //     bc_3_id: "10132412",
  //     bc_3_flagMergeFormation: "A",
  //     bc_1_id_position: "30258748",
  //     position: "Sr Analyst II Strategic Planning & Initiatives",
  //     id: "10132412",
  //     assistant: false,
  //     id_position: "30258748",
  //     bc_2_org_unit_name: "Strategic Planning & Initiatives",
  //     bc_2_prl: "14-15",
  //     bc_2_id_position_atasan_langsung: "10132411",
  //     bc_2_layering: "L5",
  //     bc_3_prl: "12-13",
  //     bc_1_flagMergeFormation: "A",
  //     id_position_parent: "30258747",
  //     bc_1_id: "10132412",
  //     bc_2_position_parent: "Strategic Planning",
  //     bc_2_pid: "10132411",
  //     bc_3_jumlah_formasi: "2",
  //     id_org_unit: "10132412",
  //     bc_2_gl: "3",
  //     isNeck: false,
  //     bc_3_assistant: false,
  //     bc_3_id_position_atasan_langsung: "10132411",
  //     bc_2_id_org_unit: "10132412",
  //     org_unit_name: "Strategic Planning & Initiatives",
  //     bc_2_basket: false,
  //     bc_1_prl: "16-18",
  //     bc_1_assistant: false,
  //     bc_1_id_org_unit: "10132412",
  //     position_parent: "Strategic Planning",
  //     bc_3_id_position: "30258748",
  //     bc_3_id_org_unit: "10132412",
  //     bc_1_gl: "3",
  //     bc_3_layering: "L6",
  //     bc_3_gl: "3",
  //     bc_1_position_parent: "Strategic Planning",
  //     hasChildren: false,
  //     jumlah_formasi: 2,
  //     bc_1_jumlah_formasi: "2",
  //     bc_3_basket: false,
  //     bc_1_basket: false,
  //     bc_2_assistant: false,
  //     layering: "L4",
  //     bc_2_jumlah_formasi: "2",
  //   },
  //   {
  //     id_position_atasan_langsung: "10132411",
  //     bc_3_org_unit_name: "Budget & Program Planning",
  //     bc_3_pid: "10132411",
  //     bc_1_id_position_parent: null,
  //     bc_3_position_parent: "Strategic Planning",
  //     basket: true,
  //     bc_2_id_position: "30258750",
  //     prl: "12-18",
  //     pid: "10132411",
  //     bc_1_id_position_atasan_langsung: "10132411",
  //     bc_2_id: "10132413",
  //     bc_2_position: "Analyst I-II Budget & Program Planning",
  //     coordination: "",
  //     bc_1_layering: "L4",
  //     bc_2_flagMergeFormation: "A",
  //     bc_3_position: "Jr Analyst I-II Budget & Program Planning",
  //     gl: "GL3",
  //     bc_1_position: "Sr Analyst I-III Budget & Program Planning",
  //     bc_3_id_position_parent: null,
  //     bc_2_id_position_parent: null,
  //     project: false,
  //     tags: ["basket_3"],
  //     isMergeFormation: true,
  //     bc_1_pid: "10132411",
  //     bc_1_org_unit_name: "Budget & Program Planning",
  //     bc_3_id: "10132413",
  //     bc_3_flagMergeFormation: "A",
  //     bc_1_id_position: "30258750",
  //     position: "Analyst II Budget & Program Planning",
  //     id: "10132413",
  //     assistant: false,
  //     id_position: "30258750",
  //     bc_2_org_unit_name: "Budget & Program Planning",
  //     bc_2_prl: "14-15",
  //     bc_2_id_position_atasan_langsung: "10132411",
  //     bc_2_layering: "L5",
  //     bc_3_prl: "12-13",
  //     bc_1_flagMergeFormation: "A",
  //     id_position_parent: "30258747",
  //     bc_1_id: "10132413",
  //     bc_2_position_parent: "Strategic Planning",
  //     bc_2_pid: "10132411",
  //     bc_3_jumlah_formasi: "3",
  //     id_org_unit: "10132413",
  //     bc_2_gl: "3",
  //     isNeck: false,
  //     bc_3_assistant: false,
  //     bc_3_id_position_atasan_langsung: "10132411",
  //     bc_2_id_org_unit: "10132413",
  //     org_unit_name: "Budget & Program Planning",
  //     bc_2_basket: false,
  //     bc_1_prl: "16-18",
  //     bc_1_assistant: false,
  //     bc_1_id_org_unit: "10132413",
  //     position_parent: "Strategic Planning",
  //     bc_3_id_position: "30258750",
  //     bc_3_id_org_unit: "10132413",
  //     bc_1_gl: "3",
  //     bc_3_layering: "L6",
  //     bc_3_gl: "3",
  //     bc_1_position_parent: "Strategic Planning",
  //     hasChildren: false,
  //     jumlah_formasi: 3,
  //     bc_1_jumlah_formasi: "3",
  //     bc_3_basket: false,
  //     bc_1_basket: false,
  //     bc_2_assistant: false,
  //     layering: "L4",
  //     bc_2_jumlah_formasi: "3",
  //   },
  //   {
  //     gl: "GL3",
  //     org_unit_name: "Strategic Planning & Initiatives",
  //     id_position_parent: "30258747",
  //     tags: [],
  //     id_position_atasan_langsung: "10132411",
  //     pid: "10132411",
  //     id_org_unit: "10163365",
  //     hasChildren: false,
  //     project: false,
  //     jumlah_formasi: 1,
  //     isNeck: false,
  //     id_position: "30313763",
  //     assistant: false,
  //     prl: "16-18",
  //     coordination: "",
  //     id: "10163365",
  //     isMergeFormation: true,
  //     position_parent: "Strategic Planning",
  //     position: "Sr Analyst II Strategic Planning & Initiatives",
  //     basket: false,
  //     layering: "L4",
  //   },
  //   {
  //     gl: "GL2",
  //     org_unit_name: "Strategic Planning",
  //     id_position_parent: "30258746",
  //     tags: [],
  //     id_position_atasan_langsung: "10132410",
  //     pid: "10132410",
  //     id_org_unit: "10132411",
  //     hasChildren: true,
  //     project: false,
  //     jumlah_formasi: 7,
  //     isNeck: false,
  //     id_position: "30258747",
  //     assistant: false,
  //     prl: "21",
  //     coordination: "",
  //     id: "10132411",
  //     isMergeFormation: true,
  //     position_parent: "Business Planning & Investment",
  //     position: "Manager Strategic Planning",
  //     basket: false,
  //     layering: "L3",
  //   },
  //   {
  //     id_position_atasan_langsung: "10132418",
  //     bc_3_org_unit_name: "Performance Management",
  //     bc_3_pid: "10132418",
  //     bc_1_id_position_parent: null,
  //     bc_3_position_parent: "Performance Management",
  //     basket: true,
  //     bc_2_id_position: "30258760",
  //     prl: "12-17",
  //     pid: "10132418",
  //     bc_1_id_position_atasan_langsung: "10132418",
  //     bc_2_id: "10132419",
  //     bc_2_position: "Analyst I-II Performance Management",
  //     coordination: "",
  //     bc_1_layering: "L4",
  //     bc_2_flagMergeFormation: "A",
  //     bc_3_position: "Jr Analyst I-II Performance Management",
  //     gl: "GL3",
  //     bc_1_position: "Sr Analyst I-II Performance Management",
  //     bc_3_id_position_parent: null,
  //     bc_2_id_position_parent: null,
  //     project: false,
  //     tags: ["basket_3"],
  //     isMergeFormation: true,
  //     bc_1_pid: "10132418",
  //     bc_1_org_unit_name: "Performance Management",
  //     bc_3_id: "10132419",
  //     bc_3_flagMergeFormation: "A",
  //     bc_1_id_position: "30258760",
  //     position: "Jr Analyst II Performance Management",
  //     id: "10132419",
  //     assistant: false,
  //     id_position: "30258760",
  //     bc_2_org_unit_name: "Performance Management",
  //     bc_2_prl: "14-15",
  //     bc_2_id_position_atasan_langsung: "10132418",
  //     bc_2_layering: "L5",
  //     bc_3_prl: "12-13",
  //     bc_1_flagMergeFormation: "A",
  //     id_position_parent: "30258759",
  //     bc_1_id: "10132419",
  //     bc_2_position_parent: "Performance Management",
  //     bc_2_pid: "10132418",
  //     bc_3_jumlah_formasi: "3",
  //     id_org_unit: "10132419",
  //     bc_2_gl: "3",
  //     isNeck: false,
  //     bc_3_assistant: false,
  //     bc_3_id_position_atasan_langsung: "10132418",
  //     bc_2_id_org_unit: "10132419",
  //     org_unit_name: "Performance Management",
  //     bc_2_basket: false,
  //     bc_1_prl: "16-17",
  //     bc_1_assistant: false,
  //     bc_1_id_org_unit: "10132419",
  //     position_parent: "Performance Management",
  //     bc_3_id_position: "30258760",
  //     bc_3_id_org_unit: "10132419",
  //     bc_1_gl: "3",
  //     bc_3_layering: "L6",
  //     bc_3_gl: "3",
  //     bc_1_position_parent: "Performance Management",
  //     hasChildren: false,
  //     jumlah_formasi: 3,
  //     bc_1_jumlah_formasi: "3",
  //     bc_3_basket: false,
  //     bc_1_basket: false,
  //     bc_2_assistant: false,
  //     layering: "L4",
  //     bc_2_jumlah_formasi: "3",
  //   },
  //   {
  //     id_position_atasan_langsung: "10132418",
  //     bc_3_org_unit_name: "Subsidiary Performance Management",
  //     bc_3_pid: "10132418",
  //     bc_1_id_position_parent: null,
  //     bc_3_position_parent: "Performance Management",
  //     basket: true,
  //     bc_2_id_position: "30258763",
  //     prl: "12-17",
  //     pid: "10132418",
  //     bc_1_id_position_atasan_langsung: "10132418",
  //     bc_2_id: "10132420",
  //     bc_2_position: "Analyst I-II Subsidiary Performance Management",
  //     coordination: "",
  //     bc_1_layering: "L4",
  //     bc_2_flagMergeFormation: "A",
  //     bc_3_position: "Jr Analyst I-II Subsidiary Performance Management",
  //     gl: "GL3",
  //     bc_1_position: "Sr Analyst I-II Subsidiary Performance Management",
  //     bc_3_id_position_parent: null,
  //     bc_2_id_position_parent: null,
  //     project: false,
  //     tags: ["basket_3"],
  //     isMergeFormation: true,
  //     bc_1_pid: "10132418",
  //     bc_1_org_unit_name: "Subsidiary Performance Management",
  //     bc_3_id: "10132420",
  //     bc_3_flagMergeFormation: "A",
  //     bc_1_id_position: "30258763",
  //     position: "Jr Analyst I Subsidiary Performance Management",
  //     id: "10132420",
  //     assistant: false,
  //     id_position: "30258763",
  //     bc_2_org_unit_name: "Subsidiary Performance Management",
  //     bc_2_prl: "14-15",
  //     bc_2_id_position_atasan_langsung: "10132418",
  //     bc_2_layering: "L5",
  //     bc_3_prl: "12-13",
  //     bc_1_flagMergeFormation: "A",
  //     id_position_parent: "30258759",
  //     bc_1_id: "10132420",
  //     bc_2_position_parent: "Performance Management",
  //     bc_2_pid: "10132418",
  //     bc_3_jumlah_formasi: "2",
  //     id_org_unit: "10132420",
  //     bc_2_gl: "3",
  //     isNeck: false,
  //     bc_3_assistant: false,
  //     bc_3_id_position_atasan_langsung: "10132418",
  //     bc_2_id_org_unit: "10132420",
  //     org_unit_name: "Subsidiary Performance Management",
  //     bc_2_basket: false,
  //     bc_1_prl: "16-17",
  //     bc_1_assistant: false,
  //     bc_1_id_org_unit: "10132420",
  //     position_parent: "Performance Management",
  //     bc_3_id_position: "30258763",
  //     bc_3_id_org_unit: "10132420",
  //     bc_1_gl: "3",
  //     bc_3_layering: "L6",
  //     bc_3_gl: "3",
  //     bc_1_position_parent: "Performance Management",
  //     hasChildren: false,
  //     jumlah_formasi: 2,
  //     bc_1_jumlah_formasi: "2",
  //     bc_3_basket: false,
  //     bc_1_basket: false,
  //     bc_2_assistant: false,
  //     layering: "L5",
  //     bc_2_jumlah_formasi: "2",
  //   },
  //   {
  //     gl: "GL2",
  //     org_unit_name: "Performance Management",
  //     id_position_parent: "30258746",
  //     tags: [],
  //     id_position_atasan_langsung: "10132410",
  //     pid: "10132410",
  //     id_org_unit: "10132418",
  //     hasChildren: true,
  //     project: false,
  //     jumlah_formasi: 6,
  //     isNeck: false,
  //     id_position: "30258759",
  //     assistant: false,
  //     prl: "19",
  //     coordination: "",
  //     id: "10132418",
  //     isMergeFormation: true,
  //     position_parent: "Business Planning & Investment",
  //     position: "Manager Performance Management",
  //     basket: false,
  //     layering: "L3",
  //   },
  //   {
  //     id_position_atasan_langsung: "10132427",
  //     bc_3_org_unit_name: "Investment & Risk Evaluation",
  //     bc_3_pid: "10132427",
  //     bc_1_id_position_parent: null,
  //     bc_3_position_parent: "Investment Planning & Evaluation",
  //     basket: true,
  //     bc_2_id_position: "30258778",
  //     prl: "12-18",
  //     pid: "10132427",
  //     bc_1_id_position_atasan_langsung: "10132427",
  //     bc_2_id: "10132428",
  //     bc_2_position: "Analyst I-II Investment & Risk Evaluation",
  //     coordination: "",
  //     bc_1_layering: "L4",
  //     bc_2_flagMergeFormation: "A",
  //     bc_3_position: "Jr Analyst I-II Investment & Risk Evaluation",
  //     gl: "GL3",
  //     bc_1_position: "Sr Analyst I-III Investment & Risk Evaluation",
  //     bc_3_id_position_parent: null,
  //     bc_2_id_position_parent: null,
  //     project: false,
  //     tags: ["basket_3"],
  //     isMergeFormation: true,
  //     bc_1_pid: "10132427",
  //     bc_1_org_unit_name: "Investment & Risk Evaluation",
  //     bc_3_id: "10132428",
  //     bc_3_flagMergeFormation: "A",
  //     bc_1_id_position: "30258778",
  //     position: "Sr Analyst II Investment & Risk Evaluation",
  //     id: "10132428",
  //     assistant: false,
  //     id_position: "30258778",
  //     bc_2_org_unit_name: "Investment & Risk Evaluation",
  //     bc_2_prl: "14-15",
  //     bc_2_id_position_atasan_langsung: "10132427",
  //     bc_2_layering: "L5",
  //     bc_3_prl: "12-13",
  //     bc_1_flagMergeFormation: "A",
  //     id_position_parent: "30258777",
  //     bc_1_id: "10132428",
  //     bc_2_position_parent: "Investment Planning & Evaluation",
  //     bc_2_pid: "10132427",
  //     bc_3_jumlah_formasi: "3",
  //     id_org_unit: "10132428",
  //     bc_2_gl: "3",
  //     isNeck: false,
  //     bc_3_assistant: false,
  //     bc_3_id_position_atasan_langsung: "10132427",
  //     bc_2_id_org_unit: "10132428",
  //     org_unit_name: "Investment & Risk Evaluation",
  //     bc_2_basket: false,
  //     bc_1_prl: "16-18",
  //     bc_1_assistant: false,
  //     bc_1_id_org_unit: "10132428",
  //     position_parent: "Investment Planning & Evaluation",
  //     bc_3_id_position: "30258778",
  //     bc_3_id_org_unit: "10132428",
  //     bc_1_gl: "3",
  //     bc_3_layering: "L6",
  //     bc_3_gl: "3",
  //     bc_1_position_parent: "Investment Planning & Evaluation",
  //     hasChildren: false,
  //     jumlah_formasi: 3,
  //     bc_1_jumlah_formasi: "3",
  //     bc_3_basket: false,
  //     bc_1_basket: false,
  //     bc_2_assistant: false,
  //     layering: "L4",
  //     bc_2_jumlah_formasi: "3",
  //   },
  //   {
  //     id_position_atasan_langsung: "10132427",
  //     bc_3_org_unit_name: "Monitoring & Post-Mortem Evaluation",
  //     bc_3_pid: "10132427",
  //     bc_1_id_position_parent: null,
  //     bc_3_position_parent: "Investment Planning & Evaluation",
  //     basket: true,
  //     bc_2_id_position: "30258781",
  //     prl: "12-18",
  //     pid: "10132427",
  //     bc_1_id_position_atasan_langsung: "10132427",
  //     bc_2_id: "10132429",
  //     bc_2_position: "Analyst I-II Monitoring & Post-Mortem Evaluation",
  //     coordination: "",
  //     bc_1_layering: "L4",
  //     bc_2_flagMergeFormation: "A",
  //     bc_3_position: "Jr Analyst I-II Monitoring & Post-Mortem Evaluation",
  //     gl: "GL3",
  //     bc_1_position: "Sr Analyst I-III Monitoring & Post-Mortem Evaluation",
  //     bc_3_id_position_parent: null,
  //     bc_2_id_position_parent: null,
  //     project: false,
  //     tags: ["basket_3"],
  //     isMergeFormation: true,
  //     bc_1_pid: "10132427",
  //     bc_1_org_unit_name: "Monitoring & Post-Mortem Evaluation",
  //     bc_3_id: "10132429",
  //     bc_3_flagMergeFormation: "A",
  //     bc_1_id_position: "30258781",
  //     position: "Analyst II Monitoring & Post-Mortem Evaluation",
  //     id: "10132429",
  //     assistant: false,
  //     id_position: "30258781",
  //     bc_2_org_unit_name: "Monitoring & Post-Mortem Evaluation",
  //     bc_2_prl: "14-15",
  //     bc_2_id_position_atasan_langsung: "10132427",
  //     bc_2_layering: "L5",
  //     bc_3_prl: "12-13",
  //     bc_1_flagMergeFormation: "A",
  //     id_position_parent: "30258777",
  //     bc_1_id: "10132429",
  //     bc_2_position_parent: "Investment Planning & Evaluation",
  //     bc_2_pid: "10132427",
  //     bc_3_jumlah_formasi: "2",
  //     id_org_unit: "10132429",
  //     bc_2_gl: "3",
  //     isNeck: false,
  //     bc_3_assistant: false,
  //     bc_3_id_position_atasan_langsung: "10132427",
  //     bc_2_id_org_unit: "10132429",
  //     org_unit_name: "Monitoring & Post-Mortem Evaluation",
  //     bc_2_basket: false,
  //     bc_1_prl: "16-18",
  //     bc_1_assistant: false,
  //     bc_1_id_org_unit: "10132429",
  //     position_parent: "Investment Planning & Evaluation",
  //     bc_3_id_position: "30258781",
  //     bc_3_id_org_unit: "10132429",
  //     bc_1_gl: "3",
  //     bc_3_layering: "L6",
  //     bc_3_gl: "3",
  //     bc_1_position_parent: "Investment Planning & Evaluation",
  //     hasChildren: false,
  //     jumlah_formasi: 2,
  //     bc_1_jumlah_formasi: "2",
  //     bc_3_basket: false,
  //     bc_1_basket: false,
  //     bc_2_assistant: false,
  //     layering: "L4",
  //     bc_2_jumlah_formasi: "2",
  //   },
  //   {
  //     id_position_atasan_langsung: "10132427",
  //     bc_3_org_unit_name: "Monitoring & Post-Mortem Evaluation",
  //     bc_3_pid: "10132427",
  //     bc_1_id_position_parent: null,
  //     bc_3_position_parent: "Investment Planning & Evaluation",
  //     basket: true,
  //     bc_2_id_position: "30313764",
  //     prl: "12-18",
  //     pid: "10132427",
  //     bc_1_id_position_atasan_langsung: "10132427",
  //     bc_2_id: "10163366",
  //     bc_2_position: "Analyst I-II Monitoring & Post-Mortem Evaluation",
  //     coordination: "",
  //     bc_1_layering: "L4",
  //     bc_2_flagMergeFormation: "A",
  //     bc_3_position: "Jr Analyst I-II Monitoring & Post-Mortem Evaluation",
  //     gl: "GL3",
  //     bc_1_position: "Sr Analyst I-III Monitoring & Post-Mortem Evaluation",
  //     bc_3_id_position_parent: null,
  //     bc_2_id_position_parent: null,
  //     project: false,
  //     tags: ["basket_3"],
  //     isMergeFormation: true,
  //     bc_1_pid: "10132427",
  //     bc_1_org_unit_name: "Monitoring & Post-Mortem Evaluation",
  //     bc_3_id: "10163366",
  //     bc_3_flagMergeFormation: "A",
  //     bc_1_id_position: "30313764",
  //     position: "Sr Analyst II Monitoring & Post-Mortem Evaluation",
  //     id: "10163366",
  //     assistant: false,
  //     id_position: "30313764",
  //     bc_2_org_unit_name: "Monitoring & Post-Mortem Evaluation",
  //     bc_2_prl: "14-15",
  //     bc_2_id_position_atasan_langsung: "10132427",
  //     bc_2_layering: "L5",
  //     bc_3_prl: "12-13",
  //     bc_1_flagMergeFormation: "A",
  //     id_position_parent: "30258777",
  //     bc_1_id: "10163366",
  //     bc_2_position_parent: "Investment Planning & Evaluation",
  //     bc_2_pid: "10132427",
  //     bc_3_jumlah_formasi: "1",
  //     id_org_unit: "10163366",
  //     bc_2_gl: "3",
  //     isNeck: false,
  //     bc_3_assistant: false,
  //     bc_3_id_position_atasan_langsung: "10132427",
  //     bc_2_id_org_unit: "10163366",
  //     org_unit_name: "Monitoring & Post-Mortem Evaluation",
  //     bc_2_basket: false,
  //     bc_1_prl: "16-18",
  //     bc_1_assistant: false,
  //     bc_1_id_org_unit: "10163366",
  //     position_parent: "Investment Planning & Evaluation",
  //     bc_3_id_position: "30313764",
  //     bc_3_id_org_unit: "10163366",
  //     bc_1_gl: "3",
  //     bc_3_layering: "L6",
  //     bc_3_gl: "3",
  //     bc_1_position_parent: "Investment Planning & Evaluation",
  //     hasChildren: false,
  //     jumlah_formasi: 1,
  //     bc_1_jumlah_formasi: "1",
  //     bc_3_basket: false,
  //     bc_1_basket: false,
  //     bc_2_assistant: false,
  //     layering: "L4",
  //     bc_2_jumlah_formasi: "1",
  //   },
  //   {
  //     gl: "GL2",
  //     org_unit_name: "Investment Planning & Evaluation",
  //     id_position_parent: "30258746",
  //     tags: [],
  //     id_position_atasan_langsung: "10132410",
  //     pid: "10132410",
  //     id_org_unit: "10132427",
  //     hasChildren: true,
  //     project: false,
  //     jumlah_formasi: 7,
  //     isNeck: false,
  //     id_position: "30258777",
  //     assistant: false,
  //     prl: "20",
  //     coordination: "",
  //     id: "10132427",
  //     isMergeFormation: true,
  //     position_parent: "Business Planning & Investment",
  //     position: "Manager Investment Planning & Evaluation",
  //     basket: false,
  //     layering: "L3",
  //   },
  //   {
  //     gl: "GL1",
  //     org_unit_name: "Business Planning & Investment",
  //     id_position_parent: "30258744",
  //     tags: [],
  //     id_position_atasan_langsung: "10132408",
  //     pid: "10132408",
  //     id_org_unit: "10132410",
  //     hasChildren: true,
  //     project: false,
  //     jumlah_formasi: 21,
  //     isNeck: false,
  //     id_position: "30258746",
  //     assistant: false,
  //     prl: "23",
  //     coordination: "",
  //     id: "10132410",
  //     isMergeFormation: true,
  //     position_parent: "Perencanaan & Pengembangan Bisnis",
  //     position: "VP Business Planning & Investment",
  //     basket: false,
  //     layering: "L2",
  //   },
  // ];
  // globalBaganData = dataBaganku;
  // globalDataBaganSelf = dataBaganku.find((item) => item.id == jobId);
  // focusNode(globalDataBaganSelf, dataBaganku);

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
