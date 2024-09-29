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
} from "@/components/ui/dialog"
import { Card, Image } from 'react-bootstrap'
import { disableInstantTransitions } from 'framer-motion';
const FullPhoto = ({item,setFullPic,fullPic}) => {
  return (
    <Dialog open={fullPic} onOpenChange={setFullPic}>
      <DialogContent>
      <Card style={{ width: '28rem' }}>
      <Image src={item.image} fluid />
    </Card>
      </DialogContent>
    </Dialog>
  )
}

export default FullPhoto
