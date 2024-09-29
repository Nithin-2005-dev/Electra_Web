'use client'
import React from 'react'
import {motion} from 'framer-motion'
import { Card, CardBody, CardHeader, CardLink } from 'react-bootstrap'
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
const TeamCard = () => {
    const teamDetails=[1,2,3,4,5,6,7,8]
  return (
    <div className='flex flex-wrap justify-center items-center'>
    {
        teamDetails.map(()=>{
            return  <Card className='w-[25vw] lg:w-[20vw] m-2 bg-transparent border-white'>
        <CardHeader className='text-center font-bold text-sm md:text-lg lg:text-xl text-white px-2'>
        position
        </CardHeader>
        <Card.Img src='https://images.pexels.com/photos/35537/child-children-girl-happy.jpg?auto=compress&cs=tinysrgb&w=600'></Card.Img>
        <CardBody className='text-center font-bold text-sm md:text-lg lg:text-xl text-white '>
            Name
        </CardBody>
        <CardLink className='flex justify-evenly mx-2 text-sm md:text-lg lg:text-xl pb-2'>
        <FaInstagram className='text-[#FCAF45]'/>
        <FaFacebook className='text-[#4267B2]'/>
        <FaLinkedin className='text-[#0077B5]' />
        <FaTwitter className='text-[#1DA1F2]'/>
        </CardLink>
      </Card>
        })
    }
    </div>
  )
}

export default TeamCard
