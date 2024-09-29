'use client'
import { Canvas } from '@react-three/fiber'
import React from 'react'
import Pikachu from '../3d-models/Pikachu/Pikachu'
import { Environment } from '@react-three/drei'
import styles from '../../app/styles/ResourcesHero.module.css'
import { IoCloudDownloadSharp } from "react-icons/io5";
const ResourcesHero = () => {
  return (
    <div className='flex w-[50vw] h-[90vh]'>
      <div className='absolute right-0'>
      <Canvas style={{width:'50vw',height:'90vh'}}>
      <Pikachu/>
      <Environment preset='warehouse'/>
    </Canvas>
      </div>
      <div className='flex flex-col w-[50vw] justify-center items-start content-center gap-3 p-2 lg:p-8 md:p-5'>
      <div className='text-xl font-bold md:text-2xl lg:text-3xl text-fuchsia-400 [text-shadow:_0.2rem_-0.2rem_0.3rem_rgb(99_102_241_/_0.8)] '>Welcome to the Academic Resources Hub</div>
      <div className='lg:text-base md:text-sm text-xs text-blue-100'>Welcome to the Academic Resources Hub of the Electrical Engineering Department at NIT Silchar. This dedicated platform is designed to support our students in their academic journey by providing easy access to a comprehensive collection of study materials, class notes, and essential resources.
</div>
<div className='text-xl font-bold md:text-2xl lg:text-3xl text-red-300  [text-shadow:_0.2rem_-0.2rem_0.3rem_rgb(255_0_0_/_0.8)]'>
Our Commitment:
</div>
<div className='lg:text-base md:text-sm text-xs text-blue-100'>
The Electrical Engineering Department at NIT Silchar is committed to providing you with the best resources to excel in your academic endeavors. This platform is continuously updated to ensure you have the latest and most relevant materials at your disposal.
Whether you’re looking for lecture notes, preparing for exams, or working on your projects, our Resources Hub is here to assist you every step of the way. 
</div>
<div>
<button className={`bg-[#AD49E1] font-bold p-1 px-2 rounded-xl ${styles['hvr-radial-in']} hover:border-white hover:border-2`}>Course structure<IoCloudDownloadSharp className={`inline mx-1`}/></button>
</div>
    </div>
    </div>
   
  )
}

export default ResourcesHero
