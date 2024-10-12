'use client'
import axios from 'axios';
import React, { useRef } from 'react'
import 'react-toastify/dist/ReactToastify.css';
import { Bounce, toast, ToastContainer } from 'react-toastify';
const ResourcceBlock = () => {
    const linkRef=useRef();
    const semRef=useRef();
    const subRef=useRef();
    const catRef=useRef();
    const nameRef=useRef();
    const submitHandler=async()=>{
      if(linkRef.current.value==''||semRef.current.value==''||subRef.current.value==''||catRef.current.value==''||nameRef.current.value==''){
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
          return;
      }
        try{
        const response= await axios.post('/api/res-upload',{driveUrl:linkRef.current.value,semester:semRef.current.value,subject:subRef.current.value,category:catRef.current.value,name:nameRef.current.value})
        console.log(response);
        linkRef.current.value='';semRef.current.value='';subRef.current.value='';catRef.current.value='';nameRef.current.value=''
        toast.success('resource uploaded sucessfully', {
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
            console.log(err);
            toast.success(err.message, {
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
    <div>
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
    <h2 className='text-white font-black text-xl text-center p-3'>Resources Upload details</h2>
    <div className='h-[90vh] flex justify-center items-center'>
    <div className='flex flex-col bg-slate-900 p-5 border rounded-xl gap-3'>
      <div className='flex flex-col'>
        <label htmlFor="driveLink" className='text-white'>Pdf Link</label>
        <input type="text" placeholder='enter drive link here' ref={linkRef} className='bg-slate-700 px-2 p-1 rounded-lg text-white'/>
      </div>
      <div className='flex flex-col'>
        <label htmlFor="name" className='text-white'>name</label>
        <input type="text" placeholder='enter resource name' ref={nameRef} className='bg-slate-700 px-2 p-1 rounded-lg text-white'/>
      </div>
      <div className='flex flex-col'>
        <label htmlFor="semester" className='text-white'>semester</label>
        <input type="number" placeholder='enter semester' ref={semRef} className='bg-slate-700 px-2 p-1 rounded-lg text-white'/>
      </div>
      <div className='flex flex-col'>
        <label htmlFor="subject" className='text-white'>subject</label>
        <input type="text" placeholder='enter Subject' ref={subRef} className='bg-slate-700 px-2 p-1 rounded-lg text-white'/>
      </div>
      <div className='flex flex-col'>
        <label htmlFor="category" className='text-white'>category</label>
        <input type="text" placeholder='enter category' ref={catRef} className='bg-slate-700 px-2 p-1 rounded-lg text-white'/>
      </div>
      <button onClick={submitHandler} className='text-white bg-green-600 rounded-lg hover:opacity-80 hover:scale-110'>Submit</button>
    </div>
    </div>
    </div>
  )
}

export default ResourcceBlock
