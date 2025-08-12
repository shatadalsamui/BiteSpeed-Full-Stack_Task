import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import './node-styles.css';
import { FaWhatsapp } from 'react-icons/fa';

export const TextMessageNode = (props: NodeProps) => {
  const { data, selected } = props;
  return (
    <div className={`text-message-node ${selected ? 'selected' : ''}`}>
      <Handle
        type="target"
        position={Position.Left}
        className="handle"
      />
      <div className="node-header">
        <span className="header-text">Send Message</span>
        <div className="whatsapp-icon-wrapper">
          <FaWhatsapp size={28} color="#25D366" />
        </div>
      </div>
      <div className="node-body">
        {data.label || 'text message'}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="handle"
      />
    </div>
  );
};