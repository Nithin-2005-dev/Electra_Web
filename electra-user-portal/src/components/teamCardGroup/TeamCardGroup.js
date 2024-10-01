'use client'
import React from 'react'
import {motion} from 'framer-motion'
import { Card, CardBody, CardHeader, CardLink } from 'react-bootstrap';
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import TeamCard from '../TeamCard/TeamCard';
const TeamCardGroup= () => {
    const teamDetails=[1,2,3,4,5,6,7,8];
  return (
    <motion.div className='flex flex-wrap justify-center items-center relative p-3'>
    {
        teamDetails.map((ele)=>{
            return <TeamCard ele={ele} key={ele}/>
        })
    }
    </motion.div>
  )
}

export default TeamCardGroup
