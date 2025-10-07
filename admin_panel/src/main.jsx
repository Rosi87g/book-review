import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import PublisherContextProvider from './context/PublisherContext.jsx';
import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <PublisherContextProvider>      
            <App />
      </PublisherContextProvider>
    </ErrorBoundary>
  </BrowserRouter>
);