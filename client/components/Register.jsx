import React from "react";
import { Link } from "react-router";
import Button from "./Button";
export default function Register() {
  return (
    <div className=" flex p-4 shadow-2xl bg-gray-100  flex-col gap-4 justify-center items-center min-h-screen">
      <div className="flex rounded-lg pl-10 pr-10 pt-5 pb-5 bg-white shadow-2xl  flex-col gap-4">
        <h1 className="text-2xl font-bold text-center pb-4 pt-5">Sign Up</h1>
        <div className="pb-2">
          <input
            type="text"
            placeholder="username"
            className="pl-4 pr-4 p-2 border-2 border-blue-200 rounded-md"
          />
        </div>
        <div className="pb-2">
          <input
            type="password"
            placeholder="password"
            className="pl-4 pr-4 p-2 border-2 border-blue-200 rounded-lg"
          />
        </div>
        <div className="">
          <button className="w-full p-3 bg-blue-400 rounded-lg hover:text-white hover:bg-blue-500">
            Register
          </button>
        </div>
        <div className="">
          <p>
            Already Have an Account?{" "}
            <Link className="text-blue-500" to="/AuthLayout/login">
              {" "}
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
