import React from "react";
import Button from "./Button";

export default function Card({
  productName,
  productBasePrice,
  endTime,
  productDescription,
  productImage,
}) {
  return (
    <div className="p-4 m-2 bg-white rounded-lg shadow-md">
      <div className="flex justify-center items-center">
        <img
          src={productImage || "https://via.placeholder.com/176"}
          alt={productName}
          className="w-44 h-44 object-cover"
        />
      </div>
      <div className="text-center p-2 max-w-44">
        <h1 className="font-bold text-xl truncate">{productName}</h1>
        <h2 className="text-gray-600 text-sm h-12 overflow-hidden">
          {productDescription || "No description available"}
        </h2>
        <div className="flex gap-2 justify-center items-center">
          <h2 className="text-sm">Starting Price:</h2>
          <p className="text-red-400 font-semibold">${productBasePrice}</p>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Ends: {new Date(endTime).toLocaleString()}
        </p>
      </div>
      <div className="flex gap-2 mt-3">
        <Button title="Wishlist" bgcolor="bg-black" color="text-white" />
        <Button
          title="View"
          bgcolor="border-2 border-black"
          color="text-black"
        />
      </div>
    </div>
  );
}
