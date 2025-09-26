// 'http://localhost:5075/api/job-description/draft/list/1/10' \
async function draftList() {
  const api = `${url.baseUrl}/${url["job-description"]}/draft/list/1/10`;
  try {
    const result = await ajaxRequest(api, "GET"); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    console.error("Error fetching data from API");
    $("#resultJabatan").html("Error fetching data from API");
    throw error;
  }
}

// https://7p8ddbts-5095.asse.devtunnels.ms/api/job-description/get-list-positions/0/10?position=&division=&function=&department=&status=all&draftId=cde50163-22cf-48f3-b316-e1f12b545be4&draw=1&start=0&length=10&search=
// const result = await draftListJobDesc({
//       draftId: getDraftExisting.draftId,
//       position: value,
//       page: 0,
//       pageSize: 9999,
//     });
async function draftListJobDesc(params) {
  const api = `${url.baseUrl}/${url["job-description"]}/get-list-positions/0/999?position=${params.position}&division=&function=&department=&status=available&draftId=${params.draftId}`;
  try {
    const result = await ajaxRequest(api, "GET"); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    alert(`Data dari endpoint ${url.baseUrl}/${url["job-description"]}/get-list-positions/ error: ${error.statusText}`);
  }
}

// http://localhost:5075/api/job-description/identifikasi-jabatan/show/2fc3e013-85ee-459c-a042-b83b1e8e647e/10135643?prlOrg=19-20
async function getIdentifikasiJabatan(params) {
  const api = `${url.baseUrl}/${url["job-description"]}/identifikasi-jabatan/show/${params.draftId}/${params.jobId}?prlOrg=${params.prlRange}`;
  try {
    const result = await ajaxRequest(api, "GET"); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    alert(
      `Data dari endpoint ${url.baseUrl}/${url["job-description"]}/identifikasi-jabatan/show/ error: ${error.statusText}`
    );
  }
}

// http://localhost:5075/api/job-description/show-detail-by-position/30258741
async function getDetailByPosition(id) {
  const api = `${url.baseUrl}/${url["job-description"]}/show-detail-by-position/${id}`;
  try {
    const result = await ajaxRequest(api, "GET"); // Menggunakan ajaxRequest
    if (result?.data?.length == 0 || result?.data == null) {
      alert(`Data dari endpoint ${url.baseUrl}/${url["job-description"]}/show-detail-by-position/ tidak ada`);
      return [];
    }
    return result;
  } catch (error) {
    alert("Error fetching data from API from" + api + "with error: " + error);
    throw error;
  }
}

// 'http://localhost:5075/api/job-description/fungsi-jabatan/show/31d10a21-2d2d-4d1d-9bc1-45e938227283/10135643?prlOrg=19-20'
async function getFungsiJabatan(params) {
  const api = `${url.baseUrl}/${url["job-description"]}/fungsi-jabatan/show/${params.draftId}/${params.jobId}?prlOrg=${params.prlRange}`;
  try {
    const result = await ajaxRequest(api, "GET"); // Menggunakan ajaxRequest
    if (result?.data?.length == 0) {
      alert(`Data dari endpoint ${url.baseUrl}/${url["job-description"]}/fungsi-jabatan/show/ tidak ada`);
      return [];
    }
    return result;
  } catch (error) {
    return error;
  }
}

// http://localhost:5075/api/job-description/tugas-tanggung-jawab-akhir/show/31d10a21-2d2d-4d1d-9bc1-45e938227283/10135643?prlOrg=19-20
async function getTugasTanggungJawabAkhir(params) {
  const api = `${url.baseUrl}/${url["job-description"]}/tugas-tanggung-jawab-akhir/show/${params.draftId}/${params.jobId}?prlOrg=${params.prlRange}`;
  try {
    const result = await ajaxRequest(api, "GET"); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    return error;
  }
}

// http://localhost:5075/api/job-description/tugas-tanggung-jawab-umum/show/31d10a21-2d2d-4d1d-9bc1-45e938227283/10135643?prlOrg=19-20
async function getTugasTanggungJawabUmum(params) {
  const api = `${url.baseUrl}/${url["job-description"]}/tugas-tanggung-jawab-umum/show/${params.draftId}/${params.jobId}?prlOrg=${params.prlRange}`;
  try {
    const result = await ajaxRequest(api, "GET"); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    // Do not throw error, just return null or empty result
    return error;
  }
}

// http://localhost:5075/api/job-description/wewenang/show/b6735063-30eb-40f5-aacd-daf67b7b6c96/10135643?prlOrg=19-20
async function getWewenang(params) {
  const api = `${url.baseUrl}/${url["job-description"]}/wewenang/show/${params.draftId}/${params.jobId}?prlOrg=${params.prlRange}`;
  try {
    const result = await ajaxRequest(api, "GET"); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    // Do not throw error, just return null or empty result
    return error;
  }
}

// http://localhost:5075/api/job-description/koordinasi-internal/show/b6735063-30eb-40f5-aacd-daf67b7b6c96/10135643?prlOrg=19-20
async function getKoordinasiInternal(params) {
  const api = `${url.baseUrl}/${url["job-description"]}/koordinasi-internal/show/${params.draftId}/${params.jobId}?prlOrg=${params.prlRange}`;
  try {
    const result = await ajaxRequest(api, "GET"); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    // Do not throw error, just return null or empty result
    return error;
  }
}

// http://localhost:5075/api/job-description/relasi-eksternal/show/b6735063-30eb-40f5-aacd-daf67b7b6c96/10135643?prlOrg=19-20
async function getRelasiEksternal(params) {
  const api = `${url.baseUrl}/${url["job-description"]}/relasi-eksternal/show/${params.draftId}/${params.jobId}?prlOrg=${params.prlRange}`;
  try {
    const result = await ajaxRequest(api, "GET"); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    // Do not throw error, just return null or empty result
    return error;
  }
}

// http://localhost:5075/api/job-description/persyaratan-jabatan/show/078f449f-a016-44ee-a09c-71326225aed1/10132410?prlOrg=23
async function getPersyaratanJabatan(params) {
  const api = `${url.baseUrl}/${url["job-description"]}/persyaratan-jabatan/show/${params.draftId}/${params.jobId}?prlOrg=${params.prlRange}`;
  try {
    const result = await ajaxRequest(api, "GET"); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    // Do not throw error, just return null or empty result
    return error;
  }
}

// http://localhost:5075/api/job-description/persyaratan-khusus/show/078f449f-a016-44ee-a09c-71326225aed1/10132410?prlOrg=23
async function getPersyaratanKhusus(params) {
  const api = `${url.baseUrl}/${url["job-description"]}/persyaratan-khusus/show/${params.draftId}/${params.jobId}?prlOrg=${params.prlRange}`;
  try {
    const result = await ajaxRequest(api, "GET"); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    // Do not throw error, just return null or empty result
    return error;
  }
}

// http://localhost:5075/api/job-description/kompetensi-teknis/show/078f449f-a016-44ee-a09c-71326225aed1/10132410?prlOrg=23
async function getKompetensiTeknis(params) {
  const api = `${url.baseUrl}/${url["job-description"]}/kompetensi-teknis/show/${params.draftId}/${params.jobId}?prlOrg=${params.prlRange}`;
  try {
    const result = await ajaxRequest(api, "GET"); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    // Do not throw error, just return null or empty result
    return error;
  }
}

// http://localhost:5075/api/job-description/kompetensi-perilaku/show/078f449f-a016-44ee-a09c-71326225aed1/10132410?prlOrg=23
async function getKompetensiPerilaku(params) {
  const api = `${url.baseUrl}/${url["job-description"]}/kompetensi-perilaku/show/${params.draftId}/${params.jobId}?prlOrg=${params.prlRange}`;
  try {
    const result = await ajaxRequest(api, "GET"); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    // Do not throw error, just return null or empty result
    return error;
  }
}

// http://localhost:5075/api/job-description/stk/show/078f449f-a016-44ee-a09c-71326225aed1/10132410?prlOrg=23
async function getStk(params) {
  const api = `${url.baseUrl}/${url["job-description"]}/stk/show/${params.draftId}/${params.jobId}?prlOrg=${params.prlRange}`;
  try {
    const result = await ajaxRequest(api, "GET"); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    // Do not throw error, just return null or empty result
    return error;
  }
}

// http://localhost:5095/api/organization-structure/chart/show
async function chartShow(params) {
  const api = `${url.baseUrl}/${url["organization-structure"]}/chart/show`;
  try {
    const result = await ajaxRequest(api, "POST", params); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    console.error("Error fetching data from API");
    $("#chartJobPositionList").html("Error fetching data from API");
    throw error;
  }
}

// http://localhost:5075/api/job-description/get-similarities/10132470/0?draftId=078f449f-a016-44ee-a09c-71326225aed1&prlOrg=26
async function getSimilarities(params) {
  const api = `${url.baseUrl}/${url["job-description"]}/get-similarities/${params.jobId}/${params.percentage}?draftId=${params.draftId}&prlOrg=${params.prlOrg}`;
  try {
    const result = await ajaxRequest(api, "GET"); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    console.error("Error fetching data from API");
    $("#similarityList").html("Error fetching data from API");
    throw error;
  }
}

// http://localhost:5095/api/job-description/get-all-tanggung-jawab-to-rasci?draftId=078f449f-a016-44ee-a09c-71326225aed1&jobId=10135617&prlOrg=18&page=1&pageSize=10
async function getAllTanggungJawabToRasci(params) {
  const api = `${url.baseUrl}/${url["job-description"]}/get-all-tanggung-jawab-to-rasci?draftId=${params.draftId}&jobId=${params.jobId}&prlOrg=${params.prlOrg}&page=${params.page}&pageSize=${params.pageSize}`;
  try {
    const result = await ajaxRequest(api, "GET"); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    console.error("Error fetching data from API");
    throw error;
  }
}

// http://localhost:5095/api/job-description/get-all-tanggung-jawab-job-to-job?draftId=078f449f-a016-44ee-a09c-71326225aed1&jobIdFrom=10135617&prlOrgFrom=18&jobIdTo=10132470&prlOrgTo=26&page=1&pageSize=10
async function getAllTanggungJawabJobToJob(params) {
  const api = `${url.baseUrl}/${url["job-description"]}/get-all-tanggung-jawab-job-to-job?draftId=${params.draftId}&jobIdFrom=${params.jobIdFrom}&prlOrgFrom=${params.prlOrgFrom}&jobIdTo=${params.jobIdTo}&prlOrgTo=${params.prlOrgTo}&page=${params.page}&pageSize=${params.pageSize}`;
  try {
    const result = await ajaxRequest(api, "GET"); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    console.error("Error fetching data from API");
    throw error;
  }
}
