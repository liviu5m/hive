import { useAppContext } from "@/lib/AppContext";
import {
  HomeIcon,
  LogOut,
  MessageCircle,
  PlusCircle,
  Search,
  User,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CreatePostModal from "./CreatePostModal";

const Sidebar = () => {
  const { pathname } = useLocation();
  const { user, setUser } = useAppContext();
  const navigate = useNavigate();
  const [createPostModal, setCreatePostModal] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 bg-white z-50 shadow w-[325px] h-screen">
        <div className="flex items-center gap-3 py-5 p-5 border-b h-20 border-b-gray-200">
          <img src="/imgs/logo.png" className="w-10" />
          <h1 className="text-amber-400 text-2xl font-bold">HIVE</h1>
        </div>
        <div className="flex flex-col justify-between items-start h-[calc(100vh-80px)]">
          <ul className="w-full p-10 flex gap-3 flex-col">
            <Link
              to={"/"}
              className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg font-semibold ${
                pathname == "/"
                  ? "text-[#4F39F6] bg-[#EEF2FF]"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <HomeIcon />
              <span>Feed</span>
            </Link>
            <Link
              to={"/messages"}
              className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg font-semibold ${
                pathname == "/messages"
                  ? "text-[#4F39F6] bg-[#EEF2FF]"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <MessageCircle />
              <span>Messages</span>
            </Link>
            <Link
              to={"/discover"}
              className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg font-semibold ${
                pathname == "/discover"
                  ? "text-[#4F39F6] bg-[#EEF2FF]"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Search />
              <span>Discover</span>
            </Link>
            <Link
              to={"/profile/" + user?.id}
              className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg font-semibold ${
                pathname == "/profile/" + user?.id
                  ? "text-[#4F39F6] bg-[#EEF2FF]"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <User />
              <span>Profile</span>
            </Link>
            <button
              className={`flex mt-3 items-center justify-center text-white gap-3 w-full px-4 py-2 rounded-lg font-semibold bg-linear-to-r from-cyan-500 to-blue-500 cursor-pointer`}
              onClick={() => setCreatePostModal(true)}
            >
              <PlusCircle />
              <span>Create Post</span>
            </button>
          </ul>
          <div className="flex items-center justify-between p-7 w-full gap-10 border-t border-t-gray-200">
            <div className="flex items-center gap-3 w-full ">
              <div>
                <img src={user?.profilePicture} className="rounded-full" />
              </div>
              <div>
                <h2>{user?.name}</h2>
                <h4 className="text-gray-600 text-sm">@{user?.username}</h4>
              </div>
            </div>
            <LogOut
              className="text-gray-400 hover:text-black cursor-pointer"
              onClick={() => {
                setUser(null);
                localStorage.removeItem("token");
                navigate("/auth/login");
              }}
            />
          </div>
        </div>
      </header>
      {createPostModal && (
        <CreatePostModal setCreatePostModal={setCreatePostModal} />
      )}
    </>
  );
};

export default Sidebar;
