"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { CldImage } from "next-cloudinary";
import { Card, CardBody } from "react-bootstrap";
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
  useEffect(()=>{
    handleGet();
  },[]);

  return (
    <>
    <h2 className="text-white text-center p-3 font-black text-2xl">Team Members</h2>
    <div className="flex justify-center">
      <div className="flex flex-wrap gap-3 justify-center">
        {team?.map((t) => {
          return (
            <Card className="w-1/3 lg:w-1/4 border p-3 bg-slate-800 rounded-xl flex flex-col justify-center gap-2" key={t._id}>
              <CldImage
                key={t._id}
                width="960"
                height="600"
                src={t.publicId}
                sizes="100vw"
                alt="Description of my image" className="aspect-square"
              />
              <CardBody className="flex flex-wrap ">
              <p className="text-white text-xs md:text-base"><strong>name</strong>:{t.name}</p>
            <p className="text-white text-xs md:text-base"><strong>position</strong>:{t.position}</p>
            <p className="text-white text-xs md:text-base"><strong>year</strong>:{t.year}</p>
            <p className="text-white text-xs md:text-base"><strong>category</strong>:{t.category}</p>
              </CardBody>
              <div>
                <button
                  onClick={() => {
                    handleDelete(t);
                  }}
                  className="bg-red-700 text-white px-2 p-1 rounded-lg font-bold"
                >
                  Delete
                </button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
    </>
  );
};

export default GetImages;
