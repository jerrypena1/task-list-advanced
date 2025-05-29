import React, { useEffect } from 'react';
import { Variable } from '../types/variable';
import { VariableList } from './VariableList';
import { PlusCircle } from 'lucide-react';

interface VariableListSectionProps {
  variables: Variable[];
  onDeleteVariable: (id: string) => void;
  addVariable: (token: string, value: string) => void;
  editVariable: (id: string, token: string, value: string) => void;
}

export function VariableListSection({
  variables,
  onDeleteVariable,
  addVariable,
  editVariable,
}: VariableListSectionProps) {

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addVariable('', '');
  }

  return (
    <>
      <div className="flex justify-between">
        <div>
          <h3 className="font-semibold text-gray-800 mb-2">Token Variables</h3>
          <p className="text-gray-500">Manage your variables here.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="task-input flex flex-wrap gap-2 justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <PlusCircle size={20} />
              Add
            </button>
          </div>
        </form>
      </div>
      {variables.length > 0 ? (
        <VariableList
          variables={variables}
          onDeleteVariable={onDeleteVariable}
          editVariable={editVariable}
        />
      ): ''}
    </>
  );
}