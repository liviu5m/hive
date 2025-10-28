import { PostDto } from "@/lib/Types";
import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL;

export async function createPostApi(postDto: PostDto, token: string) {
  const response = await axios.post(`${baseUrl}/api/post`, postDto, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
}

export async function getPosts(token: string) {
  const response = await axios.get(`${baseUrl}/api/post`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
}

export async function getPostsByUserId(userId: number, token: string) {
  const response = await axios.get(`${baseUrl}/api/post/user`, {
    params: {
      userId,
    },
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
}

export async function getPostsById(id: number, token: string) {
  const response = await axios.get(`${baseUrl}/api/post/${id}`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
}
