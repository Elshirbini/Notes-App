/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";

import { Link, useNavigate } from "react-router-dom";

import axios from "axios";

import { useFormik } from "formik";
import * as Yup from "yup";

import { NavbarNorm } from "../../components/NavbarNorm/NavbarNorm";

const CodeValidation = () => {
  let navigate = useNavigate();
  let [error, setError] = useState("");
  let [loading, setLoading] = useState(true);
  let [timer, setTimer] = useState(10);

  function sendDataToApi(values) {
    setLoading(false);
    axios
      .post("http://localhost:8000/authcode", values)
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

  function handleTimer() {
    setInterval(() => {
      setTimer((timer -= 1 / 2));
    }, 1000);
  }
  useEffect(() => {
    handleTimer();
  }, []);

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
            <p className="m-2">
              <button
                className={
                  timer <= 0
                    ? "text-blue-800 	text-decoration-line: underline"
                    : ""
                }
                type="submit"
                disabled={timer >= 0}
              >
                re-send code
              </button>{" "}
              {timer <= 0 ? "" : "in " + timer}
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default CodeValidation;
