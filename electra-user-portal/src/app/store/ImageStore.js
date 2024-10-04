'use client'
import axios from 'axios';
import { createContext, useEffect, useState } from 'react'

export const ImageProvider=createContext({})
export const ImageStoreProvider=({children})=>{
    const [imgs, getImgs] = useState([]);
    const ImageFetcher=async()=>{
     try{
       const response=await axios.get('/api/getGalleryImages');
       getImgs(response.data)
     }catch(err){
         console.log(err);
     }
    }
    useEffect(()=>{
     ImageFetcher();
    },[])
return <ImageProvider.Provider value={{imgs}}>
    {children}
</ImageProvider.Provider>
}