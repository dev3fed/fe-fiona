/**
 * @type {OrgChart.template}
 */

console.log("myData", myData);

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
      `<text style="font-size:6.5px;text-anchor: middle;" fill="#353238" x="80" y="${yTextPosition + 4}">{val}</text>` +
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

// OrgChart.MIXED_LAYOUT_FOR_NODES_WITH_COLLAPSED_CHILDREN = true;
OrgChart.MIXED_LAYOUT_IF_NUMBER_OF_CHILDREN_IS_MORE_THEN = 6;

let chart = new OrgChart(document.getElementById("os-container"), {
  collapse: {
    level: 2,
    allChildren: true,
  },
  template: "default_t",
  nodeBinding,
  assistantSeparation: 50,
  levelSeparation: 30,
  scaleInitial: OrgChart.match.boundary,
  layout: OrgChart.treeRightOffset,
  nodes: myData,
  mixedHierarchyNodesSeparation: 5,
  // showDetailsOnClick: false,
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

chart.onExportStart((args) => {
  args.styles += document.getElementById("myStyle").outerHTML;
});

chart.onExportEnd((args) => {
  console.log(args);
});

chart.onUpdateNode((args) => {
  //return false; to cancel the operation
  alert("Update Node");
});

chart.onUpdated(() => {
  //Update your server database with this.config.nodes, this.config.clinks, this.config.slinks etc.
  alert("Updated");
});

$("#searchButton").click(function () {
  // chart.remove(30263552);
  // chart.onSearch(30263552);
  chart.goToNode(30263484);

  // chart.getNode(30263484);
  // chart.reload(myData);
  // to certain node
});

// $("#myElement").click(function () {
//   // Code to execute when #myElement is clicked
//   alert("Element clicked!");
// });
// chart clicked event

// chart.on("click", async (sender, node) => {
//   const nodeID = node.node.id;
//   const param = await detailJobPositionByCode(nodeID);
//   await modalJobPopup(param);
// });

chart.on("click", async (sender, node) => {
  // Prevent the default detail view from showing
  // const nodeID = node.node.id;
  // const param = await detailJobPositionByCode(nodeID);
  // await modalJobPopup(param);

  // add tags "edit" to node.id 30258741
  // chart.remove(30258742);
  chart.updateNode({ id: 4, pid: 2, name: "Updated Name", title: "Updated Title", tags: ["edit"] });
  // chart.add({ id: 30258742, tags: ["30258742"] });
  // chart.load();
  // chart.add({ id: 30258742, tags: ["30258742"] });
});

chart.on("search", (sender, results) => {
  // 'results' contains an array of matching nodes
  if (results.length > 0) {
    console.log("Search results:", results);
    alert("Search returned " + results.length + " results!");
  } else {
    alert("No matching results found.");
  }
  // Optional: Customize how results are handled here
});

function iterate(c, n) {
  if (Array.isArray(n)) {
    for (let i = 0; i < n.length; i++) {
      iterate(c, n[i]);
    }
    return;
  }

  console.log(n.id);

  for (let i = 0; i < n.stChildrenIds.length; i++) {
    iterate(c, c.getNode(n.stChildrenIds[i]));
  }

  for (let i = 0; i < n.childrenIds.length; i++) {
    iterate(c, c.getNode(n.childrenIds[i]));
  }

  // if node.id 30258741 add background yellow
  // c.remove(30258741);
  // c.add({ id: 30258741, tags: ["yellow"] });
  chart.getNode(30263484);
}

chart.onInit(() => {
  iterate(chart, chart.roots);
});
// chart on click async and prevent default
// chart.on('click', async (sender, node) => {
//   // prevent default
//   return false;
// });

// chart.onField((args) => {
//   console.log(args);
//   return false;
// });

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

// chart.on("node-layout", function (sender, args) {
//   console.log(args.pnode.id);
//   if (args.pnode.id == 100) {
//     args.layout = OrgChart.treeLeftOffset;
//   } else if (args.pnode.id == 200) {
//     args.layout = OrgChart.tree;
//   } else if (args.pnode.id == 300) {
//     args.layout = OrgChart.treeRightOffset;
//   } else if (args.pnode.id == 400) {
//     args.childrenIds = ["401", "402"];
//   } else if (args.pnode.id == 500) {
//     args.layout = OrgChart.normal;
//   }
// });
// chart.load([
//   { id: "1" },
//   { id: "2", pid: "1" },
//   { id: "3", pid: "1" },
//   { id: "4", pid: "2" },
//   { id: "5", pid: "2" },
//   { id: "6", pid: "2" },
//   { id: "7", pid: "3" },
//   { id: "8", pid: "3" },
//   { id: "9", pid: "3" },
//   { id: "10", pid: "3" },
//   { id: "100", pid: "1" },
//   { id: "101", pid: "100" },
//   { id: "102", pid: "100" },
//   { id: "103", pid: "100" },
//   { id: "200", pid: "1" },
//   { id: "201", pid: "200" },
//   { id: "202", pid: "200" },
//   { id: "203", pid: "200" },
//   { id: "300", pid: "1" },
//   { id: "301", pid: "300" },
//   { id: "302", pid: "300" },
//   { id: "303", pid: "300" },
//   { id: "400", pid: "1" },
//   { id: "401", pid: "400" },
//   { id: "402", pid: "400" },
//   { id: "403", pid: "400" },
//   { id: "500", pid: "1" },
//   { id: "501", pid: "500" },
//   { id: "502", pid: "500" },
//   { id: "503", pid: "500" },
// ]);
