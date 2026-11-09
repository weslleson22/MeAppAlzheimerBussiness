import axios from "axios";

const CLARIFAI_API_KEY =
  process.env.EXPO_PUBLIC_CLARIFAI_KEY || "57aac8716e5a456591426e42797f728f";

export const api_IA = axios.create({
  baseURL: "https://api.clarifai.com",
  headers: {
    Authorization: `Key ${CLARIFAI_API_KEY}`,
  },
});
