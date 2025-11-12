import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router";
import Product from "../components/Product/Product";
import Dashboard from "../components/Dashboard/Dashboard";
import { Clock, AlertTriangle, Home } from "lucide-react";

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState("");
  const [isAuctionActive, setIsAuctionActive] = useState(true);
  const [reloadCount, setReloadCount] = useState(0);

  const intervalRef = useRef(null);
  const redirectRef = useRef(null);

  // Calculate time remaining
  const calculateTimeLeft = (endTime) => {
    const end = new Date(endTime).getTime();
    const now = new Date().getTime();
    const difference = end - now;

    if (difference <= 0) {
      return {
        text: "Auction Ended",
        isEnded: true,
        seconds: 0,
      };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    if (days > 0) {
      return {
        text: `${days}d ${hours}h ${minutes}m`,
        isEnded: false,
        seconds,
      };
    } else if (hours > 0) {
      return {
        text: `${hours}h ${minutes}m ${seconds}s`,
        isEnded: false,
        seconds,
      };
    } else {
      return {
        text: `${minutes}m ${seconds}s`,
        isEnded: false,
        seconds,
      };
    }
  };

  // Fetch product data
  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/product/${id}`
      );

      const productData = res.data;
      setProduct(productData);

      // Calculate time left
      const timeData = calculateTimeLeft(productData.auctionEndTime);
      setTimeLeft(timeData.text);
      setIsAuctionActive(!timeData.isEnded);

      // If auction ended, set up redirect
      if (timeData.isEnded) {
        redirectRef.current = setTimeout(() => {
          navigate("/");
        }, 5000); // Redirect after 5 seconds
      }

      setError("");
    } catch (err) {
      console.error("Error fetching product", err);
      setError("Failed to load product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Auto-reload function
  const startAutoReload = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setReloadCount((prev) => prev + 1);
      fetchProduct();
    }, 5000); // Reload every 5 seconds
  };

  useEffect(() => {
    fetchProduct();

    // Start auto-reload
    startAutoReload();

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (redirectRef.current) {
        clearTimeout(redirectRef.current);
      }
    };
  }, [id]);

  // Update time left every second for the countdown
  useEffect(() => {
    if (!product) return;

    const timeUpdateInterval = setInterval(() => {
      const timeData = calculateTimeLeft(product.auctionEndTime);
      setTimeLeft(timeData.text);

      if (timeData.isEnded && isAuctionActive) {
        setIsAuctionActive(false);
        // Restart auto-reload with faster interval for ended auctions
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        intervalRef.current = setInterval(() => {
          setReloadCount((prev) => prev + 1);
          fetchProduct();
        }, 3000);

        // Set redirect timer
        redirectRef.current = setTimeout(() => {
          navigate("/");
        }, 5000);
      }
    }, 1000);

    return () => clearInterval(timeUpdateInterval);
  }, [product, isAuctionActive, navigate]);

  if (loading && !product) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 px-4 sm:px-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-600">Loading product details...</div>
        </div>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 px-4 sm:px-8 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center mx-auto space-x-2"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-4 sm:px-8">
      {/* Auto-reload Indicator */}
      <div className="max-w-screen-xl mx-auto mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full animate-pulse ${
                  isAuctionActive ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              <span
                className={`font-semibold ${
                  isAuctionActive ? "text-green-600" : "text-red-600"
                }`}
              >
                {isAuctionActive ? "LIVE" : "ENDED"}
              </span>
            </div>

            <div className="flex items-center space-x-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <span className="font-medium">{timeLeft}</span>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>Auto-refresh: 5s</span>
            </div>
            <span>Reloads: {reloadCount}</span>
          </div>
        </div>
      </div>

      {/* Auction Ended Banner */}
      {!isAuctionActive && (
        <div className="max-w-screen-xl mx-auto mb-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <div>
                  <h3 className="font-semibold text-red-800">
                    Auction Has Ended
                  </h3>
                  <p className="text-red-700 text-sm">
                    This auction has ended. Redirecting to homepage in 5
                    seconds...
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate("/")}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center space-x-2"
              >
                <Home className="w-4 h-4" />
                <span>Go Home Now</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product & Dashboard Container */}
      <div className="max-w-screen-xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Product Section */}
        <div className="lg:w-1/2 w-full shadow-sm border border-gray-200 bg-white rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            {!isAuctionActive && (
              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                Auction Ended
              </span>
            )}
          </div>

          <p className="text-gray-500 mb-2">
            Base Price:{" "}
            <span className="font-semibold text-red-500">
              ₹{product.basePrice}
            </span>
          </p>
          <p className="text-gray-400 mb-1">
            Bidding Starts:{" "}
            {new Date(product.auctionStartTime).toLocaleString()}
          </p>
          <p className="text-gray-400 mb-6">
            Bidding Ends: {new Date(product.auctionEndTime).toLocaleString()}
          </p>

          <Product
            product_id={product.id}
            productImage={product.image}
            productName={product.name}
            productDesc={product.description}
            productPrice={product.basePrice}
            product_bids_start_date={product.auctionStartTime}
            isAuctionActive={isAuctionActive}
          />
        </div>

        {/* Dashboard Section */}
        <div className="lg:w-1/2 w-full shadow-sm bg-white rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Auction Dashboard
            </h2>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live Updates</span>
            </div>
          </div>
          <Dashboard
            productId={product.id}
            isAuctionActive={isAuctionActive}
            reloadCount={reloadCount}
          />
        </div>
      </div>

      {/* Manual Refresh Button */}
      <div className="max-w-screen-xl mx-auto mt-8 text-center">
        <button
          onClick={fetchProduct}
          disabled={loading}
          className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
        >
          <span>{loading ? "Refreshing..." : "Refresh Now"}</span>
          {loading && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
          )}
        </button>
      </div>

      {/* Related Products */}
      <div className="max-w-screen-xl mx-auto mt-16">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Related Auctions
        </h3>
        <div className="text-center text-gray-500 py-8 border-2 border-dashed border-gray-200 rounded-lg">
          <p>Related auctions will be shown here</p>
          <button
            onClick={() => navigate("/products")}
            className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
          >
            Browse All Auctions →
          </button>
        </div>
      </div>
    </div>
  );
}
