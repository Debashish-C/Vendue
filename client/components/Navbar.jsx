import React from "react";
import { Link, NavLink } from "react-router";

export default function Navbar() {
  return (
    <div className="flex p-4 left-0 bg-white items-center justify-between shadow-2xl  fixed w-full">
      <div className="">
        <h1 className="text-xl font-bold ">Vendue</h1>
      </div>
      <div className="">
        <ul className="flex justify-around gap-4">
          <NavLink to="/auction">Auction</NavLink>
          <NavLink to="/products">Products</NavLink>
          <NavLink to="/AuthLayout">Sign Up</NavLink>
        </ul>
      </div>
      <div className="flex gap-3 justify-center items-center">
        <Link className="">WishList</Link>
        <Link className="pl-3 pr-4 p-2">Card</Link>
        <Link to="/AuthLayout" className="pl-3 pr-3 p-2  rounded-md">
          Log In
        </Link>
      </div>
    </div>
  );
}
