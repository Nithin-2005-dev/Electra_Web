"use client";

import axios from "axios";
import { createContext, useState } from "react";
export const ResourceStore = createContext();
export const ResourceStoreProvider = ({ children }) => {
  // const [sem,setSem]=useState(0);
  const [data, setData] = useState([]);
  const getResources = async (semester,category) => {
    // setSem(sem);
    try {
      const response = await axios.post("/api/getRes", { semester,category });
      const res=await response.data
      setData(res);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <ResourceStore.Provider value={{ getResources ,data,setData}}>
      {children}
    </ResourceStore.Provider>
  );
};
