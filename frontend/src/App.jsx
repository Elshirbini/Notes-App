/* eslint-disable no-unused-vars */
import React from "react";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./Layout/MainLayout";

import AuthLayout from "./Layout/AuthLayout";

import ProtectedRoutes from "./components/ProtectedRoutes/ProtectedRoutes";

import { Home } from "./pages/Home/Home";
import { Login } from "./pages/Login/Login";
import { SignUp } from "./pages/SignUp/SignUp";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import { CodeValidation } from "./pages/ResetPassword/CodeValidation";
import NewPassword from "./pages/ResetPassword/NewPassword";
import DeleteAccount from "./pages/DeleteAccount/DeleteAccount";

export default function App() {
  let routes = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        { index: true, element: <Home /> },
        {
          path: "dashboard",
          element: (
            <ProtectedRoutes>
              <Home />
            </ProtectedRoutes>
          ),
        },
      ],
    },
    {
      path: "/",
      element: <AuthLayout />,
      children: [
        { path: "login", element: <Login /> },
        { path: "signup", element: <SignUp /> },
        {
          path: "reset",
          element: <ResetPassword />,
        },
        {
          path: "validation",
          element: <CodeValidation />,
        },
        {
          path: "newpassword/:userId",
          element: <NewPassword />,
        },
        // {
        //   path: "deleteaccount",
        //   element: <DeleteAccount />,
        // },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={routes} />
    </>
  );
}
