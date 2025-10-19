import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL;

export async function addCommentLikeApi(
  commentId: number,
  userId: number,
  token: string
) {
  const response = await axios.post(
    `${baseUrl}/api/comment-like`,
    {
      commentId,
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

export async function removeCommentLikeApi(
  commentLikeId: number,
  token: string
) {
  const response = await axios.delete(
    `${baseUrl}/api/comment-like/${commentLikeId}`,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  return response.data;
}

export async function getCommentLikes(commentId: number, token: string) {
  const response = await axios.get(`${baseUrl}/api/comment-like`, {
    params: {
      commentId,
    },
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
}
