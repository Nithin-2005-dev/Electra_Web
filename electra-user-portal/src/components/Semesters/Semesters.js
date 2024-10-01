'use client'
import React, { useContext } from 'react'
import {motion} from 'framer-motion'
import { Card, CardImg } from 'react-bootstrap'
import { AnimationStore } from '@/app/store/AnimationStore'
const Semesters = () => {
  const {setPikaAnimation}=useContext(AnimationStore)
    const images=['https://i.imghippo.com/files/jTaDn1727619118.png','https://i.imghippo.com/files/RugCI1727619153.png','https://i.imghippo.com/files/TDjn01727619225.png','https://i.imghippo.com/files/0VxW11727619247.png','https://i.imghippo.com/files/HhtuQ1727619283.png','https://i.imghippo.com/files/0dr3h1727619307.png','https://i.imghippo.com/files/9qn661727619333.png','https://i.imghippo.com/files/8cj4f1727619416.png']
  return (
    <div onMouseOver={()=>{
        setPikaAnimation(1)
    }}
    onMouseLeave={()=>{
          setPikaAnimation(2)
      }}
      onTouchEnd={()=>{
      setPikaAnimation(1)
  }}
  onTouchStart={()=>{
      setPikaAnimation(2)
  }} 

    >
      <motion.div className='text-2xl lg:text-5xl font-bold m-2 border-b-4 inline-block border-yellow-400 mx-4' initial={{y:-10,opacity:0}} whileInView={{y:0,opacity:1,transition:{duration:2}} }>Semesters</motion.div>
      <div className='w-[55vw]'>
      {
            images.map((image)=>{
              return   <Card.Img src={image} className='resource-res inline-block m-3 cursor-pointer hover:scale-110 w-[20vw] xl:w-[15vw]' key={image}/>
            })
        }
      </div>
    </div>
  )
}
export default Semesters