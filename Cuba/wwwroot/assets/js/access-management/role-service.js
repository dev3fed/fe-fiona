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
            <td style="width: 120px;text-align:center">
               <button class="btn btn-outline-light" type="button" style="width: 100%">
                <i class="icon-marker-alt"></i>
                Edit
              </button>
            </td>
          `;
    fragment.appendChild(row);
  });
  tableBody.appendChild(fragment);
}

function openFormrole() {
  const modal = new bootstrap.Modal(document.getElementById("modalFormrole"));
  modal.show();
}
