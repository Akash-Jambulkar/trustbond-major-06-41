
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter as Router } from 'react-router-dom'

// Error handling for React rendering
const renderApp = () => {
  try {
    // Make sure the root element exists before rendering
    const rootElement = document.getElementById("root");

    if (rootElement) {
      createRoot(rootElement).render(
        <Router>
          <App />
        </Router>
      );
      console.log("Application successfully mounted to DOM");
    } else {
      console.error("Root element not found - unable to render application");
    }
  } catch (error) {
    console.error("Fatal error during application initialization:", error);
    // Display a fallback error message in the DOM
    const rootElement = document.getElementById("root");
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="padding: 20px; text-align: center; font-family: system-ui, sans-serif;">
          <h1>Application Error</h1>
          <p>Sorry, the application failed to load. Please check the console for more details.</p>
          <pre style="background: #f0f0f0; padding: 10px; text-align: left; overflow: auto;">${error?.toString()}</pre>
        </div>
      `;
    }
  }
}

// Initialize the application
renderApp();
