import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, TouchableOpacity, StyleSheet } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Register">;

export default function RegisterScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeat, setRepeat] = useState("");
  const [loading, setLoading] = useState(false);

  async function register() {
    if (!userName || !email || !password || password !== repeat) {
      Alert.alert("Błąd", "Uzupełnij poprawnie wszystkie pola i powtórz hasło.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://172.20.10.10:5104/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, email, password })
      });
      const txt = await res.text();
      if (!res.ok) throw new Error(txt);
      Alert.alert("Sukces", "Konto utworzone! Zaloguj się.");
      navigation.replace("Login");
    } catch (e: any) {
      Alert.alert("Błąd", e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rejestracja</Text>
      <TextInput
        placeholder="Login"
        value={userName}
        onChangeText={setUserName}
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
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
      <TextInput
        placeholder="Powtórz hasło"
        value={repeat}
        onChangeText={setRepeat}
        secureTextEntry
        style={styles.input}
      />
      <Button title={loading ? "Rejestruję..." : "Zarejestruj się"} onPress={register} disabled={loading} />
      <TouchableOpacity onPress={() => navigation.replace("Login")} style={{ marginTop: 24 }}>
        <Text style={styles.link}>Masz już konto? Zaloguj się</Text>
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