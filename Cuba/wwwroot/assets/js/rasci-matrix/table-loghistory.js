document.addEventListener("dataLoaded", async function () {
  try {
    const logHistoryData = getState("logHistoryData");
    if (logHistoryData && logHistoryData.length > 0) {
      const tableHistory = document.getElementById("table-history");
      const emptyCard = document.getElementById("empty-history");
      tableHistory.style.display = "block";
      emptyCard.style.display = "none";

      const tblBody = logHistoryData
        .map((data, index) => {
          const nowPlus5 = new Date(Date.now() - 5 * 60000);
          const formattedDate = new Intl.DateTimeFormat("id-ID", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }).format(nowPlus5);
          return `
            <tr>
              <td style="text-align:center">${index + 1}</td>
              <td>${formattedDate}</td>
              <td>${data.user}</td>
              <td>${data.draftName}</td>
              <td>${data.detail}</td>
            </tr>
          `;
        })
        .join("");

      const tableBody = document.getElementById("history-body");
      if (tableBody) {
        tableBody.innerHTML = tblBody;
      }
    }
  } catch (error) {
    console.error("Error loading data history:", error);
  }
});
