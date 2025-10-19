import React from "react";
import type { ReactNode } from "react";
import { AppProvider } from "../../lib/AppContext";
import Sidebar from "../elements/Sidebar";

type LayoutProps = {
  children: ReactNode;
};

const BodyLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <AppProvider>
      <div className="flex justify-center text-[#121212] bg-[#F9FAFB] min-h-screen w-full">
        <Sidebar />
        <div className="w-[325px]"></div>
        <div>{children}</div>
      </div>
    </AppProvider>
  );
};

export default BodyLayout;
