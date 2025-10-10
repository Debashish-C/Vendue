import React, { useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import toast from "react-hot-toast";

export default function AddProduct() {
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    basePrice: "",
    categoryId: 0,
    auctionStartTime: "",
    auctionEndTime: "",
    location: "",
  });

  const categories = [
    { id: "1", name: "Electronics" },
    { id: "2", name: "Fashion" },
    { id: "3", name: "Home & Garden" },
    { id: "4", name: "Sports" },
    { id: "5", name: "Collectibles" },
    { id: "6", name: "Vehicles" },
    { id: "7", name: "Other" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation
    if (
      !form.name ||
      !form.basePrice ||
      !form.categoryId ||
      !form.auctionStartTime ||
      !form.auctionEndTime
    ) {
      toast.error("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    if (new Date(form.auctionStartTime) >= new Date(form.auctionEndTime)) {
      toast.error("Auction end time must be after start time");
      setIsSubmitting(false);
      return;
    }

    try {
      await axios.post(`http://localhost:4000/product/`, {
        ...form,
        categoryId: parseInt(form.categoryId),
        sellerId: user.id,
        basePrice: parseFloat(form.basePrice),
      });

      console.log("success added product");
      toast.success("Product added successfully!");
      setForm({
        name: "",
        description: "",
        basePrice: "",
        categoryId: "",
        auctionStartTime: "",
        auctionEndTime: "",
        location: "",
      });
    } catch (err) {
      console.error("Error adding product:", err);
      toast.error(err.response?.data?.message || "Error adding product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-3 pt-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Add New Product
            </h1>
            <p className="text-gray-600">List your item for auction</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Product Name */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 md:pt-3"
              >
                Product Name *
              </label>
              <div className="md:col-span-2">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Category */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
              <label
                htmlFor="categoryId"
                className="block text-sm font-medium text-gray-700 md:pt-3"
              >
                Category *
              </label>
              <div className="md:col-span-2">
                <select
                  id="categoryId"
                  name="categoryId"
                  value={form.categoryId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 md:pt-3"
              >
                Description
              </label>
              <div className="md:col-span-2">
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleInputChange}
                  placeholder="Describe your product..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical"
                />
              </div>
            </div>

            {/* Price and Location Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Base Price */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                <label
                  htmlFor="basePrice"
                  className="block text-sm font-medium text-gray-700 md:pt-3"
                >
                  Base Price ($) *
                </label>
                <div className="md:col-span-2">
                  <input
                    type="number"
                    id="basePrice"
                    name="basePrice"
                    value={form.basePrice}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Location */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700 md:pt-3"
                >
                  Location
                </label>
                <div className="md:col-span-2">
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={form.location}
                    onChange={handleInputChange}
                    placeholder="Enter product location"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Auction Times Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Auction Start Time */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                <label
                  htmlFor="auctionStartTime"
                  className="block text-sm font-medium text-gray-700 md:pt-3"
                >
                  Start Time *
                </label>
                <div className="md:col-span-2">
                  <input
                    type="datetime-local"
                    id="auctionStartTime"
                    name="auctionStartTime"
                    value={form.auctionStartTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Auction End Time */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                <label
                  htmlFor="auctionEndTime"
                  className="block text-sm font-medium text-gray-700 md:pt-3"
                >
                  End Time *
                </label>
                <div className="md:col-span-2">
                  <input
                    type="datetime-local"
                    id="auctionEndTime"
                    name="auctionEndTime"
                    value={form.auctionEndTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 flex justify-between flex-row-reverse items-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-fit bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Adding Product...
                  </span>
                ) : (
                  "Add Product"
                )}
              </button>
              <p className="text-sm text-gray-500">* Required fields</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
