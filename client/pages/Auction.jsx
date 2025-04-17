import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import axios from "axios";

export default function Auction() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await axios.get("http://localhost:5000/product", {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: false,
        });
        setProducts(response.data);
      } catch (error) {
        console.log("Error fetching products:", error);
        setProducts([]);
      }
    }
    fetchProducts();
  }, []);

  return (
    <div className="pt-20 flex justify-center items-center">
      <div className="flex flex-wrap max-w-7xl">
        {products.map((product) => (
          <Card
            key={product.productID}
            productName={product.productName}
            productBasePrice={product.productBasePrice}
            endTime={product.BidsEndTime}
          />
        ))}
      </div>
    </div>
  );
}
