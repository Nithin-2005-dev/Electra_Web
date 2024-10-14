'use client'
import React, { useContext, useEffect, useRef, useState } from 'react'
import styles from '../../app/styles/GenAi.module.css'
import { FaArrowCircleUp } from "react-icons/fa";
import { askApi, genAi } from '@/app/external_apis/genAi';
import Card from 'react-bootstrap/Card';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaRegCircleQuestion } from "react-icons/fa6";
import { FaCopy } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { AnimationStore } from '@/app/store/AnimationStore';
const GenAi = () => {
  const {setPikaAnimation}=useContext(AnimationStore)
    const queryRef=useRef();
    const [response,setResponse]=useState('')
    const handleQuery=async()=>{
      try{
        const text=queryRef.current.value;
        setResponse('Wait we will be back soon...')
        if(text==''){
            return
        }else{
         setResponse(await askApi(text))
        queryRef.current.value='';
        }
      }catch(err){
        setResponse('something went wrong!! please try again')
      }
    }
  return (
    <div className='sm:absolute top-[20vh] right-[12.5vw]  h-[60vh] lg:h-[90vh] w-[75vw] lg:w-[45vw] z-30 fixed sm:w-[50vw] sm:top-[10vh] sm:left-3' onMouseOver={()=>{
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
    <ToastContainer
position="top-right"
autoClose={5000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="dark"
/>
      <div className='flex flex-col'>
      <Card body className='h-[60vh] lg:h-[65vh]  overflow-hidden overflow-y-scroll bg-slate-700 my-2 rounded-2xl text-white' id='res' >
      {response==''?'Ask Questions related to your subjects ':response}
      </Card>
      <div className='flex flex-wrap items-center'>
      <input type="text" placeholder="Type your doubt Here" className='w-full rounded-xl p-2 text-black' ref={queryRef}/>
      </div>
         <div className='flex m-2 my-3 justify-between '>
            <button className={`${styles['hvr-ripple-in']} bg-red-500 p-1 px-2 lg:px-3 font-bold rounded-xl text-xs lg:text-base`}
            onClick={()=>{
                setResponse('')
            }}
            >clear<MdDeleteForever className='inline-block m-1'/></button>
            <button className={`${styles['hvr-ripple-in']} bg-green-500 p-1 px-2 lg:px-3 font-bold rounded-xl text-xs lg:text-base`} onClick={handleQuery}>Ask<FaRegCircleQuestion className='inline-block m-1'/></button>
            <button className={`${styles['hvr-ripple-in']} bg-blue-500 p-1 px-2 lg:px-3 font-bold rounded-xl text-xs lg:text-base`} onClick={()=>{
                navigator.clipboard.writeText(document.getElementById('res').innerText);
                toast.success('copied!', {
position: "top-right",
autoClose: 5000,
hideProgressBar: false,
closeOnClick: true,
pauseOnHover: true,
draggable: true,
progress: undefined,
theme: "dark",
transition: Bounce,
});
            }}>copy<FaCopy className='inline-block m-1'/></button>
         </div>
      </div>
    </div>
  )
}
export default GenAi
