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
import NotFound from "../pages/NotFound.jsx";
import SellerDashboard from "../components/Dashboard/SellerDashboard.jsx";
import Chat from "../components/seller/chat.jsx";
import LiveProducts from "../components/seller/LiveProducts.jsx";
import AddProduct from "../components/seller/Addproduct.jsx";
import Notifications from "../components/seller/Notification.jsx";
import AllProducts from "../components/seller/AllProducts.jsx";
import History from "../components/seller/History.jsx";
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
        <Route path="*" element={<NotFound />} />
        <Route path="/seller" element={<SellerDashboard />}>
          <Route index element={<AllProducts />} />
          <Route path="live" element={<LiveProducts />} />
          <Route path="history" element={<History />} />
          <Route path="chat" element={<Chat />} />
          <Route path="add" element={<AddProduct />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </ClerkProvider>
);
