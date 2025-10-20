import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL;

export async function addCommentApi(
  postId: number,
  userId: number,
  content: string,
  token: string
) {
  const response = await axios.post(
    `${baseUrl}/api/comment`,
    {
      postId,
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

export async function deleteCommentApi(commentId: number, token: string) {
  const response = await axios.delete(`${baseUrl}/api/comment/${commentId}`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
}

export async function updateCommentApi(
  commentId: number,
  content: string,
  token: string
) {
  const response = await axios.put(
    `${baseUrl}/api/comment/${commentId}`,
    {
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

export async function getCommentsByPostId(postId: number, token: string) {
  const response = await axios.get(`${baseUrl}/api/comment`, {
    params: { postId },
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
}


export async function getCommentsAndRepliesByPostId(postId: number, token: string) {
  const response = await axios.get(`${baseUrl}/api/comment/reply`, {
    params: { postId },
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
}
