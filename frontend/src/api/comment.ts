import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL;

export async function addCommentApi(
  postId: number,
  userId: number,
  content: string,
) {
  const response = await axios.post(
    `${baseUrl}/api/comment`,
    {
      postId,
      userId,
      content,
    },
    {
      withCredentials: true,
    },
  );
  return response.data;
}

export async function deleteCommentApi(commentId: number) {
  const response = await axios.delete(`${baseUrl}/api/comment/${commentId}`, {
    withCredentials: true,
  });
  return response.data;
}

export async function updateCommentApi(commentId: number, content: string) {
  const response = await axios.put(
    `${baseUrl}/api/comment/${commentId}`,
    {
      content,
    },
    {
      withCredentials: true,
    },
  );
  return response.data;
}

export async function getCommentsByPostId(
  postId: number,
  commentPage: number,
  commentPageSize: number,
) {
  const response = await axios.get(`${baseUrl}/api/comment`, {
    params: { postId, page: commentPage, size: commentPageSize },
    withCredentials: true,
  });
  return response.data;
}

export async function getCommentsAndRepliesByPostId(postId: number) {
  const response = await axios.get(`${baseUrl}/api/comment/reply`, {
    params: { postId },
    withCredentials: true,
  });
  return response.data;
}
