import { Post } from "@/lib/Types";
import { Image } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProfilePosts = ({ posts, userId }: { posts: Post[]; userId: number }) => {
  const navigate = useNavigate();

  return (
    <>
      {posts && posts.length > 0 ? (
        <div className="w-full max-w-4xl bg-white rounded-lg shadow mt-6 md:mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5 p-4 md:p-5">
          {posts.map((post: Post, i: number) => {
            return (
              <div
                key={i}
                onClick={() =>
                  navigate(`/post/${post.id}`, {
                    state: { from: `/profile/${userId}` },
                  })
                }
                className="w-full h-[180px] sm:h-[210px] md:h-[230px]"
              >
                {post.images && JSON.parse(post.images).length > 0 ? (
                  <img
                    src={JSON.parse(post.images)[0]}
                    className="cursor-pointer hover:shadow rounded-lg w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full w-full bg-gray-100 rounded-lg cursor-pointer">
                    <Image className="w-30 h-30" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="w-full max-w-4xl mt-6 md:mt-10 p-5 text-center">
          No posts available.
        </div>
      )}
    </>
  );
};

export default ProfilePosts;
