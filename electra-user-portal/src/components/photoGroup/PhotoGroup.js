'use client'
import React, { useContext, useEffect, useState } from 'react'
import GalleryCard from '../galleryCard/GalleryCard'
import { ImageProvider } from '@/app/store/ImageStore';
import ImageLoader from '../img-loader/ImageLoader'
import { set } from 'mongoose';
const PhotoGroup =() => {
  const {imgs,currentEventFilter,loading} =useContext(ImageProvider);
  imgs.sort(function(a,b){
      if(a.year<b.year){
          return 1
      }if((a.year>b.year)){
        return -1;
      }else{
        return 0;
      }
  })
  return <>
    {loading ?<ImageLoader/> :<div className='flex flex-wrap justify-center items-center gap-3 my-4 min-h-[100vh]' >
      {
        imgs && imgs.length==0 && <p>No photos avalible</p>
      }
      {imgs && imgs.map((pic)=>{
        return  <>
        <GalleryCard pic={pic} key={pic._id}/>
        </>
      })}
      </div>}
  </>
}

export default PhotoGroup
