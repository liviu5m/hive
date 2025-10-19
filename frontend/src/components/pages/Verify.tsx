import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useMutation } from "@tanstack/react-query";
import { resendVerificationCode, verifyAccount } from "@/api/user";
import { AxiosError } from "axios";
import { toast, ToastContainer } from "react-toastify";

const Verify = () => {
  const { id } = useParams<{ id: string }>();
  const [code, setCode] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState("a");

  const { mutate: verify } = useMutation({
    mutationKey: ["verify-account"],
    mutationFn: () => verifyAccount(id || "", code),
    onSuccess: (data) => {
      console.log(data);
      toast("Account has been successfully verified !");
      navigate("/auth/login");
    },
    onError: (err: AxiosError) => {
      console.log(err);
      setError(err.response?.data as string);
      toast(err.response?.data as string);
    },
  });

  const { mutate: resend } = useMutation({
    mutationKey: ["verify-account"],
    mutationFn: () => resendVerificationCode(id || ""),
    onSuccess: (data) => {
      console.log(data);
      toast("Code resent successful");
    },
    onError: (err: AxiosError) => {
      console.log(err);
      toast(err.response?.data as string);
      setError(err.response?.data as string);
      toast(err.response?.data as string);
    },
  });

  useEffect(() => {
    if (!location.state?.fromSignup) {
      navigate("/auth/signup", { replace: true });
    }
  }, [location, navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-radial-[at_50%_75%] from-sky-200 via-blue-400 to-indigo-500 to-90%">
      <div className="container flex items-center justify-center">
        <div className="flex justify-between items-center">
          <div className="bg-white px-10 py-8 rounded-lg shadow w-[400px] flex flex-col items-center justify-center">
            <div>
              <h1 className="text-center text-xl font-semibold">
                Verify Your Account
              </h1>
              <h3 className="text-gray-700 mt-1 text-center">
                The code will expire in 5 mins
              </h3>
            </div>
            <form
              className="mt-5"
              onSubmit={(e) => {
                e.preventDefault();
                verify();
              }}
            >
              <InputOTP maxLength={6} value={code} onChange={(e) => setCode(e)}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <button className="w-full rounded-lg bg-[#333] text-white text-center py-2 mt-5 cursor-pointer hover:text-[#333] hover:bg-white border border-[#333]">
                Verify
              </button>
            </form>
            {error == "Code has expired" && (
              <div className="text-gray-500 mt-5 flex items-center justify-center gap-2">
                <p>The code has expired !</p>
                <button
                  className="text-[#333] font-semibold cursor-pointer"
                  onClick={() => {
                    resend();
                  }}
                >
                  Resend
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Verify;
