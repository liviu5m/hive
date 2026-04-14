import React, { useState } from "react";
import BodyLayout from "../layouts/BodyLayout";
import { SearchIcon } from "lucide-react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAllUsers } from "@/api/user";
import { useAppContext } from "@/lib/AppContext";
import { FollowRequest, User } from "@/lib/Types";
import UserCard from "../elements/UserCard";
import Loader from "../elements/Loader";
import PaginationSystem from "../elements/PaginationSystem";
import { getFollowRequestByIds } from "@/api/followRequest";

const Discover = () => {
  const { user } = useAppContext();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  const { data: users, isPending } = useQuery({
    queryKey: ["user-discover", search, currentPage],
    queryFn: () => getAllUsers(search, pageSize, currentPage),
    placeholderData: keepPreviousData,
  });
  const { data: followRequests, isPending: isPendingCheck } = useQuery({
    queryKey: ["following", user?.id],
    queryFn: () => getFollowRequestByIds(user?.id || -1),
  });

  return isPending || isPendingCheck ? (
    <Loader />
  ) : (
    <BodyLayout>
      <div className="w-full max-w-5xl mx-auto mt-5 pb-20 lg:pb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Discover People</h1>
        <p className="mt-3">
          Connect with amazing people and grow your network
        </p>
        <div className="bg-white shadow mt-5 rounded-lg p-5">
          <div className="relative">
            <SearchIcon className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-600" />
            <input
              type="text"
              className="w-full px-5 py-3 rounded-lg border border-gray-200 outline-none indent-7"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="mt-8 md:mt-10 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {users.content.map((user: User, i: number) => {
            return (
              <UserCard
                user={user}
                request={followRequests.find(
                  (req: FollowRequest) => req.following.id == user.id,
                )}
                key={i}
              />
            );
          })}
        </div>
        <div className="mt-10">
          <PaginationSystem
            currentPage={currentPage}
            totalPages={users.totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
        {users.content.length == 0 && (
          <p className="mt-10 text-center text-lg font-semibold">No Users</p>
        )}
      </div>
    </BodyLayout>
  );
};

export default Discover;
