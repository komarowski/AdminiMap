import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate  
} from "react-router-dom";
import HomePage from "./components/pages/home-page"
import LoginPage from './components/pages/login-page';
import AdminPage from './components/pages/admin-page';
import "./assets/css/w4.css";
import { Pages } from './constants';
import { ProtectedLayout } from './components/layout/protected-layout';


const router = createBrowserRouter([
  {
    path: Pages.HOME,
    element: <HomePage />,
  },
  {
    path: Pages.LOGIN,
    element: <LoginPage />,
  },
  {
    path: Pages.PROFILE,
    element: <ProtectedLayout children={<AdminPage />} />,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
