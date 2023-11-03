import axios from "axios";

const NODE_API_URL = "http://localhost:3001/api/v1";

export const Nextclient = axios.create({
  baseURL: NODE_API_URL,
});
