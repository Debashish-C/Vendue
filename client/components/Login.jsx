import React from "react";
import { Link } from "react-router";
export default function Login() {
  return (
    <div className="pl-10 pr-10 pt-5 pb-5 shadow-2xl flex flex-col gap-6 bg-white text-center rounded-md">
      <h1 className="text-2xl font-bold p-5">Log In</h1>
      <div className="text-start flex flex-col gap-2">
        {/* <label htmlFor="">User Name </label> */}
        <input
          type="text"
          name=""
          id=""
          className="p-2 pl-4 pr-4 border-b-black w-64 border-b-2 rounded-md "
          placeholder="username"
        />
      </div>
      <div className="">
        <input
          type="password"
          className="p-2 pl-4 focus:to-blue-700 w-64 pr-4 border-b-black border-b-2 rounded-md "
          placeholder="password"
        />
      </div>
      <div className="">
        <button className="w-full p-3 bg-blue-400 rounded-lg hover:text-white hover:bg-blue-500">
          Log In
        </button>
      </div>
      <div className="">
        <p>
          Not a member ?{" "}
          <Link className="text-blue-700" to="register">
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
}
