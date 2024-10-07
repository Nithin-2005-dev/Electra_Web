import React from 'react'
import { CldUploadWidget } from 'next-cloudinary'
const UploadTeam = () => {
  return (
    <div>
      <div>
        <label htmlFor="name">name</label>
        <input type="text" placeholder='enter team member name' />
      </div>
      <div>
        <label htmlFor="year">year</label>
        <input type="text" placeholder='enter year' />
      </div> 
      <p>note:if year is 2023-2024,enter 2023</p>
      <div>
        <label htmlFor="position">position</label>
        <input type="text" placeholder='enter team member position' />
      </div> <div>
        <label htmlFor="instaLink">enter instagram link(optional)</label>
        <input type="text" placeholder='enter insta link here' />
      </div> <div>
        <label htmlFor="fbLink">enter facebook link(optional)</label>
        <input type="text" placeholder='enter fb link here' />
      </div>
      <div>
        <label htmlFor="linkdinLink">enter linkdin link(optional)</label>
        <input type="text" placeholder='enter linkdin link here' />
      </div>
      <div>
      <CldUploadWidget uploadPreset={`${preset}`} onSuccess={handleUpload}>
          {({ open }) => {
            return <button onClick={() => open()}>Upload an image</button>;
          }}
        </CldUploadWidget>
      </div>
      <button type='submit'>submit</button>
    </div>
  )
}

export default UploadTeam
