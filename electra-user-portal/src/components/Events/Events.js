'use client'
import { EventData } from '@/app/utils/eventData';
import React, { useRef } from 'react'
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import styles from '../../app/styles/Events.module.css'
import { Button } from '../ui/button';
import { useInView } from 'react-intersection-observer';
const Events = () => {
  return (
    <>
        <div className='text-5xl font-bold m-2 border-b-4 inline-block border-yellow-400 '>Events</div>
        <VerticalTimeline lineColor='white'>
        {
          EventData.map((event)=>{

            return <VerticalTimelineElement key={event.title} visible={true} contentStyle={{ background:'#3282B8', color: '#fff' }} icon={event.icon}
            iconStyle={{background:'#3282B8',color:'white'}} contentArrowStyle={{ borderRight: '7px solid  #3282BB'}} intersectionObserverProps={
              {
                
              }
            }
            >
                <div className={`text-yellow-500 font-semibold text-2xl ${styles['sofadi-one-regular']} text-center ${styles['title-shadow']}`}>{event.title}</div>
                <div className={`text-[#bed3de] font-mono ${styles['space-grotesk']} ${styles['dec-shadow']}`}>{event.description}</div>
                <div className='flex justify-between mt-2'>
                <Button className={`bg-[#0F4C75] rounded-xl hover:opacity-80 hover:bg-[#0F4C75] ${styles['hvr-float-shadow']} font-bold px-4 ${styles['card-button']}`}>Know More</Button>
                <Button className={`bg-[#0F4C75] rounded-xl hover:opacity-80 hover:bg-[#0F4C75] ${styles['hvr-float-shadow']} font-bold px-4 ${styles['card-button']}`}>Register</Button>
                </div>
              </VerticalTimelineElement>
          })
        }
        </VerticalTimeline>
    </>
  )
}

export default Events