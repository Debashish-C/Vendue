import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";

export default function AllProducts() {
  const { user } = useUser();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!user?.id) return;
    axios
      .get(`${import.meta.env.VITE_API_URL}/product/seller/${user.id}`)
      .then((res) => setProducts(res.data))
      .catch(console.error);
  }, [user?.id]);

  return (
    <div className="pt-20">
      <h1 className="text-2xl font-bold mb-4">All Products</h1>
      {products.length === 0 ? (
        <p>No products yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) => (
            <div
              key={p.id}
              className="border rounded shadow-sm p-3 bg-white hover:shadow-md"
            >
              <img
                src={p.images?.[0]?.url || "https://via.placeholder.com/150"}
                alt={p.name}
                className="w-full h-40 object-cover rounded"
              />
              <h2 className="font-semibold mt-2">{p.name}</h2>
              <p className="text-gray-600 text-sm">{p.description}</p>
              <p className="font-medium mt-1">₹{p.basePrice}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
