import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import AppContextProvider from './context/AppContext';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <AppContextProvider>
          <App />
        </AppContextProvider>
    </ErrorBoundary>
  </BrowserRouter>
);