import { Like, Post } from "@/lib/Types";
import { getTimeAgo } from "@/lib/utils";
import { useEffect, useState } from "react";
import ImageCarouselModal from "./ImageCarouselModal";
import { Heart, MessageCircle } from "lucide-react";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { addLikeApi, getLikesByPostId, removeLikeApi } from "@/api/like";
import { useAppContext } from "@/lib/AppContext";
import { CommentSection } from "./CommentingSection";
import Loader from "../Loader";
import {
  getCommentsAndRepliesByPostId,
  getCommentsByPostId,
} from "@/api/comment";
import { Link } from "react-router-dom";

const PostCard = ({ post }: { post: Post }) => {
  const { user } = useAppContext();
  const queryClient = useQueryClient();
  const images = JSON.parse(post.images);
  const [isCarouselOpened, setIsCarouselOpened] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const [commentPage, setCommentPage] = useState(0);
  const commentPageSize = 10;

  const { data: likes, isPending: isPendingLikes } = useQuery({
    queryKey: ["post-likes", post.id],
    queryFn: () => getLikesByPostId(post.id),
  });
  const [isLiked, setIsLiked] = useState(
    likes ? likes.find((like: Like) => like.user.id == user?.id) : null,
  );
  const [isLiking, setIsLiking] = useState(false);
  const [totalLikes, setTotalLikes] = useState(likes ? likes.length : 0);

  useEffect(() => {
    setIsLiked(
      likes ? likes.find((like: Like) => like.user.id == user?.id) : null,
    );
    setTotalLikes(likes ? likes.length : 0);
  }, [likes]);

  const { data: comments, isPending: isPendingComment } = useQuery({
    queryKey: ["post-comments", post.id, commentPage],
    queryFn: () => getCommentsByPostId(post.id, commentPage, commentPageSize),
    placeholderData: keepPreviousData,
  });

  const { mutate: addLike, isPending: isAddingLike } = useMutation({
    mutationFn: () => addLikeApi(post.id, user?.id || -1),
    onSuccess: (data) => {
      setIsLiked(data);
      queryClient.invalidateQueries({ queryKey: ["post-likes", post.id] });
      setIsLiking(false);
    },
    onError: (err) => {
      setTotalLikes((prev: number) => prev - 1);
      setIsLiked(null);
      setIsLiking(false);
    },
  });

  const { mutate: removeLike, isPending: isRemovingLike } = useMutation({
    mutationFn: (likeId: number) => removeLikeApi(likeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post-likes", post.id] });
      setIsLiking(false);
    },
    onError: (err) => {
      setTotalLikes((prev: number) => prev + 1);
      setIsLiked(true);
      setIsLiking(false);
    },
  });

  const { data: commentsAndReplies, isPending: isCommentsCounterLoading } =
    useQuery({
      queryKey: ["comment-replies", post.id],
      queryFn: () => getCommentsAndRepliesByPostId(post.id),
    });

  return isPendingLikes || isPendingComment || isCommentsCounterLoading ? (
    <Loader />
  ) : (
    <div className="shadow p-5 rounded-lg bg-white w-full">
      <div className="flex items-center gap-4">
        <div>
          <Link to={"/profile/" + post.poster.id}>
            <img
              src={post.poster.profilePicture}
              alt=""
              className="rounded-full w-10 h-10 object-cover"
            />
          </Link>
        </div>
        <div>
          <Link
            to={"/profile/" + post.poster.id}
            className="text-lg font-semibold hover:text-[#4F39F6] cursor-pointer"
          >
            {post.poster.name}
          </Link>
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
            className={`grid gap-3 md:gap-4 mt-5 border-b border-gray-200 pb-6 md:pb-8 ${
              images.length >= 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"
            }`}
          >
            {images.length > 0 && (
              <div className="w-full">
                <img
                  src={images[0]}
                  className="aspect-square rounded-lg object-cover w-full"
                  alt="Post content 1"
                />
              </div>
            )}

            {images.length >= 2 && (
              <div className="relative w-full">
                <img
                  src={images[1]}
                  className="aspect-square rounded-lg object-cover w-full"
                  alt="Post content 2"
                />

                {images.length > 2 && (
                  <div
                    className="absolute inset-0 rounded-lg flex items-center justify-center text-white text-3xl font-bold bg-black/40 hover:bg-black/50 transition-colors cursor-pointer"
                    onClick={() => setIsCarouselOpened(true)}
                  >
                    <span>+{images.length - 1}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        <div className="flex items-center justify-start mt-5 gap-5 text-gray-600">
          <div className="flex items-center justify-center gap-2">
            <Heart
              onClick={() => {
                if (isAddingLike || isRemovingLike) return;

                if (isLiked) {
                  const currentLikeId = isLiked.id;
                  setIsLiked(null);
                  setTotalLikes((prev: number) => Math.max(0, prev - 1));
                  removeLike(currentLikeId);
                } else {
                  setIsLiked({ id: -1, user: user! });
                  setTotalLikes((prev: number) => prev + 1);
                  addLike();
                }
              }}
              className={`cursor-pointer transition-all ${isLiked ? "text-red-500 fill-red-500" : ""} ${isAddingLike || isRemovingLike ? "opacity-50 scale-95" : "scale-100"}`}
            />
            <h2 className="font-semibold">{totalLikes}</h2>
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
          <CommentSection
            comments={comments.content}
            postId={post.id}
            commentPage={commentPage}
            setCommentPage={setCommentPage}
            totalPages={comments.totalElements / commentPageSize}
            totalElements={comments.totalElements}
          />
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
