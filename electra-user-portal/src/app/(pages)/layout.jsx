import Header from '@/components/header/Header'
import Head from 'next/head'
import React from 'react'

const layout = ({children}) => {
  return (
    <div>
      <Header/>
      {children}
    </div>
  )
}

export default layout
