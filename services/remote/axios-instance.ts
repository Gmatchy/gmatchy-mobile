import { RefreshTokenKey, TokenKey } from "@/constants/local-storage-keys";
import axios from "axios";
import AuthManager from "../local/auth-manager";
import localStorage from "../local/local-storage";
const baseURL = process.env.EXPO_PUBLIC_BASE_URL;

const axiosInstance = axios.create({
  baseURL,
  timeout: 10000,
});

// axiosInstance.interceptors.request.use(
//   async (config) => {
//     //   const token = await getAuthToken();
//     const token = "test";
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     throw error;
//   }
// );

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = "Bearer " + token;
              resolve(axiosInstance(originalRequest));
            },
            reject: (err: any) => reject(err),
          });
        });
      }

      isRefreshing = true;

      // @test
      // await new Promise((res) => setTimeout(res, 5000));

      try {
        const refreshToken = await localStorage.getSecureLocalStorageItem(
          RefreshTokenKey
        );
        if (!refreshToken) {
          AuthManager.triggerSignOut();
        }

        const response = await axiosInstance.post(`auth/refresh`, {
          refreshToken,
        });
        const newAccessToken = response.data.accessToken;
        const newRefreshToken = response.data.refreshToken;

        await localStorage.setSecureLocalStorageItem(TokenKey, newAccessToken);
        await localStorage.setSecureLocalStorageItem(
          RefreshTokenKey,
          newRefreshToken
        );

        axiosInstance.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        AuthManager.triggerSignOut();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global error messages, logging, retry, etc.
    if (error.response?.status === 401) {
      // For example, force logout or refresh token
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
