"use client";
import { ImageUploadData } from "@/app/utils/imageUploadData";
import axios from "axios";
import { CldUploadWidget } from "next-cloudinary";
import 'react-toastify/dist/ReactToastify.css';
import React, { useRef } from "react";
import { Bounce, toast, ToastContainer } from "react-toastify";
const UploadImage = ({ preset,event}) => {
  const yearRef=useRef();
  const current = ImageUploadData.filter((ele) => {
    return preset == ele.preset;
  });
  const handleUpload = async (res) => {
    const details = {
      publicId: res.info.public_id || "",
      date: new Date(),
      category: current[0].floderName || "",
      year:yearRef.current.value,
    };
    try{
    const response = await axios.post("/api/image-upload", details);
    console.log(response);
    toast.success('image uploaded sucessfully', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
      });
    }catch(err){
      toast.error(err.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
        });
    }
  };
  return (
    <div>
 <ToastContainer
position="top-right"
autoClose={5000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="colored"
/>
    <h1 className="text-white text-center p-2 text-xl font-black">{event}</h1>
    <div className="flex justify-center h-[90vh] items-center">
    <div className="flex flex-col gap-4 bg-slate-800 rounded-xl p-3 border">
    <div className="flex flex-col">
    <label htmlFor="year" className="text-white">Year:</label>
    <input type="number" ref={yearRef} className="bg-slate-500 rounded-lg text-white"/>
    </div>
      <div>
        <CldUploadWidget uploadPreset={`${preset}`} onSuccess={handleUpload}>
          {({ open }) => {
            return <button onClick={() =>{
              if(yearRef.current.value==''){
                toast.warn('please enter year', {
position: "top-right",
autoClose: 5000,
hideProgressBar: false,
closeOnClick: true,
pauseOnHover: true,
draggable: true,
progress: undefined,
theme: "light",
transition: Bounce,
});
return;
              }
              open()}} className="bg-fuchsia-500 text-white px-2 p-1 rounded-xl">Upload an image</button>;
          }}
        </CldUploadWidget>
      </div>
    </div>
    </div>
    </div>
  );
};

export default UploadImage;
