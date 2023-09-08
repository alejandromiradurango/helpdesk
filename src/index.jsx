import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider } from "@material-tailwind/react";
import { ProSidebarProvider } from 'react-pro-sidebar';
import { ContextApp } from './contexts/ContextApp';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <ContextApp>
        <ProSidebarProvider>
          <App />
        </ProSidebarProvider>
      </ContextApp>
    </ThemeProvider>
  </React.StrictMode>
);

reportWebVitals();
