async function loginApi(payload) {
  try {
    const result = await $.ajax({
      type: "POST",
      url: `${url_api}/api/Auth/authenticate`,
      contentType: "application/json",
      data: JSON.stringify(payload),
    });
    return result;
  } catch (error) {
    console.log("first", error);
    console.log("Error fetching data from API");
    throw error;
  }
}

// async function loginApi(payload) {
//   const url = `${url_api}/api/Auth/authenticate`;

//   try {

//     const result = await ajaxRequest(url, "POST", payload);
//     return result;
//   } catch (error) {
//     console.error("Error fetching data from API", error);
//     throw error;
//   }
// }
