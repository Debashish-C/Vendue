import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";

export default function Navbar() {
  const { user } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (user) {
      const storeUser = async () => {
        try {
          const userData = {
            user_id: user.id,
            email: user.primaryEmailAddress?.emailAddress,
            username: user.username,
            first_name: user.firstName,
            last_name: user.lastName,
          };
          await axios.post(`${import.meta.env.API_URL}/user`, userData);
        } catch (error) {
          console.log("Error saving user:", error);
        }
      };
      storeUser();
    }
  }, [user]);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="w-full fixed top-0 left-0 z-50 bg-white border-b border-gray-300 shadow-sm">
      <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-gray-800">
          Vendue
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <NavLink
            to="/auction"
            className="text-gray-700 hover:text-amber-600 text-lg font-medium"
          >
            Live<span className="text-green-600 text-2xl ml-1">•</span>
          </NavLink>

          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <input
              type="text"
              placeholder="Search products..."
              className="p-2 outline-none w-64 md:w-80"
            />
            <button className="p-2 hover:text-amber-600">
              <span className="material-symbols-outlined">search</span>
            </button>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link to="/wishlist" className="hover:text-amber-600">
            <span className="material-symbols-outlined">favorite</span>
          </Link>
          <Link to="/cart" className="hover:text-amber-600">
            <span className="material-symbols-outlined">shopping_cart</span>
          </Link>

          <SignedOut>
            <SignInButton mode="modal">
              <button className="px-3 py-1 border border-blue-500 text-blue-500 rounded hover:bg-blue-100 text-sm">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>

        <button onClick={toggleMenu} className="md:hidden">
          <span className="material-symbols-outlined text-3xl">
            {menuOpen ? "close" : "menu"}
          </span>
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white shadow-md border-t border-gray-200 px-4 pb-4  pt-2 space-y-4">
          <NavLink
            to="/auction"
            onClick={closeMenu}
            className="block text-gray-700 hover:text-amber-600 font-medium"
          >
            Live<span className="text-green-600 text-lg ml-1">•</span>
          </NavLink>

          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <input
              type="text"
              placeholder="Search products..."
              className="p-2 outline-none w-full"
            />
            <button className="p-2 hover:text-amber-600">
              <span className="material-symbols-outlined">search</span>
            </button>
          </div>

          <div className="flex gap-4 items-center">
            <Link
              to="/wishlist"
              onClick={closeMenu}
              className="hover:text-amber-600"
            >
              <span className="material-symbols-outlined">favorite</span>
            </Link>
            <Link
              to="/cart"
              onClick={closeMenu}
              className="hover:text-amber-600"
            >
              <span className="material-symbols-outlined">shopping_cart</span>
            </Link>
          </div>

          <div>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="px-3 py-1 border border-blue-500 text-blue-500 rounded hover:bg-blue-100 text-sm w-full">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      )}
    </nav>
  );
}
