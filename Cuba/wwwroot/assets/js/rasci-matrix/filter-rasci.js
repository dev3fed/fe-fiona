// Event listener ketika DOM siap
document.addEventListener("dataLoaded", async function () {
  try {
    //============================ section start switch btn for card job list ============================//
    const levels = [1, 2, 3, 4, 5, 6, 7, 8];
    const switchAll = document.getElementById("switch-all");
    let disabledJobIds = []; // Array untuk melacak level yang dinonaktifkan
    switchAll.addEventListener("change", function () {
      const isDisabled = !this.checked;

      levels.forEach((lvl) => {
        const switchLevel = document.getElementById(`switch-level${lvl}`);
        if (switchLevel) {
          switchLevel.checked = this.checked;
        }
        toggleLevelElements(lvl, isDisabled);
        // Perbarui daftar ID level yang dinonaktifkan
        if (isDisabled) {
          if (!disabledJobIds.includes(lvl)) {
            disabledJobIds.push(lvl);
          }
        } else {
          disabledJobIds = disabledJobIds.filter((id) => id !== lvl);
        }
      });
      // Perbarui state dengan ID level yang dinonaktifkan
      setState("disabledJobId", disabledJobIds);
    });
    levels.forEach((lvl) => {
      const switchLevel = document.getElementById(`switch-level${lvl}`);
      switchLevel.addEventListener("change", function () {
        const isDisabled = !this.checked;
        toggleLevelElements(lvl, isDisabled);
        // Perbarui daftar ID level yang dinonaktifkan
        if (isDisabled) {
          if (!disabledJobIds.includes(lvl)) {
            disabledJobIds.push(lvl);
          }
        } else {
          disabledJobIds = disabledJobIds.filter((id) => id !== lvl);
        }
        // Perbarui state dengan ID level yang dinonaktifkan
        setState("disabledJobId", disabledJobIds);

        const allLevelsChecked = levels.every((level) => {
          const levelSwitch = document.getElementById(`switch-level${level}`);
          return levelSwitch.checked;
        });

        switchAll.checked = allLevelsChecked;
      });
      //============================ section end switch btn for card job list ============================//

      //============================ section start checkbox btn level prosbis  ============================//

      const levelProsbis = ["l1", "l2", "l3", "l4", "l5", "l6"];
      const checkboxAll = document.getElementById("level-lall");

      const levelMapping = {
        l1: 1,
        l2: 2,
        l3: 3,
        l4: 4,
        l5: 5,
        l6: 6,
      };

      function syncCheckboxes() {
        const levelFilter = [];
        levelProsbis.forEach((level) => {
          const checkbox = document.getElementById(`level-${level}`);
          if (checkbox && checkbox.checked) {
            levelFilter.push(levelMapping[level]);
          }
        });
        setState("levelFilter", levelFilter);
        const areAllChecked = levelProsbis.every((level) => document.getElementById(`level-${level}`)?.checked);
        checkboxAll.checked = areAllChecked;
      }

      checkboxAll.addEventListener("change", function () {
        const isChecked = this.checked;
        const levelFilter = isChecked ? levelProsbis.map((level) => levelMapping[level]) : [];
        setState("levelFilter", levelFilter);

        levelProsbis.forEach((level) => {
          const checkbox = document.getElementById(`level-${level}`);
          if (checkbox) {
            checkbox.checked = isChecked;
          }
        });
      });

      levelProsbis.forEach((level) => {
        const checkbox = document.getElementById(`level-${level}`);
        if (checkbox) {
          checkbox.addEventListener("change", syncCheckboxes);
        } else {
          console.error(`Checkbox dengan id 'level-${level}' tidak ditemukan!`);
        }
      });
      //============================ section end checkbox btn level prosbis  ===========================//

      //============================ section start checkbox btn rasci notation  ============================//
      function syncRasciCheckboxes() {
        const notationFilter = [];
        const checkboxes = ["r", "a", "s", "c", "i", "na"];

        checkboxes.forEach((notation) => {
          const checkbox = document.getElementById(`notation-${notation}`);
          if (checkbox.checked) {
            notationFilter.push(notation.toUpperCase()); // Ubah ke huruf besar
          }
        });

        setState("rasciNotationFilter", notationFilter);

        const allChecked = checkboxes.every((notation) => document.getElementById(`notation-${notation}`).checked);
        const notationAll = document.getElementById("notation-all");
        const raChecked = document.getElementById("notation-ra").checked;

        if (allChecked) {
          notationAll.checked = allChecked;
        }

        if (raChecked) {
          ["r", "a", "s", "c", "i"].forEach((notation) => {
            const checkbox = document.getElementById(`notation-${notation}`);
            checkbox.disabled = true;
            checkbox.checked = false;
          });
          notationFilter.push("RA"); // Pastikan juga "ra" diubah menjadi huruf besar
          setState("rasciNotationFilter", notationFilter);
        } else {
          ["r", "a", "s", "c", "i"].forEach((notation) => {
            const checkbox = document.getElementById(`notation-${notation}`);
            checkbox.disabled = false;
          });
        }
      }

      document.getElementById("notation-all").addEventListener("change", function () {
        const isChecked = this.checked;
        const checkboxes = ["r", "a", "s", "c", "i", "na"];
        const checkboxRa = document.getElementById(`notation-ra`);

        if (isChecked) {
          checkboxRa.checked = false;
        }

        checkboxes.forEach((notation) => {
          const checkbox = document.getElementById(`notation-${notation}`);
          if (notation !== "ra") {
            checkbox.checked = isChecked;
          }
        });

        if (!isChecked) {
          setState("rasciNotationFilter", []);
        }

        syncRasciCheckboxes();
      });

      document.getElementById("notation-ra").addEventListener("change", function () {
        const isChecked = this.checked;
        const checkbox = document.getElementById(`notation-all`);

        if (isChecked) {
          checkbox.checked = false;
        }
      });

      ["r", "a", "s", "c", "i", "na"].forEach((notation) => {
        document.getElementById(`notation-${notation}`).addEventListener("change", function () {
          const isChecked = this.checked;
          if (!isChecked) {
            document.getElementById("notation-all").checked = false;
          }

          const allChecked = ["r", "a", "s", "c", "i", "na"].every(
            (notation) => document.getElementById(`notation-${notation}`).checked,
          );

          if (allChecked) {
            document.getElementById("notation-all").checked = true;
          }
        });
      });

      ["r", "a", "s", "c", "i", "na", "ra"].forEach((notation) => {
        const checkbox = document.getElementById(`notation-${notation}`);
        checkbox.addEventListener("change", syncRasciCheckboxes);
      });
      // =========================== section end checkbox btn rasci notation  ============================//
    });
  } catch (error) {
    console.error("Error fetching or loading data:", error);
  }
});

//================================== start reset all proses bisnis level ===========================//
const resetProssesBusiness = async () => {
  const levelProsbis = ["l1", "l2", "l3", "l4", "l5", "l6"];
  const checkboxAll = document.getElementById("level-lall");
  if (checkboxAll) {
    checkboxAll.checked = false; // Uncheck the 'All' checkbox
  }

  levelProsbis.forEach((level) => {
    const checkbox = document.getElementById(`level-${level}`);
    if (checkbox) {
      checkbox.checked = false; // Uncheck each individual level checkbox
    }
  });

  // Reset levelFilter state menjadi array kosong
  setState("levelFilter", []);
};
//==================================== end reset all proses bisnis level ===========================//

//==================== start reset all rasci matrix notation ===========================//
function resetRasciNotation() {
  // Uncheck all checkboxes and reset filter
  document.getElementById("notation-all").checked = false;
  ["r", "a", "s", "c", "i", "na", "ra"].forEach((notation) => {
    const checkbox = document.getElementById(`notation-${notation}`);
    checkbox.checked = false;
  });

  // Reset the rasciNotationFilter state
  setState("rasciNotationFilter", []);
}
//==================== end reset all rasci matrix notation ===========================//

//==================== start reset all filter rasci matrix ===========================//
const resetAllFilterRasci = async () => {
  const result = await getState("filterJobList");
  const resetSpinner = document.getElementById("resetSpinner");
  if (resetSpinner) {
    resetSpinner.style.display = "inline-block";
  }
  setState("disabledJobId", []);
  setState("selectedJobId", []);
  updateLevels([1, 2, 3, 4, 5, 6, 7, 8], result);
  const switchAll = document.getElementById("switch-all");
  switchAll.checked = true;
  ["1", "2", "3", "4", "5", "6", "7", "8"].forEach((lvl) => {
    const switchElement = document.getElementById(`switch-level${lvl}`);
    if (switchElement) {
      switchElement.checked = true;
      toggleLevelElements(lvl, false);
    }
  });

  resetRasciNotation();
  resetProssesBusiness();

  ["1", "2", "3", "4", "5", "6", "7", "8"].forEach((level) => {
    const searchInput = document.getElementById(`search-joblevel${level}`);
    if (searchInput) {
      searchInput.value = "";
    }
  });
  setTimeout(() => {
    resetSpinner.style.display = "none";
  }, 600);
};
//==================== end reset all filter rasci matrix ===========================//
function toggleLevelElements(level, isDisabled) {
  const searchInput = document.getElementById(`search-joblevel${level}`);
  const checkboxes = document.querySelectorAll(`#chk-job-level${level} input[type="checkbox"]`);
  const cardContainer = document.getElementById(`chk-job-level${level}`);
  const card = document.getElementById(`card-level${level}`);
  if (searchInput) {
    searchInput.disabled = isDisabled;
  }

  checkboxes.forEach((checkbox) => {
    checkbox.disabled = isDisabled;
  });

  if (cardContainer) {
    cardContainer.style.pointerEvents = isDisabled ? "none" : "auto";
    cardContainer.style.opacity = isDisabled ? "0.5" : "1";
  }
  if (card) {
    card.style.backgroundColor = isDisabled ? "#F4F4F4" : "";
  }
}

// ============== get all checked value and prl ==============
const getCheckedJobAndPrl = () => {
  const isDisabledJobLevel = getState("disabledJobId");
  const jobList = getState("filterJobList");
  const selectedJobId = getState("selectedJobId") || [];

  const jobIdFinal = [];
  const prlFinal = [];
  const seenJobIds = new Set();

  jobList
    .filter((job) => !isDisabledJobLevel.includes(parseInt(job.levelJob || job.level, 10)))
    .filter((item) => selectedJobId.includes(`${item.id}|${item.prl}`))
    .forEach((item) => {
      if (!seenJobIds.has(item.id)) {
        seenJobIds.add(item.id);
        jobIdFinal.push(item.id);
        prlFinal.push(item.prl);
      }
    });

  return { jobIdFinal, prlFinal };
};

const applyFilterRasci = async () => {
  const spinner = document.getElementById("loadingSpinner");
  const draftSoId = getState("draftSoId");
  const draftRasciId = getState("draftRasciId");
  spinner.style.display = "inline-block";
  const { jobIdFinal, prlFinal } = getCheckedJobAndPrl();
  const payload = {
    draftRasciId: draftRasciId == "master" ? null : draftRasciId,
    unitCode: jobIdFinal,
    prlOrg: prlFinal,
    level: [...getState("levelFilter"), 0],
    rasciNotation: getState("rasciNotationFilter"),
    row: 1,
    rowSize: 15,
  };

  const payloadJob = {
    col: 1,
    colSize: 10,
    level: [...getState("levelFilter"), 0],
    rasciNotation: getState("rasciNotationFilter"),
    draftRasciId: draftRasciId == "master" ? null : draftRasciId,
    draftSoId: draftSoId,
    unitCode: jobIdFinal,
    prlOrg: prlFinal,
    type: "filter",
  };
  const resultPosition = await fetchPositionMatrix(payloadJob);
  setState("idSearchProsbis", "");
  const resultMatrix = await fetchProsbisMatrix(payload);
  const combineIndex = resultMatrix.data.map((val) => val.indexNumber);
  if (resultMatrix.success === true) {
    const modalElement = document.getElementById("exampleModal");
    const modal = bootstrap.Modal.getInstance(modalElement);
    setTimeout(() => {
      spinner.style.display = "none";
      setState("isSearchMatrix", true);
      setState("payloadPosition", payloadJob);
      setState("payloadProsbis", payload);
      setState("actionType", "POS_THEN_BP");
      setState("actionExport", "filterRasci");
      setState("resultProsbis", resultMatrix.data);
      setState("resultJabatan", resultPosition.data);
      setState("totalProsbis", resultMatrix.totalResult);
      setState("totalJob", resultPosition.totalResult);
      loadTableBody(resultMatrix.data);
      loadTableHeader(resultPosition.data);
      mapRasciCells(combineIndex, resultPosition.data);
      setState("currentPageY", 1);
      setState("currentPageX", 1);
      if (modal) {
        modal.hide();
      }
    }, 600);
  }
};
const onModalFilter = async () => {
  try {
    const draftRasciId = getState("draftRasciId");
    const modalFilter = new bootstrap.Modal(document.getElementById("exampleModal"));
    modalFilter.show();
    // const payloadJobList = {
    //   draftRasciId: draftRasciId === "master" ? null : draftRasciId,
    //   isFromUncheck: false,
    //   row: 1,
    //   rowSize: 10,
    //   sourceLevel: "1,2,3,4,5,6,7,8",
    // };
    // console.log("payloadJobList", payloadJobList);
    // const result = await fetchJoblistCard(payloadJobList);
    // const jobList = result?.data;
    // console.log("jobList", jobList);
    // const lvlData = [1, 2, 3, 4, 5, 6, 7, 8];
    // lvlData.forEach((lvl) => {
    //   setState(`totalJobLevel${lvl}`, jobList[`level${lvl}`].pagination.total);
    // });
    // const combinedData = [
    //   ...jobList?.level1.data.map((item) => ({
    //     ...item,
    //     type: "level1",
    //   })),
    //   ...jobList?.level2.data.map((item) => ({
    //     ...item,
    //     type: "level2",
    //   })),
    //   ...jobList?.level3.data.map((item) => ({
    //     ...item,
    //     type: "level3",
    //   })),
    //   ...jobList?.level4.data.map((item) => ({
    //     ...item,
    //     type: "level4",
    //   })),
    //   ...jobList?.level5.data.map((item) => ({
    //     ...item,
    //     type: "level5",
    //   })),
    //   ...jobList?.level6.data.map((item) => ({
    //     ...item,
    //     type: "level6",
    //   })),
    //   ...jobList?.level7.data.map((item) => ({ ...item, type: "level7" })),
    //   ...jobList?.level8.data.map((item) => ({ ...item, type: "level8" })),
    // ];
    // console.log("combinedData", combinedData);
    // setState("filterJobList", combinedData);
    // const levels = [1, 2, 3, 4, 5, 6, 7, 8];

    // levels.forEach((lvl) => {
    //   const chkJobLevel = document.getElementById(`chk-job-level${lvl}`);
    //   if (chkJobLevel) {
    //     chkJobLevel.innerHTML = createJobLevelBody(`level${lvl}`, combinedData, lvl === 1 ? "hide" : "show");
    //   }
    // });
    // addSearchEventListeners();
  } catch (error) {
    console.error("Error fetching or loading data:", error);
  }
};
