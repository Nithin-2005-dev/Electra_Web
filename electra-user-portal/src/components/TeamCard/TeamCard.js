'use client'
import React, { useState } from 'react'
import { Card, CardBody, CardHeader, CardLink } from 'react-bootstrap'
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
const TeamCard = ({ele}) => {
    const [hover,setHover]=useState(false);
  return (
    <div onMouseOver={()=>{
        setHover(true)
      }} onMouseLeave={()=>{
        setHover(false)
      }}  onTouchStart={()=>{
        setHover(true)
      }} onTouchEnd={()=>{
        setHover(false)
      }} className='flex'>
      <Card className='w-[70vw] lg:w-[30vw] sm:w-[40vw] m-2 bg-transparent border-white' key={ele} >
        <CardHeader className={`text-center font-bold md:text-xl lg:text-2xl text-white ${hover ?'text-4xl relative top-[40%] z-20':'text-lg'} hover:underline`}>
        position
        </CardHeader>
        <div className={`${hover && 'blur-sm'}`}>
        <Card.Img src='https://images.pexels.com/photos/35537/child-children-girl-happy.jpg?auto=compress&cs=tinysrgb&w=600'>
        </Card.Img>
        </div>
        <CardBody className={`text-center font-bold md:text-xl lg:text-2xl text-white ${hover ?'text-4xl relative bottom-[50%] z-20':'text-lg'} hover:underline`}>
            Name
        </CardBody>
        <CardLink className={`flex justify-evenly mx-2 text-3xl pb-2 ${hover && 'relative bottom-[30%]'}`}>
        <FaInstagram className='text-[#FCAF45] hover:scale-110'/>
        <FaFacebook className='text-[#4267B2] hover:scale-110'/>
        <FaLinkedin className='text-[#0077B5] hover:scale-110' />
        <FaTwitter className='text-[#1DA1F2] hover:scale-110'/>
        </CardLink>
      </Card>
    </div>
  )
}

export default TeamCard
