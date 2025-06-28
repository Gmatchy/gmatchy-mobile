import { AxiosError } from "axios";
import axiosInstance from "./axios-instance";

interface LoginResponse {
  accessToken: string;
  message: string;
  refreshToken: string;
  success: boolean;
}

export type LoginRequestParam = {
  phone: string;
  password: string;
};

export const loginRequest = async ({
  phone,
  password,
}: LoginRequestParam): Promise<LoginResponse> => {
  try {
    const response = await axiosInstance.post("auth/login", {
      phone,
      password,
    });
    return response.data;
  } catch (e: any) {
    if (e.isAxiosError) {
      const error = e as AxiosError;
      console.log(error.response?.data);
    }
    console.log("Error While loginRequest: " + e.data);
    throw e;
  }
};

export const getProfileRequest = async () => {
  try {
    const response = await axiosInstance.get("auth/profile");

    console.log("gget: " + JSON.stringify(response.data));
  } catch (e: any) {
    if (e.isAxiosError) {
      const error = e as AxiosError;
      console.log(error.response?.data);
    }
    console.log("Error While loginRequest: " + e.data);
    throw e;
  }
};
