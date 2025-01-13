'use client'
import React from 'react'
import FormfacadeEmbed from "@formfacade/embed-react";
const page = () => {
  return (
    <div>
      <FormfacadeEmbed

formFacadeURL="https://formfacade.com/include/118295645637140833162/form/1FAIpQLScUZ-n8cjv9E3aySvg5wOywxfTjpQhMsqx9XAiPHp3cgIpstg/classic.js/?div=ff-compose"

onSubmitForm={() => console.log('Form submitted')}

/>
    </div>
  )
}

export default page
