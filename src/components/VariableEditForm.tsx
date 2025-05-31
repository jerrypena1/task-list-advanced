import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { useVariables, Variable } from '../context/variableContext';

interface VariableEditFormProps {
  variable: Variable;
  setIsEditing: (isEditing: boolean) => void;
}

export function VariableEditForm({ variable, setIsEditing }: VariableEditFormProps) {
  const [token, setToken] = useState(variable.token);
  // const descriptionChecker = variable?.description ? variable.description: '';
  const [description, setDescription] = useState(variable?.description || '');

  const { editVariable } = useVariables();

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <div className="space-y-3">
        <form onSubmit={() => {
          editVariable(variable.id, token, variable.value, description);
          setIsEditing(false);
        }}>
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
            <label>
              Description:
              <input
                type="text"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 transition-colors min-w-[200px]"
              />
            </label>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <Save size={20} />
              Store
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
