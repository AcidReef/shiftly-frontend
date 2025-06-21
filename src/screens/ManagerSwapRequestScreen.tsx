import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, FlatList, Alert } from "react-native";
import { useAuth } from "../AuthContext";

export default function ManagerSwapRequestScreen() {
  const { token } = useAuth();
  const [swaps, setSwaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchSwaps() {
    setLoading(true);
    try {
      const res = await fetch("http://172.20.10.10:5104/api/swaprequest", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error(await res.text());
      setSwaps(await res.json());
    } catch (e) {
      Alert.alert("Błąd", "Nie udało się pobrać zgłoszeń zamian.");
    }
    setLoading(false);
  }

  async function cancelSwap(id: string) {
    try {
      const res = await fetch(`http://172.20.10.10:5104/api/swaprequest/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error(await res.text());
      Alert.alert("Anulowano!", "Zgłoszenie zamiany zostało anulowane.");
      fetchSwaps();
    } catch (e) {
      Alert.alert("Błąd", "Nie udało się anulować zamiany.");
    }
  }

  useEffect(() => { fetchSwaps(); }, [token]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Zgłoszenia zamian</Text>
      <FlatList
        data={swaps}
        keyExtractor={item => item.id}
        refreshing={loading}
        onRefresh={fetchSwaps}
        renderItem={({ item }) => (
          <View style={styles.box}>
            <Text>Zmiana pracownika: {item.fromUserId} → {item.toUserId}</Text>
            <Text>Status: {item.status}</Text>
            <Text>Data zgłoszenia: {item.createdAt ? item.createdAt : "-"}</Text>
            {item.status === "Accepted" || item.status === "Pending" ? (
              <Button title="Anuluj zamianę" onPress={() => cancelSwap(item.id)} />
            ) : null}
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ marginTop: 20, textAlign: "center" }}>Brak zgłoszeń zamian</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  box: { marginBottom: 18, padding: 12, borderWidth: 1, borderColor: "#ccc", borderRadius: 8 }
});