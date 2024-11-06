'use client'
import { Canvas } from '@react-three/fiber'
import React, { useContext, useState } from 'react'
import Pikachu from '../3d-models/Pikachu/Pikachu'
import { Environment } from '@react-three/drei'
import HeroText from '../HeroText/HeroText'
import GenAi from '../genai/GenAi'
import styles from '../../app/styles/ResourcesHero.module.css'
import { AnimationStore, AnimationStoreProvider } from '@/app/store/AnimationStore'
import { useMotionValueEvent, useScroll} from 'framer-motion'
import { ResourceStore } from '@/app/store/ResourceStore'
const ResourcesHero = () => {
  const {setPikaAnimation}=useContext(AnimationStore)
  const {doubt,setDoubt}=useContext(ResourceStore);
  const { scrollY } = useScroll()
useMotionValueEvent(scrollY, "change", (latest) => {
  setPikaAnimation(0)
})
  return (
    <section>
    <div className={`flex flex-col sm:blur-0 ${!doubt?'blur-none': 'blur-sm'}`}>
    <div className='flex w-[50vw] h-[70vh] md:h-[100vh]'>
      {
   <HeroText />
      }
    </div>
    </div>
    <div className='fixed right-0 top-5' onMouseOver={()=>{
          setPikaAnimation(2)

      }}
      onMouseLeave={()=>{
          setPikaAnimation(1)
      }}
      onTouchStart={()=>{
          setPikaAnimation(2)
      }}
      onTouchEnd={()=>{
          setPikaAnimation(1)
      }}
      >
      <Canvas style={{width:'50vw',height:'90vh'}}>
      <Pikachu/>
      <Environment preset='warehouse'/>
    </Canvas>
      </div>
    <button className={`bg-[#AD49E1] font-bold p-1 px-2 rounded-xl hover:border-white hover:border-2 ${styles['doubt-btn']} text-sm md:text-lg lg:text-2xl `} onClick={()=>{
        setDoubt(!doubt)
    }}>{doubt? 'Doubt cleared?':'Ask Pikachu'}</button>
  {
        doubt && <GenAi/>
      }</section>
  )
}

export default ResourcesHero
