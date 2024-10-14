import { UserProfile } from '@clerk/nextjs'
import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';
import React from 'react'

const Profile = async() => {
        const {userId}=auth();
        const isAuth=!!userId;
        const user=await currentUser();
        if(!isAuth){
            redirect('/');
        }
  return (
    <>
    <h2 className='text-center font-black p-2 text-xl'>Profile Details</h2>
    <div className='flex justify-center absolute top-[10vh] right-[10vw] sm:top-[15vh] sm:right-[20vw]'>
      <UserProfile 
    appearance={
      {
        elements:{
          cardBox:'w-[80vw] h-[80vh]  border-0 sm:w-[60vw] sm:h-[70vh] bg-slate-950',
          header:'hidden'
        }
      }
    }
      />
    </div>
    </>
  )
}

export default Profile
