import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useVariables } from '../context/variableContext';
import { MergeVariableEditForm } from './MergeVariableEditForm';
// import VariableContext from '../context/variableContext';

interface MergeVariablesModalProps {
  onClose: () => void;
  onMerge: () => void;
}

export function MergeVariablesModal({ onClose, onMerge }: MergeVariablesModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [hasValues, setHasValues] = useState(false);

  const { variables } = useVariables();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    inputRef.current?.focus();

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  useEffect(() => {
    const checker = variables.filter(variable => variable.value.length > 0);
    setHasValues(checker.length > 0);
  }, [variables]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hasValues) {
      onClose();
      onMerge();
    }
  };

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
      <div ref={modalRef} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Set Variable Values</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            {variables.filter(variable => variable.token.length > 0).map(variable => (
              <MergeVariableEditForm key={variable.id} variable={variable} />
            ))}
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 ${hasValues ? 'bg-blue-500 hover:bg-blue-600': 'bg-gray-200'}  text-white rounded-md`}
              disabled={!hasValues}
            >
              Merge
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}