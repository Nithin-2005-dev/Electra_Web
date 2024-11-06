"use client";
import { createContext, useState } from "react";
export const AdminStore = createContext({});
export const AdminStoreProvider = ({ children }) => {
  const [isAdmin, setAdmin] = useState(true);
  const checkAdmin = (userName, password) => {
    console.log(userName, password, process.env.MONGO_URL);
    if (
      userName == 'Electra' &&
      password == 'Electra@2024'
    ) {
      console.log("enter");
      
      setAdmin(true);
    }
    return isAdmin;
  };
  return (
    <AdminStore.Provider value={{ checkAdmin, isAdmin }}>
      {children}
    </AdminStore.Provider>
  );
};
