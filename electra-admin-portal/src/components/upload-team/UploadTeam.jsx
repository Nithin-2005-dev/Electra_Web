'use client'
import React, { useRef } from 'react'
import { CldUploadWidget } from 'next-cloudinary'
import axios from 'axios'
import { Bounce, toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
const UploadTeam = ({preset,team}) => {
  const teamData=["president","vice president","general secretary","assistant general seceretary","technical head","social media management head","marketing head","content head","design head","event management head","executive head","cultural head","design team","development team","event management team","social media management team","content team","marketing team"];
  const nameRef=useRef();
  const yearRef=useRef();
  let imageRef='';
  const instaRef=useRef();
  const fbRef=useRef();
  const linkdinRef=useRef();
  const positionRef=useRef();
  const handleUpload=async(res)=>{
    try{
      console.log(imageRef)
     await axios.post('/api/uploadTeam',{
        name:nameRef.current.value,year:yearRef.current.value,position:positionRef.current.value,publicId:res.info.public_id,insta:instaRef.current.value,fb:fbRef.current.value,linkdin:linkdinRef.current.value,category:team
      })
      nameRef.current.value='';yearRef.current.value='';positionRef.current.value='';imageRef='';instaRef.current.value='';fbRef.current.value='';linkdinRef.current.value='';
      toast.success('uploaded sucessfully', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce
      });
    }catch(err){
      toast.error(err.message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce
      });
    }
  }
  return (
    <>
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
theme="colored"
/>
    <h2 className='text-white font-black text-xl text-center p-3'>Team Upload details</h2>
    <div className='h-[90vh] flex justify-center items-center'>
    <div className='flex flex-col bg-slate-900 p-3 border rounded-xl gap-3'>
      <div className='flex flex-col'>
        <label htmlFor="name" className='text-white'>name:</label >
        <input type="text" placeholder='enter team member name' ref={nameRef} className='bg-slate-700 px-2 p-1 rounded-lg text-white'/>
      </div>
      <div className='flex flex-col'>
        <label htmlFor="year" className='text-white'>year:</label>
        <input type="text" placeholder='enter year' ref={yearRef} className='bg-slate-700 px-2 p-1 rounded-lg text-white'/>
      </div> 
      <p className='text-slate-400'>note:if year is 2023-2024,enter 2023</p>
      <div className='flex flex-col'>
        <label htmlFor="position" className='text-white' >position:</label>
        <select name="" id="" ref={positionRef} className='bg-slate-700 px-2 p-1 rounded-lg text-white'>
        {
          teamData.map((team)=>{
         return <option value={team} key={team}>{team}</option>
          })
        }
        </select>
      </div> <div className='flex flex-col'>
        <label htmlFor="instaLink" className='text-white'>enter instagram link:(optional)</label>
        <input type="text" placeholder='enter insta link here' ref={instaRef} className='bg-slate-700 px-2 p-1 rounded-lg text-white'/>
      </div> <div className='flex flex-col'>
        <label htmlFor="fbLink" className='text-white'>enter facebook link:(optional)</label>
        <input type="text" placeholder='enter fb link here' ref={fbRef} className='bg-slate-700 px-2 p-1 rounded-lg text-white'/>
      </div>
      <div className='flex flex-col'>
        <label htmlFor="linkdinLink" className='text-white'>enter linkdin link:(optional)</label>
        <input type="text" placeholder='enter linkdin link here'ref={linkdinRef} className='bg-slate-700 px-2 p-1 rounded-lg text-white'/>
      </div>
      <div className='flex flex-col'>
      <CldUploadWidget uploadPreset={`${preset}`} onSuccess={handleUpload}>
          {({ open }) => {
            return <button onClick={() =>{ 
              if(nameRef.current.value==''||yearRef.current.value==''||positionRef.current.value==''){
      toast.warn('please fill all the fields', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce
      });
      return
    }
              open()}} className='text-white bg-green-600 rounded-lg hover:opacity-80 hover:scale-110'>Upload an image to send data</button>;
          }}
        </CldUploadWidget>
      </div>
    </div>
    </div>
    </>
  )
}

export default UploadTeam
