/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";

import { Link, useNavigate } from "react-router-dom";

import { BASE_URL } from "../../utils/constants";

import axios from "axios";

import { useFormik } from "formik";
import * as Yup from "yup";

import { NavbarNorm } from "../../components/NavbarNorm/NavbarNorm";
import ResendCode from "../../components/ResendButton/ResendCode";

const CodeValidation = () => {
  let navigate = useNavigate();
  let [error, setError] = useState("");
  let [loading, setLoading] = useState(true);

  function sendDataToApi(values) {
    setLoading(false);
    axios
      .post(`${BASE_URL}/authcode`, values)
      .then(({ data }) => {
        console.log(data);
        if (data.message === "done") {
          navigate(`/newpassword/${data.userId}`);
        }
      })
      .catch((err) => {
        setError(err.response.data.message);
      });
  }
  function validationSchema() {
    let schema = new Yup.object({
      isCodeTrue: Yup.string().required(),
    });
    return schema;
  }
  let codevalidation = useFormik({
    initialValues: {
      isCodeTrue: "",
    },
    validationSchema,
    onSubmit: (values) => {
      sendDataToApi(values);
      console.log(values);
    },
  });

  return (
    <>
      <NavbarNorm />
      <div className="flex items-center justify-center mt-28">
        <div className="w-96 border rounded bg-white px-7 py-10">
          <form onSubmit={codevalidation.handleSubmit}>
            <h4 className="text-2xl mb-7">Enter The Code </h4>
            <input
              type="text"
              placeholder="enter your code"
              onBlur={codevalidation.handleBlur}
              onChange={codevalidation.handleChange}
              className="input-box"
              id="isCodeTrue"
              name="isCodeTrue"
            />

            {codevalidation.errors.isCodeTrue &&
            codevalidation.touched.isCodeTrue ? (
              <div className="p-2 mb-4 text-sm text-red-800 rounded-lg bg-red-50  dark:text-red-400">
                The Input Is Empty !
              </div>
            ) : (
              ""
            )}

            <button
              type="submit"
              className="btn-primary"
              disabled={!(codevalidation.dirty && codevalidation.isValid)}
            >
              Submit Code
            </button>
          </form>
          <ResendCode />
        </div>
      </div>
    </>
  );
};

export default CodeValidation;
