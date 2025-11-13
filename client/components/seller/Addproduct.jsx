import React, { useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function AddProduct() {
  const now = new Date();
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadImageToCloudinary = async () => {
    if (!image) return null;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", image);
    formData.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    );
    formData.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );
      setUploading(false);
      return response.data.secure_url;
    } catch (err) {
      console.error("Error uploading image:", err);
      toast.error("Image upload failed");
      setUploading(false);
      return null;
    }
  };

  const [form, setForm] = useState({
    name: "",
    description: "",
    basePrice: "",
    categoryId: "",
    auctionStartTime: null,
    auctionEndTime: null,
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

    if (form.auctionStartTime >= form.auctionEndTime) {
      toast.error("Auction end time must be after start time");
      setIsSubmitting(false);
      return;
    }

    try {
      let uploadedImageUrl = null;
      if (image) {
        uploadedImageUrl = await uploadImageToCloudinary();
      }

      await axios.post(`${import.meta.env.VITE_API_URL}/product/`, {
        ...form,
        categoryId: parseInt(form.categoryId),
        sellerId: user.id,
        basePrice: parseFloat(form.basePrice),
        image: uploadedImageUrl,
      });

      toast.success("Product added successfully!");
      setForm({
        name: "",
        description: "",
        basePrice: "",
        categoryId: "",
        auctionStartTime: null,
        auctionEndTime: null,
        location: "",
      });
      setImage(null);
      setImagePreview(null);
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

  const minDate = new Date(); // prevent past date selection

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-md rounded-lg p-6 sm:p-8">
          <h1 className="text-2xl font-bold mb-2 text-gray-900 text-center">
            Add New Product
          </h1>
          <p className="text-gray-600 text-center mb-6">
            List your item for auction
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleInputChange}
                placeholder="Enter product name"
                className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category *
              </label>
              <select
                name="categoryId"
                value={form.categoryId}
                onChange={handleInputChange}
                className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select a category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleInputChange}
                rows={4}
                placeholder="Describe your product..."
                className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500 resize-vertical"
              />
            </div>

            {/* Base Price & Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Base Price ($) *
                </label>
                <input
                  type="number"
                  name="basePrice"
                  value={form.basePrice}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleInputChange}
                  placeholder="Enter product location"
                  className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Auction Times */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Auction Start Time *
                </label>
                <DatePicker
                  selected={form.auctionStartTime}
                  onChange={(date) =>
                    setForm((prev) => ({ ...prev, auctionStartTime: date }))
                  }
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="MMMM d, yyyy h:mm aa"
                  minDate={now} // cannot select past date
                  minTime={now}  // cannot select past time for today
                  maxTime={new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59)} // optional: end of day
                  className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholderText="Select start time"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Auction End Time *
                </label>
                <DatePicker
                  selected={form.auctionEndTime}
                  onChange={(date) =>
                    setForm((prev) => ({ ...prev, auctionEndTime: date }))
                  }
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="MMMM d, yyyy h:mm aa"
                  minDate={form.auctionStartTime || now} // end date cannot be before start date
                  minTime={
                    form.auctionStartTime &&
                    new Date(
                      form.auctionStartTime.getFullYear(),
                      form.auctionStartTime.getMonth(),
                      form.auctionStartTime.getDate(),
                      form.auctionStartTime.getHours(),
                      form.auctionStartTime.getMinutes()
                    )
                  } // end time cannot be before start time on the same day
                  maxTime={new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59)}
                  className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholderText="Select end time"
                />
              </div>
            </div>

            {/* Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Product Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mt-2 w-40 h-40 object-cover rounded-lg border"
                />
              )}
              {uploading && <p className="text-blue-500 mt-1">Uploading...</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Adding Product..." : "Add Product"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
