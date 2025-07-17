document.addEventListener("DOMContentLoaded", function () {
  fetctListDatasource();
  feather.replace();
});

const getSummaryList = async (draftId) => {
  try {
    let statusValue = document.getElementById("status-summary").value;
    const payload = {
      dataSource: draftId,
      keySearch: "",
      searchValue: "",
      filter: [statusValue],
      page: 2,
      limit: 10,
    };
    const resultList = await fetchSummalyList(payload);
    if (resultList.data.length > 0) {
      const bodySummary = resultList.data
        .map((element, i) => {
          // Determine status styling
          let statusText = element.kkjStatus || "N/A";
          let statusHtml = `<span style="
            display: inline-block;
            background-color: #b9fbc0;
            color: #16a34a;
            font-weight: 500;
            padding: 4px 12px;
            border-radius: 4px;
            line-height: 1;
            ">${statusText}</span>`;

          return `
            <tr>
              <td style="text-align:center">${i + 1}</td>
              <td>${element.positionName || "N/A"}</td>
              <td style="text-align:center">${element.functionName || "N/A"}</td>
              <td style="text-align:center">${element.divisionName || "N/A"}</td>
              <td style="text-align:center">${statusHtml}</td>
              <td></td>
            </tr>`;
        })
        .join("");
      document.getElementById("body-summary").innerHTML = bodySummary;
    }
  } catch (error) {
    console.error("Error fetching summary list:", error);
  }
};
function fetctListDatasource(draftId = null) {
  $.ajax({
    url: `${url_api}/api/Utilities/selection`,
    dataType: "json",
    data: {
      type: "draft-comp",
      page: 1,
      search: "",
    },
    success: function (response) {
      if (response && response.data && response.data.result) {
        let $select = $("#dataSource-summary");
        $select.find("option:not(:first)").remove(); // Hapus opsi lama kecuali yang pertama

        response.data.result.forEach((item) => {
          let isSelected = draftId && item.id == draftId;
          let $option = new Option(item.text, item.id, isSelected, isSelected);
          $($option).attr("data-draftso", item.draftSo); // Tambahkan atribut data-draftso
          $select.append($option);
        });

        if (draftId) {
          let newOption = new Option(`Draft ${draftId}`, draftId, true, true);
          $(newOption).attr("data-draftso", "your-value-here"); // Jika perlu, set manual
          $select.append(newOption);
        }

        $select.select2({
          placeholder: "Choose",
          allowClear: true,
        });

        if (draftId) {
          $select.val(draftId).trigger("change");
        }
      }
    },
  });
}
