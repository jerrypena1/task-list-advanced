import React from 'react';
import { Variable } from '../types/variable';
import { VariableItem } from './VariableItem';

interface VariableListProps {
  variables: Variable[];
  onDeleteVariable: (id: string) => void;
  editVariable: (id: string, token: string, value: string) => void;
}

export function VariableList({ variables, onDeleteVariable, editVariable }: VariableListProps) {

  return (
    <div>
        <div className="space-y-2">
          {variables.map((variable) => (
            <VariableItem
              key={variable.id}
              variable={variable}
              onDeleteVariable={onDeleteVariable}
              editVariable={editVariable}
            />
          ))}
        </div>
    </div>
  );
}