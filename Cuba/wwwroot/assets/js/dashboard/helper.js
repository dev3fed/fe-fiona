function getDataList(data) {
  if (!Array.isArray(data)) return;
  data.forEach((item) => {
    if (!Array.isArray(item.data)) item.data = [];
    if (item.data && item.data.length > 0) {
      let dropdownParent = item.dropdownParent ?? null;
      const options = {
        allowClear: true,
        data: item.data,
        dropdownParent: dropdownParent,
      };
      if (item.isMulti) {
        options.multiple = true;
        options.width = "resolve";

        if (typeof $(`#${item.dataId}`).select2 === "function") {
          $(`#${item.dataId}`).empty();
          const select2Instance = $(`#${item.dataId}`)
            .select2(options)
            .addClass("select2-multiple select2-single select2-hidden-accessible");

          // Override the selection display completely
          $(`#${item.dataId}`).on(
            "select2:select select2:unselect select2:clear select2:open select2:close",
            function (e) {
              setTimeout(() => {
                const selectedCount = $(this).val() ? $(this).val().length : 0;
                const container = $(this).next(".select2-container").find(".select2-selection__rendered");

                // Clear all existing content
                container.empty();

                if (selectedCount === 0) {
                  container.html('<span class="select2-selection__placeholder">Select an options</span>');
                } else {
                  container.html(`
                  <li class="select2-selection__choice">
                    <span class="select2-selection__choice__display">Selected ${selectedCount} items</span>
                  </li>
                  <li class="select2-search select2-search--inline">
                    <input class="select2-search__field" type="search" tabindex="0" autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false" role="searchbox" aria-autocomplete="list" style="width: 0.75em;">
                  </li>
                `);
                }
              }, 10);
            }
          );

          // Add specific handler for clear button click
          $(`#${item.dataId}`)
            .next(".select2-container")
            .on("click", ".select2-selection__clear", function (e) {
              e.preventDefault();
              $(`#${item.dataId}`).val(null).trigger("change");
              setTimeout(() => {
                const container = $(`#${item.dataId}`).next(".select2-container").find(".select2-selection__rendered");
                container.html('<span class="select2-selection__placeholder">Select an options</span>');
              }, 10);
            });

          // Initial setup
          setTimeout(() => {
            const container = $(`#${item.dataId}`).next(".select2-container").find(".select2-selection__rendered");
            container.html('<span class="select2-selection__placeholder">Select options</span>');

            // Custom CSS to match single select height
            $(`#${item.dataId}`).next(".select2-container").find(".select2-selection--multiple").css({
              "min-height": "38px",
              height: "38px",
              padding: "6px 12px",
              display: "flex",
              "align-items": "center",
            });

            // Style the rendered container to take full width and center content
            $(`#${item.dataId}`).next(".select2-container").find(".select2-selection__rendered").css({
              width: "100%",
              display: "flex",
              "align-items": "center",
              margin: "0",
              padding: "0",
            });
          }, 100);
        }
      } else {
        if (typeof $(`#${item.dataId}`).select2 === "function") {
          $(`#${item.dataId}`).empty();
          $(`#${item.dataId}`).select2(options).addClass("select2-multiple select2-single select2-hidden-accessible");
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
