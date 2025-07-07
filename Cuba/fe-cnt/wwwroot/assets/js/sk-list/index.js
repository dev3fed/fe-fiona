document.addEventListener("DOMContentLoaded", async function () {
  console.log("cek");
  try {
    const skList = await fetchSklist();
    if (skList.data.length > 0) {
      loadTableBodySkList(skList.data);
    }
  } catch (error) {}
});

function loadTableBodySkList(skList) {
  const tableBody = document.getElementById("body-sklist");
  if (!tableBody) return;
  const fragment = document.createDocumentFragment();
  skList.forEach((val, i) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td scope="row" style="text-align:center">${i + 1}</td>
            <td>${val.uploadedAt ? new Date(val.uploadedAt).toLocaleString() : "-"}</td>
            <td>${val.uploadedBy || "-"}</td>
            <td>${val.numberSk || "-"}</td>
           <td style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 200px;" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-custom-class="custom-tooltip" title="${
             val.title
           }">
            ${val.title || "-"}
          </td>
            <td>${val.note || "-"}</td>
             <td style="text-align: center;">
              <button 
                class="btn btn-outline-light"
                type="button"
                onclick="handleOpenDetailSk('${val.id}')"
                style="padding: 4px 6px; font-size: 12px; line-height: 1; display: inline-flex; align-items: center; justify-content: center;">
                <img src="/assets/images/rasci/icon_detail.svg" alt="Detail Icon" style="width: 12px; height: 12px;" />
              </button>
               <button 
                class="btn btn-outline-light"
                type="button"
                style="padding: 4px 6px; font-size: 12px; line-height: 1; display: inline-flex; align-items: center; justify-content: center;">
                <img src="/assets/images/rasci/pencil.svg" alt="Detail Icon" style="width: 12px; height: 12px;" />
              </button>
            </td>

          `;
    fragment.appendChild(row);
  });
  tableBody.appendChild(fragment);
  initializeTooltips();
}

function initializeTooltips() {
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));
}

function openModalUploadsk() {
  const modal = new bootstrap.Modal(document.getElementById("ModalFormsk"));
  modal.show();
}

const handleOpenDetailSk = async (id) => {
  try {
    const modal = new bootstrap.Modal(document.getElementById("ModalPreviewSk"));
    modal.show();

    const result = await fetchDetailSk(id);
    if (!result.data) {
      console.error("PDF data tidak ditemukan.");
      document.getElementById("pdf-container").innerHTML = "<p class='text-danger'>File tidak tersedia.</p>";
      return;
    }

    pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.14.305/pdf.worker.min.js";

    const blob = result.data;
    const pdfUrl = URL.createObjectURL(blob);

    const container = document.getElementById("pdf-container");
    container.innerHTML = "";

    const loadingTask = pdfjsLib.getDocument(pdfUrl);
    const pdf = await loadingTask.promise;

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 1.0 });

      const canvas = document.createElement("canvas");
      canvas.id = `pdf-page-${i}`;
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      canvas.classList.add("mb-4");

      const context = canvas.getContext("2d");
      await page.render({ canvasContext: context, viewport }).promise;

      container.appendChild(canvas);
    }
  } catch (error) {
    console.error("Gagal memuat preview PDF:", error);
    document.getElementById("pdf-container").innerHTML = "<p class='text-danger'>Gagal memuat file PDF.</p>";
  }
};

const handleUploadSk = async () => {
  try {
    const skNumberInput = document.getElementById("sk-number");
    const skTitleInput = document.getElementById("sk-title");
    const skNoteInput = document.getElementById("sk-note");
    const skFileInput = document.getElementById("sk-file");
    const spinner = document.getElementById("loadingUploadsk");
    spinner.style.display = "inline-block";
    if (!skNumberInput || !skTitleInput || !skNoteInput || !skFileInput) {
      console.error("Element input tidak ditemukan di DOM.");
      return;
    }

    const skNumber = skNumberInput.value;
    const skTitle = skTitleInput.value;
    const skNote = skNoteInput.value;
    const skFile = skFileInput.files;

    if (!skFile || skFile.length === 0) {
      console.error("File belum dipilih.");
      return;
    }

    const payload = new FormData();
    payload.append("SkNumber", skNumber);
    payload.append("SkTitle", skTitle);
    payload.append("SkNote", skNote);
    payload.append("File", skFile[0]);

    for (let [key, value] of payload.entries()) {
      console.log(`${key}:`, value);
    }

    const result = await fetchUploadSklist(payload);

    if (result.success) {
      setTimeout(() => {
        const ModalFormsk = document.getElementById("ModalFormsk");
        const modal = bootstrap.Modal.getInstance(ModalFormsk);
        spinner.style.display = "none";
        swal({
          title: "SUCCESS",
          icon: "success",
          buttons: false,
          timer: 2000,
          content: {
            element: "div",
            attributes: {
              innerHTML: `<span style="text-align: center;">SK UPLOADED</span>
              <br>
              <span>Upload successfully</span>
              `,
            },
          },
        }).then(async () => {
          if (modal) {
            modal.hide();
          }
          // set value "" to all input
          skNumberInput.value = "";
          skTitleInput.value = "";
          skNoteInput.value = "";
          skFileInput.value = "";
          // clear all data from table body by id body-sklist
          document.getElementById("body-sklist").innerHTML = "";

          const skList = await fetchSklist();
          if (skList.data.length > 0) {
            loadTableBodySkList(skList.data);
          }
        });
      }, 500);
    } else {
      console.error("Upload gagal:", result.error);
    }
  } catch (error) {
    console.error("Terjadi error saat upload:", error);
  }
};
