
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Ensure DOM is ready before React initialization
const initializeApp = () => {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    console.error('Root element not found');
    return;
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
  }
};

// Wait for both DOM and all scripts to be fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // Add additional delay to ensure all scripts are loaded
    setTimeout(initializeApp, 100);
  });
} else {
  // DOM is already ready, but add delay for safety
  setTimeout(initializeApp, 50);
}
