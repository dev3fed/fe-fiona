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

function getDataList(data) {
  data.forEach((item) => {
    item.data = [{ id: "", text: "Select an option" }, ...item.data];
    if (item.data && item.data.length > 0) {
      let dropdownParent = item.dropdownParent ?? null;
      $(`#${item.dataId}`).empty();
      $(`#${item.dataId}`).select2({
        allowClear: true,
        placeholder: item.placeholder || "Select an option",
        data: item.data,
        dropdownParent: dropdownParent,
      });
    }
    if (item.isHide) {
      $(`#${item.dataId}`).next(".select2-container").css("display", "none");
    }
  });
}
