import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, FlatList, TextInput } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Calendar } from "react-native-calendars";
import { useAuth } from "../AuthContext";

function formatDateString(str?: string | null) {
  if (!str) return "";
  const d = new Date(str);
  return `${d.getDate().toString().padStart(2, "0")}-${(d.getMonth() + 1)
    .toString().padStart(2, "0")}-${d.getFullYear()}`;
}

export default function ManagerShiftScreen() {
  const { token } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [userId, setUserId] = useState<string>("");
  const [start, setStart] = useState<string>(""); // format YYYY-MM-DD
  const [end, setEnd] = useState<string>("");
  const [note, setNote] = useState("");
  const [shifts, setShifts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Pobierz listę użytkowników
  useEffect(() => {
    if (!token) return;
    fetch("http://172.20.10.10:5104/api/user", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setUsers)
      .catch(() => setUsers([]));
  }, [token]);

  // Pobierz istniejące zmiany
  function fetchShifts() {
    if (!token) return;
    setLoading(true);
    fetch("http://172.20.10.10:5104/api/shift", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setShifts)
      .catch(() => setShifts([]))
      .finally(() => setLoading(false));
  }
  useEffect(fetchShifts, [token]);

  async function submitShift() {
    try {
      if (!userId) throw new Error("Wybierz pracownika");
      if (!start || !end) throw new Error("Wybierz daty");
      setLoading(true);

      // Zamiana stringów na daty w backendzie — przekażemy ISO bez czasu
      const res = await fetch("http://172.20.10.10:5104/api/shift", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
          start: new Date(start).toISOString(),
          end: new Date(end).toISOString(),
          note,
        })
      });
      if (!res.ok) throw new Error(await res.text());
      setUserId("");
      setStart("");
      setEnd("");
      setNote("");
      fetchShifts();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Zarządzanie grafikiem</Text>

      <Text style={styles.label}>Pracownik:</Text>
      <Picker
        selectedValue={userId}
        onValueChange={setUserId}
        style={{ marginBottom: 8 }}>
        <Picker.Item label="Wybierz pracownika..." value="" />
        {users.map((u) => (
          <Picker.Item key={u.id} label={`${u.userName} (${u.email})`} value={u.id} />
        ))}
      </Picker>

      <Text style={{ marginTop: 14, fontWeight: "bold" }}>Data rozpoczęcia:</Text>
      <Calendar
        onDayPress={day => setStart(day.dateString)}
        markedDates={start ? { [start]: { selected: true, selectedColor: "#4f8ef7" } } : {}}
      />
      <Text style={{ marginBottom: 8, marginTop: 4 }}>Wybrano: {formatDateString(start)}</Text>

      <Text style={{ fontWeight: "bold" }}>Data zakończenia:</Text>
      <Calendar
        onDayPress={day => setEnd(day.dateString)}
        markedDates={end ? { [end]: { selected: true, selectedColor: "#ff8a65" } } : {}}
      />
      <Text style={{ marginBottom: 12, marginTop: 4 }}>Wybrano: {formatDateString(end)}</Text>

      <TextInput
        placeholder="Notatka (np. godzina, typ zmiany)"
        value={note}
        onChangeText={setNote}
        style={styles.input}
      />

      <Button title={loading ? "Wysyłanie..." : "Dodaj zmianę"} onPress={submitShift} disabled={loading} />

      <Text style={{ marginTop: 30, fontWeight: "bold" }}>Wszystkie zmiany:</Text>
      <FlatList
        data={shifts}
        keyExtractor={item => item.id || item.Id}
        renderItem={({ item }) => (
          <View style={{ marginVertical: 6, padding: 8, borderWidth: 1, borderColor: "#eee", borderRadius: 6 }}>
            <Text>Pracownik: {users.find(u => u.id === item.userId)?.userName || item.userId}</Text>
            <Text>Od: {formatDateString(item.start || item.Start)}</Text>
            <Text>Do: {formatDateString(item.end || item.End)}</Text>
            <Text>Notatka: {item.note || "-"}</Text>
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
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 24 },
  label: { fontWeight: "bold", marginTop: 8 },
  input: { borderWidth: 1, borderColor: "#aaa", borderRadius: 8, marginBottom: 12, padding: 10 }
});