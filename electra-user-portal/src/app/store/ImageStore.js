'use client'
import axios from 'axios';
import { createContext, useEffect, useState } from 'react'

export const ImageProvider=createContext({})
export const ImageStoreProvider=({children})=>{
    const [loading,setLoading]=useState(false);
    const [currentEventFilter,setCurrentEventFilter]=useState('all');
    const [imgs, getImgs] = useState([]);
    const ImageFetcher=async()=>{
        setLoading(true)
     try{
       const response=await axios.get(`/api/getGalleryImages?event=${currentEventFilter}`);
       getImgs(response.data)
       console.log(response.data);
     setLoading(false)
       
     }catch(err){
         console.log(err);
     }
    }
    useEffect(()=>{
     ImageFetcher();
    },[currentEventFilter])
return <ImageProvider.Provider value={{imgs,currentEventFilter,setCurrentEventFilter,loading}}>
    {children}
</ImageProvider.Provider>
}