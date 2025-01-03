'use client'
import React, { useContext, useEffect, useState } from 'react'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import styles from '../../app/styles/ImgSlider.module.css'
import { CardImg } from 'react-bootstrap'
import { ImageProvider } from '@/app/store/ImageStore'
import { CldImage } from 'next-cloudinary'
const ImgSlider = () => {
 const {imgs,loading}=useContext(ImageProvider);
 let random;
 if(imgs.length!=0){
 random=[imgs[Math.round(Math.random()*imgs.length-2)],imgs[Math.round(Math.random()*imgs.length-2)],imgs[Math.round(Math.random()*imgs.length-2)],imgs[Math.round(Math.random()*imgs.length-2)],imgs[Math.round(Math.random()*imgs.length-2)],imgs[Math.round(Math.random()*imgs.length-2)],imgs[Math.round(Math.random()*imgs.length-2)],imgs[Math.round(Math.random()*imgs.length-2)]]
 }else{
  random=[]
 }
  return <section>
    {
      !loading && <><div className={`${styles['res-slider']}`}>
    <div className={`text-center font-black text-3xl p-4 ${styles['fredoka']} mt-8`}>Memorable Moments</div>
    </div>
    <div className='flex justify-center w-full '>
    <Carousel
      opts={{
        align: "start",
        loop:true
      }}
      className={`w-full max-w-52 lg:max-w-4xl sm:max-w-sm md:max-w-2xl xl:max-w-6xl border-hidden ${styles['img-slider']} sm:scale-x-[1.2]`}
    >
      <CarouselContent >
        {random && random.map((pic) => {
          if(!pic){
            return;
          }
         return <CarouselItem key={pic?._id} className="md:basis-1/2 lg:basis-1/2 " >
            <div>
             <Card className='border-0'>
                <CardContent className="flex aspect-square items-center justify-center p-0  border-0">
                <CldImage key={pic?._id}
            width="960"
            height="0"
            src={pic?.publicId}
            sizes="100vw"
            alt={`${pic.category}/${pic.year}`}
            className='aspect-square rounded-xl'
          />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        })}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
    </div></>
    }
    </section>
}

export default ImgSlider
