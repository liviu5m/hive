import { UserPen, UserPlus, UserRoundCheck, Users } from "lucide-react";
import BodyLayout from "../layouts/BodyLayout";
import { useState } from "react";

const Connections = () => {
  const [section, setSection] = useState("followers");

  return (
    <BodyLayout>
      <div className="w-[1000px] mt-5">
        <h1 className="text-3xl font-bold">Connections</h1>
        <h4 className="text-gray-600 mt-3">
          Manage your network and discover new connections
        </h4>
        <div className="mt-5 flex gap-7">
          <div className="shadow rounded-lg bg-white flex items-center justify-center flex-col gap-2 py-4 px-10">
            <h2 className="text-xl font-bold">0</h2>
            <h4>Followers</h4>
          </div>
          <div className="shadow rounded-lg bg-white flex items-center justify-center flex-col gap-2 py-4 px-10">
            <h2 className="text-xl font-bold">1</h2>
            <h4>Following</h4>
          </div>
          <div className="shadow rounded-lg bg-white flex items-center justify-center flex-col gap-2 py-4 px-10">
            <h2 className="text-xl font-bold">0</h2>
            <h4>Pending</h4>
          </div>
          <div className="shadow rounded-lg bg-white flex items-center justify-center flex-col gap-2 py-4 px-10">
            <h2 className="text-xl font-bold">0</h2>
            <h4>Connections</h4>
          </div>
        </div>
        <div className="mt-7 shadow bg-white px-4 py-2 rounded-lg w-fit flex items-center gap-8 text-gray-600">
          <div
            className={`flex items-center gap-2 cursor-pointer ${
              section == "followers" && "text-black font-semibold"
            }`}
            onClick={() => setSection("followers")}
          >
            <Users className="w-4" />
            <span className="text-sm">Followers</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer ${
              section == "following" && "text-black font-semibold"
            }`}
            onClick={() => setSection("following")}
          >
            <UserRoundCheck className="w-4" />
            <span className="text-sm">Following</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer ${
              section == "pending" && "text-black font-semibold"
            }`}
            onClick={() => setSection("pending")}
          >
            <UserPen className="w-4" />
            <span className="text-sm">Pending</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer ${
              section == "connections" && "text-black font-semibold"
            }`}
            onClick={() => setSection("connections")}
          >
            <UserPlus className="w-4" />
            <span className="text-sm">Connections</span>
          </div>
        </div>
      </div>
    </BodyLayout>
  );
};

export default Connections;
