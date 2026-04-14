import { useAppContext } from "@/lib/AppContext";
import React from "react";
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface AuthRequiredRouteProps {
  children: ReactNode;
}

const AuthRequiredRoute: React.FC<AuthRequiredRouteProps> = ({ children }) => {
  const { user } = useAppContext();
  
  if (user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AuthRequiredRoute;
