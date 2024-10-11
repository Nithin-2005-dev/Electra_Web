'use client'
import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const KnowMore = ({openMore,setOpenMore,dataToShow}) => {
  return (
    <div>
      <Dialog open={openMore} onOpenChange={setOpenMore}>
  <DialogContent className={`border-0 bg-slate-950 bg-opacity-50 rounded-xl `}>
    <DialogHeader>
      <DialogTitle className='text-yellow-400'>{dataToShow?.title}</DialogTitle>
      <br/>
      <DialogDescription>
      <p className='text-sky-200 font-serif text-left'><strong className='text-gray-100'>Description:</strong>{dataToShow.eventDescription}</p>
      <br/>
      <p className='text-sky-200 font-serif text-left'><strong className='text-gray-100'>Elaboration:</strong>{dataToShow.eventElaboration}</p>
      <br/>
      <p className='text-sky-200 font-serif text-center'><strong className='text-gray-100'>
      🏷️Tagline:</strong>{dataToShow.eventTagline}</p>
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
    </div>
  )
}

export default KnowMore
