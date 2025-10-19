import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface NonAuthRequiredRouteProps {
  children: ReactNode;
}

const NonAuthRequiredRoute: React.FC<NonAuthRequiredRouteProps> = ({
  children,
}) => {
  const location = useLocation();

  if (localStorage.getItem("token")) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default NonAuthRequiredRoute;
