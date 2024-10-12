import { AnimationStoreProvider } from '@/app/store/AnimationStore';
import { ResourceStoreProvider } from '@/app/store/ResourceStore';
import SemesterResourcesSubjects from '@/components/semesterResourceSubjects/SemesterResourcesSubjects';
import React from 'react'

const page = ({params}) => {
    const utils=(params.subject[0].split('%7C'));
  return (
    <div>
    <h2 className="text-center p-3 font-black text2xl text-sky-200 [text-shadow:_0rem_0.3rem_0.3rem_rgb(99_102_241_/_0.8)] lg:text-3xl sm:text-2xl text-2xl">Semester-{utils[0]}</h2>
      <ResourceStoreProvider>
    <AnimationStoreProvider>
    <SemesterResourcesSubjects semester={utils[0]} category={utils[1]}/>
    </AnimationStoreProvider>
    </ResourceStoreProvider>
    </div>
  )
}

export default page
