import {
  createFollowRequest,
  deleteFollowRequest,
  getFollowRequestByIds,
} from "@/api/followRequest";
import { useAppContext } from "@/lib/AppContext";
import { User } from "@/lib/Types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loader from "../Loader";

const UserFollowStatusCard = ({ user, type }: { user: User; type: string }) => {
  const { user: loggedUser, token } = useAppContext();
  const [status, setStatus] = useState("");
  const queryClient = useQueryClient();
  const { mutate: createRequest, isPending: isCreating } = useMutation({
    mutationKey: ["create-follow-request"],
    mutationFn: () =>
      createFollowRequest(loggedUser?.id || -1, user.id || -1, token || ""),
    onSuccess: (data) => {
      console.log(data);
      setStatus("PENDING");
      queryClient.invalidateQueries({ queryKey: ["following-data"] });
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const { mutate: deleteRequest } = useMutation({
    mutationKey: ["delete-follow-request"],
    mutationFn: () =>
      deleteFollowRequest(loggedUser?.id || -1, user.id || -1, token || ""),
    onSuccess: (data) => {
      console.log(data);
      setStatus("");
      queryClient.invalidateQueries({ queryKey: ["following-data"] });
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const { data: followStatus, isPending } = useQuery({
    queryKey: ["follow-status-check", user.id],
    queryFn: () =>
      getFollowRequestByIds(loggedUser?.id || -1, user.id, token || ""),
  });

  useEffect(() => {
    if (followStatus) setStatus(followStatus.status);
  }, [followStatus]);

  console.log(status);

  return (
    <div className="p-3 rounded-lg flex gap-4 w-full user-follow-request">
      <div>
        <img
          src={user.profilePicture}
          className="w-[40px] rounded-full aspect-square"
          alt=""
        />
      </div>
      <div className="flex items-center justify-between w-full">
        <div>
          <h2 className="font-semibold">{user.name}</h2>
          <h4 className="text-gray-600">@{user.username}</h4>
        </div>
        <div className="mt-3 flex items-center gap-5">
          <button
            className={`flex items-center justify-center text-black border border-gray-200 gap-3 px-4 py-2 rounded-lg font-semibold w-fit hover:opacity-90 cursor-pointer  ${
              status ? "bg-[#4F39F6] text-white" : "hover:bg-gray-50"
            }`}
            type="submit"
            onClick={(e) => {
              if (!status) createRequest();
              else deleteRequest();
            }}
          >
            {isCreating && (
              <div className="w-5 h-5 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
            )}
            {status == "ACCEPTED"
              ? "Following"
              : status == "PENDING"
              ? "Cancel"
              : "Follow"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserFollowStatusCard;
