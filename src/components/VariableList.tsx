import React from 'react';
import { VariableItem } from './VariableItem';
import { useVariables } from '../context/variableContext';
// import { VariableContext } from '../context/variableContext';
// import { VariablesContextType } from '../types/variable';

export function VariableList() {

  const { variables } = useVariables();

  return (
    <div>
        <div className="space-y-2">
          {variables.map((variable) => (
            <VariableItem
              key={variable.id}
              variable={variable}
            />
          ))}
        </div>
    </div>
  );
}