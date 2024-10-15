import React from 'react'
import { MdEmail } from "react-icons/md";
import { FaFacebook, FaInstagram, FaLinkedin, FaPhoneAlt } from "react-icons/fa";
import { Card } from 'react-bootstrap';
const Footer = () => {
  return (
    <div className='my-2'>
    <hr className='m-1 sm:m-3 text-xl font-black'/>
    <div className='flex justify-between items-center m-3'>
      <div className='flex flex-col gap-2 m-2'>
        <p className='text-sm sm:lg lg:text-xl xl:text-2xl font-extrabold text-fuchsia-600'>Contact us</p>
        <div className='flex gap-2 items-center text-slate-500'>
        <MdEmail className='inline-block text-sm sm:text-xl text-neutral-400'/>
        <a href='mailto:societyelectra@gmail.com' className='text-gray-300 text-xs sm:text-sm'>email</a>
        </div>
        <a href='tel:1234567890' className='flex gap-2 items-center text-slate-500'>
        <FaPhoneAlt className='inline-block text-sm sm:text-xl'/>
        <p className='text-gray-300 text-xs sm:text-sm'>1234567890</p>
        </a>
      </div>
      <div>
        <img src='https://i.imghippo.com/files/mt3cO1728475194.png' alt='electra-logo' width={'150'} className='scale-75 sm:scale-100'/>
        </div>
      <div className='flex flex-col gap-2 m-2'>
      <p className='text-sm sm:lg lg:text-xl xl:text-2xl font-extrabold text-fuchsia-600'>Social Links</p>
        <a href='https://www.instagram.com/electrasociety/?__pwa=1' target='_blank'  className='flex gap-2 items-center text-slate-500'>
            <FaInstagram className='inline-block text-sm sm:text-xl text-orange-400'/>
            <p className='text-gray-300 text-xs sm:text-base'>Instagram</p>
        </a>
        <a href='https://www.facebook.com/groups/electra.nits' target='_blank' className='flex gap-2 items-center text-slate-500'>
            <FaFacebook className='inline-block text-sm sm:text-xl text-sky-500'/>
            <p className='text-gray-300 text-xs sm:text-base'>Facebook</p>
        </a>
        <a href='https://www.linkedin.com/company/electrical-engineering-society-nit-silchar/posts/?feedView=all' target='_blank'  className='flex gap-2 items-center text-slate-500 '>
            <FaLinkedin className='inline-block text-sm sm:text-xl text-sky-800'/>
            <p className='text-gray-300 text-xs sm:text-base'>Linkedin</p>
        </a>
      </div>
    </div>
    <div className='text-sky-200'>
    <p className='text-center text-xs sm:text-base'>© 2024 Electrical Engineering Department, NIT Silchar</p>
    <p className='text-center text-xs sm:text-base'> All Rights Reserved</p>

<p className='text-center text-xs sm:text-base'>Designed & Developed by Technical team@Electra society⚡</p>
    </div>
    </div>
  )
}

export default Footer
