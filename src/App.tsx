// src/App.tsx
import { useState, useRef } from 'react';
import ReactFlow, { ReactFlowProvider, Background, Controls, useReactFlow } from 'reactflow';
import type { Node, Edge } from 'reactflow';
import 'reactflow/dist/style.css';
import { Header } from './components/Headers';
import { Sidebar } from './components/panels/Sidebar';
import { SettingsPanel } from './components/panels/SettingsPanel';

// We will create and import the custom node in the next step

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'default', // Using 'default' for now
    position: { x: 250, y: 150 },
    data: { label: 'Test Message 1' },
  },
];



type FlowCanvasProps = {
  nodes: Node[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  edges: Edge[];
  wrapperRef: React.RefObject<HTMLDivElement | null>;
  onNodeClick: (event: React.MouseEvent, node: Node) => void;
};

function FlowCanvas({ nodes, setNodes, edges, wrapperRef, onNodeClick }: FlowCanvasProps) {
  const reactFlowInstance = useReactFlow();

  // Handle drop event to add a new node at the correct canvas position
  const onDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const nodeType = event.dataTransfer.getData('application/reactflow');
    if (!nodeType) return;

    const reactFlowBounds = wrapperRef.current?.getBoundingClientRect();
    if (!reactFlowBounds) return;
    const position = reactFlowInstance.project({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    });
    const newNode: Node = {
      id: (nodes.length + 1).toString(),
      type: 'default',
      position,
      data: { label: 'New Message' },
    };
    setNodes((nds) => nds.concat(newNode));
  };

  // Allow drop
  const onDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  return (
    <div ref={wrapperRef} style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
      >
  <Background />
  <Controls />
      </ReactFlow>
    </div>
  );
}

function App() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Handler for node selection
  const onNodeClick = (_: any, node: Node) => {
    setSelectedNodeId(node.id);
  };

  // Handler for updating node label
  const handleNodeLabelChange = (value: string) => {
    setNodes(nds => nds.map(n => n.id === selectedNodeId ? { ...n, data: { ...n.data, label: value } } : n));
  };

  // Handler to go back to NodesPanel
  const handleBack = () => setSelectedNodeId(null);

  // Get selected node
  const selectedNode = nodes.find(n => n.id === selectedNodeId) || null;

  return (
    <div className="w-screen h-screen flex flex-col">
      <Header />
      <ReactFlowProvider>
        <div className="flex flex-grow">
          <main className="flex-grow h-full">
            <FlowCanvas
              nodes={nodes}
              setNodes={setNodes}
              edges={edges}
              wrapperRef={wrapperRef}
              onNodeClick={onNodeClick}
            />
          </main>
          {selectedNode ? (
            <SettingsPanel
              value={selectedNode.data.label}
              onChange={handleNodeLabelChange}
              onBack={handleBack}
            />
          ) : (
              <Sidebar />
          )}
        </div>
      </ReactFlowProvider>
    </div>
  );
}

export default App;