let onLoadData = false;
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
    const bottomReached =
      tableContainer.scrollTop + tableContainer.clientHeight >=
      tableContainer.scrollHeight - 10;
    const topReached = tableContainer.scrollTop <= 10;

    const rightReached =
      tableContainer.scrollLeft + tableContainer.clientWidth >=
      tableContainer.scrollWidth - 10;
    const leftReached = tableContainer.scrollLeft === 0;
    const loader = document.getElementById("loader");
    let currentPageY = getState("currentPageY");
    let currentPageX = getState("currentPageX");
    const actionType = getState("actionType");
    if (onLoadData) return;

    const totalJob = getState("totalJob");
    if (bottomReached) {
      if (actionType === "BP_THEN_JOB") {
        loadMoreProsbisAndPosition(currentPageY, currentPageX);
      } else if (actionType === "BP_ONLY") {
        loadMoreProsbisOnly(currentPageY);
      } else if (actionType === "POS_THEN_BP") {
        loadMorePositionAndProsbis(currentPageY, currentPageX);
      }
    }
    if (topReached) {
      if (currentPageY > 3) {
        isLoading = true;
        onLoadData = true;
        loader.style.display = "flex";
        if (actionType === "BP_THEN_JOB") {
          restoreProsbisAndPosition();
        } else if (actionType === "BP_ONLY") {
          restoreProsbisOnly();
        } else if (actionType === "POS_THEN_BP") {
          restorePositionAndProsbis();
        }
      }
    }
    if (rightReached) {
      const totalPages = Math.ceil(totalJob / 10);
      if (currentPageX < totalPages) {
        isLoading = true;
        onLoadData = true;
        loader.style.display = "flex";
        setState("currentPageX", currentPageX + 1);
        loadMorePosition(currentPageX + 1);
      }
    }
    if (leftReached) {
      if (currentPageX > 2) {
        isLoading = true;
        onLoadData = true;
        loader.style.display = "flex";
        restorePosition();
      }
    }
  }, 100),
);
