import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../AuthContext";

export default function LeaveRequestScreen() {
  const { token } = useAuth(); // <-- I tu!
  const [start, setStart] = useState("");      // data od
  const [end, setEnd] = useState("");          // data do
  const [reason, setReason] = useState("");    // powód
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState<any[]>([]);
  const navigation = useNavigation();

  async function submitRequest() {
    setLoading(true);
    try {
      if (!token) throw new Error("Brak autoryzacji! Zaloguj się ponownie.");
      const res = await fetch("http://172.20.10.10:5104/api/leaverequest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          start: new Date(start),
          end: new Date(end),
          reason
        })
      });
      if (!res.ok) throw new Error(await res.text());
      Alert.alert("Sukces", "Urlop zgłoszony!");
      setStart(""); setEnd(""); setReason("");
      fetchRequests();
    } catch (e: any) {
      Alert.alert("Błąd", e.message || "Nie udało się zgłosić urlopu.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchRequests() {
    setLoading(true);
    try {
      if (!token) throw new Error("Brak autoryzacji! Zaloguj się ponownie.");
      const res = await fetch("http://172.20.10.10:5104/api/leaverequest", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      setRequests(data);
    } catch {}
    setLoading(false);
  }

  useEffect(() => { fetchRequests(); }, [token]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Zgłoś urlop</Text>
      <TextInput
        placeholder="Data rozpoczęcia (YYYY-MM-DD)"
        value={start}
        onChangeText={setStart}
        style={styles.input}
      />
      <TextInput
        placeholder="Data zakończenia (YYYY-MM-DD)"
        value={end}
        onChangeText={setEnd}
        style={styles.input}
      />
      <TextInput
        placeholder="Powód (opcjonalnie)"
        value={reason}
        onChangeText={setReason}
        style={styles.input}
      />
      <Button title={loading ? "Wysyłanie..." : "Zgłoś urlop"} onPress={submitRequest} disabled={loading} />

      <Text style={{ marginTop: 30, fontWeight: "bold" }}>Twoje zgłoszenia urlopowe:</Text>
      <FlatList
        data={requests}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={{ marginVertical: 6, padding: 8, borderWidth: 1, borderColor: "#eee", borderRadius: 6 }}>
            <Text>od: {item.start}</Text>
            <Text>do: {item.end}</Text>
            <Text>Status: {item.status}</Text>
            <Text>Powód: {item.reason}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 24, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#aaa", borderRadius: 8, marginBottom: 14, padding: 10 }
});