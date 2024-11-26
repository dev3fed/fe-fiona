// Event listener ketika DOM siap
document.addEventListener("dataLoaded", async function () {
  try {
    const result = await getState("filterJobList");

    await dataListJob(result);
    await addSearchEventListeners();

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

// Fungsi utama untuk memuat data
const dataListJob = async (combinedData) => {
  // Menyusun konten ke dalam level-level yang sesuai
  const levels = [1, 2, 3, 4, 5, 6];
  levels.forEach((lvl) => {
    const chkJobLevel = document.getElementById(`chk-job-level${lvl}`);
    if (chkJobLevel) {
      chkJobLevel.innerHTML = createJobLevelBody(`level${lvl}`, combinedData, lvl === 1 ? "hide" : "show");
    }
  });
};

// Fungsi untuk membuat label parent
const createParentLabel = (parentId, combinedData) => {
  const parent = combinedData.find((item) => item.id === parentId);
  if (parent) {
    return `<label data-parent="${parentId}" style="font-size: 12px; color:#85858C">${parent.name}</label><br/>`;
  }
  return "";
};

// Fungsi untuk membuat body untuk setiap level
const createJobLevelBody = (level, combinedData, displayLabel) => {
  let currentReportToId = null;
  let bodyJobLevel = "";

  // Filter combinedData berdasarkan level
  const filteredData = combinedData.filter((item) => item.type === level);

  filteredData.forEach((item, index) => {
    let label = "";
    let borderBottom = "";

    // Tambahkan label jika reportToId berubah
    if (item.reportToId !== currentReportToId) {
      currentReportToId = item.reportToId;
      label = displayLabel === "show" ? createParentLabel(item.reportToId, combinedData) : "";
    }

    // Tambahkan borderBottom jika ini adalah item terakhir dalam group reportToId
    if (index === filteredData.length - 1 || filteredData[index + 1]?.reportToId !== item.reportToId) {
      borderBottom = "<hr/>";
    }

    bodyJobLevel += `
      <div id="group${item.reportToId}">
        ${label}
        <div class="row-item" data-name="${item.name}" data-type="${level}" data-parent-id="${item.reportToId}">
          <div class="column-checkbox">
            <input class="checkbox_animated" type="checkbox" onchange="handleCheckboxChange(event)" value="${item.id}" parentId="${item.reportToId}" data-name="${item.name}">
          </div>
          <div class="column-item-name" style="font-size:12px">${item.name}</div>
        </div>
        ${borderBottom}
      </div>
    `;
  });

  return bodyJobLevel;
};
const handleCheckboxChange = async (event) => {
  const checkbox = event.target;
  const isChecked = checkbox.checked;
  const jobFilter = getState("jobFilter");
  const levelJobFilter = getState("levelJobFilter");
  const result = await getState("filterJobList");

  const selectedData = result.find((item) => item.id === Number(checkbox.value));
  if (!selectedData) return;

  // Traverse dan update check/uncheck checkbox
  const visited = [...jobFilter];
  traverseAndUpdateCheckboxes(selectedData.id, result, isChecked, visited);
  // Update state dengan visited
  setState("jobFilter", visited);
  setState("levelJobFilter", [...levelJobFilter, selectedData.level]);
  const uniqueLevelJobFilter =
    levelJobFilter.length > 1 && levelJobFilter.length !== new Set(levelJobFilter).size
      ? [...new Set(levelJobFilter)] // Menghapus duplikat jika ada
      : levelJobFilter;
  console.log("first", uniqueLevelJobFilter);
};

// Fungsi traversal dan memperbarui status checkbox
const traverseAndUpdateCheckboxes = (parentId, combinedData, isChecked, visited) => {
  // Jika parentId sudah diproses (untuk checked), hentikan
  if (isChecked && visited.includes(parentId)) {
    return;
  }

  // Tambahkan atau hapus parentId dari visited
  if (isChecked && !visited.includes(parentId)) {
    visited.push(parentId);
  } else if (!isChecked) {
    removeFromVisited(parentId, combinedData, visited);
    return; // Tidak perlu lanjutkan jika uncheck
  }

  // Cari semua turunan
  const relatedData = combinedData.filter((item) => item.reportToId === parentId);

  // Proses setiap turunan
  relatedData.forEach((item) => {
    const checkbox = document.querySelector(`input[type="checkbox"][value="${item.id}"]`);
    if (checkbox) {
      checkbox.checked = isChecked; // Update checkbox
    }
    traverseAndUpdateCheckboxes(item.id, combinedData, isChecked, visited); // Rekursi untuk anak-anak
  });
};

// Fungsi untuk menghapus `id` dan turunannya dari visited
const removeFromVisited = (parentId, combinedData, visited) => {
  const processed = new Set(); // Melacak elemen yang sudah diproses
  const stack = [parentId]; // Gunakan stack untuk iterasi

  while (stack.length > 0) {
    const currentId = stack.pop();

    // Lewati jika sudah diproses
    if (processed.has(currentId)) continue;
    processed.add(currentId);

    // Hapus currentId dari visited
    const index = visited.indexOf(currentId);
    if (index > -1) {
      visited.splice(index, 1);
    }

    // Cari semua turunan
    const children = combinedData.filter((item) => item.reportToId === currentId);

    // Update checkbox dan tambahkan turunan ke stack
    children.forEach((child) => {
      const checkbox = document.querySelector(`input[type="checkbox"][value="${child.id}"]`);
      if (checkbox) {
        checkbox.checked = false; // Set checkbox ke uncheck
      }
      stack.push(child.id); // Tambahkan turunan ke stack
    });
  }
};

const addSearchEventListeners = () => {
  const levels = [1, 2, 3, 4, 5, 6];
  levels.forEach((lvl) => {
    const searchInput = document.getElementById(`search-joblevel${lvl}`);
    if (searchInput) {
      searchInput.addEventListener("input", (event) => searchJob(event, `level${lvl}`));
    }
  });
};
// Simpan status pencarian untuk setiap level
const searchStatus = {
  level1: "",
  level2: "",
  level3: "",
  level4: "",
  level5: "",
  level6: "",
};
const searchJob = async (event, level) => {
  const query = event.target.value.toLowerCase();
  const levelContainer = document.getElementById(`chk-job-${level}`);
  searchStatus[level] = query; // Simpan status pencarian untuk level yang sedang dicari
  const result = await getState("filterJobList");

  if (!levelContainer) return;

  const groups = levelContainer.querySelectorAll(`[id^="group"]`);
  const rowItems = levelContainer.querySelectorAll(".row-item");
  rowItems.forEach((rowItem) => {
    const itemName = rowItem.querySelector(".column-item-name")?.textContent.toLowerCase();
    rowItem.style.display = itemName.includes(query) ? "" : "none";
  });
  if (query.length > 3) {
    const findParent = result.find(
      (item) => item.name.toLowerCase().includes(query.toLowerCase()) && item.type === level,
    );
    groups.forEach((group) => {
      group.style.display = group.id === `group${findParent?.reportToId}` ? "" : "none";
    });
  } else if (query.length <= 3) {
    groups.forEach((group) => {
      group.style.display = "";
    });
  }
};

const applyFilterRasci = async () => {
  console.log("first levelFilter", getState("levelFilter"));
  console.log("rasciNotationFilter", getState("rasciNotationFilter"));
  console.log("jobFilter", getState("jobFilter"));

  const payload = {
    parentId: null,
    type: "filter",
    jobId: getState("jobFilter"),
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
