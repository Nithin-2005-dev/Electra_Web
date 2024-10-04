"use client";
import { CldImage, CldUploadWidget } from 'next-cloudinary';
import {ImageUploadData} from '../../utils/imageUploadData'
import { useRouter } from 'next/router';
import Link from 'next/link';
export default function Upload() {
  return (
    <div className='flex flex-col'>
        {
            ImageUploadData.map((ele)=>{
               return <Link className='bg-blue-300 inline-block m-2' href={`/pages/Upload/${ele.preset}`}>{ele.event}</Link>
            })
        }
    </div>
  );
}