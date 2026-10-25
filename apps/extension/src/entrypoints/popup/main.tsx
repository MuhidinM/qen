import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@qen/react/styles.css';
import './popup.css';
import { Popup } from './Popup';

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <Popup />
  </StrictMode>,
);
