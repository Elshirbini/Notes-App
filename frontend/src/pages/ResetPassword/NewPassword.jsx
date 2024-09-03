/* eslint-disable no-unused-vars */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import "react-toastify/dist/ReactToastify.css";

export default function NewPassword() {
  const [user, setUser] = useState([]);

  let params = useParams();

  async function putDataToApi() {
    let { data } = await axios.put(
      `http://localhost:8000/resetpass/${params.userId}`
    );
    setUser(data.data);
    console.log(data.data);
  }
  useEffect(() => {
    putDataToApi();
  }, []);
  return (
    <>
      <div>new password</div>
    </>
  );
}
