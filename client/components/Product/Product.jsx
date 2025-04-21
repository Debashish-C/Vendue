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

  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      try {
        const wishlistRes = await axios.get(
          `${import.meta.env.API_URL}/wishlist?user_id=${user.id}`
        );
        const bidRes = await axios.get(
          `${import.meta.env.API_URL}/bids/products/${product_id}`
        );

        const productIds = wishlistRes.data.map((item) => item.product_id);
        setWishlist(productIds);

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

  const AddtoWishList = async () => {
    if (!user?.id) return alert("Please log in");

    try {
      setIsLoading(true);
      await axios.post(`${import.meta.env.API_URL}/wishlist/add`, {
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
      await axios.post(`${import.meta.env.API_URL}/bids`, {
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
    <div className="max-w-4xl mx-auto p-6 border border-gray-300 rounded-lg shadow-md bg-white">
      <div className="flex flex-col sm:flex-row gap-8">
        <div className="w-full sm:w-1/2">
          <img
            src={productImage || "https://via.placeholder.com/400"}
            alt={productName}
            className="w-full h-64 object-cover rounded-lg"
          />
        </div>

        <div className="w-full sm:w-1/2 space-y-4">
          <h1 className="text-3xl font-bold">{productName}</h1>
          <p className="text-red-600 text-xl font-semibold">₹{productPrice}</p>
          <p className="text-gray-600">
            {productDesc || "No description available."}
          </p>

          <div className="pt-2">
            <p className="font-medium">
              <span className="text-gray-700">Current Bid:</span> ₹
              {currentBid ?? "No bids yet"}
            </p>
            <p className="font-medium">
              <span className="text-gray-700">Highest Bidder:</span>{" "}
              {highestBidder ?? "No bidder yet"}
            </p>
          </div>

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
              className={`w-full py-2 rounded text-white font-semibold transition ${
                !isBiddingOpen || Number(bidAmount) <= (currentBid ?? 0)
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {isLoading ? "Placing..." : "Place Bid"}
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
