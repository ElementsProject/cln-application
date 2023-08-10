import React from 'react';

import ReactDOM from 'react-dom/client';
import App from './components/App/App';
import { AppProvider } from './store/AppContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <AppProvider>
    <App />
  </AppProvider>
);
