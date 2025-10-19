import { Like, Reply } from "@/lib/Types";
import { getTimeAgo } from "@/lib/utils";
import React from "react";
import Loader from "../Loader";
import {
  addReplyLikeApi,
  getReplyLikesByCommentId,
  removeReplyLikeApi,
} from "@/api/replyLike";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppContext } from "@/lib/AppContext";
import { HeartIcon } from "lucide-react";

const ReplyCard = ({ reply }: { reply: Reply }) => {
  const { user, token } = useAppContext();
  const queryClient = useQueryClient();
  const {
    data: replyLikes,
    isPending: isPendingRepliesLike,
    error,
  } = useQuery({
    queryKey: ["reply-likes", reply.id],
    queryFn: () => getReplyLikesByCommentId(reply.id, token || ""),
  });

  const { mutate: addReplyLike } = useMutation({
    mutationKey: ["add-reply-like", reply.id],
    mutationFn: () => addReplyLikeApi(reply.id, user?.id || -1, token || ""),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reply-likes"] });
    },
  });

  const { mutate: removeReplyLike } = useMutation({
    mutationKey: ["remove-reply-like", reply.id],
    mutationFn: (replyLikeId: number) =>
      removeReplyLikeApi(replyLikeId, token || ""),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reply-likes"] });
    },
  });

  return isPendingRepliesLike ? (
    <Loader />
  ) : (
    <div key={reply.id} className="flex">
      <img
        src={reply.user.profilePicture}
        alt={reply.user.name}
        className="w-6 h-6 rounded-full object-cover"
      />
      <div className="ml-2 flex-1">
        <div className="bg-gray-100 rounded-lg px-3 py-1.5">
          <div className="font-medium text-xs">{reply.user.name}</div>
          <div className="text-xs">{reply.content}</div>
        </div>
        <div className="flex items-center mt-1 text-xs text-gray-500 space-x-3">
          <button
            className={`font-medium cursor-pointer ${
              replyLikes.find((like: Like) => like.user.id == user?.id)
                ? "text-red-500"
                : "hover:text-gray-700"
            }`}
            onClick={() => {
              let like = replyLikes.find(
                (like: Like) => like.user.id == user?.id
              );
              if (like) removeReplyLike(like.id);
              else addReplyLike();
            }}
          >
            Like
          </button>
          <span>{getTimeAgo(reply.createdAt)}</span>
          {replyLikes.length > 0 && (
            <div className="flex items-center">
              <HeartIcon size={12} className="fill-red-500 text-red-500 mr-1" />
              <span>{replyLikes.length}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReplyCard;
