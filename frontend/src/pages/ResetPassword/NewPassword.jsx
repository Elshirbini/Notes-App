/* eslint-disable no-unused-vars */
import React from "react";
import { Link, useNavigate } from "react-router-dom";

import axios from "axios";

import { useFormik } from "formik";
import * as Yup from "yup";

import { NavbarNorm } from "../../components/NavbarNorm/NavbarNorm";



const NewPassword = () => {
  return (
    <>
    {/* <NavbarNorm />
    <div className="flex items-center justify-center mt-28">
      <div className="w-96 border rounded bg-white px-7 py-10">
        <form onSubmit={codevalidation.handleSubmit}>
          <h4 className="text-2xl mb-7">Write New Password</h4>
          <input
            type="text"
            placeholder="enter your code"
            onBlur={codevalidation.handleBlur}
            onChange={codevalidation.handleChange}
            className="input-box"
            id="isCodeTrue"
            name="isCodeTrue"
          />

          {codevalidation.errors.isCodeTrue && codevalidation.touched.isCodeTrue ? (
            <div className="p-2 mb-4 text-sm text-red-800 rounded-lg bg-red-50  dark:text-red-400">
              {codevalidation.errors.isCodeTrue}
            </div>
          ) : (
            ""
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={!(codevalidation.dirty && codevalidation.isValid)}
          >
            Reset
          </button>
        </form>
      </div>
    </div> */}
  </>
  )
};

export default NewPassword;
