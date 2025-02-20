import React, { useState } from 'react';
import { Edit2, Check, X } from 'lucide-react';

interface EditableMessageProps {
  text: string;
  onSave: (newText: string) => void;
  onCancel: () => void;
}

export function EditableMessage({ text, onSave, onCancel }: EditableMessageProps) {
  const [editedText, setEditedText] = useState(text);

  const handleSave = () => {
    if (editedText.trim() !== '') {
      onSave(editedText);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <textarea
        value={editedText}
        onChange={(e) => setEditedText(e.target.value)}
        className="w-full p-2 bg-gray-700 text-white rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-violet-500"
        rows={3}
        autoFocus
      />
      <div className="flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="p-2 text-gray-400 hover:text-gray-300 rounded-lg"
        >
          <X className="w-4 h-4" />
        </button>
        <button
          onClick={handleSave}
          className="p-2 text-violet-400 hover:text-violet-300 rounded-lg"
        >
          <Check className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
