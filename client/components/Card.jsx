import React from "react";
import Button from "./Button";

export default function Card() {
  return (
    <div className=" p-4 m-2 bg-white">
      <div className="flex justify-center items-center">
        <img src="" alt="product image" className="w-44 h-44" />
      </div>
      <div className="text-center p-2 max-w-44">
        <h1 className="font-bold text-xl">Product Name</h1>
        <h2>A Simple Title Of the Product 16gb ram 128 gb storage</h2>
        <div className="flex gap-2 justify-center items-center">
          <h2>Starting Price</h2>
          <p className="text-red-400">4$</p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button title="WishList" bgcolor="bg-black" color="text-white" />
        <Button title="View" bgcolor="border-2 border-black" color="white" />
      </div>
    </div>
  );
}
