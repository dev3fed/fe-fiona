// 'http://localhost:5075/api/job-description/draft/list/1/10' \
async function draftList(page = 1, pageSize = 10) {
  const api = `${url.baseUrl}/${url["job-description"]}/draft/list/${page}/${pageSize}`;
  try {
    const result = await ajaxRequest(api, "GET"); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    console.error("Error fetching data from API");
    $("#resultJabatan").html("Error fetching data from API");
    throw error;
  }
}

// https://cnt.dev.be.testing.fed-insight.com/api/job-description/draft/approval/list/1/10
async function draftApprovalList(page = 1, pageSize = 10) {
  const api = `${url.baseUrl}/${url["job-description"]}/draft/approval/list/${page}/${pageSize}`;
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
async function draftListJobDesc({ draftId = "", position = "", status = "available", page = 0, pageSize = 999 }) {
  const api = `${url.baseUrl}/${url["job-description"]}/get-list-positions/${page}/${pageSize}?position=${position}&division=&function=&department=&status=${status}&draftId=${draftId}`;
  try {
    const result = await ajaxRequest(api, "GET"); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    console.error("Error fetching data from API from" + api + "with error: " + error);
    throw error;
  }
}

// http://localhost:5075/api/job-description/identifikasi-jabatan/show/2fc3e013-85ee-459c-a042-b83b1e8e647e/10135643?prlOrg=19-20
async function getIdentifikasiJabatan(params) {
  const api = `${url.baseUrl}/${url["job-description"]}/identifikasi-jabatan/show/${params.draftId}/${params.jobId}?prlOrg=${params.prlRange}`;
  try {
    const result = await ajaxRequest(api, "GET"); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    console.error("Error fetching data from API from" + api + "with error: " + error);
    throw error;
  }
}

// http://localhost:5075/api/job-description/show-detail-by-position/30258741
async function getDetailByPosition(id) {
  const api = `${url.baseUrl}/${url["job-description"]}/show-detail-by-position/${id}`;
  try {
    const result = await ajaxRequest(api, "GET"); // Menggunakan ajaxRequest
    if (result?.data?.length == 0 || result?.data == null) {
      console.error(`Data dari endpoint ${url.baseUrl}/${url["job-description"]}/show-detail-by-position/ tidak ada`);
      return [];
    }
    return result;
  } catch (error) {
    console.error("Error fetching data from API from" + api + "with error: " + error);
    throw error;
  }
}

// 'http://localhost:5075/api/job-description/fungsi-jabatan/show/31d10a21-2d2d-4d1d-9bc1-45e938227283/10135643?prlOrg=19-20'
async function getFungsiJabatan(params) {
  const api = `${url.baseUrl}/${url["job-description"]}/fungsi-jabatan/show/${params.draftId}/${params.jobId}?prlOrg=${params.prlRange}`;
  try {
    const result = await ajaxRequest(api, "GET"); // Menggunakan ajaxRequest
    if (result?.data?.length == 0) {
      console.error(`Data dari endpoint ${url.baseUrl}/${url["job-description"]}/fungsi-jabatan/show/ tidak ada`);
      return [];
    }
    return result;
  } catch (error) {
    console.error("Error fetching data from API from" + api + "with error: " + error);
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

//

// /api/job-description/draft/detail/{draftId}
async function draftDetailById(draftId) {
  const api = `${url.baseUrl}/${url["job-description"]}/draft/detail/${draftId}`;
  try {
    const result = await ajaxRequest(api, "GET"); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    // Do not throw error, just return null or empty result
    return error;
  }
}

// /api/job-description/draft/rename/{draftId}
async function draftRenameById({ draftId, draftName, description = "" }) {
  const api = `${url.baseUrl}/${url["job-description"]}/draft/rename/${draftId}/?draftName=${draftName}&description=${description}`;
  try {
    const result = await ajaxRequest(api, "PUT", { draftName: draftName, description: description }); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    // Do not throw error, just return null or empty result
    return error;
  }
}

// /api/job-description/draft/detail/list-detail/{draftId}/{page}/{pageSize}
async function draftDetailListById({ draftId, page = 1, pageSize = 99999 }) {
  const api = `${url.baseUrl}/${url["job-description"]}/draft/detail/list-detail/${draftId}/${page}/${pageSize}`;
  try {
    const result = await ajaxRequest(api, "GET"); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    // Do not throw error, just return null or empty result
    return error;
  }
}

// draftSubmitToApproval
// /api/job-description/draft/submit-to-approval/{draftId}
async function draftSubmitToApproval(draftId) {
  const api = `${url.baseUrl}/${url["job-description"]}/draft/submit/${draftId}`;
  try {
    const result = await ajaxRequest(api, "POST"); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    // Do not throw error, just return null or empty result
    return error;
  }
}

// /api/job-description/detail-draft/save/{draftId}/{jobId}/{prlOrg}
async function saveDetailDraft({ draftId, jobId, prlOrg, data }) {
  const api = `${url.baseUrl}/${url["job-description"]}/detail-draft/save/${draftId}/${jobId}/${prlOrg}`;
  try {
    const result = await ajaxRequest(api, "POST", data);
    return result;
  } catch (error) {
    // Do not throw error, just return null or empty result
    return error;
  }
}

// update
// /api/job-description/detail-draft/update/{draftId}/{jobId}/{prlOrg}
async function updateDetailDraft({ draftId, jobId, prlOrg, data }) {
  const api = `${url.baseUrl}/${url["job-description"]}/detail-draft/update/${draftId}/${jobId}/${prlOrg}`;
  try {
    const result = await ajaxRequest(api, "PUT", data);
    return result;
  } catch (error) {
    // Do not throw error, just return null or empty result
    return error;
  }
}

// download word
async function downloadWord(data) {
  const api = `${url.baseUrl}/${url["job-description"]}/detail-draft/download-word`;
  try {
    const result = await ajaxRequest(api, "POST", data, "blob");
    return {
      statusCode: 200,
      success: true,
      data: {
        blob: result,
        fileUrl: URL.createObjectURL(result),
      },
    };
  } catch (error) {
    console.error("Error in downloadWord API:", error);
    // Return a properly structured error response instead of the raw error
    return {
      statusCode: 500,
      success: false,
      message: error.message || "Failed to download word document",
      data: null,
    };
  }
}

// /api/job-description/draft/approve/{draftId}
async function draftApprove(draftId) {
  const api = `${url.baseUrl}/${url["job-description"]}/draft/approve/${draftId}`;
  try {
    const result = await ajaxRequest(api, "POST"); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    // Do not throw error, just return null or empty result
    return error;
  }
}

// /api/job-description/draft/reject/{draftId}
async function draftReject(draftId) {
  const api = `${url.baseUrl}/${url["job-description"]}/draft/reject/${draftId}`;
  try {
    const result = await ajaxRequest(api, "POST"); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    // Do not throw error, just return null or empty result
    return error;
  }
}

// /api/job-description/draft/delete/{draftId}
async function draftDelete(draftId) {
  const api = `${url.baseUrl}/${url["job-description"]}/draft/delete/${draftId}`;
  try {
    const result = await ajaxRequest(api, "DELETE"); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    // Do not throw error, just return null or empty result
    return error;
  }
}

// curl -X 'POST' \
//   'https://7p8ddbts-5095.asse.devtunnels.ms/api/job-description/get-all-recommendation-task-and-responsibilities/fe817219-f352-4a0d-8720-60cfeee1a1ad/10135617/18?page=1&pageSize=10' \
//   -H 'accept: */*' \
//   -H 'Content-Type: application/json' \
//   -d '{
//   "businessProcessCode": [
//     "MER-10",
//     "MER-100",
//     "BP002"
//   ]
// }'
async function getAllRecommendationTaskAndResponsibilities({
  draftId,
  jobId,
  prlOrg,
  businessProcessCode = [],
  page = 1,
  pageSize = 10,
}) {
  const api = `${url.baseUrl}/${url["job-description"]}/get-all-recommendation-task-and-responsibilities/${draftId}/${jobId}/${prlOrg}?page=${page}&pageSize=${pageSize}`;
  try {
    const result = await ajaxRequest(api, "POST", { businessProcessCode: businessProcessCode });
    return result;
  } catch (error) {
    // Do not throw error, just return null or empty result
    return error;
  }
}

// /api/job-description/generate-tanggung-jawab-umum/{draftId}/{jobId}/{prlOrg}
async function generateTanggungJawabUmum({ draftId, jobId, prlOrg }) {
  const api = `${url.baseUrl}/${url["job-description"]}/generate-tanggung-jawab-umum/${draftId}/${jobId}/${prlOrg}`;
  try {
    const result = await ajaxRequest(api, "GET"); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    console.error("Error fetching data from API from" + api + "with error: " + error);
    throw error;
  }
}

// /api/job-description/generate-wewenang/{draftId}/{jobId}/{prlOrg}
async function generateWewenang({ draftId, jobId, prlOrg }) {
  const api = `${url.baseUrl}/${url["job-description"]}/generate-wewenang/${draftId}/${jobId}/${prlOrg}`;
  try {
    const result = await ajaxRequest(api, "GET"); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    console.error("Error fetching data from API from" + api + "with error: " + error);
    throw error;
  }
}

// /api/job-description/generate-persyaratan-jabatan/{draftId}/{jobId}/{prlOrg}
async function generatePersyaratanJabatan({ draftId, jobId, prlOrg }) {
  const api = `${url.baseUrl}/${url["job-description"]}/generate-persyaratan-jabatan/${draftId}/${jobId}/${prlOrg}`;
  try {
    const result = await ajaxRequest(api, "GET"); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    console.error("Error fetching data from API from" + api + "with error: " + error);
    throw error;
  }
}

// https://7p8ddbts-5095.asse.devtunnels.ms/api/Utilities/selection?Page=1&Type=draft-rasci
async function getRasciList(func, jobId, prlOrgFrom, prlOrgTo) {
  const api = `${url.baseUrl}/api/Utilities/selection?Page=1&Type=draft-rasci`;
  try {
    const result = await ajaxRequest(api, "GET");
    return result;
  } catch (error) {
    console.error("Error fetching data from API from" + api + "with error: " + error);
    throw error;
  }
}

// https://7p8ddbts-5095.asse.devtunnels.ms/api/job-description/draft/create/draftSoId?draftRasciId=draftRasciId&draftName=draftJobdescName&description=asd

async function createDraft({ draftRasciId, draftName, draftOrganizationId, description = "" }) {
  const api = `${url.baseUrl}/${url["job-description"]}/draft/create/${draftOrganizationId}?draftRasciId=${draftRasciId}&draftName=${draftName}&description=${description}`;
  try {
    const result = await ajaxRequest(api, "POST");
    return result;
  } catch (error) {
    console.error("Error fetching data from API from" + api + "with error: " + error);
    throw error;
  }
}

// const uploadSvg = async (svgBlob, jobId, draftId) => {
//   const response = await fetch('/api/job-description/detail-draft/upload-svg-blob', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({
//       svgBlob: svgBlob, // bisa base64 atau direct SVG string
//       fileName: 'organization-chart',
//       jobId: jobId,
//       draftId: draftId
//     })
//   });

//   const result = await response.json();
//   console.log('Upload result:', result);
// };
async function uploadSvg(svgBlob, jobId, draftId) {
  const api = `${url.baseUrl}/${url["job-description"]}/detail-draft/upload-svg-blob`;
  console.log("Uploading SVG blob to API:", api, { svgBlob, jobId, draftId });
  try {
    // Create FormData for blob upload
    const formData = new FormData();
    formData.append("svgFile", svgBlob, "organization-chart.svg");
    formData.append("fileName", "organization-chart");
    formData.append("jobId", jobId.toString());
    formData.append("draftId", draftId.toString());

    // Use fetch directly instead of ajaxRequest for FormData
    const response = await fetch(api, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        // Don't set Content-Type header - let browser set it automatically for FormData
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error uploading SVG blob to API from" + api + "with error: " + error);
    throw error;
  }
}

// Alternative: Upload SVG as base64 string (if API expects JSON)
async function uploadSvgAsBase64(svgBlob, jobId, draftId) {
  const api = `${url.baseUrl}/${url["job-description"]}/detail-draft/upload-svg-base64`;
  console.log("Uploading SVG as base64 to API:", api, { jobId, draftId });
  try {
    // Convert blob to base64
    const base64Data = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        // Remove the data:image/svg+xml;base64, prefix
        const base64 = reader.result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(svgBlob);
    });

    const result = await ajaxRequest(api, "POST", {
      svgData: base64Data,
      fileName: "organization-chart",
      jobId: jobId,
      draftId: draftId,
      mimeType: "image/svg+xml",
    });
    return result;
  } catch (error) {
    console.error("Error uploading SVG base64 to API from" + api + "with error: " + error);
    throw error;
  }
}

// Alternative: Upload SVG as raw string (if API expects SVG text)
async function uploadSvgAsString(svgBlob, jobId, draftId) {
  const api = `${url.baseUrl}/${url["job-description"]}/detail-draft/upload-svg-string`;
  console.log("Uploading SVG as string to API:", api, { jobId, draftId });
  try {
    // Convert blob to string
    const svgString = await svgBlob.text();

    const result = await ajaxRequest(api, "POST", {
      svgContent: svgString,
      fileName: "organization-chart",
      jobId: jobId,
      draftId: draftId,
      contentType: "image/svg+xml",
    });
    return result;
  } catch (error) {
    console.error("Error uploading SVG string to API from" + api + "with error: " + error);
    throw error;
  }
}

async function chartJobDetail(params) {
  const api = `${url.baseUrl}/${url["organization-structure"]}/chart/job/detail?draftId=${params.draftId}&unitCode=${params.jobCode}`;
  try {
    const result = await ajaxRequest(api, "GET", params); // Menggunakan ajaxRequest
    return result;
  } catch (error) {
    console.error("Error fetching data from API");
    $("#chartJobPositionList").html("Error fetching data from API");
    throw error;
  }
}
