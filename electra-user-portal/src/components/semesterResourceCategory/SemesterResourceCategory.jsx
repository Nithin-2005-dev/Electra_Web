'use client'
import { ResourceStore } from '@/app/store/ResourceStore'
import React, { useContext, useEffect, useState } from 'react'
import PdfDialog from '../pdfDialog/PdfDialog'
import { Canvas } from '@react-three/fiber'
import Pikachu from '../3d-models/Pikachu/Pikachu'
import { Environment } from '@react-three/drei'
import { AnimationStore } from '@/app/store/AnimationStore'
import Link from 'next/link'
import { RiBook2Fill } from 'react-icons/ri'
import { useMotionValueEvent, useScroll } from 'framer-motion'
import ResLoader from '../ui/ResLoader'
import NoRes from '../ui/NoRes'
const SemesterResourceCategory = ({semester,category,code}) => {
  const {sem,resLoad}=useContext(ResourceStore);
  const {setPikaAnimation}=useContext(AnimationStore)
  const { scrollY } = useScroll()
useMotionValueEvent(scrollY, "change", (latest) => {
  setPikaAnimation(0)
})
    const {getResources,setData,data}=useContext(ResourceStore)
    const [subjectData,setSubjectData]=useState([])
    useEffect(()=>{
        getResources(semester,category)
    },[])
    let subData=data?.filter((ele)=>{
        return ele.subject==code;
    })
    if(code=='all'){
      subData=data;
    }
  return (
    <>
    <Link
        href={"/Resources"}
        className="bg-fuchsia-500 text-white absolute top-0 m-3 p-2 rounded-xl font-bold drop-shadow-[0rem_0rem_0.5rem_rgba(50,250,250,0.5)] text-xl sm:3xl hover:scale-125"
      >
        <RiBook2Fill />
      </Link>
    {resLoad ?<ResLoader/>:!subData.length>0?<NoRes/>: <>

{<> <div 
    onMouseOver={()=>{
          setPikaAnimation(1)

      }}
      onMouseLeave={()=>{
          setPikaAnimation(2)
      }}
      onTouchStart={()=>{
          setPikaAnimation(1)
      }}
      onTouchEnd={()=>{
          setPikaAnimation(2)
      }}
     className='flex flex-col absolute left-0 w-1/2 justify-center gap-3 m-2 lg:m-5 p-2 min-h-[50vh]'>
    <h3 className='text-center capitalize font-mono font-bold text-2xl lg:text-3xl'>{category}<p className='uppercase inline-block'>({code})</p></h3>
  { subData.length>0 && subData.map((ele)=>{
        return <div key={ele._id} className='' >
        <div className='flex justify-between gap-4 p-2 px-3 lg:px-6 bg-slate-900 shadow-xl shadow-slate-900 items-center rounded-xl border-1'>
        <div className='text-white self-center text-left content-center text-xs sm:text-base lg:text-lg'>{ele.name}</div>
        <PdfDialog link={ele.driveUrl}/>
        </div>
        </div>
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
      </>}
    </>}
    </>
  )
}
export default SemesterResourceCategory
