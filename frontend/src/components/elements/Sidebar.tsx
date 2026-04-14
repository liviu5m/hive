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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutUser } from "@/api/user";

const Sidebar = () => {
  const { pathname } = useLocation();
  const { user } = useAppContext();
  const navigate = useNavigate();
  const [createPostModal, setCreatePostModal] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: logout } = useMutation({
    mutationKey: ["logout-user"],
    mutationFn: () => logoutUser(),
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({ queryKey: ["logged-user"] });
      navigate("/auth/login");
    },
    onError: (err) => {
      console.log(err);
    },
  });

  return (
    <>
      <header className="fixed bottom-0 left-0 bg-white z-50 shadow w-full h-16 lg:top-0 lg:bottom-auto lg:w-80 lg:h-screen">
        <div className="hidden lg:flex items-center gap-3 py-5 p-5 border-b h-20 border-b-gray-200">
          <Link to={"/"}>
            <img src="/imgs/logo.png" className="w-10" />
          </Link>
          <Link to={"/"} className="text-amber-400 text-2xl font-bold">
            HIVE
          </Link>
        </div>
        <div className="flex flex-col justify-between items-start h-full lg:h-[calc(100vh-80px)]">
          <ul className="w-full p-2 flex items-center justify-around gap-1 lg:p-10 lg:gap-3 lg:flex-col lg:items-stretch lg:justify-start">
            <Link
              to={"/"}
              className={`flex items-center justify-center lg:justify-start gap-2 lg:gap-3 w-full px-2 py-2 lg:px-4 rounded-lg font-semibold ${
                pathname == "/"
                  ? "text-[#4F39F6] bg-[#EEF2FF]"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <HomeIcon />
              <span className="hidden lg:inline">Feed</span>
            </Link>
            <Link
              to={"/messages"}
              className={`flex items-center justify-center lg:justify-start gap-2 lg:gap-3 w-full px-2 py-2 lg:px-4 rounded-lg font-semibold ${
                pathname == "/messages"
                  ? "text-[#4F39F6] bg-[#EEF2FF]"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <MessageCircle />
              <span className="hidden lg:inline">Messages</span>
            </Link>
            <Link
              to={"/discover"}
              className={`flex items-center justify-center lg:justify-start gap-2 lg:gap-3 w-full px-2 py-2 lg:px-4 rounded-lg font-semibold ${
                pathname == "/discover"
                  ? "text-[#4F39F6] bg-[#EEF2FF]"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Search />
              <span className="hidden lg:inline">Discover</span>
            </Link>
            <Link
              to={"/profile/" + user?.id}
              className={`flex items-center justify-center lg:justify-start gap-2 lg:gap-3 w-full px-2 py-2 lg:px-4 rounded-lg font-semibold ${
                pathname == "/profile/" + user?.id
                  ? "text-[#4F39F6] bg-[#EEF2FF]"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <User />
              <span className="hidden lg:inline">Profile</span>
            </Link>
            <button
              className={`flex items-center justify-center text-white gap-2 lg:gap-3 w-full px-2 py-2 lg:px-4 rounded-lg font-semibold bg-linear-to-r from-cyan-500 to-blue-500 cursor-pointer`}
              onClick={() => setCreatePostModal(true)}
            >
              <PlusCircle />
              <span className="hidden lg:inline">Create Post</span>
            </button>
            <button
              className="flex lg:hidden items-center justify-center gap-2 w-full px-2 py-2 rounded-lg font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                logout();
              }}
            >
              <LogOut />
            </button>
          </ul>
          <div className="hidden lg:flex items-center justify-between p-7 w-full gap-10 border-t border-t-gray-200">
            <div className="flex items-center gap-3 w-full ">
              <div>
                <img
                  src={user?.profilePicture}
                  className="rounded-full w-10 h-10 aspect-square object-cover"
                />
              </div>
              <div>
                <h2>{user?.name}</h2>
                <h4 className="text-gray-600 text-sm">@{user?.username}</h4>
              </div>
            </div>
            <LogOut
              className="text-gray-400 hover:text-black cursor-pointer"
              onClick={() => {
                logout();
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
