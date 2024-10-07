import React from 'react'
import UploadTeam from '../../../components/upload-team/UploadTeam'
import {data} from '@/app/utils/teamUploadData'
import Link from 'next/link'
const page = () => {
  return (
    <div className='flex flex-col gap-3'>
    {
      data.map((ele)=>{
        return <Link href={`/pages/uploadTeam/${ele.preset}/${ele.name}`} className='bg-blue-400 text-white'>
          {ele.name}
        </Link>
      })
    }
    </div>
  )
}

export default page
