import React from "react";
import Card from "../components/Card";

export default function Products() {
  return (
    <div className="flex justify-center items-start pt-20">
      <div className="max-w-7xl flex justify-between items-start gap-8">
        <div className="flex flex-col gap-4 fixed ">
          <h1 className="text-2xl font-bold">Catagory</h1>
          <div className="flex gap-3 items-center justify-between">
            <label htmlFor="">Electrical</label>
            <input type="checkbox" name="" id="" className="p-3" />
          </div>
          <div className="flex gap-3 items-center justify-between">
            <label htmlFor="">Forniture</label>
            <input type="checkbox" name="" id="" className="p-3" />
          </div>
          <div className="flex gap-3 items-center justify-between">
            <label htmlFor="">Mobile</label>
            <input type="checkbox" name="" id="" className="p-3" />
          </div>
          <div className="flex gap-3 items-center justify-between">
            <label htmlFor="">Laptop</label>
            <input type="checkbox" name="" id="" className="p-3" />
          </div>
          <div className="flex gap-3 items-center justify-between">
            <label htmlFor="">Books</label>
            <input type="checkbox" name="" id="" className="p-3" />
          </div>
        </div>
        <div className="flex pl-32 flex-wrap">
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
        </div>
      </div>
    </div>
  );
}
