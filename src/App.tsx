// src/App.tsx
import { useState } from 'react';
import ReactFlow, { ReactFlowProvider, Background, Controls, useReactFlow } from 'reactflow';
import type { Node, Edge } from 'reactflow';
import 'reactflow/dist/style.css';
import { Header } from './components/Headers';
import { Sidebar } from './components/panels/SideBar';

// We will create and import the custom node in the next step

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'default', // Using 'default' for now
    position: { x: 250, y: 150 },
    data: { label: 'Test Message 1' },
  },
];


function FlowCanvas({ nodes, setNodes, edges }) {
  const reactFlowInstance = useReactFlow();

  // Handle drop event to add a new node at the correct canvas position
  const onDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const nodeType = event.dataTransfer.getData('application/reactflow');
    if (!nodeType) return;

    const reactFlowBounds = (event.target as HTMLDivElement).getBoundingClientRect();
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
    <ReactFlow
      nodes={nodes}
      edges={edges}
      fitView
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <Background />
      <Controls />
    </ReactFlow>
  );
}

function App() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>([]);

  return (
    <div className="w-screen h-screen flex flex-col">
      <Header />
      <ReactFlowProvider>
        <div className="flex flex-grow">
          <main className="flex-grow h-full">
            <FlowCanvas nodes={nodes} setNodes={setNodes} edges={edges} />
          </main>
          <Sidebar />
        </div>
      </ReactFlowProvider>
    </div>
  );
}

export default App;