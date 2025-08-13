import { useState, useRef, useCallback } from 'react';
import { ReactFlowProvider, applyNodeChanges, applyEdgeChanges } from 'reactflow';
import type { Node, Edge, NodeChange, EdgeChange } from 'reactflow';
import 'reactflow/dist/style.css';
import { Header } from './components/Header';
import DropFlow from './components/DropFlow';

//default message node
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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

  //update message node's text
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

  // Delete node and its edges
  const onDeleteNode = (nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
    setSelectedNode(null);
  };

  return (
    <div className="w-screen h-screen flex flex-col">
      <Header nodes={nodes} edges={edges} setErrorMessage={setErrorMessage} setSuccessMessage={setSuccessMessage} />
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 text-center font-semibold">
          {errorMessage}
          <button className="ml-4 text-red-700 underline" onClick={() => setErrorMessage(null)}>Dismiss</button>
        </div>
      )}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 text-center font-semibold">
          {successMessage}
          <button className="ml-4 text-green-700 underline" onClick={() => setSuccessMessage(null)}>Dismiss</button>
        </div>
      )}
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
          onDeleteNode={onDeleteNode}
          setErrorMessage={setErrorMessage}
        />
      </ReactFlowProvider>
    </div>
  );
}

export default App;