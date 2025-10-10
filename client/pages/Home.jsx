import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router";
import Card from "../components/Card";
import { Toaster } from "react-hot-toast";
import AddProductForm from "../components/AddProduct/AddProduct";

export default function Home() {
  const [allProducts, setAllProducts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

  // Fetch live/future products
  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/product/future-product`
      );
      setAllProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <Toaster position="top-right" />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r  from-blue-600 to-indigo-600 py-24 text-white px-6">
        <div className="max-w-screen-xl  mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Welcome to Vendue
            </h1>
            <p className="text-lg md:text-xl text-gray-100">
              The ultimate auction platform to buy and sell products in
              real-time.
            </p>
            <div className="flex gap-4 flex-wrap">
              <button
                onClick={() => setShowAddForm(true)}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 rounded-full font-semibold shadow-lg transition"
              >
                Sell Product
              </button>
              <Link
                to="/auction"
                className="px-6 py-3 border border-white hover:bg-white hover:text-blue-600 rounded-full font-semibold transition"
              >
                View Live Auctions
              </Link>
            </div>
          </div>

          <div className="flex-1">
            <img
              src="https://images.unsplash.com/photo-1602524200306-b2f61a0e5b27?auto=format&fit=crop&w=800&q=80"
              alt="Auction Hero"
              className="rounded-xl shadow-xl w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Live Auctions Section */}
      <section className="max-w-screen-xl mx-auto px-4 mt-16">
        <h2 className="text-2xl font-bold mb-6">Live Auctions</h2>
        {allProducts.length === 0 ? (
          <div className="text-center text-gray-500 py-16">
            No live auctions currently.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allProducts.map((product) => (
              <Link
                to={`/products/${product.product_id}`}
                key={product.product_id}
                className="transform hover:scale-[1.02] transition"
              >
                <Card
                  productName={product.product_name}
                  productDescription={product.description}
                  productBasePrice={product.product_base_price}
                  endTime={product.bids_end_date_time}
                  productImage={product.product_image}
                />
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Featured Categories (Optional) */}
      {/* Uncomment if you have categories */}
      {/* 
      <section className="max-w-screen-xl mx-auto px-4 mt-16">
        <h2 className="text-2xl font-bold mb-6">Browse by Categories</h2>
        <div className="flex flex-wrap gap-4">
          {categories.map((cat) => (
            <button key={cat.catagory_id} className="px-4 py-2 bg-gray-100 rounded-full hover:bg-amber-500 hover:text-white transition">
              {cat.catagory_name}
            </button>
          ))}
        </div>
      </section>
      */}

      {/* Add Product Modal */}
      {showAddForm && (
        <AddProductForm
          onClose={() => setShowAddForm(false)}
          onProductAdded={fetchProducts}
        />
      )}
    </div>
  );
}
