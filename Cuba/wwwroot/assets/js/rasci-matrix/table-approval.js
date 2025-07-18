document.addEventListener("dataLoaded", async function () {
  try {
    const approvalData = getState("approvalData");
    if (approvalData && approvalData.length > 0) {
      const tableApproval = document.getElementById("table-approval");
      const emptyCard = document.getElementById("empty-approval");
      tableApproval.style.display = "block";
      emptyCard.style.display = "none";

      const tblBody = approvalData
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
              <td>${data.requestId}</td>
              <td>${data.draftName}</td>
              <td>${data.organizationSource}</td>
              <td>${formattedDate}</td>
              <td>-</td>
              <td>${data.status}</td>
              <td></td>
            </tr>
          `;
        })
        .join("");

      const tableBody = document.getElementById("body-approval");
      if (tableBody) {
        tableBody.innerHTML = tblBody;
      }
    }
  } catch (error) {
    console.error("Error loading data history:", error);
  }
});
