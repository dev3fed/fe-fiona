document.addEventListener("dataLoaded", async function () {
  const result = await getState("filterJobList");
  const levels = [1, 2, 3, 4, 5, 6];
  levels.forEach((lvl) => {
    const chkJobLevel = document.getElementById(`chk-job-level${lvl}`);
    if (chkJobLevel) {
      chkJobLevel.innerHTML = createJobLevelBody(`level${lvl}`, result, lvl === 1 ? "hide" : "show");
    }
  });
  addSearchEventListeners();
});
const createParentLabel = (parentId) => {
  const result = getState("filterJobList");
  const getParent = result.find((item) => item.id === parentId);
  if (getParent) {
    return `<label data-parent="${parentId}" style="font-size: 12px; color:#85858C">${getParent.name}</label><br/>`;
  }
  return "";
};

const createJobLevelBody = (level, combinedData, displayLabel) => {
  let currentReportToId = null;
  let bodyJobLevel = "";

  const filteredData = combinedData.filter((item) => item.type === level);
  filteredData.forEach((item, index) => {
    let label = "";
    let borderBottom = "";
    if (item.reportToId !== currentReportToId) {
      currentReportToId = item.reportToId;
      label = displayLabel === "show" ? createParentLabel(item.reportToId) : "";
    }

    if (index === filteredData.length - 1 || filteredData[index + 1]?.reportToId !== item.reportToId) {
      borderBottom = "<hr/>";
    }

    bodyJobLevel += `
        <div id="group${item.reportToId}">
          ${label}
          <div class="row-item" data-name="${item.name}" data-type="${level}" data-parent-id="${item.reportToId}">
            <div class="column-checkbox">
              <input class="checkbox_animated" type="checkbox" onchange="handleCheckboxChange(event)" levelJob="${item.level}" value="${item.id}" parentId="${item.reportToId}" data-name="${item.name}">
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
  const jobId = Number(checkbox.value);
  const isChecked = checkbox.checked;
  const combinedData = await getState("filterJobList");
  const levelJob = checkbox.getAttribute("levelJob");
  let selectedId = (await getState("selectedJobId")) || [];

  const hierarchyIds = [];
  traverseHierarchy(jobId, combinedData, hierarchyIds);

  if (isChecked) {
    hierarchyIds.forEach((id) => {
      if (!selectedId.includes(id)) {
        selectedId.push(id);
      }
    });
  } else {
    selectedId = selectedId.filter((id) => !hierarchyIds.includes(id));
  }

  await setState("selectedJobId", selectedId);

  const jobList = await getState("filterJobList");
  const result = jobList.filter((item) => selectedId.includes(item.id));

  if (result.length > 0) {
    switch (levelJob) {
      case "1":
        updateLevels([2, 3, 4, 5, 6], result);
        break;
      case "2":
        updateLevels([3, 4, 5, 6], result);
        break;
      case "3":
        updateLevels([4, 5, 6], result);
        break;
      case "4":
        updateLevels([5, 6], result);
        break;
      default:
        updateLevels([6], result);
        break;
    }
  } else {
    const result = await getState("filterJobList");
    const levels = [1, 2, 3, 4, 5, 6];
    levels.forEach((lvl) => {
      const chkJobLevel = document.getElementById(`chk-job-level${lvl}`);
      if (chkJobLevel) {
        chkJobLevel.innerHTML = createJobLevelBody(`level${lvl}`, result, lvl === 1 ? "hide" : "show");
      }
    });
  }
  listChecked(selectedId);
};

const listChecked = (selectedId) => {
  selectedId.forEach((id) => {
    const childCheckbox = document.querySelector(`input[type="checkbox"][value="${id}"]`);
    if (childCheckbox) {
      childCheckbox.checked = true;
    }
  });
};
const traverseHierarchy = (parentId, data, selectedId, visited = new Set()) => {
  if (visited.has(parentId)) return;
  visited.add(parentId);

  if (!selectedId.includes(parentId)) {
    selectedId.push(parentId);
  }

  const children = data.filter((item) => item.reportToId === parentId);
  children.forEach((child) => {
    traverseHierarchy(child.id, data, selectedId, visited);
  });
};

const updateLevels = (levels, result) => {
  levels.forEach((lvl) => {
    const chkJobLevel = document.getElementById(`chk-job-level${lvl}`);
    if (chkJobLevel) {
      chkJobLevel.innerHTML = createJobLevelBody(`level${lvl}`, result, "show");
    }
  });
};

const addSearchEventListeners = () => {
  const levels = [1, 2, 3, 4, 5, 6];
  levels.forEach((lvl) => {
    const searchInput = document.getElementById(`search-joblevel${lvl}`);
    if (searchInput) {
      searchInput.addEventListener("input", (event) => searchJob(event, lvl));
    }
  });
};

const searchJob = async (event, level) => {
  const query = event.target.value.toLowerCase();
  let selectedId = (await getState("selectedJobId")) || [];
  const lowerCaseQuery = query.toLowerCase();
  const result = await getState("filterJobList");
  if (query.length > 4) {
    const filteredResult = result.filter((item) => item.name.toLowerCase().includes(lowerCaseQuery));
    if (selectedId.length > 0) {
      const findDataSelected = filteredResult.filter((value) => selectedId.includes(value.id));
      if (findDataSelected.length > 0) {
        updateLevels([level], filteredResult);
        listChecked(selectedId);
      } else {
        updateLevels([level], filteredResult);
        listChecked(selectedId);
      }
    } else {
      updateLevels([level], filteredResult);
    }
  } else {
    if (selectedId.length > 0) {
      const findJobList = result.filter((value) => selectedId.includes(value.id));
      const cekLevelParent = findJobList.filter((value) => value.level === level - 1);
      if (cekLevelParent.length === 0) {
        updateLevels([level], result);
        listChecked(selectedId);
        return;
      }
      if (level === 1) {
        updateLevels([level], result);
        listChecked(selectedId);
      } else {
        updateLevels([level], findJobList);
        listChecked(selectedId);
      }
    } else {
      updateLevels([level], result);
    }
  }
};

//========================== start reset each jobs level card filter ==========================//
const resetDirekturUtama = async () => {
  const result = await getState("filterJobList");
  updateLevels([1, 2, 3, 4, 5, 6], result);
  setState("selectedJobId", []);
};
const resetVicePresident = async () => {
  const result = await getState("filterJobList");
  const selectedId = await getState("selectedJobId");
  const findJobList = result.filter((value) => selectedId.includes(value.id));
  const cekLevel = findJobList.filter((value) => value.level === 2);
  const descendants = findAllDescendants(cekLevel, result);
  const resetAllId = cekLevel.concat(descendants).map((item) => item.id);
  resetChildrens([2, 3, 4, 5, 6], result, selectedId, resetAllId);
};
const resetManager = async () => {
  const result = await getState("filterJobList");
  const selectedId = await getState("selectedJobId");
  const findJobList = result.filter((value) => selectedId.includes(value.id));
  const cekLevel = findJobList.filter((value) => value.level === 3);
  const descendants = findAllDescendants(cekLevel, result);
  const resetAllId = cekLevel.concat(descendants).map((item) => item.id);
  resetChildrens([3, 4, 5, 6], result, selectedId, resetAllId);
};
const resetAstManager = async () => {
  const result = await getState("filterJobList");
  const selectedId = await getState("selectedJobId");
  const findJobList = result.filter((value) => selectedId.includes(value.id));
  const cekLevel = findJobList.filter((value) => value.level === 4);
  const descendants = findAllDescendants(cekLevel, result);
  const resetAllId = cekLevel.concat(descendants).map((item) => item.id);
  resetChildrens([4, 5, 6], result, selectedId, resetAllId);
};
const resetSupervisor = async () => {
  const result = await getState("filterJobList");
  const selectedId = await getState("selectedJobId");
  const findJobList = result.filter((value) => selectedId.includes(value.id));
  const cekLevel = findJobList.filter((value) => value.level === 5);
  const descendants = findAllDescendants(cekLevel, result);
  const resetAllId = cekLevel.concat(descendants).map((item) => item.id);
  resetChildrens([5, 6], result, selectedId, resetAllId);
};
const resetAnalyst = async () => {
  const result = await getState("filterJobList");
  const selectedId = await getState("selectedJobId");
  const findJobList = result.filter((value) => selectedId.includes(value.id));
  const cekLevel = findJobList.filter((value) => value.level === 6);
  const descendants = findAllDescendants(cekLevel, result);
  const resetAllId = cekLevel.concat(descendants).map((item) => item.id);
  resetChildrens([6], result, selectedId, resetAllId);
};
//========================== end reset each jobs level card filter ==========================//

// ==================== start reset childrens and rerander ===========================//
const resetChildrens = async (level, allJobList, selectedId, resetAllId) => {
  const filteredId = selectedId.filter((id) => !resetAllId.includes(id));
  setState("selectedJobId", filteredId);
  updateLevels(level, allJobList);
};
// ==================== end reset childrens and rerander ===========================//

// ==================== start find all descendants ===========================//
function findAllDescendants(initialData, allJobList) {
  const result = [];
  function traverse(parentId) {
    const children = allJobList.filter((item) => item.reportToId === parentId);
    children.forEach((child) => {
      result.push(child);
      traverse(child.id);
    });
  }
  initialData.forEach((data) => {
    traverse(data.id);
  });

  return result;
}
// ==================== end find all descendants ===========================//
