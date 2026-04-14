import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL;

export async function createFollowRequest(
  followerId: number,
  followingId: number,
) {
  const response = await axios.post(
    `${baseUrl}/api/follow-request`,
    {
      followerId,
      followingId,
    },
    {
      withCredentials: true,
    },
  );
  return response.data;
}

export async function updateFollowRequest(
  id: number,
  followerId: number,
  followingId: number,
  status: string,
) {
  const response = await axios.put(
    `${baseUrl}/api/follow-request/${id}`,
    {
      followerId,
      followingId,
      status,
    },
    {
      withCredentials: true,
    },
  );
  return response.data;
}

export async function deleteFollowRequest(
  followerId: number,
  followingId: number,
) {
  const response = await axios.delete(`${baseUrl}/api/follow-request`, {
    params: {
      followerId,
      followingId,
    },
    withCredentials: true,
  });
  return response.data;
}

export async function getFollowRequestByIds(followerId: number) {
  const response = await axios.get(`${baseUrl}/api/follow-request/check`, {
    params: {
      followerId,
    },
    withCredentials: true,
  });
  return response.data;
}

export async function getFollowRequests(
  followerId: number,
  followingId: number,
  status: string | null,
) {
  const response = await axios.get(`${baseUrl}/api/follow-request`, {
    params: {
      followerId,
      followingId,
      status,
    },
    withCredentials: true,
  });
  return response.data;
}
