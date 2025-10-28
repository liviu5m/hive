import { ChatMessage } from "@/hooks/use-realtime-chat";
import { User } from "@/lib/Types";
import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL;

export async function getMessagesBySenderIdAndReceiverId(
  senderId: number,
  receiverId: number,
  token: string
) {
  const response = await axios.get(`${baseUrl}/api/message`, {
    params: {
      senderId,
      receiverId,
    },
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
}

export async function createMessage(
  message: ChatMessage,
  senderId: number,
  receiverId: number,
  token: string
) {
  const response = await axios.post(
    `${baseUrl}/api/message`,
    { ...message, senderId, receiverId },
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  return response.data;
}

export async function updateMessage(
  id: string,
  content: string,
  token: string
) {
  console.log(id, content);

  const response = await axios.put(
    `${baseUrl}/api/message/${id}`,
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

export async function deleteMessage(id: string, token: string) {
  const response = await axios.delete(`${baseUrl}/api/message/${id}`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
}

export async function getUsersFromConversation(userId: number, token: string) {
  const response = await axios.get(`${baseUrl}/api/message/user`, {
    params: {
      userId,
    },
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
}
