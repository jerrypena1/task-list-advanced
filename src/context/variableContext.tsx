import React, { createContext, useState, useContext } from "react";


export interface Variable {
  id: string;
  token: string;
  value: string;
}

interface VariablesContextType {
  variables: Variable[];
  mergingVariables: boolean;
  setMergingVariables: (mergingVariables: boolean) => void;
  setVariables: (variables: Variable[]) => void;
  addVariable: (token: string, value: string) => void;
  deleteVariable: (id: string) => void;
  editVariable: (id: string, token: string, value: string) => void;
}

const VariableContext = createContext<VariablesContextType | undefined>(undefined);

export const VariableProvider: React.FC<{ children: React.ReactNode }> = ({
 children,
}) => {
  const [variables, setVariables] = useState<Variable[]>([]);
  const [mergingVariables, setMergingVariables] = useState<boolean>(false);

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
    <VariableContext.Provider value={{ variables, setVariables, mergingVariables, setMergingVariables, addVariable, deleteVariable, editVariable }}>
      {children}
    </VariableContext.Provider>
  );
};

export const useVariables = (): VariablesContextType => {
  const context = useContext(VariableContext);
  if (!context) throw new Error("useVariables must be used within a VariableProvider");

  return context;
}
