import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL;

export async function addLikeApi(postId: number, userId: number) {
  const response = await axios.post(
    `${baseUrl}/api/like`,
    {
      postId,
      userId,
    },
    {
      withCredentials: true,
    },
  );
  return response.data;
}

export async function removeLikeApi(likeId: number) {
  const response = await axios.delete(`${baseUrl}/api/like/${likeId}`, {
    withCredentials: true,
  });
  return response.data;
}

export async function getLikesByPostId(postId: number) {
  const response = await axios.get(`${baseUrl}/api/like`, {
    params: {
      postId,
    },
    withCredentials: true,
  });
  return response.data;
}
