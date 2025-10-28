import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL;

export async function createFollowRequest(
  followerId: number,
  followingId: number,
  token: string
) {
  const response = await axios.post(
    `${baseUrl}/api/follow-request`,
    { followerId, followingId },
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  return response.data;
}

export async function updateFollowRequest(
  id: number,
  followerId: number,
  followingId: number,
  status: string,
  token: string
) {
  const response = await axios.put(
    `${baseUrl}/api/follow-request/${id}`,
    { followerId, followingId, status },
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  return response.data;
}

export async function deleteFollowRequest(
  followerId: number,
  followingId: number,
  token: string
) {
  const response = await axios.delete(`${baseUrl}/api/follow-request`, {
    params: {
      followerId,
      followingId,
    },
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
}

export async function getFollowRequestByIds(
  followerId: number,
  followingId: number,
  token: string
) {
  const response = await axios.get(`${baseUrl}/api/follow-request/check`, {
    params: {
      followerId,
      followingId,
    },
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
}

export async function getFollowRequests(
  followerId: number,
  followingId: number,
  status: string | null,
  token: string
) {
  
  const response = await axios.get(`${baseUrl}/api/follow-request`, {
    params: {
      followerId,
      followingId,
      status
    },
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
}
