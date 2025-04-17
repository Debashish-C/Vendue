import React from "react";
import Login from "../components/Login";

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen justify-center bg-gray-300 items-center">
      <Login />
    </div>
  );
}
