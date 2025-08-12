// src/App.tsx
import { useState } from 'react';
import ReactFlow, { ReactFlowProvider, Background, Controls } from 'reactflow';
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

function App() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>([]);

  return (
    <div className="w-screen h-screen flex flex-col">
      <Header />
      <ReactFlowProvider>
        <div className="flex flex-grow">
          <main className="flex-grow h-full">
            <ReactFlow nodes={nodes} edges={edges} fitView>
              <Background />
              <Controls />
            </ReactFlow>
          </main>
          <Sidebar />
        </div>
      </ReactFlowProvider>
    </div>
  );
}

export default App;