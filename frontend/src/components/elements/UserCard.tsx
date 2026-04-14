import {
  createFollowRequest,
  deleteFollowRequest,
  getFollowRequestByIds,
} from "@/api/followRequest";
import { useAppContext } from "@/lib/AppContext";
import { FollowRequest, User } from "@/lib/Types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "./Loader";

const UserCard = ({
  user,
  request,
}: {
  user: User;
  request: FollowRequest;
}) => {
  const { user: loggedUser } = useAppContext();
  const queryClient = useQueryClient();
  const [managing, setManaging] = useState(false);
  const [status, setStatus] = useState(request ? request.status : "");

  const { mutate: createRequest } = useMutation({
    mutationKey: ["create-follow-request"],
    mutationFn: () => createFollowRequest(loggedUser?.id || -1, user.id),
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({
        queryKey: ["following", loggedUser?.id],
      });

      queryClient.invalidateQueries({ queryKey: ["user-discover"] });
      setManaging(false);
    },
    onError: (err) => {
      console.log(err);
      setManaging(false);
    },
  });

  const { mutate: deleteRequest } = useMutation({
    mutationKey: ["delete-follow-request"],
    mutationFn: () => deleteFollowRequest(loggedUser?.id || -1, user.id),
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({
        queryKey: ["following", loggedUser?.id],
      });
      queryClient.invalidateQueries({ queryKey: ["user-discover"] });
      setManaging(false);
    },
    onError: (err) => {
      console.log(err);
      setManaging(false);
    },
  });

  // const { data: followRequest, isPending } = useQuery({
  //   queryKey: ["following", user.id],
  //   queryFn: () => getFollowRequestByIds(loggedUser?.id || -1, user.id),
  // });

  // useEffect(() => {
  //   if (followRequest) {
  //     setStatus(followRequest.status);
  //   }
  // }, [followRequest]);

  const manageUser = () => {
    if (managing) return;
    setManaging(true);
    if (!request) {
      setStatus("PENDING");
      createRequest();
    } else {
      setStatus("");
      deleteRequest();
    }
  };

  return (
    user.id != loggedUser?.id && (
      <div className="bg-white p-4 sm:p-6 md:p-7 rounded-lg shadow flex gap-4">
        <div>
          <img
            src={user.profilePicture}
            className="w-10 rounded-full aspect-square"
            alt=""
          />
        </div>
        <div>
          <h2 className="font-semibold">{user.name}</h2>
          <h4 className="text-gray-600">@{user.username}</h4>
          {user.bio && (
            <h5>{user.bio.slice(0, 10) + (user.bio.length > 10 && "...")}</h5>
          )}
          <div className="mt-3 flex items-center gap-3 md:gap-5 flex-wrap">
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
              {/* {managing && (
                <div className="w-5 h-5 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
              )} */}

              {!status ? "Follow" : status == "PENDING" ? "Cancel" : "Unfollow"}
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default UserCard;
