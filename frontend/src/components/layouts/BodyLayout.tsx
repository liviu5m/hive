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
        <div className="hidden lg:block lg:w-80"></div>
        <div className="w-full px-4 pb-6 sm:px-6 lg:px-8">{children}</div>
      </div>
    </AppProvider>
  );
};

export default BodyLayout;
