import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";

export default function Product({
  product_id,
  productName,
  productImage,
  productDesc,
  productPrice,
  product_bids_start_date,
}) {
  const { user } = useUser();
  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [bidAmount, setBidAmount] = useState("");
  const [currentBid, setCurrentBid] = useState(null);
  const [highestBidder, setHighestBidder] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const isBiddingOpen = new Date(product_bids_start_date) < new Date();

  const placeholderImage =
    "https://via.placeholder.com/400x300?text=No+Image+Available";

  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      try {
        const wishlistRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/wishlist?user_id=${user.id}`
        );
        const bidRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/bids/products/${product_id}`
        );

        setWishlist(wishlistRes.data.map((item) => item.product_id));

        if (Array.isArray(bidRes.data) && bidRes.data.length > 0) {
          setCurrentBid(bidRes.data[0].bid_amount);
          setHighestBidder(bidRes.data[0].username || "Anonymous");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setWishlist([]);
      }
    };

    fetchData();
  }, [user?.id, product_id]);

  const addToWishlist = async () => {
    if (!user?.id) return alert("Please log in");

    try {
      setIsLoading(true);
      await axios.post(`${import.meta.env.VITE_API_URL}/wishlist/add`, {
        user_id: user.id,
        product_id,
      });
      setWishlist((prev) => [...prev, product_id]);
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const placeBid = async () => {
    if (!user?.id) return alert("Please log in");

    const numericBid = Number(bidAmount);
    const effectiveCurrentBid = currentBid ?? 0;

    if (!numericBid || numericBid <= effectiveCurrentBid) {
      return setErrorMessage("Your bid must be higher than the current bid.");
    }

    if (!isBiddingOpen) {
      return setErrorMessage("Bidding hasn't started yet.");
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/bids`, {
        user_id: user.id,
        product_id,
        bid_amount: numericBid,
      });
      setCurrentBid(numericBid);
      setHighestBidder(user.username || "You");
      setBidAmount("");
      setErrorMessage("");
    } catch (error) {
      console.error("Error placing bid:", error);
      setErrorMessage("Error placing bid, please try again.");
    }
  };

  const isWishlisted = wishlist.includes(product_id);

  return (
    <div className=" mx-auto p-6 bg-white w-full border-gray-50 border  rounded-md ">
      <div className="flex justify-center items-center w-full flex-col gap-2">
        {/* Product Image */}
        <div className="w-full  flex justify-center items-center">
          <img
            src={
              productImage && productImage.trim() !== ""
                ? productImage
                : placeholderImage
            }
            alt={productName}
            className="w-full h-64 sm:h-80 object-cover rounded-xl shadow-sm"
          />
        </div>

        {/* Product Details */}
        <div className="w-full  flex flex-col justify-between space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{productName}</h1>
            <p className="text-red-600 text-2xl font-semibold mt-2">
              ₹{productPrice}
            </p>
            <p className="text-gray-600 mt-2">
              {productDesc || "No description available."}
            </p>
          </div>

          {/* Current Bid Info */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-inner space-y-2">
            <p className="text-gray-700 font-medium">
              Current Bid:{" "}
              <span className="font-semibold text-red-500">
                ₹{currentBid ?? "No bids yet"}
              </span>
            </p>
            <p className="text-gray-700 font-medium">
              Highest Bidder:{" "}
              <span className="font-semibold">
                {highestBidder ?? "No bidder yet"}
              </span>
            </p>
          </div>

          {/* Place Bid */}
          <div className="space-y-2">
            <input
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              placeholder="Enter your bid amount"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            {errorMessage && (
              <p className="text-sm text-red-500">{errorMessage}</p>
            )}
            {!isBiddingOpen && (
              <p className="text-sm text-yellow-600">
                Bidding hasn't started yet.
              </p>
            )}
            <button
              onClick={placeBid}
              disabled={
                isLoading ||
                !isBiddingOpen ||
                Number(bidAmount) <= (currentBid ?? 0)
              }
              className={`w-full py-3 rounded-lg text-white font-semibold transition ${
                !isBiddingOpen || Number(bidAmount) <= (currentBid ?? 0)
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {isLoading ? "Placing..." : "Place Bid"}
            </button>
          </div>

          {/* Wishlist */}
          <div>
            <button
              onClick={addToWishlist}
              disabled={isWishlisted || isLoading}
              className={`w-full flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg transition ${
                isWishlisted
                  ? "bg-red-100 text-red-600 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
            >
              {isWishlisted ? "Added to Favorites" : "Add to Favorites"}
              <span className="material-symbols-outlined">favorite</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
