import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type UserInfo = {
  userName: string;
  role: string;
  email?: string;
  id: string;
};

type AuthContextType = {
  token: string | null;
  user: UserInfo | null;
  login: (t: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  login: async () => {},
  logout: async () => {},
});

// Funkcja dekodująca JWT
function decodeJwt(token: string): UserInfo | null {
  try {
    const payload = token.split(".")[1];
    const json = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return {
      id: json["sub"] || "",
      userName: json["unique_name"] || json["name"] || "",
      role: json["role"] || json["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || "User",
      email: json["email"] || undefined,
    };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserInfo | null>(null);

  const login = async (t: string) => {
    setToken(t);
    setUser(decodeJwt(t));
    await AsyncStorage.setItem("jwt", t);
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    await AsyncStorage.removeItem("jwt");
  };

  useEffect(() => {
    AsyncStorage.getItem("jwt").then((t) => {
      if (t) {
        setToken(t);
        setUser(decodeJwt(t));
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}