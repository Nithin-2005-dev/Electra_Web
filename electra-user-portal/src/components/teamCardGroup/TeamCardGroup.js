'use client'
import React, { useContext, useEffect, useState } from 'react'
import {motion} from 'framer-motion'
import { Card, CardBody, CardHeader, CardLink } from 'react-bootstrap';
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import TeamCard from '../TeamCard/TeamCard';
import { TeamStore } from '@/app/store/TeamStore';
const TeamCardGroup= () => {
  const {team}=useContext(TeamStore)
  return (
    <motion.div className='flex flex-wrap justify-center items-center relative p-5 gap-3'>
    {
        team.length>0 && team.map((ele)=>{
            return <TeamCard ele={ele} key={ele._id}/>
        })
    }
    </motion.div>
  )
}

export default TeamCardGroup
