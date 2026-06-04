let onLoadData = false;
const tableContainer = document.querySelector(".scrollable-table");
function debounce(func, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
}
const hideAllTooltips = () => {
  document.querySelectorAll(".tooltip").forEach((tooltip) => {
    bootstrap.Tooltip.getInstance(tooltip)?.hide();
  });
};
tableContainer.addEventListener(
  "scroll",
  debounce(async function () {
    const topReached = tableContainer.scrollTop <= 10;
    const bottomReached = tableContainer.scrollTop + tableContainer.clientHeight >= tableContainer.scrollHeight - 10;
    const rightReached = tableContainer.scrollLeft + tableContainer.clientWidth >= tableContainer.scrollWidth - 10;
    const leftReached = tableContainer.scrollLeft === 0;
    const loader = document.getElementById("loader-competency");
    let currentPageY = getState("currentPageY");
    let currentPageX = getState("currentPageX");
    const totalCompetency = getState("totalCompetency");
    const selectedValue = $("#dataSource-competency").val();
    const searchType = getState("selectedType");
    const searchText = document.getElementById("inputText").value;
    if (onLoadData) return;
    if (topReached) {
      if (currentPageY > 3) {
        loader.style.display = "flex";
        restoreJob();
      }
    }
    if (bottomReached) {
      loadMoreJob(currentPageY, currentPageX);
    }
    if (rightReached) {
      const totalPages = Math.ceil(totalCompetency / 10);
      if (currentPageX < totalPages) {
        loader.style.display = "flex";
        setState("currentPageX", currentPageX + 1);
        loadMoreCompetency(currentPageX + 1);
      }
      // loadMoreData(currentPageX + 1);
    }
    if (leftReached) {
      if (currentPageX > 2) {
        loader.style.display = "flex";
        restoreCompetency();
      }
    }
  }, 100),
);

async function loadMoreCompetency(page) {
  try {
    const payloadCompetency = getState("payloadCompetency");
    const loader = document.getElementById("loader-competency");
    const payload = {
      ...payloadCompetency,
      page: page,
    };
    setState("payloadCompetency", payload);
    const resultCompetency = await fetchCompetencyList(payload);
    const compeList = getState("resultCompetency");
    const resultJob = getState("resultJob");
    const mappingList = getState("resultMapping");
    const posCode = resultJob.map((value) => `${value.unitCode};${value.prlOrg}`);
    const allCompeList = [...compeList, ...resultCompetency.data.competency];
    const allMappingList = [...mappingList, ...resultCompetency.data.level];
    if (allCompeList.length > 20) {
      const cuttingCompe = allCompeList.slice(10); // Pangkas 10 data di awal
      setState("resultCompetency", cuttingCompe);
      setState("resultMapping", allMappingList);
      setState("totalCompetency", resultCompetency.totalResult);
      loadTableHeader(cuttingCompe);
      mapCompetencyCells(posCode, cuttingCompe, allMappingList);
      loader.style.display = "none";
      isLoading = false;
      onLoadData = false;
      tableContainer.scrollLeft -= 1300;
      hideAllTooltips();
    } else {
      setState("resultCompetency", allCompeList);
      setState("resultMapping", allMappingList);
      setState("totalCompetency", resultCompetency.totalResult);
      loadTableHeader(allCompeList);
      mapCompetencyCells(posCode, allCompeList, allMappingList);
      loader.style.display = "none";
      isLoading = false;
      onLoadData = false;
      hideAllTooltips();
    }
  } catch (error) {}
}

const fetchMultiplePage = async (numberLoop, combineIndex) => {
  const payloadCompetency = getState("payloadCompetency");
  const competencyList = await Promise.all(
    numberLoop.map(async (number) => {
      const payload = {
        ...payloadCompetency,
        page: number,
        jobCode: combineIndex,
      };
      const resultCompetency = await fetchCompetencyList(payload);
      return resultCompetency;
    }),
  );

  return competencyList;
};

const restoreJob = async () => {
  try {
    let currentPageY = getState("currentPageY");
    let currentPageX = getState("currentPageX");
    const payloadJob = getState("payloadJob");
    const payloadCompetency = getState("payloadCompetency");
    const loader = document.getElementById("loader-competency");
    const resultJob = getState("resultJob");
    const resultCompetency = getState("resultCompetency");

    const payload = {
      ...payloadJob,
      page: currentPageY - 3,
      pageSize: 15,
    };
    const rowToRemove = resultJob.length != 45 ? Math.max(0, resultJob.length + 15 - 45) : 15;
    const queryString = "?" + new URLSearchParams(payload).toString();
    const jobList = await fetchJobList(queryString);
    const cuttingJob = resultJob.slice(0, -rowToRemove);
    const combinedJob = [...jobList.data, ...cuttingJob];
    const posCode = combinedJob.map((value) => `${value.unitCode};${value.prlOrg}`);
    setState("resultJob", combinedJob);
    if (resultCompetency.length > 10) {
      const numberLoop = [currentPageX - 1, currentPageX];
      const competencyList = await fetchMultiplePage(numberLoop, posCode);
      const combinedCompetency = competencyList.flatMap((item) => item.data.competency);
      const combinedlevel = competencyList.flatMap((item) => item.data.level);
      setTimeout(() => {
        loadTableHeader(combinedCompetency);
        loadTableBody(combinedJob);
        mapCompetencyCells(posCode, combinedCompetency, combinedlevel);
        setState("currentPageY", currentPageY - 1);
        loader.style.display = "none";
        onLoadData = false;
        setState("payloadCompetency", {
          ...payloadCompetency,
          jobCode: posCode,
        });
        hideAllTooltips();
      }, 50);
    } else {
      const body = {
        ...payloadCompetency,
        jobCode: posCode,
      };
      const competencyList = await fetchCompetencyList(body);
      setTimeout(() => {
        loadTableHeader(competencyList?.data.competency);
        loadTableBody(combinedJob);
        mapCompetencyCells(posCode, competencyList.data.competency, competencyList.data.level);
        setState("currentPageY", currentPageY - 1);
        loader.style.display = "none";
        onLoadData = false;
        setState("payloadCompetency", {
          ...payloadCompetency,
          jobCode: posCode,
        });
        hideAllTooltips();
      }, 50);
    }
    tableContainer.scrollTop += 550;
  } catch (error) {}
};
const loadMoreJob = async (currentPageY, currentPageX) => {
  try {
    const resultJob = getState("resultJob");
    const payloadJob = getState("payloadJob");
    const resultCompetency = getState("resultCompetency");
    const payloadCompetency = getState("payloadCompetency");
    const totalJob = getState("totalJob");
    const loader = document.getElementById("loader-competency");

    const totalPages = Math.ceil(totalJob / 15);

    if (currentPageY < totalPages) {
      const payload = {
        ...payloadJob,
        page: currentPageY + 1,
        pageSize: 15,
      };
      loader.style.display = "flex";
      const queryString = "?" + new URLSearchParams(payload).toString();
      const jobList = await fetchJobList(queryString);
      const combineJob = [...resultJob, ...jobList.data];
      const allJob = combineJob.length > 45 ? combineJob.slice(15) : combineJob;
      const combineIndex = allJob.map((value) => `${value.unitCode};${value.prlOrg}`);
      // const resultCompetency = getState("resultCompetency");
      // console.log("storageDataCompetency", storageDataCompetency);
      const posCode = resultJob.map((value) => `${value.unitCode};${value.prlOrg}`);

      setState("resultJob", allJob);
      if (combineIndex.length > 0 && jobList.success === true) {
        if (resultCompetency.length > 10) {
          const numberLoop = [currentPageX - 1, currentPageX];
          const competencyList = await fetchMultiplePage(numberLoop, posCode);
          const combinedCompetency = competencyList.flatMap((item) => item.data.competency);
          const combinedlevel = competencyList.flatMap((item) => item.data.level);
          setTimeout(() => {
            loadTableHeader(combinedCompetency);
            loadTableBody(allJob);
            mapCompetencyCells(combineIndex, combinedCompetency, combinedlevel);
            setState("currentPageY", currentPageY + 1);
            loader.style.display = "none";
            onLoadData = false;
            setState("payloadCompetency", {
              ...payloadCompetency,
              jobCode: combineIndex,
            });
            hideAllTooltips();
          }, 50);
        } else {
          const body = {
            ...payloadCompetency,
            jobCode: combineIndex,
          };
          setState("payloadCompetency", body);
          const competencyList = await fetchCompetencyList(body);
          setTimeout(() => {
            loadTableHeader(competencyList?.data.competency);
            loadTableBody(allJob);
            mapCompetencyCells(combineIndex, competencyList.data.competency, competencyList.data.level);
            setState("currentPageY", currentPageY + 1);
            loader.style.display = "none";
            onLoadData = false;
            setState("payloadCompetency", {
              ...payloadCompetency,
              jobCode: combineIndex,
            });
            hideAllTooltips();
          }, 50);
        }
      }
      if (combineJob.length > 45) {
        tableContainer.scrollTop -= 550;
      }
    }
  } catch (error) {
    console.log(error);
  }
};
function getAllJobCode() {
  const indexNumbers = [];
  document.querySelectorAll("#table-body tr").forEach((row) => {
    const indexNumber = row.id.replace("tr-", ""); // Ambil dari id row
    if (indexNumber) indexNumbers.push(indexNumber);
  });
  return indexNumbers;
}

async function restoreCompetency() {
  try {
    const compeList = getState("resultCompetency");
    const resultJob = getState("resultJob");
    const mappingList = getState("resultMapping");

    let currentPageX = getState("currentPageX");
    const loader = document.getElementById("loader-competency");
    if (currentPageX > 2) {
      const payloadCompetency = getState("payloadCompetency");
      const posCode = resultJob.map((value) => `${value.unitCode};${value.prlOrg}`);

      const payload = {
        ...payloadCompetency,
        page: currentPageX - 2,
      };
      const rowToRemove = compeList.length != 20 ? Math.max(0, compeList.length + 10 - 20) : 10;
      const cuttingCompe = compeList.slice(0, -rowToRemove);
      const resultCompetency = await fetchCompetencyList(payload);
      const combinedCompe = [...resultCompetency.data.competency, ...cuttingCompe];
      loadTableHeader(combinedCompe);
      mapCompetencyCells(posCode, combinedCompe, mappingList);
      setState("currentPageX", currentPageX - 1);
      loader.style.display = "none";
      isLoading = false;
      onLoadData = false;
      hideAllTooltips();
      tableContainer.scrollLeft += 700;
    }
  } catch (error) {}
}

function getRowById(rowId) {
  return document.querySelector(`[id="${rowId}"]`);
}
