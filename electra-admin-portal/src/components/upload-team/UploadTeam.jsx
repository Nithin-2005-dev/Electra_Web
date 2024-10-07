'use client'
import React, { useRef } from 'react'
import { CldUploadWidget } from 'next-cloudinary'
import axios from 'axios'
const UploadTeam = ({preset,team}) => {
  const teamData=["president","vice president","general secretary","assistant general seceretary","technical head","social media management head","marketing head","content head","design head","event management head","executive head","cultural head","technical team","executive team"]
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
    }catch(err){
      console.log(err);
    }
  }
  return (
    <div>
      <div>
        <label htmlFor="name">name</label>
        <input type="text" placeholder='enter team member name' ref={nameRef}/>
      </div>
      <div>
        <label htmlFor="year">year</label>
        <input type="text" placeholder='enter year' ref={yearRef}/>
      </div> 
      <p>note:if year is 2023-2024,enter 2023</p>
      <div>
        <label htmlFor="position">position</label>
        <select name="" id="" ref={positionRef}>
        {
          teamData.map((team)=>{
         return <option value={team} key={team}>{team}</option>
          })
        }
        </select>
      </div> <div>
        <label htmlFor="instaLink">enter instagram link(optional)</label>
        <input type="text" placeholder='enter insta link here' ref={instaRef}/>
      </div> <div>
        <label htmlFor="fbLink">enter facebook link(optional)</label>
        <input type="text" placeholder='enter fb link here' ref={fbRef}/>
      </div>
      <div>
        <label htmlFor="linkdinLink">enter linkdin link(optional)</label>
        <input type="text" placeholder='enter linkdin link here'ref={linkdinRef} />
      </div>
      <div>
      <CldUploadWidget uploadPreset={`${preset}`} onSuccess={handleUpload}>
          {({ open }) => {
            return <button onClick={() => open()}>Upload an image to send data</button>;
          }}
        </CldUploadWidget>
      </div>
    </div>
  )
}

export default UploadTeam
