'use client'
import React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Cross1Icon } from '@radix-ui/react-icons';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import styles from '../../app/styles/CommentDialog.module.css'
import { Card, Image } from 'react-bootstrap'
import { disableInstantTransitions } from 'framer-motion';
import { CldImage } from 'next-cloudinary';
const FullPhoto = ({item,setFullPic,fullPic}) => {
  return (
    <Dialog open={fullPic} onOpenChange={setFullPic} >
      <DialogContent className={`aspect-auto border-0`}>
      <Card className='rounded-xl'>
      <CldImage
            width="960"
            height="600"
            src={item.publicId}
            sizes="100vw"
            alt="Description of my image"
            className='aspect-square rounded-xl'
          />
    </Card>
      </DialogContent>
    </Dialog>
  )
}

export default FullPhoto
