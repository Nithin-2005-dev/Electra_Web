"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
const GetResources = () => {
  const [resos, getResos] = useState([]);
  const handleGet = async () => {
    const response = await axios.get("/api/getRes");
    getResos(response.data);
  };
  const handleDelete = async (req) => {
    try {
      const response = await axios.delete(`/api/deleteRes?id=${req._id}`);
      console.log(response)
    } catch (err) {
      console.log(err);
    }
  }; 
  useEffect(()=>{
    handleGet();
  },[])
  return (
    <div>
    <h2 className="text-white font-bold text-center p-3">Resources</h2>
      <div className="flex flex-col-reverse gap-3 p-2">
        {resos.map((res) => {
          return (
            <div className="flex flex-col gap-3 border p-2 bg-slate-800 rounded-xl" key={res._id}>
              {/* <iframe
                src={res.driveUrl}
                width="640"
                height="480"
                allow="autoplay"
              ></iframe> */}
              <p className="text-white inline-block">link:{res.driveUrl}</p>
              <p className="text-white">name:{res.name}</p>
              <p className="text-white">semester:{res.semester}</p>
              <p className="text-white">subject:{res.subject}</p>
              <p className="text-white">categoty:{res.category}</p>
              <div>
                <button
                  onClick={() => {
                    handleDelete(res);
                  }}
                  className="text-white bg-red-700 px-2 p-1 rounded-lg"
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

export default GetResources;
