import { BrowserRouter, Routes, Route } from "react-router";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import About from "../pages/About.jsx";
import Login from "../components/Login.jsx";
import Register from "../components/Register.jsx";
import ProductPage from "../pages/ProductPage.jsx";
import Auction from "../pages/Auction.jsx";
import Navbar from "../components/Navbar/Navbar.jsx";
import Products from "../pages/Products.jsx";
import Profile from "../pages/Profile.jsx";
import WishList from "../pages/WishList.jsx";
import Cart from "../pages/Cart.jsx";
import { ClerkProvider } from "@clerk/clerk-react";
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  console.log("missing public key");
  throw new Error("Missing Publishable Key");
}

createRoot(document.getElementById("root")).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route index element={<App />} />
        <Route path="profile" element={<Profile />} />
        <Route path="wishlist" element={<WishList />} />
        <Route path="cart" element={<Cart />} />
        <Route path="about" element={<About />} />
        <Route path="login" element={<Login />} />
        <Route path="AuthLayout/register" element={<Register />} />
        <Route path="auction" element={<Auction />}></Route>
        <Route path="products" element={<Products />} />
        <Route path="/products/:id" element={<ProductPage />} />
      </Routes>
    </BrowserRouter>
  </ClerkProvider>
);
