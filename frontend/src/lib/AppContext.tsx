"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import type { User } from "./Types";
import Loader from "../components/elements/Loader";
import { getAuthenticatedUser } from "@/api/user";

interface AppContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const { isLoading, isError } = useQuery({
    queryKey: ["logged-user", token],
    queryFn: () => getAuthenticatedUser(token || ""),
    select: (data) => {
      if (!user && data) setUser(data);
      return data;
    },
    enabled: token != null && localStorage.getItem("token") != null,
  });

  useEffect(() => {
    if (isError) {
      localStorage.removeItem("token");
      setToken(null);
    }
  }, [isError]);

  return isLoading ? (
    <Loader />
  ) : (
    <AppContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
      }}
    >
      {children}
      <ToastContainer />
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
