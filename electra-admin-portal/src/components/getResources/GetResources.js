"use client";
import axios from "axios";
import React, { useState } from "react";
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
  return (
    <div>
      <button onClick={handleGet}>Get</button>
      <div className="flex flex-wrap">
        {resos.map((res) => {
          return (
            <div className="w-1/4" key={res._id}>
              <iframe
                src={res.driveUrl}
                width="640"
                height="480"
                allow="autoplay"
              ></iframe>
              <p>semester:{res.semester}</p>
              <p>subject:{res.subject}</p>
              <p>categoty:{res.category}</p>
              <div>
                <button
                  onClick={() => {
                    handleDelete(res);
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

export default GetResources;
