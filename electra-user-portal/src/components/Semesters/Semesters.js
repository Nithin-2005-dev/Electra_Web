'use client'
import React, { useContext } from 'react'
import {motion} from 'framer-motion'
import { Card, CardImg } from 'react-bootstrap'
import { AnimationStore } from '@/app/store/AnimationStore'
import Link from 'next/link'
import { ResourceStore } from '@/app/store/ResourceStore'
const Semesters = () => {
  const {doubt,setDoubt}=useContext(ResourceStore);
  const {setPikaAnimation}=useContext(AnimationStore)
    const images=['https://res.cloudinary.com/dqa3ov76r/image/upload/v1729626099/favoritePhotos/gambjxx3fsep5jqfpmr1.png','https://res.cloudinary.com/dqa3ov76r/image/upload/v1729626098/favoritePhotos/jbiuw5dit5a17lyjnxsi.png','https://res.cloudinary.com/dqa3ov76r/image/upload/v1729626098/favoritePhotos/curolj2uoo2w8uoejazf.png','https://res.cloudinary.com/dqa3ov76r/image/upload/v1729626099/favoritePhotos/pqxguvsapcx3dkbutaev.png','https://res.cloudinary.com/dqa3ov76r/image/upload/v1729626099/favoritePhotos/dmo66pymqhtmwh29xjec.png','https://res.cloudinary.com/dqa3ov76r/image/upload/v1729626098/favoritePhotos/znb84ao2drpezh8hquk4.png','https://res.cloudinary.com/dqa3ov76r/image/upload/v1729626098/favoritePhotos/okfgkso1wuxiuohtabg7.png','https://res.cloudinary.com/dqa3ov76r/image/upload/v1729626098/favoritePhotos/inqjtg1epkmnyyg1dfsk.png']
  return (
    <section className={`sm:blur-0 ${!doubt?'blur-none': 'blur-sm'}`} onMouseOver={()=>{
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
      <motion.h2 className='text-2xl lg:text-5xl font-bold m-2 border-b-4 inline-block border-yellow-400 mx-4' initial={{y:-10,opacity:0}} whileInView={{y:0,opacity:1,transition:{duration:2}} }>Semesters</motion.h2>
      <div className='w-[55vw] xl:w-[40vw] flex flex-wrap'>
      {
            images.map((image,i)=>{
              return   <Link href={`/Resources/semester${i+1}`} key={i}><Card.Img src={image} className='resource-res inline-block m-3 cursor-pointer hover:scale-110 w-[16vw] xl:w-[15vw]' /></Link>
            })
        }
      </div>
    </section>
  )
}
export default Semesters
