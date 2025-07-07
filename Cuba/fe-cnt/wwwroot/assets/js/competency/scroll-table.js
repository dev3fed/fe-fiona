const tableContainer = document.querySelector(".scrollable-table");
function debounce(func, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
}
tableContainer.addEventListener(
  "scroll",
  debounce(async function () {
    const bottomReached = tableContainer.scrollTop + tableContainer.clientHeight >= tableContainer.scrollHeight - 10;
    const rightReached = tableContainer.scrollLeft + tableContainer.clientWidth >= tableContainer.scrollWidth - 10;
    const leftReached = tableContainer.scrollLeft === 0;
    let currentPageY = getState("currentPageY");
    let currentPageX = getState("currentPageX");
    const selectedValue = $("#dataSource-competency").val();
    const payloadJob = getState("payloadJob");
    const payloadCompetency = getState("payloadCompetency");
    const searchType = getState("selectedType");
    const searchText = document.getElementById("inputText").value;
    const jobCode = getAllJobCode();
    if (bottomReached) {
      const payload = {
        ...payloadJob,
        dataSource: selectedValue,
        filter: searchType,
        search: searchText,
        page: currentPageY + 1,
      };
      console.log("payload", payload);
      const queryString = "?" + new URLSearchParams(payload).toString();
      const resultJob = await fetchJobList(queryString);
      console.log("first", resultJob);
      const jobCodeList = resultJob.data.map((val) => val.positionCode);

      const combineIndex = [...jobCode, ...jobCodeList];
      console.log("combineIndex", combineIndex);
      const storageDataCompetency = getState("storageDataCompetency");
      console.log("storageDataCompetency", storageDataCompetency);
      if (combineIndex.length > 0 && resultJob.success === true) {
        if (storageDataCompetency.length > 10) {
          console.log("cek 10 length");
        }
        const body = {
          ...payloadCompetency,
          dataSource: selectedValue,
          jobCode: combineIndex,
        };
        setState("payloadCompetency", body);
        const resultCompetency = await fetchCompetencyList(body);
        console.log("resultCompetency", resultCompetency);
        setTimeout(() => {
          // loadTableHeader(competencyList);
          loadTableBody(resultJob.data);
          mapCompetencyCells(combineIndex, resultCompetency.data.competency, resultCompetency.data.level);

          // mapRasciCells(combineIndex, resultPosition.data);
          setState("currentPageY", currentPageY + 1);
          // isLoading = false;
          // loader.style.display = "none";
          // onLoadData = false;
          setState("payloadCompetency", { ...payloadCompetency, jobCode: combineIndex });
          hideAllTooltips();
        }, 50);
      }
    }

    if (rightReached) {
      console.log("cek kanan");
      loadMoreData(currentPageX + 1);
    }
    if (leftReached) {
    }
  }, 100),
);

function getAllJobCode() {
  const indexNumbers = [];
  document.querySelectorAll("#table-body tr").forEach((row) => {
    const indexNumber = row.id.replace("tr-", ""); // Ambil dari id row
    if (indexNumber) indexNumbers.push(indexNumber);
  });
  return indexNumbers;
}
const hideAllTooltips = () => {
  document.querySelectorAll(".tooltip").forEach((tooltip) => {
    bootstrap.Tooltip.getInstance(tooltip)?.hide();
  });
};

async function loadMoreData(page) {
  try {
    console.log("first", page);
    const payloadCompetency = getState("payloadCompetency");
    const selectedValue = $("#dataSource-competency").val();
    // const loader = document.getElementById("loader");
    const body = {
      ...payloadCompetency,
      dataSource: selectedValue,
      page: page,
    };

    console.log("first", body);
    const resultCompetency = await fetchCompetencyList(body);
    const totalListcompetency = resultCompetency.data.competency.length;
    console.log("first", totalListcompetency);
    if (totalListcompetency > 0) {
      const storageDataCompetency = getState("storageDataCompetency");
      const competencyList = [...storageDataCompetency, ...resultCompetency?.data.competency];
      console.log("resultCompetency?.data.competency", resultCompetency?.data.competency);
      console.log("storageDataCompetency", storageDataCompetency);
      console.log("competencyList", competencyList);
      loadTableHeader(competencyList);
      setState("currentPageX", page + 1);
      setState("payloadCompetency", body);
    }

    //   const resultPosition = await fetchPositionMatrix(body);
    //   const storageDataPosition = getState("storageDataPosition");
    //   const positionList = [...storageDataPosition, ...resultPosition.data];
    //   if (positionList.length > 20) {
    //     const cuttingPosition = positionList.slice(10); // Pangkas 10 data di awal
    //     setState("storageDataPosition", cuttingPosition);
    //     const indexNumberList = getAllIndexNumbers();
    //     appendDynamicHeader(cuttingPosition);
    //     mapRasciCells(indexNumberList, cuttingPosition);
    //     loader.style.display = "none";
    //     isLoading = false;
    //     onLoadData = false;
    //     tableContainer.scrollLeft -= 1700;
    //     hideAllTooltips();
    //   } else {
    //     setState("storageDataPosition", positionList);
    //     const indexNumberList = getAllIndexNumbers();
    //     appendDynamicHeader(positionList);
    //     mapRasciCells(indexNumberList, positionList);
    //     loader.style.display = "none";
    //     isLoading = false;
    //     onLoadData = false;
    //     hideAllTooltips();
    //   }
  } catch (error) {}
}

function getRowById(rowId) {
  return document.querySelector(`[id="${rowId}"]`);
}
