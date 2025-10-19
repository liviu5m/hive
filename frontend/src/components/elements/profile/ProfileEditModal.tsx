import { uploadImageOnCloudinary } from "@/api/upload";
import { updateUser } from "@/api/user";
import { useAppContext } from "@/lib/AppContext";
import { UserDto } from "@/lib/Types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Camera } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

type Picture = {
  file: File | null;
  previewUrl: string;
  hover: boolean;
};

const ProfileEditModal = ({
  setEditModal,
}: {
  setEditModal: (e: boolean) => void;
}) => {
  const { user, token, setUser } = useAppContext();
  const queryClient = useQueryClient();
  const [profilePicture, setProfilePicture] = useState<Picture>({
    file: null,
    previewUrl: "",
    hover: false,
  });
  const [coverPicture, setCoverPicture] = useState<Picture>({
    file: null,
    previewUrl: "",
    hover: false,
  });
  const [userData, setUserData] = useState({
    profilePicture: user?.profilePicture || "",
    coverPicture: user?.coverPicture || "",
    name: user?.name || "",
    username: user?.username || "",
    bio: "",
    location: "",
  });

  const { mutate: updateUserData } = useMutation({
    mutationKey: ["update-user"],
    mutationFn: (userData: UserDto) =>
      updateUser(user?.id || -1, userData, token || ""),
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({ queryKey: ["logged-user", token] });
      toast("User updated successfully");
      setEditModal(false);
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const { mutate: uploadProfileImage, isPending: isProfileImagePending } =
    useMutation({
      mutationKey: ["upload-image"],
      mutationFn: (file: File | null) =>
        uploadImageOnCloudinary(file, token || ""),
      onSuccess: (data) => {
        setUserData({ ...userData, profilePicture: data });
        console.log(data);
      },
      onError: (err) => {
        console.log(err);
      },
    });

  const { mutate: uploadCoverImage, isPending: isCoverImagePending } =
    useMutation({
      mutationKey: ["upload-image"],
      mutationFn: (file: File | null) =>
        uploadImageOnCloudinary(file, token || ""),
      onSuccess: (data) => {
        setUserData({ ...userData, coverPicture: data });
      },
      onError: (err) => {
        console.log(err);
      },
    });

  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-black/50 z-50">
      <div className="flex items-center justify-center h-screen">
        <div className="bg-white w-[600px] p-10 rounded-lg shadow z-20 flex flex-col items-center justify-center">
          <div className="flex items-center justify-between text-lg w-full">
            <h1 className="font-semibold text-2xl">Edit Profile</h1>
          </div>
          <form
            className="w-full mt-5"
            onSubmit={(e) => {
              e.preventDefault();

              updateUserData(userData);
            }}
          >
            <div>
              <label htmlFor="">Profile Picture</label>
              <div className="flex items-center justify-start">
                <label
                  htmlFor="profilePicture"
                  className="relative inline-block mt-2 cursor-pointer"
                  onMouseEnter={() =>
                    setProfilePicture({ ...profilePicture, hover: true })
                  }
                  onMouseLeave={() =>
                    setProfilePicture({ ...profilePicture, hover: false })
                  }
                >
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="profilePicture"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const objectUrl = URL.createObjectURL(file);
                        setProfilePicture({
                          ...profilePicture,
                          previewUrl: objectUrl,
                          file,
                        });
                        uploadProfileImage(file);
                      }
                    }}
                  />
                  <img
                    src={
                      profilePicture.previewUrl
                        ? profilePicture.previewUrl
                        : userData.profilePicture
                    }
                    className="w-[100px] aspect-square object-cover rounded-full"
                  />
                  <div
                    className={`
                    absolute inset-0 w-[100px] h-[100px] bg-black bg-opacity-50 rounded-full 
                    flex items-center justify-center transition-opacity duration-300
                    ${profilePicture.hover ? "opacity-80" : "opacity-0"}
                  `}
                  >
                    <Camera className="text-white w-6 h-6" />
                  </div>
                </label>
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="">Cover Picture</label>
              <label
                htmlFor="coverPicture"
                className="relative inline-block mt-2 cursor-pointer w-full"
                onMouseEnter={() =>
                  setCoverPicture({ ...coverPicture, hover: true })
                }
                onMouseLeave={() =>
                  setCoverPicture({ ...coverPicture, hover: false })
                }
              >
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="coverPicture"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const objectUrl = URL.createObjectURL(file);
                      setCoverPicture({
                        ...coverPicture,
                        previewUrl: objectUrl,
                        file,
                      });
                      uploadCoverImage(file);
                    }
                  }}
                />
                <img
                  src={
                    coverPicture.previewUrl
                      ? coverPicture.previewUrl
                      : userData.coverPicture
                  }
                  className="w-full h-[150px] object-cover rounded-2xl"
                />
                <div
                  className={`
                    absolute inset-0 w-full h-[150px] bg-black bg-opacity-50 rounded-2xl
                    flex items-center justify-center transition-opacity duration-300
                    ${coverPicture.hover ? "opacity-80" : "opacity-0"}
                  `}
                >
                  <Camera className="text-white w-6 h-6" />
                </div>
              </label>
            </div>

            <div className="mt-4">
              <label htmlFor="name" className="text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-5 py-3 rounded-lg border border-gray-200 outline-none mt-2"
                placeholder="Enter your name"
                value={userData.name}
                onChange={(e) =>
                  setUserData({ ...userData, name: e.target.value })
                }
              />
            </div>

            <div className="mt-4">
              <label htmlFor="username" className="text-gray-700">
                Username
              </label>
              <input
                type="text"
                id="username"
                className="w-full px-5 py-3 rounded-lg border border-gray-200 outline-none mt-2"
                placeholder="Enter your username"
                value={userData.username}
                onChange={(e) =>
                  setUserData({ ...userData, username: e.target.value })
                }
              />
            </div>

            <div className="mt-4">
              <label htmlFor="bio" className="text-gray-700">
                Bio
              </label>
              <textarea
                id="bio"
                className="w-full px-5 py-3 rounded-lg border border-gray-200 outline-none mt-2 h-24 resize-none"
                placeholder="Enter your bio"
                value={userData.bio}
                onChange={(e) =>
                  setUserData({ ...userData, bio: e.target.value })
                }
              ></textarea>
            </div>

            <div className="mt-4">
              <label htmlFor="location" className="text-gray-700">
                Location
              </label>
              <input
                type="text"
                id="location"
                className="w-full px-5 py-3 rounded-lg border border-gray-200 outline-none mt-2"
                placeholder="Please Enter your location"
                value={userData.location}
                onChange={(e) =>
                  setUserData({ ...userData, location: e.target.value })
                }
              />
            </div>

            <div className="flex items-center justify-end mt-6">
              <button
                className="flex items-center justify-center border border-gray-200 gap-3 px-4 py-2 rounded-lg font-semibold w-fit mr-5 hover:bg-gray-50"
                onClick={(e) => {
                  e.preventDefault();
                  setEditModal(false);
                }}
              >
                Cancel
              </button>
              <button
                className={`flex items-center justify-center text-white gap-3 px-4 py-2 rounded-lg font-semibold bg-gradient-to-r from-cyan-500 to-blue-500 w-fit hover:opacity-90 ${
                  isCoverImagePending || (isProfileImagePending && "opacity-10")
                }`}
                type="submit"
                disabled={isCoverImagePending || isProfileImagePending}
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditModal;
