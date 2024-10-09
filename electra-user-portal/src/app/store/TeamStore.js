'use client'
import axios from "axios";
import { createContext, useState } from 'react'
export const TeamStore=createContext({});
export const TeamStoreProvider=({children})=>{
    const [team,setTeam]=useState([]);
    const getTeamByYear=async(year)=>{
        try{
            const response=await axios.get(`/api/getTeam?team=${year}`);
            console.log(response.data)
            setTeam(response.data);
        }catch(err){
            console.log(err);
        }
    }
    return <TeamStore.Provider value={{team,getTeamByYear}}>
        {children}
    </TeamStore.Provider>
}