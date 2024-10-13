"use client";
import {ImageUploadData} from '../../utils/imageUploadData'
import Link from 'next/link';
export default function Upload() {
  return (
    <>
    <h2 className='text-white capitalize text-center font-black text-xl p-1'>Gallery Images Upoading Page</h2>

    <div className='flex w-screen h-[90vh] justify-center items-center'>
    <div className='flex flex-col'>
        {
            ImageUploadData.map((ele)=>{
               return <Link className=' inline-block m-2 text-center text-white font-bold bg-slate-800 px-4 p-1 rounded-xl hover:opacity-80 hover:scale-110' href={`/pages/Upload/${ele.preset}|${ele.event}`} key={ele.preset}>{ele.event}</Link>
            })
        }
    </div>
    </div>
    </>
  );
}