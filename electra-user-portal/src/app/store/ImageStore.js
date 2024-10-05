'use client'
import axios from 'axios';
import { createContext, useEffect, useState } from 'react'

export const ImageProvider=createContext({})
export const ImageStoreProvider=({children})=>{
    const [currentEventFilter,setCurrentEventFilter]=useState('all');
    const [imgs, getImgs] = useState([]);
    const ImageFetcher=async()=>{
     try{
       const response=await axios.get(`/api/getGalleryImages?event=${currentEventFilter}`);
       getImgs(response.data)
     }catch(err){
         console.log(err);
     }
    }
    useEffect(()=>{
     ImageFetcher();
    },[currentEventFilter])
return <ImageProvider.Provider value={{imgs,currentEventFilter,setCurrentEventFilter}}>
    {children}
</ImageProvider.Provider>
}