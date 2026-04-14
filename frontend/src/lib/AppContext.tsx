"use client";

import React, { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import type { User } from "./Types";
import Loader from "../components/elements/Loader";
import { getAuthenticatedUser } from "@/api/user";

interface AppContextType {
  user: User | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const { data: user, isLoading } = useQuery({
    queryKey: ["logged-user"],
    queryFn: () => getAuthenticatedUser(),
  });

  return isLoading ? (
    <Loader />
  ) : (
    <AppContext.Provider
      value={{
        user,
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
