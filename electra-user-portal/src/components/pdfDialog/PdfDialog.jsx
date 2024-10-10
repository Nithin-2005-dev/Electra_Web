import { Dialog, DialogContent } from '@radix-ui/react-dialog'
import { ImCross } from "react-icons/im";
import { RxCross2 } from "react-icons/rx";
import React, { useState } from 'react'
import { Card } from 'react-bootstrap'
import 'reactjs-popup/dist/index.css';
import { DialogHeader } from '../ui/dialog';
const PdfDialog = ({link}) => {
    const [pdf,setPdf]=useState(false);
  return (
    <div>
    <button onClick={()=>{
        setPdf(true)
    }}>view</button>
    <div className='fixed top-[2vh] right-[15vw] lg:right-[25vw]'>
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
