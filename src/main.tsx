
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error('Root element not found');
}

console.log('Initializing React application...');

// Wait for React to be fully loaded with multiple checks
const waitForReact = () => {
  return new Promise<void>((resolve) => {
    const checkReact = () => {
      if (typeof React !== 'undefined' && 
          React.useState && 
          React.useEffect && 
          React.useContext &&
          typeof React.useState === 'function') {
        resolve();
      } else {
        setTimeout(checkReact, 10);
      }
    };
    checkReact();
  });
};

const initializeApp = async () => {
  try {
    // Wait for React to be fully available
    await waitForReact();
    
    console.log('React confirmed ready, initializing app...');
    const root = createRoot(rootElement);
    root.render(<App />);
    console.log('React application initialized successfully');
  } catch (error) {
    console.error('Failed to initialize React application:', error);
    // Show error to user
    rootElement.innerHTML = '<div style="padding: 20px; color: red;">Failed to load application. Please refresh the page.</div>';
  }
};

// Start initialization
initializeApp();
