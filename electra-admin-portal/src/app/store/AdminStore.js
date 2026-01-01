"use client";
import { createContext, useState } from "react";
export const AdminStore = createContext({});
export const AdminStoreProvider = ({ children }) => {
  const [isAdmin, setAdmin] = useState(true);
  const checkAdmin = (userName, password) => {
    if (
      userName == 'Electra' &&
      password == 'Electra@2024'
    ) {
      
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
