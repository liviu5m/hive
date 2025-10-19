import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL;

export async function addReplyApi(
  content: string,
  userId: number,
  commentId: number,
  token: string
) {
  const response = await axios.post(
    `${baseUrl}/api/reply`,
    {
      commentId,
      userId,
      content,
    },
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  return response.data;
}

export async function getRepliesByCommentId(commentId: number, token: string) {
  const response = await axios.get(`${baseUrl}/api/reply`, {
    params: { commentId },
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
}
