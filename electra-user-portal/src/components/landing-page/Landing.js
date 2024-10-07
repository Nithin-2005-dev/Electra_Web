'use client'
import React, { useEffect } from 'react'
import LightninigBold from '../3d-models/lightning-bolt'
import { Environment} from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import {motion} from 'framer-motion'
import Typewriter from 'typewriter-effect';
import Link from 'next/link'
const Landing = () => {
  new Typewriter('#typewriter', {
    strings: ['Hello', 'World'],
    autoStart: true,
  });
  return (
    <>
       <div className={`flex items-center h-[100vh]`}>
       <div className="w-1/2 flex flex-col p-4 gap-3 flex-wrap">
      <motion.div className="border-l-4 border-yellow-300" initial={{
        x:-1000,
      }}
      animate={{
        x:0,
        transition:{
          type:"spring",
          stiffness:100,
          duration:1,
        }
      }}
      >
      <span className='font-bold text-2xl lg:text-5xl sm:text-lg text-blue-200 md:text-3xl'>Electra Society:
      <span className='text-red-200 inline-block'>
      <Typewriter options={
        {
          loop:true,
          delay:200
        }
      }
  onInit={(typewriter) => {
    typewriter.typeString('Powering Innovation & Excellence')
    .deleteAll()
    .pauseFor(1000)
    .start();
  }}
/>
      </span>
      </span>
      </motion.div>
      <motion.div className="text-lg lg:text-2xl sm:text-base font-serif" initial={{
        x:-1000,
      }}
      animate={{
        x:0,
        transition:{
          type:"spring",
          stiffness:50,
          duration:1,
          delay:1,
        }
      }}>The Official Society of the Electrical Engineering Department, NIT Silchar</motion.div>
      <div className=' absolute bottom-[10vh] md:bottom-[18vh]'>
      <Link href={'/Sign-Up'} className='bg-yellow-600 font-black px-3 sm:text-2xl rounded-xl mr-2 py-1 text-lg  hover:scale-110 hover:bg-yellow-500 hover:border-4 hover:border-double'>
      Join Us
    </Link>
      </div>
      </div>
      <motion.div initial={{y:-1000}} animate={{
        y:0,
        transition:{
          type:"spring",
          stiffness:100,
          duration:10
        }
      }}>
      <Canvas style={{width:'50vw',height:'93vh'}} shadows>
      <LightninigBold />
      <Environment preset="park"/>
      </Canvas>
      </motion.div>
      </div>
    </>
  )
}

export default Landing
