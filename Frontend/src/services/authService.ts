import { api } from "./api";

type AuthResponse = {
  user: {
    id: number;
    email: string;
    role: string;
  };
  token: string;
};

export async function registerUser(email: string, password: string, repeatedPassword: string, publicAddress: string): Promise<AuthResponse> {
  const response = await api.post("/auth/register", { email, password,  repeatedPassword, publicAddress});
  return response.data;
}

export async function loginUser(email: string, password: string, address: string): Promise<AuthResponse> {
  const response = await api.post("/auth/login", { email, password, publicAddress: address });
  return response.data;
}
