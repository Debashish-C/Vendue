import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  useClerk,
  UserButton,
} from "@clerk/clerk-react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import { Heart, ShoppingCart, Menu, X, Search } from "lucide-react";

export default function Navbar() {
  const { signOut } = useClerk();
  const { user } = useUser();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("BUYER"); // default role

  // Store user in backend when logged in
useEffect(() => {
    if (user) {
      const storeUser = async () => {
        try {
          const email = user.primaryEmailAddress?.emailAddress;
          if (!email?.endsWith("stu.manit.ac.in")) {
            alert("Please use your official college email ID (stu.manit.ac.in)");
            
            await signOut();
            return;
          }

          const userData = {
            user_id: user.id,
            email,
            username: user.username,
            first_name: user.firstName,
            last_name: user.lastName,
          };

          await axios.post(`${import.meta.env.VITE_API_URL}/user`, userData);
        } catch (error) {
          console.error("Error saving user:", error);
        }
      };

      storeUser();
    }
  }, [user, signOut]);



  

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  // Switch between Buyer and Seller mode
  const switchRole = () => {
    if (role === "BUYER") {
      setRole("SELLER");
      navigate("/seller");
    } else {
      setRole("BUYER");
      navigate("/");
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-white via-gray-50 to-white border-b border-gray-200 shadow-sm backdrop-blur-md">
      <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-tight text-gray-800 hover:text-blue-600 transition"
        >
          Vendue<span className="text-blue-600">.</span>
        </Link>

        {/* Search bar (Desktop) */}
        <div className="hidden md:flex items-center relative w-[420px]">
          <input
            type="text"
            placeholder="Search for products, categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-gray-50"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
        </div>

        {/* Desktop Icons */}
        <div className="hidden md:flex items-center gap-5">
          {/* Wishlist & Cart */}
          <Link
            to="/wishlist"
            className="relative p-2 rounded-full hover:bg-blue-50 transition"
          >
            <Heart className="w-5 h-5 text-gray-700 hover:text-blue-600" />
          </Link>

          <Link
            to="/cart"
            className="relative p-2 rounded-full hover:bg-blue-50 transition"
          >
            <ShoppingCart className="w-5 h-5 text-gray-700 hover:text-blue-600" />
          </Link>

          {/* Role Switch Button (only logged in) */}
          <SignedIn>
            <button
              onClick={switchRole}
              className="px-3 py-1 border border-gray-400 rounded-full hover:bg-gray-100 text-sm font-medium transition"
            >
              {role === "BUYER" ? "Switch to Seller" : "Switch to Buyer"}
            </button>
          </SignedIn>

          {/* Auth buttons */}
          <SignedOut>
            <SignInButton mode="modal">
              <button className="px-4 py-2 border border-blue-500 text-blue-500 rounded-full hover:bg-blue-50 transition text-sm font-medium">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 rounded-md hover:bg-gray-100 transition"
        >
          {menuOpen ? (
            <X className="w-6 h-6 text-gray-700" />
          ) : (
            <Menu className="w-6 h-6 text-gray-700" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-md py-4 px-4 animate-slideDown">
          {/* Search (Mobile) */}
          <div className="flex items-center mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border rounded-full focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50"
              />
            </div>
          </div>

          {/* Wishlist & Cart */}
          <div className="flex gap-4 items-center mb-4">
            <Link
              to="/wishlist"
              onClick={closeMenu}
              className="p-2 rounded-full hover:bg-blue-50 transition"
            >
              <Heart className="w-5 h-5 text-gray-700" />
            </Link>
            <Link
              to="/cart"
              onClick={closeMenu}
              className="p-2 rounded-full hover:bg-blue-50 transition"
            >
              <ShoppingCart className="w-5 h-5 text-gray-700" />
            </Link>
          </div>

          {/* Role Switch (only logged in) */}
          <SignedIn>
            <button
              onClick={switchRole}
              className="w-full mb-3 px-3 py-2 border border-gray-400 rounded-full hover:bg-gray-100 text-sm font-medium transition"
            >
              {role === "BUYER" ? "Switch to Seller" : "Switch to Buyer"}
            </button>
          </SignedIn>

          {/* Auth */}
          <div className="border-t pt-3">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="w-full px-4 py-2 border border-blue-500 text-blue-500 rounded-full hover:bg-blue-50 transition text-sm font-medium">
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