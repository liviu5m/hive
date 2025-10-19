import React, { useState } from "react";
import { Comment, Like } from "@/lib/Types";
import { getTimeAgo } from "@/lib/utils";
import { Ellipsis, HeartIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteCommentApi, updateCommentApi } from "@/api/comment";
import { useAppContext } from "@/lib/AppContext";
import {
  addCommentLikeApi,
  getCommentLikes,
  removeCommentLikeApi,
} from "@/api/commentLike";
import Loader from "../Loader";
import ReplySection from "./ReplySection";

interface CommentProps {
  comment: Comment;
}
export function CommentCard({ comment }: CommentProps) {
  const { user, token } = useAppContext();
  const queryClient = useQueryClient();
  const [isReplying, setIsReplying] = useState(false);
  const [isCommentUpdating, setIsCommentUpdating] = useState(false);
  const [commentContent, setCommentContent] = useState(comment.content);

  const { mutate: deleteComment } = useMutation({
    mutationKey: ["delete-comment"],
    mutationFn: () => deleteCommentApi(comment.id, token || ""),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["post-comments"] });
      console.log(data);
    },
    onError: (err) => {
      console.log(err);
    },
  });
  const { mutate: updateComment } = useMutation({
    mutationKey: ["update-comment"],
    mutationFn: () => updateCommentApi(comment.id, commentContent, token || ""),
    onSuccess: (data) => {
      console.log(data);
      setIsCommentUpdating(false);
      queryClient.invalidateQueries({ queryKey: ["post-comments"] });
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const { mutate: addCommentLike } = useMutation({
    mutationKey: ["add-comment-like"],
    mutationFn: () =>
      addCommentLikeApi(comment.id, user?.id || -1, token || ""),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comment-likes", comment.id],
      });
    },
  });

  const { mutate: removeCommentLike } = useMutation({
    mutationKey: ["remove-comment-like"],
    mutationFn: (commentLikeId: number) =>
      removeCommentLikeApi(commentLikeId, token || ""),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comment-likes", comment.id],
      });
    },
  });

  const { data: commentLikes, isPending } = useQuery({
    queryKey: ["comment-likes", comment.id],
    queryFn: () => getCommentLikes(comment.id, token || ""),
  });

  return isPending ? (
    <Loader />
  ) : (
    <div className="comment">
      <div className="flex">
        <img
          src={comment.user.profilePicture}
          alt={comment.user.name}
          className="w-8 h-8 rounded-full object-cover"
        />
        <div className="ml-2 flex-1">
          <div className="bg-gray-100 rounded-lg px-3 py-2 relative">
            <div className="font-medium text-sm">{comment.user.name}</div>
            {isCommentUpdating ? (
              <div className="relative">
                <input
                  className="my-2 bg-white px-2 py-1 rounded-lg w-full outline-none text-sm"
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                />
                <button
                  className="top-1/2 -translate-y-1/2 right-2 text-gray-600 absolute text-sm cursor-pointer p-1"
                  onClick={() => updateComment()}
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="text-sm">{comment.content}</div>
            )}

            <div className="absolute top-2 right-2">
              <DropdownMenu>
                <DropdownMenuTrigger className="outline-none">
                  <Ellipsis className="w-5 h-5 cursor-pointer outline-0" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => setIsCommentUpdating(true)}
                  >
                    <span>Edit</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => deleteComment()}
                  >
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="flex items-center mt-1 text-xs text-gray-500 space-x-3">
            <button
              className={`font-medium cursor-pointer outline-none ${
                commentLikes.find(
                  (commentLike: Like) => commentLike.user.id == user?.id
                )
                  ? "text-red-500"
                  : "hover:text-gray-700"
              }`}
              onClick={() => {
                let like = commentLikes.find(
                  (commentLike: Like) => commentLike.user.id == user?.id
                );
                if (like) {
                  removeCommentLike(like.id);
                } else addCommentLike();
              }}
            >
              Like
            </button>
            <button
              className="font-medium hover:text-gray-700 cursor-pointer"
              onClick={() => setIsReplying(!isReplying)}
            >
              Reply
            </button>
            <span>{getTimeAgo(comment.createdAt)}</span>
            {commentLikes.length > 0 && (
              <div className="flex items-center">
                <HeartIcon
                  size={12}
                  className="fill-red-500 text-red-500 mr-1"
                />
                <span>{commentLikes.length}</span>
              </div>
            )}
          </div>
          <ReplySection isReplying={isReplying} commentId={comment.id} />
        </div>
      </div>
    </div>
  );
}
