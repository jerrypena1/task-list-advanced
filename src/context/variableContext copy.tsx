import React, { createContext, useState } from "react";
import { Variable } from "../types/variable";

const defaultVariables: Variable[] = [];

export const VariableContext = createContext({
  variables: defaultVariables,
});

interface VariableProviderProps {
  children: React.ReactNode;
}

const VariableProvider = ({ children }: VariableProviderProps) => {
  const [variables, setVariables] = useState<Variable[]>(defaultVariables); // Initialize variables as an empty array

  const addVariable = (token: string, value: string) => {
    const newVariable: Variable = {
      id: crypto.randomUUID(),
      token,
      value,
    };
    setVariables([...variables, newVariable]);
  };

  const deleteVariable = (id: string) => {
    setVariables(variables.filter((variable) => variable.id !== id));
  };

  const editVariable = (id: string, token: string, value: string) => {
    setVariables(variables.map((variable) =>
        variable.id === id ? { ...variable, token, value } : variable
      )
    );
  };

  return (
    <VariableContext.Provider value={{ variables, setVariables, addVariable, deleteVariable, editVariable }}>
    {children}
    </VariableContext.Provider>
  );
};

export default VariableProvider;
