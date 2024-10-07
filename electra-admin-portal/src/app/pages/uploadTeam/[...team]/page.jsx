import React from 'react'

const page = ({params}) => {
  return (
    <div>
      <UploadTeam preset={params}/>
    </div>
  )
}

export default page
