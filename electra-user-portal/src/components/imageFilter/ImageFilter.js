'use client'
import React, { useContext, useState } from 'react'
import styles from '../../app/styles/ImageFilter.module.css'
import { ImageProvider } from '@/app/store/ImageStore'
const ImageFilter = () => {
  const {setCurrentEventFilter,loading}=useContext(ImageProvider)
  return <>
    {
      !loading &&     <div className='my-5 mx-3 flex border-1 p-2 rounded-xl text-xs lg:text-xl font-bold shadow-xl shadow-slate-800 justify-between'>
      <div className={`${styles['fredoka']} text-blue-200 text-base lg:text-2xl md:text-lg place-self-center`}>Electra Gallery</div>
      <div className='place-self-end'>
      <select name="" id="" className='bg-blue-400 rounded-xl hover:opacity-80 lg:p-2 lg:px-3 md:p-2 md:px-3 sm:p-3 sm:px-3 p-1 px-1 text-xs lg:text-lg font-bold z-[3000]' onChange={(e)=>{
          setCurrentEventFilter(e.target.value)
        }}>
      <option value="all" className='bg-slate-500'>Events</option>
            <option value="udvega" className='bg-slate-500'>Udvega</option>
            {/* <option value="blitzSurge" className='bg-slate-500'>Blitz surge</option> */}
            <option value="powerSurge" className='bg-slate-500'>Power surge</option><option value="electraCup" className='bg-slate-500'>Electra cup</option>
            {/* <option value="electraDevModule" className='bg-slate-500'>Electra dev module</option> */}
            {/* <option value="codesta" className='bg-slate-500'>codesta</option> */}
            <option value="carvaan" className='bg-slate-500'>Carvaan</option>
            <option value="Orientation" className='bg-slate-500'>Orientation</option>
            <option value="Teachers Day" className='bg-slate-500'>Teachers Day</option>
            <option value="Off the Hook" className='bg-slate-500'>Off the hook</option>
        </select>
      </div>
    </div>
    }
    </>
}

export default ImageFilter
