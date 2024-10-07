"use client";
import { ImageUploadData } from "@/app/utils/imageUploadData";
import axios from "axios";
import { CldUploadWidget } from "next-cloudinary";
import React from "react";
const UploadImage = ({ preset, year }) => {
  const current = ImageUploadData.filter((ele) => {
    return preset == ele.preset;
  });
  const handleUpload = async (res) => {
    const details = {
      publicId: res.info.public_id || "",
      date: new Date(),
      category: current[0].floderName || "",
      year,
    };
    const response = await axios.post("/api/image-upload", details);
    console.log(response);
  };
  return (
    <div>
      <div>
        <CldUploadWidget uploadPreset={`${preset}`} onSuccess={handleUpload}>
          {({ open }) => {
            return <button onClick={() => open()}>Upload an image</button>;
          }}
        </CldUploadWidget>
      </div>
    </div>
  );
};

export default UploadImage;
