import React from "react";

export default function Card({
  productName,
  productBasePrice,
  endTime,
  productDescription,
  productImage,
}) {
  const formattedEndTime = new Date(endTime).toLocaleString();

  return (
    <div className="group relative w-full sm:w-72 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1">
      {/* Product Image */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={
            productImage
          }
          alt={productName}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <span className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-medium px-2 py-1 rounded-full shadow-md">
          Live Auction
        </span>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col justify-between h-48">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 truncate group-hover:text-amber-600 transition-colors">
            {productName}
          </h2>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {productDescription || "No description available"}
          </p>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div>
            <p className="text-sm text-gray-400">Current Bid</p>
            <p className="text-xl font-bold text-amber-600">
              ₹{productBasePrice}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 font-medium">Ends on</p>
            <p className="text-sm font-semibold text-gray-700">
              {formattedEndTime}
            </p>
          </div>
        </div>
      </div>

      {/* Hover Action */}
      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center">
        <button className="mb-4 px-4 py-2 bg-amber-600 text-white rounded-lg shadow-md hover:bg-amber-700 transition-colors text-sm font-medium">
          Place a Bid
        </button>
      </div>
    </div>
  );
}
