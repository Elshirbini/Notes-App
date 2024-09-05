/* eslint-disable no-unused-vars */
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home/Home";
import { Login } from "./pages/Login/Login";
import { SignUp } from "./pages/SignUp/SignUp";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import CodeValidation from "./pages/ResetPassword/CodeValidation";
import NewPassword from "./pages/ResetPassword/NewPassword";

const routes = (
  <Router>
    <Routes>
      <Route path="/" exact element={<Login />} />
      <Route path="/login" exact element={<Login />} />
      <Route path="/dashboard" exact element={<Home />} />
      <Route path="/signup" exact element={<SignUp />} />
      <Route path="/reset" exact element={<ResetPassword />} />
      <Route path="/validation" exact element={<CodeValidation />} />
      <Route path="/newpassword/:userId" exact element={<NewPassword />} />
    </Routes>
  </Router>
);

export const App = () => {
  return <div>{routes}</div>;
};
