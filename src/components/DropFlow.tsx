// DropFlow.tsx: Main component for the visual message flow editor.
// Handles rendering the React Flow canvas, drag-and-drop of nodes, connection logic, cycle prevention, and node editing UI.
// Integrates custom node types and manages all user interactions for building message flows.

import React, { useCallback } from 'react'; //memoized version of a call back 
// useReactFlow: React hook that gives you access to React Flow instance methods (e.g., add nodes, fit view, get/set state) inside your components.
// ReactFlow: The main React component that renders the interactive flow canvas, nodes, and edges. Use it in your JSX to display and manage the flow UI.
import { useReactFlow, ReactFlow, Background, Controls, addEdge, MarkerType } from 'reactflow';
import type { Node, Edge, NodeChange, EdgeChange, Connection } from 'reactflow';//import types for react flow objects 
import type { Dispatch, SetStateAction } from 'react';//imports the types for React's state setter functions for setNode , setEdges,.... 
import { Sidebar } from './panels/Sidebar';
import { TextMessageNode } from './nodes/TextMessageNode';
import { v4 as uuidv4 } from 'uuid';

const nodeTypes = {
    textMessage: TextMessageNode,
};

//check for indirect loops 
function wouldCreateCycle(edges: Edge[], source: string, target: string): boolean {
    const adj: Record<string, string[]> = {};
    edges.forEach(edge => {
        if (!adj[edge.source]) adj[edge.source] = [];
        adj[edge.source].push(edge.target);
    });
    if (!adj[source]) adj[source] = [];
    adj[source].push(target);
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

//gives types to all props properly 
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
    reactFlowWrapper: React.RefObject<HTMLDivElement | null>;
    onDeleteNode?: (nodeId: string) => void;
    setErrorMessage: (msg: string | null) => void;
};

const DropFlow: React.FC<DropFlowProps> = (props) => {
    //lets users add new message nodes to the canvas by dragging and dropping,Calcs drop positions.
    const { project } = useReactFlow();
    const { setNodes, reactFlowWrapper, edges, setEdges, setSelectedNode, nodes, setErrorMessage } = props;
    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();
            const reactFlowBounds = reactFlowWrapper.current!.getBoundingClientRect();
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
            setNodes((nds) => nds.concat(newNode));
            setErrorMessage(null); // clear error on successful drop
        },
        [setNodes, project, reactFlowWrapper, setErrorMessage]//dependency array for callback
    );

    //after connect check for self loops , cycle , multiple outgoing .checks evertime when flow is updated
    const onConnect = useCallback(
        (connection: Connection) => {
            if (connection.source === connection.target) {
                setErrorMessage("Error: Cannot connect a node to itself.");
                return;
            }
            const sourceHasEdge = edges.some(edge => edge.source === connection.source && edge.sourceHandle === connection.sourceHandle);
            if (sourceHasEdge) {
                setErrorMessage("Error: A source handle can only have one outgoing connection.");
                return;
            }

            if (wouldCreateCycle(edges, connection.source!, connection.target!)) {
                setErrorMessage("Error: This connection would create a cycle in the flow.");
                return;
            }
            setEdges((eds) => addEdge({
                ...connection,
                type: 'default',
                markerEnd: { type: MarkerType.ArrowClosed, width: 30, height: 30 }
            }, eds));
            setErrorMessage(null); // clear error on successful connect
        },
        [edges, setEdges, setErrorMessage]
    );

    //on choosing a node shows its details on the side bar for editing purpose .... 
    const onSelectionChange = useCallback((params: { nodes: Node[] }) => {
        if (params.nodes.length > 0) {
           
            const node = nodes.find(n => n.id === params.nodes[0].id);
            setSelectedNode(node || null);
        } else {
            setSelectedNode(null);
        }
    }, [setSelectedNode, nodes]);

    return (
        <div className="flex flex-grow">
            <main className="flex-grow h-full" ref={props.reactFlowWrapper}>
                <ReactFlow
                    nodes={props.nodes}
                    edges={props.edges}
                    onNodesChange={props.onNodesChange}
                    onEdgesChange={props.onEdgesChange}
                    onConnect={onConnect}
                    onPaneClick={props.onPaneClick}
                    onDragOver={props.onDragOver}
                    onDrop={onDrop}
                    nodeTypes={nodeTypes}
                    fitView
                    onSelectionChange={onSelectionChange}
                >
                    <Background />
                    <Controls />
                </ReactFlow>
            </main>
            <Sidebar
                selectedNode={props.selectedNode}
                updateNodeText={props.updateNodeText}
                setSelectedNode={props.setSelectedNode}
                onDeleteNode={props.onDeleteNode}
            />
        </div>
    );
};

export default DropFlow;
 