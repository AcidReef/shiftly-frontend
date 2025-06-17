import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../AppNavigator";
import { useAuth } from "../AuthContext";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Login">;

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { login } = useAuth();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    try {
      const res = await fetch("http://172.20.10.10:5104/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data || "Błąd logowania");
      await login(data.token);
      Alert.alert("Sukces", "Zalogowano!");
      navigation.replace("Home");
    } catch (e: any) {
      Alert.alert("Błąd logowania", e.message || "Nieprawidłowy login lub hasło.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Logowanie</Text>
      <TextInput
        placeholder="Login"
        value={userName}
        onChangeText={setUserName}
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Hasło"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button title={loading ? "Logowanie..." : "Zaloguj się"} onPress={handleLogin} disabled={loading} />
      <TouchableOpacity onPress={() => navigation.replace("Register")} style={{ marginTop: 24 }}>
        <Text style={styles.link}>Nie masz konta? Zarejestruj się</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 24, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#aaa", borderRadius: 8, marginBottom: 14, padding: 10 },
  link: { color: "#2196F3", textAlign: "center", fontSize: 16 }
});