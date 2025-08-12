import React from 'react';

type SettingsPanelProps = {
  value: string;
  onChange: (value: string) => void;
  onBack: () => void;
  onDelete?: () => void;
};

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ value, onChange, onBack, onDelete }) => {
  return (
    <div className="p-4 flex flex-col gap-4">
      <button onClick={onBack} className="text-blue-600 hover:underline self-start">
        ← Back
      </button>
      <label className="block text-sm font-medium text-gray-700">
        Text
      </label>
      <textarea
        className="w-full border rounded p-2 min-h-[100px] shadow-sm"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      {onDelete && (
        <button
          onClick={onDelete}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mt-2"
        >
          Delete Node
        </button>
      )}
    </div>
  );
};
