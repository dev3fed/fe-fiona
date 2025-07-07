document.addEventListener("DOMContentLoaded", async function () {
  console.log("cek");
  try {
    const userList = await fetchUserList();
    console.log("first", userList.data);
    if (userList.data.length > 0) {
      loadTableBodyUser(userList.data);
    }
  } catch (error) {}
});

function loadTableBodyUser(userList) {
  const tableBody = document.getElementById("body-user");
  if (!tableBody) return;
  const fragment = document.createDocumentFragment();
  userList.forEach((val, i) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td scope="row" style="text-align:center">${i + 1}</td>
            <td>${val.employeeId || "-"}</td>
            <td>${val.name || "-"}</td>
            <td>${val.roleName || "-"}</td>
            <td>
            <div class="media-body switch-sm">
                <label class="switch">
                    <input type="checkbox" checked=""><span class="switch-state"></span>
                </label>
                  <label class="ms-2" style="margin-top:10px">
                        ${val.isActive === true ? "Active" : "Inactive"}
                    </label>
            </div>
            </td>
            <td style="width: 120px;text-align:center">
             <button class="btn btn-outline-danger" type="button">
            <i class="icon-trash"></i> Delete
          </button>  
            <button class="btn btn-outline-light" type="button"  onclick="handleEditUser('${val.id}')">
                <i class="icon-marker-alt"></i>
                Edit
              </button>
            </td>
          `;
    fragment.appendChild(row);
  });
  tableBody.appendChild(fragment);
}

function handleEditUser(id) {
  console.log("cek", id);
  const modal = new bootstrap.Modal(document.getElementById("modalEdituser"));
  modal.show();
}
function openFormuser() {
  // open modal by id
  const modal = new bootstrap.Modal(document.getElementById("modalFormuser"));
  modal.show();
}

function togglePasswordVisibility(type) {
  if (type === "password") {
    const passwordInput = document.getElementById("password");
    passwordInput.type = passwordInput.type === "password" ? "text" : "password";
  } else {
    const confirmPasswordInput = document.getElementById("confirmPassword");
    confirmPasswordInput.type = confirmPasswordInput.type === "password" ? "text" : "password";
  }
}
