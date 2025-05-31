import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { VariableProvider } from './context/variableContext.tsx';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <VariableProvider>
      <App />
    </VariableProvider>
  </StrictMode>
);
