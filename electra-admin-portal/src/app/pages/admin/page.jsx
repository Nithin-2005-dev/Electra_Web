import React from 'react'
import AdminForm from '@/components/admin-form/AdminForm'
import { AdminStoreProvider } from '@/app/store/AdminStore'
const page = () => {
  return (
    <AdminStoreProvider>
      <AdminForm/>
    </AdminStoreProvider>
  )
}

export default page
