import axios from "axios";

const CLARIFAI_API_KEY =
  process.env.EXPO_PUBLIC_CLARIFAI_KEY || "09608932a79740a28ebda4d8297ab020";

export const api_IA = axios.create({
  baseURL: "https://api.clarifai.com",
  headers: {
    Authorization: `Key ${CLARIFAI_API_KEY}`,
  },
});
