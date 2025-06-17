import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AuthContextType = {
  token: string | null;
  login: (t: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  token: null,
  login: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);

  const login = async (t: string) => {
    setToken(t);
    await AsyncStorage.setItem("jwt", t);
  };

  const logout = async () => {
    setToken(null);
    await AsyncStorage.removeItem("jwt");
  };

  useEffect(() => {
    AsyncStorage.getItem("jwt").then((t) => {
      if (t) setToken(t);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}