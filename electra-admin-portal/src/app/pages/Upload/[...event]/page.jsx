'use client'
import UploadImage from '../../../../components/image-upload/UploadImage'
import { useEffect, useRef} from "react"
const page = ({params}) => {
  const utils=params.event[0].split('%7C');
  return (
   <>
    <UploadImage preset={utils[0]} event={utils[1].split('%20').join(' ')}/>
   </>
  )
}

export default page
