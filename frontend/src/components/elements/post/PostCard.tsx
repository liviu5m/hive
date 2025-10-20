import { Like, Post } from "@/lib/Types";
import { getTimeAgo } from "@/lib/utils";
import { useState } from "react";
import ImageCarouselModal from "./ImageCarouselModal";
import { Heart, MessageCircle } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addLikeApi, getLikesByPostId, removeLikeApi } from "@/api/like";
import { useAppContext } from "@/lib/AppContext";
import { CommentSection } from "./CommentingSection";
import Loader from "../Loader";
import {
  getCommentsAndRepliesByPostId,
  getCommentsByPostId,
} from "@/api/comment";

const PostCard = ({ post }: { post: Post }) => {
  const { user, token } = useAppContext();
  const queryClient = useQueryClient();
  const images = JSON.parse(post.images);
  const [isCarouselOpened, setIsCarouselOpened] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);

  const { data: likes, isPending: isPendingLikes } = useQuery({
    queryKey: ["post-likes", post.id],
    queryFn: () => getLikesByPostId(post.id, token || ""),
  });

  const { data: comments, isPending: isPendingComment } = useQuery({
    queryKey: ["post-comments", post.id],
    queryFn: () => getCommentsByPostId(post.id, token || ""),
  });

  const { mutate: addLike, isPending: isAddingLike } = useMutation({
    mutationFn: () => addLikeApi(post.id, user?.id || -1, token || ""),
    onMutate: () => {},
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post-likes"] });
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const { mutate: removeLike, isPending: isRemovingLike } = useMutation({
    mutationFn: (likeId: number) => removeLikeApi(likeId, token || ""),
    onMutate: () => {},
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post-likes"] });
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const { data: commentsAndReplies, isPending: isCommentsCounterLoading } =
    useQuery({
      queryKey: ["comment-replies", post.id],
      queryFn: () => getCommentsAndRepliesByPostId(post.id, token || ""),
    });

  return isPendingLikes || isPendingComment || isCommentsCounterLoading ? (
    <Loader />
  ) : (
    <div className="shadow p-5 rounded-lg bg-white">
      <div className="flex items-center gap-4">
        <div>
          <img
            src={post.poster.profilePicture}
            alt=""
            className="rounded-full w-10 h-10 object-cover"
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold">{post.poster.name}</h3>
          <h4 className="flex items-center gap-2 text-gray-600">
            <span>@{post.poster.username}</span>·
            <span>{getTimeAgo(post.createdAt)}</span>
          </h4>
        </div>
      </div>
      <div className="mt-3">
        <p>{post.content}</p>
        {images.length > 0 && (
          <div
            className={`grid ${
              images.length >= 2 && "grid-cols-2"
            } gap-10 mt-5 border-b border-gray-200 pb-8`}
          >
            <div>
              <img
                src={images[0]}
                className={`${
                  images.length == 0 && "w-full"
                } aspect-square rounded-lg object-cover`}
              />
            </div>
            <div className="relative">
              <img
                src={images[1]}
                className="aspect-square rounded-lg object-cover"
              />
              <div
                className="absolute w-full h-full rounded-lg top-0 left-0 flex items-center justify-center text-white text-3xl bg-black/30 cursor-pointer"
                onClick={() => setIsCarouselOpened(true)}
              >
                <h1>+2</h1>
              </div>
            </div>
          </div>
        )}
        <div className="flex items-center justify-start mt-5 gap-5 text-gray-600">
          <div className="flex items-center justify-center gap-2">
            <Heart
              onClick={() => {
                if (!isAddingLike && !isRemovingLike) {
                  let like = likes.find(
                    (like: Like) => like.user.id == user?.id
                  );

                  if (like) removeLike(like.id);
                  else addLike();
                }
              }}
              className={`cursor-pointer ${
                likes.find((like: Like) => like.user.id == user?.id)
                  ? "text-red-500"
                  : ""
              }`}
            />
            <h2 className="font-semibold">{likes.length}</h2>
          </div>
          <div className="flex items-center justify-center gap-2">
            <MessageCircle
              className={`cursor-pointer ${isCommenting && "text-blue-400"}`}
              onClick={() => setIsCommenting(!isCommenting)}
            />
            <h2 className="font-semibold">{commentsAndReplies}</h2>
          </div>
        </div>
        {isCommenting && (
          <CommentSection comments={comments} postId={post.id} />
        )}
      </div>
      {isCarouselOpened && (
        <ImageCarouselModal
          setImageCarouselModal={setIsCarouselOpened}
          images={images}
        />
      )}
    </div>
  );
};

export default PostCard;
