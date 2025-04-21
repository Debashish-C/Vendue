import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import axios from "axios";
import { Link } from "react-router";

export default function Auction() {
  const [products, setProducts] = useState([]);
  const [catagory, setCatagory] = useState([]);

  useEffect(() => {
    async function fetchCatagory() {
      try {
        const response = await axios.get(
          `${import.meta.env.API_URL}/catagory`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log(response.data);
        setCatagory(response.data);
      } catch (error) {
        console.log("Error fetching categories", error);
        setCatagory([]);
      }
    }
    fetchCatagory();
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await axios.get(`${import.meta.env.API_URL}/product`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log(response.data);
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
      <div className="flex sm:w-5xl gap-4 lg:w-7xl justify-center items-center flex-wrap max-w-7xl">
        {products.length === 0 ? (
          <h2 className="text-xl font-bold">
            No live products available at the moment.
          </h2>
        ) : (
          products.map((product) => (
            <Link
              to={`/products/${product.product_id}`}
              key={product.product_id}
            >
              <Card
                productName={product.product_name}
                productBasePrice={product.product_base_price}
                endTime={product.bids_end_date_time}
              />
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
