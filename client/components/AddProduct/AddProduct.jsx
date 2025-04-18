import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";

export default function AddProductForm({ onClose, onProductAdded }) {
  const { user } = useUser();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [product, setProduct] = useState({
    product_name: "",
    product_base_price: "",
    catagory_id: "",
    description: "",
    bids_start_date_time: "",
    bids_end_date_time: "",
  });

  useEffect(() => {
    axios.get("http://localhost:3000/catagory").then((res) => {
      setCategories(res.data);
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) return toast.error("Please login to add a product");

    if (
      !product.product_name ||
      !product.product_base_price ||
      !product.catagory_id
    ) {
      return toast.error("Please fill out all required fields");
    }

    const formData = new FormData();
    Object.entries(product).forEach(([key, val]) => {
      formData.append(key, val);
    });
    formData.append("created_by", user.id);
    if (image) formData.append("image", image);

    try {
      setIsLoading(true);
      await axios.post("http://localhost:3000/product/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Product added successfully!");
      onProductAdded();
      onClose();
    } catch (err) {
      console.error("Add product error:", err);
      toast.error("Failed to add product.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-gray-800 bg-opacity-30 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg text-left">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-medium">Add Product</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-black"
            >
              ✕
            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <input
              name="product_name"
              value={product.product_name}
              onChange={handleChange}
              placeholder="Product Name"
              className="w-full p-2 border rounded"
              required
            />
            <input
              name="product_base_price"
              value={product.product_base_price}
              onChange={handleChange}
              placeholder="Base Price"
              type="number"
              className="w-full p-2 border rounded"
              required
            />
            <select
              name="catagory_id"
              value={product.catagory_id}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.catagory_id} value={cat.catagory_id}>
                  {cat.catagory_name}
                </option>
              ))}
            </select>
            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              placeholder="Description"
              className="w-full p-2 border rounded"
            />
            <input
              type="datetime-local"
              name="bids_start_date_time"
              value={product.bids_start_date_time}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="datetime-local"
              name="bids_end_date_time"
              value={product.bids_end_date_time}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full"
            />
            <div className="flex justify-end space-x-4 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? "Adding..." : "Add Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
