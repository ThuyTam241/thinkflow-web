import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  Background,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
} from 'reactflow';
import { Pencil } from 'lucide-react';
import 'reactflow/dist/style.css';
import { updateMindmapApi } from '../../services/api.service';

// Đệ quy tìm và update content node theo branch id
function updateNodeContentInMindmap(node, branchId, newContent) {
  if (node.branch === branchId) {
    return { ...node, content: newContent };
  }
  if (node.children && node.children.length > 0) {
    return {
      ...node,
      children: node.children.map((child) => updateNodeContentInMindmap(child, branchId, newContent)),
    };
  }
  return node;
}

// Custom node with handles
const CustomNode = ({ data }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      style={{
        background: '#fff',
        border: '2px solid #6368D1',
        borderRadius: '16px',
        padding: '16px',
        width: 260,
        height: data.height || 60,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        transition: 'box-shadow 0.2s',
        boxShadow: isHovered ? '0 2px 12px 0 rgba(99,104,209,0.10)' : 'none',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {data.hasParent && (
        <Handle
          type="target"
          position={Position.Top}
          style={{ background: '#6368D1', width: 8, height: 8, top: -8, left: '50%', transform: 'translateX(-50%)' }}
        />
      )}
      <div className="text-sm font-medium text-gray-900" style={{ width: '100%' }}>{data.label}</div>
      <button
        onClick={data.onEdit}
        style={{
          position: 'absolute',
          top: 8,
          right: 8,
          padding: 6,
          borderRadius: '50%',
          background: '#e0e7ff',
          boxShadow: '0 8px 32px 0 rgba(99,104,209,0.40)',
          border: 'none',
          outline: 'none',
          cursor: 'pointer',
          display: isHovered ? 'block' : 'none',
          transition: 'box-shadow 0.2s, background 0.2s',
        }}
      >
        <Pencil size={16} color="#6368D1" />
      </button>
      {data.hasChildren && (
        <Handle
          type="source"
          position={Position.Bottom}
          style={{ background: '#6368D1', width: 8, height: 8, bottom: -8, left: '50%', transform: 'translateX(-50%)' }}
        />
      )}
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

const MindMapFlow = ({ data, onNodeUpdate, noteId }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [editNode, setEditNode] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const openEditDialog = (node) => {
    setEditNode(node);
    setEditContent(node.label);
    setIsEditOpen(true);
  };
  const closeEditDialog = () => {
    setEditNode(null);
    setEditContent('');
    setIsEditOpen(false);
  };

  const getNodeWidth = (node) => 260; // fixed width for now

  // Calculate the height of a node based on its content
  const getNodeHeight = (node) => {
    const minHeight = 60;
    const charsPerLine = 30;
    const lineHeight = 24;
    const content = node.content || node.topic || '';
    const lines = Math.ceil(content.length / charsPerLine);
    return Math.max(minHeight, lines * lineHeight + 32); // 32 for padding
  };

  // Calculate the total width of a subtree
  const getSubtreeWidth = (node) => {
    if (!node.children || node.children.length === 0) return 260;
    const spacingX = 40;
    return node.children.reduce((sum, child) => sum + getSubtreeWidth(child), 0) + (node.children.length - 1) * spacingX;
  };

  const convertDataToFlow = useCallback((node, x = 0, y = 0, level = 0) => {
    const nodes = [];
    const edges = [];
    const nodeWidth = 260;
    const spacingX = 40;
    const nodeHeight = getNodeHeight(node);
    const spacingY = 40;

    let childrenTotalWidth = 0;
    if (node.children && node.children.length > 0) {
      childrenTotalWidth = node.children.reduce((sum, child) => sum + getSubtreeWidth(child), 0) + (node.children.length - 1) * spacingX;
    }

    const currentNode = {
      id: node.branch,
      type: 'custom',
      position: { x, y },
      data: {
        label: node.content || node.topic,
        onNodeUpdate: (updatedNode) => onNodeUpdate(updatedNode),
        hasChildren: node.children && node.children.length > 0,
        hasParent: level > 0,
        height: nodeHeight,
        onEdit: () => openEditDialog({ id: node.branch, label: node.content || node.topic }),
      },
      style: {
        height: nodeHeight,
      },
    };
    nodes.push(currentNode);

    if (node.children && node.children.length > 0) {
      let childX = x - childrenTotalWidth / 2 + getSubtreeWidth(node.children[0]) / 2;
      const childY = y + nodeHeight + spacingY;
      node.children.forEach((child, index) => {
        const { nodes: childNodes, edges: childEdges } = convertDataToFlow(
          child,
          childX,
          childY,
          level + 1
        );
        nodes.push(...childNodes);
        edges.push(...childEdges);
        edges.push({
          id: `${node.branch}-${child.branch}`,
          source: node.branch,
          target: child.branch,
          type: 'bezier',
          animated: false,
          style: { stroke: '#6368D1', strokeWidth: 2 },
        });
        childX += getSubtreeWidth(child) + spacingX;
      });
    }

    return { nodes, edges };
  }, [onNodeUpdate]);

  useEffect(() => {
    if (data) {
      const { nodes: initialNodes, edges: initialEdges } = convertDataToFlow(data.parent_content[0]);
      setNodes(initialNodes);
      setEdges(initialEdges);
    }
  }, [data, convertDataToFlow, setNodes, setEdges]);

  // Hàm handle save
  const handleSaveEdit = async () => {
    if (!editNode || !editContent.trim()) return;
    setIsSaving(true);
    // Tạo mindmapData mới với node đã update content
    const updatedMindmap = {
      ...data,
      parent_content: data.parent_content.map((root) =>
        updateNodeContentInMindmap(root, editNode.id, editContent)
      ),
    };
    // Gọi API
    await updateMindmapApi(noteId, updatedMindmap);
    setIsSaving(false);
    closeEditDialog();
    // Cập nhật lại UI (gọi onNodeUpdate nếu có)
    if (onNodeUpdate) {
      onNodeUpdate(updatedMindmap);
    }
  };

  return (
    <div style={{ width: '100%', maxHeight: '600px', height: '600px', position: 'relative' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
      >
        <Background />
      </ReactFlow>
      {/* Dialog edit node */}
      {isEditOpen && editNode && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.3)',
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={closeEditDialog}
        >
          <div
            style={{
              width: 600,
              background: 'white',
              borderRadius: 12,
              padding: 28,
              boxShadow: '0 4px 32px 0 rgba(99,104,209,0.18)',
              position: 'relative',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <h3 style={{ fontSize: 20, fontWeight: 600, color: '#6368D1' }}>Edit Node Content</h3>
              <button onClick={closeEditDialog} style={{ color: '#888', fontSize: 22, background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
            </div>
            <textarea
              value={editContent}
              onChange={e => setEditContent(e.target.value)}
              style={{
                width: '100%',
                minHeight: 100,
                padding: 12,
                borderRadius: 8,
                border: '2px solid #6368D1',
                fontSize: 16,
                background: '#f4f5ff',
                color: '#23235a',
                outline: 'none',
                boxShadow: '0 2px 8px 0 rgba(99,104,209,0.08)',
                transition: 'border 0.2s, box-shadow 0.2s',
                resize: 'vertical',
              }}
              disabled={isSaving}
            />
            <div style={{ marginTop: 28, display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                onClick={closeEditDialog}
                style={{ padding: '10px 24px', borderRadius: 8, background: '#f3f4f6', color: '#333', border: 'none', fontWeight: 500, cursor: isSaving ? 'not-allowed' : 'pointer', fontSize: 15 }}
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                style={{ padding: '10px 24px', borderRadius: 8, background: editContent.trim() !== (editNode?.label || '') ? '#6368D1' : '#ccc', color: '#fff', border: 'none', fontWeight: 600, cursor: editContent.trim() !== (editNode?.label || '') && !isSaving ? 'pointer' : 'not-allowed', opacity: isSaving ? 0.7 : 1, fontSize: 15, boxShadow: editContent.trim() !== (editNode?.label || '') ? '0 2px 8px 0 rgba(99,104,209,0.10)' : 'none' }}
                disabled={editContent.trim() === (editNode?.label || '') || isSaving}
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MindMapFlow; 