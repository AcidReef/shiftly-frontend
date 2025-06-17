import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet, FlatList } from "react-native";
import { useAuth } from "../AuthContext"; // <- Twój kontekst uwierzytelniania

export default function SwapRequestScreen() {
  const { token } = useAuth();
  const [fromShiftId, setFromShiftId] = useState(""); // np. ID twojej zmiany
  const [toShiftId, setToShiftId] = useState("");     // np. ID zmiany, którą chcesz przejąć
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState<any[]>([]);

  async function submitSwap() {
    if (!fromShiftId || !toShiftId) {
      Alert.alert("Błąd", "Podaj ID obu zmian!");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://172.20.10.10:5104/api/swaprequest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          fromShiftId,
          toShiftId
        })
      });
      if (!res.ok) throw new Error(await res.text());
      Alert.alert("Sukces", "Wysłano prośbę o zamianę!");
      setFromShiftId(""); setToShiftId("");
      fetchRequests();
    } catch (e: any) {
      Alert.alert("Błąd", e.message || "Nie udało się wysłać prośby o zamianę.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchRequests() {
    setLoading(true);
    try {
      const res = await fetch("http://172.20.10.10:5104/api/swaprequest", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      setRequests(data);
    } catch {}
    setLoading(false);
  }

  useEffect(() => { fetchRequests(); }, []);

  // Możesz dodać logikę wyboru zmiany z listy, teraz po ID
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Prośba o zamianę zmiany</Text>
      <TextInput
        placeholder="ID Twojej zmiany"
        value={fromShiftId}
        onChangeText={setFromShiftId}
        style={styles.input}
      />
      <TextInput
        placeholder="ID zmiany do przejęcia"
        value={toShiftId}
        onChangeText={setToShiftId}
        style={styles.input}
      />
      <Button title={loading ? "Wysyłanie..." : "Wyślij prośbę"} onPress={submitSwap} disabled={loading} />

      <Text style={{ marginTop: 30, fontWeight: "bold" }}>Twoje zgłoszone zamiany:</Text>
      <FlatList
        data={requests}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.swapBox}>
            <Text>Twoja zmiana: {item.fromShiftId}</Text>
            <Text>Zmiana do przejęcia: {item.toShiftId}</Text>
            <Text>Status: {item.status || "oczekuje"}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 24, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#aaa", borderRadius: 8, marginBottom: 14, padding: 10 },
  swapBox: { marginVertical: 6, padding: 8, borderWidth: 1, borderColor: "#eee", borderRadius: 6 }
});