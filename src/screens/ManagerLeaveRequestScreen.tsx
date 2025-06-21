import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Button, Alert, StyleSheet } from "react-native";
import { useAuth } from "../AuthContext";

function formatDate(d: string | Date) {
  if (!d) return "";
  const date = typeof d === "string" ? new Date(d) : d;
  if (isNaN(date.getTime())) return "";
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

export default function ManagerLeaveRequestScreen() {
  const { token } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchRequests() {
    setLoading(true);
    try {
      if (!token) throw new Error("Brak autoryzacji!");
      const res = await fetch("http://172.20.10.10:5104/api/leaverequest", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setRequests(data);
    } catch (e: any) {
      Alert.alert("Błąd", e.message || "Nie udało się pobrać urlopów.");
    }
    setLoading(false);
  }

  async function handleApprove(id: string) {
    try {
      if (!token) throw new Error("Brak autoryzacji!");
      const res = await fetch(`http://172.20.10.10:5104/api/leaverequest/${id}/approve`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error(await res.text());
      fetchRequests();
    } catch (e: any) {
      Alert.alert("Błąd", e.message);
    }
  }

  async function handleReject(id: string) {
    try {
      if (!token) throw new Error("Brak autoryzacji!");
      const res = await fetch(`http://172.20.10.10:5104/api/leaverequest/${id}/reject`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error(await res.text());
      fetchRequests();
    } catch (e: any) {
      Alert.alert("Błąd", e.message);
    }
  }

  useEffect(() => { fetchRequests(); }, [token]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wnioski urlopowe – zarządzanie</Text>
      <FlatList
        data={requests}
        keyExtractor={(item, idx) => item.Id?.toString() || item.id?.toString() || item._id?.toString() || idx.toString()}
        refreshing={loading}
        onRefresh={fetchRequests}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>Pracownik: {item.UserId || item.userId}</Text>
            <Text>Od: {formatDate(item.Start || item.start)}</Text>
            <Text>Do: {formatDate(item.End || item.end)}</Text>
            <Text>Status: {item.Status || item.status}</Text>
            <Text>Powód: {item.Reason || item.reason}</Text>
            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <Button title="Zatwierdź" onPress={() => handleApprove(item.Id || item.id || item._id)} />
              <View style={{ width: 12 }} />
              <Button title="Odrzuć" color="red" onPress={() => handleReject(item.Id || item.id || item._id)} />
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 24 }}>Brak zgłoszeń urlopowych</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 24, textAlign: "center" },
  card: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, marginBottom: 16 }
});