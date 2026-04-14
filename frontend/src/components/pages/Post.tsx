import { Link, useLocation, useParams } from "react-router-dom";
import PostCard from "../elements/post/PostCard";
import BodyLayout from "../layouts/BodyLayout";
import { useQuery } from "@tanstack/react-query";
import { getPostsById } from "@/api/post";
import Loader from "../elements/Loader";
import { ArrowLeft } from "lucide-react";

const Post = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const fromPage = location.state?.from;

  const { data: post, isPending } = useQuery({
    queryKey: ["post", id],
    queryFn: () => getPostsById(Number(id)),
  });

  return isPending ? (
    <Loader />
  ) : (
    <BodyLayout>
      <div className="flex justify-center relative w-full max-w-3xl mx-auto mt-6 md:mt-10 pb-20 lg:pb-6">
        <Link
          className="absolute -top-10 left-0 md:top-0 md:-left-14 cursor-pointer p-1"
          to={fromPage}
        >
          <ArrowLeft />
        </Link>
        <PostCard post={post} />
      </div>
    </BodyLayout>
  );
};

export default Post;
