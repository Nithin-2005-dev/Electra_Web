import UploadTeam from '@/components/upload-team/UploadTeam'
import React from 'react'

const page = ({params}) => {
  console.log(params)
  return (
    <div>
      <UploadTeam preset={params.team[0]} team={params.team[1]}/>
    </div>
  )
}

export default page
