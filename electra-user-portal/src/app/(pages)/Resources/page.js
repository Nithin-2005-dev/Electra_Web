import { ResourceStoreProvider } from '../../store/ResourceStore'
import KnowledgeGrid from '../../../components/Resources/KnowledgeGrid'
import React from 'react'

const Resources = () => {
  return (
    <main>
    <ResourceStoreProvider>
      <KnowledgeGrid/>
    </ResourceStoreProvider>
    </main>
  )
}

export default Resources
