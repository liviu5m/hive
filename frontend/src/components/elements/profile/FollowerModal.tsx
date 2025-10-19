import { FollowRequest } from "@/lib/Types";
import { X } from "lucide-react";
import UserFollowStatusCard from "./UserFollowStatusCard";

const FollowerModal = ({
  setFollowerModal,
  followers,
}: {
  setFollowerModal: (e: boolean) => void;
  followers: FollowRequest[];
}) => {
  if (followers.length == 0) setFollowerModal(false);

  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-black/50 z-50">
      <div className="flex items-center justify-center h-screen">
        <div className="bg-white w-[600px] p-10 rounded-lg shadow z-20 flex flex-col items-center justify-center">
          <div className="flex items-center justify-between text-lg w-full">
            <h1 className="font-semibold text-2xl">Follow Requests</h1>
            <X
              className="text-red-500 hover:rotate-180 hover:scale-110 cursor-pointer"
              onClick={() => setFollowerModal(false)}
            />
          </div>
          <div className="w-full mt-5">
            {followers.map((request: FollowRequest, i: number) => {
              return (
                <UserFollowStatusCard
                  user={request.follower}
                  key={i}
                  type={"follower"}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FollowerModal;
