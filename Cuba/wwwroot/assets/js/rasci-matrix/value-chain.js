const infoValueChain = async (id) => {
  console.log("cek", id);
  try {
    const result = await fetchAllValueChain(id);
    const dataLeader = result.data.result.find((item) => item.valueType === "lead");
    const dataCore = result.data.result.find((item) => item.valueType === "core");
    const dataSupport = result.data.result.filter((item) => item.valueType === "support");
    const datacritical = result.data.result.filter((item) => item.valueType === "critical");
    let leaderContent = `
        <div class="top-box"
            style=" position: relative; z-index: 2; display: flex; justify-content: center; align-items: center;">
            <span style="display: flex; align-items: center;">
                <span
                    style="border: 1px solid #fff; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; margin-right: 8px; font-size: 16px;">${
                      dataLeader?.indexNumber || 1
                    }</span>
                <span style="font-size: 20px; font-weight: bold;">${dataLeader?.description || "-"}</span>
            </span>
        </div>
        <div style="width: 60px; height: 15px; background: #0b74c7; margin-top: -2px; z-index: 1;"></div>
        <div class="label"
            style="color: #000; position: absolute; top: 65px; left: 50%; transform: translate(-50%, 0);  min-width: 55px; min-height: 40px; width: 90px; height: 40px; font-size: 22px; font-weight: bold; border: 2px solid #888; display: flex; align-items: center; justify-content: center;">
            ${dataLeader?.valueType.toUpperCase() || "LEAD"}
        </div>
        <div style="width: 60px; height: 15px; background: #0b74c7; margin-top: 40px; z-index: 1;"></div>
        <div
            style="width: 120px; height: 0; border-left: 85px solid transparent; border-right: 85px solid transparent; border-top: 45px solid #0b74c7; margin-top: -1px; z-index: 1;">
        </div>=================================
    `;
    let coreContent = `                
            <div class="section core-process" style="margin-bottom: 18px;">
                    <h3 style="font-size: 18px; font-weight: bold; color: #222; margin-bottom: 10px;">Core Process</h3>
                    <div style="
                    background: #07b2f7;
                    color: #fff;
                    border-radius: 6px;
                    padding: 8px;
                    font-weight: bold;
                    font-size: 22px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    width: 100%;
                    margin: auto;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                ">
                    <span style="
                        border: 2px solid #fff;
                        border-radius: 50%;
                        width: 24px;
                        height: 24px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 14px;
                        margin-right: 12px;
                        background: transparent;
                    ">${dataCore?.indexNumber || 2}</span>
                        <span style="font-size: 18px; font-weight: bold;">${dataCore?.description || "-"}</span>
                    </div>
                </div>`;
    let criticalContent = `
        <div class="section critical-process">
            <h3 style="font-size: 18px; font-weight: bold; color: #222; margin-bottom: 10px;">Critical Process</h3>
            <div class="grid"
                style="margin-top: 18px; display: grid; grid-template-columns: repeat(5, 1fr); gap: 15px;">
                ${datacritical
                  .map(
                    (item) => `
                        <div class="box" style="position: relative; padding-top: 20px;">
                            <div style="position: absolute; top: -28px; left: 50%; transform: translateX(-50%);">
                                <div
                                    style="background: #fff; border: 4px solid #399785; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; color: #399785;">
                                    ${item.indexNumber}
                                </div>
                            </div>
                            ${item.description}
                        </div>
                    `,
                  )
                  .join("")}
            </div>
        </div>`;
    // Generate supportContent based on dataSupport array
    let supportContent = `
        <div class="section supporting-process">
            <h3 style="font-size: 18px; font-weight: bold; color: #222; margin-bottom: 10px;">Supporting Process</h3>
            <div class="grid" style="margin-top: 18px; display: flex; flex-direction: column; gap: 18px;">
                <div style="display: flex; gap: 15px;">
                    ${dataSupport
                      .slice(0, 4)
                      .map(
                        (item) => `
                        <div class="box" style="position: relative; padding-top: 20px; flex: 1; min-width: 0; min-height: 100px;">
                            <div style="position: absolute; top: -28px; left: 50%; transform: translateX(-50%);">
                                <div
                                    style="background: #fff; border: 4px solid #74747C; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; color: #74747C;">
                                    ${item.indexNumber}
                                </div>
                            </div>
                            ${item.description}
                        </div>
                    `,
                      )
                      .join("")}
                </div>
                <div style="display: flex; gap: 15px;">
                    ${dataSupport
                      .slice(4, 6)
                      .map(
                        (item) => `
                        <div class="box" style="position: relative; padding-top: 20px; flex: 1; min-width: 0; min-height: 100px;">
                            <div style="position: absolute; top: -28px; left: 50%; transform: translateX(-50%);">
                                <div
                                    style="background: #fff; border: 4px solid #74747C; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; color: #74747C;">
                                    ${item.indexNumber}
                                </div>
                            </div>
                            ${item.description}
                        </div>
                    `,
                      )
                      .join("")}
                </div>
            </div>
        </div>
    `;
    const bodySupport = document.getElementById("supporting-process");
    const bodyCritical = document.getElementById("critical-chain");
    const bodyCore = document.getElementById("core-chain");
    const bodyLeader = document.getElementById("leader-chain");
    if (bodyLeader && bodyCore && bodyCritical && bodySupport) {
      bodyLeader.innerHTML = leaderContent;
      bodyCore.innerHTML = coreContent;
      bodyCritical.innerHTML = criticalContent;
      bodySupport.innerHTML = supportContent;
    }
  } catch (error) {
    console.error("Error fetching value chain:", error);
  }
};
