"use client";
import React, { useState } from "react";
import axios from "axios";
import { CldImage } from "next-cloudinary";
const GetImages = () => {
  const [team, getTeam] = useState([]);
  const handleGet = async () => {
    const response = await axios.get("/api/getTeam");
    getTeam(response.data);
  };
  const handleDelete = async (req) => {
    try {
      const response = await axios.delete(`/api/deleteTeam?id=${req._id}`);
      console.log(response)
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
      <button onClick={handleGet}>Get</button>
      <div className="flex flex-wrap">
        {team.map((t) => {
          return (
            <div className="w-1/4" key={t._id}>
              <CldImage
                key={t._id}
                width="960"
                height="600"
                src={t.publicId}
                sizes="100vw"
                alt="Description of my image"
              />
            <p>name:{t.name}</p>
            <p>position:{t.position}</p>
            <p>year:{t.year}</p>
            <p>category:{t.category}</p>
              <div>
                <button
                  onClick={() => {
                    handleDelete(t);
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
