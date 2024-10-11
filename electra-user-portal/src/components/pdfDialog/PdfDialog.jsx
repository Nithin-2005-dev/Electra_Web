import { Dialog, DialogContent } from '@radix-ui/react-dialog'
import { ImCross } from "react-icons/im";
import { RxCross2 } from "react-icons/rx";
import React, { useState } from 'react'
import { Card } from 'react-bootstrap'
import 'reactjs-popup/dist/index.css';
import { DialogHeader } from '../ui/dialog';
import { FaRegFilePdf } from "react-icons/fa";
import { IoMdEye } from "react-icons/io";
const PdfDialog = ({link}) => {
    const [pdf,setPdf]=useState(false);
  return (
    <div>
    <button onClick={()=>{
        setPdf(true)
    }} className='sm:bg-slate-800 rounded-xl px-2 sm:px-3 hover:scale-110 min-w-3'><p className=' p-1 px-2 text-gray-400 hidden sm:inline-block'>view</p><IoMdEye className='inline-block text-gray-600'/></button>
    <div className='fixed top-[2vh] right-[15vw] lg:right-[25vw] z-[2000]'>
      <Dialog open={pdf} onOpenChange={setPdf} className='bg-black'>
      <DialogContent className={`aspect-auto border-0 w-[70vw] h-[80vh] lg:w-[50vw]`}>
      <DialogHeader>
        <div className='flex justify-end text-3xl text-red-600 font-black cursor-pointer'>
            <RxCross2 onClick={()=>{
                setPdf(false)
            }}/>
        </div>
      </DialogHeader>
      <Card>
      <iframe src={link} frameborder="0" className='h-[80vh]'></iframe>
    </Card>
      </DialogContent>
    </Dialog>
    </div>
    </div>
  )
}

export default PdfDialog
