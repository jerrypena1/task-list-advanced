export interface Variable {
  id: string;
  token: string;
  value: string;
}

export interface VariablesContextType {
  variables: Variable[];
  setVariables: (variables: Variable[]) => void;
  addVariable: (token: string, value: string) => void;
  deleteVariable: (id: string) => void;
  editVariable: (id: string, token: string, value: string) => void;
}
