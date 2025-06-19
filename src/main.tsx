
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error('Root element not found');
}

console.log('Initializing React application...');

// Enhanced React readiness check with multiple validation points
const waitForReact = () => {
  return new Promise<void>((resolve) => {
    let attempts = 0;
    const maxAttempts = 500; // 5 seconds max wait
    
    const checkReact = () => {
      attempts++;
      
      const isReactReady = typeof React !== 'undefined' && 
                          React.useState && 
                          React.useEffect && 
                          React.useContext &&
                          React.useRef &&
                          React.useMemo &&
                          typeof React.useState === 'function' &&
                          typeof React.useEffect === 'function' &&
                          typeof React.useContext === 'function' &&
                          typeof React.useRef === 'function' &&
                          typeof React.useMemo === 'function' &&
                          React.useState !== null &&
                          React.useEffect !== null &&
                          React.useContext !== null;
                          
      if (isReactReady) {
        console.log(`React confirmed ready after ${attempts} attempts`);
        resolve();
      } else if (attempts >= maxAttempts) {
        console.error('React failed to initialize after maximum attempts');
        // Still resolve to prevent infinite waiting
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
    
    // Additional validation before creating root
    if (!React || !React.useState) {
      throw new Error('React hooks are not available');
    }
    
    console.log('React confirmed ready, initializing app...');
    const root = createRoot(rootElement);
    root.render(<App />);
    console.log('React application initialized successfully');
  } catch (error) {
    console.error('Failed to initialize React application:', error);
    // Show error to user
    rootElement.innerHTML = '<div style="padding: 20px; color: red; text-align: center;">Failed to load application. Please refresh the page.</div>';
  }
};

// Start initialization
initializeApp();
