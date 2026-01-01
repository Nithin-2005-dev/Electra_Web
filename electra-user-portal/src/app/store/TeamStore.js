"use client";

import axios from "axios";
import { createContext, useCallback, useRef, useState } from "react";

export const TeamStore = createContext({});

export const TeamStoreProvider = ({ children }) => {
  const [team, setTeam] = useState([]);
  const [teamLoad, setTeamLoad] = useState(false);

  // 🔒 guards
  const currentYearRef = useRef(null);
  const inFlightRef = useRef(false);

  const getTeamByYear = useCallback(async (year) => {
    if (!year) return;

    // 🛑 prevent duplicate or parallel calls
    if (inFlightRef.current) return;
    if (currentYearRef.current === year) return;

    try {
      inFlightRef.current = true;
      setTeamLoad(true);

      currentYearRef.current = year;

      const response = await axios.get(`/api/getTeam?team=${year}`);
      setTeam(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Failed to fetch team:", err);
      setTeam([]);
    } finally {
      setTeamLoad(false);
      inFlightRef.current = false;
    }
  }, []);

  return (
    <TeamStore.Provider
      value={{
        team,
        teamLoad,
        getTeamByYear,
      }}
    >
      {children}
    </TeamStore.Provider>
  );
};
