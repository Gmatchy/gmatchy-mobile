import { RefreshTokenKey, TokenKey } from "@/constants/local-storage-keys";
import AuthManager from "@/services/auth-manager";
import axiosInstance from "@/services/axios-instance";
import localStorage from "@/services/local-storage";
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
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  const isAuth = !!accessToken;

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
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
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
    await localStorage.removeSecureLocalStorageItem(TokenKey);
    await localStorage.removeSecureLocalStorageItem(RefreshTokenKey);
    setAccessToken(null);
    setRefreshToken(null);
    setAxiosAuthHeader(null);
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
      if (storedToken) {
        setAccessToken(storedToken);
        setAxiosAuthHeader(storedToken);
      }
      setIsLoading(false);
      if (storedRefresh) setRefreshToken(storedRefresh);
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
