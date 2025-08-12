// --- Cycle detection helper ---
// Returns true if adding an edge from source to target would create a cycle
function wouldCreateCycle(edges: Edge[], source: string, target: string): boolean {
  // Build adjacency list
  const adj: Record<string, string[]> = {};
  edges.forEach(edge => {
    if (!adj[edge.source]) adj[edge.source] = [];
    adj[edge.source].push(edge.target);
  });
  // Add the new edge
  if (!adj[source]) adj[source] = [];
  adj[source].push(target);
  // DFS to check for cycle
  const visited = new Set<string>();
  function dfs(node: string): boolean {
    if (visited.has(node)) return true;
    visited.add(node);
    const neighbors = adj[node] || [];
    for (const neighbor of neighbors) {
      if (dfs(neighbor)) return true;
    }
    visited.delete(node);
    return false;
  }
  return dfs(source);
}

import { useState, useRef, useCallback } from 'react';
import { useReactFlow } from 'reactflow';
import ReactFlow, {
  ReactFlowProvider,
  Background,
  Controls,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType,
} from 'reactflow';
import type { Node, Edge, NodeChange, EdgeChange, Connection } from 'reactflow';
import { v4 as uuidv4 } from 'uuid';
import 'reactflow/dist/style.css';

import { Header } from './components/Header';
import { Sidebar } from './components/panels/Sidebar';
import { TextMessageNode } from './components/nodes/TextMessageNode';

const nodeTypes = {
  textMessage: TextMessageNode,
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'textMessage',
    position: { x: 250, y: 150 },
    data: { label: 'Test message 1' },
  },
];

function App() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  };

  const onPaneClick = () => {
    setSelectedNode(null);
  };

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const updateNodeText = (nodeId: string, text: string) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: { ...node.data, label: text } };
        }
        return node;
      })
    );
    setSelectedNode(prev => prev ? { ...prev, data: { ...prev.data, label: text } } : null);
  };

  return (
    <div className="w-screen h-screen flex flex-col">
      <Header nodes={nodes} edges={edges} />
      <ReactFlowProvider>
        <DropFlow
          nodes={nodes}
          setNodes={setNodes}
          edges={edges}
          setEdges={setEdges}
          selectedNode={selectedNode}
          setSelectedNode={setSelectedNode}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          onDragOver={onDragOver}
          updateNodeText={updateNodeText}
          reactFlowWrapper={reactFlowWrapper}
        />
      </ReactFlowProvider>
    </div>
  );
}
// Child component to use useReactFlow inside ReactFlowProvider
import React from 'react';
import type { Dispatch, SetStateAction } from 'react';
type DropFlowProps = {
  nodes: Node[];
  setNodes: Dispatch<SetStateAction<Node[]>>;
  edges: Edge[];
  setEdges: Dispatch<SetStateAction<Edge[]>>;
  selectedNode: Node | null;
  setSelectedNode: Dispatch<SetStateAction<Node | null>>;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onNodeClick: (_: React.MouseEvent, node: Node) => void;
  onPaneClick: () => void;
  onDragOver: (event: React.DragEvent) => void;
  updateNodeText: (nodeId: string, text: string) => void;
  reactFlowWrapper: React.RefObject<HTMLDivElement>;
};

function DropFlow(props: DropFlowProps) {
  const { project } = useReactFlow();
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const reactFlowBounds = props.reactFlowWrapper.current!.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');
      if (typeof type === 'undefined' || !type) return;
      const position = project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const newNode: Node = {
        id: uuidv4(),
        type,
        position,
        data: { label: `New Message` },
      };
      props.setNodes((nds) => nds.concat(newNode));
    },
    [props.setNodes, project, props.reactFlowWrapper]
  );
  const onConnect = useCallback(
    (connection: Connection) => {
      if (connection.source === connection.target) {
        alert("Error: Cannot connect a node to itself.");
        return;
      }
      const sourceHasEdge = props.edges.some(edge => edge.source === connection.source && edge.sourceHandle === connection.sourceHandle);
      if (sourceHasEdge) {
        alert("Error: A source handle can only have one outgoing connection.");
        return;
      }

      if (wouldCreateCycle(props.edges, connection.source!, connection.target!)) {
        alert("Error: This connection would create a cycle in the flow.");
        return;
      }
      props.setEdges((eds) => addEdge({
        ...connection,
        type: 'default',
        markerEnd: { type: MarkerType.ArrowClosed, width: 30, height: 30 }
      }, eds));
    },
    [props.edges, props.setEdges]
  );
  return (
    <div className="flex flex-grow">
      <main className="flex-grow h-full" ref={props.reactFlowWrapper}>
        <ReactFlow
          nodes={props.nodes}
          edges={props.edges}
          onNodesChange={props.onNodesChange}
          onEdgesChange={props.onEdgesChange}
          onConnect={onConnect}
          onNodeClick={props.onNodeClick}
          onPaneClick={props.onPaneClick}
          onDragOver={props.onDragOver}
          onDrop={onDrop}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </main>
      <Sidebar
        selectedNode={props.selectedNode}
        updateNodeText={props.updateNodeText}
        setSelectedNode={props.setSelectedNode}
      />
    </div>
  );
}

export default App;