import AppNavigator from "./src/AppNavigator";
import { AuthProvider } from "./src/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}