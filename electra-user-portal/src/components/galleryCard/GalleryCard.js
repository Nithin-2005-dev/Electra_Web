'use client'
import React, { useState } from 'react'
import { Badge, Button, Card, CardFooter, CardHeader } from 'react-bootstrap'
import { BsArrowsFullscreen } from "react-icons/bs";
import { FaDownload } from "react-icons/fa";
import { AiTwotoneLike } from "react-icons/ai";
import { FaComments } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa";
import FullPhoto from '../fullPhoto/FullPhoto';
import CommentDialog from '../commentDialog/CommentDialog';
const GalleryCard = ({item}) => {
    const [fullPic,setFullPic]=useState(false)
    const [comment,setComment]=useState(false)
  return (
    <div>
      <Card style={{ width: '22rem' }}>
      <CardHeader className='text-center bg-[#070F2B] text-neutral-300 font-bold'>Event Name</CardHeader>
      <span className='absolute -right-2 -top-2 text-xl'>
      <Badge pill bg="danger">
      <FaHeart></FaHeart>{item.likes}
      </Badge>
      </span>
      <Card.Img variant="top" src={item.image} />
    </Card>
    <CardFooter>
    <div className='flex gap-4 p-2 text-blue-400 text-lg'>
        <div><AiTwotoneLike /></div>
        <div onClick={()=>{
            setComment(true)
        }}><FaComments /></div>
        <div onClick={()=>{
            setFullPic(true)
        }}><BsArrowsFullscreen /></div>
        <div><FaDownload /></div>
    </div>
    </CardFooter>
    <FullPhoto item={item} setFullPic={setFullPic} fullPic={fullPic}/>
    <CommentDialog comment={comment} setComment={setComment} item={item} />
    </div>
  )
}

export default GalleryCard
