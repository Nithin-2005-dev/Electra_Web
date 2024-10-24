'use client'
import Navigators from '../components/Navigators'
import {AdminStore, AdminStoreProvider} from '../app/store/AdminStore'
import { useContext } from 'react';
import { useRouter } from 'next/navigation';
export default function Home() {
  const {isAdmin}=useContext(AdminStore)
  const router=useRouter()
  if(!isAdmin){
    router.push('/pages/admin')
  }
  return (
    <AdminStoreProvider>
    <Navigators/>
   </AdminStoreProvider>
  );
}
