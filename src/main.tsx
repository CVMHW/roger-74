
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
  root.render(<App />);
  console.log('React application initialized successfully');
} catch (error) {
  console.error('Failed to initialize React application:', error);
  // Show error to user
  rootElement.innerHTML = '<div style="padding: 20px; color: red; text-align: center;">Failed to load application. Please refresh the page.</div>';
}
