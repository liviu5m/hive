import { useState } from "react";
import { CommentCard } from "./CommentCard.tsx";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addCommentApi } from "@/api/comment.ts";
import { useAppContext } from "@/lib/AppContext.tsx";
import { Comment } from "@/lib/Types.ts";

interface CommentSectionProps {
  comments: Comment[];
  postId: number;
  commentPage: number;
  setCommentPage: (e: number) => void;
  totalPages: number;
  totalElements: number;
}
export function CommentSection({
  comments,
  postId,
  commentPage,
  setCommentPage,
  totalPages,
  totalElements,
}: CommentSectionProps) {
  const [newComment, setNewComment] = useState("");
  const queryClient = useQueryClient();
  const { user, token } = useAppContext();

  const { mutate: addComment } = useMutation({
    mutationKey: ["add-comment"],
    mutationFn: () =>
      addCommentApi(postId, user?.id || -1, newComment, token || ""),
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({
        queryKey: ["post-comments", postId, commentPage],
      });
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
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-sm font-medium cursor-pointer ${
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
        </div>
      )}
      <div className="px-4 py-2 space-y-4 max-h-96 overflow-y-auto">
        {comments.map((comment: Comment) => (
          <CommentCard key={comment.id} comment={comment} />
        ))}
        {totalPages > 1 && (
          <div className="text-center py-2">
            <button
              className="px-4 py-2 bg-gray-100 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
              onClick={() => {
                if (commentPage < totalPages - 1)
                  setCommentPage(commentPage + 1);
                else setCommentPage(commentPage - 1);
              }}
            >
              {commentPage < totalPages - 1 ? "Show More" : "Show Less"}{" "}
              Comments
            </button>
          </div>
        )}
        {totalPages > 1 && (
          <div className="text-center text-sm text-gray-500 py-1">
            Showing {comments.length} of {totalElements} comments
          </div>
        )}
      </div>
    </div>
  );
}
