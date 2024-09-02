/* eslint-disable no-unused-vars */
import React , {useState} from 'react'
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { Link, useNavigate } from "react-router-dom";
import { NavbarNorm } from '../../components/NavbarNorm/NavbarNorm';

export const CodeValidation = () => {
    return (
        <>
          <NavbarNorm />
          <div className="flex items-center justify-center mt-28">
            <div className="w-96 border rounded bg-white px-7 py-10">
              <form onSubmit={''}>
                <h4 className="text-2xl mb-7">Reset Password</h4>
                <input
                  type="text"
                  placeholder="Write The Code"
                  className="input-box"
                  value={''}
                  onChange={''}
                />
    
                {/* {error && <p className="text-red-500 text-xs pb-1">{error}</p>} */}
    
                <button type="submit" className="btn-primary">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </>
      );
}
