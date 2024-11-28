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
    template[`bc_${i}_jumlah_formasi`] =
      `<g>` +
      `<rect x="180" y="${yPosition}" height="40" width="40" fill="#ffffff" stroke-width="1" stroke="#000"></rect>` +
      `<text style="font-size:11px;text-anchor: middle;" fill="#353238" x="200" y="${yTextPosition + 4}">{val}</text>` +
      `</g>`;
    console.log("template", template);
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
    console.log("key", `bc_${i}_${key}`);
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
  assistantSeparation: 10,
  levelSeparation: 30,
  scaleInitial: OrgChart.match.boundary,
  layout: OrgChart.treeRightOffset,
  nodes: myData,
  align: OrgChart.ORIENTATION,
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
  console.log(sender.toolbarUI);
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
  focusNode(node);
  return false;
});

function focusNode(nodeId) {
  let data = myData.find((item) => item.id == nodeId);
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
// OrgChart.templates.base.field_0 =
//   '<text data-width="230" style="font-size: 18px;" fill="#aeaeae" x="125" y="95" text-anchor="middle">{val}</text>';

// var chart = new OrgChart(document.getElementById("os-container"), {
//   layout: OrgChart.mixed,
//   scaleInitial: 0.5,
//   mouseScrool: OrgChart.action.ctrlZoom,
//   template: "base",
//   enableSearch: false,
//   nodeBinding: {
//     field_0: "id",
//   },
// });

// chart.on("node-layout", async function (sender, args) {
//   orgs
// });

// chart.on("init", function () {
//   // chart.expandCollapse(1); // Ensu
// });
// // chart.load(myData);
// chart.load([
//   { id: 1, pid: 0 },
//   { id: 2, pid: 1 },
//   { id: 3, pid: 1 },
//   { id: 4, pid: 1 },
//   { id: 5, pid: 2 },
//   { id: 6, pid: 2 },
//   { id: 7, pid: 3 },
//   { id: 8, pid: 3 },
//   { id: 9, pid: 4 },
//   { id: 10, pid: 4 },
//   { id: 11, pid: 5 },
//   { id: 12, pid: 5 },
//   { id: 13, pid: 6 },
//   { id: 14, pid: 6 },
//   { id: 15, pid: 7 },
//   { id: 16, pid: 7 },
//   { id: 17, pid: 8 },
//   { id: 18, pid: 8 },
//   { id: 19, pid: 9 },
//   { id: 20, pid: 9 },
//   { id: 21, pid: 10 },
//   { id: 22, pid: 10 },
//   { id: 23, pid: 11 },
//   { id: 24, pid: 11 },
//   { id: 25, pid: 12 },
//   { id: 26, pid: 12 },
//   { id: 27, pid: 13 },
//   { id: 28, pid: 13 },
//   { id: 29, pid: 14 },
//   { id: 30, pid: 14 },
//   { id: 31, pid: 15 },
//   { id: 32, pid: 15 },
//   { id: 33, pid: 16 },
//   { id: 34, pid: 16 },
//   { id: 35, pid: 17 },
//   { id: 36, pid: 17 },
//   { id: 37, pid: 18 },
//   { id: 38, pid: 18 },
//   { id: 39, pid: 19 },
//   { id: 40, pid: 19 },
//   { id: 41, pid: 20 },
// ]);

//JavaScript
// var chart = new OrgChart(document.getElementById("os-container"), {
//   // mode: "dark",
//   // mouseScrool: OrgChart.none,
//   collapse: {
//     level: 2,
//     allChildren: true,
//   },
//   nodeBinding: {
//     field_0: "name",
//   },
// });

// function iterate(c, n, nodesToExpand) {
//   if (Array.isArray(n)) {
//     for (var i = 0; i < n.length; i++) {
//       iterate(c, n[i]);
//     }
//     return;
//   }

//   nodesToExpand.push(n.id);
//   for (var i = 0; i < n.stChildrenIds.length; i++) {
//     iterate(c, c.getNode(n.stChildrenIds[i]), nodesToExpand);
//   }

//   for (var i = 0; i < n.childrenIds.length; i++) {
//     iterate(c, c.getNode(n.childrenIds[i]), nodesToExpand);
//   }
// }

// chart.searchUI.on("searchclick", function (sender, args) {
//   var node = sender.instance.getNode(args.nodeId);
//   var nodesToExpand = [];
//   iterate(sender.instance, node, nodesToExpand);
//   chart.expand(args.nodeId, nodesToExpand, function () {
//     sender.instance.center(args.nodeId);
//   });
//   return false;
// });

// chart.on("node-layout", function (sender, args) {
//   console.log("masuk");
//   args.layout = OrgChart.treeRightOffset;

//   // var nodeElement = args.content.querySelector(".title");
//   // nodeElement.innerHTML = args.data.name;
// });

// chart.load(myData);
