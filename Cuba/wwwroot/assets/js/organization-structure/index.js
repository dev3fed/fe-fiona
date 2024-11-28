// let processedData = [
//   {
//     id: "node1",
//     text: "Node 1",
//     icon: "icofont icofont-plus font-theme",
//     children: [
//       { id: "child1", text: "Child 1", icon: "icofont icofont-plus font-theme", a_attr: { class: "no-children" } },
//       {
//         id: "child2",
//         text: "Child 2",
//         icon: "icofont icofont-plus font-theme",
//         children: [
//           {
//             id: "child2-1",
//             text: "Child 2-1",
//             icon: "icofont icofont-plus font-theme",
//             a_attr: { class: "no-children" },
//           },
//           {
//             id: "child2-2",
//             text: "Child 2-2",
//             icon: "icofont icofont-plus font-theme",
//             a_attr: { class: "no-children" },
//           },
//         ],
//       },
//     ],
//   },
//   { id: "node2", text: "Node 2", icon: "icofont icofont-plus font-theme", a_attr: { class: "no-children" } },
// ];

$(document).ready(function () {
  // modalDetailJob show
  // alert("modalDetailJob show");
  function createHierarchy(data, parentId = null) {
    return data
      .filter((item) => item.pid === parentId)
      .map((item) => ({
        id: item.id,
        text: item.position,
        icon: "icofont icofont-plus font-theme",
        a_attr: item.a_attr ? null : { class: "no-children" }, // add class if no children
        children: createHierarchy(data, item.id) ?? null,
      }));
  }

  // Generate the hierarchy
  const hierarchicalData = createHierarchy(myData);

  const urlParams = new URLSearchParams(window.location.search);
  const activeTab = urlParams.get("activeTab");
  if (activeTab) {
    const linkTab = "#pills-" + activeTab;
    $(linkTab).tab("show");
  }

  $("#newJob").click(function () {
    localStorage.removeItem("uniqueCode");
    window.location.href = "/organization/detail";
  });

  $("#duplicateJob").click(function () {
    localStorage.removeItem("uniqueCode");
    window.location.href = "/organization/detail?duplicate=true";
  });

  $("#viewOrgTree").click(async function () {
    // $("#modalDetailJob").modal("show");
    //   ").modal("show");
    // const param = await detailJobPositionByCode("30261353");
    // await modalJobPopup(param);
    $("#modalOrgTree").modal("show");
  });

  // const data = createHierarchyData(myData);
  // console.log("data", data);

  $("#orgThree").jstree({
    core: {
      data: hierarchicalData,
      check_callback: true,
    },
    plugins: ["ui", "types"],
    ui: {
      select_limit: 1,
    },
    types: {
      default: {
        icon: false, // Globally disable icons for all nodes
      },
    },
    themes: {
      dots: false, // Remove the connecting lines between nodes
      icons: false, // Disable icons entirely
    },
  });

  // single click value
  $("#orgThree").on("select_node.jstree", function (e, data) {
    console.log(data.node.id);
    const nodeID = data.node.id;
    focusNode(nodeID);
    $("#modalOrgTree").modal("hide");
    // chart.load(dataDated);
  });

  $("#orgThree").on("contextmenu.jstree", ".jstree-anchor", function (e) {
    e.preventDefault(); // Prevent the default context menu from appearing

    const node = $(this).closest(".jstree-node"); // Get the clicked node
    const nodeId = node.attr("id"); // Get the ID of the node

    // Select the node
    $("#orgThree").jstree(true).select_node(nodeId);
  });

  $("#orgThree").on("click", ".jstree-icon.jstree-ocl", function (e) {
    e.stopPropagation(); // Prevent triggering other events
    let nodeId = $(this).closest(".jstree-node").attr("id");
    let node = $("#orgThree").jstree(true).get_node(nodeId);
    const currentIcon = node.icon;
    const newIcon =
      currentIcon === "icofont icofont-plus font-theme"
        ? "icofont icofont-minus font-theme"
        : "icofont icofont-plus font-theme";
    $("#orgThree").jstree(true).set_icon(node, newIcon);
  });

  // $("#add-child").on("click", function () {
  //   const tree = $("#orgThree").jstree(true);
  //   const parentNode = "node1"; // ID of the node to which a child will be added

  //   const newNode = tree.create_node(parentNode, {
  //     text: "New Child",
  //     icon: "icofont icofont-plus font-theme",
  //   });

  //   if (newNode) {
  //     tree.open_node(parentNode);
  //   }
  // });

  getTableListDraft();
  getTableListLog();
});
