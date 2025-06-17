import React, { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";

export default function App() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");

  async function login() {
    setError("");
    try {
      const res = await fetch("http://<TWÓJ_IP>:5104/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, password })
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setToken(data.token);
    } catch (err: any) {
      setError(err.message);
    }
  }

  if (!token) {
    return (
      <View style={{ margin: 40 }}>
        <Text>Login do Shiftly:</Text>
        <TextInput value={userName} onChangeText={setUserName} placeholder="Login" />
        <TextInput value={password} onChangeText={setPassword} placeholder="Hasło" secureTextEntry />
        <Button title="Zaloguj" onPress={login} />
        {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
      </View>
    );
  }

  return (
    <View style={{ margin: 40 }}>
      <Text>Jesteś zalogowany!</Text>
      <Text selectable>{token}</Text>
      {/* Tu zrób fetch shiftów, itd */}
    </View>
  );
}