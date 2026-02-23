import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import FilterPage from './pages/FilterPage';
import { regionLoader } from './loaders';
import './index.css'; 

const router = createBrowserRouter([
  {
    path: "/",
    element: <FilterPage />,
    loader: regionLoader,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
