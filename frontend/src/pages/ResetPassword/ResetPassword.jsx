/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { BASE_URL } from "../../utils/constants";

import axios from "axios";

import { useFormik } from "formik";
import * as Yup from "yup";

import { NavbarNorm } from "../../components/NavbarNorm/NavbarNorm";

const ResetPassword = () => {
  let navigate = useNavigate();
  let [error, setError] = useState("");
  let [loading, setLoading] = useState(true);

  function sendDataToApi(values) {
    setLoading(false);
    axios
      .post(`${BASE_URL}/sendCode`, values)
      .then(({ data }) => {
        console.log(data);
        navigate("/validation");
      })
      .catch((err) => {
        setError(err.response.data.message);
        setLoading(true);
      });
  }
  function validationSchema() {
    let schema = new Yup.object({
      email: Yup.string().email().required(),
    });
    return schema;
  }
  let resetpassword = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema,
    onSubmit: (values) => {
      sendDataToApi(values);
    },
  });

  return (
    <>
      <NavbarNorm />
      <div className="flex items-center justify-center mt-28">
        <div className="w-96 border rounded bg-white px-7 py-10">
          <form onSubmit={resetpassword.handleSubmit}>
            <h4 className="text-2xl mb-7">Reset Password</h4>
            <input
              type="text"
              placeholder="enter your email"
              onBlur={resetpassword.handleBlur}
              onChange={resetpassword.handleChange}
              className="input-box"
              id="email"
              name="email"
            />

            {resetpassword.errors.email && resetpassword.touched.email ? (
              <div className="p-2 mb-4 text-sm text-red-800 rounded-lg bg-red-50  dark:text-red-400">
                {resetpassword.errors.email}
              </div>
            ) : (
              ""
            )}

            <button
              type="submit"
              className="btn-primary"
              disabled={!(resetpassword.dirty && resetpassword.isValid)}
            >
              Send Code
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
