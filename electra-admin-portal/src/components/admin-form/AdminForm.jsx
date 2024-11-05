'use client'

import { AdminStore } from "@/app/store/AdminStore";
import { useRouter } from "next/navigation";
import { useContext, useRef } from "react";
import dotenv from 'dotenv'
dotenv.config();
const AdminForm = () => {
    const {checkAdmin}=useContext(AdminStore)
    const userRef=useRef();
    const passwordRef=useRef();
    const router=useRouter()
  return (
    <div className='h-screen w-screen flex justify-center items-center'>
         
    <div className="flex flex-col text-white justify-center items-center gap-4 border p-2 rounded-lg">
    <div className="font-bold text-xl">Admin Login</div>
    <div>
    <label htmlFor="userName" >User Name:</label>
      <input type="text" ref={userRef} className="bg-slate-700 p-1 rounded-xl m-2"/>
    </div>
    <div>
    <label htmlFor="userName">Password:</label>
      <input type="password" ref={passwordRef} className="bg-slate-700 p-1 rounded-xl m-2"/>
    </div>
    <div>
    <button className="bg-green-500 p-1 rounded-lg px-2 font-bold" onClick={()=>{
        if(checkAdmin(userRef.current.value,passwordRef.current.value)){
            router.push('/')
        }else{
            router.push('/pages/admin')
        }

      }}>Submit</button>
    </div>
    </div>
    </div>
  )
}

export default AdminForm
