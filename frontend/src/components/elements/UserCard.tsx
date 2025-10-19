import {
  createFollowRequest,
  deleteFollowRequest,
  getFollowRequestByIds,
} from "@/api/followRequest";
import { useAppContext } from "@/lib/AppContext";
import { User } from "@/lib/Types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "./Loader";

const UserCard = ({ user }: { user: User }) => {
  const { user: loggedUser, token } = useAppContext();
  const [status, setStatus] = useState("");

  const { mutate: createRequest, isPending: isCreating } = useMutation({
    mutationKey: ["create-follow-request"],
    mutationFn: () =>
      createFollowRequest(loggedUser?.id || -1, user.id, token || ""),
    onSuccess: (data) => {
      console.log(data);
      setStatus("PENDING");
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const { mutate: deleteRequest, isPending: isDeleting } = useMutation({
    mutationKey: ["delete-follow-request"],
    mutationFn: () =>
      deleteFollowRequest(loggedUser?.id || -1, user.id, token || ""),
    onSuccess: (data) => {
      console.log(data);
      setStatus("");
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const {
    data: followRequest,
  } = useQuery({
    queryKey: ["following", user.id],
    queryFn: () =>
      getFollowRequestByIds(loggedUser?.id || -1, user.id, token || ""),
  });

  useEffect(() => {
    if (followRequest) {
      setStatus(followRequest.status);
    }
  }, [followRequest]);

  const manageUser = () => {
    if (!status) createRequest();
    else deleteRequest();
  };
  
  return (
    user.id != loggedUser?.id && (
      <div className="bg-white p-7 rounded-lg shadow flex gap-4">
        <div>
          <img
            src={user.profilePicture}
            className="w-[40px] rounded-full aspect-square"
            alt=""
          />
        </div>
        <div>
          <h2 className="font-semibold">{user.name}</h2>
          <h4 className="text-gray-600">@{user.username}</h4>
          {user.bio && (
            <h5>{user.bio.slice(0, 10) + (user.bio.length > 10 && "...")}</h5>
          )}
          <div className="mt-3 flex items-center gap-5">
            <Link
              to={"/profile/" + user.id}
              className={`flex items-center justify-center text-white gap-3 px-4 py-2 rounded-lg font-semibold bg-gradient-to-r from-cyan-500 to-blue-500 w-fit hover:opacity-90 cursor-pointer`}
              type="submit"
            >
              View Profile
            </Link>
            <button
              className={`flex items-center justify-center text-black border border-gray-200 gap-3 px-4 py-2 rounded-lg font-semibold w-fit hover:opacity-90 cursor-pointer ${!status ? "" : "bg-[#4F39F6] text-white"}`}
              type="submit"
              onClick={() => manageUser()}
            >
              {isCreating ||
                (isDeleting && (
                  <div className="w-5 h-5 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
                ))}
              {!status ? "Follow" : status == "PENDING" ? "Cancel" : "Unfollow"}
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default UserCard;
