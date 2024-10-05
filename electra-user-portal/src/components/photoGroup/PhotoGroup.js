'use client'
import React, { useContext, useEffect, useState } from 'react'
import GalleryCard from '../galleryCard/GalleryCard'
import { ImageProvider } from '@/app/store/ImageStore';
import { set } from 'mongoose';
const PhotoGroup =() => {
  const {imgs,currentEventFilter} =useContext(ImageProvider);
  return (
    <div className='flex flex-wrap justify-center items-center gap-3 my-4'>
    {
      imgs && imgs.length==0 && <p>No photos avalible</p>
    }
    {imgs && imgs.map((pic)=>{
      return  <>
      <GalleryCard pic={pic} key={pic._id}/>
      </>
    })}
    </div>
  )
}

export default PhotoGroup
