import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type PropsWithChildren,
} from "react";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import * as SecureStore from "expo-secure-store";
import {
  CLIENT_ID,
  KEYCLOAK_URL,
  REALM,
  TOKEN_ENDPOINT,
  LOGOUT_ENDPOINT,
} from "../config/keycloak";

/* ------------------------------------------------------------------ */
/*  Ensure the web browser auth session is completed on return        */
/* ------------------------------------------------------------------ */
WebBrowser.maybeCompleteAuthSession();

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */
export interface UserInfo {
  sub: string;
  preferred_username?: string;
  email?: string;
  name?: string;
  [key: string]: unknown;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  idToken: string | null;
  userInfo: UserInfo | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  mockLogin: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthState>({
  accessToken: null,
  refreshToken: null,
  idToken: null,
  userInfo: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
  mockLogin: async () => {},
});

/* ------------------------------------------------------------------ */
/*  Secure-store helpers                                               */
/* ------------------------------------------------------------------ */
const STORE_KEY_ACCESS = "kc_access_token";
const STORE_KEY_REFRESH = "kc_refresh_token";
const STORE_KEY_ID = "kc_id_token";

async function persistTokens(
  accessToken: string,
  refreshToken: string | null,
  idToken: string | null
) {
  await SecureStore.setItemAsync(STORE_KEY_ACCESS, accessToken);
  if (refreshToken)
    await SecureStore.setItemAsync(STORE_KEY_REFRESH, refreshToken);
  if (idToken) await SecureStore.setItemAsync(STORE_KEY_ID, idToken);
}

async function clearTokens() {
  await SecureStore.deleteItemAsync(STORE_KEY_ACCESS);
  await SecureStore.deleteItemAsync(STORE_KEY_REFRESH);
  await SecureStore.deleteItemAsync(STORE_KEY_ID);
}

/* ------------------------------------------------------------------ */
/*  Decode basic JWT payload (no verification – just for display)     */
/* ------------------------------------------------------------------ */
function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */
/*  Provider                                                          */
/* ------------------------------------------------------------------ */
export function AuthProvider({ children }: PropsWithChildren) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /* ---- OIDC discovery ---- */
  const issuer = `${KEYCLOAK_URL}/realms/${REALM}`;
  const discovery = AuthSession.useAutoDiscovery(issuer);

  /* ---- Redirect URI (handled by Expo) ---- */
  const redirectUri = AuthSession.makeRedirectUri();

  /* ---- Auth request (PKCE is enabled by default) ---- */
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: CLIENT_ID,
      redirectUri,
      scopes: ["openid", "profile", "email"],
      usePKCE: true,
    },
    discovery ?? null
  );

  /* ---- Exchange auth code for tokens ---- */
  const exchangeCode = useCallback(
    async (code: string, codeVerifier: string) => {
      const tokenResult = await AuthSession.exchangeCodeAsync(
        {
          clientId: CLIENT_ID,
          code,
          redirectUri,
          extraParams: { code_verifier: codeVerifier },
        },
        { tokenEndpoint: TOKEN_ENDPOINT }
      );

      const aToken = tokenResult.accessToken;
      const rToken = tokenResult.refreshToken ?? null;
      const iToken = tokenResult.idToken ?? null;

      setAccessToken(aToken);
      setRefreshToken(rToken);
      setIdToken(iToken);

      const payload = decodeJwtPayload(aToken);
      if (payload) setUserInfo(payload as UserInfo);

      await persistTokens(aToken, rToken, iToken);
    },
    [redirectUri]
  );

  /* ---- Handle auth response ---- */
  useEffect(() => {
    if (response?.type === "success" && request?.codeVerifier) {
      exchangeCode(response.params.code, request.codeVerifier);
    }
  }, [response, request, exchangeCode]);

  /* ---- Restore tokens on mount ---- */
  useEffect(() => {
    (async () => {
      try {
        const stored = await SecureStore.getItemAsync(STORE_KEY_ACCESS);
        if (stored) {
          setAccessToken(stored);
          const payload = decodeJwtPayload(stored);
          if (payload) setUserInfo(payload as UserInfo);

          const storedRefresh = await SecureStore.getItemAsync(STORE_KEY_REFRESH);
          const storedId = await SecureStore.getItemAsync(STORE_KEY_ID);
          setRefreshToken(storedRefresh);
          setIdToken(storedId);
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  /* ---- Login ---- */
  const login = useCallback(async () => {
    console.log("[Auth] login pressed");
    console.log("[Auth] discovery:", discovery ? "loaded" : "NOT loaded");
    console.log("[Auth] request:", request ? "ready" : "NOT ready");
    console.log("[Auth] redirectUri:", redirectUri);
    if (!request) {
      console.warn("[Auth] Cannot login – auth request not ready. Is Keycloak running?");
      return;
    }
    await promptAsync();
  }, [request, promptAsync, discovery, redirectUri]);

  /* ---- Mock login (dev / demo) ---- */
  const mockLogin = useCallback(async (email: string) => {
    const fakeToken = "mock-access-token";
    const fakeUser: UserInfo = {
      sub: "mock-user-id",
      preferred_username: email.split("@")[0],
      email,
      name: email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    };
    setAccessToken(fakeToken);
    setUserInfo(fakeUser);
    await SecureStore.setItemAsync(STORE_KEY_ACCESS, fakeToken);
  }, []);

  /* ---- Logout ---- */
  const logout = useCallback(async () => {
    // RP-initiated logout (opens browser and redirects back)
    if (idToken) {
      await WebBrowser.openAuthSessionAsync(
        `${LOGOUT_ENDPOINT}?id_token_hint=${idToken}&post_logout_redirect_uri=${encodeURIComponent(
          redirectUri
        )}`,
        redirectUri
      );
    }
    setAccessToken(null);
    setRefreshToken(null);
    setIdToken(null);
    setUserInfo(null);
    await clearTokens();
  }, [idToken, redirectUri]);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        idToken,
        userInfo,
        isLoading,
        isAuthenticated: !!accessToken,
        login,
        logout,
        mockLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
