import { UserDto } from "@/lib/Types";
import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL;

type RegisterDataType = {
  name: string;
  username: string;
  email: string;
  password: string;
  passwordConfirmation: string;
};

type LoginData = {
  email: string;
  password: string;
};

export async function registerUserApi(registerData: RegisterDataType) {
  const response = await axios.post(`${baseUrl}/auth/signup`, registerData);
  return response.data;
}

export async function verifyAccount(userId: string, code: string) {
  const response = await axios.put(`${baseUrl}/auth/verify`, {
    userId,
    code,
  });
  return response.data;
}

export async function resendVerificationCode(userId: string) {
  const response = await axios.put(`${baseUrl}/auth/resend`, {
    userId,
  });
  return response.data;
}

export async function loginUserApi(loginData: LoginData) {
  const response = await axios.post(`${baseUrl}/auth/login`, loginData);
  return response.data;
}

export async function getAuthenticatedUser(token: string) {
  const response = await axios.get(`${baseUrl}/api/user/me`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
}

export async function updateUser(
  userId: number,
  userDto: UserDto,
  token: string
) {
  const response = await axios.put(`${baseUrl}/api/user/${userId}`, userDto, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
}

export async function getAllUsers(search: string, token: string, pageSize: number, page: number) {
  const response = await axios.get(`${baseUrl}/api/user`, {
    params: {
      search,
      page,
      size: pageSize
    },
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
}

export async function getUserById(id: number, token: string) {
  const response = await axios.get(`${baseUrl}/api/user/${id}`, {
    headers: {
      Authorization: "Bearer " + token,
    }
  })
  return response.data;
}