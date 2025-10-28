import { Link, useLocation, useParams } from "react-router-dom";
import PostCard from "../elements/post/PostCard";
import BodyLayout from "../layouts/BodyLayout";
import { useQuery } from "@tanstack/react-query";
import { getPostsById } from "@/api/post";
import { useAppContext } from "@/lib/AppContext";
import Loader from "../elements/Loader";
import { ArrowLeft } from "lucide-react";

const Post = () => {
  const { id } = useParams<{ id: string }>();
  const { token } = useAppContext();
  const location = useLocation();
  const fromPage = location.state?.from;

  const { data: post, isPending } = useQuery({
    queryKey: ["post", id],
    queryFn: () => getPostsById(Number(id), token || ""),
  });

  return isPending ? (
    <Loader />
  ) : (
    <BodyLayout>
      <div className="flex justify-center relative w-[700px] mt-20">
        <Link
          className="absolute top-0 -left-14 cursor-pointer p-1"
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
