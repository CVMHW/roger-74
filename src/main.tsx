
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error('Root element not found');
}

console.log('Initializing React application...');

try {
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log('React application initialized successfully');
} catch (error) {
  console.error('Failed to initialize React application:', error);
  // Fallback: try without StrictMode
  const root = createRoot(rootElement);
  root.render(<App />);
}
