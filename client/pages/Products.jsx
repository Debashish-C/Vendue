import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router";
import { useUser } from "@clerk/clerk-react";
import { Toaster } from "react-hot-toast";
import { Plus, Filter, X, Clock } from "lucide-react";
import Card from "../components/Card";

export default function Products() {
  const { user } = useUser();
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showLiveOnly, setShowLiveOnly] = useState(false);

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/product/`
      );
      setAllProducts(response.data);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/category`);
        setCategories(res.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }
    fetchCategories();
  }, []);

  // Filter logic
  useEffect(() => {
    let filtered = [...allProducts];

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) =>
        selectedCategories.includes(product.categoryId)
      );
    }

    if (showLiveOnly) {
      const now = new Date();
      filtered = filtered.filter(
        (product) =>
          new Date(product.bids_start_date_time) <= now &&
          new Date(product.bids_end_date_time) >= now
      );
    }

    setProducts(filtered);
  }, [selectedCategories, allProducts, showLiveOnly]);

  const handleCategoryToggle = (catId) => {
    setSelectedCategories((prev) =>
      prev.includes(catId)
        ? prev.filter((id) => id !== catId)
        : [...prev, catId]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex flex-wrap items-center justify-between w-full gap-3">
          {/* Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 border border-gray-300 rounded-full py-2 px-5 hover:bg-gray-100 transition font-medium text-gray-700"
          >
            <Filter className="w-5 h-5" />
            <span>Filter Categories</span>
          </button>

          {/* Live Auctions Button */}
          <button
            onClick={() => setShowLiveOnly((prev) => !prev)}
            className={`flex items-center gap-2 rounded-full py-2 px-6 transition font-medium shadow-sm ${
              showLiveOnly
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            <Clock className="w-5 h-5" />
            {showLiveOnly ? "Show All Products" : "Live Auctions"}
          </button>
        </div>
      </div>

      {/* Filters Section */}
      {showFilters && (
        <div className="max-w-screen-xl mx-auto bg-white border rounded-2xl p-6 mb-8 shadow-sm relative">
          <button
            onClick={() => setShowFilters(false)}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Filter by Categories
          </h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryToggle(cat.id)}
                className={`px-4 py-2 rounded-full border text-sm transition ${
                  selectedCategories.includes(cat.id)
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Product Grid */}
      <div className="max-w-screen-xl mx-auto">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-24 text-center">
            <img
              src="https://illustrations.popsy.co/gray/market-empty.svg"
              alt="No products"
              className="w-56 mb-4"
            />
            <p className="text-gray-500 text-lg">No products available</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <Link
                to={`/products/${product.id}`}
                key={product.product_id}
                className="transform hover:scale-[1.02] transition duration-200"
              >
                <Card
                  productImage={product.image}
                  productName={product.name}
                  productDescription={product.description}
                  productBasePrice={product.basePrice}
                  endTime={product.auctionEndTime}
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
