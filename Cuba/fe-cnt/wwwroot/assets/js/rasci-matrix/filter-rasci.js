// Event listener ketika DOM siap
document.addEventListener("dataLoaded", async function () {
  try {
    //============================ section start switch btn for card job list ============================//
    const levels = [1, 2, 3, 4, 5, 6];
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

      // Peta untuk mengonversi string menjadi angka
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
            // Ubah dari string menjadi angka berdasarkan levelMapping
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
  updateLevels([1, 2, 3, 4, 5, 6], result);
  const switchAll = document.getElementById("switch-all");
  switchAll.checked = true;
  ["1", "2", "3", "4", "5", "6"].forEach((lvl) => {
    const switchElement = document.getElementById(`switch-level${lvl}`);
    if (switchElement) {
      switchElement.checked = true;
      toggleLevelElements(lvl, false);
    }
  });

  resetRasciNotation();
  resetProssesBusiness();
  setState("disabledJobId", []);
  setState("selectedJobId", []);
  ["1", "2", "3", "4", "5", "6"].forEach((level) => {
    const searchInput = document.getElementById(`search-joblevel${level}`);
    if (searchInput) {
      searchInput.value = "";
    }
  });
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

const applyFilterRasci = async () => {
  const spinner = document.getElementById("loadingSpinner");
  spinner.style.display = "inline-block";
  const isDisabledJobLevel = getState("disabledJobId");
  // const selectedId = getState("selectedJobId") || [];
  // const jobList = getState("filterJobList");
  // let finalSelectedId = [];
  // console.log("jobList", jobList);
  console.log("isDisabledJobLevel", isDisabledJobLevel);
  // const result = jobList.filter((item) => selectedId.includes(item.id));
  // const cekLevel = result.filter((value) => isDisabledJobLevel.includes(value.level));
  // console.log("cekLevel", cekLevel);
  let jobIdFinal = [];
  $('input[name="check_job"]:checked').each(function () {
    const levelJob = parseInt($(this).attr("leveljob"), 10);
    if (!isDisabledJobLevel.includes(levelJob)) {
      jobIdFinal.push(Number(this.value));
    }
  });
  console.log("jobIdFinal", jobIdFinal);
  // if (cekLevel.length > 0) {
  //   const filteredId = selectedId.filter((id) => !cekLevel.some((item) => item.id === id));
  //   finalSelectedId = filteredId;
  // } else {
  //   finalSelectedId = selectedId;
  // }
  // console.log("finalSelectedId", finalSelectedId);
  const payload = {
    parentId: null,
    type: "filter",
    jobId: jobIdFinal,
    busProsLevel: getState("levelFilter"),
    rasciNotation: getState("rasciNotationFilter"),
  };
  const itemsPerPageY = getState("itemsPerPageY");
  const currentPageY = getState("currentPageY");
  const itemsPerPageX = getState("itemsPerPageX");
  const currentPageX = getState("currentPageX");
  const resultMatrix = await fetchDataMatrix(payload);
  const firstPart = resultMatrix?.data.rasciMatrix;
  const outputTbl = {
    businessProcess: resultMatrix?.data.businessProcess.slice(currentPageY, itemsPerPageY),
    jobTitle: resultMatrix?.data.jobTitle.slice(currentPageX, itemsPerPageX),
    rasciMatrix: firstPart,
  };
  if (resultMatrix.status === 200) {
    // resultAllData(resultMatrix?.data);
    // console.log("first", outputTbl);
    // const container = document.getElementById("table-container");
    // new VirtualTable(container, outputTbl.businessProcess, outputTbl.jobTitle);
    // resetTable();
    // resultAllData(outputTbl);
    // setState("storageJabatan", resultMatrix?.data.jobTitle);
    // setState("storageProsbis", resultMatrix?.data.businessProcess);
    // renderRow(currentPageY, itemsPerPageX);
    // setState("currentPageY", currentPageY + 1);

    setTimeout(() => {
      spinner.style.display = "none";
    }, 2000);

    const modalElement = document.getElementById("exampleModal");
    const modal = bootstrap.Modal.getInstance(modalElement);
    setState("isSearchMatrix", true);
    if (modal) {
      modal.hide();
    }
  } else {
    setTimeout(() => {
      spinner.style.display = "none";
    }, 2000);
  }
};
