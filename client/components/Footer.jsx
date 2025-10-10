import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Company Info */}
        <div>
          <h2 className="text-white text-xl font-bold mb-4">Vendue</h2>
          <p className="text-gray-400 text-sm">
            Vendue is a modern auction management platform connecting buyers and
            sellers with transparency and ease.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <a href="/" className="hover:text-white transition">
                Home
              </a>
            </li>
            <li>
              <a href="/products" className="hover:text-white transition">
                Products
              </a>
            </li>
            <li>
              <a href="/wishlist" className="hover:text-white transition">
                Wishlist
              </a>
            </li>
            <li>
              <a href="/auction" className="hover:text-white transition">
                Live Auction
              </a>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Follow Us</h3>
          <div className="flex gap-4">
            <a href="#" className="text-gray-400 hover:text-white transition">
              <FaFacebookF />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition">
              <FaTwitter />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition">
              <FaLinkedinIn />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition">
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-gray-800 mt-8 pt-4 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Vendue. All rights reserved.
      </div>
    </footer>
  );
}
