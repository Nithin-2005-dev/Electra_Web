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
const ResourcesHero = () => {
  const {setPikaAnimation}=useContext(AnimationStore)
  const [doubt,setDoubt]=useState(false)
  const { scrollY } = useScroll()
useMotionValueEvent(scrollY, "change", (latest) => {
  setPikaAnimation(0)
})
  return (
    <>
    <button className={`bg-[#AD49E1] font-bold p-1 px-2 rounded-xl hover:border-white hover:border-2 ${styles['doubt-btn']} `} onClick={()=>{
        setDoubt(!doubt)
    }}>{doubt? 'Doubt cleared?':'Ask a Doubt to Pikachu?'}</button>
    <div className='flex w-[50vw] h-[90vh]'>
      <div className='fixed right-0' onMouseOver={()=>{
          setPikaAnimation(2)
      }}
      onMouseLeave={()=>{
          setPikaAnimation(1)
      }}
      >
      <Canvas style={{width:'50vw',height:'90vh'}}>
      <Pikachu/>
      <Environment preset='warehouse'/>
    </Canvas>
      </div>
      {
    !doubt && <HeroText />
      }
      {
        doubt && <GenAi/>
      }
    </div>
    </>
  )
}

export default ResourcesHero
