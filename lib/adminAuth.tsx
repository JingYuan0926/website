import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface AdminAuthContext {
  isLoggedIn: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const DEMO_EMAIL = "stmy@gmail.com";
const DEMO_PASSWORD = "12345";
const STORAGE_KEY = "admin_logged_in";

const AuthContext = createContext<AdminAuthContext>({
  isLoggedIn: false,
  login: () => false,
  logout: () => {},
});

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setIsLoggedIn(sessionStorage.getItem(STORAGE_KEY) === "true");
    setLoaded(true);
  }, []);

  function login(email: string, password: string): boolean {
    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, "true");
      setIsLoggedIn(true);
      return true;
    }
    return false;
  }

  function logout() {
    sessionStorage.removeItem(STORAGE_KEY);
    setIsLoggedIn(false);
  }

  if (!loaded) return null;

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAdminAuth() {
  return useContext(AuthContext);
}
