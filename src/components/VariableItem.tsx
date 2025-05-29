import React, { useState } from 'react';
import { Copy, Edit2, Trash2 } from 'lucide-react';
import { Variable } from '../types/variable';
import { VariableEditForm } from './VariableEditForm';
import { VariableDisplay } from './VariableDisplay';

interface VariableItemProps {
  variable: Variable;
  onDeleteVariable: (id: string) => void;
  editVariable: (id: string, token: string, value: string) => void;
}

export function VariableItem({ variable, onDeleteVariable, editVariable }: VariableItemProps) { 
  const [isEditing, setIsEditing] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(variable.token.length ? `%%${variable.token}%%` : '');
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm group">
      <div className={`flex ${isEditing ? 'items-start': 'items-center'} gap-3`}>
        <div className="flex-1 overflow-x-auto">
          <div className="flex items-center gap-2">
            {isEditing ? (
              <VariableEditForm variable={variable} editVariable={editVariable} setIsEditing={setIsEditing} />
            ): (
              <VariableDisplay variable={variable} handleCopy={handleCopy} />
            )}
            
          </div>
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {variable.token.length && !isEditing ? (
            <button
                onClick={handleCopy}
                className="text-gray-400 hover:text-blue-500 transition-colors"
                title="Duplicate task"
              >
                <Copy size={18} />
            </button>
          ): ''}
          {isEditing ? '': (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-gray-400 hover:text-blue-500 transition-colors"
              title="Edit list"
            >
              <Edit2 size={16} />
            </button>
          )}
          <button
              onClick={() => onDeleteVariable(variable.id)}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 size={18} />
            </button>
        </div>
      </div>
    </div>
  );
}