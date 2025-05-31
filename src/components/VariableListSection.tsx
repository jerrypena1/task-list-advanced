import React from 'react';
import { VariableList } from './VariableList';
import { PlusCircle } from 'lucide-react';
import { useVariables } from '../context/variableContext';

export function VariableListSection() {

  const { variables, addVariable } = useVariables();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addVariable('', '', '');
  }

  return (
    <>
      <div className="flex justify-between">
        <div className="mb-2">
          <h3 className="font-semibold text-gray-800 mb-2">Token Variables</h3>
          <p className="text-gray-500">A token is a placeholder you can add to a codeblock for a task. When you merge the tokens, it will allow you to specify a value that will replace the placeholder.</p>
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
        <VariableList />
      ): ''}
    </>
  );
}