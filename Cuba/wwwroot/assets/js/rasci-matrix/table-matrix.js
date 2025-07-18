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
async function loadMorePosition(page) {
  try {
    const payloadPosition = getState("payloadPosition");
    const loader = document.getElementById("loader");
    const payloadJob = {
      ...payloadPosition,
      col: page,
    };
    setState("payloadPosition", payloadJob);
    const resultPosition = await fetchPositionMatrix(payloadJob);
    const storageDataPosition = getState("resultJabatan");
    const resultProsbis = getState("resultProsbis");
    const indexNumberList = resultProsbis.map((val) => val.indexNumber);
    const positionList = [...storageDataPosition, ...resultPosition.data];
    if (positionList.length > 20) {
      const cuttingPosition = positionList.slice(10); // Pangkas 10 data di awal
      setState("resultJabatan", cuttingPosition);
      setState("totalJob", resultPosition.totalResult);
      appendDynamicHeader(cuttingPosition);
      mapRasciCells(indexNumberList, cuttingPosition);
      loader.style.display = "none";
      isLoading = false;
      onLoadData = false;
      tableContainer.scrollLeft -= 1700;
      hideAllTooltips();
    } else {
      setState("resultJabatan", positionList);
      setState("totalJob", resultPosition.totalResult);
      appendDynamicHeader(positionList);
      mapRasciCells(indexNumberList, positionList);
      loader.style.display = "none";
      isLoading = false;
      onLoadData = false;
      hideAllTooltips();
    }
  } catch (error) {}
}

const loadMoreProsbisOnly = async (currentPageY) => {
  try {
    const selectedValue = $("#dataSource-rasci").val();
    const payloadProsbis = getState("payloadProsbis");
    const dataStoreProsbis = getState("resultProsbis");
    const totalProsbis = getState("totalProsbis");
    const totalPages = Math.ceil(totalProsbis / 15);
    if (currentPageY < totalPages) {
      isLoading = true;
      onLoadData = true;
      loader.style.display = "flex";
      const payload = {
        ...payloadProsbis,
        draftRasciId: selectedValue === "master" ? null : selectedValue,
        row: currentPageY + 1,
        rowSize: 15,
      };
      const resultProsbis = await fetchProsbisMatrix(payload);
      const combineProsbis = [...dataStoreProsbis, ...resultProsbis.data];
      const allProsbis =
        combineProsbis.length > 45 ? combineProsbis.slice(15) : combineProsbis;
      setState("resultProsbis", allProsbis);
      setTimeout(() => {
        loadTableBody(allProsbis);
        setState("currentPageY", currentPageY + 1);
        isLoading = false;
        loader.style.display = "none";
        onLoadData = false;
        hideAllTooltips();
      }, 50);

      if (combineProsbis.length > 45) {
        tableContainer.scrollTop -= 550;
      }
    }
  } catch (error) {}
};

const loadMorePositionAndProsbis = async (currentPageY, currentPageX) => {
  try {
    const selectedValue = $("#dataSource-rasci").val();
    const payloadProsbis = getState("payloadProsbis");
    const payloadPosition = getState("payloadPosition");
    const dataStoreProsbis = getState("resultProsbis");
    const storageDataPosition = getState("resultJabatan");
    const totalProsbis = getState("totalProsbis");
    console.log("totalProsbis", totalProsbis);
    const totalPages = Math.ceil(totalProsbis / 15);
    console.log("totalPages", totalPages);
    if (currentPageY < totalPages) {
      isLoading = true;
      onLoadData = true;
      loader.style.display = "flex";
      const payload = {
        ...payloadProsbis,
        draftRasciId: selectedValue === "master" ? null : selectedValue,
        row: currentPageY + 1,
        rowSize: 15,
      };
      const resultProsbis = await fetchProsbisMatrix(payload);
      const combineProsbis = [...dataStoreProsbis, ...resultProsbis.data];
      const allProsbis =
        combineProsbis.length > 45 ? combineProsbis.slice(15) : combineProsbis;
      const combineIndex = allProsbis.map((val) => val.indexNumber);
      setState("resultProsbis", allProsbis);
      if (storageDataPosition.length > 10) {
        const numberLoop = [currentPageX - 1, currentPageX];
        const positionList = await fetchMultiplePage(numberLoop, []);
        setTimeout(() => {
          loadTableBody(allProsbis);
          appendDynamicHeader(positionList);
          mapRasciCells(combineIndex, positionList);
          setState("currentPageY", currentPageY + 1);
          isLoading = false;
          loader.style.display = "none";
          onLoadData = false;
          setState("payloadPosition", {
            ...payloadPosition,
            indexNumber: [],
          });
          hideAllTooltips();
        }, 50);
      } else {
        const payloadJob = {
          ...payloadPosition,
          col: 1,
          colSize: 10,
          draftRasciId: selectedValue === "master" ? null : selectedValue,
        };
        const resultPosition = await fetchPositionMatrix(payloadJob);
        setTimeout(() => {
          loadTableBody(allProsbis);
          appendDynamicHeader(resultPosition.data);
          mapRasciCells(combineIndex, resultPosition.data);
          setState("currentPageY", currentPageY + 1);
          isLoading = false;
          loader.style.display = "none";
          onLoadData = false;
          setState("payloadPosition", {
            ...payloadPosition,
            indexNumber: [],
          });
          hideAllTooltips();
        }, 50);
      }
      if (combineProsbis.length > 45) {
        tableContainer.scrollTop -= 550;
      }
    }
  } catch (error) {}
};
const loadMoreProsbisAndPosition = async (currentPageY, currentPageX) => {
  try {
    const selectedValue = $("#dataSource-rasci").val();
    const payloadProsbis = getState("payloadProsbis");
    const payloadPosition = getState("payloadPosition");
    const dataStoreProsbis = getState("resultProsbis");
    const storageDataPosition = getState("resultJabatan");
    const loader = document.getElementById("loader");
    const totalProsbis = getState("totalProsbis");
    const totalPages = Math.ceil(totalProsbis / 15);
    if (currentPageY < totalPages) {
      isLoading = true;
      onLoadData = true;
      loader.style.display = "flex";
      const payload = {
        ...payloadProsbis,
        draftRasciId: selectedValue === "master" ? null : selectedValue,
        row: currentPageY + 1,
        rowSize: 15,
      };
      const resultProsbis = await fetchProsbisMatrix(payload);
      const combineProsbis = [...dataStoreProsbis, ...resultProsbis.data];
      const allProsbis =
        combineProsbis.length > 45 ? combineProsbis.slice(15) : combineProsbis;
      const combineIndex = allProsbis.map((val) => val.indexNumber);
      setState("resultProsbis", allProsbis);
      if (combineIndex.length > 0 && resultProsbis.success === true) {
        if (storageDataPosition.length > 10) {
          const numberLoop = [currentPageX - 1, currentPageX];
          const positionList = await fetchMultiplePage(
            numberLoop,
            combineIndex,
          );
          setTimeout(() => {
            loadTableBody(allProsbis);
            appendDynamicHeader(positionList);
            mapRasciCells(combineIndex, positionList);
            setState("currentPageY", currentPageY + 1);
            isLoading = false;
            loader.style.display = "none";
            onLoadData = false;
            setState("payloadPosition", {
              ...payloadPosition,
              indexNumber: combineIndex,
            });
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
            loadTableBody(allProsbis);
            appendDynamicHeader(resultPosition.data);
            mapRasciCells(combineIndex, resultPosition.data);
            setState("currentPageY", currentPageY + 1);
            isLoading = false;
            loader.style.display = "none";
            onLoadData = false;
            setState("payloadPosition", {
              ...payloadPosition,
              indexNumber: combineIndex,
            });
            hideAllTooltips();
          }, 50);
        }
      }
      if (combineProsbis.length > 45) {
        tableContainer.scrollTop -= 550;
      }
    }
  } catch (error) {}
};

const restoreProsbisOnly = async () => {
  try {
    const selectedValue = $("#dataSource-rasci").val();
    let currentPageY = getState("currentPageY");
    const payloadProsbis = getState("payloadProsbis");
    const loader = document.getElementById("loader");
    const resultProsbis = getState("resultProsbis");
    const payload = {
      ...payloadProsbis,
      draftRasciId: selectedValue === "master" ? null : selectedValue,
      row: currentPageY - 3,
      rowSize: 15,
    };
    const rowToRemove =
      resultProsbis.length != 45
        ? Math.max(0, resultProsbis.length + 15 - 45)
        : 15;
    const getDataProsbis = await fetchProsbisMatrix(payload);
    const cuttingProsbis = resultProsbis.slice(0, -rowToRemove);
    const combinedProsbis = [...getDataProsbis.data, ...cuttingProsbis];
    setState("resultProsbis", combinedProsbis);
    setTimeout(() => {
      loadTableBody(combinedProsbis);
      setState("currentPageY", currentPageY - 1);
      isLoading = false;
      loader.style.display = "none";
      onLoadData = false;
      hideAllTooltips();
    }, 50);
    tableContainer.scrollTop += 550;
  } catch (error) {}
};

async function restorePositionAndProsbis() {
  try {
    const selectedValue = $("#dataSource-rasci").val();
    let currentPageY = getState("currentPageY");
    let currentPageX = getState("currentPageX");
    const payloadPosition = getState("payloadPosition");
    const payloadProsbis = getState("payloadProsbis");
    const loader = document.getElementById("loader");
    const resultProsbis = getState("resultProsbis");
    const storageDataPosition = getState("resultJabatan");
    const payload = {
      ...payloadProsbis,
      draftRasciId: selectedValue === "master" ? null : selectedValue,
      row: currentPageY - 3,
      rowSize: 15,
    };
    const rowToRemove =
      resultProsbis.length != 45
        ? Math.max(0, resultProsbis.length + 15 - 45)
        : 15;
    const getDataProsbis = await fetchProsbisMatrix(payload);
    const cuttingProsbis = resultProsbis.slice(0, -rowToRemove);
    const combinedProsbis = [...getDataProsbis.data, ...cuttingProsbis];
    const indexNumberList = combinedProsbis.map((val) => val.indexNumber);
    setState("resultProsbis", combinedProsbis);
    if (storageDataPosition.length > 10) {
      const numberLoop = [currentPageX - 1, currentPageX];
      const positionList = await fetchMultiplePage(numberLoop, []);
      setTimeout(() => {
        loadTableBody(combinedProsbis);
        appendDynamicHeader(positionList);
        mapRasciCells(indexNumberList, positionList);
        setState("currentPageY", currentPageY - 1);
        isLoading = false;
        loader.style.display = "none";
        onLoadData = false;
        setState("payloadPosition", {
          ...payloadPosition,
          indexNumber: [],
        });
        hideAllTooltips();
      }, 50);
    } else {
      const payloadJob = {
        ...payloadPosition,
        col: 1,
        colSize: 10,
        draftRasciId: selectedValue === "master" ? null : selectedValue,
        indexNumber: [],
      };
      const resultPosition = await fetchPositionMatrix(payloadJob);
      setTimeout(() => {
        loadTableBody(combinedProsbis);
        appendDynamicHeader(resultPosition.data);
        mapRasciCells(indexNumberList, resultPosition.data);
        setState("currentPageY", currentPageY - 1);
        isLoading = false;
        loader.style.display = "none";
        onLoadData = false;
        setState("payloadPosition", {
          ...payloadPosition,
          indexNumber: [],
        });
        hideAllTooltips();
      }, 50);
    }
    tableContainer.scrollTop += 550;
  } catch (error) {}
}

async function restoreProsbisAndPosition() {
  try {
    const selectedValue = $("#dataSource-rasci").val();
    let currentPageY = getState("currentPageY");
    let currentPageX = getState("currentPageX");
    const payloadPosition = getState("payloadPosition");
    const payloadProsbis = getState("payloadProsbis");
    const loader = document.getElementById("loader");
    const resultProsbis = getState("resultProsbis");
    const storageDataPosition = getState("resultJabatan");
    const payload = {
      ...payloadProsbis,
      draftRasciId: selectedValue === "master" ? null : selectedValue,
      row: currentPageY - 3,
      rowSize: 15,
    };
    const rowToRemove =
      resultProsbis.length != 45
        ? Math.max(0, resultProsbis.length + 15 - 45)
        : 15;
    const getDataProsbis = await fetchProsbisMatrix(payload);
    const cuttingProsbis = resultProsbis.slice(0, -rowToRemove);
    const combinedProsbis = [...getDataProsbis.data, ...cuttingProsbis];
    const indexNumberList = combinedProsbis.map((val) => val.indexNumber);
    setState("resultProsbis", combinedProsbis);
    if (storageDataPosition.length > 10) {
      const numberLoop = [currentPageX - 1, currentPageX];
      const positionList = await fetchMultiplePage(numberLoop, indexNumberList);
      setTimeout(() => {
        loadTableBody(combinedProsbis);
        appendDynamicHeader(positionList);
        mapRasciCells(indexNumberList, positionList);
        setState("currentPageY", currentPageY - 1);
        isLoading = false;
        loader.style.display = "none";
        onLoadData = false;
        setState("payloadPosition", {
          ...payloadPosition,
          indexNumber: indexNumberList,
        });
        hideAllTooltips();
      }, 50);
    } else {
      const payloadJob = {
        ...payloadPosition,
        col: 1,
        colSize: 10,
        draftRasciId: selectedValue === "master" ? null : selectedValue,
        indexNumber: indexNumberList,
      };
      const resultPosition = await fetchPositionMatrix(payloadJob);
      setTimeout(() => {
        loadTableBody(combinedProsbis);
        appendDynamicHeader(resultPosition.data);
        mapRasciCells(indexNumberList, resultPosition.data);
        setState("currentPageY", currentPageY - 1);
        isLoading = false;
        loader.style.display = "none";
        onLoadData = false;
        setState("payloadPosition", {
          ...payloadPosition,
          indexNumber: indexNumberList,
        });
        hideAllTooltips();
      }, 50);
    }
    tableContainer.scrollTop += 550;
  } catch (error) {}
}
async function restorePosition() {
  try {
    const storageDataPosition = getState("resultJabatan");
    const resultProsbis = getState("resultProsbis");
    let currentPageX = getState("currentPageX");
    const loader = document.getElementById("loader");
    if (currentPageX > 2) {
      const payloadPosition = getState("payloadPosition");
      const indexNumberList = resultProsbis.map((val) => val.indexNumber);

      const payloadJob = {
        ...payloadPosition,
        col: currentPageX - 2,
      };
      const rowToRemove =
        storageDataPosition.length != 20
          ? Math.max(0, storageDataPosition.length + 10 - 20)
          : 10;

      const cuttingPosition = storageDataPosition.slice(0, -rowToRemove);
      const resultPosition = await fetchPositionMatrix(payloadJob);
      const combinedPosition = [...resultPosition.data, ...cuttingPosition];
      appendDynamicHeader(combinedPosition);
      mapRasciCells(indexNumberList, combinedPosition);
      setState("currentPageX", currentPageX - 1);
      loader.style.display = "none";
      isLoading = false;
      onLoadData = false;
      hideAllTooltips();
      tableContainer.scrollLeft += 700;
    }
  } catch (error) {}
}
