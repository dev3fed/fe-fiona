document.addEventListener("dataLoaded", async function () {
  const payload = {
    page: 1,
    pageSize: 10,
  };
  const queryString = "?" + new URLSearchParams(payload).toString();

  const listData = await fetchMandatoryList(queryString);
  renderTableGeneric(listData.data);
});
document.addEventListener("DOMContentLoaded", async () => {
  const payload = {
    page: 1,
    pageSize: 10,
  };
  const queryString = "?" + new URLSearchParams(payload).toString();

  const listData = await fetchMandatoryList(queryString);
  renderTableGeneric(listData.data);
});

const renderTableGeneric = async (genericList) => {
  try {
    const listData = genericList;
    console.log("listData", listData);
    if (listData.length > 0) {
      const bodyContent = listData
        .map((val, i) => {
          return `
              <tr>
                <th scope="row" style="text-align:center">${i + 1}</th>
                <td>${val.name || "-"}</td>
                <td>${val.definition || "-"}</td>
              </tr>`;
        })
        .join("");
      const tableBody = document.getElementById("body-generic");
      if (tableBody) {
        tableBody.innerHTML = bodyContent;
      }
    } else {
      bodyContent = `
          <tr>
            <td colspan="5" style="text-align:center">Data not found</td>
          </tr>
        `;
      const tableBody = document.getElementById("body-generic");
      if (tableBody) {
        tableBody.innerHTML = bodyContent;
      }
    }
  } catch (error) {
    console.error("Error rendering table behavior:", error);
  }
};
