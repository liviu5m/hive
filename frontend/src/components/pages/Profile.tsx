import {
  Calendar,
  Edit,
  LocationEdit,
  MessageSquareShare,
  Share,
  UserPlusIcon,
} from "lucide-react";
import BodyLayout from "../layouts/BodyLayout";
import { useAppContext } from "@/lib/AppContext";
import { useState } from "react";
import ProfileEditModal from "../elements/profile/ProfileEditModal";
import { getTimeAgo } from "@/lib/utils";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserById } from "@/api/user";
import Loader from "../elements/Loader";
import FollowRequestModal from "../elements/profile/FollowRequestModal";
import {
  createFollowRequest,
  deleteFollowRequest,
  getFollowRequests,
} from "@/api/followRequest";
import FollowerModal from "../elements/profile/FollowerModal";
import FollowingModal from "../elements/profile/FollowingModal";
import ProfilePosts from "../elements/profile/ProfilePosts";

const Profile = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { user, token } = useAppContext();
  const [page, setPage] = useState("posts");
  const [editModal, setEditModal] = useState(false);
  const [followRequestModal, setFollowRequestModal] = useState(false);
  const [followerModal, setFollowerModal] = useState(false);
  const [followingModal, setFollowingModal] = useState(false);
  const navigate = useNavigate();

  const { data: userData, isPending } = useQuery({
    queryKey: ["profile-user", id],
    queryFn: () => getUserById(Number(id), token || ""),
  });

  const { data: followingData, isPending: isPendingFollowingData } = useQuery({
    queryKey: ["following-data", id],
    queryFn: () => getFollowRequests(Number(id), -1, "ACCEPTED", token || ""),
  });

  const { data: followerData, isPending: isPendingFollowerData } = useQuery({
    queryKey: ["follower-data", id],
    queryFn: () => getFollowRequests(-1, Number(id), "ACCEPTED", token || ""),
  });

  const { data: requests, isPending: isPendingRequests } = useQuery({
    queryKey: ["profile-follow-requests", user?.id],
    queryFn: () => getFollowRequests(-1, Number(id), "PENDING", token || ""),
  });

  const { data: followRequest, isPending: isPendingFollowRequest } = useQuery({
    queryKey: ["follow-request-profile", id],
    queryFn: () =>
      getFollowRequests(user?.id || -1, Number(id), null, token || ""),
  });

  const { mutate: createRequest, isPending: isCreating } = useMutation({
    mutationKey: ["create-follow-request"],
    mutationFn: () =>
      createFollowRequest(user?.id || -1, Number(id), token || ""),
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({ queryKey: ["follow-request-profile"] });
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const { mutate: deleteRequest, isPending: isDeleting } = useMutation({
    mutationKey: ["delete-follow-request"],
    mutationFn: () =>
      deleteFollowRequest(user?.id || -1, Number(id), token || ""),
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({ queryKey: ["follow-request-profile"] });
    },
    onError: (err) => {
      console.log(err);
    },
  });

  return isPending ||
    isPendingFollowingData ||
    isPendingFollowerData ||
    isPendingRequests ||
    isPendingFollowRequest ? (
    <Loader />
  ) : (
    <BodyLayout>
      <div className="w-[700px] mt-10 relative">
        <div className="bg-white w-full rounded-2xl shadow">
          <div
            className="cover h-[200px] rounded-t-2xl bg-cover bg-center bg-no-repeat bg-gray-200"
            style={
              userData?.coverPicture
                ? { backgroundImage: `url(${userData?.coverPicture})` }
                : {}
            }
          ></div>
          <div className="flex">
            <div className="px-10 absolute top-[140px]">
              <img
                src={userData?.profilePicture}
                className="rounded-full w-[120px] aspect-square object-cover border-2 border-white shadow-lg"
              />
            </div>
            <div className="w-[200px]"></div>
            <div className="py-5 w-full p-10">
              <div className="flex justify-between w-full border-b border-b-gray-200 pb-3 flex-col">
                <div>
                  <h1 className="text-2xl font-bold">{userData?.name}</h1>
                  <h4 className="text-gray-600">@{userData?.username}</h4>
                  <p className="text-sm mt-5">{userData.bio}</p>
                  <div className="flex items-center gap-10 mt-2">
                    <div className="flex items-center text-gray-600 text-sm gap-2 mt-2">
                      <LocationEdit className="w-5" />
                      <span>
                        {userData?.location
                          ? userData.location
                          : "Add Location"}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600 text-sm gap-2 mt-2">
                      <Calendar className="w-5" />
                      <h2>
                        Joined{" "}
                        <span className="font-bold">
                          {getTimeAgo(userData?.createdAt || "")}
                        </span>
                      </h2>
                    </div>
                  </div>
                </div>
                <div className="absolute right-10">
                  {user?.id == id ? (
                    <div className="flex items-center justify-center gap-3">
                      <button
                        className="px-4 py-2 rounded-lg border border-gray-400 font-semibold flex items-center justify-center gap-3 cursor-pointer hover:bg-gray-50"
                        onClick={() => setEditModal(true)}
                      >
                        <Edit />
                        <span>Edit</span>
                      </button>
                      <button
                        className="p-3 cursor-pointer text-[#4F39F6] rounded-lg hover:bg-[#00B6DC] hover:text-white relative"
                        onClick={() => setFollowRequestModal(true)}
                      >
                        <MessageSquareShare />
                        <p className="bg-red-500 w-5 h-5 rounded-full text-white flex items-center justify-center text-sm font-[500] absolute right-0 top-0">
                          {requests.length}
                        </p>
                      </button>
                    </div>
                  ) : (
                    <h1></h1>
                  )}
                </div>
                {user?.id != id && (
                  <div className="mt-3">
                    <button
                      className={`font-semibold px-14 py-2 rounded-lg  cursor-pointer ${
                        !followRequest[0] ||
                        (followRequest[0] &&
                          followRequest[0].status != "ACCEPTED")
                          ? "text-white bg-[#4F39F6] border border-[#4F39F6] hover:text-[#4F39F6] hover:bg-white"
                          : "text-[#4F39F6] bg-white border border-[#4F39F6] hover:text-white hover:bg-[#4F39F6]"
                      }`}
                      onClick={() => {
                        if (!followRequest[0]) createRequest();
                        else deleteRequest();
                      }}
                    >
                      {!followRequest[0]
                        ? "Follow"
                        : followRequest[0].status == "PENDING"
                        ? "Pending"
                        : "Following"}
                    </button>
                    <button
                      className="ml-5font-semibold px-14 py-2 rounded-lg cursor-pointer bg-gray-200 text-gray-600 ml-5 border-gray-200 border hover:text-gray-200 hover:bg-gray-600"
                      onClick={() => {
                        navigate("/messages", { state: { user: userData } });
                      }}
                    >
                      Message
                    </button>
                  </div>
                )}
              </div>

              <div className="pt-5 flex items-center gap-7">
                <h4 className="text-gray-600 flex items-center gap-2">
                  <span className="text-black font-bold text-xl">0</span>
                  Posts
                </h4>
                <h4
                  className="text-gray-600 flex items-center gap-2 cursor-pointer"
                  onClick={() => setFollowerModal(true)}
                >
                  <span className="text-black font-bold text-xl">
                    {followerData.length}
                  </span>
                  Followers
                </h4>
                <h4
                  className="text-gray-600 flex items-center gap-2 cursor-pointer"
                  onClick={() => setFollowingModal(true)}
                >
                  <span className="text-black font-bold text-xl">
                    {followingData.length}
                  </span>
                  Following
                </h4>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-10">
          <div className="flex items-center justify-center flex-col">
            <div className="bg-white p-1 rounded-lg shadow flex items-center">
              <h3
                className={`cursor-pointer px-14 py-2 rounded-lg text-sm font-[500] ${
                  page == "posts" ? "bg-[#4F39F6] text-white" : "text-gray-600"
                }`}
                onClick={() => setPage("posts")}
              >
                Posts
              </h3>
              <h3
                className={`cursor-pointer px-14 py-2 rounded-lg text-sm font-[500] ${
                  page == "media" ? "bg-[#4F39F6] text-white" : "text-gray-600"
                }`}
                onClick={() => setPage("media")}
              >
                Media
              </h3>
              <h3
                className={`cursor-pointer px-14 py-2 rounded-lg text-sm font-[500] ${
                  page == "likes" ? "bg-[#4F39F6] text-white" : "text-gray-600"
                }`}
                onClick={() => setPage("likes")}
              >
                Likes
              </h3>
            </div>
            {page == "posts" && <ProfilePosts userId={Number(id)} />}
          </div>
        </div>
        {editModal && <ProfileEditModal setEditModal={setEditModal} />}
        {followRequestModal && (
          <FollowRequestModal
            setFollowRequestModal={setFollowRequestModal}
            requests={requests}
          />
        )}
        {followerModal && (
          <FollowerModal
            setFollowerModal={setFollowerModal}
            followers={followerData}
          />
        )}
        {followingModal && (
          <FollowingModal
            setFollowingModal={setFollowingModal}
            following={followingData}
          />
        )}
      </div>
    </BodyLayout>
  );
};

export default Profile;
