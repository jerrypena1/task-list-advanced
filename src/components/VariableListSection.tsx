import React, { useEffect, useState } from 'react';
import { VariableList } from './VariableList';
import { Merge, PlusCircle } from 'lucide-react';
import { useVariables } from '../context/variableContext';
import { MergeVariablesModal } from './MergeVariablesModal';

export function VariableListSection() {
  const [hasTokens, setHasTokens] = useState(false);
  const [showMergeVariablesModal, setShowMergeVariablesModal] = useState(false);

  const { variables, addVariable, setVariables, mergingVariables, setMergingVariables } = useVariables();

  useEffect(() => {
    const checker = variables.filter(variable => variable.token.length > 0);
    setHasTokens(checker.length > 0);
  }, [variables]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addVariable('', '', '');
  }  

  const handleMergeVariables = () => {
    setVariables(variables)
    setShowMergeVariablesModal(false);
    setMergingVariables(!mergingVariables);
  }

  const handleMergeVariableTrigger = () => {
    if (mergingVariables) {
      setMergingVariables(false);
    } else {
      setShowMergeVariablesModal(true);
    }
  }

  return (
    <>
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-gray-800 mb-2">Token Variables</h3>
        <button
          type="submit"
          className={`text-white px-4 py-2 rounded-lg flex gap-2 ${hasTokens ? mergingVariables ? 'bg-orange-600 hover:bg-blue-600 transition-colors': 'bg-blue-500 hover:bg-blue-600 transition-colors': 'bg-gray-200'}`}
          onClick={handleMergeVariableTrigger}
          disabled={!hasTokens}
        >
          <Merge size={20} />
          {mergingVariables ? "Un-Merge" : "Merge"}
        </button>
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
      <p className="text-gray-500 text-sm mb-2">A token is a placeholder you can add to a codeblock for a task. When you merge the tokens, it will allow you to specify a value that will replace the placeholder.</p>
      {variables.length > 0 ? (
        <VariableList />
      ): ''}
      {showMergeVariablesModal && (
        <MergeVariablesModal
          onClose={() => setShowMergeVariablesModal(false)}
          onMerge={handleMergeVariables}
        />
      )}
    </>
  );
}