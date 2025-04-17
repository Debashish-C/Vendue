import { BrowserRouter, Routes, Route } from "react-router";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import About from "../pages/About.jsx";
import AuthLayout from "../pages/AuthLayout.jsx";
import Login from "../components/Login.jsx";
import Register from "../components/Register.jsx";
import Product from "../components/Product.jsx";
import ProductPage from "../pages/ProductPage.jsx";
import Auction from "../pages/Auction.jsx";
import Navbar from "../components/Navbar.jsx";
import Products from "../pages/Products.jsx";
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Navbar />
    <Routes>
      <Route index element={<App />} />
      <Route path="about" element={<About />} />
      <Route path="AuthLayout" element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
      </Route>
      <Route path="AuthLayout/register" element={<Register />} />
      <Route path="auction" element={<Auction />}>
        <Route path="product" element={<Product />} />
      </Route>
      <Route path="productpage" element={<ProductPage />}>
        <Route path="product" element={<Product />} />
      </Route>
      <Route path="products" element={<Products />} />
    </Routes>
  </BrowserRouter>
);
