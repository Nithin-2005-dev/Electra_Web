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
    <header className='px-2 hidden sm:block'>
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
    <div className='fixed right-0 z-[100] block sm:hidden bg-transparent w-full'>
    <Toggler setMenu={setMenu} menu={menu}/>
    </div>
    {menu &&  <header className='px-2 block sm:hidden ease-in-out'>
     <motion.nav layout className={`flex flex-col gap-5 justify-end mx-2 p-2 ${styles['fredoka']} text-white text-3xl lg:text-lg md:text-base text-end p-2 w-[100vw] fixed top-[5vh] right-[2vw] bg-transparent z-[100]`}>
        <Link href='/' className={isActive('/')?'text-orange-400 drop-shadow-[0rem_0rem_0.5rem_rgba(255,0,0,1)]':'text-white drop-shadow-[0rem_0rem_1rem_rgba(255,255,255,1)]'}>
            <RiHome4Fill className='inline-block'/>
        </Link>
        <Link href={'/Gallery'}  className={isActive('/Gallery')?'text-orange-400 drop-shadow-[0rem_0rem_0.5rem_rgba(255,0,0,1)]':'text-white drop-shadow-[0rem_0rem_1rem_rgba(255,255,255,1)]'}>
            <RiGalleryFill className='inline-block'/>
        </Link>
        <Link href={'/Resources'} id='resource' className={isActive('/Resources')?'text-orange-400 drop-shadow-[0rem_0rem_0.5rem_rgba(255,0,0,1)]':'text-white drop-shadow-[0rem_0rem_1rem_rgba(255,255,255,1)]'}>
            <RiBook2Fill className='inline-block'/>
        </Link>
        <Link href={'/Team'}  className={isActive('/Team')?'text-orange-400 drop-shadow-[0rem_0rem_0.5rem_rgba(255,0,0,1)]':'text-white drop-shadow-[0rem_0rem_1rem_rgba(255,255,255,1)]'}>
        <RiTeamFill className='inline-block' />
        </Link>
     </motion.nav> 
    </header>}
    </>
  )
}

export default Header
