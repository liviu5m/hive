import { getPostsByUserId } from "@/api/post";
import { useAppContext } from "@/lib/AppContext";
import { Post } from "@/lib/Types";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";

const ProfilePosts = ({ userId }: { userId: number }) => {
  const { token } = useAppContext();
  const navigate = useNavigate();
  const { data: posts, isPending } = useQuery({
    queryKey: ["post-profile", userId],
    queryFn: () => getPostsByUserId(userId, token || ""),
  });

  return (
    !isPending && (
      <div className="w-[700px] bg-white rounded-lg shadow mt-10 grid grid-cols-3 gap-5 p-5">
        {posts.map((post: Post) => {
          return (
            <div
              onClick={() =>
                navigate(`/post/${post.id}`, {
                  state: { from: `/profile/${userId}` },
                })
              }
            >
              <img
                src={JSON.parse(post.images)[0]}
                className="cursor-pointer hover:shadow rounded-lg"
              />
            </div>
          );
        })}
      </div>
    )
  );
};

export default ProfilePosts;
