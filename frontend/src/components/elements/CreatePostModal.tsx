import { createPostApi } from "@/api/post";
import { uploadImageOnCloudinary } from "@/api/upload";
import { useAppContext } from "@/lib/AppContext";
import { useMutation } from "@tanstack/react-query";
import { Image, X } from "lucide-react";
import { useEffect, useState } from "react";

type Picture = {
  previewUrl: string;
  file: File;
};

const CreatePostModal = ({
  setCreatePostModal,
}: {
  setCreatePostModal: (e: boolean) => void;
}) => {
  const { user, token } = useAppContext();
  const [content, setContent] = useState("");
  const [images, setImages] = useState<Picture[]>([]);
  const [imageResult, setImageResult] = useState<string[]>([]);

  const { mutate: createPost, isPending: isPostCreating } = useMutation({
    mutationKey: ["create-post"],
    mutationFn: () =>
      createPostApi(
        {
          posterId: user?.id || -1,
          content,
          images: JSON.stringify(imageResult),
        },
        token || ""
      ),
    onSuccess: (data) => {
      console.log(data);
      setCreatePostModal(false);
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const savePost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (images.length === 0) {
      createPost();
      return;
    }

    setImageResult([]);

    for (const image of images) {
      try {
        const result = await uploadImageOnCloudinary(image.file, token || "");
        setImageResult((prev) => [...prev, result]);
      } catch (err) {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    if (imageResult.length > 0 && imageResult.length === images.length) {
      createPost();
    }
  }, [imageResult, images.length]);

  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-black/50 z-50">
      <div className="flex items-center justify-center h-screen">
        <div className="bg-white w-[600px] p-10 rounded-lg shadow z-20 flex flex-col items-center justify-center">
          <div className="flex items-center justify-between text-lg w-full">
            <h1 className="font-semibold text-2xl">Create Post</h1>
            <X
              className="text-red-500 hover:rotate-180 hover:scale-110 cursor-pointer"
              onClick={() => setCreatePostModal(false)}
            />
          </div>
          <div className="w-full mt-8">
            <div className="flex items-center gap-5">
              <img
                src={user?.profilePicture}
                className="w-8 aspect-square object-cover rounded-full"
                alt=""
              />
              <h2 className="text-lg font-semibold">{user?.name}</h2>
            </div>
            <form className="mt-5" onSubmit={(e) => savePost(e)}>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="resize-none h-40 w-full p-5 border border-gray-200 rounded-lg outline-none"
                placeholder="What's on your mind ?"
              ></textarea>
              <div className="mt-5 p-5 border border-gray-200 rounded-lg flex flex-col overflow-y-scroll max-h-80">
                <div className="flex items-center justify-between w-full">
                  <div>
                    <h2 className="text-lg font-[500]">Add to your post</h2>
                  </div>
                  <div>
                    <label
                      htmlFor="profilePicture"
                      className="relative inline-block mt-2 cursor-pointer w-fit"
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
                            setImages([
                              ...images,
                              {
                                previewUrl: objectUrl,
                                file,
                              },
                            ]);
                          }
                        }}
                      />
                      <Image className="text-green-500 w-10 h-10 cursor-pointer p-2 hover:bg-gray-100 rounded-full" />
                    </label>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-10">
                  {images.map((image, i) => {
                    return (
                      <div className="relative" key={i}>
                        <img
                          src={image.previewUrl}
                          className="w-full h-full rounded-lg"
                        />
                        <X
                          className="text-red-500 absolute -top-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer"
                          onClick={() =>
                            setImages(
                              images.filter(
                                (img) => img.previewUrl != image.previewUrl
                              )
                            )
                          }
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="mt-5">
                <button
                  className={` ${
                    !content && images.length == 0
                      ? "bg-gray-50 text-gray-600 border border-gray-50"
                      : "hover:text-[#4F39F6] hover:bg-white border border-[#4F39F6] bg-[#4F39F6] text-white"
                  }  font-semibold w-full rounded-lg py-3 flex items-center justify-center gap-5 cursor-pointer`}
                >
                  {isPostCreating && (
                    <div className="w-5 h-5 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
                  )}
                  <span>Post</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
