document.addEventListener("DOMContentLoaded", function () {
  try {
    const ids = [1, 2, 3, 4, 5, 6, 7, 8];
    ids.forEach((id) => {
      const el = document.getElementById(`chk-job-level${id}`);
      if (!el) {
        console.warn(`Element #${id} tidak ditemukan`);
        return;
      }

      // Ubah function biasa menjadi async function
      el.addEventListener("scroll", async function () {
        const scrollTop = el.scrollTop;
        const offsetHeight = el.offsetHeight;
        const scrollHeight = el.scrollHeight;
        const scrollBottom = scrollTop + offsetHeight;

        const isTop = scrollTop === 0;
        const isBottom = Math.abs(scrollBottom - scrollHeight) <= 2;
        const pageLevel = getState(`pageLevel${id}`);
        const totalJobLvl = getState(`totalJobLevel${id}`);
        const draftRasciId = getState("draftRasciId");
        let listJabatan = getState("filterJobList");
        // filter listJabatan level = id
        // listJabatan = listJabatan.filter((item) => item.level === id);
        // if (isTop) {
        //   console.log(`[chk-job-level${id}] Mentok atas`);
        // }

        if (isBottom) {
          const totalPages = Math.ceil(totalJobLvl / 10);
          if (pageLevel < totalPages) {
            const payloadJobList = {
              draftRasciId: draftRasciId === "master" ? null : draftRasciId,
              row: pageLevel + 1,
              rowSize: 10,
              sourceLevel: id.toString(),
            };

            const result = await fetchJoblistCard(payloadJobList);
            const jobList = result?.data;

            const combinedData = [
              ...listJabatan,
              ...jobList["level" + id].data.map((item) => ({
                ...item,
                type: `level${id}`,
              })),
            ];
            setState(`pageLevel${id}`, pageLevel + 1);
            setState("filterJobList", combinedData);
            const chkJobLevel = document.getElementById(`chk-job-level${id}`);
            if (chkJobLevel) {
              chkJobLevel.innerHTML = createJobLevelBody(`level${id}`, combinedData, id === 1 ? "hide" : "show");
            }
          }
        }
      });
    });
  } catch (error) {
    console.error("Error in rasci-matrix joblist-card.js:", error);
  }
});
