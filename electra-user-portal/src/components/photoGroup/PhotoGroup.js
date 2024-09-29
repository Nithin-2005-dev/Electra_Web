'use client'
import React from 'react'
import GalleryCard from '../galleryCard/GalleryCard'
import FullPhoto from '../fullPhoto/FullPhoto';
const PhotoGroup = () => {
    const items=[
        {
            image:'https://images.pexels.com/photos/1708912/pexels-photo-1708912.jpeg?auto=compress&cs=tinysrgb&w=400',
            likes:10,
            comments:['nice','beautiful','wow','great','fantastic','congrats']
        },
        {
            image:'https://images.pexels.com/photos/1709003/pexels-photo-1709003.jpeg?auto=compress&cs=tinysrgb&w=600',
            likes:29,
            comments:['nice','beautiful','wow','great','fantastic','congrats']
        },
        {
            image: 'https://images.pexels.com/photos/2952834/pexels-photo-2952834.jpeg?auto=compress&cs=tinysrgb&w=600',
            likes:8,
            comments:['nice','beautiful','wow','great','fantastic','congrats']
        },
        {
            image: 'https://images.pexels.com/photos/2747446/pexels-photo-2747446.jpeg?auto=compress&cs=tinysrgb&w=600',
            likes:40,
            comments:['nice','beautiful','wow','great','fantastic','congrats']
        },
         {
            image: 'https://images.pexels.com/photos/1387174/pexels-photo-1387174.jpeg?auto=compress&cs=tinysrgb&w=600',
            likes:3,
            comments:['nice','beautiful','wow','great','fantastic','congrats']
        },
       ];
  return (
    <div className='flex flex-wrap justify-center items-center gap-3'>
    {items.map((item)=>{
      return  <>
      <GalleryCard item={item} key={item.likes}/>
      </>
    })}
    </div>
  )
}

export default PhotoGroup
