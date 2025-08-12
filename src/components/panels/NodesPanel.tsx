// src/components/Panels/NodesPanel.tsx
import React from 'react';

export const NodesPanel = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Nodes Panel</h3>
      <div
        className="border-2 border-blue-500 rounded-md p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50"
        onDragStart={(event) => onDragStart(event, 'textMessage')}
        draggable
      >
        <div className="text-blue-500 mb-2 text-2xl">✉️</div>
        <div className="text-blue-500 text-sm">Message</div>
      </div>
    </div>
  );
};