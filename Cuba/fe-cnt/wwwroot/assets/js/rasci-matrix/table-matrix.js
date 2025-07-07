let onLoadData = false;
function resetTable() {
  const tableHeader = document.getElementById("table-header");
  const tableBody = document.getElementById("table-body");

  while (tableHeader.firstChild) {
    tableHeader.removeChild(tableHeader.firstChild);
  }
  while (tableBody.firstChild) {
    tableBody.removeChild(tableBody.firstChild);
  }
  const table = document.querySelector(".custom-border-table");
  table.style.tableLayout = "auto";
}

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

const tableContainer = document.querySelector(".scrollable-table");

tableContainer.addEventListener(
  "scroll",
  debounce(async function () {
    const bottomReached = tableContainer.scrollTop + tableContainer.clientHeight >= tableContainer.scrollHeight - 10;
    const rightReached = tableContainer.scrollLeft + tableContainer.clientWidth >= tableContainer.scrollWidth - 10;
    const leftReached = tableContainer.scrollLeft === 0;
    const loader = document.getElementById("loader");
    let currentPageY = getState("currentPageY");
    let currentPageX = getState("currentPageX");
    if (onLoadData) return;
    if (bottomReached) {
      const selectedValue = $("#dataSource-rasci").val();
      const payloadProsbis = getState("payloadProsbis");
      const payloadPosition = getState("payloadPosition");
      const payload = {
        ...payloadProsbis,
        draftRasciId: selectedValue === "master" ? null : selectedValue,
        level: [1, 2, 3, 4, 5, 6],
        row: currentPageY + 1,
        rowSize: 15,
      };
      isLoading = true;
      onLoadData = true;
      loader.style.display = "flex";
      const resultProsbis = await fetchProsbisMatrix(payload);
      const prosbisNumber = resultProsbis.data.map((val) => val.indexNumber);
      const indexNumberPros = getAllIndexNumbers();
      const combineIndex = [...indexNumberPros, ...prosbisNumber];
      const storageDataPosition = getState("storageDataPosition");
      if (combineIndex.length > 0 && resultProsbis.success === true) {
        if (storageDataPosition.length > 10) {
          const numberLoop = [currentPageX - 1, currentPageX];
          const positionList = await fetchMultiplePage(numberLoop, combineIndex);
          setTimeout(() => {
            loadTableBody(resultProsbis.data);
            mapRasciCells(combineIndex, positionList);
            setState("currentPageY", currentPageY + 1);
            isLoading = false;
            loader.style.display = "none";
            onLoadData = false;
            setState("payloadPosition", { ...payloadPosition, indexNumber: combineIndex });
            hideAllTooltips();
          }, 50);
        } else {
          const payloadJob = {
            ...payloadPosition,
            col: 1,
            colSize: 10,
            draftRasciId: selectedValue === "master" ? null : selectedValue,
            indexNumber: combineIndex,
          };
          const resultPosition = await fetchPositionMatrix(payloadJob);
          setTimeout(() => {
            loadTableBody(resultProsbis.data);
            mapRasciCells(combineIndex, resultPosition.data);
            setState("currentPageY", currentPageY + 1);
            isLoading = false;
            loader.style.display = "none";
            onLoadData = false;
            setState("payloadPosition", { ...payloadPosition, indexNumber: combineIndex });
            hideAllTooltips();
          }, 50);
        }
      }
    }

    if (rightReached) {
      isLoading = true;
      onLoadData = true;
      loader.style.display = "flex";
      setState("currentPageX", currentPageX + 1);
      loadMoreData(currentPageX + 1);
    }
    if (leftReached) {
      if (currentPageX > 2) {
        isLoading = true;
        onLoadData = true;
        loader.style.display = "flex";
        restoreData();
      }
    }
  }, 100),
);

const fetchMultiplePage = async (numberLoop, combineIndex) => {
  const payloadPosition = getState("payloadPosition");
  const selectedValue = $("#dataSource-rasci").val();
  const positionList = await Promise.all(
    numberLoop.map(async (number) => {
      const payloadJob = {
        ...payloadPosition,
        col: number,
        colSize: 10,
        draftRasciId: selectedValue === "master" ? null : selectedValue,
        indexNumber: combineIndex,
      };
      const resultPosition = await fetchPositionMatrix(payloadJob);
      return resultPosition.data;
    }),
  );

  return positionList.flat();
};
async function loadMoreData(page) {
  try {
    const payloadPosition = getState("payloadPosition");
    const loader = document.getElementById("loader");
    const payloadJob = {
      ...payloadPosition,
      col: page,
    };
    setState("payloadPosition", payloadJob);
    const resultPosition = await fetchPositionMatrix(payloadJob);
    const storageDataPosition = getState("storageDataPosition");
    const positionList = [...storageDataPosition, ...resultPosition.data];
    console.log("positionList", positionList);
    if (positionList.length > 20) {
      const cuttingPosition = positionList.slice(10); // Pangkas 10 data di awal
      setState("storageDataPosition", cuttingPosition);
      const indexNumberList = getAllIndexNumbers();
      appendDynamicHeader(cuttingPosition);
      mapRasciCells(indexNumberList, cuttingPosition);
      loader.style.display = "none";
      isLoading = false;
      onLoadData = false;
      tableContainer.scrollLeft -= 1700;
      hideAllTooltips();
    } else {
      setState("storageDataPosition", positionList);
      const indexNumberList = getAllIndexNumbers();
      appendDynamicHeader(positionList);
      mapRasciCells(indexNumberList, positionList);
      loader.style.display = "none";
      isLoading = false;
      onLoadData = false;
      hideAllTooltips();
    }
  } catch (error) {}
}
async function restoreData() {
  try {
    const storageDataPosition = getState("storageDataPosition");
    let currentPageX = getState("currentPageX");
    const loader = document.getElementById("loader");
    if (currentPageX > 2) {
      const payloadPosition = getState("payloadPosition");
      const indexNumberList = getAllIndexNumbers();

      const payloadJob = {
        ...payloadPosition,
        col: currentPageX - 2,
      };
      const cuttingPosition = storageDataPosition.slice(0, -10);
      const resultPosition = await fetchPositionMatrix(payloadJob);
      const combinedPosition = [...resultPosition.data, ...cuttingPosition];
      appendDynamicHeader(combinedPosition);
      mapRasciCells(indexNumberList, combinedPosition);
      setState("currentPageX", currentPageX - 1);
      loader.style.display = "none";
      isLoading = false;
      onLoadData = false;
      hideAllTooltips();
      tableContainer.scrollLeft += 1700;
    }
    //
  } catch (error) {}
}
