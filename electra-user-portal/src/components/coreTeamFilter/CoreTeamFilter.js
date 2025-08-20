'use client'
import { TeamStore } from '@/app/store/TeamStore'
import styles from '../../app/styles/CoreTeamFilter.module.css'
import React, { useContext, useEffect, useRef } from 'react'
const CoreTeamFilter = () => {
  const {getTeamByYear} =useContext(TeamStore)
  const yearRef=useRef();
  const handleFilter=()=>{
    getTeamByYear(yearRef.current.value);
  }
  useEffect(()=>{getTeamByYear('2025')},[])
  return (
    <section className={`mx-3 relative top-[6vh] ${styles['heading-res']}`}>
      <h2 className={`text-center text-3xl text-white [text-shadow:_0_0rem_1rem_rgb(99_102_255_/_0.8)] ${styles['fredoka']}`}>Meet Our Team</h2>
      <div className='flex justify-end'>
        <select name="" id="" className='bg-blue-400 rounded-xl hover:opacity-80 lg:p-2 lg:px-3 md:p-3 md:px-3 sm:p-3 sm:px-3 p-1 px-1 m-2 font-bold text-sm z-[3000]' ref={yearRef} onChange={handleFilter}>
         <option value="2025" className='bg-slate-500'>2025-2026</option>
            <option value="2024" className='bg-slate-500'>2024-2025</option>
            <option value="2023" className='bg-slate-500'>2023-2024</option><option value="2022" className='bg-slate-500'>2022-2023</option><option value="2021" className='bg-slate-500'>2021-2022</option><option value="2020" className='bg-slate-500'>2020-2021</option>
            <option value="2019" className='bg-slate-500'>2019-2020</option>
            <option value="2018" className='bg-slate-500'>2018-2019</option>
            <option value="2017" className='bg-slate-500'>2017-2018</option>
        </select>
      </div>
    </section>
  )
}

export default CoreTeamFilter
