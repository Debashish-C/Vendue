import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  Plus,
  Heart,
  ShoppingCart,
  Clock,
  User,
  CheckCircle,
} from "lucide-react";
import Card from "../components/Card";
import axios from "axios";
import AddProductForm from "../components/AddProduct/AddProduct";
import Footer from "../components/Footer";

export default function LandingPage() {
  const [allProducts, setAllProducts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/product/future-product`
      );
      setAllProducts(res.data.slice(0, 4)); // Show only 4 for preview
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="w-full overflow-x-hidden ">
      {/* Hero Section */}
      <section className="relative min-h-screen flex justify-center items-center px-6 bg-white">
        <div className="max-w-screen-xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="flex-1 space-y-6">
            <h1 className="text-5xl font-extrabold leading-tight text-gray-900">
              Vendue – Your Professional Auction Platform
            </h1>
            <p className="text-lg md:text-xl text-gray-700">
              Securely buy and sell products through real-time auctions with
              verified users.
            </p>
            <div className="flex gap-4 flex-wrap">
              <button
                onClick={() => setShowAddForm(true)}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 rounded-full font-semibold shadow transition"
              >
                Sell Product
              </button>
              <Link
                to="/auction"
                className="px-6 py-3 border border-gray-700 hover:bg-gray-700 hover:text-white rounded-full font-semibold transition"
              >
                View Auctions
              </Link>
            </div>
          </div>
          <div className="flex-1">
            <img
              src="https://static.vecteezy.com/system/resources/previews/023/517/896/non_2x/online-auction-concept-tiny-people-bidder-buyer-and-auctioneer-bidding-in-public-auction-painting-and-vase-on-laptop-screen-hammer-close-deal-modern-flat-cartoon-style-illustration-vector.jpg"
              alt="Auction Hero"
              className="bg-transparent"
              // className="rounded-xl shadow-xl w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-screen-xl mx-auto bg-neutral-50 py-20 px-6">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
          Platform Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
            <Clock className="w-12 h-12 text-gray-800 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-gray-900">
              Real-Time Auctions
            </h3>
            <p className="text-gray-500">
              Bid instantly on live products with countdown timers for
              transparency.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
            <Heart className="w-12 h-12 text-amber-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-gray-900">
              Wishlist & Favorites
            </h3>
            <p className="text-gray-500">
              Save products you love and get notified when auctions start or
              end.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
            <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-gray-900">
              Secure Transactions
            </h3>
            <p className="text-gray-500">
              All bids and payments are safe and reliable with verified users.
            </p>
          </div>
        </div>
      </section>

      {/* Live Auctions Preview */}
      <section className="max-w-screen-xl mx-auto py-20 px-6">
        <h2 className="text-3xl font-bold mb-8 text-gray-900">
          Upcoming Live Auctions
        </h2>
        {allProducts.length === 0 ? (
          <p className="text-gray-500 text-center">
            No live auctions at the moment.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {allProducts.map((product) => (
              <Link
                key={product.product_id}
                to={`/products/${product.product_id}`}
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
        <div className="mt-8 text-center">
          <Link
            to="/auction"
            className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-full font-semibold transition"
          >
            View All Auctions
          </Link>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="max-w-screen-xl mx-auto py-20 px-6 bg-gray-100 rounded-xl">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
            <User className="w-12 h-12 text-gray-800 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-gray-900">
              Sign Up
            </h3>
            <p className="text-gray-500">
              Create an account and join the auction community quickly.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
            <Plus className="w-12 h-12 text-amber-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-gray-900">
              List Your Product
            </h3>
            <p className="text-gray-500">
              Add your products with images, descriptions, and starting bids.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
            <Clock className="w-12 h-12 text-green-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-gray-900">
              Start Bidding
            </h3>
            <p className="text-gray-500">
              Users bid live on your products and you can track the highest
              offers in real-time.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="relative py-20 px-6 text-center bg-slate-600 text-white rounded-xl my-12 mx-6">
        <h2 className="text-4xl font-extrabold mb-6">
          Ready to Start Your Auction?
        </h2>
        <p className="text-lg mb-8 text-gray-300">
          Sign up today and list your first product or join live auctions
          instantly.
        </p>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-8 py-4 bg-amber-500 hover:bg-amber-600 rounded-full font-semibold shadow transition"
        >
          Sell Your Product
        </button>
      </section>

      {/* Add Product Modal */}
      {showAddForm && (
        <AddProductForm
          onClose={() => setShowAddForm(false)}
          onProductAdded={fetchProducts}
        />
      )}
      <Footer />
    </div>
  );
}
