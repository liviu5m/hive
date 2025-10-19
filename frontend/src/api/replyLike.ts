import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL;

export async function addReplyLikeApi(
  replyId: number,
  userId: number,
  token: string
) {
  const response = await axios.post(
    `${baseUrl}/api/reply-like`,
    {
      replyId,
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

export async function removeReplyLikeApi(replyLikeId: number, token: string) {
  const response = await axios.delete(
    `${baseUrl}/api/reply-like/${replyLikeId}`,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  return response.data;
}

export async function getReplyLikesByCommentId(replyId: number, token: string) {
  const response = await axios.get(`${baseUrl}/api/reply-like`, {
    params: {
      replyId,
    },
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
}
