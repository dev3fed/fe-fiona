var index = 0;
var compact = 0;
var actNdCent = 0;

// Global font sizing function - used by both SVG export and chart rendering
function getFontSize(text, isHeader = false) {
  if (isHeader) {
    if (text.length > 60) return "10px";
    if (text.length > 40) return "11px";
    if (text.length > 20) return "12px";
    return "18px";
  } else {
    // Apply dynamic sizing for non-header text as well
    if (text.length > 60) return "10px";
    if (text.length > 40) return "11px";
    if (text.length > 20) return "12px";
    return "14px";
  }
}

// Helper function to create and style SVG text elements with common attributes
function createStyledSVGText(x, y, text, fontSize, options = {}) {
  const textElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
  textElement.setAttribute("x", x);
  textElement.setAttribute("y", y);
  textElement.setAttribute("text-anchor", options.textAnchor || "middle");
  textElement.setAttribute("dominant-baseline", options.dominantBaseline || "middle");
  textElement.setAttribute("font-size", fontSize);
  textElement.setAttribute("font-weight", options.fontWeight || "bold");
  textElement.setAttribute("fill", options.fill || "#666");
  textElement.setAttribute("font-family", options.fontFamily || "Arial, sans-serif");
  textElement.setAttribute("pointer-events", "none");
  textElement.setAttribute("user-select", "none");
  textElement.setAttribute("contenteditable", "false");
  if (text) textElement.textContent = text;
  return textElement;
}

// Helper function to create SVG rect elements with common attributes
function createStyledSVGRect(x, y, width, height, options = {}) {
  const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rect.setAttribute("x", x);
  rect.setAttribute("y", y);
  rect.setAttribute("width", width);
  rect.setAttribute("height", height);
  rect.setAttribute("fill", options.fill || "none");
  rect.setAttribute("stroke", options.stroke || "black");
  rect.setAttribute("stroke-width", options.strokeWidth || "2");
  rect.setAttribute("stroke-dasharray", options.strokeDashArray || "none");
  if (options.rx) rect.setAttribute("rx", options.rx);
  return rect;
}

function downloadPdf(chart) {
  chart.exportImg({
    save: false,
    full: true,
    onLoad: (base64) => {
      const pdf = new jspdf.jsPDF();
      const img = new Image();
      img.src = base64;
      img.onload = function () {
        pdf.addImage(img, "JPEG", 5, 5, 595 / 3, ((img.height / img.width) * 595) / 3);
        pdf.save("chart.pdf");
      };
    },
  });
}

function convertForeignObjectToSVGText(svgElement) {
  const foreignObjects = svgElement.querySelectorAll("foreignObject");

  // Helper function to wrap text in SVG
  const wrapSVGText = (textElement, text, maxWidth, fontSize) => {
    const words = text.split(" ");
    const lineHeight = parseInt(fontSize) * 1.2; // 120% of font size for line height
    let line = "";
    const lines = [];

    // Calculate approximate character width based on font size
    const charWidth = parseInt(fontSize) * 0.6; // Approximate width per character
    const maxCharsPerLine = Math.floor(maxWidth / charWidth);

    words.forEach((word) => {
      const testLine = line + (line ? " " : "") + word;
      if (testLine.length <= maxCharsPerLine && line.length > 0) {
        line = testLine;
      } else if (line) {
        lines.push(line);
        line = word;
      } else {
        line = word;
      }
    });

    if (line) {
      lines.push(line);
    }

    // Clear existing text content
    textElement.textContent = "";

    // Add each line as a tspan
    lines.forEach((lineText, index) => {
      const tspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
      tspan.textContent = lineText;
      tspan.setAttribute("x", textElement.getAttribute("x"));
      tspan.setAttribute("dy", index === 0 ? "0" : `${lineHeight}px`);
      textElement.appendChild(tspan);
    });

    // Adjust y position to center the multi-line text
    if (lines.length > 1) {
      const totalHeight = lines.length * lineHeight;
      const currentY = parseFloat(textElement.getAttribute("y"));
      const adjustedY = currentY - totalHeight / 2 + lineHeight / 2;
      textElement.setAttribute("y", adjustedY);
    }
  };

  foreignObjects.forEach((foreignObject) => {
    const x = foreignObject.getAttribute("x") || "0";
    const y = foreignObject.getAttribute("y") || "0";
    const width = foreignObject.getAttribute("width") || "220";
    const height = foreignObject.getAttribute("height") || "110";

    let div = foreignObject.querySelector("div");
    // inside this div
    div = div.querySelector("div");
    if (!div) return; // Skip if no div found

    // Get node type from ID
    const nodeType = div.getAttribute("id");

    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");

    // Add class and ID for PowerPoint shape conversion
    group.setAttribute("class", "org-chart-node");
    group.setAttribute("id", `node-${Math.random().toString(36).substr(2, 9)}`);

    if (nodeType === "non-basket-node") {
      // Handle regular non-basket node
      const positionDiv = div.querySelector("div:first-child div");
      const prlDiv = div.querySelector("div:nth-child(2) div:first-child div");
      const formationDiv = div.querySelector("div:nth-child(2) div:nth-child(2) div");

      const position = positionDiv?.textContent || "Unknown";
      const prl = prlDiv?.textContent || "";
      const formation = formationDiv?.textContent || "";

      // Get font sizes using dynamic sizing
      const positionFontSize = getFontSize(position, true);
      const prlFontSize = getFontSize(prl);
      const formationFontSize = getFontSize(formation);

      // Check for border style (detect dotted border from inline styles)
      const divStyle = div.getAttribute("style") || "";
      const isDotted = divStyle.includes("dotted");
      const strokeDashArray = isDotted ? "5,5" : "none";

      // Main border rect
      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("x", x);
      rect.setAttribute("y", y);
      rect.setAttribute("width", width);
      rect.setAttribute("height", height);
      rect.setAttribute("fill", "white");
      rect.setAttribute("stroke", "black");
      rect.setAttribute("stroke-width", "2");
      rect.setAttribute("stroke-dasharray", strokeDashArray);
      group.appendChild(rect);

      // Position section (left side - 70% width)
      const positionRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      const positionWidth = parseFloat(width) * 0.72; // 1.8/(1.8+0.7) = 0.72
      positionRect.setAttribute("x", x);
      positionRect.setAttribute("y", y);
      positionRect.setAttribute("width", positionWidth);
      positionRect.setAttribute("height", height);
      positionRect.setAttribute("fill", "none");
      positionRect.setAttribute("stroke", "black");
      positionRect.setAttribute("stroke-width", "2");
      positionRect.setAttribute("stroke-dasharray", strokeDashArray);
      group.appendChild(positionRect);

      // Position text
      const positionText = document.createElementNS("http://www.w3.org/2000/svg", "text");
      positionText.setAttribute("x", parseFloat(x) + positionWidth / 2);
      positionText.setAttribute("y", parseFloat(y) + parseFloat(height) / 2 + 4);
      positionText.setAttribute("text-anchor", "middle");
      positionText.setAttribute("dominant-baseline", "middle");
      positionText.setAttribute("font-size", positionFontSize);
      positionText.setAttribute("font-weight", "bold");
      positionText.setAttribute("fill", "#666");
      positionText.setAttribute("font-family", "Arial, sans-serif");
      positionText.setAttribute("pointer-events", "none");
      positionText.setAttribute("user-select", "none");
      positionText.setAttribute("contenteditable", "false");

      // Apply text wrapping for long position names
      wrapSVGText(positionText, position, positionWidth - 10, positionFontSize);
      group.appendChild(positionText);

      // Right section (30% width) - split into PRL and Formation
      const rightX = parseFloat(x) + positionWidth;
      const rightWidth = parseFloat(width) - positionWidth;
      const halfHeight = parseFloat(height) / 2;

      // PRL section (top right)
      const prlRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      prlRect.setAttribute("x", rightX);
      prlRect.setAttribute("y", y);
      prlRect.setAttribute("width", rightWidth);
      prlRect.setAttribute("height", halfHeight);
      prlRect.setAttribute("fill", "none");
      prlRect.setAttribute("stroke", "black");
      prlRect.setAttribute("stroke-width", "2");
      prlRect.setAttribute("stroke-dasharray", strokeDashArray);
      group.appendChild(prlRect);

      // PRL text
      const prlText = document.createElementNS("http://www.w3.org/2000/svg", "text");
      prlText.setAttribute("x", rightX + rightWidth / 2);
      prlText.setAttribute("y", parseFloat(y) + halfHeight / 2 + 4);
      prlText.setAttribute("text-anchor", "middle");
      prlText.setAttribute("dominant-baseline", "middle");
      prlText.setAttribute("font-size", prlFontSize);
      prlText.setAttribute("font-weight", "bold");
      prlText.setAttribute("fill", "#666");
      prlText.setAttribute("font-family", "Arial, sans-serif");
      prlText.setAttribute("pointer-events", "none");
      prlText.setAttribute("user-select", "none");
      prlText.setAttribute("contenteditable", "false");

      // Apply text wrapping for PRL text
      wrapSVGText(prlText, prl, rightWidth - 10, prlFontSize);
      group.appendChild(prlText);

      // Formation section (bottom right)
      const formationRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      formationRect.setAttribute("x", rightX);
      formationRect.setAttribute("y", parseFloat(y) + halfHeight);
      formationRect.setAttribute("width", rightWidth);
      formationRect.setAttribute("height", halfHeight);
      formationRect.setAttribute("fill", "none");
      formationRect.setAttribute("stroke", "black");
      formationRect.setAttribute("stroke-width", "2");
      formationRect.setAttribute("stroke-dasharray", strokeDashArray);
      group.appendChild(formationRect);

      // Formation text
      const formationText = document.createElementNS("http://www.w3.org/2000/svg", "text");
      formationText.setAttribute("x", rightX + rightWidth / 2);
      formationText.setAttribute("y", parseFloat(y) + halfHeight + halfHeight / 2 + 4);
      formationText.setAttribute("text-anchor", "middle");
      formationText.setAttribute("dominant-baseline", "middle");
      formationText.setAttribute("font-size", formationFontSize);
      formationText.setAttribute("font-weight", "bold");
      formationText.setAttribute("fill", "#666");
      formationText.setAttribute("font-family", "Arial, sans-serif");
      formationText.setAttribute("pointer-events", "none");
      formationText.setAttribute("user-select", "none");
      formationText.setAttribute("contenteditable", "false");

      // Apply text wrapping for formation text
      wrapSVGText(formationText, formation, rightWidth - 10, formationFontSize);
      group.appendChild(formationText);
    } else if (nodeType === "basket-non-merge-node") {
      // Check for border style (detect dotted border from inline styles)
      const divStyle = div.getAttribute("style") || "";
      const isDotted = divStyle.includes("dotted");
      const strokeDashArray = isDotted ? "5,5" : "none";

      // Get the position name from the first row
      const positionDiv = div.querySelector("div:first-child div");
      const position = positionDiv?.textContent || "Unknown";

      // Get all basket content rows (excluding the position name row)
      const basketRows = div.querySelectorAll("div.node-content");
      const basketContentRows = Array.from(basketRows).slice(1); // Skip the first one (position name)

      // Calculate total height based on number of rows
      const totalRows = basketContentRows.length + 1; // +1 for position name row
      const rowHeight = 50;
      const totalHeight = totalRows * rowHeight;

      // Main container rect
      const containerRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      containerRect.setAttribute("x", x);
      containerRect.setAttribute("y", y);
      containerRect.setAttribute("width", width);
      containerRect.setAttribute("height", totalHeight);
      containerRect.setAttribute("fill", "white");
      containerRect.setAttribute("stroke", "black");
      containerRect.setAttribute("stroke-width", "2");
      containerRect.setAttribute("stroke-dasharray", strokeDashArray);
      group.appendChild(containerRect);

      // Position name section (top row)
      const positionRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      positionRect.setAttribute("x", x);
      positionRect.setAttribute("y", y);
      positionRect.setAttribute("width", width);
      positionRect.setAttribute("height", rowHeight);
      positionRect.setAttribute("fill", "none");
      positionRect.setAttribute("stroke", "black");
      positionRect.setAttribute("stroke-width", "2");
      positionRect.setAttribute("stroke-dasharray", strokeDashArray);
      group.appendChild(positionRect);

      // Position name text
      const positionText = document.createElementNS("http://www.w3.org/2000/svg", "text");
      positionText.setAttribute("x", parseFloat(x) + parseFloat(width) / 2);
      positionText.setAttribute("y", parseFloat(y) + rowHeight / 2 + 4);
      positionText.setAttribute("text-anchor", "middle");
      positionText.setAttribute("dominant-baseline", "middle");
      positionText.setAttribute("font-size", getFontSize(position, true));
      positionText.setAttribute("font-weight", "bold");
      positionText.setAttribute("fill", "#666");
      positionText.setAttribute("font-family", "Arial, sans-serif");
      positionText.setAttribute("pointer-events", "none");
      positionText.setAttribute("user-select", "none");
      positionText.setAttribute("contenteditable", "false");

      // Apply text wrapping for long position names
      wrapSVGText(positionText, position, parseFloat(width) - 10, getFontSize(position, true));
      group.appendChild(positionText);

      // Process each basket row
      basketContentRows.forEach((row, index) => {
        const currentY = parseFloat(y) + (index + 1) * rowHeight;

        // Get the three columns from the row
        const columns = row.querySelectorAll("div");
        const basketName = columns[0]?.textContent || "";
        const prl = columns[1]?.textContent || "";
        const formation = columns[2]?.textContent || "";

        // Calculate column widths (1.8:0.6:0.6 ratio)
        const col1Width = parseFloat(width) * 0.6; // 1.8/(1.8+0.6+0.6) = 0.6
        const col2Width = parseFloat(width) * 0.2; // 0.6/(1.8+0.6+0.6) = 0.2
        const col3Width = parseFloat(width) * 0.2; // 0.6/(1.8+0.6+0.6) = 0.2

        // Column 1: Basket Name
        const col1Rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        col1Rect.setAttribute("x", x);
        col1Rect.setAttribute("y", currentY);
        col1Rect.setAttribute("width", col1Width);
        col1Rect.setAttribute("height", rowHeight);
        col1Rect.setAttribute("fill", "none");
        col1Rect.setAttribute("stroke", "black");
        col1Rect.setAttribute("stroke-width", "2");
        col1Rect.setAttribute("stroke-dasharray", strokeDashArray);
        group.appendChild(col1Rect);

        const col1Text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        col1Text.setAttribute("x", parseFloat(x) + col1Width / 2);
        col1Text.setAttribute("y", currentY + rowHeight / 2 + 4);
        col1Text.setAttribute("text-anchor", "middle");
        col1Text.setAttribute("dominant-baseline", "middle");
        col1Text.setAttribute("font-size", getFontSize(basketName));
        col1Text.setAttribute("font-weight", "bold");
        col1Text.setAttribute("fill", "#666");
        col1Text.setAttribute("font-family", "Arial, sans-serif");
        col1Text.setAttribute("pointer-events", "none");
        col1Text.setAttribute("user-select", "none");
        col1Text.setAttribute("contenteditable", "false");

        // Apply text wrapping for basket name
        wrapSVGText(col1Text, basketName, col1Width - 10, getFontSize(basketName));
        group.appendChild(col1Text);

        // Column 2: PRL
        const col2X = parseFloat(x) + col1Width;
        const col2Rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        col2Rect.setAttribute("x", col2X);
        col2Rect.setAttribute("y", currentY);
        col2Rect.setAttribute("width", col2Width);
        col2Rect.setAttribute("height", rowHeight);
        col2Rect.setAttribute("fill", "none");
        col2Rect.setAttribute("stroke", "black");
        col2Rect.setAttribute("stroke-width", "2");
        col2Rect.setAttribute("stroke-dasharray", strokeDashArray);
        group.appendChild(col2Rect);

        const col2Text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        col2Text.setAttribute("x", col2X + col2Width / 2);
        col2Text.setAttribute("y", currentY + rowHeight / 2 + 4);
        col2Text.setAttribute("text-anchor", "middle");
        col2Text.setAttribute("dominant-baseline", "middle");
        col2Text.setAttribute("font-size", getFontSize(prl));
        col2Text.setAttribute("font-weight", "bold");
        col2Text.setAttribute("fill", "#666");
        col2Text.setAttribute("font-family", "Arial, sans-serif");
        col2Text.setAttribute("pointer-events", "none");
        col2Text.setAttribute("user-select", "none");
        col2Text.setAttribute("contenteditable", "false");

        // Apply text wrapping for PRL text
        wrapSVGText(col2Text, prl, col2Width - 10, getFontSize(prl));
        group.appendChild(col2Text);

        // Column 3: Formation
        const col3X = col2X + col2Width;
        const col3Rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        col3Rect.setAttribute("x", col3X);
        col3Rect.setAttribute("y", currentY);
        col3Rect.setAttribute("width", col3Width);
        col3Rect.setAttribute("height", rowHeight);
        col3Rect.setAttribute("fill", "none");
        col3Rect.setAttribute("stroke", "black");
        col3Rect.setAttribute("stroke-width", "2");
        col3Rect.setAttribute("stroke-dasharray", strokeDashArray);
        group.appendChild(col3Rect);

        const col3Text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        col3Text.setAttribute("x", col3X + col3Width / 2);
        col3Text.setAttribute("y", currentY + rowHeight / 2 + 4);
        col3Text.setAttribute("text-anchor", "middle");
        col3Text.setAttribute("dominant-baseline", "middle");
        col3Text.setAttribute("font-size", getFontSize(formation));
        col3Text.setAttribute("font-weight", "bold");
        col3Text.setAttribute("fill", "#666");
        col3Text.setAttribute("font-family", "Arial, sans-serif");
        col3Text.setAttribute("pointer-events", "none");
        col3Text.setAttribute("user-select", "none");
        col3Text.setAttribute("contenteditable", "false");

        // Apply text wrapping for formation text
        wrapSVGText(col3Text, formation, col3Width - 10, getFontSize(formation));
        group.appendChild(col3Text);
      });
    } else if (nodeType === "basket-merge-node") {
      console.log("Processing basket-merge node:", div);

      // Get the data for this node to see the tags
      const nodeData = div.closest("foreignObject")?.__data__?.data;
      console.log("=== BASKET MERGE NODE DEBUG ===");
      console.log("Node data:", nodeData);
      console.log("Node tags:", nodeData?.tags);

      // Find basket tag and analyze it
      const basketTag = nodeData?.tags?.find((tag) => tag.includes("basket_"));
      console.log("Basket tag:", basketTag);

      if (basketTag) {
        const basketParts = basketTag.split("_");
        console.log("Basket tag parts:", basketParts);
        console.log("Basket level:", basketParts[1]);
        console.log("Formation info:", basketParts.slice(2));
      }

      // Check for border style (detect dotted border from inline styles)
      const divStyle = div.getAttribute("style") || "";
      const isDotted = divStyle.includes("dotted");
      const strokeDashArray = isDotted ? "5,5" : "none";

      // Get the position name from the first row
      const positionDiv = div.querySelector("div:first-child div");
      const position = positionDiv?.textContent || "Unknown";

      // Get the main container with left and right sections
      const mainContainer = div.querySelector("div:nth-child(2)");
      const leftSection = mainContainer?.querySelector("div:first-child");
      const rightSection = mainContainer?.querySelector("div:nth-child(2)");
      console.log("rightSection section:", rightSection);

      // Get position-PRL rows from left section
      const positionPrlRows = leftSection?.querySelectorAll("div.position-prl-class") || [];

      // Get formation bracket rows from right section
      const bracketRows = rightSection?.querySelectorAll("div") || [];

      console.log("Position-PRL rows count:", positionPrlRows.length);
      console.log("Bracket rows count:", bracketRows.length);

      // Log each bracket row's style for height analysis
      bracketRows.forEach((bracketDiv, idx) => {
        const bracketStyle = bracketDiv.getAttribute("style") || "";
        console.log(`Bracket ${idx} style:`, bracketStyle);
        const heightMatch = bracketStyle.match(/height:(\d+)px/);
        const bracketHeight = heightMatch ? parseInt(heightMatch[1]) : 50;
        console.log(`Bracket ${idx} height:`, bracketHeight);
      });

      // Calculate total height based on number of rows
      const totalRows = positionPrlRows.length + 1; // +1 for position name row
      const rowHeight = 50;
      const totalHeight = totalRows * rowHeight;

      // Main container rect
      const containerRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      containerRect.setAttribute("x", x);
      containerRect.setAttribute("y", y);
      containerRect.setAttribute("width", width);
      containerRect.setAttribute("height", totalHeight);
      containerRect.setAttribute("fill", "white");
      containerRect.setAttribute("stroke", "black");
      containerRect.setAttribute("stroke-width", "2");
      containerRect.setAttribute("stroke-dasharray", strokeDashArray);
      group.appendChild(containerRect);

      // Position name section (top row)
      const positionRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      positionRect.setAttribute("x", x);
      positionRect.setAttribute("y", y);
      positionRect.setAttribute("width", width);
      positionRect.setAttribute("height", rowHeight);
      positionRect.setAttribute("fill", "none");
      positionRect.setAttribute("stroke", "black");
      positionRect.setAttribute("stroke-width", "1");
      positionRect.setAttribute("stroke-dasharray", strokeDashArray);
      group.appendChild(positionRect);

      // Position name text
      const positionText = document.createElementNS("http://www.w3.org/2000/svg", "text");
      positionText.setAttribute("x", parseFloat(x) + parseFloat(width) / 2);
      positionText.setAttribute("y", parseFloat(y) + rowHeight / 2 + 4);
      positionText.setAttribute("text-anchor", "middle");
      positionText.setAttribute("dominant-baseline", "middle");
      positionText.setAttribute("font-size", getFontSize(position, true));
      positionText.setAttribute("font-weight", "bold");
      positionText.setAttribute("fill", "#666");
      positionText.setAttribute("font-family", "Arial, sans-serif");
      positionText.setAttribute("pointer-events", "none");
      positionText.setAttribute("user-select", "none");
      positionText.setAttribute("contenteditable", "false");

      // Apply text wrapping for long position names
      wrapSVGText(positionText, position, parseFloat(width) - 10, getFontSize(position, true));
      group.appendChild(positionText);

      // Get the data for this node to extract bc_formation values properly
      console.log("=== EXISTING NODE DATA ===");
      console.log("Node data:", nodeData);
      console.log("Node tags:", nodeData?.tags);

      // Parse bracket information from basket tag (same logic as HTML generation)
      const basketTagForSVG = nodeData?.tags?.find((tag) => tag.includes("basket_"));
      console.log("Basket tag for SVG:", basketTagForSVG);
      console.log("All nodeData tags:", nodeData?.tags);

      // Also try to get from the div class attribute as backup
      const divClasses = div.getAttribute("class") || "";
      console.log("Div classes:", divClasses);
      const classBasketTag = divClasses.split(" ").find((cls) => cls.includes("basket_"));
      console.log("Class basket tag:", classBasketTag);

      // Use either nodeData tags or class attribute
      const finalBasketTag = basketTagForSVG || classBasketTag;
      console.log("Final basket tag:", finalBasketTag);

      const bracketSplitted = finalBasketTag ? finalBasketTag.split("_").slice(2) : [];
      console.log("Bracket splitted for SVG:", bracketSplitted);

      // If no bracket data from tags, try to get from DOM right section
      if (bracketSplitted.length === 0) {
        console.log("No bracket data from tags, checking DOM...");
        console.log("Right section element:", rightSection);
        console.log("Bracket rows from DOM:", bracketRows);
      }

      // Process position-PRL rows and generate brackets using tag-based logic

      // First, generate all position-PRL rows
      Array.from(positionPrlRows).forEach((row, index) => {
        console.log("Processing position-PRL row:", row);
        const currentY = parseFloat(y) + (index + 1) * rowHeight;

        // Get position name and PRL from DOM
        const columns = row.querySelectorAll("div");
        const basketName = columns[0]?.textContent || "";
        const prlFromDOM = columns[1]?.textContent || "18";

        // Left section: Position Name (70% width)
        const leftWidth = parseFloat(width) * 0.8; // 80% for left section
        const leftRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        leftRect.setAttribute("x", x);
        leftRect.setAttribute("y", currentY);
        leftRect.setAttribute("width", leftWidth);
        leftRect.setAttribute("height", rowHeight);
        leftRect.setAttribute("fill", "none");
        leftRect.setAttribute("stroke", "black");
        leftRect.setAttribute("stroke-width", "1");
        leftRect.setAttribute("stroke-dasharray", "none");
        group.appendChild(leftRect);

        // Position Name (70% of left section)
        const positionNameWidth = leftWidth * 0.7;
        const positionNameRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        positionNameRect.setAttribute("x", x);
        positionNameRect.setAttribute("y", currentY);
        positionNameRect.setAttribute("width", positionNameWidth);
        positionNameRect.setAttribute("height", rowHeight);
        positionNameRect.setAttribute("fill", "none");
        positionNameRect.setAttribute("stroke", "black");
        positionNameRect.setAttribute("stroke-width", "1");
        positionNameRect.setAttribute("stroke-dasharray", "none");
        group.appendChild(positionNameRect);

        const positionNameText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        positionNameText.setAttribute("x", parseFloat(x) + positionNameWidth / 2);
        positionNameText.setAttribute("y", currentY + rowHeight / 2 + 4);
        positionNameText.setAttribute("text-anchor", "middle");
        positionNameText.setAttribute("dominant-baseline", "middle");
        positionNameText.setAttribute("font-size", getFontSize(basketName));
        positionNameText.setAttribute("font-weight", "bold");
        positionNameText.setAttribute("fill", "#666");
        positionNameText.setAttribute("font-family", "Arial, sans-serif");
        positionNameText.setAttribute("pointer-events", "none");
        positionNameText.setAttribute("user-select", "none");
        positionNameText.setAttribute("contenteditable", "false");

        // Apply text wrapping for basket name in merge
        wrapSVGText(positionNameText, basketName, positionNameWidth - 10, getFontSize(basketName));
        group.appendChild(positionNameText);

        // PRL (30% of left section)
        const formationX = parseFloat(x) + positionNameWidth;
        const formationWidth = leftWidth - positionNameWidth;
        const formationRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        formationRect.setAttribute("x", formationX);
        formationRect.setAttribute("y", currentY);
        formationRect.setAttribute("width", formationWidth);
        formationRect.setAttribute("height", rowHeight);
        formationRect.setAttribute("fill", "none");
        formationRect.setAttribute("stroke", "black");
        formationRect.setAttribute("stroke-width", "1");
        formationRect.setAttribute("stroke-dasharray", "none");
        group.appendChild(formationRect);

        const formationText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        formationText.setAttribute("x", formationX + formationWidth / 2);
        formationText.setAttribute("y", currentY + rowHeight / 2 + 4);
        formationText.setAttribute("text-anchor", "middle");
        formationText.setAttribute("dominant-baseline", "middle");
        formationText.setAttribute("font-size", getFontSize(prlFromDOM));
        formationText.setAttribute("font-weight", "bold");
        formationText.setAttribute("fill", "#666");
        formationText.setAttribute("font-family", "Arial, sans-serif");
        formationText.setAttribute("pointer-events", "none");
        formationText.setAttribute("user-select", "none");
        formationText.setAttribute("contenteditable", "false");

        // Apply text wrapping for formation text in basket merge
        wrapSVGText(formationText, prlFromDOM, formationWidth - 10, getFontSize(prlFromDOM));
        group.appendChild(formationText);
      });

      // Now generate brackets using tag-based logic (same as HTML generation)
      const rightX = parseFloat(x) + parseFloat(width) * 0.8;
      const rightWidth = parseFloat(width) * 0.2;
      let bracketCurrentY = parseFloat(y) + rowHeight; // Start after position name row

      if (bracketSplitted.length > 0) {
        // Use tag-based approach
        console.log("Using tag-based bracket generation");
        bracketSplitted.forEach((bracket, bracketIndex) => {
          const matchResult = bracket.match(/(\d+)\((\d+)\)/) || ["", "", ""];
          const count = matchResult[1];
          const jumlahFormasiRaw = matchResult[2];
          const getJumlahFormasi = jumlahFormasiRaw || "1";
          const heightPerBracket = (count ? parseInt(count) : 1) * 50;

          console.log(
            `SVG Bracket ${bracketIndex}: count=${count}, formasi=${getJumlahFormasi}, height=${heightPerBracket}px`
          );

          const bracketRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
          bracketRect.setAttribute("x", rightX);
          bracketRect.setAttribute("y", bracketCurrentY);
          bracketRect.setAttribute("width", rightWidth);
          bracketRect.setAttribute("height", heightPerBracket);
          bracketRect.setAttribute("fill", "none");
          bracketRect.setAttribute("stroke", "black");
          bracketRect.setAttribute("stroke-width", "1");
          bracketRect.setAttribute("stroke-dasharray", "none");
          group.appendChild(bracketRect);

          const bracketText = document.createElementNS("http://www.w3.org/2000/svg", "text");
          bracketText.setAttribute("x", rightX + rightWidth / 2);
          bracketText.setAttribute("y", bracketCurrentY + heightPerBracket / 2 + 4);
          bracketText.setAttribute("text-anchor", "middle");
          bracketText.setAttribute("dominant-baseline", "middle");
          bracketText.setAttribute("font-size", "12px");
          bracketText.setAttribute("font-weight", "bold");
          bracketText.setAttribute("fill", "#333");
          bracketText.setAttribute("font-family", "Arial, sans-serif");
          bracketText.setAttribute("pointer-events", "none");
          bracketText.setAttribute("user-select", "none");
          bracketText.setAttribute("contenteditable", "false");
          bracketText.textContent = getJumlahFormasi;
          group.appendChild(bracketText);

          // Move to next bracket position
          bracketCurrentY += heightPerBracket;
        });
      } else {
        // Fallback to DOM-based approach if no tag data
        console.log("Using DOM-based bracket generation as fallback");
        let currentBracketIndex = 0;

        Array.from(positionPrlRows).forEach((row, index) => {
          if (currentBracketIndex < bracketRows.length) {
            const bracketDiv = bracketRows[currentBracketIndex];
            const currentRowY = parseFloat(y) + (index + 1) * rowHeight;

            // Extract formation value from node data
            const bcIndex = index + 1;
            const formationValue = nodeData?.[`bc_${bcIndex}_jumlah_formasi`] || "1";

            // Get the height of this bracket from style
            const bracketStyle = bracketDiv.getAttribute("style") || "";
            const heightMatch = bracketStyle.match(/height:(\d+)px/);
            const bracketHeight = heightMatch ? parseInt(heightMatch[1]) : rowHeight;

            console.log(`DOM Bracket ${currentBracketIndex}: formasi=${formationValue}, height=${bracketHeight}px`);

            const bracketRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            bracketRect.setAttribute("x", rightX);
            bracketRect.setAttribute("y", currentRowY);
            bracketRect.setAttribute("width", rightWidth);
            bracketRect.setAttribute("height", bracketHeight);
            bracketRect.setAttribute("fill", "none");
            bracketRect.setAttribute("stroke", "black");
            bracketRect.setAttribute("stroke-width", "1");
            bracketRect.setAttribute("stroke-dasharray", "none");
            group.appendChild(bracketRect);

            const bracketText = document.createElementNS("http://www.w3.org/2000/svg", "text");
            bracketText.setAttribute("x", rightX + rightWidth / 2);
            bracketText.setAttribute("y", currentRowY + bracketHeight / 2 + 4);
            bracketText.setAttribute("text-anchor", "middle");
            bracketText.setAttribute("dominant-baseline", "middle");
            bracketText.setAttribute("font-size", "12px");
            bracketText.setAttribute("font-weight", "bold");
            bracketText.setAttribute("fill", "#333");
            bracketText.setAttribute("font-family", "Arial, sans-serif");
            bracketText.setAttribute("pointer-events", "none");
            bracketText.setAttribute("user-select", "none");
            bracketText.setAttribute("contenteditable", "false");
            bracketText.textContent = formationValue;
            group.appendChild(bracketText);

            // Only increment if this bracket spans exactly one row
            if (bracketHeight <= rowHeight) {
              currentBracketIndex++;
            }
          }
        });
      }
    } else {
      // Fallback for other node types
      const innerDivs = div?.querySelectorAll("div");
      const name = innerDivs?.[0]?.textContent || "Unknown";
      const position = innerDivs?.[1]?.textContent || "";

      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("x", x);
      rect.setAttribute("y", y);
      rect.setAttribute("width", width);
      rect.setAttribute("height", height);
      rect.setAttribute("rx", "8");
      rect.setAttribute("fill", "#f9f9f9");
      rect.setAttribute("stroke", "#ccc");
      group.appendChild(rect);

      const text1 = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text1.setAttribute("x", parseFloat(x) + 10);
      text1.setAttribute("y", parseFloat(y) + 35);
      text1.setAttribute("font-size", "14px");
      text1.setAttribute("font-weight", "bold");
      text1.setAttribute("fill", "#000");
      text1.setAttribute("font-family", "Arial, sans-serif");
      text1.setAttribute("pointer-events", "none");
      text1.setAttribute("user-select", "none");
      text1.setAttribute("contenteditable", "false");
      text1.textContent = name;
      group.appendChild(text1);

      const text2 = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text2.setAttribute("x", parseFloat(x) + 10);
      text2.setAttribute("y", parseFloat(y) + 55);
      text2.setAttribute("font-size", "12px");
      text2.setAttribute("fill", "#555");
      text2.setAttribute("font-family", "Arial, sans-serif");
      text2.setAttribute("pointer-events", "none");
      text2.setAttribute("user-select", "none");
      text2.setAttribute("contenteditable", "false");
      text2.textContent = position;
      group.appendChild(text2);
    }

    foreignObject.parentNode.replaceChild(group, foreignObject);
  });
}

function prepareAndExportSVG() {
  try {
    const svg = document.querySelector(".chart-container svg");
    if (!svg) {
      console.error("SVG element not found");
      return;
    }

    // just clone the SVG element, so we don't modify the original
    const clonedSvg = svg.cloneNode(true);

    // Remove node button elements before converting to SVG
    const nodeButtonForeignObjects = clonedSvg.querySelectorAll(".node-button-foreign-object");
    nodeButtonForeignObjects.forEach((button) => button.remove());

    // Remove paging button elements as well
    const pagingButtonWrappers = clonedSvg.querySelectorAll(".paging-button-wrapper");
    pagingButtonWrappers.forEach((button) => button.remove());

    convertForeignObjectToSVGText(clonedSvg);

    // Add metadata to help PowerPoint recognize individual nodes
    clonedSvg.setAttribute("data-org-chart", "true");
    clonedSvg.setAttribute("data-node-count", clonedSvg.querySelectorAll(".org-chart-node").length);
    clonedSvg.setAttribute("style", "pointer-events: none; user-select: none;");
    clonedSvg.setAttribute("data-text-editable", "false");

    // Add specific PowerPoint compatibility attributes
    clonedSvg.setAttribute("xmlns:ppt", "http://schemas.microsoft.com/office/powerpoint");
    clonedSvg.setAttribute("ppt:editable", "false");

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(clonedSvg);
    console.log("SVG String length:", svgString.length);

    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "org-chart.svg";
    a.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error in prepareAndExportSVG:", error);
  }
}

let chart = null;
const data = [
  {
    id: 1,
    parentId: null,
    name: "node1",
    position: "CEO", // Sangat singkat (3 chars) - akan 18px
    prl: "18",
    formation: "2000",
    tags: ["create"],
    isMergeFormation: false,
    basket: false,
  },

  {
    id: 99,
    parentId: 1,
    name: "node2",
    position: "Direktur Teknologi Informasi", // Sedang (28 chars) - akan 12px
    tags: [],
    prl: "18",
    formation: "2000",
    isMergeFormation: false,
    basket: false,
  },
  {
    id: 2,
    parentId: 1,
    name: "node2",
    position: "Direktur Sumber Daya Manusia dan Pengembangan Organisasi", // Panjang (57 chars) - akan 11px
    tags: [],
    prl: "18",
    formation: "2000",
    isMergeFormation: false,
    basket: false,
  },
  {
    id: 999,
    parentId: 1,
    name: "node2",
    position: "Direktur Keuangan dan Administrasi Perusahaan serta Pengelolaan Investasi Strategis", // Sangat panjang (83 chars) - akan 10px
    tags: [],
    prl: "18",
    formation: "2000",
    isMergeFormation: false,
    basket: false,
  },
  {
    id: 3,
    parentId: 1,
    name: "node3",
    position: "Chief Financial Officer untuk Divisi Keuangan Internasional dan Manajemen Risiko Bisnis Global", // Sangat panjang (95 chars) - akan 10px
    tags: ["delete", "isCoordinator"],
    prl: "18",
    formation: "2000",
    isMergeFormation: false,
    basket: false,
  },
  {
    id: 4,
    parentId: 1,
    name: "node4",
    position: "Direktur Pemasaran dan Penjualan Regional Asia Pasifik dengan Fokus Pengembangan Pasar Baru asd", // Sangat panjang (92 chars) - akan 10px
    tags: ["basket_3"],
    bc_1_prl: "13-14",
    bc_1_formation: "2",
    bc_1_position: "Manager Senior Pemasaran Digital dan E-Commerce ", // Panjang (78 chars) - akan 10px
    bc_2_prl: "12-13",
    bc_2_formation: "2",
    bc_2_position: "Koordinator Penjualan Ritel dan Distribusi Nasional", // Panjang (52 chars) - akan 11px
    bc_1_flagMergeFormation: "A",
    bc_2_flagMergeFormation: "B",
    bc_3_flagMergeFormation: "B",
    bc_4_flagMergeFormation: "B",
    bc_1_jumlah_formasi: 2,
    bc_2_jumlah_formasi: 3,
    bc_3_jumlah_formasi: 3,
    bc_4_jumlah_formasi: 3,
    bc_3_prl: "11-12",
    bc_3_formation: "2",
    bc_3_position: "Supervisor Tim Analisis Pasar dan Riset Konsumen Berkelanjutan", // Panjang (63 chars) - akan 10px
    bc_4_prl: "11-12",
    bc_4_formation: "1",
    bc_4_position: "Supervisor Tim Analisis Pasar dan Riset Konsumen Berkelanjutan", // Panjang (64 chars) - akan 10px
    prl: "18",
    formation: "2000",
    isMergeFormation: true,
    basket: true,
  },
  {
    id: 5,
    parentId: 2,
    name: "node5",
    position: "Manager Rekrutmen", // Sedang (17 chars) - akan 18px
    tags: [],
    prl: "18",
    formation: "2000",
    isMergeFormation: false,
    basket: false,
  },
  {
    id: 16,
    parentId: 2,
    name: "node6",
    position: "Manager Pengembangan Talenta dan Pelatihan Karyawan", // Panjang (52 chars) - akan 11px
    tags: ["dot-dot"],
    prl: "18",
    formation: "2000",
    isMergeFormation: false,
    basket: false,
  },
  {
    id: 17,
    parentId: 2,
    name: "node7",
    position: "Manager Kompensasi dan Benefit serta Wellness Program untuk Seluruh Karyawan", // Panjang (76 chars) - akan 10px
    tags: ["dot-dot", "basket_1"],
    prl: "18",
    formation: "2000",
    isMergeFormation: false,
    basket: false,
  },
  {
    id: 18,
    parentId: 2,
    name: "node7",
    position: "Manajer Hubungan Industrial dan Kepatuhan Regulasi Ketenagakerjaan Pemerintah", // Panjang (78 chars) - akan 10px
    prl: "18",
    formation: "2000",
    tags: ["basket_3"],
    bc_1_prl: "13-14",
    bc_1_formation: "2000",
    bc_1_position: "Specialist Hubungan Karyawan dan Penyelesaian Konflik Internal", // Panjang (63 chars) - akan 10px
    bc_2_prl: "12-13",
    bc_2_formation: "2000",
    bc_2_position: "Koordinator Kepatuhan Hukum Ketenagakerjaan dan Audit Internal", // Panjang (63 chars) - akan 10px
    bc_3_prl: "12-13",
    bc_3_formation: "2000",
    bc_3_position: "Analis Kebijakan SDM dan Prosedur Operasional Standar Perusahaan", // Panjang (66 chars) - akan 10px
    isMergeFormation: false,
    basket: false,
  },
  {
    id: 19,
    parentId: 2,
    name: "node5",
    position: "Supervisor Training", // Sedang (19 chars) - akan 18px
    tags: [],
    prl: "18",
    formation: "2000",
    isMergeFormation: false,
    basket: false,
  },
  {
    id: 20,
    parentId: 2,
    name: "node5",
    position: "Koordinator Program Pengembangan Karir dan Mentoring untuk Karyawan Muda", // Panjang (73 chars) - akan 10px
    tags: [],
    prl: "18",
    formation: "2000",
    isMergeFormation: false,
    basket: false,
  },
  {
    id: 6,
    parentId: 3,
    name: "node6",
    position: "Manager Audit Internal dan Compliance", // Sedang (38 chars) - akan 12px
    tags: [],
    prl: "18",
    formation: "2000",
    isMergeFormation: false,
    basket: false,
  },
  {
    id: 7,
    parentId: 3,
    name: "node7",
    position: "Manager Perencanaan Keuangan Strategis dan Analisis Investasi Jangka Panjang untuk Ekspansi Bisnis", // Sangat panjang (100 chars) - akan 10px
    tags: ["dot-dot", "basket_1"],
    prl: "18",
    formation: "2000",
    isMergeFormation: false,
    basket: false,
  },
  {
    id: 8,
    parentId: 3,
    name: "node8",
    position: "Manager Treasury dan Cash Management serta Pengelolaan Likuiditas Perusahaan Multinasional", // Sangat panjang (91 chars) - akan 10px
    prl: "18",
    formation: "2000",
    tags: ["basket_2", "isCoordinator"],
    bc_1_prl: "13-14",
    bc_1_formation: "2000",
    bc_1_position: "Senior Analyst Manajemen Kas dan Instrumen Keuangan Derivatif", // Panjang (62 chars) - akan 10px
    bc_2_prl: "12-13",
    bc_2_formation: "2000",
    bc_2_position: "Specialist Perencanaan Budget dan Forecasting Keuangan Tahunan", // Panjang (63 chars) - akan 10px
    isMergeFormation: false,
    basket: false,
  },
];
const dataku = [
  {
    id: 1,
    parentId: null,
    name: "node1",
    position: "CEO", // Sangat singkat (3 chars) - akan 18px
    prl: "18",
    formation: "2000",
    tags: ["create"],
    isMergeFormation: false,
    basket: false,
  },
  {
    id: 4,
    parentId: 1,
    name: "node4",
    position: "Direktur Pemasaran dan Penjualan Strategis Global dengan Tanggung Jawab Internasional yang Sangat Luas",
    tags: ["basket_3"],
    bc_1_flagMergeFormation: "B",
    bc_1_prl: "13-14",
    bc_1_formation: "2",
    bc_1_position: "Manager Senior Basket Utama dengan Spesialisasi Khusus",
    bc_1_jumlah_formasi: 4,
    bc_2_flagMergeFormation: "C",
    bc_2_prl: "12-13",
    bc_2_jumlah_formasi: 1,
    bc_2_formation: "2",
    bc_2_position: "Koordinator Basket Kedua untuk Operasional Harian",
    bc_3_flagMergeFormation: "A",
    bc_3_prl: "11-12",
    bc_3_formation: "1",
    bc_3_position: "Supervisor Basket Ketiga dengan Tanggung Jawab Teknis",
    bc_3_jumlah_formasi: 1,
    bc_4_flagMergeFormation: "A",
    bc_4_prl: "11-12",
    bc_4_formation: "1",
    bc_4_position: "Analis Basket Keempat untuk Penelitian dan Pengembangan Berkelanjutan",
    bc_4_jumlah_formasi: 2,
    bc_5_flagMergeFormation: "A",
    bc_5_prl: "11-12",
    bc_5_formation: "1",
    bc_5_position: "Specialist Basket Kelima dengan Fokus pada Inovasi Teknologi Terdepan",
    bc_5_jumlah_formasi: 2,
    bc_6_flagMergeFormation: "E",
    bc_6_prl: "11-12",
    bc_6_formation: "1",
    bc_6_position: "Konsultan Senior Basket Keenam untuk Strategi Bisnis Jangka Panjang",
    bc_6_jumlah_formasi: 2,
    prl: "18",
    formation: "2000",
    isMergeFormation: true,
    basket: true,
  },
];

// Helper function to handle manual expand button clicking
function handleManualExpandButton(focusNodeId) {
  const expandButtons = document.querySelectorAll("[data-expand]");
  expandButtons.forEach((button) => {
    const nodeData = button.closest("foreignObject")?.__data__;
    if (nodeData && nodeData.data && nodeData.data.id === focusNodeId) {
      console.log(`Found expand button for node ${focusNodeId}, clicking it`);
      button.click();

      // Fit chart after clicking expand button with delay
      setTimeout(() => {
        if (chart) {
          chart.fit();
          console.log("Chart fitted after manual expand button click");
        }
      }, 100);
    }
  });
}

// Helper function to handle node expansion
function handleNodeExpansion(focusNodeId) {
  try {
    console.log(`Attempting to expand node with ID ${focusNodeId}`);

    // Use the chart's expandNode method directly with the node ID
    chart
      .setExpanded(
        focusNodeId, // Use the provided focus node ID
        true // Force expand
      )
      .render();

    // Fit chart after expansion
    chart.fit();
    console.log(`Successfully expanded node with ID ${focusNodeId} and fitted chart`);
  } catch (error) {
    console.log(`Error expanding node with ID ${focusNodeId}:`, error);

    // Alternative approach: try to find and click the expand button
    setTimeout(() => handleManualExpandButton(focusNodeId), 500);
  }
}

// Function to process and prepare chart data
function processChartData(rawData) {
  console.log("Processing chart data...");

  const dataMerged = rawData.filter((item) => item.isMergeFormation && item.basket);

  let tagsCustomMergeArray = [];

  dataMerged.forEach((item) => {
    const dataSelected = item;
    item.tags = item.tags.filter((tag) => !tag.startsWith("basket_"));
    // cari yang key nya ada text "type"
    const getType = Object.entries(dataSelected)
      .filter(([key]) => key.includes("flagMergeFormation"))
      .map(([key, value]) => ({ key, value }));
    const totalBAsket = getType.length;
    let tagCustomMerge = "";
    if (totalBAsket > 0) {
      tagCustomMerge = `basket_${totalBAsket}`;
    }
    const customMergeLabel = "Z";
    getType.forEach((ita, ida) => {
      if (item[ita.key] == null) {
        item[ita.key] = customMergeLabel + String(ida + 1);
        ita.value = customMergeLabel + String(ida + 1);
      }
    });

    // check ada yang value nilai value getType yang sama atu tidak. contoh = [{a:1},{b:2},{c:1}]
    const storeValues = [];
    const uniqueValues = new Set(getType.map((item) => item.value));
    uniqueValues.forEach((value) => {
      const count = getType.filter((item) => item.value === value).length;
      storeValues.push({ value, count });
    });

    storeValues.forEach((itx, index) => {
      const tagFormation = `bc_${index + 1}_jumlah_formasi`;
      // find in item ke includes _flagMergeFormation and value matches itx.value
      const flagMergeFormationKey = Object.keys(item)
        .filter((key) => key.includes("_flagMergeFormation") && item[key] === itx.value)
        .sort((a, b) => {
          return a.localeCompare(b);
        });

      flagMergeFormationKey.forEach((key) => {
        const separation = key.split("_");
        const bracketIndex = separation[1]; // get the index of the bracket
        item[tagFormation] = item[`bc_${bracketIndex}_jumlah_formasi`] || 0; // set jumlah_formasi to count
      });
      tagCustomMerge += `_${itx.count}(${item[tagFormation]})`;
    });
    item.tags.push(tagCustomMerge);
    tagsCustomMergeArray.push(tagCustomMerge);
  });

  console.log("Data processing completed. Processed items:", dataMerged.length);
  console.log("Custom merge tags:", tagsCustomMergeArray);

  return {
    processedData: rawData,
    mergedData: dataMerged,
    customMergeTags: tagsCustomMergeArray,
  };
}

// Function to initialize the organizational chart
function initializeChart(processedDataResult, focusNodeId) {
  console.log("Initializing organizational chart...");

  chart = new d3.OrgChart()
    .nodeHeight(function (d) {
      const isBasket = d.data.tags.some((tag) => tag.includes("basket_"));
      if (isBasket) {
        const basketLevel = d.data.tags.find((tag) => tag.includes("basket_")).split("_")[1];
        const countHeight = 100 + (basketLevel - 1) * 50;
        return countHeight;
      }
      return 100;
    })
    .nodeWidth((d) => 250)
    .childrenMargin((d) => 50)
    .compactMarginBetween((d) => 35)
    .compactMarginPair((d) => 30)
    .neighbourMargin((a, b) => 20)
    .linkUpdate(function (d) {
      d3.select(this).attr("stroke", "black").attr("stroke-width", 1);
      // if tags include isCoordinator doted
      if (d.data.tags.includes("isCoordinator")) {
        d3.select(this).attr("stroke-dasharray", "5,5");
      } else {
        d3.select(this).attr("stroke-dasharray", "none");
      }
    })
    .nodeContent(function (d) {
      const color = {
        create: "#2CAAE5",
        delete: "#FF0000",
        black: "black",
      };

      let colorSelected;
      if (d.data.tags.includes("create")) {
        colorSelected = color.create;
      } else if (d.data.tags.includes("delete")) {
        colorSelected = color.delete;
      } else {
        colorSelected = color.black;
      }

      const borderDot = d.data.tags.includes("dot-dot") ? "dotted" : "solid";
      const borderStyle = `border:2px ${borderDot} ${colorSelected}`;

      const positionFontSize = getFontSize(d.data.position, true);
      const isBasket = d.data.tags.some((tag) => tag.includes("basket_"));

      if (isBasket && !d.data.isMergeFormation) {
        // ========= BASKET NON-MERGE NODE =========
        const basketLevel = d.data.tags.find((tag) => tag.includes("basket_")).split("_")[1];

        // Generate basket rows based on basketLevel
        let basketRows = "";
        for (let i = 1; i <= basketLevel; i++) {
          const bcPrl = d.data[`bc_${i}_prl`] || d.data.prl;
          const bcFormation = d.data[`bc_${i}_formation`] || d.data.jumlah_formasi;
          const bcPositionName = d.data[`bc_${i}_position`] || `Basket ${i}`;
          const basketNameFontSize = getFontSize(bcPositionName);
          const prlFontSize = getFontSize(bcPrl);
          const formationFontSize = getFontSize(bcFormation);

          basketRows += `
                  <div class="node-content" style="width:100%;height:50px;display:flex;align-items:center;justify-content:center;${
                    i < basketLevel ? `border-bottom:2px ${borderDot} ${colorSelected};` : ""
                  }">
                    <div style="flex:1.8;font-size:${basketNameFontSize};color:#666;text-align:center;font-weight:bold;display:flex;align-items:center;justify-content:center;height:100%;overflow:hidden;word-wrap:break-word;padding:2px;">${bcPositionName}</div>
                    <div style="flex:0.6;font-size:${prlFontSize};color:#666;text-align:center;font-weight:bold;display:flex;align-items:center;justify-content:center;height:100%;border-left:2px ${borderDot} ${colorSelected};overflow:hidden;padding:2px;">${bcPrl}</div>
                    <div style="flex:0.6;font-size:${formationFontSize};color:#666;text-align:center;font-weight:bold;display:flex;align-items:center;justify-content:center;height:100%;border-left:2px ${borderDot} ${colorSelected};overflow:hidden;padding:2px;">${bcFormation}</div>
                  </div>
                `;
        }

        return `
                <div id="basket-non-merge-node" style="width:${d.width}px;height:${d.height}px;display:flex;flex-direction:column;${borderStyle};background-color:white;">
                  <div class="node-content" style="width:100%;height:50px;display:flex;align-items:center;justify-content:center;border-bottom:2px ${borderDot} ${colorSelected};overflow:hidden;">
                    <div style="font-size:${positionFontSize};color:#666;text-align:center;font-weight:bold;padding:2px;overflow:hidden;word-wrap:break-word;">${d.data.position}</div>
                  </div>
                  ${basketRows}
                </div>
              `;
      } else if (isBasket && d.data.isMergeFormation) {
        // ========= BASKET MERGE NODE =========
        const basketLevel = d.data.tags.find((tag) => tag.includes("basket_")).split("_")[1];
        const bracketSplitted = d.data.tags
          .find((tag) => tag.includes("basket_"))
          .split("_")
          .slice(2);

        // Generate bracket divs
        let bracketDivs = "";
        for (const bracket of bracketSplitted) {
          console.log(`Processing bracket: ${bracket} for basket level ${basketLevel}`);
          // contoh jika bracket = "3(2)"
          // maka getJumlahFormasi = 2
          // dan count = 3
          const matchResult = bracket.match(/(\d+)\((\d+)\)/) || [];
          const count = matchResult[1]; // ambil group pertama (angka sebelum kurung)
          const jumlahFormasiRaw = matchResult[2]; // ambil group kedua (angka dalam kurung)
          console.log(`Bracket count: ${count}, jumlahFormasiRaw: ${jumlahFormasiRaw}`);
          const getJumlahFormasi = jumlahFormasiRaw || "1";
          const heightPerBracket = (count ? parseInt(count) : 1) * 50;

          bracketDivs += `
                  <div style="border-bottom:1px solid black;width:100%;height:${heightPerBracket}px;display:flex;align-items:center;justify-content:center;overflow:hidden;">
                    <div style="width:100%;height:${heightPerBracket}px;display:flex;align-items:center;justify-content:center;overflow:hidden;">
                      <div style="font-size:12px;color:#333;text-align:center;font-weight:bold;padding:2px;overflow:hidden;">${getJumlahFormasi}</div>
                    </div>
                  </div>
                `;
        }

        // Generate basket rows
        let basketRows = "";
        for (let i = 1; i <= basketLevel; i++) {
          const bcPrl = d.data[`bc_${i}_prl`] || d.data.prl;
          const bcPositionName = d.data[`bc_${i}_position`] || `Basket ${i}`;
          const basketNameFontSize = getFontSize(bcPositionName);
          const prlFontSize = getFontSize(bcPrl);

          basketRows += `
                  <div class="position-prl-class" style="width:100%;height:50px;display:flex;align-items:center;justify-content:center;border-bottom:1px solid black;overflow:hidden;">
                    <div style="width:70%;font-size:${basketNameFontSize};color:#666;text-align:center;font-weight:bold;display:flex;align-items:center;justify-content:center;height:100%;border-right:1px solid black;overflow:hidden;word-wrap:break-word;padding:2px;">${bcPositionName}</div>
                    <div style="width:30%;font-size:${prlFontSize};color:#666;text-align:center;font-weight:bold;display:flex;align-items:center;justify-content:center;height:100%;overflow:hidden;padding:2px;">${bcPrl}</div>
                  </div>
                `;
        }

        return `
                <div id="basket-merge-node" class="basket-merge ${d.data.tags.find((tag) =>
                  tag.includes("basket_")
                )}" style="width:${d.width}px;height:${
          d.height
        }px;display:flex;flex-direction:column;${borderStyle};background-color:white;">
                  <div class="node-content" style="width:100%;height:50px;display:flex;align-items:center;justify-content:center;border-bottom:1px ${borderDot} ${colorSelected};overflow:hidden;">
                    <div style="font-size:${positionFontSize};color:#666;text-align:center;font-weight:bold;padding:2px;overflow:hidden;word-wrap:break-word;">${
          d.data.position
        }</div>
                  </div>
                  <div style="display:flex;flex-direction:row;align-items:stretch;">
                    <div style="width:80%;display:flex;flex-direction:column;">
                      ${basketRows}
                    </div>
                    <div style="width:20%;display:flex;flex-direction:column;border-left:1px solid black;">
                      ${bracketDivs}
                    </div>
                  </div>
                </div>
              `;
      } else {
        // ========= NON-BASKET NODE =========
        const prlFontSize = getFontSize(d.data.prl);
        const formationFontSize = getFontSize(d.data.jumlah_formasi);

        return `
                <div id="non-basket-node" style="width:${d.width}px;height:${d.height}px;display:flex;${borderStyle};background-color:white;">
                  <div class="node-content" style="flex:1.8;height:100%;border-right:2px ${borderDot} ${colorSelected};display:flex;align-items:center;justify-content:center;overflow:hidden;">
                    <div style="font-size:${positionFontSize};color:#666;text-align:center;font-weight:bold;padding:2px;overflow:hidden;word-wrap:break-word;">${d.data.position}</div>
                  </div>
                  <div style="flex:0.7;height:100%;display:flex;flex-direction:column;">
                    <div class="node-content" style="width:100%;flex:1;border-bottom:2px ${borderDot} ${colorSelected};display:flex;align-items:center;justify-content:center;overflow:hidden;">
                      <div style="font-size:${prlFontSize};color:#666;text-align:center;font-weight:bold;padding:2px;overflow:hidden;">${d.data.prl}</div>
                    </div>
                    <div class="node-content" style="width:100%;flex:1;display:flex;align-items:center;justify-content:center;overflow:hidden;">
                      <div style="font-size:${formationFontSize};color:#666;text-align:center;font-weight:bold;padding:2px;overflow:hidden;">${d.data.jumlah_formasi}</div>
                    </div>
                  </div>
                </div>
              `;
      }
    })
    .container(".chart-container")
    .data(processedDataResult.processedData)
    .compact(false)
    .render()
    .fit();

  console.log("Chart initialized successfully");

  // Add resize event listener to make chart responsive
  const resizeHandler = function () {
    if (chart) {
      chart.fit();
      console.log("Chart resized and fitted to container");
    }
  };

  // Remove existing resize listener if any
  window.removeEventListener("resize", resizeHandler);
  // Add new resize listener
  window.addEventListener("resize", resizeHandler);

  // Add ResizeObserver to detect container size changes
  const containerElement = document.querySelector(".chart-container");
  if (containerElement && window.ResizeObserver) {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (chart) {
          setTimeout(() => {
            chart.fit();
            console.log("Chart container resized, refitting chart");
          }, 100); // Small delay to ensure DOM updates are complete
        }
      }
    });
    resizeObserver.observe(containerElement);
  }

  // Auto-expand node if focusNodeId is provided
  if (focusNodeId) {
    setTimeout(() => handleNodeExpansion(focusNodeId), 1000); // Wait 1 second for chart to fully render
  } else {
    console.log("No focusNodeId provided, skipping auto-expand");
  }
}

// Main function to initialize the entire chart system
function initializeChartSystemNew(dataObject) {
  console.log("Starting chart system initialization...");

  // Step 1: Process the raw data
  const processedDataResult = processChartData(dataObject);
  console.log("Processed data:", processedDataResult.processedData.length, "items");
  // processedDataResult.processedData.forEach((item) => {
  //   item.id = parseInt(item.id, 10);
  //   item.parentId = parseInt(item.pid, 10) || null; // Ensure parentId is a number or null
  // });
  console.log("Processed data:", processedDataResult.processedData, "items");

  // Step 2: Initialize chart with processed data
  // initializeChart(processedDataResult, 18);
  initializeChart(processedDataResult);

  console.log("Chart system initialization completed");
}

function updateDataChart() {
  console.log("Updating chart data...");

  // Process the new data
  const processedDataResult = processChartData(dataku);

  // Reinitialize the chart with the new data
  initializeChart(processedDataResult);

  // Fit the chart to view after update
  if (chart) {
    chart.fit();
    console.log("Chart fitted to view after update");
  }

  console.log("Chart data updated successfully");
}

// Initialize chart when document is ready
// $(document).ready(function () {
//   console.log("Document ready - starting chart system...");

//   // Initialize the complete chart system
//   initializeChartSystem();

//   // Add click event listener using event delegation for node info
//   $(".chart-container").on("click", "foreignObject", function (e) {
//     // Check if the click is on the node content area, not on expand/collapse buttons
//     const clickTarget = $(e.target);

//     // Skip if clicking on expand/collapse buttons or their children
//     if (
//       clickTarget.closest(".node-button-foreign-object").length > 0 ||
//       clickTarget.closest('[class*="button"]').length > 0
//     ) {
//       return; // Let the expand/collapse functionality work normally
//     }

//     e.stopPropagation();

//     // Get the node data from the __data__ property
//     const nodeData = this.__data__;
//     if (nodeData && nodeData.data) {
//       const data = nodeData.data;

//       // Create detailed info string
//       let alertMessage = `=== INFORMASI NODE ===\n\n`;
//       alertMessage += `ID: ${data.id}\n`;
//       alertMessage += `Parent ID: ${data.parentId || "Root"}\n`;
//       alertMessage += `Name: ${data.name}\n`;
//       alertMessage += `Position: ${data.positionName}\n`;
//       alertMessage += `PRL: ${data.prl}\n`;
//       alertMessage += `Formation: ${data.formation}\n`;
//       alertMessage += `Tags: ${data.tags.join(", ")}\n`;
//       alertMessage += `Is Basket: ${data.basket ? "Yes" : "No"}\n`;
//       alertMessage += `Is Merge Formation: ${data.isMergeFormation ? "Yes" : "No"}\n\n`;

//       // Add basket-specific information if it's a basket node
//       if (data.basket) {
//         alertMessage += `=== BASKET DETAILS ===\n`;
//         Object.keys(data).forEach((key) => {
//           if (key.startsWith("bc_")) {
//             alertMessage += `${key}: ${data[key]}\n`;
//           }
//         });
//       }

//       // Show the alert
//       alert(alertMessage);
//     }
//   });
// });
