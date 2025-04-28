import React, { useState, useRef, useEffect } from "react";
import { Edit2 } from "lucide-react";
import PrimaryButton from "./buttons/PrimaryButton";

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

const MindMap = ({ data, style, onNodeUpdate }) => {
  const [editingNode, setEditingNode] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [originalContent, setOriginalContent] = useState("");
  const dialogRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target)) {
        setEditingNode(null);
        setEditContent("");
        setOriginalContent("");
      }
    };

    if (editingNode) {
      document.addEventListener('mousedown', handleClickOutside);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          const len = textareaRef.current.value.length;
          textareaRef.current.setSelectionRange(len, len);
        }
      }, 0);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [editingNode]);

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

  const handleEditClick = (node) => {
    setEditingNode(node);
    setEditContent(node.content || node.topic);
    setOriginalContent(node.content || node.topic);
  };

  const handleSaveEdit = async () => {
    if (!editingNode) return;
    
    const updatedNode = { ...editingNode, content: editContent };
    onNodeUpdate(updatedNode);
    setEditingNode(null);
    setEditContent("");
    setOriginalContent("");
  };

  const handleCancelEdit = () => {
    setEditingNode(null);
    setEditContent("");
    setOriginalContent("");
  };

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
            <g 
              key={node.branch}
              onMouseEnter={(e) => {
                const editButton = e.currentTarget.querySelector('.edit-button');
                if (editButton) editButton.style.opacity = 1;
              }}
              onMouseLeave={(e) => {
                const editButton = e.currentTarget.querySelector('.edit-button');
                if (editButton) editButton.style.opacity = 0;
              }}
            >
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
              <g
                transform={`translate(${node.x - minX + NODE_WIDTH - 40 + PADDING}, ${node.y - minY + PADDING + 8})`}
                style={{ opacity: 0, transition: 'opacity 0.2s' }}
                className="edit-button cursor-pointer"
                onClick={() => handleEditClick(node)}
              >
                <circle 
                  cx="16" 
                  cy="16" 
                  r="16" 
                  fill="white" 
                  filter="drop-shadow(0 2px 4px rgba(99, 104, 209, 0.3))"
                />
                <g transform="translate(6, 6)">
                  <Edit2
                    size={20}
                    className="text-cornflower-blue hover:text-cornflower-blue/80"
                  />
                </g>
              </g>
            </g>
          );
        })}
      </svg>

      {/* Edit Dialog */}
      {editingNode && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div ref={dialogRef} className="w-[500px] min-h-[320px] rounded-lg bg-white p-6 flex flex-col">
            <h3 className="mb-4 text-lg font-semibold">Edit Node Content</h3>
            <div className="mb-4 border border-gray-200 rounded-lg focus-within:border-cornflower-blue focus-within:ring-1 focus-within:ring-cornflower-blue p-3 flex-1 flex flex-col min-h-0">
              <textarea
                ref={textareaRef}
                value={editContent}
                onChange={(e) => {
                  setEditContent(e.target.value);
                  if (textareaRef.current) {
                    textareaRef.current.style.height = 'auto';
                    textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey && editContent !== originalContent) {
                    e.preventDefault();
                    handleSaveEdit();
                  }
                }}
                className="w-full h-full border-0 outline-none bg-transparent focus:ring-0 resize-none overflow-auto flex-1 min-h-0"
                style={{ minHeight: 32 }}
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 mr-2"
              >
                Cancel
              </button>
              <PrimaryButton
                onClick={handleSaveEdit}
                label="Save"
                color="blue"
                disabled={editContent === originalContent}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MindMap;
