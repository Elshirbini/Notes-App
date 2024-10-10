// /* eslint-disable no-unused-vars */
// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";

// import { useFormik } from "formik";
// import * as Yup from "yup";

// import { BASE_URL } from "../../utils/constants";

// const DeleteAccount = () => {
//   let params = useParams();

//   let navigate = useNavigate();

//   async function putDataToApi(values) {
//     const token = localStorage.getItem("token");
//     axios
//       .delete(`${BASE_URL}/deleteAcc`, {
//         headers: {
//           "Content-Type": "application/json",

//           Authorization: `Bearer ${token}`,
//         },
//         values,
//       })

//       .then(({ data }) => {
//         console.log(data);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }
//   // useEffect(() => {
//   //   putDataToApi();
//   // }, []);

//   function validationSchema() {
//     let schema = new Yup.object({
//       password: Yup.string().required(),
//     });
//     return schema;
//   }
//   let handlePassword = useFormik({
//     initialValues: {
//       password: "",
//     },
//     validationSchema,
//     onSubmit: (values) => {
//       putDataToApi(values);
//       console.log(values);
//     },
//   });
//   return (
//     <>
//       {/* <NavbarNorm /> */}

//       <div className="flex items-center justify-center mt-28">
//         <div className="w-96 border rounded bg-white px-7 py-10">
//           <form onSubmit={handlePassword.handleSubmit}>
//             <h4 className="text-2xl mb-7">Enter Your Password </h4>
//             <input
//               type="text"
//               placeholder="Enter Your Password "
//               onBlur={handlePassword.handleBlur}
//               onChange={handlePassword.handleChange}
//               className="input-box"
//               id="password"
//               name="password"
//             />
//             <button
//               type="submit"
//               className="btn-primary btn-danger"
//               disabled={!(handlePassword.dirty && handlePassword.isValid)}
//             >
//               Delete Account
//             </button>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// };

// export default DeleteAccount;
