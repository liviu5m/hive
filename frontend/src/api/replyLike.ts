import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL;

export async function addReplyLikeApi(replyId: number, userId: number) {
  const response = await axios.post(
    `${baseUrl}/api/reply-like`,
    {
      replyId,
      userId,
    },
    {
      withCredentials: true,
    },
  );
  return response.data;
}

export async function removeReplyLikeApi(replyLikeId: number) {
  const response = await axios.delete(
    `${baseUrl}/api/reply-like/${replyLikeId}`,
    {
      withCredentials: true,
    },
  );
  return response.data;
}

export async function getReplyLikesByCommentId(replyId: number) {
  const response = await axios.get(`${baseUrl}/api/reply-like`, {
    params: {
      replyId,
    },
    withCredentials: true,
  });
  return response.data;
}
