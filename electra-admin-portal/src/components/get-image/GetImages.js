"use client";
import React, { useEffect, useState } from "react";
import {Card, ToastContainer} from 'react-bootstrap'
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import { CldImage } from "next-cloudinary";
import router from 'next/router'
import { Bounce, toast } from "react-toastify";
const GetImages = () => {
  const [loading,setLoading]=useState(false)
  const [imgs, getImgs] = useState([]);
  const handleGet = async () => {
    setLoading(true);
    const response = await axios.get("/api/getImg");
    getImgs(response.data);
    console.log(imgs);
    setLoading(false);
  };
  useEffect(()=>{
    handleGet();
  },[]);
  const handleDelete = async (req) => {
    try {
      const response = await axios.delete(`/api/deleteImg?id=${req._id}`);
      console.log(response)
    } catch (err) {
      console.log(err);
    }
  };
  imgs.sort(function(a,b){
    if(a.date<b.date){
        return 1
    }if((a.date>b.date)){
      return -1;
    }else{
      return 0;
    }
})
  return (
    <>
    {loading?<div className="h-screen w-screen text-2xl justify-center items-center">Loading...</div>:<div>
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
    <h2 className="text-center text-white font-black p-3 m-2 text-3xl"> Gallery Images</h2>
      <div className="flex flex-wrap gap-5 justify-center items-center">
        {imgs.map((pic) => {
          return (
            <Card className="w-1/4 flex flex-col justify-center items-center gap-2 " key={pic._id}>
            <CldImage
                key={pic._id}
                width="960"
                height="600"
                src={pic.publicId}
                sizes="100vw"
                alt="Description of my image"
                className="aspect-square"
              />
              <div>
                <button
                  onClick={() => {
                    toast.success('image deleted sucessfully', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce
        });
                    handleDelete(pic);
                  }} className="text-white bg-red-600 rounded-lg p-1 px-3 hover:opacity-80"
                >
                  Delete
                </button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>}

    </>
  );
};

export default GetImages;
