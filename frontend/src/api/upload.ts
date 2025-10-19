import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL;

export async function uploadImageOnCloudinary(
  file: File | null,
  token: string
) {
  if (!file) return;
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(`${baseUrl}/api/upload`, formData, {
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}
