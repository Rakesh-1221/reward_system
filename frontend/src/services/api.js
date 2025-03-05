import axios from "axios";
import API_BASE_URL from "../config"; // Go one level up

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" }
});

export default api;
