import { useQuery } from "@tanstack/react-query";
import BodyLayout from "../layouts/BodyLayout";
import { getPosts } from "@/api/post";
import { useAppContext } from "@/lib/AppContext";
import { Post } from "@/lib/Types";
import PostCard from "../elements/post/PostCard";
import Loader from "../elements/Loader";

const Home = () => {
  const { user, token } = useAppContext();

  const { data: posts, isPending, error } = useQuery({
    queryKey: ["post"],
    queryFn: () => getPosts(token || ""),
  });

  return isPending ? (
    <Loader />
  ) : (
    <BodyLayout>
      <div className="w-[1000px] mt-5">
        <h1 className="text-3xl font-bold">Feed</h1>
        <div className="flex flex-col gap-7 mt-10">
          {posts.map((post: Post, i: number) => {
            return <PostCard key={i} post={post} />;
          })}
        </div>
      </div>
    </BodyLayout>
  );
};

export default Home;
