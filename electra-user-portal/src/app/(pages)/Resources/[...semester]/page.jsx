import { AnimationStoreProvider } from '@/app/store/AnimationStore'
import SemesterResources from '@/components/semeseterResources/SemesterResources'
import React from 'react'

const page = ({params}) => {
    const semester=(params.semester[0].charAt((params.semester[0].length-1)))
  return (
    <AnimationStoreProvider>
    <div>
     <h2 className="text-center p-3 font-black text2xl text-sky-200 [text-shadow:_0rem_0.3rem_0.3rem_rgb(99_102_241_/_0.8)] lg:text-3xl sm:text-3xl">Semester-{semester}</h2>
      <SemesterResources semester={semester}/>
    </div>
    </AnimationStoreProvider>
  )
}

export default page
