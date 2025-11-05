'use client'
import axios from "axios";
import { createContext, useState } from 'react'
export const TeamStore=createContext({});
export const TeamStoreProvider=({children})=>{
    const [team,setTeam]=useState([]);
    const [teamLoad,setTeamLoad]=useState(false);
    const getTeamByYear=async(year)=>{
        try{
            setTeamLoad(true);
            const response=await axios.get(`/api/getTeam?team=${year}`);
            setTeam(response.data);
            setTeamLoad(false);
        }catch(err){
            console.log(err);
        }
    }
    return <TeamStore.Provider value={{team,getTeamByYear,teamLoad}}>
        {children}
    </TeamStore.Provider>
}