import { ResourceStoreProvider } from '@/app/store/ResourceStore'
import SemesterResourceCategory from '@/components/semesterResourceCategory/SemesterResourceCategory'
import React from 'react'

const page = ({params}) => {
    const quries=(params.category[0].split('%7C'))
  return (
    <ResourceStoreProvider>
      <SemesterResourceCategory semester={quries[0]} category={quries[1]}/>
    </ResourceStoreProvider>
  )
}

export default page
