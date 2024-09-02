/* eslint-disable no-unused-vars */
import React, { useState } from "react";

import { validateEmail } from "../../utils/helper";

import axiosInstance from "../../utils/axiosInstance";

import { Link, useNavigate } from "react-router-dom";
import { NavbarNorm } from "../../components/NavbarNorm/NavbarNorm";
import { PasswordInput } from "../../components/Input/PasswordInput";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      const response = await axiosInstance.post("/sendcode", {
        email: email,
      });
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again");
      }
    }
  };
  return (
    <>
      <NavbarNorm />
      <div className="flex items-center justify-center mt-28">
        <div className="w-96 border rounded bg-white px-7 py-10">
          <form onSubmit={handleReset}>
            <h4 className="text-2xl mb-7">Reset Password</h4>
            <input
              type="text"
              placeholder="Email"
              className="input-box"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {error && <p className="text-red-500 text-xs pb-1">{error}</p>}

            <button type="submit" className="btn-primary">
              Send Code
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
