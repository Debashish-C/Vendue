import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import axios from "axios";
import { Link } from "react-router";
import { useUser } from "@clerk/clerk-react";
import AddProductForm from "../components/AddProduct/AddProduct";
import { Toaster } from "react-hot-toast";

export default function Products() {
  const { user } = useUser();
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.API_URL}/product/future-product`
      );
      setAllProducts(response.data);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await axios.get(`${import.meta.env.API_URL}/catagory`);
        setCategories(res.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategories.length === 0) {
      setProducts(allProducts);
    } else {
      const filtered = allProducts.filter((product) =>
        selectedCategories.includes(product.catagory_id)
      );
      setProducts(filtered);
    }
  }, [selectedCategories, allProducts]);

  const handleCategoryChange = (catagoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(catagoryId)
        ? prev.filter((id) => id !== catagoryId)
        : [...prev, catagoryId]
    );
  };

  return (
    <div className="pt-24 px-4 min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <div className="max-w-screen-xl mx-auto flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-1/4 space-y-6">
          <div className="bg-white p-6 border-[0.6px] rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4">Sell Product</h2>
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full border-[0.6px] p-3 rounded-lg hover:shadow-md transition"
            >
              Add Product
            </button>
          </div>

          <div className="bg-white hidden sm:block p-6 border-[0.6px] rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Categories</h2>
            <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto  pr-2">
              {categories.map((cat) => (
                <label
                  key={cat.catagory_id}
                  className="flex justify-between items-center border-0 pb-2"
                >
                  <span>{cat.catagory_name}</span>
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat.catagory_id)}
                    onChange={() => handleCategoryChange(cat.catagory_id)}
                    className="accent-blue-500"
                  />
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full lg:w-3/4">
          {products.length === 0 ? (
            <p className="text-gray-500 text-xl mt-4 text-center">
              No Products Found
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Link
                  to={`/products/${product.product_id}`}
                  key={product.product_id}
                >
                  <Card
                    productName={product.product_name}
                    productDescription={product.description}
                    productBasePrice={product.product_base_price}
                    endTime={product.bids_end_date_time}
                  />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {showAddForm && (
        <AddProductForm
          onClose={() => setShowAddForm(false)}
          onProductAdded={fetchProducts}
        />
      )}
    </div>
  );
}
