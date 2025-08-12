// src/components/Panels/Sidebar.tsx
import React from 'react';
import { NodesPanel } from './NodesPanel';

export const Sidebar = () => {
  return (
    <aside className="w-80 bg-gray-50 border-l border-gray-200">
      <NodesPanel />
    </aside>
  );
};