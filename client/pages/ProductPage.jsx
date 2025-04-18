import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import Product from "../components/Product/Product";
import Dashboard from "../components/Dashboard/Dashboard";
export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await axios.get(`http://localhost:3000/product/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Error fetching product", err);
      }
    }
    fetchProduct();
  }, [id]);

  if (!product) return <div>Loading...</div>;

  return (
    <div className="flex justify-center items-center sm:pt-5">
      <div className="sm:p-20 pt-20 p-2 flex gap-2 sm:flex-row flex-col sm:justify-between  sm:items-start justify-center items-center w-full">
        {/* <h1 className="text-2xl font-bold">{product.product_name}</h1>
      <p>Base Price: ₹{product.product_base_price}</p>
      <p>Ends: {new Date(product.bids_end_date_time).toLocaleString()}</p> */}
        <div className="sm:w-1/2 w-4/5">
          <Product
            product_id={product.product_id}
            productName={product.product_name}
            // productDesc={product.product_desc}
            // productImage={product.image_id}
            productPrice={product.product_base_price}
          />
        </div>
        <div className="sm:w-1/2 w-4/5 flex justify-start items-start">
          <Dashboard />
        </div>
      </div>
    </div>
  );
}
