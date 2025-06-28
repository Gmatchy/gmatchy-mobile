import { RefreshTokenKey, TokenKey } from "@/constants/local-storage-keys";
import AuthManager from "@/services/local/auth-manager";
import localStorage from "@/services/local/local-storage";
import axiosInstance from "@/services/remote/axios-instance";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
export const AuthContext = createContext<{
  signIn: (accessToken: string, refreshToken: string) => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
  isAuth: boolean;
}>({
  signIn: async (accessToken: string, refreshToken: string) => {},
  signOut: async () => {},
  isLoading: false,
  isAuth: false,
});

export function AuthProvider({ children }: PropsWithChildren) {
  const [isLoading, setIsLoading] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  const setAxiosAuthHeader = useCallback((accessToken: string | null) => {
    if (accessToken) {
      axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    } else {
      delete axiosInstance.defaults.headers.common.Authorization;
    }
  }, []);

  const signIn = useCallback(
    async (accessToken: string, refreshToken: string) => {
      setIsLoading(true);
      try {
        await localStorage.setSecureLocalStorageItem(TokenKey, accessToken);
        await localStorage.setSecureLocalStorageItem(
          RefreshTokenKey,
          refreshToken
        );
        setIsAuth(true);
        setAxiosAuthHeader(accessToken);
      } catch (error) {
        console.log("SignIn error:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [setAxiosAuthHeader]
  );

  const signOut = useCallback(async () => {
    try {
      await localStorage.removeSecureLocalStorageItem(TokenKey);
      await localStorage.removeSecureLocalStorageItem(RefreshTokenKey);
      setIsAuth(false);
      setAxiosAuthHeader(null);
    } catch (error) {
      console.log("error while logout: " + error);
    }
  }, [setAxiosAuthHeader]);

  // Auto-login on app start
  useEffect(() => {
    const restoreToken = async () => {
      const storedToken = await localStorage.getSecureLocalStorageItem(
        TokenKey
      );
      const storedRefresh = await localStorage.getSecureLocalStorageItem(
        RefreshTokenKey
      );
      if (storedToken && storedRefresh) {
        setAxiosAuthHeader(storedToken);
        setIsAuth(true);
      } else {
        setIsAuth(false);
      }

      setIsLoading(false);
    };
    restoreToken();
  }, [setAxiosAuthHeader]);

  useEffect(() => {
    AuthManager.setSignOut(signOut);
  }, [signOut]);

  const value = useMemo(
    () => ({
      signIn,
      signOut,
      isLoading,
      isAuth,
    }),
    [signIn, signOut, isLoading, isAuth]
  );
  return <AuthContext value={value}>{children}</AuthContext>;
}
