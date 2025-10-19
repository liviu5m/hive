import React, { useState } from "react";
import BodyLayout from "../layouts/BodyLayout";
import { SearchIcon } from "lucide-react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAllUsers } from "@/api/user";
import { useAppContext } from "@/lib/AppContext";
import { User } from "@/lib/Types";
import UserCard from "../elements/UserCard";
import Loader from "../elements/Loader";
import PaginationSystem from "../elements/PaginationSystem";

const Discover = () => {
  const [search, setSearch] = useState("");
  const { token } = useAppContext();
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  const { data: users, isPending } = useQuery({
    queryKey: ["user-discover", search, currentPage],
    queryFn: () => getAllUsers(search, token || "", pageSize, currentPage),
    placeholderData: keepPreviousData,
  });

  return isPending ? (
    <Loader />
  ) : (
    <BodyLayout>
      <div className="w-[1000px] mt-5">
        <h1 className="text-3xl font-bold">Discover People</h1>
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
        <div className="mt-10 grid grid-cols-2 gap-10">
          {users.content.map((user: User, i: number) => {
            return <UserCard user={user} key={i} />;
          })}
        </div>
        <div className="mt-10">
          <PaginationSystem
            currentPage={currentPage}
            totalPages={users.totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </BodyLayout>
  );
};

export default Discover;
