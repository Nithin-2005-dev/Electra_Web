'use client'
import React from 'react'
import { Card, CarouselItem } from 'react-bootstrap';
import Carousel from 'react-bootstrap/Carousel';
import { IoCaretBack, IoCaretForward } from "react-icons/io5";
import styles from '../../app/styles/ImgSlider.module.css'
const ImgSlider = () => {
    const imgs=['https://images.pexels.com/photos/853168/pexels-photo-853168.jpeg?auto=compress&cs=tinysrgb&w=400','https://images.pexels.com/photos/1549280/pexels-photo-1549280.jpeg?auto=compress&cs=tinysrgb&w=400','https://images.pexels.com/photos/1974927/pexels-photo-1974927.jpeg?auto=compress&cs=tinysrgb&w=400','https://images.pexels.com/photos/708392/pexels-photo-708392.jpeg?auto=compress&cs=tinysrgb&w=400']
  return (
    <div className={`bg-cover h-[45vh] ${styles['res-slider']}`}>
    <div className={`text-center font-black text-3xl p-4 ${styles['permanent-marker-regular']}`}>Memorable Moments</div>
      <Carousel fade nextIcon={<IoCaretForward className='text-5xl text-slate-100 opacity-100' />} prevIcon={<IoCaretBack className='text-5xl text-slate-100 opacity-100' />}>
      {
        imgs.map((pic)=>{
            return  <CarouselItem interval={3000} key={pic}>
            <Card style={{ width:'50vw',position:'relative',left:'25vw',top:'0%' }}>
      <Card.Img variant="top" src={pic} />
    </Card>
        </CarouselItem>
        })
      }
      </Carousel>
    </div>
  )
}

export default ImgSlider
