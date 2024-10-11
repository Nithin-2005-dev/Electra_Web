import { AnimationStoreProvider } from '@/app/store/AnimationStore'
import { ResourceStoreProvider } from '@/app/store/ResourceStore'
import SemesterResourceCategory from '@/components/semesterResourceCategory/SemesterResourceCategory'
import React from 'react'

const page = ({params}) => {
    const quries=(params.category[0].split('%7C'))
  return (
    <AnimationStoreProvider>
      <ResourceStoreProvider>
      <h2 className="text-center p-3 font-black text2xl text-sky-200 [text-shadow:_0rem_0.3rem_0.3rem_rgb(99_102_241_/_0.8)] lg:text-3xl sm:text-2xl text-2xl">Semester-{quries[0]}</h2>
      <SemesterResourceCategory semester={quries[0]} category={quries[1]}/>
    </ResourceStoreProvider>
    </AnimationStoreProvider>
  )
}

export default page
