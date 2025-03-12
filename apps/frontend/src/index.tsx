import React from 'react';

import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { RootProvider } from './store/RootContext';
import { rootRouter } from './utilities/router.config';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <RootProvider>
    <RouterProvider router={rootRouter} />
  </RootProvider>
);
