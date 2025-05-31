import React from 'react';
import { Variable } from '../types/variable';

interface VariableDisplayProps {
  variable: Variable;
  handleCopy: () => void;
}

export function VariableDisplay({ variable, handleCopy }: VariableDisplayProps) {

  const handleDisplayCopy = () => {
    if (variable.token.length) handleCopy();
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <div className="space-y-3">
        <div className="flex flex-col flex-wrap gap-2 items-start">
          <p>
            {variable.description?.length ? variable.description : 'Token'}
          </p>
          <p>
          {variable.token.length ? (
            <button className="border border-gray-200 py-2 px-4 rounded" onClick={handleDisplayCopy}>%%{variable.token}%%</button>
          ): ''}
          </p>
        </div>
      </div>
    </div>
  );
}
