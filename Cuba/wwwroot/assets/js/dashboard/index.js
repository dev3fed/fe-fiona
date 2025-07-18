// function checkStickyBlockingParents(stickySelector) {
//   const stickyElement = document.querySelector(stickySelector);
//   if (!stickyElement) {
//     console.warn("Sticky element tidak ditemukan.");
//     return;
//   }

//   let parent = stickyElement.parentElement;
//   while (parent) {
//     const overflow = window.getComputedStyle(parent).overflow;
//     const overflowY = window.getComputedStyle(parent).overflowY;
//     const overflowX = window.getComputedStyle(parent).overflowX;

//     if (
//       ["auto", "scroll", "hidden"].includes(overflow) ||
//       ["auto", "scroll", "hidden"].includes(overflowY) ||
//       ["auto", "scroll", "hidden"].includes(overflowX)
//     ) {
//       console.warn("⚠️ Parent ini bisa mencegah sticky:", parent);
//       console.log(
//         "overflow:",
//         overflow,
//         "| overflowY:",
//         overflowY,
//         "| overflowX:",
//         overflowX
//       );
//     }

//     parent = parent.parentElement;
//   }

//   console.info("✅ Pemeriksaan selesai.");
// }
$(document).ready(function () {
  // id pills-icontab, nav-item event click. check who is active
  $("#pills-icontab .nav-item").on("click", function (event) {
    // get id
    const targetId = $(this).find("a").attr("href");
    console.log("targetId", targetId);
    $("#os-header-section").removeClass("d-none");
    if (targetId !== "#pills-so") {
      $("#os-header-section").addClass("d-none");
    }
  });

  const chartOsPositionLevel = document
    .getElementById("chart-os-position-level")
    .getContext("2d");
  const chartOsJobGrade = document
    .getElementById("chart-os-job-grade")
    .getContext("2d");
  const chartOsPersonGrade = document
    .getElementById("chart-os-person-grade")
    .getContext("2d");
  const chartRasciBusPro = document
    .getElementById("chart-rasci-buspro-level")
    .getContext("2d");
  const chartRasciPosition = document
    .getElementById("chart-rasci-position-level")
    .getContext("2d");
  const chartRasciNotationsFormation = document
    .getElementById("chart-rasci-notaions-formation")
    .getContext("2d");
  const chartCompetencySpesific = document
    .getElementById("chart-competency-spesific")
    .getContext("2d");
  const customTicks = [1, 5, 10, 50, 100, 1000, 10000];

  new Chart(chartOsPositionLevel, {
    type: "bar",
    plugins: [ChartDataLabels],
    data: {
      labels: [
        "Direktorat Utama",
        "Direktorat Perencanaan & Pengembangan Bisnis",
        "Direktorat Pemasaran Pusat & Niaga",
        "Direktorat Pemasaran Regional",
        "Direktorat Rekayasa & Infrastruktur Darat",
        "Direktorat Keuangan",
        "Direktorat SDM & Penunjang Bisnis",
        "Direktorat Manajemen Risiko",
      ],
      datasets: [
        {
          label: "VP/EGM/SMOM",
          data: [4, 3, 5, 3, 6, 2, 3, 3],
          backgroundColor: "#9999FC",
          barPercentage: 0.8, // Adjust bar width to create space
          categoryPercentage: 0.8, // Adjust category width to create space
        },
        {
          label:
            "Manager/Region Manager/Area Manager/Sales Area Manager/Setara",
          data: [25, 11, 24, 11, 49, 12, 15, 6],
          backgroundColor: "#7EC67E",
          barPercentage: 0.8,
          categoryPercentage: 0.8,
        },
        {
          label: "Asst. Manager/Sr. Analyst/Setara",
          data: [56, 16, 52, 16, 248, 16, 43, 8],
          backgroundColor: "#7BE5D1",
          barPercentage: 0.8,
          categoryPercentage: 0.8,
        },
        {
          label: "Sr. Supervisor/Analyst/Setara",
          data: [23, 2, 49, 2, 491, 55, 6, 0],
          backgroundColor: "#FDC47E",
          barPercentage: 0.8,
          categoryPercentage: 0.8,
        },
        {
          label: "Supervisor/Jr. Analyst/Setara",
          data: [51, 51, 71, 51, 853, 10, 105, 13],
          backgroundColor: "#76BFFF",
          barPercentage: 0.8,
          categoryPercentage: 0.8,
        },
        {
          label: "Jr. Supervisor/Jr. Assistant/Setara",
          data: [0, 1, 14, 1, 705, 0, 7, 1],
          backgroundColor: "#FFA5C3",
          barPercentage: 0.8,
          categoryPercentage: 0.8,
        },
        {
          label: "Jr. Operator/Jr. Technician/Administrator/Setara",
          data: [0, 0, 0, 0, 651, 0, 0, 7, 1],
          backgroundColor: "#B7B7B7",
          barPercentage: 0.8,
          categoryPercentage: 0.8,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false, // ⬅️ WAJIB agar bisa fleksibel
      plugins: {
        datalabels: {
          color: "#000", // Changed to black
          anchor: "end", // Position at the top of the chart
          align: "top", // Align at the top
          font: {
            weight: "bold",
          },
          formatter: function (value) {
            // pasang format ribuan
            thaousandFormatter = new Intl.NumberFormat("en-US", {
              notation: "compact",
              compactDisplay: "short",
              maximumFractionDigits: 1,
            });
            return thaousandFormatter.format(value);
          },
        },
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          stacked: false, // Disable stacking
          beginAtZero: true,
          title: {
            display: true,
            text: "Business Process Level",
            font: {
              size: 22,
              weight: "400",
            },
            padding: {
              top: 20,
              bottom: 0,
              left: 0,
              right: 0,
            },
            color: "#9F9FA5", // Text color
          },
          ticks: {
            callback: function (value, index, ticks) {
              const label = this.chart.data.labels[index]; // Access label from chart data
              const maxCharsPerLine = 20; // Maximum characters per line
              const words = label.split(" ");
              let lines = [];
              let currentLine = "";

              words.forEach((word) => {
                if ((currentLine + word).length > maxCharsPerLine) {
                  lines.push(currentLine.trim());
                  currentLine = "";
                }
                currentLine += word + " ";
              });

              if (currentLine.trim()) {
                lines.push(currentLine.trim());
              }

              return lines; // Return the lines array directly
            },
          },
        },
        y: {
          stacked: false, // Disable stacking
          type: "logarithmic",
          min: 1,
          max: 1000,
          ticks: {
            formatter: function (value) {
              // pasang format ribuan
              thaousandFormatter = new Intl.NumberFormat("en-US", {
                notation: "compact",
                compactDisplay: "short",
                maximumFractionDigits: 1,
              });
              return thaousandFormatter.format(value);
            },
          },
        },
      },
    },
  });

  const dataJobGradeAllPrl = dataJobGradeAll.map((item) => {
    return item.prl;
  });
  console.log("dataJobGradeAllPrl", dataJobGradeAllPrl);
  const dataJobGradeAllFormation = dataJobGradeAll.map((item) => {
    return item.formasi;
  });
  const areaTypeArray = [
    { id: "All", text: "All (Kantor Pusat & Regional)" },
    { id: "Kantor Pusat", text: "Kantor Pusat" },
    { id: "Regional", text: "Regional" },
  ];
  getDataList([
    {
      dataId: "selectAreaType",
      data: areaTypeArray,
    },
    {
      dataId: "selectDirectorate",
      data: arrayDirectorate.map((item) => ({
        id: item,
        text: item,
      })),
      isMulti: true,
    },
    {
      dataId: "selectRegional",
      data: arrayRegional.map((item) => ({
        id: item,
        text: item,
      })),
      isMulti: true,
    },
    // {
    //   dataId: "selectDraftName",
    //   data: lsListDraft.map((item) => ({
    //     id: item.draftId,
    //     text: item.draftName,
    //   })),
    //   isHide: true,
    // },
  ]);
  new Chart(chartOsJobGrade, {
    type: "funnel",
    data: {
      labels: dataJobGradeAllPrl,
      datasets: [
        {
          data: dataJobGradeAllFormation,
          backgroundColor: "#549DC5",
          shrinkAnchor: "none",
          barPercentage: 0.8, // Adjust bar width to create space
          categoryPercentage: 0.8, // Adjust category width to create space
          datalabels: {
            formatter: (v) => v.toLocaleString(),
            font: {
              size: 14,
            },
          },
        },
      ],
    },
    options: {
      indexAxis: "y",
      layout: {
        padding: {
          // add more space at the bottom for the hierarchy
          left: 30,
        },
      },
      scales: {
        y: {
          display: true,
          padding: 25,
          levelPercentage: 1,
        },
        x: {
          display: false,
        },
      },
    },
    plugins: [ChartDataLabels],
  });

  const dataPersonGradeAllPrl = dataPersonGradeAll.map((item) => {
    return item.prl;
  });
  const dataPersonGradeAllFormation = dataPersonGradeAll.map((item) => {
    return item.formasi;
  });
  // const label = [
  //   "24",
  //   "23",
  //   "22",
  //   "21",
  //   "20",
  //   "19",
  //   "18",
  //   "17",
  //   "16",
  //   "15",
  //   "14",
  //   "13",
  //   "12",
  //   "11",
  //   "10",
  //   "9",
  //   "8",
  // ];

  // const dataSets = [
  //   9, 15, 15, 44, 72, 72, 170, 252, 278, 521, 676, 686, 807, 416, 287, 29, 82,
  // ];

  new Chart(chartOsPersonGrade, {
    type: "funnel",
    data: {
      labels: dataPersonGradeAllPrl,
      datasets: [
        {
          data: dataPersonGradeAllFormation,
          backgroundColor: "#549DC5",
          shrinkAnchor: "none",
          barPercentage: 0.8, // Adjust bar width to create space
          categoryPercentage: 0.8, // Adjust category width to create space
          datalabels: {
            formatter: (v) => v.toLocaleString(),
            font: {
              size: 14,
            },
          },
        },
      ],
    },
    options: {
      indexAxis: "y",
      layout: {
        padding: {
          // add more space at the bottom for the hierarchy
          left: 30,
        },
      },
      scales: {
        y: {
          display: true,
          padding: 25,
          levelPercentage: 1,
        },
        x: {
          display: false,
        },
      },
    },
    plugins: [ChartDataLabels],
  });

  new Chart(chartRasciBusPro, {
    type: "bar",
    plugins: [ChartDataLabels],
    data: {
      labels: [
        "L1 (Category)",
        "L2 (Process Group)",
        "L3 (Process)",
        "L4 (Activity)",
        "L5 (Task)",
        "L6 (Sub Task)",
      ],
      datasets: [
        {
          label: "A (Accountable)",
          data: [13, 144, 1747, 7088, 32711, 66],
          backgroundColor: "#4E9ECA",
        },
        {
          label: "R (Responsible)",
          data: [63, 683, 3273, 20126, 174484, 48723],
          backgroundColor: "#45C6C1",
        },
        {
          label: "S (Support)",
          data: [0, 0, 39, 572, 20, 0],
          backgroundColor: "#8DC2B5",
        },
        {
          label: "C (Consulted)",
          data: [0, 0, 1, 170, 4, 0],
          backgroundColor: "#EF9D91",
        },
        {
          label: "I (Informed)",
          data: [0, 0, 13, 234, 10, 37],
          backgroundColor: "#FFDF6F",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false, // ⬅️ WAJIB agar bisa fleksibel
      plugins: {
        datalabels: {
          color: "#000", // Changed to black
          anchor: "end", // Position at the top of the chart
          align: "top", // Align at the top
          font: {
            weight: "bold",
          },
          formatter: function (value) {
            // pasang format ribuan
            thaousandFormatter = new Intl.NumberFormat("en-US", {
              notation: "compact",
              compactDisplay: "short",
              maximumFractionDigits: 1,
            });
            return thaousandFormatter.format(value);
          },
        },
        legend: {
          labels: {
            font: {
              size: 13,
            },
          },
        },
      },
      scales: {
        x: {
          stacked: false, // Disable stacking
          beginAtZero: true,
          title: {
            display: true,
            text: "Business Process Level",
            font: {
              size: 22,
              weight: "400",
            },
            padding: {
              top: 20,
              bottom: 0,
              left: 0,
              right: 0,
            },

            color: "#9F9FA5", // Text color
          },
        },
        y: {
          stacked: false, // Disable stacking
          type: "logarithmic",
          min: 1,
          max: 300000,
          ticks: {
            formatter: function (value) {
              // pasang format ribuan
              thaousandFormatter = new Intl.NumberFormat("en-US", {
                notation: "compact",
                compactDisplay: "short",
                maximumFractionDigits: 1,
              });
              return thaousandFormatter.format(value);
            },
          },
        },
      },
    },
  });
  new Chart(chartRasciPosition, {
    type: "bar",
    plugins: [ChartDataLabels],
    data: {
      labels: [
        "Director",
        "VP/EGM/SMOM",
        "Manager / Region Manager / Area manager / Sales Area Manager / Setara",
        "Asst. Manager / Sr. Analyst / Setara",
        "Sr. Supervisor / Analyst / Setara",
        "Supervisor/Jr. Analyst/Setara",
        "Jr. Supervisor / Jr. Assistant / Setara",
        "Jr. Operator / Jr. Technician / Administrator / Setara",
      ],
      datasets: [
        {
          label: "A (Accountable)",
          data: [80, 144, 1300, 970, 2800, 1800, 5500, 1800],
          backgroundColor: "#4E9ECA",
        },
        {
          label: "R (Responsible)",
          data: [40, 683, 800, 2000, 4000, 2000, 7000, 800],
          backgroundColor: "#45C6C1",
        },
        {
          label: "S (Support)",
          data: [0, 20, 50, 15, 15, 8, 56, 65],
          backgroundColor: "#8DC2B5",
        },
        {
          label: "C (Consulted)",
          data: [0, 10, 40, 8, 8, 5, 23, 40],
          backgroundColor: "#EF9D91",
        },
        {
          label: "I (Informed)",
          data: [0, 5, 10, 5, 5, 3, 51, 5],
          backgroundColor: "#FFDF6F",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false, // ⬅️ WAJIB agar bisa fleksibel
      plugins: {
        datalabels: {
          color: "#000", // Changed to black
          anchor: "end", // Position at the top of the chart
          align: "top", // Align at the top
          font: {
            weight: "bold",
          },
          formatter: function (value) {
            // pasang format ribuan
            thaousandFormatter = new Intl.NumberFormat("en-US", {
              notation: "compact",
              compactDisplay: "short",
              maximumFractionDigits: 1,
            });
            return thaousandFormatter.format(value);
          },
        },
        legend: {
          labels: {
            font: {
              size: 13,
            },
          },
        },
      },
      scales: {
        x: {
          stacked: false, // Disable stacking
          beginAtZero: true,
          title: {
            display: true,
            text: "Position Level",
            font: {
              size: 22,
              weight: "400",
            },
            padding: {
              top: 20,
              bottom: 0,
              left: 0,
              right: 0,
            },

            color: "#9F9FA5", // Text color
          },
          ticks: {
            callback: function (value, index, ticks) {
              const label = this.chart.data.labels[index]; // Access label from chart data
              const maxCharsPerLine = 20; // Maximum characters per line
              const words = label.split(" ");
              let lines = [];
              let currentLine = "";

              words.forEach((word) => {
                if ((currentLine + word).length > maxCharsPerLine) {
                  lines.push(currentLine.trim());
                  currentLine = "";
                }
                currentLine += word + " ";
              });

              if (currentLine.trim()) {
                lines.push(currentLine.trim());
              }

              return lines; // Return the lines array directly
            },
          },
        },
        y: {
          stacked: false, // Disable stacking
          type: "logarithmic",
          min: 1,
          max: 10000,
          ticks: {
            formatter: function (value) {
              // pasang format ribuan
              thaousandFormatter = new Intl.NumberFormat("en-US", {
                notation: "compact",
                compactDisplay: "short",
                maximumFractionDigits: 1,
              });
              return thaousandFormatter.format(value);
            },
          },
        },
      },
    },
  });
  new Chart(chartRasciNotationsFormation, {
    type: "bar",
    plugins: [ChartDataLabels],
    data: {
      labels: [
        "Direktorat Utama",
        "Direktorat Perencanaan & Pengembangan Bisnis",
        "Direktorat Pemasaran Pusat & Niaga",
        "Direktorat Pemasaran Regional",
        "Direktorat Rekayasa & Infrastruktur Darat",
        "Direktorat Keuangan",
        "Direktorat SDM & Penunjang Bisnis",
        "Direktorat Manajemen Risiko",
      ],
      datasets: [
        {
          label: "Total RASCI Notation",
          data: [5184, 5391, 9225, 73722, 206502, 1330, 5597, 1920],
          backgroundColor: "#3389BA",
        },
        {
          label: "Total Formation",
          data: [157, 81, 216, 1219, 3030, 104, 181, 32],
          backgroundColor: "#56C5F8",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false, // ⬅️ WAJIB agar bisa fleksibel
      plugins: {
        datalabels: {
          color: "#fff",
          anchor: "center",
          align: "center",
          font: {
            weight: "bold",
          },
          formatter: function (value) {
            // pasang format ribuan
            thaousandFormatter = new Intl.NumberFormat("en-US", {
              notation: "compact",
              compactDisplay: "short",
              maximumFractionDigits: 1,
            });
            return thaousandFormatter.format(value);
          },
        },
        legend: {
          labels: {
            font: {
              size: 13,
            },
          },
        },
      },
      scales: {
        x: {
          stacked: false, // Disable stacking
          beginAtZero: true,
          title: {
            display: true,
            text: "Position Level",
            font: {
              size: 22,
              weight: "400",
            },
            padding: {
              top: 20,
              bottom: 0,
              left: 0,
              right: 0,
            },

            color: "#9F9FA5", // Text color
          },
          ticks: {
            callback: function (value, index, ticks) {
              const label = this.chart.data.labels[index]; // Access label from chart data
              const maxCharsPerLine = 20; // Maximum characters per line
              const words = label.split(" ");
              let lines = [];
              let currentLine = "";

              words.forEach((word) => {
                if ((currentLine + word).length > maxCharsPerLine) {
                  lines.push(currentLine.trim());
                  currentLine = "";
                }
                currentLine += word + " ";
              });

              if (currentLine.trim()) {
                lines.push(currentLine.trim());
              }

              return lines; // Return the lines array directly
            },
          },
        },
        y: {
          stacked: false, // Disable stacking
          type: "logarithmic",
          min: 1,
          max: 200000,
          ticks: {
            callback: function (value) {
              thaousandFormatter = new Intl.NumberFormat("en-US", {
                notation: "compact",
                compactDisplay: "short",
                maximumFractionDigits: 1,
              });
              if (customTicks.includes(value)) {
                return thaousandFormatter.format(value);
              } else {
                return "";
              }
            },
          },
        },
      },
    },
  });

  new Chart(chartCompetencySpesific, {
    type: "bar",
    plugins: [ChartDataLabels],
    data: {
      labels: [
        "Domestic Supply Management",
        "Sales and Account Management",
        "Promotion and Campaign Management",
        "Channel Management",
        "Handling Customer Complaint",
        "Pipeline Transport Operations & Maintenance",
        "Distribution Management",
        "Stakeholder Management",
        "Supply Planning & Scheduling",
        "Product/Service Development",
      ],
      datasets: [
        {
          label: "VP/EGM/SMOM",
          data: [0, 19, 3, 5, 2, 3, 4, 1, 2, 3],
          backgroundColor: "#9999FC",
          barPercentage: 0.8,
          categoryPercentage: 0.8,
        },
        {
          label: "Manager/ Region...",
          data: [5, 10, 2, 3, 4, 1, 0, 0, 0, 0],
          backgroundColor: "#7EC67E",
          barPercentage: 0.8,
          categoryPercentage: 0.8,
        },
        {
          label: "Asst. Manager/Sr. Anal...",
          data: [2, 3, 20, 5, 1, 4, 0, 0, 0, 0],
          backgroundColor: "#7BE5D1",
          barPercentage: 0.8,
          categoryPercentage: 0.8,
        },
        {
          label: "Sr. Supervisor/Analyst...",
          data: [3, 10, 13, 15, 22, 30, 0, 0, 0, 0],
          backgroundColor: "#FDC47E",
          barPercentage: 0.8,
          categoryPercentage: 0.8,
        },
        {
          label: "Supervisor/Jr. Analyst...",
          data: [3, 10, 13, 15, 22, 30, 0, 0, 0, 0],
          backgroundColor: "#76BFFF",
          barPercentage: 0.8,
          categoryPercentage: 0.8,
        },
        {
          label: "Jr. Supervisor/Jr...",
          data: [3, 10, 13, 15, 22, 30, 0, 0, 0, 0],
          backgroundColor: "#FFA5C3",
          barPercentage: 0.8,
          categoryPercentage: 0.8,
        },
        {
          label: "Jr. Operator/Jr. Techn...",
          data: [3, 10, 13, 15, 22, 30, 0, 0, 0, 0],
          backgroundColor: "#B7B7B7",
          barPercentage: 0.8,
          categoryPercentage: 0.8,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: "y",
      plugins: {
        datalabels: {
          color: "#fff",
          anchor: "center",
          align: "center",
          font: {
            weight: "bold",
          },
          formatter: function (value) {
            return value;
          },
        },
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          stacked: true,
          beginAtZero: true,
          title: {
            display: true,
            text: "Position Level",
            font: {
              size: 22,
              weight: "400",
            },
            padding: {
              top: 20,
            },
            color: "#9F9FA5",
          },
        },
        y: {
          stacked: true,
          ticks: {
            callback: function (value, index) {
              const label = this.chart.data.labels[index];
              const maxCharsPerLine = 20;
              const words = label.split(" ");
              let lines = [];
              let currentLine = "";

              words.forEach((word) => {
                if ((currentLine + word).length > maxCharsPerLine) {
                  lines.push(currentLine.trim());
                  currentLine = "";
                }
                currentLine += word + " ";
              });

              if (currentLine.trim()) {
                lines.push(currentLine.trim());
              }

              return lines;
            },
          },
        },
      },
    },
  });

  //   check query string if has ?tab=iconhome
  const urlParams = new URLSearchParams(window.location.search);
  const tab = urlParams.get("tab");

  if (tab) {
    setTimeout(() => {
      $("#pills-icontab .nav-link").removeClass("active");
      $(`#pills-${tab}-tab`).addClass("active");
      $("#pills-icontabContent .tab-pane").removeClass("show active");
      $(`#pills-${tab} .nav-link`).addClass("active");
      $(`#pills-${tab}`).addClass("show active");
      $("html, body").animate({ scrollTop: 0 }, "slow");
      if (tab !== "so") {
        $("#os-header-section").addClass("d-none");
      }
    }, 1500);
  }
  $("#selectDirectorateContainer").css("display", "none");
  $("#selectRegionalContainer").css("display", "none");

  $("#selectAreaType").on("change", function (e) {
    const selectedValue = $(this).val();
    if (selectedValue === "All") {
      // add style display none to selectDirectorateContainer
      $("#selectDirectorateContainer").css("display", "none");
      $("#selectRegionalContainer").css("display", "none");
    } else if (selectedValue === "Kantor Pusat") {
      // add style display block to selectDirectorateContainer
      $("#selectDirectorateContainer").css("display", "block");
      $("#selectRegionalContainer").css("display", "none");
    } else if (selectedValue === "Regional") {
      // add style display block to selectRegionalContainer
      $("#selectRegionalContainer").css("display", "block");
      $("#selectDirectorateContainer").css("display", "none");
    }
  });

  $("#selectDirectorate").on("change", function (e) {
    alert("selectDirectorate");
  });
  // select2-selectDirectorate-container
});
