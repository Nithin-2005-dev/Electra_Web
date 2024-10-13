import React from 'react'
import {data} from '@/app/utils/teamUploadData'
import Link from 'next/link'
const page = () => {
  return (
    <>
    <h2 className='text-white font-black text-center text-xl p-2 '>Team details uploading page</h2>
    <div className='flex h-[90vh] justify-center items-center'>
    <div className='flex flex-col gap-3'>
    {
      data.map((ele)=>{
        return <Link href={`/pages/uploadTeam/${ele.preset}/${ele.name}`} className='bg-slate-800 text-center px-3 p-1 rounded-xl font-bold hover:opacity-80 hover:scale-110 text-white' key={ele.name}>
          {ele.name}
        </Link>
      })
    }
    </div>
    </div>
    </>
  )
}

export default page
