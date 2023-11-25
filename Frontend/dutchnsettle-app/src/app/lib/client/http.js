import axios from "axios";

// const NODE_API_URL = "https://dutchnsettle-402123.uk.r.appspot.com/api/v1/";
const NODE_API_URL = "http://localhost:8080/api/v1/";

export const Nextclient = axios.create({
  baseURL: NODE_API_URL,
});
