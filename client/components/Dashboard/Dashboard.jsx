import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";

export default function Dashboard({ productId }) {
  const { user } = useUser();
  const [userBids, setUserBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserBids() {
      try {
        const res = await axios.get(
          `http://localhost:3000/bids/products/${productId}`
        );
        setUserBids(res.data);
        // console.log(res.data);
      } catch (error) {
        console.error("Error fetching user bids:", error);
        setUserBids([]);
      } finally {
        setLoading(false);
      }
    }

    if (user?.id && productId) {
      fetchUserBids();
    }
  }, [user?.id, productId]);

  return (
    <div className="p-4 border-[0.6px] shadow-md border-gray-400 rounded-lg w-full text-center">
      <h1 className="border-b-[0.6px] border-black pb-3 text-lg font-semibold">
        Product Bid History
      </h1>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : userBids.length === 0 ? (
        <p className="text-gray-500 pt-4">No bid placed on this product yet.</p>
      ) : (
        <div className="pt-4 space-y-3">
          {userBids.map((bid, index) => (
            <div
              key={index}
              className="p-2 bg-gray-100 rounded-md shadow-sm flex justify-between items-center text-left"
            >
              <div>
                <p className="text-sm font-medium">
                  Bid Amount: ₹{bid.bid_amount}
                </p>
                <p className="text-xs text-gray-600">
                  Placed on: {new Date(bid.bid_time).toLocaleString()}
                </p>
              </div>
              <div className="">
                <img
                  src={user.imageUrl}
                  alt=""
                  className="w-10 h-10 rounded-full"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
