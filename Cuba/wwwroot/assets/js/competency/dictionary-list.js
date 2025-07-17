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
    if (result.data.length > 0) {
      const bodyContent = result.data
        .map((val, i) => {
          return `
              <tr>
                <th scope="row" style="text-align:center">${i + 1}</th>
                <td>${val.sgName || "-"}</td>
                <td>${val.ssgName || "-"}</td>
                <td>${val.compName || "-"}</td>
                <td style="width: 120px;text-align:center">
                  <button class="btn btn-outline-primary" type="button" onclick="handleDetailDictionary('Technical','${
                    val.compCode
                  }')">
                    <i class="icon-eye"> Detail</i> 
                  </button>
                </td>
              </tr>`;
        })
        .join("");

      const tableBody = document.getElementById("body-technical");
      if (tableBody) {
        tableBody.innerHTML = bodyContent;
      }
    }
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
    if (result.data.length > 0) {
      console.log("first", result.data);
      const bodyContent = result.data
        .map((val, i) => {
          return `
                <tr>
                  <th scope="row" style="text-align:center">${i + 1}</th>
                  <td>${val.behaviorList || "-"}</td>
                  <td>${val.definition || "-"}</td>
                  <td style="width: 120px;text-align:center">
                    <button class="btn btn-outline-primary" type="button" onclick="handleDetailDictionary('Behavior','${
                      val.id
                    }')">
                      <i class="icon-eye"> Detail</i> 
                    </button>
                  </td>
                </tr>`;
        })
        .join("");

      const tableBody = document.getElementById("body-behavior");
      if (tableBody) {
        tableBody.innerHTML = bodyContent;
      }
    }
  } catch (error) {}
};

async function handleDetailDictionary(type, code) {
  try {
    const dataDetail =
      type != "Behavior"
        ? await fetchCompetencyDetail(code)
        : await fetchCompeBehaviorDetail(code);
    const modal = new bootstrap.Modal(
      document.getElementById("modalDetailDictionary"),
    );

    modal.show();
    // Set the title of the modal id modalDetailDictionaryTitle
    const modalTitle = document.getElementById("modalDetailDictionaryTitle");
    if (modalTitle) {
      modalTitle.innerHTML = `${type} Competency Detail`;
    }
    const formContent = `
    <div class="col-12 scrollable-content" style="min-height: 620px;">
        <div class="mb-2">
          <h6 style="font-weight:bold">${dataDetail.data.compName} </h6>
        </div>

        <div class="custom-card-approval">
            <div class="header-card-approval">
                Definition
            </div>
            <div>
                <div class=" custom-row-full">
                    <label>${dataDetail?.data.definition}</label>
                </div>
            </div>
        </div>
        <div class="custom-card-approval">
            <div class="header-card-approval">
                Level 1 (Basic)
            </div>
            <div style="padding-top: 10px;">
                <div class=" custom-row-full">
                    <ul style="list-style-type: disc; margin-left: 20px;font-size: 13px;">
                    ${dataDetail?.data.levels[1]
                      .map((item) => `<li> ${item}</li>`)
                      .join("")}
                    </ul>
                </div>
            </div>
        </div>
        <div class="custom-card-approval">
            <div class="header-card-approval">
              Level 2 (Intermediate)
            </div>
            <div style="padding-top: 10px;">
                <div class=" custom-row-full">
                    <ul style="list-style-type: disc; margin-left: 20px;font-size: 13px;">
                    ${dataDetail?.data.levels[2]
                      .map((item) => `<li> ${item}</li>`)
                      .join("")}
                    </ul>
                </div>
            </div>
        </div>
        <div class="custom-card-approval">
            <div class="header-card-approval">
                Level 3 (Advance)
            </div>
            <div style="padding-top: 10px;">
                <div class=" custom-row-full">
                   <ul style="list-style-type: disc; margin-left: 20px;font-size: 13px;">
                    ${dataDetail?.data.levels[3]
                      .map((item) => `<li> ${item}</li>`)
                      .join("")}
                    </ul>
                </div>
            </div>
        </div>
        <div class="custom-card-approval">
            <div class="header-card-approval">
                Level 4 (Mastery)
            </div>
            <div style="padding-top: 10px;">
                <div class=" custom-row-full">
                    <ul style="list-style-type: disc; margin-left: 20px;font-size: 13px;">
                    ${dataDetail?.data.levels[4]
                      .map((item) => `<li> ${item}</li>`)
                      .join("")}
                    </ul>
                </div>
            </div>
        </div>
    </div>
    <div class="col-12">
  `;

    const modalBodyContent = document.getElementById("body-detaildictionary");
    if (modalBodyContent) {
      modalBodyContent.innerHTML = formContent;
    }
  } catch (error) {}
}
