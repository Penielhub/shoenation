import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api, getTokens, setTokens } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // true right after "Log out", so protected pages send you home instead of to the sign-in form
  const [signedOut, setSignedOut] = useState(false);
  // true until we know whether saved tokens still belong to a logged-in user
  const [loading, setLoading] = useState(() => Boolean(getTokens()));

  useEffect(() => {
    if (!getTokens()) return;
    api
      .me()
      .then(setUser)
      .catch(() => setTokens(null))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    setTokens(await api.login(email, password));
    const me = await api.me();
    setUser(me);
    setSignedOut(false);
    return me;
  }, []);

  const register = useCallback(
    async (email, password) => {
      await api.register(email, password);
      return login(email, password);
    },
    [login],
  );

  const logout = useCallback(() => {
    setTokens(null);
    setUser(null);
    setSignedOut(true);
  }, []);

  const value = useMemo(
    () => ({ user, loading, signedOut, login, register, logout }),
    [user, loading, signedOut, login, register, logout],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
