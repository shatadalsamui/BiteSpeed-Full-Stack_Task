// src/App.tsx
// src/App.tsx
import { useState, useRef, useCallback } from 'react';
import ReactFlow, {
    ReactFlowProvider,
    Background,
    Controls,
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
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

    const onConnect = useCallback(
        (connection: Connection) => {
            // **RULE: A source handle can only have one outgoing edge.**
            const sourceHasEdge = edges.some(edge => edge.source === connection.source && edge.sourceHandle === connection.sourceHandle);
            if (sourceHasEdge) {
                alert("Error: A source handle can only have one outgoing connection.");
                return;
            }
            setEdges((eds) => addEdge(connection, eds));
        },
        [edges] // We need 'edges' in the dependency array to check the current edges
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

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();
            const reactFlowBounds = reactFlowWrapper.current!.getBoundingClientRect();
            const type = event.dataTransfer.getData('application/reactflow');

            if (typeof type === 'undefined' || !type) return;

            const position = {
                x: event.clientX - reactFlowBounds.left,
                y: event.clientY - reactFlowBounds.top,
            };

            const newNode: Node = {
                id: uuidv4(),
                type,
                position,
                data: { label: `New Message` },
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [setNodes]
    );
    
    const updateNodeText = (nodeId: string, text: string) => {
        setNodes((nds) =>
          nds.map((node) => {
            if (node.id === nodeId) {
              return { ...node, data: { ...node.data, label: text } };
            }
            return node;
          })
        );
        setSelectedNode(prev => prev ? {...prev, data: {...prev.data, label: text}} : null);
      };

    return (
        <div className="w-screen h-screen flex flex-col">
            <Header nodes={nodes} edges={edges} />
            <ReactFlowProvider>
                <div className="flex flex-grow">
                    <main className="flex-grow h-full" ref={reactFlowWrapper}>
                        <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            onConnect={onConnect}
                            onNodeClick={onNodeClick}
                            onPaneClick={onPaneClick}
                            onDragOver={onDragOver}
                            onDrop={onDrop}
                            nodeTypes={nodeTypes}
                            fitView
                        >
                            <Background />
                            <Controls />
                        </ReactFlow>
                    </main>
                    <Sidebar 
                      selectedNode={selectedNode}
                      updateNodeText={updateNodeText}
                      setSelectedNode={setSelectedNode}
                    />
                </div>
            </ReactFlowProvider>
        </div>
    );
}

export default App;