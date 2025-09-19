$(document).ready(async function () {
  // fetch data from API endpoint.js using async promise.
  const apiCalls = [
    { name: "totalFormation", promise: fetchTotalFormation() },
    { name: "totalProject", promise: fetchTotalProject() },
    { name: "totalPositionsByLevel", promise: fetchTotalPositionsByLevel() },
    { name: "totalPositionsByDirectorate", promise: fetchTotalPositionsByDirectorate() },
    { name: "totalOrganizationShapeJobGradeByArea", promise: fetchTotalOrganizationShapeJobGradeByArea() },
    { name: "totalOrganizationShapePersonGradeByArea", promise: fetchTotalOrganizationShapePersonGradeByArea() },
    { name: "totalBusinessProcessValueChain", promise: fetchTotalBusinessProcessValueChain() },
    { name: "totalRasciContentNotations", promise: fetchTotalRasciContentNotations() },
    { name: "totalRasciNotationsByLevelBusinessProcess", promise: fetchRasciNotationsByLevelBusinessProcess() },
    { name: "totalRasciNotationsByJobNameLevel", promise: fetchRasciNotationsByJobNameLevel() },
    { name: "totalRasciNotationsVsFormation", promise: fetchRasciNotationsVsFormation() },
    { name: "totalCompetencies", promise: fetchTotalCompetencies() },
    { name: "top10SpecificCompetencies", promise: fetchTop10SpecificCompetencies() },
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

  // console.log("dataAll", dataAll);

  if (dataAll.totalFormation) {
    $("#total-formation").text(dataAll.totalFormation.data);
  }
  if (dataAll.totalProject) {
    $("#total-project").text(dataAll.totalProject.data);
  }

  if (dataAll.totalBusinessProcessValueChain) {
    $("#total-category").text(
      dataAll.totalBusinessProcessValueChain.data.find((item) => item.levelName === "L1").total || 0
    );
    $("#total-process-group").text(
      dataAll.totalBusinessProcessValueChain.data.find((item) => item.levelName === "L2").total || 0
    );
    $("#total-process").text(
      dataAll.totalBusinessProcessValueChain.data.find((item) => item.levelName === "L3").total || 0
    );
    $("#total-activity").text(
      dataAll.totalBusinessProcessValueChain.data.find((item) => item.levelName === "L4").total || 0
    );
    $("#total-task").text(
      dataAll.totalBusinessProcessValueChain.data.find((item) => item.levelName === "L5").total || 0
    );
    $("#total-sub-task").text(
      dataAll.totalBusinessProcessValueChain.data.find((item) => item.levelName === "L6").total || 0
    );
  }
  if (dataAll.totalRasciContentNotations) {
    $("#total-accountable").text(
      dataAll.totalRasciContentNotations.data.find((item) => item.notation === "A").total || 0
    );
    $("#total-responsible").text(
      dataAll.totalRasciContentNotations.data.find((item) => item.notation === "R").total || 0
    );
    $("#total-support").text(dataAll.totalRasciContentNotations.data.find((item) => item.notation === "S").total || 0);
    $("#total-consulted").text(
      dataAll.totalRasciContentNotations.data.find((item) => item.notation === "C").total || 0
    );
    $("#total-informed").text(dataAll.totalRasciContentNotations.data.find((item) => item.notation === "I").total || 0);
  }

  if (dataAll.totalCompetencies) {
    $("#total-skill-group").text(dataAll.totalCompetencies.data.totalSkillGroup);
    $("#total-sub-skill-group").text(dataAll.totalCompetencies.data.totalSubSkillGroup);
    $("#total-technical-competencies").text(dataAll.totalCompetencies.data.totalCompetencies);
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
<<<<<<< HEAD
  const chartOsJobGrade = document.getElementById("chart-os-job-grade").getContext("2d");
  const chartOsPersonGrade = document.getElementById("chart-os-person-grade").getContext("2d");
=======
>>>>>>> e74399481b1764dd27736a160520eeeee58124dd
  const chartRasciBusPro = document.getElementById("chart-rasci-buspro-level").getContext("2d");
  const chartRasciPosition = document.getElementById("chart-rasci-position-level").getContext("2d");
  const chartRasciNotationsFormation = document.getElementById("chart-rasci-notaions-formation").getContext("2d");
  const chartCompetencySpesific = document.getElementById("chart-competency-spesific").getContext("2d");
  const customTicks = [1, 5, 10, 50, 100, 1000, 10000];

<<<<<<< HEAD
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
          label: "VP/EGM/GHO",
          data: [4, 3, 5, 3, 6, 2, 3, 3],
          backgroundColor: "#9999FC",
          barPercentage: 0.8, // Adjust bar width to create space
          categoryPercentage: 0.8, // Adjust category width to create space
        },
        {
          label: "Manager/Region Manager/Area Manager/Sales Area Manager/Setara",
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
=======
  const dataChart = {
    dataPositionLevelByDirectorate: {},
    dataOsJobGrade: {},
    dataOsPersonGrade: {},
    dataRasciBusProLevel: {},
    dataRasciPositionLevel: {},
    dataRasciNotationsFormation: {},
    dataCompetencySpesific: {},
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
>>>>>>> e74399481b1764dd27736a160520eeeee58124dd
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
<<<<<<< HEAD
      scales: {
        x: {
          stacked: false, // Disable stacking
          beginAtZero: true,
          title: {
            display: true,
            text: "Directorate",
=======
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
>>>>>>> e74399481b1764dd27736a160520eeeee58124dd
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
    // Store data for potential future updates
    dataChart.dataOsPersonGrade.data = dataAll.totalOrganizationShapePersonGradeByArea.data;

    // Create chart using the reusable function
    chartOsPersonGradeInstance = createOrUpdateFunnelChart(
      "chart-os-person-grade",
      dataAll.totalOrganizationShapePersonGradeByArea.data,
      chartOsPersonGradeInstance
    );
  }

  // totalRasciNotationsByLevelBusinessProcess => RASCI Notations by Business Process Level
  if (dataAll.totalRasciNotationsByLevelBusinessProcess) {
    // Create chart data for RASCI Business Process Level
    dataChart.dataRasciBusProLevel.labels = businessProcessLevels;
    dataChart.dataRasciBusProLevel.datasets = [];

    rasciNotations.forEach((notation, idx) => {
      let notationDataArray = [];
      businessProcessLevels.map((level) => {
        const levelKey = level.split(" ")[0]; // Extract L1, L2, etc.
        const found = dataAll.totalRasciNotationsByLevelBusinessProcess.data.find(
          (item) => item.levelName === levelKey
        );
        const total = found.notations.find((n) => n.notation === notation)?.total || 0;
        notationDataArray.push(total);
        // return total;
      });

      const label = `${notation} (${mappingRasciName[notation]})`;
      dataChart.dataRasciBusProLevel.datasets.push({
        label: label,
        data: notationDataArray,
        backgroundColor: colorsRasci[notation],
      });
    });
  }

  // totalRasciNotationsByJobNameLevel => RASCI Notations by Job Name Level
  if (dataAll.totalRasciNotationsByJobNameLevel) {
    console.log("dataAll.totalRasciNotationsByJobNameLevel", dataAll.totalRasciNotationsByJobNameLevel);
    dataChart.dataRasciPositionLevel.labels = dataAll.totalRasciNotationsByJobNameLevel.data.map(
      (item) => item.jobLevelName
    );
    dataChart.dataRasciPositionLevel.datasets = [];
    rasciNotations.forEach((notation, idx) => {
      let notationDataArray = [];
      Object.keys(mappingLevelName).forEach((level, idx) => {
        const levelName = mappingLevelName[level];
        const found = dataAll.totalRasciNotationsByJobNameLevel.data.find((item) => item.jobLevelName === levelName);
        const total = found?.notations.find((n) => n.notation === notation)?.total || 0;
        notationDataArray.push(total);
        // return total;
      });
      console.log("notationDataArray", notationDataArray);
      const label = `${notation} (${mappingRasciName[notation]})`;
      dataChart.dataRasciPositionLevel.datasets.push({
        label: label,
        data: notationDataArray,
        backgroundColor: colorsRasci[notation],
      });
    });

    new Chart(chartRasciBusPro, {
      type: "bar",
      plugins: [ChartDataLabels],
      data: {
        labels: dataChart.dataRasciBusProLevel.labels,
        datasets: dataChart.dataRasciBusProLevel.datasets,
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
<<<<<<< HEAD
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
=======
>>>>>>> e74399481b1764dd27736a160520eeeee58124dd
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
<<<<<<< HEAD
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
        "VP/EGM/GHO",
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
=======
          legend: {
            labels: {
              font: {
                size: 13,
              },
            },
>>>>>>> e74399481b1764dd27736a160520eeeee58124dd
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
        labels: Object.keys(mappingLevelName).map((key) => mappingLevelName[key]),
        datasets: dataChart.dataRasciPositionLevel.datasets,
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
  }

  // totalRasciNotationsVsFormation =>  RASCI Notations vs Formation
  if (dataAll.totalRasciNotationsVsFormation) {
    console.log("dataAll.totalRasciNotationsVsFormation", dataAll.totalRasciNotationsVsFormation);
    dataChart.dataRasciNotationsFormation = dataAll.totalRasciNotationsVsFormation.data;
    dataChart.dataRasciNotationsFormation = { ...dataChart.dataRasciNotationsFormation, labels: [], datasets: [] };
    dataChart.dataRasciNotationsFormation.labels = dataAll.totalRasciNotationsVsFormation.data.map((item) =>
      item.directorateName.includes("Direktorat") ? item.directorateName : `Direktorat ${item.directorateName}`
    );
    dataChart.dataRasciNotationsFormation.totalNotation = dataAll.totalRasciNotationsVsFormation.data.map(
      (item) => item.totalNotation
    );
    dataChart.dataRasciNotationsFormation.totalFormation = dataAll.totalRasciNotationsVsFormation.data.map(
      (item) => item.totalFormation
    );
  }

  new Chart(chartRasciNotationsFormation, {
    type: "bar",
    plugins: [ChartDataLabels],
    data: {
      labels: dataChart.dataRasciNotationsFormation.labels,
      datasets: [
        {
          label: "Total RASCI Notation",
          data: dataChart.dataRasciNotationsFormation.totalNotation,
          backgroundColor: "#3389BA",
        },
        {
          label: "Total Formation",
          data: dataChart.dataRasciNotationsFormation.totalFormation,
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
            text: "Directorate",
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

<<<<<<< HEAD
  const dataCompetencySpecific = [
    {
      label: "Domestic Supply Management",
      "VP/EGM/GHO": 0,
      "Manager/Region Manager/Area Manager/Sales Area Manager/Setara": 19,
      "Asst. Manager/Sr. Analyst/Setara": 3,
      "Sr. Supervisor/Analyst/Setara": 5,
      "Supervisor/Jr. Analyst/Setara": 2,
      "Jr. Supervisor/Jr. Assistant/Setara": 3,
      "Jr. Operator/Jr. Technician/Administrator/Setara": 4,
      total: 36,
    },
    {
      label: "Sales and Account Management",
      "VP/EGM/GHO": 5,
      "Manager/Region Manager/Area Manager/Sales Area Manager/Setara": 10,
      "Asst. Manager/Sr. Analyst/Setara": 2,
      "Sr. Supervisor/Analyst/Setara": 3,
      "Supervisor/Jr. Analyst/Setara": 4,
      "Jr. Supervisor/Jr. Assistant/Setara": 1,
      "Jr. Operator/Jr. Technician/Administrator/Setara": 0,
      total: 25,
    },
    {
      label: "Promotion and Campaign Management",
      "VP/EGM/GHO": 3,
      "Manager/Region Manager/Area Manager/Sales Area Manager/Setara": 2,
      "Asst. Manager/Sr. Analyst/Setara": 20,
      "Sr. Supervisor/Analyst/Setara": 5,
      "Supervisor/Jr. Analyst/Setara": 1,
      "Jr. Supervisor/Jr. Assistant/Setara": 4,
      "Jr. Operator/Jr. Technician/Administrator/Setara": 0,
      total: 35,
    },
    {
      label: "Channel Management",
      "VP/EGM/GHO": 5,
      "Manager/Region Manager/Area Manager/Sales Area Manager/Setara": 3,
      "Asst. Manager/Sr. Analyst/Setara": 5,
      "Sr. Supervisor/Analyst/Setara": 15,
      "Supervisor/Jr. Analyst/Setara": 22,
      "Jr. Supervisor/Jr. Assistant/Setara": 30,
      "Jr. Operator/Jr. Technician/Administrator/Setara": 0,
      total: 80,
    },
    {
      label: "Handling Customer Complaint",
      "VP/EGM/GHO": 2,
      "Manager/Region Manager/Area Manager/Sales Area Manager/Setara": 4,
      "Asst. Manager/Sr. Analyst/Setara": 1,
      "Sr. Supervisor/Analyst/Setara": 22,
      "Supervisor/Jr. Analyst/Setara": 30,
      "Jr. Supervisor/Jr. Assistant/Setara": 15,
      "Jr. Operator/Jr. Technician/Administrator/Setara": 8,
      total: 82,
    },
    {
      label: "Pipeline Transport Operations & Maintenance",
      "VP/EGM/GHO": 3,
      "Manager/Region Manager/Area Manager/Sales Area Manager/Setara": 1,
      "Asst. Manager/Sr. Analyst/Setara": 4,
      "Sr. Supervisor/Analyst/Setara": 30,
      "Supervisor/Jr. Analyst/Setara": 45,
      "Jr. Supervisor/Jr. Assistant/Setara": 25,
      "Jr. Operator/Jr. Technician/Administrator/Setara": 12,
      total: 120,
    },
    {
      label: "Distribution Management",
      "VP/EGM/GHO": 4,
      "Manager/Region Manager/Area Manager/Sales Area Manager/Setara": 0,
      "Asst. Manager/Sr. Analyst/Setara": 0,
      "Sr. Supervisor/Analyst/Setara": 0,
      "Supervisor/Jr. Analyst/Setara": 0,
      "Jr. Supervisor/Jr. Assistant/Setara": 0,
      "Jr. Operator/Jr. Technician/Administrator/Setara": 0,
      total: 4,
    },
    {
      label: "Stakeholder Management",
      "VP/EGM/GHO": 1,
      "Manager/Region Manager/Area Manager/Sales Area Manager/Setara": 0,
      "Asst. Manager/Sr. Analyst/Setara": 0,
      "Sr. Supervisor/Analyst/Setara": 0,
      "Supervisor/Jr. Analyst/Setara": 0,
      "Jr. Supervisor/Jr. Assistant/Setara": 0,
      "Jr. Operator/Jr. Technician/Administrator/Setara": 0,
      total: 1,
    },
    {
      label: "Supply Planning & Scheduling",
      "VP/EGM/GHO": 2,
      "Manager/Region Manager/Area Manager/Sales Area Manager/Setara": 0,
      "Asst. Manager/Sr. Analyst/Setara": 0,
      "Sr. Supervisor/Analyst/Setara": 0,
      "Supervisor/Jr. Analyst/Setara": 0,
      "Jr. Supervisor/Jr. Assistant/Setara": 0,
      "Jr. Operator/Jr. Technician/Administrator/Setara": 0,
      total: 2,
    },
    {
      label: "Product/Service Development",
      "VP/EGM/GHO": 3,
      "Manager/Region Manager/Area Manager/Sales Area Manager/Setara": 0,
      "Asst. Manager/Sr. Analyst/Setara": 0,
      "Sr. Supervisor/Analyst/Setara": 0,
      "Supervisor/Jr. Analyst/Setara": 0,
      "Jr. Supervisor/Jr. Assistant/Setara": 0,
      "Jr. Operator/Jr. Technician/Administrator/Setara": 0,
      total: 3,
    },
  ];

  // Sort dataCompetencySpecific by total (descending order)
  const sortedCompetencyData = [...dataCompetencySpecific].sort((a, b) => b.total - a.total);

  // Extract sorted labels and data for each position level
  const sortedLabels = sortedCompetencyData.map((item) => item.label);
  const vpData = sortedCompetencyData.map((item) => item["VP/EGM/GHO"]);
  const managerData = sortedCompetencyData.map(
    (item) => item["Manager/Region Manager/Area Manager/Sales Area Manager/Setara"]
  );
  const asstManagerData = sortedCompetencyData.map((item) => item["Asst. Manager/Sr. Analyst/Setara"]);
  const srSupervisorData = sortedCompetencyData.map((item) => item["Sr. Supervisor/Analyst/Setara"]);
  const supervisorData = sortedCompetencyData.map((item) => item["Supervisor/Jr. Analyst/Setara"]);
  const jrSupervisorData = sortedCompetencyData.map((item) => item["Jr. Supervisor/Jr. Assistant/Setara"]);
  const jrOperatorData = sortedCompetencyData.map((item) => item["Jr. Operator/Jr. Technician/Administrator/Setara"]);

  new Chart(chartCompetencySpesific, {
    type: "bar",
    plugins: [ChartDataLabels],
    data: {
      labels: sortedLabels,
      datasets: [
        {
          label: "VP/EGM/GHO",
          data: vpData,
          backgroundColor: "#9999FC",
          barPercentage: 0.8,
          categoryPercentage: 0.8,
        },
        {
          label: "Manager/ Region...",
          data: managerData,
          backgroundColor: "#7EC67E",
          barPercentage: 0.8,
          categoryPercentage: 0.8,
        },
        {
          label: "Asst. Manager/Sr. Anal...",
          data: asstManagerData,
          backgroundColor: "#7BE5D1",
          barPercentage: 0.8,
          categoryPercentage: 0.8,
        },
        {
          label: "Sr. Supervisor/Analyst...",
          data: srSupervisorData,
          backgroundColor: "#FDC47E",
          barPercentage: 0.8,
          categoryPercentage: 0.8,
        },
        {
          label: "Supervisor/Jr. Analyst...",
          data: supervisorData,
          backgroundColor: "#76BFFF",
          barPercentage: 0.8,
          categoryPercentage: 0.8,
        },
        {
          label: "Jr. Supervisor/Jr...",
          data: jrSupervisorData,
          backgroundColor: "#FFA5C3",
          barPercentage: 0.8,
          categoryPercentage: 0.8,
        },
        {
          label: "Jr. Operator/Jr. Techn...",
          data: jrOperatorData,
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
            text: "Position Total",
=======
  if (dataAll.top10SpecificCompetencies) {
    dataChart.dataCompetencySpesific.data = dataAll.top10SpecificCompetencies.data;
    // unique label only
    dataChart.dataCompetencySpesific.label = dataAll.top10SpecificCompetencies.data
      .map((item) => item.competencyName)
      .filter((value, index, self) => self.indexOf(value) === index);

    dataChart.dataCompetencySpesific.datasets = [];
    Object.keys(mappingLevelName).forEach((level, idx) => {
      if (idx === 0) return true;
      let countPositionsArray = [];
      dataChart.dataCompetencySpesific.data.forEach((item) => {
        const findObject = item.competencies.find((obj) => obj.jobLevelName === mappingLevelName[level]);
        let totalPositions = 0;
        if (findObject) {
          totalPositions = findObject.total;
        }
        countPositionsArray.push(totalPositions);
      });
      dataChart.dataCompetencySpesific.datasets.push({
        label: mappingLevelName[level],
        data: countPositionsArray,
        backgroundColor: COLOR[idx] || "#9999FC",
        barPercentage: BAR_PERCENTAGE, // Adjust bar width to create space
        categoryPercentage: CATEGORY_PERCENTAGE, // Adjust category width to create space
      });
    });
    new Chart(chartCompetencySpesific, {
      type: "bar",
      plugins: [ChartDataLabels],
      data: {
        labels: dataChart.dataCompetencySpesific.label,
        datasets: dataChart.dataCompetencySpesific.datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: "y",
        plugins: {
          datalabels: {
            color: "black",
            anchor: "center",
            align: "center",
>>>>>>> e74399481b1764dd27736a160520eeeee58124dd
            font: {
              weight: "bold",
            },
            formatter: function (value) {
              if (value === 0) {
                return "";
              }
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
                return label;
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
  }

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
            return item.replace("Direktorat ", "");
          }
        });
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
