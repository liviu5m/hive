import { deleteFollowRequest, updateFollowRequest } from "@/api/followRequest";
import { useAppContext } from "@/lib/AppContext";
import { User } from "@/lib/Types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const UserFollowRequest = ({
  user,
  requestId,
}: {
  user: User;
  requestId: number;
}) => {
  const { user: loggedUser, token } = useAppContext();
  const queryClient = useQueryClient();
  const { mutate: updateRequest, isPending: isCreating } = useMutation({
    mutationKey: ["create-follow-request"],
    mutationFn: () =>
      updateFollowRequest(
        requestId,
        user.id || -1,
        loggedUser?.id || -1,
        "ACCEPTED",
        token || ""
      ),
    onSuccess: (data) => {
      console.log(data);
      toast("User accepted successfully");
      queryClient.invalidateQueries({ queryKey: ["profile-follow-requests"] });
      queryClient.invalidateQueries({
        queryKey: ["following-data", loggedUser?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["follower-data", loggedUser?.id],
      });
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const { mutate: deleteRequest } = useMutation({
    mutationKey: ["delete-follow-request"],
    mutationFn: () =>
      deleteFollowRequest(user.id, loggedUser?.id || -1, token || ""),
    onSuccess: (data) => {
      console.log(data);
      toast("User removed successfully");
      queryClient.invalidateQueries({ queryKey: ["profile-follow-requests"] });
    },
    onError: (err) => {
      console.log(err);
    },
  });

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
            className={`flex items-center justify-center text-black border border-gray-200 gap-3 px-4 py-2 rounded-lg font-semibold w-fit hover:opacity-90 cursor-pointer hover:bg-gray-50`}
            type="submit"
            onClick={(e) => {
              updateRequest();
            }}
          >
            {isCreating && (
              <div className="w-5 h-5 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
            )}
            {"Accept"}
          </button>
          <X
            className="text-3xl cursor-pointer hover:scale-110"
            onClick={(e) => {
              deleteRequest();
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default UserFollowRequest;
