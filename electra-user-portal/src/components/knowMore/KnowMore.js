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
  <DialogContent className={`border-0 bg-slate-950 bg-opacity-50 rounded-xl`}>
    <DialogHeader>
      <DialogTitle >{dataToShow?.title}</DialogTitle>
      <DialogDescription>
        {dataToShow?.description}
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
    </div>
  )
}

export default KnowMore
