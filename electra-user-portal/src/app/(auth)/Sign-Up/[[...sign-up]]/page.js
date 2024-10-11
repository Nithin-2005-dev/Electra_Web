'use client'
import { SignUp } from '@clerk/clerk-react'
import React from 'react'
import {experimental_createTheme} from '@clerk/themes'
import Link from 'next/link'
import { IoHome } from 'react-icons/io5'
const Sign = () => {
  return (
    <>
       <h2 className="text-center p-3 font-black text-xl text-sky-200 [text-shadow:_0rem_0.3rem_0.3rem_rgb(99_102_241_/_0.8)] lg:text-3xl sm:text-2xl">
        Join Our Community
      </h2>
      <Link
        href={"/"}
        className="bg-fuchsia-500 text-white absolute top-0 m-3 p-2 rounded-xl font-bold drop-shadow-[0rem_0rem_0.5rem_rgba(50,250,250,0.5)] text-xl sm:3xl hover:scale-125"
      >
        <IoHome />
      </Link>
    <div className='flex flex-col justify-center items-center h-[88vh]'>
    {/* <SignUp/> */}
    <div className=''>
    <SignUp appearance={{
              elements: {
                // header:'hidden',
               footer:'hidden',
               headerTitle:'text-white',
               card:'p-2 px-3',
               formFieldLabel:'text-white'
              },
            }}/>
             <div className='flex already justify-end p-2'>
      <p>{`Already have an account?`}</p>
      <Link href={'/sign-in'} className='text-blue-400 underline px-2'>sign-in</Link>
    </div>
    </div>
    </div>
    </>
  )
}

export default Sign
