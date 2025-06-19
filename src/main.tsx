
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error('Root element not found');
}

console.log('Initializing React application...');

// Ensure React is fully available before proceeding
if (typeof React === 'undefined' || !React.useEffect) {
  throw new Error('React is not properly loaded');
}

// Add a small delay to ensure all modules are loaded
const initializeApp = () => {
  try {
    const root = createRoot(rootElement);
    root.render(<App />);
    console.log('React application initialized successfully');
  } catch (error) {
    console.error('Failed to initialize React application:', error);
    // Fallback: try again after a short delay
    setTimeout(() => {
      try {
        const root = createRoot(rootElement);
        root.render(<App />);
        console.log('React application initialized successfully on retry');
      } catch (retryError) {
        console.error('Failed to initialize React application on retry:', retryError);
      }
    }, 100);
  }
};

// Use requestAnimationFrame to ensure DOM is ready
requestAnimationFrame(initializeApp);
