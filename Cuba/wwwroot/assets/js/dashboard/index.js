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
$(document).ready(async function () {
  // fetch data from API endpoint.js using async promise.
  const apiCalls = [
    { name: "totalFormation", promise: fetchTotalFormation() },
    { name: "totalProject", promise: fetchTotalProject() },
    { name: "totalPositionsByLevel", promise: fetchTotalPositionsByLevel() },
    { name: "totalPositionsByDirectorate", promise: fetchTotalPositionsByDirectorate() },
    { name: "totalOrganizationShapeJobGradeByArea", promise: fetchTotalOrganizationShapeJobGradeByArea() },
    { name: "totalOrganizationShapePersonGradeByArea", promise: fetchTotalOrganizationShapePersonGradeByArea() },
  ];

  const dataAllResults = await Promise.allSettled(apiCalls.map((call) => call.promise));

  // Extract successful results and handle failures gracefully with descriptive names
  const dataAll = {};
  dataAllResults.forEach((result, index) => {
    const apiName = apiCalls[index].name;
    if (result.status === "fulfilled") {
      dataAll[apiName] = result.value;
    } else {
      dataAll[apiName] = null; // or provide default data
    }
  });

  if (dataAll.totalFormation) {
    $("#total-formation").text(dataAll.totalFormation.data);
  }
  if (dataAll.totalProject) {
    $("#total-project").text(dataAll.totalProject.data);
  }

  if (dataAll.totalPositionsByLevel) {
    dataAll.totalPositionsByLevel.data.forEach((item) => {
      const findKey = Object.keys(mappingLevelName).find((key) => mappingLevelName[key] === item.jobLevelName);
      $(`#count-${findKey}`).text(item.totalPositions);
    });
  }

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

  const chartOsPositionLevel = document.getElementById("chart-os-position-level").getContext("2d");
  const chartOsJobGrade = document.getElementById("chart-os-job-grade").getContext("2d");
  const chartOsPersonGrade = document.getElementById("chart-os-person-grade").getContext("2d");
  const chartRasciBusPro = document.getElementById("chart-rasci-buspro-level").getContext("2d");
  const chartRasciPosition = document.getElementById("chart-rasci-position-level").getContext("2d");
  const chartRasciNotationsFormation = document.getElementById("chart-rasci-notaions-formation").getContext("2d");
  const chartCompetencySpesific = document.getElementById("chart-competency-spesific").getContext("2d");
  const customTicks = [1, 5, 10, 50, 100, 1000, 10000];

  const dataChart = {
    dataPositionLevelByDirectorate: {},
    dataOsJobGrade: {},
    dataOsPersonGrade: {},
  };

  // Global chart instances
  let chartOsJobGradeInstance = null;
  let chartOsPersonGradeInstance = null;

  // Function to create or update funnel chart
  function createOrUpdateFunnelChart(chartId, data, chartInstance) {
    const labels = data.map((item) => item.PrlOrg || item.PrlPlan);
    const datasets = data.map((item) => item.TotalPositions);

    // Calculate dynamic height based on data length (minimum 400px, 50px per item)
    const dynamicHeight = Math.max(400, data.length * 18);
    console.log(`${data.length} data.length:`, data.length);
    console.log(`${chartId} dynamic height:`, dynamicHeight);

    // Get canvas element
    const canvas = document.getElementById(chartId);

    // If chart instance exists, destroy it first
    if (chartInstance) {
      chartInstance.destroy();
    }

    // Reset canvas attributes to avoid scaling issues
    canvas.removeAttribute("width");
    canvas.removeAttribute("height");
    canvas.removeAttribute("style");

    // Set only the container height via CSS, let Chart.js handle canvas dimensions
    canvas.style.height = dynamicHeight + "px";
    canvas.style.width = "100%";

    console.log(`${chartId} labels:`, labels);
    console.log(`${chartId} dynamic height:`, dynamicHeight);

    // Get context after potential destroy and reset
    const ctx = canvas.getContext("2d");

    // Create new chart
    const newChart = new Chart(ctx, {
      type: "funnel",
      data: {
        labels: labels,
        datasets: [
          {
            data: datasets,
            backgroundColor: "#549DC5",
            shrinkAnchor: "none",
            barPercentage: 0.8,
            categoryPercentage: 0.8,
            datalabels: {
              formatter: (v) => v.toLocaleString(),
              font: {
                size: 16,
                weight: "600",
              },
              color: "black",
            },
          },
        ],
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        indexAxis: "y",
        layout: {},
        scales: {
          y: {
            display: true,
            padding: 15,
            levelPercentage: 1,
          },
          x: {
            display: false,
          },
        },
      },
      plugins: [ChartDataLabels],
    });

    return newChart;
  }

  if (dataAll.totalPositionsByDirectorate) {
    dataChart.dataPositionLevelByDirectorate.label = dataAll.totalPositionsByDirectorate.data
      .map((item) =>
        item.directorateName.includes("Direktorat") ? item.directorateName : `Direktorat ${item.directorateName}`
      )
      .filter((value, index, self) => self.indexOf(value) === index); // unique value

    // looping object mappingLevelName keys
    dataChart.dataPositionLevelByDirectorate.datasets = [];
    Object.keys(mappingLevelName).forEach((level, idx) => {
      const filterObject = dataAll.totalPositionsByDirectorate.data.filter(
        (item) => item.jobLevelName === mappingLevelName[level]
      );
      dataChart.dataPositionLevelByDirectorate.datasets.push({
        label: mappingLevelName[level],
        data: filterObject.map((item) => item.totalPositions),
        backgroundColor: COLOR[idx] || "#9999FC",
        barPercentage: BAR_PERCENTAGE, // Adjust bar width to create space
        categoryPercentage: CATEGORY_PERCENTAGE, // Adjust category width to create space
      });
      // console.log("idx", idx);
      // console.log("filterObject", filterObject);
    });

    new Chart(chartOsPositionLevel, {
      type: "bar",
      plugins: [ChartDataLabels],
      data: {
        labels: dataChart.dataPositionLevelByDirectorate.label,
        // datasets: [
        //   {
        //     label: "VP/EGM/SMOM",
        //     data: [4, 3, 5, 3, 6, 2, 3, 3],
        //     backgroundColor: "#9999FC",
        //     barPercentage: 0.8, // Adjust bar width to create space
        //     categoryPercentage: 0.8, // Adjust category width to create space
        //   },
        //   {
        //     label: "Manager/Region Manager/Area Manager/Sales Area Manager/Setara",
        //     data: [25, 11, 24, 11, 49, 12, 15, 6],
        //     backgroundColor: "#7EC67E",
        //     barPercentage: 0.8,
        //     categoryPercentage: 0.8,
        //   },
        //   {
        //     label: "Asst. Manager/Sr. Analyst/Setara",
        //     data: [56, 16, 52, 16, 248, 16, 43, 8],
        //     backgroundColor: "#7BE5D1",
        //     barPercentage: 0.8,
        //     categoryPercentage: 0.8,
        //   },
        //   {
        //     label: "Sr. Supervisor/Analyst/Setara",
        //     data: [23, 2, 49, 2, 491, 55, 6, 0],
        //     backgroundColor: "#FDC47E",
        //     barPercentage: 0.8,
        //     categoryPercentage: 0.8,
        //   },
        //   {
        //     label: "Supervisor/Jr. Analyst/Setara",
        //     data: [51, 51, 71, 51, 853, 10, 105, 13],
        //     backgroundColor: "#76BFFF",
        //     barPercentage: 0.8,
        //     categoryPercentage: 0.8,
        //   },
        //   {
        //     label: "Jr. Supervisor/Jr. Assistant/Setara",
        //     data: [0, 1, 14, 1, 705, 0, 7, 1],
        //     backgroundColor: "#FFA5C3",
        //     barPercentage: 0.8,
        //     categoryPercentage: 0.8,
        //   },
        //   {
        //     label: "Jr. Operator/Jr. Technician/Administrator/Setara",
        //     data: [0, 0, 0, 0, 651, 0, 0, 7, 1],
        //     backgroundColor: "#B7B7B7",
        //     barPercentage: 0.8,
        //     categoryPercentage: 0.8,
        //   },
        // ],
        datasets: dataChart.dataPositionLevelByDirectorate.datasets,
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
            min: 0,
            max: 1000,
            ticks: {
              callback: function (value) {
                const thaousandFormatter = new Intl.NumberFormat("en-US", {
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
  }

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
  ]);

  if (dataAll.totalOrganizationShapeJobGradeByArea) {
    console.log("dataAll.totalOrganizationShapeJobGradeByArea", dataAll.totalOrganizationShapeJobGradeByArea.data);

    // Store data for potential future updates
    dataChart.dataOsJobGrade.data = dataAll.totalOrganizationShapeJobGradeByArea.data;

    // Create chart using the reusable function
    chartOsJobGradeInstance = createOrUpdateFunnelChart(
      "chart-os-job-grade",
      dataAll.totalOrganizationShapeJobGradeByArea.data,
      chartOsJobGradeInstance
    );
  }

  if (dataAll.totalOrganizationShapePersonGradeByArea) {
    console.log(
      "dataAll.totalOrganizationShapePersonGradeByArea",
      dataAll.totalOrganizationShapePersonGradeByArea.data
    );

    // Store data for potential future updates
    dataChart.dataOsPersonGrade.data = dataAll.totalOrganizationShapePersonGradeByArea.data;

    // Create chart using the reusable function
    chartOsPersonGradeInstance = createOrUpdateFunnelChart(
      "chart-os-person-grade",
      dataAll.totalOrganizationShapePersonGradeByArea.data,
      chartOsPersonGradeInstance
    );
  }

  new Chart(chartRasciBusPro, {
    type: "bar",
    plugins: [ChartDataLabels],
    data: {
      labels: ["L1 (Category)", "L2 (Process Group)", "L3 (Process)", "L4 (Activity)", "L5 (Task)", "L6 (Sub Task)"],
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

  function filterCharts(type) {
    const selectedAreaType = $("#selectAreaType").val();
    const selectedDirectorates = $("#selectDirectorate").val();
    const selectedRegionals = $("#selectRegional").val();

    let params = {};
    if (selectedAreaType && selectedAreaType !== "All") {
      params.areaType = selectedAreaType;
    }

    if (type === "areaType") {
      // reset selectDirectorate and selectRegional without triggering change events
      $("#selectDirectorate").val(null);
      $("#selectRegional").val(null);
    } else {
      if (params.areaType === "Kantor Pusat" && selectedDirectorates && selectedDirectorates.length > 0) {
        // selain Direktur Utama, Direktur didalam sting di takeout
        const processedDirectorates = selectedDirectorates.map((item) => {
          if (item === "Direktorat Utama") {
            return item;
          } else {
            console.log("item masuk", item);
            return item.replace("Direktorat ", "");
          }
        });
        console.log("selectedDirectorates after map", processedDirectorates);
        params.directorate = processedDirectorates[0];
      }
      if (params.areaType === "Regional" && selectedRegionals && selectedRegionals.length > 0) {
        const processedRegionals = selectedRegionals.map((item) => {
          return item.replace("Regional ", "");
        });
        params.regional = processedRegionals[0];
      }
    }
    const apiCallsUpdated = [
      { name: "totalOrganizationShapeJobGradeByArea", promise: fetchTotalOrganizationShapeJobGradeByArea(params) },
      {
        name: "totalOrganizationShapePersonGradeByArea",
        promise: fetchTotalOrganizationShapePersonGradeByArea(params),
      },
    ];
    console.log("apiCallsUpdated", apiCallsUpdated);

    // Execute the API calls and update charts
    Promise.allSettled(apiCallsUpdated.map((call) => call.promise))
      .then((results) => {
        results.forEach((result, index) => {
          const apiName = apiCallsUpdated[index].name;
          if (result.status === "fulfilled") {
            if (apiName === "totalOrganizationShapeJobGradeByArea" && result.value.data) {
              // Update Job Grade chart
              dataChart.dataOsJobGrade.data = result.value.data;
              chartOsJobGradeInstance = createOrUpdateFunnelChart(
                "chart-os-job-grade",
                result.value.data,
                chartOsJobGradeInstance
              );
            } else if (apiName === "totalOrganizationShapePersonGradeByArea" && result.value.data) {
              // Update Person Grade chart
              dataChart.dataOsPersonGrade.data = result.value.data;
              chartOsPersonGradeInstance = createOrUpdateFunnelChart(
                "chart-os-person-grade",
                result.value.data,
                chartOsPersonGradeInstance
              );
            }
          } else {
            console.error(`API call ${apiName} failed:`, result.reason);
          }
        });
      })
      .catch((error) => {
        console.error("Error updating charts:", error);
      });
  }

  $("#selectDirectorateContainer").hide();
  $("#selectRegionalContainer").hide();

  $("#selectAreaType").on("change", function (e) {
    const selectedValue = $(this).val();
    if (selectedValue === "All") {
      $("#selectDirectorateContainer").hide();
      $("#selectRegionalContainer").hide();
    } else if (selectedValue === "Kantor Pusat") {
      $("#selectDirectorateContainer").show();
      $("#selectRegionalContainer").hide();
    } else if (selectedValue === "Regional") {
      $("#selectRegionalContainer").show();
      $("#selectDirectorateContainer").hide();
    }
    filterCharts("areaType");
  });

  // selectDirectorate or selectRegional on change, call filterCharts
  $("#selectRegional").on("change", function (e) {
    filterCharts("regional");
  });
  $("#selectDirectorate").on("change", function (e) {
    filterCharts("directorate");
  });
  // select2-selectDirectorate-container
});
