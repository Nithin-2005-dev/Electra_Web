'use client'
import React, { useContext, useEffect, useState } from 'react'
import GalleryCard from '../galleryCard/GalleryCard'
import FullPhoto from '../fullPhoto/FullPhoto';
import axios from 'axios';
import { ImageProvider } from '@/app/store/ImageStore';
const PhotoGroup = () => {
  const {imgs} =useContext(ImageProvider);
  console.log(imgs)
  return (
    <div className='flex flex-wrap justify-center items-center gap-3 my-4'>
    {imgs && imgs.map((pic)=>{
      return  <>
      <GalleryCard pic={pic} key={pic._id}/>
      </>
    })}
    </div>
  )
}

export default PhotoGroup
