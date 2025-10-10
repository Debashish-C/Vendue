import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import axios from "axios";
import { Link } from "react-router";

export default function Auction() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/catagory`
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories", error);
        setCategories([]);
      }
    }
    fetchCategories();
  }, []);

  // Fetch products
  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/product`
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      }
    }
    fetchProducts();
  }, []);

  // Filtered products
  const filteredProducts =
    selectedCategory === ""
      ? products
      : products.filter((product) => product.catagory_id === selectedCategory);

  return (
    <div className="pt-24 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
      <div className="max-w-screen-xl mx-auto flex flex-col lg:flex-row gap-6">
        {/* Sidebar - Categories */}
        <aside className="w-full lg:w-1/4 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4 border-b pb-2">Categories</h2>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setSelectedCategory("")}
              className={`text-left px-3 py-2 rounded hover:bg-gray-100 transition ${
                selectedCategory === "" ? "bg-gray-200 font-semibold" : ""
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.catagory_id}
                onClick={() => setSelectedCategory(cat.catagory_id)}
                className={`text-left px-3 py-2 rounded hover:bg-gray-100 transition ${
                  selectedCategory === cat.catagory_id
                    ? "bg-gray-200 font-semibold"
                    : ""
                }`}
              >
                {cat.catagory_name}
              </button>
            ))}
          </div>
        </aside>

        {/* Product Grid */}
        <main className="w-full lg:w-3/4">
          {filteredProducts.length === 0 ? (
            <p className="text-center text-gray-500 text-lg py-20">
              No live products available at the moment.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Link
                  key={product.product_id}
                  to={`/products/${product.product_id}`}
                  className="transition-transform transform hover:scale-105"
                >
                  <Card
                    productName={product.product_name}
                    productBasePrice={product.product_base_price}
                    endTime={product.bids_end_date_time}
                    productImage={product.product_image}
                    productDescription={product.product_desc}
                  />
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
