import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL;

export async function addCommentLikeApi(commentId: number, userId: number) {
  const response = await axios.post(
    `${baseUrl}/api/comment-like`,
    {
      commentId,
      userId,
    },
    {
      withCredentials: true,
    },
  );
  return response.data;
}

export async function removeCommentLikeApi(commentLikeId: number) {
  const response = await axios.delete(
    `${baseUrl}/api/comment-like/${commentLikeId}`,
    {
      withCredentials: true,
    },
  );
  return response.data;
}

export async function getCommentLikes(commentId: number) {
  const response = await axios.get(`${baseUrl}/api/comment-like`, {
    params: {
      commentId,
    },
    withCredentials: true,
  });
  return response.data;
}
