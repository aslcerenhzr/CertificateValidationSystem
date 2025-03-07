import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

// This is a plain axios instance. 
// Another approach: export a configured instance with interceptors.

export const api = axios.create({
  baseURL: "http://localhost:4000", // your backend URL
});

// If you want to attach token automatically:
export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}
