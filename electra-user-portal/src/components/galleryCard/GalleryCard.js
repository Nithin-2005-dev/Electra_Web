"use client";
import React, { useState } from "react";
import { Badge, Button, Card, CardFooter, CardHeader } from "react-bootstrap";
import { BsArrowsFullscreen } from "react-icons/bs";
import { FaDownload } from "react-icons/fa";
import { AiTwotoneLike } from "react-icons/ai";
import { FaComments } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa";
import FullPhoto from "../fullPhoto/FullPhoto";
import CommentDialog from "../commentDialog/CommentDialog";
import { CldImage, getCldImageUrl } from "next-cloudinary";
import { saveAs } from "file-saver";
const GalleryCard = ({ pic }) => {
  const [fullPic, setFullPic] = useState(false);
  const [comment, setComment] = useState(false);
  const url = getCldImageUrl({
    width: 960,
    height: 600,
    src: pic.publicId,
  });
  return (
    <div>
      <Card className="w-[70vw] lg:w-[30vw] sm:w-[40vw]">
        <CardHeader className="text-center bg-[#070F2B] text-neutral-300 font-bold text-xs md:text-base lg:text-lg">
          {pic.category + " (" + pic.year + ")"}
        </CardHeader>
        {/* <span className='absolute -right-2 -top-2 text-base lg:text-xl'>
      <Badge pill bg="danger">
      <FaHeart></FaHeart>{1}
      </Badge>
      </span> */}
        <CldImage
          key={pic._id}
          width="500"
          height="600"
          src={pic.publicId}
          sizes="100vw"
          alt="Description of my image"
          className="aspect-square"
        />
      </Card>
      <CardFooter>
        <div className="flex gap-4 p-2 text-blue-400 text-2xl w-full justify-evenly border-1 border-t-0 border-white ">
          {/* <div className='hover:scale-110'><AiTwotoneLike /></div>
        <div onClick={()=>{
            setComment(true)
        }} className='hover:scale-110'><FaComments /></div> */}
          <div
            onClick={() => {
              setFullPic(true);
            }}
            className="hover:scale-110"
          >
            <BsArrowsFullscreen className="cursor-zoom-in"/>
          </div>
          <div className="hover:scale-110">
            <div
              onClick={() => {
                saveAs(url, `${pic.category}-${pic.year}-${pic.publicId}.png`);
              }}
            >
              <FaDownload  className="cursor-pointer"/>
            </div>
          </div>
        </div>
      </CardFooter>
      <FullPhoto item={pic} setFullPic={setFullPic} fullPic={fullPic} />
      {/* <CommentDialog comment={comment} setComment={setComment} item={pic} /> */}
    </div>
  );
};

export default GalleryCard;
