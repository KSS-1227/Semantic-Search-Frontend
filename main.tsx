import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ThemeProvider } from '@/hooks/use-theme.tsx';
import './index.css';

// Add error handling for debugging
window.addEventListener('error', (e) => {
  console.error('Global error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason);
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('Root element not found!');
  document.body.innerHTML = '<div style="padding: 20px; font-family: Arial;">Error: Root element not found. Please check the HTML structure.</div>';
} else {
  try {
    createRoot(rootElement).render(
      <StrictMode>
        <ThemeProvider defaultTheme="system" storageKey="search-app-theme">
          <App />
        </ThemeProvider>
      </StrictMode>
    );
    console.log('App rendered successfully');
  } catch (error) {
    console.error('Error rendering app:', error);
    rootElement.innerHTML = '<div style="padding: 20px; font-family: Arial;">Error loading application. Check console for details.</div>';
  }
}
