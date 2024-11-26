// Event listener ketika DOM siap
document.addEventListener("dataLoaded", async function () {
  try {
    //============================ section start switch btn for card job list ============================//
    const levels = [1, 2, 3, 4, 5, 6];
    const switchAll = document.getElementById("switch-all");
    switchAll.addEventListener("change", function () {
      const isDisabled = !this.checked;

      levels.forEach((lvl) => {
        const switchLevel = document.getElementById(`switch-level${lvl}`);
        if (switchLevel) {
          switchLevel.checked = this.checked;
        }
        toggleLevelElements(lvl, isDisabled);
      });
    });
    levels.forEach((lvl) => {
      const switchLevel = document.getElementById(`switch-level${lvl}`);
      switchLevel.addEventListener("change", function () {
        const isDisabled = !this.checked;
        toggleLevelElements(lvl, isDisabled);
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
  console.log("first levelFilter", getState("levelFilter"));
  console.log("rasciNotationFilter", getState("rasciNotationFilter"));
  console.log("selectedJobId", getState("selectedJobId"));

  const payload = {
    parentId: null,
    type: "filter",
    jobId: getState("selectedJobId"),
    busProsLevel: getState("levelFilter"),
    rasciNotation: getState("rasciNotationFilter"),
  };

  const resultMatrix = await fetchDataMatrix(payload);

  if (resultMatrix.status === 200) {
    // Mendapatkan instance modal dan menutup modal
    resultAllData(resultMatrix?.data);
    const modalElement = document.getElementById("exampleModal");
    const modal = bootstrap.Modal.getInstance(modalElement);
    setState("isSearchMatrix", true);
    if (modal) {
      modal.hide(); // Menutup modal jika ada instance yang valid
    }
  }

  console.log("first", resultMatrix);
};
