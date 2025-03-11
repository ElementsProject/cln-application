import React from 'react';

import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { AppProvider } from './store/AppContext';
import { rootRouter } from './utilities/router.config';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <AppProvider>
    <RouterProvider router={rootRouter} />
  </AppProvider>
);
