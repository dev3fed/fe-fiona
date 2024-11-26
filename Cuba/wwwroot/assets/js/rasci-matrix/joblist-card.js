document.addEventListener("dataLoaded", async function () {
  const result = await getState("filterJobList");
  const levels = [1, 2, 3, 4, 5, 6];
  levels.forEach((lvl) => {
    const chkJobLevel = document.getElementById(`chk-job-level${lvl}`);
    if (chkJobLevel) {
      chkJobLevel.innerHTML = createJobLevelBody(`level${lvl}`, result, lvl === 1 ? "hide" : "show");
    }
  });
});
const createParentLabel = (parentId, combinedData) => {
  const parent = combinedData.find((item) => item.id === parentId);
  if (parent) {
    return `<label data-parent="${parentId}" style="font-size: 12px; color:#85858C">${parent.name}</label><br/>`;
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
      label = displayLabel === "show" ? createParentLabel(item.reportToId, combinedData) : "";
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
