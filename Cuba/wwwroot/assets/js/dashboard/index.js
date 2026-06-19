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
    {
      name: "averageRasciNotationsByJobNameLevelAndProcessLevel",
      promise: fetchAverageRasciNotationsByJobNameLevelAndProcessLevel(),
    },
    { name: "totalRasciNotationsVsFormation", promise: fetchRasciNotationsVsFormation() },
    { name: "totalCompetencies", promise: fetchTotalCompetencies() },
    { name: "top10SpecificCompetencies", promise: fetchTop10SpecificCompetencies() },
    { name: "averageCompetencyByJobLevel", promise: fetchAverageCompetencyByJobLevel() },
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
      dataAll.totalBusinessProcessValueChain.data.find((item) => item.levelName === "L1").total || 0,
    );
    $("#total-process-group").text(
      dataAll.totalBusinessProcessValueChain.data.find((item) => item.levelName === "L2").total || 0,
    );
    $("#total-process").text(
      dataAll.totalBusinessProcessValueChain.data.find((item) => item.levelName === "L3").total || 0,
    );
    $("#total-activity").text(
      dataAll.totalBusinessProcessValueChain.data.find((item) => item.levelName === "L4").total || 0,
    );
    $("#total-task").text(
      dataAll.totalBusinessProcessValueChain.data.find((item) => item.levelName === "L5").total || 0,
    );
    $("#total-sub-task").text(
      dataAll.totalBusinessProcessValueChain.data.find((item) => item.levelName === "L6").total || 0,
    );
  }
  if (dataAll.totalRasciContentNotations) {
    $("#total-accountable").text(
      dataAll.totalRasciContentNotations.data.find((item) => item.notation === "A").total || 0,
    );
    $("#total-responsible").text(
      dataAll.totalRasciContentNotations.data.find((item) => item.notation === "R").total || 0,
    );
    $("#total-support").text(dataAll.totalRasciContentNotations.data.find((item) => item.notation === "S").total || 0);
    $("#total-consulted").text(
      dataAll.totalRasciContentNotations.data.find((item) => item.notation === "C").total || 0,
    );
    $("#total-informed").text(dataAll.totalRasciContentNotations.data.find((item) => item.notation === "I").total || 0);
  }

  if (dataAll.totalCompetencies) {
    $("#total-skill-group").text(dataAll.totalCompetencies.data.totalSkillGroup);
    $("#total-sub-skill-group").text(dataAll.totalCompetencies.data.totalSubSkillGroup);
    $("#total-technical-competencies").text(dataAll.totalCompetencies.data.totalCompetencies);
  }

  if (dataAll.averageCompetencyByJobLevel) {
    dataAll.averageCompetencyByJobLevel.data.forEach((item) => {
      const findKey = Object.keys(mappingLevelName).find((key) => mappingLevelName[key] === item.jobLevelName);
      console.log("findKey", findKey, item.jobLevelName);
      $(`#average-competency-${findKey}`).text(item.averageCompetency);
    });
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

  // business-process-value-chain
  $("#business-process-value-chain").on("click", function () {
    // open new page with url /Rasci/Index
    window.open("/Rasci/Index", "_blank");
  });

  const chartOsPositionLevel = document.getElementById("chart-os-position-level").getContext("2d");
  const chartRasciBusPro = document.getElementById("chart-rasci-buspro-level").getContext("2d");
  const chartRasciPosition = document.getElementById("chart-rasci-position-level").getContext("2d");
  const chartRasciNotationsFormation = document.getElementById("chart-rasci-notaions-formation").getContext("2d");
  const chartCompetencySpesific = document.getElementById("chart-competency-spesific").getContext("2d");
  const chartCompetencyByPositionLevelAverage = document
    .getElementById("chart-competency-by-position-level-average")
    .getContext("2d");
  const customTicks = [1, 5, 10, 50, 100, 1000, 10000];

  const dataChart = {
    dataPositionLevelByDirectorate: {},
    dataOsJobGrade: {},
    dataOsPersonGrade: {},
    dataRasciBusProLevel: {},
    dataRasciPositionLevel: {},
    dataRasciNotationsFormation: {},
    dataCompetencySpesific: {},
    dataCompetencyByPositionLevelAverage: {},
  };

  // Global chart instances
  let chartOsJobGradeInstance = null;
  let chartOsPersonGradeInstance = null;

  function showModalOrgShape(label, value, chartType) {
    loader(true);
    // wait for 1 second to show loader
    setTimeout(() => {
      loader(false);
    }, 1000);

    const formattedValue = value.toLocaleString();
    $("#label-job-grade-formation").text(` Job Grade : ${label} | Formation Total : ${formattedValue}`);
    $("#ModalOrgShape .modal-body .table-responsive").html(
      `<table class="tableMasterData table table-hover w-100">
        <thead>
          <tr>
            <th>No</th>
            <th>Organization Unit Name</th>
            <th>Position</th>
            <th>Formation</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>${label}</td>
            <td>${formattedValue}</td>
            <td>${formattedValue}</td>
          </tr>
        </tbody>
      </table>`,
    );
    $("#ModalOrgShape").modal("show");
  }

  // Function to create or update funnel chart
  function createOrUpdateFunnelChart(chartId, data, chartInstance, chartType) {
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
          },
        ],
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        indexAxis: "y",
        layout: {},
        onClick: function (event, elements) {
          if (elements.length > 0) {
            const index = elements[0].index;
            const label = labels[index];
            const value = datasets[index];
            showModalOrgShape(label, value, chartType);
          }
        },
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
        item.directorateName.includes("Direktorat") ? item.directorateName : `Direktorat ${item.directorateName}`,
      )
      .filter((value, index, self) => self.indexOf(value) === index); // unique value
    dataChart.dataPositionLevelByDirectorate.datasets = [];
    Object.keys(mappingLevelName).forEach((level, idx) => {
      const arrayObject = [];
      dataChart.dataPositionLevelByDirectorate.label.forEach((positionName, idx) => {
        const name = positionName !== "Direktorat Utama" ? positionName.replace("Direktorat ", "") : positionName;
        const findObject = dataAll.totalPositionsByDirectorate.data.find(
          (item) => item.jobLevelName === mappingLevelName[level] && item.directorateName === name,
        );
        if (findObject) {
          arrayObject.push(findObject.totalPositions);
        } else {
          arrayObject.push(0);
        }
      });
      dataChart.dataPositionLevelByDirectorate.datasets.push({
        label: mappingLevelName[level],
        data: arrayObject,
        backgroundColor: COLOR[idx] || "#9999FC",
        barPercentage: BAR_PERCENTAGE, // Adjust bar width to create space
        categoryPercentage: CATEGORY_PERCENTAGE, // Adjust category width to create space
      });
    });
    console.log("dataChart.dataPositionLevelByDirectorate", dataChart.dataPositionLevelByDirectorate);

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
      dataId: "selectPositionLevel",
      // data: Object.values(mappingLevelName).map((item) => ({
      data: DATA_POSITION_LEVEL.map((item) => ({
        id: item,
        text: item,
      })),
      isMulti: true,
    },
    {
      dataId: "selectDirectoratePLBD",
      data: DATA_DIRECTORATE.map((item) => ({
        id: item,
        text: item,
      })),
      isMulti: true,
    },
    {
      dataId: "selectDivision",
      data: DATA_DIVISION.map((item) => ({
        id: item,
        text: item,
      })),
      isMulti: true,
    },

    {
      dataId: "selectDirectorate",
      data: DATA_DIRECTORATE.map((item) => ({
        id: item,
        text: item,
      })),
      isMulti: true,
    },
    {
      dataId: "selectRegional",
      data: DATA_REGIONAL.map((item) => ({
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
      chartOsJobGradeInstance,
      "Job Grade",
    );
  }

  if (dataAll.totalOrganizationShapePersonGradeByArea) {
    // Store data for potential future updates
    dataChart.dataOsPersonGrade.data = dataAll.totalOrganizationShapePersonGradeByArea.data;

    // Create chart using the reusable function
    chartOsPersonGradeInstance = createOrUpdateFunnelChart(
      "chart-os-person-grade",
      dataAll.totalOrganizationShapePersonGradeByArea.data,
      chartOsPersonGradeInstance,
      "Person Grade",
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
          (item) => item.levelName === levelKey,
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
      (item) => item.jobLevelName,
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

  // <div class="m-checkbox-inline">
  //     <div class="form-check form-check-inline checkbox checkbox-solid-primary-custom mb-0">
  //         <input class="form-check-input" id="all" type="checkbox">
  //         <label class="form-check-label" for="all">All RASCI</label>
  //     </div>
  //     <div class="form-check form-check-inline checkbox checkbox-solid-primary-custom mb-0">
  //         <input class="form-check-input" id="accountable" type="checkbox">
  //         <label class="form-check-label" for="accountable">Accountable</label>
  //     </div>
  //     <div class="form-check form-check-inline checkbox checkbox-solid-primary-custom mb-0">
  //         <input class="form-check-input" id="responsible" type="checkbox">
  //         <label class="form-check-label" for="responsible">Responsible</label>
  //     </div>
  //     <div class="form-check form-check-inline checkbox checkbox-solid-primary-custom mb-0">
  //         <input class="form-check-input" id="support" type="checkbox">
  //         <label class="form-check-label" for="support">Support</label>
  //     </div>
  //     <div class="form-check form-check-inline checkbox checkbox-solid-primary-custom mb-0">
  //         <input class="form-check-input" id="consulted" type="checkbox">
  //         <label class="form-check-label" for="consulted">Consulted</label>
  //     </div>
  //     <div class="form-check form-check-inline checkbox checkbox-solid-primary-custom mb-0">
  //         <input class="form-check-input" id="informed" type="checkbox">
  //         <label class="form-check-label" for="informed">Informed</label>
  //     </div>
  // </div>

  // function jika checkbox diklik, bisa multiple, jika all dicentang, maka semua data muncul, jika accountable dicentang, maka hanya accountable yang muncul, begitu seterusnya. jika tidak ada yang dicentang, maka tampilkan semua data.
  const notationIdMap = {
    accountable: "A",
    responsible: "R",
    support: "S",
    consulted: "C",
    informed: "I",
  };

  $(".form-check-average").on("change", function () {
    const checkedIds = $("input.form-check-average:checked")
      .map(function () {
        return $(this).attr("id");
      })
      .get();
    console.log("checkedIds", checkedIds);

    if (checkedIds.includes("all") || checkedIds.length === 0) {
      populateTableAveragePositionLevelBuspro("all");
    } else {
      const filterNotation = checkedIds.map((id) => notationIdMap[id]).filter(Boolean);
      populateTableAveragePositionLevelBuspro(filterNotation);
    }
  });

  function populateTableAveragePositionLevelBuspro(filterNotation) {
    const tableBody = $("#tableAveragePositionLevelBuspro tbody");
    tableBody.empty();

    const levels = ["L1", "L2", "L3", "L4", "L5"];

    dataAll.averageRasciNotationsByJobNameLevelAndProcessLevel.data.forEach((item, idx) => {
      if (idx === 0) return; // skip index 0 because it's total
      const totalPositions = item.notations.length > 0 ? item.notations[0].totalPositions : 0;
      const levelAverages = levels.map((level) => {
        const notationsForLevel = item.notations.filter(
          (n) => n.levelName === level && (filterNotation === "all" || filterNotation.includes(n.notation)),
        );
        if (notationsForLevel.length === 0 || totalPositions === 0) return "-";
        const sumTotal = notationsForLevel.reduce((acc, n) => acc + n.total, 0);
        return (sumTotal / totalPositions).toFixed(2);
      });

      const row = `<tr>
        <td>${item.jobLevelName}</td>
        ${levelAverages.map((avg) => `<td>${avg}</td>`).join("")}
      </tr>`;
      tableBody.append(row);
    });
  }

  if (dataAll.averageRasciNotationsByJobNameLevelAndProcessLevel) {
    populateTableAveragePositionLevelBuspro("all");
  }

  // totalRasciNotationsVsFormation =>  RASCI Notations vs Formation
  if (dataAll.totalRasciNotationsVsFormation) {
    dataChart.dataRasciNotationsFormation = dataAll.totalRasciNotationsVsFormation.data;
    dataChart.dataRasciNotationsFormation = { ...dataChart.dataRasciNotationsFormation, labels: [], datasets: [] };
    dataChart.dataRasciNotationsFormation.labels = dataAll.totalRasciNotationsVsFormation.data.map((item) =>
      item.directorateName.includes("Direktorat") ? item.directorateName : `Direktorat ${item.directorateName}`,
    );
    dataChart.dataRasciNotationsFormation.totalNotation = dataAll.totalRasciNotationsVsFormation.data.map(
      (item) => item.totalNotation,
    );
    dataChart.dataRasciNotationsFormation.totalFormation = dataAll.totalRasciNotationsVsFormation.data.map(
      (item) => item.totalFormation,
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

  if (dataAll.averageCompetencyByJobLevel) {
    dataChart.dataCompetencyByPositionLevelAverage.labels = [];
    dataChart.dataCompetencyByPositionLevelAverage.totalGeneric = [];
    dataChart.dataCompetencyByPositionLevelAverage.totalSpecific = [];

    Object.keys(mappingLevelName).forEach((level, idx) => {
      if (idx === 0) return true;
      const levelName = mappingLevelName[level];
      const found = dataAll.averageCompetencyByJobLevel.data.find((item) => item.jobLevelName === levelName);
      dataChart.dataCompetencyByPositionLevelAverage.labels.push(levelName);
      dataChart.dataCompetencyByPositionLevelAverage.totalGeneric.push(found ? found.averageGeneric : 0);
      dataChart.dataCompetencyByPositionLevelAverage.totalSpecific.push(found ? found.averageSpecific : 0);
    });

    new Chart(chartCompetencyByPositionLevelAverage, {
      type: "bar",
      plugins: [ChartDataLabels],
      data: {
        labels: dataChart.dataCompetencyByPositionLevelAverage.labels,
        datasets: [
          {
            label: "Total Generic",
            data: dataChart.dataCompetencyByPositionLevelAverage.totalGeneric,
            backgroundColor: "#FFEE56",
          },
          {
            label: "Total Specific",
            data: dataChart.dataCompetencyByPositionLevelAverage.totalSpecific,
            backgroundColor: "#A9FFA7",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          datalabels: {
            color: "#fff",
            anchor: "center",
            align: "center",
            font: {
              weight: "bold",
            },
            formatter: function (value) {
              if (value === 0) {
                return "";
              }
              const thaousandFormatter = new Intl.NumberFormat("en-US", {
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
            stacked: false,
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
              color: "#9F9FA5",
            },
            ticks: {
              callback: function (value, index, ticks) {
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
          y: {
            stacked: false,
            beginAtZero: true,
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
                chartOsJobGradeInstance,
                "Job Grade",
              );
            } else if (apiName === "totalOrganizationShapePersonGradeByArea" && result.value.data) {
              // Update Person Grade chart
              dataChart.dataOsPersonGrade.data = result.value.data;
              chartOsPersonGradeInstance = createOrUpdateFunnelChart(
                "chart-os-person-grade",
                result.value.data,
                chartOsPersonGradeInstance,
                "Person Grade",
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
