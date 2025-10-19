import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL;

export async function addLikeApi(
  postId: number,
  userId: number,
  token: string
) {
  const response = await axios.post(
    `${baseUrl}/api/like`,
    {
      postId,
      userId,
    },
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  return response.data;
}

export async function removeLikeApi(likeId: number, token: string) {
  const response = await axios.delete(`${baseUrl}/api/like/${likeId}`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
}

export async function getLikesByPostId(postId: number, token: string) {
  const response = await axios.get(`${baseUrl}/api/like`, {
    params: {
      postId,
    },
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
}
