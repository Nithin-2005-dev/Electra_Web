'use client'
import { TeamStore } from '@/app/store/TeamStore'
import styles from '../../app/styles/CoreTeam.module.css'
import React, { useContext, useEffect, useRef } from 'react'
const CoreTeamFilter = () => {
  const {getTeamByYear} =useContext(TeamStore)
  const yearRef=useRef();
  const handleFilter=()=>{
    getTeamByYear(yearRef.current.value);
  }
  useEffect(()=>{getTeamByYear('2023')},[])
  return (
    <div className='m-3 relative top-[6vh]'>
      <div className={`text-center text-3xl text-fuchsia-400 [text-shadow:_0_0rem_1rem_rgb(99_102_255_/_0.8)] ${styles['fredoka']}`}>Meet Our Team</div>
      <div className='flex justify-end my-2'>
        <select name="" id="" className='bg-blue-400 rounded-xl hover:opacity-80 lg:p-2 lg:px-3 md:p-3 md:px-3 sm:p-3 sm:px-3 p-1 px-1 m-2 font-bold text-sm' ref={yearRef} onChange={handleFilter}>
            <option value="2023" className='bg-slate-500'>2023-2024</option>
            <option value="2022" className='bg-slate-500'>2022-2023</option><option value="2021" className='bg-slate-500'>2021-2022</option><option value="2020" className='bg-slate-500'>2020-2021</option><option value="2019" className='bg-slate-500'>2019-2020</option>
        </select>
      </div>
    </div>
  )
}

export default CoreTeamFilter
