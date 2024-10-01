import React from 'react'
import * as Dialog from '@radix-ui/react-dialog';
import styles from '../../app/styles/CommentDialog.module.css'
import { IoMdClose } from "react-icons/io";
import { IoCloseCircle } from "react-icons/io5";
import { FaEnvelopeOpenText } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa";
const CommentDialog = ({comment,setComment,item}) => {
  return (
    <div>
      <Dialog.Root open={comment} onOpenChange={setComment} >
      <Dialog.Portal >
        <Dialog.Overlay className={`${styles['DialogOverlay']}`}>
          <Dialog.Content className={`${styles['DialogContent']} p-3`}>
          <div className=''>
          <IoMdClose onClick={()=>{
            setComment(false)
          }} className='inline-block text-3xl text-white float-end' />
            <p className='text-center font-bold text-lg text-gray-50 font-mono'>Comments</p>
          </div>
            <hr className='text-white' />
            {item.comments.map((comment)=>{
                return <div className='border-1 border-white my-3 gap-1 flex flex-col p-1' key={comment}>
                <div className='text-lg text-slate-400 font-semibold'><FaRegUser className='inline-block mx-2 text-base' />User</div>
                <div className='text-red-300'><FaEnvelopeOpenText className='inline-block mx-2 text-base' />{comment}</div>
            </div>
            })}
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
    </div>
  )
}

export default CommentDialog
