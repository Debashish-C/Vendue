import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";

export default function History() {
  const { user } = useUser();
  const [soldProducts, setSoldProducts] = useState([]);

  useEffect(() => {
    if (!user?.id) return;
    axios
      .get(
        `${import.meta.env.VITE_API_URL}/products/seller/${user.id}?status=SOLD`
      )
      .then((res) => setSoldProducts(res.data))
      .catch(console.error);
  }, [user?.id]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Sold Product History</h1>
      {soldProducts.length === 0 ? (
        <p>No sales yet.</p>
      ) : (
        <ul className="space-y-3">
          {soldProducts.map((p) => (
            <li key={p.id} className="border p-3 bg-white rounded shadow-sm">
              <h3 className="font-semibold">{p.name}</h3>
              <p className="text-gray-600">Sold for ₹{p.soldPrice}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
