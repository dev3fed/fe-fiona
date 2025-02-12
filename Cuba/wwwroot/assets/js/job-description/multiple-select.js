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
