import React, { useState } from 'react';
import { Variable } from '../types/variable';
import { Save } from 'lucide-react';

interface VariableEditFormProps {
  variable: Variable;
  editVariable: (id: string, token: string, value: string) => void;
  setIsEditing: (isEditing: boolean) => void;
}

export function VariableEditForm({ variable, editVariable, setIsEditing }: VariableEditFormProps) {
  const [token, setToken] = useState(variable.token);

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <label>
            Token:
            <input
              type="text"
              value={token}
              onChange={(e) => {
                setToken(e.target.value);
              }}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 transition-colors min-w-[200px]"
            />
          </label>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
            onClick={() => {
              editVariable(variable.id, token, variable.value);
              setIsEditing(false);
            }}
          >
            <Save size={20} />
            Store
          </button>
        </div>
      </div>
    </div>
  );
}
