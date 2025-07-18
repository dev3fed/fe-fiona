// const handleBackMainpage = () => {
//   const dictionaryPage = document.getElementById("dictionary-page");
//   const mainCompetency = document.getElementById("main-competency");
//   const headerCompetency = document.getElementById("header-competency");
//   const headerDictionary = document.getElementById("header-dictionarypage");
//   if (dictionaryPage) {
//     dictionaryPage.style.display = "none";
//   }
//   if (mainCompetency) {
//     mainCompetency.style.display = "block";
//   }
//   if (headerDictionary) {
//     headerDictionary.style.display = "none";
//   }
//   if (headerCompetency) {
//     headerCompetency.style.display = "block";
//   }
// };

const bodypageMandatory = async () => {
  try {
    const payload = {
      page: 1,
      pageSize: 10,
    };
    const queryString = "?" + new URLSearchParams(payload).toString();
    const result = await fetchMandatoryList(queryString);
    if (result.data.length > 0) {
      const bodyContent = result.data
        .map((val, i) => {
          return `
            <tr>
              <th scope="row" style="text-align:center">${i + 1}</th>
              <td>${val.name || "-"}</td>
              <td>${val.definition || "-"}</td>
              <td style="width: 120px;text-align:center">
                <button class="btn btn-outline-primary" type="button" onclick="handleDetailDictionary('Generic','${
                  val.compCode
                }')">
                  <i class="icon-eye"> Detail</i> 
                </button>
              </td>
            </tr>`;
        })
        .join("");

      const tableBody = document.getElementById("body-mandatory");
      if (tableBody) {
        tableBody.innerHTML = bodyContent;
      }
    }
  } catch (error) {}
};

const bodypageTechnical = async () => {
  try {
    const payload = {
      page: 1,
      pageSize: 10,
    };
    const queryString = "?" + new URLSearchParams(payload).toString();
    const result = await fetchTechnicalList(queryString);
    renderTableTchnical(result.data);
    console.log("result", result);
    setState("payloadTblTechnical", payload);
  } catch (error) {}
};

const bodypageBehavior = async () => {
  try {
    const payload = {
      page: 1,
      pageSize: 10,
    };
    const queryString = "?" + new URLSearchParams(payload).toString();
    const result = await fetchBehaviorList(queryString);
    renderTableBehavior(result.data);
    setState("payloadTblBehavior", payload);
  } catch (error) {}
};
