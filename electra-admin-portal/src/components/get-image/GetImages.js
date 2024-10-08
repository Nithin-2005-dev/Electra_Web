"use client";
import React, { useState } from "react";
import axios from "axios";
import { CldImage } from "next-cloudinary";
const GetImages = () => {
  const [imgs, getImgs] = useState([]);
  const handleGet = async () => {
    const response = await axios.get("/api/getImg");
    getImgs(response.data);
    console.log(imgs);
  };
  const handleDelete = async (req) => {
    try {
      const response = await axios.delete(`/api/deleteImg?id=${req._id}`);
      console.log(response)
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
      <button onClick={handleGet}>Get</button>
      <div className="flex flex-wrap">
        {imgs.map((pic) => {
          return (
            <div className="w-1/4" key={pic._id}>
              <CldImage
                key={pic._id}
                width="960"
                height="600"
                src={pic.publicId}
                sizes="100vw"
                alt="Description of my image"
              />
              <div>
                <button
                  onClick={() => {
                    handleDelete(pic);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GetImages;
