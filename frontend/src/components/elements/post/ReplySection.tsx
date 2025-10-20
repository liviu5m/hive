import { addReplyApi, getRepliesByCommentId } from "@/api/reply";
import { useAppContext } from "@/lib/AppContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Loader from "../Loader";
import { Reply } from "@/lib/Types";
import { getReplyLikesByCommentId } from "@/api/replyLike";
import ReplyCard from "./ReplyCard";

const ReplySection = ({
  isReplying,
  commentId,
}: {
  isReplying: boolean;
  commentId: number;
}) => {
  const { user, token } = useAppContext();
  const [replyContent, setReplyContent] = useState("");
  const [showReplies, setShowReplies] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: addReply } = useMutation({
    mutationKey: ["add-reply"],
    mutationFn: () =>
      addReplyApi(replyContent, user?.id || -1, commentId, token || ""),
    onSuccess: (data) => {
      console.log(data);
      setReplyContent("");
      queryClient.invalidateQueries({ queryKey: ["comment-reply", commentId] });
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const { data: replies, isPending } = useQuery({
    queryKey: ["comment-reply", commentId],
    queryFn: () => getRepliesByCommentId(commentId, token || ""),
  });

  return (
    !isPending && (
      <div>
        {isReplying && (
          <form
            className="mt-2 flex"
            onSubmit={(e) => {
              e.preventDefault();
              addReply();
            }}
          >
            <img
              src={user?.profilePicture}
              alt="Current User"
              className="w-6 h-6 rounded-full object-cover mr-2"
            />
            <div className="flex-1 relative">
              <input
                type="text"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                className="w-full py-1 px-3 text-sm bg-gray-100 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={!replyContent.trim()}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-xs font-medium cursor-pointer ${
                  replyContent.trim() ? "text-blue-500" : "text-gray-400"
                }`}
              >
                Reply
              </button>
            </div>
          </form>
        )}
        {replies.length > 0 && (
          <button
            className="mt-1 text-xs text-blue-500 font-medium flex items-center cursor-pointer"
            onClick={() => setShowReplies(!showReplies)}
          >
            {showReplies
              ? "Hide replies"
              : `Show ${replies.length} ${
                  replies.length === 1 ? "reply" : "replies"
                }`}
          </button>
        )}
        {showReplies && replies.length > 0 && (
          <div className="mt-2 space-y-3 pl-2 border-l-2 border-gray-100">
            {replies.map((reply: Reply, i: number) => {
              return <ReplyCard reply={reply} key={i} />;
            })}
          </div>
        )}
      </div>
    )
  );
};

export default ReplySection;
