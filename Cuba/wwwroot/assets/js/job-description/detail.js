$(document).ready(async function () {
  // check query url

  checkLocalStorage();
  let activeTab = "identifikasi";
  if (activeTab) {
    const linkTab = "#v-pills-" + activeTab + "-tab";
    $(linkTab).tab("show");
  }

  const urlParams = new URLSearchParams(window.location.search);
  const idPos = urlParams.get("id");
  const isCrete = urlParams.get("create");
  if (idPos) {
    if (isCrete) {
      // $("#addJobReference").show();
      $("#selectJobReference").attr("disabled", false);
      // remove created CSS clas as follow to tugas Ha table
      removeJobDescViewCss();
      const findData = dataJobDesc.find((item) => item.identifikasi.id_position == idPos);
      $("#selectJobReference").val(findData.identifikasi.id_position);
      getJobReference(findData);
    } else {
      const findData = await dataJobDescCompare.find((item) => item.identifikasi.id_position == idPos);
      $("#selectJobReference").append(
        `<option value="${findData.identifikasi.id_position}">${findData.identifikasi.jobName}</option>`
      );
      $("#selectJobReference").val(findData.identifikasi.id_position);
      // disable selectJobReference
      $("#selectJobReference").attr("disabled", true);
      // $("#addJobReference").hide();
      // add created CSS clas as follow to tugas Ha table

      injectViewModeCss();

      let dataFungsi = [{ fungsi: findData.fungsi }];
      let tugasHa = findData.tugasHa;
      let koordinasi = findData.koordinasi;
      let relation = findData.relation;
      localStorage.setItem("fungsi", JSON.stringify(dataFungsi));
      localStorage.setItem("tugasHa", JSON.stringify(tugasHa));
      localStorage.setItem("koordinasi", JSON.stringify(koordinasi));
      localStorage.setItem("relation", JSON.stringify(relation));

      getJobReference(findData);
      await getJobReferenceDetail();
    }
  }

  $(".summernote").summernote({
    height: 300,
    tabsize: 2,
    // disable font type button
    toolbar: [
      // [groupName, [list of button]]
      ["style", ["bold", "italic", "underline", "clear"]],
      ["font", ["strikethrough", "superscript", "subscript"]],
      ["para", ["ul", "ol", "paragraph"]],
    ],
  });
  $(".summernote").summernote("disable");

  $("#rangePercentage").ionRangeSlider({
    grid: true,
    grid_num: 5,
    min: 50,
    max: 100,
    step: 10,
  });

  // getJobReference(dataJobDesc);
  // await applySelectedData();
  // await getJobReferenceDetail();

  // multiSelect({ selectID: "JobReference", type: "jobposition" });

  // on change selectJobReference
  $("#selectJobReference").on("change", function (e) {
    const data = e.target.value;
    console.log("data", data);
    const findData = dataJobDesc.find((item) => item.identifikasi.id_position == data);
    getJobReference(findData);
    isDisableButton(false);
    $(".summernote").summernote("enable");
  });

  $("#saveReference").on("click", async function () {
    await getJobReferenceDetail();
    // hide modal
    $("#modalJobCompare").modal("hide");
  });

  $("#saveDraft").on("click", async function () {
    swal({
      title: "Are you sure?",
      text: "You will save this job description as draft",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willSave) => {
      if (willSave) {
        // redirectTo("job-description");
        const url = "/job-description/index";
        window.location.href = url;
        localStorage.setItem("statusManager", "on progress");
      }
    });
  });

  // searchReferenceBy radio button
  $("input[name='searchReferenceBy']").on("change", function () {
    const value = $(this).val();
    $("#percentageDiv").hide();
    $("#searchDiv").show();

    if (value == "searchByPercentage") {
      $("#percentageDiv").show();
      $("#searchDiv").hide();
    }
  });

  // dataListJobDescription[0].jobStatus = localStorage.getItem("statusManager");
  // dataListJobDescription[1].jobStatus = localStorage.getItem("statusSbm");
});

const viewCss = css`
  table#tugasHaTable td:nth-child(5),
  table#tugasHaTable th:nth-child(5) {
    display: none;
  }

  table#koordinasiTable td:nth-child(4),
  table#koordinasiTable th:nth-child(4) {
    display: none;
  }

  table#relationTable td:nth-child(4),
  table#relationTable th:nth-child(4) {
    display: none;
  }

  #addJobReference {
    display: none;
  }

  #addJobKoordinasi {
    display: none;
  }

  #editDataKoordinasi {
    display: none;
  }

  #addJobRelasi {
    display: none;
  }

  #editDataRelasi {
    display: none;
  }

  #addJobPersyaratan {
    display: none;
  }

  #editDataPersyaratan {
    display: none;
  }

  #addJobKhusus {
    display: none;
  }

  #editDataKhusus {
    display: none;
  }

  #addJobKompetensi {
    display: none;
  }

  #editDataKompetensi {
    display: none;
  }
`;

function removeJobDescViewCss() {
  const style = document.getElementById("jobDescViewCss");
  if (style) {
    style.remove();
  }
}

function injectViewModeCss() {
  let style = document.getElementById("jobDescViewCss");
  if (style) {
    return;
  }
  style = document.createElement("style");
  style.id = "jobDescViewCss";
  style.innerHTML = viewCss;
  document.head.appendChild(style);
}

function css(strings, ...values) {
  let str = "";
  strings.forEach((string, i) => {
    str += string + (values[i] || "");
  });
  return str;
}
