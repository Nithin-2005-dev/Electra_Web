'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { PillarsData } from '@/app/utils/pillars'
import styles from '../../app/styles/About.module.css'
const AboutUs = () => {
  return (
    <div id='about'>
      <motion.div className='text-5xl font-bold m-2 border-b-4 inline-block border-yellow-400 mx-4' initial={{y:-10,opacity:0}} whileInView={{y:0,opacity:1,transition:{duration:2}}}>About Us</motion.div>
      <div className='p-4 font-serif font-medium text-blue-50'>{
      `The Electrical Engineering department of NIT Silchar is one of the finest and well-equipped electrical departments of the North-East region. Ever since its inception, it has been one of the most acclaimed branches in fields of academics as well as co curricular activities that help bring out the best of its students' traits. We at NIT Silchar have an age-old tradition of forming a society under each and every department of it so that it bridges the gap between the juniors and seniors and also serves as a mode of representation for the entire department.So, just like every department, the Electrical Engineering department too has its society under the name, 'Electra Society' that caters to all the academic and co-curricular persona of the branch.`}
      </div>
      <motion.div className={`text-4xl text-fuchsia-300 font-semibold inline-block [text-shadow:_0_0_2rem_rgb(99_102_241_/_0.8)] px-4`} initial={{y:-10,opacity:0}} whileInView={{y:0,opacity:1,transition:{duration:2}}}>Pillars of electra society</motion.div>
      <div className='border-2 m-3 lg:m-5 rounded-3xl border-red-300'>
      {
        PillarsData.map((pillar)=>{
            return <><div key={pillar.name} className='flex m-1 md:m-3 lg:m-4 flex-col items-center p-1 lg:p-4 gap-5 text-center'>
            <div>
            <div className='flex flex-col'>
            <div className='text-2xl font-black justify-center font-serif text-red-300'>{pillar.post}</div>
            <img src={pillar.image} alt={pillar.name} width={200} style={{borderRadius:'10%'}}/>
            </div>
            <div className='font-bold text-2xl text-fuchsia-200'>{pillar.name}</div>
            </div>
                <div className={`text-left ${styles['edu-au-vic-wa-nt-guide ']} text-blue-100 font-semibold text-xs lg:text-lg`}>{pillar.Info}</div>
            </div>
            <hr className='mx-3 border-3 border-white'/>
            </>
        })
    }
      </div>
    </div>
  )
}

export default AboutUs
