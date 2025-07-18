function getDataList(data) {
  if (!Array.isArray(data)) return;
  data.forEach((item) => {
    if (!Array.isArray(item.data)) item.data = [];
    item.data = [{ id: "", text: "Select an option" }, ...item.data];
    if (item.data && item.data.length > 0) {
      let dropdownParent = item.dropdownParent ?? null;
      const options = {
        allowClear: true,
        placeholder: item.placeholder || "Select an option",
        data: item.data,
        dropdownParent: dropdownParent,
      };
      if (item.isMulti) {
        options.multiple = true;
        // width: 'resolve'
        options.width = "resolve";
        if (!options.templateSelection) {
          options.templateSelection = function (selected, container) {
            console.log(selected, container);
            if (selected.length === 0) {
              return "Select options";
            } else {
            }
          };
        }
        if (typeof $(`#${item.dataId}`).select2 === "function") {
          $(`#${item.dataId}`).empty();
          $(`#${item.dataId}`)
            .select2(options)
            .addClass(
              "select2-multiple select2-single select2-hidden-accessible"
            );
        }
      } else {
        if (typeof $(`#${item.dataId}`).select2 === "function") {
          $(`#${item.dataId}`).empty();
          $(`#${item.dataId}`)
            .select2(options)
            .addClass(
              "select2-multiple select2-single select2-hidden-accessible"
            );
        }
      }
      if (item.isHide && !item.isMulti) {
        $(`#${item.dataId}`).next(".select2-container").css("display", "none");
      }
    }
    if (item.isMulti) {
      $(`#${item.dataId}`).attr("multiple", true);
    }
  });
}
