'use client'
import { Canvas } from '@react-three/fiber'
import React, { useContext } from 'react'
import Pikachu from '../3d-models/Pikachu/Pikachu'
import { Environment } from '@react-three/drei'
import { RiBook2Fill } from 'react-icons/ri'
import Link from 'next/link'
import { SubjectData } from '@/app/utils/Subjects'
import { AnimationStore } from '@/app/store/AnimationStore'
import ResourceCard from '../ui/ResourceCard'
const SemesterResourcesSubjects = ({semester,category}) => {
    const subjects=SubjectData[+semester-1]
    const {setPikaAnimation}=useContext(AnimationStore)
  return (
    <div>
      <div >
      <Link
        href={"/Resources"}
        className="bg-fuchsia-500 text-white absolute top-0 m-3 p-2 rounded-xl font-bold drop-shadow-[0rem_0rem_0.5rem_rgba(50,250,250,0.5)] text-xl sm:3xl hover:scale-125"
      >
        <RiBook2Fill />
      </Link>
      <div 
      className='flex flex-col absolute left-0 w-1/2 justify-center gap-3 m-2 lg:m-5 p-2 min-h-[70vh] items-center'> 
       <h3 className='text-center capitalize font-mono font-bold text-2xl lg:text-3xl'>Subjects</h3>
      {subjects.map((item)=>{
       return <Link href={`/Resources/Categories/${semester}|${category}|${item.subjectCode}`} className='w-full' key={item.subjectCode}><ResourceCard item={item.subject} /></Link>
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
    </div>
  )
}

export default SemesterResourcesSubjects
