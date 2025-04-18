import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "../components/Card";
import { Link } from "react-router";
import { useUser } from "@clerk/clerk-react";

export default function WishList() {
  const { user } = useUser();
  const [wishList, setWishList] = useState([]);

  useEffect(() => {
    if (!user?.id) return;

    async function FetchWishList() {
      try {
        const result = await axios.get(
          `http://localhost:3000/wishlist?user_id=${user.id}`
        );
        setWishList(result.data);
      } catch (error) {
        console.log("Server Error to fetch Data", error);
        setWishList([]);
      }
    }
    FetchWishList();
  }, [user?.id]);

  return (
    <div className="pt-20 flex flex-wrap justify-center gap-6 px-8">
      {wishList.length > 0 ? (
        wishList.map((product) => (
          <Link to={`/products/${product.product_id}`} key={product.product_id}>
            <Card
              productName={product.product_name}
              productBasePrice={product.product_base_price}
              endTime={product.bids_end_date_time}
              productImage={product.product_image}
              productDesc={product.product_desc}
            />
          </Link>
        ))
      ) : (
        <p>No items in your wishlist</p>
      )}
    </div>
  );
}
