'use client'
import React, { useState } from "react"
import { createContext } from "react"
export const AnimationStore=createContext({

})
export const AnimationStoreProvider=({children})=>{
    const [pikaAnimation,setPikaAnimation]=useState(1);
    return <AnimationStore.Provider value={{pikaAnimation,setPikaAnimation}}>
    {children}
    </AnimationStore.Provider>
}