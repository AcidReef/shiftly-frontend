import React from "react";
import AppNavigator from "./src/AppNavigator";
import { AuthProvider } from "./src/AuthContext"; // zakładam, że tu masz AuthContext

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}