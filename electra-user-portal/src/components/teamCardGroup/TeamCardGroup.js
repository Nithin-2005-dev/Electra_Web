'use client'
import React, { useContext, useEffect, useState } from 'react'
import {motion} from 'framer-motion'
import { Card, CardBody, CardHeader, CardLink } from 'react-bootstrap';
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import TeamCard from '../TeamCard/TeamCard';
import TeamLoader from '../ui/TeamLoader';
import { TeamStore } from '@/app/store/TeamStore';
const TeamCardGroup= () => {
  const {team,teamLoad}=useContext(TeamStore)
  const first=team.filter((ele)=>{
   return ele.position==='president' || ele.position==='general secretary';
  })
  const first2=team.filter((ele)=>{
    return ele.position==='vice president' || ele.position==='assistant general secretary';
   })
  const second=team.filter((ele)=>{
    return ele.category==='heads';
   })
   const third=team.filter((ele)=>{
    return ele.category==='technical%20team';
   })
   const fourth=team.filter((ele)=>{
    return ele.category==='executive%20team';
   })
   console.log(team)
  return (
    <>
    {teamLoad?<TeamLoader/>: <div>
      <motion.div className='flex flex-wrap justify-center items-center relative p-5 gap-3'>
      {
          first.length>0 && first.map((ele)=>{
              return <TeamCard ele={ele} key={ele._id}/>
          })
      }
      </motion.div>
      <hr className=''/>
      <motion.div className='flex flex-wrap justify-center items-center relative p-5 gap-3'>
      {
          first2.length>0 && first2.map((ele)=>{
              return <TeamCard ele={ele} key={ele._id}/>
          })
      }
      </motion.div>
      <hr className=''/>
      <motion.div className='flex flex-wrap justify-center items-center relative p-5 gap-3'>
      {
          second.length>0 && second.map((ele)=>{
              return <TeamCard ele={ele} key={ele._id}/>
          })
      }
      </motion.div>
      <hr />
      <motion.div className='flex flex-wrap justify-center items-center relative p-5 gap-3'>
      {
          third.length>0 && third.map((ele)=>{
              return <TeamCard ele={ele} key={ele._id}/>
          })
      }
      </motion.div>
      <hr />
      <motion.div className='flex flex-wrap justify-center items-center relative p-5 gap-3'>
      {
          fourth.length>0 && fourth.map((ele)=>{
              return <TeamCard ele={ele} key={ele._id}/>
          })
      }
      </motion.div>
      </div>}
      </>
  )
}

export default TeamCardGroup
