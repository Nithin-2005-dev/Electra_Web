'use client'
import React from 'react'
import styles from '../../app/styles/ImageFilter.module.css'
const ImageFilter = () => {
  return (
    <div className='my-5 mx-3 flex justify-between border-1 p-2 rounded-xl text-xs lg:text-xl font-bold'>
      <div>
        <select name="" id="" className='bg-slate-600 rounded-xl hover:opacity-80 lg:p-2 lg:px-3 md:p-3 md:px-3 sm:p-3 sm:px-3 p-0.5 px-0.5'>
            <option value="" className='bg-slate-500'>2023-2024</option>
            <option value="" className='bg-slate-500'>2022-2023</option><option value="" className='bg-slate-500'>2021-2022</option><option value="" className='bg-slate-500'>2020-2021</option><option value="" className='bg-slate-500'>2019-2020</option>
        </select>
      </div>
      <div className={`${styles['jacquarda-bastarda-9-regular']} text-blue-200 sm:text-lg md:text-2xl lg:text-3xl text-xs`}>Electra Gallery</div>
      <div>
      <select name="" id="" className='bg-slate-600 rounded-xl hover:opacity-80 lg:p-2 lg:px-3 md:p-2 md:px-3 sm:p-3 sm:px-3 p-1 px-1 text-xs lg:text-xl font-bold'>
            <option value="" className='bg-slate-500'>Tech</option>
            <option value="" className='bg-slate-500'>Social</option><option value="" className='bg-slate-500'>Content</option><option value="" className='bg-slate-500'>Design</option><option value="" className='bg-slate-500'>Marketing</option>
        </select>
      </div>
    </div>
  )
}

export default ImageFilter
