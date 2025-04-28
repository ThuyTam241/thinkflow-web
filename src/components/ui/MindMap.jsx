import React from "react";

const wrapText = (text, maxWidth = 228, font = "16px sans-serif") => {
  if (!text) return [];
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  ctx.font = font;
  const words = text.split(" ");
  const lines = [];
  let currentLine = "";
  for (let i = 0; i < words.length; i++) {
    const testLine = currentLine ? currentLine + " " + words[i] : words[i];
    const { width } = ctx.measureText(testLine);
    if (width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = words[i];
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

const NODE_WIDTH = 260;
const LINE_HEIGHT = 22;
const PADDING = 24;

const layoutTreeDynamic = (
  node,
  depth = 0,
  x = 0,
  y = 0,
  spacingX = 320,
  spacingY = 32,
) => {
  const lines = wrapText(
    node.content || node.topic,
    NODE_WIDTH - 32,
    "16px sans-serif",
  );
  const nodeHeight = lines.length * LINE_HEIGHT + 16;
  let nodes = [];
  let links = [];
  let width = 0;
  let height = nodeHeight;
  if (!node.children || node.children.length === 0) {
    nodes.push({ ...node, x, y, lines, nodeHeight });
    width = 1;
  } else {
    let childX = x;
    let childY = y + nodeHeight + spacingY;
    let childWidths = [];
    let childHeights = [];
    let maxChildHeight = 0;
    node.children.forEach((child) => {
      const {
        nodes: childNodes,
        links: childLinks,
        width: childWidth,
        height: childHeight,
      } = layoutTreeDynamic(
        child,
        depth + 1,
        childX,
        childY,
        spacingX,
        spacingY,
      );
      nodes = nodes.concat(childNodes);
      links = links.concat(childLinks);
      links.push({ from: node.branch, to: child.branch });
      childWidths.push(childWidth);
      childHeights.push(childHeight);
      childX += childWidth * spacingX;
      if (childHeight > maxChildHeight) maxChildHeight = childHeight;
    });

    const totalWidth = childWidths.reduce((a, b) => a + b, 0);
    const center = x + (totalWidth * spacingX - spacingX) / 2;
    nodes.push({ ...node, x: center, y, lines, nodeHeight });
    width = totalWidth;

    height =
      nodeHeight +
      spacingY +
      (childHeights.length > 0 ? Math.max(...childHeights) : 0);
  }
  return { nodes, links, width, height };
}

const MindMap = ({ data, style }) => {
  if (!data)
    return (
      <div style={{ color: "#aaa", textAlign: "center" }}>No mind map data</div>
    );
  const { nodes, links } = layoutTreeDynamic(data);

  const minX = Math.min(...nodes.map((n) => n.x));
  const maxX = Math.max(...nodes.map((n) => n.x));
  const minY = Math.min(...nodes.map((n) => n.y));
  const maxY = Math.max(...nodes.map((n) => n.y + n.nodeHeight));
  const width = maxX - minX + NODE_WIDTH + PADDING * 2;
  const height = maxY - minY + PADDING * 2;


  const nodeMap = Object.fromEntries(nodes.map((n) => [n.branch, n]));

  return (
    <div
      style={{
        width: width,
        minWidth: "100%",
        background: "#e7eaff66",
        borderRadius: 12,
        ...style,
      }}
    >
      <svg width={width} height={height} style={{ display: "block" }}>
        {/* Đường nối */}
        {links.map((link, i) => {
          const from = nodeMap[link.from];
          const to = nodeMap[link.to];
          if (!from || !to) return null;
          return (
            <line
              key={i}
              x1={from.x - minX + NODE_WIDTH / 2 + PADDING}
              y1={from.y - minY + from.nodeHeight + PADDING}
              x2={to.x - minX + NODE_WIDTH / 2 + PADDING}
              y2={to.y - minY + PADDING}
              stroke="#6368D1"
              strokeWidth={2}
            />
          );
        })}

        {nodes.map((node, i) => {
          return (
            <g key={node.branch}>
              <rect
                x={node.x - minX + PADDING}
                y={node.y - minY + PADDING}
                width={NODE_WIDTH}
                height={node.nodeHeight}
                rx={16}
                fill={i === nodes.length - 1 ? "#6368D1" : "#fff"}
                stroke="#6368D1"
                strokeWidth={2}
                filter="drop-shadow(0 2px 12px #6368d122)"
              />
              <text
                x={node.x - minX + NODE_WIDTH / 2 + PADDING}
                y={node.y - minY + PADDING + 8 + LINE_HEIGHT / 2}
                textAnchor="middle"
                fontSize={14}
                fontFamily="sans-serif"
                fill={i === nodes.length - 1 ? "#fff" : "#22223B"}
                style={{ pointerEvents: "none", userSelect: "none" }}
              >
                {node.lines.map((line, idx) => (
                  <tspan
                    key={idx}
                    x={node.x - minX + NODE_WIDTH / 2 + PADDING}
                    dy={idx === 0 ? 0 : LINE_HEIGHT}
                  >
                    {line}
                  </tspan>
                ))}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default MindMap;
