import Footer from '@/components/footer/Footer'
import Header from '@/components/header/Header'
import Head from 'next/head'
import React from 'react'

const layout = ({children}) => {
  return (
    <div>
      {children}
    </div>
  )
}

export default layout
