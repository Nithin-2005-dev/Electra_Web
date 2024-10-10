'use client'
import { EventData } from '@/app/utils/knowMoreData';
import React, { useRef, useState } from 'react'
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import styles from '../../app/styles/Events.module.css'
import { Button } from '../ui/button';
import { useInView } from 'react-intersection-observer';
import {motion} from 'framer-motion'
import KnowMore from '../knowMore/KnowMore';
const Events = () => {
  const [openMore,setOpenMore]=useState(false);
  const [dataToShow,setData]=useState({});
  return (
    <>
        <motion.div className='text-5xl font-bold m-2 border-b-4 inline-block border-yellow-400 ' initial={{y:-10,opacity:0}} whileInView={{y:0,opacity:1,transition:{duration:2}}}>Events</motion.div>
        <VerticalTimeline lineColor='white'>
        {
          EventData.map((event)=>{

            return <VerticalTimelineElement key={event.title} visible={true} contentStyle={{ background:'#3282B8', color: '#fff' }} icon={event.icon}
            iconStyle={{background:'#3282B8',color:'white'}} contentArrowStyle={{ borderRight: '7px solid  #3282BB'}} intersectionObserverProps={
              {
                
              }
            }
            >
                <div className={`text-yellow-500 font-semibold text-2xl ${styles['sofadi-']} text-center ${styles['title-shadow']}`} style={{fontFamily:'Lucida Sans'}}>{event.title}</div>
                <div className={`text-[#bed3de] font-mono ${styles['space-grotesk']} ${styles['dec-shadow']}`}>{event.description}</div>
                <div className='flex justify-center mt-2'>
                <Button className={`bg-[#0F4C75] rounded-xl hover:opacity-80 hover:bg-[#0F4C75] ${styles['hvr-float-shadow']} font-bold px-4 ${styles['card-button']}`} onClick={()=>{
                  setOpenMore(true)
                  setData(event)
                }}>Know More</Button>
                {/* <Button className={`bg-[#0F4C75] rounded-xl hover:opacity-80 hover:bg-[#0F4C75] ${styles['hvr-float-shadow']} font-bold px-4 ${styles['card-button']}`}>Register</Button> */}
                </div>
              </VerticalTimelineElement>
          })
        }
        </VerticalTimeline>
        <KnowMore openMore={openMore} setOpenMore={setOpenMore} dataToShow={dataToShow}/>
    </>
  )
}

export default Events