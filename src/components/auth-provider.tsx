"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

const GUEST_TOKEN_KEY = "mill_guest_token";
const SESSION_TOKEN_KEY = "mill_session_token";

interface GuestSessionPayload {
  token: string;
  expiresAt: string;
}

interface UserProfile {
  id: string;
  mobile: string;
  name?: string;
  isActive: boolean;
  lastLoginAt?: string;
}

interface AuthSessionPayload {
  sessionToken: string;
  expiresAt: string;
  user: UserProfile;
}

interface RequestOtpPayload {
  mobile: string;
  expiresAt: string;
  otpLength?: number;
  code?: string;
}

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  error?: string;
}

interface AuthContextValue {
  initialized: boolean;
  isAuthenticated: boolean;
  user: UserProfile | null;
  guestToken: string | null;
  sessionToken: string | null;
  requestOtp: (mobile: string) => Promise<RequestOtpPayload>;
  verifyOtp: (mobile: string, code: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readStorage(key: string): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(key);
}

function writeStorage(key: string, value: string | null) {
  if (typeof window === "undefined") {
    return;
  }

  if (value) {
    window.localStorage.setItem(key, value);
    return;
  }

  window.localStorage.removeItem(key);
}

async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`/api/auth${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });

  const payload = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;

  if (!response.ok || !payload?.success) {
    throw new Error(payload?.error ?? `Request failed with status ${response.status}`);
  }

  return payload.data;
}

async function createGuestSessionRequest(): Promise<GuestSessionPayload> {
  return apiFetch<GuestSessionPayload>("/users/guest-session", {
    method: "POST",
  });
}

export function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [initialized, setInitialized] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [guestToken, setGuestToken] = useState<string | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const initStartedRef = useRef(false);

  async function ensureGuestSession(existingToken?: string | null) {
    if (existingToken) {
      setGuestToken(existingToken);
      return existingToken;
    }

    const guestSession = await createGuestSessionRequest();
    writeStorage(GUEST_TOKEN_KEY, guestSession.token);
    setGuestToken(guestSession.token);
    return guestSession.token;
  }

  useEffect(() => {
    if (initStartedRef.current) {
      return;
    }

    initStartedRef.current = true;

    async function initializeAuth() {
      const storedGuestToken = readStorage(GUEST_TOKEN_KEY);
      const storedSessionToken = readStorage(SESSION_TOKEN_KEY);

      try {
        if (storedSessionToken) {
          const session = await apiFetch<AuthSessionPayload>("/users/session", {
            headers: {
              Authorization: `Bearer ${storedSessionToken}`,
            },
          });

          setUser(session.user);
          setGuestToken(storedGuestToken);
          setSessionToken(storedSessionToken);
          setInitialized(true);
          return;
        }

        await ensureGuestSession(storedGuestToken);
      } catch {
        writeStorage(SESSION_TOKEN_KEY, null);
        setUser(null);
        setSessionToken(null);
        await ensureGuestSession(storedGuestToken);
      } finally {
        setInitialized(true);
      }
    }

    void initializeAuth();
  }, []);

  async function requestOtp(mobile: string): Promise<RequestOtpPayload> {
    return apiFetch<RequestOtpPayload>("/users/request-otp", {
      method: "POST",
      body: JSON.stringify({ mobile }),
    });
  }

  async function verifyOtp(mobile: string, code: string): Promise<void> {
    const currentGuestToken = readStorage(GUEST_TOKEN_KEY) ?? guestToken;
    const session = await apiFetch<AuthSessionPayload>("/users/verify-otp", {
      method: "POST",
      body: JSON.stringify({
        mobile,
        code,
        guestToken: currentGuestToken ?? undefined,
      }),
    });

    writeStorage(SESSION_TOKEN_KEY, session.sessionToken);
    writeStorage(GUEST_TOKEN_KEY, null);
    setGuestToken(null);
    setSessionToken(session.sessionToken);
    setUser(session.user);
  }

  async function logout(): Promise<void> {
    const sessionToken = readStorage(SESSION_TOKEN_KEY);

    try {
      if (sessionToken) {
        await apiFetch<{ loggedOut: boolean }>("/users/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
        });
      }
    } finally {
      writeStorage(SESSION_TOKEN_KEY, null);
      setSessionToken(null);
      setUser(null);
      await ensureGuestSession(null);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        initialized,
        isAuthenticated: Boolean(user),
        user,
        guestToken,
        sessionToken,
        requestOtp,
        verifyOtp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}
