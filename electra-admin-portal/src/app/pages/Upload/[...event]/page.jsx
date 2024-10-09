'use client'
import UploadImage from '../../../../components/image-upload/UploadImage'
import { useRef} from "react"
const page = ({params}) => {
    const yearRef=useRef();
  return (
   <>
   <label htmlFor="year">Year</label>
    <input type="number" ref={yearRef}/>
    <UploadImage preset={params.event[0]} year={yearRef.current.value}/>
   </>
  )
}

export default page
