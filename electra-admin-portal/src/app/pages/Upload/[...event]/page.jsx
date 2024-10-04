'use client'
import { CldUploadWidget } from "next-cloudinary"
import UploadImage from '../../../../components/image-upload/UploadImage'
import { useRef, useState } from "react"
const page = ({params}) => {
    const yearRef=useRef();
  return (
   <>
   <label htmlFor="year">Year</label>
    <input type="number" ref={useRef()}/>
    <UploadImage preset={params.event[0]} year={yearRef}/>
   </>
  )
}

export default page
