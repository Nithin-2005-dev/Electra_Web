'use client'
import { ResourceStore } from '@/app/store/ResourceStore'
import React, { useContext, useEffect, useState } from 'react'
import PdfDialog from '../pdfDialog/PdfDialog'

const SemesterResourceCategory = ({semester,category}) => {
    const {getResources,setData,data}=useContext(ResourceStore)
    const [subjectData,setSubjectData]=useState([])
    useEffect(()=>{
        getResources(semester,category)
    },[])
  return (
    <div>
      {data.length>0 && data.map((ele)=>{
        return <div key={ele._id} >
        <p className='text-white'>{ele.subject}</p>
        <PdfDialog link={ele.driveUrl}/>
        </div>
      })}
    </div>
  )
}
export default SemesterResourceCategory
