import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";

export default function Product({
  product_id,
  productName,
  productImage,
  productDesc,
  productPrice,
}) {
  const { user } = useUser();
  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [bidAmount, setBidAmount] = useState("");
  const [currentBid, setCurrentBid] = useState(null);
  const [highestBidder, setHighestBidder] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      try {
        const [wishlistRes, bidRes] = await Promise.all([
          axios.get(`http://localhost:3000/wishlist?user_id=${user.id}`),
          axios.get(`http://localhost:3000/bids/product/${product_id}`),
        ]);

        const productIds = wishlistRes.data.map((item) => item.product_id);
        setWishlist(productIds);

        if (bidRes.data) {
          setCurrentBid(bidRes.data.amount);
          setHighestBidder(bidRes.data.highestBidder);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setWishlist([]);
      }
    };

    fetchData();
  }, [user?.id, product_id]);

  const AddtoWishList = async () => {
    if (!user?.id) return alert("Please log in");

    try {
      setIsLoading(true);
      await axios.post("http://localhost:3000/wishlist/add", {
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

    if (!bidAmount || bidAmount <= currentBid) {
      return setErrorMessage("Your bid must be higher than the current bid.");
    }

    try {
      await axios.post("http://localhost:3000/bids", {
        user_id: user.id,
        product_id,
        bid_amount: bidAmount,
      });
      setCurrentBid(bidAmount);
      setHighestBidder(user.username);
      setBidAmount("");
      setErrorMessage("");
    } catch (error) {
      console.error("Error placing bid:", error);
      setErrorMessage("Error placing bid, please try again.");
    }
  };

  const isWishlisted = wishlist.includes(product_id);

  return (
    <div className="max-w-4xl mx-auto p-6 border border-gray-300 rounded-lg shadow-md bg-white ">
      <div className="flex flex-col sm:flex-row gap-8">
        {/* Image */}
        <div className="w-full sm:w-1/2">
          <img
            src={productImage || "https://via.placeholder.com/400"}
            alt={productName}
            className="w-full h-64 object-cover rounded-lg"
          />
        </div>

        {/* Product Info */}
        <div className="w-full sm:w-1/2 space-y-4">
          <h1 className="text-3xl font-bold">{productName}</h1>
          <p className="text-red-600 text-xl font-semibold">₹{productPrice}</p>
          <p className="text-gray-600">
            {productDesc || "No description available."}
          </p>

          {/* Bid Info */}
          <div className="pt-2">
            <p className="font-medium">
              <span className="text-gray-700">Current Bid:</span> ₹
              {currentBid || "No bids yet"}
            </p>
            <p className="font-medium">
              <span className="text-gray-700">Highest Bidder:</span>{" "}
              {highestBidder || "No bidder yet"}
            </p>
          </div>

          {/* Bid Input */}
          <div className="space-y-2">
            <input
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              placeholder="Enter your bid amount"
              className="w-full p-2 border border-gray-300 rounded"
            />
            {errorMessage && (
              <p className="text-sm text-red-500">{errorMessage}</p>
            )}
            <button
              onClick={placeBid}
              disabled={isLoading || bidAmount <= currentBid}
              className={`w-full py-2 rounded text-white font-semibold transition ${
                bidAmount <= currentBid
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              Place Bid
            </button>
          </div>
          <div className="pt-4">
            <button
              onClick={AddtoWishList}
              disabled={isWishlisted || isLoading}
              className={`w-full flex items-center justify-center gap-2 py-2 border rounded transition ${
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
