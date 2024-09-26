const url = "http://localhost:5095/";
const token = localStorage.getItem("token");

const endPoint = "api/MasterData";
async function getDataMasterData() {
  try {
    const response = await $.ajax({
      url: url + endPoint,
      type: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    // Process the response data after the AJAX call completes
    return response;
  } catch (error) {
    // Handle any errors that occur during the AJAX call
    console.error("Error fetching data:", error);
    return error;
  }
}

async function getMasterDataUploadLog(name) {
  try {
    const response = await $.ajax({
      url: url + endPoint + "/upload-detail?name=" + name,
      type: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    // Process the response data after the AJAX call completes
    return response;
  } catch (error) {
    // Handle any errors that occur during the AJAX call
    console.error("Error fetching data:", error);
    return error;
  }
}

async function uploadMasterDataFile(file) {
  try {
    const response = await $.ajax({
      url: url + endPoint + "/upload",
      type: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
      data: file,
      processData: false,
      contentType: false,
    });
    console.log("oke");
    return response;
  } catch (error) {
    console.log("error");
    return error;
  }
}
