import React from "react";

export default function Card({
  productName,
  productBasePrice,
  endTime,
  productDescription,
  productImage,
}) {
  return (
    <div className="w-full sm:w-64 bg-white rounded-lg border-[0.6px] border-gray-400 shadow-sm hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      <div className="w-full h-44 bg-gray-000 flex items-center justify-center overflow-hidden">
        <img
          src={productImage || "https://via.placeholder.com/176"}
          alt={productName}
          className="object-cover w-full h-full"
        />
      </div>

      <div className="p-4 space-y-2">
        <h1 className="font-semibold text-lg truncate">{productName}</h1>
        <p className="text-sm text-gray-500 line-clamp-2">
          {productDescription || "No description available"}
        </p>
        <p className="text-base font-semibold text-red-500">
          ₹{productBasePrice}
        </p>
        <p className="text-xs text-gray-400">
          Ends: {new Date(endTime).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
