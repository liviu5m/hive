import React, { useEffect, useState } from "react";
import { CommentCard } from "./CommentCard.tsx";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addCommentApi, getCommentsByPostId } from "@/api/comment.ts";
import { useAppContext } from "@/lib/AppContext.tsx";
import { Comment } from "@/lib/Types.ts";
import Loader from "../Loader.tsx";

interface CommentSectionProps {
  comments: Comment[];
  postId: number;
}
export function CommentSection({ comments, postId }: CommentSectionProps) {
  const [newComment, setNewComment] = useState("");
  const queryClient = useQueryClient();
  const { user, token } = useAppContext();

  const { mutate: addComment } = useMutation({
    mutationKey: ["add-comment"],
    mutationFn: () =>
      addCommentApi(postId, user?.id || -1, newComment, token || ""),
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({ queryKey: ["post-comments"] });
      setNewComment("");
    },
    onError: (err) => {
      console.log(err);
    },
  });

  return (
    <div className="border-t border-gray-100 pt-2 mt-4">
      <form
        className="px-4 py-2 flex"
        onSubmit={(e) => {
          e.preventDefault();
          addComment();
        }}
      >
        <img
          src={user?.profilePicture}
          alt="Current User"
          className="w-8 h-8 rounded-full object-cover mr-2"
        />
        <div className="flex-1 relative">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full py-2 px-3 bg-gray-100 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!newComment.trim()}
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-sm font-medium ${
              newComment.trim() ? "text-blue-500" : "text-gray-400"
            }`}
          >
            Post
          </button>
        </div>
      </form>
      {comments.length > 0 && (
        <div className="px-4 py-2 flex justify-between items-center border-b border-gray-100">
          <span className="text-sm text-gray-500">
            {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
          </span>
          <div className="flex items-center">
            <label
              htmlFor="sort-comments"
              className="text-sm text-gray-500 mr-2"
            >
              Sort by:
            </label>
            <select
              id="sort-comments"
              className="text-sm bg-transparent border-none focus:outline-none text-gray-700"
            >
              <option value="recent">Most Recent</option>
              <option value="likes">Most Likes</option>
            </select>
          </div>
        </div>
      )}
      <div className="px-4 py-2 space-y-4 max-h-96 overflow-y-auto">
        {comments.map((comment: Comment) => (
          <CommentCard key={comment.id} comment={comment} />
        ))}
        {1 && (
          <div className="text-center py-2">
            <button className="px-4 py-2 bg-gray-100 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors">
              Load More Comments
            </button>
          </div>
        )}
        {1 && (
          <div className="text-center text-sm text-gray-500 py-1">
            Showing {1} of {comments.length} comments
          </div>
        )}
      </div>
    </div>
  );
}
