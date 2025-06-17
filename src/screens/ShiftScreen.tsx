import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useAuth } from "../AuthContext";

const API_URL = "http://172.20.10.10:5104/api/shift";

export default function ShiftScreen() {
  const { token } = useAuth();
  const [shifts, setShifts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchShifts() {
    setLoading(true);
    try {
      if (!token) throw new Error("Brak zalogowania!");
      const res = await fetch(API_URL, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Błąd serwera");
      const data = await res.json();
      setShifts(data);
    } catch (e) {
      setShifts([]);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchShifts();
  }, [token]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Twój grafik</Text>
      <FlatList
        data={shifts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.shiftBox}>
            <Text>Od: {item.start}</Text>
            <Text>Do: {item.end}</Text>
            <Text>Notatka: {item.note}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: 24 }}>Brak zmian do wyświetlenia</Text>}
        refreshing={loading}
        onRefresh={fetchShifts}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 24 },
  shiftBox: { marginBottom: 16, padding: 12, borderWidth: 1, borderColor: "#ccc", borderRadius: 8 }
});