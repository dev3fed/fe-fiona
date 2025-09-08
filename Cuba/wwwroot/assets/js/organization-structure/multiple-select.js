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

function updateCareerType() {
  $("#selectCareerType")
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
            type: "career-type",
          };
        },
        processResults: function (data) {
          return {
            results: data.data.careerType,
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
  $("#selectCareerType").next(".select2-container").attr("id", "selectCareerType");
}

function updateCareerLevel(careerTypeName) {
  $("#selectCareerLevel")
    .select2({
      placeholder: "Choose",
      allowClear: true,
      delay: 250,
      ajax: {
        url: `${url}/api/Utilities/selection`,
        dataType: "json",
        data: function (params) {
          return {
            // search: params.term || "",
            Page: params.page || 1,
            Type: "career-level",
            CarrerTypeName: careerTypeName,
          };
        },
        processResults: function (data) {
          return {
            results: data.data.careerLevel,
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
  //
  $("#selectCareerLevel").attr("disabled", false);

  $("#modalSelectCareerLevel")
    .select2({
      placeholder: "Choose",
      allowClear: true,
      delay: 250,
      ajax: {
        url: `${url}/api/Utilities/selection`,
        dataType: "json",
        data: function (params) {
          return {
            // search: params.term || "",
            Page: params.page || 1,
            Type: "career-level",
            CarrerTypeName: careerTypeName,
          };
        },
        processResults: function (data) {
          return {
            results: data.data.careerLevel,
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
  //
  $("#modalSelectCareerLevel").attr("disabled", false);
}

function updateAbbrvPosition(carrerTypeName, carrerTypeLevel) {
  $("#selectAbbrvPosition")
    .select2({
      placeholder: "Choose",
      allowClear: true,
      delay: 250,
      // add class
      ajax: {
        url: `${url}/api/Utilities/selection`,
        dataType: "json",
        data: function (params) {
          return {
            Page: params.page || 1,
            Type: "pos-abbrv",
            carrerTypeName: carrerTypeName,
            carrerTypeLevel: carrerTypeLevel,
          };
        },
        processResults: function (data) {
          return {
            results: data.data.posAbbrv,
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
  // $("#selectAbbrvPosition").next(".select2-container").attr("id", "selectAbbrvPosition");
}

function updateAbbrvPositionModal(carrerTypeName, carrerTypeLevel) {
  $("#modalSelectAbbrvPosition")
    .select2({
      placeholder: "Choose",
      allowClear: true,
      delay: 250,
      // add class
      ajax: {
        url: `${url}/api/Utilities/selection`,
        dataType: "json",
        data: function (params) {
          return {
            Page: params.page || 1,
            Type: "pos-abbrv",
            carrerTypeName: carrerTypeName,
            carrerTypeLevel: carrerTypeLevel,
          };
        },
        processResults: function (data) {
          return {
            results: data.data.posAbbrv,
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
  // $("#modalSelectAbbrvPosition").next(".select2-container").attr("id", "modalSelectAbbrvPosition");
}

// updateprl
function updatePrlOrg(carrerTypeName, carrerTypeLevel) {
  $("#selectPrlOrg").select2({
    placeholder: "Choose",
    allowClear: true,
    delay: 250,
    ajax: {
      url: `${url}/api/Utilities/selection`,
      dataType: "json",
      data: function (params) {
        return {
          Page: params.page || 1,
          Type: "prlorg",
          carrerTypeName: carrerTypeName,
          carrerTypeLevel: carrerTypeLevel,
        };
      },
      processResults: function (data) {
        return {
          results: data.data,
        };
      },
      cache: true,
    },
    templateResult: function (item) {
      return item.text;
    },
  });

  $("#selectPrlOrgTo").select2({
    placeholder: "Choose",
    allowClear: true,
    delay: 250,
    ajax: {
      url: `${url}/api/Utilities/selection`,
      dataType: "json",
      data: function (params) {
        return {
          Page: params.page || 1,
          Type: "prlorg",
          carrerTypeName: carrerTypeName,
          carrerTypeLevel: carrerTypeLevel,
        };
      },
      processResults: function (data) {
        return {
          results: data.data,
        };
      },
      cache: true,
    },
    templateResult: function (item) {
      return item.text;
    },
  });

  $("#modalSelectPrlOrgSubPos").select2({
    placeholder: "Choose",
    allowClear: true,
    delay: 250,
    ajax: {
      url: `${url}/api/Utilities/selection`,
      dataType: "json",
      data: function (params) {
        return {
          Page: params.page || 1,
          Type: "prlorg",
          carrerTypeName: carrerTypeName,
          carrerTypeLevel: carrerTypeLevel,
        };
      },
      processResults: function (data) {
        return {
          results: data.data,
        };
      },
      cache: true,
    },
    templateResult: function (item) {
      return item.text;
    },
  });

  // $("#selectAbbrvPosition").next(".select2-container").attr("id", "selectAbbrvPosition");
}

// selectFunction
function updateFunction() {
  $("#selectFunction")
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
            type: "org-function",
          };
        },
        processResults: function (data) {
          return {
            results: data.data.listFunction,
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

  $("#selectFunction").next(".select2-container").attr("id", "selectFunction");
}

// selectDivision
function updateDivision() {
  $("#selectDivision")
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
            type: "org-division",
          };
        },
        processResults: function (data) {
          return {
            results: data.data.listDivision,
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

  $("#selectDivision").next(".select2-container").attr("id", "selectDivision");
}

// selectSubDivision
function updateSubDivision() {
  $("#selectSubDivision")
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
            type: "org-subdivision",
          };
        },
        processResults: function (data) {
          return {
            results: data.data.listSubDivision,
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

  $("#selectSubDivision").next(".select2-container").attr("id", "selectSubDivision");
}

// department
function updateDepartment() {
  $("#selectDepartment")
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
            type: "org-department",
          };
        },
        processResults: function (data) {
          return {
            results: data.data.listDepartment,
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

  $("#selectDepartment").next(".select2-container").attr("id", "selectDepartment");
}

// selectDirectReport
function updateDirectReport() {
  $("#selectDirectReport")
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
            type: "jobposition",
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

  // $("#selectDirectReport").next(".select2-container").attr("id", "selectDirectReport");
}

function updateCoordinationWith() {
  $("#selectCoordinationWith")
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
            type: "jobposition",
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

  // $("#selectCoordinationWith").next(".select2-container").attr("id", "selectCoordinationWith");
}

function updateJobReference() {
  $("#selectJobReference")
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
            type: "jobpositionId",
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

  // $("#selectJobReference")").next(".select2-container").attr("id", "selectJobReference")");
}

// selectPersonalSubareaName
function updatePersonalSubareaName() {
  $("#selectPersonalSubareaName")
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
            type: "org-personal-subarea",
          };
        },
        processResults: function (data) {
          return {
            results: data.data.listPersonalSubarea,
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

  $("#selectPersonalSubareaName").next(".select2-container").attr("id", "selectPersonalSubareaName");
}

// org-unit
function updateOrgUnit() {
  $("#selectOrgUnitName")
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
            type: "org-unit",
          };
        },
        processResults: function (data) {
          return {
            results: data.data.listOrg,
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

  $("#selectOrgUnitName").next(".select2-container").attr("id", "selectOrgUnitName");
}

// org-section
function updateOrgSection() {
  $("#selectSection")
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
            type: "org-section",
          };
        },
        processResults: function (data) {
          return {
            results: data.data.listSection,
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

  $("#selectSection").next(".select2-container").attr("id", "selectSection");
}

function updateSSG(select, type) {
  const selectId = "#select" + select;
  $(selectId)
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
            type: type,
          };
        },
        processResults: function (data) {
          return {
            results: data.data.listSg || data.data.listSsg,
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

  $(selectId).next(".select2-container").attr("id", select);
}

function getAllMutiselect() {
  alert("masok sini");
  updateCareerType();
  updateFunction();
  updateDivision();
  updateSubDivision();
  updateDepartment();
  updatePersonalSubareaName();
  updateDirectReport();
  updateCoordinationWith();
  updateOrgUnit();
  updateOrgSection();
  updateSSG("SkillGroupMain", "skill-group");
  updateSSG("SubSkillGroupMain", "sub-skill-group");
  updateSSG("SkillGroupSecond", "skill-group");
  updateSSG("SubSkillGroupSecond", "sub-skill-group");
  updateSSG("SkillGroupThird", "skill-group");
  updateSSG("SubSkillGroupThird", "sub-skill-group");
}
