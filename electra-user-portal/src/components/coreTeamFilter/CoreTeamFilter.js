'use client'
import styles from '../../app/styles/CoreTeam.module.css'
import React from 'react'
const CoreTeamFilter = () => {
  return (
    <div className='m-3'>
      <div className={`text-center text-3xl text-fuchsia-400 [text-shadow:_0_0rem_1rem_rgb(99_102_255_/_0.8)] ${styles['permanent-marker-regular']}`}>Meet Our Team</div>
      <div className='flex justify-end my-2'>
        <select name="" id="" className='bg-blue-400 rounded-xl hover:opacity-80 lg:p-2 lg:px-3 md:p-3 md:px-3 sm:p-3 sm:px-3 p-0.5 px-0.5 m-2 font-bold text-sm'>
            <option value="" className='bg-slate-500'>2023-2024</option>
            <option value="" className='bg-slate-500'>2022-2023</option><option value="" className='bg-slate-500'>2021-2022</option><option value="" className='bg-slate-500'>2020-2021</option><option value="" className='bg-slate-500'>2019-2020</option>
        </select>
        <select name="" id="" className='bg-blue-400 rounded-xl hover:opacity-80 lg:p-2 lg:px-3 md:p-3 md:px-3 sm:p-3 sm:px-3 p-0.5 px-0.5 m-2 font-bold text-sm'>
            <option value="" className='bg-slate-500'>Tech</option>
            <option value="" className='bg-slate-500'>Social</option><option value="" className='bg-slate-500'>Content</option><option value="" className='bg-slate-500'>Design</option><option value="" className='bg-slate-500'>Marketing</option>
        </select>
      </div>
    </div>
  )
}

export default CoreTeamFilter
