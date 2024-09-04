/* eslint-disable no-unused-vars */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useFormik } from "formik";
import * as Yup from "yup";
import { NavbarNorm } from "../../components/NavbarNorm/NavbarNorm";

import { BASE_URL } from "../../utils/constants";

export default function NewPassword() {
  const [user, setUser] = useState([]);

  let params = useParams();

  let navigate = useNavigate();

  async function putDataToApi(values) {
    let { data } = await axios.put(
      `${BASE_URL}/resetpass/${params.userId}`,
      values
    );
    setUser(data);
    console.log(data);
    if (data.message === "Password has been Changed successfully") {
      navigate("/login");
    }
  }
  useEffect(() => {
    putDataToApi();
  }, []);

  function validationSchema() {
    let schema = new Yup.object({
      newPassword: Yup.string().required(),
    });
    return schema;
  }
  let handleNewPassword = useFormik({
    initialValues: {
      newPassword: "",
    },
    validationSchema,
    onSubmit: (values) => {
      putDataToApi(values);
      console.log(values);
    },
  });
  return (
    <>
      <NavbarNorm />

      <div className="flex items-center justify-center mt-28">
        <div className="w-96 border rounded bg-white px-7 py-10">
          <form onSubmit={handleNewPassword.handleSubmit}>
            <h4 className="text-2xl mb-7">Enter New Password </h4>
            <input
              type="text"
              placeholder="Enter New Password "
              onBlur={handleNewPassword.handleBlur}
              onChange={handleNewPassword.handleChange}
              className="input-box"
              id="newPassword"
              name="newPassword"
            />
            <button
              type="submit"
              className="btn-primary"
              disabled={!(handleNewPassword.dirty && handleNewPassword.isValid)}
            >
              Submit New Password
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
