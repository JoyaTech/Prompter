import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './locales/i18n'; // Initialize internationalization
import './index.css'; // Import global styles

// Import theme context for CSS variables
import { ThemeProvider } from './components/common/ThemeContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);