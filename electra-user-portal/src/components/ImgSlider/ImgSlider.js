'use client'
import React from 'react'
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
const ImgSlider = () => {
    const imgs=['https://images.pexels.com/photos/853168/pexels-photo-853168.jpeg?auto=compress&cs=tinysrgb&w=400','https://images.pexels.com/photos/1549280/pexels-photo-1549280.jpeg?auto=compress&cs=tinysrgb&w=400','https://images.pexels.com/photos/1974927/pexels-photo-1974927.jpeg?auto=compress&cs=tinysrgb&w=400','https://images.pexels.com/photos/708392/pexels-photo-708392.jpeg?auto=compress&cs=tinysrgb&w=400']
  return (
    <>
    <div className={`${styles['res-slider']}`}>
    <div className={`text-center font-black text-3xl p-4 ${styles['permanent-marker-regular']} mt-3`}>Memorable Moments</div>
    </div>
    <div className='flex justify-center w-full '>
    <Carousel
      opts={{
        align: "start",
        loop:true
      }}
      className={`w-full max-w-52 lg:max-w-4xl sm:max-w-sm md:max-w-2xl xl:max-w-6xl border-hidden ${styles['img-slider']}`}
    >
      <CarouselContent>
        {imgs.map((pic, index) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/1">
            <div>
              <Card className='border-1'>
                <CardContent className="flex aspect-square items-center justify-center p-0  border-0">
                    <CardImg src={pic}/>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
    </div>
    </>
  )
}

export default ImgSlider
