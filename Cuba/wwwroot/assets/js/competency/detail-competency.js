const handleDetailCompetency = async (type, id) => {
  console.log("first", id);
  console.log("first", type);

  // open modal dengan id modalDetailCompe
  const dataDetail = await fetchCompetencyDetail(id);
  const modal = new bootstrap.Modal(document.getElementById("modalDetailCompe"));
  modal.show();
  const modalTitle = document.getElementById("titleCompeDetail");
  const updatedValue = capitalizeFirstLetter(type);
  if (modalTitle) {
    modalTitle.innerHTML = `${updatedValue} Competency Detail`;
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
                    ${dataDetail?.data.levels[1].map((item) => `<li> ${item}</li>`).join("")}
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
                    ${dataDetail?.data.levels[2].map((item) => `<li> ${item}</li>`).join("")}
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
                    ${dataDetail?.data.levels[3].map((item) => `<li> ${item}</li>`).join("")}
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
                    ${dataDetail?.data.levels[4].map((item) => `<li> ${item}</li>`).join("")}
                    </ul>
                </div>
            </div>
        </div>
    </div>
    <div class="col-12">
  `;

  const modalBodyContent = document.getElementById("body-detailcompe");
  if (modalBodyContent) {
    modalBodyContent.innerHTML = formContent;
  }
};

const handleDictionary = async (type, id) => {
  console.log("first", id);
  console.log("first", type);

  // open modal dengan id modalDictionary
  const dataDetail = await fetchCompetencyDetail(id);
  const modal = new bootstrap.Modal(document.getElementById("modalDictionary"));
  modal.show();
  const modalTitle = document.getElementById("titleDictionaryDetail");
  const updatedValue = capitalizeFirstLetter(type);
  if (modalTitle) {
    modalTitle.innerHTML = `${updatedValue} Competency Detail`;
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
                    ${dataDetail?.data.levels[1].map((item) => `<li> ${item}</li>`).join("")}
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
                    ${dataDetail?.data.levels[2].map((item) => `<li> ${item}</li>`).join("")}
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
                    ${dataDetail?.data.levels[3].map((item) => `<li> ${item}</li>`).join("")}
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
                    ${dataDetail?.data.levels[4].map((item) => `<li> ${item}</li>`).join("")}
                    </ul>
                </div>
            </div>
        </div>
    </div>
    <div class="col-12">
  `;

  const modalBodyContent = document.getElementById("body-dictionary");
  if (modalBodyContent) {
    modalBodyContent.innerHTML = formContent;
  }
};

const handleDictsummary = async (type, id) => {
  console.log("first", id);
  console.log("first", type);

  // open modal dengan id ModalDictsummary
  const dataDetail = await fetchCompetencyDetail(id);
  const modal = new bootstrap.Modal(document.getElementById("ModalDictsummary"));
  modal.show();
  const modalTitle = document.getElementById("titleModalDictsummaryDetail");
  const updatedValue = capitalizeFirstLetter(type);
  if (modalTitle) {
    modalTitle.innerHTML = `${updatedValue} Competency Detail`;
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
                    ${dataDetail?.data.levels[1].map((item) => `<li> ${item}</li>`).join("")}
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
                    ${dataDetail?.data.levels[2].map((item) => `<li> ${item}</li>`).join("")}
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
                    ${dataDetail?.data.levels[3].map((item) => `<li> ${item}</li>`).join("")}
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
                    ${dataDetail?.data.levels[4].map((item) => `<li> ${item}</li>`).join("")}
                    </ul>
                </div>
            </div>
        </div>
    </div>
    <div class="col-12">
  `;

  const modalBodyContent = document.getElementById("body-ModalDictsummary");
  if (modalBodyContent) {
    modalBodyContent.innerHTML = formContent;
  }
};

function capitalizeFirstLetter(value) {
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1);
}
