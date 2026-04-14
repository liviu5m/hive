import { PostDto } from "@/lib/Types";
import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL;

export async function createPostApi(postDto: PostDto) {
  const response = await axios.post(`${baseUrl}/api/post`, postDto, {
    withCredentials: true,
  });
  return response.data;
}

export async function getPosts(search: string) {
  const response = await axios.get(`${baseUrl}/api/post`, {
    withCredentials: true,
    params: {
      search,
    },
  });
  return response.data;
}

export async function getPostsByUserId(userId: number) {
  const response = await axios.get(`${baseUrl}/api/post/user`, {
    withCredentials: true,
    params: {
      userId,
    },
  });
  return response.data;
}

export async function getPostsById(id: number) {
  const response = await axios.get(`${baseUrl}/api/post/${id}`, {
    withCredentials: true,
  });
  return response.data;
}
