'use client'
import axios from 'axios';
import React, { useRef } from 'react'
const ResourcceBlock = () => {
    const linkRef=useRef();
    const semRef=useRef();
    const subRef=useRef();
    const catRef=useRef();
    const nameRef=useRef();
    const submitHandler=async()=>{
        try{
        const response= await axios.post('/api/res-upload',{driveUrl:linkRef.current.value,semester:semRef.current.value,subject:subRef.current.value,category:catRef.current.value,name:nameRef.current.value})
        console.log(response);
        linkRef.current.value='';semRef.current.value='';subRef.current.value='';catRef.current.value='';nameRef.current.value=''
        }catch(err){
            console.log(err);
        }
    }
  return (
    <div>
      <div>
        <label htmlFor="driveLink">Pdf Link</label>
        <input type="text" placeholder='enter drive link here' ref={linkRef}/>
      </div>
      <div>
        <label htmlFor="name">name</label>
        <input type="text" placeholder='enter resource name' ref={nameRef}/>
      </div>
      <div>
        <label htmlFor="semester">semester</label>
        <input type="number" placeholder='enter semester' ref={semRef}/>
      </div>
      <div>
        <label htmlFor="subject">subject</label>
        <input type="text" placeholder='enter Subject' ref={subRef}/>
      </div>
      <div>
        <label htmlFor="category">category</label>
        <input type="text" placeholder='enter category' ref={catRef}/>
      </div>
      <button onClick={submitHandler}>Submit</button>
    </div>
  )
}

export default ResourcceBlock
