import axios from "axios";

export const api = axios.create({
  baseURL: "https://og3g.onrender.com",
  withCredentials: true,
});
