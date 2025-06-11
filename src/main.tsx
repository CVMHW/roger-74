
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Ensure React is properly initialized before any components load
if (typeof React === 'undefined' || !React) {
  throw new Error('React failed to load properly');
}

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error('Root element not found');
}

console.log('🚀 Initializing React application with enhanced error handling...');

// Enhanced initialization with multiple fallback strategies
const initializeApp = () => {
  try {
    // Strategy 1: Standard initialization with StrictMode
    console.log('📦 Attempting standard React initialization...');
    const root = createRoot(rootElement);
    
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    console.log('✅ React application initialized successfully with StrictMode');
    
  } catch (strictModeError) {
    console.warn('⚠️ StrictMode initialization failed:', strictModeError);
    
    try {
      // Strategy 2: Fallback without StrictMode
      console.log('🔄 Attempting fallback initialization without StrictMode...');
      const fallbackRoot = createRoot(rootElement);
      
      fallbackRoot.render(<App />);
      
      console.log('✅ React application initialized successfully without StrictMode');
      
    } catch (fallbackError) {
      console.error('❌ All initialization strategies failed:', fallbackError);
      
      // Strategy 3: Emergency DOM fallback
      rootElement.innerHTML = `
        <div style="padding: 20px; text-align: center; color: red;">
          <h1>Application Initialization Error</h1>
          <p>Please refresh the page. If the problem persists, clear your browser cache.</p>
          <details>
            <summary>Technical Details</summary>
            <pre>${fallbackError.message}</pre>
          </details>
        </div>
      `;
    }
  }
};

// Ensure DOM is ready before initialization
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}
