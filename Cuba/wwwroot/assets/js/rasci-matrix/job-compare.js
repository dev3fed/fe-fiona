async function searchJobCompare(event) {
  const inputSearch = event.target.value;
  if (inputSearch.length < 3) return;

  try {
    const { status, data } = await SearchMatrix({ type: "job", search: inputSearch });
    if (status === 200 && data.length) {
      const chkJobList = document.getElementById("chk-job-list");
      const jobSelectedList = document.getElementById("job-selected-list");

      if (!chkJobList || !jobSelectedList) {
        return console.error("Elemen yang dibutuhkan tidak ditemukan.");
      }

      chkJobList.innerHTML = data
        .map(
          (item) => `
        <div class="row-item">
          <div class="column-checkbox">
            <input class="checkbox_animated" type="checkbox" value="${item.id}" data-name="${item.name}">
          </div>
          <div class="column-item-name">
            ${item.name}
          </div>
        </div>
      `,
        )
        .join("");

      chkJobList.addEventListener("change", (e) => {
        if (e.target.classList.contains("checkbox_animated")) {
          const value = e.target.value;
          const name = e.target.getAttribute("data-name");

          if (e.target.checked) {
            if (!document.getElementById(`selected-job-${value}`)) {
              const selectedItem = document.createElement("div");
              selectedItem.className = "selected-item";
              selectedItem.id = `selected-job-${value}`;
              selectedItem.innerHTML = `
                ${name}
                <span class="remove-item" data-value="${value}">
                  <i class="fas fa-times"></i>
                </span>
              `;
              jobSelectedList.appendChild(selectedItem);
            }
          } else {
            const itemToRemove = document.getElementById(`selected-job-${value}`);
            if (itemToRemove) itemToRemove.remove();
          }
        }
      });

      jobSelectedList.addEventListener("click", (e) => {
        if (e.target.closest(".remove-item")) {
          const value = e.target.closest(".remove-item").getAttribute("data-value");
          const checkbox = document.querySelector(`input[type="checkbox"][value="${value}"]`);
          if (checkbox) checkbox.checked = false;
          document.getElementById(`selected-job-${value}`).remove();
        }
      });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function applyCompare() {
  const jobSelectedList = document.getElementById("job-selected-list");
  const selectedItems = Array.from(jobSelectedList.children).map((item) => ({
    id: item.id.replace("selected-job-", ""),
    name: item.textContent.trim(),
  }));
  const sentId = selectedItems.map((item) => item.id);
  const payload = {
    type: "job",
    jobId: sentId,
  };
  try {
    const resultMatrix = await fetchDataMatrix(payload);
    if (resultMatrix.status === 200) {
      resultAllData(resultMatrix?.data);
      selectedJobIds = [];
      const modalElement = document.getElementById("modalJobCompare");
      const modal = bootstrap.Modal.getInstance(modalElement);
      setState("isSearchMatrix", true);
      if (modal) {
        modal.hide();
      }
    }
  } catch (error) {
    console.error("Error fetching data matrix", error);
  }
}

async function handleCloseModal() {
  const chkJobList = document.getElementById("chk-job-list");
  if (chkJobList) {
    chkJobList.innerHTML = "";
  }
  const jobSelectedList = document.getElementById("job-selected-list");
  if (jobSelectedList) {
    jobSelectedList.innerHTML = "";
  }
  const inputSearch = document.getElementById("inputSearchCompare");
  if (inputSearch) {
    inputSearch.value = "";
  }
}
