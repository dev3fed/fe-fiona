function detailChartPreview(selector, directReport, dataPreview) {
  const getParent = myData.find((item) => item.position == directReport) || {};
  const getGrandParent = myData.find((item) => item.id == getParent?.pid) || {};
  const getFamily = myData.filter((item) => item.pid == getGrandParent?.id) || [];

  console.log("selector", selector);
  console.log("directReport", directReport);
  console.log("dataPreview", dataPreview);
  console.log("getParent", getParent);
  console.log("getGrandParent", getGrandParent);
  console.log("getFamily", getFamily);
  const previewNode = {
    id_position: 999999,
    position: dataPreview?.draftDetail?.positionName,
    id_position_atasan_langsung: getParent?.id,
    layering: "L1",
    gl: "GL0",
    prl: dataPreview?.draftDetail?.prlOrg,
    org_unit_name: dataPreview?.draftDetail?.orgUnitName,
    id_org_unit: 10132408,
    bracket: null,
    depth: 0,
    assistant: false,
    id: 999999,
    pid: getParent?.id,
    jumlah_formasi: dataPreview?.draftDetail?.formation,
    tags: ["edit"],
  };
  console.log("previewNode");
  const myDataPreview = [getGrandParent, ...getFamily, previewNode];
  console.log("myDataPreview", myDataPreview);
  const default_t = Object.assign({}, OrgChart.templates.base);
  default_t.size = [113, 45];
  default_t.ripple = null;
  default_t.img_0 = null;
  default_t.node = `<rect x="0" y="0" height="{h}" width="{w}" fill="#ffffff" stroke-width="1" stroke="#000"></rect>`;
  default_t.position = `<g><text data-width="75" style="font-size:7.5px;" fill="#353238" x="5" y="16" data-text-overflow="multiline">{val}</text></g>`;
  default_t.prl = `<g><rect x="90" y="0" height="23" width="23" fill="#ffffff" stroke-width="1" stroke="#000"></rect><text style="font-size:7px;text-anchor: middle;" fill="#353238" x="101.5" y="14">{val}</text></g>`;
  default_t.jumlah_formasi = `<g><rect x="90" y="22" height="23" width="23" fill="#ffffff" stroke-width="1" stroke="#000"></rect><text style="font-size:7px; text-anchor: middle;" fill="#353238" x="101.5" y="36">{val}</text></g>`;

  default_t.expandCollapseSize = 10;
  default_t.link = `<path stroke-linejoin="round" stroke-width="1" fill="none" d="{edge}" />`;
  default_t.plus = `<g><circle cx="5" cy="5" r="5" class="boc-fill" stroke="#000" stroke-width="1"></circle>
  <line x1="3" y1="5" x2="7" y2="5" stroke-width="1" stroke="#000"></line>
  <line x1="5" y1="3" x2="5" y2="7" stroke-width="1" stroke="#000"></line></g>`;
  default_t.minus = `<g><circle cx="5" cy="5" r="5" class="boc-fill" stroke="#000" stroke-width="1"></circle>
  <line x1="3" y1="5" x2="7" y2="5" stroke-width="1" stroke="#000"></line></g>`;

  OrgChart.templates.split.size = [0, 0];
  OrgChart.templates.split.node = "";
  OrgChart.templates.default_t = default_t;
  OrgChart.templates.default_t.menuButton =
    '<div style="position:absolute;right:0px;top:20px; width:40px;height:50px;cursor:pointer;" data-ctrl-menu="">' +
    '<hr style="background-color: black; height: 3px;margin:0px; border: none;">' +
    '<hr style="background-color: black; height: 3px; border: none;">' +
    '<hr style="background-color: black; height: 3px; border: none;">' +
    "</div>";

  const baseNodeBinding = {
    position: "position",
    prl: "prl",
    jumlah_formasi: "jumlah_formasi",
    org_unit: "org_unit_name",
  };

  function bracketTemplateGenerator(bracketSize) {
    const template = Object.assign({}, OrgChart.templates.default_t);
    template.size = [113, 20];
    for (let i = 0; i < bracketSize; i++) {
      template.size = [template.size[0], template.size[1] + 20];
    }
    template.position = null;
    template.prl = null;
    template.jumlah_formasi = null;
    template.org_unit =
      `<g>` +
      '<rect x="0" y="0" height="23" width="113" fill="#ffffff" stroke-width="1" stroke="#000"></rect>' +
      `<text style="font-size:7.5px;text-anchor: middle;" fill="#353238" x="56.5" y="14">{val}</text>` +
      `</g>`;

    for (let i = 1; i <= bracketSize; i++) {
      const yPosition = 23 + (i - 1) * 20;
      const yTextPosition = 33 + (i - 1) * 20;
      template[`bc_${i}_position`] =
        `<g>` +
        `<rect x="0" y="${yPosition}" height="20" width="113" fill="#ffffff" stroke-width="1" stroke="#000"></rect>` +
        `<text data-width="60" style="font-size:6.5px;" fill="#353238" x="5" y="${yTextPosition}" data-text-overflow="multiline">{val}</text>` +
        `</g>`;
      template[`bc_${i}_prl`] =
        `<g>` +
        `<rect x="70" y="${yPosition}" height="20" width="20" fill="#ffffff" stroke-width="1" stroke="#000"></rect>` +
        `<text style="font-size:6.5px;text-anchor: middle;" fill="#353238" x="80" y="${
          yTextPosition + 4
        }">{val}</text>` +
        `</g>`;
    }

    return template;
  }

  const bracketLimit = 20;

  for (let i = 1; i <= bracketLimit; i++) {
    OrgChart.templates[`bracket_${i}_t`] = bracketTemplateGenerator(i);
  }

  const nodeBinding = {
    ...baseNodeBinding,
  };

  const tags = {};

  for (let i = 1; i <= bracketLimit; i++) {
    for (let key in baseNodeBinding) {
      nodeBinding[`bc_${i}_${key}`] = `bc_${i}_${key}`;
    }
    tags[`bracket_${i}`] = {
      template: `bracket_${i}_t`,
    };
  }

  OrgChart.MIXED_LAYOUT_IF_NUMBER_OF_CHILDREN_IS_MORE_THEN = 6;
  OrgChart.SEARCH_CLOSE_RESULT_ON_ESCAPE_OR_CLICKOUTSIDE = true;

  let chart = new OrgChart(document.getElementById(selector), {
    collapse: {
      level: 2,
      allChildren: true,
    },
    template: "default_t",
    nodeBinding,
    assistantSeparation: 50,
    levelSeparation: 30,
    scaleInitial: OrgChart.match.boundary,
    // disabled sarch
    enableSearch: false,
    // menuButton hide

    layout: OrgChart.treeRightOffset,
    nodes: myDataPreview,
    mixedHierarchyNodesSeparation: 5,
    // showDetailsOnClick: false,
    nodeMouseClick: false,
    toolbar: {
      fullScreen: true,
      zoom: true,
      fit: true,
    },
    tags,
  });

  chart.on("init", function () {
    // const title = document.createElement("button");
    // title.style.position = "absolute";
    // title.style.right = "0px";
    // title.style.top = "87px";
    // title.style.width = "50px";
    // title.style.textAlign = "center";
    // title.style.color = "#757575";
    // title.style.backgroundColor = "transparent";
    // title.style.border = "none";
    // title.style.fontSize = "42px";
    // title.style.color = "grey";

    // title.innerHTML = `<i class="fa fa-refresh"></i>`;
    // // add id to title
    // title.addEventListener("click", function () {
    //   myData.forEach((item) => {
    //     item.tags = item.tags.filter((tag) => tag !== "edit");
    //   });
    //   chart.load(myData);
    // });
    // chart.element.appendChild(title);
    chart.center(999999);
  });

  chart.onExportStart((args) => {
    args.styles += document.getElementById("myStyle").outerHTML;
  });

  chart.onExportEnd((args) => {
    console.log(args);
  });

  chart.onUpdated(() => {});

  chart.on("click", async (sender, node) => {
    const nodeID = node.node.id;
    const param = await detailJobPositionByCode(nodeID);
    await modalJobPopup(param);
  });

  chart.on("searchclick", (sender, node) => {
    let data = myData.find((item) => item.id == node);
    let parentNode = myData.find((item) => item.id == data?.pid) || {};
    let grandParentNode = myData.find((item) => item.id == parentNode?.pid) || {};

    const dataDated = [grandParentNode, parentNode, data];
    chart.load(dataDated);
    data = {
      ...data,
      tags: [...data.tags, "edit"],
    };
    setTimeout(() => {
      chart.updateNode(data);
      chart.center(node);
    }, 500);
    return false;
  });
}
