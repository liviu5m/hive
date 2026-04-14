import { keepPreviousData, useQuery } from "@tanstack/react-query";
import BodyLayout from "../layouts/BodyLayout";
import { getPosts } from "@/api/post";
import { useAppContext } from "@/lib/AppContext";
import { Post } from "@/lib/Types";
import PostCard from "../elements/post/PostCard";
import Loader from "../elements/Loader";
import { useState } from "react";

const Home = () => {
  const { user } = useAppContext();
  const [search, setSearch] = useState("");

  const {
    data: posts,
    isPending,
    error,
  } = useQuery({
    queryKey: ["posts", search],
    queryFn: () => getPosts(search),
    placeholderData: keepPreviousData,
  });

  return isPending ? (
    <Loader />
  ) : (
    <BodyLayout>
      <div className="w-full max-w-3xl mx-auto mt-5 pb-20 lg:pb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Feed</h1>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl px-5 py-3 border border-gray-200 shadow bg-white mt-5 outline-none"
        />
        <div className="flex flex-col gap-5 md:gap-7 my-8 md:my-10">
          {posts.map((post: Post, i: number) => {
            return <PostCard key={i} post={post} />;
          })}
        </div>
        {posts.length == 0 && (
          <p className="text-center font-semibold text-lg">No Posts</p>
        )}
      </div>
    </BodyLayout>
  );
};

export default Home;
