import { useEffect } from "react";
import { useAppContext } from "../../lib/AppContext";
import { useNavigate } from "react-router-dom";
import Loader from "../elements/Loader";

const GoogleAuth = () => {
  const { setToken } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    const jwt = document.cookie
      .split("; ")
      .find((row) => row.startsWith("jwt="))
      ?.split("=")[1];

    if (jwt) {
      localStorage.setItem("token", jwt);
      setToken(jwt);
      document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
    navigate("/");
  }, []);

  return <Loader />;
};

export default GoogleAuth;
