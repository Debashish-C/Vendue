import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "../components/Card";
import { Link } from "react-router";
import { useUser } from "@clerk/clerk-react";

export default function WishList() {
  const { user } = useUser();
  const [wishList, setWishList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    async function fetchWishList() {
      try {
        const result = await axios.get(
          `${import.meta.env.VITE_API_URL}/wishlist?user_id=${user.id}`
        );
        setWishList(result.data);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
        setWishList([]);
      } finally {
        setLoading(false);
      }
    }

    fetchWishList();
  }, [user?.id]);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-4 sm:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        My Wishlist
      </h1>

      {loading ? (
        <p className="text-center text-gray-500 py-20">
          Loading your wishlist...
        </p>
      ) : wishList.length === 0 ? (
        <p className="text-center text-gray-500 py-20 text-lg">
          Your wishlist is empty.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-screen-xl mx-auto">
          {wishList.map((product) => (
            <Link
              to={`/products/${product.product_id}`}
              key={product.product_id}
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
    </div>
  );
}
