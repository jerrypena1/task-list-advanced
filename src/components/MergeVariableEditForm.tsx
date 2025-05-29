import React, { useEffect, useState } from 'react';
import { Variable } from '../types/variable';

interface MergeVariableEditFormProps {
  variable: Variable;
  editVariable: (id: string, token: string, value: string) => void;
}

export function MergeVariableEditForm({ variable, editVariable }: MergeVariableEditFormProps) {
  const [value, setValue] = useState(variable.value);

  useEffect(() => {
    editVariable(variable.id, variable.token, value);
  }, [value]);

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
            Token: %%{variable.token}%%
        </div>
        <div className="flex flex-wrap gap-2">
          <label>
            Value:
            <input
              type="text"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
              }}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 transition-colors min-w-[200px]"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
