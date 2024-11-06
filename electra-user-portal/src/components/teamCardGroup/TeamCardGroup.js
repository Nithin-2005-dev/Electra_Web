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
    return ele.position==='vice president' || ele.position==='assistant general seceretary';
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
   first2?.sort(function(a,b){
    if(a.position>b.position){
        return -1;
    }else if(a.position<b.position){
        return 1;
    }else return 0;
   })
   first?.sort(function(a,b){
    if(a.position>b.position){
        return -1;
    }else if(a.position<b.position){
        return 1;
    }else return 0;
   })
   second?.sort(function(a,b){
    if(a.position>b.position){
        return 1;
    }else if(a.position<b.position){
        return -1;
    }else return 0;
   })
   third?.sort(function(a,b){
    if(a.position>b.position){
        return -1;
    }else if(a.position<b.position){
        return 1;
    }else return 0;
   })
   fourth?.sort(function(a,b){
    if(a.position>b.position){
        return 1;
    }else if(a.position<b.position){
        return -1;
    }else return 0;
   })
  return (
    <section>
    {teamLoad?<TeamLoader/>: <div>
      <motion.div className='flex flex-wrap justify-center sm:justify-evenly items-center relative p-5  gap-3'>
      {
          first.length>0 && first.map((ele)=>{
              return <TeamCard ele={ele} key={ele._id}/>
          })
      }
      </motion.div>
      <hr className='sm:mx-10 mx-5 font-black'/>
      <motion.div className='flex flex-wrap  justify-center sm:justify-evenly items-center relative p-5 gap-3'>
      {
          first2.length>0 && first2.map((ele)=>{
              return <TeamCard ele={ele} key={ele._id}/>
          })
      }
      </motion.div>
      {
        second.length!=0 &&     <>
      <hr  className='sm:mx-10 mx-5 font-black'/>
      <p className=' text-center m-2 text-lg sm:text-2xl font-black'>Heads</p>
      <motion.div className='flex flex-wrap justify-center items-center relative px-5 p-2 gap-3'>
      {
          second.length>0 && second.map((ele)=>{
              return <TeamCard ele={ele} key={ele._id}/>
          })
      }
      </motion.div>
      <hr  className='sm:mx-10 mx-5 font-black'/>
      </>
      }
      {
        third.length!=0 && <>
      <p className=' text-center m-2 text-lg sm:text-2xl font-black'>Technical Team</p>
      <motion.div className='flex flex-wrap justify-center items-center relative px-5 p-2 gap-3'>
      {
          third.length>0 && third.map((ele)=>{
              return <TeamCard ele={ele} key={ele._id}/>
          })
      }
      </motion.div>
      <hr  className='sm:mx-10 mx-5 font-black'/>
      </>
      }
      
      {
        fourth.length!=0 && <>
      <p className=' text-center m-2 text-lg sm:text-2xl font-black'>Executive Team</p>
      <motion.div className='flex flex-wrap justify-center items-center relative px-5 p-2 gap-3'>
      {
          fourth.length>0 && fourth.map((ele)=>{
              return <TeamCard ele={ele} key={ele._id}/>
          })
      }
      </motion.div>
      </>
      }
      </div>}
      </section>
  )
}

export default TeamCardGroup
