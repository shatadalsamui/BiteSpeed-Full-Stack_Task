import type { Node, Edge } from 'reactflow';

// Define the props the Header will receive
type HeaderProps = {
  nodes: Node[];
  edges: Edge[];
  setErrorMessage: (msg: string | null) => void;
};

export const Header = ({ nodes, edges, setErrorMessage }: HeaderProps) => {
  // This function contains the save validation logic
  const onSave = () => {
    // 1. Get all node IDs that are a target of an edge
    const targetNodeIds = new Set(edges.map(edge => edge.target));

    // 2. Filter for nodes that do not have any incoming edges
    const nodesWithEmptyTargets = nodes.filter(node => !targetNodeIds.has(node.id));

    // 3. Check the validation condition
    if (nodes.length > 1 && nodesWithEmptyTargets.length > 1) {
      setErrorMessage('Error: Cannot save Flow. More than one node has an empty target handle.');
    } else {
      setErrorMessage(null);
      // Optionally, you can show a green box for success, or just log
      console.log('Saved Flow:', { nodes, edges });
    }
  };

  return (
    <header className="bg-gray-100 p-3 border-b border-gray-200 flex justify-end">
      <button
        onClick={onSave}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
      >
        Save Changes
      </button>
    </header>
  );
};
