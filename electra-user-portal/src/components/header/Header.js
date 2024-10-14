'use client'
import Link from 'next/link'
import styles from '../../app/styles/header.module.css'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Toggler from '../ui/Toggler'
import { RiBook2Fill, RiGalleryFill, RiHome2Fill, RiHome3Fill, RiHome4Fill, RiTeamFill } from "react-icons/ri";
import {motion} from 'framer-motion'
const Header = () => {
    const [menu,setMenu]=useState(false)
    const path=usePathname();
    const isActive=(currentPath)=>path==currentPath;
  return (
    <>
    <div className='fixed top-0 left-0 mx-3 my-1 z-[1000]'>
        <img src='https://i.imghippo.com/files/mt3cO1728475194.png' alt='electra-logo' width={'55'} className='rounded-full'/>
        </div>
    <header className='px-2 hidden sm:block'>
    <div className='h-[8vh] w-[100vw] bg-[#070F2B] fixed z-[10] top-0'></div>
     <nav className={`flex flex-row gap-10 justify-end mx-2 p-2 ${styles['fredoka']} text-white text-sm lg:text-lg md:text-base right-0 z-50 p-2 w-[100vw] fixed top-0 bg-[#070F2B]`}>
        <Link href='/' className={isActive('/')?'text-orange-400':'text-white'}>
            Home
        </Link>
        <Link href={'/Gallery'}  className={isActive('/Gallery')?'text-orange-400':'text-white'}>
            Gallery
        </Link>
        <Link href={'/Resources'} id='resource' className={isActive('/Resources')?'text-orange-400':'text-white'}>
            Resources
        </Link>
        <Link href={'/Team'}  className={isActive('/Team')?'text-orange-400':'text-white'}>
            Core-Team
        </Link>
     </nav> 
    </header>
    <div className='fixed right-0 z-[100] block sm:hidden bg-transparent w-full top-0'>
    <Toggler setMenu={setMenu} menu={menu}/>
    </div>
    <div className=''>
    <div className='h-[8vh] w-[100vw] bg-[#070F2B] fixed z-[80] top-0 sm:hidden'></div>
    {menu &&  <header className='px-2 block sm:hidden ease-in-out '>
     <motion.nav initial={{
        x:500
     }} animate={{
        x:0,
        transition:{
            type:"tween"
        }
     }} layout className={` flex flex-col gap-6 justify-start mx-2 p-2 m-4 ${styles['fredoka']} text-white text-3xl lg:text-lg md:text-base p-2 w-[40vw] fixed top-[5vh] right-[2vw] bg-slate-950 z-[100] h-[50vh] bg-opacity-70 shadow-[0.2rem_0rem_0.5rem] shadow-slate-500 rounded-xl`}>
        <Link href='/' className={isActive('/')?'text-orange-400 ':'text-white'}>
            <RiHome4Fill className='inline-block'/><p className='text-xl inline-block'>Home</p>
        </Link>
        <Link href={'/Gallery'}  className={isActive('/Gallery')?'text-orange-400 ':'text-white'}>
            <RiGalleryFill className='inline-block'/><p className='text-xl inline-block'>Gallery</p>
        </Link>
        <Link href={'/Resources'} id='resource' className={isActive('/Resources')?'text-orange-400 ':'text-white'}>
            <RiBook2Fill className='inline-block'/><p className='text-xl inline-block'>Resources</p>
        </Link>
        <Link href={'/Team'}  className={isActive('/Team')?'text-orange-400 ':'text-white'}>
        <RiTeamFill className='inline-block' /><p className='text-xl inline-block'>Team</p>
        </Link>
     </motion.nav> 
    </header>}
    </div>
    </>
  )
}

export default Header
