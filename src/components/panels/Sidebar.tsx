import type { Node } from 'reactflow';
import { NodesPanel } from './NodesPanel';
import { SettingsPanel } from './SettingsPanel';

// Define the props the Sidebar will receive from App.tsx
type SidebarProps = {
  selectedNode: Node | null;
  updateNodeText: (nodeId: string, text: string) => void;
  setSelectedNode: (node: Node | null) => void;
  onDeleteNode?: (nodeId: string) => void;
};

export const Sidebar = ({ selectedNode, updateNodeText, setSelectedNode, onDeleteNode }: SidebarProps) => {
  return (
    <aside className="w-80 bg-gray-50 border-l border-gray-200">
      {/* If a node is selected, show the SettingsPanel */}
      {selectedNode ? (
        <SettingsPanel
          value={selectedNode.data.label || ''}
          onChange={(newText) => updateNodeText(selectedNode.id, newText)}
          onBack={() => setSelectedNode(null)}
          onDelete={onDeleteNode ? () => onDeleteNode(selectedNode.id) : undefined}
        />
      ) : (
        /* Otherwise, show the NodesPanel */
        <NodesPanel />
      )}
    </aside>
  );
};
