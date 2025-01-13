'use client'
import React from 'react'
import FormfacadeEmbed from "@formfacade/embed-react";
import Header from "@/components/header/Header"
const page = () => {
  return (
    <div>
    <Header/>
    <div className='sm:mt-8 mt-14' id='g-form-reg'>
    <FormfacadeEmbed

formFacadeURL="https://formfacade.com/include/118295645637140833162/form/1FAIpQLScUZ-n8cjv9E3aySvg5wOywxfTjpQhMsqx9XAiPHp3cgIpstg/classic.js/?div=ff-compose" 

onSubmitForm={() => console.log('Form submitted')}

/>
    </div>
    </div>
  )
}
export default page
