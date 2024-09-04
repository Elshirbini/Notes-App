/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { BASE_URL } from "../../utils/constants";
import axios from "axios";

const ResendCode = () => {
  let [error, setError] = useState("");
  let [timer, setTimer] = useState(10);

  function sendDataToApi(values) {
    axios
      .post(`${BASE_URL}/resendcode`, values)
      .then(({ data }) => {
        console.log(data);
      })
      .catch((err) => {
        setError(err.response.data.message);
      });
  }

  const handleResend = () => {
    sendDataToApi();
  };

  function handleTimer() {
    setInterval(() => {
      setTimer((timer -= 1 / 2));
    }, 1000);
  }
  useEffect(() => {
    handleTimer();
  }, []);

  return (
    <div>
      <p className="m-2">
        <button
          className={
            timer <= 0 ? "text-blue-800 	text-decoration-line: underline" : ""
          }
          onClick={handleResend}
          disabled={timer >= 0}
        >
          re-send code
        </button>{" "}
        {timer <= 0 ? "" : "in " + timer}
      </p>
    </div>
  );
};

export default ResendCode;
