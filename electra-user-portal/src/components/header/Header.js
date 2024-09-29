'use client'
import Link from 'next/link'
import styles from '../../app/styles/header.module.css'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
const Header = () => {
    const path=usePathname();
    const isActive=(currentPath)=>path==currentPath;
  return (
    <header>
     <nav className={`flex flex-row gap-10 justify-end mx-2 p-2 ${styles['fredoka']} text-white text-sm lg:text-lg md:text-base`}>
        <Link href='/' className={isActive('/')?'text-orange-400':'text-white'}>
            Home
        </Link>
        <Link href={'/pages/Gallery'}  className={isActive('/pages/Gallery')?'text-orange-400':'text-white'}>
            Gallery
        </Link>
        <Link href={'/pages/Resources'} id='resource' className={isActive('/pages/Resources')?'text-orange-400':'text-white'}>
            Resources
        </Link>
        <Link href={'/pages/Team'}  className={isActive('/pages/Team')?'text-orange-400':'text-white'}>
            Core-Team
        </Link>
     </nav> 
    </header>
  )
}

export default Header
