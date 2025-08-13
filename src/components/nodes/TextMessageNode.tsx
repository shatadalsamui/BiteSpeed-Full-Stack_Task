import { Handle, Position } from 'reactflow';// handle is for connections points,position is for left ,right,....
import type { NodeProps } from 'reactflow'; // type for the message node
import './node-styles.css';
import { FaWhatsapp } from 'react-icons/fa';// icon

export const TextMessageNode = (props: NodeProps) => {
  const { data, selected } = props;
  return (
    <div className={`text-message-node ${selected ? 'selected' : ''}`}>
      {/*left connection point ,handles incoming connections only*/}
      <Handle
        type="target"
        position={Position.Left}
        className="handle"
      />
      <div className="node-header">
        <span className="header-text">Send Message</span>
        <div className="whatsapp-icon-wrapper">
          <FaWhatsapp size={28} color="#25D366" />{/*The whatsapp icon*/}
        </div>
      </div>
      <div className="node-body">
        {data.label || 'text message'}
      </div>
      {/*right connection point, handles outgoing connections only */}
      <Handle
        type="source"
        position={Position.Right}
        className="handle"
      />
    </div>
  );
};