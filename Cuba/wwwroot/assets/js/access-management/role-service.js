document.addEventListener("DOMContentLoaded", async function () {
  console.log("cek");
  try {
    const roleList = await fetchRoleList();
    console.log("first", roleList.data);
    if (roleList.data.length > 0) {
      loadTableBodyRole(roleList.data);
    }
  } catch (error) {}
});

function loadTableBodyRole(roleList) {
  const tableBody = document.getElementById("body-role");
  if (!tableBody) return;
  const fragment = document.createDocumentFragment();
  roleList.forEach((val, i) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td scope="row" style="text-align:center">${i + 1}</td>
            <td>${val.name || "-"}</td>
            <td>${val.jumlahUser || "0"}</td>
            <td style="width: 180px;text-align:center">
             <button class="btn btn-outline-danger" type="button">
            <i class="icon-trash"></i> Delete
          </button>
               <button class="btn btn-outline-light" type="button" onclick="handleOpenEditRole()">
                <i class="icon-marker-alt"></i>
                Edit
              </button>
            </td>
          `;
    fragment.appendChild(row);
  });
  tableBody.appendChild(fragment);
}

function handleOpenEditRole() {
  const modal = new bootstrap.Modal(document.getElementById("modalEditrole"));
  modal.show();
  const moduleList = [
    {
      menu: "Master Data",
      actionAccess: ["Upload Master Data"],
    },
    {
      menu: "Access Management",
      actionAccess: ["Create User", "Update User", "Create Role", "Update Role"],
    },
    {
      menu: "Organization Structure",
      actionAccess: ["Create New Job", "Create New Job From Existing", "Update Job", "Delete Job", "Export"],
    },
    {
      menu: "RASCI MATRIX",
      actionAccess: [
        "Create Business Process",
        "Update Business Process",
        "Delete Business Process",
        "Create RASCI Notation",
        "Update RASCI Notation",
        "Delete RASCI Notation",
      ],
    },
    {
      menu: "Competency",
      actionAccess: ["Update Competency", "Export"],
    },
    {
      menu: "Job Description",
      actionAccess: ["Create Draft", "Update Draft", "Import", "Export"],
    },
  ];
  const tableBody = document.getElementById("body-editrole");
  if (!tableBody) return;
  const fragment = document.createDocumentFragment();
  moduleList.forEach((val, i) => {
    const row = document.createElement("tr");
    row.innerHTML = `
    <td scope="row" style="text-align:center">
      <label class="checkbox-label" for="checked-body-rbp-${i}">
        <input class="checkbox_animated" id="checked-body-rbp-${i}" type="checkbox">
      </label>
    </td>
    <td>${val.menu || "-"}</td>
   <td style="text-align: left">
     ${val.actionAccess
       .map((access, j) => {
         return `
      <div>
        <input class="checkbox_animated me-2" id="checked-action-${i}-${j}" type="checkbox">
        <label  for="checked-action-${i}-${j}">${access}</label>
      </div>
    `;
       })
       .join("")}

    </td>
  `;
    fragment.appendChild(row);
  });
  tableBody.appendChild(fragment);
}
function openFormrole() {
  const modal = new bootstrap.Modal(document.getElementById("modalFormrole"));
  modal.show();
  const moduleList = [
    {
      menu: "Master Data",
      actionAccess: ["Upload Master Data"],
    },
    {
      menu: "Access Management",
      actionAccess: ["Create User", "Update User", "Create Role", "Update Role"],
    },
    {
      menu: "Organization Structure",
      actionAccess: ["Create New Job", "Create New Job From Existing", "Update Job", "Delete Job", "Export"],
    },
    {
      menu: "RASCI MATRIX",
      actionAccess: [
        "Create Business Process",
        "Update Business Process",
        "Delete Business Process",
        "Create RASCI Notation",
        "Update RASCI Notation",
        "Delete RASCI Notation",
      ],
    },
    {
      menu: "Competency",
      actionAccess: ["Update Competency", "Export"],
    },
    {
      menu: "Job Description",
      actionAccess: ["Create Draft", "Update Draft", "Import", "Export"],
    },
  ];
  const tableBody = document.getElementById("body-permission");
  if (!tableBody) return;
  const fragment = document.createDocumentFragment();
  moduleList.forEach((val, i) => {
    const row = document.createElement("tr");
    row.innerHTML = `
    <td scope="row" style="text-align:center">
      <label class="checkbox-label" for="checked-body-rbp-${i}">
        <input class="checkbox_animated" id="checked-body-rbp-${i}" type="checkbox">
      </label>
    </td>
    <td>${val.menu || "-"}</td>
   <td style="text-align: left">
     ${val.actionAccess
       .map((access, j) => {
         return `
      <div>
        <input class="checkbox_animated me-2" id="checked-action-${i}-${j}" type="checkbox">
        <label  for="checked-action-${i}-${j}">${access}</label>
      </div>
    `;
       })
       .join("")}

    </td>
  `;
    fragment.appendChild(row);
  });
  tableBody.appendChild(fragment);
}
