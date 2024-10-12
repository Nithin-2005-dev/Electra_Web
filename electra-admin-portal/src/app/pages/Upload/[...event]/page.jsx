'use client'
import UploadImage from '../../../../components/image-upload/UploadImage'
import { useEffect, useRef} from "react"
const page = ({params}) => {
  return (
   <>
    <UploadImage preset={params.event[0]}/>
   </>
  )
}

export default page
