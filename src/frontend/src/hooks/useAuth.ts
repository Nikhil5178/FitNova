import { useCallback, useEffect, useState } from "react";

export interface UserSession {
  name: string;
  email: string;
}

export function useAuth() {
  const [session, setSession] = useState<UserSession | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("fittrack_session");
      if (raw) setSession(JSON.parse(raw));
    } catch {
      setSession(null);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("fittrack_session");
    setSession(null);
    window.location.reload();
  }, []);

  const refreshSession = useCallback(() => {
    try {
      const raw = localStorage.getItem("fittrack_session");
      if (raw) setSession(JSON.parse(raw));
    } catch {
      setSession(null);
    }
  }, []);

  return { session, logout, refreshSession };
}
