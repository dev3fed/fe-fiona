function selectSkillGroupTechnical(url) {
  const selectedValue = $("#dataSource-competency").val();
  $("#skillGroupTechnical")
    .select2({
      placeholder: "Choose",
      allowClear: true,
      delay: 250,
      ajax: {
        url: url,
        dataType: "json",
        data: function (params) {
          return {
            search: params.term || "",
            page: params.page || 1,
            type: "skill-group",
            draftId: selectedValue == "master" ? null : selectedValue,
          };
        },
        processResults: function (data) {
          if (data && data.data) {
            return {
              results: data.data.result,
              pagination: {
                more: data.data.pagination.more,
              },
            };
          }
          return { results: [] };
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

function subSkillGroupBySg(url) {
  const selectedValue = $("#dataSource-competency").val();
  $("#subSkillGroupTechnical")
    .select2({
      placeholder: "Choose",
      allowClear: true,
      delay: 250,
      ajax: {
        url: url,
        dataType: "json",
        data: function (params) {
          return {
            search: params.term || "",
            page: params.page || 1,
          };
        },
        processResults: function (data) {
          if (data) {
            return {
              results: data.result,
              pagination: {
                more: data.pagination.more,
              },
            };
          }
          return { results: [] };
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

function selectSubSkillGroupTechnical(url) {
  const selectedValue = $("#dataSource-competency").val();
  $("#subSkillGroupTechnical")
    .select2({
      placeholder: "Choose",
      allowClear: true,
      delay: 250,
      ajax: {
        url: url,
        dataType: "json",
        data: function (params) {
          return {
            search: params.term || "",
            page: params.page || 1,
            type: "sub-skill-group",
            draftId: selectedValue == "master" ? null : selectedValue,
          };
        },
        processResults: function (data) {
          if (data && data.data) {
            return {
              results: data.data.result,
              pagination: {
                more: data.data.pagination.more,
              },
            };
          }
          return { results: [] };
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
