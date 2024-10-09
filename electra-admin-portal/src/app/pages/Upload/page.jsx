"use client";
import {ImageUploadData} from '../../utils/imageUploadData'
import Link from 'next/link';
export default function Upload() {
  return (
    <div className='flex flex-col'>
        {
            ImageUploadData.map((ele)=>{
               return <Link className='bg-blue-300 inline-block m-2' href={`/pages/Upload/${ele.preset}`} key={ele.preset}>{ele.event}</Link>
            })
        }
    </div>
  );
}