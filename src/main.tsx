import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BoardProvider } from './data/store';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BoardProvider>
      <App />
    </BoardProvider>
  </StrictMode>,
);
