import React from 'react';

type SettingsPanelProps = {
  value: string;
  onChange: (value: string) => void;
  onBack: () => void;
};

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ value, onChange, onBack }) => {
  return (
    <aside className="w-80 bg-gray-50 border-l border-gray-200 p-4 flex flex-col gap-4">
      <button onClick={onBack} className="text-blue-600 hover:underline self-start">← Back</button>
      <label className="block text-sm font-medium text-gray-700 mb-2">Edit Message</label>
      <textarea
        className="w-full border rounded p-2 min-h-[80px]"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </aside>
  );
};
