'use client'
import React, { useState } from 'react'
import styles from '../../app/styles/ImageFilter.module.css'
const ImageFilter = () => {
  const [currentEvent,setCurrentEvent]=useState('all');
  console.log(currentEvent);
  return (
    <div className='my-5 mx-3 flex justify-between border-1 p-2 rounded-xl text-xs lg:text-xl font-bold shadow-xl shadow-slate-800 '>
      <div>
        <select name="" id="" className='bg-slate-600 rounded-xl hover:opacity-80 lg:p-2 lg:px-3 md:p-2 md:px-3 sm:p-3 sm:px-3 p-1 px-1 text-xs lg:text-xl font-bold' onChange={(e)=>{
          setCurrentEvent(e.target.value)
        }}>
        <option value="all" className='bg-slate-500'>Year</option>
            <option value="2024" className='bg-slate-500'>2024</option>
            <option value="2023" className='bg-slate-500'>2023</option><option value="2022" className='bg-slate-500'>2022</option><option value="2021" className='bg-slate-500'>2021</option>
        </select>
      </div>
      <div className={`${styles['permanent-marker-regular']} text-blue-200 text-base lg:text-2xl md:text-lg`}>Electra Gallery</div>
      <div>
      <select name="" id="" className='bg-slate-600 rounded-xl hover:opacity-80 lg:p-2 lg:px-3 md:p-2 md:px-3 sm:p-3 sm:px-3 p-1 px-1 text-xs lg:text-xl font-bold'>
      <option value="all" className='bg-slate-500'>Event</option>
            <option value="udvega" className='bg-slate-500'>Udvega</option>
            <option value="blitzSurge" className='bg-slate-500'>Blitz surge</option><option value="powerSurge" className='bg-slate-500'>Power surge</option><option value="electraCup" className='bg-slate-500'>Electra cup</option>
            <option value="electraDevModule" className='bg-slate-500'>Electra dev module</option>
            <option value="codesta" className='bg-slate-500'>codesta</option>
            <option value="" className='bg-slate-500'>Carvaan</option>
            <option value="Orientation" className='bg-slate-500'>Orientation</option>
        </select>
      </div>
    </div>
  )
}

export default ImageFilter
