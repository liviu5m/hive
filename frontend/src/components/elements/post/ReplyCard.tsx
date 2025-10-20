import { Like, Reply } from "@/lib/Types";
import { getTimeAgo } from "@/lib/utils";
import React, { useState } from "react";
import Loader from "../Loader";
import {
  addReplyLikeApi,
  getReplyLikesByCommentId,
  removeReplyLikeApi,
} from "@/api/replyLike";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppContext } from "@/lib/AppContext";
import { Ellipsis, HeartIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteReplyApi, updateReplyApi } from "@/api/reply";

const ReplyCard = ({ reply }: { reply: Reply }) => {
  const { user, token } = useAppContext();
  const queryClient = useQueryClient();
  const [isReplyUpdating, setIsReplyUpdating] = useState(false);
  const [replyContent, setReplyContent] = useState(reply.content);
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

  const { mutate: updateReply } = useMutation({
    mutationKey: ["update-reply-like", reply.id],
    mutationFn: () => updateReplyApi(reply.id, replyContent, token || ""),
    onSuccess: (data) => {
      console.log(data);
      setIsReplyUpdating(false);
      queryClient.invalidateQueries({ queryKey: ["comment-reply"] });
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const { mutate: deleteReply } = useMutation({
    mutationKey: ["update-reply-like", reply.id],
    mutationFn: () => deleteReplyApi(reply.id, token || ""),
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({ queryKey: ["comment-reply"] });
    },
    onError: (err) => {
      console.log(err);
    },
  });

  return (
    !isPendingRepliesLike && (
      <div key={reply.id} className="flex">
        <img
          src={reply.user.profilePicture}
          alt={reply.user.name}
          className="w-6 h-6 rounded-full object-cover"
        />
        <div className="ml-2 flex-1">
          <div className="bg-gray-100 rounded-lg px-3 py-2 relative">
            <div className="font-medium text-sm">{reply.user.name}</div>
            {isReplyUpdating ? (
              <div className="relative">
                <input
                  className="my-2 bg-white px-2 py-1 rounded-lg w-full outline-none text-sm"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                />
                <button
                  className="top-1/2 -translate-y-1/2 right-2 text-gray-600 absolute text-sm cursor-pointer p-1"
                  onClick={() => updateReply()}
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="text-sm">{reply.content}</div>
            )}

            {reply.user.id == user?.id && (
              <div className="absolute top-2 right-2">
                <DropdownMenu>
                  <DropdownMenuTrigger className="outline-none">
                    <Ellipsis className="w-5 h-5 cursor-pointer outline-0" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => setIsReplyUpdating(true)}
                    >
                      <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => deleteReply()}
                    >
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
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
                <HeartIcon
                  size={12}
                  className="fill-red-500 text-red-500 mr-1"
                />
                <span>{replyLikes.length}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default ReplyCard;
