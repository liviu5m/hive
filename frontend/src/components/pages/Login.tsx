import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { loginUserApi, resendVerificationCode } from "@/api/user";
import { useAppContext } from "@/lib/AppContext";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const { setToken } = useAppContext();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const { mutate: resend } = useMutation({
    mutationKey: ["verify-account"],
    mutationFn: (id: string) => resendVerificationCode(id),
    onSuccess: (data) => {
      console.log(data);
      toast("Code resent successful");
    },
    onError: (err: AxiosError) => {
      console.log(err);
      toast(err.response?.data as string);
      toast(err.response?.data as string);
    },
  });

  const { mutate: loginUser } = useMutation({
    mutationKey: ["login-user"],
    mutationFn: () => loginUserApi(loginData),
    onSuccess: (data) => {
      console.log(data);
      localStorage.setItem("token", data.token);
      setToken(data.token);
      navigate("/");
    },
    onError: (err: AxiosError) => {
      const responseData = err.response?.data;

      let errorMessage: string = "An unexpected error occurred";
      if (typeof responseData === "string") {
        errorMessage = responseData;
      } else if (typeof responseData === "object" && responseData !== null) {
        const values = Object.values(responseData);
        if (values.length > 0 && typeof values[0] === "string") {
          errorMessage = values[0];
        } else if (values.length > 0) {
          errorMessage = String(values[0]);
        }
      }
      if (errorMessage.split("|").length == 1) toast(errorMessage);
      console.log(errorMessage.split("|").length);

      if (errorMessage.startsWith("Account not enabled")) {
        resend(errorMessage.split("|")[1]);
        navigate("/auth/verify/" + errorMessage.split("|")[1], {
          state: { fromSignup: true },
        });
      }
    },
  });

  const logInWithGoogle = () => {
    window.location.href =
      import.meta.env.VITE_API_URL + "/oauth2/authorization/google";
  };

  return (
    <div className="flex items-center justify-center h-screen bg-radial-[at_50%_75%] from-sky-200 via-blue-400 to-indigo-500 to-90%">
      <div className="container flex items-center justify-between">
        <div>
          <div className="top-10">
            <div className="flex items-center gap-3 py-5">
              <img src="/imgs/logo.png" className="w-10" />
              <h1 className="text-amber-400 text-2xl font-bold">HIVE</h1>
            </div>
          </div>
          <div>
            <h1 className="text-6xl font-bold text-[#1E1A4E]">
              More than just friends truly
              <br /> connect
            </h1>
            <h4 className="mt-3 text-3xl font-[500]">
              connect with global community
              <br /> on hive.
            </h4>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="bg-white px-10 py-8 rounded-lg shadow w-[400px]">
            <div className="mb-7">
              <h1 className="text-center text-xl font-semibold">
                Log in into Hive
              </h1>
              <h3 className="text-gray-700 mt-1 text-center">
                Welcome back! Please log in to continue
              </h3>
              <button className="flex items-center justify-center gap-5 my-5 border border-gray-200 rounded-lg w-full py-2 hover:bg-gray-50 cursor-pointer mb-5" onClick={() => logInWithGoogle()}>
                <img src="/imgs/google.png" className="w-5" alt="" />
                <h4>Google</h4>
              </button>
            </div>
            <div className="relative">
              <div className="absolute top-0 w-full h-px bg-gray-200"></div>
              <h4 className="absolute -top-1/2 left-1/2 -translate-1/2 bg-white px-5 py-2">
                Or
              </h4>
            </div>
            <form
              className="mt-5 pt-7"
              onSubmit={(e) => {
                e.preventDefault();
                loginUser();
              }}
            >
              <div>
                <label htmlFor="email" className="text-sm">
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="Email"
                  value={loginData.email}
                  onChange={(e) =>
                    setLoginData({ ...loginData, email: e.target.value })
                  }
                  id="email"
                  className="mt-2"
                />
              </div>
              <div className="mt-3">
                <label htmlFor="password" className="text-sm">
                  Password
                </label>
                <Input
                  type="password"
                  placeholder="Password"
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                  id="password"
                  className="mt-2"
                />
              </div>
              <button className="w-full rounded-lg bg-[#333] text-white text-center py-2 mt-5 cursor-pointer hover:text-[#333] hover:bg-white border border-[#333]">
                Log In
              </button>
            </form>
            <div className="text-gray-500 mt-5">
              <p className="text-center">
                Don't have an account ?{" "}
                <Link to={"/auth/signup"} className="text-[#333] font-semibold">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
