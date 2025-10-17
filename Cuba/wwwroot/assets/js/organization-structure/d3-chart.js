var index = 0;
var compact = 0;
var actNdCent = 0;

// Global font sizing function - used by both SVG export and chart rendering
function getFontSize(text, isHeader = false) {
  if (isHeader) {
    if (text.length > 60) return "13px";
    if (text.length > 40) return "14px";
    if (text.length > 20) return "15px";
    return "18px";
  } else {
    // Apply dynamic sizing for non-header text as well
    if (text.length > 60) return "13px";
    if (text.length > 40) return "14px";
    if (text.length > 20) return "15px";
    return "14px";
  }
}

// SVG export font sizing function - 2px larger than regular font sizes for better readability in exports
function getSVGFontSize(text, isHeader = false) {
  console.log(`getSVGFontSize called with text: "${text}" and isHeader: ${isHeader}`);
  if (isHeader) {
    if (text.length > 60) return "18px"; // 13px + 2px
    if (text.length > 40) return "20px"; // 14px + 2px
    if (text.length > 20) return "22px"; // 15px + 2px
    return "23px"; // 18px + 2px
  } else {
    // Apply dynamic sizing for non-header text as well
    if (text.length > 60) return "15px"; // 13px + 2px
    if (text.length > 40) return "16px"; // 14px + 2px
    if (text.length > 20) return "17px"; // 15px + 2px
    return "16px"; // 14px + 2px
  }
}

// SVG export font sizing function for non-basket headers - 2px smaller than getSVGFontSize for headers
function getSVGHeaderFontSize(text) {
  console.log(`getSVGHeaderFontSize called with text: "${text}"`);
  if (text.length > 60) return "16px"; // 18px - 2px
  if (text.length > 40) return "18px"; // 20px - 2px
  if (text.length > 20) return "20px"; // 22px - 2px
  return "21px"; // 23px - 2px
}

// SVG export font sizing function for basket-merge headers - more aggressive sizing for long text
function getSVGBasketMergeHeaderFontSize(text) {
  console.log(`getSVGBasketMergeHeaderFontSize called with text: "${text}"`);
  // More aggressive sizing to prevent text overflow and box expansion
  if (text.length > 80) return "14px"; // Very long text
  if (text.length > 60) return "15px"; // Long text
  if (text.length > 40) return "16px"; // Medium text
  if (text.length > 20) return "18px"; // Short text
  return "20px"; // Very short text
}

// HTML font sizing function for basket-merge headers - matches SVG but for HTML display
function getBasketMergeHeaderFontSize(text) {
  // More aggressive sizing to prevent text overflow and box expansion
  if (text.length > 80) return "12px"; // Very long text (2px smaller than SVG)
  if (text.length > 60) return "13px"; // Long text
  if (text.length > 40) return "14px"; // Medium text
  if (text.length > 20) return "16px"; // Short text
  return "18px"; // Very short text
}

// HTML font sizing function for basket-non-merge headers - smaller than regular header
function getBasketNonMergeHeaderFontSize(text) {
  // Slightly smaller than regular to prevent overflow in basket nodes
  if (text.length > 60) return "11px"; // Long text
  if (text.length > 40) return "12px"; // Medium text
  if (text.length > 20) return "13px"; // Short text
  return "16px"; // Very short text
}

// SVG export font sizing function for basket-non-merge headers - 2px larger than HTML version
function getSVGBasketNonMergeHeaderFontSize(text) {
  // Slightly smaller than regular to prevent overflow in basket nodes, but larger for SVG
  if (text.length > 60) return "13px"; // Long text (2px larger than HTML)
  if (text.length > 40) return "14px"; // Medium text
  if (text.length > 20) return "15px"; // Short text
  return "18px"; // Very short text
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

function chartCompact() {
  chart
    .compact(!!(compact++ % 2))
    .render()
    .fit();

  // setTimeout(() => {
  applyStaticChartPositioning();
  // }, 500);
}

// Function to apply static chart positioning with custom transform values
function applyStaticChartPositioning(translateX = 450, translateY = -100, scale = 0.6, delay = 3000) {
  const chartContainer = document.querySelector(".chart-container-custom");
  if (chartContainer) {
    const chartGroup = chartContainer.querySelector("g.chart");
    if (chartGroup) {
      // Wait specified delay before applying static centering
      setTimeout(() => {
        chartGroup.classList.remove("transform");
        chartGroup.setAttribute("transform", `translate(${translateX},${translateY}) scale(${scale})`);
        console.log(`Applied static chart positioning: translate(${translateX},${translateY}) scale(${scale})`);
      }, delay);
    } else {
      console.warn("Chart group not found for static positioning");
    }
  } else {
    console.warn("Chart container not found for static positioning");
  }
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

    // Improved vertical centering logic for different line counts
    if (lines.length > 1) {
      const totalHeight = lines.length * lineHeight;
      const currentY = parseFloat(textElement.getAttribute("y"));

      // Better centering calculation for multi-line text
      let adjustedY;
      if (lines.length === 2) {
        adjustedY = currentY - 20;
      } else if (lines.length >= 3) {
        adjustedY = currentY - totalHeight / 2 + lineHeight / 2 - 5;
      } else {
        adjustedY = currentY;
      }

      textElement.setAttribute("y", adjustedY);
    }
  };

  const wrapSVGBasketText = (textElement, text, maxWidth, fontSize) => {
    const words = text.split(" ").filter((word) => word.trim() !== "");
    const lineHeight = parseInt(fontSize) * 1.2; // 120% of font size for line height
    let line = "";
    const lines = [];

    // Calculate approximate character width based on font size - more generous for basket text
    const charWidth = parseInt(fontSize) * 0.5; // Reduced from 0.6 to 0.5 for more space
    const maxCharsPerLine = Math.floor(maxWidth / charWidth);
    // console.log("words", words);
    // console.log("maxCharsPerLine", maxCharsPerLine);
    // remove inside words if they are ' '
    // const filteredWords = words.filter((word) => word.trim() !== "");
    // console.log("filteredWords", filteredWords);

    // First check if entire text fits in one line
    if (text.length <= maxCharsPerLine) {
      // Text fits in one line, no need to wrap
      textElement.textContent = text;
      return;
    }

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

    // Improved vertical centering logic for different line counts
    if (lines.length > 1) {
      const totalHeight = lines.length * lineHeight;
      const currentY = parseFloat(textElement.getAttribute("y"));

      // Better centering calculation for multi-line text
      let adjustedY;
      if (lines.length === 2) {
        adjustedY = currentY - 10;
      } else if (lines.length >= 3) {
        adjustedY = currentY - totalHeight / 2 + lineHeight / 2 - 5;
      } else {
        adjustedY = currentY;
      }

      textElement.setAttribute("y", adjustedY);
    }
  };

  foreignObjects.forEach((foreignObject) => {
    const x = foreignObject.getAttribute("x") || "0";
    const y = foreignObject.getAttribute("y") || "0";
    const width = foreignObject.getAttribute("width") || "300";
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

      // Get font sizes using dynamic sizing for SVG export (2px larger)
      const positionFontSize = getSVGHeaderFontSize(position); // Use smaller header font
      const prlFontSize = getSVGFontSize(prl);
      const formationFontSize = getSVGFontSize(formation);

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

      // Position section (left side - 80% width to match HTML flex:2 vs flex:0.5 ratio)
      const positionRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      const positionWidth = parseFloat(width) * 0.8; // 2/(2+0.5) = 0.8
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
      positionText.setAttribute("y", parseFloat(y) + parseFloat(height) / 2);
      positionText.setAttribute("text-anchor", "middle");
      positionText.setAttribute("dominant-baseline", "central");
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

      // Right section (20% width) - split into PRL and Formation to match HTML flex:0.5 ratio
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
      prlText.setAttribute("y", parseFloat(y) + halfHeight / 2);
      prlText.setAttribute("text-anchor", "middle");
      prlText.setAttribute("dominant-baseline", "central");
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
      formationText.setAttribute("y", parseFloat(y) + halfHeight + halfHeight / 2);
      formationText.setAttribute("text-anchor", "middle");
      formationText.setAttribute("dominant-baseline", "central");
      formationText.setAttribute("font-size", formationFontSize);
      formationText.setAttribute("font-weight", "bold");
      formationText.setAttribute("fill", "#666");
      formationText.setAttribute("font-family", "Arial, sans-serif");
      formationText.setAttribute("pointer-events", "none");
      formationText.setAttribute("user-select", "none");
      formationText.setAttribute("contenteditable", "false");
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
      positionText.setAttribute("y", parseFloat(y) + rowHeight / 2);
      positionText.setAttribute("text-anchor", "middle");
      positionText.setAttribute("dominant-baseline", "central");
      positionText.setAttribute("font-size", getSVGHeaderFontSize(position)); // Use smaller header font
      positionText.setAttribute("font-weight", "bold");
      positionText.setAttribute("fill", "#666");
      positionText.setAttribute("font-family", "Arial, sans-serif");
      positionText.setAttribute("pointer-events", "none");
      positionText.setAttribute("user-select", "none");
      positionText.setAttribute("contenteditable", "false");

      // Apply text wrapping for long position names
      wrapSVGText(positionText, position, parseFloat(width) - 10, getSVGHeaderFontSize(position));
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
        col1Text.setAttribute("y", currentY + rowHeight / 2);
        col1Text.setAttribute("text-anchor", "middle");
        col1Text.setAttribute("dominant-baseline", "central");
        col1Text.setAttribute("font-size", getSVGBasketNonMergeHeaderFontSize(basketName));
        col1Text.setAttribute("font-weight", "bold");
        col1Text.setAttribute("fill", "#666");
        col1Text.setAttribute("font-family", "Arial, sans-serif");
        col1Text.setAttribute("pointer-events", "none");
        col1Text.setAttribute("user-select", "none");
        col1Text.setAttribute("contenteditable", "false");

        // Apply text wrapping for basket name
        wrapSVGText(col1Text, basketName, col1Width - 10, getSVGBasketNonMergeHeaderFontSize(basketName));
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
        col2Text.setAttribute("y", currentY + rowHeight / 2);
        col2Text.setAttribute("text-anchor", "middle");
        col2Text.setAttribute("dominant-baseline", "central");
        col2Text.setAttribute("font-size", getSVGFontSize(prl));
        col2Text.setAttribute("font-weight", "bold");
        col2Text.setAttribute("fill", "#666");
        col2Text.setAttribute("font-family", "Arial, sans-serif");
        col2Text.setAttribute("pointer-events", "none");
        col2Text.setAttribute("user-select", "none");
        col2Text.setAttribute("contenteditable", "false");

        // Apply text wrapping for PRL text
        wrapSVGText(col2Text, prl, col2Width - 10, getSVGFontSize(prl));
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
        col3Text.setAttribute("y", currentY + rowHeight / 2);
        col3Text.setAttribute("text-anchor", "middle");
        col3Text.setAttribute("dominant-baseline", "central");
        col3Text.setAttribute("font-size", getSVGFontSize(formation));
        col3Text.setAttribute("font-weight", "bold");
        col3Text.setAttribute("fill", "#666");
        col3Text.setAttribute("font-family", "Arial, sans-serif");
        col3Text.setAttribute("pointer-events", "none");
        col3Text.setAttribute("user-select", "none");
        col3Text.setAttribute("contenteditable", "false");

        // Apply text wrapping for formation text
        wrapSVGText(col3Text, formation, col3Width - 10, getSVGFontSize(formation));
        group.appendChild(col3Text);
      });
    } else if (nodeType === "basket-merge-node") {
      // Get the data for this node to see the tags
      const nodeData = div.closest("foreignObject")?.__data__?.data;

      // Find basket tag and analyze it
      const basketTag = nodeData?.tags?.find((tag) => tag.includes("basket_"));

      if (basketTag) {
        const basketParts = basketTag.split("_");
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

      // Get position-PRL rows from left section
      const positionPrlRows = leftSection?.querySelectorAll("div.position-prl-class") || [];

      // Get formation bracket rows from right section
      const bracketRows = rightSection?.querySelectorAll("div") || [];

      // Log each bracket row's style for height analysis
      bracketRows.forEach((bracketDiv, idx) => {
        const bracketStyle = bracketDiv.getAttribute("style") || "";
        const heightMatch = bracketStyle.match(/height:(\d+)px/);
        const bracketHeight = heightMatch ? parseInt(heightMatch[1]) : 50;
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
      positionText.setAttribute("y", parseFloat(y) + rowHeight / 2);
      positionText.setAttribute("text-anchor", "middle");
      positionText.setAttribute("dominant-baseline", "central");
      positionText.setAttribute("font-size", getSVGBasketMergeHeaderFontSize(position));
      positionText.setAttribute("font-weight", "bold");
      positionText.setAttribute("fill", "#666");
      positionText.setAttribute("font-family", "Arial, sans-serif");
      positionText.setAttribute("pointer-events", "none");
      positionText.setAttribute("user-select", "none");
      positionText.setAttribute("contenteditable", "false");

      // Apply text wrapping for long position names
      wrapSVGBasketText(positionText, position, parseFloat(width), getSVGBasketMergeHeaderFontSize(position));
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

        // Left section: Position Name and PRL (85% width to match HTML)
        const leftWidth = parseFloat(width) * 0.85; // 85% for left section (matches HTML)
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

        // Position Name (80% of left section to match HTML proportions)
        const positionWidth = leftWidth * 0.8;
        const positionRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        positionRect.setAttribute("x", x);
        positionRect.setAttribute("y", currentY);
        positionRect.setAttribute("width", positionWidth);
        positionRect.setAttribute("height", rowHeight);
        positionRect.setAttribute("fill", "none");
        positionRect.setAttribute("stroke", "black");
        positionRect.setAttribute("stroke-width", "1");
        positionRect.setAttribute("stroke-dasharray", "none");
        group.appendChild(positionRect);

        const positionText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        positionText.setAttribute("x", parseFloat(x) + positionWidth / 2);
        positionText.setAttribute("y", currentY + rowHeight / 2);
        positionText.setAttribute("text-anchor", "middle");
        positionText.setAttribute("dominant-baseline", "central");
        positionText.setAttribute("font-size", getSVGFontSize(basketName));
        positionText.setAttribute("font-weight", "bold");
        positionText.setAttribute("fill", "#666");
        positionText.setAttribute("font-family", "Arial, sans-serif");
        positionText.setAttribute("pointer-events", "none");
        positionText.setAttribute("user-select", "none");
        positionText.setAttribute("contenteditable", "false");

        // Apply text wrapping for basket name in merge
        wrapSVGBasketText(positionText, basketName, positionWidth, getSVGFontSize(basketName));
        group.appendChild(positionText);

        // PRL (30% of left section)
        const formationX = parseFloat(x) + positionWidth;
        const formationWidth = leftWidth - positionWidth;
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
        formationText.setAttribute("y", currentY + rowHeight / 2);
        formationText.setAttribute("text-anchor", "middle");
        formationText.setAttribute("dominant-baseline", "central");
        formationText.setAttribute("font-size", getSVGFontSize(prlFromDOM));
        formationText.setAttribute("font-weight", "bold");
        formationText.setAttribute("fill", "#666");
        formationText.setAttribute("font-family", "Arial, sans-serif");
        formationText.setAttribute("pointer-events", "none");
        formationText.setAttribute("user-select", "none");
        formationText.setAttribute("contenteditable", "false");

        // Apply text wrapping for formation text in basket merge
        wrapSVGText(formationText, prlFromDOM, formationWidth - 10, getSVGFontSize(prlFromDOM));
        group.appendChild(formationText);
      });

      // Now generate brackets using tag-based logic (same as HTML generation)
      const rightX = parseFloat(x) + parseFloat(width) * 0.85;
      const rightWidth = parseFloat(width) * 0.15;
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
          bracketText.setAttribute("y", bracketCurrentY + heightPerBracket / 2);
          bracketText.setAttribute("text-anchor", "middle");
          bracketText.setAttribute("dominant-baseline", "central");
          bracketText.setAttribute("font-size", getSVGFontSize(getJumlahFormasi));
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
            bracketText.setAttribute("y", currentRowY + bracketHeight / 2);
            bracketText.setAttribute("text-anchor", "middle");
            bracketText.setAttribute("dominant-baseline", "central");
            bracketText.setAttribute("font-size", getSVGFontSize(formationValue));
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
      text1.setAttribute("font-size", getFontSize(name, true));
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
      text2.setAttribute("font-size", getFontSize(position));
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

function getChartExportData() {
  const orgChartData = JSON.parse(localStorage.getItem("orgChartData") || "[]");
  const focusNodeId = JSON.parse(localStorage.getItem("focusNodeId") || "null");
  const isAutoExpand = JSON.parse(localStorage.getItem("isAutoExpand") || "false");
  const selfNode = orgChartData.processedData.find((node) => node.id === focusNodeId);
  const parentNode = orgChartData.processedData.find((node) => node.id === selfNode?.parentId);
  const childrenNodes = orgChartData.processedData.filter((node) => node.parentId === selfNode?.id);
  const grandChildrenNodes = orgChartData.processedData.filter((node) =>
    childrenNodes.map((child) => child.id).includes(node.parentId)
  );
  const cloneOrgChartData = { ...orgChartData };
  cloneOrgChartData.processedData = [selfNode, parentNode, ...childrenNodes, ...grandChildrenNodes].filter(Boolean);
  return {
    orgChartData,
    cloneOrgChartData,
    focusNodeId,
    isAutoExpand,
  };
}

function chartFit() {
  applyStaticChartPositioning();
}

function chartExportSVG() {
  const data = getChartExportData();
  console.log("Exporting chart as SVG:", data);
  console.log("Exporting chart as SVG:", data.cloneOrgChartData);
  initializeChart(data.cloneOrgChartData, null, true);
  showChartLoading("chart-container-custom");
  setTimeout(() => {
    chart.expandAll();
  }, 2000);
  setTimeout(() => {
    chart.fit();
  }, 3000);
  setTimeout(() => {
    prepareAndExportSVG();
  }, 4000);
  setTimeout(() => {
    initializeChart(data.orgChartData, data.isAutoExpand ? data.focusNodeId : null);
    if (chart) chart.fit();
    hideChartLoading("chart-container-custom");
  }, 5000);
  applyStaticChartPositioning();
}

function chartExportPDF() {
  const data = getChartExportData();
  console.log("Exporting chart as PDF:", data);
  console.log("Exporting chart as PDF:", data.cloneOrgChartData);
  initializeChart(data.cloneOrgChartData, null, true);
  showChartLoading("chart-container-custom");
  setTimeout(() => {
    chart.expandAll();
  }, 2000);
  setTimeout(() => {
    chart.fit();
  }, 3000);
  setTimeout(() => {
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
    hideChartLoading("chart-container-custom");
  }, 4000);
  setTimeout(() => {
    initializeChart(data.orgChartData, data.isAutoExpand ? data.focusNodeId : null);
    if (chart) chart.fit();
  }, 5000);
  applyStaticChartPositioning();
}
function chartExportIMG() {
  const data = getChartExportData();
  console.log("Exporting chart as PDF:", data);
  console.log("Exporting chart as PDF:", data.cloneOrgChartData);
  initializeChart(data.cloneOrgChartData, null, true);
  showChartLoading("chart-container-custom");
  setTimeout(() => {
    chart.expandAll();
  }, 2000);
  setTimeout(() => {
    chart.fit();
  }, 3000);
  setTimeout(() => {
    chart.exportImg();
    hideChartLoading("chart-container-custom");
  }, 4000);
  setTimeout(() => {
    initializeChart(data.orgChartData, data.isAutoExpand ? data.focusNodeId : null);
    if (chart) chart.fit();
  }, 5000);
  applyStaticChartPositioning();
}

function prepareAndExportSVG() {
  try {
    const svg = document.querySelector(".chart-container-custom svg");
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
  console.log("Processing chart data...", rawData);

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
      //  find whic bc_1_flagMergeFormation, bc_2_flagMergeFormation, etc. that matches this value
      const matchingKeys = Object.keys(item).filter((key) => key.includes("flagMergeFormation") && item[key] === value);
      const arrayKeys = matchingKeys.map((key) => parseInt(key.split("_")[1]));
      storeValues.push({ value, count, arrayKeys });
    });
    // urutan storeValues berdasarkan dari uturan arrayKeys
    let sorted = [];
    let count = 0;
    for (let i = 0; i < totalBAsket; i++) {
      const matching = storeValues.find((itx) => itx.arrayKeys.includes(i + 1));
      if (count < totalBAsket && matching) {
        count += matching.count;
        sorted.push(matching);
      }
    }

    sorted.forEach((itx, index) => {
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
function initializeChart(processedDataResult, focusNodeId, forceCompact = false) {
  console.log("Initializing organizational chart...");
  console.log("forceCompact:", forceCompact);

  let isCompact = true;
  if (focusNodeId) {
    const selfObject = processedDataResult.processedData.find((item) => item.id == focusNodeId);

    // // Safety check: ensure selfObject exists
    // if (!selfObject) {
    //   console.warn(`Focus node with ID ${focusNodeId} not found in processed data`);
    //   return;
    // }

    // // Add "pointed" tag if not already present (avoid duplicates)
    // if (!selfObject.tags.includes("pointed")) {
    //   selfObject.tags.push("pointed");
    // }

    // // More efficient approach: find index and move to front
    if (selfObject) {
      if (!selfObject.tags.includes("pointed")) {
        selfObject.tags.push("pointed");
      }
      const selfIndex = processedDataResult.processedData.findIndex((item) => item.id == focusNodeId);
      if (selfIndex > 0) {
        // Remove from current position and insert at beginning
        processedDataResult.processedData.splice(selfIndex, 1);
        processedDataResult.processedData.unshift(selfObject);
      }
    }

    const lengthRelative = processedDataResult.processedData.filter(
      (item) => item.parentId === selfObject.parentId
    ).length;

    if (lengthRelative < 6) {
      isCompact = false;
    }
  }
  if (forceCompact) {
    isCompact = true;
  }

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
    .nodeWidth((d) => 300)
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
        create: "#03a9f4",
        delete: "#dc3545",
        black: "black",
      };
      const background = {
        create: "#e6f6fe",
        delete: "#f8d7da",
        black: "white",
      };

      let colorSelected, backgroundSelected, borderWidth;
      if (d.data.tags.includes("create") || d.data.tags.includes("update")) {
        colorSelected = color.create;
        backgroundSelected = background.create;
      } else if (d.data.tags.includes("delete")) {
        colorSelected = color.delete;
        backgroundSelected = background.delete;
      } else {
        colorSelected = color.black;
        backgroundSelected = background.black;
      }

      borderWidth = "2px";
      if (d.data.tags.includes("pointed")) {
        // yellowish background
        // backgroundSelected = "#fff3cd";
        borderWidth = "4px";
        colorSelected = color.create;
      }

      const borderDot = d.data.project ? "dotted" : "solid";
      const borderStyle = `border:${borderWidth} ${borderDot} ${colorSelected}`;

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
          const bcposition = d.data[`bc_${i}_position`] || `Basket ${i}`;
          const basketNameFontSize = getBasketNonMergeHeaderFontSize(bcposition);
          const prlFontSize = getFontSize(bcPrl);
          const formationFontSize = getFontSize(bcFormation);

          basketRows += `
                  <div class="node-content" style="width:100%;height:50px;display:flex;align-items:center;justify-content:center;${
                    i < basketLevel ? `border-bottom:2px ${borderDot} ${colorSelected};` : ""
                  }">
                    <div style="flex:1.8;font-size:${basketNameFontSize};color:#666;text-align:center;font-weight:bold;display:flex;align-items:center;justify-content:center;height:100%;overflow:hidden;word-wrap:break-word;padding:2px;">${bcposition}</div>
                    <div style="flex:0.6;font-size:${prlFontSize};color:#666;text-align:center;font-weight:bold;display:flex;align-items:center;justify-content:center;height:100%;border-left:2px ${borderDot} ${colorSelected};overflow:hidden;padding:2px;">${bcPrl}</div>
                    <div style="flex:0.6;font-size:${formationFontSize};color:#666;text-align:center;font-weight:bold;display:flex;align-items:center;justify-content:center;height:100%;border-left:2px ${borderDot} ${colorSelected};overflow:hidden;padding:2px;">${bcFormation}</div>
                  </div>
                `;
        }

        return `
                <div id="basket-non-merge-node" style="width:${d.width}px;height:${d.height}px;display:flex;flex-direction:column;${borderStyle};background-color:${backgroundSelected};">
                  <div class="node-content" style="width:100%;height:50px;display:flex;align-items:center;justify-content:center;border-bottom:2px ${borderDot} ${colorSelected};overflow:hidden;">
                    <div style="font-size:${positionFontSize};color:#666;text-align:center;font-weight:bold;padding:2px;overflow:hidden;word-wrap:break-word;">${d.data.org_unit_name}</div>
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
          const matchResult = bracket.match(/(\d+)\((\d+)\)/) || [];
          const count = matchResult[1]; // ambil group pertama (angka sebelum kurung)
          const jumlahFormasiRaw = matchResult[2]; // ambil group kedua (angka dalam kurung)
          const getJumlahFormasi = jumlahFormasiRaw || "1";
          const heightPerBracket = (count ? parseInt(count) : 1) * 50;
          const bracketFontSize = getFontSize(getJumlahFormasi);

          bracketDivs += `
                  <div style="border-bottom:1px solid black;width:100%;height:${heightPerBracket}px;display:flex;align-items:center;justify-content:center;overflow:hidden;">
                    <div style="width:100%;height:${heightPerBracket}px;display:flex;align-items:center;justify-content:center;overflow:hidden;">
                      <div style="font-size:${bracketFontSize};color:#333;text-align:center;font-weight:bold;padding:2px;overflow:hidden;">${getJumlahFormasi}</div>
                    </div>
                  </div>
                `;
        }

        // Generate basket rows
        let basketRows = "";
        for (let i = 1; i <= basketLevel; i++) {
          const bcPrl = d.data[`bc_${i}_prl`] || d.data.prl;
          const bcposition = d.data[`bc_${i}_position`] || `Basket ${i}`;
          const basketNameFontSize = getFontSize(bcposition);
          const prlFontSize = getFontSize(bcPrl);

          basketRows += `
                  <div class="position-prl-class" style="width:100%;height:50px;display:flex;align-items:center;justify-content:center;border-bottom:1px solid black;overflow:hidden;">
                    <div style="width:80%;font-size:${basketNameFontSize};color:#666;text-align:center;font-weight:bold;display:flex;align-items:center;justify-content:center;height:100%;border-right:1px solid black;overflow:hidden;word-wrap:break-word;padding:2px;">${bcposition}</div>
                    <div style="width:20%;font-size:${prlFontSize};color:#666;text-align:center;font-weight:bold;display:flex;align-items:center;justify-content:center;height:100%;overflow:hidden;padding:2px;">${bcPrl}</div>
                  </div>
                `;
        }

        return `
                <div id="basket-merge-node" class="basket-merge ${d.data.tags.find((tag) =>
                  tag.includes("basket_")
                )}" style="width:${d.width}px;height:${
          d.height
        }px;display:flex;flex-direction:column;${borderStyle};background-color:${backgroundSelected};">
                  <div class="node-content" style="width:100%;height:50px;display:flex;align-items:center;justify-content:center;border-bottom:1px ${borderDot} ${colorSelected};overflow:hidden;">
                    <div style="font-size:${getBasketMergeHeaderFontSize(
                      d.data.org_unit_name
                    )};color:#666;text-align:center;font-weight:bold;padding:2px;overflow:hidden;word-wrap:break-word;">${
          d.data.org_unit_name
        }</div>
                  </div>
                  <div style="display:flex;flex-direction:row;align-items:stretch;">
                    <div style="width:85%;display:flex;flex-direction:column;">
                      ${basketRows}
                    </div>
                    <div style="width:15%;display:flex;flex-direction:column;border-left:1px solid black;">
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
                <div id="non-basket-node" style="width:${d.width}px;height:${d.height}px;display:flex;${borderStyle};background-color:${backgroundSelected};">
                  <div class="node-content" style="flex:2;height:100%;border-right:2px ${borderDot} ${colorSelected};display:flex;align-items:center;justify-content:center;overflow:hidden;">
                    <div style="font-size:${positionFontSize};color:#666;text-align:center;font-weight:bold;padding:2px;overflow:hidden;word-wrap:break-word;">${d.data.position}</div>
                  </div>
                  <div style="flex:0.5;height:100%;display:flex;flex-direction:column;">
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
    .container(".chart-container-custom")
    .data(processedDataResult.processedData)
    .compact(isCompact)
    .render()
    .fit();

  // Auto-expand node if focusNodeId is provided
  if (focusNodeId) {
    const findChildren = processedDataResult.processedData.find((item) => item.parentId == focusNodeId);
    console.log(`Auto-expanding node with ID ${findChildren}`);
    setTimeout(() => handleNodeExpansion(findChildren.id), 500); // Wait 2 seconds for chart to fully render
    if (findChildren) {
    }
  } else {
    console.log("No focusNodeId provided, skipping auto-expand");
  }

  const chartContainer = document.querySelector(".chart-container-custom");
  if (chartContainer) {
    const chartGroup = chartContainer.querySelector("g.chart");
    if (chartGroup) {
      // Wait 3 seconds before applying static centering
      setTimeout(() => {
        chartGroup.classList.remove("transform");
        chartGroup.setAttribute("transform", "translate(450,-100) scale(0.6)");
      }, 1000);
    }
  }
}

// Function to setup continuous monitoring of chart positioning
function setupCenteringMonitor() {
  const containerElement = document.querySelector(".chart-container-custom");

  if (!containerElement) {
    console.log("Container not found, retrying in 500ms...");
    setTimeout(setupCenteringMonitor, 500);
    return;
  }

  // Create a MutationObserver to watch for changes
  const observer = new MutationObserver((mutations) => {
    let needsOverride = false;

    mutations.forEach((mutation) => {
      // Check if any transform attributes or styles changed
      if (
        mutation.type === "attributes" &&
        (mutation.attributeName === "transform" || mutation.attributeName === "style")
      ) {
        needsOverride = true;
      }

      // Check if new nodes were added (like when chart re-renders)
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        needsOverride = true;
      }
    });

    if (needsOverride) {
      // Apply static chart positioning after DOM changes
      setTimeout(() => {
        applyStaticChartPositioning();
        console.log("Auto-override applied due to DOM changes");
      }, 50);
    }
  });

  // Start observing the container and all its children
  observer.observe(containerElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["transform", "style"],
    attributeOldValue: true,
  });

  console.log("Centering monitor setup complete");
}

// Main function to initialize the entire chart system
function renderOrgChart(dataChart, focusNodeId, isAutoExpand = true) {
  if (!dataChart) {
    dataChart = [];
  }
  dataChart.forEach((item) => (item.id = item.id_org_unit));

  // remove id duplicate
  dataChart = dataChart.filter((item, index, self) => index === self.findIndex((t) => t.id === item.id));

  const self = dataChart.find((item) => item.id == focusNodeId);
  const parent = dataChart.find((item) => item.id == self?.pid);
  if (parent) {
    parent.pid = null;
    dataChart = dataChart.filter((item) => item.id != parent.id);
    dataChart.unshift(parent);
  }

  const processed = processChartData(dataChart);
  processed.processedData.forEach((item) => {
    item.parentId = item.pid || null;
  });
  localStorage.setItem("focusNodeId", JSON.stringify(focusNodeId));
  localStorage.setItem("orgChartData", JSON.stringify(processed));
  localStorage.setItem("isAutoExpand", JSON.stringify(isAutoExpand));
  initializeChart(processed, isAutoExpand ? focusNodeId : null);
  if (chart) chart.fit();
}
