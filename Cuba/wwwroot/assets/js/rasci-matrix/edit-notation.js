const handleEditNotationRow = async (prl, unitCode, indexNumber) => {
  try {
    const selectedValue = $("#dataSource-rasci").val();
    const payload = {
      draftId: selectedValue,
      indexNumber: indexNumber,
      unitCode: unitCode,
      prlOrg: prl,
    };
    const result = await fetchDetailNotationRow(payload);
    if (result.success === true) {
      openModalNotRow(result.data);
    }
  } catch (error) {}
};

async function openModalNotRow(result) {
  try {
    const selectedValue = $("#dataSource-rasci").val();
    const draftName = $("#dataSource-rasci option:selected").text();
    const rasciNotation = getState("rasciNotation") || [];
    const dataDetailProsbis = getState("dataDetailProsbis");
    const notation = result.rasciNotation.map((item) => {
      return {
        rasciCode: item.notation,
        comment: item.comment,
      };
    });
    const modal = new bootstrap.Modal(document.getElementById("modalNotationRow"));
    modal.show();
    const formContent = `
        <div class="col-12">
          <div >
            <label class="form-label" style="width:19%">RASCI Matrix Draft</label>
            <label> : </label>
          <b class="form-label">${draftName}</b>
          </div>
        </div>
        <div class="col-12">
          <div >
              <label class="form-label" style="width:19%">Position</label>
               <label> : </label>
          <b class="form-label">${result.jobRefName}</b>
          </div>
        </div>
        <div class="col-12">
          <div >
              <label class="form-label" style="width:19%">Business Process</label>
               <label> : </label>
          <b class="form-label">${result.indexNumber} - ${result.description}</b>
          </div>
        </div>
      `;

    theadContent = `<tr>
          <th scope="col" style="width: 50px">Check</th>
          <th scope="col" style="width: 150px;text-align:center">RASCI Notation</th>
          <th scope="col">Comment (Optional)</th>
          </tr>`;
    const output = mergeRasciData(notation, rasciNotation);
    setState("rasciNotation", output);
    setState("dataDetailProsbis", {
      ...dataDetailProsbis,
      draftId: selectedValue,
      draftName: draftName,
      prlOrg: result.prlOrg,
      unitCode: result.unitCode,
      indexGroup: result.indexNumber,
    });
    tblChangeNotationRow(output);
    document.getElementById("tbl-notatrow-header").innerHTML = theadContent;

    const bodyContent = document.getElementById("form-notatrow");
    if (bodyContent) {
      bodyContent.innerHTML = formContent;
    }

    // Initialize Bootstrap Select
    $(".selectpicker").selectpicker();
  } catch (error) {}
}

async function saveNotationRow() {
  try {
    const rasciNotation = getState("rasciNotation") || [];
    const dataDetailProsbis = getState("dataDetailProsbis");
    const spinner = document.getElementById("loadingEditnotation");
    const selectedOption = $("#dataSource-rasci option:selected");
    const draftSoId = selectedOption.data("draftso");
    spinner.style.display = "inline-block";
    const inputValue = {
      draftName: dataDetailProsbis.draftName,
      draftId: dataDetailProsbis.draftId,
      draftType: "Add/Edit RASCI",
      draftJobSource: draftSoId,
      orgUnitCode: dataDetailProsbis.unitCode,
      orgPrl: dataDetailProsbis.prlOrg,
      busProsMapped: [{ parentId: dataDetailProsbis.indexGroup, rasciNotation }],
    };
    const result = await submitDraftProsbis(inputValue);
    if (result.status === 200) {
      const modalNotationRow = document.getElementById("modalNotationRow");
      const modal = bootstrap.Modal.getInstance(modalNotationRow);
      const resultMatrix = await lastStateTableMatrix(inputValue);
      if (resultMatrix) {
        swal({
          title: "SUCCESS",
          icon: "success",
          buttons: false,
          timer: 2000,
          content: {
            element: "div",
            attributes: {
              innerHTML: `<span style="text-align: center;">Your activity has been save as draft.</span>
              <br>
              <span>You can check in <b>${result.data.draftName}</b> at draft tab.</span>
              `,
            },
          },
        }).then(async () => {
          spinner.style.display = "none";
          const payload = {
            Page: 1,
            PageSize: 5,
          };
          const queryString = new URLSearchParams(payload).toString();
          const dataDraft = await fetchDraftProsbis(queryString);
          backChangeNotationRow();
          loadTableBodyDraft(dataDraft);
          if (modal) {
            modal.hide();
          }
        });
      }
    }
  } catch (error) {}
}
