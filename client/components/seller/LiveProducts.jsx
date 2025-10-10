import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";

export default function LiveProducts() {
  const { user } = useUser();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!user?.id) return;
    axios
      .get(
        `${import.meta.env.VITE_API_URL}/product/seller/${
          user.id
        }?status=ACTIVE`
      )
      .then((res) => setProducts(res.data))
      .catch(console.error);
  }, [user?.id]);

  return (
    <div className="pt-20">
      <h1 className="text-2xl font-bold mb-4">Live Products</h1>
      {products.length === 0 ? (
        <p>No live auctions currently.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) => (
            <div key={p.id} className="border rounded shadow p-3 bg-white">
              <h2 className="font-semibold">{p.name}</h2>
              <p className="text-green-600">Live Now!</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
