function multiSelect(param) {
  const selectID = "#select" + param.selectID;
  $(selectID)
    .select2({
      placeholder: "Choose",
      allowClear: true,
      delay: 250,
      ajax: {
        url: `${url}/api/Utilities/selection`,
        dataType: "json",
        data: function (params) {
          return {
            search: params.term || "",
            page: params.page || 1,
            type: param.type,
          };
        },
        processResults: function (data) {
          return {
            results: data.data.jobPosition,
            pagination: {
              more: data.data.pagination.more,
            },
          };
        },
        cache: true,
      },
      templateResult: function (item) {
        return item.text;
      },
    })
    .on("select2:open", function () {
      page = 1;
    });
}

function getDataListAsync(data) {
  data.forEach((item) => {
    const draftId = item.draftId;
    $(`#${item.id}`)
      .select2({
        dropdownParent: item.dropdownParent ?? null,
        placeholder: "Choose an option",
        allowClear: true,
        delay: 250,
        ajax: {
          url: `${url.baseUrl}/${url["api-organization"]}/${item.endpoint}?draftId=` + draftId,
          dataType: "json",
          data: function (params) {
            return {
              search: params.term || "",
              page: params.page || 1,
              pageSize: 10,
            };
          },
          processResults: function (data, params) {
            params.page = params.page || 1;

            return {
              results: data.data.map((item) => ({
                id: item.unitCode || item.Id || item.id, // The ID for Select2
                text: item.unitName || item.Name || item.name, // The text that appears in the dropdown
              })),
              pagination: {
                more: data.hasMore, // Boolean to indicate if more data is available
              },
            };
          },
          cache: true,
        },
      })
      .on("select2:open", function () {
        page = 1;
      });
  });
}

function getSelect2(param) {
  // console.log(param.data);
  param.data = [{ id: "", text: "Select an option" }, ...param.data];
  if (param.data && param.data.length > 0) {
    let dropdownParent = param.dropdownParent ?? null;
    $(`#${param.dataId}`).empty();
    $(`#${param.dataId}`).select2({
      allowClear: true,
      placeholder: param.placeholder || "Select an option",
      data: param.data,
      dropdownParent: dropdownParent,
    });
  }
  if (param.isHide) {
    $(`#${param.dataId}`).next(".select2-container").css("display", "none");
  }
}
