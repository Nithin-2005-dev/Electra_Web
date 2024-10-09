'use client'
import Link from 'next/link'
import React, { useContext } from 'react'
import { RiBook2Fill } from 'react-icons/ri'
import ResourceCard from '../ui/ResourceCard'
import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import Pikachu from '../3d-models/Pikachu/Pikachu'
import { AnimationStore } from '@/app/store/AnimationStore'

const SemesterResources = ({semester}) => {
  const {setPikaAnimation}=useContext(AnimationStore)
    const items=[{
        name:'Books',
        category:'books'
    },{
        name:'Notes',
        category:'notes'
    },{
        name:'Previous year papers',
        category:'pyqs'
    },{
        name:'Assignments',
        category:'assignments'
    }]
  return (
    <div>
      <Link
        href={"/Resources"}
        className="bg-fuchsia-500 text-white absolute top-0 m-3 p-2 rounded-xl font-bold drop-shadow-[0rem_0rem_0.5rem_rgba(50,250,250,0.5)] text-xl sm:3xl hover:scale-125"
      >
        <RiBook2Fill />
      </Link>
      <div className='flex justify-center flex-col gap-3 absolute h-[90vh] p-2 mx-3 items-center w-1/2'> 
      {items.map((item)=>{
       return <Link href={`/Resources/Categories/${semester}|${item.category}`} className='w-full' key={item.name}><ResourceCard item={item} /></Link>
      })}
      </div>
      <div className='fixed right-0' onMouseOver={()=>{
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
    </div>
  )
}

export default SemesterResources
