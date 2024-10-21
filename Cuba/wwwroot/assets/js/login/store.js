async function loginApi(payload) {
  console.log("first", payload);
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
