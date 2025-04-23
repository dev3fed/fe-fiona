const default_t = Object.assign({}, OrgChart.templates.base);
default_t.size = [220, 70];
default_t.ripple = null;
default_t.img_0 = null;
default_t.node = `<rect x="0" y="0" height="{h}" width="{w}" fill="#ffffff" stroke-width="1" stroke="#000"></rect>`;
default_t.position = `<g><text data-width="140" style="font-size:12px;" text-anchor="middle" dominant-baseline="middle" fill="#353238" x="80" y="25" data-text-overflow="multiline">{val}</text></g>`;
default_t.prl = `<g><rect x="180" y="0" height="35" width="40" fill="#ffffff" stroke-width="1" stroke="#000"></rect><text style="font-size:12px;text-anchor: middle;" fill="#353238" x="200" y="22.5">{val}</text></g>`;
default_t.jumlah_formasi = `<g><rect x="180" y="35" height="35" width="40" fill="#ffffff" stroke-width="1" stroke="#000"></rect><text style="font-size:12px; text-anchor: middle;" fill="#353238" x="200" y="57.5">{val}</text></g>`;

default_t.expandCollapseSize = 10;
// default_t.link = `<path stroke-linejoin="round" stroke-width="1" fill="none" d="{edge}" />`;
default_t.plus = `<g><circle cx="5" cy="5" r="5" class="boc-fill" stroke="#000" stroke-width="1"></circle>
  <line x1="3" y1="5" x2="7" y2="5" stroke-width="1" stroke="#000"></line>
  <line x1="5" y1="3" x2="5" y2="7" stroke-width="1" stroke="#000"></line></g>`;
default_t.minus = `<g><circle cx="5" cy="5" r="5" class="boc-fill" stroke="#000" stroke-width="1"></circle>
  <line x1="3" y1="5" x2="7" y2="5" stroke-width="1" stroke="#000"></line></g>`;
// chaert separation
OrgChart.templates.split = Object.assign({}, OrgChart.templates.base);

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
  level: "level",
};

function bracketTemplateGenerator(bracketSize) {
  const template = Object.assign({}, OrgChart.templates.default_t);
  template.size = [220, 0];
  for (let i = 0; i < bracketSize; i++) {
    template.size = [template.size[0], 120];
  }
  template.position = null;
  template.prl = null;
  template.jumlah_formasi = null;
  template.org_unit =
    `<g>` +
    '<rect x="0" y="0" height="40" width="220" fill="#ffffff" stroke-width="1" stroke="#000"></rect>' +
    `<text style="font-size:11px;text-anchor: middle;" fill="#353238" x="110" y="20">{val}</text>` +
    `</g>`;

  let height = 40;
  for (let i = 1; i <= bracketSize; i++) {
    const yPosition = 40 + (i - 1) * 40;
    const yTextPosition = 60 + (i - 1) * 40;
    height += 40;
    template.size = [template.size[0], height];
    template[`bc_${i}_position`] =
      `<g>` +
      `<rect x="0" y="${yPosition}" height="40" width="140" fill="#ffffff" stroke-width="1" stroke="#000"></rect>` +
      `<text data-width="120" style="font-size:10px;text-anchor: middle;" fill="#353238" x="70" y="${yTextPosition}" data-text-overflow="multiline">{val}</text>` +
      `</g>`;
    template[`bc_${i}_prl`] =
      `<g>` +
      `<rect x="140" y="${yPosition}" height="40" width="40" fill="#ffffff" stroke-width="1" stroke="#000"></rect>` +
      `<text style="font-size:11px;text-anchor: middle;" fill="#353238" x="160" y="${yTextPosition + 4}">{val}</text>` +
      `</g>`;
    template[`bc_${i}_level`] =
      `<g>` +
      `<rect x="180" y="${yPosition}" id="{val}" height="40" width="40" fill="transparent" stroke-width="1" stroke="#000"></rect>` +
      // `<rect x="180" y="${yPosition}" id="{val}" height="40" width="40" fill="#ffffff" stroke-width="1" stroke="#000"></rect>` +
      `</g>`;
    template[`bc_${i}_jumlah_formasi`] =
      `<g>` +
      `<text style="font-size:11px;text-anchor: middle;" fill="#353238" x="200" y="${yTextPosition + 4}">{val}</text>` +
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

// OrgChart.MIXED_LAYOUT_IF_NUMBER_OF_CHILDREN_IS_MORE_THEN = 6;
OrgChart.SEARCH_CLOSE_RESULT_ON_ESCAPE_OR_CLICKOUTSIDE = true;
let options = getOptions();
let chart = new OrgChart(document.getElementById("os-container"), {
  collapse: {
    level: 2,
    allChildren: true,
  },
  template: "default_t",
  nodeBinding,
  enableSearch: false,
  assistantSeparation: 10,
  levelSeparation: 30,
  scaleInitial: OrgChart.match.boundary,
  layout: OrgChart.treeRightOffset,
  nodes: myData,
  align: OrgChart.ORIENTATION,
  movable: OrgChart.movable.node, // moves the node
  // mixedHierarchyNodesSeparation: 5,
  nodeMouseClick: false,
  menu: {
    pdf: { text: "Export PDF" },
    png: { text: "Export PNG" },
    svg: { text: "Export SVG" },
  },
  toolbar: {
    fullScreen: true,
    zoom: true,
    fit: true,
  },
  tags,
});

chart.on("init", function (sender) {
  const title = document.createElement("button");
  title.style.position = "absolute";
  title.style.right = "0px";
  title.style.top = "87px";
  title.style.width = "50px";
  title.style.textAlign = "center";
  title.style.color = "#757575";
  title.style.backgroundColor = "transparent";
  title.style.border = "none";
  title.style.fontSize = "42px";
  title.style.color = "grey";

  title.innerHTML = `<i class="fa fa-refresh"></i>`;
  // add id to title
  title.addEventListener("click", function () {
    myData.forEach((item) => {
      item.tags = item.tags.filter((tag) => tag !== "edit");
    });
    chart.load(myData);
  });
  chart.element.appendChild(title);
});

chart.onExportStart((args) => {
  args.styles += document.getElementById("myStyle").outerHTML;
});

chart.onExportEnd((args) => {
  console.log(args);
});

chart.onUpdated(() => {});

chart.on("expcollclick", function (sender, collapse, id, ids) {});

chart.on("node-layout", function (sender, args) {
  args.layout = OrgChart.treeRightOffset;
  // const nodeElement = args.content.querySelector(".title");
  // nodeElement.innerHTML = args.data.org_unit_name;
});

chart.on("click", async (sender, node) => {
  const nodeID = node.node.id;
  const param = await detailJobPositionByCode(nodeID);
  await modalJobPopup(param);
});

chart.on("searchclick", (sender, node) => {
  return false;
});

$("#searchOrgNodeButton").on("click", function () {
  const searchValue = $("#searchOrgNode").val();
  focusNode(searchValue);
});

function focusNode(nodeId) {
  let data = myData.find((item) => item.id == nodeId);
  let parentNode = myData.find((item) => item.id == data?.pid) || {};
  let grandParentNode = myData.find((item) => item.id == parentNode?.pid) || {};
  let childrenNode = myData.filter((item) => item.pid == nodeId);

  const dataDated = [grandParentNode, parentNode, data, childrenNode];
  chart.load(dataDated);
  data = {
    ...data,
    tags: [...data.tags],
  };
  setTimeout(() => {
    chart.updateNode(data);
    chart.center(nodeId);
  }, 500);
}

function getOptions() {
  const searchParams = new URLSearchParams(window.location.search);
  let fit = searchParams.get("fit");
  let enableSearch = true;
  let scaleInitial = 1;
  if (fit == "yes") {
    enableSearch = false;
    scaleInitial = OrgChart.match.boundary;
  }
  return { enableSearch, scaleInitial };
}
