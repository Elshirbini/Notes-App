/* eslint-disable no-unused-vars */

import React from "react";
import { Outlet } from "react-router-dom";
import { NavbarNorm } from "../components/NavbarNorm/NavbarNorm";

export default function MainLayout() {
  return (
    <>
      {/* <NavbarNorm /> */}
      <Outlet />
    </>
  );
}
