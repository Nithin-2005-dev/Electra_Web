"use client";

import axios from "axios";
import { createContext, useState } from "react";
export const ResourceStore = createContext();
export const ResourceStoreProvider = ({ children }) => {
  const [resLoad,setResLoad]=useState(false);
  const [data, setData] = useState([]);
  const [doubt,setDoubt]=useState(false)
  const getResources = async (semester,category) => {
    // setSem(sem);
    try {
      setResLoad(true);
      const response = await axios.post("/api/getRes", { semester,category });
      const res=await response.data
      setData(res);
      setResLoad(false);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <ResourceStore.Provider value={{ getResources ,data,setData,resLoad,doubt,setDoubt}}>
      {children}
    </ResourceStore.Provider>
  );
};
