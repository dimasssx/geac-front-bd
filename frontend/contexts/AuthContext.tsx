"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { usePathname } from "next/navigation";
import { AuthContextType, UserData } from "@/types/auth";
import { logoutAction } from "@/app/actions/auth";

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const pathname = usePathname();

  const checkSession = useCallback(async () => {
    try {
      const res = await fetch("/api/me", { cache: "no-store" });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setIsAuthenticated(true);
      } else {
        throw new Error("Não logado");
      }
    } catch {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [pathname, checkSession]);

  const logout = useCallback(async () => {
    await logoutAction();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const login = useCallback(() => {
    checkSession();
  }, [checkSession]);

  const contextValue = useMemo(
    () => ({
      user,
      isAuthenticated,
      logout,
      login,
      isLoading,
    }),
    [user, isAuthenticated, logout, login, isLoading],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
